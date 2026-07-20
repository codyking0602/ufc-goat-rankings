# Phase 2 Route Ownership Audit

_Last updated: 2026-07-20_

## Audit baseline and scope

- Verified starting `main`: `7d9dc2ce668d5a4eac9dd9c31fe7e9865abc4dfe`.
- This audit is documentation-only. It does not authorize a runtime edit.
- Phase 2 means **remove duplicate ownership**, not add more singleton markers.
- Runtime inspection was limited to the route owners and directly invoked route-support files required to explain current behavior.

The mandatory architecture sources were read in the required order before runtime inspection:

1. `docs/startup/STATUS.md`
2. `docs/startup/DECISIONS.md`
3. `docs/startup/OWNERS.md`
4. `docs/startup/PHASE-1-OWNER-AUDIT.md`
5. `docs/startup/TEST_PLAN.md`
6. `docs/startup/KNOWN_ISSUES.md`
7. `docs/startup-architecture.md`
8. all current comments on Issue #102
9. `.github/workflows/startup-architecture-gate.yml`
10. `scripts/test-startup-contract.mjs`

The directly relevant runtime inspection included:

- `assets/js/fresh-home-route-bootstrap.js`
- `assets/js/fresh-home-launch.js`
- `assets/js/octagon-hq-shell.js`
- `assets/js/octagon-hq-nav-grid.js`
- `assets/js/native-app-shell.js`
- `assets/js/native-app-shell-stability.js`
- `assets/js/share-deep-links.js`
- `assets/js/product-architecture.js`
- `assets/js/app.js`
- `index.html`
- `share.html`
- `assets/js/picks-internal-navigation.js`
- `assets/js/play-hub.js`
- `assets/js/profile-challenges.js`
- `scripts/test-ios-standalone-resume-home.mjs`
- `scripts/test-phase-4b-mobile.mjs`

No scoring, fighter-data, photo, generated-ranking, presentation, or unrelated product files were inspected beyond what was necessary to establish a route handoff.

## 1. Executive conclusion

Route ownership is **genuinely duplicated**, but the duplicate-looking behavior is not all removable.

Two duplicated responsibility areas are proven:

1. `assets/js/app.js` still attaches a legacy primary-tab click handler that independently removes every active view, activates `button.dataset.view`, and refreshes the ranking UI. That recreates part of the canonical activation work already owned by `assets/js/octagon-hq-shell.js`.
2. `assets/js/fresh-home-route-bootstrap.js` and `assets/js/fresh-home-launch.js` both classify the startup URL and choose Home or Picks continuation. In routes already canonicalized before the shell starts, late launch activates the same destination again.

The first area is cleaner than the second. The `app.js` handler is shadowed during normal operation by the shell's earlier document-capture handler, which stops the event before it reaches the legacy per-button listener. However, the legacy handler may still be acting as a partial fallback if the shell script fails or is delayed until `product-architecture.js` dynamically reloads it. That missing-owner case has not been proved.

The startup classifier duplication is not safe to remove now. Late launch is still required for query-only Picks invitations and continuations where the early bootstrap preserves the query but does not convert it into `#picks` before the shell parses the hash.

**Conclusion:** duplicate ownership is real, but **no runtime removal is authorized yet**. The first isolated candidate is the legacy top-navigation activation block in `assets/js/app.js`. It becomes the first safe Phase 2 runtime batch only after a focused harness proves that delayed or missing shell recovery does not depend on that block.

## Classification key

- **Canonical owner** — chooses or activates the route through the approved public contract.
- **Legitimate delegation** — calls the canonical owner without recreating its logic.
- **Required retry** — repeats a request because a prerequisite may not exist yet.
- **Compatibility repair** — restores behavior during a known timing or legacy boundary.
- **Duplicate ownership** — independently chooses or activates the same route responsibility.
- **Presentation-only synchronization** — observes the active route and updates visual state without choosing it.
- **Unresolved** — may be duplicate ownership, but a recovery dependency has not been disproved.

## 2. Current route-owner map

