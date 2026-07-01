# Modular Refactor V2 Plan

Branch: `modular-refactor-v2-safe`
Base: restored full app experience from `main` commit `0c69ffbbef3d5552de93d88068c220a93fc824d3`.

## Goal

Make the app easier to update without changing the visual/product experience.

The live app should keep the existing UFC/2K-style feel:

- P4P / Women Only / By Division / Compare / Rules tabs
- fighter photos
- ranking cards with category cards
- full fighter profile drawer/page
- category explainers
- resume snapshot
- opponent and round-control tables
- natural Compare Mode copy

## Safety rules

1. Do not change `main` during this refactor.
2. Do not replace the live app shell with a simplified version.
3. Each phase must preserve the existing UI before moving to the next phase.
4. First extract data, then compare data, then styles/scripts.
5. If a phase changes the visible product unexpectedly, revert that phase only.

## Phase 1: data extraction only

Keep `index.html` visually and structurally the same.

Extract only the fighter/ranking data into:

- `assets/data/fighters.js`

Then load it in a way that preserves the current `window.RANKING_DATA` shape.

Acceptance check:

- Leaderboard still looks identical.
- Fighter profile pages still look identical.
- Photos still work.
- Categories, snapshot, tables, and drawer still work.

## Phase 2: compare extraction

Extract compare-only objects into:

- `assets/data/compare-profiles.js`
- `assets/data/fight-ledger.js`

Acceptance check:

- Compare tab still uses the same natural debate layout.
- Direct fight/rivalry context still works.
- No category-by-category comparison table returns.

## Phase 3: styling extraction

Move CSS out to:

- `assets/css/styles.css`

Acceptance check:

- Mobile screenshots match the old UI closely.
- No horizontal overflow.
- Header, ranking cards, fighter profile, and compare mode match current design.

## Phase 4: app logic extraction

Move JavaScript rendering logic out to:

- `assets/js/app.js`

Acceptance check:

- `index.html` becomes mostly shell.
- The visible app is still the same product.
- Future fighter changes no longer require editing the HTML shell.

## Current status

Branch created and protected from live `main`.
No visual changes should be shipped from this branch until Cody confirms screenshots match the original app.
