# Eighth Runtime Audit — Quality Wins: Chuck Liddell and Tito Ortiz

Generated: July 10, 2026

Workflow: `Six-Category Runtime Audit`

Runtime: Headless Chromium using the deterministic single-pass scoring pipeline

## Changes Tested

- Added canonical UFC-only Quality Wins ledgers for Chuck Liddell and Tito Ortiz.
- Reviewed both ledgers after the initial automated checkpoint.
- Lowered Chuck's supporting-win credits where the first pass was too generous.
- Restored Tito's opponent credits to the previously reviewed packet calibration.
- Aligned the complete Quality Wins cache chain after the revisions.

No Championship Resume, Prime Dominance, Longevity, Apex Peak, or Loss Context input was changed.

## Chuck Liddell — Reviewed Judgment Calls

Chuck's UFC Quality Wins case is anchored by:

- Randy Couture II — 1.25
- Randy Couture III — 1.25
- Tito Ortiz I — 1.00
- Tito Ortiz II — 1.00
- Vitor Belfort — 0.85
- Renato Sobral II — 0.85

Reviewed supporting values:

- Jeremy Horn II — 0.65
- Wanderlei Silva — 0.65
- Kevin Randleman — 0.65
- Renato Sobral I — 0.65
- Murilo Bustamante — 0.65
- Jeff Monson — 0.45
- Amar Suloev — 0.25
- Vernon White — 0.25
- Paul Jones — 0.10
- Noe Hernandez — 0.10

Scope and calibration decisions:

- Guy Mezger and Alistair Overeem are excluded because those wins occurred outside the UFC.
- Tito II remains below maximum because it was a repeat win with timing context.
- Wanderlei is capped because the UFC win came after his clearest non-UFC peak.
- Older supporting names do not receive automatic top-ten credit from name value alone.

The original first pass produced 22.66/30 and ranked Chuck eighth in Quality Wins. Review found that result too generous. The approved revision lowers him to a strong but more defensible position.

## Tito Ortiz — Reviewed Judgment Calls

Tito's ledger now matches the previously reviewed fighter-packet calibration:

- Vitor Belfort — 0.90
- Wanderlei Silva — 0.85
- Forrest Griffin I — 0.80
- Ken Shamrock I — 0.75
- Evan Tanner — 0.70
- Vladimir Matyushenko — 0.65
- Ryan Bader — 0.65
- Patrick Cote — 0.45
- Yuki Kondo — 0.40
- Guy Mezger II — 0.40
- Ken Shamrock II — 0.30
- Ken Shamrock III — 0.25
- Jerry Bohlander — 0.25
- Elvis Sinosic — 0.25
- Wes Albritton — 0.10

Scope and calibration decisions:

- Tito has no 1.25 win in this audit.
- Only UFC results are scored.
- Wanderlei's later PRIDE greatness does not become extra UFC credit for Tito.
- The later Shamrock wins are heavily timing- and repeat-discounted.
- The Bader upset adds real Quality Wins value but does not restart Tito's prime.

## Runtime Result

- Roster fighters checked: 62
- Quality Wins coverage: 59 pass, 3 fail
- Formula mismatches: 0
- Profile-to-leaderboard mismatches: 0
- Duplicate leaderboard/profile names: 0
- Forbidden score-derived display overrides: 0
- Overall-score ownership gate: PASS
- Deterministic-initialization gate: PASS

## Reviewed Fighter Results

### Chuck Liddell

```text
Quality Wins: 15.40 legacy fallback → 19.85 reviewed live
Initial unreviewed pass: 22.66
Quality Wins rank: #19 among men
Overall score: 46.11 legacy → 50.18 reviewed
Overall rank: #27 legacy → #19 reviewed
```

The reviewed movement comes only from replacing the stale Quality Wins fallback. No other category changed.

### Tito Ortiz

```text
Quality Wins: 7.95 legacy fallback → 14.45 reviewed live
Initial unreviewed pass: 15.81
Quality Wins rank: #38 among men
Overall score: 40.24 legacy → 46.20 reviewed
Overall rank: #37 legacy → #27 reviewed
```

The reviewed movement comes only from replacing the stale Quality Wins fallback. No other category changed.

## Category Coverage After Review

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

The men's top ten remained unchanged. Chuck and Tito moved only within the middle of the board.

## Next Batch

Review Dricus du Plessis and Sean O'Malley together. Both already have ledger rows under inconsistent name forms, so the next task is source reconciliation and promotion rather than creating their resumes from scratch.
