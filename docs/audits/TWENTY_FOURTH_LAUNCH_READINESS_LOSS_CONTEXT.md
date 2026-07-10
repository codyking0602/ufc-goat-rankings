# Twenty-Fourth Audit — Launch Readiness and Loss Context

Generated: July 10, 2026

Mode: Launch-readiness implementation and deterministic runtime validation.

## Launch decision

The real lower/middle-tier calibration sample is removed from the launch critical path. It may be revisited later as the live roster expands, but it is not required to publish the current 62-fighter app.

The positive scoring formula remains:

- Championship Resume: 35%;
- Quality Wins: 27.5%;
- Prime Dominance: 27.5%;
- Longevity: 10%;
- Apex Peak added after the base;
- Loss Context subtracted after the base.

No champion-forward Championship curve or alternate formula weights were promoted.

## Loss Context launch treatment

The event-based Fighter Era Ledger adapter remains useful supporting QA, but it is not complete enough to replace the current penalties. Promoting its partial estimates would erase valid counted losses and materially change the rankings.

For launch, the app now:

1. preserves every current reviewed `row.penalty` value;
2. marks that value as the locked live Loss Context source;
3. attaches rules, notes, source, and version metadata to every board and profile row;
4. retains the event-ledger estimate separately as supporting QA context;
5. does not mutate any penalty, score, total, rank, or OVR.

The locked rules remain:

- pre-prime champion/top-five loss: -0.75;
- pre-prime non-elite loss: -1.25;
- prime champion/top-five loss: -1.50;
- prime non-elite loss: -4.00;
- counted finish extra: -0.75;
- post-prime loss: 0;
- prime upward-division elite loss: -0.75;
- upward-division elite finish extra: -0.50;
- total penalty cap: -10.00.

Special judgment calls remain preserved, including the Jon Jones Matt Hamill DQ treatment and Volkanovski's reduced upward-division Islam penalties.

## Runtime result

- roster fighters: 62;
- Championship Resume: 62 pass, 0 warning, 0 fail;
- Quality Wins: 62 pass, 0 warning, 0 fail;
- Prime Dominance: 62 pass, 0 warning, 0 fail;
- Longevity: 62 pass, 0 warning, 0 fail;
- Apex Peak: 62 pass, 0 warning, 0 fail;
- Loss Context: 62 pass, 0 warning, 0 fail;
- fully complete fighters: 62;
- incomplete fighters: 0;
- formula mismatches: 0;
- forbidden score-derived overrides: 0;
- duplicate board names: 0;
- duplicate profile names: 0;
- overall-score ownership: PASS;
- deterministic initialization: PASS.

## Regression comparison

Compared with the immediately preceding four-category balance audit:

- penalty changes: 0;
- category-score changes: 0;
- total-score changes: 0;
- board-rank changes: 0;
- OVR formula remains owned by `final-score-engine.js`.

## Final status

The scoring branch is launch-ready under the current accepted formula and current 62-fighter roster.

The remaining repository action is an explicit approval to merge PR #7 into `main`. GitHub Pages will then deploy `main` as the live source of truth.