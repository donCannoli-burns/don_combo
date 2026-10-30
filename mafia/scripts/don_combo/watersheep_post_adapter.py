#!/usr/bin/env python3
"""Loopback-only bridge: KoLmafia POST form -> WaterSheep POST JSON.

KoLmafia visit_url(..., true, true) sends encoded request= as form data.
WaterSheep accepts JSON at POST /v1/systemone.
No KoL requests, game actions, or remote hosts are used.
"""
from __future__ import annotations

import argparse
import json
import socket
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

MAX_BODY = 262_144
MAX_REPLY = 262_144


def validate_payload(value: object) -> dict:
    if not isinstance(value, dict):
        raise ValueError("request must be a JSON object")
    state = value.get("state")
    questions = value.get("questions")
    if not isinstance(state, dict) or state.get("mode") != "shadow-only; no action authorized":
        raise ValueError("shadow-only state is required")
    if not isinstance(questions, dict) or list(questions.keys()) != ["tile_class"]:
        raise ValueError("exactly one tile_class question is required")
    classification = questions["tile_class"]
    if not isinstance(classification, dict) or classification.get("type") != "choice":
        raise ValueError("tile_class must be a choice question")
    criteria = classification.get("criteria")
    if not isinstance(criteria, dict) or set(criteria) != set("ABCDEF"):
        raise ValueError("tile_class criteria must be A through F")
    return value


def make_handler(watersheep_port: int):
    class Handler(BaseHTTPRequestHandler):
        server_version = "DonComboWaterSheepBridge/1.0"

        def log_message(self, _format: str, *_args: object) -> None:
            # Never log request evidence, URLs, or model output.
            pass

        def send_json(self, status: int, payload: dict) -> None:
            body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            try:
                self.wfile.write(body)
            except (BrokenPipeError, ConnectionResetError):
                pass

        def do_GET(self) -> None:
            if self.path != "/health":
                self.send_json(404, {"error": "not_found"})
                return
            try:
                with socket.create_connection(("127.0.0.1", watersheep_port), timeout=0.5):
                    upstream = "listening"
            except OSError:
                upstream = "unreachable"
            self.send_json(200, {"adapter": "ready", "watersheep_tcp": upstream, "game_actions": False})

        def do_POST(self) -> None:
            parsed_url = urllib.parse.urlsplit(self.path)
            if parsed_url.path != "/v1/kolmafia" or parsed_url.query:
                self.send_json(404, {"error": "post_form_to_v1_kolmafia_required"})
                return
            if self.headers.get("Content-Type", "").split(";", 1)[0].strip().lower() != "application/x-www-form-urlencoded":
                self.send_json(415, {"error": "expected_form_body"})
                return
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                length = 0
            if length < 1 or length > MAX_BODY:
                self.send_json(413, {"error": "invalid_or_oversized_request"})
                return
            try:
                form = urllib.parse.parse_qs(
                    self.rfile.read(length).decode("utf-8"),
                    keep_blank_values=True,
                    strict_parsing=True,
                )
                if set(form) != {"request"} or len(form["request"]) != 1:
                    raise ValueError("one request field required")
                request = validate_payload(json.loads(form["request"][0]))
                data = json.dumps(request, separators=(",", ":")).encode("utf-8")
                if len(data) > MAX_BODY:
                    raise ValueError("request too large")
            except (ValueError, UnicodeDecodeError, json.JSONDecodeError) as exc:
                self.send_json(400, {"error": f"invalid_shadow_payload: {str(exc)[:110]}"})
                return
            upstream = urllib.request.Request(
                f"http://127.0.0.1:{watersheep_port}/v1/systemone",
                data=data,
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            try:
                with urllib.request.urlopen(upstream, timeout=30) as response:
                    reply = response.read(MAX_REPLY + 1)
                if len(reply) > MAX_REPLY:
                    raise ValueError("upstream_response_too_large")
                result = json.loads(reply)
                if not isinstance(result, dict):
                    raise ValueError("upstream_response_not_object")
            except urllib.error.HTTPError as exc:
                self.send_json(502, {"error": f"watersheep_http_{exc.code}"})
                return
            except (OSError, TimeoutError, ValueError, json.JSONDecodeError) as exc:
                self.send_json(502, {"error": f"watersheep_failure: {type(exc).__name__}"})
                return
            self.send_json(200, result)

    return Handler


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--listen-port", type=int, default=8767)
    parser.add_argument("--watersheep-port", type=int, default=8766)
    args = parser.parse_args()
    if not (1024 <= args.listen_port <= 65535 and 1024 <= args.watersheep_port <= 65535):
        parser.error("ports must be between 1024 and 65535")
    if args.listen_port == args.watersheep_port:
        parser.error("listen and upstream ports must differ")
    server = ThreadingHTTPServer(("127.0.0.1", args.listen_port), make_handler(args.watersheep_port))
    print(f"don_combo WaterSheep adapter: 127.0.0.1:{args.listen_port} -> 127.0.0.1:{args.watersheep_port} (JSON POST)", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
