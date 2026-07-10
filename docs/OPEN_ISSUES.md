# Open Issues

## Resolved on Safety Branch

### 1. Overall score ownership

Status: Resolved

`assets/js/final-score-engine.js` is the only overall-score owner.

Validated:

- five positive category promoters are category-only
- legacy weighting is compatibility-only
- 62/62 leaderboard rows carry the final-engine owner
- 0 formula mismatches
- 0 forbidden numerical display overrides

Production status: Not merged.

### 2. Score-changing timers and repeated loaders

Status: Resolved

The scoring pipeline is Promise-based and deterministic.

Validated:

- scoring timers: 0
- repeated scoring loads: 0
- duplicate scoring scripts: 0
- final engine applies once
- UI refreshes once after scoring
- final engine does not wrap `refresh`
- category tiers do not reapply Prime
- deterministic initialization gate: PASS

Permanent report:

- `docs/audits/SEVENTH_RUNTIME_AUDIT_DETERMINISTIC_INITIALIZATION.md`

Production status: Not merged.

### 3. Static loader cache alignment

Status: Resolved

`index.html`, `module-versions.js`, `ranking-data-patches.js`, and the Championship-to-Quality loader chain now use the current deterministic and Quality Wins batch versions.

The normal Chromium audit passed after the Chuck/Tito cache alignment.

## Critical

### 4. Loss Context ledger is not live

Status: Open

Existing legacy `penalty` values remain live. The Fighter Era Ledger adapter is QA-only.

Remaining:

- add Sean O'Malley's missing adapter entry
- review all 62 fighter totals against the locked loss rules
- promote the reviewed ledger
- rerun the deterministic full-roster audit

### 5. Full-roster six-category coverage

Status: In Progress

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 59 | 0 | 3 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

Target: 62/62 audited coverage and zero silent fallback.

## High Priority

### 6. Quality Wins missing three live audits

Status: In Progress

Completed in the first missing-coverage batch:

- Chuck Liddell
- Tito Ortiz

Permanent report:

- `docs/audits/EIGHTH_RUNTIME_AUDIT_QUALITY_CHUCK_TITO.md`

Remaining:

- Dricus du Plessis
- Sean O'Malley
- Julianna Peña

### 7. Prime Dominance missing nine merged audits

Status: Open

- Frankie Edgar
- T.J. Dillashaw
- Tyron Woodley
- Dricus du Plessis
- Aljamain Sterling
- Robert Whittaker
- Sean O'Malley
- Sean Strickland
- Dan Henderson

### 8. Apex Peak incomplete row

Status: Open

Dricus du Plessis remains explicitly pending. The other 61 Apex audits pass.

### 9. Legacy source values remain mixed with live values

Status: Open

`ranking-data.js` still contains older values that can exist before audited category layers apply.

Target: preserve legacy values under explicit legacy fields and prohibit silent fallback after initialization.

## Review Items

### 10. Compare Mode source consistency

Status: Not yet audited

Confirm Compare Mode reads canonical final rows and maintains no separate numerical score source.

### 11. Division board source consistency

Status: Not yet audited

Confirm division rankings read canonical final rows after the deterministic pipeline completes.

### 12. Apex naming consistency

Status: Mostly resolved

Active scoring and tier modules use “Apex Peak.” Remaining legacy presentation references can be standardized during final cleanup.
