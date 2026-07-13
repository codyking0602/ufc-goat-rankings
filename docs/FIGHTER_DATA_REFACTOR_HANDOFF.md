# Fighter Data Refactor — Durable Handoff

Last updated: 2026-07-13

- Repository: `codyking0602/ufc-goat-rankings`
- Working branch: `agent/fighter-data-phase-1`
- Draft PR: `#39 — Start canonical fighter data ownership refactor`
- Branch base: `f81a9a58c5c0e0aa6be2dc9e02a1c757b21c2ae6`
- Latest implementation commit before this handoff update: `1d473b491a57b3144f0c2769b8321e0ca040b105`

## Non-negotiable architecture

Permanent flow:

`canonical UFC fight ledger + reviewed classifications → calculated categories → modifiers → calculated total → calculated sort → calculated rank → calculated OVR → generated snapshot/profile`

Live results must never be controlled by:

- `expectedRank`
- `expectedTotalScore`
- `expectedOverallOvr`
- hand-written snapshot stats
- measurable stats or score fields in fighter packets or display overrides

Expected values may remain only as non-authoritative regression fixtures.

## Current safety state

Phase 1 is still diagnostic and evidence-only.

No live fighter category score, total score, rank, OVR, snapshot, or profile value has been changed by the canonical ledger work. The Charles migration test loads a sentinel score/rank/OVR object and proves it remains byte-for-byte unchanged.

## Baseline ownership audit

The fully loaded browser baseline currently reports:

- 72 board rows
- 72 profile rows
- 62 fighter packets
- 73 display overrides
- 72 canonical scoring records
- 1 canonical fighter-fact record after Charles migration — 1.37% coverage
- 521 duplicated fact fields across all 72 ranked fighters
- 80 conflicting fact fields across 28 fighters
- 1,566 measurable stat/score fields still owned by presentation files
- 72 `expectedRank` locks
- 72 `expectedTotalScore` locks
- 72 `expectedOverallOvr` locks
- one orphan identity: Leon Edwards, present only in `display-overrides.js`

The baseline workflow succeeds because capture integrity is clean; the ownership report remains intentionally failing until migration is complete.

## Canonical ledger contract

`assets/data/canonical-fighter-facts.js` owns complete UFC fight evidence and reviewed classifications.

Each audited fighter record contains:

- chronological UFC fight ledger
- official result and separate scoring disposition
- method and finish context
- opponent-quality tier and review status
- championship type, eligibility, opponent-strength input, and review status
- loss phase/division/competitive classification
- prime start/end fight IDs or explicit open prime
- audited prime-round results
- longevity gap cap and status multiplier
- division-strength key and any segments
- evidence coverage and verification date

The registry forbids stored aggregate outputs including UFC record, finish rate, title totals, quality-win totals, prime record, rounds-won percentage, active elite years, loss exposure, category scores, total score, rank, OVR, and every `expected...` field.

## Phase 1 checklist

- [x] Create dedicated working branch from latest main.
- [x] Add durable handoff.
- [x] Add canonical ledger contract.
- [x] Add ownership/conflict audit.
- [x] Capture full loaded-roster baseline.
- [x] Enforce schema and derivation tests in CI.
- [x] Migrate Charles Oliveira as the first complete audited canonical ledger.
- [ ] Migrate Benson Henderson.
- [ ] Migrate Vitor Belfort.
- [ ] Migrate Deiveson Figueiredo.
- [ ] Make the first four canonical records the only source for their generated snapshot stats.
- [ ] Expand migration in small audited batches across all 72 ranked fighters.

## Charles Oliveira — completed migration

File: `assets/data/canonical-fighter-facts-batch-one.js`

Test: `scripts/test-canonical-fighter-facts-batch-one.mjs`

Coverage:

