# UFC Fighter Data Refactor Handoff

_Last updated: 2026-07-14_

## Branch and pull request

- Repository: `codyking0602/ufc-goat-rankings`
- Working branch: `agent/fighter-data-phase-1`
- Draft PR: #39
- Do not merge or activate a calculated live pipeline until Cody explicitly approves live promotion.

## Locked refactor doctrine

The controlling document is `docs/SCORING_REFACTOR_DOCTRINE.md`.

The permanent flow is:

`canonical UFC fight facts + explicit reviewed judgment inputs → approved category calculators → approved modifiers → calculated total → calculated sort/rank → calculated OVR → generated leaderboard/profile/Compare Mode values`

Every difference must remain classified as:

1. Factual correction
2. Recovered judgment
3. Cody-approved model change

## Completed canonical foundation

- **73 audited UFC-only fighter ledgers**
- **1,366 complete UFC fight rows**
- full current-roster coverage
- all seven scoring inputs reconstructed and traceable
- shared Fighter Era Ledger owns prime boundaries
- no live ranking or presentation mutation

Pride, Strikeforce, WEC, ONE, Bellator, PFL, boxing, and regional achievements remain excluded from main scoring.

## Approved final total formula

- Championship: **35%**
- Opponent Quality: **25%**
- Prime Dominance: **30%**
- Longevity: **10%**
- Then add locked Apex, Loss Penalty, and Division-Era Depth modifiers.

The historical 35 / 27.5 / 27.5 / 10 formula remains only as a migration-control comparison.

## Approved Prime Dominance structural rules

### Henry Cejudo

Cejudo's shared prime begins at Demetrious Johnson II and ends at the Dominick Cruz retirement win. The three-year retirement creates the phase break. Aljamain Sterling and every later fight are post-prime comeback activity.

Approved outputs:

- Prime record: **4-0**
- Prime Dominance: **22.52**
- Longevity: **4.77**
- Loss Penalty: **-1.69**

### Tournament-event compression

Same-day tournament bouts remain fully counted in prime record, round control, and finish pressure but count as one effective sample.

Elite validation is capped at:

- 1.0 unit for the final or deepest completed bout
- 0.5 unit for the semifinal or immediately preceding bout
- no automatic elite-stage volume for earlier opening rounds

Royce Gracie keeps all 12 counted prime bouts and his 11-0-1 record, but those bouts become five effective event samples. His Prime Dominance falls from 29.08 to **25.12**.

### Championship-density floor

At least four consecutive non-tournament elite/title-stage prime samples receive a minimum 90% sample multiplier. Tournament events cannot trigger the floor.

The rule currently applies to:

- Henry Cejudo
- Brock Lesnar
- Michael Bisping
- Julianna Peña

## Approved shadow ranking shape

Under the approved 35 / 25 / 30 / 10 formula:

1. Jon Jones
2. Georges St-Pierre
3. Anderson Silva
4. Demetrious Johnson
5. Islam Makhachev
6. Matt Hughes
7. Alexander Volkanovski
8. Khabib Nurmagomedov
9. Kamaru Usman
10. Max Holloway

Additional reviewed positions:

- Royce Gracie: **#31** after tournament compression
- Henry Cejudo: **#39** after the corrected prime boundary and density floor
- Amanda Nunes remains women’s #1
- Valentina Shevchenko remains women’s #2

These remain shadow ranks until OVR reconstruction and live promotion are separately approved.

## Validation status

Passed on the current PR head:

- Canonical Prime Dominance Reconstruction
- Canonical Final Score Reconstruction
- Canonical Championship Reconstruction
- Canonical Opponent Quality Reconstruction
- Canonical Longevity Reconstruction
- Canonical Loss Context Reconstruction
- Canonical Apex Reconstruction
- Canonical Division-Era Depth Reconstruction
- Scoring Architecture Guardrails
- Runtime Scoring Audit and Snapshot

The approved final-score audit reports:

- 73 complete fighters
- 0 blocked fighters
- historical formula parity: 72/72 controls
- approved formula mean absolute total delta: 2.09
- approved formula exact frozen-rank matches: 22/72
- live data unchanged

## Next required phase: OVR reconstruction

Reconstruct the front-end OVR scale before any live promotion.

Requirements:

- Jon Jones remains the **99 OVR** benchmark.
- Do not linearly expose raw totals as OVR.
- Compress the scale so elite champions and legends feel intuitive in a UFC/2K product.
- Present OVR tiers and all proposed OVRs for approval before mutating `RANKING_DATA`.

## Safety

- PR #39 remains draft.
- The published app has not changed.
- No live score, rank, OVR, profile, or Compare Mode value has changed.
- Do not merge or promote live without Cody's explicit approval.
