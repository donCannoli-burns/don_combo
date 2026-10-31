#!/usr/bin/env python3
"""Offline local POST transport tests; never run KoL or the WaterSheep model."""
import importlib.util
import json
import threading
import unittest
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

source = Path(__file__).resolve().parent.parent / "mafia/scripts/don_combo/watersheep_post_adapter.py"
spec = importlib.util.spec_from_file_location("adapter", source)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

REQUEST = {
    "state": {"mode": "shadow-only; no action authorized"},
    "questions": {"tile_class": {
        "type": "choice",
        "criteria": {key: key for key in "ABCDEF"},
        "instructions": "test",
    }},
}


class Upstream(BaseHTTPRequestHandler):
    seen = []

    def log_message(self, *_args):
        pass

    def do_POST(self):
        length = int(self.headers.get("Content-Length", "0"))
        data = json.loads(self.rfile.read(length))
        self.seen.append((self.path, self.headers.get("Content-Type"), data))
        result = {"answers": {"tile_class": {"probabilities": dict.fromkeys("ABCDEF", 1 / 6)}}}
        body = json.dumps(result).encode()
        self.send_response(200)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


class Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.backend = ThreadingHTTPServer(("127.0.0.1", 0), Upstream)
        cls.adapter = ThreadingHTTPServer(
            ("127.0.0.1", 0), module.make_handler(cls.backend.server_port)
        )
        for server in (cls.backend, cls.adapter):
            threading.Thread(target=server.serve_forever, daemon=True).start()
        cls.url = f"http://127.0.0.1:{cls.adapter.server_port}"

    @classmethod
    def tearDownClass(cls):
        for server in (cls.adapter, cls.backend):
            server.shutdown()
            server.server_close()

    def test_private_listen_hosts_validation(self):
        self.assertEqual(module.validate_listen_hosts([]), ["127.0.0.1"])
        self.assertEqual(
            module.validate_listen_hosts(["127.0.0.1", "172.29.0.1"]),
            ["127.0.0.1", "172.29.0.1"],
        )
        for invalid in (
            ["0.0.0.0"], ["8.8.8.8"], ["169.254.1.1"],
            ["127.0.0.2"], ["localhost"], ["::1"],
            ["127.0.0.1", "127.0.0.1"],
        ):
            with self.subTest(invalid=invalid), self.assertRaises(ValueError):
                module.validate_listen_hosts(invalid)

    def test_health_never_infers(self):
        Upstream.seen.clear()
        with urllib.request.urlopen(self.url + "/health") as response:
            health = json.loads(response.read())
        self.assertEqual(health["adapter"], "ready")
        self.assertEqual(health["watersheep_tcp"], "listening")
        self.assertEqual(health["game_actions"], False)
        self.assertEqual(Upstream.seen, [])

    def test_koL_form_to_json_post(self):
        Upstream.seen.clear()
        body = urllib.parse.urlencode({"request": json.dumps(REQUEST)}).encode()
        request = urllib.request.Request(
            self.url + "/v1/kolmafia", data=body,
            headers={"Content-Type": "application/x-www-form-urlencoded"}, method="POST"
        )
        with urllib.request.urlopen(request) as response:
            result = json.loads(response.read())
        self.assertEqual(result["answers"]["tile_class"]["probabilities"]["A"], 1 / 6)
        self.assertEqual(len(Upstream.seen), 1)
        path, content_type, payload = Upstream.seen[0]
        self.assertEqual(path, "/v1/systemone")
        self.assertEqual(content_type, "application/json")
        self.assertEqual(payload, REQUEST)

    def test_reject_old_get_and_malformed_post(self):
        for suffix in ("/v1/kolmafia?request=large", "/unknown"):
            with self.assertRaises(urllib.error.HTTPError) as exception:
                urllib.request.urlopen(self.url + suffix)
            self.assertEqual(exception.exception.code, 404)
        for invalid in ("invalid", json.dumps({"state": {}})):
            body = urllib.parse.urlencode({"request": invalid}).encode()
            req = urllib.request.Request(
                self.url + "/v1/kolmafia", data=body,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            with self.assertRaises(urllib.error.HTTPError) as exception:
                urllib.request.urlopen(req)
            self.assertEqual(exception.exception.code, 400)

    def test_reject_oversized_body(self):
        req = urllib.request.Request(
            self.url + "/v1/kolmafia",
            data=b"a" * (module.MAX_BODY + 1),
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        with self.assertRaises(urllib.error.HTTPError) as exception:
            urllib.request.urlopen(req)
        self.assertEqual(exception.exception.code, 413)


if __name__ == "__main__":
    unittest.main(verbosity=2)
