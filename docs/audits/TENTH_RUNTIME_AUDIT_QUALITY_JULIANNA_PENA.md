# Tenth Runtime Audit — Quality Wins: Julianna Peña

Generated: July 10, 2026

Workflow: `Six-Category Runtime Audit`

Runtime: Headless Chromium using the deterministic single-pass scoring pipeline

## Approved UFC Quality Wins Ledger

- Amanda Nunes I — 1.25
- Raquel Pennington — 0.85
- Cat Zingano — 0.85
- Sara McMann — 0.65
- Jessica Eye — 0.65
- Nicco Montaño — 0.45
- Milana Dudieva — 0.25
- Jessica Rakoczy — 0.10

The non-canonical `Julianna Pena` ledger key was removed and replaced with the canonical app name `Julianna Peña`.

No Championship Resume, Prime Dominance, Longevity, Apex Peak, or Loss Context input was changed.

## Deterministic Loader Fix

Adding the final Quality Wins ledger exposed a race where the Quality Wins writer could finish after the final score engine loaded and trigger a second engine apply.

The fix:

- creates an explicit `UFC_OPPONENT_QUALITY_READY` promise in the central scoring pipeline
- waits for Quality Wins to finish before Prime, Longevity, Apex Peak, and final scoring
- removes the Quality Wins writer's fallback final-engine call
- preserves the runtime audit console log even when a gate fails

The clean checkpoint returned the final engine to exactly one apply.

## Runtime Result

- Roster fighters checked: 62
- Quality Wins coverage before: 61 pass, 1 fail
- Quality Wins coverage after: 62 pass, 0 fail
- Formula mismatches: 0
- Profile-to-leaderboard mismatches: 0
- Duplicate leaderboard/profile names: 0
- Forbidden score-derived display overrides: 0
- Overall-score ownership gate: PASS
- Deterministic-initialization gate: PASS
- Final score engine applies: 1

## Julianna Peña Result

```text
Quality Wins: 4.45 legacy fallback → 10.55 audited live
Quality Wins rank: #13 among women
Overall score: 24.60 → 30.19
Overall rank: #14 women → #11 women
```

The movement comes entirely from replacing the stale Quality Wins fallback with the approved eight-win UFC ledger.

## Category Coverage After This Batch

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 62 | 0 | 0 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

Quality Wins is now complete for the full 62-fighter roster.

## Next Phase

Complete the nine missing Prime Dominance audits in small, reviewed batches before changing any live Prime values.
