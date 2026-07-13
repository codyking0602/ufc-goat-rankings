# Fighter Data Refactor — Durable Handoff

Last updated: 2026-07-13

## Repo state

- Repository: `codyking0602/ufc-goat-rankings`
- Working branch: `agent/fighter-data-phase-1`
- Draft PR: `#39 — Start canonical fighter data ownership refactor`
- Latest fully validated batch-four code head before documentation refresh: `47cdf00a9aa546a2d5eadd0054ab4eaddeb01dc2`
- Always fetch the latest branch and compare it with `main` before editing because automated Octagon Verdict feed commits may advance either ref.

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

No live category score, total, rank, OVR, leaderboard position, snapshot, profile stat, or Compare Mode value changed during any completed migration batch. Exact tests load sentinel live data and require it to remain byte-for-byte unchanged.

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
| Jon Jones | 24 | 22-1, 1 NC | 16-0, 1 NC | 10.51 |
| Georges St-Pierre | 22 | 20-2 | 14-1 | 8.44 |
| Demetrious Johnson | 18 | 15-2-1 | 13-1 | 6.15 |
| Anderson Silva | 25 | 17-7, 1 NC | 16-2 | 7.50 |
| Islam Makhachev | 18 | 17-1 | 10-0 | 5.35 |
| Khabib Nurmagomedov | 13 | 13-0 | 8-0 | 6.02 |
| Alexander Volkanovski | 18 | 15-3 | 9-3 | 7.17 |

- Canonical fighters: **18 of 73 identities — 24.66%**
- Canonical UFC fight rows: **380**
- Charles ledger: **37 rows**
- Batch two: **102 rows**
- Batch three: **103 rows**
- Batch four: **138 rows**
- Latest ownership-browser capture: **0 browser errors**

See `docs/fighter-data-ownership-baseline.md` for the ownership report.

## Canonical files

Core:

- `assets/data/canonical-fighter-facts.js`
- `assets/js/fighter-data-ownership-audit.js`
- `.github/workflows/fighter-data-ownership-baseline.yml`

Completed migrations:

- `assets/data/canonical-fighter-facts-batch-one.js`
- `assets/data/canonical-fighter-facts-batch-two.js`
- `assets/data/canonical-fighter-facts-batch-three.js`
- `assets/data/canonical-fighter-facts-batch-four.js`

Exact tests:

- `scripts/test-canonical-fighter-facts.mjs`
- `scripts/test-canonical-fighter-facts-batch-one.mjs`
- `scripts/test-canonical-fighter-facts-five-person-batch.mjs`
- `scripts/test-canonical-fighter-facts-five-person-batch-three.mjs`
- `scripts/test-canonical-fighter-facts-seven-person-batch-four.mjs`

Dedicated batch-four workflow:

- `.github/workflows/canonical-batch-four.yml`

`assets/data/ranking-data-patches.js` loads batches two, three, and four before resolving `UFC_RANKING_DATA_PATCHES_READY`, preventing browser audits from capturing a partially loaded registry.

## Batch-four reconciliation

### Jon Jones

- Complete UFC ledger: **24 bouts**
- Official UFC record: **22-1, 1 NC**
- Scoring record: **22-0**
- Hamill remains an official DQ but is a non-competitive technical exception
- Cormier II remains a no contest
- Official title-fight wins: **16**
- Adjusted title credit: **15.80**
- Prime: **16-0, 1 NC**, Ryan Bader through Ciryl Gane
- Reviewed prime rounds: **52-8 — 86.67%**
- Active elite years: **10.51**
- Stipe is outside the locked prime window

### Georges St-Pierre

- Complete UFC ledger: **22 bouts**
- UFC record: **20-2**
- Official title-fight wins: **13**
- Adjusted title credit: **13.00**
- Prime: **14-1**, Matt Hughes II through Michael Bisping
- Serra remains the one prime finish loss; Hughes I is pre-prime
- Reviewed prime rounds: **49-8 — 85.96%**
- Active elite years: **8.44**

### Demetrious Johnson

- Complete UFC ledger: **18 bouts**
- UFC record: **15-2-1**
- Official title-fight wins: **12**
- Adjusted title credit: **11.90**
- Prime: **13-1**, Ian McCall II through Henry Cejudo II
- Reviewed prime rounds: **45-10 — 81.82%**
- Active elite years: **6.15**
- WEC and ONE Championship are fully excluded

