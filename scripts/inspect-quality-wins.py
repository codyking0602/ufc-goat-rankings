import json
from pathlib import Path

roots = (Path('assets'), Path('docs'))
paths = [path for root in roots for path in root.rglob('*') if path.is_file()]

def read(path: Path) -> str:
    return path.read_text(encoding='utf-8', errors='ignore')

payload = {
    'files': sorted(
        str(path)
        for path in Path('assets').rglob('*')
        if path.is_file()
        and ('opponent-quality' in path.name.lower() or 'quality-win' in path.name.lower())
    ),
    'matches': {
        name: sorted(str(path) for path in paths if name in read(path))
        for name in ('Chuck Liddell', 'Tito Ortiz')
    },
    'loaderRefs': sorted(str(path) for path in paths if 'opponent-quality-' in read(path)),
    'ledgerRefs': sorted(
        str(path)
        for path in paths
        if 'UFC_OPPONENT_QUALITY_LEDGERS' in read(path) or '.raw[' in read(path)
    ),
}

print('INSPECTION_JSON=' + json.dumps(payload, separators=(',', ':')))
