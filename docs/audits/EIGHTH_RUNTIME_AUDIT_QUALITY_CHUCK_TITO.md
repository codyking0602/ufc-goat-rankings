# Eighth Runtime Audit — Quality Wins: Chuck Liddell and Tito Ortiz

Generated: July 9, 2026

Workflow: `Six-Category Runtime Audit`

Runtime: Headless Chromium using the deterministic single-pass scoring pipeline

## Changes Tested

- Added canonical UFC-only Quality Wins ledgers for Chuck Liddell and Tito Ortiz.
- Loaded the new ledger batch before the Quality Wins shadow audit and category-only live promoter.
- Aligned the full upstream cache chain through Championship Resume, module versions, the prerequisite loader, and `index.html`.
- Removed all temporary inspection and cache-update tooling after use.

No Championship Resume, Prime Dominance, Longevity, Apex Peak, or Loss Context input was changed.

## Chuck Liddell Judgment Calls

Chuck's UFC Quality Wins case is anchored by:

- Randy Couture II — 1.25
- Randy Couture III — 1.25
- Tito Ortiz I — 1.00
- Tito Ortiz II — 1.00
- Vitor Belfort — 1.00
- Renato Sobral II — 0.85

Additional meaningful UFC wins include Jeremy Horn II, Wanderlei Silva, Kevin Randleman, Renato Sobral I, Murilo Bustamante, Amar Suloev, Jeff Monson, and Vernon White.

Locked scope decisions:

- Guy Mezger and Alistair Overeem are excluded because those wins occurred outside the UFC.
- Tito II is capped below maximum because it was a repeat win with timing context.
- Wanderlei is capped at strong top-10 credit because the UFC win came after his clearest non-UFC peak.
- Older supporting names receive ranked, solid, or minimal credit rather than automatic legend-name inflation.

## Tito Ortiz Judgment Calls

Tito has no 1.25 win in this audit. His Quality Wins case is built on solid early light-heavyweight depth:

- Vitor Belfort — 1.00
- Wanderlei Silva — 0.85
- Forrest Griffin I — 0.85
- Evan Tanner — 0.85
- Vladimir Matyushenko — 0.85
- Ryan Bader — 0.85
- Ken Shamrock I — 0.65

Supporting UFC wins receive lower credit based on opponent strength, timing, and repeat context.

Locked scope decisions:

- Only UFC results are scored.
- Wanderlei's later PRIDE greatness does not become extra UFC credit for Tito.
- Ken Shamrock II and III are heavily timing- and repeat-discounted.
- The Ryan Bader upset adds real Quality Wins value but does not restart Tito's prime.

## Runtime Result

- Roster fighters checked: 62
- Quality Wins coverage before: 57 pass, 5 fail
- Quality Wins coverage after: 59 pass, 3 fail
- Formula mismatches: 0
- Profile-to-leaderboard mismatches: 0
- Duplicate leaderboard/profile names: 0
- Forbidden score-derived display overrides: 0
- Overall-score ownership gate: PASS
- Deterministic-initialization gate: PASS

## Fighter Results

### Chuck Liddell

```text
Quality Wins: 15.40 legacy fallback → 22.66 audited live
Quality Wins rank: #8 among men
Overall score: 46.11 → 52.76
Overall rank: #27 → #17
```

The movement comes entirely from replacing the stale fallback with the normalized canonical ledger. No other category changed.

### Tito Ortiz

```text
Quality Wins: 7.95 legacy fallback → 15.81 audited live
Quality Wins rank: #33 among men
Overall score: 40.24 → 47.45
Overall rank: #37 → #24
```

The movement comes entirely from replacing the stale fallback with the normalized canonical ledger. No other category changed.

## Category Coverage After This Batch

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 59 | 0 | 3 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

Remaining Quality Wins audits:

- Dricus du Plessis
- Sean O'Malley
- Julianna Peña

## Ranking Validation

The men's top ten remained unchanged. Chuck and Tito moved only within the middle of the board, where their stale Quality Wins fallbacks had understated the completed UFC win ledgers.

## Next Batch

Review Dricus du Plessis and Sean O'Malley together. Both already have ledger rows under inconsistent name forms, so the next task is source reconciliation and promotion rather than creating their resumes from scratch.
