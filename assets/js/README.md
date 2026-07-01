# App JavaScript structure

This folder is the target location for app/rendering behavior.

## Current Phase 2G structure

The source `index.html` still contains the app/rendering JavaScript for now.

During the Pages build, `tools/split-app-js.py` extracts the app behavior into:

```text
assets/js/app.js
```

This file includes the rendering and behavior code such as:

- `overallOvr`
- `categoryOvr`
- `renderList`
- `openFighter`
- `renderDivision`
- `renderCompare`
- `renderRules`
- search/filter listeners
- tab switching
- drawer/profile behavior

## Why this exists

This keeps the polished app behavior intact while moving the built app away from one giant all-in-one HTML file and toward the final source layout.

## Long-term target

Make `assets/js/app.js` a real committed source file instead of a build-produced file.

At that point, `index.html` should become mostly layout and script tags.

## Rule for future chats

For structural work, update the source logic or the split helper until `assets/js/app.js` becomes the permanent committed source file.
