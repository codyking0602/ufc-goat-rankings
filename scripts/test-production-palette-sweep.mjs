import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

const index=fs.readFileSync('index.html','utf8');
const styles=[...index.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)]
  .map(match=>`<link rel="stylesheet" href="/${match[1]}">`)
  .join('\n');
const legacyTokens='<style>:root{--bg:#f8fafc;--panel:#172033;--panel2:#1e293b;--text:#111827;--muted:#64748b;--line:#3b4352;--accent:#f97316;--accent2:#facc15}body{background:#f8fafc;color:#111827}</style>';
const lateLegacyRuntimeStyles=`<style>
  .octagon-board-head{border-color:#2b3a52;background:linear-gradient(145deg,#19263b,#0c1321)}
  .octagon-message{border-color:#2b3a52;background:linear-gradient(180deg,#141e2f,#101827)}
  .octagon-message-body a{color:#fb923c}
  .octagon-intelligence-button{background:#f97316;color:#111827}
</style>`;

const fixture=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${legacyTokens}${styles}${lateLegacyRuntimeStyles}</head><body>
<header class="hero"><div><p class="eyebrow">UFC Rankings</p><h1>Octagon HQ</h1></div><div class="product-header-tools"><button class="native-ask-action">Ask</button><button id="whatsNewBtn">NEW</button></div></header>
<main class="shell">
  <section id="home" class="view active-view"><div id="homeDashboardMount"><div class="home-dashboard">
    <article class="home-dashboard-card home-daily"><div><div class="home-dashboard-kicker">Today's Challenge</div><h2>Find the Leader</h2><button class="home-dashboard-action">Play Now</button></div></article>
    <article class="home-dashboard-card home-event"><div class="home-dashboard-kicker">Next UFC Event</div><h3>UFC Fight Night</h3><button class="home-dashboard-action secondary">Event Details</button></article>
    <article class="home-dashboard-card home-war-room"><div class="home-dashboard-kicker">The War Room</div><button class="home-dashboard-action">Join Conversation</button></article>
  </div></div></section>
  <nav class="rankings-subnav"><button class="active" aria-selected="true">Overall</button><button>Women</button></nav>
  <section class="toolbar"><input placeholder="Search fighter"><select><option>All eras</option></select><button id="resetBtn" class="ghost">Reset</button></section>
  <section id="rankings"><div class="leaderboard"><article class="row"><div class="rank">#1</div><div><strong>Jon Jones</strong><span class="resume-tag">The standard everyone chases</span><button>Watch Moment</button></div></article></div></section>
  <section id="play" class="view active-view"><div class="play-hub">
    <article class="play-daily-card"><div class="play-daily-copy"><div class="play-daily-kicker"><span>Today's Challenge</span><time>Wed, Jul 22</time></div><h3>Find the Leader</h3><p>Eliminate nine fighters.</p><button class="play-daily-button">Play Now</button></div><div class="play-daily-visual"><strong>10 → 1</strong><small>Leave the leader</small></div></article>
    <div class="play-hub-heading"><div><span>All Games</span><h3>Pick your debate</h3></div><p>Quick games built to argue about.</p></div>
    <button class="play-game-card"><span class="play-game-icon">#1</span><span class="play-game-copy"><strong>Find the Leader</strong><small>Official UFC stats.</small></span><span class="play-game-action">Open Game</span></button>
    <div class="play-mode-switch"><button class="active">Top 10</button><button>Blind</button></div>
  </div></section>
  <section id="picks" class="view active-view"><div class="picks-shell">
    <div class="picks-mode-switch"><button>Home</button><button class="active">Event</button><button>Settings</button></div>
    <div class="picks-progress-card card"><div class="picks-progress-top"><strong>6/7</strong><span>open fights picked</span></div><div class="picks-progress-bar"><i style="width:86%"></i></div></div>
    <article class="pick-fight"><header class="pick-fight-head"><div><span class="pick-fight-number">06</span><strong>Main Card</strong></div><span class="pick-lock">Locks Sat 11:00 AM</span></header><div class="pick-matchup">
      <button class="pick-fighter selected"><span class="pick-selected-mark">✓</span><span class="pick-fighter-name">Fighter A</span><span class="pick-fighter-odds">+155 <b>FAV</b></span></button>
      <span class="pick-vs">VS</span>
      <button class="pick-fighter"><span class="pick-fighter-name">Fighter B</span><span class="pick-fighter-odds">-180</span></button>
    </div><button class="pick-underdog-action">Underdog Lock</button></article>
  </div></section>
  <section id="octagon" class="view active-view"><div class="octagon-board" data-octagon-board><header class="octagon-board-head"><div><div class="octagon-board-kicker">GOAT26 WAR ROOM</div><h2>The War Room</h2><p class="octagon-board-week">Jul 20 – Jul 26</p></div><button class="octagon-intelligence-button">Take to Intelligence</button></header><div class="octagon-feed"><article class="octagon-message"><div class="octagon-message-head"><div class="octagon-message-author"><strong>Cody</strong><small>Mon 3:03 PM</small></div><span class="octagon-admin-label">ADMIN</span></div><p class="octagon-message-body">Read the <a href="#">shared verdict</a>.</p><div class="octagon-message-actions"><button>Reply</button><button class="active">Share</button></div></article></div></div></section>
