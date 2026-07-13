# Fighter Data Ownership Baseline

> Phase 1 diagnostic. A failing ownership result is expected until migration is complete; capture failure is not.

Latest verified browser capture: 2026-07-13 after the Charles Oliveira and five-fighter ledger migrations.

- Audit version: `fighter-data-ownership-audit-20260713c-identity-inventory`
- Roster identities found: **73**
- Board rows: **72**
- Profile rows: **72**
- Fighter packets loaded: **62**
- Display overrides: **73**
- Canonical scoring records: **72**
- Canonical fighter-fact records: **6** (**8.22%** coverage)
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
| Benson Henderson | Audited | Yes — 14 bouts | Passed | No |
| Vitor Belfort | Audited | Yes — 26 bouts | Passed | No |
| Deiveson Figueiredo | Audited | Yes — 22 bouts | Passed | No |
| Frankie Edgar | Audited | Yes — 30 bouts | Passed | No |
| Dominick Cruz | Audited | Yes — 10 bouts | Passed | No |

The five-person batch contains **102 UFC bouts**. Together with Charles, Phase 1 now holds **139 audited UFC fight rows**.

## Five-person batch reconciliation highlights

- **Benson Henderson:** 11-3 UFC record, four official title-fight wins, 3.65 adjusted title credit, 10-3 prime, 67.35% reviewed prime round control, and 4.29 active elite years.
- **Vitor Belfort:** 15-10 with one no contest, one official UFC title-fight win, a separate UFC 12 tournament achievement, a 7-3 prime, and 64.29% reviewed prime round control.
- **Deiveson Figueiredo:** complete current UFC record derives as **14-7-1**; Song Yadong is recorded as a May 30, 2026 second-round submission loss. Benavidez I gives no title-win credit because Figueiredo missed championship weight.
- **Frankie Edgar:** 18-11-1 UFC record, 13-6-1 prime, three official title-fight wins, 68.0% reviewed prime round control, and 10.18 capped active elite years.
- **Dominick Cruz:** WEC is fully excluded, including WEC 53. His UFC-only Faber II-to-Cejudo window derives **5.51** active elite years under the locked 18-month gap cap, not the legacy handwritten 6.5.

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

## Legacy conflicts remain visible by design

Canonical records now derive the reconciled values, but legacy board, profile, packet, and override sources remain temporarily because Phase 1 must not alter the live app before generated snapshots and calculated scoring are ready.

Examples:

- Charles Oliveira’s canonical finish rate is **84.0%**, while legacy sources still contain **40%** and **86.4%**.
- Deiveson Figueiredo’s canonical UFC record is **14-7-1**, while older copied sources may show a different record.
- Dominick Cruz’s canonical capped longevity is **5.51 years**, while a legacy display value still shows **6.5**.
- Vitor Belfort’s canonical ledger separates one official UFC title-fight win from his UFC 12 tournament win.

The unchanged duplicate/conflict totals are expected at this stage: Phase 1 adds authoritative evidence without yet deleting or replacing the old presentation-owned copies.

## Interpretation

- Duplicate ownership means the same measurable fact exists in more than one place, even when values agree.
- A conflict means duplicate sources disagree.
- Agreement does not prove a copied value is correct.
- Canonical records currently coexist with legacy sources for diagnostics only; canonical data is not yet driving live profiles or scores.
- Expected rank, total, and OVR counts confirm runtime locks that must be removed in Phase 4.
- Coverage increases only after a fighter has a complete reconciled UFC ledger and passing derivation test.

The complete machine-readable report is generated and uploaded by the **Fighter Data Ownership Baseline** workflow.
