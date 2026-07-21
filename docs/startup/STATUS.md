# Startup Architecture Status

_Last updated: 2026-07-21_

## Current position

- **Latest production runtime merge:** PR #161, `942cdd215aa81cb3820fb464334d08101a139e9d`.
- **Exact latest tested runtime head:** `534a984625bb2764beb289b0211ab102318dd713`.
- **Latest complete Startup Architecture Gate:** run #158 passed.
- **Latest dedicated iOS Home Startup Stability:** run #28 passed.
- **Current phase:** Phase 3 — retire repair loops. Two production batches complete.
- **Phase 0:** Complete.
- **Phase 1:** Complete.
- **Phase 2:** Complete.
- **Entire startup cleanup:** Approximately 93% complete.
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
| #137 | Profile-challenge inbox loading is a passive identity consumer with one in-flight refresh | Merged |
| #138 | Community profile loading is a passive identity consumer | Merged |
| #139 | Home daily synchronization is a passive identity consumer | Merged |
| #141 | Picks social profile/reminder loading is a passive identity consumer | Merged |
| #143 | Picks season loading is a passive identity consumer with coalesced RPC work | Merged |
| #145 | War Room message board is passive; visible **SIGN IN** remains explicit | `52aef7a0b24d9cc06a891b3e4f23a457bd4b6b02` |
| #146 | War Room access panel is passive with one access-status request owner | `cc75ef4371196ea89a79aa7ff14f759a252a4dd4` |
| #149 | War Room notification activity, unread, mark-seen, realtime, and push work are passive with one activity-status request owner | `31297afb6af98c6e777306fd61b9fe48d566ce35` |
| #151 | Canonical route owner coalesces same-view activation; late Home/Picks continuation skips the already-owned destination | `fc0b21d8558ba20849460c8dcc01bee383f83240` |
| #153 | Notification surface compatibility no longer invokes canonical notification rendering/settings work | `14f23d54548eef7e6fcf89acddfcded255ebeb58` |
| #155 | Native pull fallback no longer duplicates the accepted action’s final activity-status refresh | `a727a38540cd78a12f6035632c5b9e7016bea18c` |
| #157 | Canonical identity resolution reuses the already-validated migration handoff instead of repeating the same snapshot RPC | `ba2c24f6c22333a73a041d59aa8aef9bdd5642a3` |

PR #144 was a test-only correction and changed no production behavior.

## Phase 2 closure audit

After PR #157 merged, the production load map was rebuilt from `index.html` and checked against the current startup contract and production-loaded JavaScript only.

The closing audit found no remaining demonstrated competing owner for:

- shared identity resolution or canonical access persistence;
- canonical readiness publication;
- visible profile/group snapshot work;
- primary route activation;
- notification settings, rendering, activity status, or push work;
- native pull final refresh;
- startup, readiness, route, visibility, reconnect, realtime, polling, timer, observer, or direct-call paths requesting the same proved expensive work.

Phase 2 is formally complete. Compatibility and repair layers moved into Phase 3 rather than being treated as unproved duplicate-owner defects.

## Phase 3 completed batches

### PR #159 — Ranking Spotlight repair retired

`assets/js/native-app-shell-stability.js` previously contained an independent `repairSpotlight()` renderer. It could wake from arbitrary Home mutations, ranking-readiness events, route/soft-refresh events, and all six delayed startup retries. It read raw ranking globals/local storage and directly replaced the canonical loading placeholder.

`assets/js/home-dashboard.js` already owned readiness, placeholder, deterministic selection, markup, route re-entry, visibility recovery, and duplicate-markup suppression. PR #159 removed only the duplicate renderer and its Home/readiness triggers.

- Dedicated iOS Home Startup Stability #22: passed.
- Startup Architecture Gate #151: passed completely.
- Exact tested head: `c274c5d1c35f2d1b212632dd181e5f29343c1178`.
- Production merge: `aa09175a99fcd1b381645e96e74531336674346f`.

### PR #161 — Resume Snapshot repair retired

`assets/js/native-app-shell-stability.js` also independently inferred the open fighter, recalculated Resume Snapshot values through separate fallbacks, rewrote snapshot DOM, and stored hidden drawer fighter state. Its schema had drifted from the current calculated profile.

`assets/js/calculated-profile-runtime.js` is loaded and required by the production ranking bootstrap before readiness. It owns `openFighter()`, the single complete profile write, all eight current Resume Snapshot fields from calculated visible stats, and the canonical-facts win-streak fallback.

PR #161 removed only the duplicate snapshot writer, its helper calculations, hidden drawer fighter state, and explicit snapshot added-node target. It preserved:

- drawer/body open-state synchronization;
- native-destination profile dismissal;
- malformed **What’s New** normalization;
- route and soft-refresh presentation recovery;
- the narrowed MutationObserver;
- all bounded delayed-startup passes.

The mobile proof covered canonical profile open, current calculated values, drawer mutation, route and soft-refresh events, direct schedules, the complete 3.6-second delayed window, intentional snapshot corruption, canonical reopen, drawer/body synchronization, and native-destination dismissal. The stability layer made zero profile-content writes.

- Dedicated iOS Home Startup Stability #28: passed.
- Startup Architecture Gate #158: passed completely.
- Exact tested head: `534a984625bb2764beb289b0211ab102318dd713`.
- Production merge: `942cdd215aa81cb3820fb464334d08101a139e9d`.

## Known unrelated red workflows

These remain outside startup ownership unless a failure directly references an isolated changed line:

- Production Ranking Browser Smoke #566 stopped at the existing **Audit every fighter photo path** step before ranking and mobile-profile certification.
- Scoring Architecture Guardrails #1396 passed syntax, profile-copy coverage, and physical source ownership, then stopped at its established permanent runtime contract step.
- Production Ranking Pipeline and Snapshot may stop on stale ranking/roster certification expectations.
- Validate Phase 4B Preview may stop at its historical hard-pinned architecture check.
- Picks UI Smoke may report an existing Picks product/static-contract finding.

None of the inspected #566 or #1396 failure steps references the isolated stability runtime or profile-owner proof responsibility.

## Testing and interruption policy

CI and focused mobile-browser ownership proofs are the default merge gate.

Do **not** summon Cody for routine checkpoints, branch decisions, bot-only `main` movement, known unrelated red workflows, normal proof design, or ordinary merge authorization. Continue autonomously through audit, focused implementation, tests, exact-head verification, merge, and documentation when evidence is complete.

Request Cody only when a genuine unresolved user-only or physical-only uncertainty blocks a safe decision, such as:

- installed-app or service-worker behavior automation cannot reproduce;
- a real primary route, sign-in, loading, or native-shell behavior change with conflicting evidence;
- an iOS lifecycle issue that cannot be resolved in Playwright;
- a product choice with two materially different valid outcomes;
- incomplete or contradictory evidence that makes merging unsafe.

Unrelated automated odds-health, deployment, documentation, or generated-file commits do not invalidate passing startup evidence when their changed files are proven non-overlapping.

## Exact next action

1. Continue Phase 3 from current production `main`.
2. Audit malformed **What’s New** normalization as the next isolated behavior.
3. Identify the canonical button-markup and unread-state owners and reproduce any real malformed or replaced-DOM condition before changing the repair.
4. Preserve drawer/body synchronization, native-destination overlay dismissal, and any demonstrated delayed-DOM recovery.
5. After **What’s New**, audit drawer/body synchronization and native overlay dismissal separately, then narrow observer/listener/timer breadth target by target.
6. Do not broadly remove the observer, timers, or stability file.
