# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Phase 1 runtime batches merged and verified:** 3
- **Latest verified runtime commit:** `f4e3ada330fb841ade0333c580376dacaf58ec88`
- **Current runtime PR:** [#107 — Guard Home dashboard against duplicate execution](https://github.com/codyking0602/ufc-goat-rankings/pull/107)
- **Tested PR head:** `da46ec9c3bd946b1e0d8e91ea341b32d4a84e83c`
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

Final diff: 6 additions, 0 deletions, 2 files.

JavaScript syntax, startup ownership, iOS route stability, profile sign-in, delayed Home/community, and real installed-iPhone navigation/rotation/tap checks passed. PR #106 was squash-merged as `f4e3ada330fb841ade0333c580376dacaf58ec88`. Cody reported the live app was normal.

## Current Phase 1 batch — Ready for physical gate

Draft PR #107 protects `assets/js/home-dashboard.js` from duplicate file evaluation.

Exact diff:

- 3-line top-level global duplicate-file-execution marker in `home-dashboard.js`;
- one matching assertion in `scripts/test-startup-contract.mjs`;
- 6 additions;
- 0 deletions;
- 2 files.

No Home markup, copy, styling, timer value, listener body, navigation, daily challenge, Picks, War Room, fighter spotlight, data, scoring, or public API behavior changed.

Startup Architecture Gate run #13 passed on tested head `da46ec9c3bd946b1e0d8e91ea341b32d4a84e83c`:

- JavaScript syntax;
- startup ownership contract;
- iOS startup route stability;
- profile sign-in startup stability;
- delayed Home/community stability.

## Existing unrelated red checks

1. **Scoring Architecture Guardrails**
   - The scoring contract expects 73 fighters while production contains 80.
   - This is a stale scoring test contract, not a startup regression.

2. **Production Ranking Browser Smoke**
   - The run stops at the fighter-photo path audit before rendered ranking/startup certification.
   - This is outside the startup singleton-guard diffs.

## Exact next action — Cody's iPhone required

1. Bring this documentation-only status commit into PR #107 without changing its runtime comparison.
2. Rerun the Startup Architecture Gate on the current branch head.
3. Merge only the exact six-addition runtime diff through a controlled live rollout.
4. On the real installed app, verify Home cold launch, card order/content, daily challenge button, Picks button/progress, War Room button/state, fighter spotlight/profile opening, background/resume, and return-to-Home behavior.
5. Begin the next runtime batch only after Cody reports the live Home screen is normal.

## Stop conditions

Stop and leave PR #107 draft if:

- Home markup, card order, copy, buttons, or spotlight content changes;
- daily challenge, Picks, War Room, or fighter-profile navigation changes;
- visibility/resume behavior changes;
- a duplicate Home mount, blank screen, flicker, stale Home, route bounce, or double-handled tap occurs;
- the diff begins changing timers, listener behavior, scoring, fighter data, photos, or product behavior.
