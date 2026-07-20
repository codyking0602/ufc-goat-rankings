# Startup Architecture Changelog

This is the historical record of completed or formally started startup-architecture work. Current state belongs in `STATUS.md`.

## 2026-07-19 — Phase 0 foundation

Added the zero-visible-change startup architecture contract, identified the six cleanup phases and intended owners, and locked the rule that current `main` is the production source of truth.

Commit: `2e70d6b6ceb6c697c46dedadfeaf75ad40b70517`

## 2026-07-19 — Automated startup gate

Added:

- `scripts/test-startup-contract.mjs`;
- `.github/workflows/startup-architecture-gate.yml`.

The gate checks startup syntax, ownership expectations, critical load order, iOS startup routing, profile sign-in startup, and delayed Home/community stability without changing runtime behavior.

## 2026-07-19 — Permanent continuity system

Created master tracker Issue #102 and the repository handoff system:

- `docs/startup/README.md`;
- `docs/startup/STATUS.md`;
- `docs/startup/OWNERS.md`;
- `docs/startup/DECISIONS.md`;
- `docs/startup/TEST_PLAN.md`;
- `docs/startup/KNOWN_ISSUES.md`;
- `docs/startup/CHANGELOG.md`.

Future sessions start from repository documentation rather than chat memory.

## 2026-07-19 — Major Phase 1 owner audit

Added `docs/startup/PHASE-1-OWNER-AUDIT.md` and classified startup owners into four technical groups:

1. simple global-guard candidates;
2. prerequisite-aware guard candidates;
3. structural manifest singletons;
4. retry-sensitive launchers requiring an explicit lifecycle.

The audit established the one-owner-per-batch sequence and prohibited a universal marker pattern.

## 2026-07-19 — Preview and rollout policy

The separate-origin static preview used during the earliest batches did not faithfully reproduce the production installed app. It was rejected for approval use.

Physical iPhone verification became the required merge gate for mobile-sensitive owners, with the exact immutable PR head recorded before approval.

## 2026-07-19 — Phase 1 Batch 1 merged and verified

PR #100 protected:

- `assets/js/fresh-home-route-bootstrap.js`;
- `assets/js/fresh-home-launch.js`.

Final runtime diff: 8 additions, 0 deletions, 3 files. Startup and Phase 4B mobile checks passed. Cody verified the installed app was normal.

Squash merge: `5e733cc4568100e96080ce27ad601b7022daba33`

## 2026-07-19 — Phase 1 Batch 2 merged and verified

PR #105 protected `assets/js/octagon-hq-shell.js` and added one startup-contract assertion.

Final runtime diff: 4 additions, 0 deletions, 2 files. Navigation, ranking subviews, Picks lifecycle, profile sign-in, delayed Home/community, and installed-iPhone behavior passed.

Squash merge: `d7b47d6fb9ad45b101f67d5658b3e2a874a746c8`

## 2026-07-19 — Phase 1 Batch 3 merged and verified

PR #106 protected `assets/js/octagon-hq-nav-grid.js` while preserving its cleanup timers, resize listener, public API, and navigation presentation.

Final runtime diff: 6 additions, 0 deletions, 2 files. Cody verified cold launch, bottom-navigation sizing/order, active state, resize/rotation, and tap behavior.

Squash merge: `f4e3ada330fb841ade0333c580376dacaf58ec88`

## 2026-07-19 — Phase 1 Batch 4 merged and verified

PR #107 protected `assets/js/home-dashboard.js` while preserving Home markup, card order, copy, styles, timers, listeners, daily challenge, Picks, War Room, fighter spotlight, and public APIs.

Final runtime diff: 6 additions, 0 deletions, 2 files. Cody verified Home cold launch, cards, Games, Picks, War Room, profile opening, background/resume, and return-to-Home behavior.

Squash merge: `7fd6ede029cc307932cb38bc2c9274484b18f403`

## 2026-07-19 — Phase 1 Batch 5 merged and verified

PR #108 protected `assets/js/native-app-shell-stability.js` while preserving its public `schedule()` retry API, readiness events, MutationObserver, listeners, and delayed repair passes.

