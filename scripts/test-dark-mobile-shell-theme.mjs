import assert from 'node:assert/strict';
import fs from 'node:fs';

const shell=fs.readFileSync('assets/css/native-app-shell.css','utf8');
const stability=fs.readFileSync('assets/css/native-app-shell-stability.css','utf8');

assert.ok(
  shell.includes('html{overscroll-behavior-y:contain;background:var(--bg)}'),
  'The mobile document background must consume the canonical app background token.'
);
assert.ok(
  shell.includes('border-bottom:1px solid var(--line)!important;background:var(--panel)!important'),
  'The mobile header must consume the canonical border and panel tokens.'
);
assert.ok(
  shell.includes('.hero h1{margin:0!important;color:var(--text)!important'),
  'The mobile product title must consume the canonical text token.'
);
assert.ok(
  shell.includes('border:2px solid var(--panel)!important'),
  'The mobile update badge must match the canonical header panel.'
);
assert.doesNotMatch(
  shell,
  /background:rgba\(248,250,252,\.94\)!important/,
  'The retired forced-light mobile header is still present.'
);

assert.ok(
  stability.includes('.drawer{z-index:5000!important;background:rgba(0,0,0,.72)!important}'),
  'The fighter drawer overlay must remain a dark modal surface.'
);
assert.ok(
  stability.includes('background:var(--bg)!important;overscroll-behavior:contain!important'),
  'The fighter drawer panel must consume the canonical app background token.'
);
assert.ok(
  stability.includes('border:1px solid var(--line)!important;border-radius:15px!important;background:var(--panel2)!important;color:var(--text)!important'),
  'The fighter drawer close control must consume canonical dark-theme tokens.'
);
assert.doesNotMatch(
  stability,
  /#eef3f8/i,
  'The retired forced-light fighter drawer surface is still present.'
);

console.log('Dark mobile shell theme contract passed.');
