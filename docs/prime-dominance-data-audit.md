# Prime Dominance Data Audit

Last updated: 2026-07-04

Purpose: pause fighter-opinion scoring and turn Prime Dominance into a checkable category that uses existing snapshot/fight-row fields wherever possible.

No live score changes are approved from this document.

## Cody direction

Prime Dominance should be calculated from data we can check, not guessed manually.

The main judgment calls should be:

1. where each fighter's UFC prime starts
2. where each fighter's UFC prime ends
3. weird context handling
4. the division/era strength context for that prime

Everything else should come from stored snapshot/fight data.

---

# Prime Dominance source fields

These are the fields we should use or add.

| Field | Existing? | Source / note |
|---|---|---|
| `primeStart` | partial | Exists in profile rows for several fighters; blank for some base profiles. Needs to be completed for all scored fighters. |
| `primeEnd` | partial | Exists in profile rows for several fighters; blank or vague for some active fighters. Needs to be completed/standardized. |
| `primeRecord` | partial | Exists in several board rows/additions; not universal. Should be normalized as structured fields too. |
| `roundsWonPct` | partial | Exists in several board rows/additions. Base profiles also have fight-level `rounds` arrays that can calculate this. |
| `finishRatePct` | yes/partial | Exists in many profile/board rows, but must be prime-window finish rate, not always full UFC career finish rate. |
| `activeEliteYears` | yes/partial | Already used for Longevity; useful for sample confidence but should not double-count too heavily. |
| `timesFinishedPrime` | yes/partial | Exists in many snapshot rows and should feed Prime loss safety. |
| `bestConsecutiveTitleDefenseStreak` | missing | Needs to be added. This is a major Prime Dominance marker and is different from total title-fight wins. |
| `primeDivisionStrengthScore` | missing | Needs to be added. Lightweight/WW/FW dominance should not be scored exactly like thinner divisions. |
| `primeLosses` | missing/implicit | Should be structured instead of buried in text. |
| `primeFinishedLosses` | mostly `timesFinishedPrime` | We can keep `timesFinishedPrime`, but `primeFinishedLosses` is clearer for formula use. |
| `primeFightCount` | missing | Needed for sample confidence. Can derive from primeStart/primeEnd plus fight rows, but should be stored after audit. |
| `primeFinishWins` | missing | Needed to compute prime finish rate cleanly. Can derive from fight rows, but should be stored after audit. |
| `primeRoundsWon` / `primeRoundsCounted` | missing structured | Can derive from `rounds` arrays where populated; should be stored after audit for transparency. |

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

Examples from current data/additions:

- Jon Jones has `finishRatePct`, `timesFinishedPrime`, `activeEliteYears`, `primeStart`, `primeEnd`, and category fields in the base profile row.
- Petr Yan has `finishRatePct`, `activeEliteYears`, `timesFinishedPrime`, `primeRecord`, and `roundsWonPct` in the board row.
- Hand-added fighters like Justin Gaethje, Frankie Edgar, Dustin Poirier, Aljamain Sterling, T.J. Dillashaw, and Dan Henderson already have `primeRecord`, `roundsWonPct`, `finishRatePct`, `activeEliteYears`, and `timesFinishedPrime` in additions.

## What is incomplete

The data is not yet consistent enough to calculate Prime Dominance safely for everyone.

Key problems:

1. Some base fighters have blank `primeStart` / `primeEnd`.
2. Some additions have `rounds: []`, meaning their rounds-won percentages are stored as snapshot values but not backed by fight-level round rows yet.
3. `finishRatePct` often appears to be full UFC career finish rate, not necessarily prime-window finish rate.
4. `primeRecord` is text, not structured data.
5. `bestConsecutiveTitleDefenseStreak` is not stored yet.
6. `primeDivisionStrengthScore` is not stored yet.
7. Prime losses and prime finished losses are not consistently structured.

---

# Prime Dominance formula to use after data audit

Prime Dominance should remain max 30.

| Component | Max points | Required data |
|---|---:|---|
| Prime record score | 6 | `primeWins`, `primeLosses`, `primeDraws`, prime context notes |
| Prime rounds-won score | 6 | `primeRoundsWonPct` or `primeRoundsWon` / `primeRoundsCounted` |
| Consecutive title-defense dominance | 5 | `bestConsecutiveTitleDefenseStreak` |
| Prime finish/stoppage score | 5 | `primeFinishWins`, `primeFightCount`, `primeFinishRatePct` |
| Prime loss safety score | 4 | `primeLosses`, `primeFinishedLosses`, weird loss context |
| Division strength / prime difficulty | 2 | `primeDivisionStrengthScore`, division/era notes |
| Prime sample confidence | 2 | `primeFightCount`, `activeEliteYears`, prime title/elite fight count |
| **Total** | **30** | — |

Why this formula is better:

