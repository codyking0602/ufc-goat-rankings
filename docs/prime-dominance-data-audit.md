# Prime Dominance Data Audit

Last updated: 2026-07-04

Purpose: turn Prime Dominance into a checkable UFC-only category that uses stored fight rows or audited snapshot fields.

No live score changes are approved from this document.

---

# Cody direction

Prime Dominance should be calculated from inputs we can check, not guessed manually.

The main judgment calls should be:

1. where each fighter's UFC prime starts
2. where each fighter's UFC prime ends
3. weird context handling
4. division/era strength context

Everything else should come from stored fight rows or audited snapshot fields.

---

# Prime Dominance vs Longevity

Prime Dominance answers:

```text
When this fighter was elite, how dominant were they?
```

Longevity answers:

```text
How long did this fighter keep proving elite UFC relevance?
```

Sample confidence was removed because it started blurring those two categories.

---

# Locked Prime Dominance formula

```text
Prime Dominance / 30 =
Prime record / 7
+ Prime rounds won / 7
+ Consecutive title-defense dominance / 5
+ Prime finish/stoppage / 5
+ Prime loss safety / 4
+ Division strength / 2
```

| Component | Max points | Required input |
|---|---:|---|
| Prime record score | 7 | `primeWins`, `primeLosses`, `primeDraws`, prime context notes, or audited `primeRecord`. |
| Prime rounds-won score | 7 | `primeRoundsWonPct` or `primeRoundsWon` / `primeRoundsCounted`; audited `roundsWonPct` is valid. |
| Consecutive title-defense dominance | 5 | `bestConsecutiveTitleDefenseStreak`. |
| Prime finish/stoppage score | 5 | `primeFinishWins`, `primeFightCount`, `primeFinishRatePct`, or audited `finishRatePct`. |
| Prime loss safety score | 4 | `primeLosses`, `primeFinishedLosses`, `timesFinishedPrime`, weird loss context. |
| Division strength / prime difficulty | 2 | `primeDivisionStrengthScore`, division/era notes. |
| **Total** | **30** | — |

---

# Valid data-source tiers

The repo currently has two valid Prime input styles.

## 1. Detailed fight rows

These use per-fight `rounds` arrays and can calculate:

```text
primeRoundsWonPct = primeRoundsWon / primeRoundsCounted
```

This is the most transparent source.

## 2. Audited snapshot fields

Some fighters were painstakingly audited when added, but the result was stored as snapshot/profile fields instead of fight-by-fight rows.

Common audited snapshot fields:

- `primeRecord`
- `roundsWonPct`
- `finishRatePct`
- `activeEliteYears`
- `timesFinishedPrime`
- `primeStart`
- `primeEnd`

These are valid scoring inputs.

Do not call them missing data. If a fighter has audited snapshot values but `rounds: []`, that means the detailed row layer is not populated yet. It does **not** mean the fighter was not audited.

Detailed rows can be added later for transparency, debugging, and cleaner future recalculation.

---

# Existing data observations

## What already works

The repo already has the right kind of snapshot fields in several places:

- `finishRatePct`
- `activeEliteYears`
- `timesFinishedPrime`
- `primeRecord`
- `roundsWonPct`
- `primeStart`
- `primeEnd`

Examples:

- Jon Jones and many base fighters have detailed `rounds` rows.
- Hand-added fighters like Justin Gaethje, Frankie Edgar, Dustin Poirier, Aljamain Sterling, T.J. Dillashaw, and Dan Henderson have audited snapshot values in additions.
- Those hand-added snapshot values should be trusted as the current audited input unless Cody reopens that fighter's audit.

## What still needs normalization

The data is not uniformly structured yet.

Key cleanup items:

1. Some base fighters have blank or vague `primeStart` / `primeEnd` fields.
2. Some audited additions store `roundsWonPct` as a snapshot but do not have detailed fight rows yet.
3. `finishRatePct` should be verified as prime-window finish rate when used for Prime Dominance.
4. `primeRecord` is often text, not structured numeric fields.
5. `bestConsecutiveTitleDefenseStreak` is not stored consistently.
6. `primeDivisionStrengthScore` is not stored consistently.
7. Prime losses and prime finished losses are not consistently structured.

These are standardization issues, not proof that the audit does not exist.

---

# Proposed structured prime snapshot schema

Add this object to profile rows/packets over time:

```js
primeSnapshot: {
  start: 'Rafael dos Anjos 2014',
  end: 'Justin Gaethje 2020',
  record: '8-0 elite-prime window; 13-0 full UFC context',
  wins: 8,
  losses: 0,
  draws: 0,
  noContests: 0,
  fightCount: 8,
  finishWins: 4,
  finishRatePct: 50.0,
  roundsWon: 23,
  roundsCounted: 25,
  roundsWonPct: 92.0,
  bestConsecutiveTitleDefenseStreak: 3,
  primeDivisionStrengthScore: 2.0,
  primeDivisionStrengthNotes: 'Modern lightweight murderers row / 1.10-style division context.',
  primeLosses: 0,
  primeFinishedLosses: 0,
  timesFinishedPrime: 0,
  notes: 'Prime starts at RDA because this is the first elite UFC win in the scored lightweight run.'
}
```

