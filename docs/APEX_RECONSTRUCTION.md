# Apex Peak Reconstruction

## Status

Apex Peak is being reconstructed on draft PR #39 as a shadow-only category audit. The published app and canonical scoring authority remain unchanged.

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

- Both selected performances must be UFC wins.
- No contests cannot be selected.
- Losses cannot be selected as the two performances.
- The two wins must be no more than 24 months apart.
- Losses inside the chosen period do not automatically erase the Apex, but they may reduce Best-Fighter Claim or Aura.
- Non-UFC wins and achievements are excluded from the score.

## Reconstruction architecture

The initial audit reads the existing locked Apex evidence and validates it against the complete canonical UFC fight ledgers:

`canonical UFC fight facts + recovered locked Apex selections/components -> factual selection audit -> frozen-score parity -> Cody review queue`

It checks:

- whether both performances are real counted UFC wins,
- whether the exact canonical fight dates satisfy 24 months,
- whether Two-performance strength matches the ratings formula,
- whether every component stays inside its maximum,
- whether the components reproduce the frozen Apex score,
- and whether every canonical fighter has an Apex judgment.

## Important distinction

Two-performance strength is mechanical. Proof, Best-Fighter Claim, and Aura remain explicit reviewed judgments. The reconstruction must expose those judgments, not pretend they are automatically generated statistics.

## Safety

- Shadow-only
- No writes to `RANKING_DATA`
- No Apex promotion
- No total-score, rank, OVR, profile, or Compare Mode changes
- Draft PR remains the only target