- 37 UFC bouts through UFC 326 on March 7, 2026
- verified through July 13, 2026
- official record: **25-11, 1 NC**
- model scoring record: **25-11**, with the no contest excluded
- UFC finish wins: **21**
- derived finish rate: **84.0%**
- official UFC title-fight wins: **2**
- adjusted title credit from eligible wins: **1.76**
- Gaethje is recorded as a title fight but Oliveira is ineligible after the weight miss, producing zero title-win credit
- Max Holloway II/BMF is explicitly not treated as a UFC championship title fight
- prime starts with Kevin Lee on March 14, 2020 and remains open
- derived current prime record: **9-3**
- prime finishes: **6 of 12**
- prime stoppage losses: **2** — Islam Makhachev and Ilia Topuria
- Arman Tsarukyan is the third prime loss and is a decision loss
- audited prime rounds: **22 won, 9 lost**
- derived prime rounds-won percentage: **70.97%**
- derived active elite years: **6.33**
- through-prime scoring exposure: **36 fights**
- loss phases: **8 pre-prime, 3 prime, 0 post-prime**

Reviewed judgment calls retained in the record:

- Kevin Lee round audit is 2-1 Oliveira and remains `review`.
- Gamrot round audit is 2-0 Oliveira and remains `review`.
- Chandler II round audit is 4-1 Oliveira and remains `review`.
- Holloway I remains an official counted loss but is marked non-standard competitive evidence because of the unexplained neck-injury stoppage.
- Opponent-quality tiers remain reviewed model classifications, separate from official fight facts.

## Charles validation results

The dedicated CI test passed and confirms:

- complete record and method counts
- 84% finish rate
- two official title-fight wins
- Gaethje eligibility handling
- BMF exclusion from championship scoring
- 9-3 current prime
- two prime stoppage losses
- 6.33 active elite years
- structured loss exposure
- no mutation of live score, rank, OVR, board row, or profile row

Browser ownership capture also passed with zero browser errors and now reports one canonical record.

Runtime Scoring Snapshot passed after loading the Charles ledger, confirming the current scoring output did not move. Runtime Scoring Audit also passed.

Known unrelated existing CI debt remains:

- Picks UI Smoke: `Underdog Lock no-odds state is missing`
- Scoring Architecture Guardrails exact parity: committed runtime snapshot uses an older app-build label than current main; fighter-data scoring remains unchanged

## Remaining first-batch fighter decisions

### Benson Henderson

Keep the current placement untouched during migration. Build the complete UFC ledger, derive the true top-five total rather than displaying the generic elite count, and manually review close decisions such as Edgar II, Melendez, and Thomson.

### Vitor Belfort

Build the complete UFC-only ledger. Recalculate Opponent Quality from evidence instead of preserving 21.0. Distinguish one official UFC title-fight win from one UFC tournament win. Do not let UFC-only labeling imply the Pride Dan Henderson fight is scored.

### Deiveson Figueiredo

Build the complete UFC ledger. Correct the Song Yadong date/result/method, derive the 7-3-1 prime through Petr Yan, derive two prime stoppage losses, and correct through-prime exposure before later Loss Context recalculation.

## Unresolved cleanup outside the current fighter task

- Decide whether the Leon Edwards display override is future preparation or stale orphan data.
- Do not repair unrelated Picks CI or stale app-build snapshot debt inside the fighter-data migration unless separately requested.

## Resume instructions for a new chat

Use this prompt:

> Continue the fighter-data refactor in `codyking0602/ufc-goat-rankings`. Read `docs/FIGHTER_DATA_REFACTOR_HANDOFF.md` and `docs/fighter-data-ownership-baseline.md` first. Continue on `agent/fighter-data-phase-1` unless the handoff says it merged. Fetch the latest branch state before editing. Continue from the first unchecked Phase 1 fighter. Never add rank, total score, OVR, calculated aggregates, or hand-written snapshot stats to a canonical fighter record.

## Exact next task

Migrate **Benson Henderson** as the second complete audited canonical UFC ledger. Verify every UFC bout, title context, opponent-quality tier, prime boundary, prime rounds, loss classification, and UFC-only treatment. The Benson record must derive its factual outputs while leaving his current live score, rank, OVR, and snapshot untouched.
