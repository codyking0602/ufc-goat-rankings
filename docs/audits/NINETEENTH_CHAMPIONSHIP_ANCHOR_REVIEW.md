# Nineteenth Audit — Championship Resume Anchor Review

Generated: July 10, 2026

Mode: Read-only Championship Resume anchor review. No live score, total, rank, OVR, or category formula was changed.

## Purpose

Define what 0, 5, 10, 15, 20, 25, and 30 should mean in UFC accomplishment language, then test fixed adjusted-title-credit curves against the current 62-fighter roster.

## Proposed Category Meanings

| Score | Meaning |
|---:|---|
| 0 | No UFC title-win accomplishment |
| 5 | Limited title success |
| 10 | Legitimate champion résumé |
| 15 | Established champion |
| 20 | Great championship résumé |
| 25 | All-time championship résumé |
| 30 | Historical benchmark |

## Candidate Results

| Candidate | All-62 Championship influence | Top-30 influence | Mean Championship change | Maximum change | Fighters changing board rank |
|---|---:|---:|---:|---:|---:|
| Current locked linear | 43.52% | 48.44% | 0.00 | 0.00 | 0 |
| Conservative anchors | 44.83% | 48.10% | 1.70 | 2.59 | 22 |
| Champion-forward anchors | 46.14% | 47.32% | 3.53 | 5.52 | 28 |
| Historical top-heavy anchors | 43.02% | 48.17% | 0.23 | 0.63 | 6 |

The candidate curves are fixed accomplishment scales. None depends on the roster average, percentile, or current category leader.

## Semantic Review

The champion-forward curve produced the clearest real-fighter alignment with the proposed meanings:

| Score level | Representative current fighters under the candidate |
|---:|---|
| Around 10 | Ilia Topuria, Conor McGregor, Aljamain Sterling |
| Around 15 | B.J. Penn, Zhang Weili, T.J. Dillashaw |
| Around 20 | Jose Aldo, Alexander Volkanovski |
| Around 25 | Amanda Nunes, Valentina Shevchenko, Anderson Silva, Demetrious Johnson |
| Near 30 | Georges St-Pierre and benchmark Jon Jones |

This is substantially more intuitive than the current linear category display, where fighters such as B.J. Penn, Zhang Weili, and T.J. Dillashaw sit near 10/30 despite having established UFC championship résumés.

## Provisional Semantic Anchor Curve

The champion-forward curve is the best current candidate for the meaning of the Championship Resume scale:

| Adjusted title credit | Championship score |
|---:|---:|
| 0.00 | 0 |
| 1.00 | 4 |
| 3.00 | 10 |
| 6.00 | 18 |
| 10.00 | 25 |
| 14.54 | 30 |

This curve is **provisional and shadow-only**. It is not approved as the live scoring formula.

## Why It Is Not Live Yet

The champion-forward curve improves category-score meaning but increases Championship's measured all-roster influence from 43.52% to 46.14%. It also changes 28 board positions, generally by small amounts but enough to require system-level review.

That does not automatically make the curve wrong. It means Championship cannot be finalized in isolation. The remaining categories need their own accomplishment anchors before the full base formula can be balanced.

## Current-Roster Coverage

The current 62 fighters are sufficient to evaluate the Championship scale from legitimate champion through historical benchmark. They include strong examples around the 10, 15, 20, 25, and 30 levels.

The low end remains less complete. A later lower- and middle-tier calibration sample should validate:

- no-title-win veterans;
- isolated interim or vacant-title success;
- one-time champions with no sustained reign;
- short title challengers and ranked veterans;
- fighters with long UFC tenure but no championship accomplishment.

The lower-tier sample should validate the 0–10 range. It should not determine or rescale the elite anchors.

## Decision

1. Keep the current locked linear Championship formula live for now.
2. Retain the permanent 14.54-credit benchmark so roster growth cannot rescale existing fighters.
3. Treat the champion-forward curve as the provisional semantic anchor candidate.
4. Do not use effective influence as an automatic rejection or acceptance rule.
5. Build the same anchor review for Quality Wins next.
6. After Championship, Quality Wins, Prime Dominance, and Longevity all have semantic anchor candidates, run a full formula-balance simulation and decide whether category scales, headline weights, or both should change.

Loss Context remains deferred until the positive scoring model is finalized.
