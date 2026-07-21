# Phase 2 Duplicate-Ownership Progress — 2026-07-21

## Current production position

- Production `main`: `31297afb6af98c6e777306fd61b9fe48d566ce35`.
- Entire startup cleanup: approximately 87% complete.
- Phase 2: approximately 95% complete.
- Phase 0 and Phase 1: complete.
- Visible product change: none intended or approved.

## Completed Phase 2 sequence

| PR | Narrow responsibility | Result |
|---:|---|---|
| #125 | Document primary route ownership before runtime removal | Audit merged |
| #127 | Record failed proof that rejected unsafe listener removal | Stop condition documented |
| #128 | Queue recovery-window navigation in the canonical shell | Merged and physically verified |
| #129 | Remove legacy `app.js` primary-tab activation | Merged and physically verified |
| #130 | Document identity/profile ownership | Audit merged |
| #131 | Delegate Picks returning-member login to `UFC_PLAY_PROFILE` | Merged |
| #132 | Remove Community-owned shared Picks access and route synchronization | Merged |
| #133 | Remove Product-owned canonical profile access persistence | Merged |
| #134 | Remove notification-owned canonical storage and editor resolution | Merged |
| #135 | Prevent duplicate Product startup profile handoff | Merged |
| #136 | Make App Profile the single full group-snapshot owner | Merged |
| #137 | Make profile-challenge inbox a passive identity consumer | Merged |
| #138 | Make Community Profiles a passive identity consumer | Merged |
| #139 | Make Home daily synchronization a passive identity consumer | Merged |
| #140 | Make notification settings fully passive during startup | Merged |
| #141 | Make Picks social profile/reminders a passive identity consumer | Merged |
| #143 | Make Picks season loading a passive identity consumer | Merged |
| #144 | Repair a stale Home static-proof boundary | Test-only merge |
| #145 | Make War Room message board a passive identity consumer | `52aef7a0b24d9cc06a891b3e4f23a457bd4b6b02` |
| #146 | Make War Room access panel passive and coalesce access checks | `cc75ef4371196ea89a79aa7ff14f759a252a4dd4` |
| #147 | Update permanent Phase 2 status and CI-first policy | `18909e139165581102df949bf02cb73ff9e8b04a` |
| #149 | Make War Room notifications passive, coalesce activity checks, and prevent installed-app stale runtime | `31297afb6af98c6e777306fd61b9fe48d566ce35` |

## Canonical identity boundary

`assets/js/play-profile-identity.js` owns:

- current and legacy shared login RPC selection;
- credential verification;
- resolved identity cache;
- group/member/admin/room access persistence;
- active-group/display-name persistence;
- canonical readiness publication;
- explicit `require()` behavior.

Passive consumers use cached identity and readiness/update events. They do not independently resolve identity, read canonical access storage, publish readiness, or trigger the visible profile editor merely to obtain identity.

## Permanent ownership proofs

Startup Architecture Gate now protects:

- canonical shell recovery and sole route activation;
- canonical login delegation;
- Community access and identity ownership;
- Product access persistence and one startup handoff;
- App Profile single group snapshot;
- Home daily passive identity;
- profile-challenge passive inbox loading;
- notification settings passive identity;
- Picks social passive identity;
- Picks season passive identity;
- War Room board passive identity;
- War Room access passive identity and one access-status request owner;
- War Room notification passive identity and one activity-status request owner;
- iOS route stability;
- profile sign-in stability;
- delayed Home/community stability.

## PR #149 validation record

- Final tested and physically checked head: `d4f7b0ce289c6cb1f33290c91a419b33ef1ef30c`.
- Startup Architecture Gate #129: passed completely.
- Production merge: `31297afb6af98c6e777306fd61b9fe48d566ce35`.
- Installed-app result: Cody reported it **looks normal**.
- The final service-worker correction added `octagon-notifications.js` to the existing network-first runtime list so the corrected source cannot remain stale.

The proof established:

- zero canonical/editor resolver or sign-in-owner calls;
- zero canonical token storage reads or storage-triggered refreshes;
- zero notification RPC work before published identity;
- one readiness-driven `octagon_activity_status` request;
- coalesced competing refreshes;
- published-token reuse for mark-seen and post/reply push invocation;
- preserved unread badge, Alerts UI, status surface, return banner, realtime, push subscription, board interception, and notification deep-link behavior.

## CI-first and interruption rule

Routine installed-iPhone checkpoints are retired. CI and focused mobile-browser proofs are the default gate.

Do not contact Cody for routine checkpoints, normal merge authorization, bot-only `main` movement, known unrelated red workflows, or ordinary proof design. Continue autonomously through audit, focused implementation, validation, merge, and documentation.

Contact Cody only when a specific unresolved user-only or physical-only uncertainty blocks a safe decision. State the exact uncertainty and combine all related checks into one request.

## Known unrelated reds

These are not startup-owner blockers unless they directly reference the isolated changed files:

- fighter-photo path/render auditing in Production Ranking Browser Smoke;
- stale roster/rank or calculated-runtime certification in Pipeline/Snapshot;
- existing permanent source/runtime diagnostics in Scoring Architecture Guardrails;
- historical hard-pinned architecture expectations in Validate Phase 4B Preview;
- existing Picks UI/static-product contract findings.

## Remaining Phase 2 work

Start a fresh production-loaded audit from current `main`; do not presume the next duplicate.

Search for one remaining competing responsibility involving identity resolution, canonical storage, readiness publication, repeated full refreshes, or overlapping route/visibility/reconnect/realtime/polling work. `native-app-shell.js`, `fresh-home-launch.js`, and `app-notification-surface-fix.js` are candidates only if the current production load map proves a duplicate.

Handle one narrow responsibility at a time. Close Phase 2 only when no unproved competing identity, access, readiness, route, or full-refresh owner remains. Do not begin broad Phase 3 repair-loop retirement before that point.