# Prime Dominance Reconstruction

_Last updated: 2026-07-14_

## Status

- Branch: `agent/fighter-data-phase-1`
- Draft PR: #39
- Mode: **Cody-approved formula, shadow only**
- Live ranking payload changed: **No**

The previous separation/durability candidate has been retired. Prime Dominance is being reconstructed with one shared prime source and an objective four-component formula. The formula is approved, but no score is promoted to the live app until Cody explicitly requests promotion.

## Shared prime source

`assets/data/fighter-era-ledgers.js` is the sole owner of pre-prime, prime, and post-prime boundaries.

Prime Dominance must not create or extend its own fighter window. The same shared phase ledger is intended for:

- Prime Dominance
- Longevity
- Loss Penalty phase logic
- prime-sensitive Opponent Quality context
- profile prime labels

Fighter-local windows in other audit files are comparison evidence only. The reconstruction reports any drift and always follows the Fighter Era Ledger.

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

This reuses existing reviewed facts rather than creating a new subjective “dominant performance” label.

### Elite-stage volume — 3 points

`elite-stage prime fights ÷ 8 × 3`, capped at 3.

This portion is result-neutral. A fighter receives validation for repeatedly competing at the highest level even when some of those fights are losses.

### Elite-stage performance — 4 points

| Subcomponent | Maximum |
|---|---:|
| Elite-stage result rate | 2.0 |
| Elite-stage round control | 1.5 |
| Elite-stage finish pressure | 0.5 |

A loss can still earn performance credit through rounds won. This distinguishes a competitive five-round elite loss from being completely outclassed without relying on a subjective separation tag.

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
