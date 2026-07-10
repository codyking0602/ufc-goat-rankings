# First Settled Six-Category Runtime Audit

Generated: July 9, 2026
Workflow: `Six-Category Runtime Audit`
Runtime: Headless Chromium after all current delayed scoring timers completed
Mutation mode: Read-only

## Executive Result

- Roster fighters: 62
- Fully complete fighters: 0
- Incomplete fighters: 62
- Locked-formula mismatches: 53
- Forbidden score-derived display overrides detected: 0
- Duplicate leaderboard/profile names: 0
- Profile-to-leaderboard mismatches: 0

## Category Coverage

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 57 | 0 | 5 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

## Confirmed Formula Failure

For the 53 fighters with a merged Prime Dominance entry, the settled runtime total exactly matches the Prime promoter's incorrect raw sum:

```text
championship
+ opponentQuality
+ primeDominance
+ longevity
+ penalty
```

This calculation ignores the locked 35 / 27.5 / 27.5 / 10 weights and omits Apex Peak.

Example — Jon Jones:

```text
Current settled total:
30 + 30 + 25.86 + 30 + 0 = 115.86

Locked formula total:
30/30×35
+ 30/30×27.5
+ 25.86/30×27.5
+ 30/30×10
+ 6
+ 0
= 102.21
```

The nine fighters whose totals reconcile with the locked formula are the same nine fighters missing a merged Prime audit. The Prime promoter skips them, leaving another scoring layer's weighted calculation in place. Their formula pass does not mean their category coverage is complete.

## Missing Quality Wins Live Audits

- Chuck Liddell
- Tito Ortiz
- Dricus du Plessis
- Sean O'Malley
- Julianna Peña

Their current row values remain present, but no confirmed live Quality Wins audit reached those rows.

## Missing Merged Prime Dominance Audits

- Frankie Edgar
- T.J. Dillashaw
- Tyron Woodley
- Dricus du Plessis
- Aljamain Sterling
- Robert Whittaker
- Sean O'Malley
- Sean Strickland
- Dan Henderson

Their existing Prime values remain on the rows, but the merged audited Prime report has no entry for them.

## Apex Peak

Dricus du Plessis is the only explicit pending Apex review. The other 61 fighters have an audited Apex value reaching the live row.

## Loss Context

- 61 fighters have a Loss Context ledger/adapter entry, but none are promoted live.
- Sean O'Malley has no usable Loss Context ledger audit.
- All current live penalties are therefore legacy-backed.
- Many legacy penalties differ materially from the current adapter estimate, so the adapter must not be promoted until the underlying event coverage is reviewed fighter by fighter.

## What Is Protected and Working

The audit confirms that Cody's work was not lost:

- Championship Resume: full 62-fighter live coverage
- Longevity: full 62-fighter live coverage
- Quality Wins: 57 audited live rows preserved
- Prime Dominance: 53 audited live rows preserved
- Apex Peak: 61 completed audited rows preserved
- Fighter/profile row synchronization: intact
- No duplicate fighter names detected
- No forbidden score-derived display overrides detected in the settled runtime

## Repair Order

1. Introduce one central final score engine.
2. Stop the Prime promoter from writing `totalScore`, ranks, and OVR.
3. Stop every other category promoter from writing totals or ranks.
4. Fill the five missing Quality Wins live audits.
5. Fill the nine missing merged Prime Dominance audits.
6. Complete Dricus du Plessis Apex Peak.
7. Complete Sean O'Malley Loss Context and review all 62 loss-ledger totals before promotion.
8. Replace score-changing timers with one deterministic initialization chain.
9. Re-run this audit until all 62 fighters pass all six categories and the locked formula.

## Release Gate

Do not merge the unified pipeline into `main` until:

- 62/62 fighters have all six audited sources
- 62/62 totals match the locked formula within 0.01
- zero category promoters write totals, ranks, or OVR
- zero score-changing timers remain
- Compare Mode and division boards read the canonical final rows
