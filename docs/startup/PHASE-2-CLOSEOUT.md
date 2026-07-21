# Phase 2 Startup Ownership Record

_Last updated: 2026-07-20_

This file records the Phase 2 work completed through PR #146 and preserves the current continuation policy. Phase 2 is approximately 90% complete; the entire startup cleanup is approximately 85% complete.

## Production position

- Production runtime merge: PR #146, `cc75ef4371196ea89a79aa7ff14f759a252a4dd4`.
- Current `main` at this closeout: `02ec4aee96f94d821ca1c218b7ffec47af6b0944`.
- The commit after PR #146 changes only the generated Octagon Verdict Markdown timestamp.
- `main` remains the live source of truth.

## Route ownership completed

### PR #128 — Queue recovery-window navigation in the canonical shell

Product Architecture may capture the latest accepted primary/ranking route intent only while `UFC_APP_SHELL` is missing. The canonical shell consumes that handoff during its normal startup activation. Product Architecture does not mutate active classes, ARIA, hash, or route events as a substitute route owner.

### PR #129 — Remove legacy `app.js` primary-tab listener

The shadowed `.tab` listener in `app.js` was removed after the missing-shell recovery path was proved. `octagon-hq-shell.js` is now the sole primary destination and ranking-subview activation owner.

## Identity/profile ownership sequence

### PR #130 — Audit Phase 2 identity and profile ownership

The audit established:

- `play-profile-identity.js` as the canonical shared credential, persistence, identity-cache, and readiness owner;
- `app-profile.js` as the visible profile editor and full group-snapshot owner;
- consumer modules should use published cached identity/readiness rather than resolve identity or read canonical access themselves.

### PR #131 — Delegate Picks profile login to the canonical owner

`picks-member-pin.js` stopped calling the returning-member credential RPC and stopped persisting canonical access. `UFC_PLAY_PROFILE.login()` now owns current/legacy login fallback, token/room persistence, identity publication, and continuation context. Picks retains its card, validation/status, wrong-PIN recovery, active-room/Picks-Home continuation, member PIN, commissioner PIN, observer, and route behavior.

### PR #132 — Remove duplicate Community profile access synchronization

Community stopped writing canonical group/room/active-group/display-name access, stopped inserting the Picks group route, and stopped refreshing the PIN surface. It retained Community directory/profile/Top 10/challenge behavior.

### PR #133 — Remove duplicate Product profile access persistence

Product Architecture stopped writing canonical group, room, active-group, and display-name access. It retained only the genuine cross-feature Picks compatibility handoff: duplicate-card suppression, GOAT26 route handoff, and PIN-surface refresh.

### PR #134 — Make notification center a canonical identity consumer

The notification center stopped reading canonical access from storage and stopped invoking `UFC_APP_PROFILE.resolve()` merely to obtain identity. Canonical identity resolution remained in `UFC_PLAY_PROFILE`.

### PR #135 — Prevent duplicate Product startup profile handoff

The cached and uncached startup paths were separated:

- cached identity produces one immediate Product handoff;
- uncached startup requests canonical resolution and relies on the resulting readiness event for one handoff.

The duplicate promise-driven handoff was removed.

### PR #136 — Make App Profile the single group-snapshot owner

The canonical readiness listener now accepts identity, invalidates stale editor group data, and refreshes the chip without independently fetching the full group snapshot. `UFC_APP_PROFILE.resolve()` performs the one full snapshot when the editor needs it.

### PR #137 — Make profile challenges a passive identity consumer

Background inbox loading now uses cached identity/readiness only and shares one in-flight promise. Explicit challenge actions retain canonical `require()` behavior, and direct sending may request the app-profile member list when needed.

### PR #138 — Make Community Profiles a passive identity consumer

Community passive startup stopped calling `UFC_APP_PROFILE.resolve()` and `UFC_PLAY_PROFILE.resolve()`. Uncached startup waits for readiness; cached startup performs one direct Community snapshot handoff. Explicit Top 10 editing retains the sign-in boundary.

### PR #139 — Make Home daily sync a passive identity consumer

Official daily reconciliation stopped using a shared helper that re-entered canonical resolution. No daily context or leaderboard RPC begins before published identity and display name exist. Competing startup/Home/readiness/visibility paths share the existing in-flight guard.

### PR #140 — Make notification settings a passive identity consumer

Notification settings loading became fully cache/readiness driven. Uncached startup renders the existing disconnected state and waits. Explicit notification actions retain a canonical `require()` fallback. This completed the notification identity boundary started in PR #134.

### PR #141 — Make Picks social profile a passive identity consumer

Picks social startup stopped scanning `localStorage` for `ufc-picks:group:*`. It waits for published identity and preserves the existing 30-second cadence and in-flight snapshot guard.

### PR #142 — Early Octagon-access draft

PR #142 was not merged. It represented an earlier access-panel approach under the old routine physical-test gate. It is superseded by the fresh production audit and merged PR #146. Do not revive or merge #142.

### PR #143 — Make Picks season loop a passive identity consumer

Picks season loading stopped calling canonical/editor resolvers and stopped reading member/admin tokens from storage. Group, event, social, and room work waits for published identity and shares one coalesced request set. Reminder actions reuse the published identity.

