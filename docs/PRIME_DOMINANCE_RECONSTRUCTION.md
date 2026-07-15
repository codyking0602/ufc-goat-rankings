# Prime Dominance Reconstruction

_Last updated: 2026-07-14_

## Status

- Branch: `agent/fighter-data-phase-1`
- Draft PR: #39
- Core formula: **Cody-approved**
- Tournament-event compression: **Cody-approved and locked**
- Championship-density floor: **Cody-approved and locked**
- Mode: **shadow only**
- Live ranking payload changed: **No**
- Read-only audit: **Passed**

## Approved formula

`[Prime Record + Round Control + Finish Pressure + Elite-Level Validation] × Effective Prime Sample Percentage = Prime Dominance`

| Component | Maximum | Rule |
|---|---:|---|
| Prime Record | 9 | `(wins + 0.5 × draws) ÷ counted prime bouts × 9` |
| Round Control | 9 | `(rounds won + 0.5 × drawn rounds) ÷ audited counted prime rounds × 9` |
| Finish Pressure | 5 | Tiered score based on finishes per counted prime bout |
| Elite-Level Validation | 7 | Objective elite-stage exposure and performance during the shared prime |

The shared Fighter Era Ledger owns every prime boundary. No contests and technical exceptions are excluded.

## Effective Prime Sample Percentage

The raw 30-point score uses:

| Effective prime samples | Percentage of raw score |
|---:|---:|
| 1 | 70% |
| 2 | 75% |
| 3 | 80% |
| 4 | 85% |
| 5 | 90% |
| 6 | 95% |
| 7+ | 100% |

Multiple same-day tournament bouts count as one effective event sample.

## Tournament-event compression

Every official tournament bout remains fully counted in:

- prime record
- round control
- finish pressure

The scheduling format cannot create several independent prime samples from one night.

Elite validation is capped per tournament event:

- Final or deepest completed bout: up to **1.0** validation-volume unit
- Semifinal or immediately preceding completed bout: up to **0.5** unit
- Earlier opening rounds: no automatic elite-stage volume merely because the event used a tournament format

The performance portion is weighted using those same credits. A completed multi-bout tournament event therefore contributes no more than 1.5 elite-validation units.

### Royce Gracie result

- Counted prime bouts: **12**
- Effective event samples: **5**
- Same-day tournament bouts removed from sample volume: **7**
- Prime record remains: **11-0-1**
- Prime Dominance: **29.08 → 25.12**

No official result, finish, or round was deleted.

## Championship-density floor

A fighter with at least four consecutive **non-tournament** elite/title-stage prime samples receives a minimum **90%** sample multiplier.

Tournament events cannot trigger this floor.

The rule currently applies to four concentrated four-fight primes:

- Henry Cejudo
- Brock Lesnar
- Michael Bisping
- Julianna Peña

## Henry Cejudo prime correction

Cejudo's shared elite prime is:

**Demetrious Johnson II through Dominick Cruz**

The three-year retirement creates the phase break. Aljamain Sterling and every later fight are post-prime comeback activity.

Approved outputs:

- Prime record: **4-0**
- Base four-sample multiplier: **85%**
- Championship-density multiplier: **90%**
- Prime Dominance: **22.52**
- Longevity: **4.77**
- Loss Penalty: **-1.69**

## Elite-Level Validation

A standard counted prime fight is elite-stage when:

1. it is an official UFC title fight, or
2. the opponent is tagged `champion-level` or `top-five`.

Tournament opening rounds use the compression rule instead of automatically qualifying.

### Volume — 3 points

`credited elite-validation units ÷ 8 × 3`, capped at 3.

### Performance — 4 points

| Subcomponent | Maximum |
|---|---:|
| Elite-stage result rate | 2.0 |
| Elite-stage round control | 1.5 |
| Elite-stage finish pressure | 0.5 |

## Controlled overlap

- **Championship** owns title accomplishment.
- **Opponent Quality** owns the quality of wins.
- **Prime Dominance** measures how overwhelmingly the fighter performed and how strongly the prime was validated.

Division strength remains outside Prime Dominance.

## Safety

- No live Prime Dominance scores changed.
- No live total scores or ranks changed.
- No OVRs changed.
- No profiles or Compare Mode values changed.
- PR #39 remains draft.
