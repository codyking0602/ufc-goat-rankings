# Startup Architecture Status

_Last updated: 2026-07-21_

## Current position

- **Latest production runtime merge:** PR #163, `ec8fce96cad3a19763da9545ffd671f484750556`.
- **Exact latest tested runtime head:** `b0dc85d4027845952890cc7e2e11ffdcf6c1b11f`.
- **Latest complete Startup Architecture Gate:** run #163 passed.
- **Latest dedicated iOS Home Startup Stability:** run #32 passed.
- **Current phase:** Phase 3 — retire repair loops. Three production batches complete.
- **Phase 0:** Complete.
- **Phase 1:** Complete.
- **Phase 2:** Complete.
- **Entire startup cleanup:** Approximately 94% complete.
- **Visible product changes approved:** None. The zero-visible-change contract remains in force.
- **Master tracker:** [Issue #102](https://github.com/codyking0602/ufc-goat-rankings/issues/102).
- **Completed Phase 2 ledger:** [`PHASE-2-PROGRESS-20260721.md`](./PHASE-2-PROGRESS-20260721.md).
- **Current Phase 3 ledger:** [`PHASE-3-PROGRESS-20260721.md`](./PHASE-3-PROGRESS-20260721.md).

## Completed architecture boundaries

### Phase 1 — idempotent owners

All audited Phase 1 runtime owners are protected according to lifecycle class. `assets/js/app.js` remains an exact-one structural manifest singleton, and `production-ranking-bootstrap.js` retains an explicit retryable lifecycle.

### Phase 2 — duplicate ownership removed

Phase 2 established sole owners for primary routing, shared identity/access, migration handoff, visible profile/group snapshot work, notification settings/render/activity/push work, native pull final refresh, and all audited passive consumers. Same-view route activation coalesces, competing requests share one in-flight owner, and successful migration validation is reused rather than repeated.

### Phase 3 — completed repair-loop retirements

#### PR #159 — Ranking Spotlight

The stability layer independently watched Home, listened to ranking readiness, ran delayed retries, read raw ranking state, and could replace the canonical loading placeholder. `home-dashboard.js` already owned readiness, selection, persistence, markup, route re-entry, visibility recovery, and duplicate suppression.

PR #159 removed only that second renderer and its Home/readiness triggers.

- iOS suite #22: passed.
- Startup Gate #151: passed.
- Exact head: `c274c5d1c35f2d1b212632dd181e5f29343c1178`.
- Production merge: `aa09175a99fcd1b381645e96e74531336674346f`.

#### PR #161 — Resume Snapshot

The stability layer independently inferred the fighter, recalculated snapshot values, rewrote profile content, and stored hidden drawer fighter state. `calculated-profile-runtime.js` already owned `openFighter()`, the one complete profile write, all eight current snapshot fields, and canonical-facts win-streak fallback.

PR #161 removed only the second content writer and snapshot observer target. Drawer/body synchronization and native-destination dismissal remained intact.

- iOS suite #28: passed.
- Startup Gate #158: passed.
- Exact head: `534a984625bb2764beb289b0211ab102318dd713`.
- Production merge: `942cdd215aa81cb3820fb464334d08101a139e9d`.

#### PR #163 — What’s New control

`app-update-watcher.js` creates the update control and owns click binding, unread calculation, badge state, accessibility labels, and seen/storage synchronization. Its old template omitted the label marker that the stability layer required, so the stability layer rewrote canonical markup during every normal startup.

PR #163 made the canonical watcher create the complete labeled button and badge in its one control write. It removed `normalizeWhatsNew()`, update-control observer targets, and all What’s New access from the stability layer while preserving the final drawer recovery paths.

The mobile proof covered startup, unread state, seen/storage events, click binding, route/refresh/direct schedules, the complete delayed window, intentional corruption, canonical refresh restoration, drawer/body synchronization, and native-destination dismissal. Stability produced zero update-control writes.

- iOS suite #32: passed.
- Startup Gate #163: passed.
- Exact head: `b0dc85d4027845952890cc7e2e11ffdcf6c1b11f`.
- Production merge: `ec8fce96cad3a19763da9545ffd671f484750556`.

## Current stability file boundary

`assets/js/native-app-shell-stability.js` now retains only:

- drawer/body `fighter-profile-open` synchronization;
- native-destination profile dismissal;
- the debounced scheduler supporting that synchronization;
- drawer-targeted mutation observation;
- route and soft-refresh scheduling;
- six bounded delayed startup passes.

It no longer owns or repairs Ranking Spotlight, calculated fighter-profile content, Resume Snapshot values, or What’s New control markup/unread state.

## Known unrelated red workflows

These remain outside startup ownership unless a failure directly references the isolated change:

- Production Ranking Browser Smoke #571 stopped at the existing fighter-photo path audit before ranking and mobile-profile certification.
- Scoring Architecture Guardrails #1401 remained red in its established scoring/runtime contract area.
- Production Ranking Pipeline and Snapshot may stop on stale ranking/roster certification expectations.
- Validate Phase 4B Preview may stop at its historical hard-pinned architecture check.
- Picks UI Smoke may report an existing Picks product/static-contract finding.

Neither inspected PR #163 red workflow references the isolated update watcher, stability runtime, or owner proofs.

## Testing and interruption policy

CI and focused mobile-browser ownership proofs are the default merge gate. Continue autonomously through audit, implementation, tests, exact-head verification, merge, and documentation. Request Cody only for a genuine user-only/physical-only uncertainty, conflicting primary behavior, or a product decision with materially different valid outcomes.

## Exact next action

1. Continue Phase 3 from current production `main`.
2. Audit drawer/body synchronization and native-destination overlay dismissal as separate responsibilities.
3. Identify every canonical open and close writer and reproduce open, close, DOM replacement, route, soft-refresh, delayed startup, and native navigation conditions.
4. Preserve native overlay dismissal unless another owner is proved to perform it reliably.
5. Narrow or retire the observer, scheduler, route/soft-refresh listeners, and six startup timers only after their final drawer target is proved.