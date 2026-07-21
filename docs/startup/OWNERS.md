# Startup Ownership Inventory

_Last updated: 2026-07-21_

This file records the canonical owner of each startup responsibility. Detailed history remains in the Phase 1, Phase 2, Phase 3, and Phase 4 audits and ledgers.

## Ownership rules

- One responsibility has one canonical owner.
- Passive consumers use published caches, readiness/update events, and owner APIs.
- Passive consumers do not resolve shared identity, read canonical access storage, publish canonical readiness, or trigger full editor/group work merely to obtain identity.
- Explicit user actions may use the canonical `require()` boundary when sign-in is genuinely needed.
- Competing startup, route, visibility, reconnect, realtime, polling, and direct refresh paths share one in-flight owner when they request the same data.
- A feature-specific network owner does not perform startup or polling work while its destination is inactive unless a separate app-wide requirement is proved.
- One accepted primary route transition publishes one canonical route event; an already-active exact-view retry is a no-op.
- One accepted pull-to-refresh action performs one final activity-status refresh; subordinate fallback work may not duplicate it.
- Historical-token migration may validate and adopt a token before normal identity resolution, but it hands the resolved identity to the canonical profile owner rather than publishing canonical profile readiness.
- The canonical profile owner consumes a valid migration handoff without repeating its snapshot RPC; it retains independent resolution when migration has no result.
- Compatibility layers may preserve presentation/recovery behavior but may not initiate a canonical owner’s data or render responsibility.
- A presentation adapter may map one canonical DOM state into required mobile presentation state, but it may not independently render canonical content or wake from unrelated lifecycle events.
- One ownership or startup-work issue changes per runtime batch.
- `assets/js/app.js` is a structural manifest singleton and must not receive a standard IIFE guard.

## Canonical owners

