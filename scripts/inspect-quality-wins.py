from pathlib import Path

quality_files = [
    path
    for path in Path('assets').rglob('*')
    if path.is_file()
    and ('opponent-quality' in path.name.lower() or 'quality-win' in path.name.lower())
]

def read(path: Path) -> str:
    return path.read_text(encoding='utf-8', errors='ignore')

def emit(label: str, values: list[str]) -> None:
    print(f"{label}=" + '|'.join(sorted(set(values))))

emit('CHUCK_OQ_FILES', [str(path) for path in quality_files if 'Chuck Liddell' in read(path)])
emit('TITO_OQ_FILES', [str(path) for path in quality_files if 'Tito Ortiz' in read(path)])
emit('OQ_FILES', [str(path) for path in quality_files])
emit('LEDGER_MUTATORS', [
    str(path)
    for path in quality_files
    if 'UFC_OPPONENT_QUALITY_LEDGERS' in read(path) or '.raw[' in read(path)
])
