# Startup Ownership Inventory

_Last updated: 2026-07-21_

This file records the canonical owner of each startup responsibility. Detailed history remains in the Phase 1–5 audits and progress ledgers.

## Ownership rules

- One responsibility has one canonical owner.
- Passive consumers use published caches, readiness/update events, and owner APIs.
- Passive consumers do not resolve shared identity, read canonical access storage, publish canonical readiness, or trigger full editor/group work merely to obtain identity.
- Explicit user actions may use the canonical `require()` boundary when sign-in is genuinely needed.
- Competing startup, route, visibility, reconnect, realtime, polling, and direct refresh paths share one in-flight owner when they request the same data.
- A feature-specific network owner does not perform automatic startup or polling work while its destination is inactive unless a separate app-wide requirement is proved.
- A local shell may install while inactive, but shell installation alone does not authorize identity resolution, RPCs, editor work, or repeated retries.
- Delayed retry arrays require a demonstrated unique late prerequisite.
- One accepted primary route transition publishes one canonical route event; an already-active exact-view retry is a no-op.
- One accepted pull-to-refresh action performs one final activity-status refresh; subordinate fallback work may not duplicate it.
- Historical-token migration may validate and adopt a token before normal identity resolution, but it hands the resolved identity to the canonical profile owner rather than publishing canonical readiness itself.
- Compatibility layers may preserve presentation or missing-owner recovery behavior but may not initiate a canonical owner’s data or render responsibility on the healthy production path.
- Each explicit local production script path appears once and resolves to a repository file.
- An explicit/dynamic script overlap requires focused proof that healthy production consumes the explicit owner once and that the dynamic path runs only when the owner is genuinely absent.
- One ownership, startup-work, or manifest-wiring issue changes per runtime batch.
- `assets/js/app.js` is a structural manifest singleton and must not receive a standard IIFE guard.

## Canonical owners

