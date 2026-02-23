# SmashRoster – Plan

## Scope (updated)

- **App name**: **SmashRoster** (renamed from Paddle Roster)
- **Game modes**: **Singles** (2 per court) and **Doubles** (4 per court)
- **Sport**: Badminton (default); Pickleball support added
- **Court**: 1 court only (vertical orientation)
- **Players**: 4–16 (singles: 2 per match; doubles: 4 per match)
- **PWA**: Installable, offline-first, shareable via URL
- **MVP**: Session setup → Live rotation → Fairness summary → Continue session

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
- [ ] Shareable session via URL (encode config + names in query); high-contrast tweaks; PWA later

## Completed

- [x] plan.md created; scope updated with singles/doubles
- [x] Vite + React + Tailwind scaffold; `npm install` runs
- [x] Session setup: game mode (singles/doubles), courts, session/match duration, player textarea (paste supported), “Load last session”
- [x] `src/lib/rotation.js`: parsePlayerNames, buildRounds (greedy), fairnessStats
- [x] Live session: round-by-round view, courts + resting, “Next round” / “Finish session”
- [x] Summary screen: table of games + rest per player; “New session” back to setup

- [x] Live session: horizontal scroll list of all rounds; colour-coded (current = in progress, past = done, future = upcoming); snap scroll; current round scrolls into view
- [x] Timer removed. On-demand “Add round” when time allows (≥15 min left); buildNextRound() in rotation.js
- [x] Denser phone layout: session info bar (round X of Y, ~time left), compact “Fairness so far” (games·rest per player), smaller round cards
- [x] Single court only: removed court selector from setup; config always courts: 1
- [x] Slides-style rounds: one round per slide; dots to jump; prev/next arrows; mature styling
- [x] Court view: paddle court rectangle with net; team A (top), team B (bottom); resting players “Sitting out” below court

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
- [x] **Renamed to SmashRoster**; complete UI redesign with dark gradient background, glassmorphism, emerald accent
- [x] Smooth animations: slide transitions (swipe), fade-in, scale-in, staggered delays
- [x] Court: gradient emerald/teal with white net, player cards with backdrop blur and shadows


## Latest updates (PWA + visual redesign)

- [x] **PWA configured**: vite-plugin-pwa with service worker, manifest, badminton icon (192/512)
- [x] **Shareable URL**: Session encoded in URL query params; share button (native share or clipboard)
- [x] **Marvel avatars**: 20 superhero emoji icons auto-assigned to players; shown on court and fairness
- [x] **Empty + tab**: Swipe right past last round to reach add-round tab; big + button in center
- [x] **Header hidden in live**: More vertical space for court during active session
- [x] **Continue session**: From summary, if time left (≥15 min), button to go back to live and add more rounds
- [x] **Court orientation**: Vertical (9:16 aspect) with horizontal net like a real badminton court
- [x] **Visual polish**: Dark gradient bg, glassmorphism cards, emerald accents, smooth animations (slide/fade/scale)

