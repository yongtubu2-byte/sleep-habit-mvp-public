# Codex Instructions

## Project Goal

Continue improving the Korean sleep-habit MVP into a Kyungokdang clinical module while preserving the current visitor flow:

1. Landing screen
2. Sleep assessment
3. Results and caution signals
4. 7-day habit plan
5. Progress report

The broader direction is a local-first Kyungokdang OS for sleep and healthy-aging care.

## Commands

Use these commands before handing work back:

```bash
npm run build
npm test
npm run lint
```

Run the local privacy gateway on the Mac mini with:

```bash
npm run privacy:local
```

The gateway must remain bound to loopback only.

## Implementation Notes

- Main public UI lives in `app/page.tsx`.
- Page styling lives in `app/page.module.css`.
- Korean content and clinic-facing copy live in `data/content.ts`.
- Assessment scoring lives in `lib/assessment.ts`.
- Longitudinal clinical types live in `lib/clinical/schema.ts`.
- Doctor pre-visit summaries live in `lib/clinical/doctorBrief.ts`.
- Local identifier removal lives under `lib/privacy/`.
- `app/clinical-demo/page.tsx` is synthetic-only and must remain opt-in.
- Keep generated outputs out of commits.

## Clinical Data Rules

1. Never use real patient data for development, examples, screenshots, or tests.
2. Use synthetic fixtures only in Git.
3. Never commit patient records, raw audio, transcripts, exports, screenshots, or re-identification maps.
4. Never log raw clinical request bodies.
5. Raw patient data must remain inside the local Mac mini privacy zone.
6. Cloud-facing services receive pseudonymized case IDs and minimized clinical fields only.
7. Re-identification maps remain local, encrypted, and outside the repository.
8. Do not add external analytics, telemetry, or error-reporting that may capture clinical payloads without an explicit privacy review.
9. Treat indirect identifiers as potentially re-identifying; flag them for review instead of assuming de-identification.
10. Network access from the privacy gateway is not required and should not be added by default.

## Product And Safety Constraints

- Do not present results as a medical diagnosis.
- Do not auto-prescribe treatment or herbal formulas.
- Keep urgent caution guidance visible for severe drowsiness, self-harm thoughts, and suspected sleep-disordered breathing.
- Preserve Korean copy quality and avoid machine-translated or broken text.
- If adding external medical claims, cite conservative source text in `data/content.ts` and keep the user-facing wording cautious.
- Doctor Brief should summarize traceable facts, changes, missing questions, and caution signals. It should not replace clinician judgment.

## Design Constraints

- This is a usable clinical workflow, not a generic AI chatbot or marketing landing page.
- Keep controls clear on mobile first.
- Use existing lucide-react icons when adding new icon buttons or visual labels.
- Avoid text overflow in compact cards and buttons.
- Prefer progressive disclosure: show the task the user selected rather than every OS feature at once.