| Responsibility | Canonical owner | Current contract |
|---|---|---|
| Earliest installed-app route normalization | `assets/js/fresh-home-route-bootstrap.js` | Synchronous startup classification only; protected against duplicate execution; does not activate a primary destination |
| Primary destination and ranking-subview activation | `assets/js/octagon-hq-shell.js` via `window.UFC_APP_SHELL` | Sole primary route owner; recovery queue is one canonical handoff; exact already-active views coalesce before DOM/hash/event work; Product compatibility may recover this owner only when absent |
| Ranking data | `assets/data/ranking-data.js` | Canonical fighter/ranking source; outside startup cleanup except load order |
| Base ranking rendering and global UI APIs | `assets/js/app.js` | Exact-one structural manifest singleton; no primary-tab activation |
| Calculated production ranking lifecycle | `assets/js/production-ranking-bootstrap.js` | Canonical `start`/`retry`/`apply`/`refresh` owner with one in-flight attempt |
| Calculated fighter profile and Resume Snapshot | `assets/js/calculated-profile-runtime.js` | Sole calculated `openFighter()` and profile-content owner; one complete profile write |
| Fighter drawer open/close state | Base `assets/js/app.js` handlers plus calculated `openFighter()` override | Canonical owners of `#drawer.open` and `aria-hidden` |
| Mobile fighter-drawer presentation and native overlay dismissal | `assets/js/native-app-shell-stability.js` | Sole drawer-to-body presentation mapping; one startup sync, one drawer-only observer, one native-destination dismissal handler; no canonical content repair or broad retry loop |
| Shared credentials, login/fallback, identity cache, canonical readiness, and access persistence | `assets/js/play-profile-identity.js` via `window.UFC_PLAY_PROFILE` | Sole shared identity/access owner; consumes a valid migration handoff without repeating its snapshot |
| Historical group-token migration and canonical adoption | `assets/js/app-canonical-group.js` | Pre-resolution migration owner only; returns a bounded resolved-identity handoff without publishing canonical profile readiness |
| Visible profile editor and full group snapshot | `assets/js/app-profile.js` via `window.UFC_APP_PROFILE` | Sole editor/group-snapshot owner; publishes `ufc-app-profile-updated` |
| Picks sign-in card and PIN management | `assets/js/picks-member-pin.js` | UI, status, continuation, member PIN, and commissioner PIN owner; credentials delegate to canonical identity |
| Picks base runtime | `assets/js/picks.js` | Canonical Picks room/event/pick/render owner; primary activation remains subordinate to the shell |
| Picks internal routing | `assets/js/picks-internal-navigation.js` | Nested Picks route owner only |
| Picks commissioner snapshot and actions | `assets/js/picks-commissioner.js` | Local card may install at startup; network work is active-Picks-only after card mount, with bounded route/late-card activation, active-only 45-second polling, and explicit action refreshes |
| Persistent Picks groups | `assets/js/picks-persistent-groups.js` | Sole persistent-group owner; automatic refresh and polling run only while Picks is active; route entry, active late-card work, direct group/room actions, and late shell support remain |
| Picks social profile/reminder snapshot | `assets/js/picks-social-retention.js` | Passive identity consumer with one in-flight snapshot owner; automatic startup/readiness/mutation/poll work is active-Picks-only; explicit exported `refresh()` remains available while inactive; profile editor, reminders, notifications, and calendar actions remain explicit owners |
| Picks season summary/events/social/room loading | `assets/js/picks-season-loop.js` | Explicit manifest owner and passive identity consumer with a coalesced season request set; synchronously publishes `window.UFC_PICKS_SEASON_LOOP`; Product compatibility has no second loader |
| Play base runtime | `assets/js/play.js` | Canonical base Play owner after DOM/data prerequisites |
| Play internal game navigation | `assets/js/play-hub.js` | Canonical Play game-screen owner after hub prerequisites |
| Play fighter-photo candidates, hydration, and image-error recovery | `assets/js/play-photo-authority.js` via `window.UFC_PLAY_PHOTO_AUTHORITY` | Explicit manifest owner; healthy production loads once before Better Than compatibility; Better Than may perform one bounded current-build recovery only when the API is absent |
| Find the Leader game owner and panel | `assets/js/find-leader.js` via `window.UFC_FIND_LEADER` | Explicit manifest owner; healthy production loads once and retains one panel; Better Than may perform one bounded current-build recovery only when the API is absent and may not replace the owner by version comparison |
| Home rendering and Ranking Spotlight | `assets/js/home-dashboard.js` | Sole Home/Spotlight readiness, selection, placeholder, markup, route re-entry, visibility recovery, and duplicate suppression owner |
| Community directory, profiles, and Top 10 | `assets/js/community-profiles.js` | Canonical community owner; passive identity consumer; explicit Top 10 editing may require sign-in |
| Cross-feature profile/Picks handoffs | `assets/js/product-architecture.js` | Compatibility/handoff owner only; no canonical access persistence, duplicate startup profile handoff, or duplicate Picks season loader; primary-shell injection is missing-owner recovery only |
| Late route/reminder continuation | `assets/js/fresh-home-launch.js` | Late launch and Picks-continuation owner; consumes the shell’s published destination and skips same-destination handoff |
| Notification settings, push registration, preferences, and canonical rendering | `assets/js/app-notification-center.js` | Sole notification settings/render owner; passive identity consumer for startup/settings; explicit actions may require canonical sign-in |
| Notification/profile surface compatibility | `assets/js/app-notification-surface-fix.js` | Profile-cache presentation compatibility only; may not call canonical notification render/settings work |
| App-wide quick synchronization and What’s New trigger | `assets/js/app-update-watcher.js` | Canonical quick-sync owner and sole update-control markup/unread/seen owner |
| What Changed overlay and feed | `assets/js/what-changed.js` | Sole overlay/feed render, open/close, action, and mark-all-seen owner |
| Mobile bottom navigation, badges, transitions, and pull-to-refresh | `assets/js/native-app-shell.js` | One initial component/route/badge sync; later work uses canonical events, targeted observation, lifecycle recovery, and the separate 10-second badge poll; no five-pass startup retry array |
| Sharing and supported incoming deep links | `assets/js/share-deep-links.js` | Canonical share/deep-link orchestrator; delegates destination activation |
| Profile challenge inbox, actions, and routing | `assets/js/profile-challenges.js` | Passive inbox identity consumer with one in-flight load; explicit actions may require sign-in |
| War Room message board | `assets/js/octagon-message-board.js` | Passive identity consumer; one synchronous startup mount and tab/navigation bind; no 50/220/850/2200 ms mount/bind retries; active-route, readiness, visibility/online, realtime, and explicit board actions remain; visible **SIGN IN** is the explicit `require()` boundary |
| War Room membership/access status and Cody management | `assets/js/octagon-access-panel.js` | One immediate panel/status attempt; uncached startup waits for readiness; no 250/900/2600/5000 ms retries; one in-flight owner, realtime/lifecycle verification, 60-second polling, roster/toggles, and access rules remain |
| War Room activity/unread/mark-seen/realtime/push | `assets/js/octagon-notifications.js` | One immediate shell/status attempt; uncached startup waits for readiness; no 180/700/1800/4200 ms retries; one in-flight owner, direct-link/realtime/lifecycle refreshes, explicit actions, 30-second status polling, local DOM maintenance, and push remain |

