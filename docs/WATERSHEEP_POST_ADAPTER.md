# DonCombo WaterSheep transport: local POST adapter

The TypeScript Combo scorer sends large evidence payloads. The old
`GET http://127.0.0.1:8766/v1/kolmafia?request=...` request can exceed URL
limits and is not the standard WaterSheep API. The normal WaterSheep service
expects **JSON POST /v1/systemone** on port 8766.

## Connection diagram

```text
KoLmafia visitUrl(url, true, true)
  POST request=<percent-encoded JSON> (form body, not query URL)
      -> 127.0.0.1:8767/v1/kolmafia
         local watersheep_post_adapter.py
  POST application/json
      -> 127.0.0.1:8766/v1/systemone
         WaterSheep
```

The adapter never calls KoL, does not mutate game state, refuses requests
outside the shadow-only tile-class contract, does not log payloads, and binds
only to the loopback interface. **No automatic inference retries.**

## Linux setup

In a terminal, first check the process using port 8766:

```sh
ss -ltnp '( sport = :8766 )'
```

Ensure that your usual WaterSheep service is running on port 8766 and
supports `POST /v1/systemone`. With standard WaterSheep that may be:

```sh
watersheep --model samratduttaofficial/WaterSheep --serve
```

In a **second** terminal, run the local form-to-JSON adapter from the
KoLmafia installation after the new release has been deployed:

```sh
python3 "$HOME/.kolmafia/scripts/don_combo/watersheep_post_adapter.py"
```

In a **third** terminal, verify listener status. This makes **no model
request and no game actions**:

```sh
curl --max-time 3 -fsS http://127.0.0.1:8767/health
```

Expected `adapter=ready` and `watersheep_tcp=listening`.
The TCP check only proves that something is listening on port 8766;
it does **not** prove the upstream implements the correct API. Test with
a small one-question JSON POST separately before any paid game run.

`don_combo` will fail closed before executing any beach action if it
cannot complete a valid frozen ranked route. Use read-only diagnostics
before authorizing paid gameplay. This adapter is not a license to retry
unresolved past comb attempts.

## Regression tests

```sh
python3 tests/watersheep-post-adapter.py
node tests/watersheep-transport.mjs
```

These spawn an offline fake upstream on random loopback ports and verify
the translation contract. No WaterSheep model or KoL actions are used.

## Deployment

This file is staged in `mafia/scripts/don_combo`; the repository build
copies it into `release/scripts/don_combo` only after the main-branch
CI/deploy pipeline succeeds. PR #15 is a draft until the transport is
reviewed and the existing baseline lint failures are resolved.
