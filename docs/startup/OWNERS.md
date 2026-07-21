# Startup Ownership Inventory

_Last updated: 2026-07-21_

This file records the canonical owner of each startup responsibility. Detailed history remains in the Phase 1, Phase 2, Phase 3, and current Phase 4 audits and ledgers.

## Ownership rules

- One responsibility has one canonical owner.
- Passive consumers use published caches, readiness/update events, and owner APIs.
- Passive consumers do not resolve shared identity, read canonical access storage, publish canonical readiness, or trigger full editor/group work merely to obtain identity.
- Explicit user actions may use the canonical `require()` boundary when sign-in is genuinely needed.
- Competing startup, route, visibility, reconnect, realtime, polling, and direct refresh paths share one in-flight owner when they request the same data.
- Destination-specific network work runs only when its destination is active, unless a proved global responsibility requires otherwise.
- Direct-route startup, delayed local mount, explicit user actions, and active-view freshness remain supported when hidden startup work is removed.
- One accepted primary route transition publishes one canonical route event; an already-active exact-view retry is a no-op.
- One accepted pull-to-refresh action performs one final activity-status refresh; subordinate fallback work may not duplicate it.
- Historical-token migration may validate and adopt a token before normal identity resolution, but it hands the resolved identity to the canonical profile owner rather than publishing canonical profile readiness.
- Compatibility layers may preserve presentation/recovery behavior but may not initiate a canonical owner’s data or render responsibility.
- A presentation adapter may map one canonical DOM state into required mobile presentation state, but it may not independently render canonical content or wake from unrelated lifecycle events.
- One ownership or startup-work responsibility changes per runtime batch.
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
| Mobile fighter-drawer presentation and native overlay dismissal | `assets/js/native-app-shell-stability.js` | Sole mapping from `#drawer.open` to `body.fighter-profile-open`; one startup sync; one `#drawer` `class`/`aria-hidden` observer; native destination clicks dismiss an open profile through the canonical close button or bounded fallback; no broad repair triggers or canonical content repair |
| Shared credentials, login/fallback, identity cache, canonical readiness, and canonical access persistence | `assets/js/play-profile-identity.js` via `window.UFC_PLAY_PROFILE` | Sole shared identity/access owner; consumes a valid migration handoff without repeating its snapshot and retains independent fallback resolution |
| Historical group-token migration and canonical adoption | `assets/js/app-canonical-group.js` | Pre-resolution migration owner only; validates historical access, adopts canonical/admin/room values, normalizes the URL, owns the one-time migration reload, and returns a bounded resolved-identity handoff without publishing `ufc-play-profile-ready` |
| Visible profile editor and full group snapshot | `assets/js/app-profile.js` via `window.UFC_APP_PROFILE` | Sole editor/group-snapshot owner; publishes `ufc-app-profile-updated` |
| Picks sign-in card and PIN-management surfaces | `assets/js/picks-member-pin.js` | UI, validation/status, continuation, member PIN, and commissioner PIN owner; credentials delegate to canonical profile owner |
| Picks base runtime | `assets/js/picks.js` | Canonical Picks room/event/pick/render owner; startup compatibility activation is subordinate to shell idempotence and may not republish an already-active primary route |
| Picks commissioner card, snapshot, and actions | `assets/js/picks-commissioner.js` | Sole commissioner snapshot/action owner; installs its local card without network work; refreshes only for direct active Picks startup after card mount, canonical Picks route entry after card mount, one bounded late-card handoff, active-view freshness polling, and explicit commissioner actions; performs no Home-startup, hidden-mutation, or hidden-interval RPC work |
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
| What’s New trigger markup, unread badge, and trigger binding | `assets/js/app-update-watcher.js` | Sole owner of update-control creation, labeled **NEW** markup, unread calculation, badge text/visibility/class, accessibility labels, seen/storage synchronization, and trigger binding |
| What Changed overlay and feed | `assets/js/what-changed.js` | Sole overlay/feed render, open/close, entry action, and mark-all-seen owner; does not create or normalize the header trigger |
| Mobile bottom navigation, badges, transitions, and pull-to-refresh presentation | `assets/js/native-app-shell.js` | Native presentation and accepted pull-action owner; delegates route activation, prefers canonical quick sync, and performs one final activity-status refresh after either normal or fallback sync |
| Sharing and incoming supported deep links | `assets/js/share-deep-links.js` | Canonical share/deep-link orchestrator; delegates destination activation |
| Profile challenge inbox, actions, and routing | `assets/js/profile-challenges.js` | Passive inbox identity consumer with one in-flight load; explicit actions may require sign-in |
| Picks social profile/reminder snapshot | `assets/js/picks-social-retention.js` | Passive identity consumer with one in-flight snapshot owner |
| Picks season summary/events/social/room loading | `assets/js/picks-season-loop.js` | Passive identity consumer with coalesced season request set |
| War Room message board | `assets/js/octagon-message-board.js` | Passive identity consumer; visible **SIGN IN** button is its one explicit canonical `require()` boundary |
| War Room membership/access status and Cody’s access-management panel | `assets/js/octagon-access-panel.js` | Passive identity consumer; one in-flight access-status owner; no direct sign-in or storage ownership |
| War Room activity/unread/mark-seen/realtime/push behavior | `assets/js/octagon-notifications.js` | Passive identity consumer and canonical activity-status owner; one in-flight activity-status request; push enable/disable reuses published identity; no resolver or canonical-storage ownership |

