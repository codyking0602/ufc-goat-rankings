# Startup Architecture Changelog

This is a historical record of completed or formally started startup-architecture work. Current state belongs in `STATUS.md`.

## 2026-07-19 — Phase 0 foundation

Added the zero-change startup architecture contract:

- documented the approved behavior freeze;
- identified major startup phases and intended owners;
- defined the six cleanup phases and final definition of done.

Commit: `2e70d6b6ceb6c697c46dedadfeaf75ad40b70517`

## 2026-07-19 — Automated startup gate

Added:

- `scripts/test-startup-contract.mjs`;
- `.github/workflows/startup-architecture-gate.yml`.

The gate checks startup syntax, ownership expectations, critical load order, and duplicate-loading risks without changing production runtime behavior.

## 2026-07-19 — Phase 1 first draft batch

Opened draft PR #100, **Add zero-change singleton guards to route startup**.

Proposed runtime changes:

- guard `fresh-home-route-bootstrap.js` against accidental second execution;
- guard `fresh-home-launch.js` against accidental second execution;
- assert both guards in the startup contract.

Refreshed validation passed:

- startup syntax;
- startup ownership/load order;
- iOS standalone startup/lifecycle browser simulation;
- profile startup;
- delayed Home/community stability;
- Phase 4B mobile/profile/Picks stability.

The branch was rebuilt directly from current `main`, preserving the exact 8-addition, 3-file runtime diff.

## 2026-07-19 — Permanent continuity system

Created master tracker issue #102 and added the repo-based handoff system:

- `docs/startup/README.md`;
- `docs/startup/STATUS.md`;
- `docs/startup/OWNERS.md`;
- `docs/startup/DECISIONS.md`;
- `docs/startup/TEST_PLAN.md`;
- `docs/startup/KNOWN_ISSUES.md`;
- `docs/startup/CHANGELOG.md`.

The repository records the active phase, current PR, passing checks, blockers, locked decisions, ownership map, and exact next action. Future chats start from `STATUS.md`, not chat memory.

## 2026-07-19 — Major Phase 1 owner audit complete

Added:

- `docs/startup/PHASE-1-OWNER-AUDIT.md`;
- `docs/startup/PR-100-IPHONE-TEST.md`.

Audited major route, navigation, ranking, Play, Picks, Home, community, profile-handoff, notification, native-shell, repair, and share owners for:

- duplicate file execution protection;
- document/window listeners;
- observers;
- timers and intervals;
- dynamic loading;
- public APIs;
- prerequisite early returns;
- retry-sensitive behavior.

The audit established four technical classes rather than applying a universal guard:

1. simple global-guard candidates;
2. prerequisite-aware guard candidates;
3. structural manifest singletons;
4. retry-sensitive launchers requiring an explicit lifecycle.

The one-owner-per-batch sequence is documented. The next runtime candidate after PR #100 is `assets/js/octagon-hq-shell.js` only.

## 2026-07-19 — PR #100 retained CI proof reviewed

Downloaded and inspected the Phase 4B proof artifact for PR #100. The reports recorded:

- stable repeated Home samples;
- one community directory with no delayed replacements;
- successful Top 10 save;
- correct Home cold launch;
- correct Picks resume;
- one product architecture script;
- one native shell;
- one notification surface;
- one bottom navigation.

The workflow served the branch only on localhost during CI and did not publish an installable branch deployment.

## 2026-07-19 — Third-party preview rejected

The immutable separate-origin static preview did not reproduce the production mobile app. It showed the desktop tab fallback, incorrect current ordering, and an incomplete native shell.

The preview was declared invalid and Cody was told not to sign in there. Source comparison confirmed the branch differed from current `main` only by the exact eight-line guard/test diff.

## 2026-07-19 — Phase 1 batch 1 merged and verified

PR #100 was rebuilt directly from current `main` and revalidated on head `86c2cba7ce83ce6ef4a824cf79634e006dd53f5c`.

Final pre-merge state:

- 0 commits behind `main`;
- 8 additions;
- 0 deletions;
- 3 changed files;
- Startup Architecture Gate passed;
- iOS Home Startup Stability passed;
- Phase 4B mobile/profile/Picks validation passed.

