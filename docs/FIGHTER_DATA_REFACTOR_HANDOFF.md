# UFC Fighter Data Refactor Handoff

_Last updated: 2026-07-13_

## Branch and pull request

- Repository: `codyking0602/ufc-goat-rankings`
- Working branch: `agent/fighter-data-phase-1`
- Draft PR: #39
- Do not merge or activate the calculated live pipeline until Cody explicitly approves live promotion.

## Permanent ownership architecture

The permanent flow is:

`canonical UFC fight ledger + reviewed classifications → calculated categories → modifiers → calculated total → calculated sort → calculated rank → calculated OVR → generated snapshot/profile/Compare Mode`

Live results must never be controlled by:

- `expectedRank`
- `expectedTotalScore`
- `expectedOverallOvr`
- hand-written aggregate snapshot values
- measurable fighter facts stored in presentation files
- hand-written category scores stored in fighter packets or display overrides

## Phase 1 complete

The canonical registry now contains:

- **73 audited UFC-only fighter ledgers**
- **1,366 complete UFC fight rows**
- **100% of the current 73-fighter roster**
- no deliberate live ranking or presentation mutations

Every ledger is UFC-only. Pride, Strikeforce, WEC, ONE, Bellator, PFL, boxing, and regional achievements are excluded from scoring. No contests remain stored as official results and excluded from scoring.

The final fifteen-fighter batch is the full women’s roster:

1. Amanda Nunes
2. Valentina Shevchenko
3. Zhang Weili
4. Rose Namajunas
5. Miesha Tate
6. Mackenzie Dern
7. Kayla Harrison
8. Jessica Andrade
9. Alexa Grasso
10. Julianna Peña
11. Carla Esparza
12. Holly Holm
13. Joanna Jedrzejczyk
14. Ronda Rousey
15. Cris Cyborg

## Phase 2 shadow complete

Phase 2 now calculates all measurable stats and scoring outputs from the 73 canonical ledgers without changing the live app.

Primary files:

- `assets/data/canonical-phase-two-shadow.js`
- `assets/data/canonical-phase-two-calibration.js`
- `scripts/test-canonical-phase-two-shadow.mjs`
- `scripts/test-canonical-phase-two-shape-lock.mjs`
- `.github/workflows/canonical-phase-two-shadow.yml`
- `docs/PHASE_TWO_SHADOW_HANDOFF.md`

Calculated outputs include:

- UFC record
- UFC title-fight wins
- adjusted title wins
- top-five wins
- finish percentage
- prime record
- rounds-won percentage
- active elite years
- prime durability
- Championship
- Opponent Quality
- Prime Dominance
- Longevity
- Apex
- Penalty
- total score
- calculated rank
- app-facing OVR
- generated profile and Compare Mode stats

The legacy canonical scoring snapshot is comparison-only. Expected ranks, totals, and OVRs do not control the calculated output.

## Phase 2 calibrated balance

- Championship: **30%**
- Opponent Quality: **24%**
- Prime Dominance: **30%**
- Longevity: **16%**
- Apex: post-base bonus capped at 6
- Penalty: hybrid aggregation of locked loss-event penalties
- Division-Era Depth: approved hidden post-base modifier; not displayed on the fighter profile card

Prime upward-division elite losses count at 79% exposure inside Prime Dominance and receive the locked reduced penalty. Open prime windows use full confidence rather than being punished solely for incomplete career length. A full second-division UFC title receives a 0.50 Apex bonus; a vacant second-division UFC title receives 0.30.

## Locked shadow ranking shape

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

### Women

1. Amanda Nunes
2. Valentina Shevchenko
3. Zhang Weili

Jones remains the 99 OVR benchmark. Khabib remains top six, Volkanovski top seven, and Aldo stays within the intended UFC-only 8–11 range.

## Validation

The Phase 2 workflow verifies:

1. 73 calculated fighters and 1,366 UFC fight rows.
2. Exact canonical roster and registry audit success.
3. No mutation of live ranking/profile/OVR/snapshot/Compare Mode data.
4. No expected-rank, expected-total, or expected-OVR inputs.
5. Exact top-four shape and the approved Islam/Khabib/Volkanovski/Aldo ranges.
6. Amanda Nunes #1 and Valentina Shevchenko #2.
7. Volk’s Islam losses receive upward-division elite context in both penalty and Prime Dominance exposure.
8. Jones remains 99 OVR.
9. Strong active elites avoid embarrassing front-end OVRs.
10. The full shadow report is uploaded as a workflow artifact.

The existing canonical, ownership, runtime scoring, six-category, and architecture workflows remain required. The unrelated Picks UI Smoke failure remains separate.

## Known evidence fallback

The pinned Division-Era Depth evidence currently covers 72 of 73 identities. Leon Edwards receives a neutral 0.00 fallback rather than an invented value. The missing evidence identity is disclosed in every Phase 2 report.

## Current safety state

Phase 1 and Phase 2 are complete, but Phase 2 is still shadow-only. The published app has not changed.

The next deliberate phase is live promotion:

1. Replace the legacy parity snapshot as score authority.
2. Write calculated category scores, total, rank, and OVR to the live runtime.
3. Generate profile and Compare Mode measurable values from the canonical output.
4. Run full browser and ranking-diff review.
5. Merge only after Cody explicitly approves the live calculated board.
