# Startup Architecture Execution Plan

## Objective

Make Octagon HQ smooth, reliable, and maintainable without changing the approved user experience.

## Workstream rules

- Runtime changes occur in small draft PRs.
- One ownership problem per PR.
- Regression coverage is added before fallback deletion.
- No architecture PR includes fighter data, scoring changes, feature work, visual redesign, or copy changes.
- No script is moved or removed during Phase 1.
- Every phase ends with updated status, inventory, decisions, and master-issue notes.

## Phase 0 — Freeze and measure

**Status:** Complete

### Deliverables

- Zero-visible-change contract.
- Startup Architecture Gate.
- Script duplication and load-order checks.
- Browser coverage for iOS routes, profile startup, Home stability, and duplicate shell behavior.
- Persistent status, inventory, decision log, handoff file, and master issue.

### Exit criteria

- The approved behavior is written down.
- Existing failures are distinguishable from new regressions.
- Every runtime cleanup has an automatic stop sign.

## Phase 1 — Make startup owners idempotent

**Status:** In progress

### Goal

A second evaluation or start call must not create another listener set, observer, interval, DOM owner, service-worker registration flow, or navigation activation.

### Planned batches

1. Route startup controllers — PR #100.
2. Canonical app shell.
3. Native app shell.
4. Home dashboard and community profiles.
5. Notification center.
6. Compatibility and sharing owners.
7. Dynamically loaded product-support modules.

### Exit criteria

- Every Tier 1 and Tier 2 startup owner is classified.
- Every true startup owner is globally idempotent or intentionally repeatable.
- Duplicate script evaluation tests exist for high-risk owners.
- No script moved or deleted.
- No visible behavior changed.

## Phase 2 — Remove duplicate ownership

**Status:** Not started

### Goal

One canonical owner for each responsibility:

- active route and destination;
- identity and profile readiness;
- notification data and notification surfaces;
- Home rendering and refresh triggers;
- native navigation and refresh;
- incoming shared-link routing.

### Method

For each responsibility:

1. Map every writer, listener, observer, timer, and public global.
2. Choose the canonical owner.
3. Convert other systems into consumers or narrow compatibility facades.
4. Add a behavioral regression test.
5. Remove only the duplicate ownership path.

### Exit criteria

- One named owner per responsibility.
- Compatibility facades do not render, route, or refresh independently.
- No repeated route events or competing DOM renderers.

## Phase 3 — Retire repair loops

**Status:** Not started

### Goal

Remove repair code by correcting source renderers, one repair at a time.

### Initial targets

- `native-app-shell-stability.js`
- `app-notification-surface-fix.js`
- navigation-grid cleanup behavior
- repeated delayed repair schedules in feature-specific polish files

### Repair-removal procedure

1. Identify the exact bad source output.
2. Capture it in a failing browser test.
3. Fix the source owner.
4. Prove correct output without the repair.
5. Remove one repair.
6. Verify installed iPhone behavior when applicable.

### Exit criteria

- Compatibility files are removed or reduced to intentional facades.
- No broad MutationObserver exists solely to repair another renderer.
- No multi-second repair schedule is needed after startup.

## Phase 4 — Reduce startup work

**Status:** Not started

### Goal

Only Home-critical systems block first usable render. Route-specific systems load when their destination needs them.

### Order

1. Measure current request and execution sequence.
2. Identify noncritical route-specific modules.
3. Lazy-load one destination family at a time.
4. Preserve immediate-feeling destination opens.
5. Keep explicit loading ownership and retry behavior.

### Exit criteria

- Home reaches stable usable state without loading unrelated heavy feature families.
- Destination opening looks and behaves exactly as before.
- No race condition depends on arbitrary timeouts.

## Phase 5 — Simplify the script manifest

**Status:** Not started

### Goal

Turn `index.html` from a patch stack into a readable ordered dependency manifest.

### Work

- Remove superseded scripts after their consumers are migrated.
- Remove stale cache-key variants and temporary loaders.
- Group scripts by owner and dependency order.
- Keep fighter data outside `index.html`.
- Preserve static GitHub Pages deployment.

### Exit criteria

- Every loaded script has an active owner and purpose.
- No duplicate or superseded compatibility file remains.
- Load order is enforced by tests rather than tribal knowledge.

## Final certification

Startup stabilization is complete only when:

- the app starts correctly from Home, every supported deep link, Picks continuation, browser reload, and installed iPhone launch;
- one active view and one navigation shell exist at all times;
- profile, scoring, notification, visibility, and lifecycle events cannot trigger route churn or repeated full rendering;
- no reload loop or recurring repair loop exists;
- all startup owners are documented and tested;
- the app is visibly and functionally unchanged from the approved baseline.
