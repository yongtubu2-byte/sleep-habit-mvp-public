# Mac mini Privacy Gateway

The privacy gateway is designed to run continuously on the clinic Mac mini while remaining inaccessible from other devices on the network.

## Install

From the repository root:

```bash
npm ci
bash scripts/macos/install-privacy-gateway.sh
```

Verify:

```bash
curl http://127.0.0.1:8788/health
```

Expected response:

```json
{"ok":true,"service":"kyungokdang-local-privacy-gateway"}
```

## Security properties

- The launcher binds to `127.0.0.1` only.
- The launcher refuses non-loopback host values.
- Request bodies are not logged.
- Raw patient files and re-identification maps are excluded from Git.
- The HTTP service does not call external APIs.
- The redaction core is deterministic and can be augmented by a local model later.
- The generated LaunchAgent file is owner-readable/writable only (`0600`).

The macOS log files contain service startup/error messages only. They should never contain patient request bodies.

## Uninstall

```bash
bash scripts/macos/uninstall-privacy-gateway.sh
```

## Next local integration

The next local-only component should perform:

```text
audio / text
   -> local STT
   -> local named-entity detector
   -> deterministic privacy gateway
   -> residual-risk check
   -> pseudonymous ClinicalCase
   -> Doctor Brief / minimized cloud handoff
```

Do not connect raw transcripts directly to a cloud model.