| Responsibility | Canonical owner | Secondary owners or observers | Trigger | Classification | Risk / removal effect |
|---|---|---|---|---|---|
| Earliest installed-app and URL cleanup | `fresh-home-route-bootstrap.js` | `fresh-home-launch.js` repeats the same key lists and continuation classification | Synchronous file evaluation before the shell | Bootstrap canonical; late launch duplicate plus recovery | High. Removing late classification can break query-only Picks routes; removing early normalization can reintroduce stale installed-app destinations. |
| Default cold-start destination | Early bootstrap writes `#home`; shell parses and activates it | Fresh launch later calls `activateHome()` | Synchronous bootstrap, synchronous shell start, late synchronous file evaluation | Confirmed repeated choice/activation | Medium-high. The repeated Home activation is unnecessary in the normal path, but late launch owns other required cases. |
| Supported hash interpretation | `octagon-hq-shell.js::parseRoute()` | Early bootstrap may replace the hash with `#home` before parsing | Shell start and `hashchange` | Canonical interpretation with an earlier policy gate | High. The bootstrap's fresh-Home policy intentionally prevents most bare cold-start hashes from surviving. |
| Query-string interpretation for startup preservation | Early bootstrap | Fresh launch | Synchronous evaluation in both files | Duplicate classification | High because the accepted keys are not equivalent to the shell's hash routes. |
| Primary destination activation | `octagon-hq-shell.js::showView()` through `window.UFC_APP_SHELL` | `app.js` legacy `.tab` handler; fresh launch; share/deep-link routes; profile challenges; native shell | Shell API, top-nav click, bottom-nav click, deep-link routing, startup launch | `app.js` is duplicate; others are delegation or orchestration | Medium for `app.js`, high for broad consolidation. |
| Ranking subview activation | `octagon-hq-shell.js` | Static subnav markup in `index.html`; `app.js` can only force the legacy `men` view if its top-tab handler runs | Shell top/subnav click and API | Canonical shell; legacy partial duplicate | Medium. A live legacy handler would erase the shell's preserved ranking subview. |
| Active primary top-navigation presentation | Shell `syncNavigation()` | Nav-grid clears legacy inline styles; native shell observes destination; `app.js` toggles classes only inside its duplicate activation block | Route activation, MutationObserver, timers, resize | Shell canonical; nav-grid/native presentation-only; `app.js` duplicate | Low for observers, medium for legacy removal until fallback proof. |
| Bottom-navigation activation | Shell API | `native-app-shell.js` creates buttons and delegates `activateDestination()` | Bottom-nav click | Legitimate delegation | High if moved. Native shell must not become a second route parser. |
| Bottom-navigation active-state synchronization | `native-app-shell.js::syncActive()` | Shell emits `octagon-hq:view-change` | View-change, MutationObserver, delayed timers, resize, orientation, visibility | Presentation-only synchronization | Low. Removing it leaves stale mobile navigation, not a different canonical route. |
| Top-navigation grid/style repair | `octagon-hq-nav-grid.js` | Shell normalizes top-nav markup and labels | DOMContentLoaded, timers, resize, shell start | Presentation compatibility | Low route risk, but not a Phase 2 route-owner removal. |
| Late Home launch | Fresh launch currently performs the late call; shell remains the activation owner | Early bootstrap and shell already acted in normal Home launches | Late synchronous evaluation | Duplicate in normal path; compatibility in unresolved path | High until route-specific proof separates normal duplication from recovery. |
| Picks continuation and invite startup | Fresh launch closes the query-only gap by calling shell Picks | Early bootstrap decides preservation; shell handles `#picks`; Picks runtime handles room/event state | Synchronous bootstrap and late launch | Distributed, partly duplicated, partly required | High. Query-only `group`/`room` routes can otherwise remain on Home. |
| Incoming shared-link type selection | `share-deep-links.js::routeCurrent()` | `share.html` redirects to `index.html`; early bootstrap preserves explicit query keys | Redirect, 80 ms timer, ranking-ready event, popstate, public API | Canonical deep-link orchestration | High. It must remain callable after the app is already running. |
| Fighter-profile deep link | Share/deep-links selects the route and waits; shell activates Rankings; `app.js::openFighter()` renders the drawer | Share profile wrapper and native stability decorate/repair the drawer | Incoming route timer, ranking-ready retry, public API | Legitimate multi-owner handoff | High. Route activation and profile rendering are separate responsibilities. |
| Find the Leader shared result | Share/deep-links activates Play and waits for Play hub/game APIs | Play hub owns internal game screen | Incoming route timer/popstate | Legitimate delegation plus required wait | High. Removing the second Play activation would break warm incoming links. |
| Profile challenge deep link | `profile-challenges.js::routeCurrent()` owns challenge retrieval/opening; share/deep-links invokes it for `share=play-challenge` | Profile challenges also schedules its own 200 ms route pass and guards with `state.routed` | 200 ms timer, share route, public API | Legitimate shared trigger with internal dedupe | High. The two triggers protect different load orders. |
| Picks event deep link | Share/deep-links activates Picks and waits/selects recap; Picks internal navigation owns `picksView` | Fresh launch owns query-only Picks startup; Picks internal popstate restores internal section | Incoming route, timer, popstate, MutationObserver | Legitimate distributed ownership | High. Primary destination and Picks subroute are distinct. |
| War Room deep link | Share/deep-links waits for access then delegates to shell; War Room board loads the week/message | Shell rejects disabled War Room to Home | Incoming route, wait loop, public API | Required retry and delegation | High. Removing the wait can strand an authorized link on Home. |
| Intelligence destination | Shell maps `intelligence` to view `compare` | Native Ask action delegates to shell | Top-nav click, Ask click, shell API/hash | Canonical shell plus delegation | Low. No second Intelligence route parser was found. |
| Play internal game route | `play-hub.js` | Share/deep-links and profile challenges call `openGame()` after primary Play activation | Game-card click, public API, shared route | Legitimate subroute owner | High. Play screen state is not primary destination ownership. |
| Picks internal section route | `picks-internal-navigation.js` | Share/deep-links supplies query/event context | Click/keyboard, startup, popstate, MutationObserver | Legitimate subroute owner | High. It stores and restores a section inside Picks, not the primary app destination. |
| Browser hash change | Shell | Share/deep-links reacts separately to `popstate`; Picks internal routing reacts to `popstate` | `hashchange` | Canonical primary route listener | Medium. Shell intentionally has no general `popstate` listener. |
| Browser back/forward query restoration | Share/deep-links for share query; Picks internal navigation for `picksView` | Shell reacts only if the hash also changes | `popstate` and possibly `hashchange` | Legitimate distributed interpretation | High. Centralizing these without payload/subroute tests would lose behavior. |
| Missing shell DOM recovery | Shell retries once on `DOMContentLoaded` | Static DOM normally exists before the script | Immediate start and one-time DOMContentLoaded | Required retry | Low in normal manifest, high if altered. |
| Missing shell script/API recovery | `product-architecture.js` compatibility facade can inject the shell | `app.js` legacy tab handler may provide partial navigation before recovery | Public facade call and dynamic script insertion | Compatibility plus unresolved legacy fallback | High. This is the missing proof blocking the first runtime removal. |
| Delayed downstream deep-link readiness | Share/deep-links and profile challenges | Ranking-ready event, timers, wait loops | Timers, custom events, popstate | Required retry | High. These are not duplicate primary owners. |
| Missing destination DOM | Shell falls back to Home | Native shell reads active DOM only as presentation fallback | Shell API call, sync pass | Canonical fallback plus presentation fallback | Medium. A missing view currently changes the route to Home. |
| Background/resume route correction | No file re-chooses the primary route | Native shell only synchronizes active presentation; current iOS harness asserts no new route event | `visibilitychange`; simulated pagehide/pageshow | Presentation-only synchronization | Low. Adding a resume route chooser would be a regression. |
| Fighter drawer cleanup on navigation | `native-app-shell-stability.js` closes an open fighter drawer when bottom nav is tapped | `app.js` owns drawer rendering/close button | Capture click, MutationObserver, delayed schedule | Compatibility repair, not route activation | Medium. Removing it can leave a drawer visually covering the new destination. |
| Route-related metadata | Share/deep-links updates document and social metadata | Shell sets the base document title during startup | Shared route | Decoration | Low route ownership; must remain with shared-link context. |

