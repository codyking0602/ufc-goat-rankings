# Fighter Data Ownership Baseline

> Phase 1 diagnostic. A failing ownership result is expected until migration is complete; capture failure is not.

Latest verified browser capture: 2026-07-13 after Charles Oliveira migration.

- Audit version: `fighter-data-ownership-audit-20260713c-identity-inventory`
- Roster identities found: **73**
- Board rows: **72**
- Profile rows: **72**
- Fighter packets loaded: **62**
- Display overrides: **73**
- Canonical scoring records: **72**
- Canonical fighter-fact records: **1** (**1.37%** coverage)
- Orphan identities: **1**
- Duplicate fact fields: **521** across **72** fighters
- Conflicting fact fields: **80** across **28** fighters
- Presentation ownership violations: **1,566** across **72** fighters
- Runtime expected-rank locks: **72**
- Runtime expected-total locks: **72**
- Runtime expected-OVR locks: **72**
- Browser errors: **0**

## Canonical migration coverage

| Fighter | Status | Complete UFC ledger | Derived-output test | Live scoring mutated |
|---|---|---:|---:|---:|
| Charles Oliveira | Audited | Yes — 37 bouts | Passed | No |

## Orphan identities

- **Leon Edwards:** display override only

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

## Charles Oliveira legacy conflicts still visible

The canonical record now derives the reconciled values, but legacy board/profile/packet sources have not been removed yet because Phase 1 must not change the live app before generated snapshots are ready.

- Active elite years: legacy **5.23 / 4.0** versus canonical **6.33**
- Finish rate: legacy **40% / 86.4%** versus canonical **84.0%**
- Times finished in prime: legacy **0 / 3** versus canonical **2**
- Title-fight wins: legacy **2 / 3** versus canonical **2**
- Prime record is now canonically derived as **9-3**

## Interpretation

- Duplicate ownership means the same measurable fact exists in more than one place, even when the values currently agree.
- A conflict means duplicate sources disagree.
- Agreement across duplicate sources does not prove the value is factually correct.
- Canonical records currently coexist with legacy sources for diagnostics only; canonical data is not yet driving live profiles or scores.
- Expected rank, total, and OVR counts confirm runtime locks that must be removed in Phase 4.
- Coverage increases only after a fighter has a complete reconciled UFC ledger and passing derivation test.

The complete machine-readable report is generated and uploaded by the **Fighter Data Ownership Baseline** workflow.
