# Phase 5 Script-Manifest Progress — 2026-07-21

## Objective

Simplify and certify the production startup script manifest after Phases 1–4 established canonical ownership.

Phase 5 worked directly from the production `index.html` load order. It changed or approved one wiring edge at a time and preserved all route, identity, readiness, profile, Picks, War Room, notification, native-shell, installed-app, game, ranking, scoring, and public API behavior.

The completion standard was:

1. every explicit local production script exists;
2. no local script is explicitly loaded twice;
3. canonical prerequisite order is deterministic;
4. any explicit/dynamic overlap is either removed or supported by focused healthy-startup and missing-owner proof;
5. no unapproved manifest overlap remains;
6. exact-head Startup Architecture Gate and dedicated iOS checks pass.

## Batch 1 — Picks season becomes manifest-owned

Production `index.html` already loaded `assets/js/picks-season-loop.js` before `assets/js/product-architecture.js`, and the season script synchronously published `window.UFC_PICKS_SEASON_LOOP` before deferred DOM startup.

PR #186 removed the unreachable second `PICKS_SEASON_SRC` / `loadPicksSeason()` injection path from Product compatibility.

Preserved:

- `picks-season-loop.js` as the sole Picks season owner;
- shell recovery;
- connectivity, Product polish, avatar sync, profile activity, and Find the Leader retention loaders;
- shared-profile/Picks handoff;
- Product compatibility facade and public APIs.

Certification:

- Runtime: `product-architecture-20260721a-manifest-owned-picks-season`
- Exact tested head: `e01b03bfccf8d67d8a4eb3d3f9cf729592f47cad`
- Startup Architecture Gate #207: passed
- Dedicated iOS #64: passed
- Startup Work Inventory #33: passed
- Production merge: `4b78001f75c21dfee287208b91396e72bb571039`

## Batch 2 — deterministic Phase 5 manifest inventory

PR #187 added:

- `scripts/audit-phase-5-script-manifest.mjs`
- `.github/workflows/phase-5-script-manifest-inventory.yml`

The first workflow implementation exposed and then corrected an audit defect: piping through `tee` without `pipefail` masked an assertion failure and produced an empty artifact. The corrected exact-head workflow fails on audit errors and uploads a substantive deterministic JSON report.

The inventory records all 85 production scripts in order and validates:

- no duplicate explicit local script tags;
- every explicit local script path exists;
- canonical ordering for route bootstrap, shell, base app, identity/profile, Play owners, Picks season/Product compatibility, late launch, notifications, and native-shell stability;
- dynamic script dependencies against explicit manifest ownership;
- continued absence of a duplicate Picks season loader.

The first truthful inventory identified two candidates in `assets/js/better-than-standalone-share.js`:

1. Play photo authority;
2. Find the Leader.

Certification:

- Exact tested head: `29869666894d2702235d413c7d15ad9781932081`
- Phase 5 Script Manifest Inventory #5: passed
- Production merge: `942bbb1087b1a720318ddc003db6fd32b7d5f495`

## Batch 3 — one healthy Find the Leader owner

Production explicitly loaded `assets/js/find-leader.js` before Better Than compatibility. The explicit owner published `find-leader-20260719a-group-leaders`, but Better Than still required stale version `find-leader-20260716c-daily-elimination`.

That stale comparison caused every healthy startup to:

1. remove the valid `#playFindLeaderPanel`;
2. request the same current owner a second time;
3. recreate the panel.

PR #188 removed the competing version requirement. Better Than now consumes the manifest owner whenever it exists and retains one bounded recovery request only when `window.UFC_FIND_LEADER` is genuinely absent.

Focused 390×844 proof established:

- healthy production requests Find the Leader exactly once;
- one panel remains;
- zero recovery scripts are injected on the healthy path;
- an absent owner triggers one bounded recovery request for the current build;
- photo-authority synchronization and downstream daily support remain intact.

Certification:

- Runtime: `better-than-standalone-share-20260721q-find-leader-owner`
- Exact tested head: `30379516cfd859bc6b4bea61a1bf6042ca5c0390`
- Startup Architecture Gate #210: passed
- Dedicated iOS #66: passed
- Phase 5 Script Manifest Inventory #8: passed
- Phase 4 Startup Work Inventory #35: passed
- Production merge: `478a17d9ad4cda70a2d2fb75975ebe2bfb1881f4`