## Permanent ownership and startup-work proofs

Startup Architecture Gate and the dedicated iOS suite protect:

- canonical shell recovery, sole route activation, same-view coalescing, and late launch ownership;
- canonical login, migration handoff, profile, group snapshot, and passive identity boundaries;
- Home/Ranking Spotlight, calculated fighter-profile, Resume Snapshot, and What’s New single-owner boundaries;
- drawer/body synchronization through one startup sync and one drawer-only observer;
- canonical close-button behavior plus native-destination overlay dismissal and fallback;
- notification, Community, Picks social/season, challenge, War Room, and native pull request ownership;
- Picks commissioner active-destination activation: zero Home-startup RPCs, zero hidden-mutation RPCs, zero hidden polling, one direct/route/late-mount handoff, and preserved active freshness/action refreshes;
- iOS route stability and delayed Home/community/profile/Picks behavior.

Passive or subordinate paths must produce:

- zero canonical/editor resolver calls or canonical token reads;
- zero sign-in surfaces before an explicit user action;
- zero identity-dependent RPCs before published identity;
- zero stability-layer canonical content mutations or broad repair triggers;
- zero hidden commissioner snapshot RPCs while Picks is not active;
- one request owner for competing refresh paths;
- exactly one final activity-status refresh for one accepted pull action;
- exactly one snapshot validation across a successful migration-to-canonical-identity handoff.

## Route contract

- `octagon-hq-shell.js` alone mutates primary active destination and ranking subview state.
- Recovery-window navigation is queued and consumed by the canonical shell.
- Incoming deep links and nested Picks/Play routes delegate to their intended destination owners.
- Repeating the exact active view does not republish route work.
- Bare Picks group/room invitations retain one necessary Home-to-Picks recovery handoff.
- Native destination overlay dismissal may close an open profile before route delegation, but it may not choose or republish the destination.
- Destination-specific data owners may consume the canonical route event to begin active-view work.
- `octagon-hq-shell.js` remains network-first in the service worker.

## Completed cleanup boundaries

- Phase 1 established idempotent owners.
- Phase 2 removed demonstrated duplicate route, identity, profile, access, notification, and refresh ownership.
- Phase 3 removed duplicate repairs and narrowed native stability to the proved drawer presentation adapter and overlay dismissal.
- Phase 4 established a deterministic startup-work inventory and made Picks commissioner network work active-view only in PR #171.

Broad script deletion, bundling, or manifest restructuring remains Phase 5 work.

## Testing and interruption policy

CI and focused browser/mobile proofs are the normal merge gate. Continue autonomously through routine audit, implementation, exact-head verification, merge, and documentation. Request Cody only for a named user-only or physical-only risk, conflicting primary behavior, or a genuine product decision.
