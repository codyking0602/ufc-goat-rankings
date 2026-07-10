# Runtime Audit Status

Latest completed checkpoints:

- `FOURTEENTH_RUNTIME_AUDIT_APEX_COMPLETE.md`
- `FIFTEENTH_EFFECTIVE_WEIGHT_AUDIT.md`

Current validated coverage:

- Championship Resume: 62/62
- Quality Wins: 62/62
- Prime Dominance: 62/62
- Longevity: 62/62
- Apex Peak: 62/62
- Loss Context: QA-only; not promoted live

Latest runtime gates:

- formula mismatches: 0
- overall-score ownership: PASS
- deterministic initialization: PASS
- final score engine applies: 1
- profile/leaderboard mismatches: 0
- forbidden score-derived overrides: 0

All five positive categories are fully audited for the current 62-fighter roster.

The read-only effective-weight audit found that Championship Resume currently separates the roster more than its declared 35% weight, while Prime Dominance is materially compressed relative to its declared 27.5% weight. Quality Wins is close to target and Longevity is slightly stronger than its stated 10% weight.

Before Loss Context is finalized:

1. Add new-rubric Apex component rows for Merab Dvalishvili and Zhang Weili.
2. Review Prime component scaling and Championship normalization.
3. Rerun the effective-weight audit after any accepted calibration changes.

The generated JSON and Markdown reports are read-only and do not change fighter data, category values, ranks, or OVRs.
