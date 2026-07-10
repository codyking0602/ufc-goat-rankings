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
10. There is no single 62-fighter completeness assertion for all six categories.

## Current Safety Position

- Production `main` remains the live source of truth.
- Consolidation work belongs on `fix/unified-six-category-pipeline` until validated.
- No fighter score input should be changed during the initial architecture cleanup.
- Existing ledgers and audits are protected source data.

## Immediate Next Step

Build a non-mutating six-category integrity auditor that reports, for every fighter:

- whether each category has a current audited source
- whether the audited value reached the live row
- whether a legacy fallback remains
- whether the final formula matches the displayed total

## Definition of Success

- all leaderboard fighters covered by all six categories
- zero silent legacy fallbacks
- one final score engine
- zero category promoters writing totals or ranks
- zero score-changing timers
- scores, ranks, OVRs, profiles, categories, and Compare Mode all reading the same final rows
