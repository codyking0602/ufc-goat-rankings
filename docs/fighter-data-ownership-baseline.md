# Fighter Data Ownership Baseline

> Phase 1 diagnostic. Ownership failures are expected until migration is complete; capture or derivation failure is not.

Latest verified browser capture: **2026-07-13**, after canonical batch four.

- Audit version: `fighter-data-ownership-audit-20260713c-identity-inventory`
- Roster identities found: **73**
- Board rows: **72**
- Profile rows: **72**
- Fighter packets loaded: **62**
- Display overrides: **73**
- Canonical scoring records: **72**
- Canonical fighter-fact records: **18** (**24.66%** coverage)
- Canonical UFC fight rows: **380**
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
| Jon Jones | 24 | 22-1, 1 NC | 16-0, 1 NC | 10.51 | Passed | No |
| Georges St-Pierre | 22 | 20-2 | 14-1 | 8.44 | Passed | No |
| Demetrious Johnson | 18 | 15-2-1 | 13-1 | 6.15 | Passed | No |
| Anderson Silva | 25 | 17-7, 1 NC | 16-2 | 7.50 | Passed | No |
| Islam Makhachev | 18 | 17-1 | 10-0 | 5.35 | Passed | No |
| Khabib Nurmagomedov | 13 | 13-0 | 8-0 | 6.02 | Passed | No |
| Alexander Volkanovski | 18 | 15-3 | 9-3 | 7.17 | Passed | No |

Batch two contains **102 UFC bouts**. Batch three contains **103 UFC bouts**. Batch four contains **138 UFC bouts**. Together with Charles, Phase 1 holds **380 complete UFC fight rows**.

## Batch-four highlights

- **Jon Jones:** official 22-1, 1 NC; scoring 22-0. Hamill is an explicit non-competitive technical exception, Cormier II remains a no contest, and Stipe is post-prime.
- **Georges St-Pierre:** Hughes I is pre-prime; Serra is the one prime finish loss and remains inside the recovered prime window.
- **Demetrious Johnson:** UFC-only 15-2-1; WEC and ONE Championship are excluded.
- **Anderson Silva:** proper official record is 17-7, 1 NC. Both Weidman losses remain prime stoppage losses; later losses are post-prime.
- **Islam Makhachev:** includes the November 2025 welterweight title win over Jack Della Maddalena. The future Garry defense is excluded.
- **Khabib Nurmagomedov:** complete 13-0 UFC ledger with seven derived finishes and no UFC loss penalty.
- **Alexander Volkanovski:** complete 15-3 ledger with five UFC finishes, correcting stale presentation data. Both Islam losses use the upward-division exception; Topuria remains a home-division prime finish loss.

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
