# Ranking data structure

This folder is where ranking/profile data patches and generated ranking payloads live.

## Current Phase 2D structure

The original app still has the large `window.RANKING_DATA` payload embedded in `index.html` at source level.

During the Pages build, `tools/split-ranking-data.py` extracts that embedded payload into:

```text
assets/data/ranking-data-generated.js
```

Then the built `index.html` loads that generated file before the remaining app code runs.

This gives us a safer migration path:

1. Keep the polished UI intact.
2. Stop shipping one giant all-in-one HTML file in the built app.
3. Create a clean path for moving source data out of `index.html` later.

## Files

### `ranking-data-patches.js`

Current Phase 2 patch layer.

Use this for temporary safe-branch data fixes while restructuring, including:

- Petr Yan ranking/profile insertion.
- GSP loss-context cleanup.
- Charles Oliveira and Ilia Topuria score patches.
- Dropdown/profile refresh after data patches.

This file should stay data-only. It should not own Compare rendering.

### `ranking-data-generated.js`

Generated during the Pages build by `tools/split-ranking-data.py`.

Do not edit directly because it is generated from the embedded source payload.

## Long-term target

Eventually, the source `index.html` should not contain fighter data at all.

Target structure:

```text
assets/data/ranking-data.js        base ranking/profile payload
assets/data/ranking-data-patches.js temporary safe patch layer, eventually removed
assets/data/display-overrides.js   front-end OVR, profile copy, photo paths, app-facing polish
assets/js/app.js                   UI/rendering logic
index.html                         layout only
```

## Rule for future chats

Do not add large new fighter batches until the ranking/profile structure is clean enough to update safely.

For now, continue restructuring in this order:

1. Compare stack cleanup. Done in Phase 2C.
2. Ranking data split. In progress in Phase 2D.
3. Display overrides split.
4. App/rendering JS split.
5. Then add new fighter batches through the proper structure.