### Route state channels

| Channel | Current route-related state |
|---|---|
| Globals | `UFC_APP_SHELL.currentDestination`, `currentRankingView`, `UFC_PRODUCT_ARCHITECTURE`, `UFC_FRESH_HOME_LAUNCH`, `UFC_SHARE_LINKS`, `UFCPicksNavigation`, `UFC_PLAY_HUB`, `UFC_PROFILE_CHALLENGES` |
| DOM classes | One `main.shell > .view.active-view`; active/selected top and bottom navigation buttons; open fighter drawer |
| DOM attributes | `data-fresh-home-bootstrap-route`, `data-fresh-launch-route`, `data-fresh-launch-source`, `data-app-shell`, `data-share-route`, `data-picks-active-view`, `data-play-screen` |
| Location hash | Primary destination and ranking subview, for example `#home`, `#picks`, `#play`, `#rankings/women` |
| Query string | Shared route type/payload; Picks room/event/internal view; challenge code; short-lived `__picks_resume` marker |
| History | Route owners use `history.replaceState()`. No inspected primary route owner creates a normal top-navigation history entry with `pushState()`. |
| Session storage | `ufc-picks:internal-view` stores the Picks internal section only |
| Local storage | Product/profile code stores Picks identity/group handoff; no inspected file stores the primary destination in local storage |
| Events | `octagon-hq:view-change`, `picks:routechange`, production-ranking-ready, profile-ready/profile-updated, Play/shared-ready and soft-refresh events |

