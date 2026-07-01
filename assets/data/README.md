# Ranking data structure

This folder is where ranking/profile data and patch layers live.

## Current Phase 2G structure

The original app still has the large `window.RANKING_DATA` payload, `DISPLAY_OVERRIDES` object, and app/rendering JavaScript embedded in `index.html` at source level.

During the Pages build, those chunks are promoted into source-style paths:

1. `tools/split-ranking-data.py` extracts the embedded ranking payload into `assets/data/ranking-data.js`.
2. `tools/split-display-overrides.py` extracts the embedded display/profile polish into `assets/data/display-overrides.js`.
3. `tools/split-app-js.py` extracts the app/rendering behavior into `assets/js/app.js`.
4. The built `index.html` loads those files before the Compare stack and patch layer finish booting.

This gives us a safer migration path:

1. Keep the polished UI intact.
2. Stop shipping one giant all-in-one HTML file in the built app.
3. Move the deployed structure to the same file names we want long-term.
4. Create a clean path for making those files true committed source files next.

## Files

### `ranking-data.js`

Built during the Pages build by `tools/split-ranking-data.py`.

Long-term, this should become the real committed source file for base fighter scores/stats.

### `display-overrides.js`

Built during the Pages build by `tools/split-display-overrides.py`.

This contains app-facing polish such as:

- front-end OVR values
- all-time rank labels
- division labels
- resume tags
- photo paths
- one-liners
- category display ratings
- profile snapshot rows
- why-ranked-here copy
- why-not-higher copy
- key judgment calls
- final takeaways

Long-term, this should become the real committed source file for front-end profile/card polish.

### `ranking-data-patches.js`

Current Phase 2 patch layer.

Use this for temporary safe-branch data fixes while restructuring, including:

- Petr Yan ranking/profile insertion.
- GSP loss-context cleanup.
- Charles Oliveira and Ilia Topuria score patches.
- Dropdown/profile refresh after data patches.

This file should stay data-only. It should not own Compare rendering.

## Long-term target

Eventually, the source `index.html` should not contain fighter data, display/profile polish, or app/rendering logic.

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
2. Ranking data split. Done in Phase 2D build/preview path.
3. Display overrides split. Done in Phase 2E build/preview path.
4. App/rendering JS split. Done in Phase 2F build/preview path.
5. Source-style path promotion. Done in Phase 2G build path.
6. Then make `ranking-data.js`, `display-overrides.js`, and `app.js` committed source files.
7. Then add new fighter batches through the proper structure.
