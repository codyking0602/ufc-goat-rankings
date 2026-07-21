# Startup Architecture Status

_Last updated: 2026-07-21_

## Current position

- **Production `main`:** `fc0b21d8558ba20849460c8dcc01bee383f83240`.
- **Latest startup runtime merge:** PR #151, `fc0b21d8558ba20849460c8dcc01bee383f83240`.
- **Current phase:** Phase 2 — remove duplicate ownership.
- **Phase 0:** Complete.
- **Phase 1:** Complete.
- **Phase 2:** Approximately 98% complete.
- **Entire startup cleanup:** Approximately 89% complete.
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
- The permanent startup contract rejects competing primary route activation and now proves that one accepted route transition publishes one event while an already-active retry publishes none.

### Phase 2 — identity, profile, access, and passive consumers

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

PR #144 was a test-only correction and changed no production behavior.

## Latest completed batch — PR #151

Production-loaded startup code previously allowed the canonical shell to select Home or Picks and then receive the same destination again from subordinate startup compatibility paths:

- `fresh-home-launch.js` delegated a late Home or Picks activation after the shell had already selected it;
- the existing Picks startup compatibility click could request Picks again on a Picks reload;
- a browser Picks reload therefore published two identical `octagon-hq:view-change` events and repeated downstream route-triggered work.

PR #151 now:

- makes `octagon-hq-shell.js` coalesce an exact already-active view before DOM, hash, or event work;
- makes `fresh-home-launch.js` consume the shell’s published destination and skip a same-destination handoff;
- preserves the necessary bare group/room invite recovery where the shell legitimately transitions from Home to Picks;
- preserves rapid real navigation, missing-shell recovery, disabled War Room behavior, ranking subviews, Play support loading, and all existing route destinations;
- keeps `octagon-hq-shell.js` network-first in the installed app and rotates the service-worker cache.

Startup Architecture Gate #139 passed completely on exact tested head `d79db8ef2275a289e3e9538faa9c125a87dfd004`. The dedicated mobile route workflow also passed on that exact head. Production merge: `fc0b21d8558ba20849460c8dcc01bee383f83240`.

Known unrelated workflows remained confined to their established diagnostics: fighter-photo auditing, the permanent scoring source/runtime contract, and the Phase 4B historical architecture pin. None referenced the isolated route files.

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
5. `native-app-shell.js` and `app-notification-surface-fix.js` remain candidates only when production-loaded evidence demonstrates a duplicate; `fresh-home-launch.js` is now covered by the route-ownership proof.
6. Prove one narrow duplicate, name the canonical owner and passive consumer, record every trigger/retry path and existing coalescing behavior, then make the smallest isolated change.
7. Add focused static and mobile-browser ownership proofs, wire them into Startup Architecture Gate, run the complete gate, inspect unrelated reds, and merge under the CI-first policy.
8. Continue autonomously. Contact Cody only under the genuine unresolved-uncertainty rule above.
9. Close Phase 2 only after the production-loaded modules contain no unproved competing identity, access, readiness, route, or full-refresh owner.

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
