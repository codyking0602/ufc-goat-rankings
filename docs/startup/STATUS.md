# Startup Architecture Status

_Last updated: 2026-07-21_

## Current position

- **Latest production runtime merge:** PR #185, `bdd09daaa8c4218b4c3c03138d457ca4197f2025`
- **Exact latest tested runtime head:** `41eedc4d562873d32768d302e75be9e139bc823c`
- **Latest complete Startup Architecture Gate:** #202 passed
- **Latest dedicated iOS Home Startup Stability:** #63 passed
- **Latest Phase 4 Startup Work Inventory:** #29 passed
- **Current phase:** Phase 5 — simplify the startup script manifest and loading order
- **Phase 0:** Complete
- **Phase 1:** Complete
- **Phase 2:** Complete
- **Phase 3:** Complete
- **Phase 4:** Complete; seven runtime reductions plus the deterministic inventory are merged
- **Entire startup/identity cleanup:** approximately 98–99% complete; manifest simplification and final certification remain
- **Visible product changes approved:** none; the zero-visible-change contract remains in force
- **Master tracker:** [Issue #102](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Phase 4 ledger:** [`PHASE-4-PROGRESS-20260721.md`](./PHASE-4-PROGRESS-20260721.md)
- **Canonical ownership map:** [`OWNERS.md`](./OWNERS.md)

## Completed architecture boundaries

### Phase 1 — idempotent owners

All audited runtime owners are protected according to their lifecycle class. `assets/js/app.js` remains a structural manifest singleton, and prerequisite-aware owners claim ownership only after their prerequisites exist.

### Phase 2 — duplicate ownership removed

- `assets/js/octagon-hq-shell.js` is the sole primary destination and ranking-subview owner.
- `assets/js/play-profile-identity.js` is the sole shared credential, fallback, identity-cache, canonical-readiness, and access-persistence owner.
- `assets/js/app-profile.js` is the sole visible editor/full group-snapshot owner.
- Passive Community, Home, notification, Picks, challenge, and War Room consumers use published identity and coalesced request owners.
- Historical-token migration hands validated identity to the canonical owner without a duplicate snapshot.
- The final production-load audit found no remaining demonstrated competing route, identity, access, readiness, notification, profile, or full-refresh owner.

### Phase 3 — repair loops retired

Duplicate Ranking Spotlight, Resume Snapshot, and What’s New repair ownership was removed. The native stability layer now retains only the proved drawer/body presentation mapping, one drawer-only observer, and native-destination overlay dismissal.

### Phase 4 — startup work reduced

Phase 4 used a deterministic production-manifest inventory and removed only measured avoidable work:

1. **PR #171 — Picks commissioner:** automatic snapshot work became active-Picks-only.
2. **PR #174 — native shell:** removed five unconditional delayed component/route/badge resynchronization passes.
3. **PR #177 — War Room notifications:** replaced five startup attempts with one passive immediate shell/status attempt.
4. **PR #179 — War Room access:** replaced five startup attempts with one passive immediate panel/status attempt.
5. **PR #182 — War Room board:** removed four delayed `mount()`/`bindTab()` retries after proving the synchronous startup owner is sufficient.
6. **PR #184 — persistent Picks groups:** removed hidden Home, mutation, and polling RPCs while preserving active-route and direct-action behavior.
7. **PR #185 — Picks social/profile reminders:** removed automatic hidden snapshot/profile/readiness/mutation/poll work while preserving active startup, route entry, late shell support, explicit exported `refresh()`, editor, reminder, notification, and calendar behavior.

The final Phase 4 runtime is `picks-social-retention-20260721h-active-picks-only`.

## Final Phase 4 behavioral boundary

Inactive destinations may install local shells but may not automatically resolve identity, read canonical token storage, open editor/sign-in surfaces, request destination-specific state, or continue destination-specific polling without a proved app-wide requirement.

For Picks social/profile reminders specifically:

- Home with cached identity performs zero social snapshot RPCs.
- Hidden readiness/profile/data events perform zero RPC, resolver, or editor work.
- Route entry and direct active startup load one snapshot when prerequisites exist.
- Direct uncached active startup waits for canonical readiness, then loads once.
- Late active shell mount receives one bounded handoff.
- Active polling is preserved; route exit makes polling silent.
- Explicit external `window.UFC_PICKS_SHARED_PROFILE.refresh()` remains usable while inactive.

## Known unrelated red workflows

The exact final Phase 4 head retained the established unrelated failures:

- Picks UI Smoke #849: mobile top-tab auto-centering, daily odds refresh schedule, and setup-guide documentation.
- Production Ranking Browser Smoke #614: established fighter-photo audit stop.
- Scoring Architecture Guardrails #1440: established permanent source/runtime contract stop.

None references the isolated Phase 4 runtime changes.

## Phase 5 boundary

Phase 5 is **startup script-manifest and loading-order simplification**.

Work directly from the production `index.html` load list. Audit one wiring edge at a time and remove or move it only when the completed Phase 1–4 ownership map proves it obsolete.

Preserve:

- production behavior and public APIs;
- canonical prerequisite and event order;
- installed-app/service-worker behavior;
- route, identity, readiness, profile, Picks, War Room, native-shell, and notification ownership contracts;
- exact-head Startup Gate and dedicated iOS verification.

Do not perform broad bundling, arbitrary script deletion, or unrelated cleanup.

## Exact next action

Create a deterministic Phase 5 manifest/load-order inventory from production `index.html`. Compare each compatibility, stability, bootstrap, and handoff script against the completed ownership map. Identify one script tag, duplicate wiring edge, or ordering constraint that is provably obsolete before editing. If no edge is proved obsolete, document the retained dependency rather than changing runtime code.