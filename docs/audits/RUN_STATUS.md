# Runtime Audit Status

Latest completed checkpoints:

- `FOURTEENTH_RUNTIME_AUDIT_APEX_COMPLETE.md`
- `FIFTEENTH_EFFECTIVE_WEIGHT_AUDIT.md`
- `SIXTEENTH_RUNTIME_AUDIT_APEX_COMPONENTS_COMPLETE.md`
- `SEVENTEENTH_PRIME_FIXED_ANCHOR_SIMULATION.md`
- `EIGHTEENTH_CHAMPIONSHIP_FIXED_BENCHMARK.md`
- `NINETEENTH_CHAMPIONSHIP_ANCHOR_REVIEW.md`
- `TWENTIETH_QUALITY_WINS_ANCHOR_REVIEW.md`
- `TWENTY_FIRST_PRIME_DOMINANCE_ANCHOR_REVIEW.md`
- `TWENTY_SECOND_LONGEVITY_ANCHOR_REVIEW.md`

Current validated coverage:

- Championship Resume: 62/62
- Quality Wins: 62/62
- Prime Dominance: 62/62
- Longevity: 62/62
- Apex Peak: 62/62
- Apex new-rubric component rows: 62/62
- Loss Context: QA-only; not promoted live

Latest runtime gates:

- formula mismatches: 0
- overall-score ownership: PASS
- deterministic initialization: PASS
- final score engine applies: 1
- profile/leaderboard mismatches: 0
- forbidden score-derived overrides: 0

All five positive categories and all Apex component rows are fully audited for the current 62-fighter roster.

Calibration decisions:

- Championship uses a locked 14.54 adjusted-title-credit benchmark rather than the current roster leader. This preserves every current score and makes the category stable when future fighters are added.
- The Championship anchor review found that a champion-forward curve best matches the intended category meanings, but it remains shadow-only because it raises Championship's measured influence and must be judged inside the full four-category model.
- Quality Wins aligns cleanly with its 0–30 accomplishment meanings. Its accepted fixed anchors are 2.35 credit = 5, 4.70 = 10, 7.05 = 15, 9.40 = 20, 11.75 = 25, and 14.10 = 30.
- Quality Wins uses a locked 14.10 diminished-credit benchmark rather than the current roster leader. The change caused zero current score, total, rank, or OVR movement and keeps Quality's measured all-roster influence at 26.13% versus its 27.5% formula weight.
- Prime Dominance's current direct four-component sum is accepted as its semantic anchor scale. The component maximums remain Prime Record /9, Round Control /8, Finish Pressure /5, and Elite Stakes /8.
- Prime remapping candidates were rejected. The full-spread option raised all-roster Prime influence from 17.99% to 23.60% but moved 35 board positions, reduced several legitimate elite primes by roughly three to four points, and still raised top-30 Prime influence only to 18.01%.
- Longevity's current 120-month linear scale is accepted as its semantic anchor scale. The permanent anchors are 20 months = 5, 40 = 10, 60 = 15, 80 = 20, 100 = 25, and 120 = 30.
- Longevity alternatives were rejected. The earlier-recognition option inflated many short and middle elite windows, the compressed-middle option moved 17 positions for a small influence change, and the historically gated option increased Longevity influence while cutting legitimate six-to-seven-year elite runs.
- Longevity's measured all-roster influence of 12.37% is accepted provisionally against its 10% formula weight.
- Effective-weight results are treated as descriptive monitoring, not a command to force uniform score distributions across an elite-selected roster.

Anchor framework status:

- Championship Resume: provisional champion-forward semantic curve; current fixed linear formula remains live.
- Quality Wins: accepted fixed linear semantic scale.
- Prime Dominance: accepted direct component semantic scale.
- Longevity: accepted fixed linear semantic scale.

Next scoring phase:

1. Run the full four-category balance simulation using all accepted/provisional semantic scales.
2. Compare current formula weights, scale-adjusted categories, weight-adjusted formulas, and a hybrid option.
3. Review all fighter movements, with separate all-62 and top-30 GOAT-tier results.
4. Decide whether Championship's provisional curve should become final and whether headline formula weights need revision.
5. Finalize Loss Context only after the positive scoring model is approved.

The generated simulation and audit reports do not mutate scores unless a separately approved live implementation is committed.
