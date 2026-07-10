# UFC GOAT Rankings Architecture

## Purpose

This repository is a UFC-only all-time ranking app. Audited fighter inputs determine every score, rank, percentile, and OVR. Presentation files may change wording, images, and layout only.

## Locked Six-Category Model

The four base categories are scored from 0 to 30:

1. Championship Resume
2. Quality Wins
3. Prime Dominance
4. Longevity

Two modifiers apply after the 100-point base:

5. Apex Peak: positive bonus from 0 to 6
6. Loss Context: zero or negative penalty

Final formula:

```text
Championship Resume / 30 × 35
+ Quality Wins / 30 × 27.5
+ Prime Dominance / 30 × 27.5
+ Longevity / 30 × 10
+ Apex Peak
+ Loss Context
= Raw Score
```

## Architectural Rule

Category modules may write only their category value and audit metadata.

Only one final score engine may write:

- `totalScore`
- `rawScore`
- `weightedScoreBreakdown`
- overall rank
- overall OVR

No category promoter may independently recalculate totals, rerank boards, or set score-derived display overrides.

## Category Sources

### Championship Resume

Canonical chain:

```text
championship-resume-ledgers.js
→ championship-resume-shadow.js
→ championship-resume-live.js
→ row.championship
```

### Quality Wins

Canonical chain:

```text
opponent-quality-ledgers.js
→ calibration and batch files
→ opponent-quality-shadow-audit.js
→ opponent-quality-live.js
→ row.opponentQuality
```

### Prime Dominance

Canonical chain:

```text
prime-round-control-audit.js
→ prime-dominance-ledgers.js
→ prime-dominance-shadow-model.js
→ prime-dominance-live-promoter.js
→ row.primeDominance
```

Components:

- Prime record: 9
- Round control: 8
- Finish pressure: 5
- Elite-stakes validation: 8
- Total: 30

### Longevity

Canonical chain:

```text
fighter-era-ledgers.js
→ longevity-shadow-scorer.js
→ longevity-live-promoter.js
→ row.longevity
```

Live Longevity must be a native 0-to-30 value and marked with `longevityThirtyPoint: true`.

### Apex Peak

Canonical chain:

```text
locked Apex fighter audit
→ apex-peak-live-bonus.js
→ row.apexPeak
```

Apex Peak is a 0-to-6 positive modifier after the base score.

### Loss Context

Intended canonical chain:

```text
fighter-era-ledgers.js
→ loss-context-ledger-adapter.js
→ loss-context-live-promoter.js
→ row.penalty
```

The live promoter must remain disabled until every fighter's UFC loss ledger is complete and reviewed.

## Display Overrides

`assets/data/display-overrides.js` is presentation-only.

Allowed examples:

- photo paths
- one-liners
- profile copy
- division wording
- watch-moment copy
- why-ranked-here copy
- key judgment-call text

Forbidden score-derived fields:

- `overallOvr`
- `allTimeRank`
- category OVR
- category rank
- `totalScore`
- any of the six category values

## UFC-Only Rule

Pride, Strikeforce, WEC, ONE, Bellator, and regional achievements do not score in the main rankings. They may be mentioned as context only.

## Loading Rule

The final target is one deterministic load chain with no score-changing timers:

```text
base data
→ shared ledgers
→ six category scorers
→ integrity audit
→ final score engine
→ OVR and ranks
→ render
```

## Preservation Rule

Audited fighter inputs must not be deleted or rewritten during pipeline consolidation unless a specific factual correction is approved. The cleanup replaces orchestration, not Cody's fighter-by-fighter work.
