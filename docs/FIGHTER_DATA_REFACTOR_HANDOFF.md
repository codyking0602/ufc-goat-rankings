# Fighter Data Refactor — Durable Handoff

Last updated: 2026-07-13

- Repository: `codyking0602/ufc-goat-rankings`
- Working branch: `agent/fighter-data-phase-1`
- Draft PR: `#39 — Start canonical fighter data ownership refactor`
- Branch base: `f81a9a58c5c0e0aa6be2dc9e02a1c757b21c2ae6`
- Five-fighter ledger commit: `9aa64b7f61a9758b6b8a9b6f27da79d13a779247`
- Five-fighter test commit: `e46935891132614372b61723424c651a619430a1`
- Shadow-runtime loader commit: `a2a6deca07a12c177101a6e90c1071274d0a2a96`
- CI enforcement commit: `f57e600d20b6f218d4188ad1e102a8ad2cd2eb4b`
- Exact bout-count guard commit: `1afc3350ffcc68a6f937155642a6e9a0f7199cae`
- Corrected coverage documentation commit: `c2bfcf9023ca30ff4aecc3aa318ca52d249b23ad`

## Permanent architecture

`canonical UFC fight ledger + reviewed classifications → calculated categories → modifiers → calculated total → calculated sort → calculated rank → calculated OVR → generated snapshot/profile`

Live runtime must never be controlled by:

- `expectedRank`
- `expectedTotalScore`
- `expectedOverallOvr`
- hand-written snapshot numbers
- measurable facts or scores in fighter packets
- measurable facts or scores in display overrides

Expected values may remain only as non-authoritative regression fixtures.

## Safety state

Phase 1 remains evidence-only. Canonical records are loaded into the browser and CI for diagnostics, but they do not write into `RANKING_DATA`.

No live category score, total, rank, OVR, leaderboard position, snapshot, profile stat, or Compare Mode value changed during either canonical migration batch.

The tests load sentinel live score/rank/OVR/snapshot data and require it to remain byte-for-byte unchanged.

## Current canonical coverage

Six fighters are fully migrated:

| Fighter | UFC bouts | Canonical status |
|---|---:|---|
| Charles Oliveira | 37 | Audited |
| Benson Henderson | 14 | Audited |
| Vitor Belfort | 26 | Audited |
| Deiveson Figueiredo | 22 | Audited |
| Frankie Edgar | 30 | Audited |
| Dominick Cruz | 10 | Audited |

- Canonical fighters: **6 of 73 identities — 8.22%**
- Canonical fight rows: **139**
- Five-person batch rows: **102**
- Browser errors: **0**

See `docs/fighter-data-ownership-baseline.md` for the current ownership report.

## Canonical ledger contract

`assets/data/canonical-fighter-facts.js` owns chronological UFC fight evidence and reviewed classifications:

- official result
- separate scoring disposition
- method
- opponent-quality tier
- title context and eligibility
- loss classification
- prime boundaries
- reviewed prime rounds
- longevity gap treatment
- division-strength classification
- evidence coverage

It rejects stored outputs including UFC record, finish rate, title totals, quality totals, prime record, round percentage, active elite years, loss exposure, category scores, total, rank, OVR, and all `expected...` fields.

## Phase 1 checklist

- [x] Create working branch and durable handoff.
- [x] Build and enforce canonical ledger schema.
- [x] Add full-roster ownership baseline.
- [x] Migrate Charles Oliveira.
- [x] Migrate Benson Henderson.
- [x] Migrate Vitor Belfort.
- [x] Migrate Deiveson Figueiredo.
- [x] Migrate Frankie Edgar.
- [x] Migrate Dominick Cruz.
- [ ] Migrate the next five-fighter batch.
- [ ] Continue complete UFC ledgers in five-fighter batches.
- [ ] Reach full ranked-roster canonical coverage.
- [ ] Generate live snapshots exclusively from canonical calculations.
- [ ] Remove presentation ownership of measurable stats.
- [ ] Remove expected rank/total/OVR from live authority.

## Charles Oliveira — completed

Files:

- `assets/data/canonical-fighter-facts-batch-one.js`
- `scripts/test-canonical-fighter-facts-batch-one.mjs`

Derived from 37 UFC bouts through UFC 326:

- official record: **25-11, 1 NC**
- finish wins/rate: **21 / 84.0%**
- official UFC title-fight wins: **2**
- adjusted eligible title credit: **1.76**
- prime record: **9-3**
- prime stoppage losses: **2**
- prime rounds: **22-9 — 70.97%**
- active elite years: **6.33**

