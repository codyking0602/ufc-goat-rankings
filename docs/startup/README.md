# Startup Architecture Project

This directory is the permanent handoff point for the zero-change startup reliability project.

## Start here in every new chat

1. Read [`STATUS.md`](./STATUS.md).
2. Read the current open runtime PR named in that file.
3. Read [`../startup-architecture.md`](../startup-architecture.md) for the governing contract.
4. Read [`DECISIONS.md`](./DECISIONS.md) before proposing any architectural change.
5. Read [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md) before selecting a Phase 1 runtime owner.
6. Update the documentation after every completed batch.

The master GitHub tracker is issue [#102](https://github.com/codyking0602/ufc-goat-rankings/issues/102).

## Source-of-truth order

When documents disagree, use this order:

1. Current production code on `main`.
2. `docs/startup/STATUS.md` for the active phase and next action.
3. `docs/startup-architecture.md` for the project contract and phase definitions.
4. `docs/startup/DECISIONS.md` for locked decisions.
5. `docs/startup/PHASE-1-OWNER-AUDIT.md` for Phase 1 classifications and sequencing.
6. GitHub issue #102 for the high-level checklist.
7. Historical PR descriptions and chat summaries.

Chat history is supporting context only. It is never the project record.

## Non-negotiable scope

This project changes startup architecture only. It does not intentionally alter the approved product experience.

Do not combine startup cleanup with:

- rankings, divisions, fighter data, scoring, profiles, or photos;
- Games, Picks, Intelligence, War Room, notifications, or sharing features;
- visual redesign, copy changes, or navigation redesign;
- unrelated test-contract or content-data repairs.

## Working method

Each runtime batch must be small enough to understand from one diff.

1. Identify one startup owner or duplicate responsibility.
2. Add or strengthen the regression assertion first.
3. Make the smallest runtime change.
4. Run the complete relevant gate.
5. Keep the PR in draft while any startup requirement is uncertain.
6. Merge only when first-run behavior is unchanged and duplicate work is reduced.
7. Update `STATUS.md`, `OWNERS.md`, `DECISIONS.md`, `KNOWN_ISSUES.md`, and `CHANGELOG.md` as applicable.

## Phase roadmap

### Phase 0 — Freeze and measure

Protect the approved experience with a written contract, ownership assertions, browser checks, and a repeatable CI gate.

### Phase 1 — Make startup owners idempotent

Every startup owner must be safe against accidental duplicate execution before scripts are moved or deleted. Owners are classified in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md); do not apply one universal guard pattern to every file.

### Phase 2 — Remove duplicate ownership

Consolidate route, identity, notification, refresh, and lifecycle responsibility into canonical owners one responsibility at a time.

### Phase 3 — Retire repair loops

Fix source renderers and remove compatibility repairs individually after proof.

### Phase 4 — Reduce startup work

Move route-specific work out of the critical path only after ownership is clean.

### Phase 5 — Simplify the manifest

Remove superseded compatibility layers and leave `index.html` as a clear ordered dependency manifest.

### Phase 6 — Certify

Prove stable cold start, warm start, background resume, deep links, sign-in, navigation, and all major product surfaces.

## Required handoff format

Every work session ends with these four facts recorded in `STATUS.md`:

- what changed;
- what passed;
- what remains blocked or uncertain;
- the exact next action.

This is what allows a future chat to continue without reconstructing the project from memory.