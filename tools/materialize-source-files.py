#!/usr/bin/env python3
"""Materialize Phase 2 source files from the current embedded index.html.

This reuses the existing split helpers so the source branch gets the real files:
- assets/data/ranking-data.js
- assets/data/display-overrides.js
- assets/js/app.js
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def run_step(*args: str) -> None:
    print("Running:", " ".join(args))
    subprocess.check_call([sys.executable, *args])


def clean_materialized_index() -> None:
    index = Path("index.html")
    html = index.read_text(encoding="utf-8")
    cleaned = html.replace("  <script>\n</script>\n", "")
    if cleaned != html:
      index.write_text(cleaned, encoding="utf-8")
      print("Removed empty script shell from materialized index.html.")
    else:
      print("index.html already clean.")


def main() -> int:
    html = Path("index.html").read_text(encoding="utf-8")
    if "window.RANKING_DATA = " not in html:
        clean_materialized_index()
        print("Phase 2H source files already materialized.")
        return 0

    run_step("tools/split-ranking-data.py", "index.html", "assets/data/ranking-data.js")
    run_step("tools/split-display-overrides.py", "index.html", "assets/data/display-overrides.js")
    run_step("tools/split-app-js.py", "index.html", "assets/js/app.js")
    clean_materialized_index()
    print("Phase 2H source files materialized.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
