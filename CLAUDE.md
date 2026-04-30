# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (localhost:5173)
npm run build     # TypeScript check + Vite production build
npm run preview   # Preview production build locally
npx tsc -b       # TypeScript type check only
```

## Architecture

**AI-Gnosis Pro v6.0** — AI lottery prediction dashboard with Binance/OKX-style dark terminal UI.

### Tech Stack
- React 19 + TypeScript + Vite 6
- Tailwind CSS 4 (CSS-based `@theme` config in `src/index.css`)
- Framer Motion (animations)
- Recharts (metrics charts)
- Lucide React (icons)

### Key Data Flow
1. **Admin** sets excluded zodiac via gear icon → stored in App state
2. **`generatePrediction()`** in `src/lib/zodiacConfig.ts` — deterministic hash (date + excluded zodiac) → selects 4 zodiacs + 6 flat codes
3. All users see identical predictions on the same day (no randomness)

### Core Files
- `src/lib/zodiacConfig.ts` — All data: 12 zodiac mappings, wave colors (红/蓝/绿), big/small, prediction algorithm
- `src/App.tsx` — State machine: `idle → scanning → result`. Manages excluded zodiac and admin panel
- `src/components/ScanningAnimation.tsx` — 5-second terminal-style scan animation
- `src/components/PredictionPanel.tsx` — Results display with colored number balls, wave analysis summary
- `src/components/AdminPanel.tsx` — Hidden settings modal for operator-only zodiac exclusion
- `src/components/Background.tsx` — Canvas-based falling hex digits + CSS grid overlay

### Design System
- Colors defined in `src/index.css` via `@theme`: accent (#02f1a6), card (#1E2329), bg (#0B0E11)
- Lottery wave colors in zodiacConfig: red #F6465D, blue #2B9AFF, green #0ECB81
- Admin-only info (excluded zodiac) must never be visible to end users

### Deployment
- GitHub Pages via Actions (`.github/workflows/deploy.yml`)
- `vite.config.ts` has `base: '/ai-gnosis-pro/'` — must match repo name
- Live at: https://sixgod-agent.github.io/ai-gnosis-pro/

## Important Rules
- **Never show exclusion logic to users** — the admin panel and excluded zodiac info are operator-only
- **Prediction consistency** — algorithm must remain deterministic so all users get identical results
- **Wave color mapping** — must follow standard Hong Kong Mark Six lottery color assignments (RED_NUMBERS, BLUE_NUMBERS sets in zodiacConfig)
