# Paddle Roster – Plan

## Scope (updated)

- **Game modes**: **Singles** (2 per court) and **Doubles** (4 per court).
- **Courts**: 1 or 2.
- **Players**: e.g. 4–16 (singles: 2–4 per court; doubles: 8–16 with 2 courts).
- **MVP**: Session setup → Live rotation → Fairness summary. Client-side only, no backend.

## Tech stack

- **React** + **Vite** + **Tailwind CSS**
- State: React state + localStorage for “last session” / persistence
- Static build; deploy anywhere (Vercel, Netlify, etc.)

## Plans

- [x] Project scaffold (Vite + React + Tailwind)
- [x] Session setup screen: courts, duration, match duration, **singles/doubles**, player names (paste supported)
- [x] Rotation engine: supports both modes (2 per court vs 4 per court), greedy fairness, minimal repeat pairings
- [x] Live session screen: big layout, “Next round”, who’s playing / resting
- [x] End-of-session fairness metrics (games played, rest rounds)
- [x] Copy from last session (localStorage)
- [ ] Shareable session via URL (encode config + names in query)
- [ ] Optional round timer; high-contrast tweaks; PWA later

## Completed

- [x] plan.md created; scope updated with singles/doubles
- [x] Vite + React + Tailwind scaffold; `npm install` runs
- [x] Session setup: game mode (singles/doubles), courts, session/match duration, player textarea (paste supported), “Load last session”
- [x] `src/lib/rotation.js`: parsePlayerNames, buildRounds (greedy), fairnessStats
- [x] Live session: round-by-round view, courts + resting, “Next round” / “Finish session”
- [x] Summary screen: table of games + rest per player; “New session” back to setup

## Future work

- Expense splitting (Phase 2)
- Persistent groups / saved groups
- Player ranking or level balancing
- “Winners stay / losers rotate” as an optional mode
- Export session as image (e.g. for WhatsApp)
- QR-based session join
- PWA installable + offline
- Dark mode
- Late joiner / drop-out during session
