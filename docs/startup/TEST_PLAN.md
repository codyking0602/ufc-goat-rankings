# Startup Architecture Test Plan

This plan defines the minimum evidence required before a startup architecture batch may merge.

## Core proof

A passing batch must demonstrate both:

1. the approved first-run, cached, uncached, retry, and explicit-action behavior still works; and
2. the duplicated ownership or repeated work is removed, delegated, or coalesced.

Syntax alone is never enough.

## Required workflow for one Phase 2 candidate

Before editing:

1. verify exact current production `main`;
2. prove one narrow duplicated responsibility in production-loaded files;
3. name the canonical owner and passive consumer;
4. enumerate every startup, route, readiness, update, timer, visibility, online, realtime, observer, retry, polling, and explicit-action path;
5. record the current in-flight/coalescing behavior and legitimate recovery paths.

After editing:

1. make the smallest isolated runtime change;
2. preserve explicit user-action sign-in behavior;
3. add a focused static ownership contract;
4. add a focused Playwright/mobile-browser ownership proof;
5. wire both into `.github/workflows/startup-architecture-gate.yml`;
6. run the complete Startup Architecture Gate;
7. inspect unrelated red workflows without repairing them unless they directly reference the changed lines or behavior;
8. verify the exact tested head is current or that later `main` movement is proven unrelated;
9. merge with an exact expected head/base lock when appropriate.

## Static ownership contract

The focused static contract should enforce the actual responsibility boundary, not a generic string marker.

As applicable, it must reject:

- passive calls to `UFC_PLAY_PROFILE.resolve()` or `UFC_APP_PROFILE.resolve()`;
- shared helpers that resolve identity during passive work;
- canonical member, admin, group, room, active-group, or display-name storage ownership in a consumer;
- readiness publication by a consumer;
- an identity-dependent RPC before cached/published identity is available;
- duplicate startup handoffs;
- a second unconditional readiness refresh;
- loss of the existing in-flight/coalescing guard;
- reintroduction of a removed route, profile, notification, Picks, War Room, or access owner.

The contract must also preserve required explicit user-action boundaries such as `UFC_PLAY_PROFILE.require()` when sign-in is genuinely needed.

## Focused mobile-browser proof

The focused proof should use a mobile viewport and instrument the exact owner boundary.

Cover the relevant combination of:

- uncached startup: zero resolver/require/editor calls and zero identity-dependent RPCs;
- cached startup: one direct feature handoff;
- canonical readiness/update: one feature request using the published token;
- competing readiness, route, visibility, online, realtime, timer, or direct calls: one in-flight request;
- explicit sign-in: exactly one `require()` call and one intended action;
- explicit feature actions: one RPC using published identity;
- wrong-PIN or failed-login recovery when applicable;
- delayed canonical-owner availability when applicable;
- no duplicate modal, card, panel, directory, board, badge, renderer, or event publication;
- no canonical token read from the consumer’s local-storage call stack.

A proof failure is evidence to investigate. Do not dismiss it as flaky until the exact failure is understood. If the proof itself is wrong, correct only the proof expectation and rerun the complete gate without changing runtime.

## Complete Startup Architecture Gate

Every runtime ownership PR must run the full gate, including current versions of:

- startup syntax and ownership contracts;
- canonical shell recovery;
- canonical profile login delegation;
- Community access and passive identity ownership;
- Home daily passive identity ownership;
- Product cached/uncached profile handoffs;
- App Profile single group snapshot;
- profile-challenge passive inbox loading;
- notification passive identity ownership;
- Picks social and season passive identity ownership;
- War Room board and access ownership;
- iOS-style startup/resume route stability;
- real profile/Picks sign-in stability;
- delayed Home/community/profile stability.

A known unchanged timing proof may be rerun unchanged after diagnostics show no overlap. Do not patch runtime to satisfy an unrelated flaky proof.

## CI-first physical-testing policy

Focused mobile-browser proofs plus the complete Startup Architecture Gate are the default merge gate. More than 25 installed-iPhone checks completed without one abnormal result, so routine physical testing is no longer required for every narrow ownership change.

Request one combined physical iPhone test only when a genuine physical-only uncertainty remains:

- service-worker activation, installed-app cache, or stale installed-resource behavior;
- an actual change to primary routing, sign-in UI, loading UI, or native-shell behavior;
- iOS lifecycle behavior that cannot be reproduced in Playwright;
- conflicting, flaky, or incomplete automated evidence that cannot be resolved in CI;
- a product behavior whose correctness depends on the installed-app container rather than browser semantics.

Do not request a physical test solely because:

- a narrow passive consumer stopped resolving identity;
- a duplicate token read or startup handoff was removed;
- an in-flight guard was added without changing visible behavior;
- an unrelated odds-health, generated-Markdown, scoring, photo, or deployment commit advanced `main`;
- the exact tested runtime/test blobs are unchanged under a required generated child commit.

When a physical test is required, state the exact unresolved uncertainty and combine related checks into one test.

## Main movement and generated commits

Automated odds-health, deployment, or generated-Markdown workflows may advance `main` or a PR branch.

When this happens:

1. inspect the changed files;
2. prove whether they overlap the Phase 2 branch;
3. replay onto current `main` when necessary;
4. do not endlessly rerun the complete gate after every unrelated bot-only commit;
5. preserve complete-gate evidence when the exact runtime/test head passed and a later child changes only a proven unrelated generated file;
6. merge with exact expected head/base locking.

## Unrelated red workflows

Production Ranking Browser Smoke, Scoring Architecture Guardrails, production ranking pipeline/snapshot checks, Picks UI Smoke, and historical Phase 4B validation may remain red for documented reasons outside startup ownership.

For every red workflow:

- inspect the failed step and retained diagnostics;
- state whether it references the isolated changed files or behavior;
- do not repair it in the Phase 2 branch without direct overlap.

## Merge decision

### Green

- The duplicate is demonstrated.
- The canonical owner and passive consumer are explicit.
- The focused static and browser proofs pass.
- The complete Startup Architecture Gate passes, including any justified unchanged rerun.
- Cached, uncached, retry, and explicit-action paths remain correct.
- No identity-dependent RPC begins before published identity.
- One accepted action creates exactly one intended RPC.
- Branch/head/base movement is understood and locked.
- Unrelated red workflows are inspected and documented.
- No unresolved physical-only uncertainty remains.

### Hold or redesign

- The duplicate is not proved.
- A legitimate recovery path is lost.
- Cached and uncached behavior diverge.
- Identity-dependent work starts before published identity.
- Explicit sign-in stops working or passive work opens sign-in UI.
- One accepted action produces zero or multiple RPCs.
- Readiness creates repeated refresh work.
- Automated evidence is conflicting or incomplete.
- The correction absorbs unrelated product, scoring, data, route, schema, native-shell, or visual work.

### Reject or revert

- Visible product behavior changes without approval.
- Route, sign-in, loading, or saved-state behavior changes unexpectedly.
- The batch adds a competing resolver, storage reader, readiness publisher, timer, observer, polling loop, loader, or repair owner.
- Multiple follow-up patches are needed to restore surrounding surfaces.
