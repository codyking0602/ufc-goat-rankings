# Prime Dominance Reconstruction

_Last updated: 2026-07-14_

## Status

- Branch: `agent/fighter-data-phase-1`
- Draft PR: #39
- Formula: **Cody-approved**
- Mode: **shadow only**
- Live ranking payload changed: **No**
- Clean audit: **Passed**

The previous separation/durability candidate has been retired. Prime Dominance now uses one shared prime source and an objective four-component formula. The formula is approved, but the reconstructed board remains under calibration review and is not promoted to the live app.

## Successful audit

The clean read-only workflow passed with:

- 72 of 72 fighter prime windows resolved through the shared Fighter Era Ledger
- 714 scored prime fights
- 609 elite-stage prime fights
- 0 missing prime round rows
- 0 missing elite-stage round rows
- no mutation of live scores, rankings, OVRs, profiles, or Compare Mode

The audit also found 32 fighter-local prime-window definitions that differ from the shared ledger. Those local windows are treated as drift evidence only and cannot override the shared source.

## Shared prime source

`assets/data/fighter-era-ledgers.js` is the sole owner of pre-prime, prime, and post-prime boundaries.

Prime Dominance must not create or extend its own fighter window. The same shared phase ledger is intended for:

- Prime Dominance
- Longevity
- Loss Penalty phase logic
- prime-sensitive Opponent Quality context
- profile prime labels

The shared ledger now covers the full canonical roster. It also corrects Julianna Peña’s start from the nonexistent Miesha Tate matchup to the Amanda Nunes title upset on December 11, 2021.

## Approved formula

`Prime Record + Round Control + Finish Pressure + Elite-Level Validation = 30`

| Component | Maximum | Rule |
|---|---:|---|
| Prime Record | 9 | `(wins + 0.5 × draws) ÷ counted prime fights × 9` |
| Round Control | 9 | `(rounds won + 0.5 × drawn rounds) ÷ audited counted prime rounds × 9` |
| Finish Pressure | 5 | Tiered score based on finishes per counted prime fight |
| Elite-Level Validation | 7 | Objective elite-stage exposure and performance during the shared prime |

No contests and technical exceptions are excluded from the score.

## Elite-Level Validation

A counted prime fight is **elite-stage** when either:

1. it is an official UFC title fight, or
2. the opponent is already tagged `champion-level` or `top-five` in the canonical opponent ledger.

This reuses existing reviewed facts rather than creating a new subjective dominant-performance label.

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

## Current shadow board

| Rank | Fighter | Prime Dominance |
|---:|---|---:|
| 1 | Royce Gracie | 29.08 |
| 2 | Frank Shamrock | 28.88 |
| 3 | Islam Makhachev | 27.38 |
| 4 | Khabib Nurmagomedov | 27.13 |
| 5 | Kayla Harrison | 26.96 |
| 6 | Chuck Liddell | 26.94 |
| 7 | Francis Ngannou | 26.76 |
| 8 | Jon Jones | 26.35 |
| 9 | Amanda Nunes | 25.70 |
| 10 | Anderson Silva | 25.10 |

Key reviewed outputs:

- Jose Aldo: **17.44**, shared prime **Mark Hominick through Merab Dvalishvili**, prime record **13-7**
- Kamaru Usman: **21.82**, shared prime **Demian Maia through Leon Edwards III**, prime record **8-2**

## Calibration warning before live promotion

The approved formula is mechanically clean, but the current board exposes a short-sample issue:

- Kayla Harrison scores **26.96 from three UFC prime fights** and ranks fifth.
- Frank Shamrock scores **28.88 from five UFC prime fights** and ranks second.
- Royce Gracie scores **29.08** and ranks first because his early UFC prime was nearly perfect by record, rounds, and finishes.

No silent adjustment has been made. Any additional sample-size control or component rebalancing would be a new model decision requiring Cody’s approval.

## Controlled overlap

Elite-Level Validation intentionally overlaps slightly with Championship and Opponent Quality, but it asks a different question:

- **Championship** owns title accomplishment.
- **Opponent Quality** owns the quality of wins.
- **Elite-Level Validation** measures how often the fighter's prime was tested at the elite level and how well the fighter performed across those tests, including losses.

Division strength remains outside Prime Dominance.

## Removed from the formula

- Competitive Separation
- Durability bonus
- Prime-sample confidence multiplier
- Division-strength modifier
- Hidden fighter-level adjustment

Round control already provides an objective measure of separation. Finish-loss and durability context remain visible and belong in Loss Penalty rather than receiving a second dedicated bonus here.

## Safety

- No live Prime Dominance scores changed.
- No total scores changed.
- No rankings or OVRs changed.
- No profiles or Compare Mode values changed.
- PR #39 remains draft.
