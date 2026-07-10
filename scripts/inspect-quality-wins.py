from pathlib import Path

quality_files = [
    path
    for path in Path('assets').rglob('*')
    if path.is_file()
    and ('opponent-quality' in path.name.lower() or 'quality-win' in path.name.lower())
]

def read(path: Path) -> str:
    return path.read_text(encoding='utf-8', errors='ignore')

lines: list[str] = []
lines.append('=== QUALITY FILES ===')
lines.extend(str(path) for path in sorted(quality_files))

for fighter in ('Chuck Liddell', 'Tito Ortiz'):
    lines.append(f'=== {fighter.upper()} IN QUALITY FILES ===')
    for path in sorted(quality_files):
        text = read(path)
        if fighter not in text:
            continue
        lines.append(str(path))
        for number, line in enumerate(text.splitlines(), 1):
            if fighter in line:
                lines.append(f'{number}: {line.strip()}')

lines.append('=== QUALITY LOADER REFERENCES ===')
search_paths = [Path('index.html')] + [path for path in Path('assets').rglob('*') if path.is_file()]
for path in sorted(search_paths):
    text = read(path)
    for number, line in enumerate(text.splitlines(), 1):
        if 'opponent-quality-' in line or 'UFC_OPPONENT_QUALITY' in line:
            lines.append(f'{path}:{number}: {line.strip()}')

Path('quality-wins-source-report.txt').write_text('\n'.join(lines) + '\n', encoding='utf-8')
print('QUALITY_WINS_REPORT_READY')
