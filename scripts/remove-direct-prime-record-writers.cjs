const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const ASSETS = path.join(ROOT, 'assets');

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

const directDotAssignment = /\b[A-Za-z_$][\w$]*(?:(?:\.[A-Za-z_$][\w$]*)|(?:\[[^\]\n]+\]))*\.primeRecord\s*=\s*[^;]+;/g;
const directBracketAssignment = /\b[A-Za-z_$][\w$]*(?:(?:\.[A-Za-z_$][\w$]*)|(?:\[[^\]\n]+\]))*\[['"]primeRecord['"]\]\s*=\s*[^;]+;/g;

const changed = [];
for (const file of listJsFiles(ASSETS)) {
  const before = fs.readFileSync(file, 'utf8');
  const after = before
    .replace(directDotAssignment, '')
    .replace(directBracketAssignment, '');
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed.push(path.relative(ROOT, file));
  }
}

const remaining = [];
for (const file of listJsFiles(ASSETS)) {
  const source = fs.readFileSync(file, 'utf8');
  directDotAssignment.lastIndex = 0;
  directBracketAssignment.lastIndex = 0;
  if (directDotAssignment.test(source) || directBracketAssignment.test(source)) {
    remaining.push(path.relative(ROOT, file));
  }
}

if (remaining.length) {
  throw new Error(`Direct Prime Record assignments remain: ${remaining.join(', ')}`);
}

console.log(`Removed direct Prime Record writers from ${changed.length} runtime files: ${changed.join(', ') || 'none'}`);
fs.unlinkSync(__filename);
