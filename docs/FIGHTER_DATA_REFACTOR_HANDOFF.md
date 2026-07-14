# UFC Fighter Data Refactor Handoff

_Last updated: 2026-07-14_

## Branch and pull request

- Repository: `codyking0602/ufc-goat-rankings`
- Working branch: `agent/fighter-data-phase-1`
- Draft PR: #39
- Do not merge or activate a calculated live pipeline until Cody explicitly approves live promotion.

## Locked refactor doctrine

The controlling document is `docs/SCORING_REFACTOR_DOCTRINE.md`.

The non-negotiable goal is:

> Preserve the approved UFC GOAT scoring model while making every score traceable, reproducible, and owned in one place.

Architecture cleanup is not permission to silently redesign categories, category weights, fight values, modifiers, or ranking shape.

The permanent flow should be:

`canonical UFC fight facts + explicit reviewed judgment inputs → approved category calculators → approved modifiers → calculated total → calculated sort/rank → calculated OVR → generated leaderboard/profile/Compare Mode values`

Every difference found during reconstruction must be classified as:

1. **Factual correction** — a fight, result, round, or stat was wrong or missing.
2. **Recovered judgment** — approved logic existed but was hidden, fragmented, or frozen only as an aggregate result.
3. **Proposed model change** — the scoring philosophy or formula would change and requires Cody’s explicit approval.

Nothing may silently enter the third category.

## Permanent ownership architecture

### Canonical fight ledger

Owns:

- complete UFC-only fight facts
- title context
- opponent tier/status
- prime phase
- rounds
- loss context
- division context
- no-contest and technical-result treatment

Must not own:

- category scores
- total score
- rank
- OVR

### Explicit judgment inputs

Approved judgment decisions must be stored transparently at the fighter or fight level rather than hidden in patches or final aggregate scores.

Examples:

- title base value
- title-opponent strength
- title-era/context discount
- opponent-quality partial credit
- division-strength multiplier
- prime-window boundary
- loss-rule classification

### Single scoring engine

One engine should own the approved calculations for:

- Championship
- Opponent Quality
- Prime Dominance
- Longevity
- Apex
- Loss Penalty
- Division-Era Depth
- total score
- calculated sort and rank
- OVR

The same output must feed leaderboard, profiles, games, snapshots, and Compare Mode.

### Presentation layer

`display-overrides.js` and other presentation files may own photos, copy, watch links, and visual polish only. They must not own scores, ranks, OVRs, or measurable fighter facts.

## Proper role of parity locks

These are migration controls and audit references only:

- `expectedRank`
- `expectedTotalScore`
- `expectedOverallOvr`

They answer whether a reconstructed clean calculator reproduces the previously approved board. They must not remain the permanent live authority after the approved scoring logic is faithfully reconstructed.

Removing the locks alone is not a scoring change. Replacing category inputs or category construction is a scoring change.

## Phase 1 complete

The canonical registry contains:

- **73 audited UFC-only fighter ledgers**
- **1,366 complete UFC fight rows**
- **100% of the current roster**
- no deliberate live ranking or presentation mutations

Every ledger is UFC-only. Pride, Strikeforce, WEC, ONE, Bellator, PFL, boxing, and regional achievements are excluded from scoring. No contests remain stored as official results and excluded from scored results.

Phase 1 is the factual foundation and remains useful.

## Current Phase 2 status

Phase 2 successfully proved that all 73 ledgers can generate measurable stats, categories, totals, ranks, OVRs, profile values, and Compare Mode values without mutating the live app.

Primary files:

- `assets/data/canonical-phase-two-shadow.js`
- `assets/data/canonical-phase-two-calibration.js`
- `scripts/test-canonical-phase-two-shadow.mjs`
- `scripts/test-canonical-phase-two-shape-lock.mjs`
- `.github/workflows/canonical-phase-two-shadow.yml`
- `docs/PHASE_TWO_SHADOW_HANDOFF.md`
- `docs/PHASE_TWO_BOARD_REVIEW.md`

However, the Phase 2 category formulas and calibration are now classified as a **diagnostic prototype**, not an approved replacement model.

The prototype introduced genuine scoring changes, including simplified category construction and new weighting/calibration choices, without first reconstructing the approved category logic. It must not be promoted live as-is.

It may still be used to:

- validate canonical ledgers
- expose missing provenance
- compare formulas
- identify factual conflicts
- test one-owner architecture

## Championship reconstruction warning

The approved Championship model values more than title-win count. Individual title wins may be discounted by:

- title type
- opponent difficulty
- era/title-environment strength
- unusual title context

For example, Randy Couture’s approved 15.85 Championship score reflects title-level strength adjustments. The Phase 2 shortcut of effectively summing full title-type credits and multiplying by two is not a faithful reconstruction.

The clean Championship calculator must preserve the approved fight-level judgment logic and make each title win traceable.

## Required next phase: category reconstruction

Proceed one category at a time.

For each category:

1. Document the approved philosophy.
2. Locate the old calculations and hidden/manual judgment inputs.
3. Move the approved inputs into the canonical structure.
4. Build one clean calculator that reproduces the approved category as closely as possible.
5. Compare all 73 fighters against the approved snapshot.
6. Investigate every meaningful difference.
7. Present any proposed model change separately for Cody’s approval.

Recommended order:

1. Championship
2. Opponent Quality
3. Prime Dominance
4. Longevity
5. Loss Penalty
6. Apex
7. Division-Era Depth
8. final weights, rank, and OVR

## Validation standard

A completed category reconstruction must provide:

- all 73 fighters
- current approved value
- reconstructed value
- delta
- explanation for each meaningful delta
- classification as factual correction, recovered judgment, or proposed model change
- no live-data mutation

No category should be promoted until its meaningful differences are understood and approved.

## Current safety state

- Phase 1 ledgers are complete.
- Phase 2 remains shadow-only.
- The published app has not changed.
- PR #39 remains draft.
- The current Phase 2 ranking board is not approved for live promotion.
- The next task is faithful category reconstruction under `docs/SCORING_REFACTOR_DOCTRINE.md`.
