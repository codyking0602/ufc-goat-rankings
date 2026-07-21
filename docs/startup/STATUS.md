# Startup Architecture Status

_Last updated: 2026-07-20_

## Overall status

- **Current production `main`:** `02ec4aee96f94d821ca1c218b7ffec47af6b0944`.
- **Latest startup runtime merge:** PR #146, merge `cc75ef4371196ea89a79aa7ff14f759a252a4dd4`.
- The one commit after PR #146 is the required generated `octagon-verdict-knowledge.md` timestamp refresh only.
- **Phase 0:** complete.
- **Phase 1:** complete.
- **Phase 2:** approximately 90% complete.
- **Estimated entire cleanup:** approximately 85% complete.
- **Visible product changes approved:** none.
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102).
- **Phase 2 permanent record:** [`PHASE-2-CLOSEOUT.md`](./PHASE-2-CLOSEOUT.md).

## Current architecture position

The route boundary is complete. `assets/js/octagon-hq-shell.js` is the sole primary destination and ranking-subview activation owner. Product Architecture may temporarily queue an accepted route only while the canonical shell is unavailable; it does not activate the route itself.

The identity/profile boundary is mostly complete:

- `assets/js/play-profile-identity.js` is the canonical shared credential, token persistence, identity cache, login/fallback, readiness-publication, and explicit sign-in owner.
- `assets/js/app-profile.js` owns visible profile editing and the full app-profile group snapshot when the editor needs it.
- Passive consumers generally read `UFC_PLAY_PROFILE.identity` or `UFC_APP_PROFILE.identity`, then react to `ufc-play-profile-ready`, `ufc-app-profile-updated`, and feature-specific update events.
- Passive consumers no longer resolve canonical identity, invoke the visible profile editor merely to obtain identity, or read canonical member/admin access from local storage in the completed areas below.
- Explicit user actions may still use `UFC_PLAY_PROFILE.require()` when sign-in is genuinely required.

## Completed Phase 2 sequence

| PR | Narrow responsibility | Result |
|---:|---|---|
| #128 | Canonical shell recovery-window handoff | Product Architecture queues one accepted intent; the shell remains the sole activator |
| #129 | Legacy `app.js` primary-tab activation | Removed; permanent route ownership proof added |
| #130 | Identity/profile ownership audit | Established the canonical identity boundary and first isolated candidate |
| #131 | Returning-member Picks login | Delegated credential verification and access persistence to `UFC_PLAY_PROFILE` |
| #132 | Community Picks-access synchronization | Removed duplicate token, active-group, display-name, room, URL, and PIN-refresh ownership |
| #133 | Product access persistence | Removed duplicate canonical access writes; retained only cross-feature Picks handoff work |
| #134 | Notification identity ownership, stage one | Removed direct canonical storage and editor-resolver ownership |
| #135 | Product startup profile handoff | Cached startup hands off once; uncached startup relies on one canonical readiness event |
| #136 | App-profile group snapshot | Made `UFC_APP_PROFILE.resolve()` the single full group-snapshot owner |
| #137 | Profile-challenge inbox | Made background inbox loading passive and coalesced; explicit actions retain sign-in boundaries |
| #138 | Community profile identity | Made passive Community loading cache/readiness driven |
| #139 | Home official daily identity | Prevented daily RPC work before published identity and retained one in-flight sync |
| #140 | Notification identity ownership, final | Made passive settings loads cache-only; explicit notification actions retain `require()` fallback |
| #141 | Picks social profile | Removed canonical storage scanning and made social loading readiness driven |
| #142 | Early Octagon-access draft | Not merged; superseded by the fresh audited implementation in PR #146 |
| #143 | Picks season loop | Removed resolver and member/admin storage ownership; coalesced competing season loads |
| #144 | Home daily proof maintenance | Test-only helper-boundary correction; no runtime change |
| #145 | War Room board | Made board startup, refreshes, and actions passive identity consumers; visible SIGN IN remains explicit |
| #146 | War Room access panel | Removed resolver/storage ownership, duplicate readiness work, and competing access-status RPCs |