## Permanent ownership, startup-work, and manifest proofs

Startup Architecture Gate, dedicated mobile suites, and Phase 5 Script Manifest Inventory protect:

- sole primary route ownership, recovery queue behavior, and exact-view coalescing;
- canonical identity delegation, migration handoff, storage ownership, readiness publication, and sign-in stability;
- passive Community, Home, notification, Picks, challenge, and War Room identity consumption;
- sole App Profile full group snapshot;
- canonical Ranking Spotlight, calculated profile/Resume Snapshot, What’s New, and drawer/body presentation ownership;
- Picks commissioner zero-work Home startup, bounded activation, active-only polling, and explicit actions;
- persistent Picks groups zero hidden Home/mutation/poll RPCs with active route and direct actions preserved;
- Picks social zero hidden startup/readiness/mutation/poll RPCs, direct cached/uncached active startup, route entry, late active shell handoff, active polling, route-exit silence, and explicit inactive exported refresh;
- one synchronous War Room board mount/bind with no delayed local retry array;
- one passive War Room access startup attempt and one passive notification status startup attempt;
- one initial native shell synchronization with owner events, targeted observation, lifecycle recovery, live badge polling, and one final pull activity refresh;
- exact-one explicit local script paths and existing repository targets;
- canonical production order for route bootstrap, shell, base app, Play owners, identity/profile, Picks season/Product compatibility, late launch, notifications, and native-shell stability;
- manifest-owned Picks season with no compatibility fallback loader;
- one healthy Find the Leader request/panel and one bounded missing-owner recovery;
- one healthy Play photo-authority request/style owner and one bounded missing-owner recovery;
- zero unapproved explicit/dynamic manifest overlaps.

Passive, subordinate, inactive-destination, or healthy manifest paths must produce:

- zero canonical/editor resolver calls;
- zero canonical token storage reads;
- zero sign-in surfaces before an explicit user action;
- zero identity-dependent RPCs before published identity;
- zero automatic destination-specific network work while inactive;
- zero repeated War Room local mount/bind, access-status, or activity-status startup retries;
- zero commissioner, persistent-group, or Picks social automatic RPCs while Picks is inactive;
- zero unconditional native resynchronization after the initial startup pass;
- one request owner for competing refresh paths;
- exactly one final activity-status refresh for one accepted pull action;
- exactly one snapshot validation across a successful migration-to-canonical-identity handoff;
- zero second script injection when an approved manifest owner is already published;
- zero unapproved explicit/dynamic ownership overlaps.

## Approved manifest recovery edges

Exactly three explicit/dynamic overlaps are approved:

1. `assets/js/better-than-standalone-share.js` → `assets/js/play-photo-authority.js`
2. `assets/js/better-than-standalone-share.js` → `assets/js/find-leader.js`
3. `assets/js/product-architecture.js` → `assets/js/octagon-hq-shell.js`

Each overlap has focused proof that:

- healthy production consumes the explicit manifest owner once;
- the recovery script is not injected while that owner is present;
- one bounded recovery runs when the owner is genuinely absent;
- the recovery publishes the current owner and preserves the relevant handoff.

No other explicit/dynamic overlap is permitted without equivalent proof and an intentional update to the manifest inventory.

## Completed cleanup boundaries

- Phase 1 established idempotent owners.
- Phase 2 removed demonstrated duplicate route, identity, profile, access, notification, and refresh ownership.
- Phase 3 retired duplicate content/presentation repair loops while preserving the proved minimal drawer presentation adapter.
- Phase 4 established a measured production startup inventory, removed unnecessary Home/off-screen Picks work, retired unconditional native resynchronization, and removed redundant War Room notification, access, and board startup retry arrays.
- Phase 5 removed obsolete manifest wiring, established the deterministic 85-script manifest inventory, removed the healthy-path Find the Leader reload, and certified every retained recovery overlap.

The startup/identity architecture cleanup is complete. Future changes are maintenance-only unless deterministic evidence proves a new duplicate owner, unnecessary inactive work, speculative retry, obsolete manifest edge, or unapproved overlap.