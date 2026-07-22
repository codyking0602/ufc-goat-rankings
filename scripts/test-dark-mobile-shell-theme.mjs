import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const index=fs.readFileSync('index.html','utf8');
const stability=fs.readFileSync('assets/css/native-app-shell-stability.css','utf8');
const architecture=fs.readFileSync('assets/js/product-architecture.js','utf8');
const serviceWorker=fs.readFileSync('sw.js','utf8');

assert.ok(
  stability.startsWith('@import url("./product-polish.css?v=product-polish-20260722a-canonical-tokens");'),
  'The existing final static CSS owner must import the current product-polish tokens before runtime startup.'
);
for(const token of [
  '--bg:#000000!important;',
  '--panel:#0d0d0d!important;',
  '--panel2:#171717!important;',
  '--text:#f5f5f5!important;',
  '--muted:#a3a3a3!important;',
  '--accent:#e10600!important;',
  '--accent2:#ff5a5f!important;'
])assert.ok(stability.includes(token),`The semantic dark owner is missing ${token}`);
assert.ok(
  stability.includes('body>.hero,.hero{border-bottom-color:var(--line)!important;background-color:#000!important;background-image:none!important;color:var(--text)!important;')
    &&stability.includes('.native-ask-action,#whatsNewBtn,#manualRefreshBtn,.product-header-tools .app-profile-chip{border-color:var(--line)!important;background:var(--panel2)!important;color:var(--text)!important;')
    &&stability.includes('.home-event,.home-war-room,.home-spotlight{border-color:var(--line)!important;background:linear-gradient(155deg,var(--panel2),var(--panel))!important}')
    &&stability.includes('.native-nav-button.active{background:transparent!important;color:var(--accent2)!important;'),
  'The final static owner must retain semantic dark header, controls, cards, and active navigation.'
);
assert.doesNotMatch(
  architecture,
  /POLISH_CSS|loadStyleOnce|createElement\(['"]link['"]\)/,
  'Product architecture still owns a late stylesheet injection path.'
);
assert.ok(
  serviceWorker.includes('const PALETTE_NETWORK_ONLY=/\\/assets\\/css\\/(?:app|home-dashboard|native-app-shell|native-app-shell-stability|product-polish)\\.css$/i;')
    &&serviceWorker.includes('if(url.origin===self.location.origin&&PALETTE_NETWORK_ONLY.test(url.pathname))')
    &&serviceWorker.includes("fetch(request,{cache:'no-store'})"),
  'The cache owner must fetch canonical palette styles from the network without storing stale copies.'
);
assert.ok(
  serviceWorker.includes("const VERSION='octagon-hq-sw-20260722d-safe-home-activation';")
    &&serviceWorker.includes("const CACHE_NAME='octagon-hq-static-v19';")
    &&serviceWorker.includes('fresh-home-route-bootstrap|fresh-home-launch')
    &&serviceWorker.includes('game-challenges|profile-challenges|share-deep-links'),
  'The current service-worker identity must publish the safe Home launch and retain current app owners.'
);
const activation=serviceWorker.match(/self\.addEventListener\('activate',event=>\{([\s\S]*?)\n\}\);\n\nfunction isNavigation/);
assert(activation,'The service-worker activation boundary could not be identified.');
assert.doesNotMatch(activation[1],/clients\.matchAll|client\.navigate|openWindow/,'Service-worker activation must never navigate or reopen a live app client.');
assert.ok(
  index.includes('<meta name="theme-color" content="#080808" />')
    &&index.includes('<meta name="app-build" content="profile-challenges-delivery-20260722a" />')
    &&index.includes('assets/css/native-app-shell-stability.css?v=native-app-shell-stability-css-20260718a')
    &&index.includes('assets/js/profile-challenges.js?v=profile-challenges-20260722a-all-game-inbox'),
  'The HTML publication owner must retain the current mobile shell and challenge-controller requests.'
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
<header class="hero"><div><h1 id="paletteTitle">Octagon HQ</h1></div><div class="product-header-tools"><button id="paletteAsk" class="native-ask-action" type="button">Ask</button><div class="app-profile-tools"><button id="paletteProfile" class="app-profile-chip" type="button"><span class="app-profile-avatar">CK</span><span class="app-profile-chip-copy"><strong>Cody</strong></span></button></div><div id="manualRefreshControl"><div id="manualRefreshActions"><button id="manualRefreshBtn" type="button">Refresh</button><button id="whatsNewBtn" type="button">NEW<span id="whatsNewUnread">1</span></button></div></div></div></header>
<main class="shell"><section id="home" class="view active-view"><div class="home-dashboard">
<section id="paletteDaily" class="home-dashboard-card home-daily"><div class="home-daily-copy"><div id="paletteKicker" class="home-dashboard-kicker">TODAY'S CHALLENGE</div><h2>Find the Leader</h2><button id="palettePrimary" class="home-dashboard-action" type="button">Play Again</button></div></section>
<section id="paletteEvent" class="home-dashboard-card home-event"><div class="home-dashboard-kicker">NEXT UFC EVENT</div><h3 id="paletteEventTitle">UFC Fight Night</h3><div class="home-event-progress"><div class="home-event-track"><i id="paletteProgress" style="width:100%"></i></div></div></section>
</div></section></main>
<nav class="native-bottom-nav"><button id="paletteActiveNav" class="native-nav-button active" type="button"><span>Home</span><b id="paletteBadge" class="native-nav-badge">1</b></button></nav>
</body></html>`;

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route('**/semantic-dark-palette-proof.html*',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto('http://127.0.0.1:4173/semantic-dark-palette-proof.html',{waitUntil:'networkidle',timeout:60000});

  const snapshot=()=>page.evaluate(()=>{
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
        eventBackgroundImage:style('paletteEvent').backgroundImage,
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
  assert.deepEqual(final.tokens,{bg:'#000000',panel:'#0d0d0d',panel2:'#171717',accent:'#e10600',accent2:'#ff5a5f'},'Rendered mobile CSS did not retain the semantic dark palette tokens.');
  assert.equal(final.actual.bodyBackground,final.expected.bgBackground,'The app canvas is not true black.');
  assert.equal(final.actual.headerBackground,final.expected.bgBackground,'The final mobile header was repainted after startup.');
  assert.equal(final.actual.titleColor,final.expected.textColor,'The final mobile title was repainted after startup.');
  assert.equal(final.actual.profileBackground,final.expected.panel2Background,'The final profile control returned to the retired navy surface.');
  assert.equal(final.actual.refreshBackground,final.expected.panel2Background,'The final refresh control returned to the retired navy surface.');
  assert.equal(final.actual.newBackground,final.expected.panel2Background,'The final update control returned to the retired navy surface.');
  assert.equal(final.actual.unreadBackground,final.expected.accentBackground,'The final update badge returned to the retired orange accent.');
  assert.notEqual(final.actual.eventBackground,'rgb(255, 255, 255)','The final upcoming-event card returned to a white surface.');
  assert.notEqual(final.actual.eventBackgroundImage,'none','The final upcoming-event card lost its semantic charcoal treatment.');
  assert.equal(final.actual.eventTitleColor,final.expected.textColor,'The final upcoming-event title does not use canonical light text.');
  assert.equal(final.actual.kickerColor,final.expected.accent2Color,'The final Home kicker does not use the semantic red highlight.');
  assert.equal(final.actual.primaryBackground,final.expected.accentBackground,'The final primary action does not consume canonical UFC red.');
  assert.equal(final.actual.primaryColor,final.expected.whiteColor,'The final primary action does not retain white contrast text.');
  assert.equal(final.actual.progressBackground,final.expected.accentBackground,'The final Home progress bar does not consume canonical UFC red.');
  assert.equal(final.actual.activeNavColor,final.expected.accent2Color,'The final active navigation state does not consume the semantic red highlight.');
  assert.equal(final.actual.badgeBackground,final.expected.accentBackground,'The final notification badge does not consume canonical UFC red.');
  assert.equal(final.actual.badgeColor,final.expected.whiteColor,'The final notification badge does not retain white contrast text.');
  assert.deepEqual(final.actual,initial.actual,'The rendered semantic palette changed during the late startup window.');
  console.log(JSON.stringify({proof:'static-final-semantic-dark-palette',initial,final},null,2));
  await context.close();
}finally{
  await browser.close();
}

console.log('Static final semantic dark mobile theme contract passed.');