Board/profile rows can keep simple public fields:

```js
primeRecord: '8-0 elite-prime window',
roundsWonPct: 92.0,
finishRatePct: 50.0,
timesFinishedPrime: 0
```

Formula preference order:

1. Use `primeSnapshot` when available.
2. Else calculate from detailed `rounds` rows and structured fighter data.
3. Else use audited board/profile snapshot fields.

---

# Calculation rules

## 1. Prime record score / 7

Use structured prime record or audited `primeRecord`.

| Prime result profile | Score |
|---|---:|
| Undefeated prime, no real competitive loss | 7.00 |
| One prime elite/top-5 loss | 5.80-6.50 |
| One prime non-elite loss | 4.75-5.75 |
| Multiple prime losses | 3.00-5.25 |
| Chaotic/mixed prime | below 4.00 |

Notes:

- Jon's Hamill DQ is not a competitive loss.
- Volk's Islam losses are upward-division elite context, not a full same-division prime collapse.
- Post-prime losses should not affect this score.

## 2. Prime rounds-won score / 7

Use prime-only rounds-won percentage.

| Prime rounds won % | Score |
|---|---:|
| 85%+ | 7.00 |
| 80-84.9% | 6.40-6.90 |
| 70-79.9% | 5.50-6.40 |
| 60-69.9% | 4.35-5.50 |
| 50-59.9% | 2.90-4.35 |
| Under 50% | below 2.90 |

If detailed `rounds` rows are available, calculate:

```text
primeRoundsWonPct = primeRoundsWon / primeRoundsCounted
```

If detailed rows are not available, use the audited snapshot `roundsWonPct` until fight-level rows are added.

## 3. Consecutive title-defense dominance / 5

Use best consecutive UFC title-defense streak during the prime window.

| Best consecutive UFC title defenses | Score |
|---|---:|
| 10+ | 5.00 |
| 7-9 | 4.50-4.85 |
| 4-6 | 3.75-4.35 |
| 2-3 | 2.50-3.40 |
| 1 | 1.50-2.25 |
| 0 | 0.00-0.75 |

Rules:

- This is not total title-fight wins.
- This is not adjusted title wins.
- This measures repeated dominance at the top.
- Interim title defenses should be case-by-case, usually below undisputed defense streak value.
- Second-division title wins do not automatically count as defenses.

## 4. Prime finish/stoppage score / 5

Use prime-only finish rate when possible.

| Prime finish profile | Score |
|---|---:|
| Historic finisher / frequent elite stoppages | 4.50-5.00 |
| Strong finisher | 3.50-4.50 |
| Moderate finisher / damage-heavy decision fighter | 2.50-3.50 |
| Low finisher but dominant controller | 1.50-2.75 |
| Low finish / low separation | below 1.50 |

Do not punish GSP/Khabib-style control too hard; they can recover points through rounds-won, record, and title-defense streak.

## 5. Prime loss safety / 4

Start at 4 and subtract for prime blemishes.

| Prime blemish | Subtract |
|---|---:|
| Prime loss to champ/top-5 | -0.75 |
| Prime loss to non-elite | -1.50 |
| Finished in prime loss | extra -0.75 |
| Upward-division elite loss | -0.25 to -0.50 |
| Weird technical/non-competitive result | 0 or tiny context note |

Floor: 0.

This is different from the main Loss Penalty category. The main Penalty is resume punishment. This component asks whether prime dominance was visibly broken.

## 6. Division strength / prime difficulty / 2

Use a small score, not a multiplier, to avoid double-counting Opponent Quality.

| Division/era context | Score |
|---|---:|
| Lightweight murderers row / modern elite lightweight | 2.00 |
| GSP welterweight / modern featherweight | 1.75-1.90 |
| Strong modern bantamweight / strong LHW era | 1.50-1.75 |
| Anderson middleweight / older heavyweight / solid but thinner divisions | 1.25-1.50 |
| Demetrious Johnson flyweight | 1.00-1.20 |
| Thin women's featherweight | 0.50-0.75 |

Rules:

- This should be a light correction, not the whole category.
- Opponent Quality still handles the specific opponents.
- Prime Dominance uses this to recognize that dominating certain divisions is structurally harder.

---

# Implementation note

When the live Prime Dominance correction module is built:

1. Use the no-sample formula.
2. Trust audited snapshot inputs where detailed rows are not stored yet.
3. Do not require a full re-audit of snapshot-audited fighters.
4. Add detailed fight rows later as a transparency upgrade, not as a prerequisite.
5. Fix any malformed stored rows, especially the flagged Ilia/Gaethje round row, before relying on that row for automated calculation.