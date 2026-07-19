# Octagon HQ Startup Architecture

## Non-negotiable contract

Startup cleanup must not change the approved app experience.

That means no intentional change to:

- layout, styling, card size, copy, animation, or navigation
- rankings, divisions, fighter profiles, scoring, photos, or data
- games, Picks, War Room, Intelligence, profiles, notifications, or sharing
- routes, sign-in behavior, saved state, deep links, or installed-app behavior

A cleanup change is successful only when the same user action produces the same visible result and the app performs less duplicate work underneath.

## Current startup phases and owners

1. **Synchronous route normalization**
   - Owner: `assets/js/fresh-home-route-bootstrap.js`
   - Runs before the app shell.
   - May normalize a stale installed-app URL before anything renders.
   - Must not install persistent listeners, observers, intervals, or reload loops.

2. **Navigation and active-view ownership**
   - Owner: `assets/js/octagon-hq-shell.js`
   - The sole owner of primary destination and ranking-subview activation.
   - `window.UFC_APP_SHELL` is the canonical navigation API.

3. **Ranking data and calculated production runtime**
   - Owners: `assets/data/ranking-data.js`, `assets/js/app.js`, and `assets/js/production-ranking-bootstrap.js`
   - Fighter data must remain outside `index.html`.

4. **Picks base runtime**
   - Owner: `assets/js/picks.js`
   - Picks add-ons may enhance the base runtime but must not create a second navigation or identity owner.

5. **Play base runtime**
   - Owners: `assets/js/play.js` and `assets/js/play-hub.js`
   - Individual games own only their own game state and surfaces.

6. **Home and community surfaces**
   - Owners: `assets/js/home-dashboard.js` and `assets/js/community-profiles.js`
   - Background refreshes must preserve existing DOM when visible data is unchanged.

7. **Late startup handoffs**
   - `assets/js/product-architecture.js`: cross-feature compatibility and shared-profile handoffs.
   - `assets/js/fresh-home-launch.js`: one-time late route activation and profile-reminder injection.
   - `assets/js/app-notification-center.js`: notification data and rendering.
   - `assets/js/app-notification-surface-fix.js`: notification/profile compatibility.
   - `assets/js/native-app-shell.js`: mobile bottom navigation, badges, transitions, and pull-to-refresh.
   - `assets/js/native-app-shell-stability.js`: temporary compatibility repairs that should shrink as source renderers become authoritative.

## Allowed dynamic loading

Dynamic loading is allowed only when the owner and timing are explicit:

- The app shell may load Play daily support after Play is opened.
- Fresh launch may load the profile setup reminder after route selection.
- Product architecture may load its named support modules once.

Critical shell, notification, and native-navigation owners must never be dynamically loaded a second time.

## Rules for every cleanup batch

1. Change one ownership problem at a time.
2. Do not combine architecture cleanup with product, data, or visual work.
3. Add or strengthen a regression test before removing a fallback.
4. Keep a clean rollback point.
5. Do not merge a runtime cleanup while any startup, browser smoke, scoring, profile, Picks, or mobile stability check is failing.
6. Physically verify the installed iPhone app before merging changes that affect routing, caching, lifecycle behavior, profile sign-in, or native navigation.
7. Delete compatibility code only after the source renderer has been proven stable without it.

## Cleanup sequence

### Phase 0 — Freeze and measure

- Unified startup contract.
- Unified browser regression gate.
- Script ownership and load-order checks.
- No runtime behavior changes.

### Phase 1 — Make every startup owner idempotent

- Add global singleton guards where duplicate execution could attach listeners, observers, timers, or navigation work twice.
- Do not move or delete scripts yet.

### Phase 2 — Remove duplicate ownership

- Consolidate repeated identity, route, notification, and refresh handoffs into one owner at a time.
- Keep compatibility facades until all consumers use the canonical owner.

### Phase 3 — Retire repair loops

- For each repair in `native-app-shell-stability.js` or other compatibility files:
  1. identify the incorrect source renderer;
  2. fix the source renderer;
  3. add a regression assertion;
  4. remove that single repair;
  5. verify no visible difference.

### Phase 4 — Reduce startup work

- Move route-specific features behind explicit lazy loading only after ownership is clean.
- Preserve the exact current screen when each destination opens.

### Phase 5 — Simplify the script manifest

- Remove superseded compatibility files and stale cache variants.
- Keep `index.html` as an ordered layout and dependency manifest, not a runtime patch stack.

## Definition of done

Startup architecture is complete when:

- every major surface has one startup owner;
- every startup owner is safe to call twice;
- the app has exactly one active view and one mobile navigation shell;
- profile-ready, scoring-ready, visibility, page lifecycle, and refresh events cannot cause repeated rendering or route churn;
- no full-page reload loop exists;
- compatibility repair files are empty or removed;
- route-specific code does not block the first usable Home render;
- the approved app looks and behaves exactly as it did before cleanup.