Final runtime diff: 4 additions, 0 deletions, 2 files. Removal remains deferred to Phase 3 after regression coverage exists.

Squash merge: `6b0c9442b5a4df46e481296bb8d5cbd3befe1ab7`

## 2026-07-19 — Phase 1 Batch 6 merged and verified

PR #110 protected `assets/js/app-notification-center.js` while preserving notification rendering, service-worker behavior, profile/activity surfaces, settings retries, observers, event APIs, permission ownership, and user-gesture-only enabling.

Final runtime diff: 4 additions, 0 deletions, 2 files. Cody verified installed-iPhone notification surfaces, permission behavior, controls, navigation, touch, and background/resume.

Squash merge: `865527b15902e7b61fff429e4faf9ce2a0bc811c`

## 2026-07-19 — Phase 1 Batch 7 merged and verified

PR #112 protected `assets/js/native-app-shell.js` while preserving bottom navigation, badge synchronization, transitions, pull-to-refresh, touch handling, public APIs, events, MutationObserver, delayed passes, resize/orientation, visibility resume, and the 10-second badge interval.

Final runtime diff: 4 additions, 0 deletions, 2 files. Cody physically tested immutable head `47812a65cfda297e5a64ea1fb51d186fce7d50a4` and reported the installed app was normal.

Squash merge: `5b82c3a47b64a4955c4fd4eb041fafe46473e8ac`

## 2026-07-19 — Phase 1 Batch 8 merged and verified

PR #113 protected `assets/js/picks.js` while preserving the original `DOMContentLoaded` retry, saved Picks and Underdog Lock restoration, tokens, room resume, routes, control bindings, backend event load, render ownership, support-owner handoffs, and 30-second polling.

Final state:

- 5 additions;
- 0 deletions;
- 2 files;
- focused duplicate-evaluation and first-run equivalence proof passed;
- Startup Architecture Gate passed;
- iOS route, profile sign-in, delayed Home/community, and Picks syntax validation passed.

Unrelated Picks static-contract, scoring guardrail, and fighter-photo failures remained separate.

Cody physically tested immutable head `1ea7bdf46f09f18279ac4f21a2bbfd492f1d44ba` and reported the installed app was normal.

Squash merge: `0c488a449d413636228aafd1e45ee8197d5078ba`

## 2026-07-19 — Phase 1 Batch 9 merged and verified

PR #114 protected `assets/js/community-profiles.js` with a top-level global duplicate-file-execution guard and added one matching startup-contract assertion.

The prerequisite and retry inspection established that the community owner has no top-level missing-DOM, missing-profile, missing-identity, or missing-data return before publishing its API and binding its lifecycle. Duplicate file evaluation was not an intentional retry mechanism.

The preserved retry and refresh paths include:

- one-time `DOMContentLoaded` startup;
- public `load()`, `refresh()`, `renderDirectory()`, `openMember()`, `openTop10()`, and `publishTop10()` APIs;
- Home view changes and soft refresh;
- profile-ready and profile-updated events;
- Picks-season updates and delayed refresh;
- profile reminder callbacks;
- delayed challenge-picker wrapping;
- individual profile close/reopen behavior;
- Top 10 load, edit, save, local restoration, and return-to-profile behavior;
- Picks identity/token handoff and challenge cleanup.

Final state:

- starting `main`: `bdacf8f10b913f5afad4ec6819921fd6f761e572`;
- exact physically tested head: `1915c0ff314b7911688574f279eba889d4967a42`;
- 4 additions;
- 0 deletions;
- 2 changed files;
- runtime original blob: `f88c3f95caf720b273e9d5a82341f8f5d3110342`;
- runtime guarded blob: `e087c82c48bd0e51765779ab4faa3df524673d7e`;
- startup-contract original blob: `b2d3f041288390ca24775868e73e3afe735da36d`;
- startup-contract modified blob: `af9d23224988be205becc284bcb0f0a70433edea`.

Validation passed:

- JavaScript syntax;
- startup ownership contract;
- focused duplicate-evaluation harness;
- exact first-run equivalence proof;
- Startup Architecture Gate run #24;
- iOS startup route stability;
- profile sign-in startup stability;
- delayed Home/community stability;
- Phase 4B fresh launch, community directory, individual profile, Top 10 save, shared-profile/Picks handoff, real Picks PIN, and cold-launch routing validation.

