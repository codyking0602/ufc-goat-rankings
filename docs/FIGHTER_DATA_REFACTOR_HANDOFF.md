# Fighter Data Refactor — Durable Handoff

Last updated: 2026-07-13

## Repo state

- Repository: `codyking0602/ufc-goat-rankings`
- Working branch: `agent/fighter-data-phase-1`
- Draft PR: `#39 — Start canonical fighter data ownership refactor`
- Five-fighter ledger: `9aa64b7f61a9758b6b8a9b6f27da79d13a779247`
- Five-fighter test: `e46935891132614372b61723424c651a619430a1`
- Runtime loader: `a2a6deca07a12c177101a6e90c1071274d0a2a96`
- CI enforcement: `f57e600d20b6f218d4188ad1e102a8ad2cd2eb4b`
- Exact bout-count guard: `1afc3350ffcc68a6f937155642a6e9a0f7199cae`
- Corrected coverage docs: `c2bfcf9023ca30ff4aecc3aa318ca52d249b23ad`

## Required branch sync before more migration

Current `main` advanced during the long Phase 1 batch. At this checkpoint the feature branch is **52 commits ahead and 14 commits behind `main`**. GitHub currently reports PR #39 as mergeable, but the base is stale and should be refreshed before more migration work.

Before adding another fighter batch:

1. Refresh the work onto latest `main`.
2. Preserve all canonical additions and tests.
3. Reconcile current-main changes in `index.html` and `assets/data/ranking-data-patches.js` rather than overwriting them.
4. Re-run the complete ownership and scoring workflow suite.
5. Update this handoff with the new branch/PR state.

Do not continue new fighter records on the stale base.

## Permanent architecture

`canonical UFC fight ledger + reviewed classifications → calculated categories → modifiers → calculated total → calculated sort → calculated rank → calculated OVR → generated snapshot/profile`

Live authority must never come from expected rank, expected total, expected OVR, hand-written snapshot numbers, or measurable fields in presentation files.

## Safety state

Phase 1 is evidence-only. Canonical records load in browser and CI diagnostics but do not write into `RANKING_DATA`.

No live category score, total, rank, OVR, leaderboard position, snapshot, profile stat, or Compare Mode value changed. Tests require sentinel live data to remain byte-for-byte unchanged.

## Current coverage

| Fighter | UFC bouts | Official record | Prime | Active elite years |
|---|---:|---:|---:|---:|
| Charles Oliveira | 37 | 25-11, 1 NC | 9-3 | 6.33 |
| Benson Henderson | 14 | 11-3 | 10-3 | 4.29 |
| Vitor Belfort | 26 | 15-10, 1 NC | 7-3 | 6.10 |
| Deiveson Figueiredo | 22 | 14-7-1 | 7-3-1 | 4.73 |
| Frankie Edgar | 30 | 18-11-1 | 13-6-1 | 10.18 |
| Dominick Cruz | 10 | 7-3 | 5-2 | 5.51 |

- Canonical fighters: **6 of 73 identities — 8.22%**
- Canonical fight rows: **139**
- Five-person batch rows: **102**
- Browser errors: **0**

See `docs/fighter-data-ownership-baseline.md`.

## Important reconciliations

- Vitor has one official UFC title-fight win. UFC 12 is a separate tournament achievement. PRIDE is excluded.
- Deiveson has 22 UFC bouts and a current canonical record of 14-7-1. Benavidez I gives no title-win credit because he missed championship weight. Song Yadong is post-prime in the complete ledger.
- Dominick has 10 UFC bouts. WEC is excluded, including WEC 53. The locked UFC-only prime window and 18-month gap cap calculate 5.51 active elite years, not the old handwritten 6.5.
- Close decision round allocations and opponent tiers remain reviewed judgment calls.

## Core files

- `assets/data/canonical-fighter-facts.js`
- `assets/data/canonical-fighter-facts-batch-one.js`
- `assets/data/canonical-fighter-facts-batch-two.js`
- `scripts/test-canonical-fighter-facts.mjs`
- `scripts/test-canonical-fighter-facts-batch-one.mjs`
- `scripts/test-canonical-fighter-facts-five-person-batch.mjs`
- `assets/js/fighter-data-ownership-audit.js`
- `.github/workflows/fighter-data-ownership-baseline.yml`

`assets/data/ranking-data-patches.js` loads batch two before resolving `UFC_RANKING_DATA_PATCHES_READY`.

## Validation

Passed on the completed five-fighter implementation:

- canonical schema contract
- Charles 37-fight derivation test
- five-fighter 102-fight derivation test
- exact per-fighter UFC bout-count assertions
- six-record registry audit
- live score/rank/OVR/snapshot non-mutation assertion
- Fighter Data Ownership Baseline
- Runtime Scoring Snapshot
- Runtime Scoring Audit
- Six-Category Runtime Audit
- zero browser errors

Known unrelated CI debt:

- Picks UI Smoke: `Underdog Lock no-odds state is missing`
- Scoring Architecture Guardrails exact snapshot parity uses an older committed app-build label; fighter scoring data is unchanged

## Phase 1 checklist

- [x] Canonical schema and baseline
- [x] Charles Oliveira
- [x] Benson Henderson
- [x] Vitor Belfort
- [x] Deiveson Figueiredo
- [x] Frankie Edgar
- [x] Dominick Cruz
- [ ] Sync Phase 1 work onto latest `main`
- [ ] Next five-fighter batch
- [ ] Continue until all ranked fighters have canonical records
- [ ] Generate snapshots only from canonical calculations
- [ ] Remove measurable fields from packets and overrides
- [ ] Remove expected rank/total/OVR live authority

## Resume prompt

> Continue the fighter-data refactor in `codyking0602/ufc-goat-rankings`. Read `docs/FIGHTER_DATA_REFACTOR_HANDOFF.md` and `docs/fighter-data-ownership-baseline.md` first. The current Phase 1 branch may be behind `main`; compare refs and resolve the branch sync before adding fighters. Preserve the six completed canonical ledgers. Work in five-fighter batches. Never store rank, total, OVR, expected values, calculated aggregates, or hand-written snapshot stats in canonical fighter records. Keep migrations evidence-only until the calculated live pipeline is deliberately connected.

## Exact next task

First refresh the Phase 1 work onto current `main` without losing the six completed canonical ledgers or their tests, then confirm the draft PR remains mergeable and all workflows pass.

After the sync passes all workflows, create the next five-fighter canonical ledger batch for:

1. Fabricio Werdum
2. Glover Teixeira
3. Rashad Evans
4. Mauricio “Shogun” Rua
5. Forrest Griffin

Use the batch-two pattern: complete UFC-only histories, validate all records before registration, exact bout-count and derivation assertions, load before readiness, and leave every live value untouched.
