# Fighter Data Refactor — Durable Handoff

Last updated: 2026-07-13

- Repository: `codyking0602/ufc-goat-rankings`
- Working branch: `agent/fighter-data-phase-1`
- Draft PR: `#39 — Start canonical fighter data ownership refactor`
- Branch base: `f81a9a58c5c0e0aa6be2dc9e02a1c757b21c2ae6`
- Latest fighter implementation commit: `78df2e2cf0211d2ffd12f5dbe2452c43925a6b7e`
- Latest runtime wiring commit: `2c85987863ec3f2d228c7b7989288927954afb6b`
- Latest baseline documentation commit before this handoff update: `985a70136173f1e891771c118f93c1b064a647f5`

## Permanent architecture

`canonical UFC fight ledger + reviewed classifications → calculated categories → modifiers → calculated total → calculated sort → calculated rank → calculated OVR → generated snapshot/profile`

Live runtime must never be controlled by `expectedRank`, `expectedTotalScore`, `expectedOverallOvr`, hand-written snapshot stats, or measurable stats/scores inside presentation files.

## Safety state

Phase 1 remains evidence-only. Canonical records are loaded for diagnostics but do not write into `RANKING_DATA`.

No live category score, total, rank, OVR, leaderboard row, snapshot, or profile value changed during the Charles migration. The dedicated test proves the sentinel live data remains unchanged.

## Ownership baseline

Current browser baseline:

- 72 board rows and 72 profile rows
- 62 fighter packets and 73 display overrides
- 72 canonical scoring records
- 1 canonical fighter-fact record — 1.37% coverage
- 521 duplicate fact fields
- 80 conflicts
- 1,566 measurable fields still owned by presentation files
- 72 locks each for expected rank, total, and OVR
- one orphan identity: Leon Edwards in `display-overrides.js` only

See `docs/fighter-data-ownership-baseline.md`.

## Canonical ledger contract

`assets/data/canonical-fighter-facts.js` owns chronological UFC fight evidence and reviewed classifications: official result, separate scoring disposition, method, opponent tier, title context and eligibility, loss classification, prime boundaries, prime rounds, longevity context, division strength, and source coverage.

It rejects stored aggregates and outputs including UFC record, finish rate, title totals, quality totals, prime record, rounds percentage, active elite years, loss exposure, category scores, total, rank, OVR, and all expected-value fields.

## Phase 1 checklist

- [x] Create working branch and durable handoff.
- [x] Build and enforce canonical ledger schema.
- [x] Add full-roster ownership baseline.
- [x] Migrate Charles Oliveira.
- [ ] Migrate Benson Henderson.
- [ ] Migrate Vitor Belfort.
- [ ] Migrate Deiveson Figueiredo.
- [ ] Generate first-batch snapshot stats exclusively from canonical records.
- [ ] Expand migration across all ranked fighters in small batches.

## Charles Oliveira — completed

Files:

- `assets/data/canonical-fighter-facts-batch-one.js`
- `scripts/test-canonical-fighter-facts-batch-one.mjs`

Derived from 37 UFC bouts through UFC 326:

- official record: **25-11, 1 NC**
- scoring record: **25-11**
- finish wins/rate: **21 / 84.0%**
- official UFC title-fight wins: **2**
- adjusted eligible title credit: **1.76**
- Gaethje title bout recorded with Oliveira ineligible after the weight miss; zero title-win credit
- Holloway II/BMF excluded from UFC championship scoring
- open prime begins with Kevin Lee
- prime record: **9-3**
- prime finishes: **6 of 12**
- prime stoppage losses: **2** — Islam and Topuria
- Arman is the third prime loss by decision
- prime rounds: **22-9**, or **70.97%**
- active elite years: **6.33**
- through-prime exposure: **36 scored fights**
- loss phases: **8 pre-prime, 3 prime, 0 post-prime**

Reviewed calls:

- Kevin Lee rounds 2-1 Oliveira
- Chandler II rounds 4-1 Oliveira
- Gamrot rounds 2-0 Oliveira
- Holloway I is an official counted loss but flagged as non-standard competitive evidence because of the neck-injury stoppage
- opponent tiers remain reviewed model judgments

Commit `78df2e2cf0211d2ffd12f5dbe2452c43925a6b7e` corrected Jim Miller to contender status and Topuria to former-champion status at UFC 317. Commit `2c85987863ec3f2d228c7b7989288927954afb6b` refreshed the browser cache key for that corrected ledger.

## Validation

Passed on the Charles implementation:

- canonical schema test
- Charles 37-fight derivation test
- Fighter Data Ownership Baseline capture with zero browser errors
- Runtime Scoring Snapshot
- Runtime Scoring Audit
- live score/rank/OVR non-mutation assertion

Known unrelated CI debt:

- Picks UI Smoke: `Underdog Lock no-odds state is missing`
- Scoring Architecture Guardrails exact snapshot parity uses an older committed app-build label than current main; scoring data is unchanged

## Remaining first batch

### Benson Henderson

Build the complete UFC ledger. Keep placement untouched. Derive the correct top-five total and review close decisions including Edgar II, Melendez, and Thomson.

### Vitor Belfort

Build the complete UFC-only ledger. Recalculate Opponent Quality from evidence, distinguish the UFC tournament win from the official title-fight win, and keep Pride excluded.

### Deiveson Figueiredo

Build the complete UFC ledger. Correct Song Yadong, derive the 7-3-1 prime through Petr Yan, derive two prime stoppage losses, and correct through-prime exposure.

## Resume prompt

> Continue the fighter-data refactor in `codyking0602/ufc-goat-rankings`. Read `docs/FIGHTER_DATA_REFACTOR_HANDOFF.md` and `docs/fighter-data-ownership-baseline.md` first. Continue on `agent/fighter-data-phase-1` unless the handoff says it merged. Fetch latest branch state before editing. Continue from the first unchecked Phase 1 fighter. Never store rank, total, OVR, expected values, calculated aggregates, or hand-written snapshot stats in canonical fighter records.

## Exact next task

Migrate **Benson Henderson** as the second complete audited canonical UFC ledger. Verify every UFC bout, title context, opponent-quality tier, prime boundary, prime rounds, loss classification, and UFC-only treatment. Leave his current live score, rank, OVR, and snapshot untouched.
