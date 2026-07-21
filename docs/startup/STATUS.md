# Startup Architecture Status

_Last updated: 2026-07-21_

## Current position

- **Latest production runtime merge:** PR #171, `2eea1a03e169e3ba3289b4c0b6198a87ea4233ab`.
- **Exact latest tested runtime head:** `de893fa4927e22a7968522c69fd429c17e46c965`.
- **Latest complete Startup Architecture Gate:** run #177 passed.
- **Latest dedicated iOS Home Startup Stability:** run #44 passed.
- **Latest Phase 4 Startup Work Inventory:** run #10 passed.
- **Current phase:** Phase 4 — reduce startup work. Inventory and first runtime batch complete.
- **Phase 0:** Complete.
- **Phase 1:** Complete.
- **Phase 2:** Complete.
- **Phase 3:** Complete.
- **Entire startup cleanup:** Approximately 96% complete.
- **Visible product changes approved:** None. The zero-visible-change contract remains in force.
- **Master tracker:** [Issue #102](https://github.com/codyking0602/ufc-goat-rankings/issues/102).
- **Completed Phase 2 ledger:** [`PHASE-2-PROGRESS-20260721.md`](./PHASE-2-PROGRESS-20260721.md).
- **Completed Phase 3 ledger:** [`PHASE-3-PROGRESS-20260721.md`](./PHASE-3-PROGRESS-20260721.md).
- **Current Phase 4 ledger:** [`PHASE-4-PROGRESS-20260721.md`](./PHASE-4-PROGRESS-20260721.md).

## Completed architecture boundaries

### Phase 1 — idempotent owners

All audited runtime owners are protected according to their lifecycle class. `assets/js/app.js` remains an exact-one structural manifest singleton, and `production-ranking-bootstrap.js` retains an explicit retryable lifecycle.

### Phase 2 — duplicate ownership removed

Phase 2 established sole owners for primary routing, shared identity/access, migration handoff, visible profile/group snapshot work, notification settings/render/activity/push work, native pull final refresh, and all audited passive consumers. Same-view route activation coalesces, competing requests share one in-flight owner, and successful migration validation is reused rather than repeated.

### Phase 3 — repair loops retired

- PR #159 removed the duplicate Ranking Spotlight renderer and its Home/readiness triggers.
- PR #161 removed the duplicate Resume Snapshot calculations and profile-content writer.
- PR #163 corrected canonical What’s New markup and removed the normalizer that rewrote it every startup.
- PR #167 proved the drawer/body mobile mapping and native-destination dismissal are legitimate, then removed the body-wide observer, route/soft-refresh repair listeners, six delayed retries, close-button continuation, and public repair scheduling.

`native-app-shell-stability.js` is now a minimal presentation adapter: one startup drawer sync, one drawer-attribute observer, and one native-destination overlay-dismissal handler. Further movement or renaming belongs to Phase 5.

## Phase 4 — measured startup-work reduction

### PR #169 — deterministic startup-work inventory

PR #169 added a production inventory derived from the actual `index.html` load list and runtime sources.

Baseline at Phase 4 start:

- 68 production JavaScript files;
- approximately 959,928 production JavaScript bytes;
- measured immediate calls, timers, intervals, observers, readiness/listener hooks, visibility/reconnect hooks, and possible network signals.

The inventory ranks investigation candidates. It does not authorize broad deletion or bundling.

### PR #171 — active-only Picks commissioner refresh

`picks-commissioner.js` previously installed its local card and immediately requested commissioner state on every application startup. With a saved group token, Home startup, hidden Picks mutations, and the 45-second interval could all request commissioner snapshots while Picks was off-screen.

PR #171 preserved commissioner ownership and visible behavior while making refresh work active-Picks only:

- Home startup with saved Picks state performs zero commissioner RPCs;
- hidden Picks mutations perform zero commissioner RPCs;
- the 45-second interval performs zero work while Picks is hidden;
- direct Picks startup refreshes once after the local card exists;
- canonical route entry refreshes once after the local card exists;
- late active Picks shell/card availability receives one bounded 300 ms handoff;
- ordinary active Picks mutations do not trigger duplicate refreshes;
- active-view interval freshness and all explicit commissioner action refreshes remain.

The focused mobile proof covered Home startup, hidden mutations and polling, route entry and exit, active polling, direct Picks startup, and delayed Picks-shell insertion.

- Exact tested head: `de893fa4927e22a7968522c69fd429c17e46c965`.
- Startup Architecture Gate #177: passed completely.
- Dedicated iOS Home Startup Stability #44: passed completely.
- Phase 4 Startup Work Inventory #10: passed.
- Production merge: `2eea1a03e169e3ba3289b4c0b6198a87ea4233ab`.

## Known unrelated red workflows

These remain outside startup ownership unless a failure directly references an isolated changed line:

- Picks UI Smoke #840 passed Picks JavaScript syntax, then reported its existing static findings: mobile top-tab auto-centering, daily odds refresh schedule, and setup-guide documentation.
- Production Ranking Browser Smoke #589 failed in its established ranking-certification path.
- Scoring Architecture Guardrails #1415 failed in its established scoring/runtime contract area.
- Production Ranking Pipeline and Snapshot may stop on stale ranking/roster certification expectations.
- Validate Phase 4B Preview may stop at its historical hard-pinned architecture check.

None of the inspected red checks establishes a regression in the four PR #171 files.

## Testing and interruption policy

CI and focused browser/mobile ownership proofs are the default merge gate. Continue autonomously through audit, implementation, tests, exact-head verification, merge, and documentation. Request Cody only for a genuine user-only or physical-only uncertainty, conflicting primary behavior, or a product decision with materially different valid outcomes.

## Exact next action

1. Continue Phase 4 from current production `main`.
2. Re-run the deterministic startup-work inventory after PR #171.
3. Select the next smallest measured task that performs avoidable work while its destination is hidden or its prerequisites are unavailable.
4. Preserve direct-route, delayed-mount, explicit-action, active-view freshness, and installed-app recovery paths.
5. Change one startup-work responsibility at a time and add focused static plus browser/mobile proof.
6. Do not begin broad script deletion, bundling, or manifest restructuring; that remains Phase 5.
