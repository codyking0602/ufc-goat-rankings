# Main branch protection contract

Production `main` is the live source of truth. Human-authored changes must enter through a pull request.

## Required GitHub ruleset

Create one active branch ruleset targeting `main` with these settings:

- Restrict deletions.
- Block force pushes.
- Require a pull request before merging.
- Require all conversations to be resolved before merging.
- Require the branch to be up to date before merging.
- Require these status checks:
  - `Repository Governance / repository-governance`
  - `Required PR Validation / required-pr-validation`
- Do not require an outside approval while the repository has one active maintainer; the PR checklist and automated gates remain mandatory.
- Do not allow human direct-push bypasses during normal development.

## Why only two checks are marked required

The existing production workflows are intentionally path-scoped. Requiring each path-scoped workflow directly would leave unrelated PRs permanently pending when that workflow correctly does not run.

`Required PR Validation` always runs and classifies the changed files. It executes the relevant ranking/browser, scoring, Picks, startup, iOS/mobile, and Phase 5 proofs for that exact PR head. The original dedicated workflows remain permanent independent certification and post-merge diagnostics.

`Repository Governance` always validates the PR ownership checklist, duplicate-responsibility declaration, unchanged-behavior statement, exact-head SHA, and restricted-filename policy.

## Trusted automation exception

Two existing machine-owned workflows may currently publish deterministic generated health or materialization updates directly:

- `.github/workflows/production-ranking-browser-smoke.yml`
- `.github/workflows/refresh-ufc-odds.yml`

A GitHub ruleset must either grant only the required GitHub Actions app/bot a narrow bypass or those generated writes must first be moved to an automated pull-request workflow. Do not grant a broad human/admin bypass merely to preserve these jobs.

Human feature, architecture, scoring, data, CSS, documentation, and workflow changes are never part of this exception.

## Required merge standard

A PR is mergeable only when:

1. The canonical owner is named.
2. No duplicate responsibility is introduced.
3. Intentional and unchanged behavior are documented.
4. The PR body lists the current full head SHA.
5. Both required checks pass on that head.
6. Any restricted new filename has explicit path-by-path justification.

## Known-good rollback reference

The certified pre-protection baseline is permanently referenced by:

- Branch: `rollback/production-certified-2026-07-21`
- Commit: `89dce5c2a123f54c20d1c65d01136ac5f5dcc30e`

Do not move or reuse that rollback branch for new development.
