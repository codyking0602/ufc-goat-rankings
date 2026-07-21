# Startup Ownership Inventory

_Last updated: 2026-07-21_

This file records the canonical owner of each startup responsibility. Detailed history remains in the Phase 1, completed Phase 2, and current Phase 3 ledgers.

## Ownership rules

- One responsibility has one canonical owner.
- Passive consumers use published caches, readiness/update events, and owner APIs.
- Passive consumers do not resolve shared identity, read canonical access storage, publish canonical readiness, or trigger full editor/group work merely to obtain identity.
- Explicit user actions may use the canonical `require()` boundary when sign-in is genuinely needed.
- Competing startup, route, visibility, reconnect, realtime, polling, and direct refresh paths share one in-flight owner when they request the same data.
- One accepted primary route transition publishes one canonical route event; an already-active exact-view retry is a no-op.
- One accepted pull-to-refresh action performs one final activity-status refresh.
- Compatibility layers may preserve presentation/recovery behavior but may not initiate a canonical owner’s data or render responsibility.
- A repair layer may react to a real replacement/lifecycle event, but it may not independently render canonical state merely because startup was historically unreliable.
- One ownership issue changes per runtime batch.
- `assets/js/app.js` is a structural manifest singleton and must not receive a standard IIFE guard.
- Compatibility and repair layers may not expand; target-by-target retirement belongs to Phase 3 after source behavior is covered.

## Canonical owners

| Responsibility | Canonical owner | Current contract |
|---|---|---|
| Earliest installed-app route normalization | `assets/js/fresh-home-route-bootstrap.js` | Synchronous startup classification only; protected against duplicate execution; does not activate a primary destination |
| Primary destination and ranking-subview activation | `assets/js/octagon-hq-shell.js` via `window.UFC_APP_SHELL` | Sole primary route owner; recovery queue is one canonical handoff; exact already-active views coalesce before DOM/hash/event work |
| Ranking data | `assets/data/ranking-data.js` | Canonical fighter/ranking source; outside startup cleanup except load order |
| Base ranking rendering and global UI APIs | `assets/js/app.js` | Exact-one structural manifest singleton; no primary-tab activation |
| Calculated production ranking lifecycle | `assets/js/production-ranking-bootstrap.js` | Canonical `start`/`retry`/`apply`/`refresh` owner with one in-flight attempt |
| Calculated fighter profile and Resume Snapshot | `assets/js/calculated-profile-runtime.js` | Sole calculated `openFighter()` and profile-content owner; one complete profile write; visible snapshot stats come from calculated ranking data with canonical UFC facts used for win-streak fallback |
| Shared credentials, login/fallback, identity cache, canonical readiness, and canonical access persistence | `assets/js/play-profile-identity.js` via `window.UFC_PLAY_PROFILE` | Sole shared identity/access owner; consumes a valid migration handoff without repeating its snapshot and retains independent fallback resolution |
| Historical group-token migration and canonical adoption | `assets/js/app-canonical-group.js` | Pre-resolution migration owner only; validates historical access, adopts canonical values, normalizes the URL, owns the one-time migration reload, and returns a bounded resolved-identity handoff |
| Visible profile editor and full group snapshot | `assets/js/app-profile.js` via `window.UFC_APP_PROFILE` | Sole editor/group-snapshot owner; publishes `ufc-app-profile-updated` |
| Picks sign-in card and PIN-management surfaces | `assets/js/picks-member-pin.js` | UI, validation/status, continuation, member PIN, and commissioner PIN owner; credentials delegate to canonical profile owner |
| Picks base runtime | `assets/js/picks.js` | Canonical Picks room/event/pick/render owner; startup compatibility activation is subordinate to shell idempotence |
| Picks internal routing | `assets/js/picks-internal-navigation.js` | Nested Picks route owner only; not a primary app route owner |
| Play base runtime | `assets/js/play.js` | Canonical base Play owner after DOM/data prerequisites |
| Play internal game navigation | `assets/js/play-hub.js` | Canonical Play game-screen owner after hub prerequisites |
| Home rendering and Ranking Spotlight | `assets/js/home-dashboard.js` | Sole Home/Spotlight readiness, selection, placeholder, markup, route re-entry, visibility recovery, and duplicate-markup suppression owner |
| Community directory, member profiles, and Top 10 | `assets/js/community-profiles.js` | Canonical community owner; passive identity consumer; explicit Top 10 editing may require sign-in |
| Cross-feature profile/Picks handoffs | `assets/js/product-architecture.js` | Compatibility/handoff owner only; no canonical access persistence or duplicate startup profile handoff |
| Late route/reminder continuation | `assets/js/fresh-home-launch.js` | Late launch and Picks-continuation owner; consumes the shell’s published destination and skips a same-destination handoff |
| Notification settings, push registration, preferences, and canonical notification rendering | `assets/js/app-notification-center.js` | Sole notification settings/render owner; passive identity consumer for startup/settings; explicit user actions may use canonical `require()` |
| Notification/profile surface compatibility | `assets/js/app-notification-surface-fix.js` | Profile-cache presentation compatibility only; may restore cached activity presentation but may not call canonical notification settings/render work |
| App update control, What’s New markup/unread state, and normal quick synchronization | `assets/js/app-update-watcher.js` | Sole `manualRefreshControl`, `whatsNewBtn`, label, unread badge, click binding, seen/storage synchronization, and unread accessibility owner; also owns canonical normal-path quick sync |
| Mobile bottom navigation, badges, transitions, and pull-to-refresh presentation | `assets/js/native-app-shell.js` | Native presentation and accepted pull-action owner; delegates routing, prefers canonical quick sync, and performs one final activity-status refresh |
| Mobile/native repair behavior | `assets/js/native-app-shell-stability.js` | Temporary drawer-presentation recovery only after PRs #159, #161, and #163; no Spotlight, fighter-profile content, or What’s New markup/unread ownership; retained drawer/body synchronization, native overlay dismissal, route/soft-refresh, observer, and delayed-startup paths require focused proof |
| Sharing and incoming supported deep links | `assets/js/share-deep-links.js` | Canonical share/deep-link orchestrator; delegates destination activation |
| Profile challenge inbox, actions, and routing | `assets/js/profile-challenges.js` | Passive inbox identity consumer with one in-flight load; explicit actions may require sign-in |
| Picks social profile/reminder snapshot | `assets/js/picks-social-retention.js` | Passive identity consumer with one in-flight snapshot owner |
| Picks season summary/events/social/room loading | `assets/js/picks-season-loop.js` | Passive identity consumer with coalesced season request set |
| War Room message board | `assets/js/octagon-message-board.js` | Passive identity consumer; visible **SIGN IN** button is its explicit canonical `require()` boundary |
| War Room membership/access status and Cody’s access-management panel | `assets/js/octagon-access-panel.js` | Passive identity consumer; one in-flight access-status owner |
| War Room activity/unread/mark-seen/realtime/push behavior | `assets/js/octagon-notifications.js` | Passive identity consumer and canonical activity-status owner; one in-flight activity-status request |

