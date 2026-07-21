import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const app=fs.readFileSync('assets/css/app.css','utf8');
const shell=fs.readFileSync('assets/css/native-app-shell.css','utf8');
const stability=fs.readFileSync('assets/css/native-app-shell-stability.css','utf8');
const polish=fs.readFileSync('assets/css/product-polish.css','utf8');
const serviceWorker=fs.readFileSync('sw.js','utf8');

assert.ok(
  app.startsWith(':root{--bg:#080808;--panel:#111111;--panel2:#191919;--text:#f5f5f5;--muted:#a3a3a3;--line:#303030;--accent:#d20a0a;--accent2:#ff4d4d;'),
  'The canonical app owner must publish the locked black, charcoal, red, white, and gray palette.'
);
assert.ok(
  app.includes('background:radial-gradient(circle at top left,#1f0b0b,var(--bg) 45%)'),
  'The app canvas must use a black surface with only a restrained red tint.'
);
assert.ok(
  polish.includes('--product-surface:var(--panel);')
    &&polish.includes('--product-surface-2:var(--panel2);')
    &&polish.includes('--product-border:var(--line);')
    &&polish.includes('--product-muted:var(--muted);')
    &&polish.includes('--product-accent:var(--accent);'),
  'Final product polish must consume the canonical palette instead of owning a parallel navy and orange theme.'
);
assert.doesNotMatch(
  `${shell}\n${polish}`,
  /#f97316|#fb923c|rgba\(249,115,22/i,
  'The final mobile shell and shared product actions still contain the retired orange accent.'
);
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
  /css\\\/\(\?:app\|native-app-shell\|native-app-shell-stability\|product-polish\|community-profiles\|find-leader\)\\\.css/,
  'The canonical cache owner must fetch both global and final-polish palette assets from the network.'
);
assert.ok(
  serviceWorker.includes("const VERSION='octagon-hq-sw-20260721c-canonical-palette-network-first';"),
  'The canonical palette cache policy must publish through a new service-worker identity.'
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

const fixture=`<!doctype html>
<html><head>
<meta charset="utf-8">
<link rel="stylesheet" href="/assets/css/app.css">
<link rel="stylesheet" href="/assets/css/native-app-shell.css">
<link rel="stylesheet" href="/assets/css/product-polish.css">
</head><body>
<header class="hero"><div><h1 id="paletteTitle">Octagon HQ</h1></div><div class="product-header-tools"><button class="native-ask-action" type="button">Ask</button></div></header>
<main class="shell"><button id="palettePrimary" class="home-dashboard-action" type="button">Continue</button></main>
<nav class="native-bottom-nav"><button id="paletteActiveNav" class="native-nav-button active" type="button"><span>Home</span><b id="paletteBadge" class="native-nav-badge">1</b></button></nav>
</body></html>`;

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route('**/canonical-dark-palette-proof.html',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto('http://127.0.0.1:4173/canonical-dark-palette-proof.html',{waitUntil:'networkidle',timeout:60000});
  const rendered=await page.evaluate(()=>{
    const root=getComputedStyle(document.documentElement);
    const style=id=>getComputedStyle(document.getElementById(id));
    return {
      bg:root.getPropertyValue('--bg').trim(),
      panel:root.getPropertyValue('--panel').trim(),
      accent:root.getPropertyValue('--accent').trim(),
      accent2:root.getPropertyValue('--accent2').trim(),
      headerBackground:getComputedStyle(document.querySelector('.hero')).backgroundColor,
      titleColor:style('paletteTitle').color,
      primaryBackground:style('palettePrimary').backgroundColor,
      primaryColor:style('palettePrimary').color,
      activeNavColor:style('paletteActiveNav').color,
      badgeBackground:style('paletteBadge').backgroundColor,
      badgeColor:style('paletteBadge').color
    };
  });
  assert.deepEqual(
    {bg:rendered.bg,panel:rendered.panel,accent:rendered.accent,accent2:rendered.accent2},
    {bg:'#080808',panel:'#111111',accent:'#d20a0a',accent2:'#ff4d4d'},
    'Rendered mobile CSS did not receive the canonical palette tokens.'
  );
  assert.equal(rendered.headerBackground,'rgb(17, 17, 17)','The computed mobile header is not canonical charcoal.');
  assert.equal(rendered.titleColor,'rgb(245, 245, 245)','The computed mobile title is not canonical white.');
  assert.equal(rendered.primaryBackground,'rgb(210, 10, 10)','The computed primary action is not canonical UFC red.');
  assert.equal(rendered.primaryColor,'rgb(255, 255, 255)','The computed primary action does not retain white contrast text.');
  assert.equal(rendered.activeNavColor,'rgb(255, 77, 77)','The computed active navigation state is not the canonical red highlight.');
  assert.equal(rendered.badgeBackground,'rgb(210, 10, 10)','The computed notification badge is not canonical UFC red.');
  assert.equal(rendered.badgeColor,'rgb(255, 255, 255)','The computed notification badge does not retain white contrast text.');
  await context.close();
}finally{
  await browser.close();
}

console.log('Canonical black and red mobile theme contract passed.');