| Responsibility | Canonical owner | Current contract |
|---|---|---|
| Earliest installed-app route normalization | `assets/js/fresh-home-route-bootstrap.js` | Synchronous startup classification only; protected against duplicate execution; does not activate a primary destination |
| Primary destination and ranking-subview activation | `assets/js/octagon-hq-shell.js` via `window.UFC_APP_SHELL` | Sole primary route owner; recovery queue is one canonical handoff; exact already-active views coalesce before DOM/hash/event work |
| Ranking data | `assets/data/ranking-data.js` | Canonical fighter/ranking source; outside startup cleanup except load order |
| Base ranking rendering and global UI APIs | `assets/js/app.js` | Exact-one structural manifest singleton; no primary-tab activation |
| Calculated production ranking lifecycle | `assets/js/production-ranking-bootstrap.js` | Canonical `start`/`retry`/`apply`/`refresh` owner with one in-flight attempt |
| Calculated fighter profile and Resume Snapshot | `assets/js/calculated-profile-runtime.js` | Sole calculated `openFighter()` and profile-content owner; one complete profile write; Resume Snapshot values come from `RANKING_DATA.visibleStats`, with canonical UFC fight facts used for the win-streak fallback |
| Fighter drawer open/close state | Base `assets/js/app.js` close/open handlers plus calculated `openFighter()` override | Canonical owners of `#drawer.open` and `aria-hidden`; they do not own the mobile body scroll-lock class |
| Mobile fighter-drawer presentation and native overlay dismissal | `assets/js/native-app-shell-stability.js` | Sole mapping from `#drawer.open` to `body.fighter-profile-open`; one startup sync; one `#drawer` `class`/`aria-hidden` observer; native destination clicks dismiss an open profile through the canonical close button or bounded fallback; no broad observer, route listener, soft-refresh listener, delayed retry, public repair schedule, or canonical content repair |
| Shared credentials, login/fallback, identity cache, canonical readiness, and canonical access persistence | `assets/js/play-profile-identity.js` via `window.UFC_PLAY_PROFILE` | Sole shared identity/access owner; consumes a valid migration handoff without repeating its snapshot and retains independent fallback resolution |
| Historical group-token migration and canonical adoption | `assets/js/app-canonical-group.js` | Pre-resolution migration owner only; validates historical access, adopts canonical/admin/room values, normalizes the URL, owns the one-time migration reload, and returns a bounded resolved-identity handoff without publishing `ufc-play-profile-ready` |
| Visible profile editor and full group snapshot | `assets/js/app-profile.js` via `window.UFC_APP_PROFILE` | Sole editor/group-snapshot owner; publishes `ufc-app-profile-updated` |
| Picks sign-in card and PIN-management surfaces | `assets/js/picks-member-pin.js` | UI, validation/status, continuation, member PIN, and commissioner PIN owner; credentials delegate to canonical profile owner |
| Picks base runtime | `assets/js/picks.js` | Canonical Picks room/event/pick/render owner; startup compatibility activation is subordinate to shell idempotence and may not republish an already-active primary route |
| Picks internal routing | `assets/js/picks-internal-navigation.js` | Nested Picks route owner only; not a primary app route owner |
| Picks commissioner snapshot and commissioner actions | `assets/js/picks-commissioner.js` | Sole commissioner snapshot/action owner; local card shell may install at startup, but network state loads only after Picks is active and the card exists; route entry and late card mount provide bounded activation; 45-second freshness polling is active-Picks-only; explicit actions retain forced refreshes |
| Play base runtime | `assets/js/play.js` | Canonical base Play owner after DOM/data prerequisites |
| Play internal game navigation | `assets/js/play-hub.js` | Canonical Play game-screen owner after hub prerequisites |
| Home rendering and Ranking Spotlight | `assets/js/home-dashboard.js` | Sole Home/Spotlight readiness, deterministic selection, placeholder, markup, route re-entry, visibility recovery, and duplicate-markup suppression owner; official daily sync consumes cached identity only |
| Community directory, member profiles, and Top 10 | `assets/js/community-profiles.js` | Canonical community owner; passive identity consumer; explicit Top 10 editing may require sign-in |
| Cross-feature profile/Picks handoffs | `assets/js/product-architecture.js` | Compatibility/handoff owner only; no canonical access persistence or duplicate startup profile handoff |
| Late route/reminder continuation | `assets/js/fresh-home-launch.js` | Late launch and Picks-continuation owner; consumes the shell’s published destination and skips a same-destination handoff; retains legitimate bare-invite recovery |
| Notification settings, push registration, preferences, and canonical notification rendering | `assets/js/app-notification-center.js` | Sole notification settings/render owner; passive identity consumer for startup/settings; explicit user actions may use canonical `require()` |
| Notification/profile surface compatibility | `assets/js/app-notification-surface-fix.js` | Profile-cache presentation compatibility only; may cache/restore activity HTML and bind cached actions but may not call canonical notification render/settings work |
| App-wide quick synchronization | `assets/js/app-update-watcher.js` | Canonical app quick-sync owner for the normal path; does not perform the native pull action’s final activity-status refresh |
| What’s New trigger markup, unread badge, and trigger binding | `assets/js/app-update-watcher.js` | Sole owner of update-control creation, labeled **NEW** markup, unread calculation, badge text/visibility/class, accessibility labels, seen/storage synchronization, and trigger binding |
| What Changed overlay and feed | `assets/js/what-changed.js` | Sole overlay/feed render, open/close, entry action, and mark-all-seen owner; does not create or normalize the header trigger |
| Mobile bottom navigation, badges, transitions, and pull-to-refresh presentation | `assets/js/native-app-shell.js` | Native presentation and accepted pull-action owner; performs one initial component/route/badge synchronization, then uses canonical route/update events, targeted DOM observation, resize/orientation, visibility recovery, and a separate 10-second live badge poll; no 80/260/800/1800/4200 ms startup resynchronization array; delegates route activation, prefers canonical quick sync, and performs one final activity-status refresh after either normal or fallback sync |
| Sharing and incoming supported deep links | `assets/js/share-deep-links.js` | Canonical share/deep-link orchestrator; delegates destination activation |
| Profile challenge inbox, actions, and routing | `assets/js/profile-challenges.js` | Passive inbox identity consumer with one in-flight load; explicit actions may require sign-in |
| Picks social profile/reminder snapshot | `assets/js/picks-social-retention.js` | Passive identity consumer with one in-flight snapshot owner |
| Picks season summary/events/social/room loading | `assets/js/picks-season-loop.js` | Passive identity consumer with coalesced season request set |
| War Room message board | `assets/js/octagon-message-board.js` | Passive identity consumer; visible **SIGN IN** button is its one explicit canonical `require()` boundary |
| War Room membership/access status and Cody’s access-management panel | `assets/js/octagon-access-panel.js` | Passive identity consumer; one in-flight access-status owner; no direct sign-in or storage ownership |
| War Room activity/unread/mark-seen/realtime/push behavior | `assets/js/octagon-notifications.js` | Passive identity consumer and canonical activity-status owner; one in-flight activity-status request; push enable/disable reuses published identity; no resolver or canonical-storage ownership |

