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


def run_step(*args: str) -> None:
    print("Running:", " ".join(args))
    subprocess.check_call([sys.executable, *args])


def main() -> int:
    run_step("tools/split-ranking-data.py", "index.html", "assets/data/ranking-data.js")
    run_step("tools/split-display-overrides.py", "index.html", "assets/data/display-overrides.js")
    run_step("tools/split-app-js.py", "index.html", "assets/js/app.js")
    print("Phase 2H source files materialized.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
