# Phase 3 Repair-Loop Progress — 2026-07-21

## Current production position

- Latest production runtime merge: PR #163, `ec8fce96cad3a19763da9545ffd671f484750556`.
- Exact tested runtime head: `b0dc85d4027845952890cc7e2e11ffdcf6c1b11f`.
- Startup Architecture Gate: run #163 passed completely.
- Dedicated iOS Home Startup Stability: run #32 passed completely.
- Phase 3: in progress; three repair-loop retirement batches complete.
- Visible product change: none intended or approved.

## Working rule

Phase 3 audits one repair behavior at a time. A repair is removed only when the canonical owner, all triggers, delayed paths, route/lifecycle behavior, and remaining recovery are proved. The stability file is not treated as one removable unit.

## Behavior inventory — `assets/js/native-app-shell-stability.js`

| Behavior | Trigger / frequency | State or DOM changed | Canonical overlap | Lifecycle / teardown | Removal risk | Current disposition |
|---|---|---|---|---|---|---|
| Module singleton | One production load | Claims `window.__UFC_NATIVE_APP_SHELL_STABILITY_STARTED__` | None | Startup-only; no teardown needed | Duplicate listeners/observers if absent | Keep |
| `repairSnapshot()` | Formerly ran from observer work, route/soft-refresh events, delayed startup passes, and open-drawer sync | Rewrote visible Resume Snapshot values and hidden current-fighter state | `assets/js/calculated-profile-runtime.js` owns the complete calculated profile and snapshot render | Historical indefinite repair | Removal unsafe only if the profile owner could not restore its own content | **Removed in PR #161** |
| `normalizeWhatsNew()` | Formerly ran from observer work, route/soft-refresh events, and delayed startup passes | Replaced the **What’s New** button markup and called the update watcher’s unread sync | `assets/js/app-update-watcher.js` already owns trigger markup, click binding, unread count, badge state, and accessibility state | Historical indefinite repair | Removal unsafe only if malformed markup came from an independent production writer | **Removed in PR #163** |
| `syncDrawerState()` | Debounced drawer observation, close continuation, route/soft-refresh events, and delayed startup passes | Toggles `body.fighter-profile-open` from `#drawer.open` | Drawer/profile owner controls drawer state and content | Recovery can run indefinitely; no teardown | Native layout or restored drawer state may desynchronize body presentation | Keep pending a separate drawer-state audit |
| `closeFighterProfile()` | Capturing click on a native destination | Closes the fighter drawer and clears body state | Canonical destination owner handles routing, not overlay dismissal | Event-driven; no teardown | Destination changes could leave the profile overlay covering the new route | Keep pending its own native-overlay audit |
| `schedule()` | Retained listener/observer/timer; 30 ms debounce | Runs only drawer/body synchronization after PR #163 | Subordinate only | Reuses one timeout; no teardown | Removing it changes all retained drawer recovery cadence | Keep while drawer recovery remains |
| Body `MutationObserver` | Indefinite child/class/hidden/aria-hidden observation, now drawer-targeted only | Schedules drawer/body synchronization | No longer reads or mutates Home, profile content, or **What’s New** | Indefinite; no teardown | Legitimate drawer replacement may be missed if removed prematurely | Narrowed target by target; keep pending drawer proof |
| Route and soft-refresh listeners | Every `octagon-hq:view-change` and `octagon-hq:soft-refresh` | Schedules drawer/body synchronization | Canonical route/refresh owners publish events; stability remains a passive presentation consumer | Indefinite; no teardown | Route-driven overlay recovery may be lost | Keep pending drawer/overlay proof |
| Delayed startup passes | One shot at 0, 80, 240, 700, 1600, and 3600 ms | Schedules drawer/body synchronization | Historical delayed-startup safety net | Startup-only | Late drawer availability may still require bounded retry | Keep pending drawer-specific delayed proof |
| `repairSpotlight()` | Formerly ran from delayed passes, ranking-readiness events, route/soft-refresh events, and arbitrary Home mutations | Replaced `.home-spotlight-loading` with independently generated Spotlight HTML | `assets/js/home-dashboard.js` owns the full Spotlight lifecycle | Historical indefinite repair | Removal unsafe only if Home could not recover after delayed rankings | **Removed in PR #159** |

## Batch 1 — retire duplicate Ranking Spotlight repair

`home-dashboard.js` is the canonical Home and Ranking Spotlight renderer. It owns calculated-ranking readiness, loading state, deterministic daily selection, Spotlight markup/actions, route re-entry, foreground recovery, and identical-markup suppression.

PR #159 removed `repairSpotlight()`, duplicate helpers, the Home observer target, and ranking-readiness listeners. The mobile proof withheld readiness beyond the old 3.6-second retry window and confirmed only Home Dashboard replaced the placeholder.

