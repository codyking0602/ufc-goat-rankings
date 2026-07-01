# UFC GOAT App Compare Mode

This file is the source map for Compare Mode. Use it when continuing the app in a new chat.

## Current goal

Compare Mode should feel like a polished debate card, not a spreadsheet.

The output should usually show:

1. Two clean fighter cards.
2. A headline verdict.
3. The losing fighter's best argument.
4. Why the winner still wins.
5. A short final take.

The main Compare output should stay natural and group-chat friendly. Category numbers can support the engine, but they should not become the main visual experience unless Cody asks for a drill-down.

## Active Compare stack

These are the Compare files that matter right now:

1. `assets/compare-data.js`
   - Base `COMPARE_PROFILES` and `COMPARE_FIGHT_LEDGER`.
   - Use this for core legends and consolidated compare data.

2. `assets/compare-coverage-pack-1.js`
   - Additional compare profile coverage.

3. `assets/compare-coverage-pack-2.js`
   - Additional compare profile coverage.

4. `assets/compare-phase2-yan.js`
   - Phase 2 add-on pack for Petr Yan, Merab Dvalishvili, and Aljamain Sterling compare context.
   - Includes Yan/Sterling and Yan/Merab fight ledger entries.

5. `assets/compare-mode.js`
   - Special marquee matchup copy.
   - Use this only for a small number of debates people are likely to spam, such as Jones/GSP or Khabib/Islam.
   - Do not create thousands of hardcoded matchups.

6. `assets/compare-engine-v1-5.js`
   - Main generic Compare engine.
   - Reads fighter data, compare profiles, fight ledger entries, rankings, scores, and category edges.
   - Builds generic debate copy when no special matchup override exists.

7. `assets/compare-copy-fixes-v1.js`
   - Tone cleanup and best-argument copy fixes.
   - Use this for small wording cleanup, not structural logic.

## Load order

The Pages workflow injects the active Compare stack in this order:

```html
<script src="assets/compare-data.js"></script>
<script src="assets/compare-coverage-pack-1.js"></script>
<script src="assets/compare-coverage-pack-2.js"></script>
<script src="assets/compare-phase2-yan.js"></script>
<script src="assets/compare-mode.js"></script>
<script src="assets/compare-engine-v1-5.js"></script>
<script src="assets/compare-copy-fixes-v1.js"></script>
```

The safe preview also inlines these same files in the same order.

## How to add a fighter to Compare Mode

For every fighter added to the ranking app:

1. Add or update ranking/profile data.
2. Add a `COMPARE_PROFILE` entry with reusable fighter identity.
3. Add `COMPARE_FIGHT_LEDGER` entries only for actual direct fights or true rivalries.
4. Add a special matchup override only for a high-interest debate that needs custom wording.

## COMPARE_PROFILE fields

Useful fields include:

- `shortCase`
- `peak`
- `resume`
- `championship`
- `opponentQuality`
- `longevity`
- `counter`
- `edge`
- `signatureWins`
- `weakness`
- `titleSummary`
- `primeSummary`
- `titleStyle`
- `primeStyle`
- `legacyStats`

`legacyStats` can include:

- `titleFightWins`
- `beltsWon`
- `titleDefenses`
- `activeEliteYearsLabel`
- `primeNote`

## COMPARE_FIGHT_LEDGER rules

Use the fight ledger only when fighters actually fought or when a real direct rivalry exists.

A ledger entry should include:

- `fighters`
- `fights`
- `winner`
- `importance`
- `summary`

Use `winner: "Split"` for split series.

Examples:

- Yan vs Sterling belongs in the ledger because they fought twice and the DQ context matters.
- Yan vs Merab belongs in the ledger because they fought twice and the rivalry is split.
- Jones vs GSP does not belong in the ledger because they never fought. That should be handled by profile data and, if desired, a special marquee matchup.

## Special matchup rules

Special hardcoded copy is allowed, but only for marquee debates people are likely to use repeatedly.

Good examples:

- Jon Jones vs Georges St-Pierre
- Khabib Nurmagomedov vs Islam Makhachev
- Alexander Volkanovski vs Max Holloway
- Anderson Silva vs Demetrious Johnson

Bad examples:

- Random mid-card comparisons.
- Thousands of pair-specific blurbs.
- Any direct fight context that should live in `COMPARE_FIGHT_LEDGER` instead.

## Deleted old Compare files

During Phase 2C, older unused Compare files were removed from the safe branch so future chats do not get confused by stale engines or old data packs.

Removed examples include:

- `compare-engine-v1-2.js`
- `compare-engine-v1-3.js`
- `compare-engine-v1-4.js`
- `compare-angle-engine-v1.js`
- `compare-angle-engine-v1-1.js`
- `compare-profile-enhancements-v1-1.js`
- `compare-title-prime-v1-2.js`
- `compare-legacy-stats-v1-3.js`
- `compare-fight-ledger-v1-2.js`
- `compare-profiles.js`

Do not resurrect those old files unless there is a very specific reason.

## Current restructuring rule

Do not add large new fighter batches until the structure is clean.

Current priority:

1. Clean Compare stack.
2. Clean ranking/profile data structure.
3. Then add the next fighter batch through the proper structure.