The passing Phase 4B artifact recorded one community directory throughout repeated and delayed samples, zero directory/profile replacement, a successful saved Top 10, and the expected Home → Picks → Home sequence.

Unrelated existing red checks were documented and not repaired:

- Production Ranking Browser Smoke stopped at existing women’s thumbnail render failures;
- Scoring Architecture Guardrails stopped in the existing permanent source/runtime contract and retained the Alexandre Pantoja generic-fallback warning;
- existing local-preview daily-score and category-audit diagnostics remained outside Batch 9.

Cody physically tested exact immutable PR head `1915c0ff314b7911688574f279eba889d4967a42` on the installed iPhone and reported **“Normal.”** Community startup, signed-in and signed-out directory behavior, profiles, Top 10 persistence, challenges, Picks handoff, notifications, badges, sharing, navigation, rapid taps, background/resume, relaunch, rotation/resize, and surrounding product surfaces showed no visible regression or duplicate ownership.

PR #114 was squash-merged as commit `4a811201bd6c2ac620d829d9701a187e468142b0`. Batch 9 was closed as physically verified.

The next isolated Phase 1 owner is `assets/js/play.js`. Batch 10 must remain separate from `play-hub.js`, begin from fresh current `main`, and prove that its intentional missing-DOM and missing-ranking-data prerequisite behavior remains recoverable before any marker is added.

## 2026-07-19 — Phase 1 Batch 10A merged and verified

PR #115 protected `assets/js/play.js` with a prerequisite-aware duplicate-file-execution guard and added one matching startup-contract assertion.

The required prerequisites are the static Play panel `#play` and `window.RANKING_DATA.men` as an array. The successful marker was placed after the existing prerequisite return and before state construction, where `loadTop10()` begins storage and successful-owner work.

This placement preserves the intentional recovery boundary:

- missing Play DOM or ranking data returns without setting the marker;
- a failed attempt creates no partial listeners, observers, timers, intervals, storage, DOM, API, rendering, Top 10, or blind-resume ownership;
- a later file execution may initialize after prerequisites appear;
- only a second execution after successful initialization is blocked.

Final state:

- starting `main`: `67b3cc9d94ca28641f4ba1ce4378b19fa08f985c`;
- exact physically tested head: `6eac38e575dd778a5b4e42fe5b83283723df1847`;
- squash merge: `2040f604892c067ee288fe88df15594a570ac396`;
- 4 additions;
- 0 deletions;
- 2 changed files;
- runtime original blob: `f7aff84b33c847d825f5fa0207549572582c5096`;
- runtime guarded blob: `dd3cb93abeecd92897c4fe2beb734e4a6148acfc`;
- startup-contract original blob: `af9d23224988be205becc284bcb0f0a70433edea`;
- startup-contract modified blob: `95e77fcb7e66e982ad5dc7bbabdaaf1a4938261d`.

Focused proof and validation passed:

- exact original and guarded blob reproduction;
- JavaScript syntax;
- startup ownership contract;
- missing-DOM and missing-ranking-data recovery;
- byte-for-byte first-run equivalence after removing only the marker lines;
- 14 original element listeners, two ranking-ready listeners, and one 1400 ms timeout preserved;
- zero observers, intervals, polling, or dynamic script loads;
- second successful execution added zero ownership;
- a Top 10 action after deliberate duplicate evaluation saved once;
- complete Startup Architecture Gate;
- iOS startup route and lifecycle stability;
- profile sign-in and Picks continuation;
- delayed Home/community stability.

Unrelated existing red checks remained separate: stale production ranking certification expectations, scoring guardrail roster/rank and Alexandre Pantoja diagnostics, and women’s fighter-thumbnail rendering failures.