## Permanent ownership and startup-work proofs

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
- What’s New trigger markup and unread state with no stability-layer normalization;
- drawer/body synchronization through one startup sync and one drawer-only observer;
- absence of body-wide observation, route/soft-refresh drawer repair, delayed drawer retries, close-button continuation, and public repair scheduling;
- canonical close-button behavior plus native-destination overlay dismissal and fallback;
- profile-challenge passive inbox loading;
- notification settings passive identity;
- notification/profile compatibility passive ownership and live cached-action restoration;
- Picks social and season passive identity;
- Picks commissioner zero-work Home startup, active route entry, late card mount, active-only polling, and off-screen silence;
- War Room board, access, and notification passive identity with their request owners;
- one initial native component/route/badge synchronization with zero repeated startup work through the former 4.2-second retry window;
- native late challenge, Picks-progress, War Room unread, and route updates through owner events or targeted observation;
- preservation of the separate 10-second native live badge poll;
- native pull normal, fallback, War Room, and concurrent accepted-action ownership;
- iOS route stability and delayed Home/community/profile behavior.

Passive, subordinate, or inactive-destination paths must produce:

- zero canonical/editor resolver calls;
- zero canonical token storage reads;
- zero sign-in surfaces before an explicit user action;
- zero identity-dependent RPCs before published identity;
- zero commissioner snapshot RPCs while Picks is inactive;
- zero unconditional native component, active-route, or badge resynchronization after the initial startup pass;
- one request owner for competing refresh paths;
- zero compatibility-layer calls into canonical notification settings or render ownership;
- zero stability-layer Ranking Spotlight mutations;
- zero stability-layer fighter-profile or Resume Snapshot content mutations;
- zero stability-layer What’s New markup or unread-state mutations;
- zero body-wide, route-driven, soft-refresh-driven, delayed, or public drawer repair triggers;
- exactly one final activity-status refresh for one accepted pull action;
- exactly one snapshot validation across a successful migration-to-canonical-identity handoff.

## Route contract

- `octagon-hq-shell.js` alone mutates primary active destination and ranking subview state.
- Recovery-window navigation is queued and consumed by the canonical shell.
- Incoming deep links and nested Picks/Play routes delegate to their intended destination owners.
- Late launch continuation checks the shell’s published destination before requesting a handoff.
- Repeating the exact active view does not re-toggle the DOM, rewrite route state unnecessarily, or republish `octagon-hq:view-change`.
- Bare Picks group/room invitations still receive one necessary Home-to-Picks recovery handoff.
- Native destination overlay dismissal may close an open profile before route delegation, but it may not choose or republish the destination.
- `octagon-hq-shell.js` remains network-first in the service worker so installed clients receive the corrected owner.

## Completed cleanup boundaries

- Phase 1 established idempotent owners.
- Phase 2 removed demonstrated duplicate route, identity, profile, access, notification, and refresh ownership.
- Phase 3 removed duplicate Spotlight, Resume Snapshot, and What’s New repairs; retired the body-wide observer, route/soft-refresh repair listeners, six delayed retries, close-button continuation, and public repair API; retained only the proved drawer/body mapping, drawer-only observer, and native overlay dismissal.
- Phase 4 established a measured production startup-work inventory, removed Home-startup/hidden-mutation/off-screen commissioner snapshot work, and retired five unconditional native component/route/badge startup resynchronization passes while preserving owner-driven updates and live polling.

Further movement or renaming of the minimal native presentation adapter belongs to later startup/script-manifest simplification, not repair-loop retirement.

## Testing and interruption policy

CI and focused mobile-browser proofs are the normal merge gate.

Do not contact Cody for routine checkpoints, bot-only `main` movement, known unrelated red workflows, ordinary proof design, or normal merge authorization. Continue autonomously when evidence is complete.

Request Cody only for a named unresolved user-only or physical-only risk involving installed cache/service worker, primary route/sign-in/loading/native-shell behavior, unreproducible iOS lifecycle behavior, a real product choice, or conflicting evidence.
