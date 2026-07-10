from pathlib import Path

roots = (Path('assets'), Path('docs'))
paths = [path for root in roots for path in root.rglob('*') if path.is_file()]

def read(path: Path) -> str:
    return path.read_text(encoding='utf-8', errors='ignore')

def emit(label: str, values: list[str]) -> None:
    print(f"{label}=" + '|'.join(sorted(set(values))))

emit('CHUCK_FILES', [str(path) for path in paths if 'Chuck Liddell' in read(path)])
emit('TITO_FILES', [str(path) for path in paths if 'Tito Ortiz' in read(path)])
emit('OQ_FILES', [
    str(path)
    for path in Path('assets').rglob('*')
    if path.is_file()
    and ('opponent-quality' in path.name.lower() or 'quality-win' in path.name.lower())
])
emit('LEDGER_MUTATORS', [
    str(path)
    for path in paths
    if 'UFC_OPPONENT_QUALITY_LEDGERS' in read(path) or '.raw[' in read(path)
])
