# Ranking data structure

This folder is where ranking/profile data and patch layers live.

## Current Phase 2J structure

The app now uses real committed source files instead of a giant embedded data script in `index.html`.

Current source split:

```text
assets/data/ranking-data.js        base fighter scores, stats, boards, and profile rows
assets/data/display-overrides.js   app-facing OVR, profile/card polish, photo paths, one-liners
assets/data/ranking-data-patches.js lightweight post-load status hook
assets/js/app.js                   UI/rendering behavior
index.html                         layout shell plus script tags
```

## Files

### `ranking-data.js`

Base ranking/profile payload.

Use this for durable score/stat work such as fighter rows, all-time rank order, boards, UFC records, category scores, title context, opponent rows, round-control rows, and division metadata.

GSP loss-context cleanup, Charles/Ilia score patches, and Petr Yan ranking/profile insertion now live here directly.

### `display-overrides.js`

App-facing profile/card polish.

Use this for front-end OVR values, all-time rank labels, division labels, resume tags, photo paths, one-liners, category display ratings, profile snapshot rows, why-ranked-here copy, why-not-higher copy, key judgment calls, and final takeaways.

Petr Yan profile/card polish now lives here directly.

### `ranking-data-patches.js`

Lightweight post-load status hook.

This file no longer owns durable fighter mutations. Keep it only while the safe branch still benefits from a small status/refresh hook.

## Rule for future chats

Do not add large new fighter batches through `index.html`.

Use the new structure:

```text
score/stat changes -> ranking-data.js
profile/card polish -> display-overrides.js
temporary safe hooks -> ranking-data-patches.js
app behavior -> assets/js/app.js
compare debates -> compare files
```

Next cleanup target: either remove `ranking-data-patches.js` completely or keep it as a harmless status hook until final merge.
