# Twentieth Audit — Quality Wins Anchor Review

Generated: July 10, 2026

Mode: Quality Wins semantic-anchor review plus a roster-stability implementation. The review simulations were read-only. The only live scoring change was replacing current-leader normalization with a locked 14.10-credit benchmark; this preserved every current Quality Wins score, total, rank, and OVR.

## Existing Quality Wins Inputs

Quality Wins already has a stable accomplishment ledger beneath the /30 score:

1. Each UFC win receives one final opponent-quality credit:
   - 1.25 — Champion-level win
   - 1.00 — True top-5 win
   - 0.85 — Strong top-10 win
   - 0.65 — Ranked / quality win
   - 0.45 — Solid résumé win
   - 0.25 — Name-value, faded, or unproven win
   - 0.10 — Minimal UFC quality credit
   - 0.00 — No meaningful quality credit
2. Wins are sorted from strongest to weakest.
3. Diminishing returns apply by slot:
   - wins 1–6 count 100%;
   - wins 7–12 count 75%;
   - wins 13–18 count 50%;
   - wins 19+ count 25%.
4. The resulting total is `diminishedCredit`.
5. The /30 Quality Wins score converts that diminished-credit total into category points.

The review did not change any fight-level credits, tier labels, timing judgments, division calibration, or diminishing-return rules.

## Locked Score Meanings

| Score | Meaning |
|---:|---|
| 0 | No meaningful UFC quality-win credit |
| 5 | Limited quality-win résumé |
| 10 | Solid ranked-win résumé |
| 15 | Established elite-win résumé |
| 20 | Great quality-win résumé |
| 25 | All-time quality-win résumé |
| 30 | Historical benchmark |

## Accepted Fixed Anchor Scale

The existing linear scale already aligns with the semantic meanings. It is now expressed as permanent anchors:

| Diminished Quality Wins credit | Quality Wins score |
|---:|---:|
| 0.00 | 0 |
| 2.35 | 5 |
| 4.70 | 10 |
| 7.05 | 15 |
| 9.40 | 20 |
| 11.75 | 25 |
| 14.10 | 30 |

Formula:

`Quality Wins score = min(30, diminishedCredit / 14.10 × 30)`

## Real-Fighter Alignment

The current roster gives strong examples from 10 through 30:

| Score level | Representative current fighters |
|---:|---|
| Around 10 | Chael Sonnen, Julianna Peña, Dan Henderson |
| Around 15 | Dricus du Plessis, Merab Dvalishvili, Sean Strickland |
| Around 20 | Robert Whittaker, Junior dos Santos, Chuck Liddell, Matt Hughes, Khabib Nurmagomedov |
| Around 25 | Max Holloway, Amanda Nunes, Islam Makhachev |
| Near 30 | Georges St-Pierre and benchmark Jon Jones |

This is a much cleaner semantic fit than Championship Resume currently has. Quality Wins does not need artificial expansion or compression.

## Candidate Results

| Candidate | All-62 Quality influence | Top-30 Quality influence | Mean Quality change | Maximum change | Fighters changing board rank |
|---|---:|---:|---:|---:|---:|
| Current locked 14.10 linear | 26.13% | 24.26% | 0.00 | 0.00 | 0 |
| Lower/middle résumé-friendly | 25.42% | 23.14% | 0.88 | 1.17 | 10 |
| Elite-gated top-heavy | 25.99% | 25.23% | 1.39 | 1.69 | 5 |

The intended formula weight is 27.5%. The current fixed scale's 26.13% all-roster influence is already close enough that changing the curve would create fighter movement without solving a real semantic or balance problem.

## Roster-Growth Stability Fix

The retired live approach normalized every score to the current roster leader. A future fighter above today's 14.10-credit leader would therefore have lowered every existing Quality Wins score.

Examples under the retired dynamic formula:

| Future leader credit | Example current 20/30 would become | Current fixed score remains |
|---:|---:|---:|
| 16.00 | 17.63 | 20.00 |
| 18.00 | 15.67 | 20.00 |
| 20.00 | 14.10 | 20.00 |

The live category now uses:

- benchmark credit: 14.10;
- benchmark mode: `locked-constant`;
- future-roster stable: `true`;
- source roster leader retained separately for auditing.

A future fighter can exceed 14.10 diminished credit and cap at 30/30 without lowering existing fighters.

## Current-Roster Coverage

The current 62 fighters are sufficient to validate the 10–30 range. The 0–5 range remains thin because the roster is selected for historically relevant UFC careers. A later lower-tier calibration sample should include fighters with few or no ranked wins.

That lower-tier sample should validate the bottom of the scale. It should not redefine the accepted elite anchors.

## Final Runtime Validation

- roster fighters: 62;
- Championship Resume: 62 pass;
- Quality Wins: 62 pass;
- Prime Dominance: 62 pass;
- Longevity: 62 pass;
- Apex Peak: 62 pass;
- formula mismatches: 0;
- forbidden score-derived overrides: 0;
- duplicate-name groups: 0;
- overall-score ownership: PASS;
- deterministic initialization: PASS;
- Quality score movement from benchmark fix: 0;
- board-rank movement from benchmark fix: 0.

Loss Context remains QA-only and is not promoted live.

## Decision

1. Accept the current Quality Wins linear scale as the semantic anchor scale.
2. Lock 14.10 diminished credits as the permanent historical benchmark.
3. Reject lower/middle-friendly and elite-gated alternatives because they create movement without improving the category's meaning or overall balance.
4. Keep all existing fight-level credits and diminishing-return rules unchanged.
5. Treat Quality Wins as provisionally complete for the positive-category anchor framework.
6. Review Prime Dominance semantic anchors next, followed by Longevity.
7. Run a full four-category balance simulation only after Championship, Quality Wins, Prime Dominance, and Longevity all have accepted or provisional anchor scales.
