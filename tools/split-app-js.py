#!/usr/bin/env python3
"""Split the app/rendering JavaScript out of the built index.html.

Run this after the ranking data and display override split helpers. It combines the
small app setup chunk before DISPLAY_OVERRIDES and the larger rendering chunk after
DISPLAY_OVERRIDES into assets/js/app.js during build.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

RANKING_SCRIPT_RE = re.compile(r'<script\s+src="assets/data/ranking-data\.js[^>]*></script>', re.I)
DISPLAY_SCRIPT_RE = re.compile(r'<script\s+src="assets/data/display-overrides\.js[^>]*></script>', re.I)
APP_SCRIPT_TAG = '  <script src="assets/js/app.js?v=app-20260701a"></script>'


def next_script_block(html: str, search_from: int) -> tuple[int, int, int, int, str]:
    script_start = html.find('<script>', search_from)
    if script_start == -1:
        raise ValueError('Could not find expected app script start')
    content_start = script_start + len('<script>')
    script_end = html.find('</script>', content_start)
    if script_end == -1:
        raise ValueError('Could not find expected app script end')
    block_end = script_end + len('</script>')
    return script_start, content_start, script_end, block_end, html[content_start:script_end]


def split_app_js(index_path: Path, output_path: Path) -> None:
    html = index_path.read_text(encoding='utf-8')

    ranking_match = RANKING_SCRIPT_RE.search(html)
    if not ranking_match:
        raise ValueError('Could not find ranking data script tag. Run split-ranking-data.py first.')

    display_match = DISPLAY_SCRIPT_RE.search(html)
    if not display_match:
        raise ValueError('Could not find display overrides script tag. Run split-display-overrides.py first.')

    pre_start, pre_content_start, pre_content_end, pre_block_end, pre_js = next_script_block(html, ranking_match.end())
    if 'const DATA = window.RANKING_DATA;' not in pre_js:
        raise ValueError('Expected the pre-display app script to contain DATA setup')

    post_start, post_content_start, post_content_end, post_block_end, post_js = next_script_block(html, display_match.end())
    if 'function renderList' not in post_js or 'populateControls(); refresh();' not in post_js:
        raise ValueError('Expected the post-display app script to contain render logic and boot call')

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        '// Built from embedded source app logic by tools/split-app-js.py.\n'
        '// Long-term source target: edit this file directly once index.html is fully layout-only.\n\n'
        + pre_js.strip()
        + '\n\n'
        + post_js.strip()
        + '\n',
        encoding='utf-8',
    )

    # Remove the pre-display inline app chunk, then replace the post-display inline
    # app chunk with the source-path app script tag. Do replacements from the end
    # first so earlier indexes remain valid.
    html = html[:post_start] + APP_SCRIPT_TAG + html[post_block_end:]
    html = html[:pre_start] + html[pre_block_end:]
    index_path.write_text(html, encoding='utf-8')


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print('Usage: split-app-js.py <index.html> <output-js>', file=sys.stderr)
        return 2

    split_app_js(Path(argv[1]), Path(argv[2]))
    return 0


if __name__ == '__main__':
    raise SystemExit(main(sys.argv))