## 3. Route execution traces

### Trace 1 — Installed-app cold launch with no explicit destination

1. `fresh-home-route-bootstrap.js` acts first during synchronous evaluation.
2. It removes stale Picks/game keys, writes `#home` with `history.replaceState()`, and records `freshHomeBootstrapRoute=home`.
3. `octagon-hq-shell.js` starts immediately because the static nav and shell DOM already exist.
4. The shell parses `#home`, activates only `#home`, synchronizes the top navigation and toolbar, and emits `octagon-hq:view-change` on the next animation frame.
5. `app.js` later attaches its legacy per-tab click handlers, but it does not act during startup.
6. `fresh-home-launch.js` recomputes the same startup decision and calls shell `activateDestination('home')` again.
7. Native shell and compatibility layers synchronize or decorate the already active Home surface.
8. Share/deep-links runs its delayed route pass and does nothing because no supported `share` type exists.

**Duplicate point:** the late Home activation repeats the shell activation and emits another view-change in the normal path.

### Trace 2 — Cold launch with a shell-supported destination in the URL

A bare hash such as `#rankings/women`, `#play`, or `#intelligence` is supported by the shell parser, but it is not automatically an approved cold-start exception.

1. Early bootstrap sees no explicit deep-link query key and no preserved Picks continuation.
2. It replaces the supplied hash with `#home`.
3. The shell therefore parses and activates Home.
4. Fresh launch repeats Home activation.

A destination hash survives cold launch only when the early bootstrap classifies the URL as an explicit deep link or a preserved Picks continuation.

**Ownership distinction:** the shell owns route parsing, but the bootstrap owns the earlier fresh-Home policy that decides whether the shell may see the original hash.

### Trace 3 — Cold launch with a fighter-profile deep link

For a supported shared fighter URL, `share.html` first redirects to `index.html` while retaining the query and ranking hash.

1. `share.html` copies the query and hash and uses `location.replace()`.
2. Early bootstrap sees `share` and/or `fighter`, classifies the URL as an explicit deep link, and preserves it.
3. The shell parses the ranking hash and activates the requested ranking board.
4. Fresh launch sees an explicit deep link and does not force Home or Picks.
5. Share/deep-links runs after its 80 ms delay, validates the fighter, delegates Rankings activation to the shell, waits for `openFighter`, opens the drawer, and decorates the profile.
6. Native shell only synchronizes Rankings as the active primary destination. Native stability may repair the open drawer presentation.

**Repeated action:** Rankings can be activated once by shell startup and again by the deep-link orchestrator. The second call is required for warm incoming links and therefore is not classified as removable duplicate ownership.

### Trace 4 — Cold launch with a Picks or Play deep link

#### Picks event or recap

1. The explicit shared-link query preserves `#picks` through early bootstrap.
2. The shell activates Picks.
3. Picks internal navigation reads `picksView`, room, and session state and activates its internal section.
4. Share/deep-links delegates Picks activation, waits for the requested event/recap DOM, selects the event, and scrolls to the recap or event hero.

#### Play result or challenge

1. The explicit shared-link query preserves `#play`.
2. The shell activates Play and schedules Play support.
3. Share/deep-links delegates Play activation and waits for `UFC_PLAY_HUB` and the requested game API.
4. A profile challenge additionally delegates to `profile-challenges.js`, which fetches the challenge and opens the exact Find the Leader setup.
5. Profile challenges has its own delayed `routeCurrent()` pass, but `state.routed` prevents a second challenge route from completing.