### PR #144 — Make Home daily contract helper-agnostic

Test-only maintenance. The Home static ownership proof was updated so an unrelated helper inserted after `syncOfficialDaily()` did not create a false architecture failure. No runtime behavior changed.

### PR #145 — Make War Room board a passive identity consumer

The board stopped resolving identity and stopped reading the GOAT26 member token from storage. Entry, readiness, visibility resume, reconnect, realtime refresh, posting, reactions, and deletion reuse published identity. The visible SIGN IN button remains the one intentional `UFC_PLAY_PROFILE.require()` boundary.

### PR #146 — Make War Room access a passive identity consumer

The access panel stopped resolving canonical identity and stopped reading/listening to the GOAT26 token in storage. It retained one access-status in-flight owner across startup, readiness, visibility, online, realtime, polling, and direct refresh paths. The duplicate unconditional readiness check was removed. Cody’s Manage Beta roster and access toggles reuse the published token.

## Permanent passive-consumer contract

A passive consumer should generally use:

- `UFC_PLAY_PROFILE.identity`;
- `UFC_APP_PROFILE.identity` when appropriate;
- `ufc-play-profile-ready`;
- `ufc-app-profile-updated`;
- feature-specific readiness/update events.

A passive consumer should not independently:

- call `UFC_PLAY_PROFILE.resolve()`;
- call `UFC_APP_PROFILE.resolve()`;
- call a shared helper that resolves canonical identity;
- scan or read canonical member/admin/group/room access from local storage;
- publish canonical profile readiness;
- trigger full profile/group work merely to obtain identity;
- begin identity-dependent RPC work before published identity exists.

Explicit user actions may still use `UFC_PLAY_PROFILE.require()` when sign-in is genuinely required.

## In-flight and refresh contract

When startup timers, route entry, readiness, visibility, online, realtime, MutationObservers, polling, and direct calls target the same expensive refresh:

- retain or add one in-flight/coalescing boundary;
- prove one readiness/update causes one intended RPC set;
- prove cached and uncached startup remain behaviorally equivalent after identity publication;
- preserve legitimate recovery, manual refresh, and explicit-action paths;
- do not remove a secondary path until it is proved to be duplication rather than recovery.

## Automated evidence

Each completed ownership batch added or strengthened focused static and browser proofs inside Startup Architecture Gate. The current gate covers:

- canonical shell recovery and sole route activation;
- canonical profile login, fallback, wrong PIN, active-room continuation, and delayed owner availability;
- Community access and passive identity ownership;
- Home daily passive identity ownership;
- Product cached/uncached startup handoffs;
- App Profile single group snapshot;
- profile-challenge passive inbox loading;
- notification passive identity ownership;
- Picks social and season passive identity ownership;
- War Room board and access passive identity ownership;
- iOS-style route/startup/resume stability;
- real profile/Picks sign-in stability;
- delayed Home/community/profile/Top 10 stability.

PR #146’s complete gate passed on an unchanged rerun. The first corrected-head attempt stopped at the known unchanged shell-recovery timing proof before reaching the new access proof; diagnostics showed no overlap, and the unchanged rerun passed every step.

## CI-first physical-testing rule

More than 25 installed-iPhone tests completed without one abnormal result. Focused mobile-browser ownership proofs plus the complete Startup Architecture Gate are now the default merge evidence.

Request one combined installed-iPhone test only for a genuine physical-only uncertainty:

- service-worker or installed-app cache behavior;
- an actual primary route, sign-in, loading, or native-shell behavior change;
- iOS lifecycle behavior that cannot be reproduced in Playwright;
- conflicting, flaky, or incomplete automated evidence that cannot be resolved in CI.

Do not request physical testing merely because unrelated odds-health, deployment, generated-Markdown, scoring, or photo commits advance `main`.

## Main movement policy

Automated workflows may advance `main` or a PR branch. For every movement:

1. inspect changed files;
2. prove overlap or non-overlap;
3. replay onto current `main` when necessary;
4. preserve complete-gate evidence when the exact runtime/test head passed and later movement is proven unrelated;
5. merge using an exact expected head/base lock.

The required Octagon Verdict Markdown workflow may add a timestamp-only child. Treat it as unrelated only after proving all runtime, test, workflow, and cache-key blobs are unchanged.

## Unrelated red workflows

Known red checks remain separate unless they reference the isolated Phase 2 diff:

- Production Ranking Browser Smoke may stop at fighter-photo path/render audits.
- Scoring Architecture Guardrails may report stale source/runtime, roster-count, ranking, or display-ownership expectations.
- Production ranking pipeline/snapshot may report the same stale ranking contract.
- Picks UI Smoke and historical Phase 4B validation may report pre-existing contract drift.

Inspect diagnostics; do not repair them inside a narrow startup branch without direct overlap.

## Current next action

Begin a fresh audit from current production `main`. Inspect `index.html`, the startup contract, and production-loaded JavaScript only. Do not assume the next duplicate in advance.

Audit one responsibility at a time, prove every trigger and retry path, record existing coalescing, make the smallest isolated change, add focused static and mobile-browser proofs, run the complete gate, and merge with exact locks after resolving any `main` movement.

Do not begin broad Phase 3 repair-loop removal while a Phase 2 duplicate remains under audit.
