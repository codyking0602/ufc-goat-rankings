#!/usr/bin/env python3
"""Split the embedded window.RANKING_DATA assignment out of index.html.

This is a safe Phase 2 restructuring helper. It keeps the existing app UI code intact
while moving the large ranking payload into assets/data/ranking-data.js during build.
"""

from __future__ import annotations

import sys
from pathlib import Path

MARKER = "window.RANKING_DATA = "


def find_assignment_bounds(html: str) -> tuple[int, int, str]:
    start = html.find(MARKER)
    if start == -1:
        raise ValueError("Could not find embedded window.RANKING_DATA assignment")

    literal_start = start + len(MARKER)
    while literal_start < len(html) and html[literal_start].isspace():
        literal_start += 1

    if literal_start >= len(html) or html[literal_start] != "{":
        raise ValueError("window.RANKING_DATA assignment does not start with an object literal")

    depth = 0
    in_string = False
    quote = ""
    escaped = False
    literal_end = None

    for idx in range(literal_start, len(html)):
        ch = html[idx]

        if in_string:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                in_string = False
            continue

        if ch in ('"', "'"):
            in_string = True
            quote = ch
            continue

        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                literal_end = idx + 1
                break

    if literal_end is None:
        raise ValueError("Could not find the end of the window.RANKING_DATA object literal")

    assignment_end = literal_end
    while assignment_end < len(html) and html[assignment_end].isspace():
        assignment_end += 1
    if assignment_end < len(html) and html[assignment_end] == ";":
        assignment_end += 1

    data_literal = html[literal_start:literal_end]
    return start, assignment_end, data_literal


def split_ranking_data(index_path: Path, output_path: Path) -> None:
    html = index_path.read_text(encoding="utf-8")
    start, assignment_end, data_literal = find_assignment_bounds(html)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        "// Built from the embedded source payload by tools/split-ranking-data.py.\n"
        "// Long-term source target: edit this file directly once index.html is fully layout-only.\n"
        f"window.RANKING_DATA = {data_literal};\n",
        encoding="utf-8",
    )

    replacement = (
        "</script>\n"
        "  <script src=\"assets/data/ranking-data.js?v=ranking-data-20260701a\"></script>\n"
        "  <script>"
    )
    html = html[:start] + replacement + html[assignment_end:]
    index_path.write_text(html, encoding="utf-8")


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("Usage: split-ranking-data.py <index.html> <output-js>", file=sys.stderr)
        return 2

    split_ranking_data(Path(argv[1]), Path(argv[2]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
