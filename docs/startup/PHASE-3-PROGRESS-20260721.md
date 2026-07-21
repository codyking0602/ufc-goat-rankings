# Phase 3 Repair-Loop Progress — 2026-07-21

## Current production position

- Production runtime merge: PR #159, `aa09175a99fcd1b381645e96e74531336674346f`.
- Exact tested runtime head: `c274c5d1c35f2d1b212632dd181e5f29343c1178`.
- Startup Architecture Gate: run #151 passed completely.
- Dedicated iOS Home Startup Stability: run #22 passed completely.
- Phase 3: in progress; first repair-loop retirement batch complete.
- Visible product change: none intended or approved.

## Working rule

Phase 3 audits one repair behavior at a time. A repair is removed only when the canonical owner, all triggers, delayed paths, route/lifecycle behavior, and remaining recovery are proved. The stability file is not treated as one removable unit.

## Initial behavior inventory — `assets/js/native-app-shell-stability.js`

| Behavior | Trigger / frequency | State or DOM changed | Canonical overlap | Lifecycle / teardown | Removal risk | Current disposition |
|---|---|---|---|---|---|---|
| Module singleton | One production load | Claims `window.__UFC_NATIVE_APP_SHELL_STABILITY_STARTED__` | None | Startup-only; no teardown needed | Duplicate listeners/observers if absent | Keep |
| `repairSnapshot()` | Debounced observer work, route/soft-refresh events, delayed startup passes, open-drawer sync | Rewrites visible Resume Snapshot values and `drawer.dataset.currentFighter` | Base fighter-profile rendering owns initial profile markup | Recovery can run indefinitely; no teardown | A legitimate late or replaced drawer DOM may otherwise retain stale snapshot values | Keep pending a separate profile-render ownership audit |
| `normalizeWhatsNew()` | Debounced observer work, route/soft-refresh events, delayed startup passes | Repairs malformed **NEW** button markup and asks the update watcher to resync unread state | Update watcher owns unread state; this layer only repairs malformed presentation | Recovery can run indefinitely; no teardown | Known malformed/duplicated button DOM could remain broken | Keep pending a separate malformed-DOM reproduction audit |
| `syncDrawerState()` | Debounced observer work, close click continuation, route/soft-refresh events, delayed startup passes | Toggles `body.fighter-profile-open`; invokes snapshot recovery while open | Drawer/profile owner controls open state and content | Recovery can run indefinitely; no teardown | Native layout or restored drawer state may desynchronize body presentation | Keep pending a separate drawer-state audit |
| `closeFighterProfile()` | Capturing click on a native destination | Closes the fighter drawer and clears body state | Canonical destination owner handles routing, not overlay dismissal | Event-driven; no teardown | Destination changes could leave the profile overlay covering the new route | Keep as legitimate native navigation recovery |
| `schedule()` | Any retained listener/observer/timer; 30 ms debounce | Runs the retained presentation repairs | Subordinate only | Reuses one timeout; no teardown | Removing it would change all retained recovery cadence | Keep while retained behaviors remain |
| Body `MutationObserver` | Indefinite child/class/hidden/aria-hidden observation | Schedules retained drawer and **What’s New** repairs | Overlaps only with the retained presentation recovery targets after PR #159 | Indefinite; no teardown | Legitimate DOM replacement may be missed if removed broadly | Narrowed by PR #159; future candidate one target at a time |
| Route and soft-refresh listeners | Every `octagon-hq:view-change` and `octagon-hq:soft-refresh` | Schedules retained drawer/**What’s New** synchronization | Canonical route/refresh owners publish the events; stability remains a passive presentation consumer | Indefinite; no teardown | Route-driven overlay/presentation recovery may be lost | Keep pending target-specific proof |
| Delayed startup passes | One shot at 0, 80, 240, 700, 1600, and 3600 ms | Schedules retained repairs | Historical delayed-startup safety net | Startup-only; timers are not retained for cancellation | Late DOM availability may still require a bounded retry | Keep pending target-specific delayed-startup proof |
| `repairSpotlight()` | Previously ran from all delayed passes, ranking-readiness events, route/soft-refresh events, and arbitrary Home mutations | Directly replaced `.home-spotlight-loading` with independently generated Spotlight HTML | `assets/js/home-dashboard.js` already owns readiness, deterministic selection, local cache, placeholder, rendering, route re-entry, visibility recovery, and duplicate-markup suppression | Historical indefinite repair; no teardown | Removal would be unsafe only if the Home owner could not recover after delayed rankings | **Removed in PR #159 after static and mobile proof** |

## Batch 1 — retire duplicate Ranking Spotlight repair

### Proven duplicate

`home-dashboard.js` is the canonical Home and Ranking Spotlight renderer. It already:

- waits for calculated production ranking readiness;
- owns the loading placeholder;
- selects and persists the deterministic daily fighter;
- owns the Spotlight copy, actions, image, and markup;
- rerenders on scoring and production-ranking readiness;
- rerenders on Home re-entry and foreground resume;
- suppresses identical markup rewrites with `lastMarkup`.

The stability layer independently watched arbitrary Home mutations, listened to the same ranking-readiness events, ran six delayed retries, read raw ranking globals/local storage, and could replace the owner’s placeholder through `outerHTML`. It therefore acted as a second renderer rather than a necessary recovery consumer.

### Production change

PR #159:

- removed `repairSpotlight()` and its duplicate helper logic;
- removed Ranking Spotlight from the exported stability API;
- stopped the indefinite observer from waking on arbitrary `#home` mutations or `.home-spotlight-loading` insertion;
- removed scoring and production-ranking readiness listeners from the stability layer;
- preserved every drawer, profile snapshot, native-destination, **What’s New**, route, soft-refresh, and delayed-startup recovery path.

### Proof

The focused static contract establishes the permanent boundary: only `home-dashboard.js` may own Ranking Spotlight readiness and rendering.

The mobile proof:

- starts signed out with ranking readiness withheld;
- mutates Home and waits beyond the old 3.6-second final retry;
- confirms the canonical loading placeholder remains untouched;
- publishes scoring and production-ranking readiness;
- confirms exactly one canonical Home rewrite renders the Spotlight;
- repeats readiness, profile, route, visibility, and direct stability schedules;
- confirms no duplicate card, `outerHTML` repair, or unchanged Home rewrite;
- reloads and confirms delayed startup returns to the same canonical readiness boundary.

Startup Architecture Gate #151 and dedicated iOS Home Startup Stability #22 passed on exact head `c274c5d1c35f2d1b212632dd181e5f29343c1178`.

## Unrelated workflow inspection

- Production Ranking Browser Smoke #560 failed at **Audit every fighter photo path** before its ranking/browser certification steps. The four PR #159 files do not participate in that audit.
- Scoring Architecture Guardrails #1389 passed syntax and physical source ownership, then failed its established stale runtime expectations: 73 expected versus 80 current fighters/facts, judgment count 74, category audit state, Henry Cejudo and Royce Gracie pinned ranks, and Alexandre Pantoja display diagnostics. None references the isolated stability runtime or proof files.

## Remaining Phase 3 order

1. Continue within `native-app-shell-stability.js` one retained target at a time.
2. Next candidates are the profile snapshot repair, malformed **What’s New** normalization, drawer/body synchronization, and the observer/timer trigger breadth supporting them.
3. Do not remove the native-destination drawer close path without proving overlay dismissal elsewhere.
4. Do not broadly delete the observer, six startup timers, or stability file while they still support an unproved recovery path.
5. Add a focused static boundary and mobile delayed-observation proof for every subsequent batch.
