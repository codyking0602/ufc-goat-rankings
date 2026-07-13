# UFC GOAT Scoring Architecture

This document is the permanent ownership contract for the UFC-only ranking engine.

## Canonical ownership

- `assets/data/canonical-scoring-records.js` is the canonical post-audit scoring-input source.
- `assets/js/scoring-engine.js` is the only final score owner.
- `assets/js/scoring-ownership-finalizer.js` is the only authorized caller of the scoring engine.
- The scoring engine owns final category inputs, modifiers, weighted totals, ranks, profile score synchronization, and OVR.

## Evidence providers

Loss Context and Division-Era Depth modules may calculate and publish evidence, details, and audit metadata. They may not write the authoritative penalty, Era Depth adjustment, total score, rank, or OVR.

Category promoters may stage audited category evidence before finalization. The canonical scoring engine overwrites the authoritative category inputs during its single accepted application.

## Presentation boundary

`display-overrides.js`, fighter packets, and Compare profiles are presentation sources only. They may contain photos, links, labels, one-liners, profile copy, narrative context, and non-score statistics. They may not contain authoritative scores, ranks, OVRs, modifiers, or category ratings.

## Locked formula

```text
championship/30*35
+ opponentQuality/30*27.5
+ primeDominance/30*27.5
+ longevity/30*10
+ apexPeak
+ penalty
+ eraDepthAdjustment
```

Base weights:

- Championship: 35%
- Opponent Quality: 27.5%
- Prime Dominance: 27.5%
- Longevity: 10%

Apex Peak adds after the 100-point base. Loss Context and Era Depth are post-base modifiers.

## Permanent CI guard

`.github/workflows/scoring-architecture-guardrails.yml` runs whenever production JavaScript, scoring data, presentation data, or the contract changes. It fails when:

- a deleted legacy scoring file or loader reference returns;
- another module defines or invokes the canonical score engine;
- the formula, weights, canonical source hash, or authorized caller changes without updating the contract;
- display overrides, fighter packets, or Compare profiles contain score-derived fields;
- Loss Context or Era Depth resumes authoritative score mutation;
- script order changes in a way that breaks ownership;
- the engine applies more or less than once;
- the 72-fighter canonical runtime, leaderboard/profile parity, ranks, totals, or OVRs diverge.

Intentional scoring changes must update the scoring code, canonical records, contract, and runtime baseline together in one reviewed pull request.