- Checkable from stored fields.
- Still rewards consecutive title defenses heavily, but does not bury short perfect primes like Khabib.
- Adds a small division-strength component so dominating lightweight is not treated exactly the same as dominating flyweight or thin women's featherweight.
- Rewards round control without overvaluing only finishers.
- Penalizes prime finished losses without double-counting all post-prime losses.
- Caps tiny samples without turning Prime Dominance into Longevity.

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
  roundsWon: 42,
  roundsCounted: 51,
  roundsWonPct: 82.4,
  bestConsecutiveTitleDefenseStreak: 3,
  primeDivisionStrengthScore: 2.0,
  primeDivisionStrengthNotes: 'Modern lightweight murderers row / 1.10-style division context.',
  primeLosses: 0,
  primeFinishedLosses: 0,
  timesFinishedPrime: 0,
  notes: 'Prime starts at RDA because this is the first elite UFC win in the scored lightweight run.'
}
```

Board/profile rows can keep the simple public fields:

```js
primeRecord: '8-0 elite-prime window',
roundsWonPct: 82.4,
finishRatePct: 50.0,
timesFinishedPrime: 0
```

But the formula should read from `primeSnapshot` when available.

---

# Calculation rules

## 1. Prime record score / 6

Use structured prime record.

| Prime result profile | Score |
|---|---:|
| Undefeated prime, no real competitive loss | 6.00 |
| One prime elite/top-5 loss | 5.00-5.50 |
| One prime non-elite loss | 4.00-4.75 |
| Multiple prime losses | 2.50-4.50 |
| Chaotic/mixed prime | below 3.50 |

Notes:

- Jon's Hamill DQ is not a competitive loss.
- Volk's Islam losses are upward-division elite context, not a full same-division prime collapse.
- Post-prime losses should not affect this score.

## 2. Prime rounds-won score / 6

Use prime-only rounds-won percentage.

| Prime rounds won % | Score |
|---|---:|
| 85%+ | 6.00 |
| 80-84.9% | 5.50-5.90 |
| 70-79.9% | 4.75-5.50 |
| 60-69.9% | 3.75-4.75 |
| 50-59.9% | 2.50-3.75 |
| Under 50% | below 2.50 |

If `rounds` rows are available, calculate:

```text
primeRoundsWonPct = primeRoundsWon / primeRoundsCounted
```

If not available, use audited snapshot value until fight-level round rows are filled.

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
- Second-division title wins do not automatically count as defenses, but can support sample confidence/elite dominance elsewhere.

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
- OQ still handles the specific opponents.
- Prime Dominance uses this to recognize that dominating certain divisions is structurally harder.

## 7. Prime sample confidence / 2

| Prime sample | Score |
|---|---:|
| Long elite/title prime, high confidence | 2.00 |
| Solid champion/elite contender prime | 1.50-1.90 |
| Short but proven elite prime | 1.00-1.50 |
| Tiny/active sample | under 1.00 |

This is not Longevity. It only prevents tiny samples from scoring like decade-long primes.

---

# Data audit checklist per fighter

For each fighter, do this before calculating Prime Dominance:

1. Define `primeSnapshot.start` and `primeSnapshot.end`.
2. Confirm prime fight list.
3. Confirm `primeSnapshot.record` and structured wins/losses/draws/NCs.
4. Confirm `primeSnapshot.roundsWonPct` for only prime fights.
5. Confirm `primeSnapshot.finishRatePct` for only prime wins/fights.
6. Confirm `primeSnapshot.bestConsecutiveTitleDefenseStreak`.
7. Confirm `primeSnapshot.primeDivisionStrengthScore`.
8. Confirm prime losses and `primeFinishedLosses`.
9. Confirm weird context notes.
10. Calculate Prime Dominance from the formula.
11. Only then consider live correction module.

---

# First-pass data status by source

## Base ranking-data.js

Base profiles often have deep fight-level data and category fields. Jon Jones is the clear example: he has snapshot-level fields plus detailed `opponents` and `rounds` arrays.

Action needed:

- Use base `rounds` arrays to calculate prime rounds-won percentage where populated.
- Fill blank `primeStart` / `primeEnd` where missing.
- Add `primeSnapshot` object after each fighter is audited.

## ranking-data-additions.js

Hand-added fighters already have many snapshot fields but often lack fight-level round rows.

Examples:

- Justin Gaethje, Frankie Edgar, Dustin Poirier, Aljamain Sterling, T.J. Dillashaw, Dan Henderson all include prime-related snapshot fields.
- Their `rounds` arrays are currently empty in additions, so their `roundsWonPct` must be treated as audited snapshot input until detailed round rows are added.

Action needed:

- Keep snapshot values for now.
- Later add prime fight rows/round rows if we want full derivation from fight-level data.

## Fighter packets / display overrides

Packets and overrides are good for app-facing copy and snapshot display, but Prime Dominance should not be calculated from copy text.

Action needed:

- Store formula fields in ranking/profile data or in a dedicated data module, not only in display copy.

---

# Recommended implementation plan

## Step 1: Lock this formula and schema

Do not change live Prime Dominance yet.

## Step 2: Create batch prime data worksheets

Use batches of 6-8 fighters.

Each worksheet should include:

- prime window
- prime fight list
- prime record
- prime rounds-won calculation
- prime finish-rate calculation
- consecutive title-defense streak
- division strength score
- prime loss/finish context
- calculated score

## Step 3: Add `primeSnapshot` data in small batches

For each fighter, add structured data only after the worksheet is approved.

## Step 4: Build live prime dominance correction module

Only after enough fighters are audited.

Module should:

- read `primeSnapshot`
- calculate Prime Dominance
- update `primeDominance`
- recalculate total score
- re-sort ranks
- clear stale display overrides

---

# Immediate next batch recommendation

Start with a data batch, not score batch:

1. Jon Jones
2. Georges St-Pierre
3. Demetrious Johnson
4. Anderson Silva
5. Khabib Nurmagomedov
6. Alexander Volkanovski
7. Max Holloway
8. Amanda Nunes

For each one, the next worksheet should show the actual prime fight list first, then calculate the fields.

# Bottom line

Cody's correction is right: we should not invent Prime Dominance numbers.

Prime Dominance should be calculated from audited prime-window data:

```text
prime record
prime rounds won %
consecutive title-defense streak
prime finish rate
prime loss / finished context
division strength / prime difficulty
prime sample confidence
```

The only subjective parts should be where the prime starts/ends, how weird context is treated, and which division-strength bucket applies.