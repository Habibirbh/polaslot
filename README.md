# PolaSlot — polaslot.fun

AI sports prediction & interactive matchup slot for the HawkeyeReport community.

## Stack
Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · Clerk · OpenAI (Images + Chat)

## Run locally
```bash
npm install
npm run dev
```

## Environment (`.env.local`)
| Var | Required | Notes |
| --- | --- | --- |
| `OPENAI_API_KEY` | for AI features | Without it, posters use the SVG studio renderer and insights use the built-in model |
| `OPENAI_IMAGE_MODEL` | no | Default `dall-e-3`; automatically retries with `gpt-image-1` if unavailable |
| `OPENAI_INSIGHT_MODEL` | no | Default `gpt-4o-mini` (tactical insight sentence on each spin) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | no | Leave blank to use the mock demo session |

## Structure
- `app/page.tsx` — landing (hero, slot, poster lab, beat digest)
- `app/{slot,poster,digest}` — dedicated pages
- `app/api/predict` — scores a reel combo (`lib/predict.ts`) + optional AI insight
- `app/api/generate-poster` — OpenAI image generation; returns `{ fallback: true }` on any failure
- `lib/poster-svg.ts` — 4-style SVG collectible renderer used as the fallback (and live preview)
- `lib/data.ts` — reel items, rivals, beat feed seed data, power ratings

## Notes
- Probabilities come from a deterministic heuristic model (unit strength × scenario base rate × opponent strength × home field), not live odds.
- Beat Digest, AI insight pills are seed data in `lib/data.ts` — wire to a real feed when ready.
- For entertainment/analysis only; not betting advice.