PR #100 was squash-merged as commit `5e733cc4568100e96080ce27ad601b7022daba33`.

Cody then verified the real installed iPhone app. The current mobile presentation, cold launch, navigation shell, and visible behavior were normal. Batch 1 was closed as live-verified.

## 2026-07-19 — Phase 1 batch 2 merged and verified

PR #105 added a top-level duplicate-file-execution guard to `assets/js/octagon-hq-shell.js` and one matching startup-contract assertion.

Final state:

- 4 additions;
- 0 deletions;
- 2 changed files;
- current with `main`;
- Startup Architecture Gate passed;
- iOS startup route stability passed;
- profile sign-in stability passed;
- delayed Home/community stability passed.

PR #105 was squash-merged as commit `d7b47d6fb9ad45b101f67d5658b3e2a874a746c8`.

Cody tested the real installed app after deployment. Home, Rankings, Play, Picks, War Room, Intelligence, all Rankings subviews, Picks background/resume, and the bottom navigation behaved normally. Batch 2 was closed as live-verified.

## 2026-07-19 — Phase 1 batch 3 started

The next isolated owner is `assets/js/octagon-hq-nav-grid.js`.

This batch is limited to a duplicate-file-execution guard and one contract assertion. Its existing delayed cleanup timers and resize listener remain unchanged until the later repair-loop phase.

## 2026-07-19 — Phase 1 batch 3 merged and verified

PR #106 added a duplicate-file-execution guard to `assets/js/octagon-hq-nav-grid.js` and one startup-contract assertion while preserving its cleanup timers, resize listener, public API, and navigation presentation.

Final state:

- 6 additions;
- 0 deletions;
- 2 changed files;
- Startup Architecture Gate passed.

PR #106 was squash-merged as commit `f4e3ada330fb841ade0333c580376dacaf58ec88`.

Cody verified the installed iPhone app after deployment. Cold launch, bottom-navigation order and sizing, rotation and resize handling, active states, and single-tap behavior were normal. Batch 3 was closed as live-verified.

## 2026-07-19 — Phase 1 batch 4 merged and verified

PR #107 added a duplicate-file-execution guard to `assets/js/home-dashboard.js` and one startup-contract assertion while preserving Home markup, card order, copy, styling, timers, listeners, daily challenge, Picks, War Room, fighter spotlight, and the existing public API.

Final state:

- 6 additions;
- 0 deletions;
- 2 changed files;
- Startup Architecture Gate passed.

PR #107 was squash-merged as commit `7fd6ede029cc307932cb38bc2c9274484b18f403`.

Cody verified the installed iPhone app after deployment. Home cold launch, card presentation, daily challenge, Picks, War Room, fighter spotlight/profile opening, background/resume, and return-to-Home behavior were normal. Batch 4 was closed as live-verified.

## 2026-07-19 — Phase 1 batch 5 merged and verified

PR #108 added a duplicate-file-execution guard to `assets/js/native-app-shell-stability.js` and one startup-contract assertion.

The prerequisite/retry inspection established that this temporary repair layer does not rely on file re-evaluation for legitimate retries. The existing public `schedule()` API, readiness events, MutationObserver, and delayed repair passes remain the intentional retry paths.

Final state:

- 4 additions;
- 0 deletions;
- 2 changed files;
- branch current with `main` at validation;
- Startup Architecture Gate run #16 passed;
- JavaScript syntax passed;
- startup ownership contract passed;
- iOS startup route stability passed;
- profile sign-in startup stability passed;
- delayed Home/community stability passed.

PR #108 was squash-merged as commit `6b0c9442b5a4df46e481296bb8d5cbd3befe1ab7`.

Cody verified the real installed iPhone app after deployment. Cold launch, Home/profile/header repairs, bottom-navigation and touch behavior, background/resume, and return-to-Home behavior were normal. Batch 5 was closed as live-verified.

Removal or consolidation of `native-app-shell-stability.js` remains deferred to Phase 3 after source-level regression coverage exists. The next isolated Phase 1 owner is `assets/js/app-notification-center.js`.