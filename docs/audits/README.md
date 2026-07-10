# Runtime Audit Artifacts

This directory is populated by the branch-only `Six-Category Runtime Audit` workflow.

Generated files:

- `runtime-six-category-audit.json`
- `runtime-six-category-audit.md`

The workflow runs the real app in headless Chromium, waits beyond the current delayed scoring timers, then exports the read-only six-category integrity report. Generated artifacts are not committed automatically and do not alter fighter scores or production behavior.
