# Startup Architecture Status

_Last updated: 2026-07-21_

## Current position

- **Latest production runtime merge:** PR #179, `002b31f5ccad3db185b5a6053cb620925482c426`.
- **Exact latest tested runtime head:** `5458ba3545476846d16bbaf58ed279a344dddbdc`.
- **Latest complete Startup Architecture Gate:** run #188 passed.
- **Latest dedicated iOS Home Startup Stability:** run #52 passed.
- **Current phase:** Phase 4 — reduce startup work.
- **Phase 0:** Complete.
- **Phase 1:** Complete.
- **Phase 2:** Complete.
- **Phase 3:** Complete.
- **Phase 4:** In progress; inventory and four runtime reductions complete.
- **Entire startup cleanup:** Approximately 98% complete.
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

The broad trigger set was not legitimate. PR #167 removed body-wide observation, route/soft-refresh repair listeners, six delayed retries, close-button continuation, and public repair scheduling. The retained implementation performs one immediate startup sync and observes only the static drawer’s `class` and `aria-hidden` attributes. Native-destination overlay dismissal remains as proved one-shot behavior.

- Exact tested head: `c332cf912f3c2cbd98984f60902ba70a2304475f`.
- Startup Architecture Gate #168: passed.
- Dedicated iOS Home Startup Stability #36: passed.
- Production merge: `a52364b7a53132a96c8ca5ef5f6726c32a74a2d0`.

## Phase 3 final runtime boundary

`assets/js/native-app-shell-stability.js` contains only one singleton guard, one drawer-to-mobile-body presentation mapping, one immediate startup synchronization, one drawer-attribute observer, and one native-destination overlay dismissal handler.

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

### PR #174 — native-shell delayed startup passes

`assets/js/native-app-shell.js` performed one complete initial component/route/badge synchronization, then repeated Ask-action, active-route, and badge synchronization at 80, 260, 800, 1800, and 4200 milliseconds regardless of change.

The audit proved late requirements already had owners: canonical route events, challenge update events, targeted Picks/War Room DOM observation, resize/orientation and visibility recovery, and the separate 10-second badge poll.

PR #174 removed only the five unconditional passes. Initial creation, owner events, targeted observation, visibility recovery, pull-to-refresh, and live polling are unchanged.

- Exact tested head: `a625b9a1f2dd13de342d0103e004884dcc71a437`.
- Startup Architecture Gate #180: passed.
- Dedicated iOS Home Startup Stability #46: passed.
- Phase 4 Startup Work Inventory #12: passed.
- Production merge: `f03ef47aab32ee67816d7ba86206af3a8c208093`.

### PR #177 — War Room notification startup status retries

`assets/js/octagon-notifications.js` previously called local shell setup and `refreshStatus()` at 0, 180, 700, 1800, and 4200 milliseconds.

The audit proved one passive immediate attempt plus existing identity readiness events cover both startup cases:

- cached identity performs exactly one startup activity-status RPC;
- uncached startup performs zero RPCs and waits for a published identity event;
- readiness events schedule the later request and the in-flight owner coalesces competing calls.

PR #177 removed the 180/700/1800/4200 retries and preserved one immediate shell/status attempt. Direct-link opening, realtime, visibility/online recovery, explicit refresh, mark-seen, push, the 30-second status poll, and the 3-second local DOM maintenance are unchanged.

- Exact tested head: `7d307fb4af9647748b552867390fb9498fe146c0`.
- Startup Architecture Gate #184: passed.
- Dedicated iOS Home Startup Stability #49: passed.
- Phase 4 Startup Work Inventory #15: passed.
- Production merge: `8df258a6dc7e20560783f30d6e974476e62ac5d6`.

### PR #179 — War Room access startup status retries

`assets/js/octagon-access-panel.js` previously ran `ensurePanel()` and `checkCurrentAccess()` at 0, 250, 900, 2600, and 5000 milliseconds.

The audit proved the board mount is already available for the first access attempt because the board owner loads first, registers its startup listener first, and synchronously mounts/binds the board before the access-panel listener runs.

PR #179 removed the 250/900/2600/5000 retries and preserved one immediate panel/status attempt. Cached identity produces exactly one startup RPC; uncached startup produces zero RPCs and waits for readiness. Realtime, visibility/online recovery, the 60-second verification poll, request coalescing, Cody roster/toggles, access rules, and tab state are unchanged.

- Exact tested head: `5458ba3545476846d16bbaf58ed279a344dddbdc`.
- Startup Architecture Gate #188: passed.
- Dedicated iOS Home Startup Stability #52: passed on unchanged rerun after an initial cancellation.
- Phase 4 Startup Work Inventory #18: passed.
- Production merge: `002b31f5ccad3db185b5a6053cb620925482c426`.

## Known unrelated red workflows

These remain outside startup ownership unless a failure directly references an isolated changed line:

- Picks UI Smoke #840 passed Picks JavaScript syntax, then failed the existing mobile top-tab auto-centering, daily odds schedule, and setup-guide documentation checks.
- Production Ranking Browser Smoke #589, #593, #598, and #603 stopped at the existing **Audit every fighter photo path** step before ranking and mobile-profile certification.
- Scoring Architecture Guardrails #1415, #1418, #1422, and #1426 passed syntax, profile-copy coverage, and physical source ownership, then stopped at the established permanent runtime contract step.
- Production Ranking Pipeline and Snapshot may stop on stale ranking/roster certification expectations.
- Validate Phase 4B Preview may stop at its historical hard-pinned architecture check.

None of the inspected failures references the isolated Phase 4 responsibilities.

## Testing and interruption policy

CI and focused mobile-browser ownership proofs are the default merge gate.

Do **not** summon Cody for routine checkpoints, branch decisions, bot-only `main` movement, known unrelated red workflows, normal proof design, or ordinary merge authorization. Continue autonomously through audit, focused implementation, tests, exact-head verification, merge, and documentation when evidence is complete.

Request Cody only when a genuine unresolved user-only or physical-only uncertainty blocks a safe decision, such as installed-app/service-worker behavior automation cannot reproduce, a real route/sign-in/loading/native-shell behavior change with conflicting evidence, an unreproducible iOS lifecycle issue, or a genuine product choice with materially different outcomes.

## Exact next action

1. Start from production merge `002b31f5ccad3db185b5a6053cb620925482c426` plus this documentation merge.
2. Audit `assets/js/octagon-message-board.js` startup mount/bind retries at 50, 220, 850, and 2200 milliseconds.
3. Separate synchronous initial mount/bind work from active War Room startup loading and identity readiness loading.
4. Prove whether the static `#octagon` root and beta tab are already available before the first board start.
5. Preserve message-board RPC ownership, route/visibility/online/realtime behavior, access rules, and active-route loading unless independently proven avoidable.
6. Do not begin broad script-manifest deletion or bundling; that remains Phase 5.
