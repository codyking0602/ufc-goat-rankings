# UFC GOAT Rankings

Static UFC-only GOAT ranking app.

Live preview:

`https://codyking0602.github.io/ufc-goat-rankings/`

## Product direction

- [Play Tab Product Direction](docs/PLAY_PRODUCT_DIRECTION.md) — long-term vision, architecture, game classification, current challenge status, and roadmap for the UFC social-game hub.

## Source structure

- `index.html` — main app
- `assets/fighters/` — fighter thumbnails and profile images
- `.github/workflows/pages.yml` — GitHub Pages deployment

## Octagon Verdict knowledge rule

- `octagon-verdict-knowledge.md` is the required Octagon Verdict knowledge artifact.
- Every completed fighter or scoring update must rebuild and commit the Markdown file from the live calculated runtime.
- Upload the refreshed Markdown file to the Octagon Verdict Custom GPT after roster changes.
- JSON exports are optional, run only when explicitly requested, and never block a fighter addition or production completion.

## Fighter image convention

Use two WebP images per fighter:

- `fighter-slug-thumb.webp` for ranking cards
- `fighter-slug.webp` for fighter profiles

Example:

- `jon-jones-thumb.webp`
- `jon-jones.webp`
