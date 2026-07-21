# Startup Ownership Inventory

_Last updated: 2026-07-21_

This file records the canonical owner of each startup responsibility. Detailed history remains in the Phase 1 and Phase 2 audits and the current progress ledger:

- [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md)
- [`PHASE-2-ROUTE-OWNERSHIP-AUDIT.md`](./PHASE-2-ROUTE-OWNERSHIP-AUDIT.md)
- [`PHASE-2-IDENTITY-PROFILE-OWNERSHIP-AUDIT.md`](./PHASE-2-IDENTITY-PROFILE-OWNERSHIP-AUDIT.md)
- [`PHASE-2-PROGRESS-20260721.md`](./PHASE-2-PROGRESS-20260721.md)

## Ownership rules

- One responsibility has one canonical owner.
- Passive consumers use published caches, readiness/update events, and owner APIs.
- Passive consumers do not resolve shared identity, read canonical access storage, publish canonical readiness, or trigger full editor/group work merely to obtain identity.
- Explicit user actions may use the canonical `require()` boundary when sign-in is genuinely needed.
- Competing startup, route, visibility, reconnect, realtime, polling, and direct refresh paths share one in-flight owner when they request the same data.
- One ownership issue changes per runtime batch.
- `assets/js/app.js` is a structural manifest singleton and must not receive a standard IIFE guard.
- Compatibility and repair layers may not expand; their retirement belongs to Phase 3 after source behavior is covered.

## Canonical owners

| Responsibility | Canonical owner | Current contract |
|---|---|---|
| Earliest installed-app route normalization | `assets/js/fresh-home-route-bootstrap.js` | Synchronous startup classification only; protected against duplicate execution |
| Primary destination and ranking-subview activation | `assets/js/octagon-hq-shell.js` via `window.UFC_APP_SHELL` | Sole primary route owner; recovery queue is one canonical handoff |
| Ranking data | `assets/data/ranking-data.js` | Canonical fighter/ranking source; outside startup cleanup except load order |
| Base ranking rendering and global UI APIs | `assets/js/app.js` | Exact-one structural manifest singleton; no primary-tab activation |
| Calculated production ranking lifecycle | `assets/js/production-ranking-bootstrap.js` | Canonical `start`/`retry`/`apply`/`refresh` owner with one in-flight attempt |
| Shared credentials, login/fallback, identity cache, readiness, and canonical access persistence | `assets/js/play-profile-identity.js` via `window.UFC_PLAY_PROFILE` | Sole shared identity/access owner |
| Legacy group-token migration and canonical adoption | `assets/js/app-canonical-group.js` | Pre-resolution migration owner only; not a general identity consumer |
| Visible profile editor and full group snapshot | `assets/js/app-profile.js` via `window.UFC_APP_PROFILE` | Sole editor/group-snapshot owner; publishes `ufc-app-profile-updated` |
| Picks sign-in card and PIN-management surfaces | `assets/js/picks-member-pin.js` | UI, validation/status, continuation, member PIN, and commissioner PIN owner; credentials delegate to canonical profile owner |
| Picks base runtime | `assets/js/picks.js` | Canonical Picks room/event/pick/render owner |
| Picks internal Home/Event/Settings routing | `assets/js/picks-internal-navigation.js` | Nested Picks route owner only; not a primary app route owner |
| Play base runtime | `assets/js/play.js` | Canonical base Play owner after DOM/data prerequisites |
| Play internal game navigation | `assets/js/play-hub.js` | Canonical Play game-screen owner after hub prerequisites |
| Home rendering | `assets/js/home-dashboard.js` | Canonical Home renderer; official daily sync consumes cached identity only |
| Community directory, member profiles, and Top 10 | `assets/js/community-profiles.js` | Canonical community owner; passive identity consumer; explicit Top 10 editing may require sign-in |
| Cross-feature profile/Picks handoffs | `assets/js/product-architecture.js` | Compatibility/handoff owner only; no canonical access persistence or duplicate startup profile handoff |
| Late route/reminder continuation | `assets/js/fresh-home-launch.js` | Late launch and Picks-continuation owner; broad removal remains unapproved until separately audited |
| Notification settings, push registration, preferences, and canonical notification rendering | `assets/js/app-notification-center.js` | Passive identity consumer for startup/settings; explicit user actions may use canonical `require()` |
| Notification/profile surface compatibility | `assets/js/app-notification-surface-fix.js` | Temporary compatibility layer; Phase 3 removal candidate |
| Mobile bottom navigation, badges, transitions, and pull-to-refresh presentation | `assets/js/native-app-shell.js` | Native presentation owner; delegates route activation to app shell |
| Mobile/native repair behavior | `assets/js/native-app-shell-stability.js` | Temporary repair layer; Phase 3 removal candidate |
| Sharing and incoming supported deep links | `assets/js/share-deep-links.js` | Canonical share/deep-link orchestrator; delegates destination activation |
| Profile challenge inbox, challenge actions, and challenge routing | `assets/js/profile-challenges.js` | Passive inbox identity consumer with one in-flight load; explicit actions may require sign-in |
| Picks social profile/reminder snapshot | `assets/js/picks-social-retention.js` | Passive identity consumer with one in-flight snapshot owner |
| Picks season summary/events/social/room loading | `assets/js/picks-season-loop.js` | Passive identity consumer with coalesced season request set |
| War Room message board | `assets/js/octagon-message-board.js` | Passive identity consumer; visible **SIGN IN** button is its one explicit canonical `require()` boundary |
| War Room membership/access status and Cody’s access-management panel | `assets/js/octagon-access-panel.js` | Passive identity consumer; one in-flight access-status owner; no direct sign-in or storage ownership |
| War Room notification behavior | `assets/js/octagon-notifications.js` | Production-loaded owner not yet fully normalized in Phase 2; next audit candidate, not presumed incorrect |

## Passive identity contract

The following production consumers have permanent static and browser/runtime ownership proofs:

- Community Profiles;
- Home official daily synchronization;
- notification settings;
- profile-challenge inbox;
- Picks social profile/reminders;
- Picks season loop;
- War Room message board;
- War Room access panel.

Their passive paths must produce:

- zero canonical/editor resolver calls;
- zero canonical token storage reads;
- zero sign-in surfaces before an explicit user action;
- zero identity-dependent RPCs before published identity;
- one request owner for competing refresh paths.

## Route contract

- `octagon-hq-shell.js` alone mutates primary active destination and ranking subview state.
- Recovery-window navigation is queued and consumed by the canonical shell.
- Incoming deep links and nested Picks/Play routes delegate to their intended destination owners.
- Presentation observers and repairs may synchronize state but may not choose a competing primary route.

## Testing policy

CI and focused mobile-browser proofs are the normal merge gate.

Request installed-iPhone verification only when there is a named unresolved physical-only risk involving installed cache/service worker, primary route/sign-in/loading/native-shell behavior, unreproducible iOS lifecycle behavior, or conflicting automated evidence.

A later unrelated bot/odds commit does not invalidate tested startup evidence when its files are proven non-overlapping.

## Remaining Phase 2 order

1. Audit `assets/js/octagon-notifications.js` for identity resolution, canonical storage ownership, readiness handling, and repeated refresh work.
2. Audit the remaining production-loaded refresh/lifecycle candidates one responsibility at a time, including `native-app-shell.js`, `fresh-home-launch.js`, and `app-notification-surface-fix.js` only where duplicate ownership is proven.
3. Close Phase 2 documentation when no unproved competing identity, access, readiness, route, or full-refresh owner remains.
4. Begin Phase 3 repair-loop retirement only after Phase 2 closes.

Do not combine these areas into a broad refactor.
