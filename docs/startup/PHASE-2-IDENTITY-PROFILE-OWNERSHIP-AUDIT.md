# Phase 2 Identity and Profile Ownership Audit

_Last updated: 2026-07-20_

## Scope

This documentation-only audit starts from production `main` commit `fa47a51513c28bc3ba6173f1c95c47ca97ab85aa`, after both Phase 2 route-owner batches passed automated and installed-iPhone verification.

The audit maps identity resolution, profile login, local token persistence, legacy-group adoption, profile editing, avatar/photo projection, community rendering, Picks PIN management, notification consumption, readiness events, retries, and route continuation. It authorizes no broad identity rewrite and changes no runtime behavior.

## Governing boundary

Identity/profile is not one responsibility. The current app intentionally separates:

1. credential verification and resolved identity;
2. legacy token adoption into the permanent GOAT26 group;
3. profile presentation and editing;
4. Picks PIN management;
5. community/profile activity rendering;
6. cross-feature token and avatar compatibility;
7. notification consumption.

Only duplicated ownership inside one of those responsibilities is a Phase 2 removal candidate. Consumers may resolve or decorate identity, but they may not recreate login or canonical token persistence.

## Current owner map

| Responsibility | Intended owner | Required behavior |
|---|---|---|
| Shared profile credential verification | `assets/js/play-profile-identity.js` through `window.UFC_PLAY_PROFILE.login()` | Try `app_profile_login`, retain the legacy `picks_member_login_pin` fallback, validate the returned member token, cache the resolved identity, and publish profile readiness |
| Shared identity resolution | `assets/js/play-profile-identity.js` through `resolve()` | Wait for canonical-group adoption, inspect stored candidate tokens, try `app_profile_resolve` then `play_identity_snapshot`, normalize storage, cache one identity, and publish `ufc-play-profile-ready` |
| Legacy group-token adoption | `assets/js/app-canonical-group.js` | Inspect pre-GOAT26 group tokens before the shared profile owner resolves, migrate valid access to GOAT26, canonicalize an incoming group URL, preserve room/admin tokens, and perform the existing one-time reload when required |
| Profile editor and profile-group snapshot | `assets/js/app-profile.js` through `window.UFC_APP_PROFILE` | Render the profile chip/editor, manage fighter-avatar and uploaded-photo changes, request the group snapshot, and publish `ufc-app-profile-updated` |
| Picks sign-in/PIN surface | `assets/js/picks-member-pin.js` | Render the returning-member card, own PIN status/change and commissioner PIN controls, preserve Picks-specific validation/copy/status and continue to the active Picks room after successful shared login |
| Community profiles and Top 10 | `assets/js/community-profiles.js` | Consume the resolved profile, load/render community snapshots, edit/publish Top 10, and refresh on identity/profile events |
| Activity profile | `assets/js/profile-activity.js` | Consume the shared identity and render games, Picks, War Room, achievements, and recent activity |
| Avatar projection | `assets/js/profile-avatar-sync.js` | Consume `UFC_APP_PROFILE` and repaint existing Home/War Room avatar surfaces |
| Cross-feature Picks compatibility | `assets/js/product-architecture.js` | Suppress an obsolete duplicate Picks sign-in card after shared identity becomes available, copy required compatibility storage, and refresh the Picks PIN surface |
| Notification identity consumption | `assets/js/app-notification-center.js` | Resolve the shared identity only to load/save notification settings and register the current device |

## Confirmed duplicate responsibility

`assets/js/picks-member-pin.js` currently performs a second implementation of shared profile login:

- it creates and uses its own Supabase client for member authentication;
- it calls `picks_member_login_pin` directly;
- it independently writes the canonical group token, admin token, display name, room tokens, and room-admin tokens;
- it returns its own login result to the Picks continuation route.

`assets/js/play-profile-identity.js` already owns the same credential and persistence boundary:

- `login()` calls the current `app_profile_login` RPC;
- it retains `picks_member_login_pin` as the compatibility fallback;
- `storeLogin()` writes the same canonical group/admin/room/display-name access;
- `snapshot()` resolves and caches the shared identity;
- it publishes `ufc-play-profile-ready` for the rest of the app.

This is genuine duplicate ownership, not merely two profile surfaces.

## Responsibilities that only look duplicated

### Canonical-group adoption is earlier than normal login

`app-canonical-group.js` must remain separate. It loads before `play-profile-identity.js`, discovers tokens saved under historical group codes, validates them, migrates them into GOAT26, canonicalizes the URL, and may reload once. Normal sign-in delegation cannot replace that pre-resolution migration path.

### Profile editing is not authentication

`app-profile.js` delegates credential work to `UFC_PLAY_PROFILE`. Its own group snapshot, chip/editor UI, photo crop, fighter fallback, and profile update event are profile-presentation responsibilities.

### PIN management is not authentication ownership

The Picks PIN module still owns:

- the returning-member card and its Picks-specific copy;
- current-member PIN status;
- setting or changing the member PIN;
- commissioner PIN management;
- PIN surface decoration and refresh;
- the existing observer, route listener, and 45-second status refresh.

The first runtime batch must not remove or relocate those responsibilities.

### Community, activity, avatar, notification, and product modules are consumers

These modules cache, render, decorate, or hand off resolved identity. Some duplicate storage synchronization remains visible in `community-profiles.js` and `product-architecture.js`, but that is a later compatibility candidate. It is not required to delegate the first credential-verification path safely.

