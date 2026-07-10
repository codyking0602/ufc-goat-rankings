# Current State

Updated: July 9, 2026

## Current Goal

Consolidate the six audited categories into one deterministic scoring pipeline without losing or redoing fighter inputs.

## First Settled Runtime Audit

The branch-only headless Chromium audit completed successfully after all current delayed scoring timers ran.

Results:

- 62 roster fighters
- 0 fully complete fighters
- 53 locked-formula mismatches
- 0 forbidden score-derived display overrides detected
- 0 duplicate leaderboard/profile names
- 0 profile-to-leaderboard mismatches

Category coverage:

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 57 | 0 | 5 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

Permanent findings summary:

- `docs/audits/FIRST_RUNTIME_AUDIT.md`

Workflow artifact contains the complete fighter-by-fighter JSON and Markdown reports.

## Confirmed Runtime Behavior

For all 53 fighters with a merged Prime Dominance audit, the settled runtime total equals:

```text
championship + opponentQuality + primeDominance + longevity + penalty
```

That is the Prime promoter's incorrect raw-sum formula. It bypasses the locked weights and omits Apex Peak.

Jon Jones example:

```text
Current settled total: 115.86
Locked-formula total: 102.21
```

The nine fighters whose totals currently match the locked formula are exactly the fighters missing a merged Prime audit. The Prime promoter skips those rows, so another weighted scoring layer remains in place. They are not complete.

## Preserved Category Work

The runtime audit confirms that the fighter work remains present:

- Championship Resume: 62/62 audited live rows
- Longevity: 62/62 audited live rows
- Quality Wins: 57/62 audited live rows
- Prime Dominance: 53/62 audited live rows
- Apex Peak: 61/62 completed audited rows
- Loss Context adapter: 61/62 rows, not live

## Missing Coverage

Quality Wins live audits missing:

- Chuck Liddell
- Tito Ortiz
- Dricus du Plessis
- Sean O'Malley
- Julianna Peña

Merged Prime Dominance audits missing:

- Frankie Edgar
- T.J. Dillashaw
- Tyron Woodley
- Dricus du Plessis
- Aljamain Sterling
- Robert Whittaker
- Sean O'Malley
- Sean Strickland
- Dan Henderson

Apex Peak pending:

- Dricus du Plessis

Loss Context missing:

- Sean O'Malley has no usable adapter entry
- all 62 current penalties remain legacy-backed because the live promoter is disabled

## Current Safety Position

- Production `main` remains untouched.
- Work remains on `fix/unified-six-category-pipeline`.
- Draft PR #7 exists only as the branch audit/test harness and must not be merged yet.
- No fighter category input has been changed during documentation or audit phases.
- Existing ledgers and audits remain protected source data.

## Immediate Next Step

Build the central final score engine on the safety branch and make it the only owner of:

- `totalScore`
- `rawScore`
- `weightedScoreBreakdown`
- overall rank
- score-derived OVR

Then remove total/rank/OVR mutation from the Prime promoter first and re-run the audit before modifying the other category promoters.

## Definition of Success

- 62/62 fighters covered by all six categories
- zero silent legacy fallbacks
- 62/62 totals match the locked formula within 0.01
- one final score engine
- zero category promoters writing totals or ranks
- zero score-changing timers
- scores, ranks, OVRs, profiles, category boards, division boards, and Compare Mode all read the same final rows
