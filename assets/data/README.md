# Ranking data structure

This folder is where ranking/profile data and patch layers live.

## Current Phase 2I structure

The app now uses real committed source files instead of a giant embedded data script in `index.html`.

Current source split:

```text
assets/data/ranking-data.js        base fighter scores, stats, boards, and profile rows
assets/data/display-overrides.js   app-facing OVR, profile/card polish, photo paths, one-liners
assets/data/ranking-data-patches.js temporary safe-branch patch layer
assets/js/app.js                   UI/rendering behavior
index.html                         layout shell plus script tags
```

## Files

### `ranking-data.js`

Base ranking/profile payload.

Use this for durable score/stat work such as fighter rows, all-time rank order, boards, UFC records, category scores, title context, opponent rows, round-control rows, and division metadata.

### `display-overrides.js`

App-facing profile/card polish.

Use this for front-end OVR values, all-time rank labels, division labels, resume tags, photo paths, one-liners, category display ratings, profile snapshot rows, why-ranked-here copy, why-not-higher copy, key judgment calls, and final takeaways.

### `ranking-data-patches.js`

Temporary safe-branch patch layer.

Use this only for temporary safe-branch fixes while restructuring.

Long-term, anything durable in this file should be moved into `ranking-data.js` or `display-overrides.js`, then this patch file can shrink or be removed.

## Rule for future chats

Do not add large new fighter batches through `index.html`.

Use the new structure:

```text
score/stat changes -> ranking-data.js
profile/card polish -> display-overrides.js
temporary safe patches -> ranking-data-patches.js
app behavior -> assets/js/app.js
compare debates -> compare files
```

Next cleanup target before large fighter expansion: move durable Petr Yan, GSP, Charles, and Ilia patch content out of `ranking-data-patches.js` and into the real source files.
