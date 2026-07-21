# Phase 2 Duplicate-Ownership Progress — 2026-07-21

## Current production position

- Production `main`: `14f23d54548eef7e6fcf89acddfcded255ebeb58`.
- Entire startup cleanup: approximately 90% complete.
- Phase 2: approximately 99% complete.
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
| #150 | Update permanent status after passive notifications | `3d8b71761a4b502b97befe3b3a6f5de6f7d6ab8f` |
| #151 | Deduplicate canonical startup route activation and preserve legitimate invite recovery | `fc0b21d8558ba20849460c8dcc01bee383f83240` |
| #152 | Update permanent status after route ownership cleanup | `7f44188513109148c7347afdcb8d3a15b39f3cd7` |
| #153 | Make notification/profile surface compatibility passive | `14f23d54548eef7e6fcf89acddfcded255ebeb58` |

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

## Canonical route boundary

`assets/js/octagon-hq-shell.js` owns primary destination and ranking-subview activation.

The route contract now requires:

- `fresh-home-route-bootstrap.js` may classify and normalize startup URL state but does not activate a primary destination;
- subordinate continuations delegate to `UFC_APP_SHELL` rather than mutating primary view state;
- one real accepted transition publishes one `octagon-hq:view-change` event;
- an exact already-active view request coalesces before DOM, hash, and event work;
- a bare Picks group/room invitation retains one legitimate Home-to-Picks recovery transition;
- missing-shell recovery remains one queued canonical handoff;
- the canonical shell remains network-first for installed-app freshness.

## Canonical notification boundary

`assets/js/app-notification-center.js` owns:

- notification settings RPC work;
- profile/activity notification rendering and render coalescing;
- readiness, profile-update, device-change, and observer-driven refreshes;
- preference writes, push registration/removal, test delivery, and explicit identity fallback.

`assets/js/app-notification-surface-fix.js` is now a passive profile-cache compatibility layer. It may cache and restore activity-profile HTML, observe profile surfaces, synchronize its cache on soft refresh, register the current service worker, and bind cached action routes. It may not invoke canonical notification render/settings work.

## Permanent ownership proofs

Startup Architecture Gate now protects:

- canonical shell recovery and sole route activation;
- exact same-view route coalescing;
- late Home/Picks continuation ownership;
- ordinary Home startup, browser Picks reload, direct route handoffs, and bare Picks invite recovery;
- canonical login delegation;
- Community access and identity ownership;
- Product access persistence and one startup handoff;
- App Profile single group snapshot;
- Home daily passive identity;
- profile-challenge passive inbox loading;
- notification settings passive identity;
- notification/profile compatibility passive ownership and live cached-action restoration;
- Picks social passive identity;
- Picks season passive identity;
- War Room board passive identity;
- War Room access passive identity and one access-status request owner;
- War Room notification passive identity and one activity-status request owner;
- iOS route stability;
- profile sign-in stability;
- delayed Home/community stability.

## PR #153 validation record

- Final exact tested head: `17611dc8fbe0cbf93bda9e6c308705ee2e621656`.
- Startup Architecture Gate #143: passed completely.
- Production merge: `14f23d54548eef7e6fcf89acddfcded255ebeb58`.
- Changed runtime responsibility: notification/profile compatibility only.

The focused static and browser proof established:

- the canonical notification center loads before its compatibility consumer;
- the compatibility layer makes zero public notification `loadSettings()` or `render()` calls during startup timers;
- readiness and profile updates each produce exactly one canonical notification-settings RPC;
- soft refresh, profile mutation, profile-chip clicks, and direct compatibility sync produce zero notification-settings RPCs and zero public render/settings calls;
- passive startup performs zero canonical/editor resolver calls and zero canonical access-storage reads;
- explicit notification actions retain canonical `require()` fallback;
- cached activity-profile HTML restores without canonical notification markup;
- cached action buttons remain live after restoration because serialized listener-bound markers are removed before caching.

Known unrelated workflow failures remained outside the isolated branch:

- Production Ranking Browser Smoke stopped at fighter-photo path auditing;
- Scoring Architecture Guardrails stopped at the existing permanent source/runtime contract;
- Validate Phase 4B Preview stopped at the historical stable-architecture pin.

None referenced the isolated notification compatibility runtime or proof files.

## CI-first and interruption rule

Routine installed-iPhone checkpoints are retired. CI and focused mobile-browser proofs are the default gate.

Do not contact Cody for routine checkpoints, normal merge authorization, bot-only `main` movement, known unrelated red workflows, or ordinary proof design. Continue autonomously through audit, focused implementation, validation, merge, and documentation.

Contact Cody only when a specific unresolved user-only or physical-only uncertainty blocks a safe decision. State the exact uncertainty and combine all related checks into one request.

## Remaining Phase 2 work

Start another fresh production-loaded audit from current `main`; do not presume the next duplicate.

Search for one remaining competing responsibility involving identity resolution, canonical storage, readiness publication, repeated full refreshes, or overlapping route/visibility/reconnect/realtime/polling work. `native-app-shell.js` remains a candidate only if the current production load map proves a duplicate. `fresh-home-launch.js` and `app-notification-surface-fix.js` are now covered by permanent ownership contracts.

Handle one narrow responsibility at a time. Close Phase 2 only when no unproved competing identity, access, readiness, route, notification, or full-refresh owner remains. Do not begin broad Phase 3 repair-loop retirement before that point.
