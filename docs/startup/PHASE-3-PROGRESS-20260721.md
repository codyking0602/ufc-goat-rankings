# Phase 3 Repair-Loop Progress — 2026-07-21

## Current production position

- Latest production runtime merge: PR #167, `a52364b7a53132a96c8ca5ef5f6726c32a74a2d0`.
- Exact tested runtime head: `c332cf912f3c2cbd98984f60902ba70a2304475f`.
- Startup Architecture Gate: run #168 passed completely.
- Dedicated iOS Home Startup Stability: run #36 passed completely.
- Phase 3: complete.
- Visible product change: none intended or approved.

## Working rule

Phase 3 audited one repair behavior at a time. A repair was removed only when its canonical owner, all triggers, delayed paths, route/lifecycle behavior, and remaining recovery were proved. Legitimate presentation behavior was retained rather than deleted merely to empty the stability file.

## Final behavior inventory — `assets/js/native-app-shell-stability.js`

| Behavior | Final disposition | Evidence |
|---|---|---|
| Module singleton | **Retained** | Prevents duplicate native click and drawer-observer bindings. |
| `repairSpotlight()` | **Removed in PR #159** | `home-dashboard.js` owns readiness, placeholder, selection, markup, route/visibility recovery, and duplicate suppression. |
| `repairSnapshot()` | **Removed in PR #161** | `calculated-profile-runtime.js` owns the complete calculated profile and Resume Snapshot. |
| `normalizeWhatsNew()` | **Removed in PR #163** | `app-update-watcher.js` owns trigger markup, click binding, unread state, accessibility state, and seen/storage synchronization. |
| `syncDrawerState()` | **Retained and narrowed in PR #167** | It is the sole mapping from canonical `#drawer.open` state to the mobile `body.fighter-profile-open` scroll-lock class required by CSS. |
| Body-wide `MutationObserver` | **Removed in PR #167** | Real profile open/close behavior mutates the static drawer’s own `class` and `aria-hidden`; unrelated body/Home/profile/update-control changes are not recovery triggers. |
| Drawer observer | **Retained and narrowed in PR #167** | Observes only `#drawer` `class` and `aria-hidden`. |
| Route and soft-refresh listeners | **Removed in PR #167** | Route/refresh events do not own drawer state; real drawer mutations are sufficient. |
| Six delayed startup passes | **Removed in PR #167** | The drawer is static markup loaded before the stability runtime. One immediate startup sync covers stale initial body state; later real mutations are observed directly. |
| Close-button continuation | **Removed in PR #167** | The canonical close button’s actual drawer mutation is observed directly. |
| Public repair `schedule()` API | **Removed in PR #167** | No production consumer required a manual repair trigger. |
| `closeFighterProfile()` | **Retained after separate audit** | Native destination buttons delegate routing but do not dismiss an open fighter overlay. This is legitimate one-shot overlay behavior, not a repair loop. |

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

- Exact tested head: `534a984625bb2764beb289b0211ab102318dd713`.
- Startup Architecture Gate #158: passed.
- Dedicated iOS Home Startup Stability #28: passed.

## Batch 3 — retire duplicate What’s New normalization

`assets/js/app-update-watcher.js` is the sole owner of update-control creation, the **What’s New** click binding, unread count, badge state, accessibility labels, and seen/storage synchronization.

Its historical startup markup emitted plain `NEW` text plus the badge. `normalizeWhatsNew()` required a separate `[data-whats-new-label]` node, so it classified normal canonical markup as malformed and rewrote the button during every startup.

PR #163 made the canonical watcher emit the complete labeled button and badge in its one control write, then removed the normalizer, its helpers/API, and its observer targets.

- Exact tested head: `b0dc85d4027845952890cc7e2e11ffdcf6c1b11f`.
- Startup Architecture Gate #163: passed.
- Dedicated iOS Home Startup Stability #32: passed.
- Production runtime merge: `ec8fce96cad3a19763da9545ffd671f484750556`.

## Batch 4 — narrow drawer synchronization to real lifecycle events

### Retained responsibility

The base profile renderer and calculated profile runtime both own canonical drawer state by adding/removing `#drawer.open` and updating `aria-hidden`. Neither owns `body.fighter-profile-open`.

Mobile stability CSS requires `body.fighter-profile-open` to lock scrolling and suppress bottom padding while the fighter drawer is open. Therefore `syncDrawerState()` is not a duplicate repair under the current architecture; deleting it would create a real mobile regression.

### Removed trigger breadth

The old implementation ran the same body-class mapping from:

- a body-wide child/subtree/attribute observer;
- every route change;
- every soft refresh;
- a close-button continuation;
- six delayed startup passes at 0, 80, 240, 700, 1600, and 3600 ms;
- a public manual repair API.

The drawer is static markup present before the stability script. Every real open/close changes its own `class` and `aria-hidden`. PR #167 therefore retained one immediate startup sync plus one observer scoped only to those two drawer attributes, and removed every broader trigger above.

### Native overlay dismissal audit

Native bottom-navigation buttons publish `data-native-destination` and delegate primary routing to `UFC_APP_SHELL`. Neither the native shell nor the route owner closes an already-open fighter drawer. Without `closeFighterProfile()`, the old profile overlay can remain over the newly selected destination.

That function is a legitimate capturing navigation behavior, not a polling, retry, rendering, or repair loop. It delegates to the canonical close button when present and uses a bounded fallback only when the button is missing. It remains in the minimal stability module.

### Proof

The permanent static contract protects:

- static drawer load order;
- canonical base/calculated drawer writers;
- the mobile body scroll-lock CSS dependency;
- one drawer-to-body mapping;
- one immediate startup sync;
- a `#drawer`-only `class`/`aria-hidden` observer;
- absence of body-wide observation, route/soft-refresh listeners, delayed retries, close-button continuation, and public repair scheduling;
- continued native route delegation plus separate overlay dismissal.

The mobile 390×844 proof verifies:

- stale startup body state is corrected once;
- real drawer open/close mutations apply and clear mobile scroll lock;
- unrelated body mutations, route events, soft-refresh events, and a full 3.9-second retired retry window do not reclaim body state;
- a subsequent real drawer mutation restores synchronization;
- the canonical close button remains the close owner;
- native destination clicks dismiss the overlay through that close button;
- the missing-close-button fallback restores drawer, accessibility, and body state.

Earlier Spotlight, profile, and What’s New proofs were updated to reject the retired broad triggers and public schedule API.

- Exact tested head: `c332cf912f3c2cbd98984f60902ba70a2304475f`.
- Startup Architecture Gate #168: passed.
- Dedicated iOS Home Startup Stability #36: passed.
- Production runtime merge: `a52364b7a53132a96c8ca5ef5f6726c32a74a2d0`.

## Unrelated workflow inspection

- Production Ranking Browser Smoke #576 failed at **Audit every fighter photo path** before ranking and mobile-profile certification.
- Scoring Architecture Guardrails #1406 passed syntax, profile-copy coverage, and physical source ownership, then failed its established permanent runtime contract step.
- Neither workflow failure references the isolated drawer/stability responsibility.

## Phase 3 closure

Phase 3 removed all demonstrated duplicate render/content/markup repair loops and all unneeded broad, route-driven, delayed, and public repair triggers.

The remaining stability runtime is intentionally small and justified:

1. one singleton guard;
2. one drawer-to-mobile-body presentation mapping;
3. one immediate startup synchronization;
4. one drawer-attribute observer;
5. one native-destination overlay dismissal handler.

Further movement or renaming belongs to later startup/script-manifest simplification, not repair-loop retirement. Phase 4 may now begin from production `main`.