Cody physically tested exact immutable PR head `6eac38e575dd778a5b4e42fe5b83283723df1847` on the installed iPhone and reported **“Normal.”** Cold launch, Play entry and exit, signed-in and signed-out behavior, Top 10 viewing/editing/saving/persistence, blind resume, repeated game entry, navigation, profile and Picks handoffs, sharing, notifications, badges, background/resume, relaunch, rapid taps, rotation/resize, and delayed stability showed no visible regression, duplicate ownership, failed prerequisite recovery, or lost state.

PR #115 was squash-merged as commit `2040f604892c067ee288fe88df15594a570ac396`. Batch 10A was closed as physically verified.

The next isolated Phase 1 owner is `assets/js/play-hub.js`. It must remain a fresh, separate prerequisite-aware batch and must not be combined with another owner.

## 2026-07-19 — Phase 1 Batch 10B merged and verified

PR #119 protected `assets/js/play-hub.js` with a prerequisite-aware duplicate-file-execution guard and added one matching startup-contract assertion.

The required prerequisites are the five static Play DOM elements: `#play`, `.play-shell`, `.section-title`, `[data-play-mode="top10"]`, and `[data-play-mode="blind"]`. The successful marker was placed immediately after the existing prerequisite return and before native-random capture and private hub state.

This placement preserves the intentional recovery boundary:

- missing-DOM attempts return without setting the marker;
- failed attempts create no listeners, timers, intervals, observers, storage, DOM, API, rendering, or script-loading ownership;
- a later file execution may initialize after the missing DOM appears;
- only a later execution after successful initialization is blocked.

Final state:

- starting `main`: `e48a36c464a25f9f6d336435e2ba876f10177a85`;
- exact physically tested head: `35bc9a750cdbdfb2cec69b2e17d954b95b1ca8fc`;
- squash merge: `b1a7a3c92c2f7c13b64b4d68df3d26e4e9afbec8`;
- 4 additions;
- 0 deletions;
- 2 changed files;
- runtime original blob: `84f7a556efef0f9964ffc459009c166673216218`;
- runtime guarded blob: `0831bd2d58c04dd683a72c3178596ea43aca0f2b`;
- startup-contract original blob: `95e77fcb7e66e982ad5dc7bbabdaaf1a4938261d`;
- startup-contract modified blob: `dd426780dfdacdf1a9aa7848bcc0fc627ea5b627`.

Focused proof and validation passed:

- exact original and guarded blob reproduction;
- JavaScript syntax;
- startup ownership contract;
- all five independent missing-DOM recovery cases;
- optional APIs/data remained optional startup handoffs;
- byte-for-byte first-run equivalence after removing only the marker lines;
- current hub rendering, Play mode, daily challenge choice/restoration, seeded Blind Resume randomness, native-random restoration, navigation, routing, listeners, observer, timers, APIs, events, and cross-feature handoffs preserved;
- second successful execution added zero listeners, timers, intervals, observers, storage restoration, API replacement, rendering, game choice, route handling, tap handling, saves, or state transitions;
- important Play actions after deliberate duplicate evaluation fired once;
- complete Startup Architecture Gate #30;
- iOS startup route stability;
- profile sign-in startup stability;
- delayed Home/community stability.

Unrelated existing red checks remained separate: stale scoring roster/rank expectations, Alexandre Pantoja diagnostics, and 14 women’s fighter-thumbnail rendering failures.

Cody physically tested exact immutable PR head `35bc9a750cdbdfb2cec69b2e17d954b95b1ca8fc` on the installed iPhone and reported **“Normal.”** Cold launch, Play entry from Home/top/bottom navigation, leave and return, rapid activation, signed-out and signed-in behavior, daily restoration and selection, game cards, Top 10, Blind Resume, profile/Picks/sharing handoffs, all primary destinations, notifications, badges, background/resume, relaunch, rotation/resize, rapid taps, and delayed stability showed no visible regression, blank state, flicker, route bounce, stale or lost state, duplicate UI, double action, duplicate game choice, duplicate route, duplicate save, duplicate ownership, or failed prerequisite recovery.

PR #119 was squash-merged as commit `b1a7a3c92c2f7c13b64b4d68df3d26e4e9afbec8`. Batch 10B was closed as physically verified.

The next isolated Phase 1 owner is `assets/js/share-deep-links.js`. It must begin from fresh current `main` and remain separate from every other owner.

