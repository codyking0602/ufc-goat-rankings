# Loss Context Reconstruction

## Status

Loss Context is being reconstructed on draft PR #39 as a shadow-only category audit. The published app and canonical scoring authority remain unchanged.

The approved model is the judgment-locked hybrid system introduced in July 2026. This work does **not** replace it with a simple additive loss total.

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

Post-prime losses receive zero penalty. No contests are excluded. Jon Jones' Matt Hamill disqualification remains visible as an official technical result but receives no competitive loss penalty.

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

## Reconstruction architecture

The clean target pipeline is:

`canonical UFC loss facts + shared Fighter Era Ledger + explicit reviewed exceptions -> raw loss rules -> approved hybrid calculator -> frozen-control comparison`

The reconstruction uses:

- `assets/data/canonical-fighter-facts*.js` for official results, opponent tiers, methods, division context, and competitive/technical classification;
- `assets/data/fighter-era-ledgers.js` plus approved shared-window resolutions for phase boundaries;
- `assets/data/canonical-scoring-records.js` only as a frozen comparison control;
- `assets/data/canonical-loss-context-reconstruction.js` as the new shadow calculator.

It deliberately does not use fighter-local `primeWindow` values to determine loss phase. The shared Fighter Era Ledger controls phase across Prime Dominance, Longevity, and Loss Context.

## What this replaces

The existing runtime model still depends on:

- a free-text Era Ledger loss adapter,
- production-only completion patches for selected fighters,
- a hand-maintained closed-window exposure table,
- and separate shadow/audit/evidence modules.

The reconstruction derives loss events and through-prime exposure directly from the complete 73-fighter canonical fight ledgers. It does not mutate the existing runtime modules yet.

## Review doctrine

Every meaningful difference from the frozen penalty must be classified as one of:

1. **Factual correction** — complete fight history, method, date, result, or phase evidence fixes the old output.
2. **Recovered judgment** — an approved opponent-quality, technical-result, division, or phase judgment is made explicit.
3. **Proposed model change** — any alteration to the hybrid formula or locked loss values requires Cody's explicit approval.

The initial workflow produces a full-roster JSON and Markdown audit with exact parity, meaningful deltas, technical exceptions, post-prime exclusions, component scores, and the pending review queue.

## Safety

- Shadow-only
- No writes to `RANKING_DATA`
- No penalty promotion
- No final-score, rank, OVR, profile, or Compare Mode changes
- Draft PR remains the only target
