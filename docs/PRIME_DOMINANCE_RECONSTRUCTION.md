# Prime Dominance Reconstruction

_Last updated: 2026-07-14_

## Status

- Branch: `agent/fighter-data-phase-1`
- Draft PR: #39
- Core formula: **Cody-approved**
- Prime-sample percentage: **Cody-approved and locked**
- Mode: **shadow only**
- Live ranking payload changed: **No**
- Clean read-only audit: **Passed**

Prime Dominance now uses one shared prime source, an objective four-component 30-point formula, and one uniform sample-size percentage applied to the complete raw score. The category remains shadow-only until Cody explicitly requests live promotion.

## Successful audit

The final read-only workflow passed with:

- 72 of 72 fighter prime windows resolved through the shared Fighter Era Ledger
- 714 scored prime fights
- 609 elite-stage prime fights
- 0 missing prime round rows
- 0 missing elite-stage round rows
- 16 fighters receiving a prime-sample discount
- no mutation of live scores, rankings, OVRs, profiles, or Compare Mode

The audit found 32 fighter-local prime-window definitions that differ from the shared ledger. Those local windows remain drift evidence only and cannot override the shared source.

## Shared prime source

`assets/data/fighter-era-ledgers.js` is the sole owner of pre-prime, prime, and post-prime boundaries.

The same shared phase ledger is intended for:

- Prime Dominance
- Longevity
- Loss Penalty phase logic
- prime-sensitive Opponent Quality context
- profile prime labels

The shared ledger covers the full canonical roster. It also corrects Julianna Peña’s start from the nonexistent Miesha Tate matchup to the Amanda Nunes title upset on December 11, 2021.

## Locked formula

`[Prime Record + Round Control + Finish Pressure + Elite-Level Validation] × Prime Sample Percentage = Prime Dominance`

| Component | Maximum | Rule |
|---|---:|---|
| Prime Record | 9 | `(wins + 0.5 × draws) ÷ counted prime fights × 9` |
| Round Control | 9 | `(rounds won + 0.5 × drawn rounds) ÷ audited counted prime rounds × 9` |
| Finish Pressure | 5 | Tiered score based on finishes per counted prime fight |
| Elite-Level Validation | 7 | Objective elite-stage exposure and performance during the shared prime |

No contests and technical exceptions are excluded from the score.

## Locked Prime Sample Percentage

The complete raw score out of 30 is multiplied by:

| Counted prime fights | Percentage of raw score |
|---:|---:|
| 1 | 70% |
| 2 | 75% |
| 3 | 80% |
| 4 | 85% |
| 5 | 90% |
| 6 | 95% |
| 7+ | 100% |

Equivalent rule:

`Prime Sample Percentage = min(100%, 65% + 5% × counted prime fights)`

This is applied uniformly to all four components. It is not a fighter-specific adjustment and does not change the fighter’s raw dominance quality; it controls how much of that raw score is validated by the size of the UFC prime sample.

## Elite-Level Validation

A counted prime fight is **elite-stage** when either:

1. it is an official UFC title fight, or
2. the opponent is tagged `champion-level` or `top-five` in the canonical opponent ledger.

### Elite-stage volume — 3 points

`elite-stage prime fights ÷ 8 × 3`, capped at 3.

This portion is result-neutral. A fighter receives validation for repeatedly competing at the highest level even when some of those fights are losses.

### Elite-stage performance — 4 points

| Subcomponent | Maximum |
|---|---:|
| Elite-stage result rate | 2.0 |
| Elite-stage round control | 1.5 |
| Elite-stage finish pressure | 0.5 |

A loss can still earn performance credit through rounds won. This distinguishes a competitive elite loss from being completely outclassed without relying on a subjective separation tag.

## Final shadow board

| Rank | Fighter | Adjusted | Raw | Sample |
|---:|---|---:|---:|---:|
| 1 | Royce Gracie | 29.08 | 29.08 | 100% |
| 2 | Islam Makhachev | 27.38 | 27.38 | 100% |
| 3 | Khabib Nurmagomedov | 27.13 | 27.13 | 100% |
| 4 | Chuck Liddell | 26.94 | 26.94 | 100% |
| 5 | Jon Jones | 26.35 | 26.35 | 100% |
| 6 | Frank Shamrock | 25.99 | 28.88 | 90% |
| 7 | Amanda Nunes | 25.70 | 25.70 | 100% |
| 8 | Francis Ngannou | 25.42 | 26.76 | 95% |
| 9 | Anderson Silva | 25.10 | 25.10 | 100% |
| 10 | Demetrious Johnson | 25.06 | 25.06 | 100% |

Key reviewed outputs:

- Jose Aldo: **17.44**, shared prime **Mark Hominick through Merab Dvalishvili**, prime record **13-7**
- Kamaru Usman: **21.82**, shared prime **Demian Maia through Leon Edwards III**, prime record **8-2**
- Kayla Harrison: raw **26.96**, adjusted **21.57** at **80%** for three counted UFC prime fights

## Controlled overlap

Elite-Level Validation intentionally overlaps slightly with Championship and Opponent Quality, but it asks a different question:

- **Championship** owns title accomplishment.
- **Opponent Quality** owns the quality of wins.
- **Elite-Level Validation** measures how often the fighter's prime was tested at the elite level and how well the fighter performed across those tests, including losses.

Division strength remains outside Prime Dominance.

## Removed from the formula

- Competitive Separation
- Durability bonus
- Division-strength modifier
- hidden fighter-level adjustment
- the retired `0.70 + 0.04 × fights` confidence formula

## Safety

- No live Prime Dominance scores changed.
- No total scores changed.
- No rankings or OVRs changed.
- No profiles or Compare Mode values changed.
- PR #39 remains draft.
