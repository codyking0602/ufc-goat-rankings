# Production Scoring Architecture

## Goal

Promote the approved 73-fighter UFC-only calculated model into the permanent app architecture without changing any approved category score, total, rank, or OVR.

The permanent rule is simple:

> Fight-level facts and approved judgment inputs calculate every score. Presentation files may describe the result, but may never own it.

## Current architectural blocker

The shadow reconstruction is approved, but the current runtime `assets/js/scoring-engine.js` still reads frozen expected category inputs, totals, ranks, and OVRs from `assets/data/canonical-scoring-records.js`.

That file is valid as a migration-parity control, but it cannot remain production authority. A fight-level change currently does not flow through the approved reconstruction chain unless the frozen control is also edited.

## Permanent ownership map

### 1. Canonical fight facts

Permanent owner: `assets/data/canonical-fighter-facts.js`

Owns:

- fighter identity and UFC-only coverage
- complete UFC fight ledger
- official result and scoring disposition
- reviewed opponent-quality classification
- championship context
- prime-window boundaries
- loss classification
- division-strength segments
- audited round rows

Never owns:

- category totals
- total score
- rank
- OVR
- hand-written aggregate stats

### 2. Approved judgment inputs

Permanent target: `assets/data/canonical-scoring-judgments.js`

Consolidates the approved resolution overlays that cannot be represented directly as fight facts, including:

- championship rule resolutions
- opponent-quality caps or explicit approved credits
- prime sample/tournament rules
- longevity resolutions
- loss-context resolutions
- Apex judgments
- division-era-depth resolutions

These are calculator inputs, not calculated outputs.

### 3. Category calculators

Permanent target: `assets/js/category-calculators.js`

Owns the seven independent calculations:

1. Championship
2. Opponent Quality
3. Prime Dominance
4. Longevity
5. Loss Penalty
6. Apex
7. Division-Era Depth

Each calculator consumes canonical facts plus approved judgment inputs and returns a traceable fighter result. No calculator writes to `RANKING_DATA`.

### 4. Total, rank, OVR, and app projection

Permanent owner: `assets/js/ranking-pipeline.js`

Owns:

- 35 / 25 / 30 / 10 weighted total
- Apex, Loss Penalty, and Division-Era Depth modifiers
- separate men’s and women’s ranking order
- fixed-anchor 82–99 OVR calculation
- leaderboard projection
- profile calculated fields
- visible calculated stats
- Compare Mode calculated fields
- game/snapshot calculated fields

`RANKING_DATA` becomes a runtime projection produced by this pipeline, not a hand-maintained scoring source.

### 5. Presentation-only content

Keep separate:

- `assets/data/display-overrides.js`: profile copy, one-liners, photo paths, Watch Moment labels/links, presentation labels
- Compare Profile files: narrative copy only
- direct-fight ledgers: real direct fights/rivalries only
- `assets/fighters/`: real fighter image files

Presentation files may not contain category scores, totals, ranks, OVRs, or calculated visible stats.

## Keep / consolidate / delete plan

### Keep permanently

- `assets/data/canonical-fighter-facts.js` schema, validation, registration, and derivation API
- the 73 approved fighter ledgers and 1,366 fight rows
- approved fight-level corrections
- approved scoring doctrine and final new-fighter workflow documentation
- presentation-only profile copy, one-liners, photos, Watch Moments, Compare Profile copy, and real direct-fight ledgers
- one production architecture workflow and one full regression workflow

### Consolidate before promotion

- arbitrary `canonical-fighter-facts-batch-*` files into permanent fighter-fact ownership
- `*-approved-resolutions.js`, `*-approved-judgments*.js`, and rule-lock overlays into one judgment-input owner
- seven `canonical-*-reconstruction.js` files into one calculator module with seven exported calculators
- `canonical-final-score-reconstruction.js`, `canonical-ovr-reconstruction.js`, `scoring-engine.js`, and `scoring-ownership-finalizer.js` into `ranking-pipeline.js`
- calculated profile/stat bridges into the ranking pipeline
- duplicated score stripping/ownership guards into one architecture assertion
- category-specific test workflows into a smaller production test matrix

### Delete only after the permanent pipeline passes

- `canonical-scoring-records.js` as production authority; retain only an archived test fixture until exact-output certification is complete
- `canonical-phase-two-shadow.js` and calibration-only shadow controls
- arbitrary batch loader logic in `ranking-data-patches.js`
- batch-specific workflows and capture scripts
- obsolete live/shadow compatibility layers for loss context, division-era depth, championship, prime dominance, and score weighting
- stale handoff and board-review documents superseded by the final architecture and workflow
- frozen expected totals, ranks, and OVRs as runtime inputs

## Promotion sequence

1. Build `ranking-pipeline.js` against the approved reconstruction outputs without wiring it into the live page.
2. Prove the pipeline generates all 73 leaderboard and profile rows with the exact approved outputs.
3. Replace frozen-control authority in the runtime scoring engine.
4. Make app, Compare Mode, and Play consume the calculated projection.
5. Run browser regression and architecture guardrails.
6. Remove migration scaffolding in small groups, rerunning the complete suite after each removal.
7. Show the final file tree, exact rankings/OVRs, regression results, and unrelated Picks smoke investigation to Cody.
8. Keep PR #39 draft and do not merge until explicit approval.

## Final new-fighter workflow

1. Add the fighter’s complete UFC-only fight ledger to canonical fighter facts.
2. Add only necessary approved judgment inputs that cannot live on fight rows.
3. Add presentation-only profile copy and real photo paths after files exist.
4. Add a Compare Profile; add a direct-fight ledger only for a real fight/rivalry.
5. Run schema, seven-category, total/rank, OVR, architecture, and browser tests.
6. Confirm the fight-level input automatically reaches leaderboard, profile, visible stats, Compare Mode, and games.
7. Add fighters in small batches and review output before promotion.
