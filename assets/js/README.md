# App JavaScript structure

This folder is the target location for app/rendering behavior.

## Current Phase 2F structure

The source `index.html` still contains the app/rendering JavaScript for now.

During the Pages build, `tools/split-app-js.py` extracts the app behavior into:

```text
assets/js/app-generated.js
```

This generated file includes the rendering and behavior code such as:

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

This keeps the polished app behavior intact while moving the built app away from one giant all-in-one HTML file.

## Long-term target

Eventually, replace the generated file with a real source file:

```text
assets/js/app.js
```

At that point, `index.html` should become mostly layout and script tags.

## Rule for future chats

Do not manually edit `app-generated.js`; it is generated during the Pages build.

For structural work, update the source logic or the split helper until the permanent `assets/js/app.js` exists.
