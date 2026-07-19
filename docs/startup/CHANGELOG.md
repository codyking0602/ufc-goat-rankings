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

## 2026-07-19 — Phase 1 batch 1 merged

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

The rollout is now in controlled live verification on the real GitHub Pages installed app. The next runtime batch remains blocked until Cody confirms the current mobile presentation, route behavior, background/resume, reminders, navigation shell, and tap handling are unchanged.
