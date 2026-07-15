# Division-Era Depth Reconstruction

## Status: locked

Division-Era Depth was completed and locked on **July 14, 2026** after the existing 72-fighter empirical model was reproduced and the missing Leon Edwards row was reconstructed from the same pinned source and approved mechanics.

The work remains shadow-only on draft PR #39. The published app is unchanged.

Final validation:

- Canonical fighters audited: **73**
- Empirical or approved factual-completion rows: **73/73**
- Frozen runtime controls preserved: **72**
- Approved factual completions: **1 — Leon Edwards**
- Clean rows: **73**
- Missing source rows: **0**
- Formula issues: **0**
- Control issues: **0**
- Review queue: **0**
- Live ranking payload changed: **No**

## Category purpose

Division-Era Depth measures how difficult it was to remain elite in a fighter’s UFC division during the fighter’s approved shared elite-prime window. It is an era adjustment, not a general old-versus-new penalty and not a substitute for opponent quality.

## Locked empirical model

The model uses quarterly division snapshots and three components:

1. **Qualified active pool — 30%**
2. **Strength of ranks 6–15 by division-specific Elo — 50%**
3. **Contender diversity — 20%**

Every UFC fight inside the fighter’s approved elite-prime window is sampled at the nearest prior quarterly snapshot. Title fights receive **1.5× weight**. Open primes receive a terminal modern snapshot.

Each division is normalized against its own recent mature baseline. This avoids treating heavyweight as weak merely because lightweight has more fighters.

## Locked adjustment curve

- Below 1.00: `-3 × ((1.00 - depthIndex) / 0.25)^1.5`, capped at **-3.00**.
- Above 1.00: `(depthIndex - 1.00) × 20`, capped at **+0.75**.

## Phase-source rule

The frozen 72-fighter artifact remains unchanged. Any fighter added after that artifact must use the approved shared **Fighter Era Ledger** as the controlling phase source.

A fighter-local `primeWindow` may remain visible for audit comparison, but it does not override a later Cody-approved shared-era resolution.

## Critical separation

Division-Era Depth and division strength remain separate:

- **Division strength** is the reviewed contextual treatment associated with a fighter or era, such as modern lightweight or GSP-era welterweight.
- **Division-Era Depth** compares the active pool, middle-tier Elo strength, and contender diversity of the same division across time.

The reconstruction records each fighter’s canonical `divisionStrength.defaultKey` for context but never multiplies it into the era-depth adjustment.

## Women’s featherweight

Women’s featherweight is excluded from empirical sampling because it never maintained a viable ranks-6–15 baseline.

- Mixed careers use non-WFW samples.
- Pure WFW careers receive a neutral **0.00** era-depth adjustment.

## Leon Edwards factual completion

Leon was the only fighter missing from the frozen 72-fighter empirical artifact.

- Approved shared era: **Rafael dos Anjos on July 20, 2019 through Sean Brady on March 22, 2025**
- Endpoint logic: the Belal Muhammad loss did not close the window because Leon remained elite and entered the Brady fight; Brady is the approved unrecovered endpoint
- Division sampled: **Welterweight**
- Matched prime fights: **8**
- Title-weighted fights: **4**
- Qualified-active-pool ratio: **1.0071**
- Ranks 6–15 Elo ratio: **0.9952**
- Contender-diversity ratio: **1.0173**
- Depth index: **1.0032**
- Locked curved adjustment: **+0.06**

The reconstruction regenerated the pinned empirical source and reproduced all **69 directly comparable non-WFW frozen rows with zero mismatches** before accepting Leon’s result. The three WFW-influenced rows remain governed by the separately locked WFW-safe treatment.

Leon’s older fighter-local endpoint at Belal Muhammad is retained as non-controlling audit context only.

Classification: **factual completion**. No model weight, source, baseline, curve, title weighting, WFW treatment, or division-strength rule was changed.

## Locked architecture

`pinned UFCStats-derived fight source + approved shared Fighter Era Ledger windows + approved empirical mechanics + explicit factual completions → validated Division-Era Depth adjustment`

The approved factual-completion layer is:

`assets/data/canonical-division-era-depth-approved-resolutions.js`

The full reconstruction is:

`assets/data/canonical-division-era-depth-reconstruction.js`

## Change policy

Any future change to the source dataset, component definitions, weights, Elo rules, baseline window, shared prime window, title weighting, WFW treatment, or adjustment curve requires Cody’s explicit approval and a passing full-roster shadow audit.

New completed UFC fights may trigger future source refreshes for active fighters, but they must not silently alter the locked model.

## Safety and next phase

- Category logic and current 73-fighter reconstruction: **locked**
- Shadow validation: **passing**
- Writes to live `RANKING_DATA`: **none**
- Total-score, rank, OVR, profile, or Compare Mode changes: **none**
- Draft PR #39 remains the only target
- Next phase: reconstruct final category ownership, calculated totals, rank ordering, and OVR while preserving the frozen live payload until Cody approves promotion
