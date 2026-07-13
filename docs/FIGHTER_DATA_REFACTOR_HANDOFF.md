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
- Coverage documentation commit: `2adb396e9bac813026f0b815de975307efb9f9fc`
- Latest completed handoff checkpoint: `3e8d79b649480ebc5c23c23c37f01faaa61f5336`

## Permanent architecture

`canonical UFC fight ledger + reviewed classifications → calculated categories → modifiers → calculated total → calculated sort → calculated rank → calculated OVR → generated snapshot/profile`

Live runtime must never be controlled by expected rank, expected total, expected OVR, hand-written snapshot stats, or measurable stats/scores inside presentation files.

## Safety state

Phase 1 remains evidence-only. Canonical records are loaded into the browser shadow runtime but do not write into `RANKING_DATA`.

No live category score, total, rank, OVR, leaderboard row, snapshot, profile value, or current placement changed during either migration batch. Dedicated tests prove sentinel live data remains byte-for-byte unchanged.

## Ownership baseline

Latest successful fully loaded browser capture:

- 72 board rows and 72 profile rows
- 62 fighter packets and 73 display overrides
- 72 canonical scoring records
- **6 canonical fighter-fact records — 8.22% coverage**
- 521 duplicate fact fields
- 80 conflicts
- 1,566 measurable fields still owned by presentation files
- 72 locks each for expected rank, total, and OVR
- zero browser errors
- one orphan identity: Leon Edwards in `display-overrides.js` only

See `docs/fighter-data-ownership-baseline.md`.

## Canonical ledger contract

`assets/data/canonical-fighter-facts.js` owns chronological UFC fight evidence and reviewed classifications:

- official result and separate scoring disposition
- method and result context
- opponent-quality tier
- title context, eligibility, and reviewed title credit input
- loss classification and division context
- prime start/end boundaries
- audited prime rounds
- longevity gap cap and status multiplier
- division-strength segments
- evidence coverage and verification date

It rejects stored aggregates and outputs including UFC record, finish rate, title totals, quality totals, prime record, rounds percentage, active elite years, loss exposure, category scores, total, rank, OVR, and all expected-value fields.

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
- [ ] Continue five-fighter batches until every ranked fighter has a canonical record.
- [ ] Generate snapshots exclusively from canonical records.
- [ ] Remove factual/stat ownership from packets and display overrides.
- [ ] Remove expected-rank, expected-total, and expected-OVR runtime control.

## Files added for the five-person batch

- `assets/data/canonical-fighter-facts-batch-two.js`
- `scripts/test-canonical-fighter-facts-five-person-batch.mjs`

`assets/data/ranking-data-patches.js` now loads batch two before resolving `UFC_RANKING_DATA_PATCHES_READY`, so browser audits cannot run against a partially loaded canonical registry.

The ownership workflow now syntax-checks and runs the five-person derivation test before launching the browser capture.

## Canonical coverage

### Charles Oliveira — 37 UFC bouts

- official: **25-11, 1 NC**
- scoring: **25-11**
- finishes: **21 / 84.0%**
- official title-fight wins: **2**
- adjusted title credit: **1.76**
- prime: **9-3**, open from Kevin Lee
- prime rounds: **22-9 / 70.97%**
- prime stoppage losses: **2**
- active elite years: **6.33**

### Benson Henderson — 14 UFC bouts

- official/scoring: **11-3**
- finishes: **2 / 18.18%**
- official title-fight wins: **4**
- adjusted title credit: **3.65**
- prime: **10-3**
- prime rounds: **33-16 / 67.35%**
- prime stoppage losses: **2**
- active elite years: **4.29**

Close decisions remain explicitly reviewed, including Edgar II, Melendez, Thomson, and Masvidal.

### Vitor Belfort — 26 UFC bouts

