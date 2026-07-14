# Longevity Reconstruction

_Status: shadow-only reconstruction on PR #39. Nothing in this category is promoted live by these files._

## Control audit

Longevity currently has four separate historical paths. They must not be confused:

1. **Frozen live authority** — `assets/data/canonical-scoring-records.js` stores the approved `/30` Longevity values. `assets/js/scoring-engine.js` reapplies those values before calculating the current total, rank, and OVR.
2. **Recovered approved formula** — `assets/data/longevity-shadow-scorer.js` calculates:

   `score = min(30, ((gapAdjustedMonths × statusMultiplier × divisionMultiplier) / 144) × 30)`

3. **Legacy input mutation** — `assets/data/longevity-canonical-recalculation.js` overwrites Era Ledger Longevity inputs for 11 fighters. Some of those overrides use older category-local windows that now conflict with the shared Fighter Era Ledger. This file is evidence only for the reconstruction and must not control it.
4. **Rejected Phase Two prototype** — `canonical-fighter-facts.js` derives active years from each record's local `primeWindow`; `canonical-phase-two-shadow.js` then uses an 11.5-year benchmark and omits the division multiplier. That path is diagnostic, not approved.

The canonical reconstruction keeps the approved 144-month formula while replacing the drifting phase source with `assets/data/fighter-era-ledgers.js`.

## Approved philosophy recovered

Longevity measures **sustained active elite UFC relevance**, not total career length and not simple start-to-end calendar time.

A fighter receives credit only for time inside the shared Fighter Era Ledger window. The calculator builds that time from consecutive UFC fight dates. Each inactivity interval is capped at 18 months, preventing injury, retirement, suspension, negotiation, or comeback gaps from producing unlimited calendar credit.

Non-UFC fights and accomplishments are never included.

## Canonical formula

1. Resolve the fighter's start and end exclusively from `fighter-era-ledgers.js`.
2. Collect UFC fight dates inside that shared window.
3. Sum every interval between those UFC appearances, with each interval capped at 18 months.
4. For an open/current window, add time from the latest UFC fight through the canonical model as-of date, also capped at 18 months.
5. Apply the explicit recovered judgment multipliers stored in the Era Ledger.
6. Convert the result to the category score:

   `counted elite months = gap-capped active UFC elite months × status multiplier × division multiplier`

   `Longevity = min(30, counted elite months / 144 × 30)`

### 30/30 benchmark

A fighter reaches 30/30 at **144 multiplier-adjusted active elite months**, equivalent to 12 counted years.

The ceiling is intentionally difficult. A short dominant prime cannot reach an elite Longevity score merely through status or division strength; it still needs substantial active time.

## What is an active elite year?

One active elite year is 12 credited months generated from UFC activity inside the shared elite-prime window.

This is not a count of calendar years containing at least one fight. It is elapsed active time between UFC appearances, with every gap capped. That preserves long elite relevance without rewarding unlimited inactivity.

No-contest UFC appearances remain activity anchors because Longevity measures active elite presence. They do not receive result or accomplishment credit in this category.

## Open/current windows

Open primes accrue through `UFC_CANONICAL_FIGHTER_FACTS.modelAsOfDate`, not through the browser's current date. This keeps audit results deterministic.

The tail from the latest UFC appearance to the model as-of date is capped at 18 months. An inactive current fighter therefore cannot continue accumulating indefinitely.

## Retirement and comeback gaps

The universal rule remains 18 months per gap.

Examples:

- Georges St-Pierre's retirement/comeback interval is capped.
- Jon Jones' long inactive periods are capped.
- Dominick Cruz's injury gaps are capped.
- Henry Cejudo's retirement gap is capped.

A fighter can still preserve one connected shared Era Ledger window when later UFC results re-prove elite relevance, but the inactive calendar time itself is not fully rewarded.

## Recovered judgment inputs

### Status multiplier

The frozen approved model uses fighter-level status multipliers. They remain explicit in `fighter-era-ledgers.js` and are reported for every fighter.

They are preserved during reconstruction because removing them would be a model change, not an architecture cleanup.

### Division multiplier

The frozen approved model also applies division strength directly inside Longevity. The reconstruction preserves that behavior and reports the multiplier separately.

Moving division strength outside Longevity may be a reasonable future simplification, but it is a **proposed model change requiring Cody's approval**.

### Manual adjustments

The canonical calculator uses no hidden fighter-level numeric adjustment. The only numeric judgment inputs are the explicit status and division multipliers.

Notes and historical adjustment explanations are retained as audit context but do not silently alter the result.

