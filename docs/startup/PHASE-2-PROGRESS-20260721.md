# Phase 2 Duplicate-Ownership Progress — 2026-07-21

## Final production position

- Production `main`: `ba2c24f6c22333a73a041d59aa8aef9bdd5642a3`.
- Entire startup cleanup: approximately 92% complete.
- Phase 2: complete.
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
| #154 | Update permanent status after notification compatibility cleanup | `9fc4e7ec3d87fc69f4b4c49edec1bfb2da0b6040` |
| #155 | Deduplicate native pull activity-status refresh | `a727a38540cd78a12f6035632c5b9e7016bea18c` |
| #156 | Update permanent status after native pull ownership cleanup | `a31b81e9798ea829ee52dadb198828954b9d245e` |
| #157 | Reuse the validated canonical-migration identity handoff instead of repeating the same snapshot | `ba2c24f6c22333a73a041d59aa8aef9bdd5642a3` |

## Locked canonical boundaries

### Identity

`assets/js/play-profile-identity.js` owns:

- current and legacy shared login RPC selection;
- explicit credential verification;
- resolved identity cache;
- group/member/admin/room access persistence;
- active-group/display-name persistence;
- canonical `ufc-play-profile-ready` publication;
- explicit `require()` behavior;
- independent canonical snapshot fallback when no migration result exists.

`assets/js/app-canonical-group.js` owns only pre-resolution historical-token migration:

- historical token discovery and validation;
- canonical group/admin/room adoption;
- canonical URL normalization;
- migration-specific `ufc-canonical-group-ready` publication;
- existing one-time reload and loop protection;
- a bounded already-resolved identity handoff to the canonical owner.

A successful migration handoff is not snapshotted again. The migration layer does not publish canonical profile readiness.

### Profile

`assets/js/app-profile.js` owns the visible profile editor, full group snapshot, profile presentation changes, and `ufc-app-profile-updated`.

Passive consumers use cached identity and readiness/update events. They do not independently resolve identity, read canonical access storage, publish readiness, or trigger visible editor/group work merely to obtain identity.

### Routing

`assets/js/octagon-hq-shell.js` owns primary destination and ranking-subview activation.

- one real accepted transition publishes one `octagon-hq:view-change` event;
- an exact already-active request coalesces before DOM, hash, and event work;
- a bare Picks group/room invitation retains one legitimate Home-to-Picks recovery transition;
- missing-shell recovery remains one queued canonical handoff.

### Notifications and refresh

- `assets/js/app-notification-center.js` owns notification settings and rendering.
- `assets/js/octagon-notifications.js` owns activity status, unread, mark-seen, realtime, and push behavior with one activity-status request owner.
- `assets/js/app-update-watcher.js` owns normal app-wide quick sync.
- `assets/js/native-app-shell.js` owns one accepted pull action and one final activity-status refresh after normal or fallback sync.
- compatibility and fallback layers may not repeat those canonical responsibilities.

## Permanent ownership proof coverage

Startup Architecture Gate now protects:

- canonical shell recovery, sole route activation, and exact same-view coalescing;
- late Home/Picks continuation and bare-invite recovery;
- canonical login delegation and profile sign-in stability;
- canonical migration identity handoff, historical-token adoption, schema fallback, repeated resolution, and independent canonical fallback;
- Community access and identity ownership;
- Product access persistence and one startup handoff;
- App Profile single group snapshot;
- Home daily passive identity;
- profile-challenge passive inbox loading;
- notification settings passive identity;
- notification/profile compatibility passive ownership and live cached-action restoration;
- Picks social and season passive identity;
- War Room board, access, and notification passive identity with one request owner each;
- native pull normal, Home fallback, War Room fallback, and concurrent accepted-action ownership;
- iOS route stability and delayed Home/community stability.

## PR #157 validation record

- Final exact tested head: `908f265dad46603b5556613effbd830214cb78d4`.
- Startup Architecture Gate #149: passed completely.
- Production merge: `ba2c24f6c22333a73a041d59aa8aef9bdd5642a3`.
- Changed runtime responsibility: migration-to-canonical identity handoff only.

The focused static and mobile-browser proof established:

- production load order keeps migration before the canonical identity owner;
- canonical and historical tokens are each validated exactly once before canonical identity reuse;
- current snapshot and legacy schema-fallback snapshot paths both produce the bounded handoff;
- repeated `UFC_PLAY_PROFILE.resolve()` calls reuse the canonical cache and publish profile readiness once;
- migration-specific readiness remains separate from canonical profile readiness;
- canonical group, display-name, room-token, admin-token, and active-group adoption remain intact;
- independent canonical snapshot fallback remains when migration has no candidate;
- explicit current login and legacy login fallback remain unchanged;
- one-time migration reload and loop protection remain intact.

Known unrelated workflow failures remained outside the isolated branch:

- Production Ranking Browser Smoke stopped at fighter-photo path auditing;
- Scoring Architecture Guardrails stopped at the existing permanent source/runtime contract.

Neither referenced the isolated identity runtime or proof files.

## Phase 2 closure audit

The production load map was rebuilt after PR #157 from current `index.html`. The current startup contract and production-loaded JavaScript were rechecked for competing identity resolution, canonical storage ownership, duplicate readiness publication, repeated full profile/group/inbox/notification/social/season/board/access work, and overlapping route/lifecycle refresh paths.

No additional narrow duplicate could be demonstrated without entering Phase 3 repair-loop retirement or unrelated product work. Existing compatibility layers remain named Phase 3 candidates rather than unproved Phase 2 defects.

Phase 2 is formally complete.

## Next phase

Phase 3 may begin from current production `main`.

Audit one repair behavior at a time. Identify the canonical source behavior, prove every timer/observer/startup/route/direct path, preserve legitimate recovery, add focused static and browser evidence, and remove only the proved redundant repair. Do not perform broad repair-layer cleanup.

The CI-first and interruption policy remains unchanged: continue autonomously and contact Cody only when a specific unresolved user-only or physical-only uncertainty blocks a safe decision.
