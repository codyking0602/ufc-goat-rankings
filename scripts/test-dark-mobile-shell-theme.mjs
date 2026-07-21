import assert from 'node:assert/strict';
import fs from 'node:fs';

const shell=fs.readFileSync('assets/css/native-app-shell.css','utf8');
const stability=fs.readFileSync('assets/css/native-app-shell-stability.css','utf8');
const polish=fs.readFileSync('assets/css/product-polish.css','utf8');
const serviceWorker=fs.readFileSync('sw.js','utf8');

assert.ok(
  shell.includes('html{overscroll-behavior-y:contain;background:var(--bg)}'),
  'The mobile document background must consume the canonical app background token.'
);
assert.doesNotMatch(
  shell,
  /\.hero\{[^}]*background:var\(--panel\)!important/s,
  'The native navigation owner must not compete with final product polish for the mobile header surface.'
);
assert.doesNotMatch(
  shell,
  /\.hero h1\{[^}]*color:var\(--text\)!important/s,
  'The native navigation owner must not compete with final product polish for the mobile title color.'
);
assert.match(
  polish,
  /@media\(max-width:900px\)\{[\s\S]*?\.hero\{[^}]*border-bottom:1px solid var\(--line\)!important;[^}]*background:var\(--panel\)!important;[^}]*box-shadow:0 8px 28px rgba\(0,0,0,\.28\)!important/s,
  'Final product polish must own the canonical dark mobile header surface.'
);
assert.match(
  polish,
  /@media\(max-width:900px\)\{[\s\S]*?\.hero h1\{[^}]*color:var\(--text\)!important/s,
  'Final product polish must own the canonical light mobile title color.'
);
assert.match(
  serviceWorker,
  /css\\\/\(\?:native-app-shell\|native-app-shell-stability\|product-polish\|community-profiles\|find-leader\)\\\.css/,
  'The canonical cache owner must fetch final product polish from the network instead of preserving a stale header.'
);
assert.ok(
  serviceWorker.includes("const VERSION='octagon-hq-sw-20260721b-product-polish-network-first';"),
  'The updated product-polish cache policy must publish through a new service-worker identity.'
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
