# Startup Ownership Inventory

_Last updated: 2026-07-21_

This file records the canonical owner of each startup responsibility. Detailed history remains in the Phase 1 and Phase 2 audits and the current progress ledger.

## Ownership rules

- One responsibility has one canonical owner.
- Passive consumers use published caches, readiness/update events, and owner APIs.
- Passive consumers do not resolve shared identity, read canonical access storage, publish canonical readiness, or trigger full editor/group work merely to obtain identity.
- Explicit user actions may use the canonical `require()` boundary when sign-in is genuinely needed.
- Competing startup, route, visibility, reconnect, realtime, polling, and direct refresh paths share one in-flight owner when they request the same data.
- One accepted primary route transition publishes one canonical route event; an already-active exact-view retry is a no-op.
- One accepted pull-to-refresh action performs one final activity-status refresh; subordinate fallback work may not duplicate it.
- Compatibility layers may preserve presentation/recovery behavior but may not initiate a canonical owner’s data or render responsibility.
- One ownership issue changes per runtime batch.
- `assets/js/app.js` is a structural manifest singleton and must not receive a standard IIFE guard.
- Compatibility and repair layers may not expand; their retirement belongs to Phase 3 after source behavior is covered.

## Canonical owners

| Responsibility | Canonical owner | Current contract |
|---|---|---|
| Earliest installed-app route normalization | `assets/js/fresh-home-route-bootstrap.js` | Synchronous startup classification only; protected against duplicate execution; does not activate a primary destination |
| Primary destination and ranking-subview activation | `assets/js/octagon-hq-shell.js` via `window.UFC_APP_SHELL` | Sole primary route owner; recovery queue is one canonical handoff; exact already-active views coalesce before DOM/hash/event work |
| Ranking data | `assets/data/ranking-data.js` | Canonical fighter/ranking source; outside startup cleanup except load order |
| Base ranking rendering and global UI APIs | `assets/js/app.js` | Exact-one structural manifest singleton; no primary-tab activation |
| Calculated production ranking lifecycle | `assets/js/production-ranking-bootstrap.js` | Canonical `start`/`retry`/`apply`/`refresh` owner with one in-flight attempt |
| Shared credentials, login/fallback, identity cache, readiness, and canonical access persistence | `assets/js/play-profile-identity.js` via `window.UFC_PLAY_PROFILE` | Sole shared identity/access owner |
| Legacy group-token migration and canonical adoption | `assets/js/app-canonical-group.js` | Pre-resolution migration owner only; not a general identity consumer |
| Visible profile editor and full group snapshot | `assets/js/app-profile.js` via `window.UFC_APP_PROFILE` | Sole editor/group-snapshot owner; publishes `ufc-app-profile-updated` |
| Picks sign-in card and PIN-management surfaces | `assets/js/picks-member-pin.js` | UI, validation/status, continuation, member PIN, and commissioner PIN owner; credentials delegate to canonical profile owner |
| Picks base runtime | `assets/js/picks.js` | Canonical Picks room/event/pick/render owner; startup compatibility activation is subordinate to shell idempotence and may not republish an already-active primary route |
| Picks internal routing | `assets/js/picks-internal-navigation.js` | Nested Picks route owner only; not a primary app route owner |
| Play base runtime | `assets/js/play.js` | Canonical base Play owner after DOM/data prerequisites |
| Play internal game navigation | `assets/js/play-hub.js` | Canonical Play game-screen owner after hub prerequisites |
| Home rendering | `assets/js/home-dashboard.js` | Canonical Home renderer; official daily sync consumes cached identity only |
| Community directory, member profiles, and Top 10 | `assets/js/community-profiles.js` | Canonical community owner; passive identity consumer; explicit Top 10 editing may require sign-in |
| Cross-feature profile/Picks handoffs | `assets/js/product-architecture.js` | Compatibility/handoff owner only; no canonical access persistence or duplicate startup profile handoff |
| Late route/reminder continuation | `assets/js/fresh-home-launch.js` | Late launch and Picks-continuation owner; consumes the shell’s published destination and skips a same-destination handoff; retains legitimate bare-invite recovery |
| Notification settings, push registration, preferences, and canonical notification rendering | `assets/js/app-notification-center.js` | Sole notification settings/render owner; passive identity consumer for startup/settings; explicit user actions may use canonical `require()` |
| Notification/profile surface compatibility | `assets/js/app-notification-surface-fix.js` | Profile-cache presentation compatibility only; may cache/restore activity HTML and bind cached actions but may not call canonical notification render/settings work |
| App-wide quick synchronization | `assets/js/app-update-watcher.js` | Canonical app quick-sync owner for the normal path; does not perform the native pull action’s final activity-status refresh |
| Mobile bottom navigation, badges, transitions, and pull-to-refresh presentation | `assets/js/native-app-shell.js` | Native presentation and accepted pull-action owner; delegates route activation, prefers canonical quick sync, and performs one final activity-status refresh after either normal or fallback sync |
| Mobile/native repair behavior | `assets/js/native-app-shell-stability.js` | Temporary repair layer; Phase 3 removal candidate |
| Sharing and incoming supported deep links | `assets/js/share-deep-links.js` | Canonical share/deep-link orchestrator; delegates destination activation |
| Profile challenge inbox, actions, and routing | `assets/js/profile-challenges.js` | Passive inbox identity consumer with one in-flight load; explicit actions may require sign-in |
| Picks social profile/reminder snapshot | `assets/js/picks-social-retention.js` | Passive identity consumer with one in-flight snapshot owner |
| Picks season summary/events/social/room loading | `assets/js/picks-season-loop.js` | Passive identity consumer with coalesced season request set |
| War Room message board | `assets/js/octagon-message-board.js` | Passive identity consumer; visible **SIGN IN** button is its one explicit canonical `require()` boundary |
| War Room membership/access status and Cody’s access-management panel | `assets/js/octagon-access-panel.js` | Passive identity consumer; one in-flight access-status owner; no direct sign-in or storage ownership |
| War Room activity/unread/mark-seen/realtime/push behavior | `assets/js/octagon-notifications.js` | Passive identity consumer and canonical activity-status owner; one in-flight activity-status request; push enable/disable reuses published identity; no resolver or canonical-storage ownership |

