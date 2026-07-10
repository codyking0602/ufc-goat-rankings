const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();

function listJsFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listJsFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

const files = [
  ...listJsFiles(path.join(ROOT, 'assets/data')),
  ...listJsFiles(path.join(ROOT, 'assets/js'))
];
const changed = [];

for (const full of files) {
  let source = fs.readFileSync(full, 'utf8');
  const original = source;

  source = source.replace(
    /(?:if\s*\([^;\n]*\)\s*)?(?:row|profile|fighter|jon|target)\.primeRecord\s*=\s*[^;]+;/g,
    ''
  );
  source = source.replace(
    /(?:if\s*\([^;\n]*\)\s*)?(?:override|o)\.(?:snapshotStats|packetProfileStats)\.primeRecord\s*=\s*[^;]+;/g,
    ''
  );
  source = source.replace(
    /(?:if\s*\([^;\n]*\)\s*)?DISPLAY_OVERRIDES[^;\n]*?\.primeRecord\s*=\s*[^;]+;/g,
    ''
  );

  if (full.endsWith(path.join('assets', 'js', 'fighter-profile-packages.js'))) {
    source = source.replace(/^\s*primeRecord:\s*'(?:\\.|[^'\\])*',?\s*$/gm, '');
    source = source.replace(/^\s*primeRecord:\s*"(?:\\.|[^"\\])*",?\s*$/gm, '');
    source = source.replace(/^\s*\['Prime Record',\s*stats\.primeRecord\s*\|\|\s*'—'\],?\s*$/gm, '');
    source = source.replace(
      "const VERSION = 'fighter-profile-packages-20260702a';",
      "const VERSION = 'fighter-profile-packages-20260710a-canonical-prime-record';"
    );
  }

  if (full.endsWith(path.join('assets', 'data', 'ranking-data-patches.js'))) {
    source = source.replace(
      'assets/js/fighter-profile-packages.js?v=fighter-profile-packages-20260702a',
      'assets/js/fighter-profile-packages.js?v=fighter-profile-packages-20260710a-canonical-prime-record'
    );
  }

  if (source !== original) {
    fs.writeFileSync(full, source, 'utf8');
    changed.push(path.relative(ROOT, full));
  }
}

const offenders = [];
for (const full of files) {
  const source = fs.readFileSync(full, 'utf8');
  if (/(?:row|profile|fighter|jon|target)\.primeRecord\s*=/.test(source)) {
    offenders.push(path.relative(ROOT, full));
  }
  if (/(?:snapshotStats|packetProfileStats)\.primeRecord\s*=/.test(source)) {
    offenders.push(path.relative(ROOT, full));
  }
}

const packageFile = path.join(ROOT, 'assets/js/fighter-profile-packages.js');
if (/\bprimeRecord\s*:\s*['"]/.test(fs.readFileSync(packageFile, 'utf8'))) {
  offenders.push('assets/js/fighter-profile-packages.js#data');
}
if (/\[\s*['"]Prime Record['"]\s*,/.test(fs.readFileSync(packageFile, 'utf8'))) {
  offenders.push('assets/js/fighter-profile-packages.js#snapshot');
}

if (offenders.length) {
  throw new Error(`Runtime Prime Record assignments remain: ${[...new Set(offenders)].join(', ')}`);
}

fs.unlinkSync(__filename);
console.log(`Removed stale runtime Prime Record assignments from ${changed.length} files: ${changed.join(', ')}`);
