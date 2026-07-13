# Fighter Data Refactor — Durable Handoff

Last updated: 2026-07-13

## Repo state

- Repository: `codyking0602/ufc-goat-rankings`
- Working branch: `agent/fighter-data-phase-1`
- Draft PR: `#39 — Start canonical fighter data ownership refactor`
- Current code validation head: `3afb3c2f51e7f7ac90c21840194e0658dd4c1d0d`
- Branch was verified at zero commits behind `main` before batch three.

## Permanent architecture

`canonical UFC fight ledger + reviewed classifications → calculated categories → modifiers → calculated total → calculated sort → calculated rank → calculated OVR → generated snapshot/profile`

Live authority must never come from:

- `expectedRank`
- `expectedTotalScore`
- `expectedOverallOvr`
- hand-written snapshot values
- measurable facts or scores in fighter packets
- measurable facts or scores in display overrides

Expected values may eventually remain only as non-authoritative regression warnings.

## Safety state

Phase 1 remains evidence-only. Canonical records load in browser and CI diagnostics but do not write into `RANKING_DATA`.

No live category score, total, rank, OVR, leaderboard position, snapshot, profile stat, or Compare Mode value changed during any completed migration batch. Tests load sentinel live data and require it to remain byte-for-byte unchanged.

## Current canonical coverage

| Fighter | UFC bouts | Official UFC record | Prime | Active elite years |
|---|---:|---:|---:|---:|
| Charles Oliveira | 37 | 25-11, 1 NC | 9-3 | 6.33 |
| Benson Henderson | 14 | 11-3 | 10-3 | 4.29 |
| Vitor Belfort | 26 | 15-10, 1 NC | 7-3 | 6.10 |
| Deiveson Figueiredo | 22 | 14-7-1 | 7-3-1 | 4.73 |
| Frankie Edgar | 30 | 18-11-1 | 13-6-1 | 10.18 |
| Dominick Cruz | 10 | 7-3 | 5-2 | 5.51 |
| Fabricio Werdum | 18 | 12-6 | 9-3 | 6.11 |
| Glover Teixeira | 23 | 16-7 | 12-6 | 8.77 |
| Rashad Evans | 23 | 14-8-1 | 9-3 | 6.00 |
| Mauricio “Shogun” Rua | 24 | 11-12-1 | 3-3 | 2.59 |
| Forrest Griffin | 15 | 10-5 | 4-3 | 3.93 |

- Canonical fighters: **11 of 73 identities — 15.07%**
- Canonical UFC fight rows: **242**
- Charles ledger: **37 rows**
- Batch two: **102 rows**
- Batch three: **103 rows**
- Latest browser ownership capture errors: **0**

See `docs/fighter-data-ownership-baseline.md` for the complete ownership report.

## Canonical files

Core:

- `assets/data/canonical-fighter-facts.js`
- `assets/js/fighter-data-ownership-audit.js`
- `.github/workflows/fighter-data-ownership-baseline.yml`

Completed migrations:

- `assets/data/canonical-fighter-facts-batch-one.js`
- `assets/data/canonical-fighter-facts-batch-two.js`
- `assets/data/canonical-fighter-facts-batch-three-werdum.js`
- `assets/data/canonical-fighter-facts-batch-three-glover.js`
- `assets/data/canonical-fighter-facts-batch-three-rashad.js`
- `assets/data/canonical-fighter-facts-batch-three-shogun.js`
- `assets/data/canonical-fighter-facts-batch-three-forrest.js`
- `assets/data/canonical-fighter-facts-batch-three.js`

Exact tests:

- `scripts/test-canonical-fighter-facts.mjs`
- `scripts/test-canonical-fighter-facts-batch-one.mjs`
- `scripts/test-canonical-fighter-facts-five-person-batch.mjs`
- `scripts/test-canonical-fighter-facts-five-person-batch-three.mjs`

`assets/data/ranking-data-patches.js` loads batch-two and all batch-three fighter files before resolving `UFC_RANKING_DATA_PATCHES_READY`, so browser audits cannot capture a partially loaded registry.

## Batch-three reconciliation

### Fabricio Werdum

- Complete UFC ledger: **18 bouts**
- UFC record: **12-6**
- Finishes: **8 — 66.67%**
- Official title-fight wins: **2**
- Adjusted title credit: **1.65**
- Prime: **9-3**, Roy Nelson through Alexander Volkov
- Prime stoppage losses: **2**
- Reviewed prime rounds: **23-10 — 69.70%**
- Active elite years: **6.11**
- PRIDE, Strikeforce, PFL, and the Fedor win are excluded

### Glover Teixeira

