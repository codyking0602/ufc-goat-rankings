# Runtime Audit Status

Latest completed checkpoints:

- `FOURTEENTH_RUNTIME_AUDIT_APEX_COMPLETE.md`
- `FIFTEENTH_EFFECTIVE_WEIGHT_AUDIT.md`
- `SIXTEENTH_RUNTIME_AUDIT_APEX_COMPONENTS_COMPLETE.md`
- `SEVENTEENTH_PRIME_FIXED_ANCHOR_SIMULATION.md`
- `EIGHTEENTH_CHAMPIONSHIP_FIXED_BENCHMARK.md`
- `NINETEENTH_CHAMPIONSHIP_ANCHOR_REVIEW.md`
- `TWENTIETH_QUALITY_WINS_ANCHOR_REVIEW.md`

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

- Prime Dominance remains unchanged pending its semantic-anchor review. Two earlier fixed-anchor alternatives were rejected because they created significant fighter movement without restoring Prime close to its nominal 27.5% effective influence, and they over-concentrated future-roster separation in Elite Stakes.
- Championship diminishing-return alternatives were rejected because they increased effective Championship separation and moved 25–29 fighters.
- Championship uses a locked 14.54 adjusted-title-credit benchmark rather than the current roster leader. This preserves every current score and makes the category stable when future fighters are added.
- The Championship anchor review found that a champion-forward curve best matches the intended category meanings, but it remains shadow-only because it raises Championship's measured influence and cannot be finalized before the other positive categories receive the same semantic-anchor review.
- Quality Wins already aligns cleanly with its proposed 0–30 accomplishment meanings. Its accepted fixed anchors are 2.35 credit = 5, 4.70 = 10, 7.05 = 15, 9.40 = 20, 11.75 = 25, and 14.10 = 30.
- Quality Wins now uses a locked 14.10 diminished-credit benchmark rather than the current roster leader. The change caused zero current score, total, rank, or OVR movement and keeps Quality's measured all-roster influence at 26.13% versus its 27.5% formula weight.
- Lower/middle-friendly and elite-gated Quality curves were rejected because they created movement without improving the category's meaning or overall balance.
- Effective-weight results are treated as descriptive monitoring, not a command to force uniform score distributions across an elite-selected roster.

Next scoring phase:

1. Build the Prime Dominance semantic-anchor review using the same 0–30 accomplishment framework.
2. Separate total-score meaning from internal Prime component calibration and identify real-fighter examples at each score level.
3. Review Longevity semantic anchors after Prime.
4. Run a full category-balance simulation after Championship, Quality Wins, Prime Dominance, and Longevity all have accepted or provisional semantic anchor scales.
5. Finalize Loss Context only after the positive scoring model is approved.

The generated simulation and audit reports do not mutate scores unless a separately approved live implementation is committed.
