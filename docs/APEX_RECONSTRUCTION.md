# Apex Peak Reconstruction

## Status: locked

Apex Peak was locked by Cody on **July 14, 2026** after full-roster reconstruction, factual correction, judgment recovery, and leaderboard calibration.

The locked shadow registry contains **36 Cody-approved judgments** and covers all **73 canonical fighters**. The published app remains unchanged until the full scoring refactor is promoted as one approved system.

Final validation:

- Missing Apex judgments: **0**
- Invalid selected performances: **0**
- Selected-performance issues: **0**
- 24-month violations: **0**
- Component-formula issues: **0**
- Live ranking payload changed: **No**

The machine-readable lock is `assets/data/canonical-apex-lock.js`.

## Locked philosophy

Apex Peak is a separate **0.00 to +6.00 bonus** for the fighter’s highest UFC ceiling. It measures a concentrated peak rather than repeating full-career Championship, Opponent Quality, Prime Dominance, or Longevity.

The locked model uses the fighter’s **best two counted UFC wins inside one 24-month period**.

## Locked formula

1. **Two-performance strength — 2.00 maximum**
   - Rate each selected UFC win from 0 to 10.
   - Average the two ratings.
   - Divide by 10 and multiply by 2.00.

2. **Proof — 1.75 maximum**
   - How much the pair proves against elite UFC opposition and championship stakes.

3. **Best-Fighter Claim — 1.25 maximum**
   - Whether this window created a credible best-fighter-in-the-world argument.

4. **Aura — 1.00 maximum**
   - The fear, inevitability, iconic dominance, or special peak feeling produced by the run.

`Apex Peak = Two-performance strength + Proof + Best-Fighter Claim + Aura`

Maximum: **6.00**.

## Selection rules

- Both selected performances must be counted UFC wins.
- No contests cannot be selected.
- Losses cannot be selected as the two performances.
- The two wins must be no more than 24 months apart.
- Losses inside the chosen period do not automatically erase the Apex, but they may reduce Best-Fighter Claim or Aura.
- Non-UFC wins and achievements are excluded from the score.

## Locked architecture

The approved category now follows this traceable structure:

`canonical UFC fight facts + Cody-approved Apex selections/ratings/judgments -> locked Apex calculator -> validated 0.00–6.00 score`

The reconstruction validates:

- whether both performances are real counted UFC wins,
- whether the exact canonical fight dates satisfy 24 months,
- whether Two-performance strength matches the ratings formula,
- whether every component stays inside its maximum,
- whether the components reproduce the approved Apex score,
- and whether every canonical fighter has an Apex judgment.

## Important distinction

Two-performance strength is mechanical. Proof, Best-Fighter Claim, and Aura are explicit reviewed judgments. They are exposed in the approved registry rather than hidden inside an unexplained score.

## Change policy

Apex Peak is now closed for ordinary reconstruction work. Any future change to a selected pair, performance rating, Proof, Best-Fighter Claim, Aura, component maximum, formula, or selection rule requires:

1. Cody’s explicit approval,
2. a new approved judgment entry or superseding resolution,
3. a new lock version,
4. and a passing full-roster Apex validation run.

New completed UFC fights may trigger a future review for active fighters, but they do not silently alter the locked score.

## Safety and promotion status

- Category logic and judgments: **locked**
- Shadow validation: **passing**
- Writes to live `RANKING_DATA`: **none**
- Total-score, rank, OVR, profile, or Compare Mode changes: **none**
- Draft PR #39 remains the only target
- Live promotion waits for the remaining category reconstruction and final calculated-board approval
