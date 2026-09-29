# App JavaScript structure

This folder owns app rendering and interaction behavior.

## Current Phase 2I structure

`assets/js/app.js` is now a real committed source file.

It includes behavior such as:

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

## Rule for future chats

Do not move app behavior back into `index.html`.

Use:

```text
assets/js/app.js       UI/rendering behavior
assets/data/*.js       fighter ranking/profile data
assets/compare-*.js    Compare Mode logic and debate copy
index.html             layout shell
```
