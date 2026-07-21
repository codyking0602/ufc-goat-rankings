# Startup Ownership Inventory

_Last updated: 2026-07-21_

This file records the canonical owner of each startup responsibility. Detailed history remains in the Phase 1, completed Phase 2, and current Phase 3 audits and ledgers.

## Ownership rules

- One responsibility has one canonical owner.
- Passive consumers use published caches, readiness/update events, and owner APIs.
- Passive consumers do not resolve shared identity, read canonical access storage, publish canonical readiness, or trigger full editor/group work merely to obtain identity.
- Explicit user actions may use the canonical `require()` boundary when sign-in is genuinely needed.
- Competing startup, route, visibility, reconnect, realtime, polling, and direct refresh paths share one in-flight owner when they request the same data.
- One accepted primary route transition publishes one canonical route event; an already-active exact-view retry is a no-op.
- One accepted pull-to-refresh action performs one final activity-status refresh; subordinate fallback work may not duplicate it.
- Historical-token migration may validate and adopt a token before normal identity resolution, but it hands the resolved identity to the canonical profile owner rather than publishing canonical profile readiness.
- The canonical profile owner consumes a valid migration handoff without repeating its snapshot RPC; it retains independent resolution when migration has no result.
- Compatibility layers may preserve presentation/recovery behavior but may not initiate a canonical owner’s data or render responsibility.
- A repair layer may react to a real replacement/lifecycle event, but it may not independently render canonical state merely because startup was historically unreliable.
- One ownership issue changes per runtime batch.
- `assets/js/app.js` is a structural manifest singleton and must not receive a standard IIFE guard.
- Compatibility and repair layers may not expand; their target-by-target retirement belongs to Phase 3 after source behavior is covered.

## Canonical owners

| Responsibility | Canonical owner | Current contract |
|---|---|---|
| Earliest installed-app route normalization | `assets/js/fresh-home-route-bootstrap.js` | Synchronous startup classification only; protected against duplicate execution; does not activate a primary destination |
| Primary destination and ranking-subview activation | `assets/js/octagon-hq-shell.js` via `window.UFC_APP_SHELL` | Sole primary route owner; recovery queue is one canonical handoff; exact already-active views coalesce before DOM/hash/event work |
| Ranking data | `assets/data/ranking-data.js` | Canonical fighter/ranking source; outside startup cleanup except load order |
| Base ranking rendering and global UI APIs | `assets/js/app.js` | Exact-one structural manifest singleton; no primary-tab activation |
| Calculated production ranking lifecycle | `assets/js/production-ranking-bootstrap.js` | Canonical `start`/`retry`/`apply`/`refresh` owner with one in-flight attempt |
| Calculated fighter profile and Resume Snapshot | `assets/js/calculated-profile-runtime.js` | Sole calculated `openFighter()` and profile-content owner; one complete profile write; Resume Snapshot values come from `RANKING_DATA.visibleStats`, with canonical UFC fight facts used for the win-streak fallback |
| Shared credentials, login/fallback, identity cache, canonical readiness, and canonical access persistence | `assets/js/play-profile-identity.js` via `window.UFC_PLAY_PROFILE` | Sole shared identity/access owner; consumes a valid migration handoff without repeating its snapshot and retains independent fallback resolution |
| Historical group-token migration and canonical adoption | `assets/js/app-canonical-group.js` | Pre-resolution migration owner only; validates historical access, adopts canonical/admin/room values, normalizes the URL, owns the one-time migration reload, and returns a bounded resolved-identity handoff without publishing `ufc-play-profile-ready` |
| Visible profile editor and full group snapshot | `assets/js/app-profile.js` via `window.UFC_APP_PROFILE` | Sole editor/group-snapshot owner; publishes `ufc-app-profile-updated` |
| Picks sign-in card and PIN-management surfaces | `assets/js/picks-member-pin.js` | UI, validation/status, continuation, member PIN, and commissioner PIN owner; credentials delegate to canonical profile owner |
| Picks base runtime | `assets/js/picks.js` | Canonical Picks room/event/pick/render owner; startup compatibility activation is subordinate to shell idempotence and may not republish an already-active primary route |
| Picks internal routing | `assets/js/picks-internal-navigation.js` | Nested Picks route owner only; not a primary app route owner |
| Play base runtime | `assets/js/play.js` | Canonical base Play owner after DOM/data prerequisites |
| Play internal game navigation | `assets/js/play-hub.js` | Canonical Play game-screen owner after hub prerequisites |
| Home rendering and Ranking Spotlight | `assets/js/home-dashboard.js` | Sole Home/Spotlight readiness, deterministic selection, placeholder, markup, route re-entry, visibility recovery, and duplicate-markup suppression owner; official daily sync consumes cached identity only |
| Community directory, member profiles, and Top 10 | `assets/js/community-profiles.js` | Canonical community owner; passive identity consumer; explicit Top 10 editing may require sign-in |
| Cross-feature profile/Picks handoffs | `assets/js/product-architecture.js` | Compatibility/handoff owner only; no canonical access persistence or duplicate startup profile handoff |
| Late route/reminder continuation | `assets/js/fresh-home-launch.js` | Late launch and Picks-continuation owner; consumes the shell’s published destination and skips a same-destination handoff; retains legitimate bare-invite recovery |
| Notification settings, push registration, preferences, and canonical notification rendering | `assets/js/app-notification-center.js` | Sole notification settings/render owner; passive identity consumer for startup/settings; explicit user actions may use canonical `require()` |
| Notification/profile surface compatibility | `assets/js/app-notification-surface-fix.js` | Profile-cache presentation compatibility only; may cache/restore activity HTML and bind cached actions but may not call canonical notification render/settings work |
| App-wide quick synchronization | `assets/js/app-update-watcher.js` | Canonical app quick-sync owner for the normal path; does not perform the native pull action’s final activity-status refresh |
| Mobile bottom navigation, badges, transitions, and pull-to-refresh presentation | `assets/js/native-app-shell.js` | Native presentation and accepted pull-action owner; delegates route activation, prefers canonical quick sync, and performs one final activity-status refresh after either normal or fallback sync |
| Mobile/native repair behavior | `assets/js/native-app-shell-stability.js` | Temporary target-specific presentation repair layer; no Ranking Spotlight or calculated fighter-profile content ownership after PRs #159 and #161; retained drawer/body, native overlay dismissal, **What’s New**, route/soft-refresh, observer, and bounded delayed-startup paths remain Phase 3 candidates only after focused proof |
| Sharing and incoming supported deep links | `assets/js/share-deep-links.js` | Canonical share/deep-link orchestrator; delegates destination activation |
| Profile challenge inbox, actions, and routing | `assets/js/profile-challenges.js` | Passive inbox identity consumer with one in-flight load; explicit actions may require sign-in |
| Picks social profile/reminder snapshot | `assets/js/picks-social-retention.js` | Passive identity consumer with one in-flight snapshot owner |
| Picks season summary/events/social/room loading | `assets/js/picks-season-loop.js` | Passive identity consumer with coalesced season request set |
| War Room message board | `assets/js/octagon-message-board.js` | Passive identity consumer; visible **SIGN IN** button is its one explicit canonical `require()` boundary |
| War Room membership/access status and Cody’s access-management panel | `assets/js/octagon-access-panel.js` | Passive identity consumer; one in-flight access-status owner; no direct sign-in or storage ownership |
| War Room activity/unread/mark-seen/realtime/push behavior | `assets/js/octagon-notifications.js` | Passive identity consumer and canonical activity-status owner; one in-flight activity-status request; push enable/disable reuses published identity; no resolver or canonical-storage ownership |

