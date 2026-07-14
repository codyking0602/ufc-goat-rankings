# Prime Dominance Reconstruction

_Last updated: 2026-07-14_

## Status

- Branch: `agent/fighter-data-phase-1`
- Draft PR: #39
- Mode: **shadow-only candidate formula pending Cody review**
- Fighters audited: **72**
- Excluded from this category audit: **Leon Edwards**
- Canonical scored prime fights: **742**
- Prime windows resolved: **72/72**
- Missing scored-prime round rows: **0**
- Live ranking payload changed: **No**

This category has been fully reconstructed and tested, but it has not been promoted into the live app. The exact component weighting is a proposed model change and remains pending final approval.

## Candidate clean formula

`[Prime Record + Round Control + Finish Pressure + Competitive Separation + Durability] × Prime-Sample Confidence`

| Component | Maximum | Rule |
|---|---:|---|
| Prime Record | 9 | `(wins + 0.5 × draws) ÷ scored prime fights × 9` |
| Round Control | 8 | `(rounds won + 0.5 × drawn rounds) ÷ audited prime rounds × 8` |
| Finish Pressure | 5 | Tiered score based on finishes per scored prime fight |
| Competitive Separation | 5 | Dominant wins per scored prime fight; finishes and clear audited decisions qualify |
| Durability | 3 | Share of scored prime fights without a stoppage loss |
| Prime-Sample Confidence | 0.78–1.00 | `0.70 + 0.04 × scored prime fights`; full confidence at eight fights |

A DQ win counts in the official prime record but does not count as competitive separation. No contests and technical exceptions do not enter the category score.

## Removed double counting

The former Prime Dominance model reserved eight points for **Elite-Stakes Validation**, including:

- title-fight wins
- Top-5 wins
- champion/former-champion wins
- five-round/title-stage volume
- division-strength context

Those inputs are retained in the audit as provenance but removed from the candidate calculation. Championship, Opponent Quality, and Division-Era Depth already own them.

Prime Dominance now answers one cleaner question:

> During the fighter's actual UFC prime, how consistently and decisively did they control fights?

## Candidate Prime Dominance leaders

| Rank | Fighter | Score | Prime record | Round control | Finish pressure | Separation | Confidence |
|---:|---|---:|---:|---:|---:|---:|---:|
| 1 | Royce Gracie | 28.88 | 11-0-1 | 95.83% | 91.67% | 91.67% | 1.00 |
| 2 | Khabib Nurmagomedov | 28.36 | 8-0 | 92.00% | 62.50% | 100.00% | 1.00 |
| 3 | Islam Makhachev | 28.14 | 10-0 | 89.29% | 80.00% | 90.00% | 1.00 |
| 4 | Frank Shamrock | 27.00 | 5-0 | 100.00% | 100.00% | 100.00% | 0.90 |
| 5 | Chuck Liddell | 26.86 | 7-1 | 93.33% | 75.00% | 87.50% | 1.00 |
| 6 | Jon Jones | 26.31 | 16-0, 1 NC | 86.67% | 50.00% | 87.50% | 1.00 |
| 7 | Francis Ngannou | 25.59 | 6-0 | 81.82% | 83.33% | 83.33% | 0.94 |
| 8 | Anderson Silva | 25.35 | 16-2 | 71.79% | 77.78% | 88.89% | 1.00 |
| 9 | Amanda Nunes | 25.31 | 12-1 | 87.50% | 46.15% | 84.62% | 1.00 |
| 10 | Tony Ferguson | 24.87 | 8-1 | 72.00% | 55.56% | 88.89% | 1.00 |
| 11 | Demetrious Johnson | 24.84 | 12-1-1 | 81.82% | 50.00% | 78.57% | 1.00 |
| 12 | Matt Hughes | 24.21 | 13-3 | 80.00% | 56.25% | 81.25% | 1.00 |
| 13 | Georges St-Pierre | 24.08 | 14-1 | 85.96% | 33.33% | 80.00% | 1.00 |
| 14 | Kayla Harrison | 23.78 | 3-0 | 100.00% | 66.67% | 100.00% | 0.82 |
| 15 | Cris Cyborg | 23.44 | 5-1 | 84.62% | 66.67% | 83.33% | 0.94 |

