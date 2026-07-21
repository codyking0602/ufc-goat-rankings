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

| Behavior | Trigger / frequency | State or DOM changed | Canonical overlap | Current disposition |
|---|---|---|---|---|
| Module singleton | One production load | Claims the stability singleton | None | Keep |
| `repairSpotlight()` | Former readiness, Home mutation, route, refresh, and delayed paths | Replaced canonical Spotlight markup | `home-dashboard.js` owns the full lifecycle | **Removed in PR #159** |
| `repairSnapshot()` | Former drawer, route, refresh, observer, and delayed paths | Recalculated and rewrote Resume Snapshot content | `calculated-profile-runtime.js` owns the full profile | **Removed in PR #161** |
| `normalizeWhatsNew()` | Former control observer, route, refresh, and delayed paths | Rebuilt the **NEW** button and called unread sync | `app-update-watcher.js` owns control markup and unread state | **Removed in PR #163** |
| `syncDrawerState()` | Drawer observer, route/soft-refresh, close continuation, delayed startup passes | Toggles `body.fighter-profile-open` | Profile owner opens the drawer; presentation recovery remains unproved | Keep pending focused audit |
| `closeFighterProfile()` | Capturing native-destination click | Closes the drawer before route navigation | Route owner does not necessarily dismiss overlays | Keep pending focused audit |
| `schedule()` | Retained listener/observer/timer paths; 30 ms debounce | Runs drawer synchronization only after PR #163 | Subordinate | Keep while drawer recovery remains |
| Body `MutationObserver` | Indefinite drawer child/class/hidden/aria-hidden observation | Schedules drawer synchronization | Narrowed from Home, snapshot, and update-control targets | Keep pending drawer proof |
| Route and soft-refresh listeners | Every canonical route/soft-refresh event | Schedule drawer synchronization | Passive presentation consumer | Keep pending drawer proof |
| Delayed startup passes | 0, 80, 240, 700, 1600, and 3600 ms | Schedule drawer synchronization | Historical delayed-DOM safety net | Keep pending drawer proof |

## Batch 1 — Ranking Spotlight

`home-dashboard.js` already owned calculated-ranking readiness, placeholder, deterministic daily selection and persistence, Spotlight markup/actions, route re-entry, foreground recovery, and identical-markup suppression. The stability layer independently watched Home, listened to the same readiness events, ran all delayed retries, and could replace the owner’s placeholder through `outerHTML`.

PR #159 removed only the duplicate renderer and its Home/readiness triggers. Startup Architecture Gate #151 and iOS suite #22 passed on exact head `c274c5d1c35f2d1b212632dd181e5f29343c1178`.

## Batch 2 — Resume Snapshot

`calculated-profile-runtime.js` is required by the production ranking bootstrap before readiness, replaces `openFighter()`, writes the complete profile once, builds the eight visible snapshot values from calculated stats, and owns the canonical-facts win-streak fallback.

The stability layer separately inferred the fighter, recalculated values, rewrote snapshot DOM, and stored hidden drawer fighter state. Its schema had drifted from the current profile. PR #161 removed only that second content writer and its snapshot observer target while preserving drawer/body synchronization and native-destination dismissal.

The mobile proof covered canonical open, current values, observer/route/refresh/delayed paths, intentional corruption, canonical reopen, drawer synchronization, and native dismissal. Startup Architecture Gate #158 and iOS suite #28 passed on exact head `534a984625bb2764beb289b0211ab102318dd713`.

## Batch 3 — What’s New control

### Proven duplicate

`assets/js/app-update-watcher.js` is the canonical update-control owner. It creates `#manualRefreshControl`, `#whatsNewBtn`, and `#whatsNewUnread`; binds the click action; calculates unread count; owns badge text, visibility, visual state, and accessibility labels; and responds to seen and storage events.

Its historical button template rendered plain `NEW` text without the `[data-whats-new-label]` marker. `native-app-shell-stability.js` defined that missing marker as malformed, so every normal startup caused the stability layer to rewrite markup that the canonical owner had just created. This was not rare recovery—it was a guaranteed second writer.

### Production change

PR #163:

- changed the canonical watcher’s one control write to create `<span data-whats-new-label>NEW</span>` and the unread badge together;
- removed `normalizeWhatsNew()` and its text/count parsing from the stability layer;
- removed update-control and button targets from the indefinite observer;
- removed `normalizeWhatsNew` from the exported stability API;
- left drawer/body synchronization, native-destination dismissal, route/soft-refresh listeners, drawer observation, and all six delayed startup passes intact.

### Proof

The permanent static contract requires one canonical control markup/unread owner and rejects any stability-layer access to What’s New elements or unread synchronization.

The mobile 390×844 proof covers canonical startup markup, unread count, seen and storage events, click binding, route/soft-refresh/direct schedules, the full delayed window, intentional markup corruption, canonical refresh restoration, drawer/body synchronization, and native-destination dismissal. Stability performs zero update-control writes.

The isolated proof passed. Aggregate failures during development were stale version-label assertions in older Phase 3 proofs; those assertions were corrected to verify the stability runtime and protected behavior without pinning a previous batch name. Temporary diagnostic workflows were removed.

Startup Architecture Gate #163 and dedicated iOS Home Startup Stability #32 passed on exact head `b0dc85d4027845952890cc7e2e11ffdcf6c1b11f`.

## Unrelated workflow inspection

- Production Ranking Browser Smoke #571 stopped at the established fighter-photo path audit before ranking and mobile-profile certification.
- Scoring Architecture Guardrails #1401 remained red in its established scoring/runtime contract area.
- Neither workflow’s failure step references the isolated update watcher, native stability change, or ownership proofs.

## Remaining Phase 3 order

1. Audit drawer/body synchronization and native-destination overlay dismissal as separate responsibilities.
2. Reproduce real open, close, replacement, route, refresh, and delayed-DOM conditions before changing either path.
3. Narrow or retire the observer, route/soft-refresh listeners, debounce scheduler, and six startup timers only after their final drawer target is proved.
4. Do not assume native overlay dismissal is redundant merely because canonical routing works.
5. Add focused static and mobile proofs for each remaining batch.