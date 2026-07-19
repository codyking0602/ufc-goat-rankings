# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Phase 1 runtime batches merged and verified:** 5
- **Latest verified runtime commit:** `6b0c9442b5a4df46e481296bb8d5cbd3befe1ab7`
- **Estimated entire cleanup progress:** approximately 24%
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Visible product changes approved:** none
- **Major Phase 1 owner audit:** complete in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md)
- **Recommended session state:** start a fresh chat before batch 6; this file is the handoff source of truth

## Completed runtime batches

### Batch 1 — Route startup guards

PR #100 protected `fresh-home-route-bootstrap.js` and `fresh-home-launch.js`. Final diff: 8 additions, 0 deletions, 3 files. Automated startup/mobile checks passed, and Cody verified the real installed app was normal.

### Batch 2 — Canonical app-shell guard

PR #105 protected `octagon-hq-shell.js`. Final diff: 4 additions, 0 deletions, 2 files. Startup, route, profile, Home/community, Rankings-subview, Picks-lifecycle, War Room, and installed-iPhone checks passed. Squash merge: `d7b47d6fb9ad45b101f67d5658b3e2a874a746c8`.

### Batch 3 — Legacy nav-grid cleanup guard

PR #106 protected `octagon-hq-nav-grid.js` while preserving its cleanup timers, resize listener, API, and navigation presentation. Final diff: 6 additions, 0 deletions, 2 files. Automated checks and real installed-iPhone navigation/rotation/tap verification passed. Squash merge: `f4e3ada330fb841ade0333c580376dacaf58ec88`.

### Batch 4 — Home dashboard guard

PR #107 protected `home-dashboard.js` from duplicate file evaluation while preserving Home markup, card order, copy, styles, timers, listeners, daily challenge, Picks, War Room, fighter spotlight, and public API behavior.

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
- real installed-iPhone Home cold launch, card presentation, daily challenge, Picks, War Room, fighter spotlight, background/resume, and return-to-Home behavior.

PR #107 was squash-merged as `7fd6ede029cc307932cb38bc2c9274484b18f403`. Cody reported the live app was normal.

### Batch 5 — Native shell stability repair guard

PR #108 protected `native-app-shell-stability.js` from duplicate file evaluation while preserving its public `schedule()` retry API, MutationObserver, click listener, readiness listeners, delayed repair passes, profile snapshot repair, Home spotlight repair, NEW-button normalization, drawer synchronization, and first-run behavior.

The prerequisite/retry inspection confirmed that the file does not exit early on missing DOM or data. Required later repair attempts already run through `schedule()` and the existing event/timer paths, so the top-level marker blocks only accidental duplicate ownership.

Final diff:

- 4 additions;
- 0 deletions;
- 2 files.

Validation passed:

- JavaScript syntax;
- startup ownership contract;
- iOS startup route stability;
- profile sign-in startup stability;
- delayed Home/community stability;
- real installed-iPhone cold launch, Home/profile/header repair behavior, bottom-navigation/touch behavior, background/resume, and return-to-Home behavior.

PR #108 was squash-merged as `6b0c9442b5a4df46e481296bb8d5cbd3befe1ab7`. Cody reported the live app was normal.

Removal or consolidation of this temporary repair layer remains deferred to Phase 3 after source behavior has dedicated regression coverage.

## Next Phase 1 batch

The next isolated owner is `assets/js/app-notification-center.js`.

This is the intended canonical notification owner and is mobile-sensitive. The next session must inspect its exact current execution path, including service-worker registration, profile-surface setup, closure-scoped `state.started`, observers, listeners, and whether any second file execution currently acts as an accidental prerequisite retry.

The allowed runtime scope is expected to be one duplicate-file marker plus one startup-contract assertion only if current `main` confirms that first-run and retry behavior remain intact. Notification rendering, permission behavior, profile surfaces, service-worker behavior, observers, copy, styling, and product behavior must not change.

## Existing unrelated red checks

1. **Scoring Architecture Guardrails**
   - The scoring contract expects 73 fighters while production contains 80.
   - This is a stale scoring test contract, not a startup regression.

2. **Production Ranking Browser Smoke**
   - The run stops at the fighter-photo path audit before rendered ranking/startup certification.
   - This is outside the startup singleton-guard diffs.

## Exact next action

1. Start a fresh chat and read this file, `DECISIONS.md`, `OWNERS.md`, `PHASE-1-OWNER-AUDIT.md`, and issue #102.
2. Inspect current `main` for `assets/js/app-notification-center.js` prerequisite, retry, service-worker, profile-surface, listener, and observer behavior.
3. Create a fresh branch from current `main`.
4. Keep the runtime batch isolated to that owner and its contract assertion.
5. Run the full Startup Architecture Gate and notification/profile-relevant validation.
6. Use a controlled live rollout and real installed-iPhone verification before beginning batch 7.
7. After the physical iPhone result, report the estimated percentage complete for the entire cleanup and whether a new chat is recommended.

## Stop conditions

Stop and leave the next batch draft if:

- notification permissions, rendering, unread state, service-worker registration, profile surfaces, navigation, touch, or background/resume behavior changes;
- a second execution appears to be serving as an intentional prerequisite retry;
- a duplicate notification, duplicated observer/listener, repeated permission prompt, blank state, flicker, stale profile surface, route bounce, or double-handled tap occurs;
- the diff begins changing service-worker logic, notification data, styling, scoring, fighter data, photos, or product behavior.