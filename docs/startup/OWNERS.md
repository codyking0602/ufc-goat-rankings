# Startup Ownership Inventory

This file records the canonical owner of each startup responsibility after Phase 1 and the completed Phase 2 work through PR #146.

Detailed history:

- [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md)
- [`PHASE-2-ROUTE-OWNERSHIP-AUDIT.md`](./PHASE-2-ROUTE-OWNERSHIP-AUDIT.md)
- [`PHASE-2-IDENTITY-PROFILE-OWNERSHIP-AUDIT.md`](./PHASE-2-IDENTITY-PROFILE-OWNERSHIP-AUDIT.md)
- [`PHASE-2-CLOSEOUT.md`](./PHASE-2-CLOSEOUT.md)

## Ownership rules

- One responsibility has one canonical owner.
- A passive consumer may use published state and readiness/update events, but may not recreate the owner’s resolution, persistence, publication, or full-refresh work.
- Passive identity consumers should read `UFC_PLAY_PROFILE.identity` or `UFC_APP_PROFILE.identity` and wait for `ufc-play-profile-ready`, `ufc-app-profile-updated`, or a feature-specific event.
- Passive consumers must not call `UFC_PLAY_PROFILE.resolve()`, `UFC_APP_PROFILE.resolve()`, or a shared helper that resolves identity merely to begin background work.
- Passive consumers must not read canonical member/admin/group/room tokens from local storage.
- Explicit user actions may call `UFC_PLAY_PROFILE.require()` when sign-in is genuinely required.
- Identity-dependent RPC work must not begin before published identity exists.
- Multiple startup, route, readiness, visibility, online, realtime, timer, observer, and direct-call triggers must share one in-flight or coalesced refresh boundary when they target the same expensive work.
- A runtime batch changes one narrow responsibility only.
- `assets/js/app.js` is a structural manifest singleton and must not receive a standard IIFE guard.
- Temporary repair layers remain separate until Phase 3 proves they can be removed.

## Canonical owners and passive consumers

| Responsibility | Canonical owner | Current boundary |
|---|---|---|
| Earliest installed-app route normalization | `assets/js/fresh-home-route-bootstrap.js` | Synchronous URL/startup normalization owner; guarded in Phase 1 |
| Primary destination and ranking-subview activation | `assets/js/octagon-hq-shell.js` via `UFC_APP_SHELL` | Sole primary route activator after PRs #128–#129 |
| Missing-shell route handoff | `assets/js/product-architecture.js` | May queue one accepted intent while the shell is missing; never activates the route itself |
| Legacy navigation-grid presentation cleanup | `assets/js/octagon-hq-nav-grid.js` | Presentation synchronization only; not a route chooser |
| Base ranking rendering and global UI APIs | `assets/js/app.js` | Structural singleton; legacy primary-tab listener removed in PR #129 |
| Calculated production scoring startup | `assets/js/production-ranking-bootstrap.js` via `UFC_PRODUCTION_RANKING_BOOTSTRAP_LIFECYCLE` | Canonical `start`/`retry`/`apply`/`refresh` owner; duplicate execution coalesced |
| Shared profile credentials, login, access persistence, identity cache, and readiness | `assets/js/play-profile-identity.js` via `UFC_PLAY_PROFILE` | Canonical shared identity owner; returning-member Picks login delegated here in PR #131 |
| Legacy group-token migration | `assets/js/app-canonical-group.js` | Historical-token adoption and one-time canonicalization only; separate from passive consumers |
| Visible profile editing and full app-profile group snapshot | `assets/js/app-profile.js` via `UFC_APP_PROFILE` | Editor/presentation owner; one full group snapshot when needed after PR #136 |
| Picks returning-member card and PIN management | `assets/js/picks-member-pin.js` | UI, validation, continuation, member PIN, and commissioner PIN owner; no credential RPC or access persistence ownership |
| Picks base runtime | `assets/js/picks.js` | Picks event/room/render owner; duplicate-file execution protected in Phase 1 |
| Picks internal section routing | `assets/js/picks-internal-navigation.js` | Nested Picks Home/Event/Settings owner; not a primary app route owner |
| Product cross-feature Picks handoff | `assets/js/product-architecture.js` | Duplicate-card suppression, GOAT26 route handoff, and PIN-surface refresh only; no canonical access writes after PR #133 |
| Community directory, profiles, and Top 10 | `assets/js/community-profiles.js` | Owns Community snapshot/render/save RPCs; passive identity consumer after PRs #132 and #138 |
| Home dashboard and official daily reconciliation | `assets/js/home-dashboard.js` | Owns Home rendering and daily reconciliation; passive identity consumer with one in-flight sync after PR #139 |
| Profile challenge inbox and challenge actions | `assets/js/profile-challenges.js` | Background inbox is passive/coalesced; explicit send/open actions retain canonical sign-in boundaries after PR #137 |
| Notification settings, devices, preferences, and rendering | `assets/js/app-notification-center.js` | Feature owner; passive cache/readiness identity consumption after PRs #134 and #140; explicit actions may use `require()` |
| Picks social profile/reminders | `assets/js/picks-social-retention.js` | Passive identity consumer; one in-flight social snapshot after PR #141 |
| Picks season summary/recap/reminders | `assets/js/picks-season-loop.js` | Passive member/admin identity consumer; one coalesced request set after PR #143 |
| War Room board data, posts, reactions, and deletion | `assets/js/octagon-message-board.js` | Passive identity consumer after PR #145; visible SIGN IN is the intentional `require()` boundary |
| War Room access status and Cody access administration | `assets/js/octagon-access-panel.js` | Passive identity consumer after PR #146; one access-status in-flight owner; admin roster/toggles reuse published token |
| Play base runtime | `assets/js/play.js` | Canonical Top 10 and base Blind Resume owner; prerequisite-aware Phase 1 guard |
| Play game hub | `assets/js/play-hub.js` | Canonical internal Play game-navigation owner; separate from primary app routing |
| Notification/profile surface compatibility | `assets/js/app-notification-surface-fix.js` | Temporary compatibility layer; removal belongs to Phase 3 after proof |
| Mobile bottom navigation, badges, transitions, pull-to-refresh | `assets/js/native-app-shell.js` | Canonical mobile presentation owner; delegates route activation to the shell |
| Mobile/native compatibility repairs | `assets/js/native-app-shell-stability.js` | Temporary repair layer; removal belongs to Phase 3 |
| Sharing and incoming share routing | `assets/js/share-deep-links.js` | Canonical share/deep-link orchestrator; delegates destination activation |
| Late startup and Picks continuation | `assets/js/fresh-home-launch.js` | Late launch/reminder owner; route-classification overlap remains a future isolated audit candidate, not authorization for broad removal |