## Permanent ownership proofs

Startup Architecture Gate protects:

- canonical shell recovery and sole primary route activation;
- exact same-view route coalescing and late launch ownership;
- canonical login delegation and profile sign-in stability;
- historical-token migration handoff, canonical-token adoption, schema fallback, repeated resolution, and independent canonical fallback;
- Community access and passive identity ownership;
- Product access persistence and one startup handoff;
- App Profile single group snapshot;
- Home daily passive identity;
- Home/Ranking Spotlight canonical readiness and rendering with no stability-layer repair;
- calculated fighter-profile and Resume Snapshot ownership with no stability-layer content repair;
- profile-challenge passive inbox loading;
- notification settings passive identity;
- notification/profile compatibility passive ownership and live cached-action restoration;
- Picks social and season passive identity;
- War Room board, access, and notification passive identity with their request owners;
- native pull normal, fallback, War Room, and concurrent accepted-action ownership;
- iOS route stability and delayed Home/community/profile stability.

Passive or subordinate paths must produce:

- zero canonical/editor resolver calls;
- zero canonical token storage reads;
- zero sign-in surfaces before an explicit user action;
- zero identity-dependent RPCs before published identity;
- one request owner for competing refresh paths;
- zero compatibility-layer calls into canonical notification settings or render ownership;
- zero repair-layer Ranking Spotlight mutations before or after canonical ranking readiness;
- zero repair-layer fighter-profile or Resume Snapshot content mutations;
- exactly one final activity-status refresh for one accepted pull action;
- exactly one snapshot validation across a successful migration-to-canonical-identity handoff.

## Route contract

- `octagon-hq-shell.js` alone mutates primary active destination and ranking subview state.
- Recovery-window navigation is queued and consumed by the canonical shell.
- Incoming deep links and nested Picks/Play routes delegate to their intended destination owners.
- Late launch continuation checks the shell’s published destination before requesting a handoff.
- Repeating the exact active view does not re-toggle the DOM, rewrite route state unnecessarily, or republish `octagon-hq:view-change`.
- Bare Picks group/room invitations still receive one necessary Home-to-Picks recovery handoff.
- Presentation observers and repairs may synchronize state but may not choose a competing primary route.
- `octagon-hq-shell.js` remains network-first in the service worker so installed clients receive the corrected owner.

## Phase 2 closure

The final production-load audit after PR #157 found no remaining demonstrated competing identity, access, readiness, route, notification, or full-refresh owner. Phase 2 is complete.

## Phase 3 current boundary

- PR #159 removed the duplicate Ranking Spotlight renderer from `native-app-shell-stability.js`. `home-dashboard.js` has permanent static and mobile-browser proof covering cold/delayed startup, readiness, repeated events, route/visibility recovery, refresh, and stable delayed observation.
- PR #161 removed the duplicate Resume Snapshot writer and its profile-content observer target. `calculated-profile-runtime.js` has permanent static and mobile-browser proof covering canonical open, current calculated values, observer/route/soft-refresh/delayed stability, intentional content corruption, canonical reopen, drawer/body synchronization, and native-destination dismissal.

The remaining stability behaviors are not presumed obsolete. Each must receive its own canonical-owner trace and recovery proof before removal or narrowing.

## Testing and interruption policy

CI and focused mobile-browser proofs are the normal merge gate.

Do not contact Cody for routine checkpoints, bot-only `main` movement, known unrelated red workflows, ordinary proof design, or normal merge authorization. Continue autonomously when evidence is complete.

Request Cody only for a named unresolved user-only or physical-only risk involving installed cache/service worker, primary route/sign-in/loading/native-shell behavior, unreproducible iOS lifecycle behavior, a real product choice, or conflicting evidence.
