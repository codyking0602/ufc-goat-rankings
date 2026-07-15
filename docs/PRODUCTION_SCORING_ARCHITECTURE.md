# Production Scoring Architecture

## Goal

Promote the approved 73-fighter UFC-only calculated model into the permanent app architecture without changing any approved category score, total, rank, or OVR.

The permanent rule is simple:

> Fight-level facts and approved judgment inputs calculate every score. Presentation files may describe the result, but may never own it.

## Current production state

The production ranking runtime no longer reads frozen expected category scores, totals, ranks, or OVRs as authority.

`assets/data/canonical-scoring-records.js` and the old reconstruction modules remain migration/test history only. The page now reaches the calculated ranking through the production loader, category calculators, ranking pipeline, and calculated profile runtime.

Manual snapshot ownership, hard-coded Compare stats, late profile-stat mutation, and direct migration scoring tags have been removed from the production path. The permanent architecture and rendered app are certified independently.

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

Permanent owner: `assets/data/canonical-scoring-judgments.js`

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

Permanent owner: `assets/js/category-calculators.js`

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

`RANKING_DATA` is a runtime projection produced by this pipeline, not a hand-maintained scoring source.

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

### Consolidated for production

- approved judgment inputs into `canonical-scoring-judgments.js`
- seven calculations into `category-calculators.js`
- total, rank, OVR, and projection ownership into `ranking-pipeline.js`
- calculated profile/snapshot presentation into `calculated-profile-runtime.js`
- production prerequisite loading into the presentation-only `ranking-data-patches.js` handoff
- architecture ownership checks into the permanent source-boundary and browser guardrails

### Migration history still eligible for later deletion

- frozen parity controls and reconstruction-only modules not loaded by production
- arbitrary fact-batch storage once the ledgers are physically consolidated
- category-specific reconstruction workflows and capture scripts
- stale handoff/review documents superseded by this architecture

Delete these only in small groups with the permanent pipeline and browser suite rerun after each group.

## Completed promotion sequence

1. Built the permanent category and ranking pipeline against canonical facts and judgment inputs.
2. Certified all 73 leaderboard and profile rows without frozen-output authority.
3. Replaced runtime score, rank, and OVR ownership.
4. Redirected leaderboard, profile snapshots, Compare Mode, and Play to calculated projection rows.
5. Removed manual snapshot and Compare stat ownership from presentation files.
6. Removed direct migration scoring/audit tags from `index.html`.
7. Added physical source-boundary and rendered browser contract tests.
8. Kept PR #39 draft and unmerged pending Cody’s explicit approval.

## Final new-fighter workflow

1. Add the fighter’s complete UFC-only fight ledger to canonical fighter facts.
2. Add only necessary approved judgment inputs that cannot live on fight rows.
3. Add presentation-only profile copy and real photo paths after files exist.
4. Add a Compare Profile; add a direct-fight ledger only for a real fight/rivalry.
5. Run schema, seven-category, total/rank, OVR, architecture, and browser tests.
6. Confirm the fight-level input automatically reaches leaderboard, profile, visible stats, Compare Mode, and games.
7. Add fighters in small batches and review output before promotion.

## Promotion checkpoint — July 15, 2026

- production projection: 73 fighters, complete
- source ownership certification: passing
- full rendered ranking regression: passing
- calculated snapshots: active; no `DISPLAY_OVERRIDES.snapshot` fallback ownership
- calculated Compare stats: active; narrative copy remains presentation-only
- production shell: no frozen scoring, reconstruction, or late stat-mutation tags
- PR #39: draft, open, unmerged
- published `main`: unchanged