## Completed Phase 2 ownership results

### Route ownership

- PR #128 added one canonical missing-shell handoff.
- PR #129 removed the legacy `app.js` primary-tab listener.
- `octagon-hq-shell.js` is the sole primary route activator.

### Identity and access ownership

- PR #131 centralized returning-member Picks authentication in `UFC_PLAY_PROFILE`.
- PRs #132–#133 removed Community and Product canonical access persistence.
- PRs #134 and #140 moved notifications from editor/storage/resolver ownership to passive cache/readiness consumption.
- PR #135 reduced Product startup to one identity handoff.
- PR #136 made App Profile the single full group-snapshot owner.
- PRs #137–#139 made challenges, Community, and Home passive identity consumers.
- PRs #141 and #143 made Picks social and season work passive consumers.
- PRs #145–#146 made the War Room board and access panel passive consumers.
- PR #142 was an unmerged earlier Octagon-access draft and is superseded by PR #146.

## Dynamic-loading boundaries

Dynamic loading remains permitted only where ownership and timing are explicit:

- the app shell may load Play daily support after Play opens;
- fresh launch may load the profile setup reminder after route selection;
- Product Architecture may recover a missing shell API and queue one route handoff;
- production ranking bootstrap may load its ordered canonical calculation dependencies through its stable lifecycle owner.

Dynamic loading must not create a replacement identity, route, notification, profile, Picks, War Room, native-shell, share, or ranking owner.

## Remaining Phase 2 work

Phase 2 is not declared complete. Continue with fresh production-loaded-file audits one responsibility at a time.

Potential areas include remaining identity/access readers, duplicate refresh/lifecycle handoffs, repeated feature RPCs, and startup classification overlap. Do not assume a candidate is duplicated until every trigger and recovery path is proved.

Do not begin broad Phase 3 repair-loop removal while an unresolved Phase 2 duplicate remains.

## Permanent stop boundary

No ownership boundary may be consolidated when:

- the alleged duplicate cannot be demonstrated;
- the secondary path is a legitimate recovery owner;
- removal changes cached versus uncached behavior;
- background work begins before published identity;
- explicit sign-in behavior changes;
- one accepted action produces zero or multiple RPCs;
- the fix requires unrelated product, scoring, data, route, schema, native-shell, or visual changes.