## 2026-07-19 — Phase 1 Batch 11 merged and verified

PR #121 protected `assets/js/share-deep-links.js` with a top-level duplicate-file-execution guard and added one matching startup-contract assertion.

Inspection established that the owner has no top-level prerequisite return. It publishes `window.UFC_SHARE_LINKS`, marks `data-share-deep-links`, and either starts immediately or registers the existing once-only `DOMContentLoaded` callback. Missing profile, ranking, route, Play, Picks, War Room, or browser-share capabilities are handled by existing delayed passes, events, observers, public APIs, fallbacks, and route-specific wait loops rather than by evaluating the file again.

The marker was placed immediately after `'use strict'` and before `VERSION`, private state, API publication, DOM ownership, listeners, observers, timers, URL reads, outgoing sharing, and incoming routing. Removing only the two marker lines reproduces the original runtime byte-for-byte.

Final state:

- starting `main`: `9743808a9a3200426f26099209c8f8e57ef32851`;
- exact physically tested head: `ad0e84e4069224270db8186aa771216af90343b4`;
- squash merge: `e332f46ec63c6698fdebd8ecc843c3f0df4eaabd`;
- 5 additions;
- 0 deletions;
- 2 changed files;
- runtime original blob: `67979699403b6539d798ca3cf72c37bc42c60e21`;
- runtime guarded blob: `4716ae05270dd0f6d24c2973af058d4e15f383a3`;
- startup-contract original blob: `dd426780dfdac1a9aa7848bcc0fc627ea5b627`;
- startup-contract modified blob: `b67f87807be533b346e15254dc1041b77bda1a3b`.

Preserved lifecycle and recovery ownership includes:

- once-only `DOMContentLoaded` startup;
- 40, 180, 700, and 1800 millisecond patch/observer/decorate passes;
- the 80 millisecond initial incoming-route pass;
- `ufc-production-ranking-ready` and `popstate` listeners;
- fighter profile and War Room MutationObservers;
- public share, share-URL, encode/decode, fighter, Find the Leader, Picks, War Room, and route APIs;
- native Web Share success, cancellation, and rejection behavior;
- secure clipboard and hidden-textarea copy fallbacks;
- route-specific wait loops and failed-route retry behavior;
- fighter, Find the Leader, Play challenge, Picks event, and War Room incoming links;
- Rankings, Play, profile-challenge, Picks, War Room, profile, sharing, and native-shell handoffs.

Focused proof and validation passed:

- exact original and guarded blob reproduction;
- original and guarded first-run trace equivalence;
- missing optional DOM/API recovery without file re-evaluation;
- zero duplicate listeners, timers, intervals, observers, API replacement, URL work, route work, share actions, clipboard writes, or native share sheets after deliberate guarded re-evaluation;
- unchanged outgoing share payloads and native/clipboard fallback behavior;
- all five supported incoming route types activating once;
- malformed and unsupported links activating no destination;
- failed route retry and `popstate` behavior;
- no history or location mutation;
- JavaScript syntax and startup contract;
- complete Startup Architecture Gate #32;
- iOS startup route stability;
- profile sign-in startup stability;
- delayed Home/community stability.

Scoring Architecture Guardrails #1265 and Production Ranking Browser Smoke #447 retained their documented unrelated stale roster/rank, Alexandre Pantoja, and women’s thumbnail diagnostics. Their retained artifacts were inspected and no failure referenced the changed files.

Cody physically tested exact immutable PR head `ad0e84e4069224270db8186aa771216af90343b4` on the installed iPhone and reported **“Normal.”** No visible regression, blank state, flicker, route bounce, stale or lost state, duplicate UI, double action, duplicate share sheet, duplicate clipboard write, repeated incoming route, repeated URL handling, duplicate ownership, or failed prerequisite recovery was observed.

PR #121 was squash-merged as commit `e332f46ec63c6698fdebd8ecc843c3f0df4eaabd`. Batch 11 was closed as physically verified.

The next isolated Phase 1 owner is `assets/js/production-ranking-bootstrap.js`. It remains retry-sensitive and requires an explicit apply/retry lifecycle before any duplicate-execution guard can be considered. `assets/js/app.js` remains a structural manifest singleton and must not receive a standard IIFE guard.

