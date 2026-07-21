# Production certification status

Last updated: 2026-07-21

## Current production state

The July 21 production-cleanup handoff is complete. Production `main` remains the live source of truth.

Startup and identity architecture is maintenance-only. Its permanent ownership documentation continues to live under `docs/startup/`, with the cross-product owner summary in [`docs/architecture/OWNERSHIP-MAP.md`](../architecture/OWNERSHIP-MAP.md).

## Resolved cleanup ownership

### Fighter photos

- All ranked fighter photo and thumbnail paths must resolve to real files under `assets/fighters/`.
- Profile images use `<fighter-slug>.webp`; thumbnails use `<fighter-slug>-thumb.webp`.
- The ranking app shell owns activation of the Overall and Women ranking views used by rendered-photo certification.
- Photo certification validates path existence, decoding, and rendered dimensions without requiring a transient browser `complete` flag.
- No fighter image was generated, regenerated, replaced, or removed during this cleanup.

### Scoring architecture

- The approved production board contains 80 fighters.
- Alexandre Pantoja is owned by `assets/data/canonical-roster-batch-ten.js`.
- Obsolete post-bootstrap Pantoja roster/scoring fallback files are retired and may not be restored.
- Presentation-only modules may not launch roster or scoring repair paths.
- No fighter score, category value, formula, ranking judgment, OVR curve, or top-ten order was intentionally changed during this cleanup.

### Picks

- Mobile primary navigation is owned by the native app shell: the fixed bottom navigation plus the sticky-header Intelligence action.
- Picks mobile polish does not scroll or compete with the primary app navigation owner.
- `.github/workflows/refresh-ufc-odds.yml` is the single recurring card-and-odds refresh owner and runs every six hours at minute 17.
- The deploy workflow deploys and verifies Edge Functions but does not own recurring refreshes.
- Manual workflow dispatch remains available; the browser does not run an odds polling, focus-refresh, or visibility-refresh timer.

## Required production certification

A production head is certified only after these workflows pass on the same exact head:

- Production Ranking Browser Smoke
- Scoring Architecture Guardrails
- Picks UI Smoke
- Startup Architecture Gate
- Test iOS Home Startup Stability
- Phase 5 Script Manifest Inventory

## Permanent repository governance

Human-authored changes must enter through pull requests and follow the permanent checklist in `.github/pull_request_template.md`.

The required always-on merge checks are:

- Repository Governance
- Required PR Validation

`Required PR Validation` classifies each PR and runs the relevant ranking/browser, scoring, Picks, startup, iOS/mobile, and Phase 5 proofs against the exact PR head. The original dedicated workflows remain independent certification and post-merge diagnostics.

The exact GitHub ruleset is documented in [`.github/MAIN-PROTECTION.md`](../../.github/MAIN-PROTECTION.md).

## Known-good rollback baseline

The certified pre-governance production state is preserved at:

- Branch: `rollback/production-certified-2026-07-21`
- Commit: `89dce5c2a123f54c20d1c65d01136ac5f5dcc30e`

Full rollback evidence and usage rules are recorded in [`ROLLBACK-BASELINE.md`](./ROLLBACK-BASELINE.md).

## Remaining handoff items

There are no intentionally deferred production-cleanup items from the July 21 handoff. Any future red workflow must be investigated as a new deterministic failure rather than reopening completed startup phases by default.

<!-- Temporary positive-control change for Repository Governance. This branch will not be merged. -->
