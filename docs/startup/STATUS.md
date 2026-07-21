# Startup Architecture Status

_Last updated: 2026-07-21_

## Current position

- **Latest production runtime merge:** PR #171, `2eea1a03e169e3ba3289b4c0b6198a87ea4233ab`.
- **Exact latest tested runtime head:** `de893fa4927e22a7968522c69fd429c17e46c965`.
- **Latest complete Startup Architecture Gate:** run #177 passed.
- **Latest dedicated iOS Home Startup Stability:** run #44 passed.
- **Current phase:** Phase 4 — reduce startup work.
- **Phase 0:** Complete.
- **Phase 1:** Complete.
- **Phase 2:** Complete.
- **Phase 3:** Complete.
- **Phase 4:** In progress; inventory and first runtime reduction complete.
- **Entire startup cleanup:** Approximately 95% complete.
- **Visible product changes approved:** None. The zero-visible-change contract remains in force.
- **Master tracker:** [Issue #102](https://github.com/codyking0602/ufc-goat-rankings/issues/102).
- **Completed Phase 2 ledger:** [`PHASE-2-PROGRESS-20260721.md`](./PHASE-2-PROGRESS-20260721.md).
- **Completed Phase 3 ledger:** [`PHASE-3-PROGRESS-20260721.md`](./PHASE-3-PROGRESS-20260721.md).
- **Current Phase 4 ledger:** [`PHASE-4-PROGRESS-20260721.md`](./PHASE-4-PROGRESS-20260721.md).

The older percentage estimates are superseded.

## Completed architecture boundaries

### Phase 1 — idempotent owners

All 13 audited Phase 1 runtime owners are protected according to their actual lifecycle class:

- simple owners use complete-owner guards;
- prerequisite-aware owners claim ownership only after prerequisites exist;
- `assets/js/app.js` remains an exact-one structural manifest singleton;
- `assets/js/production-ranking-bootstrap.js` owns an explicit retryable lifecycle.

### Phase 2 — duplicate ownership removed

- `assets/js/octagon-hq-shell.js` is the sole primary destination and ranking-subview activation owner.
- `assets/js/play-profile-identity.js` is the sole shared credential, login/fallback, identity-cache, canonical-readiness, and access-persistence owner.
- `assets/js/app-profile.js` is the sole visible editor/full group-snapshot owner.
- Passive Community, Home, notification, Picks, challenge, and War Room consumers use published identity and coalesced request owners.
- Notification compatibility cannot invoke canonical settings/render ownership.
- Native pull performs one final activity-status refresh.
- Historical-token migration hands its validated identity to the canonical owner without a duplicate snapshot.
- The final production-load audit found no remaining demonstrated competing route, identity, access, readiness, notification, profile, or full-refresh owner.

### Phase 3 — repair loops retired

#### PR #159 — Ranking Spotlight repair

The former stability renderer independently watched Home mutations, consumed ranking-readiness events, ran delayed retries, and could replace the canonical placeholder. `home-dashboard.js` already owned the complete Spotlight lifecycle.

- Exact tested head: `c274c5d1c35f2d1b212632dd181e5f29343c1178`.
- Startup Architecture Gate #151: passed.
- Dedicated iOS Home Startup Stability #22: passed.
- Production merge: `aa09175a99fcd1b381645e96e74531336674346f`.

#### PR #161 — Resume Snapshot repair

The former stability writer inferred the fighter, recalculated and rewrote snapshot values, and stored hidden fighter state. `calculated-profile-runtime.js` already owned `openFighter()`, the complete profile write, all eight calculated snapshot fields, and the canonical-facts win-streak fallback.

- Exact tested head: `534a984625bb2764beb289b0211ab102318dd713`.
- Startup Architecture Gate #158: passed.
- Dedicated iOS Home Startup Stability #28: passed.
- Production merge: `942cdd215aa81cb3820fb464334d08101a139e9d`.

#### PR #163 — What’s New normalization

`app-update-watcher.js` already owned update-control markup, click binding, unread count, badge state, accessibility labels, and seen/storage synchronization. The stability normalizer treated the owner’s normal plain-text `NEW` markup as malformed and rewrote it every startup.

PR #163 made the canonical watcher emit complete labeled markup in its one control write, then removed the normalizer, API exposure, and update-control observer targets.

- Exact tested head: `b0dc85d4027845952890cc7e2e11ffdcf6c1b11f`.
- Startup Architecture Gate #163: passed.
- Dedicated iOS Home Startup Stability #32: passed.
- Production merge: `ec8fce96cad3a19763da9545ffd671f484750556`.

#### PR #167 — Drawer synchronization trigger narrowing

The drawer-to-body mapping is legitimate: profile owners control `#drawer.open` and `aria-hidden`, while mobile CSS requires `body.fighter-profile-open` for scroll lock. Removing the mapping would cause a real mobile regression.

The broad trigger set was not legitimate. PR #167 removed:

- body-wide child/subtree/attribute observation;
- route-change and soft-refresh listeners;
- six delayed startup retries;
- close-button continuation;
- public repair scheduling.

The retained implementation performs one immediate startup sync and observes only the static drawer’s `class` and `aria-hidden` attributes.

The separate native-overlay audit proved `closeFighterProfile()` is also legitimate: native destination buttons delegate routing but neither the native shell nor the route owner dismisses an already-open fighter drawer. The handler delegates to the canonical close button and retains a bounded missing-button fallback.

- Exact tested head: `c332cf912f3c2cbd98984f60902ba70a2304475f`.
- Startup Architecture Gate #168: passed.
- Dedicated iOS Home Startup Stability #36: passed.
- Production merge: `a52364b7a53132a96c8ca5ef5f6726c32a74a2d0`.

## Phase 3 final runtime boundary

`assets/js/native-app-shell-stability.js` is no longer a general repair loop. It contains only:

1. one singleton guard;
2. one drawer-to-mobile-body presentation mapping;
3. one immediate startup synchronization;
4. one drawer-attribute observer;
5. one native-destination overlay dismissal handler.

It has no canonical content renderer, body-wide observer, route/soft-refresh repair listener, delayed retry array, close-button continuation, or public repair API.

Further movement or renaming belongs to Phase 5 script-manifest simplification, not repair-loop retirement.

## Phase 4 — startup work reduced

### PR #169 — measured production inventory

PR #169 added a read-only inventory of the production JavaScript manifest. It records loaded order, size, scheduling signals, lifecycle listeners, potential network operations, and profile/group-snapshot references. Counts identify audit candidates; they are not treated as proof that a matched operation executes at startup.

- Inventory head: `f8831fc2060f4a591b477d0c7329fcec0e520c77`.
- Production merge: `f1de569d022bf8fd6bb41a1710d8617957312d0e`.
- Phase 4 Startup Work Inventory #1: passed.

### PR #171 — commissioner snapshot activation

`assets/js/picks-commissioner.js` previously requested commissioner state during Home startup when saved Picks access existed, scheduled refreshes after hidden Picks mutations, and continued its 45-second poll while Picks was off-screen.

PR #171 retained the commissioner module as the canonical data/action owner but bound its network work to active Picks:

- Home startup installs only the local card shell and performs zero commissioner RPCs;
- direct Picks startup and route entry refresh only after the card is mounted;
- late card creation receives one bounded refresh handoff;
- ordinary hidden or active subtree mutations do not request state;
- the 45-second freshness poll runs only while Picks is active;
- explicit commissioner actions retain their forced refreshes.

- Exact tested head: `de893fa4927e22a7968522c69fd429c17e46c965`.
- Startup Architecture Gate #177: passed.
- Dedicated iOS Home Startup Stability #44: passed.
- Production merge: `2eea1a03e169e3ba3289b4c0b6198a87ea4233ab`.

## Known unrelated red workflows

These remain outside startup ownership unless a failure directly references an isolated changed line:

- Picks UI Smoke #840 passed Picks JavaScript syntax, then failed the existing mobile top-tab auto-centering, daily odds schedule, and setup-guide documentation checks.
- Production Ranking Browser Smoke #589 stopped at the existing **Audit every fighter photo path** step before ranking and mobile-profile certification.
- Scoring Architecture Guardrails #1415 passed syntax, profile-copy coverage, and physical source ownership, then stopped at its established permanent runtime contract step.
- Production Ranking Pipeline and Snapshot may stop on stale ranking/roster certification expectations.
- Validate Phase 4B Preview may stop at its historical hard-pinned architecture check.

None of the inspected #840, #589, or #1415 failures references the isolated commissioner activation responsibility.

## Testing and interruption policy

CI and focused mobile-browser ownership proofs are the default merge gate.

Do **not** summon Cody for routine checkpoints, branch decisions, bot-only `main` movement, known unrelated red workflows, normal proof design, or ordinary merge authorization. Continue autonomously through audit, focused implementation, tests, exact-head verification, merge, and documentation when evidence is complete.

Request Cody only when a genuine unresolved user-only or physical-only uncertainty blocks a safe decision, such as installed-app/service-worker behavior automation cannot reproduce, a real route/sign-in/loading/native-shell behavior change with conflicting evidence, an unreproducible iOS lifecycle issue, or a genuine product choice with materially different outcomes.

## Exact next action

1. Start from production merge `2eea1a03e169e3ba3289b4c0b6198a87ea4233ab` plus this documentation merge.
2. Audit the five unconditional native-shell startup resynchronization passes at 80, 260, 800, 1800, and 4200 milliseconds.
3. Separate component creation, active-route synchronization, and badge synchronization before editing.
4. Prove whether any late prerequisite still requires each delayed pass.
5. Preserve the 10-second live badge poll as a separate responsibility unless independently proven avoidable.
6. Do not begin broad script-manifest deletion or bundling; that remains Phase 5.
