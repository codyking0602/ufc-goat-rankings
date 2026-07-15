# Fighter Data Ownership Baseline

> Phase 1 diagnostic. Ownership failures are expected until migration is complete; capture or derivation failure is not.

Latest verified browser capture: **2026-07-13**, after canonical batch five.

- Audit version: `fighter-data-ownership-audit-20260713c-identity-inventory`
- Roster identities found: **73**
- Board rows: **72**
- Profile rows: **72**
- Fighter packets loaded: **62**
- Display overrides: **73**
- Canonical scoring records: **72**
- Canonical fighter-fact records: **28** (**38.36%** coverage)
- Canonical UFC fight rows: **582**
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
| Randy Couture | 24 | 16-8 | 6-3 | 4.22 | Passed | No |
| Max Holloway | 33 | 24-9 | 16-6 | 11.24 | Passed | No |
| Kamaru Usman | 19 | 16-3 | 8-3 | 7.47 | Passed | No |
| Jose Aldo | 23 | 14-9 | 8-3 | 6.59 | Passed | No |
| Matt Hughes | 25 | 18-7 | 13-3 | 6.15 | Passed | No |
| Daniel Cormier | 15 | 11-3, 1 NC | 7-3, 1 NC | 5.62 | Passed | No |
| Stipe Miocic | 19 | 14-5 | 8-3 | 6.29 | Passed | No |
| Ilia Topuria | 10 | 9-1 | 4-1 | 3.05 | Passed | No |
| Israel Adesanya | 19 | 13-6 | 8-4 | 5.35 | Passed | No |
| Cain Velasquez | 15 | 12-3 | 6-2 | 5.16 | Passed | No |

Batch two contains **102 UFC bouts**. Batch three contains **103 UFC bouts**. Batch four contains **138 UFC bouts**. Batch five contains **202 UFC bouts**. Together with Charles, Phase 1 holds **582 complete UFC fight rows**.

## Batch-five highlights

- **Randy Couture:** UFC 13 tournament wins count as UFC wins but not official title-fight wins. He derives nine official title-fight wins.
- **Max Holloway:** complete 24-9 UFC record through UFC 329. BMF fights remain outside UFC divisional title scoring.
- **Kamaru Usman:** complete 16-3 record through Buckley. Future Dricus du Plessis fight is excluded.
- **Jose Aldo:** UFC-only 14-9. WEC fights and title accomplishments remain fully excluded.
- **Matt Hughes:** 18-7 UFC record. Joe Riggs missed weight, so that bout remains non-title.
- **Daniel Cormier:** UFC-only 11-3, 1 NC. Strikeforce achievements are excluded and Jones II remains a no contest.
- **Stipe Miocic:** Jones is post-prime after the long layoff.
- **Ilia Topuria:** 9-1 with Gaethje recorded as a prime stoppage loss.
- **Israel Adesanya:** 13-6; Imavov and Pyfer are post-prime.
- **Cain Velasquez:** 12-3 with a 6-2 prime and two prime stoppage losses.

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
