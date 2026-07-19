# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Phase 1 runtime batches merged and verified:** 6
- **Latest verified runtime commit:** `865527b15902e7b61fff429e4faf9ce2a0bc811c`
- **Estimated entire cleanup progress:** approximately 27%
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Visible product changes approved:** none
- **Major Phase 1 owner audit:** complete in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md)
- **Recommended session state:** start a fresh chat before batch 7; this file is the handoff source of truth

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

### Batch 6 — Notification center guard

PR #110 protected `app-notification-center.js` from duplicate file evaluation while preserving notification rendering, permission behavior, service-worker registration and updates, profile and activity surfaces, observers, listeners, public APIs, copy, styling, navigation, saved state, and first-run behavior.

The prerequisite/retry inspection confirmed that the owner does not exit early when profile DOM, identity, settings, or push data are unavailable. Required later attempts already run through profile-ready/profile-updated events, the notification-device-change listener, MutationObserver, the existing 250 ms settings attempt, the public `loadSettings()` and `render()` APIs, and the separately guarded notification-surface compatibility layer. Notification permission remains user-gesture-only through the existing Enable-button path.

Final diff:

- 4 additions;
- 0 deletions;
- 2 files.

Validation passed:

- JavaScript syntax;
- startup ownership contract;
- local app startup;
- iOS startup route and resume stability;
- profile sign-in startup stability;
- delayed Home/community stability;
- duplicate-evaluation harness and first-run equivalence proof;
- real installed-iPhone cold launch, profile and activity notification surfaces, permission behavior, notification controls, navigation, touch behavior, and background/resume behavior.

PR #110 was squash-merged as `865527b15902e7b61fff429e4faf9ce2a0bc811c`. Cody reported the installed app was normal.

## Next Phase 1 batch

The next isolated owner is `assets/js/native-app-shell.js`.

This is the canonical mobile bottom-navigation owner and is the highest-sensitivity remaining simple guard candidate. The next session must inspect its exact first-run and repeat-execution path, including closure-scoped `state.started`, bottom-navigation reuse, badges, transitions, pull-to-refresh, touch/click handling, MutationObserver ownership, the 10-second badge interval, lifecycle listeners, startup prerequisites, and whether duplicate file evaluation currently serves any intentional retry.

The runtime scope must remain one owner plus one matching startup-contract assertion only if inspection confirms the complete first-run path and all intentional retries remain intact. Do not change bottom-navigation presentation, badge logic, transitions, refresh behavior, touch handling, routes, styling, copy, or installed-app behavior.

## Existing unrelated red checks

1. **Scoring Architecture Guardrails**
   - The scoring contract expects 73 fighters while production contains 80.
   - This is a stale scoring test contract, not a startup regression.

2. **Production Ranking Browser Smoke**
   - The run stops at the fighter-photo path audit before rendered ranking/startup certification.
   - This is outside the startup singleton-guard diffs.

## Exact next action

1. Start a fresh chat and read this file, `DECISIONS.md`, `OWNERS.md`, `PHASE-1-OWNER-AUDIT.md`, and issue #102.
2. Inspect current `main` for `assets/js/native-app-shell.js` prerequisite, retry, listener, observer, interval, touch, navigation, badge, transition, refresh, and lifecycle behavior.
3. Create a fresh branch directly from current `main`.
4. Keep the runtime batch isolated to that owner and its contract assertion.
5. Run the full Startup Architecture Gate plus native-shell, navigation, touch, profile, Picks, notification, startup, and lifecycle validation.
6. Keep the PR draft until real installed-iPhone verification passes.
7. Do not begin batch 8 until batch 7 is merged, physically verified, and documented.

## Stop conditions

Stop and leave batch 7 draft if:

- bottom navigation, badge state, transitions, pull-to-refresh, routes, touch/click behavior, profile, Picks, notifications, or background/resume behavior changes;
- a second execution appears to be serving as an intentional prerequisite retry;
- duplicate navigation, duplicated observer/listener/interval ownership, repeated taps, blank state, flicker, route bounce, stale badge state, or double-handled refresh occurs;
- the diff begins changing styling, copy, product behavior, service-worker logic, scoring, fighter data, photos, Games, Picks, Intelligence, War Room, or sharing.
