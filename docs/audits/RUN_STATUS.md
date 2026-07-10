# Runtime Audit Status

Latest completed checkpoints:

- `FOURTEENTH_RUNTIME_AUDIT_APEX_COMPLETE.md`
- `FIFTEENTH_EFFECTIVE_WEIGHT_AUDIT.md`
- `SIXTEENTH_RUNTIME_AUDIT_APEX_COMPONENTS_COMPLETE.md`
- `SEVENTEENTH_PRIME_FIXED_ANCHOR_SIMULATION.md`
- `EIGHTEENTH_CHAMPIONSHIP_FIXED_BENCHMARK.md`
- `NINETEENTH_CHAMPIONSHIP_ANCHOR_REVIEW.md`

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

- Prime Dominance remains unchanged. Two fixed-anchor alternatives were rejected because they created significant fighter movement without restoring Prime close to its nominal 27.5% effective influence, and they over-concentrated future-roster separation in Elite Stakes.
- Championship diminishing-return alternatives were rejected because they increased effective Championship separation and moved 25–29 fighters.
- Championship now uses a locked 14.54 adjusted-title-credit benchmark rather than the current roster leader. This preserves every current score and makes the category stable when future fighters are added.
- The Championship anchor review found that a champion-forward curve best matches the intended category meanings, but it remains shadow-only because it raises Championship's measured influence and cannot be finalized before the other positive categories receive the same semantic-anchor review.
- Effective-weight results are treated as descriptive monitoring, not a command to force uniform score distributions across an elite-selected roster.

Next scoring phase:

1. Build the Quality Wins anchor review using the same 0–30 accomplishment framework.
2. Identify real-fighter examples for each Quality Wins score level and flag weak lower-tier coverage.
3. Compare fixed candidate curves without changing the live formula.
4. Repeat for Prime Dominance and Longevity.
5. Run a full category-balance simulation after all four base categories have provisional semantic anchor scales.
6. Finalize Loss Context only after the positive scoring model is approved.

The generated simulation and audit reports do not mutate scores unless a separately approved live implementation is committed.
