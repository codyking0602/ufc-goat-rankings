# UFC Fighter Data Phase 2 Shadow Handoff

_Last updated: 2026-07-13_

## Status

Phase 2 is complete in **shadow mode** on draft PR #39.

- **73 of 73 canonical UFC-only fighter ledgers**
- **1,366 complete UFC fight rows**
- Calculated measurable profile stats for all 73 fighters
- Calculated Championship, Opponent Quality, Prime Dominance, Longevity, Apex, Penalty, total score, rank, OVR, profile values, and Compare Mode values
- Expected rank, expected total, and expected OVR locks are comparison-only and never control the calculated output
- `RANKING_DATA` and every live app value remain unchanged

## Files

- `assets/data/canonical-phase-two-shadow.js`
  - Builds the first complete calculated output from canonical ledgers.
  - Derives UFC record, title-fight wins, adjusted title wins, top-five wins, finish rate, prime record, rounds-won percentage, active elite years, prime durability, and locked loss-event classifications.
  - Produces shadow category scores, hybrid penalty, total, rank, OVR, profile stats, and Compare Mode stats.

- `assets/data/canonical-phase-two-calibration.js`
  - Applies the approved debate-ready category balance and hidden division-era evidence.
  - Reduces the Prime Dominance impact of prime upward-division elite losses while still counting them.
  - Does not punish an open prime solely for having fewer completed fights.
  - Adds a small Apex bonus for a real second-division UFC championship.
  - Never mutates live data.

- `scripts/test-canonical-phase-two-shadow.mjs`
  - Generates the full JSON/Markdown parity and ranking report.

- `scripts/test-canonical-phase-two-shape-lock.mjs`
  - Enforces the approved UFC-only ranking shape.

- `.github/workflows/canonical-phase-two-shadow.yml`
  - Runs syntax, all-73 calculation, shape locks, and artifact reporting.

## Category balance

The calibrated shadow total uses:

- Championship: **30%**
- Opponent Quality: **24%**
- Prime Dominance: **30%**
- Longevity: **16%**
- Apex: post-base bonus, capped at **6**
- Penalty: calculated hybrid aggregation of the locked loss-event rules
- Division-Era Depth: approved hidden post-base modifier; it is not restored to the fighter profile card

The locked loss-event rules remain intact. The hybrid aggregation prevents a long UFC career from being punished as if every old loss were equally important.

## Prime-context judgments

- Prime upward-division losses to champion/top-five opponents count at **79% exposure** inside Prime Dominance and use the locked reduced loss penalty.
- Open primes use full sample confidence. A current elite fighter is not automatically graded like an incomplete prospect merely because the prime is still active.
- A full second-division UFC title adds **0.50 Apex**; a vacant second-division UFC title adds **0.30 Apex**.
- Non-UFC achievements remain fully excluded.

## Locked calculated shape

### Men

1. Jon Jones
2. Georges St-Pierre
3. Demetrious Johnson
4. Anderson Silva
5. Islam Makhachev
6. Khabib Nurmagomedov
7. Alexander Volkanovski
8. Matt Hughes
9. Max Holloway
10. Kamaru Usman
11. Jose Aldo

Jon Jones remains the 99 OVR benchmark. Khabib stays in the top-six range, Volkanovski in the top-seven range, and Aldo in the UFC-only 8–11 range.

### Women

1. Amanda Nunes
2. Valentina Shevchenko
3. Zhang Weili

Nunes’ real second-division UFC championship is reflected in Apex rather than through a hand-written rank override.

## Validation

The dedicated Phase 2 workflow passes:

- 73-fighter calculation
- 1,366-fight coverage
- no live-data mutation
- no expected-rank/total/OVR score inputs
- exact Jones/GSP/DJ/Anderson top-four lock
- Islam #5, Khabib #6, Volkanovski #7
- Aldo within #8–11
- Nunes #1 and Shevchenko #2
- upward-division Volk/Islam context
- Jones 99 OVR
- active elite OVR floor protection

All existing canonical batch checks continue to run. The unrelated Picks UI Smoke failure remains separate.

## Known evidence fallback

The pinned Division-Era Depth file covers 72 of the 73 current identities. Leon Edwards currently receives a neutral `0.00` fallback in the shadow report rather than an invented value. This is disclosed in the report and does not block the canonical calculation.

## What Phase 2 does not do

Phase 2 does **not** replace the live leaderboard yet. It does not change:

- live scores
- live ranks
- live OVRs
- profile-card stats
- snapshots
- Compare Mode
- the published GitHub Pages app

The next deliberate step is live promotion: replace the legacy parity snapshot with the reviewed calculated output, then regenerate app-facing profile and comparison values from the canonical pipeline.
