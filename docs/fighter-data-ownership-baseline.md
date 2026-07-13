# Fighter Data Ownership Baseline

> Phase 1 diagnostic. Ownership failures are expected until migration is complete; capture or derivation failure is not.

Latest verified browser capture: **2026-07-13**, after canonical batch three.

- Audit version: `fighter-data-ownership-audit-20260713c-identity-inventory`
- Roster identities found: **73**
- Board rows: **72**
- Profile rows: **72**
- Fighter packets loaded: **62**
- Display overrides: **73**
- Canonical scoring records: **72**
- Canonical fighter-fact records: **11** (**15.07%** coverage)
- Canonical UFC fight rows: **242**
- Orphan identities: **1**
- Duplicate fact fields: **521** across **72** fighters
- Conflicting fact fields: **80** across **28** fighters
- Presentation ownership violations: **1,566** across **72** fighters
- Runtime expected-rank locks: **72**
- Runtime expected-total locks: **72**
- Runtime expected-OVR locks: **72**
- Browser errors: **0**

## Canonical migration coverage

| Fighter | UFC bouts | Official UFC record | Prime record | Active elite years | Exact derivation test | Live data mutated |
|---|---:|---:|---:|---:|---:|---:|
| Charles Oliveira | 37 | 25-11, 1 NC | 9-3 | 6.33 | Passed | No |
| Benson Henderson | 14 | 11-3 | 10-3 | 4.29 | Passed | No |
| Vitor Belfort | 26 | 15-10, 1 NC | 7-3 | 6.10 | Passed | No |
| Deiveson Figueiredo | 22 | 14-7-1 | 7-3-1 | 4.73 | Passed | No |
| Frankie Edgar | 30 | 18-11-1 | 13-6-1 | 10.18 | Passed | No |
| Dominick Cruz | 10 | 7-3 | 5-2 | 5.51 | Passed | No |
| Fabricio Werdum | 18 | 12-6 | 9-3 | 6.11 | Passed | No |
| Glover Teixeira | 23 | 16-7 | 12-6 | 8.77 | Passed | No |
| Rashad Evans | 23 | 14-8-1 | 9-3 | 6.00 | Passed | No |
| Mauricio “Shogun” Rua | 24 | 11-12-1 | 3-3 | 2.59 | Passed | No |
| Forrest Griffin | 15 | 10-5 | 4-3 | 3.93 | Passed | No |

Batch two contains **102 UFC bouts**. Compact batch three contains **103 UFC bouts**. Together with Charles, Phase 1 holds **242 complete UFC fight rows**.

## Batch-three reconciliation highlights

- **Fabricio Werdum:** 12-6 UFC record, eight finishes, two official title-fight wins, 1.65 adjusted title credit, 9-3 prime, **26-7 reviewed prime rounds (78.79%)**, and 6.11 active elite years. PRIDE, Strikeforce, PFL, and the Fedor win are excluded.
- **Glover Teixeira:** 16-7, thirteen finishes, one official title-fight win, 12-6 prime, **27-22 reviewed prime rounds (55.10%)**, and 8.77 active elite years. Jamahal Hill is post-prime.
- **Rashad Evans:** 14-8-1, six finishes, one official title-fight win, 9-3 prime, **21-14 reviewed prime rounds (60.00%)**, and 6.00 active elite years. TUF exhibition bouts are excluded.
- **Mauricio “Shogun” Rua:** 11-12-1 UFC-only record, eight finishes, one official title-fight win, 3-3 UFC prime, **8-8 reviewed prime rounds (50.00%)**, and 2.59 active elite years. PRIDE is fully excluded.
- **Forrest Griffin:** 10-5, three finishes, one official title-fight win, 4-3 prime, **12-7 reviewed prime rounds (63.16%)**, and 3.93 active elite years. The TUF 1 win is a tournament achievement, not an official UFC title fight.

## Orphan identity

- **Leon Edwards:** exists in `display-overrides.js` only.

## Conflicts by field

| Field | Count |
|---|---:|
| Finish rate | 23 |
| Active elite years | 22 |
| Times finished in prime | 13 |
| Title-fight wins | 11 |
| UFC record | 9 |
| Prime record | 1 |
| Rounds-won percentage | 1 |

## Duplicate ownership by field

| Field | Count |
|---|---:|
| Active elite years | 72 |
| Finish rate | 72 |
| Rounds-won percentage | 72 |
| Times finished in prime | 72 |
| Title-fight wins | 72 |
| UFC record | 72 |
| Elite wins | 70 |
| Prime record | 11 |
| Top-five wins | 8 |

## Presentation violations by source

| Source | Count |
|---|---:|
| Fighter packet profile stats | 543 |
| Display override snapshot stats | 513 |
| Display override packet stats | 506 |
| Fighter packet display | 4 |

## Interpretation

Canonical records currently coexist with legacy board, profile, packet, and override values for diagnostics only. They do not drive the live app yet.

- Duplicate ownership means a measurable fact exists in more than one location, even if the values agree.
- A conflict means those duplicate sources disagree.
- Agreement does not prove a copied value is correct.
- Expected rank, total, and OVR remain runtime locks that must be removed before the calculated system becomes live authority.
- Phase 1 coverage increases only after a fighter has a complete UFC-only ledger and passing exact derivation test.

The complete machine-readable report is regenerated and uploaded by the **Fighter Data Ownership Baseline** workflow.
