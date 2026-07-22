import assert from 'node:assert/strict';
import fs from 'node:fs';

const index=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('assets/css/app.css','utf8');
const home=fs.readFileSync('assets/css/home-dashboard.css','utf8');
const native=fs.readFileSync('assets/css/native-app-shell.css','utf8');
const stability=fs.readFileSync('assets/css/native-app-shell-stability.css','utf8');
const polish=fs.readFileSync('assets/css/product-polish.css','utf8');
const serviceWorker=fs.readFileSync('sw.js','utf8');

assert.match(
  index,
  /<meta name="theme-color" content="#080808"\s*\/>/,
  'The browser chrome theme color must use the canonical dark shell surface.'
);
assert.match(
  app,
  /:root\{[^}]*--bg:#080808;[^}]*--panel:#111111;[^}]*--card:#171717;[^}]*--line:#2a2a2a;[^}]*--text:#f7f7f7;[^}]*--muted:#b5b5b5;[^}]*--accent:#e10600;[^}]*--gold:#f4c430;/s,
  'The base app stylesheet must publish the canonical black, red, and gold palette.'
);
assert.doesNotMatch(
  app,
  /--bg:#f3f5f8|--panel:#fff|--card:#fff|--accent:#f97316/,
  'The base app stylesheet must not retain the retired light or orange root palette.'
);
assert.match(
  home,
  /\.home-dashboard-card\{[^}]*border:1px solid var\(--line\);[^}]*background:var\(--panel\);[^}]*color:var\(--text\)/s,
  'Home cards must consume the canonical panel, line, and text tokens.'
);
assert.match(
  home,
  /\.home-dashboard-kicker\{[^}]*color:var\(--gold\)/s,
  'Home card kickers must consume the canonical gold accent token.'
);
assert.match(
  home,
  /\.home-dashboard-action\{[^}]*border:1px solid var\(--accent\);[^}]*background:var\(--accent\)/s,
  'Home primary actions must consume the canonical red accent token.'
);
assert.match(
  native,
  /\.native-app-tab\.active\{[^}]*color:var\(--accent\)/s,
  'The native active navigation state must consume the canonical red accent token.'
);
assert.match(
  native,
  /\.native-app-tab\.active::after\{[^}]*background:var\(--gold\)/s,
  'The native active-navigation underline must consume the canonical gold token.'
);
assert.doesNotMatch(
  native,
  /#ff6b21|#fbbf24|#451a03/,
  'The native navigation owner must not retain the retired orange/brown palette.'
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
assert.ok(
  serviceWorker.includes('const PALETTE_NETWORK_ONLY=/\\/assets\\/css\\/(?:app|home-dashboard|native-app-shell|native-app-shell-stability|product-polish)\\.css$/i;')
    &&serviceWorker.includes('if(url.origin===self.location.origin&&PALETTE_NETWORK_ONLY.test(url.pathname))')
    &&serviceWorker.includes("fetch(request,{cache:'no-store'})"),
  'The cache owner must fetch canonical palette styles from the network without storing stale copies.'
);
assert.ok(
  serviceWorker.includes("const VERSION='octagon-hq-sw-20260721g-canonical-find-leader';")
    &&serviceWorker.includes("const CACHE_NAME='octagon-hq-static-v16';"),
  'The static palette owner must publish through the current fresh service-worker identity and cache.'
);
assert.ok(
  stability.includes('.drawer{z-index:5000!important;background:rgba(0,0,0,.72)!important}'),
  'The fighter drawer overlay must remain a dark modal surface.'
);
assert.ok(
  stability.includes('background:var(--bg)!important;overscroll-behavior:contain!important'),
  'The fighter drawer panel must consume the canonical app background token.'
);
