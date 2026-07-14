# Fighter Data Refactor — Durable Handoff

Last updated: 2026-07-13

## Repo state

- Repository: `codyking0602/ufc-goat-rankings`
- Working branch: `agent/fighter-data-phase-1`
- Draft PR: `#39 — Start canonical fighter data ownership refactor`
- Latest main sync merge: `5cabf73cb4a3cdd6f4e65ba5a312faafa983dea1`
- Always compare the branch with `main` before editing. Automated Octagon Verdict, watch-link, picks, and generated-report commits may advance `main`.

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

- Canonical fighters: **38 of 73 identities — 52.05%**
- Canonical UFC fight rows: **771**
- Charles ledger: **37 rows**
- Batch two: **102 rows**
- Batch three: **103 rows**
- Batch four: **138 rows**
- Batch five: **202 rows**
- Batch six: **189 rows**

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
| Petr Yan | 16 | 12-4 | 6-4 | 6.00 |
| Merab Dvalishvili | 17 | 14-3 | 8-1 | 4.80 |
| B.J. Penn | 27 | 12-13-2 | 6-5 | 5.98 |
| Alex Pereira | 13 | 10-3 | 8-3 | 4.03 |
| Chuck Liddell | 23 | 16-7 | 7-1 | 3.15 |
| Francis Ngannou | 14 | 12-2 | 6-0 | 3.16 |
| Henry Cejudo | 16 | 10-6 | 4-1 | 3.26 |
| Conor McGregor | 15 | 10-5 | 6-2 | 3.63 |
| Justin Gaethje | 16 | 11-5 | 7-3 | 6.18 |
| Dustin Poirier | 32 | 22-9, 1 NC | 7-4 | 5.85 |

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
- `assets/data/canonical-fighter-facts-batch-six.js`

Exact tests:

- `scripts/test-canonical-fighter-facts.mjs`
- `scripts/test-canonical-fighter-facts-batch-one.mjs`
- `scripts/test-canonical-fighter-facts-five-person-batch.mjs`
- `scripts/test-canonical-fighter-facts-five-person-batch-three.mjs`
- `scripts/test-canonical-fighter-facts-seven-person-batch-four.mjs`
- `scripts/test-canonical-fighter-facts-ten-person-batch-five.mjs`
- `scripts/test-canonical-fighter-facts-ten-person-batch-six.mjs`

Dedicated workflows:

- `.github/workflows/canonical-batch-four.yml`
- `.github/workflows/canonical-batch-five.yml`
- `.github/workflows/canonical-batch-six.yml`

`assets/data/ranking-data-patches.js` loads batches two through six before resolving `UFC_RANKING_DATA_PATCHES_READY`, preventing browser audits from capturing a partially loaded registry.

## Batch-six decisions

- **Petr Yan:** 16 UFC bouts, 12-4. Sterling I remains an official counted DQ loss with explicit technical context rather than being treated like a normal clean defeat.
- **Merab Dvalishvili:** 17 UFC bouts, 14-3. The canonical ledger includes three successful defenses and the December 2025 Yan title loss.
- **B.J. Penn:** 27 UFC bouts, 12-13-2. Non-UFC fights are excluded and the late collapse remains post-prime.
- **Alex Pereira:** 13 UFC bouts, 10-3. The Ciryl Gane loss is a counted prime upward-division elite finish loss with reduced upward-division context.
- **Chuck Liddell:** 23 UFC bouts, 16-7. Pride and the later non-UFC Ortiz fight are excluded.
- **Francis Ngannou:** 14 UFC bouts, 12-2. The UFC ledger ends with the Gane defense; PFL and boxing are excluded.
- **Henry Cejudo:** 16 UFC bouts, 10-6. Sterling closes the counted prime window; later losses are post-prime.
- **Conor McGregor:** 15 UFC bouts, 10-5 through UFC 329. Khabib closes the counted prime window; later Poirier and Holloway losses are post-prime.
- **Justin Gaethje:** 16 UFC bouts, 11-5. The Holloway loss no longer closes the prime because Gaethje re-proved championship form with the Pimblett interim and Topuria undisputed-title wins. BMF fights receive no UFC divisional-title credit.
- **Dustin Poirier:** 32 UFC bouts, 22-9, 1 NC. Islam closes the prime; the 2025 Holloway retirement fight is post-prime and BMF-only.

Several batch-six records intentionally expose stale presentation-layer facts. Phase 1 does not repair those live values yet; it creates the authoritative evidence source that the later calculated pipeline will use.

## Validation

Required gates for batch six:

- canonical schema contract
- all previous batch derivation tests
- dedicated 189-fight batch-six derivation test
- exact per-fighter bout-count and derivation assertions
- thirty-eight-record registry audit
- live score/rank/OVR/snapshot non-mutation assertion
- Fighter Data Ownership Baseline browser capture
- Runtime Scoring Snapshot
- Runtime Scoring Audit
- Six-Category Runtime Audit

Known unrelated existing CI debt:

- Picks UI Smoke: `Underdog Lock no-odds state is missing`
- Scoring Architecture Guardrails contains pre-existing exact-parity/build-label debt; canonical and runtime scoring checks are unaffected

## Phase 1 checklist

- [x] Canonical schema and ownership baseline
- [x] 38 canonical fighter ledgers / 771 UFC fight rows
- [ ] Continue ten-fighter batches until every ranked fighter has a canonical record
- [ ] Generate snapshots exclusively from canonical calculations
- [ ] Remove measurable-stat ownership from packets and display overrides
- [ ] Remove expected rank, total, and OVR from live authority

## Resume prompt

> Continue the fighter-data refactor in `codyking0602/ufc-goat-rankings`. Read `docs/FIGHTER_DATA_REFACTOR_HANDOFF.md` and `docs/fighter-data-ownership-baseline.md` first. Continue on `agent/fighter-data-phase-1` unless the handoff says it merged. Sync latest `main` before editing. Preserve all 38 completed canonical ledgers. Work in ten-fighter batches. Never store rank, total, OVR, expected values, calculated aggregates, or hand-written snapshot stats in canonical fighter records. Keep migrations evidence-only until the calculated live pipeline is deliberately connected.

## Exact next task

Create the next ten-fighter canonical ledger batch for:

1. Tony Ferguson
2. T.J. Dillashaw
3. Tito Ortiz
4. Junior dos Santos
5. Brock Lesnar
6. Dricus du Plessis
7. Tyron Woodley
8. Aljamain Sterling
9. Robert Whittaker
10. Lyoto Machida

Use the consolidated batch-six pattern: complete UFC-only histories, validate every record before registration, add exact bout-count and derivation assertions, preserve reviewed prime and loss-context decisions, load the batch before the readiness handoff, and leave every live score, rank, OVR, snapshot, profile, and Compare Mode value untouched.