- Complete UFC ledger: **23 bouts**
- UFC record: **16-7**
- Finishes: **13 — 81.25%**
- Official title-fight wins: **1**
- Adjusted title credit: **1.00**
- Prime: **12-6**, Ryan Bader through Jiří Procházka
- Prime stoppage losses: **3**
- Reviewed prime rounds: **32-17 — 65.31%**
- Active elite years: **8.77**
- Jamahal Hill remains post-prime

### Rashad Evans

- Complete UFC ledger: **23 bouts**
- UFC record: **14-8-1**
- Finishes: **6 — 42.86%**
- Official title-fight wins: **1**
- Adjusted title credit: **0.90**
- Prime: **9-3**, Michael Bisping through Chael Sonnen
- Prime stoppage losses: **1**
- Reviewed prime rounds: **22-13 — 62.86%**
- Active elite years: **6.00**
- TUF exhibition bouts are excluded

### Mauricio “Shogun” Rua

- Complete UFC ledger: **24 bouts**
- UFC-only record: **11-12-1**
- Finishes: **8 — 72.73%**
- Official title-fight wins: **1**
- Adjusted title credit: **0.95**
- UFC prime: **3-3**, Chuck Liddell through Dan Henderson I
- Prime stoppage losses: **1**
- Reviewed prime rounds: **8-8 — 50.00%**
- Active elite years: **2.59**
- PRIDE is fully excluded from scoring

### Forrest Griffin

- Complete UFC ledger: **15 bouts**
- UFC record: **10-5**
- Finishes: **3 — 30.00%**
- Official title-fight wins: **1**
- Adjusted title credit: **0.95**
- Prime: **4-3**, Shogun I through Shogun II
- Prime stoppage losses: **3**
- Reviewed prime rounds: **12-7 — 63.16%**
- Active elite years: **3.93**
- The TUF 1 win is a tournament achievement, not an official UFC title fight

## Validation

Passed on code head `3afb3c2f51e7f7ac90c21840194e0658dd4c1d0d`:

- canonical schema contract
- Charles 37-fight derivation test
- batch-two 102-fight derivation test
- batch-three 103-fight derivation test
- exact per-fighter bout-count assertions
- eleven-record registry audit
- live score/rank/OVR/snapshot non-mutation assertion
- Fighter Data Ownership Baseline
- Runtime Scoring Snapshot
- Runtime Scoring Audit
- Six-Category Runtime Audit
- zero browser errors in ownership capture

Known unrelated existing CI debt:

- Picks UI Smoke: `Underdog Lock no-odds state is missing`
- Scoring Architecture Guardrails exact snapshot parity uses an older committed app-build label; canonical and runtime scoring checks remain unchanged

## Phase 1 checklist

- [x] Canonical schema and ownership baseline
- [x] Charles Oliveira
- [x] Benson Henderson
- [x] Vitor Belfort
- [x] Deiveson Figueiredo
- [x] Frankie Edgar
- [x] Dominick Cruz
- [x] Fabricio Werdum
- [x] Glover Teixeira
- [x] Rashad Evans
- [x] Mauricio “Shogun” Rua
- [x] Forrest Griffin
- [ ] Migrate the current top-five leaderboard batch
- [ ] Continue five-fighter batches until every ranked fighter has a canonical record
- [ ] Generate snapshots exclusively from canonical calculations
- [ ] Remove measurable-stat ownership from packets and display overrides
- [ ] Remove expected rank, total, and OVR from live authority

## Resume prompt

> Continue the fighter-data refactor in `codyking0602/ufc-goat-rankings`. Read `docs/FIGHTER_DATA_REFACTOR_HANDOFF.md` and `docs/fighter-data-ownership-baseline.md` first. Continue on `agent/fighter-data-phase-1` unless the handoff says it merged. Fetch and compare latest `main` before editing because automated commits may advance it. Preserve all eleven completed canonical ledgers. Work in five-fighter batches. Never store rank, total, OVR, expected values, calculated aggregates, or hand-written snapshot stats in canonical fighter records. Keep migrations evidence-only until the calculated live pipeline is deliberately connected.

## Exact next task

Create the next five-fighter canonical ledger batch for the current top five:

1. Jon Jones
2. Georges St-Pierre
3. Demetrious Johnson
4. Anderson Silva
5. Islam Makhachev

Use the batch-three pattern: complete UFC-only histories, validate every record before registration, add exact bout-count and derivation assertions, preserve Jones’s Hamill technical context, exclude Demetrious Johnson’s ONE career, keep Anderson’s Weidman losses inside prime, use Islam’s Drew Dober prime start, load all records before the readiness handoff, and leave every live score, rank, OVR, snapshot, profile, and Compare Mode value untouched.