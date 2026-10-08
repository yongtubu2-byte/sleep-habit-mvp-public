# Kyungokdang Clinical Foundation

This branch is the first technical foundation for a local-first clinical workflow.

## Architecture

1. **Local Mac mini privacy zone**
   - Original audio, transcript, patient identifiers, and re-identification maps stay local.
   - Local STT and local models may be used here.
   - Deterministic redaction runs before any cloud-facing handoff.
2. **Pseudonymized clinical layer**
   - Cases use non-identifying `CASE-*` identifiers.
   - Longitudinal data is stored as structured checkpoints.
3. **Doctor-assist layer**
   - Summarizes changes, missing questions, and safety flags.
   - Does not diagnose or prescribe.
4. **Kyungokdang OS UI**
   - Sleep and healthy-aging modules can consume the same schema.

## First sprint

### Privacy Gateway
Core: `lib/privacy/redact.mjs`

The deterministic layer removes direct identifiers and flags possible indirect identifiers for manual review. A local LLM may be added later for Korean named-entity detection, but no cloud endpoint should ever receive raw patient text.

### Clinical Schema
Core: `lib/clinical/schema.ts`

The schema is designed around repeated checkpoints (baseline, 2w, 4w, 8w, 12w). It currently covers sleep and healthy-aging domains and can be extended without coupling to a specific AI provider.

### Doctor Brief
Core: `lib/clinical/doctorBrief.ts`

The first version is deterministic so that clinical changes are traceable to stored values. A model can later rewrite the brief for readability after pseudonymization.

## Development rules

- Only synthetic fixtures are committed.
- No raw patient text, audio, screenshots, exports, or identifier maps in Git.
- Local re-identification maps must be encrypted and stored outside the repository.
- Cloud AI receives pseudonymized data only.
- Any AI-generated interpretation must show uncertainty and missing data.
- No automatic diagnosis or herbal prescription.

## Brand/IP direction

The clinical system should support a coherent specialty narrative:
- long-standing geriatric-medicine study and translation work,
- sleep-health translation and education,
- real-world longitudinal sleep and healthy-aging care,
- outcome data and reusable clinical workflows.

The software is intended to operationalize that clinical model rather than act as a generic AI chatbot.
