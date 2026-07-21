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

The older percentage estimates are superseded.

## Completed architecture boundaries

### Phase 1 — idempotent owners

All 13 audited Phase 1 runtime owners are protected according to their actual lifecycle class:

- simple owners use complete-owner guards;
- prerequisite-aware owners claim ownership only after prerequisites exist;
- `assets/js/app.js` remains an exact-one structural manifest singleton;
- `assets/js/production-ranking-bootstrap.js` owns an explicit retryable lifecycle.

### Phase 2 — primary routing

- `assets/js/octagon-hq-shell.js` is the sole primary destination and ranking-subview activation owner.
- PR #128 preserved missing-shell recovery through one queued canonical handoff.
- PR #129 removed the legacy `app.js` primary-tab listener.
- PR #151 made exact same-view activation a canonical no-op and prevented late launch continuations from reactivating the already-owned destination.
- One accepted route transition publishes one event; an already-active exact-view retry publishes none.

### Phase 2 — identity, profile, access, notification, refresh, and passive consumers

`assets/js/play-profile-identity.js` is the canonical shared credential, login/fallback, identity-cache, canonical-readiness, and access-persistence owner.

Completed isolated corrections:

| PR | Responsibility corrected | Production result |
|---:|---|---|
| #131 | Picks returning-member login delegates to the canonical profile owner | Merged |
| #132 | Community no longer duplicates shared Picks access persistence or route compatibility | Merged |
| #133 | Product Architecture no longer duplicates canonical profile access persistence | Merged |
| #134 / #140 | Notification settings became a cache/event consumer; explicit user actions retain canonical `require()` | Merged |
| #135 | Product performs one cached or readiness-driven startup profile handoff | Merged |
| #136 | App Profile is the single full group-snapshot owner | Merged |
| #137 | Profile-challenge inbox loading is passive and coalesced | Merged |
| #138 | Community profile loading is passive | Merged |
| #139 | Home daily synchronization is passive | Merged |
| #141 | Picks social loading is passive | Merged |
| #143 | Picks season loading is passive and coalesced | Merged |
| #145 | War Room board loading is passive; visible **SIGN IN** remains explicit | `52aef7a0b24d9cc06a891b3e4f23a457bd4b6b02` |
| #146 | War Room access verification is passive and coalesced | `cc75ef4371196ea89a79aa7ff14f759a252a4dd4` |
| #149 | War Room activity, unread, mark-seen, realtime, and push work are passive and coalesced | `31297afb6af98c6e777306fd61b9fe48d566ce35` |
| #151 | Canonical route owner coalesces same-view activation | `fc0b21d8558ba20849460c8dcc01bee383f83240` |
| #153 | Notification compatibility no longer invokes canonical render/settings work | `14f23d54548eef7e6fcf89acddfcded255ebeb58` |
| #155 | Native pull fallback no longer duplicates final activity refresh | `a727a38540cd78a12f6035632c5b9e7016bea18c` |
| #157 | Canonical identity reuses the validated migration handoff | `ba2c24f6c22333a73a041d59aa8aef9bdd5642a3` |

PR #144 was a test-only correction and changed no production behavior.

## Phase 2 closure audit

After PR #157 merged, the production load map was rebuilt from `index.html` and checked against production-loaded JavaScript. The audit found no remaining demonstrated competing identity, access, readiness, route, notification, or full-refresh owner. Phase 2 is complete.

## Phase 3 completed batches

### PR #159 — Ranking Spotlight repair retired

The stability layer previously contained an independent `repairSpotlight()` renderer triggered by Home mutations, ranking-readiness events, route/soft-refresh events, and all delayed retries. `home-dashboard.js` already owned readiness, placeholder, deterministic selection, markup, route re-entry, visibility recovery, and duplicate suppression.

- Dedicated iOS Home Startup Stability #22: passed.
- Startup Architecture Gate #151: passed.
- Exact tested head: `c274c5d1c35f2d1b212632dd181e5f29343c1178`.
- Production merge: `aa09175a99fcd1b381645e96e74531336674346f`.

### PR #161 — Resume Snapshot repair retired