Gaethje is recorded as a title bout with Oliveira ineligible after the weight miss. Holloway II/BMF is excluded from UFC championship scoring.

## Five-person batch — completed

Files:

- `assets/data/canonical-fighter-facts-batch-two.js`
- `scripts/test-canonical-fighter-facts-five-person-batch.mjs`

### Benson Henderson

- UFC record: **11-3**
- finishes: **2 — 18.18%**
- official title-fight wins: **4**
- adjusted title credit: **3.65**
- prime: **10-3**
- prime stoppage losses: **2**
- reviewed prime rounds: **33-16 — 67.35%**
- active elite years: **4.29**
- WEC and Bellator excluded

### Vitor Belfort

- UFC record: **15-10, 1 NC**
- finishes: **14 — 93.33%**
- official UFC title-fight wins: **1**
- adjusted achievement credit: **1.10**
- UFC 12 tournament is separate and not an official title fight
- prime: **7-3**
- prime stoppage losses: **3**
- reviewed prime rounds: **9-5 — 64.29%**
- active elite years: **6.10**
- PRIDE and other non-UFC achievements excluded

### Deiveson Figueiredo

- current complete UFC record: **14-7-1**
- complete UFC ledger: **22 bouts**
- finishes: **8 — 57.14%**
- official title-fight wins: **3**
- adjusted title credit: **2.75**
- prime: **7-3-1**
- prime stoppage losses: **2**
- reviewed prime rounds: **17-15 with one drawn round — 53.03%**
- active elite years: **4.73**
- Benavidez I gives zero title-win credit because Figueiredo missed championship weight
- post-prime results through Song Yadong remain in the full UFC ledger

### Frankie Edgar

- UFC record: **18-11-1**
- finishes: **7 — 38.89%**
- official title-fight wins: **3**
- adjusted title credit: **2.80**
- prime: **13-6-1**
- prime stoppage losses: **1**
- reviewed prime rounds: **51-24 — 68.0%**
- active elite years: **10.18**
- Chan Sung Jung and the bantamweight decline are post-prime

### Dominick Cruz

- UFC-only record: **7-3**
- complete UFC ledger: **10 bouts**
- WEC is excluded, including WEC 53
- finishes: **1 — 14.29%**
- official UFC title-fight wins: **4**
- adjusted title credit: **3.80**
- prime: **5-2**
- prime stoppage losses: **1**
- reviewed prime rounds: **19-9 — 67.86%**
- calculated active elite years: **5.51**

The old handwritten **6.5 active elite years** cannot be produced from the UFC-only Faber II-to-Cejudo window using the locked 18-month gap cap. The canonical calculation remains 5.51 rather than bending the ledger to preserve the old number.

## Validation

Passed on the five-person batch:

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
- zero browser errors in ownership capture

Known unrelated existing CI debt:

- Picks UI Smoke: `Underdog Lock no-odds state is missing`
- Scoring Architecture Guardrails exact snapshot parity uses an older committed app-build label than current main; fighter scoring data is unchanged

## Judgment/status notes

- Close decision round allocations are reviewed best-effort evidence, not unquestionable official facts.
- Opponent-quality tiers are reviewed model judgments.
- Official results remain separate from model treatment.
- Duplicate/conflict totals remain unchanged because Phase 1 has not deleted or replaced legacy presentation-owned values.

## Resume prompt

> Continue the fighter-data refactor in `codyking0602/ufc-goat-rankings`. Read `docs/FIGHTER_DATA_REFACTOR_HANDOFF.md` and `docs/fighter-data-ownership-baseline.md` first. Continue on `agent/fighter-data-phase-1` unless the handoff says it merged. Fetch latest branch state before editing. Work in five-fighter batches. Never store rank, total, OVR, expected values, calculated aggregates, or hand-written snapshot stats in canonical fighter records. Keep canonical migrations evidence-only until the live calculated pipeline is deliberately connected.

## Exact next task

Create the next five-fighter canonical ledger batch for:

1. Fabricio Werdum
2. Glover Teixeira
3. Rashad Evans
4. Mauricio “Shogun” Rua
5. Forrest Griffin

Use the batch-two pattern: complete UFC-only histories, validate every record before the first registration, add exact per-fighter bout-count and derivation assertions, load the batch before the readiness handoff, and leave every live score, rank, OVR, snapshot, and profile value untouched.
