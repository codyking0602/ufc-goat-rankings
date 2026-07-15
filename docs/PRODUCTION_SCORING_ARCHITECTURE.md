# Production Scoring Architecture

## Goal

Promote the approved 73-fighter UFC-only calculated model into the permanent app architecture without changing any approved category score, total, rank, or OVR.

The permanent rule is simple:

> Fight-level facts and approved judgment inputs calculate every score. Presentation files may describe the result, but may never own it.

## Current production state

The production ranking runtime no longer reads frozen expected category scores, totals, ranks, or OVRs as authority.

`assets/data/canonical-scoring-records.js` and the old reconstruction modules remain migration/test history only. The page now reaches the calculated ranking through the production loader, category calculators, ranking pipeline, calculated profile runtime, automatic division allocation, and derived-output packaging.

Manual snapshot ownership, hard-coded Compare stats, manual division sample shares, late profile-stat mutation, and direct migration scoring tags have been removed from the production path. The permanent architecture and rendered app are certified independently.

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

### 5. Automatic derived outputs

Division owner: `assets/js/division-ranking-pipeline.js`

Division normalization owner: `assets/js/division-ranking-reconciliation.js`

Octagon Verdict packager: `tools/build-octagon-verdict-data.js`

These outputs consume the completed calculated runtime; they never create or override the main score.

Division boards allocate each weighted category using its actual canonical fight-level evidence:

- Championship follows title evidence by fight division.
- Opponent Quality follows counted quality-win credit by fight division.
- Prime Dominance follows prime-window UFC fights by division.
- Longevity follows counted elite-time intervals by division.
- Apex follows the selected Apex performances.
- Loss Penalty follows the applicable loss events.
- Division-Era Depth follows the fighter’s scored UFC fight evidence.

The sum of every fighter’s division scores must reconcile to that fighter’s overall calculated score. Only decimal rounding residue may be normalized. A meaningful unexplained multi-division gap blocks production. Unsupported historical UFC classes such as openweight may roll into a fighter’s sole app-facing division, but never through a fighter-specific hard-coded exception.

The Octagon Verdict knowledge package is rebuilt from the same browser runtime and includes:

- all 73 calculated fighter records
- current ranks, OVRs, total scores, categories, and visible stats
- all eight automatic men’s division boards
- division-only fighter rows and scores
- presentation-only Compare arguments
- real direct-fight context where it exists

The higher `totalScore` remains the UFC-only GOAT verdict. Division-only questions compare the matching automatic `divisionScore`. A real head-to-head winner is context and never overrides the ranking verdict.

### 6. Presentation-only content

Keep separate:

- `assets/data/display-overrides.js`: profile copy, one-liners, photo paths, Watch Moment labels/links, presentation labels
- Compare Profile files: narrative copy only
- direct-fight ledgers: real direct fights/rivalries only
- `assets/fighters/`: real fighter image files

Presentation files may not contain category scores, totals, ranks, OVRs, calculated visible stats, or manual division scores.

## Keep / consolidate / delete plan

### Keep permanently

- `assets/data/canonical-fighter-facts.js` schema, validation, registration, and derivation API
- the 73 approved fighter ledgers and 1,366 fight rows
- approved fight-level corrections
- approved scoring doctrine and final new-fighter workflow documentation
- automatic division allocation and Octagon Verdict packaging
- presentation-only profile copy, one-liners, photos, Watch Moments, Compare Profile copy, and real direct-fight ledgers
- one production architecture workflow and one full browser/derived-output regression workflow

### Consolidated for production

- approved judgment inputs into `canonical-scoring-judgments.js`
- seven calculations into `category-calculators.js`
- total, rank, OVR, and projection ownership into `ranking-pipeline.js`
- calculated profile/snapshot presentation into `calculated-profile-runtime.js`
- division evidence allocation into `division-ranking-pipeline.js`
- automatic Octagon packaging into `build-octagon-verdict-data.js`
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
5. Replaced manual division guardrails with canonical fight-level category allocation.
6. Rebuilt Octagon Verdict from the fully calculated browser runtime.
7. Removed manual snapshot and Compare stat ownership from presentation files.
8. Removed direct migration scoring/audit tags from `index.html`.
9. Added physical source-boundary, rendered browser, division-conservation, and Octagon-package tests.
10. Kept PR #39 draft and unmerged pending Cody’s explicit approval.

## Final new-fighter workflow

1. Add the fighter’s complete UFC-only fight ledger to canonical fighter facts, including the correct UFC division on every fight row.
2. Add only necessary approved judgment inputs that cannot live on fight rows.
3. Add presentation-only profile copy and real photo paths after files exist.
4. Add a Compare Profile; add a direct-fight ledger only for a real fight/rivalry.
5. Run schema, seven-category, total/rank, OVR, division allocation, architecture, browser, and Octagon package tests.
6. Confirm the fight-level input automatically reaches leaderboard, profile, visible stats, Compare Mode, Categories, Play, division boards, and the Octagon Verdict package.
7. Add fighters in small batches and review output before promotion.

No division board row, sample share, modifier, rank, or Octagon fighter record should be added manually. Correct the canonical fight facts or approved judgment input instead.

## Automatic update behavior

On a scoring branch, the full Chromium certification builds and validates a new `octagon-verdict-data.json` artifact from that exact branch.

On `main`, changes to canonical facts, approved judgments, calculators, ranking projection, Compare data, or division allocation trigger the Octagon build workflow. The workflow regenerates the repository feed from the deployed calculation architecture.

The custom GPT knowledge upload itself is static, so the newly generated JSON must still replace the prior Knowledge file in the Octagon Verdict GPT after a promoted scoring update. The generated file is the only manual handoff; its contents are no longer manually assembled.

## Promotion checkpoint — July 15, 2026

- production projection: 73 fighters, complete
- source ownership certification: passing
- full rendered ranking regression: passing
- automatic division boards: eight men’s divisions, passing conservation and browser certification
- historical class fallback: generic sole-division rule; Royce openweight context certified without a fighter-specific score override
- Octagon Verdict package: 73 fighters and eight division boards, generated and validated from browser runtime
- calculated snapshots: active; no `DISPLAY_OVERRIDES.snapshot` fallback ownership
- calculated Compare stats: active; narrative copy remains presentation-only
- production shell: no frozen scoring, reconstruction, late stat-mutation, or manual division-score ownership
- PR #39: draft, open, unmerged
- published `main`: unchanged
