# Known-good production rollback baseline

## Certified reference

- Certified date: 2026-07-21
- Commit: `89dce5c2a123f54c20d1c65d01136ac5f5dcc30e`
- Permanent branch: `rollback/production-certified-2026-07-21`
- Source PR: #193 — Final production certification

This is the last production head certified after the startup/identity cleanup and before the permanent repository-governance protections were added.

## Certification evidence on the tested tree

The merged tree matched exact tested head `2d13a291564c10d769a454b6a5533836898f3772`, where all six certification workflows passed:

- Production Ranking Browser Smoke #652
- Scoring Architecture Guardrails #1464
- Picks UI Smoke #860
- Startup Architecture Gate #217
- Test iOS Home Startup Stability #71
- Phase 5 Script Manifest Inventory #15

## Rollback use

Use this reference only when a later production change creates a confirmed severe regression that cannot be safely corrected forward.

Preferred order:

1. Identify the first bad merge.
2. Revert the bad PR through a new pull request.
3. Run the required exact-head checks.
4. Use the certified rollback branch only when a focused revert cannot restore production safely.

Never force-move `main` to this commit without preserving later history and documenting the recovery decision.

## Immutability rule

Do not commit new work on `rollback/production-certified-2026-07-21`, merge into it, or repoint it. Future certified baselines must receive a new dated rollback branch and a new document entry.