## Difference classifications

Every meaningful difference is classified under the locked doctrine:

1. **Factual correction** — the frozen or stored months came from a stale/local window, a wrong date, an uncapped gap, or another traceable factual mismatch.
2. **Recovered judgment** — an approved status or division multiplier was previously hidden or fragmented and is now explicit.
3. **Proposed model change requiring Cody approval** — changing the 18-month cap, the 144-month benchmark, the status multiplier system, or direct division treatment.

## Known legacy-patch conflicts

The old recalculation file contains 11 comparison-only overrides:

- Dustin Poirier: 73.6 months, Justin Gaethje I through Islam Makhachev
- Justin Gaethje: 67.6 months, James Vick through Max Holloway
- Israel Adesanya: 64.2 months, Kelvin Gastelum through Dricus du Plessis
- Ronda Rousey: 46.2 months, Liz Carmouche through Amanda Nunes
- Randy Couture: 128.7 months, Vitor Belfort I through Brock Lesnar, neutral status multiplier
- Chuck Liddell: 59.1 months, Vitor Belfort through Quinton Jackson II
- T.J. Dillashaw: 88.8 months, Renan Barao I through Aljamain Sterling
- Aljamain Sterling: 85.1 months, Pedro Munhoz through current elite form
- Sean Strickland: 59.3 months, Uriah Hall through current elite form
- Robert Whittaker: 94.9 months, Derek Brunson through Khamzat Chimaev
- Dan Henderson: 64.2 months, Rich Franklin through Daniel Cormier

These values help explain the frozen scores. They never override the shared Era Ledger in the new calculator.

Randy Couture is the clearest benchmark: the frozen 25.74 score reflects the old 1997 Vitor Belfort I start. The current shared Era Ledger begins at Vitor Belfort II on August 21, 2004. The reconstruction must report that large factual delta rather than silently preserving the old category-local window.

## Required benchmark checks

The automated audit inspects all 73 canonical fighters and explicitly checks:

- Jon Jones — Bader through Gane; long gaps capped
- Georges St-Pierre — Hughes II through Bisping; retirement gap capped
- Demetrious Johnson — UFC flyweight window only; ONE excluded
- Anderson Silva — Leben through Weidman II
- Jose Aldo — Mark Hominick through Merab Dvalishvili; WEC excluded
- Khabib Nurmagomedov — Rafael dos Anjos through Gaethje
- Alexander Volkanovski — Aldo through open/current championship form
- Max Holloway — long modern featherweight relevance
- Kamaru Usman — Demian Maia through Leon Edwards III
- Dominick Cruz — UFC-only window; injury gaps capped; WEC excluded
- Stipe Miocic — Mark Hunt through Ngannou II; late Jones fight excluded
- Daniel Cormier — Dan Henderson through Stipe III; Strikeforce excluded
- Islam Makhachev — Drew Dober through open/current title-level form
- Charles Oliveira — Kevin Lee through open/current elite form
- Royce Gracie — short original UFC tournament-era window
- Frank Shamrock — short perfect UFC title-prime; non-UFC career excluded
- Kayla Harrison — short open UFC sample cannot receive excessive credit
- Randy Couture — shared 2004 start must replace the old 1997 category-local start

## Full-roster coverage and missing input

The canonical fight-fact roster contains 73 fighters. The current shared Fighter Era Ledger contains 72.

Leon Edwards is not silently excluded. The reconstruction includes him in the audit and reports the missing Era Ledger window and multiplier judgments as unresolved inputs. He cannot receive a reconstructed Longevity score until those shared inputs are approved.

## Safety guarantees

The reconstruction:

- does not write to `RANKING_DATA`
- does not change live category values
- does not change totals, ranks, or OVRs
- does not change profiles or Compare Mode
- does not load the legacy mutating recalculation file as a prerequisite
- fails tests if fighter-local `primeWindow` or `longevityContext` changes the reconstructed result
- records all intervals, caps, multipliers, stored values, frozen values, and deltas for audit

## Files

- `assets/data/canonical-longevity-reconstruction.js`
- `scripts/test-canonical-longevity-reconstruction.mjs`
- `.github/workflows/canonical-longevity-reconstruction.yml`
- `docs/LONGEVITY_RECONSTRUCTION.md`

The workflow also generates and uploads:

- `docs/canonical-longevity-reconstruction.json`
- `docs/canonical-longevity-reconstruction.md`

No live promotion should occur until Cody reviews the meaningful-delta report and approves any unresolved judgment inputs or true formula changes.
