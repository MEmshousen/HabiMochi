## Quick context

- This repository contains a small React-based habit tracker. There are two notable areas: the top-level TypeScript React app (e.g. `App.tsx`, `componets/`, `ui/`) and a Vite example/app in `habimochi/` which includes runnable scripts (`dev`, `build`, `preview`, `lint`). When in doubt, run the `habimochi` app for a predictable dev server.

## What matters to an AI coding agent (concrete, repo-specific)

- Primary UI primitives live under `ui/` (e.g. `ui/button.tsx`, `ui/dialog.tsx`, `ui/tabs.tsx`). These are small, shared building blocks — change them to affect app-wide visuals/behavior.
- The main app state is in `App.tsx`. Habits are stored in localStorage using the key `kawaii-habits`. Look for read/write in `App.tsx` when changing data persistence or shape.
- The top-level components (AddHabitDialog, HabitCard, CalendarView) are in `componets/` (note the misspelling). App imports from `./components/...` while files live in `componets/`. This mismatch is an important discovery: either imports should be updated or the folder renamed. Report any fixes affecting many imports as a repository-wide refactor.
- Icons come from `lucide-react` (root `package.json`) and from the `habimochi` package too — keep changes to icon usage minimal and prefer reusing existing `lucide-react` imports.
- There is no server/backend in the repository. All data flow is client-side (props + localStorage). Don’t introduce API assumptions unless the user asks for backend work.

## Build / run / lint (exact commands discovered here)

- Primary runnable project: `habimochi/` (has scripts). To start locally:

  - Install dependencies and run dev server:
    - `cd habimochi && npm install` (or `pnpm`/`yarn` depending on the contributor)
    - `cd habimochi && npm run dev`

  - Build / preview:
    - `cd habimochi && npm run build`
    - `cd habimochi && npm run preview`

  - Linting:
    - `cd habimochi && npm run lint` (uses ESLint configured in `habimochi/package.json`)

- Note: the top-level `package.json` contains only a dependency entry (lucide-react) and no scripts — prefer `habimochi/` for dev workflows unless the maintainer says otherwise.

## Conventions & patterns to follow

- UI composition: small presentational `ui/*` components are used everywhere. Prefer modifying `ui/*` components for shared UX changes rather than copying behavior into individual pages.
- Local persistence: `localStorage` key `kawaii-habits` is the single source of truth for habits. When changing the schema, update both read (initialization) and write (useEffect) sites in `App.tsx` and consider a lightweight migration path.
- Styling: JSX uses utility-class style names (e.g., `bg-gradient-to-br`, `rounded-2xl`) — the project appears to use Tailwind-like classes. Be conservative when renaming class names; search for usage across `componets/` and `ui/`.
- Small helpers: streak and date calculations live in component logic (see `HabitCard.tsx` and `App.tsx`). When extracting/shared logic, place it under `ui/utils.ts` or a new `lib/` helper and keep logic pure for easier testing.

## Files to check first when making changes (examples)

- `App.tsx` — app state, localStorage key, habit schema, overall layout
- `componets/AddHabitDialog.tsx` — habit creation UI and validation
- `componets/HabitCard.tsx` — streak calculations and toggle behavior
- `componets/CalendarView.tsx` — calendar rendering and month navigation (visualization entrypoint)
- `ui/*` — shared components (buttons, dialogs, cards, tabs)
- `habimochi/package.json` — dev/build/lint scripts and dependencies

## Typical low-risk tasks and where to implement them

- Small UI tweaks (colors, layout spacing): update `ui/*` primitives.
- Changing habit schema (adding fields): update `App.tsx` init + `localStorage` write and adjust `AddHabitDialog` + `HabitCard` to read new fields.
- Adding tests: this project has no test harness. If adding tests, propose a small Jest or Vitest setup and add it under `habimochi/`.

## Edge cases and gotchas for an agent

- The `componets/` vs `components/` spelling mismatch will break imports — do not blindly rename imports without running the dev server or confirming with maintainers.
- No backend exists — do not add API calls unless explicitly requested.
- Date logic is written inline and uses local Date arithmetic (ms since epoch and 86400000). Be careful with timezone changes; prefer normalizing to ISO date strings (yyyy-mm-dd) as the project currently does.

## When you change code, run these quick checks

- Start the dev server (see commands above) and confirm UI loads and localStorage persists changes.
- Run lint: `cd habimochi && npm run lint` and resolve any ESLint issues if your edit changes style rules.

## If you propose larger changes

- Note assumptions (e.g., renaming `componets` → `components`), and flag cross-file edits for manual review.
- Provide a brief migration plan for localStorage schema changes (read old shape, write new shape once, or provide a toggle)

---

If you'd like I will now add this file to `.github/copilot-instructions.md`. Tell me if you want me to preserve any existing text or prefer a different tone/length.