## Passive identity, notification, and refresh contract

Permanent static and browser/runtime ownership proofs now cover:

- Community Profiles;
- Home official daily synchronization;
- notification settings and notification/profile compatibility;
- profile-challenge inbox;
- Picks social profile/reminders;
- Picks season loop;
- War Room message board;
- War Room access panel;
- War Room notifications;
- native pull-to-refresh normal, fallback, War Room, and concurrent paths.

Their passive or subordinate paths must produce:

- zero canonical/editor resolver calls;
- zero canonical token storage reads;
- zero sign-in surfaces before an explicit user action;
- zero identity-dependent RPCs before published identity;
- one request owner for competing refresh paths;
- zero compatibility-layer calls into canonical notification settings or render ownership;
- exactly one final activity-status refresh for one accepted pull action.

The notification compatibility proof additionally requires cached activity-profile restoration and restored action routing to remain functional without serialized stale listener markers.

The native pull proof additionally requires the fallback to retain daily, leaderboard, challenge inbox, notification settings, active War Room board, Home rendering, and soft-refresh work while leaving activity status to the accepted action’s final refresh.

## Route contract

- `octagon-hq-shell.js` alone mutates primary active destination and ranking subview state.
- Recovery-window navigation is queued and consumed by the canonical shell.
- Incoming deep links and nested Picks/Play routes delegate to their intended destination owners.
- Late launch continuation checks the shell’s published destination before requesting a handoff.
- Repeating the exact active view does not re-toggle the DOM, rewrite route state unnecessarily, or republish `octagon-hq:view-change`.
- Bare Picks group/room invitations still receive one necessary Home-to-Picks recovery handoff.
- Presentation observers and repairs may synchronize state but may not choose a competing primary route.
- `octagon-hq-shell.js` remains network-first in the service worker so installed clients receive the corrected owner.

## Testing and interruption policy

CI and focused mobile-browser proofs are the normal merge gate.

Do not contact Cody for routine checkpoints, bot-only `main` movement, known unrelated red workflows, ordinary proof design, or normal merge authorization. Continue autonomously when evidence is complete.

Request Cody only for a named unresolved user-only or physical-only risk involving installed cache/service worker, primary route/sign-in/loading/native-shell behavior, unreproducible iOS lifecycle behavior, a real product choice, or conflicting evidence.

## Remaining Phase 2 order

1. Perform one final fresh production-load audit; do not assume another duplicate.
2. Re-scan remaining identity/readiness/refresh/lifecycle hotspots one responsibility at a time.
3. `fresh-home-launch.js`, `app-notification-surface-fix.js`, and `native-app-shell.js` are under permanent ownership proof.
4. If no new competing owner can be demonstrated, document the clean audit and close Phase 2.
5. Begin Phase 3 repair-loop retirement only after Phase 2 closes.

Do not combine these areas into a broad refactor.
