# Ninth Runtime Audit — Quality Wins: Dricus du Plessis and Sean O'Malley

Generated: July 10, 2026

Workflow: `Six-Category Runtime Audit`

Runtime: Headless Chromium using the deterministic single-pass scoring pipeline

## Approved Changes

### Dricus du Plessis

Canonical fighter name normalized from `Dricus Du Plessis` to `Dricus du Plessis`.

Approved UFC Quality Wins ledger:

- Israel Adesanya — 1.25
- Sean Strickland I — 1.25
- Robert Whittaker — 1.00
- Sean Strickland II — 1.00
- Derek Brunson — 0.85
- Darren Till — 0.65
- Brad Tavares — 0.65
- Trevin Giles — 0.45
- Markus Perez — 0.25

Robert Whittaker was explicitly approved at 1.00 rather than 1.25. The second Sean Strickland title win was added as a separate repeat-opponent row at 1.00.

### Sean O'Malley

Canonical fighter name normalized from `Sean O’Malley` to `Sean O'Malley`.

Approved UFC Quality Wins ledger:

- Aljamain Sterling — 1.25
- Petr Yan — 1.15
- Marlon Vera II — 1.00
- Song Yadong — 0.85
- Aiemann Zahabi — 0.65
- Raulian Paiva — 0.45
- Thomas Almeida — 0.25
- Eddie Wineland — 0.25
- Jose Alberto Quinonez — 0.25
- Andre Soukhamthath — 0.25
- Terrion Ware — 0.10
- Kris Moutinho — 0.10

Petr Yan was explicitly approved at 1.15. Marlon Vera II receives true top-five title-defense credit. The current-table Song Yadong and Aiemann Zahabi wins were added to the ledger.

No Championship Resume, Prime Dominance, Longevity, Apex Peak, or Loss Context input was changed.

## Runtime Result

- Roster fighters checked: 62
- Quality Wins coverage before: 59 pass, 3 fail
- Quality Wins coverage after: 61 pass, 1 fail
- Formula mismatches: 0
- Profile-to-leaderboard mismatches: 0
- Duplicate leaderboard/profile names: 0
- Forbidden score-derived display overrides: 0
- Overall-score ownership gate: PASS
- Deterministic-initialization gate: PASS

## Fighter Results

### Dricus du Plessis

```text
Quality Wins: 12.60 legacy fallback → 14.91 audited live
Quality Wins rank: #38 among men
Overall score: 40.88 → 43.00
Overall rank: #37 → #32
```

The movement comes entirely from the approved Quality Wins ledger. No other category changed.

### Sean O'Malley

```text
Quality Wins: 11.40 legacy fallback → 13.30 audited live
Quality Wins rank: #43 among men
Overall score: 32.92 → 34.66
Overall rank: #44 → #44
```

The score increased, but the overall rank remained unchanged. No other category changed.

## Category Coverage After This Batch

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 61 | 0 | 1 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

The only remaining Quality Wins audit is Julianna Peña.

## Ranking Validation

The men's top ten remained unchanged.

## Cache Note

The runtime-critical batch-six loader reference was updated and validated in a fresh Chromium session. The full static cache chain remains a final pre-merge alignment task because the safety branch is not deployed.

## Next Batch

Review and complete Julianna Peña's Quality Wins ledger before any repo change, then rerun the deterministic audit.