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

The scoring pipeline is now Promise-based and deterministic.

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

## Critical

### 3. Loss Context ledger is not live

Status: Open

Existing legacy `penalty` values remain live. The Fighter Era Ledger adapter is QA-only.

Remaining:

- add Sean O'Malley's missing adapter entry
- review all 62 fighter totals against the locked loss rules
- promote the reviewed ledger
- rerun the deterministic full-roster audit

### 4. Full-roster six-category coverage

Status: In Progress

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 57 | 0 | 5 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

Target: 62/62 audited coverage and zero silent fallback.

## High Priority

### 5. Quality Wins missing five live audits

Status: Open

- Chuck Liddell
- Tito Ortiz
- Dricus du Plessis
- Sean O'Malley
- Julianna Peña

### 6. Prime Dominance missing nine merged audits

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

### 7. Apex Peak incomplete row

Status: Open

Dricus du Plessis remains explicitly pending. The other 61 Apex audits pass.

### 8. Legacy source values remain mixed with live values

Status: Open

`ranking-data.js` still contains older values that can exist before audited category layers apply.

Target: preserve legacy values under explicit legacy fields and prohibit silent fallback after initialization.

### 9. Production cache-bust references

Status: Open before merge

The static `index.html` query strings for `module-versions.js` and `ranking-data-patches.js` need final alignment.

Fresh branch testing passes, but production should not rely on old browser cache keys.

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