**Ownership distinction:** shell owns Play/Picks as primary destinations; Play hub and Picks internal navigation own only their internal screens.

### Trace 5 — Cold launch with War Room or Intelligence

#### War Room shared link

1. The explicit share/message query preserves the route.
2. The shell attempts `#war-room`/`#octagon` mapping.
3. If the top War Room button is still disabled, the shell intentionally falls back to Home.
4. Share/deep-links waits up to the current access window for the button to become enabled.
5. It then delegates War Room activation, loads the requested board week, and locates the message.

The delayed second activation is a required authorization/readiness retry.

#### Intelligence

A bare `#intelligence` cold launch is normalized to Home by the early fresh-Home policy. If an explicit deep-link marker causes the hash to be preserved, the shell maps `intelligence` to the `compare` view. The native Ask button always delegates to the shell and does not parse the route itself.

### Trace 6 — Incoming shared link after the app is already running

1. A full browser navigation to `share.html` reloads through the cold-link trace above.
2. For a same-document history traversal or explicit `UFC_SHARE_LINKS.routeCurrent()` call, share/deep-links reads the new query.
3. Its `routing` flag and route key prevent the same payload from running concurrently or twice.
4. The shell changes the primary destination when the deep-link handler delegates activation.
5. The deep-link handler waits for and opens the payload-specific destination inside that primary surface.
6. Native shell synchronizes presentation after the shell emits `octagon-hq:view-change`.

The incoming-link owner must retain a callable warm-route path; startup-only routing is insufficient.

### Trace 7 — Browser back/forward through popstate

1. If traversal changes the hash, the shell's `hashchange` listener reparses and activates the primary destination.
2. Share/deep-links separately receives `popstate` and reruns only a supported, not-already-routed shared payload.
3. Picks internal navigation receives `popstate`, ignores remembered session state, and applies the explicit `picksView` or room-derived internal route.
4. If only the query changes and the hash does not, the shell may not act; the share or Picks subroute owner handles its own query state.

This is legitimate distributed behavior. A single generic popstate handler would need to preserve all three meanings before consolidation.

### Trace 8 — Navigation away from and back to Rankings

1. The shell owns the initial Rankings activation and stores `currentRankingView`.
2. A ranking subnav click updates that stored view and writes `#rankings/<view>`.
3. Leaving Rankings changes only `currentDestination`; the ranking view remains stored.
4. Returning through the shell activates the stored ranking view.
5. Native shell changes only the bottom-nav active state.

If the legacy `app.js` tab handler were allowed to run, it would activate the top button's static `data-view="men"` and bypass the shell's preserved ranking subview, hash, toolbar, current-destination state, and view-change event. That semantic conflict confirms duplicate ownership even though the shell normally suppresses the legacy handler.

### Trace 9 — Background/resume on a non-Home destination

1. No scoped file re-runs startup route selection on `visibilitychange`, `pageshow`, or resume.
2. Native shell calls `syncActive()` and badge synchronization when the document becomes visible.
3. Native stability may schedule presentation repairs.
4. The shell's active destination and active view remain unchanged.
5. The existing iOS route-stability harness verifies repeated pagehide/pageshow activity emits no additional route changes.

Any future resume handler that chooses Home would be a regression.

### Trace 10 — Missing destination DOM or delayed route-owner readiness

1. If static `nav.tabs` or `main.shell` is absent when the shell file evaluates, shell `start()` returns false and registers a one-time `DOMContentLoaded` retry.
2. If a requested view element is missing when `showView()` runs, the shell falls back to Home.
3. If `UFC_APP_SHELL` is missing later, product architecture publishes a compatibility facade and injects the shell script.
4. That facade returns false from the initiating call after it starts the load; it does not automatically replay that same method call.
5. Share/deep-links and profile challenges solve downstream readiness with route-specific wait loops and ready-event retries.
6. The legacy `app.js` top-tab listener may provide partial click navigation before a dynamically recovered shell becomes available.

The final point is unresolved and blocks deletion of the legacy listener without a focused failure-mode harness.

### Trace 11 — Malformed or unsupported route input

