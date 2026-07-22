# Octagon HQ structural migration plan

**Status:** Proposed  
**Current phase:** Phase 0 — establish the migration baseline  
**Last updated:** 2026-07-22  
**Canonical continuation file:** `docs/architecture/STRUCTURAL-MIGRATION-PLAN.md`

This is the long-term plan for making Octagon HQ easier to change, easier to verify, and less dependent on knowing historical file names or load order.

Every future architecture chat must begin by reading this file, checking the current `main` commit and open pull requests, and continuing from the single **Next action** recorded below. Do not recreate the plan from memory.

## Next action

Resolve or close the current production-fix pull requests, record the new certified `main` SHA here, then complete the Phase 0 file inventory without changing production behavior.

## Why this refactor exists

The application currently behaves like a load-order system rather than a product-surface system.

At the time this plan was created:

- `index.html` manually loads roughly 33 stylesheets and 88 script tags;
- user-visible behavior is distributed across core files, cleanup files, polish files, stability files, compatibility files, and late-loading overrides;
- the required validation workflow recognizes 23 startup-adjacent production files;
- a correct behavior change can still require separate publication or installed-app follow-up work;
- discovering the right file often depends on historical knowledge rather than the app structure.

The fix is not more labels around that structure. The fix is to replace it gradually with a surface-based source architecture and an automated release pipeline.

## Final result

The finished app should have:

1. One application entry point.
2. One application shell and router.
3. One identity/session owner.
4. One release and installed-app update owner.
5. One global token/base-style owner.
6. One obvious folder for each product surface.
7. Automatically fingerprinted production assets.
8. Request-specific browser acceptance tests.
9. No active compatibility, cleanup, patch, or stability layer after its responsibility has moved.
10. A small `index.html` containing document metadata, stable mounts, and generated production entries—not a manually maintained dependency graph.

## Target source structure

```text
src/
  main.js

  core/
    app-shell.js
    router.js
    session.js
    capabilities.js
    storage.js
    release-manager.js

  features/
    home/
      index.js
      render.js
      state.js
      styles.css
      home.acceptance.mjs

    rankings/
    fighter-profile/
    compare/
    intelligence/
    war-room/
    account/

    games/
      index.js
      find-leader/
      blind-resume/
      blind-rank/
      better-than/
      keep-cut/
      wavelength/

    picks/
      index.js
      room/
      event/
      scoring/
      results/
      history/
      admin/

  styles/
    tokens.css
    base.css
    layout.css

assets/
  data/
    ranking-data.js
    display-overrides.js
    compare data
    approved feature data
  fighters/

tests/
  contracts/
  acceptance/
  installed-app/

dist/                    # generated, never hand-edited
```

The existing fighter-data workflow remains authoritative during the migration:

- ranking/profile rows stay in `assets/data/ranking-data.js`;
- app-facing display polish stays in `assets/data/display-overrides.js`;
- Compare profiles and real-fight ledgers stay in the Compare data owners;
- fighter photos stay in `assets/fighters/` and are referenced only after the files exist.

A later data move is allowed only if it is an intentional ownership transfer completed in one PR and this workflow is updated at the same time.

## Architecture rules during the migration

### 1. No parallel production owners

A replacement may be developed alongside legacy code on its branch, but two active owners may not be merged to `main`.

Every migration PR must:

- name the responsibility being transferred;
- name the old owner;
- name the new owner;
- remove or deactivate the old production path in the same PR;
- delete the old file when nothing else legitimately uses it;
- prove one accepted render, route, readiness publication, refresh, or update path remains.

### 2. Deletion is part of completion

A phase is not complete merely because new folders exist. It is complete only when the old tags, files, overrides, tests, and workflows made unnecessary by that phase are deleted.

Do not keep fallback code “just in case.” Git history is the fallback.

### 3. Structural PRs do not redesign the product

A migration PR should preserve current behavior unless a separately approved product change is inseparable from the migration. Moving and consolidating code is already enough risk.