## Batch 4 — certify Play photo authority recovery

The remaining Better Than → Play photo authority overlap was not a healthy-startup duplicate.

Production explicitly loads `assets/js/play-photo-authority.js` before Better Than compatibility. The fallback runs only when `window.UFC_PLAY_PHOTO_AUTHORITY` is absent, so normal parser-blocking production order consumes the existing owner without injecting another script.

PR #189 made no runtime change. It added focused 390×844 proof and tightened the manifest inventory.

Healthy production proof:

- exactly one `play-photo-authority.js` request;
- one owner script;
- zero recovery scripts;
- one photo-authority style owner;
- current owner version `play-photo-authority-20260717c`.

Missing-owner proof:

- one bounded recovery request;
- one recovery script;
- current owner version published;
- one style owner.

Certification:

- Exact tested head: `8689ba590c74fff516c32011ca71916c3e7561a5`
- Startup Architecture Gate #212: passed
- Dedicated iOS #67: passed
- Phase 5 Script Manifest Inventory #10: passed, including both focused manifest-owner browser proofs
- Production merge: `628bf47bbe2933688a36a0a7e96d952da5e828d8`
- Tested head versus production merge: one merge commit and zero changed files

## Final manifest boundary

The final inventory is clean:

- 85 explicit production scripts;
- zero duplicate explicit local scripts;
- zero missing explicit local files;
- all required canonical ordering constraints pass;
- zero unapproved explicit/dynamic overlaps;
- Picks season remains manifest-owned with no Product fallback loader.

Exactly three explicit/dynamic overlaps remain, each with a focused bounded recovery contract:

1. `assets/js/better-than-standalone-share.js` → `assets/js/play-photo-authority.js`
2. `assets/js/better-than-standalone-share.js` → `assets/js/find-leader.js`
3. `assets/js/product-architecture.js` → `assets/js/octagon-hq-shell.js`

Each healthy path consumes the explicit manifest owner. Each dynamic path is allowed only when that owner is genuinely absent. A compatibility layer may not replace a valid manifest owner because of a competing version requirement.

## Known unrelated red workflows

The final Phase 5 heads retained the established unrelated failures:

- Production Ranking Browser Smoke #626 stopped at the existing fighter-photo audit.
- Scoring Architecture Guardrails #1448 stopped at the existing permanent source/runtime contract.
- Historical Phase 4B validation may stop at its hard-pinned architecture check.

None references the isolated manifest wiring, ownership proofs, or final documentation.

## Phase 5 completion

Phase 5 is complete.

No unresolved script-manifest or load-order candidate remains under the Phase 5 standard. Broad bundling, module conversion, or unrelated performance refactoring was intentionally excluded because no ownership evidence required it.

## Phase 6 final certification

Phase 6 required no runtime change and no temporary workflow.

Final certification is satisfied by:

- exact-head Startup Architecture Gate #212;
- exact-head dedicated iOS #67;
- clean Phase 5 Script Manifest Inventory #10;
- focused healthy-startup and missing-owner recovery proofs;
- zero file difference between the tested head and production merge;
- current canonical status and ownership documentation;
- documented unrelated red checks;
- no unresolved physical-only uncertainty;
- no approved visible product change.

## Architecture cleanup completion

The startup/identity architecture cleanup is complete through Phases 0–6.

The repository now has:

- canonical route, identity, readiness, profile, access, notification, and feature owners;
- passive consumers that use cached identity and owner events;
- destination-bound automatic work;
- retired speculative retries and duplicate repair loops;
- exact-one healthy startup ownership for audited scripts and network paths;
- deterministic startup-work and script-manifest inventories;
- focused recovery proofs for every approved manifest overlap.

Future startup changes are maintenance under the permanent ownership map, Phase 4 and Phase 5 inventories, Startup Architecture Gate, and dedicated iOS suite. A new cleanup phase should begin only if production behavior or the inventories prove a new duplicate owner, unnecessary inactive work, or obsolete manifest edge.