1. An unknown bare hash without an explicit preserved query is normalized to Home by early bootstrap.
2. An unsupported `share` type is ignored by `share-deep-links.js` and activates no destination of its own.
3. A recognized share type with an invalid payload may already have had its hash activated by the shell; the deep-link owner catches the payload error, shows the failure toast, and does not complete the requested internal route.
4. A missing destination DOM falls back to Home through the shell.

The startup owner, primary shell, and payload owner each have a distinct failure boundary.

### Trace 12 — Repeated or rapid route activation

1. Each top-nav user click is captured by the shell at the document level and handled once.
2. `stopImmediatePropagation()` prevents the legacy `app.js` per-button listener and other downstream top-tab listeners from handling that same click.
3. Repeated shell API calls are allowed and can emit repeated `octagon-hq:view-change` events even when the destination is unchanged.
4. Share/deep-links prevents concurrent or same-key repeated payload routing with `state.routing` and `state.key`.
5. Play hub separately guards an in-progress `openGame()` call.
6. Native shell only resynchronizes presentation and badges after route events.

A future runtime batch must prove one route activation, one active view, one history mutation at most, and one downstream action per user tap.

## 4. Confirmed duplicate ownership

Only the following behaviors are proven duplicate ownership.

### A. Legacy top-tab activation in `assets/js/app.js`

The block attached during synchronous `app.js` evaluation:

- listens independently on every `.tab`;
- removes `active` from all tabs;
- removes `active-view` from all views;
- activates `button.dataset.view`;
- refreshes the rankings UI.

The canonical shell already owns the same primary activation responsibility and also owns current destination, ranking-subview preservation, route hash, toolbar state, access fallback, navigation ARIA, Play support, and `octagon-hq:view-change`.

Normal user clicks are intercepted earlier by the shell's document-capture listener, so the legacy handler is structurally shadowed. It remains unresolved as a missing-shell fallback.

### B. Startup route classification in early bootstrap and late launch

Both files independently define and evaluate:

- explicit deep-link keys;
- Picks route keys;
- stale query keys;
- standalone mode;
- navigation type;
- fresh Picks resume age;
- bare Picks invite status;
- Home-versus-Picks startup intent.

For an already canonical Home route or hash-based Picks continuation, late launch repeats the route decision and shell activation after the shell has acted.

This is confirmed duplication, but broad removal is unsafe because late launch still supplies query-only Picks activation and the resume-marker lifecycle.

## 5. Legitimate shared responsibilities

The following distribution must not be mislabeled or removed as duplicate route ownership:

- `share.html` transports shared query/hash state into the main app.
- Early bootstrap decides whether a cold-start URL is allowed to survive the fresh-Home policy.
- The shell parses and activates the primary destination.
- Share/deep-links interprets the shared payload and opens the payload-specific destination after prerequisites are ready.
- `app.js::openFighter()` renders a fighter profile after Rankings is active.
- Play hub owns the selected game inside Play.
- Picks internal navigation owns Home/Event/Settings inside Picks.
- Profile challenges own challenge retrieval, identity requirements, exact game setup, and completion.
- Native shell owns bottom-navigation presentation and delegates taps to the shell.
- Nav-grid owns legacy style cleanup only.
- Native stability owns drawer and surface repair only.
- Product architecture remains a compatibility facade and dynamic shell recovery boundary.
- War Room access readiness and board/message loading remain separate from primary route activation.

## 6. Compatibility and repair dependencies

### Fresh launch cannot yet be removed or reduced broadly

It still owns:

- query-only Picks invite activation;
- short-lived `__picks_resume` marking and cleanup;
- browser-reload Picks continuation;
- late profile-setup-reminder injection;
- public `activateHome()` and `activatePicks()` compatibility methods.

A future consolidation must first make the early route decision consumable by the shell without losing these paths.

### Product architecture shell recovery must remain

Normal manifest order loads the shell first, but product architecture still has a compatibility facade that can inject the shell if the API is absent. The behavior of user navigation during that recovery window is not covered by current route tests.

### Share and challenge retries must remain

The route-specific timers, ranking-ready callback, popstate listener, API waits, War Room access wait, fighter readiness, Play hub readiness, Picks recap waits, and challenge state guard are required for cold and warm incoming links.

### Native shell synchronization must remain

Its MutationObserver, delayed passes, resize/orientation handling, visibility synchronization, and view-change listener update bottom-nav presentation and badges. They do not select a new primary destination.

### Native shell stability must remain

