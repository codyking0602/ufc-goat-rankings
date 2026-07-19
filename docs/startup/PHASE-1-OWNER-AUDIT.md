# Phase 1 Startup Owner Audit

_Last updated: 2026-07-19_

This document records the duplicate-execution audit for the major startup owners. It does not authorize combining owners into one runtime patch. Every runtime owner remains a separate, reviewable batch unless the tracker explicitly records a different decision.

## Classification key

- **Protected** — a global marker already prevents a second file execution.
- **Draft protected** — a global marker is proposed in the current draft PR.
- **Simple guard candidate** — a top-level global marker appears able to preserve the intended first execution and block only accidental later executions.
- **Guard after prerequisites** — the file can exit early when required DOM or data is missing, so a marker must not be set before those prerequisites pass.
- **Structural singleton** — the file cannot safely receive the standard IIFE guard without a larger global-export refactor; enforce one load through the manifest and contract.
- **Retry semantics required** — duplicate execution may currently function as an accidental retry path, so a guard must not be added until an intentional retry API exists.

## Audited owners

| Owner | Current duplicate protection | Startup work owned | Phase 1 classification | Decision |
|---|---|---|---|---|
| `assets/js/fresh-home-route-bootstrap.js` | None on `main` | Earliest synchronous URL/route normalization | Draft protected | PR #100 adds a global guard and contract assertion. |
| `assets/js/octagon-hq-shell.js` | Closure-scoped `started` and `eventsBound` | Canonical navigation, hash routing, navigation observers, lazy Play support | Simple guard candidate | Next runtime batch after PR #100. Add one global marker and one contract assertion only. |
| `assets/js/octagon-hq-nav-grid.js` | None | Removes legacy grid styles, delayed cleanup passes, resize cleanup | Simple guard candidate | Low-risk isolated batch after the shell. Do not combine with the shell patch. |
| `assets/js/app.js` | Manifest only | Base ranking UI, global rendering APIs, controls, profile drawer | Structural singleton | Keep loaded exactly once through `index.html` and the startup contract. A standard IIFE guard would not solve lexical redeclaration and could break global APIs. |
| `assets/js/production-ranking-bootstrap.js` | Script-attribute checks protect loaded dependencies, but the bootstrap itself is unguarded | Dynamic canonical-data loading, scoring rebuild, app refresh, ready events | Retry semantics required | Define an explicit `apply`/retry lifecycle before blocking later execution. Do not add a naive top-level guard. |
| `assets/js/picks.js` | None | Picks state, element bindings, backend resume, 30-second room polling | Simple guard candidate, high impact | Isolate in its own Picks batch. Duplicate execution would add another polling loop and duplicate element handlers. Requires Picks routing/resume tests. |
| `assets/js/play.js` | None | Base Top 10 and blind-resume UI state and event bindings | Guard after prerequisites | The file intentionally exits if the Play panel or ranking data is absent. Set any marker only after prerequisites pass. |
| `assets/js/play-hub.js` | None | Play hub DOM, game routing, blind-era observer, seeded daily randomness | Guard after prerequisites | The file intentionally exits if its Play DOM is absent. Isolate from `play.js` and preserve daily-random restoration behavior. |
| `assets/js/home-dashboard.js` | Closure-scoped `bound` | Home rendering, feature-ready listeners, storage/visibility refresh, startup timers | Simple guard candidate | Isolated batch after shell and nav-grid. Duplicate execution creates a second closure, listeners, timers, and public API. |
| `assets/js/community-profiles.js` | Closure-scoped `state.bound` | Community directory/profile UI, Top 10 editor, identity loading, challenge wrapper | Simple guard candidate, broad surface | Isolate after lower-risk owners. Confirm profile sign-in, Top 10, Picks identity handoff, and challenge behavior. |
| `assets/js/product-architecture.js` | Global `__UFC_PRODUCT_ARCHITECTURE_STARTED__` | Compatibility facade, support-module loading, shared profile-to-Picks handoff | Protected | No Phase 1 runtime change. Keep the existing marker and contract assertion. |
| `assets/js/fresh-home-launch.js` | None on `main` | Late Home/Picks activation, Picks resume marker, profile-reminder injection | Draft protected | PR #100 adds a global guard and contract assertion. |
| `assets/js/app-notification-center.js` | Closure-scoped `state.started` | Notification settings, service worker registration, profile surfaces, observer/listeners | Simple guard candidate, mobile sensitive | Isolate in a notification batch. Requires installed-app notification/profile verification. |
| `assets/js/app-notification-surface-fix.js` | Global `__UFC_APP_NOTIFICATION_SURFACE_FIX_STARTED__` | Temporary profile/activity notification compatibility and cached-surface repair | Protected | No Phase 1 runtime change. Do not expand this repair layer. |
| `assets/js/native-app-shell.js` | Closure-scoped `state.started` | Bottom navigation, badges, transitions, pull-to-refresh, observer, 10-second badge interval | Simple guard candidate, highest mobile sensitivity | Isolate and require physical iPhone testing. Duplicate execution would duplicate touch handlers, observers, and a perpetual interval. |
| `assets/js/native-app-shell-stability.js` | None | Temporary profile/Home/header repair observer, listeners, delayed repair passes | Simple guard candidate, mobile sensitive | Add only a singleton guard in its own batch. Removal belongs to Phase 3, not Phase 1. |
| `assets/js/share-deep-links.js` | Internal observer and wrapper checks only | Share UI, fighter wrapper, War Room observer, deep-link routing and retries | Simple guard candidate | Internal checks reduce duplicate decoration but do not prevent duplicate document/popstate/ready listeners or a second routing closure. Isolate later. |