## Latest completed candidate — PR #146

`assets/js/octagon-access-panel.js` was production-loaded and combined three misplaced responsibilities:

1. it called `UFC_PLAY_PROFILE.resolve()` for access checks, roster loads, and access toggles;
2. it read `ufc-picks:group:GOAT26` directly from local storage and reacted to token-storage changes;
3. five startup timers, three readiness events, visibility, online, realtime, polling, and direct calls could compete to run `octagon_access_status`, with a second unconditional readiness check and no in-flight owner.

The merged correction:

- consumes only published cached identity for passive and admin access work;
- begins no access RPC before a published member token exists;
- retains one debounced schedule and one in-flight `octagon_access_status` promise;
- preserves periodic server verification, realtime access changes, Cody’s Manage Beta roster, access toggles, and War Room tab gating;
- retains no hidden sign-in or resolver fallback in the access panel.

The focused static contract and mobile Playwright proof passed. The complete Startup Architecture Gate passed on the unchanged rerun after one known shell-proof timing flake. Every pre-existing route, profile-login, Community, Home, Product, app-profile, challenge, notification, Picks, War Room, iOS-startup, sign-in, and delayed-stability proof passed.

## CI-first physical-testing policy

Routine installed-iPhone testing is no longer a merge gate for every narrow ownership correction. More than 25 physical checks completed without an abnormal result, and focused mobile-browser ownership proofs plus the complete Startup Architecture Gate are now the default evidence.

Request one combined physical iPhone test only when a genuine physical-only uncertainty remains, such as:

- service-worker or installed-app cache behavior;
- an actual primary route, sign-in, loading, or native-shell behavior change;
- iOS lifecycle behavior that cannot be reproduced in Playwright;
- conflicting, flaky, or incomplete automated evidence that cannot be resolved in CI.

Do not request a new physical test merely because an unrelated odds-health, generated-Markdown, or deployment commit advances `main`.

See [`TEST_PLAN.md`](./TEST_PLAN.md) for the permanent decision rules.

## Existing unrelated red workflows

These remain outside the startup ownership scope unless a failure directly references the isolated changed files or behavior:

- Production Ranking Browser Smoke may stop at fighter-photo path/render audits.
- Scoring Architecture Guardrails may stop at stale source/runtime, roster-count, ranking, or display-ownership expectations.
- Production ranking pipeline/snapshot checks may report the same stale scoring expectations.
- Picks UI Smoke and historical Phase 4B validation may report pre-existing contract drift.

Inspect their diagnostics. Do not repair them inside a Phase 2 ownership branch without direct overlap.

## Exact next action

Start from fresh current production `main` and audit production-loaded files only. Do not assume the next duplicate in advance.

For one narrow candidate:

1. prove the duplicated responsibility and every startup, route, readiness, visibility, online, realtime, timer, observer, retry, and explicit-action path;
2. name the canonical owner and passive consumer;
3. record existing in-flight or coalescing behavior;
4. make the smallest isolated runtime change;
5. preserve explicit user-action sign-in behavior;
6. add a focused static ownership contract and focused mobile-browser proof;
7. wire both into Startup Architecture Gate and run the complete gate;
8. inspect unrelated red workflows without absorbing them;
9. merge with exact head/base locking after proving any later `main` movement is unrelated.

Do not begin broad Phase 3 repair-loop removal while a Phase 2 duplicate is still being audited.

## Stop conditions

Stop or redesign the candidate if:

- the duplicate cannot be demonstrated;
- removing it loses a legitimate recovery path;
- identity-dependent RPC work can begin before published identity;
- explicit sign-in no longer works;
- one accepted action causes zero or multiple RPCs;
- cached and uncached startup paths become behaviorally different;
- readiness creates repeated refresh work;
- evidence remains conflicting or incomplete;
- the correction requires unrelated product, scoring, data, route, native-shell, schema, or visual changes.