Its bottom-nav capture handler closes an open fighter drawer, and its observer/timers repair profile/Home presentation. It is expressly forbidden from calling `activateDestination()` or `activateView()`. Retirement belongs to Phase 3 after the source surfaces are proved.

### Legacy `app.js` top-tab handler requires one missing-owner proof

Current architecture says the shell is the only navigation owner, and normal clicks prove the legacy handler is shadowed. The unresolved case is a failed first shell load followed by product architecture recovery. Deleting the legacy handler before testing that case would violate the missing-owner stop condition.

## 7. Recommended first Phase 2 runtime batch

### Status

**Candidate identified; not yet authorized.**

No runtime batch is fully proven safe until the missing/delayed-shell case below passes. The first candidate should remain the only responsibility in the next runtime investigation.

### Isolated responsibility

Remove the shadowed legacy **primary top-navigation activation** from `assets/js/app.js` so all primary top-tab clicks are owned only by `assets/js/octagon-hq-shell.js`.

### Canonical owner

- `assets/js/octagon-hq-shell.js`
- Public contract: `window.UFC_APP_SHELL`
- Activation methods: `activateDestination()` and `activateView()`
- Internal owner: `showView()`

### Duplicate or subordinate behavior

The standalone `document.querySelectorAll('.tab').forEach(...addEventListener('click'...))` block near the end of `assets/js/app.js`.

### Smallest proposed future runtime change

Delete only that legacy `.tab` activation block.

Do not move its body, replace it with another listener, change the shell, change hashes, change refresh behavior elsewhere, or combine the removal with fresh-launch consolidation.

### What must remain unchanged

- `app.js` rendering, `refresh()`, search, division filter, reset, fighter row/profile opening, category explanations, Compare/Intelligence rendering, and drawer close behavior;
- shell top-nav and ranking-subnav capture handling;
- shell route aliases, Home fallback, ranking-subview preservation, toolbar synchronization, hash behavior, Play support loading, and view-change event;
- all native bottom-nav behavior;
- fresh Home and Picks startup behavior;
- share, fighter, Picks, Play, challenge, War Room, and Intelligence deep links;
- product architecture facade and dynamic shell recovery;
- Play hub listeners that observe top-tab navigation for game-state presentation;
- all saved state and route-related query parameters.

### Expected future runtime-batch files

Only these files should be expected if the focused proof passes:

1. `assets/js/app.js`
2. `scripts/test-startup-contract.mjs`
3. `scripts/test-route-owner-app-tab-delegation.mjs` — new focused harness
4. `.github/workflows/startup-architecture-gate.yml` — run the focused harness

If another runtime or product file becomes necessary, stop and return to audit.

### Required contract assertion changes

Add assertions that:

- `octagon-hq-shell.js` remains the canonical navigation API;
- `app.js` no longer contains the legacy all-tab active-view mutation block;
- `app.js` remains loaded exactly once and retains its non-navigation controls and drawer behavior;
- no new route listener, polling loop, observer, timer, dynamic loader, `pushState`, or reload path is introduced.

### Required focused harness

The new harness must run the original and candidate behavior against the same fixture and prove:

1. one top-nav tap produces one shell activation and one active view;
2. Home, Rankings, Play, Picks, War Room access behavior, and Intelligence are unchanged;
3. Rankings returns to the previously selected ranking subview rather than forcing Men;
4. top-nav and bottom-nav active state, ARIA, toolbar state, and hash remain identical;
5. one `octagon-hq:view-change` is emitted per activation;
6. rapid repeated taps do not double-activate or leave zero/multiple active views;
7. programmatic `.click()` is still handled by the shell;
8. fighter drawer close/navigation behavior remains intact;
9. Play hub leave/return behavior remains intact;
10. delayed shell start with the DOM present remains functional;
11. first shell load failure followed by `product-architecture.js` dynamic recovery reaches a usable shell before route interaction, or otherwise reproduces the current visible fallback exactly;
12. an activation attempted during the recovery window is not lost.

The harness must fail the batch if item 11 or 12 shows that the `app.js` listener is a required compatibility fallback.

### Required automated checks

- JavaScript syntax for every changed/new script;
- startup ownership/load-order contract;
- new focused route-owner harness;
- existing iOS standalone Home/resume test;
- existing profile sign-in startup stability;
- existing delayed Home/community stability;
- existing Phase 4B mobile/Profile/Picks test;
- focused cold and warm deep-link checks for fighter, Picks, Play challenge/result, War Room, and malformed/unsupported links;
- no newly introduced unrelated failures.

