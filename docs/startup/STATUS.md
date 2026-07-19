# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Phase 1 runtime batches merged and verified:** 3
- **Latest verified runtime commit:** `f4e3ada330fb841ade0333c580376dacaf58ec88`
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Visible product changes approved:** none
- **Major Phase 1 owner audit:** complete in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md)

## Completed runtime batches

### Batch 1 — Route startup guards

PR #100 protected `fresh-home-route-bootstrap.js` and `fresh-home-launch.js`. Final diff: 8 additions, 0 deletions, 3 files. Automated startup/mobile checks passed, and Cody verified the real installed app was normal.

### Batch 2 — Canonical app-shell guard

PR #105 protected `octagon-hq-shell.js`. Final diff: 4 additions, 0 deletions, 2 files. Startup, route, profile, Home/community, Rankings-subview, Picks-lifecycle, War Room, and installed-iPhone checks passed. Squash merge: `d7b47d6fb9ad45b101f67d5658b3e2a874a746c8`.

### Batch 3 — Legacy nav-grid cleanup guard

PR #106 protected `octagon-hq-nav-grid.js` from duplicate file evaluation while preserving its immediate cleanup, five delayed cleanup passes, resize listener, public API, and all navigation presentation.

Final diff:

- 6 additions;
- 0 deletions;
- 2 files.

Validation passed:

- JavaScript syntax;
- startup ownership contract;
- iOS startup route stability;
- profile sign-in startup stability;
- delayed Home/community stability;
- real installed-iPhone cold launch, navigation ordering/sizing, rotation/resize handling, active states, and tap behavior.

PR #106 was squash-merged as `f4e3ada330fb841ade0333c580376dacaf58ec88`. Cody reported the live app was normal.

## Current Phase 1 batch

The next isolated owner is `assets/js/home-dashboard.js`.

This file owns Home rendering and currently creates one closure containing:

- Home click handling;
- daily-game completion handling;
- Home view-change handling;
- feature-ready listeners;
- storage and visibility listeners;
- initial render and delayed official-daily/War Room refresh timers;
- `window.UFC_HOME_DASHBOARD`.

The Phase 1 batch may only add:

- one top-level global duplicate-file-execution marker;
- one matching assertion in `scripts/test-startup-contract.mjs`.

The first execution must remain byte-for-byte equivalent after the marker lines. No Home markup, copy, styling, timing, navigation, game, Picks, War Room, fighter spotlight, or data behavior may change.

## Existing unrelated red checks

1. **Scoring Architecture Guardrails**
   - The scoring contract expects 73 fighters while production contains 80.
   - This is a stale scoring test contract, not a startup regression.

2. **Production Ranking Browser Smoke**
   - The run stops at the fighter-photo path audit before rendered ranking/startup certification.
   - This is outside the startup singleton-guard diffs.

## Exact next action

1. Create a fresh branch from current `main`.
2. Add only the `home-dashboard.js` global marker and its contract assertion.
3. Confirm the diff is limited to those two files with no deletions.
4. Run the Startup Architecture Gate.
5. Keep the PR draft until automated validation passes.
6. Use a controlled live rollout and real installed-iPhone Home verification before starting the next runtime batch.

## Stop conditions

Stop and leave the batch draft if:

- Home markup, card order, copy, buttons, or spotlight content changes;
- daily challenge, Picks, War Room, or fighter-profile navigation changes;
- visibility/resume behavior changes;
- a duplicate Home mount, blank screen, flicker, stale Home, route bounce, or double-handled tap occurs;
- the diff begins changing timers, listener behavior, scoring, fighter data, photos, or product behavior.
