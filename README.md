# Sleep Habit MVP

Korean sleep-habit self-check and follow-up logging MVP for a clinic website.
The app helps visitors review recent sleep patterns, identify caution signals,
try a 7-day habit plan, and prepare a simple report for consultation.

## What It Includes

- 1-minute sleep habit assessment with Korean copy
- Risk/caution messaging for sleep apnea, drowsy driving, depression, and self-harm signals
- Personalized habit recommendations based on assessment domains
- 7-day sleep habit tracker stored in browser local storage
- Simple progress report for follow-up consultation
- Evidence-informed Korean medicine treatment explainer cards

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- vinext / Vite
- Tailwind CSS 4 via PostCSS
- lucide-react icons

## Requirements

- Node.js `>=22.13.0`
- npm

## Local Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run build
npm test
npm run lint
```

`npm test` runs the production build first and then checks the rendered loading
skeleton with Node's built-in test runner.

## Project Structure

- `app/`: main app UI, styles, and optional ChatGPT sign-in helpers
- `data/content.ts`: Korean assessment questions, clinic copy, habits, and treatment evidence summaries
- `lib/assessment.ts`: scoring and recommendation logic
- `tests/`: build/render smoke tests
- `.openai/hosting.json`: optional OpenAI Sites binding metadata

## Deployment Notes

The repository is prepared for GitHub-backed Codex Cloud work. No `.env` file is
required for the current MVP. Generated folders such as `node_modules`, `dist`,
`.vinext`, `.wrangler`, and `.next` are intentionally ignored.

## Important Product Notes

This app provides lifestyle education and self-check guidance. It must not claim
to provide a medical diagnosis or automatic treatment prescription. Keep safety
copy visible for urgent symptoms and make clinic consultation language clear.
