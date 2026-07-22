import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const index=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('assets/css/app.css','utf8');
const home=fs.readFileSync('assets/css/home-dashboard.css','utf8');
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
  index.includes('<meta name="theme-color" content="#080808" />')
    &&index.includes('<meta name="app-build" content="visible-home-palette-20260721b" />')
    &&index.includes('assets/css/app.css?v=app-css-20260721c-canonical-black-red')
    &&index.includes('assets/css/home-dashboard.css?v=home-dashboard-20260721b-visible-black-red')
    &&index.includes('assets/css/native-app-shell.css?v=native-app-shell-css-20260721c-canonical-black-red')
    &&index.includes('assets/js/app-update-watcher.js?v=app-update-watcher-20260721b-palette-publication')
    &&index.includes('assets/js/product-architecture.js?v=product-architecture-20260721b-palette-publication'),
  'The HTML publication owner must request fresh canonical palette assets and advertise the matching build.'
);
assert.ok(
  home.includes('background:var(--panel2);')
    &&home.includes('.home-event h3{margin:13px 0 3px;color:var(--text);')
    &&home.includes('.home-event-track i{display:block;height:100%;border-radius:inherit;background:var(--accent)}')
    &&home.includes('background:var(--accent);\n  color:#fff;'),
  'The Home presentation owner must consume canonical dark surfaces, light text, and UFC red actions.'
);
assert.doesNotMatch(
  home,
  /#f97316|#fb923c|rgba\(249,115,22|background:#fff(?:;|})/i,
  'The visible Home presentation owner still contains the retired orange or white-card treatment.'
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
assert.ok(
  serviceWorker.includes('css\\/(?:app|home-dashboard|native-app-shell|native-app-shell-stability|product-polish|community-profiles|find-leader)\\.css'),
  'The canonical cache owner must fetch global, Home, and final-polish palette assets from the network.'
);
assert.ok(
  serviceWorker.includes("const VERSION='octagon-hq-sw-20260721e-versioned-palette-assets';")
    &&serviceWorker.includes("const CACHE_NAME='octagon-hq-static-v14';"),
  'The versioned palette assets must publish through a fresh service-worker identity and cache.'
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
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/assets/css/app.css">
<link rel="stylesheet" href="/assets/css/home-dashboard.css">
<link rel="stylesheet" href="/assets/css/native-app-shell.css">
<link rel="stylesheet" href="/assets/css/product-polish.css">
</head><body>
<header class="hero"><div><h1 id="paletteTitle">Octagon HQ</h1></div><div class="product-header-tools"><button class="native-ask-action" type="button">Ask</button></div></header>
<main class="shell"><section id="home" class="view active-view"><div class="home-dashboard">
  <section id="paletteDaily" class="home-dashboard-card home-daily"><div class="home-daily-copy"><div id="paletteKicker" class="home-dashboard-kicker">TODAY'S CHALLENGE</div><h2>Find the Leader</h2><button id="palettePrimary" class="home-dashboard-action" type="button">Play Again</button></div></section>
  <section id="paletteEvent" class="home-dashboard-card home-event"><div class="home-dashboard-kicker">NEXT UFC EVENT</div><h3 id="paletteEventTitle">UFC Fight Night</h3><div class="home-event-matchup">Ankalaev vs. Guskov</div><div class="home-event-progress"><div class="home-event-track"><i id="paletteProgress" style="width:100%"></i></div></div><button class="home-dashboard-action secondary" type="button">Review Picks</button></section>
  <section id="paletteWar" class="home-dashboard-card home-war-room"><div class="home-dashboard-kicker">THE WAR ROOM</div></section>
</div></section></main>
<nav class="native-bottom-nav"><button id="paletteActiveNav" class="native-nav-button active" type="button"><span>Home</span><b id="paletteBadge" class="native-nav-badge">1</b></button></nav>
</body></html>`;

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route('**/canonical-dark-palette-proof.html*',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto('http://127.0.0.1:4173/canonical-dark-palette-proof.html',{waitUntil:'networkidle',timeout:60000});
  const rendered=await page.evaluate(()=>{
    const root=getComputedStyle(document.documentElement);
    const style=id=>getComputedStyle(document.getElementById(id));
    const reference=declarations=>{
      const node=document.createElement('i');
      Object.assign(node.style,declarations);
      document.body.appendChild(node);
      const computed=getComputedStyle(node);
      const result={backgroundColor:computed.backgroundColor,color:computed.color};
      node.remove();
      return result;
    };
    return {
      tokens:{
        bg:root.getPropertyValue('--bg').trim(),
        panel:root.getPropertyValue('--panel').trim(),
        panel2:root.getPropertyValue('--panel2').trim(),
        accent:root.getPropertyValue('--accent').trim(),
        accent2:root.getPropertyValue('--accent2').trim()
      },
      actual:{
        headerBackground:getComputedStyle(document.querySelector('.hero')).backgroundColor,
        titleColor:style('paletteTitle').color,
        eventBackground:style('paletteEvent').backgroundColor,
        eventTitleColor:style('paletteEventTitle').color,
        kickerColor:style('paletteKicker').color,
        primaryBackground:style('palettePrimary').backgroundColor,
        primaryColor:style('palettePrimary').color,
        progressBackground:style('paletteProgress').backgroundColor,
        activeNavColor:style('paletteActiveNav').color,
        badgeBackground:style('paletteBadge').backgroundColor,
        badgeColor:style('paletteBadge').color
      },
      expected:{
        panelBackground:reference({background:'var(--panel)'}).backgroundColor,
        panel2Background:reference({background:'var(--panel2)'}).backgroundColor,
        textColor:reference({color:'var(--text)'}).color,
        accentBackground:reference({background:'var(--accent)'}).backgroundColor,
        accent2Color:reference({color:'var(--accent2)'}).color,
        whiteColor:reference({color:'#fff'}).color
      }
    };
  });
  assert.deepEqual(
    rendered.tokens,
    {bg:'#080808',panel:'#111111',panel2:'#191919',accent:'#d20a0a',accent2:'#ff4d4d'},
    'Rendered mobile CSS did not receive the canonical palette tokens.'
  );
  assert.equal(rendered.actual.headerBackground,rendered.expected.panelBackground,'The computed mobile header does not consume the canonical panel token.');
  assert.equal(rendered.actual.titleColor,rendered.expected.textColor,'The computed mobile title does not consume the canonical text token.');
  assert.equal(rendered.actual.eventBackground,rendered.expected.panel2Background,'The computed upcoming-event card is not a canonical charcoal surface.');
  assert.equal(rendered.actual.eventTitleColor,rendered.expected.textColor,'The computed upcoming-event title does not use canonical light text.');
  assert.equal(rendered.actual.kickerColor,rendered.expected.accent2Color,'The computed Home kicker does not use the canonical red highlight.');
  assert.equal(rendered.actual.primaryBackground,rendered.expected.accentBackground,'The computed primary action does not consume canonical UFC red.');
  assert.equal(rendered.actual.primaryColor,rendered.expected.whiteColor,'The computed primary action does not retain white contrast text.');
  assert.equal(rendered.actual.progressBackground,rendered.expected.accentBackground,'The computed Home progress bar does not consume canonical UFC red.');
  assert.equal(rendered.actual.activeNavColor,rendered.expected.accent2Color,'The computed active navigation state does not consume the canonical red highlight.');
  assert.equal(rendered.actual.badgeBackground,rendered.expected.accentBackground,'The computed notification badge does not consume canonical UFC red.');
  assert.equal(rendered.actual.badgeColor,rendered.expected.whiteColor,'The computed notification badge does not retain white contrast text.');
  console.log(JSON.stringify({proof:'visible-home-black-red-palette',rendered},null,2));
  await context.close();
}finally{
  await browser.close();
}

console.log('Visible Home black and red mobile theme contract passed.');