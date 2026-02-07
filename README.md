# Horse Racing Game — Front-End Test Task

A small SPA that generates horses and a race program, runs a multi-round race simulation with pause/reset, and displays live progress and results. Built as a take-home assignment.

## Links

- **Repository: https://github.com/bIropka/test-horses
- **Live demo: https://test-horses.netlify.app/

## Tech stack

- Vue 3 (Composition API)
- Vuex 4
- Vite
- TypeScript
- Vitest (unit tests)
- Playwright (E2E tests)
- SCSS in SFC (`<style lang="scss">`)
- CI: GitHub Actions
- Deploy: Netlify

## Requirements

- Node.js: `^24.11.1`
- npm

## Setup

```bash
npm ci
```

## Development

```bash
npm run dev
```

## Build & Preview

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev` — start Vite dev server  
- `npm run build` — production build (runs type-check + build-only)  
- `npm run build-only` — Vite build only  
- `npm run preview` — preview production build locally  
- `npm run type-check` — TypeScript type-check via `vue-tsc`  
- `npm run lint` — run all linters  
- `npm run test:unit` — run unit tests (Vitest)  
- `npm run test:e2e` — run E2E tests (Playwright)

## Environment variables

The app supports deterministic runs and a faster mode for CI/E2E.

- `VITE_RNG_SEED` — numeric seed for the pseudo-random generator  
  Same seed ⇒ same race simulation outcomes.
- `VITE_E2E` — if set to `1`, speeds up the simulation (useful for E2E/CI).

Example:

```bash
VITE_RNG_SEED=777 VITE_E2E=1 npm run dev
```

You can also configure these via `.env` / `.env.production`.

## Testing

### Unit tests (Vitest)

```bash
npm run test:unit
```

### E2E tests (Playwright)

Install browsers once (if not installed yet):

```bash
npx playwright install
```

Run E2E:

```bash
npm run test:e2e
```

> In CI it’s common to run only Chromium for speed and stability.

## Project structure (high level)

- `src/app/store/` — Vuex store and modules (horses, schedule, race, ui)
- `src/app/rng/` — seeded RNG and random helpers used by the simulation
- `src/components/sections/` — main UI sections (panels like Program/Horses/Current Race)
- `src/components/ui/` — reusable UI components (Panel/Table/Cells, etc.)
- `src/__tests__/` — unit tests
- `e2e/` — Playwright E2E tests

## CI

A typical CI pipeline runs:
- lint
- type-check
- unit tests
- build
- E2E tests (Chromium)

## Deployment (Netlify)

Recommended Netlify settings:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** `24.11.1` (or compatible with `engines`)

To deploy:
1. Create a new site on Netlify
2. Connect the GitHub repository
3. Use the build settings above
4. Deploy

## Notes / decisions

- The simulation is deterministic via a seeded PRNG to make debugging and testing predictable.
- A dedicated E2E mode (`VITE_E2E=1`) speeds up round execution for faster test runs.
- The UI is split into small, focused components and is driven by data/config where it simplifies the layout.