</main>
<nav class="native-bottom-nav"><button class="native-nav-button active"><span>Home</span></button><button class="native-nav-button"><span>Rankings</span></button><button class="native-nav-button"><span>Play</span></button><button class="native-nav-button"><span>Picks</span></button><button class="native-nav-button"><span>War Room</span></button></nav>
</body></html>`;

const dark=['rgb(0, 0, 0)','rgb(13, 13, 13)','rgb(23, 23, 23)','rgb(32, 32, 32)'];
const retired=['rgb(249, 115, 22)','rgb(251, 146, 60)','rgb(250, 204, 21)','rgb(17, 24, 39)','rgb(23, 32, 51)','rgb(15, 23, 42)','rgb(30, 41, 59)','rgb(37, 50, 71)','rgb(59, 67, 82)','rgb(248, 250, 252)','rgb(241, 245, 249)','rgb(238, 242, 247)'];
const black='rgb(0, 0, 0)';
const panel='rgb(13, 13, 13)';
const panel2='rgb(23, 23, 23)';
const textColor='rgb(245, 245, 245)';
const muted='rgb(163, 163, 163)';
const red='rgb(225, 6, 0)';
const redHighlight='rgb(255, 90, 95)';
const amber='rgb(245, 158, 11)';
const amberSoft='rgb(251, 191, 36)';
const linkBlue='rgb(138, 180, 248)';
const transparent='rgba(0, 0, 0, 0)';
const reportPath='/tmp/production-palette-sweep-report.json';
const isDark=value=>Boolean(value)&&(dark.includes(value.backgroundColor)||dark.some(color=>value.backgroundImage.includes(color)));

const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await page.route('**/production-palette-sweep-proof.html',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto('http://127.0.0.1:4173/production-palette-sweep-proof.html',{waitUntil:'networkidle',timeout:60000});

  const result=await page.evaluate(()=>{
    const read=(selector,pseudo='')=>{
      const node=document.querySelector(selector);
      if(!node)return null;
      const style=getComputedStyle(node,pseudo||null);
      return{backgroundColor:style.backgroundColor,backgroundImage:style.backgroundImage,color:style.color,borderColor:style.borderColor,opacity:style.opacity,width:style.width,height:style.height};
    };
    const root=getComputedStyle(document.documentElement);
    return{
      tokens:{bg:root.getPropertyValue('--bg').trim(),panel:root.getPropertyValue('--panel').trim(),panel2:root.getPropertyValue('--panel2').trim(),panel3:root.getPropertyValue('--panel3').trim(),text:root.getPropertyValue('--text').trim(),muted:root.getPropertyValue('--muted').trim(),line:root.getPropertyValue('--line').trim(),accent:root.getPropertyValue('--accent').trim(),accent2:root.getPropertyValue('--accent2').trim(),amber:root.getPropertyValue('--accent-amber').trim(),amberSoft:root.getPropertyValue('--accent-amber-soft').trim()},
      body:read('body'),hero:read('.hero'),shell:read('main.shell'),
      homeDaily:read('.home-daily'),homeEvent:read('.home-event'),homeWar:read('.home-war-room'),homeAction:read('.home-daily .home-dashboard-action'),homeSecondary:read('.home-event .home-dashboard-action'),
      subnav:read('.rankings-subnav'),subnavActive:read('.rankings-subnav button.active'),input:read('.toolbar input'),reset:read('#resetBtn'),
      rankingRow:read('#rankings .row'),rankingRank:read('#rankings .rank'),resumeTag:read('#rankings .resume-tag'),rowAction:read('#rankings .row button'),
      playDaily:read('#play .play-daily-card'),playKicker:read('#play .play-daily-kicker span'),playTime:read('#play .play-daily-kicker time'),playAction:read('#play .play-daily-button'),playGame:read('#play .play-game-card'),playMode:read('#play .play-mode-switch button.active'),
      picksMode:read('#picks .picks-mode-switch button.active'),picksProgress:read('#picks .picks-progress-card'),picksFill:read('#picks .picks-progress-bar i'),selected:read('#picks .pick-fighter.selected'),fighter:read('#picks .pick-fighter:not(.selected)'),odds:read('#picks .pick-fighter.selected .pick-fighter-odds'),favorite:read('#picks .pick-fighter-odds b'),underdog:read('#picks .pick-underdog-action'),fightNumber:read('#picks .pick-fight-number'),
      warHead:read('.octagon-board-head'),warMessage:read('.octagon-message'),warLink:read('.octagon-message-body a'),warAction:read('.octagon-intelligence-button'),warAdmin:read('.octagon-admin-label'),
      nav:read('.native-bottom-nav'),navActive:read('.native-nav-button.active'),navActiveLabel:read('.native-nav-button.active span'),navActiveIndicator:read('.native-nav-button.active','::before'),navInactive:read('.native-nav-button:not(.active)')
    };
  });

  fs.writeFileSync(reportPath,JSON.stringify({proof:'semantic-production-palette',result},null,2));
  console.log('PALETTE_TOKENS',JSON.stringify(result.tokens));

  assert.deepEqual(result.tokens,{bg:'#000000',panel:'#0d0d0d',panel2:'#171717',panel3:'#202020',text:'#f5f5f5',muted:'#a3a3a3',line:'#2b2b2b',accent:'#e10600',accent2:'#ff5a5f',amber:'#f59e0b',amberSoft:'#fbbf24'},'Final palette owner did not replace cached theme tokens.');
  assert.equal(result.body.backgroundColor,black,'Body is not true black.');
  assert.equal(result.hero.backgroundColor,black,'Header is not true black.');
  assert.equal(result.shell.backgroundColor,black,'App canvas is not true black.');
  for(const key of ['homeDaily','homeEvent','homeWar','subnav','input','reset','rankingRow','playDaily','playGame','picksProgress','selected','fighter','warHead','warMessage'])assert.ok(isDark(result[key]),`${key} is not using a black/charcoal surface.`);

  assert.equal(result.homeAction.backgroundColor,red,'Primary Home action is not UFC red.');
  assert.equal(result.homeAction.color,'rgb(255, 255, 255)','Primary Home action lost white contrast.');
  assert.ok(isDark(result.homeSecondary),'Secondary Home action should remain neutral.');
  assert.equal(result.subnavActive.borderColor,red,'Active Rankings filter is missing the restrained red outline.');
  assert.ok(isDark(result.subnavActive),'Active Rankings filter became a filled accent button.');
  assert.equal(result.rankingRank.color,redHighlight,'Top ranking number lost its restrained red accent.');
  assert.equal(result.resumeTag.backgroundColor,panel,'Resume tag is not neutral charcoal.');
  assert.equal(result.resumeTag.color,'rgb(199, 199, 199)','Resume tag is not neutral gray.');
  assert.equal(result.rowAction.backgroundColor,transparent,'Watch action should be an outline, not a filled red button.');

  assert.equal(result.playKicker.backgroundColor,red,'Featured Play kicker is not red.');
  assert.equal(result.playKicker.color,'rgb(255, 255, 255)','Featured Play kicker lost white contrast.');
  assert.equal(result.playTime.color,muted,'Play date should be supporting gray text.');
  assert.equal(result.playAction.backgroundColor,red,'Primary Play action is not red.');
  assert.equal(result.playMode.borderColor,red,'Active Play mode is missing the restrained red outline.');
  assert.ok(isDark(result.playMode),'Active Play mode became a filled accent button.');

  assert.equal(result.picksMode.borderColor,red,'Active Picks tab is missing the restrained red outline.');
  assert.ok(isDark(result.picksMode),'Active Picks tab became a filled red/orange button.');
  assert.equal(result.picksFill.backgroundColor,red,'Picks progress is not red.');
  assert.equal(result.selected.borderColor,red,'Selected fighter is missing the red outline.');
  assert.equal(result.odds.color,'rgb(184, 184, 184)','Fight odds are not neutral gray.');
  assert.equal(result.favorite.color,'rgb(255, 146, 150)','Favorite badge lost its restrained red treatment.');
  assert.equal(result.underdog.borderColor,amber,'Underdog Lock is not using the amber semantic accent.');
  assert.equal(result.underdog.color,amberSoft,'Underdog Lock label is not amber.');
  assert.equal(result.fightNumber.color,redHighlight,'Fight number lost its small red accent.');

  assert.equal(result.warLink.color,linkBlue,'War Room links are not using familiar link styling.');
  assert.equal(result.warAction.backgroundColor,red,'War Room primary action is not red.');
  assert.equal(result.warAdmin.color,redHighlight,'War Room admin label lost its small red accent.');
  assert.equal(result.nav.backgroundColor,black,'Bottom navigation is not black.');
  assert.equal(result.navActive.backgroundColor,transparent,'Active navigation still uses a large maroon tile.');
  assert.equal(result.navActive.color,redHighlight,'Active navigation icon is not red.');
  assert.equal(result.navActiveLabel.color,redHighlight,'Active navigation label is not red.');
  assert.equal(result.navActiveIndicator.backgroundColor,red,'Active navigation indicator is not red.');
  assert.equal(result.navActiveIndicator.opacity,'1','Active navigation indicator is hidden.');
  assert.equal(result.navInactive.color,'rgb(143, 143, 143)','Inactive navigation is not neutral gray.');

  const rendered=JSON.stringify(result);
  for(const color of retired)assert.ok(!rendered.includes(color),`Retired production color survived the semantic theme: ${color}`);
  assert.equal(result.body.color,textColor,'Primary text is not white.');
}finally{
  await browser.close();
}

console.log('Semantic production palette sweep passed.');