### Anderson Silva

- Complete UFC ledger: **25 bouts**
- Official UFC record: **17-7, 1 NC**
- Scoring record: **17-7**
- Finishes: **14 — 82.35%**
- Official title-fight wins: **11**
- Prime: **16-2**, Chris Leben through Weidman II
- Both Weidman losses remain prime stoppage losses
- Reviewed prime rounds: **28-11 — 71.79%**
- All later losses are post-prime

### Islam Makhachev

- Complete UFC ledger: **18 bouts**
- UFC record: **17-1**
- Prime: **10-0**, beginning with Drew Dober
- Official title-fight wins: **6**
- Adjusted title credit: **6.15**
- Reviewed prime rounds: **25-3 — 89.29%**
- Active elite years: **5.35**
- Jack Della Maddalena is included as the November 2025 second-division title win
- The future Ian Machado Garry defense is excluded

### Khabib Nurmagomedov

- Complete UFC ledger: **13 bouts**
- UFC record: **13-0**
- Finishes: **7 — 53.85%**
- Prime: **8-0**, Rafael dos Anjos through Justin Gaethje
- Official title-fight wins: **4**
- Adjusted title credit: **3.90**
- Reviewed prime rounds: **23-2 — 92.00%**
- No UFC loss penalty

### Alexander Volkanovski

- Complete UFC ledger: **18 bouts**
- UFC record: **15-3**
- Finishes: **5 — 33.33%**, correcting stale presentation data
- Prime: **9-3**, beginning with Jose Aldo and remaining open
- Official title-fight wins: **8**
- Adjusted title credit: **7.90**
- Reviewed prime rounds: **36-12 — 75.00%**
- Active elite years: **7.17**
- Both Islam losses use the upward-division elite-loss exception
- Topuria remains a home-division prime finish loss

## Validation

Passed on code head `47cdf00a9aa546a2d5eadd0054ab4eaddeb01dc2`:

- canonical schema contract
- Charles 37-fight derivation test
- batch-two 102-fight derivation test
- batch-three 103-fight derivation test
- batch-four 138-fight derivation test
- exact per-fighter bout-count assertions
- eighteen-record registry audit
- live score/rank/OVR/snapshot non-mutation assertion
- Fighter Data Ownership Baseline with zero browser errors
- Runtime Scoring Snapshot
- Runtime Scoring Audit
- Six-Category Runtime Audit

Known unrelated existing CI debt:

- Picks UI Smoke: `Underdog Lock no-odds state is missing`
- Scoring Architecture Guardrails contains pre-existing exact-parity/build-label debt; canonical and runtime scoring checks are unaffected

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
- [x] Jon Jones
- [x] Georges St-Pierre
- [x] Demetrious Johnson
- [x] Anderson Silva
- [x] Islam Makhachev
- [x] Khabib Nurmagomedov
- [x] Alexander Volkanovski
- [ ] Continue seven-fighter batches until every ranked fighter has a canonical record
- [ ] Generate snapshots exclusively from canonical calculations
- [ ] Remove measurable-stat ownership from packets and display overrides
- [ ] Remove expected rank, total, and OVR from live authority

## Resume prompt

> Continue the fighter-data refactor in `codyking0602/ufc-goat-rankings`. Read `docs/FIGHTER_DATA_REFACTOR_HANDOFF.md` and `docs/fighter-data-ownership-baseline.md` first. Continue on `agent/fighter-data-phase-1` unless the handoff says it merged. Fetch and compare latest `main` before editing because automated feed commits may advance it. Preserve all eighteen completed canonical ledgers. Work in seven-fighter batches. Never store rank, total, OVR, expected values, calculated aggregates, or hand-written snapshot stats in canonical fighter records. Keep migrations evidence-only until the calculated live pipeline is deliberately connected.

## Exact next task

Create the next seven-fighter canonical ledger batch for:

1. Randy Couture
2. Max Holloway
3. Kamaru Usman
4. Jose Aldo
5. Matt Hughes
6. Daniel Cormier
7. Stipe Miocic

Use the consolidated batch-four pattern: complete UFC-only histories, validate every record before registration, add exact bout-count and derivation assertions, keep WEC/Strikeforce/PRIDE achievements outside scoring, preserve reviewed prime and loss-context decisions, load the batch before the readiness handoff, and leave every live score, rank, OVR, snapshot, profile, and Compare Mode value untouched.
