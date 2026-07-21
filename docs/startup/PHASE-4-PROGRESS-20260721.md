# Phase 4 Startup-Work Progress — 2026-07-21

## Current production position

- Production runtime merge: PR #171, `2eea1a03e169e3ba3289b4c0b6198a87ea4233ab`.
- Exact tested runtime head: `de893fa4927e22a7968522c69fd429c17e46c965`.
- Startup Architecture Gate: run #177 passed completely.
- Dedicated iOS Home Startup Stability: run #44 passed completely.
- Phase 4 Startup Work Inventory: run #10 passed.
- Phase 4: in progress; inventory and first runtime batch complete.
- Visible product change: none intended or approved.

## Working rule

Phase 4 reduces measured startup work without changing responsibility ownership or visible behavior. The inventory is a prioritization tool, not authorization to delete scripts or broad lifecycle code. One startup-work responsibility changes per runtime batch.

## Production inventory baseline

PR #169 added a deterministic production inventory derived from `index.html` and the loaded runtime sources.

Current baseline at the start of Phase 4:

- 68 production JavaScript files;
- approximately 959,928 production JavaScript bytes;
- startup signals categorized across immediate calls, timers, intervals, observers, readiness/listener hooks, visibility/reconnect hooks, and possible network work;
- candidate ranking based on measured signals and source inspection, not file size alone.

The inventory does not authorize Phase 5 work. Broad script deletion, bundling, or manifest restructuring remains out of scope until Phase 4 is complete.

## Batch 1 — defer commissioner refresh until Picks is active

### Measured startup work

`assets/js/picks-commissioner.js` installed its local commissioner card and immediately called `refresh()` on every application startup. With a saved Picks group token, this could request a commissioner snapshot while Home was the active destination.

The same runtime also:

- scheduled another refresh after ordinary mutations inside the hidden Picks DOM;
- ran a 45-second commissioner refresh interval while Picks was hidden;
- treated direct Picks startup, route entry, late Picks-shell availability, and hidden application state as the same activation condition.

This was avoidable work, not duplicate ownership. `picks-commissioner.js` remains the sole commissioner snapshot and action owner.

### Production change

PR #171 keeps local card installation at startup but gates network refresh work to active Picks.

| Trigger | Before | After |
|---|---|---|
| Home startup with saved group | Commissioner snapshot request | No request |
| Hidden Picks DOM mutation | Debounced snapshot request | No request |
| 45-second interval while hidden | Snapshot request | No request |
| Direct Picks startup | Snapshot request | One request after local card exists |
| Canonical route entry to Picks | Not a dedicated owner boundary | One request after local card exists |
| Late Picks shell/card while active | Mutation-driven request | One bounded 300 ms handoff |
| Ordinary mutation while Picks active | Debounced request | No duplicate request |
| 45-second interval while active | Snapshot request | Preserved |
| Explicit commissioner actions | Forced refreshes | Preserved unchanged |

The active-state predicate prefers `window.UFC_APP_SHELL.currentDestination` and retains the DOM `active-view` fallback for direct or delayed startup.

### Proof

The permanent static contract requires:

- no unconditional commissioner refresh in `start()`;
- canonical shell destination gating;
- mounted-card gating before direct or route-entry refresh;
- one bounded late-card handoff;
- active-only interval polling;
- no ordinary hidden or active mutation refresh loop.

The 390×844 mobile proof covers:

1. Home startup with saved member/admin tokens: zero RPCs and local card installed.
2. Hidden Picks mutation: zero RPCs.
3. Hidden interval callback: zero RPCs.
4. Route entry to Picks: exactly one RPC after card mount.
5. Ordinary active Picks mutation: no duplicate RPC.
6. Active interval callback: exactly one freshness RPC.
7. Route exit followed by interval callback: no hidden RPC.
8. Direct Picks startup: exactly one RPC.
9. Direct Picks startup with a delayed shell: no premature RPC; late shell insertion mounts the card and performs exactly one bounded request.

Startup Architecture Gate #177 and dedicated iOS Home Startup Stability #44 passed on exact head `de893fa4927e22a7968522c69fd429c17e46c965`.

## Unrelated workflow inspection

- Picks UI Smoke #840 passed JavaScript syntax and failed its existing static product checks: mobile top-tab auto-centering, daily odds refresh schedule, and setup-guide documentation.
- Production Ranking Browser Smoke #589 failed in its established ranking-certification path after the isolated commissioner patch work.
- Scoring Architecture Guardrails #1415 failed in its established scoring/runtime contract area.
- None of those failures references the four PR #171 files as a startup regression.

## Remaining Phase 4 order

1. Re-run the production inventory from current `main` after each merged batch.
2. Select the next smallest measured avoidable startup task.
3. Preserve direct-route, delayed-mount, explicit-action, active-view freshness, and installed-app recovery paths.
4. Add a focused static contract and browser/mobile proof for each reduction.
5. Do not begin broad script deletion, bundling, or manifest restructuring; that remains Phase 5.