### 4. One phase, one focused slice, one PR at a time

Do not open several overlapping architecture branches. Finish, certify, and merge one slice before beginning the next.

### 5. Current `main` is always the source

Each slice starts from current production `main`, not from an older architecture branch or an abandoned experiment.

### 6. The plan is updated in every migration PR

Before a migration PR merges, update:

- current phase;
- completed slice;
- deleted files;
- decisions made;
- certified head SHA;
- the single next action.

This is how the work survives multiple chats.

## Required proof for every slice

Every migration PR must pass all applicable existing checks plus:

1. A focused contract proving the old owner is gone and the new owner is unique.
2. A real-browser assertion for the exact surface being migrated.
3. An installed-app upgrade path when scripts, styles, HTML, service worker, manifest, or release behavior changes.
4. Exact-head validation against the final PR commit.
5. A deletion check proving removed files are no longer referenced by HTML, scripts, styles, workflows, or service-worker manifests.

The standard remains:

> One owner. One purpose. Small diff. Focused test. Installed-app proof. Exact-head green. Then merge.

---

# Migration phases

## Phase 0 — Baseline, inventory, and freeze

**Purpose:** establish the trusted starting point before structural changes.

### Work

- Resolve or close any open production-fix PRs first.
- Record the certified `main` SHA in this file.
- Produce a machine-readable inventory of every production JS, CSS, data, workflow, and test file.
- Classify every file as one of:
  - `KEEP_CANONICAL`
  - `MIGRATE`
  - `DELETE_AFTER_REPLACEMENT`
  - `GENERATED`
  - `REVIEW_UNKNOWN`
- Record which HTML tag, importer, workflow, service-worker rule, and test references each file.
- Add a guard that rejects new production files containing names such as `fix`, `cleanup`, `stability`, `patch`, `temporary`, or `compatibility` unless the PR explicitly justifies the name and removal date.
- Capture golden mobile/browser behavior for Home, Rankings, profile, Intelligence, War Room permissions, every game, Picks, sign-in, and installed-app reopen.

### No production behavior changes

This phase is inventory and protection only.

### Exit criteria

- Every loaded production file has a disposition.
- The app has a certified behavioral baseline.
- Future PRs cannot casually add another late repair layer.

---

## Phase 1 — Automated release and publication pipeline

**Purpose:** stop manually versioning dozens of asset URLs and stop shipping mixed generations of HTML, CSS, and JavaScript.

### Target

Create a real build output and deploy only that output to GitHub Pages.

The build must:

- generate a commit-derived app build identifier;
- assign content-hashed names to production JS and CSS;
- rewrite production references automatically;
- generate the service-worker asset manifest;
- preserve custom notification and offline behavior in the canonical service worker;
- deploy a generated `dist/` directory;
- never require a developer to update `?v=` strings by hand.

### Installed-app release test

The required gate must:

1. start from the previous certified production build;
2. seed its HTML and caches;
3. publish the proposed exact head;
4. refresh normally once;
5. prove the current build and requested behavior are loaded;
6. close and reopen the installed app;
7. prove the same current build and behavior remain.

Clearing storage, reinstalling, or hard-refreshing does not count.

### Expected deletions

After the generated release path is proven:

- manual version query strings in `index.html`;
- scripts whose sole purpose is synchronizing manual cache keys;
- duplicate publication tests superseded by the installed-app release contract;
- obsolete Pages or preview workflows that do not deploy or certify the canonical build;
- manual service-worker asset lists that are now generated.

### Exit criteria

- Production is built, not hand-published.
- Every deployed JS/CSS asset is automatically fingerprinted.
- One normal refresh upgrades the prior installed version.

---

## Phase 2 — Core shell, routing, identity, and capabilities

**Purpose:** create the stable foundation every feature consumes.

### New owners