## 2026-07-20 — Phase 1 Batch 12 merged and verified

PR #123 protected `assets/js/production-ranking-bootstrap.js` with a complete-owner guard, introduced an explicit calculated-production lifecycle, and added one matching startup-contract assertion.

Whole-file re-evaluation had been the only callable recovery path after missing prerequisites or failed calculation/application work. A deliberate duplicate evaluation while dependency loading was in flight created a second owner closure, 40 additional dependency-load listeners, and a second complete ranking calculation/publication chain.

The merged lifecycle now separates owner initialization from application attempts:

- `start()` and `retry()` recover idle/error attempts and are stable no-ops after ready;
- `apply()` and `refresh()` intentionally force one recalculation after ready;
- concurrent calls share one in-flight Promise;
- failed dependency tags are removed so a later explicit retry can reload them;
- failed calculation or application attempts retain the same owner and remain retryable without file re-evaluation;
- the legacy `window.UFC_PRODUCTION_RANKING_BOOTSTRAP` result retains its original success/error publication timing and shape.

The duplicate guard remains immediately after `'use strict'`, but it checks for the complete lifecycle owner rather than setting a naive early boolean. The owner is published only after private lifecycle state and all public methods exist, and before the automatic first `start()` call.

Final state:

- starting `main`: `952683af839547b84576fe2ea3a9c813dc709983`;
- exact physically tested PR head: `a9f50c846c5f3b266b444f0f1a6ffc2e2c9bf9e0`;
- CI-tested runtime/test parent: `087e384446884a8573ac4542504ea808cf343684`;
- squash merge: `44684936bce748572a3497ec161500011a9623b9`;
- 57 additions;
- 8 deletions;
- 3 changed files, including the required timestamp-only Octagon Verdict Markdown regeneration;
- runtime original blob: `7f94b5092319038b8a52a826c60def6c5ada8979`;
- runtime merged blob: `df5136ccd93e69bba924af757e8b0b4abfdf9df7`;
- startup-contract original blob: `b67f87807be533b346e15254dc1041b77bda1a3b`;
- startup-contract merged blob: `0f89092f5bab7e3cf8c77871d90c11cc1ea01728`.

Focused proof and validation passed:

- original and modified first-success observable equivalence;
- missing-prerequisite recovery through `retry()` without file re-evaluation;
- failed calculation/application recovery;
- stable repeated `start()` and `retry()` calls after ready;
- intentional single recalculation through `apply()` and `refresh()`;
- shared in-flight attempts;
- zero duplicate scripts, listeners, timers, intervals, observers, calculations, publications, readiness events, refreshes, or render passes from deliberate second file evaluation;
- unchanged rankings, OVRs, categories, profiles, visible statistics, division boards, generated data, and fighter order;
- JavaScript syntax and startup ownership contract;
- complete Startup Architecture Gate on the runtime/test parent;
- iOS startup route stability;
- profile sign-in startup stability;
- delayed Home/community stability;
- required Octagon Verdict Markdown generation.

Unrelated red checks remained outside scope: stale 73-versus-80 roster and old-rank expectations, stale Henry Cejudo certification, existing Alexandre Pantoja diagnostics, and 14 women’s leaderboard-thumbnail rendering failures.

Cody physically tested exact immutable PR head `a9f50c846c5f3b266b444f0f1a6ffc2e2c9bf9e0` on the installed iPhone and reported **“Normal.”** No visible regression, blank state, flicker, route bounce, stale or missing ranking data, repeated ranking refresh, duplicate readiness event, duplicate rendering, or changed rank, score, category, OVR, visible statistic, profile, or fighter ordering was reported.

PR #123 was squash-merged as commit `44684936bce748572a3497ec161500011a9623b9`. Batch 12 was closed as physically verified.

Batch 12 completed the final owner in the major Phase 1 audit. There is no next isolated Phase 1 owner in the current audit. The next project step is a fresh Phase 2 duplicate-ownership audit, beginning with route ownership, before any consolidation or runtime deletion is attempted.
