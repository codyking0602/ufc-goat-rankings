# Phase 1 Review Checklist

Branch: `modular-refactor-v2-safe`

## What Phase 1 is doing

The first safe step is a ranking-data patch layer:

- `assets/data/ranking-data-patches.js`

This is intentionally smaller than a full extraction. It lets us move score/rank fixes out of `index.html` without replacing the old UI.

## Why this is safe

The existing full app UI stays in `index.html`.
The patch file mutates `window.RANKING_DATA` in place, so the old app logic can keep working.

## Current limitation

The patch file is staged on the branch, but the branch `index.html` has not been wired to load it yet.
That wiring should be a tiny script tag added near the bottom of the file after the existing inline app script.

Target line to add before `</body>`:

```html
<script src="assets/data/ranking-data-patches.js"></script>
```

## Review checklist once wired

- P4P tab looks the same as the restored full app.
- Women Only tab looks the same.
- By Division still works.
- Compare still works.
- Fighter photos still show.
- Fighter profile drawer still opens and looks the same.
- Jon, GSP, Charles, Ilia, Petr Yan audited scoring values show correctly where applicable.

## Do not merge until

Cody confirms screenshots match the old app.
