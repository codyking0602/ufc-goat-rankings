# Startup Architecture Cross-Chat Handoff

This file exists so the project can continue safely across multiple ChatGPT conversations.

## Required reading order

1. [`startup-architecture-status.md`](./startup-architecture-status.md) — current phase, blockers, and exact next action.
2. [`startup-architecture.md`](./startup-architecture.md) — non-negotiable contract and overall phase plan.
3. [`startup-architecture-inventory.md`](./startup-architecture-inventory.md) — owner-by-owner Phase 1 audit.
4. [`startup-architecture-decisions.md`](./startup-architecture-decisions.md) — locked decisions that must not drift.
5. The open master GitHub issue and the active phase pull request.

## New-chat starter prompt

> Continue the Octagon HQ startup architecture stabilization. Read the four startup architecture documents under `docs/`, then read the open master GitHub issue and active PR. Do not redesign or change the approved app. Work only on the documented exact next action, update the status and decision logs before ending, and keep runtime changes isolated in small draft PRs.

## End-of-session checklist

Before ending any startup architecture work session:

- Update `docs/startup-architecture-status.md`.
- Update `docs/startup-architecture-inventory.md` if ownership understanding changed.
- Add a decision to `docs/startup-architecture-decisions.md` if a rule or direction changed.
- Add a dated comment to the master GitHub issue.
- Record active branch, PR, checks, blockers, rollback, and exact next action.
- Confirm whether `main` runtime changed.

## Never rely on chat memory alone

A statement in chat is not considered durable project state until it is reflected in one of the repository documents or the master GitHub issue.
