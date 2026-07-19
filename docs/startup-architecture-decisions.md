# Startup Architecture Decision Log

This log records decisions that must survive across chats and prevent the project from drifting.

## ADR-001 — Preserve the approved app exactly

**Status:** Locked  
**Date:** July 19, 2026

Startup architecture work must not intentionally change layout, styling, rankings, Divisions, profiles, games, Picks, War Room, Intelligence, navigation, routes, saved state, copy, or installed-app behavior.

A cleanup is successful only when users receive the same visible result with less duplicate or fragile work underneath.

## ADR-002 — Main remains the production source of truth

**Status:** Locked  
**Date:** July 19, 2026

Runtime cleanup is developed in small isolated branches and draft pull requests. `main` is not used as an experimental branch.

Documentation and test-only protection may be added to `main` when they cannot affect runtime behavior.

## ADR-003 — One ownership problem per runtime pull request

**Status:** Locked  
**Date:** July 19, 2026

Do not combine route, identity, notifications, refresh behavior, repair removal, lazy loading, visual work, fighter data, scoring changes, or product features in the same runtime cleanup PR.

Each PR must have one named ownership problem, a narrow diff, regression coverage, and a clear rollback.

## ADR-004 — Tests before deletion

**Status:** Locked  
**Date:** July 19, 2026

No fallback, compatibility patch, observer, timer, or repair loop is removed until a regression test proves the source renderer behaves correctly without it.

## ADR-005 — Startup route ownership

**Status:** Locked  
**Date:** July 19, 2026

- `assets/js/fresh-home-route-bootstrap.js` owns synchronous pre-shell URL normalization.
- `assets/js/octagon-hq-shell.js` owns primary navigation and active views.
- `assets/js/fresh-home-launch.js` owns the one-time late startup route handoff and profile-reminder injection.

Other systems may request navigation only through the canonical shell API. They must not create a second route owner.

## ADR-006 — Do not optimize startup before ownership is clean

**Status:** Locked  
**Date:** July 19, 2026

Lazy loading, bundling, script movement, and manifest reduction wait until startup owners are idempotent and duplicate ownership has been removed. Performance work before ownership cleanup would make failures harder to diagnose.

## ADR-007 — Physical iPhone verification is mandatory for lifecycle work

**Status:** Locked  
**Date:** July 19, 2026

Any change involving installed-app startup, caching, page lifecycle, route restoration, sign-in startup, pull-to-refresh, or native navigation requires a physical iPhone check before merge.

## ADR-008 — PR #100 is Phase 1 Batch 1 only

**Status:** Active  
**Date:** July 19, 2026

PR #100 adds duplicate-execution guards to the two route startup controllers and test assertions. No additional startup owner, fallback removal, script movement, or unrelated test maintenance belongs in that PR.

## ADR-009 — Existing unrelated CI failures remain visible

**Status:** Locked  
**Date:** July 19, 2026

Do not weaken, skip, or misrepresent red checks to make a startup PR appear green. Existing failures must be documented and handled separately from the runtime cleanup that exposed them.