## Key judgment calls

### Royce Gracie

Royce ranks first in this category because this is pure UFC prime dominance, not opponent depth or era strength. His individual prime results are nearly perfect. The broader early-era weakness remains handled by Division-Era Depth rather than being charged twice.

### Khabib and Islam

Both validate as the modern benchmarks. Khabib receives perfect prime-record and separation components. Islam's higher finish pressure nearly closes Khabib's small round-control advantage.

### Frank Shamrock and Kayla Harrison

Both produce near-perfect raw component scores, but their shorter UFC prime samples receive visible confidence discounts. Frank's five-fight sample is multiplied by 0.90; Kayla's three-fight sample by 0.82.

### Jon Jones

Jones remains elite at 26.31 because of a 16-0 scored prime, strong round control, zero stoppage losses, and high separation. His finish-pressure component is lower than the most destructive finishing primes. The Cormier II no contest remains stored but excluded from the scored record.

### GSP

GSP remains an elite control champion at 24.08. His 14-1 record and 85.96% round control are excellent, while his lower finish pressure prevents the category from treating methodical control exactly like Khabib, Islam, Royce, or Anderson-style destruction.

### Anderson Silva

Anderson's finish pressure and separation remain central to his 25.35 score. The two Weidman losses remain inside the approved prime window and prevent a perfect record/durability result.

### Ronda Rousey

The full Cody-approved UFC prime remains 6-2, including the Holly Holm and Amanda Nunes losses. She is not scored as an artificial 6-0 peak-only sample.

### Volkanovski

The Islam losses and Topuria loss remain inside the prime window. Their upward-division context is handled by the Loss Penalty category; Prime Dominance records what happened during the actual prime window without adding a second opponent or division modifier.

## Largest movements versus the frozen category

| Fighter | Frozen | Candidate | Delta |
|---|---:|---:|---:|
| B.J. Penn | 23.81 | 17.85 | -5.96 |
| Henry Cejudo | 25.88 | 19.98 | -5.90 |
| Kayla Harrison | 18.22 | 23.78 | +5.56 |
| Chael Sonnen | 14.04 | 19.11 | +5.07 |
| Jose Aldo | 22.65 | 17.98 | -4.67 |
| Michael Bisping | 19.92 | 15.62 | -4.30 |
| Tyron Woodley | 20.17 | 15.90 | -4.27 |
| Forrest Griffin | 18.50 | 14.25 | -4.25 |
| Benson Henderson | 22.00 | 17.77 | -4.23 |
| Brock Lesnar | 22.72 | 18.77 | -3.95 |
| Royce Gracie | 24.93 | 28.88 | +3.95 |
| Kamaru Usman | 22.80 | 19.13 | -3.67 |
| Rose Namajunas | 20.08 | 16.53 | -3.55 |
| Stipe Miocic | 24.64 | 21.32 | -3.32 |
| Mauricio "Shogun" Rua | 18.70 | 15.51 | -3.19 |
| Israel Adesanya | 19.40 | 16.38 | -3.02 |
| Mackenzie Dern | 13.80 | 16.82 | +3.02 |
| Tony Ferguson | 21.85 | 24.87 | +3.02 |
| Conor McGregor | 24.14 | 21.18 | -2.96 |
| Zhang Weili | 22.22 | 19.33 | -2.89 |

Large movements are expected because the frozen model used an eight-point elite-stakes block. The candidate model replaces that block with separation and durability, then recalculates every fighter from the canonical prime ledger.

## Safety

- No live Prime Dominance scores changed.
- No total scores changed.
- No rankings or OVRs changed.
- No profiles or Compare Mode values changed.
- PR #39 remains draft.
- The candidate formula requires Cody's review before promotion.
