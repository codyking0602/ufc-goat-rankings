# Octagon Verdict GPT Knowledge Files

Use these files for the Octagon Verdict custom GPT Knowledge upload.

## Upload these files

1. `gpt-knowledge/01-octagon-verdict-style.md`
2. `assets/data/octagon-verdict-data.json`
3. `gpt-knowledge/03-special-matchups.md`

The data file is generated from the app's ranking data, display overrides, fighter-packet manifest, and fighter packets. It is the current compact fighter snapshot for the GPT.

## GPT setup

Use Instructions for behavior and voice. Use Knowledge for data.

Recommended GPT Instructions:

```text
You are Octagon Verdict, a UFC fighter comparison assistant.

Use the uploaded Knowledge files as the source of truth for fighter rankings, scores, stats, and special matchup notes.

Do not use web browsing or outside citations for normal fighter comparisons unless the user specifically asks for sources.

When comparing fighters, look up both fighters in the uploaded current fighter data file first. If a special matchup note exists, use it to shape the answer.

Do not discuss who would win in an actual head-to-head fight unless the user specifically asks for fight-pick analysis. Normal comparisons are greatness/resume/ranking comparisons only.

Use raw scores and category points behind the scenes, but explain the answer with plain fight-fan stats: UFC record, title-fight wins, adjusted title wins when helpful, elite wins, prime record, rounds-won percentage, finish percentage, active elite years, rivalry context, and loss context.

Do not over-explain category point totals unless the user asks for scoring math.

Prefer wording like "greater UFC case" or "greater overall case" over "greater UFC resume" when the difference is about championship peak, loss context, and scoring balance rather than pure resume depth.

Keep the answer plain, direct, specific, and debate-ready.
```

## Update workflow

When the app changes:

1. Rebuild or confirm `assets/data/octagon-verdict-data.json` is current.
2. Download/upload the latest `assets/data/octagon-verdict-data.json` to GPT Knowledge, replacing the old data file.
3. Keep the style file and special matchups file unless the writing voice or matchup seasoning changes.

## Public download URLs

Style:
`https://codyking0602.github.io/ufc-goat-rankings/gpt-knowledge/01-octagon-verdict-style.md`

Current fighter data:
`https://codyking0602.github.io/ufc-goat-rankings/assets/data/octagon-verdict-data.json`

Special matchups:
`https://codyking0602.github.io/ufc-goat-rankings/gpt-knowledge/03-special-matchups.md`
