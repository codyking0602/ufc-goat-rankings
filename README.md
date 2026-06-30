# UFC GOAT Rankings

Static UFC-only GOAT ranking app.

## Live phone preview

This repo is set up to publish the uploaded app package through GitHub Pages.

Expected live URL:

`https://codyking0602.github.io/ufc-goat-rankings/`

## How deployment works

The repo currently contains:

- `ufc_goat_rankings_github_pages_ready.zip`
- `.github/workflows/pages.yml`

Whenever changes are pushed to `main`, the workflow unzips the package into a temporary `_site` folder and deploys that folder to GitHub Pages.

## One-time GitHub Pages setting

In GitHub, go to:

**Settings → Pages → Build and deployment → Source → GitHub Actions**

After that, the workflow should publish the app automatically. You can also run it manually from:

**Actions → Deploy UFC GOAT Rankings → Run workflow**

## Future update workflow

For the current MVP phase:

1. Replace `ufc_goat_rankings_github_pages_ready.zip` with the newest package.
2. Commit it to `main`.
3. GitHub Actions redeploys the same phone URL.

Later, once the app structure is locked, we can move away from zip deployment and store the actual `index.html` and `assets/fighters/` files directly in the repo.

## Fighter image convention

Use two images per fighter:

- Ranking thumbnail: `fighter-slug-thumb.webp`
- Fighter profile image: `fighter-slug.webp`

Example:

- `jon-jones-thumb.webp`
- `jon-jones.webp`
