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

## Fighter image convention

Use two WebP images per fighter:

- `fighter-slug-thumb.webp` for ranking cards
- `fighter-slug.webp` for fighter profiles

Example:

- `jon-jones-thumb.webp`
- `jon-jones.webp`