- `src/main.js` — only application bootstrap.
- `src/core/app-shell.js` — shell lifecycle and primary destination activation.
- `src/core/router.js` — URL/deep-link interpretation and navigation requests.
- `src/core/session.js` — identity and canonical readiness.
- `src/core/capabilities.js` — permission decisions such as War Room access.
- `src/core/release-manager.js` — installed-app update state.

Feature modules consume these owners. They may not independently read canonical tokens, publish readiness, own primary navigation, or reload the application to change routes.

### Likely deletion candidates

These are candidates, not preapproved blind deletions. Each must be absorbed and proven first:

- `assets/js/fresh-home-route-bootstrap.js`
- `assets/js/fresh-home-launch.js`
- `assets/js/octagon-hq-nav-grid.js`
- `assets/js/native-app-shell-stability.js`
- `assets/js/app-notification-surface-fix.js`
- startup or route recovery helpers whose only purpose is repairing another owner
- obsolete startup audit workflows after their permanent assertions move into the unified contract

### Exit criteria

- One bootstrap tag enters the application.
- One shell owns primary navigation.
- One session owner publishes identity/readiness.
- Capability consumers do not open editors or resolve identity themselves.
- Old startup and recovery paths are deleted.

---

## Phase 3 — Global styling and theme architecture

**Purpose:** replace stylesheet-order ownership with explicit tokens, base styles, layout, and feature styles.

### New owners

- `src/styles/tokens.css`
- `src/styles/base.css`
- `src/styles/layout.css`
- one stylesheet inside each feature folder

No JavaScript module may inject general application CSS at runtime.

### Migration rule

Move winning declarations into the correct owner, prove computed styles in the real app, then delete the losing or superseded stylesheet in the same PR.

### Likely deletion candidates

After their rules are moved:

- `*-cleanup.css`
- `*-polish.css` files that exist only as late global overrides
- `*-stability.css`
- `*-final-cleanup.css`
- duplicate palette definitions
- runtime-created `<style>` blocks and late stylesheet loaders

Feature-specific CSS may keep descriptive names when it truly owns a distinct feature. The goal is not one giant stylesheet; the goal is one owner per concern and one generated production CSS entry.

### Exit criteria

- `index.html` references one generated CSS entry.
- No retired palette can win through load order.
- No late runtime repaint exists.

---

## Phase 4 — Home

**Purpose:** give Home one obvious product-surface owner.

### New feature folder

`src/features/home/`

It owns:

- Home composition;
- Home rendering;
- Home interactions;
- Home-specific state projection;
- Home styles;
- Home acceptance tests.

It consumes session, capabilities, Picks summary, game summary, favorite fighter, challenges, and update-feed data. It does not own those systems.

### Expected deletions

- the legacy Home renderer after transfer;
- Home-only cleanup and polish layers absorbed into the feature;
- Home startup helpers whose remaining responsibility is now the core shell’s job;
- duplicate Home markup in `index.html` beyond the stable mount.

### Exit criteria

A request such as “remove this Home card” starts and ends in `src/features/home/`, except for a clearly named shared data contract.

---

## Phase 5 — Rankings, fighter profiles, and Compare

**Purpose:** consolidate the core UFC ranking product without disturbing the approved data workflow.

### Rankings feature

`src/features/rankings/` owns:

- board rendering;
- search and filters;
- ranking navigation;
- category/division views;
- ranking-surface styles.

### Fighter-profile feature

`src/features/fighter-profile/` owns:

- drawer/profile rendering;
- profile actions;
- signature fight and share behavior;
- profile-surface styles.

### Compare feature

`src/features/compare/` owns:

- comparison rendering and verdict presentation;
- matchup-specific UI;
- actual direct-fight ledger presentation.

### Data consolidation

Keep `ranking-data.js` and `display-overrides.js` authoritative. Fold valid post-bootstrap adjustments and photo registries into the approved canonical data owners, then delete the adjustment layer.

### Likely deletion candidates

After audit and absorption:

- post-bootstrap fighter repair files;
- one-fighter adjustment files;
- duplicate photo registries;
- profile-card hotfix CSS/JS whose behavior belongs in the profile feature;
- ranking UI polish layers superseded by the feature renderer/styles;
- `ranking-data-patches.js` only when its remaining status-hook responsibility has a deliberate replacement.

### Exit criteria

- Fighter additions follow the locked workflow with no extra repair file.
- One rankings renderer and one fighter-profile renderer remain.
- Compare data and presentation have clear separate owners.

---

## Phase 6 — Account, community profiles, notifications, and War Room

**Purpose:** separate user/session infrastructure from community and conversation surfaces.

### New feature folders

- `src/features/account/`
- `src/features/war-room/`

Account owns editing and display of the user profile. War Room owns conversation UI. Notification surfaces consume session and feature events but do not become identity or navigation owners.

### Permission rule

War Room visibility is derived once from `core/capabilities.js`. Home, shell navigation, notifications, and the War Room surface consume that result.

### Expected deletions

- duplicate profile snapshot loaders;
- notification surface repair files;
- War Room branding or access overlays absorbed into the feature;
- consumer-triggered sign-in/profile-editor fallbacks;
- compatibility listeners that independently refresh profile, group, and inbox state.

### Exit criteria

- Signed-out, eligible, and invite-only states come from one capability decision.
- No disabled Home CTA is used as a permission fallback.
- Profile, notifications, and War Room do not compete for identity or routing.

---

## Phase 7 — Games platform

**Purpose:** make Play a hub and each game a self-contained feature.

### New structure

Each game folder owns:

- its question/content selection;
- game state and scoring;
- rendering;
- share result behavior;
- challenge integration adapter;
- styles;
- acceptance test.

`src/features/games/index.js` owns only the Play hub and game selection. It does not reimplement individual game behavior.

### Expected deletions

After canonicalization:

- standalone-share compatibility interceptors replaced by canonical route adapters;
- phase-specific tuning files absorbed into the game owner;
- duplicate daily-board or leaderboard controllers;
- game polish files whose declarations move into the game folder;
- old Build Your Top 10 code after Wavelength fully replaces it, when that replacement is confirmed in production behavior.

### Exit criteria

- A game change is contained in one game folder.
- Challenge routing delegates to the selected game.
- No compatibility file can intercept another game’s canonical URL.

---

## Phase 8 — Picks

**Purpose:** consolidate the largest fragmented surface without turning it into one giant file.

Picks remains internally modular, but modules are grouped by stable product responsibility rather than by historical repair sequence.

### Target modules

- room and membership;
- canonical event state;
- fight selection and locks;
- scoring;
- live results;
- standings and history;
- commissioner/admin;
- presentation and mobile layout;
- profile/season summary integration.

### Migration method

Move one Picks responsibility at a time. For each slice:

1. identify all current files affecting that responsibility;
2. select the winning behavior;
3. move it into the target module;
4. remove competing listeners, timers, refreshes, and styles;
5. delete the superseded files;
6. run Picks browser, multi-device, event-lock, post-event, and installed-app tests.

### Likely deletion candidates

After their behavior is absorbed:

- `picks-correctness-cleanup.*`
- `picks-home-event-cleanup.*`
- `picks-settings-admin-cleanup.*`
- `picks-final-cleanup.css`
- `picks-device-recovery.*`
- overlapping mobile/polish/launch override files
- duplicate room persistence or current-event paths
- historical repair modules that no longer own a distinct product capability

### Exit criteria

- `index.html` loads one generated Picks feature entry, not a long ordered chain.
- Each Picks responsibility has one module and one test contract.
- No browser polling competes with the backend refresh owner.

---

## Phase 9 — Final deletion and enforcement

**Purpose:** remove migration scaffolding and make the new architecture difficult to regress.

### Delete

- superseded architecture documents;
- obsolete phase-specific workflows and tests;
- dead CSS, JS, data overlays, and compatibility files;
- unused assets proven unreferenced by the generated manifest and runtime tests;
- abandoned preview workflows producing irrelevant red checks;
- merged migration branches;
- transitional import bridges;
- inventory classifications for files that no longer exist.