- official: **15-10, 1 NC**
- scoring: **15-10**
- finishes: **14 / 93.33%**
- official UFC title-fight wins: **1**
- adjusted title/tournament credit: **1.10**
- prime: **7-3**
- prime rounds: **9-5 / 64.29%**
- prime stoppage losses: **3**
- active elite years: **6.10**

The Scott Ferrozzo UFC 12 tournament win receives reviewed tournament credit but is not counted as an official UFC title-fight win. PRIDE and all other non-UFC fights are excluded.

### Deiveson Figueiredo — 23 UFC bouts

- official/scoring: **14-7-1**
- finishes: **8 / 57.14%**
- official title-fight wins: **3**
- adjusted title credit: **2.75**
- prime: **7-3-1**, Benavidez I through Petr Yan
- prime rounds: **17-15-1 / 53.03%**
- prime stoppage losses: **2**
- active elite years: **4.73**

Corrections locked:

- Benavidez I gives no title-win credit because Figueiredo missed championship weight.
- Song Yadong is May 30, 2026, submission loss, guillotine, round 2 at 4:42.
- Sandhagen, Umar, and Song are post-prime under the locked Petr Yan endpoint.

### Frankie Edgar — 30 UFC bouts

- official/scoring: **18-11-1**
- finishes: **7 / 38.89%**
- official title-fight wins: **3**
- adjusted title credit: **2.80**
- prime: **13-6-1**, Sean Sherk through Max Holloway
- prime rounds: **51-24 / 68.00%**
- prime stoppage losses: **1**
- active elite years: **10.18**

The Gray Maynard II draw and controversial Penn/Henderson decisions retain reviewed scorecard context.

### Dominick Cruz — 10 UFC bouts

- official/scoring: **7-3**
- finishes: **1 / 14.29%**
- official UFC title-fight wins: **4**
- adjusted title credit: **3.80**
- prime: **5-2**, Faber II through Cejudo
- prime rounds: **19-9 / 67.86%**
- prime stoppage losses: **1**
- active elite years: **5.51**

All WEC bouts are excluded, including WEC 53. The prior handwritten 6.5 active-elite-years value cannot be produced by the UFC-only prime window and locked 18-month gap cap; canonical calculation is 5.51.

## Validation

Passed on the five-person batch commit:

- canonical schema test
- Charles 37-fight derivation test
- five-person 102-fight derivation test
- six-record registry audit
- live score/rank/OVR/snapshot non-mutation assertion
- Fighter Data Ownership Baseline capture with zero browser errors
- Runtime Scoring Snapshot
- Runtime Scoring Audit

Known unrelated CI debt:

- Picks UI Smoke: `Underdog Lock no-odds state is missing`
- Scoring Architecture Guardrails exact snapshot parity uses an older committed app-build label than current main; fighter scoring data is unchanged

## Judgment/status notes

- Close decision round allocations are reviewed best-effort evidence, not claimed as unquestionable official facts.
- Opponent-quality tiers are reviewed model judgments.
- The canonical system preserves official results separately from model treatment.
- Duplicate/conflict totals remain unchanged because Phase 1 has not yet deleted or replaced legacy presentation-owned values.

## Resume prompt

> Continue the fighter-data refactor in `codyking0602/ufc-goat-rankings`. Read `docs/FIGHTER_DATA_REFACTOR_HANDOFF.md` and `docs/fighter-data-ownership-baseline.md` first. Continue on `agent/fighter-data-phase-1` unless the handoff says it merged. Fetch latest branch state before editing. Continue from the exact next task. Use five-fighter migration batches. Never store rank, total, OVR, expected values, calculated aggregates, or hand-written snapshot stats in canonical fighter records.

## Exact next task

Create the next five-fighter canonical ledger batch for:

1. Fabricio Werdum
2. Glover Teixeira
3. Rashad Evans
4. Mauricio “Shogun” Rua
5. Forrest Griffin

Use the same pattern as batch two: complete UFC-only fight histories, all records validated before registration, independent exact derivation assertions, no live data mutation, browser-ready loading before the readiness handoff, and updated ownership coverage documentation.