The stability layer separately inferred the open fighter, recalculated and rewrote Resume Snapshot values, and stored hidden fighter state. `calculated-profile-runtime.js` already owned `openFighter()`, the complete profile write, all eight calculated snapshot fields, and the canonical-facts win-streak fallback.

PR #161 removed the duplicate content writer while preserving drawer/body synchronization, native-destination dismissal, route/soft-refresh recovery, the narrowed observer, and delayed passes.

- Dedicated iOS Home Startup Stability #28: passed.
- Startup Architecture Gate #158: passed.
- Exact tested head: `534a984625bb2764beb289b0211ab102318dd713`.
- Production merge: `942cdd215aa81cb3820fb464334d08101a139e9d`.

### PR #163 — What’s New normalization retired

`app-update-watcher.js` already created the update controls and owned the **What’s New** click binding, unread count, badge state, accessibility state, seen events, and storage events. Its historical markup used plain `NEW` text, while the stability normalizer required a labeled span, causing the stability layer to rewrite the canonical button on every normal startup.

PR #163 made the canonical watcher emit the complete labeled markup in its one control write and removed `normalizeWhatsNew()`, its API exposure, and manual-refresh/What’s New observer targets from the stability layer. It preserved:

- drawer/body synchronization;
- native-destination profile dismissal;
- route and soft-refresh drawer recovery;
- drawer-only mutation observation;
- all six bounded startup passes.

The mobile proof covered canonical startup markup, unread count/class/ARIA state, seen and storage events, click binding, arbitrary DOM mutation, repeated route/soft-refresh/direct schedules, the complete delayed window, intentional markup corruption, refresh restoration, and retained drawer dismissal. The stability layer made zero button writes.

The first aggregate run exposed only a stale exact-version assertion in the older profile proof. That proof now checks the native stability runtime contract rather than pinning a previous Phase 3 version label. The temporary diagnostic workflow was removed before the final tested head.

- Dedicated iOS Home Startup Stability #32: passed.
- Startup Architecture Gate #163: passed.
- Exact tested head: `b0dc85d4027845952890cc7e2e11ffdcf6c1b11f`.
- Production merge: `ec8fce96cad3a19763da9545ffd671f484750556`.

## Known unrelated red workflows

These remain outside startup ownership unless a failure directly references an isolated changed line:

- Production Ranking Browser Smoke #571 stopped at the existing **Audit every fighter photo path** step before ranking and mobile-profile certification.
- Scoring Architecture Guardrails #1401 passed syntax, profile-copy coverage, and physical source ownership, then stopped at its established permanent runtime contract step.
- Production Ranking Pipeline and Snapshot may stop on stale ranking/roster certification expectations.
- Validate Phase 4B Preview may stop at its historical hard-pinned architecture check.
- Picks UI Smoke may report an existing Picks product/static-contract finding.

None of the inspected #571 or #1401 failure steps references the isolated What’s New or stability responsibility.

## Testing and interruption policy

CI and focused mobile-browser ownership proofs are the default merge gate.

Do **not** summon Cody for routine checkpoints, branch decisions, bot-only `main` movement, known unrelated red workflows, normal proof design, or ordinary merge authorization. Continue autonomously through audit, focused implementation, tests, exact-head verification, merge, and documentation when evidence is complete.

Request Cody only when a genuine unresolved user-only or physical-only uncertainty blocks a safe decision, such as installed-app/service-worker behavior automation cannot reproduce, a real route/sign-in/loading/native-shell behavior change with conflicting evidence, an unreproducible iOS lifecycle issue, or a genuine product choice with materially different outcomes.

## Exact next action

1. Continue Phase 3 from current production `main`.
2. Audit `syncDrawerState()` as the next isolated presentation responsibility.
3. Identify every canonical drawer/body writer and reproduce any real body-class desynchronization before editing.
4. Preserve native-destination overlay dismissal until its separate audit is complete.
5. Narrow observer, route/soft-refresh listeners, and six startup timers only as drawer recovery paths are proved unnecessary or reassigned.
6. Do not broadly remove the remaining stability file.