## Required execution traces

A focused proof must cover all of the following before runtime merge:

1. **Stored shared identity:** `UFC_PLAY_PROFILE.resolve()` returns the cached/snapshotted profile once and the Picks sign-in card remains absent.
2. **Current login RPC succeeds:** the Picks card delegates one login to `UFC_PLAY_PROFILE`; only `app_profile_login` performs credential verification.
3. **Legacy login fallback:** when `app_profile_login` is unavailable, the canonical owner performs exactly one `picks_member_login_pin` fallback and the Picks module performs none directly.
4. **Wrong PIN:** canonical failure is shown in the existing Picks status surface, the button is restored, no access storage is changed, and no route occurs.
5. **Active room continuation:** a successful login with an active room preserves group, room, event, `picksView=event`, last-room restoration, and `#picks`.
6. **No active room:** successful login without an active room routes to GOAT26 Picks Home and removes stale room/event parameters.
7. **Admin/member persistence:** canonical group, member token, admin token, display name, room token, and room-admin token remain exactly available after login.
8. **Delayed identity owner:** if `window.UFC_PLAY_PROFILE` is temporarily unavailable, the Picks module must not fall back to direct authentication; it must remain retryable after the owner appears.
9. **Readiness publication:** the shared modal login keeps its existing `ufc-play-profile-ready` publication, while the reload-bound Picks continuation does not introduce an extra visible render or route before navigation.
10. **PIN management preservation:** member PIN status/change and commissioner PIN RPC paths remain owned by `picks-member-pin.js` and unchanged.
11. **Existing profile surfaces:** the app profile chip, profile editor, community directory, activity profile, avatars, notifications, and Picks authentication surface still consume the same resolved identity.
12. **Cold continuation normalization:** the established successful-login URL remains stable during the session, and the later simulated cold launch retains the existing Home normalization behavior.

## First isolated runtime candidate

Delegate only the returning-member Picks login transaction to `window.UFC_PLAY_PROFILE`.

The smallest acceptable runtime batch may:

1. extend the canonical login result so Picks receives the existing group, active-room, rooms, member, member/admin tokens needed for route continuation;
2. provide a way for the reload-bound Picks path to suppress a redundant pre-navigation readiness publication while leaving the shared profile modal behavior unchanged;
3. replace `picks-member-pin.js` direct authentication and duplicate access persistence with one canonical login call;
4. preserve the Picks card validation, loading/status/error copy, button state, and post-login route construction;
5. add a focused delegation harness and permanent contract assertions.

The batch must not change:

- the GOAT26 code or storage-key formats;
- canonical-group adoption or its reload behavior;
- the profile chip/editor, avatar/photo system, group snapshot, or `ufc-app-profile-updated` event;
- community, activity, notification, avatar-sync, product-architecture, native-shell, sharing, or route-shell runtime;
- member PIN status/change or commissioner PIN controls;
- Picks room/event continuation semantics;
- profile copy, product styling, rankings, data, Games, War Room, or Intelligence.

## Focused automated proof

The runtime PR must add a dedicated browser proof that records RPC names, storage writes, readiness events, routes, and UI state. It must demonstrate:

- one canonical login transaction per accepted submit;
- zero direct login RPC calls from the Picks module;
- current-RPC and legacy-fallback success;
- no storage or navigation on failure;
- delayed-owner retry without direct fallback;
- active-room and no-room continuation parity;
- exact preservation of PIN-management APIs and RPC ownership;
- no duplicate profile chip, community directory, activity overlay, notification surface, native navigation, or route activation.

The complete Startup Architecture Gate, existing profile sign-in stability test, Phase 4B mobile/community test, iOS startup/resume test, and syntax/ownership contracts must pass on the immutable runtime head.

## Physical iPhone proof

Before merge, the exact immutable runtime head must be tested in the installed app for:

- returning-member Picks card presentation;
- wrong-PIN recovery followed by correct-PIN success;
- continuation to the active Picks event/room;
- no duplicate card, modal, loading state, or route bounce;
- profile chip and editor;
- community directory and own profile;
- activity profile;
- notification settings surface;
- background/resume, force-close/relaunch, rapid navigation, and rotation/resize.

## Stop conditions

Reject or redesign the candidate before merge if:

- Picks needs to call a login RPC or write access tokens after canonical delegation;
- the canonical owner cannot return the existing active-room/event context;
- a delayed owner makes sign-in permanently unavailable rather than retryable;
- one accepted submit performs zero or multiple credential checks;
- shared modal login behavior changes;
- PIN settings or commissioner PIN ownership moves;
- canonical-group migration, community, notification, avatar, activity, product, route, native-shell, or sharing files must change;
- any visible copy, styling, profile data, Picks state, route, ranking, scoring, or product behavior changes.

## Deferred identity/profile candidates

After the first credential-delegation batch is physically verified, audit the remaining compatibility duplication separately:

1. token/display/room synchronization repeated by `product-architecture.js` and `community-profiles.js`;
2. readiness-event naming and payload normalization across `ufc-play-profile-ready`, `ufc-app-profile-ready`, and `ufc-app-profile-updated`;
3. profile chip click interception between `app-profile.js` and `profile-activity.js`;
4. legacy sign-in-card suppression after canonical identity becomes available.

Do not combine those concerns with the first login-delegation PR.
