# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (localhost:5173)
npm run build     # TypeScript check + Vite production build
npm run preview   # Preview production build locally
npx tsc -b       # TypeScript type check only
```

No test framework is configured. No linter is run on build.

## Architecture

**AI-Gnosis Pro v6.0** — AI lottery prediction dashboard with Binance/OKX-style dark terminal UI, deployed on GitHub Pages.

### Tech Stack
- React 19 + TypeScript + Vite 6
- Tailwind CSS 4 (CSS-based `@theme` config in `src/index.css`)
- Framer Motion (animations)
- Recharts (metrics charts)
- Lucide React (icons)

### Data Pipeline
1. **Source API**: `https://history.macaumarksix.com/history/macaujc2/y/{year}` returns JSON
2. **Fetch script**: `scripts/fetch-history.py` — fetches 2025+2026 data, deduplicates by `expect` field, sorts descending
3. **Output**: `public/history.json` — ~485 records with fields: `expect`, `openTime`, `openCode`, `wave`, `zodiac`
4. **Automation**: `.github/workflows/daily-fetch.yml` runs daily at 21:40 Beijing time (UTC 13:40), 8 minutes after the 21:32 draw. Only commits when data changes. Push triggers `deploy.yml`.

### Key Data Flow
1. **Admin** sets excluded zodiac via gear icon → stored in App state
2. **`generatePrediction()`** in `src/lib/zodiacConfig.ts` — deterministic hash (`dateStr:excludedZodiac`) → selects 4 zodiacs + 6 flat codes
3. All users see identical predictions on the same day (no randomness)
4. **AccuracyPanel** backtests against all `history.json` records using trend-weighted zodiac priority

### Critical Gotcha: Traditional vs Simplified Chinese
The `history.json` records use **Traditional Chinese** zodiac names (豬/雞/馬/龍), while `ZODIAC_MAP` in `zodiacConfig.ts` uses **Simplified** (猪/鸡/马/龙). Code that compares zodiacs from records against `ZODIAC_MAP` must normalize between the two (see `TRADITIONAL_MAP` in `AccuracyPanel.tsx`). The 4 affected zodiacs are: pig, rooster, horse, dragon.

### Core Files
- `src/lib/zodiacConfig.ts` — All static data: 12 zodiac mappings (Simplified CN), wave colors (红/蓝/绿), prediction algorithm, daily poem collection
- `src/App.tsx` — State machine: `idle → scanning → result`. Manages excluded zodiac and admin panel. Layout: MetricsBar → LatestDraw → Scan/Predict → Grid(DrawHistory + AccuracyPanel)
- `src/components/ScanningAnimation.tsx` — 5-second terminal-style scan animation
- `src/components/PredictionPanel.tsx` — Results display with colored number balls, wave analysis summary
- `src/components/AdminPanel.tsx` — Hidden settings modal for operator-only zodiac exclusion
- `src/components/Background.tsx` — Canvas-based falling hex digits + CSS grid overlay
- `src/components/LatestDraw.tsx` — Displays most recent draw from `history.json` with animated colored balls
- `src/components/DrawHistory.tsx` — Paginated table of all draw records with search
- `src/components/AccuracyPanel.tsx` — Backtests predictions with trend-weighted priority. Contains `TRADITIONAL_MAP` for CN character normalization

### Design System
- Colors defined in `src/index.css` via `@theme`: accent (#02f1a6), card (#1E2329), bg (#0B0E11)
- Lottery wave colors in zodiacConfig: red #F6465D, blue #2B9AFF, green #0ECB81
- Wave assignment follows standard Hong Kong Mark Six: `RED_NUMBERS` and `BLUE_NUMBERS` sets, green = remainder

### Deployment
- GitHub Pages via Actions (`.github/workflows/deploy.yml`)
- `vite.config.ts` has `base: '/ai-gnosis-pro/'` — must match repo name
- Live at: https://sixgod-agent.github.io/ai-gnosis-pro/
- Push to `main` triggers both deploy and data fetch workflows

## Important Rules
- **Never show exclusion logic to users** — the admin panel and excluded zodiac info are operator-only
- **Prediction consistency** — algorithm must remain deterministic so all users get identical results
- **Wave color mapping** — must follow standard Hong Kong Mark Six lottery color assignments (RED_NUMBERS, BLUE_NUMBERS sets in zodiacConfig)
- **history.json field types** — `openCode` and `wave` are comma-separated strings (not arrays), `zodiac` uses Traditional Chinese
