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
- `TWENTY_THIRD_FOUR_CATEGORY_BALANCE_SIMULATION.md`
- `TWENTY_FOURTH_LAUNCH_READINESS_LOSS_CONTEXT.md`

Current validated coverage:

- Championship Resume: 62/62 pass
- Quality Wins: 62/62 pass
- Prime Dominance: 62/62 pass
- Longevity: 62/62 pass
- Apex Peak: 62/62 pass
- Loss Context: 62/62 pass
- Apex new-rubric component rows: 62/62

Latest runtime gates:

- fully complete fighters: 62
- incomplete fighters: 0
- formula mismatches: 0
- overall-score ownership: PASS
- deterministic initialization: PASS
- final score engine applies: 1
- profile/leaderboard mismatches: 0
- forbidden score-derived overrides: 0
- duplicate board names: 0
- duplicate profile names: 0

All six categories are now launch-audited for the current 62-fighter roster.

Final scoring decisions:

- Keep the live formula weights at 35 Championship / 27.5 Quality / 27.5 Prime / 10 Longevity.
- Championship keeps the locked 14.54-credit linear benchmark for launch. The champion-forward curve remains shadow-only and is not a launch blocker.
- Quality Wins keeps its accepted locked 14.10-credit linear benchmark.
- Prime Dominance keeps the direct four-component /30 sum: Prime Record /9, Round Control /8, Finish Pressure /5, Elite Stakes /8.
- Longevity keeps the locked 120-counted-month linear benchmark and 18-month default gap cap.
- Apex Peak remains a positive bonus added after the 100-point base.
- Loss Context remains a negative term after the base. The current reviewed penalty values are the locked launch source; the partial event ledger remains supporting QA only.
- Exact effective-weight matching is rejected as current-roster overfitting.
- A lower/middle-tier calibration sample is optional future work, not a launch requirement.

Launch status:

- scoring code: ready;
- runtime audit: pass;
- current scores and ranks preserved by the Loss Context launch promotion;
- PR #7 may be merged into `main` after explicit approval.

GitHub Pages should continue using `main` as the live source of truth after merge.