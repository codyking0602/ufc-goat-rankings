# Fighter Data Refactor — Durable Handoff

Last updated: 2026-07-13

- Repository: `codyking0602/ufc-goat-rankings`
- Working branch: `agent/fighter-data-phase-1`
- Draft PR: `#39 — Start canonical fighter data ownership refactor`
- Branch base: `f81a9a58c5c0e0aa6be2dc9e02a1c757b21c2ae6`
- Latest fighter implementation commit: `78df2e2cf0211d2ffd12f5dbe2452c43925a6b7e`

## Permanent architecture

`canonical UFC fight ledger + reviewed classifications → calculated categories → modifiers → calculated total → calculated sort → calculated rank → calculated OVR → generated snapshot/profile`

Live runtime must never be controlled by:

- `expectedRank`
- `expectedTotalScore`
- `expectedOverallOvr`
- hand-written snapshot stats
- measurable stats or score fields in fighter packets or display overrides

Expected values may survive only as non-authoritative regression fixtures.

## Current safety state

Phase 1 remains evidence-only. Canonical records are loaded for diagnostics but do not write into `RANKING_DATA`.

No live category score, total, rank, OVR, leaderboard row, snapshot, or profile value was changed during the Charles migration. The dedicated test proves the sentinel live data remains unchanged.

## Ownership baseline

Current fully loaded browser baseline:

- 72 board rows
- 72 profile rows
- 62 fighter packets
- 73 display overrides
- 72 canonical scoring records
- 1 canonical fighter-fact record — 1.37% coverage
- 521 duplicated fact fields
- 80 conflicting fact fields
- 1,566 measurable fields still owned by presentation files
- 72 `expectedRank` locks
- 72 `expectedTotalScore` locks
- 72 `expectedOverallOvr` locks
- one orphan identity: Leon Edwards in `display-overrides.js` only

Human-readable baseline: `docs/fighter-data-ownership-baseline.md`

## Canonical ledger contract

Primary file: `assets/data/canonical-fighter-facts.js`

It stores complete chronological UFC fight evidence and reviewed classifications:

- official result and separate scoring disposition
- method and finish context
- opponent-quality tier
- championship type and title eligibility
- loss phase, division context, and technical exceptions
- prime start/end or explicit open prime
- audited prime-round results
- longevity gap cap and status treatment
- division-strength treatment
- evidence coverage and verification date

It rejects stored aggregates and outputs including UFC record, finish rate, title totals, quality totals, prime record, rounds percentage, active elite years, loss exposure, category scores, total, rank, OVR, and all `expected...` fields.

## Phase 1 checklist

- [x] Create dedicated working branch.
- [x] Add durable handoff.
- [x] Build canonical ledger schema.
- [x] Add duplicate/conflict ownership audit.
- [x] Capture full loaded-roster baseline.
- [x] Enforce schema and derivation tests in CI.
- [x] Migrate Charles Oliveira.
- [ ] Migrate Benson Henderson.
- [ ] Migrate Vitor Belfort.
- [ ] Migrate Deiveson Figueiredo.
- [ ] Generate first-batch snapshot stats exclusively from canonical records.
- [ ] Expand migration across all ranked fighters in small audited batches.

## Charles Oliveira — completed

Canonical file: `assets/data/canonical-fighter-facts-batch-one.js`

Test: `scripts/test-canonical-fighter-facts-batch-one.mjs`

Complete coverage:

- 37 UFC bouts through UFC 326 on March 7, 2026
- verified through July 13, 2026
- official UFC record: **25-11, 1 NC**
- model scoring record: **25-11**
- UFC finish wins: **21**
- finish rate: **84.0%**
- official UFC title-fight wins: **2**
- adjusted eligible title-win credit: **1.76**
- Gaethje is a title bout but Oliveira was ineligible after missing championship weight, so the win earns no title-win credit
- Holloway II/BMF is not counted as a UFC championship title fight
- prime begins with Kevin Lee and remains open
- prime record: **9-3**
- prime finishes: **6 of 12**
- prime stoppage losses: **2** — Islam Makhachev and Ilia Topuria
- Arman Tsarukyan is the third prime loss and is a decision loss
- audited prime rounds: **22 won, 9 lost**
- rounds-won percentage: **70.97%**
- active elite years: **6.33**
- through-prime scoring exposure: **36 fights**
- loss phases: **8 pre-prime, 3 prime, 0 post-prime**

Reviewed calls retained:

- Kevin Lee round audit: 2-1 Oliveira — review
- Chandler II round audit: 4-1 Oliveira — review
- Gamrot round audit: 2-0 Oliveira — review
- Holloway I remains an official loss but is marked non-standard competitive evidence because of the unexplained neck-injury stoppage
- quality tiers remain explicit reviewed model judgments, not official facts

Final cleanup in commit `78df2e2cf0211d2ffd12f5dbe2452c43925a6b7e` corrected Jim Miller to contender status and Topuria to former-champion status at UFC 317. Those labels do not change derived totals.

## Validation

Latest Charles implementation checks:

- canonical ledger schema test: passed
- Charles 37-fight derivation test: passed
- Fighter Data Ownership Baseline browser capture: passed with zero browser errors
- Runtime Scoring Snapshot: passed
- Runtime Scoring Audit: passed
- live score/rank/OVR mutation test: passed — no change

Known unrelated CI debt:

- Picks UI Smoke still fails: `Underdog Lock no-odds state is missing`
- Scoring Architecture Guardrails exact snapshot parity still uses an older committed app-build label than current main; fighter-data SHA/scoring behavior is unchanged

## Remaining first-batch fighters

### Benson Henderson

Build the complete UFC ledger. Keep current placement untouched. Derive the correct top-five total instead of exposing the generic elite count. Review close decisions including Edgar II, Melendez, and Thomson.

### Vitor Belfort

Build the complete UFC-only ledger. Recalculate Opponent Quality from evidence instead of preserving 21.0. Separate one UFC title-fight win from one UFC tournament win. Do not imply the Pride Dan Henderson fight is scored.

### Deiveson Figueiredo

Build the complete UFC ledger. Correct Song Yadong’s date/result/method, derive the 7-3-1 prime through Petr Yan, derive two prime stoppage losses, and correct through-prime exposure.

## Unresolved cleanup outside the fighter task

- Decide whether the Leon Edwards display override is future preparation or stale orphan data.
- Do not mix unrelated Picks or stale app-build CI cleanup into this refactor unless separately requested.

## Resume prompt for a new chat

> Continue the fighter-data refactor in `codyking0602/ufc-goat-rankings`. Read `docs/FIGHTER_DATA_REFACTOR_HANDOFF.md` and `docs/fighter-data-ownership-baseline.md` first. Continue on `agent/fighter-data-phase-1` unless the handoff says it merged. Fetch latest branch state before editing. Continue from the first unchecked Phase 1 fighter. Never store rank, total, OVR, expected values, calculated aggregates, or hand-written snapshot stats in canonical fighter records.

## Exact next task

Migrate **Benson Henderson** as the second complete audited canonical UFC ledger. Verify every UFC bout, title context, opponent-quality tier, prime boundary, prime rounds, loss classification, and UFC-only treatment. The record must derive Benson’s factual outputs while leaving his current live score, rank, OVR, and snapshot untouched.