## Existing protected support owner

`assets/js/product-architecture.js` dynamically loads connectivity, polish, avatar sync, activity, Find the Leader retention, and Picks season support using source checks. Those support modules remain subordinate to that guarded loader for this audit. A support module should receive its own audit before any ownership consolidation or loader removal.

## Recommended runtime sequence

The sequence is based on smallest risk first, not on which duplicate would be most damaging.

1. **PR #100 — route bootstrap and late launch guards.**
2. **App shell — `octagon-hq-shell.js`.**
3. **Legacy navigation cleanup — `octagon-hq-nav-grid.js`.**
4. **Home dashboard — `home-dashboard.js`.**
5. **Native repair layer — `native-app-shell-stability.js`.**
6. **Notification center — `app-notification-center.js`.**
7. **Native app shell — `native-app-shell.js`.**
8. **Picks base runtime — `picks.js`.**
9. **Community profiles — `community-profiles.js`.**
10. **Play base and Play hub — separate prerequisite-aware batches.**
11. **Share/deep links — `share-deep-links.js`.**
12. **Production ranking bootstrap — only after explicit retry semantics are designed and tested.**

`app.js` remains a structural singleton throughout Phase 1. It is protected through exact-one-load assertions, not the standard IIFE marker.

## Required proof for each simple guard

Each runtime batch must demonstrate all of the following:

1. The first execution is byte-for-byte equivalent after the new marker lines.
2. A deliberate second execution exits before adding listeners, observers, timers, intervals, dynamic scripts, or route work.
3. The startup contract asserts the marker remains present.
4. Relevant browser/mobile/profile/Picks tests pass.
5. The owner map, status, changelog, and master tracker are updated.
6. Mobile-sensitive batches remain draft until installed-iPhone behavior is verified.

## Audit conclusion

The app does not have one universal duplicate-start problem. It has four distinct classes:

- straightforward IIFE owners that can receive isolated global guards;
- prerequisite-dependent owners whose marker placement matters;
- a structural global script that must remain manifest-singleton;
- a scoring bootstrap that needs intentional retry semantics before it can become idempotent.

Treating those classes differently is required to preserve the approved app behavior.