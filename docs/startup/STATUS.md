# Startup Architecture Status

_Last updated: 2026-07-21_

## Current position

- **Latest production merge:** PR #189, `628bf47bbe2933688a36a0a7e96d952da5e828d8`
- **Exact latest tested head:** `8689ba590c74fff516c32011ca71916c3e7561a5`
- **Latest complete Startup Architecture Gate:** #212 passed
- **Latest dedicated iOS Home Startup Stability:** #67 passed
- **Latest Phase 5 Script Manifest Inventory:** #10 passed
- **Current phase:** Startup/identity architecture cleanup complete; maintenance-only
- **Phase 0:** Complete
- **Phase 1:** Complete
- **Phase 2:** Complete
- **Phase 3:** Complete
- **Phase 4:** Complete
- **Phase 5:** Complete
- **Entire startup/identity cleanup:** 100% complete under the established ownership, startup-work, and manifest standards
- **Visible product changes approved:** none; the zero-visible-change contract was preserved
- **Master tracker:** [Issue #102](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Phase 4 ledger:** [`PHASE-4-PROGRESS-20260721.md`](./PHASE-4-PROGRESS-20260721.md)
- **Phase 5 ledger:** [`PHASE-5-PROGRESS-20260721.md`](./PHASE-5-PROGRESS-20260721.md)
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

Duplicate Ranking Spotlight, Resume Snapshot, and What’s New repair ownership was removed. The native stability layer retains only the proved drawer/body presentation mapping, one drawer-only observer, and native-destination overlay dismissal.

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

### Phase 5 — script manifest and load order certified

Phase 5 completed four narrow batches:

1. **PR #186 — manifest-owned Picks season:** removed Product compatibility’s unreachable second Picks season loader.
2. **PR #187 — deterministic manifest inventory:** established a truthful 85-script production-order inventory with failure propagation and artifacts.
3. **PR #188 — Find the Leader ownership:** removed a stale version comparison that reloaded the valid manifest owner and recreated its panel on every startup; retained one missing-owner recovery path.
4. **PR #189 — Play photo authority certification:** proved the remaining Better Than fallback is absence-only, retained it as a bounded recovery path, and tightened the inventory to zero unapproved overlaps.

The final Phase 5 inventory proves:

- 85 explicit production scripts;
- zero duplicate explicit local script tags;
- zero missing explicit local files;
- all required canonical loading-order constraints pass;
- zero unapproved explicit/dynamic overlaps;
- Picks season remains manifest-owned.

Exactly three focused recovery overlaps remain:

1. Better Than → Play photo authority
2. Better Than → Find the Leader
3. Product compatibility → primary shell

Every healthy production path consumes the explicit owner exactly once. The dynamic path is permitted only when the owner is genuinely absent, with focused browser proof for the normal and recovery cases.

## Final behavioral boundary

- One responsibility has one canonical owner.
- Passive consumers use owner caches, readiness/update events, and public APIs.
- Inactive destinations do no automatic identity resolution, canonical storage reads, editor/sign-in work, destination-specific RPCs, or destination-specific polling without a separate app-wide requirement.
- Delayed retry arrays require a unique demonstrated late prerequisite.
- Healthy production startup does not reload an already-published manifest owner.
- Explicit/dynamic manifest overlap is allowed only as a tested, bounded missing-owner recovery path.
- Explicit public APIs and direct user actions remain available when automatic inactive work is silent.

## Known unrelated red workflows

The final exact Phase 5 head retained the established unrelated Production Ranking Browser Smoke failure at the fighter-photo audit. Earlier known Picks UI and scoring architecture failures remain outside the startup/identity cleanup boundary.

None references the final manifest inventory, recovery proofs, or startup ownership changes.

## Maintenance standard

No further startup cleanup phase is open.

Future changes should use the existing inventories and ownership proofs. Start new architecture work only when production behavior or a deterministic audit proves one of the following:

- a competing canonical owner;
- unnecessary inactive-destination work;
- repeated speculative startup retries;
- an obsolete manifest edge;
- a new unapproved explicit/dynamic overlap.

Do not perform broad bundling, module conversion, script deletion, or startup refactoring without that evidence.