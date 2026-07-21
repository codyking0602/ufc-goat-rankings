# Startup Architecture Status

_Last updated: 2026-07-21_

## Current position

- **Production `main`:** `ba2c24f6c22333a73a041d59aa8aef9bdd5642a3`.
- **Latest startup runtime merge:** PR #157, `ba2c24f6c22333a73a041d59aa8aef9bdd5642a3`.
- **Current phase:** Phase 3 — retire repair loops. No Phase 3 runtime removal has started.
- **Phase 0:** Complete.
- **Phase 1:** Complete.
- **Phase 2:** Complete.
- **Entire startup cleanup:** Approximately 92% complete.
- **Visible product changes approved:** None. The zero-visible-change contract remains in force.
- **Master tracker:** [Issue #102](https://github.com/codyking0602/ufc-goat-rankings/issues/102).
- **Completed Phase 2 ledger:** [`PHASE-2-PROGRESS-20260721.md`](./PHASE-2-PROGRESS-20260721.md).

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

## Latest completed batch — PR #157

Production-loaded identity startup previously validated the same stored member token twice:

- `app-canonical-group.js` validated a canonical or historical token before adoption;
- `play-profile-identity.js` awaited that migration and then independently called the same snapshot path for the same token.

PR #157 now:

- keeps historical-token discovery, validation, canonical adoption, admin/room migration, URL normalization, and one-time reload ownership in `app-canonical-group.js`;
- returns the already-resolved identity as a bounded migration handoff;
- lets `play-profile-identity.js` validate that handoff shape, cache it, normalize canonical storage, and publish `ufc-play-profile-ready` without another snapshot RPC;
- preserves independent canonical resolution when migration has no valid result;
- preserves current login, legacy login fallback, explicit `require()`, migration-specific readiness, and reload-loop protection.

Startup Architecture Gate #149 passed completely on exact tested head `908f265dad46603b5556613effbd830214cb78d4`. Production merge: `ba2c24f6c22333a73a041d59aa8aef9bdd5642a3`.

The focused static and mobile-browser proof covered canonical tokens, historical tokens, schema fallback, repeated `resolve()` calls, independent owner fallback, canonical storage adoption, one canonical profile-ready publication, and preserved migration reload behavior.

Known unrelated workflows remained confined to their established diagnostics: fighter-photo auditing and the permanent scoring source/runtime contract. Neither referenced the isolated identity runtime or proof files.

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

`native-app-shell-stability.js` and other compatibility layers remain Phase 3 candidates, not Phase 2 ownership defects. Phase 2 is therefore formally closed rather than extended with an unproved cleanup.

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

## Known unrelated red workflows

These remain outside startup ownership unless a failure directly references an isolated changed line:

- Production Ranking Browser Smoke may stop at fighter-photo path/render audits.
- Production Ranking Pipeline and Snapshot may stop on stale ranking/roster certification expectations.
- Scoring Architecture Guardrails may stop in the existing permanent source/runtime contract.
- Validate Phase 4B Preview may stop at its historical hard-pinned architecture check.
- Picks UI Smoke may report an existing Picks product/static-contract finding.

## Exact next action

1. Start Phase 3 from current production `main`.
2. Audit one repair or compatibility loop at a time; do not broadly delete repair code.
3. Name the canonical source behavior that makes the repair removable and prove every startup, timer, observer, route, mutation, and direct-call path first.
4. `assets/js/native-app-shell-stability.js` is a candidate only after source behavior and focused browser evidence prove a specific repair redundant.
5. Preserve the zero-visible-change contract and all legitimate recovery paths.
6. Continue autonomously under the same CI-first and interruption rules.
