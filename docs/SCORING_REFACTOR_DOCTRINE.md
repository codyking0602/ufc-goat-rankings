# UFC GOAT Scoring Refactor Doctrine

_Last locked by Cody: 2026-07-14_

## Non-negotiable goal

The refactor exists to **preserve the approved UFC GOAT model while making every score traceable, reproducible, and owned in one place**.

It is not permission to silently redesign categories, replace approved judgment rules, or calibrate the board into a new shape.

The intended end state is:

`canonical UFC fight facts + explicit reviewed judgment inputs → approved category calculators → approved modifiers → calculated total → calculated sort/rank → calculated OVR → generated leaderboard/profile/Compare Mode values`

## What must be preserved

The current approved scoring philosophy remains the control model unless Cody explicitly approves a change.

That includes the substance of:

- Championship
- Opponent Quality
- Prime Dominance
- Longevity
- Apex
- Loss Penalty
- Division-Era Depth
- existing category influence weights until separately approved

A cleanup may change architecture, file ownership, and provenance. It may not change scoring philosophy by implication.

## Required three-layer separation

### 1. Canonical fight facts

Each fighter has one complete UFC-only ledger containing facts and reviewed classifications:

- opponent, date, event, result, method, division
- rounds won/lost/drawn
- title context
- prime phase
- opponent tier/status
- loss context
- no-contest and technical-result treatment

This layer must not own final category scores, total score, rank, or OVR.

### 2. Explicit judgment inputs

Judgment-based scoring inputs must be stored transparently rather than hidden in patches, unexplained aggregate scores, or display files.

Examples:

- title-fight base value
- title-opponent strength
- title-era/context discount
- opponent-quality tier and partial credit
- division-strength multiplier
- prime-window boundary
- loss classification and special rule

For Championship specifically, a title win must preserve the approved idea that its value can be discounted by opponent strength, era/title environment, and unusual context. A generic `adjusted title wins × 2` calculation is not an acceptable replacement unless Cody explicitly approves that model change.

### 3. One scoring engine

One scoring engine must own the approved calculators:

- `calculateChampionship()`
- `calculateOpponentQuality()`
- `calculatePrimeDominance()`
- `calculateLongevity()`
- `calculateApex()`
- `calculateLossPenalty()`
- `calculateEraDepthAdjustment()`

The engine then calculates total score, sort order, rank, and OVR, and supplies the same measurable values to leaderboard, profiles, snapshots, games, and Compare Mode.

## Proper role of the current parity snapshot

`expectedRank`, `expectedTotalScore`, and `expectedOverallOvr` are temporary migration controls and audit references only.

During reconstruction they answer:

> Does the clean calculator reproduce the previously approved result?

They must not remain the final authority after the approved logic has been faithfully reconstructed.

Removing the locks alone is not a scoring change. Replacing the inputs or category construction is a scoring change.

## Required migration process, category by category

For every category:

1. Document the current approved philosophy.
2. Locate the old calculations and all hidden/manual judgment inputs.
3. Move those inputs into the canonical structure.
4. Build one clean calculator that reproduces the approved category as closely as possible.
5. Compare all 73 fighters against the approved snapshot.
6. Investigate every meaningful difference.
7. Classify each difference as:
   - **Factual correction** — the old fight/stat input was wrong or missing.
   - **Recovered judgment** — the old logic was right but hidden or fragmented.
   - **Proposed model change** — the philosophy or formula would change and requires Cody’s explicit approval.

Nothing may silently enter the third category.

## Example: Randy Couture Championship

Randy’s approved Championship score of 15.85 reflects more than counting title wins. His title fights include base title values plus opponent/title-strength and era/context discounts.

The clean model should reproduce the result from transparent fight-level inputs, for example:

`base title value × title-opponent strength × approved context adjustment = final title credit`

Then:

`sum of adjusted title credits → Championship category score`

The goal is not to hard-code 15.85 forever. The goal is for 15.85, or any deliberately corrected value, to emerge from visible approved inputs.

## What should disappear by the end

- multiple files mutating the same score
- score-changing patches
- category values stored in display overrides
- hand-maintained aggregate profile stats
- ranks/OVRs manually injected into fighter packets
- unexplained frozen totals as the permanent source of truth
- silent formula redesign during architecture cleanup

## What a proper correction looks like

A single corrected fight-level field should automatically flow through every dependent output.

Example: changing a win from `top-ten` to `top-five` should update:

- top-five win count
- Opponent Quality
- total score
- rank
- OVR
- profile
- Compare Mode
- audit report

No second patch or manual rank edit should be required.

## Status of the current Phase 2 shadow

The current Phase 2 shadow is a useful diagnostic prototype, but its category formulas and calibration are **not approved as replacements** for the existing model.

It may be used to:

- validate the 73 canonical ledgers
- expose missing provenance
- compare alternative formulas
- identify factual conflicts

It must not be promoted live until each category has been reconstructed under this doctrine and Cody has approved any genuine model changes.

## Final standard

The finished app should combine:

- the sophistication and judgment of the approved model
- the accuracy of the audited UFC-only ledgers
- a clean one-owner architecture
- a visible path from each fight to each category to final rank

Future work must default to preserving the approved model. Any proposed scoring change must be presented separately, explained, compared across all 73 fighters, and explicitly approved by Cody before implementation or live promotion.