The stale roster/rank expectations, Henry Cejudo certification, Alexandre Pantoja diagnostics, and women's thumbnail failures remain unrelated and must not be repaired in this batch.

### Required physical iPhone checklist

Test the exact immutable PR head on the installed app:

- fully closed cold launch with no URL payload;
- Home, every top navigation destination, and every bottom navigation destination;
- Rankings subview selection, leave, and return;
- repeated and rapid top/bottom navigation taps;
- Play entry, game entry, leave, and return;
- Picks signed-out and signed-in entry, room/event continuation, and return;
- fighter profile open, navigation while open, close, and return;
- incoming fighter, Picks, Play challenge/result, and War Room shared links;
- Intelligence from top navigation and the native Ask action;
- browser back/forward where available;
- background/resume on Rankings, Picks, Play, War Room, and Intelligence;
- relaunch after leaving the app on a non-Home destination;
- no blank screen, flicker, route bounce, stale nav, multiple active views, lost deep link, double tap, double game open, or repeated view-change effect.

### Exact stop conditions

Stop without opening or merging the runtime PR if:

- the failed/delayed-shell harness shows the legacy `app.js` listener is needed before recovery;
- the change requires editing shell, fresh launch, product architecture, native shell, share, Picks, Play, profile, or War Room runtime code;
- a Rankings subview, deep link, resume, profile, Picks, Play, War Room, or Intelligence path changes;
- one user action produces zero or multiple route activations;
- the focused harness cannot distinguish canonical shell activation from presentation observers;
- any product, visual, saved-state, scoring, fighter, notification, service-worker, or sharing payload behavior changes.

## 8. Later route-ownership batches

After the first candidate is proved and physically verified, later candidates should be audited in this order:

1. **Startup decision handoff:** make one canonical early route decision consumable by late launch without recomputing the same key lists.
2. **Repeated same-destination startup activation:** remove only the redundant late Home/hash-based Picks shell call while preserving query-only Picks continuation.
3. **Shared-link same-destination optimization:** consider avoiding a second shell activation only when the warm/cold route contract can prove the destination is already correct; retain payload orchestration and all waits.
4. **Product architecture route facade:** retire or narrow the shell-loading compatibility facade only after every caller uses `UFC_APP_SHELL` and failed-load recovery is covered.
5. **Native current-destination DOM fallback:** remove only after shell availability is guaranteed through all startup and resume paths.
6. **Top-tab observers in Play support:** audit presentation listeners that expect top-tab bubbling, because the shell capture handler currently suppresses them; do not combine with primary route ownership.
7. **Popstate coordination:** document one explicit dispatch contract only after shared payload, Picks internal route, and shell hash behavior have independent regression coverage.

Do not begin identity/profile, notification, general refresh/lifecycle consolidation, or Phase 3 repair retirement inside any of these route batches.

## 9. Files and product areas explicitly excluded from the first runtime batch

The first candidate must not modify:

- `assets/js/fresh-home-route-bootstrap.js`
- `assets/js/fresh-home-launch.js`
- `assets/js/octagon-hq-shell.js`
- `assets/js/octagon-hq-nav-grid.js`
- `assets/js/native-app-shell.js`
- `assets/js/native-app-shell-stability.js`
- `assets/js/share-deep-links.js`
- `assets/js/product-architecture.js`
- `assets/js/picks-internal-navigation.js`
- `assets/js/picks.js` or any Picks support file
- `assets/js/play.js`, `assets/js/play-hub.js`, or any game file
- `assets/js/profile-challenges.js` or any identity/profile file
- `index.html` or `share.html`
- notification files
- service workers or update delivery
- ranking data, scoring formulas, judgments, OVRs, divisions, generated feeds, profiles, photos, or fighter assets
- Games behavior, Picks behavior, Intelligence, War Room, sharing payloads, notifications, copy, styles, or visual design
- stale roster/rank contracts, Henry Cejudo certification, Alexandre Pantoja diagnostics, or women's thumbnail failures

The next task should begin in a fresh chat and should first build the focused missing/delayed-shell proof. It must not begin the runtime deletion until that proof establishes that the legacy handler is not a required compatibility fallback.
