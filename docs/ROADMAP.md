# Scoring Pipeline Consolidation Roadmap

## Phase 0 — Preserve

- Create protected working branch from current `main`.
- Record current architecture and known issues.
- Preserve all fighter ledgers, audits, and existing live outputs.
- Do not change fighter category inputs.

## Phase 1 — Integrity Audit

Create a non-mutating audit that checks every leaderboard fighter for:

- Championship Resume live audit and `/30` value
- Quality Wins live audit and `/30` value
- Prime Dominance merged-report entry and `/30` value
- Longevity Era Ledger audit and native `/30` value
- Apex Peak locked audit and `0–6` value
- Loss Context source and live/legacy status
- exact overall formula reconciliation
- duplicate fighter rows and profile/leaderboard mismatches

Deliverables:

- machine-readable browser audit object
- human-readable coverage report
- list of missing, stale, mismatched, or legacy-backed fields

## Phase 2 — Canonical Category Contract

Standardize each live fighter row:

```js
{
  championship,
  opponentQuality,
  primeDominance,
  longevity,
  apexPeak,
  penalty,
  categorySources,
  categoryAudits
}
```

No silent fallback is allowed.

## Phase 3 — Central Final Score Engine

Create one engine that alone writes:

- `rawScore`
- `totalScore`
- `weightedScoreBreakdown`
- ranks
- score-derived OVR

Locked formula:

```text
championship / 30 × 35
+ opponentQuality / 30 × 27.5
+ primeDominance / 30 × 27.5
+ longevity / 30 × 10
+ apexPeak
+ penalty
```

## Phase 4 — Convert Category Promoters

Change each promoter into a category-only writer:

- Championship writes Championship only.
- Quality writes Quality only.
- Prime writes Prime only.
- Longevity writes Longevity only.
- Apex writes Apex only.
- Loss writes Loss only.

Remove total, rank, and OVR mutation from category modules.

## Phase 5 — Complete and Promote Loss Context

- Preserve current penalties as legacy comparison values.
- Verify all relevant UFC losses for every fighter.
- Resolve phase, opponent quality, finish context, upward-division context, weird results, and post-prime treatment.
- Promote only after full roster coverage passes.

## Phase 6 — Deterministic Loading

Replace score-changing timers with one ordered initialization chain.

No rendering until:

1. all six category sources have applied
2. integrity audit has run
3. final score engine has calculated totals and ranks

## Phase 7 — Remove Score-Derived Overrides

Keep display overrides for presentation only.

Remove or prohibit:

- manual overall OVR
- manual overall rank
- manual category rank
- manual category OVR
- category values
- total score

## Phase 8 — Full Validation

For every fighter, produce:

- six raw category values
- four weighted base contributions
- Apex bonus
- Loss Context penalty
- expected total
- actual total
- source versions
- old rank versus new rank

Any unexplained mismatch blocks release.

## Phase 9 — Production Migration

- Test branch thoroughly.
- Merge in small commits.
- Keep rollback point.
- Remove obsolete fallback code only after stable deployment.

## Permanent Workflow After Cleanup

Every major session updates:

- `docs/CURRENT_STATE.md`
- `docs/OPEN_ISSUES.md`
- `docs/CHANGELOG.md`

Every new development chat must read:

1. `docs/ARCHITECTURE.md`
2. `docs/CURRENT_STATE.md`
3. `docs/OPEN_ISSUES.md`
