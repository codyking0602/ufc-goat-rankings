# Current State

Updated: July 9, 2026

## Current Goal

Consolidate the six audited categories into one deterministic scoring pipeline without losing or redoing fighter inputs.

## Live Category Status

| Category | Current source | Current status |
|---|---|---|
| Championship Resume | Championship title-win ledger and live layer | Live category value; promoter also recalculates totals |
| Quality Wins | Opponent-quality ledger, calibrations, shadow audit, live layer | Live category value; promoter also recalculates totals |
| Prime Dominance | Round-control audit, base ledger, shadow-model extensions, live promoter | Live for merged-report fighters; promoter uses an incorrect unweighted total formula |
| Longevity | Fighter Era Ledger, shadow scorer, live promoter | Live native `/30`; promoter recalculates total without Apex |
| Apex Peak | Locked fighter audits and live bonus promoter | Live positive modifier; currently acts as final total repair layer |
| Loss Context | Fighter Era Ledger and adapter | Ledger is QA-only; live promoter is disabled; existing row penalties remain live |

## Confirmed Integration Problems

1. Multiple category promoters write `totalScore`.
2. Those promoters do not all use the same formula.
3. Prime Dominance currently uses a raw unweighted category sum when it recalculates totals.
4. Championship, Quality Wins, and Longevity total calculations omit Apex Peak.
5. Apex Peak currently performs the most complete final calculation and repairs earlier totals.
6. Score-changing modules are reapplied on delayed timers.
7. Display overrides and promoters still contain score-derived ranks and OVR values.
8. Loss Context's audited ledger is not promoted live.
9. Legacy values in `ranking-data.js` can temporarily appear before live layers finish.
10. There is no single 62-fighter completeness assertion for all six categories in production.

## Safety Branch Progress

Protected branch: `fix/unified-six-category-pipeline`

Completed without changing fighter inputs or production behavior:

- project architecture documented
- current integration state documented
- consolidation roadmap documented
- open issue tracker created
- permanent changelog created
- read-only six-category integrity engine added at `assets/data/six-category-integrity-audit.js`
- standalone diagnostic dashboard added at `audit.html`

The auditor checks every leaderboard fighter for:

- Championship Resume live audit and row match
- Quality Wins live audit and row match
- Prime Dominance merged-report audit and row match
- native `/30` Longevity audit and row match
- completed Apex Peak audit and row match
- Loss Context ledger/live status
- exact locked-formula reconciliation
- leaderboard/profile mismatches
- duplicate fighter rows
- forbidden score-derived fields inside display overrides

The auditor is read-only. It exposes `window.UFC_SIX_CATEGORY_INTEGRITY_AUDIT` and does not mutate scores, ranks, OVRs, ledgers, or display data.

## Current Safety Position

- Production `main` remains the live source of truth.
- Consolidation work stays on `fix/unified-six-category-pipeline` until validated.
- No fighter score input has been changed during the architecture or audit-tooling phases.
- Existing ledgers and audits remain protected source data.
- The diagnostic dashboard is isolated from normal app loading.

## Immediate Next Step

Run the standalone audit dashboard against the fully settled scoring runtime and capture the first complete report.

The report must identify, fighter by fighter:

- pass, warning, or failure for each of the six categories
- legacy-backed values
- audit-to-row mismatches
- formula mismatches
- profile/leaderboard mismatches
- score-derived display overrides

After that report is reviewed, build the central final score engine. Do not change category inputs while resolving integration failures.

## Definition of Success

- all leaderboard fighters covered by all six categories
- zero silent legacy fallbacks
- one final score engine
- zero category promoters writing totals or ranks
- zero score-changing timers
- scores, ranks, OVRs, profiles, categories, and Compare Mode all reading the same final rows
