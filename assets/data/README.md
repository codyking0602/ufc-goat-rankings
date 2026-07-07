# Ranking data structure

This folder contains the canonical fighter data source and the generated/public data used by the app and Octagon Verdict.

## Current structure

The app now uses a one-file fighter data workflow.

```text
assets/data/ranking-data.js          canonical fighter data source
assets/data/ranking-data-patches.js  lightweight loader/status hook
assets/data/octagon-verdict-data.json generated GPT/Octagon Verdict data feed
assets/data/octagon-verdict/          generated GPT/Octagon Verdict export files
assets/data/README.md                this folder guide
```

## Canonical source of truth

All fighter scoring, profile/display copy, Watch Moment URLs, compare copy, and direct fight ledger data should live in:

```text
assets/data/ranking-data.js
```

Add or edit fighters there only.

Do **not** add new fighter data to:

```text
assets/data/ranking-data-additions.js
assets/data/display-overrides.js
assets/data/fighter-packets/*.js
assets/data/fighter-packet-manifest.js
assets/data/fighter-packets.js
assets/data/fighter-packet-schema.js
assets/data/fighters.js
assets/data/compare-profiles.js
assets/data/compare-matchups.js
assets/data/fight-ledger.js
assets/data/*-score-corrections.js
assets/data/score-weighting.js
```

Legacy files may still exist during cleanup for audit/history, but they are no longer the workflow.

## `ranking-data.js`

Permanent fighter source.

Each fighter should include, when relevant:

- identity: name, slug/id, gender, leaderboard, divisions, UFC record
- scoring: total score, Championship, Quality Wins, Prime Dominance, Longevity, Apex Peak, Loss Context
- resume snapshot stats: title-fight wins, adjusted title wins, elite/top-5 wins, prime record, finish rate, rounds won %, active elite years, times finished in prime
- title context
- quality wins / opponent ledger
- prime and round-control details
- loss-context notes
- display copy: resume tag, one-liner, why ranked here, why not higher, final takeaway
- Watch Moment URL
- photo paths, only after real files exist
- compare profile/copy
- fight ledger, only for real direct fights or rivalries

## Resume Snapshot rule

Visible profile snapshot stats are real stats, not score fields.

Do not map category scores into stat slots.

```text
Championship score        != UFC Title-Fight Wins
Opponent Quality score    != Elite / Top-5 Wins
Longevity score           != Active Elite Years
Prime Dominance score     != Rounds Won %
Loss Context score        != Times Finished in Prime
```

Example issue caught during cleanup: Julianna Peña showed `21.8` UFC Title-Fight Wins because a championship score was mapped into a stat slot. That must be corrected in the canonical fighter object during audit.

## `ranking-data-patches.js`

Current lightweight loader/status hook.

This file should not own durable fighter data. It currently handles app module loading, cache-busting, photo fallback behavior, status globals, and temporary display cleanup while the app is being stabilized.

Long-term cleanup target: move active loader behavior into a clearer app module and reduce or remove this file.

## Octagon Verdict data feed

These are generated/public files for the custom GPT / Octagon Verdict side:

```text
assets/data/octagon-verdict-data.json
assets/data/octagon-verdict/
```

They are rebuilt by:

```text
tools/build-octagon-verdict-data.js
.github/workflows/build-octagon-verdict-data.yml
```

The export should be rebuilt from the canonical `ranking-data.js` source.

## Audit tracker

Use this file for fighter audit status:

```text
docs/fighter-status.md
```

Fighters should be audited in small batches. Score updates are allowed during audit, but every score change should be intentional and easy to explain.

## Future cleanup target

Once verified that no active module depends on the legacy data files, remove old patch-stack files from this folder so the data directory only contains the canonical source, lightweight loader, GPT export, and documentation.
