# Codex Instructions

## Project Goal

Continue improving the Korean sleep-habit MVP for clinic visitors. Preserve the
current core flow:

1. Landing screen
2. Sleep assessment
3. Results and caution signals
4. 7-day habit plan
5. Progress report

## Commands

Use these commands before handing work back:

```bash
npm run build
npm test
npm run lint
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`.

## Implementation Notes

- Main UI lives in `app/page.tsx`.
- Page styling lives in `app/page.module.css`.
- Korean content and clinic-facing copy live in `data/content.ts`.
- Assessment scoring lives in `lib/assessment.ts`.
- Keep generated outputs out of commits. `.gitignore` already excludes common build and local runtime folders.

## Product And Safety Constraints

- Do not present results as a medical diagnosis.
- Do not auto-prescribe treatment.
- Keep urgent caution guidance visible for severe drowsiness, self-harm thoughts,
  and suspected sleep-disordered breathing.
- Preserve Korean copy quality and avoid machine-translated or broken text.
- If adding external medical claims, cite conservative source text in
  `data/content.ts` and keep the user-facing wording cautious.

## Design Constraints

- This is a usable app, not a marketing landing page.
- Keep controls clear on mobile first.
- Use existing lucide-react icons when adding new icon buttons or visual labels.
- Avoid text overflow in compact cards and buttons.