## Permanent ownership proofs

Startup Architecture Gate and the dedicated iOS suite protect:

- canonical shell recovery, sole routing, same-view coalescing, and late launch ownership;
- canonical login, migration handoff, profile, group snapshot, and passive identity boundaries;
- Home/Ranking Spotlight canonical readiness and rendering with zero stability-layer repair;
- calculated fighter-profile and Resume Snapshot ownership with zero stability-layer content repair;
- canonical What’s New control markup, unread state, click binding, seen/storage synchronization, and zero stability-layer update-control writes;
- notification, Picks, Community, War Room, and native pull request ownership;
- iOS route stability and delayed Home/community/profile/update-control stability.

Passive or subordinate paths must produce:

- zero duplicate identity resolution, canonical storage reads, or premature sign-in surfaces;
- zero repair-layer Ranking Spotlight mutations;
- zero repair-layer fighter-profile or Resume Snapshot mutations;
- zero repair-layer What’s New markup or unread-state mutations;
- one request owner for competing refresh paths;
- exactly one final activity-status refresh for one accepted pull action.

## Route contract

- `octagon-hq-shell.js` alone mutates primary active destination and ranking subview state.
- Recovery-window navigation is queued and consumed by the canonical shell.
- Incoming deep links and nested Picks/Play routes delegate to their intended owners.
- Repeating the exact active view does not republish route work.
- Presentation observers and repairs may synchronize state but may not choose a competing route.
- `octagon-hq-shell.js` remains network-first in the service worker.

## Phase 3 current boundary

- PR #159 removed the duplicate Ranking Spotlight renderer and Home/readiness triggers.
- PR #161 removed the duplicate Resume Snapshot writer and profile-content observer target.
- PR #163 made `app-update-watcher.js` the sole complete What’s New control markup/unread owner and removed update-control access from the stability layer.

The remaining stability behaviors are not presumed obsolete. Drawer/body synchronization and native-destination overlay dismissal must be audited separately before narrowing the final observer, route/soft-refresh listeners, scheduler, or delayed startup passes.

## Testing and interruption policy

CI and focused mobile-browser proofs are the normal merge gate. Continue autonomously through routine audit, implementation, exact-head verification, merge, and documentation. Request Cody only for a named user-only or physical-only risk, conflicting primary behavior, or a genuine product decision.