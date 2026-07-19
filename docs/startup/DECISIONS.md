# Startup Architecture Decision Log

This file records decisions that future cleanup work must preserve. Add a dated entry whenever a choice materially affects architecture, scope, testing, or rollout.

## Decision 001 — Zero visible behavior change

**Date:** 2026-07-19  
**Status:** Locked

Startup cleanup is an internal reliability project, not a redesign. The approved app experience must remain visibly and functionally equivalent.

This includes rankings, divisions, profiles, Games, Picks, Intelligence, War Room, notifications, sharing, navigation, saved state, and installed-app behavior.

## Decision 002 — No broad rewrite

**Date:** 2026-07-19  
**Status:** Locked

The startup stack will be untangled through small reversible batches. We will not replace the app shell or rebuild the startup system in one large change.

## Decision 003 — One ownership problem per runtime PR

**Date:** 2026-07-19  
**Status:** Locked

Runtime cleanup PRs must stay narrow enough to understand from one diff. Product work, fighter-data work, scoring fixes, visual changes, and unrelated test repairs are excluded.

## Decision 004 — Idempotence before deletion or movement

**Date:** 2026-07-19  
**Status:** Locked

A startup owner must first become safe against duplicate execution. Only later may duplicate script loading, duplicate ownership, or compatibility code be removed.

## Decision 005 — Tests before removing fallbacks

**Date:** 2026-07-19  
**Status:** Locked

Every repair or fallback must have regression coverage before removal. The source renderer is fixed first; then one repair is removed; then behavior is reverified.

## Decision 006 — Main remains the live source of truth

**Date:** 2026-07-19  
**Status:** Locked

The cleanup uses current `main` as the production baseline. No old safe-branch or temporary-workflow assumptions may be revived without an explicit new decision.

## Decision 007 — Runtime changes begin in draft PRs

**Date:** 2026-07-19  
**Status:** Locked

Startup runtime batches remain draft until their exact behavior, branch state, and relevant validation are understood. A green subset of checks is not sufficient when mergeability or installed-app behavior is uncertain.

## Decision 008 — Unrelated red checks remain separate

**Date:** 2026-07-19  
**Status:** Locked

A stale roster-count contract and fighter-photo audit failure were discovered during startup validation. They must be documented but not silently folded into the route-startup runtime diff.

## Decision 009 — Repository documentation outranks chat memory

**Date:** 2026-07-19  
**Status:** Locked

Every future work session starts from `docs/startup/STATUS.md`, the governing architecture contract, and master issue #102. Chat summaries may help but are not the source of truth.

## Decision 010 — Rankings and War Room are not cleanup targets

**Date:** 2026-07-19  
**Status:** Locked

Rankings are not to be simplified as part of startup work. War Room is an active product surface and must be preserved and tested like the rest of the app.

## Decision 011 — Do not use one universal guard pattern

**Date:** 2026-07-19  
**Status:** Locked

Phase 1 owners fall into different technical classes:

- simple IIFE owners that can receive a top-level global marker;
- prerequisite-dependent owners whose marker must be set only after required DOM or data exists;
- structural global scripts such as `app.js` that must remain exact-one manifest loads;
- retry-sensitive launchers such as `production-ranking-bootstrap.js` that need an intentional retry API before later execution can be blocked.

No file may receive the standard singleton marker merely because another startup file used it successfully.

## Decision 012 — Mobile-sensitive owners require physical-device proof

**Date:** 2026-07-19  
**Status:** Locked

Routing, native navigation, touch handling, background/resume, profile sign-in, notification, and installed-app changes normally require physical iPhone verification before merge.

A preview is valid only when it faithfully reproduces the current production app shell and asset environment. A preview that visibly falls back to an incomplete or outdated presentation must be rejected and must not be used for sign-in or approval.

## Decision 013 — Controlled live verification is a narrow exception

**Date:** 2026-07-19  
**Status:** Locked

A mobile-sensitive startup batch may use immediate post-merge live verification only when every condition below is true:

- the separate preview environment cannot faithfully reproduce production;
- the runtime change is guard-only and preserves the exact first execution path;
- the branch is rebuilt directly from current `main`;
- the diff is tiny, fully understood, and contains no product or visual changes;
- all relevant startup, mobile, profile, and lifecycle automated checks pass;
- the merge is pinned to the tested head;
- an immediate revert target is recorded;
- no next runtime batch begins until the real installed app passes physical verification.