- Exact tested head: `c274c5d1c35f2d1b212632dd181e5f29343c1178`.
- Startup Architecture Gate #151: passed.
- Dedicated iOS Home Startup Stability #22: passed.

## Batch 2 — retire duplicate Resume Snapshot repair

`assets/js/calculated-profile-runtime.js` is loaded and required before production ranking readiness. It replaces `window.openFighter()`, performs the single complete profile write, builds the eight-field Resume Snapshot from calculated visible stats, and owns the canonical-facts win-streak fallback.

The stability layer separately inferred the fighter, recalculated and rewrote snapshot values, and stored hidden current-fighter state. Its schema had already drifted from the actual profile.

PR #161 removed `repairSnapshot()`, its helper calculations, hidden fighter state, and explicit snapshot observer target. Drawer/body synchronization and native destination dismissal remained intact.

The mobile proof covered canonical open, current calculated values, route/soft-refresh/direct schedules, the full delayed window, intentional content corruption, canonical reopen, drawer synchronization, and native destination dismissal with zero stability profile-content writes.

- Exact tested head: `534a984625bb2764beb289b0211ab102318dd713`.
- Startup Architecture Gate #158: passed.
- Dedicated iOS Home Startup Stability #28: passed.

## Batch 3 — retire duplicate What’s New normalization

### Proven duplicate

`assets/js/app-update-watcher.js` is the sole production owner of:

- `#manualRefreshControl`, `#whatsNewBtn`, and `#whatsNewUnread` creation;
- the **What’s New** click binding;
- unread count calculation;
- badge text, visibility, and `has-unread` visual state;
- button and badge accessibility labels;
- seen-event and cross-tab storage synchronization.

The owner’s historical startup markup emitted plain `NEW` text plus the badge. `normalizeWhatsNew()` required a separate `[data-whats-new-label]` node, so it classified the canonical owner’s normal markup as malformed and rewrote the button during every startup. No second production markup writer or reproduced external malformed-DOM source existed. The repair created the condition it claimed to fix.

### Production change

PR #163:

- changed the canonical watcher’s one control write to emit `<span data-whats-new-label>NEW</span>` and the unread badge together;
- removed `normalizeWhatsNew()` and its text/markup helpers from the stability layer;
- removed **What’s New** and manual-refresh observer targets;
- removed the normalizer from `schedule()` and the exported stability API;
- left `syncUnread()` and all unread/click behavior in the canonical update watcher;
- preserved drawer/body synchronization, native-destination profile dismissal, route and soft-refresh listeners, drawer-only observation, and all six bounded startup passes.

### Proof

The permanent static contract protects one markup owner, the complete labeled canonical markup, unread-state ownership, seen/storage synchronization, and the absence of any remaining `normalizeWhatsNew`, `NEWNEW`, or **What’s New** access in the stability layer.

The mobile 390×844 proof verifies:

- one canonical control/button/label/badge write at startup;
- correct unread count, visibility, visual state, and accessibility labels;
- zero stability button writes through arbitrary DOM mutation, repeated route/soft-refresh/direct schedules, and the complete delayed window;
- canonical seen-event and storage-event updates without markup replacement;
- retained click binding;
- intentional label corruption is not reclaimed by the stability layer;
- refresh restores canonical markup through one owner write;
- retained drawer/body synchronization and native destination dismissal.

The isolated static/mobile proof passed. The first aggregate run exposed a stale exact-version assertion in the previous profile proof; it was corrected to verify the native stability runtime contract rather than pin the previous Phase 3 label. The temporary diagnostic workflow was removed before the final tested head.

- Exact tested head: `b0dc85d4027845952890cc7e2e11ffdcf6c1b11f`.
- Startup Architecture Gate #163: passed.
- Dedicated iOS Home Startup Stability #32: passed.
- Production runtime merge: `ec8fce96cad3a19763da9545ffd671f484750556`.

## Unrelated workflow inspection

- Production Ranking Browser Smoke #571 failed at **Audit every fighter photo path** before ranking and mobile-profile certification. None of the PR #163 files participates in that photo audit.
- Scoring Architecture Guardrails #1401 passed syntax, profile-copy coverage, and physical source ownership, then failed its established permanent runtime contract step. PR #163 does not alter scoring, roster, rank, or generated data.

## Remaining Phase 3 order

1. Audit `syncDrawerState()` as a drawer/body presentation responsibility.
2. Audit `closeFighterProfile()` separately as native-destination overlay dismissal.
3. Narrow or remove the drawer-only observer, route/soft-refresh listeners, and six startup timers only as those final responsibilities are proved.
4. Do not broadly delete the remaining stability file while a demonstrated overlay or delayed-drawer recovery path remains.
5. Add focused static and mobile delayed-observation proof for every subsequent batch.
