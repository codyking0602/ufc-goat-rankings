# Phase 3 Repair-Loop Progress — 2026-07-21

## Current production position

- Latest production runtime merge: PR #161, `942cdd215aa81cb3820fb464334d08101a139e9d`.
- Exact tested runtime head: `534a984625bb2764beb289b0211ab102318dd713`.
- Startup Architecture Gate: run #158 passed completely.
- Dedicated iOS Home Startup Stability: run #28 passed completely.
- Phase 3: in progress; two repair-loop retirement batches complete.
- Visible product change: none intended or approved.

## Working rule

Phase 3 audits one repair behavior at a time. A repair is removed only when the canonical owner, all triggers, delayed paths, route/lifecycle behavior, and remaining recovery are proved. The stability file is not treated as one removable unit.

## Behavior inventory — `assets/js/native-app-shell-stability.js`

| Behavior | Trigger / frequency | State or DOM changed | Canonical overlap | Lifecycle / teardown | Removal risk | Current disposition |
|---|---|---|---|---|---|---|
| Module singleton | One production load | Claims `window.__UFC_NATIVE_APP_SHELL_STABILITY_STARTED__` | None | Startup-only; no teardown needed | Duplicate listeners/observers if absent | Keep |
| `repairSnapshot()` | Formerly ran from debounced observer work, route/soft-refresh events, delayed startup passes, and open-drawer sync | Rewrote visible Resume Snapshot values and `drawer.dataset.currentFighter` | `assets/js/calculated-profile-runtime.js` already owns the complete calculated profile and Resume Snapshot render | Historical indefinite repair; no teardown | Removal would be unsafe only if the calculated profile owner could not restore its own content | **Removed in PR #161 after static and mobile proof** |
| `normalizeWhatsNew()` | Debounced observer work, route/soft-refresh events, delayed startup passes | Repairs malformed **NEW** button markup and asks the update watcher to resync unread state | Update watcher owns unread state; this layer repairs malformed presentation | Recovery can run indefinitely; no teardown | Known malformed/duplicated button DOM could remain broken | Keep pending a separate malformed-DOM reproduction audit |
| `syncDrawerState()` | Debounced observer work, close click continuation, route/soft-refresh events, delayed startup passes | Toggles `body.fighter-profile-open` only after PR #161 | Drawer/profile owner controls open state and content | Recovery can run indefinitely; no teardown | Native layout or restored drawer state may desynchronize body presentation | Keep pending a separate drawer-state audit |
| `closeFighterProfile()` | Capturing click on a native destination | Closes the fighter drawer and clears body state | Canonical destination owner handles routing, not overlay dismissal | Event-driven; no teardown | Destination changes could leave the profile overlay covering the new route | Keep as legitimate native navigation recovery pending its own audit |
| `schedule()` | Any retained listener/observer/timer; 30 ms debounce | Runs retained **What’s New** and drawer-state synchronization | Subordinate only | Reuses one timeout; no teardown | Removing it would change all retained recovery cadence | Keep while retained behaviors remain |
| Body `MutationObserver` | Indefinite child/class/hidden/aria-hidden observation | Schedules retained drawer and **What’s New** repairs | No longer reads or mutates Home or fighter-profile content after PRs #159 and #161 | Indefinite; no teardown | Legitimate DOM replacement may be missed if removed broadly | Narrowed target by target; keep pending remaining proofs |
| Route and soft-refresh listeners | Every `octagon-hq:view-change` and `octagon-hq:soft-refresh` | Schedules retained drawer/**What’s New** synchronization | Canonical route/refresh owners publish events; stability remains a passive presentation consumer | Indefinite; no teardown | Route-driven overlay/presentation recovery may be lost | Keep pending target-specific proof |
| Delayed startup passes | One shot at 0, 80, 240, 700, 1600, and 3600 ms | Schedules retained repairs | Historical delayed-startup safety net | Startup-only; timers are not retained for cancellation | Late DOM availability may still require bounded retry | Keep pending target-specific delayed-startup proof |
| `repairSpotlight()` | Formerly ran from delayed passes, ranking-readiness events, route/soft-refresh events, and arbitrary Home mutations | Directly replaced `.home-spotlight-loading` with independently generated Spotlight HTML | `assets/js/home-dashboard.js` owns the full Spotlight lifecycle | Historical indefinite repair; no teardown | Removal would be unsafe only if Home could not recover after delayed rankings | **Removed in PR #159 after static and mobile proof** |

## Batch 1 — retire duplicate Ranking Spotlight repair

### Proven duplicate

`home-dashboard.js` is the canonical Home and Ranking Spotlight renderer. It already owns calculated-ranking readiness, the loading placeholder, deterministic daily selection and persistence, Spotlight markup and actions, Home route re-entry, foreground recovery, and identical-markup suppression.

The stability layer independently watched arbitrary Home mutations, listened to the same ranking-readiness events, ran six delayed retries, read raw ranking globals/local storage, and could replace the owner’s placeholder through `outerHTML`. It therefore acted as a second renderer rather than a necessary recovery consumer.

### Production change

PR #159 removed `repairSpotlight()`, its duplicate helpers, Home observer target, and ranking-readiness listeners while preserving all then-unproved profile, drawer, **What’s New**, route, soft-refresh, and delayed-startup paths.

### Proof

The mobile proof withheld ranking readiness beyond the old 3.6-second retry window, exercised Home mutation, canonical readiness, repeated readiness/profile events, route changes, foreground recovery, direct schedules, and refresh. Only `home-dashboard.js` replaced the placeholder.

Startup Architecture Gate #151 and dedicated iOS Home Startup Stability #22 passed on exact head `c274c5d1c35f2d1b212632dd181e5f29343c1178`.

## Batch 2 — retire duplicate Resume Snapshot repair

### Proven duplicate

`assets/js/calculated-profile-runtime.js` is the calculated fighter-profile owner loaded by `assets/js/production-ranking-bootstrap.js` before production readiness is published. It:

- replaces `window.openFighter()`;
- renders the complete fighter profile through one `fighterDetail.innerHTML` write;
- builds the eight-field Resume Snapshot from `RANKING_DATA.visibleStats`;
- explicitly publishes `snapshotOwner: 'RANKING_DATA.visibleStats'`;
- derives Longest UFC Win Streak from canonical UFC fight facts with a calculated-row fallback;
- restores its own content whenever the fighter profile is reopened.

The stability layer independently inferred the displayed fighter, recalculated several values through separate fallbacks, rewrote every matching `.snapshot-item strong`, and stored `drawer.dataset.currentFighter`. Its schema had already drifted from the canonical owner: it still repaired **Prime Stoppage Losses** while the current profile displays **Longest UFC Win Streak**. It was therefore an older second content owner, not a needed drawer-state recovery.

### Production change

PR #161:

- removed `repairSnapshot()` and all snapshot-specific lookup/calculation helpers;
- removed the snapshot repair from `syncDrawerState()`;
- removed `.snapshot-grid` as an explicit added-node observer target;
- removed `repairSnapshot` from the exported stability API;
- stopped the stability layer from inspecting `fighterDetail`, ranking data, display overrides, snapshot items, or hidden current-fighter state;
- preserved drawer/body synchronization, native-destination profile dismissal, **What’s New** normalization, route and soft-refresh listeners, the narrowed observer, and all six bounded startup passes.

### Proof

The permanent static contract requires the production bootstrap to load and require the calculated profile runtime before readiness, protects the complete current snapshot schema, and rejects any remaining `repairSnapshot` production writer or profile-content access from the stability layer.

The mobile 390×844 proof:

- opens Jon Jones through the calculated `openFighter()` owner;
- verifies exactly one profile write and the current eight calculated snapshot values;
- exercises drawer mutation, route, soft-refresh, direct schedules, and the complete 3.6-second delayed startup window;
- confirms zero stability snapshot-value writes and no duplicate profile render;
- intentionally corrupts one snapshot value and proves the stability layer does not reclaim content ownership;
- reopens the fighter through the canonical owner and confirms the correct calculated value returns;
- verifies retained drawer/body synchronization and native-destination overlay dismissal.

The isolated profile proof passed. The first aggregate rerun exposed only a stale assertion in the older Spotlight proof that required the previous runtime version name; that proof was corrected to test the owner behavior rather than pin a future Phase 3 version label. No temporary diagnostic workflow remains.

Startup Architecture Gate #158 and dedicated iOS Home Startup Stability #28 passed on exact head `534a984625bb2764beb289b0211ab102318dd713`.

## Unrelated workflow inspection

- Production Ranking Browser Smoke #566 failed at **Audit every fighter photo path** before ranking and mobile-profile certification. None of the six PR #161 files participates in that photo audit.
- Scoring Architecture Guardrails #1396 passed syntax, profile-copy coverage, and physical source ownership, then failed its established permanent runtime contract step. The isolated stability runtime and profile-owner proof do not alter scoring, roster, rank, or generated data expectations.

## Remaining Phase 3 order

1. Audit malformed **What’s New** normalization and identify the current markup/unread owner plus any reproducible malformed-DOM condition.
2. Audit drawer/body synchronization and native-destination overlay dismissal as separate responsibilities.
3. Narrow the observer, route/soft-refresh listeners, and six startup timers only as their final retained targets are proved.
4. Do not broadly delete the observer, timers, or stability file while they still support an unproved recovery path.
5. Add focused static and mobile delayed-observation proof for every subsequent batch.
