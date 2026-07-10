# Runtime Audit Status

Latest completed checkpoints:

- `FOURTEENTH_RUNTIME_AUDIT_APEX_COMPLETE.md`
- `FIFTEENTH_EFFECTIVE_WEIGHT_AUDIT.md`
- `SIXTEENTH_RUNTIME_AUDIT_APEX_COMPONENTS_COMPLETE.md`
- `SEVENTEENTH_PRIME_FIXED_ANCHOR_SIMULATION.md`
- `EIGHTEENTH_CHAMPIONSHIP_FIXED_BENCHMARK.md`

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
- Effective-weight results are treated as descriptive monitoring, not a command to force uniform score distributions across an elite-selected roster.

Next scoring phase:

1. Validate the Loss Context ledger against all 62 fighters.
2. Resolve the current Sean O'Malley Loss Context failure and remaining warnings.
3. Review major judgment calls and ranking movement before promoting Loss Context live.
4. Run the complete deterministic audit after promotion.

The generated simulation and audit reports do not mutate scores unless a separately approved live implementation is committed.
