# Startup Architecture Decision Log

This file records decisions that future cleanup work must preserve. Add a dated entry whenever a choice materially affects architecture, scope, testing, or rollout.

## Decision 001 — Zero visible behavior change

**Date:** 2026-07-19  
**Status:** Locked

Startup cleanup is an internal reliability project, not a redesign. The approved app experience must remain visibly and functionally equivalent.

This includes rankings, divisions, profiles, Games, Picks, Intelligence, War Room, notifications, sharing, navigation, saved state, and installed-app behavior.

## Decision 002 — No broad rewrite

**Date:** 2026-07-19  
**Status:** Locked

The startup stack will be untangled through small reversible batches. We will not replace the app shell or rebuild the startup system in one large change.

## Decision 003 — One ownership problem per runtime PR

**Date:** 2026-07-19  
**Status:** Locked

Runtime cleanup PRs must stay narrow enough to understand from one diff. Product work, fighter-data work, scoring fixes, visual changes, and unrelated test repairs are excluded.

## Decision 004 — Idempotence before deletion or movement

**Date:** 2026-07-19  
**Status:** Locked

A startup owner must first become safe against duplicate execution. Only later may duplicate script loading, duplicate ownership, or compatibility code be removed.

## Decision 005 — Tests before removing fallbacks

**Date:** 2026-07-19  
**Status:** Locked

Every repair or fallback must have regression coverage before removal. The source renderer is fixed first; then one repair is removed; then behavior is reverified.

## Decision 006 — Main remains the live source of truth

**Date:** 2026-07-19  
**Status:** Locked

The cleanup uses current `main` as the production baseline. No old safe-branch or temporary-workflow assumptions may be revived without an explicit new decision.

## Decision 007 — Runtime changes begin in draft PRs

**Date:** 2026-07-19  
**Status:** Locked

Startup runtime batches remain draft until their exact behavior, branch state, and relevant validation are understood. A green subset of checks is not sufficient when mergeability or installed-app behavior is uncertain.

## Decision 008 — Unrelated red checks remain separate

**Date:** 2026-07-19  
**Status:** Locked

A stale roster-count contract and fighter-photo audit failure were discovered during startup validation. They must be documented but not silently folded into the route-startup runtime diff.

## Decision 009 — Repository documentation outranks chat memory

**Date:** 2026-07-19  
**Status:** Locked

Every future work session starts from `docs/startup/STATUS.md`, the governing architecture contract, and master issue #102. Chat summaries may help but are not the source of truth.

## Decision 010 — Rankings and War Room are not cleanup targets

**Date:** 2026-07-19  
**Status:** Locked

Rankings are not to be simplified as part of startup work. War Room is an active product surface and must be preserved and tested like the rest of the app.

## Decision 011 — Do not use one universal guard pattern

**Date:** 2026-07-19  
**Status:** Locked

Phase 1 owners fall into different technical classes:

- simple IIFE owners that can receive a top-level global marker;
- prerequisite-dependent owners whose marker must be set only after required DOM or data exists;
- structural global scripts such as `app.js` that must remain exact-one manifest loads;
- retry-sensitive launchers such as `production-ranking-bootstrap.js` that need an intentional retry API before later execution can be blocked.

No file may receive the standard singleton marker merely because another startup file used it successfully.

## Decision 012 — Mobile-sensitive owners require physical-device proof

**Date:** 2026-07-19  
**Status:** Locked

Routing, native navigation, touch handling, background/resume, profile sign-in, notification, and installed-app changes require physical iPhone verification before merge.

An immutable separate-origin snapshot may be used for pre-merge testing when CI does not publish a branch deployment. Failure of that preview to load or install is inconclusive, not approval to merge.