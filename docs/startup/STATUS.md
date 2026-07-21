# Startup Architecture Status

_Last updated: 2026-07-21_

## Current position

- **Production `main`:** `14f23d54548eef7e6fcf89acddfcded255ebeb58`.
- **Latest startup runtime merge:** PR #153, `14f23d54548eef7e6fcf89acddfcded255ebeb58`.
- **Current phase:** Phase 2 — remove duplicate ownership.
- **Phase 0:** Complete.
- **Phase 1:** Complete.
- **Phase 2:** Approximately 99% complete.
- **Entire startup cleanup:** Approximately 90% complete.
- **Visible product changes approved:** None. The zero-visible-change contract remains in force.
- **Master tracker:** [Issue #102](https://github.com/codyking0602/ufc-goat-rankings/issues/102).
- **Current Phase 2 ledger:** [`PHASE-2-PROGRESS-20260721.md`](./PHASE-2-PROGRESS-20260721.md).

The older 50–58% estimates are superseded.

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
- The permanent startup contract rejects competing primary route activation and proves that one accepted route transition publishes one event while an already-active retry publishes none.

### Phase 2 — identity, profile, access, notification, and passive consumers

`assets/js/play-profile-identity.js` is the canonical shared credential, login/fallback, identity-cache, readiness-publication, and access-persistence owner.

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
| #145 | War Room message board is a passive identity consumer; visible **SIGN IN** remains explicit | `52aef7a0b24d9cc06a891b3e4f23a457bd4b6b02` |
| #146 | War Room access panel is passive with one access-status request owner | `cc75ef4371196ea89a79aa7ff14f759a252a4dd4` |
| #149 | War Room notification activity, unread, mark-seen, realtime, and push work are passive with one activity-status request owner | `31297afb6af98c6e777306fd61b9fe48d566ce35` |
| #151 | Canonical route owner coalesces same-view activation; late Home/Picks continuation skips the already-owned destination | `fc0b21d8558ba20849460c8dcc01bee383f83240` |
| #153 | Notification surface compatibility no longer invokes canonical notification rendering/settings work | `14f23d54548eef7e6fcf89acddfcded255ebeb58` |

PR #144 was a test-only correction and changed no production behavior.

## Latest completed batch — PR #153

Production-loaded notification code previously had two layers initiating the same notification work:

- `app-notification-center.js` already owned notification settings loading, render coalescing, readiness/profile/device refreshes, profile/activity observers, and explicit user actions;
- `app-notification-surface-fix.js` independently called the owner’s public `render()` and `loadSettings()` methods from startup timers, profile observers, readiness/profile/device events, soft refresh, and direct compatibility synchronization.

PR #153 now:

- makes `app-notification-surface-fix.js` a profile-cache compatibility layer only;
- removes every compatibility-layer call into canonical notification render/settings ownership;
- preserves activity-profile HTML caching, restoration, observer/timer recovery, soft-refresh cache synchronization, service-worker registration, and cached action routing;
- removes serialized listener-bound markers before caching so restored action buttons receive live listeners;
- preserves canonical notification settings, preference writes, push behavior, explicit `require()` fallback, profile/activity notification cards, and canonical identity/storage boundaries.

Startup Architecture Gate #143 passed completely on exact tested head `17611dc8fbe0cbf93bda9e6c308705ee2e621656`. Production merge: `14f23d54548eef7e6fcf89acddfcded255ebeb58`.

Known unrelated workflows remained confined to their established diagnostics: fighter-photo auditing, the permanent scoring source/runtime contract, and the Phase 4B historical architecture pin. None referenced the isolated notification compatibility runtime or proofs.

## Testing and interruption policy

CI and focused mobile-browser ownership proofs are the default merge gate.

Do **not** summon Cody for routine checkpoints, branch decisions, bot-only `main` movement, known unrelated red workflows, normal proof design, or ordinary merge authorization. Continue autonomously through audit, focused implementation, tests, exact-head verification, merge, and documentation when the evidence is complete.

Request Cody only when there is a genuine unresolved user-only or physical-only uncertainty that blocks a safe decision, such as:

- installed-app or service-worker behavior that automation cannot reproduce;
- a real primary route, sign-in, loading, or native-shell behavior change with conflicting evidence;
- an iOS lifecycle issue that cannot be resolved in Playwright;
- a product decision with two materially different valid outcomes;
- incomplete or contradictory evidence that makes merging unsafe.

When a physical test is genuinely required, state the exact unresolved uncertainty and combine all related checks into one request.

Unrelated automated odds-health, deployment, documentation, or generated-Markdown commits do not invalidate already-passing startup evidence when their changed files are proven non-overlapping.

## Known unrelated red workflows

These remain outside startup ownership unless a failure directly references an isolated changed line:

- Production Ranking Browser Smoke may stop at fighter-photo path/render audits.
- Production Ranking Pipeline and Snapshot may stop on stale ranking/roster certification expectations.
- Scoring Architecture Guardrails may stop in the existing permanent source/runtime contract.
- Validate Phase 4B Preview may stop at its historical hard-pinned architecture check.
- Picks UI Smoke may report an existing Picks product/static-contract finding.

## Exact next action

1. Verify current production `main` because automated UFC odds/deployment workflows may advance it.
2. Start another fresh production-load audit from `index.html`, the startup contract, and loaded JavaScript files.
3. Do not assume the next duplicate in advance.
4. Search remaining modules for competing identity resolution, canonical storage ownership, duplicate readiness publication, repeated full refreshes, or route/visibility/reconnect/realtime/polling paths that call the same expensive work.
5. `native-app-shell.js` remains a candidate only when production-loaded evidence demonstrates a duplicate. `fresh-home-launch.js` and `app-notification-surface-fix.js` are now covered by permanent ownership proofs.
6. Prove one narrow duplicate, name the canonical owner and passive consumer, record every trigger/retry path and existing coalescing behavior, then make the smallest isolated change.
7. Add focused static and mobile-browser ownership proofs, wire them into Startup Architecture Gate, run the complete gate, inspect unrelated reds, and merge under the CI-first policy.
8. Continue autonomously. Contact Cody only under the genuine unresolved-uncertainty rule above.
9. Close Phase 2 only after the production-loaded modules contain no unproved competing identity, access, readiness, route, notification, or full-refresh owner.

## Stop conditions

Stop or redesign an isolated candidate if:

- the duplicate cannot be demonstrated from production-loaded code;
- removal loses a legitimate recovery path;
- identity-dependent RPCs can begin before published identity;
- an explicit sign-in or admin action stops working;
- one accepted action produces zero or multiple RPCs;
- readiness, route, visibility, reconnect, realtime, polling, or direct paths cannot be safely coalesced;
- the correction requires unrelated product, route, scoring, data, native-shell, visual, or Supabase-contract changes;
- automated evidence remains conflicting or incomplete.
