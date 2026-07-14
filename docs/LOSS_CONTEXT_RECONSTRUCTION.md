# Loss Context Reconstruction

## Status

Loss Context is reconstructed on draft PR #39 as a shadow-only category audit. The published app and canonical scoring authority remain unchanged.

The approved model is the judgment-locked hybrid system introduced in July 2026. This work does **not** replace it with a simple additive loss total.

On July 14, 2026, Cody approved all ten remaining audit decisions. The reconstruction now has 73-fighter Era Ledger coverage, 73 effective approved controls, and no unresolved decision rows.

## Approved philosophy

Loss Context should punish damaging UFC losses without treating every loss equally or allowing a long career to erase repeated prime defeats.

It distinguishes:

- pre-prime versus prime versus post-prime losses,
- champion/top-five opponents versus lower-level opponents,
- decision losses versus finishes,
- normal home-division losses versus upward-division elite losses,
- competitive losses versus technical or weird official results,
- isolated severe losses versus repeated prime-loss volume,
- and the amount of UFC exposure accumulated before or during the fighter's elite-prime window.

Post-prime losses receive zero penalty. No contests are excluded. Jon Jones' Matt Hamill disqualification and Petr Yan's Aljamain Sterling disqualification remain visible as official technical results but receive no competitive loss penalty.

## Locked fight-level rules

- Pre-prime loss to champion/top-five: **-0.75**
- Pre-prime loss to non-elite: **-1.25**
- Prime loss to champion/top-five: **-1.50**
- Prime loss to non-elite: **-4.00**
- Finished in a counted loss: additional **-0.75**
- Post-prime loss: **0**
- Prime upward-division loss to champion/top-five: **-0.75**
- Finished upward-division against champion/top-five: additional **-0.50**

These values create the raw loss burden. They are not directly summed into the final app penalty.

## Approved hybrid formula

1. **Worst-loss severity**
   - Average the two largest counted raw loss magnitudes.
   - Cap at **3.50**.

2. **Loss frequency**
   - Divide total counted raw loss burden by official UFC appearances before or during the shared elite-prime endpoint.
   - Multiply by **3.00**.
   - Cap at **2.50**.

3. **Hybrid base**
   - Severity plus frequency.

4. **Repeated-prime-loss floor**
   - **0.75** per counted prime loss.
   - Additional **0.25** per prime finish loss.
   - Cap at **5.25**.
   - Use the larger of the hybrid base or the prime-loss floor.

5. **Overall cap**
   - Cap the completed burden at **6.00**.

6. **Strong-division relief**
   - Strong divisions can reduce the completed burden by up to **15%**.
   - Weak divisions receive no additional punishment through this layer.

The final score is stored as a negative modifier between **0.00 and -6.00**.

## Approved July 14 resolutions

| Fighter | Approved Loss Context | Resolution |
|---|---:|---|
| Randy Couture | **-5.25** | Shared prime begins at Vitor Belfort I on May 30, 1997. |
| Israel Adesanya | **-3.52** | Correct Dricus du Plessis endpoint to August 18, 2024; retain the approved control within an explicit 0.02 complete-exposure tolerance. |
| Chael Sonnen | **-4.75** | Accept the clean canonical reconstruction with no unsupported division relief. |
| Sean Strickland | **-3.42** | Shared prime begins at Uriah Hall on July 31, 2021. |
| Jessica Andrade | **-4.08** | Replace the stale 19-fight exposure count with 23 canonical UFC appearances through Erin Blanchfield. |
| Miesha Tate | **-4.50** | Apply the approved Rousey II through Amanda Nunes shared window. |
| Francis Ngannou | **-1.07** | Treat Stipe Miocic and Derrick Lewis as pre-prime elite decision losses. |
| Tito Ortiz | **-3.82** | Apply the approved Machida endpoint and 21-fight through-prime exposure. |
| Benson Henderson | **-3.26** | Use the locked 1.05 division multiplier rather than maximum relief. |
| Leon Edwards | **-2.61** | Create the first approved canonical Loss Context control. |

The shared Era Ledger amendments are stored separately from the score decisions so phase corrections remain reusable by Prime Dominance and Longevity.

## Reconstruction architecture

The clean target pipeline is:

`canonical UFC loss facts + shared Fighter Era Ledger + explicit reviewed exceptions -> raw loss rules -> approved hybrid calculator -> approved control comparison`

The reconstruction uses:

- `assets/data/canonical-fighter-facts*.js` for official results, opponent tiers, methods, division context, and competitive/technical classification;
- `assets/data/fighter-era-ledgers.js` plus approved shared-window resolutions for phase boundaries;
- `assets/data/fighter-era-ledger-approved-loss-context-resolutions.js` for Randy Couture, Israel Adesanya, and Sean Strickland phase corrections;
- `assets/data/canonical-loss-context-approved-resolutions.js` for the ten approved controls and decision provenance;
- `assets/data/canonical-scoring-records.js` only as the historical frozen comparison control;
- `assets/data/canonical-loss-context-reconstruction.js` as the shadow calculator.

It deliberately does not use fighter-local `primeWindow` values to determine loss phase. The shared Fighter Era Ledger controls phase across Prime Dominance, Longevity, and Loss Context.

## What this replaces

The existing runtime model still depends on:

- a free-text Era Ledger loss adapter,
- production-only completion patches for selected fighters,
- a hand-maintained closed-window exposure table,
- and separate shadow/audit/evidence modules.

The reconstruction derives loss events and through-prime exposure directly from the complete 73-fighter canonical fight ledgers. It does not mutate the existing runtime modules yet.

## Review doctrine

Every meaningful difference from the historical frozen penalty is classified as one of:

1. **Factual correction** — complete fight history, method, date, result, exposure, or phase evidence fixes the old output.
2. **Recovered judgment** — an approved opponent-quality, technical-result, division, or phase judgment is made explicit.
3. **Proposed model change** — any alteration to the hybrid formula or locked loss values requires Cody's explicit approval.

No fighter-specific hidden numeric adjustment is used. Adesanya's retained -3.52 control is explicitly documented as a two-hundredths frozen-control tolerance after the complete 17-fight exposure produces -3.50.

## Safety

- Shadow-only
- No writes to `RANKING_DATA`
- No penalty promotion
- No final-score, rank, OVR, profile, or Compare Mode changes
- Draft PR remains the only target
