from pathlib import Path
import re
import sys

path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('index.html')
s = path.read_text()

# Public-facing language cleanup.
s = s.replace('In plain English:', 'What it means:')
s = s.replace('Plain-English read', 'What to know')
s = s.replace('plain-English read', 'what to know')
s = s.replace('Plain-English', 'Plain English')
s = s.replace('résumé', 'resume')
s = s.replace('résumés', 'resumes')
s = s.replace('Resume impact from losses', 'How losses affect it')
s = s.replace('Win-depth score', 'Win depth')
s = s.replace('Adjusted title credit', 'Adjusted title wins')
s = s.replace('title-win value', 'weighted wins')

# Remove category-level “Why not higher?” blocks. The full fighter profile already has this.
s = re.sub(
    r'\n\s*<div class="category-why"><strong>Why not higher\?</strong> \$\{whyNotHigher\(f, key\)\}</div>',
    '',
    s
)

# Remove leftover CSS for removed block if present.
s = re.sub(r'\n\.category-why \{[^}]+\}', '', s)
s = re.sub(r'\n\.category-why strong \{[^}]+\}', '', s)

path.write_text(s)
