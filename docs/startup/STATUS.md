# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Phase 1 runtime batches merged and verified:** 8
- **Latest verified runtime commit:** `0c488a449d413636228aafd1e45ee8197d5078ba`
- **Estimated entire cleanup progress:** approximately 34%
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Visible product changes approved:** none
- **Major Phase 1 owner audit:** complete in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md)
- **Recommended session state:** start a fresh chat before batch 9; this file is the handoff source of truth

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

### Batch 7 — Native app shell guard

PR #112 protected `native-app-shell.js` from accidental duplicate file evaluation while preserving its complete first-run behavior, bottom-navigation reuse, active-state synchronization, badge synchronization, transitions, pull-to-refresh, touch handling, lifecycle listeners, MutationObserver, delayed passes, public APIs, and existing 10-second badge interval.

The prerequisite/retry inspection confirmed that `start()` has no missing-DOM or missing-data early exit and that duplicate file evaluation is not an intentional retry mechanism. Required later synchronization remains owned by the public APIs, view/profile/Picks/notification/soft-refresh events, MutationObserver, delayed startup passes, resize/orientation, visibility resume, and the badge interval. The separately guarded `native-app-shell-stability.js` repair layer was unchanged.

Final diff:

- 4 additions;
- 0 deletions;
- 2 files.

Validation passed:

- JavaScript syntax;
- startup ownership contract;
- local app startup;
- iOS startup route and lifecycle stability;
- profile sign-in and Picks startup stability;
- delayed Home/community stability;
- focused duplicate-evaluation and first-run equivalence proof;
- real installed-iPhone signed-in testing of cold launch, navigation, rapid tab switching, badges, profiles, Picks, notifications, pull-to-refresh, rotation, background/resume, sharing, saved-profile behavior, and return to Home.

PR #112 was squash-merged as `5b82c3a47b64a4955c4fd4eb041fafe46473e8ac`. Cody reported the immutable test build was normal.

### Batch 8 — Picks base runtime guard

PR #113 protected `picks.js` from accidental duplicate file evaluation while preserving its complete original first execution, saved Picks and Underdog Lock restoration, room and admin token restoration, route activation, static control bindings, backend event load, URL room resume, render ownership, and existing 30-second refresh interval.

The prerequisite/retry inspection confirmed that the canonical static page provides the full Picks mount, event data, Supabase library/config, and canonical-group owner before `picks.js` executes. The only missing-mount retry remains the original one-time `DOMContentLoaded` path. Duplicate file evaluation was not a legitimate retry: it created a second private state closure, optional Supabase client, handler set, render owner, and polling loop.

Final diff:

- 5 additions;
- 0 deletions;
- 2 files.

Validation passed:

- JavaScript syntax;
- startup ownership contract;
- local app startup;
- iOS startup and route stability;
- profile sign-in startup stability;
- delayed Home/community stability;
- focused duplicate-evaluation and first-run equivalence proof;
- Picks UI Smoke JavaScript syntax step;
- real installed-iPhone testing of Picks startup, sign-in/PIN, saved state, Top 10 and profile handoffs, challenges, badges, navigation, rapid taps, background/resume, notifications, rotation/resize, surrounding product surfaces, and duplicate-ownership symptoms.

Cody tested immutable PR head `1ea7bdf46f09f18279ac4f21a2bbfd492f1d44ba` and reported the app was normal. PR #113 was squash-merged as `0c488a449d413636228aafd1e45ee8197d5078ba`.

## Next Phase 1 batch

The next isolated owner is `assets/js/community-profiles.js`.

This is the canonical community directory/profile owner and a broad-surface guard candidate. The next session must inspect its exact first-run and repeat-execution path, including prerequisite DOM/data checks, closure-scoped binding state, identity loading, sign-in and profile readiness, Top 10 editor behavior, saved profile state, profile challenges, Picks identity handoff, directory/profile navigation, listeners, observers, timers, dynamic loading, public APIs, background/resume behavior, sharing, notifications, and whether duplicate file evaluation currently serves any intentional retry.

The runtime scope must remain one owner plus one matching startup-contract assertion only if inspection proves that the complete first-run path and every intentional prerequisite recovery mechanism remain intact. Do not change community/profile presentation, copy, flows, identity behavior, Top 10, challenges, Picks, navigation, styling, scoring, data, Games, sharing, notifications, or installed-app behavior.

## Existing unrelated red checks

1. **Scoring Architecture Guardrails**
   - The permanent source/runtime contract remains stale against the current 80-fighter production roster.
   - This is a scoring test issue, not a startup regression.

2. **Production Ranking Browser Smoke**
   - The run stops at the fighter-photo path audit before rendered ranking/startup certification.
   - This is outside the startup singleton-guard diffs.

3. **Picks UI Smoke**
   - Picks JavaScript syntax passes.
   - The static contract currently reports missing mobile top-tab auto-centering and missing daily-odds-workflow setup documentation in unchanged files.
   - These are separate from the Batch 8 `picks.js` guard and were not repaired in that batch.

## Exact next action

1. Start a fresh chat and read this file, `DECISIONS.md`, `OWNERS.md`, `PHASE-1-OWNER-AUDIT.md`, `TEST_PLAN.md`, and issue #102.
2. Inspect current `main` for `assets/js/community-profiles.js` prerequisite, retry, identity, sign-in, profile, Top 10, challenge, Picks-handoff, route, listener, observer, timer, dynamic-load, API, sharing, notification, and lifecycle behavior.
3. Create a fresh branch directly from current `main`.
4. Keep the runtime batch isolated to that owner and its contract assertion.
5. Run the full Startup Architecture Gate plus community directory/profile, profile sign-in, Top 10, challenge, Picks handoff, route, sharing, notification, mobile, background/resume, saved-state, and installed-app validation.
6. Keep the PR draft until real installed-iPhone verification passes.
7. Do not begin batch 10 until batch 9 is merged, physically verified, and documented.

## Stop conditions

Stop and leave batch 9 draft if:

- community directory/profile presentation, copy, sign-in, identity, Top 10, challenge, Picks handoff, saved state, routes, navigation, sharing, notifications, or background/resume behavior changes;
- a second execution appears to serve an intentional prerequisite retry;
- duplicate directory/profile UI, listeners, observers, timers, API replacement, route handling, repeated taps, blank state, flicker, stale state, or double-handled actions occur;
- the diff begins changing styling, copy, product behavior, scoring, fighter data, photos, Games, Rankings, Intelligence, War Room, notifications, Picks, or sharing.