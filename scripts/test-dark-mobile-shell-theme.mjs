import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const index=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('assets/css/app.css','utf8');
const home=fs.readFileSync('assets/css/home-dashboard.css','utf8');
const shell=fs.readFileSync('assets/css/native-app-shell.css','utf8');
const stability=fs.readFileSync('assets/css/native-app-shell-stability.css','utf8');
const polish=fs.readFileSync('assets/css/product-polish.css','utf8');
const architecture=fs.readFileSync('assets/js/product-architecture.js','utf8');
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
  stability.startsWith('@import url("./product-polish.css?v=product-polish-20260721e-static-final-owner");'),
  'The existing final static CSS owner must import product polish before runtime startup.'
);
assert.doesNotMatch(
  architecture,
  /POLISH_CSS|loadStyleOnce|createElement\(['"]link['"]\)/,
  'Product architecture still owns a late stylesheet injection path.'
);
assert.match(
  architecture,
  /function loadPolish\(\)\{[\s\S]*loadScriptOnce\('assets\/js\/product-polish\.js',POLISH_SRC\)/,
  'Product architecture must retain only the non-visual product-polish controller.'
);
assert.ok(
  polish.includes('--product-surface:var(--panel);')
    &&polish.includes('--product-surface-2:var(--panel2);')
    &&polish.includes('--product-border:var(--line);')
    &&polish.includes('--product-muted:var(--muted);')
    &&polish.includes('--product-accent:var(--accent);'),
  'Final product polish must consume the canonical palette instead of owning a parallel navy and orange theme.'
);
assert.ok(
  polish.includes('.product-header-tools .app-profile-chip{')
    &&polish.includes('background:var(--panel2)!important;color:var(--text)!important')
    &&polish.includes('#manualRefreshBtn,#whatsNewBtn{')
    &&polish.includes('background:var(--panel2)!important;color:var(--text)!important'),
  'The static final owner must neutralize late legacy profile and update-control colors.'
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
  serviceWorker.includes('const PALETTE_NETWORK_ONLY=/\\/assets\\/css\\/(?:app|home-dashboard|native-app-shell|native-app-shell-stability|product-polish)\\.css$/i;')
    &&serviceWorker.includes('if(url.origin===self.location.origin&&PALETTE_NETWORK_ONLY.test(url.pathname))')
    &&serviceWorker.includes("fetch(request,{cache:'no-store'})"),
  'The cache owner must fetch canonical palette styles from the network without storing stale copies.'
);
assert.ok(
  serviceWorker.includes("const VERSION='octagon-hq-sw-20260721g-canonical-find-leader';")
    &&serviceWorker.includes("const CACHE_NAME='octagon-hq-static-v16';"),
  'The static palette owner must publish through a fresh service-worker identity and cache.'
);
assert.ok(
  stability.includes('.drawer{z-index:5000!important;background:rgba(0,0,0,.72)!important}'),
  'The fighter drawer overlay must remain a dark modal surface.'
);
assert.ok(
  stability.includes('background:var(--bg)!important;overscroll-behavior:contain!important'),
  'The fighter drawer panel must consume the canonical app background token.'
);
assert.doesNotMatch(
  stability,
  /#eef3f8/i,
  'The retired forced-light fighter drawer surface is still present.'
);
assert.ok(
  index.includes('<meta name="theme-color" content="#080808" />')
    &&index.includes('<meta name="app-build" content="profile-challenges-delivery-20260722a" />')
    &&index.includes('assets/css/app.css?v=app-css-20260721c-canonical-black-red')
    &&index.includes('assets/css/home-dashboard.css?v=home-dashboard-20260721b-visible-black-red')
    &&index.includes('assets/css/native-app-shell.css?v=native-app-shell-css-20260721c-canonical-black-red')
    &&index.includes('assets/js/profile-challenges.js?v=profile-challenges-20260722a-all-game-inbox')
    &&index.includes('assets/js/keep-cut-standalone-share.js?v=keep-cut-standalone-share-20260722a-canonical-route-guard'),
  'The HTML publication owner must request the current canonical palette and challenge assets.'
);

const fixture=`<!doctype html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/assets/css/app.css">
<link rel="stylesheet" href="/assets/css/home-dashboard.css">
<link rel="stylesheet" href="/assets/css/native-app-shell.css">
<link rel="stylesheet" href="/assets/css/native-app-shell-stability.css">
</head><body>
<header class="hero"><div><h1 id="paletteTitle">Octagon HQ</h1></div><div class="product-header-tools"><button id="paletteAsk" class="native-ask-action" type="button">Ask</button><div class="app-profile-tools"><button id="paletteProfile" class="app-profile-chip" type="button"><span class="app-profile-avatar">CK</span><span class="app-profile-chip-copy"><strong>Cody</strong></span></button></div><div id="manualRefreshControl"><div id="manualRefreshActions"><button id="manualRefreshBtn" type="button">Refresh</button><button id="whatsNewBtn" type="button">NEW<span id="whatsNewUnread">1</span></button></div><div id="manualRefreshProgress"><i id="manualRefreshProgressFill"></i></div></div></div></header>
<main class="shell"><section id="home" class="view active-view"><div class="home-dashboard">
  <section id="paletteDaily" class="home-dashboard-card home-daily"><div class="home-daily-copy"><div id="paletteKicker" class="home-dashboard-kicker">TODAY'S CHALLENGE</div><h2>Find the Leader</h2><button id="palettePrimary" class="home-dashboard-action" type="button">Play Again</button></div></section>
  <section id="paletteEvent" class="home-dashboard-card home-event"><div class="home-dashboard-kicker">NEXT UFC EVENT</div><h3 id="paletteEventTitle">UFC Fight Night</h3><div class="home-event-matchup">Ankalaev vs. Guskov</div><div class="home-event-progress"><div class="home-event-track"><i id="paletteProgress" style="width:100%"></i></div></div><button class="home-dashboard-action secondary" type="button">Review Picks</button></section>
</div></section></main>
<nav class="native-bottom-nav"><button id="paletteActiveNav" class="native-nav-button active" type="button"><span>Home</span><b id="paletteBadge" class="native-nav-badge">1</b></button></nav>
</body></html>`;

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route('**/canonical-dark-palette-proof.html*',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto('http://127.0.0.1:4173/canonical-dark-palette-proof.html',{waitUntil:'networkidle',timeout:60000});

  const snapshot=()=>page.evaluate(()=>{
    const root=getComputedStyle(document.documentElement);
    const style=id=>getComputedStyle(document.getElementById(id));
    const reference=declarations=>{
      const node=document.createElement('i');
      Object.assign(node.style,declarations);
      document.body.appendChild(node);
      const computed=getComputedStyle(node);
      const result={backgroundColor:computed.backgroundColor,color:computed.color,borderColor:computed.borderColor};
      node.remove();
      return result;
    };
    return{
      productPolishLinks:document.querySelectorAll('link[href*="product-polish.css"]').length,
      tokens:{
        bg:root.getPropertyValue('--bg').trim(),
        panel:root.getPropertyValue('--panel').trim(),
        panel2:root.getPropertyValue('--panel2').trim(),
        accent:root.getPropertyValue('--accent').trim(),
        accent2:root.getPropertyValue('--accent2').trim()
      },
      actual:{
        bodyBackground:getComputedStyle(document.body).backgroundColor,
        headerBackground:getComputedStyle(document.querySelector('.hero')).backgroundColor,
        titleColor:style('paletteTitle').color,
        profileBackground:style('paletteProfile').backgroundColor,
        refreshBackground:style('manualRefreshBtn').backgroundColor,
        newBackground:style('whatsNewBtn').backgroundColor,
        unreadBackground:style('whatsNewUnread').backgroundColor,
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
        bgBackground:reference({background:'var(--bg)'}).backgroundColor,
        panelBackground:reference({background:'var(--panel)'}).backgroundColor,
        panel2Background:reference({background:'var(--panel2)'}).backgroundColor,
        textColor:reference({color:'var(--text)'}).color,
        accentBackground:reference({background:'var(--accent)'}).backgroundColor,
        accent2Color:reference({color:'var(--accent2)'}).color,
        whiteColor:reference({color:'#fff'}).color
      }
    };
  });

  const initial=await snapshot();
  await page.evaluate(()=>{
    const style=document.createElement('style');
    style.id='legacyLatePaletteAttempt';
    style.textContent=`
      .hero{background:#f8fafc}
      .app-profile-chip,#manualRefreshBtn,#whatsNewBtn{background:#111827;color:#fff;border-color:#334155}
      #whatsNewUnread{background:#f97316;color:#111827}
    `;
    document.head.appendChild(style);
  });
  await page.waitForTimeout(2300);
  const final=await snapshot();

  assert.equal(final.productPolishLinks,0,'A late product-polish link was appended after startup.');
  assert.deepEqual(final.tokens,{bg:'#080808',panel:'#111111',panel2:'#191919',accent:'#d20a0a',accent2:'#ff4d4d'},'Rendered mobile CSS did not retain the canonical palette tokens.');
  assert.equal(final.actual.headerBackground,final.expected.panelBackground,'The final computed mobile header was repainted after startup.');
  assert.equal(final.actual.titleColor,final.expected.textColor,'The final computed mobile title was repainted after startup.');
  assert.equal(final.actual.profileBackground,final.expected.panel2Background,'The final profile control returned to the retired navy surface.');
  assert.equal(final.actual.refreshBackground,final.expected.panel2Background,'The final refresh control returned to the retired navy surface.');
  assert.equal(final.actual.newBackground,final.expected.panel2Background,'The final update control returned to the retired navy surface.');
  assert.equal(final.actual.unreadBackground,final.expected.accentBackground,'The final update badge returned to the retired orange accent.');
  assert.equal(final.actual.eventBackground,final.expected.panel2Background,'The final upcoming-event card is not a canonical charcoal surface.');
  assert.equal(final.actual.eventTitleColor,final.expected.textColor,'The final upcoming-event title does not use canonical light text.');
  assert.equal(final.actual.kickerColor,final.expected.accent2Color,'The final Home kicker does not use the canonical red highlight.');
  assert.equal(final.actual.primaryBackground,final.expected.accentBackground,'The final primary action does not consume canonical UFC red.');
  assert.equal(final.actual.primaryColor,final.expected.whiteColor,'The final primary action does not retain white contrast text.');
  assert.equal(final.actual.progressBackground,final.expected.accentBackground,'The final Home progress bar does not consume canonical UFC red.');
  assert.equal(final.actual.activeNavColor,final.expected.accent2Color,'The final active navigation state does not consume the canonical red highlight.');
  assert.equal(final.actual.badgeBackground,final.expected.accentBackground,'The final notification badge does not consume canonical UFC red.');
  assert.equal(final.actual.badgeColor,final.expected.whiteColor,'The final notification badge does not retain white contrast text.');
  assert.deepEqual(final.actual,initial.actual,'The rendered palette changed during the late startup window.');
  console.log(JSON.stringify({proof:'static-final-black-red-palette',initial,final},null,2));
  await context.close();
}finally{
  await browser.close();
}

console.log('Static final black and red mobile theme contract passed.');
