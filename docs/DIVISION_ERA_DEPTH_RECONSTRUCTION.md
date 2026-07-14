# Division-Era Depth Reconstruction

## Status

Division-Era Depth is the final category reconstruction before total score, ranking, and OVR are recalculated. The work remains shadow-only on draft PR #39; the published app is unchanged.

## Category purpose

Division-Era Depth measures how difficult it was to remain elite in a fighter’s UFC division during the fighter’s canonical prime window. It is an era adjustment, not a general old-versus-new penalty and not a substitute for opponent quality.

## Locked empirical model under audit

The existing model uses quarterly division snapshots and three components:

1. **Qualified active pool — 30%**
2. **Strength of ranks 6–15 by division-specific Elo — 50%**
3. **Contender diversity — 20%**

Every UFC fight inside the fighter’s canonical prime is sampled at the nearest prior quarterly snapshot. Title fights receive 1.5× weight. Open primes receive a terminal modern snapshot.

Each division is normalized against its own recent mature baseline. This avoids treating heavyweight as weak merely because lightweight has more fighters.

## Adjustment curve

- Below 1.00: `-3 × ((1.00 - depthIndex) / 0.25)^1.5`, capped at **-3.00**.
- Above 1.00: `(depthIndex - 1.00) × 20`, capped at **+0.75**.

## Critical separation

Division-Era Depth and division strength are different concepts:

- **Division strength** is the app’s reviewed contextual multiplier, such as modern lightweight 1.10 or Demetrious Johnson flyweight 0.85.
- **Division-Era Depth** compares the size, middle-tier strength, and contender diversity of that same division across time.

The reconstruction records each fighter’s canonical `divisionStrength.defaultKey` for context but never multiplies it into the era-depth adjustment.

## Women’s featherweight

Women’s featherweight is excluded from empirical sampling because it never maintained a viable ranks-6–15 baseline.

- Mixed careers use non-WFW samples.
- Pure WFW careers receive a neutral 0.00 era-depth adjustment.

## Initial reconstruction goal

The audit independently checks:

- all 73 canonical fighters,
- empirical shadow coverage,
- the curved formula for every covered fighter,
- canonical-control parity,
- range limits,
- WFW-safe treatment,
- and separation from division-strength context.

The expected immediate review item is Leon Edwards, because the existing empirical artifact was generated for the previous 72-fighter roster.

## Safety

- Shadow-only
- No writes to live category scores
- No writes to total scores, ranks, or OVR
- No profile or Compare Mode changes
- No merge or live promotion without Cody’s approval
