# PR #100 Installed-iPhone Verification

This is the final manual gate for draft PR #100, **Add zero-change singleton guards to route startup**.

## Exact build under test

- PR: `#100`
- Head commit: `8136c728f5794229273b8a2c5ce9f291eeaf30db`
- Runtime diff: 8 additions, 0 deletions, 3 files
- Preview snapshot: [Open immutable PR #100 preview](https://rawcdn.githack.com/codyking0602/ufc-goat-rankings/8136c728f5794229273b8a2c5ce9f291eeaf30db/index.html)

The preview is served from a different origin than the production app. It does not replace the live GitHub Pages installation and it has separate browser storage. Use it only for this verification, then remove it from the Home Screen.

## Install the test snapshot

1. Open the preview link in Safari on the iPhone.
2. Confirm the Octagon HQ Home screen loads.
3. Tap Safari’s Share button.
4. Choose **Add to Home Screen**.
5. Give it a temporary name such as **Octagon Test** so it cannot be confused with the live app.
6. Open **Octagon Test** from the Home Screen.

If the preview does not load correctly, cannot be added to the Home Screen, or opens with missing assets, stop. Do not use that result as approval to merge.

## Required checks

### 1. Fully closed cold launch

- Swipe away **Octagon Test** from the app switcher.
- Open it from the Home Screen.
- Expected: one Home view, one bottom navigation, no blank screen, no route bounce, no repeated reminder.

### 2. Relaunch after leaving on Picks

- Open Picks.
- Leave the test app in the background for several seconds.
- Swipe it away fully.
- Reopen it from the Home Screen.
- Expected: the approved current route behavior is preserved. There must not be repeated Home/Picks bouncing or two visible views.

### 3. Background and resume

- Open Home, background the app, and return.
- Repeat from Picks.
- Expected: no flicker, blank state, duplicated navigation, duplicated profile reminder, or repeated tap response.

### 4. Tap handling

- Tap Home, Rankings, Play, Picks, and War Room once each where access allows.
- Expected: each tap changes destination once. No double transition or immediate bounce back.

### 5. Profile reminder and profile surface

- Open the profile surface.
- If the test origin is signed out or incomplete, observe the setup reminder once.
- Expected: no duplicate cards, duplicate reminder overlays, or repeated opening from one tap.

## Pass statement

Record this exact statement on PR #100 when all checks pass:

> Physical iPhone verification passed on the immutable PR #100 snapshot. Fully closed cold launch, non-Home/Picks relaunch, background/resume, navigation taps, and profile-reminder behavior showed no blank screen, route bounce, duplicate view, duplicate reminder, duplicate navigation shell, or double tap handling. Visible behavior matched the approved app.

## Failure statement

Record what happened, the exact step, and whether it reproduced after a second clean install. Leave PR #100 draft and do not merge.

## Cleanup

After testing, remove **Octagon Test** from the iPhone Home Screen. Keep the production Octagon HQ installation untouched.