Never delete fighter photos or backend migrations based only on a filename search. They require reference and production-data verification.

### Enforce

Add permanent checks that fail when:

- `index.html` gains another hand-authored production JS/CSS chain;
- a production file introduces forbidden repair-layer naming without an approved exception;
- a feature imports another feature’s private module;
- a consumer reads canonical identity storage directly;
- a second route, startup, service-worker, profile-readiness, or full-room refresh owner appears;
- a generated build contains an unreferenced production asset;
- a user-visible PR lacks a request-specific acceptance assertion.

### Final measurable targets

- one generated application JS entry;
- one generated application CSS entry;
- one canonical service worker;
- zero manual production asset version strings;
- zero runtime-injected global styles;
- zero active production files named for a temporary fix, cleanup, patch, or stability layer without an explicit permanent justification;
- every major product surface represented by one feature folder;
- three consecutive user-visible changes delivered correctly in the first merged PR and visible after one normal installed-app refresh.

---

# Phase tracker

| Phase | Status | Certified head | Main deletions completed | Next slice |
| --- | --- | --- | --- | --- |
| 0. Baseline and inventory | Not started | — | — | Resolve open production fixes and record baseline |
| 1. Release pipeline | Not started | — | — | — |
| 2. Core shell/session | Not started | — | — | — |
| 3. Styling/theme | Not started | — | — | — |
| 4. Home | Not started | — | — | — |
| 5. Rankings/profile/Compare | Not started | — | — | — |
| 6. Account/War Room | Not started | — | — | — |
| 7. Games | Not started | — | — | — |
| 8. Picks | Not started | — | — | — |
| 9. Final cleanup | Not started | — | — | — |

# Deletion ledger

Record deletions here as they are approved. A candidate is not permission to delete before its responsibility is absorbed and tested.

| File or group | Current responsibility | Replacement | Status | Deleted in PR |
| --- | --- | --- | --- | --- |
| Manual JS/CSS version strings in `index.html` | Asset publication | Generated release manifest | Candidate | — |
| Late cleanup/polish/stability production layers | Historical winning overrides | Core or feature owner | Candidate | — |
| Startup and route recovery helpers | Repair competing startup/navigation paths | `src/main.js` and `src/core/` | Candidate | — |
| Post-bootstrap ranking repair layers | Fighter/ranking corrections | Canonical ranking data owners | Candidate | — |
| Phase-specific validation workflows | Temporary migration gates | Unified permanent contracts | Candidate | — |
| Fragmented Picks repair modules | Picks behavior and presentation | Stable Picks submodules | Candidate | — |

# Decision log

| Date | Decision | Reason |
| --- | --- | --- |
| 2026-07-22 | Use a surface-based structural migration rather than expanding ownership labels around the current layout. | Folder structure and entry points should make the correct change location discoverable. |
| 2026-07-22 | Put the release/publication pipeline before most feature migrations. | Correct code must reliably reach the installed app throughout the refactor. |
| 2026-07-22 | Treat deletion as required phase work. | Leaving old layers active would preserve the same discoverability and ownership problem. |
| 2026-07-22 | Keep canonical fighter data and photo workflows stable during the migration. | The architecture problem does not justify risking approved UFC data ownership. |

# New-chat continuation instructions

Paste or reference this instruction at the beginning of any future architecture chat:

> Continue the Octagon HQ structural migration from `docs/architecture/STRUCTURAL-MIGRATION-PLAN.md`. Read the current phase, phase tracker, deletion ledger, decision log, and Next action. Check current production `main` and open PRs before editing. Do not restart the plan, create a parallel architecture, add a fallback owner, or skip deletion work. Complete one focused slice using: one owner, one purpose, small diff, focused test, installed-app proof, exact-head green, then merge. Update the plan file in the same PR before merging.
