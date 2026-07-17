from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')

text = text.replace(
    '<meta name="app-build" content="20260717-blind-rank-phase4" />',
    '<meta name="app-build" content="20260717-blind-rank-phase5" />'
)

play_data = '  <script src="assets/data/play-data.js?v=play-data-20260716b-auto-photo-resolver"></script>'
expansion = '  <script src="assets/data/blind-rank-expansion-batch-one.js?v=blind-rank-expansion-20260717a-phase-five-batch-one"></script>'
if expansion not in text:
    text = text.replace(play_data, f'{play_data}\n{expansion}')

polish = '  <script src="assets/js/blind-rank-polish.js?v=blind-rank-polish-20260717c-role-generator-ui"></script>'
tuning = '  <script src="assets/js/blind-rank-phase-five-tuning.js?v=blind-rank-phase-five-tuning-20260717a"></script>'
if tuning not in text:
    text = text.replace(polish, f'{polish}\n{tuning}')

text = text.replace(
    'assets/js/app-update-watcher.js?v=app-update-watcher-20260717-blind-rank-phase4',
    'assets/js/app-update-watcher.js?v=app-update-watcher-20260717-blind-rank-phase5'
)

required = [expansion, tuning, '20260717-blind-rank-phase5']
missing = [value for value in required if value not in text]
if missing:
    raise SystemExit(f'Loader patch failed; missing: {missing}')

path.write_text(text, encoding='utf-8')
