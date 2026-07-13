# Fighter Data Refactor — Durable Handoff

Last updated: 2026-07-13

## Repo state

- Repository: `codyking0602/ufc-goat-rankings`
- Working branch: `agent/fighter-data-phase-1`
- Draft PR: `#39 — Start canonical fighter data ownership refactor`
- Verified batch-five runtime head: `e6deb21537ca049fc7cbdaa59be659c19f216c00`
- Latest documentation head at handoff close: `093e7e3c2ccbe4fdb935bab06fd507e80cdbfb91`
- Always fetch the latest branch and compare it with `main` before editing. Automated Octagon Verdict feed commits and watch-link updates can advance `main` independently.

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

- Canonical fighters: **28 of 73 identities — 38.36%**
- Canonical UFC fight rows: **582**
- Charles ledger: **37 rows**
- Batch two: **102 rows**
- Batch three: **103 rows**
- Batch four: **138 rows**
- Batch five: **202 rows**
- Latest ownership-browser capture: **0 browser errors**

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
| Randy Couture | 24 | 16-8 | 6-3 | 4.22 |
| Max Holloway | 33 | 24-9 | 16-6 | 11.24 |
| Kamaru Usman | 19 | 16-3 | 8-3 | 7.47 |
| Jose Aldo | 23 | 14-9 | 8-3 | 6.59 |
| Matt Hughes | 25 | 18-7 | 13-3 | 6.15 |
| Daniel Cormier | 15 | 11-3, 1 NC | 7-3, 1 NC | 5.62 |
| Stipe Miocic | 19 | 14-5 | 8-3 | 6.29 |
| Ilia Topuria | 10 | 9-1 | 4-1 | 3.05 |
| Israel Adesanya | 19 | 13-6 | 8-4 | 5.35 |
| Cain Velasquez | 15 | 12-3 | 6-2 | 5.16 |

## Canonical files

Core:

- `assets/data/canonical-fighter-facts.js`
- `assets/js/fighter-data-ownership-audit.js`
- `.github/workflows/fighter-data-ownership-baseline.yml`

Completed migration sources:

- `assets/data/canonical-fighter-facts-batch-one.js`
- `assets/data/canonical-fighter-facts-batch-two.js`
- `assets/data/canonical-fighter-facts-batch-three.js`
- `assets/data/canonical-fighter-facts-batch-four.js`
- `assets/data/canonical-fighter-facts-batch-five.js`

Exact tests:

- `scripts/test-canonical-fighter-facts.mjs`
- `scripts/test-canonical-fighter-facts-batch-one.mjs`
- `scripts/test-canonical-fighter-facts-five-person-batch.mjs`
- `scripts/test-canonical-fighter-facts-five-person-batch-three.mjs`
- `scripts/test-canonical-fighter-facts-seven-person-batch-four.mjs`
- `scripts/test-canonical-fighter-facts-ten-person-batch-five.mjs`

Dedicated workflows:

- `.github/workflows/canonical-batch-four.yml`
- `.github/workflows/canonical-batch-five.yml`

`assets/data/ranking-data-patches.js` loads batches two through five before resolving `UFC_RANKING_DATA_PATCHES_READY`, preventing browser audits from capturing a partially loaded registry.

## Batch-five decisions

- **Randy Couture:** 24 UFC bouts, 16-8. UFC 13 tournament wins count as UFC wins but not official title-fight wins. Nine official title-fight wins; 8.75 adjusted.
- **Max Holloway:** 33 UFC bouts, 24-9 through UFC 329. BMF fights remain outside UFC divisional title scoring. Prime remains open at 16-6.
- **Kamaru Usman:** 19 UFC bouts, 16-3. Prime remains open at 8-3. Future Dricus du Plessis fight is excluded.
- **Jose Aldo:** UFC-only 23-bout ledger, 14-9. Every WEC fight and title accomplishment is excluded.
- **Matt Hughes:** 25 UFC bouts, 18-7. Joe Riggs missed weight, so that win remains non-title.
- **Daniel Cormier:** UFC-only 15-bout ledger, 11-3, 1 NC. Strikeforce is excluded and Jones II remains a no contest.
- **Stipe Miocic:** 19 UFC bouts, 14-5. Prime ends with Ngannou II; Jones is post-prime.
- **Ilia Topuria:** 10 UFC bouts, 9-1. Prime remains open at 4-1; Gaethje is a prime stoppage loss.
- **Israel Adesanya:** 19 UFC bouts, 13-6. Prime closes with Dricus; Imavov and Pyfer are post-prime.
- **Cain Velasquez:** 15 UFC bouts, 12-3. Prime is 6-2 from Nogueira through Werdum.

## Validation

All relevant checks passed on the final batch-five implementation:

- canonical schema contract
- Charles 37-fight test
- batch-two 102-fight test
- batch-three 103-fight test
- batch-four 138-fight test
- batch-five 202-fight test
- exact per-fighter bout-count and derivation assertions
- twenty-eight-record registry audit
- live score/rank/OVR/snapshot non-mutation assertion
- Fighter Data Ownership Baseline with zero browser errors
- Runtime Scoring Snapshot
- Runtime Scoring Audit
- Six-Category Runtime Audit, including settled browser, effective-weight, Prime, Championship, Quality Wins, Longevity, and four-category balance checks

Known unrelated existing CI debt:

- Picks UI Smoke: `Underdog Lock no-odds state is missing`
- Scoring Architecture Guardrails contains pre-existing exact-parity/build-label debt; canonical and runtime scoring checks are unaffected

At handoff close, the fighter-data branch was **behind `main` by nine unrelated commits**: recurring Octagon Verdict feed rebuilds plus user watch-link updates. Sync latest `main` before the next migration batch, then rerun the canonical and browser gates.

## Phase 1 checklist

- [x] Canonical schema and ownership baseline
- [x] 28 canonical fighter ledgers / 582 UFC fight rows
- [ ] Continue ten-fighter batches until every ranked fighter has a canonical record
- [ ] Generate snapshots exclusively from canonical calculations
- [ ] Remove measurable-stat ownership from packets and display overrides
- [ ] Remove expected rank, total, and OVR from live authority

## Resume prompt

> Continue the fighter-data refactor in `codyking0602/ufc-goat-rankings`. Read `docs/FIGHTER_DATA_REFACTOR_HANDOFF.md` and `docs/fighter-data-ownership-baseline.md` first. Continue on `agent/fighter-data-phase-1` unless the handoff says it merged. Sync latest `main` before editing because the branch was nine unrelated feed/watch-link commits behind at the last handoff. Preserve all 28 completed canonical ledgers. Work in ten-fighter batches. Never store rank, total, OVR, expected values, calculated aggregates, or hand-written snapshot stats in canonical fighter records. Keep migrations evidence-only until the calculated live pipeline is deliberately connected.

## Exact next task

Create the next ten-fighter canonical ledger batch for:

1. Petr Yan
2. Merab Dvalishvili
3. B.J. Penn
4. Alex Pereira
5. Chuck Liddell
6. Francis Ngannou
7. Henry Cejudo
8. Conor McGregor
9. Justin Gaethje
10. Dustin Poirier

Use the consolidated batch-five pattern: complete UFC-only histories, validate every record before registration, add exact bout-count and derivation assertions, preserve reviewed prime and loss-context decisions, load the batch before the readiness handoff, and leave every live score, rank, OVR, snapshot, profile, and Compare Mode value untouched.
