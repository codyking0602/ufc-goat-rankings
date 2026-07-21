# Startup Architecture Status

_Last updated: 2026-07-21_

## Current position

- **Production `main`:** `cc75ef4371196ea89a79aa7ff14f759a252a4dd4`.
- **Current phase:** Phase 2 — remove duplicate ownership.
- **Phase 0:** Complete.
- **Phase 1:** Complete.
- **Phase 2:** Approximately 92% complete.
- **Entire startup cleanup:** Approximately 86% complete.
- **Visible product changes approved:** None. The zero-visible-change contract remains in force.
- **Master tracker:** [Issue #102](https://github.com/codyking0602/ufc-goat-rankings/issues/102).
- **Current Phase 2 ledger:** [`PHASE-2-PROGRESS-20260721.md`](./PHASE-2-PROGRESS-20260721.md).

The previous 50–58% estimates predated the main Phase 2 runtime sequence and are superseded by this file.

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
- The permanent startup contract rejects reintroduction of competing primary route activation.

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
| #145 | War Room message board is a passive identity consumer; its visible **SIGN IN** button remains explicit | Merged as `52aef7a0b24d9cc06a891b3e4f23a457bd4b6b02` |
| #146 | War Room access panel is a passive identity consumer with one access-status request owner | Merged as `cc75ef4371196ea89a79aa7ff14f759a252a4dd4` |

PR #144 was a test-only correction to keep the Home ownership contract helper-agnostic. It changed no production behavior.

## Current testing policy

CI and focused mobile-browser ownership proofs are the default merge gate.

A routine installed-iPhone checkpoint is no longer required after more than 25 consecutive Normal physical results. Request a physical test only when a specific unresolved physical-only risk remains, such as:

- service-worker or installed-app cache behavior;
- a real primary-route, sign-in, loading, or native-shell behavior change;
- iOS lifecycle behavior that cannot be reproduced in the browser harness;
- conflicting, flaky, or incomplete automated evidence.

When a physical test is required, record the exact unresolved uncertainty and combine related checks into one test.

Unrelated automated odds-health or deployment commits advancing `main` do not invalidate an already-passing startup head when their changed files are proven non-overlapping.

## Latest completed batch — PR #146

`assets/js/octagon-access-panel.js` previously:

- called `UFC_PLAY_PROFILE.resolve()` from passive access checks, roster loading, and access toggles;
- fell back to `ufc-picks:group:GOAT26` in `localStorage`;
- reacted directly to canonical-token storage changes;
- allowed startup timers, readiness events, visibility resume, reconnect, realtime, polling, and direct calls to compete for `octagon_access_status`;
- scheduled a second unconditional access check after every readiness event.

PR #146 now:

- consumes only published cached identity;
- derives access only from the published member token;
- shares one in-flight access-status Promise;
- performs one readiness-driven check;
- preserves Cody’s Manage Beta panel, roster, access toggles, realtime broadcasts, periodic verification, and War Room tab gating.

Startup Architecture Gate #125 passed completely on unchanged rerun. The fully tested runtime/test head was `f5429e69e13643f2af9275a7813cf0842f2fc89d`; the final PR head differed only by the required generated Octagon Verdict Markdown timestamp.

## Known unrelated red workflows

These remain outside startup ownership unless a failure directly references an isolated changed line:

- Production Ranking Browser Smoke may stop at fighter-photo path/render audits.
- Production Ranking Pipeline and Snapshot may stop on stale ranking/roster certification expectations.
- Scoring Architecture Guardrails may stop in the existing permanent source/runtime contract.
- Validate Phase 4B Preview may stop at its historical hard-pinned architecture check.
- Picks UI Smoke may report an existing Picks product/static-contract finding.

The current Startup Architecture Gate contains the maintained route, identity, profile, notification, Picks, War Room, iOS-route, sign-in, and delayed-stability proofs.

## Exact next action

1. Start from current production `main` and verify its exact SHA.
2. Audit `assets/js/octagon-notifications.js` as the strongest remaining production-loaded identity/access candidate.
3. Do not assume it is wrong: trace its identity resolution, token ownership, readiness listeners, startup timers, visibility/reconnect work, RPCs, and in-flight behavior first.
4. If duplicate ownership is proven, make only the smallest passive-consumer correction.
5. Add a focused static contract and mobile-browser proof, run the complete Startup Architecture Gate, inspect unrelated reds, and merge under the CI-first policy.
6. Continue the remaining refresh/lifecycle audit one responsibility at a time.
7. Close Phase 2 only after the production-loaded modules no longer contain an unproved competing identity, access, readiness, route, or full-refresh owner.

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
