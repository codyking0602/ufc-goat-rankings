# Fighter Data Refactor — Durable Handoff

Last updated: 2026-07-13
Working branch: `agent/fighter-data-phase-1`
Base commit: `f81a9a58c5c0e0aa6be2dc9e02a1c757b21c2ae6`


## Current branch state

- Draft PR: `#39 — Start canonical fighter data ownership refactor`
- Latest implementation commit before this handoff update: `dc881372ee28c529a5f852db93d8c350d044a27b`
- Branch is based on current `main` commit `f81a9a58c5c0e0aa6be2dc9e02a1c757b21c2ae6`.
- Changed files: `canonical-fighter-facts.js`, `fighter-data-ownership-audit.js`, this handoff, and two diagnostic script tags in `index.html`.
- No fighter score, rank, OVR, category value, snapshot value, or existing fighter record has been changed.

Checks completed:

- JavaScript syntax checks passed for both new modules.
- Registry smoke test accepted a complete audited record.
- Registry smoke test rejected a record containing a derived `rank` field.
- Branch comparison showed four changed files, 485 additions, zero deletions, and exactly two added lines in `index.html`.
- GitHub Actions started for Picks UI Smoke, Six-Category Runtime Audit, Runtime Scoring Snapshot, Scoring Architecture Guardrails, and Runtime Scoring Audit.

## Goal

Eliminate preventable audit errors by giving every UFC fighter fact and reviewed judgment call exactly one authoritative owner. Debatable judgment calls will remain debatable; stale records, contradictory snapshots, frozen ranks, and duplicate numeric ownership will not.

## Non-negotiable architecture

The permanent data flow is:

`canonical fighter facts + reviewed judgment calls → category calculations → modifiers → total score → calculated sort → calculated rank → calculated OVR → generated snapshot/profile`

Live runtime must never be controlled by:

- `expectedRank`
- `expectedTotalScore`
- `expectedOverallOvr`
- hand-written snapshot stats
- score/stat fields inside fighter packets or display overrides

Expected values may survive only as non-authoritative regression fixtures.

## Why this refactor exists

The July 13 scoring cleanup successfully centralized final score writing, but it did not centralize fighter facts. Current factual and numeric values can still be repeated across:

- `assets/data/ranking-data.js`
- `assets/data/canonical-scoring-records.js`
- canonical fighter registry files
- fighter packets
- display overrides
- prime records
- championship, opponent-quality, era, and loss ledgers
- profile consistency patches

The current canonical scoring file explicitly freezes parity and includes expected totals, ranks, and OVR. The scoring engine currently uses those expected values at runtime. That is migration debt, not the target architecture.

## Phase plan

### Phase 1 — Canonical fighter facts

- [x] Create a dedicated working branch from latest `main`.
- [x] Add this durable handoff file.
- [x] Add a canonical fighter-facts registry contract that forbids derived scores, rank, and OVR.
- [x] Add a read-only ownership audit that inventories duplicate/conflicting fighter facts and runtime expected-value locks.
- [ ] Capture the baseline ownership report for the full roster.
- [ ] Finalize the canonical record schema against existing championship, quality, prime, longevity, and loss ledgers.
- [ ] Migrate the first audited batch: Charles Oliveira, Benson Henderson, Vitor Belfort, and Deiveson Figueiredo.
- [ ] Make those four canonical fact records the only factual source for their generated snapshot stats.
- [ ] Expand migration in small audited batches until every fighter has one canonical fact record.

### Phase 2 — Calculate categories from evidence

- [ ] Championship from title ledger.
- [ ] Opponent Quality from fight-by-fight quality ledger.
- [ ] Prime Dominance from canonical prime window and fight metrics.
- [ ] Longevity from eligible dates and capped gaps.
- [ ] Loss Context from the canonical loss ledger and locked rules.

### Phase 3 — Presentation-only packets and overrides

- [ ] Remove all measurable stats and score fields from fighter packets.
- [ ] Remove all measurable stats and score fields from display overrides.
- [ ] Replace the old packet schema with a presentation-only schema.
- [ ] Generate snapshots from canonical facts.

### Phase 4 — Remove runtime expected-value locks

- [ ] Stop using expected total as the live total.
- [ ] Sort by calculated total.
- [ ] Assign rank from calculated order.
- [ ] Calculate OVR from calculated total.
- [ ] Keep expected values only in tests/range fixtures.

### Phase 5 — Hard deployment gate

- [ ] Add a full roster integrity audit.
- [ ] Fail deployment on factual conflicts, duplicate ownership, formula mismatch, rank mismatch, or forbidden presentation fields.
- [ ] Re-audit roster in small batches.

## Phase 1A files

### `assets/data/canonical-fighter-facts.js`

Foundation for the future single factual owner. It:

- accepts `draft`, `audited`, and `live` records
- stores UFC finish wins and derives finish rate instead of storing a second percentage
- represents active prime windows with an explicit `open` flag
- rejects duplicate fighter records
- rejects rank, OVR, total score, category score, and modifier fields
- requires a complete factual schema before a record can be marked `audited` or `live`
- does not mutate `RANKING_DATA`

It starts empty intentionally. Fighter records are added only after their complete evidence and judgment data is reconciled.

### `assets/js/fighter-data-ownership-audit.js`

Read-only baseline audit. It inventories:

- duplicated fact fields
- conflicting values across board/profile/packet/override/prime sources
- forbidden numeric ownership inside packets and display overrides
- runtime `expectedRank`, `expectedTotalScore`, and `expectedOverallOvr` locks
- canonical-fact migration coverage

It does not change scores, ranks, profiles, or snapshots.

## First migration batch decisions already identified

### Charles Oliveira

Keep current placement pending recalculation. Reconcile prime record, 84% UFC finish rate, 6.33 active elite years, and two prime stoppage losses. Official UFC title-fight wins remain two; Gaethje is not an Oliveira title win after the weight miss.

### Benson Henderson

Keep current placement pending recalculation. Correct the snapshot to use the audited top-five figure rather than the generic elite count. Manually review close-decision quality credit.

### Vitor Belfort

Recalculate Opponent Quality from fight evidence instead of preserving the current 21.0 input. Distinguish one UFC title-fight win from one UFC tournament win. UFC-only Dan Henderson labeling must not imply the Pride fight is scored.

### Deiveson Figueiredo

Correct the Song Yadong result/date/method, prime record, prime stoppage losses, and through-prime exposure count before recalculating the loss penalty.

## Session closeout rule

Every working session must update this file before stopping:

1. branch and latest commit
2. files changed
3. checks run
4. completed checklist items
5. exact next task
6. any unresolved judgment call

## Resume instructions for a new chat

Use this prompt:

> Continue the fighter-data refactor in `codyking0602/ufc-goat-rankings`. Read `docs/FIGHTER_DATA_REFACTOR_HANDOFF.md` first. Use `agent/fighter-data-phase-1` unless the handoff says it has merged. Fetch latest branch state before editing. Continue from the first unchecked Phase 1 item. Do not add rank, total score, OVR, or hand-written snapshot stats to canonical fighter facts.

## Exact next task

Run and inspect the Phase 1 ownership baseline, then finalize the canonical record schema using the existing championship, opponent-quality, prime, era/longevity, and loss ledgers. After schema confirmation, migrate Charles Oliveira as the first end-to-end fighter without changing his live score until the calculated pipeline is ready.