PR #100 qualified because it contained only two three-line duplicate-start guards and two contract assertions. This exception does not automatically apply to native navigation, touch handling, notifications, service workers, data loaders, or retry-sensitive owners.

## Decision 014 — Report whole-project progress after every iPhone gate

**Date:** 2026-07-19  
**Status:** Locked

After every physical iPhone verification result, the response must include two brief items:

- an estimated completion percentage for the entire startup-architecture cleanup, not merely the current phase;
- whether continuing in the current chat is still safe or a fresh chat is recommended.

The percentage is an honest planning estimate based on all phases, remaining owner risk, regression coverage, repair retirement, load-order cleanup, and rollout work. It is not a simple count of merged pull requests.

## Decision 015 — Repair retries must remain callable after duplicate-file protection

**Date:** 2026-07-19  
**Status:** Locked

A temporary repair layer may receive a top-level duplicate-file marker only when required later repair attempts are already owned by an explicit callable API or by preserved event/timer paths rather than by re-evaluating the file.

For `native-app-shell-stability.js`, the public `schedule()` API plus its readiness events, MutationObserver, and delayed passes are the intentional retry mechanism. PR #108 therefore blocks only a second closure, listener set, observer, timer set, and replacement API. The repair implementation itself remains unchanged and cannot be removed or consolidated until Phase 3 regression coverage exists.

## Decision 016 — Notification retries and permission ownership remain explicit

**Date:** 2026-07-19  
**Status:** Locked

`app-notification-center.js` does not rely on duplicate file evaluation for prerequisite recovery. Its intentional later attempts are owned by profile-ready/profile-updated events, the notification-device-change listener, its MutationObserver, the existing delayed settings attempt, the public `loadSettings()` and `render()` APIs, and the separately guarded notification-surface compatibility layer.

Notification permission must remain user-gesture-only through the existing Enable-button path. A startup guard may block duplicate notification ownership only when it preserves that permission boundary, service-worker behavior, profile and activity surfaces, all event/API retry paths, and the complete first execution. PR #110 met those conditions and was live-verified.

## Decision 017 — Native shell retries remain inside the canonical owner

**Date:** 2026-07-19  
**Status:** Locked

`native-app-shell.js` does not rely on duplicate file evaluation for prerequisite recovery. Its complete first execution has no missing-DOM or missing-data early exit, and the original closure remains responsible for any deferred `DOMContentLoaded` start.

Intentional later synchronization remains owned by the public `start()`, `syncActive()`, `syncBadges()`, `refresh()`, and `ensureAskAction()` APIs; view, profile, Picks, notification, and soft-refresh events; its MutationObserver; delayed startup passes; resize and orientation listeners; visibility resume; and the existing 10-second badge interval. The separately guarded `native-app-shell-stability.js` repair API remains unchanged.

PR #112 therefore blocks only accidental second-file ownership: a replacement public API, duplicate listener set, duplicate observer, duplicate pull-to-refresh owner, duplicate delayed passes, and duplicate perpetual badge interval. The exact first-run footprint passed automated equivalence testing and physical installed-iPhone verification before the tested head was squash-merged.

## Decision 018 — Picks file evaluation is not a retry mechanism

**Date:** 2026-07-19  
**Status:** Locked

`assets/js/picks.js` is loaded after its static Picks mount, event data, Supabase library/config, and canonical-group owner. Its only missing-mount recovery is the original one-time `DOMContentLoaded` callback. The canonical owner does not publish a public retry API, dynamically reload itself, or rely on duplicate evaluation for identity, profile, PIN, route, saved-state, or backend recovery.

Intentional later Picks work remains owned by the original 30-second refresh interval and the separate group, PIN, recovery, history, commissioner, season, archive, navigation, profile-handoff, notification, badge, challenge, and native-shell owners. PR #113 therefore blocks only accidental duplicate ownership: a second private state closure, optional Supabase client, static handler set, render owner, and polling loop.

The marker must remain before all client, state, listener, storage, DOM, and timer ownership. The exact first-run footprint and the existing `DOMContentLoaded` path passed focused equivalence testing, the full Startup Architecture Gate, and physical installed-iPhone verification before tested head `1ea7bdf46f09f18279ac4f21a2bbfd492f1d44ba` was squash-merged as `0c488a449d413636228aafd1e45ee8197d5078ba`.