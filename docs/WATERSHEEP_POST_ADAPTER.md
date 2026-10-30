# DonCombo WaterSheep POST transport

DonCombo's old GET request puts a large percent-encoded JSON payload in a
`/v1/kolmafia?request=...` URL. The request is much larger than ordinary
HTTP GETs. The new bridge moves that value into an encoded POST form body,
then forwards the JSON object to the native WaterSheep service.

## Three independent local services

```text
KoLmafia / DonCombo
  POST form request=<encoded JSON>
      -> 127.0.0.1:8768/v1/kolmafia
         DonCombo POST adapter (Python)
  POST application/json
      -> 127.0.0.1:8766/v1/systemone
         Native WaterSheep (CPU model)

OpenCode
  OpenAI-compatible requests
      -> 127.0.0.1:8767/v1/chat/completions
         watersheep-open OpenCode adapter
  Native scoring requests
      -> 127.0.0.1:8766/v1/decisions
         SAME native WaterSheep backend
```

**Do not point the DonCombo adapter at 8767.** That service is the OpenCode
compatibility adapter, not the native WaterSheep inference API. Since it
forwards to 8766, a 8766 -> 8767 adapter could produce a routing loop.
Do not stop or replace OpenCode's existing listener.

## Start/inspect native WaterSheep

Check listeners without any game or model request:

```sh
ss -ltnp '( sport = :8766 or sport = :8767 or sport = :8768 )'
```

If port 8766 is unused, start native WaterSheep in its own terminal with
the locally installed CLI, for example:

```sh
~/anaconda3/bin/watersheep --model samratduttaofficial/WaterSheep --device cpu --serve 8766
```

The expected startup text names `http://127.0.0.1:8766/v1/decisions`.
Both `POST /v1/decisions` and `POST /v1/systemone` belong to the
native server. Verify one tiny structured shadow-only request before
using the route scorer; do not substitute a GET /health result.

After PR deployment, start the KoLmafia adapter in another terminal:

```sh
python3 "$HOME/.kolmafia/scripts/don_combo/watersheep_post_adapter.py"
```

Its defaults are listen port **8768** and upstream WaterSheep port **8766**.
The adapter only binds to `127.0.0.1`. A status GET doesn't run inference:

```sh
curl --max-time 3 -fsS http://127.0.0.1:8768/health
```

Expect `adapter=ready`, `watersheep_tcp=listening`, and
`game_actions=false`. TCP readiness alone does not prove WaterSheep
responds correctly to a structured question.

## Scope and guards

- The adapter rejects requests outside the `shadow-only; no action authorized`
  mode with one `tile_class` choice question using classes A–F.
- The adapter makes no KoL requests and logs no prediction payloads.
- No automatic HTTP retries, no conversion of arbitrary OpenAI text to
  probability mass, no game action permissions.
- Combo refuses to start an incompletely scored WaterSheep route.
- A native Beach Comb attempt with uncertain outcome must never be
  silently replayed.

## Offline regressions

```sh
python3 tests/watersheep-post-adapter.py
node tests/watersheep-transport.mjs
```

The Python tests use a fake backend on random loopback ports and never
contact the model or Kingdom of Loathing.

PR #15 remains a draft until CI, local inference compatibility, and the
existing baseline lint blockers are addressed. It has not changed the
installed KoLmafia release.
