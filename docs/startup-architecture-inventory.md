# Startup Architecture Owner Inventory

**Purpose:** Track every startup owner, whether duplicate execution is currently harmless, and the planned cleanup batch.  
**Rule:** This inventory is descriptive only. It does not authorize changing product behavior.

## Status definitions

- **Globally idempotent:** A second evaluation of the file exits before creating new listeners, observers, timers, DOM owners, or route work.
- **Locally idempotent:** Calling the file's exposed `start()` twice is safe, but evaluating the whole script twice creates a fresh local state object and may duplicate work.
- **Repeatable by design:** Repeated calls are intentional and do not create duplicate ownership.
- **Compatibility-only:** Temporary repair behavior. Protect it from duplicate execution now; retire individual repairs later only after source fixes and tests.

## Tier 1 — Critical startup manifest

| Startup file | Current ownership | Current safety | Phase 1 action | Later action |
|---|---|---|---|---|
| `assets/js/fresh-home-route-bootstrap.js` | Synchronous pre-shell URL normalization | Needs global guard on `main` | PR #100 adds guard | Keep tiny and listener-free |
| `assets/js/octagon-hq-shell.js` | Primary navigation and active-view owner | Locally idempotent; needs global evaluation guard | Separate Phase 1 batch | Remains canonical navigation owner |
| `assets/js/octagon-hq-nav-grid.js` | Clears legacy navigation-grid styling | No global guard; installs timers and resize listener | Separate Phase 1 batch | Compatibility candidate for Phase 3 retirement |
| `assets/js/home-dashboard.js` | Home dashboard renderer and Home event bridge | Local `bound` protection only | Add global evaluation guard in a separate batch | Preserve markup-signature render suppression |
| `assets/js/product-architecture.js` | Cross-feature loader and shared-profile handoffs | Globally idempotent | No Phase 1 runtime change | Audit dynamically loaded support owners |
| `assets/js/community-profiles.js` | Community directory, profile overlay, Top 10 editing | Local `state.bound` protection only | Add global evaluation guard in a separate batch | Later consolidate identity handoffs |
| `assets/js/fresh-home-launch.js` | One-time late route handoff and profile reminder | Needs global guard on `main` | PR #100 adds guard | Keep route behavior startup-only |
| `assets/js/app-notification-center.js` | Notification settings, service worker registration, profile surfaces | Local `state.started` protection only | Add global evaluation guard in a separate batch | Later consolidate notification rendering ownership |
| `assets/js/app-notification-surface-fix.js` | Notification/profile compatibility bridge | Globally idempotent | No Phase 1 runtime change | Retire after source surfaces are authoritative |
| `assets/js/native-app-shell.js` | Mobile bottom nav, badges, pull-to-refresh, transitions | Local `state.started` protection only | Add global evaluation guard in a separate batch | Remains native interaction owner |
| `assets/js/native-app-shell-stability.js` | Snapshot, spotlight, drawer, and What's New repairs | No global guard; compatibility-only | Add global evaluation guard in a separate batch | Retire repairs one at a time in Phase 3 |
| `assets/js/share-deep-links.js` | Share controls and incoming deep-link routing | No global guard | Add global evaluation guard in a separate batch | Later verify route requests use shell only |

## Phase 1 batch plan

### Batch 1 — Route startup controllers

- `fresh-home-route-bootstrap.js`
- `fresh-home-launch.js`
- Draft PR #100
- Status: startup-specific tests passed; unmerged pending documented merge decision and physical iPhone verification.

### Batch 2 — Canonical shell

- `octagon-hq-shell.js`
- Add one global evaluation guard.
- Add a browser test that evaluates the shell script twice and proves:
  - exactly one primary navigation owner;
  - exactly one active view;
  - no duplicate route event;
  - no duplicate ranking or War Room observer.

### Batch 3 — Native shell

- `native-app-shell.js`
- Add one global evaluation guard.
- Prove one bottom navigation, one pull-to-refresh listener set, one badge interval, and unchanged native navigation behavior.

### Batch 4 — Home and community

- `home-dashboard.js`
- `community-profiles.js`
- Keep these together only if the regression test proves their shared Home/profile lifecycle as one isolated ownership boundary. Otherwise split them.

### Batch 5 — Notifications

- `app-notification-center.js`
- Keep `app-notification-surface-fix.js` unchanged because it already has a global guard.
- Prove one service-worker registration attempt, one observer, and one notification surface per host.

### Batch 6 — Compatibility and sharing

- `octagon-hq-nav-grid.js`
- `native-app-shell-stability.js`
- `share-deep-links.js`
- Prefer separate PRs if their tests or rollback boundaries differ.

## Tier 2 — Dynamically loaded support modules

The following modules are loaded through `product-architecture.js` and still need a full Phase 1 audit:

- `assets/js/product-connectivity.js`
- `assets/js/product-polish.js`
- `assets/js/profile-avatar-sync.js`
- `assets/js/profile-activity.js`
- `assets/js/find-leader-retention.js`
- `assets/js/picks-season-loop.js`

They must be classified before Phase 1 is complete. No assumption should be made that `loadScriptOnce()` alone makes their own code idempotent.

## Inventory evidence recorded July 19, 2026

- The shell uses a local `started` flag and exposes the canonical `window.UFC_APP_SHELL` API.
- Product architecture already uses `window.__UFC_PRODUCT_ARCHITECTURE_STARTED__`.
- Home dashboard suppresses identical markup and has a local `bound` flag.
- Community profiles has local `state.bound` protection.
- Notification center has local `state.started` protection.
- Notification surface fix already uses a global duplicate-start guard.
- Native shell reuses an existing bottom navigation and has local `state.started`, but duplicate file evaluation would create a second local state and listener set.
- Native stability installs a MutationObserver, event listeners, and scheduled repairs without a global guard.
- Share deep links installs observers, click listeners, delayed patch attempts, and route listeners without a global guard.
