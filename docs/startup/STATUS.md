# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Phase 1 runtime batches merged and verified:** 2
- **Latest verified runtime commit:** `d7b47d6fb9ad45b101f67d5658b3e2a874a746c8`
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Visible product changes approved:** none
- **Major Phase 1 owner audit:** complete in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md)

## Completed runtime batches

### Batch 1 — Route startup guards

PR #100 protected:

- `assets/js/fresh-home-route-bootstrap.js`;
- `assets/js/fresh-home-launch.js`;
- their startup-contract assertions.

Final diff: 8 additions, 0 deletions, 3 files. Automated startup/mobile checks passed, and Cody verified the real installed iPhone app looked and behaved normally after deployment.

### Batch 2 — Canonical app-shell guard

PR #105 protected `assets/js/octagon-hq-shell.js` from entire-file duplicate evaluation and added one startup-contract assertion.

Final diff:

- 4 additions;
- 0 deletions;
- 2 files;
- no route rules, timing, labels, view selection, styles, data, or product behavior changed.

Validation passed:

- JavaScript syntax;
- startup ownership contract;
- iOS startup route stability;
- profile sign-in startup stability;
- delayed Home/community stability;
- real installed-iPhone navigation, Rankings subviews, Picks lifecycle, War Room state, and presentation.

PR #105 was squash-merged as `d7b47d6fb9ad45b101f67d5658b3e2a874a746c8` and Cody reported the live app was normal.

## Current Phase 1 batch

The next isolated owner is `assets/js/octagon-hq-nav-grid.js`.

This file is a legacy navigation-grid cleanup layer. It currently:

- clears old inline grid styles immediately;
- repeats that cleanup through five delayed timeouts;
- repeats it on window resize;
- exposes `window.UFC_OCTAGON_HQ_NAV_GRID`.

The Phase 1 batch may only add:

- one top-level global duplicate-file-execution marker;
- one matching assertion in `scripts/test-startup-contract.mjs`.

The timeouts and resize repair behavior must remain unchanged in this phase. Their removal or consolidation belongs to Phase 3 after source behavior has regression coverage.

## Existing unrelated red checks

1. **Scoring Architecture Guardrails**
   - The scoring contract expects 73 fighters while production contains 80.
   - This is a stale scoring test contract, not a startup regression.

2. **Production Ranking Browser Smoke**
   - The run stops at the fighter-photo path audit before rendered ranking/startup certification.
   - This is outside the startup singleton-guard diffs.

## Exact next action

1. Create a fresh branch from current `main`.
2. Add only the `octagon-hq-nav-grid.js` global marker and its contract assertion.
3. Confirm the diff is limited to those two files with no deletions.
4. Run the Startup Architecture Gate.
5. Keep the PR draft until automated validation passes.
6. Because the file touches navigation presentation and resize behavior, use a controlled live rollout and real installed-iPhone verification before starting the next runtime batch.

## Stop conditions

Stop and leave the batch draft if:

- visible navigation presentation changes;
- tab ordering or sizing changes;
- resize behavior changes;
- a duplicate navigation shell, blank screen, flicker, route bounce, or double-handled tap occurs;
- the diff begins changing timeout values, cleanup logic, styling rules, scoring, fighter data, photos, or product behavior.