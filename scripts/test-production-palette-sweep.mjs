import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

const index=fs.readFileSync('index.html','utf8');
const styles=[...index.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)]
  .map(match=>`<link rel="stylesheet" href="/${match[1]}">`)
  .join('\n');
const legacyTokens='<style>:root{--bg:#f8fafc;--panel:#172033;--panel2:#1e293b;--text:#111827;--muted:#64748b;--line:#3b4352;--accent:#f97316;--accent2:#facc15}html,body{background:#f8fafc;color:#111827}.hero{background:#fff}</style>';
const lateLegacyRuntimeStyles=`<style>
  .hero{background:#fff;color:#111827}
  #playDailyLeaderboard{border-color:#facc15;background:linear-gradient(145deg,#253247,#172033 62%,#101522)}
  #playDailyLeaderboard .daily-board-row{border-color:#334155;background:#101725}
  #playDailyLeaderboard .daily-board-row>b{color:#facc15}
  #playDailyLeaderboard .daily-board-row span{color:#fde68a}
  #play .play-daily-dot.active{background:#f97316}
  #play .play-daily-swipe-hint{color:#fde68a}
  #picks .picks-standing-row{border-color:#dbe3ef;background:#fff;color:#111827}
  #picks .pick-lock.has-pick{color:#f97316}
  .community-member-card{border-color:#60a5fa;background:#172033}
  .community-directory-action.primary{background:#f97316;color:#111827}
  #homeDashboardMount>.home-shane-watchlist{background:linear-gradient(145deg,#1e293b,#0a101c)}
  .home-shane-card{border-color:#38bdf8;background:linear-gradient(155deg,rgba(56,189,248,.1),#0f172a)}
  .home-shane-card-band{background:linear-gradient(90deg,rgba(249,115,22,.2),transparent);color:#fb923c}
  .home-shane-stats div{border-color:rgba(56,189,248,.3);background:rgba(255,255,255,.04)}
  .octagon-board-head{border-color:#2b3a52;background:linear-gradient(145deg,#19263b,#0c1321)}
  .octagon-message{border-color:#2b3a52;background:linear-gradient(180deg,#141e2f,#101827)}
  .octagon-message-body a{color:#fb923c}
  .octagon-intelligence-button{background:#f97316;color:#111827}
  .octagon-manage-beta{border-color:#f97316;background:rgba(249,115,22,.14);color:#fed7aa}
  .octagon-access-panel{background:linear-gradient(180deg,#111a2a,#0d1523)}
</style>`;

const fixture=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${legacyTokens}${styles}${lateLegacyRuntimeStyles}</head><body>
<header class="hero"><div><p class="eyebrow">UFC Rankings</p><h1 id="paletteHeaderTitle">Octagon HQ</h1></div><div class="product-header-tools"><button class="native-ask-action">Ask</button><button id="whatsNewBtn">NEW<span id="whatsNewUnread">1</span></button><div class="hero-card"><span>80</span><small>fighters</small></div></div></header>
<main class="shell">
  <section id="home" class="view active-view"><div id="homeDashboardMount"><div class="home-dashboard">
    <article class="home-dashboard-card home-daily"><div><div class="home-dashboard-kicker">Today's Challenge</div><h2>Find the Leader</h2><button class="home-dashboard-action">Play Now</button></div></article>
  </div><details class="home-shane-watchlist" open><summary><span class="home-shane-summary-copy"><small>SCOUTING BOARD</small><strong>Shane's Fighters to Watch</strong><em>Early prospect calls.</em></span><span class="home-shane-summary-count">3 FIGHTERS</span></summary><div class="home-shane-body"><div class="home-shane-grid"><article class="home-shane-card is-latest"><div class="home-shane-card-band"><span class="home-shane-card-number">01</span><span class="home-shane-status">Latest Call</span><time>July 2026</time></div><div class="home-shane-identity"><span class="home-shane-avatar">FK</span><div><h4>Fatima Kline</h4><p>The Archangel</p></div></div><div class="home-shane-meta">Strawweight · Age 26</div><div class="home-shane-stats"><div><strong>4–1</strong><span>UFC RECORD</span></div></div><p class="home-shane-note">Fighter to watch.</p><a class="home-shane-ufc-link" href="#">VIEW UFC PROFILE <span>↗</span></a></article></div></div></details>
  </div></section>

  <nav class="rankings-subnav"><button class="active" aria-selected="true">Overall</button><button>Women</button></nav>
  <section class="toolbar"><input placeholder="Search fighter"><select><option>All eras</option></select><button id="resetBtn" class="ghost">Reset</button></section>
  <section id="men" class="view active-view"><div class="section-title"><h2 id="paletteRankingTitle">UFC All-Time P4P</h2><p id="paletteRankingSubtitle">Main leaderboard for UFC all-time rankings.</p></div><div class="leaderboard"><article class="row fighter-row"><div class="rank">#1</div><div class="row-photo">JJ</div><div class="row-main"><div class="name">Jon Jones</div><div class="meta">29–1 UFC · Light Heavyweight</div><div class="resume-tag">The standard everyone chases</div><a class="watch-moment-link" role="button" href="#">Watch Moment</a></div><div class="score">99<span class="meta">OVR</span></div></article></div></section>

  <section id="play" class="view active-view"><div class="play-hub">
    <article class="play-daily-card"><div class="play-daily-copy"><div class="play-daily-kicker"><span>Today's Challenge</span><time>Wed, Jul 22</time></div><h3>Find the Leader</h3><p>Eliminate nine fighters.</p><div class="play-daily-details play-daily-category"><span>Today's Category</span><strong>Title Wins</strong></div><button class="play-daily-button">Play Now</button></div><span class="play-daily-swipe-hint">SWIPE FOR LEADERBOARD</span></article>
    <div class="play-daily-dots"><button class="play-daily-dot"></button><button class="play-daily-dot active"></button></div>
    <section id="playDailyLeaderboard"><div class="daily-board-head"><div><span>WEDNESDAY, JUL 22</span><h3>Find the Leader Leaderboard</h3><p>4 players completed today's challenge.</p></div><div class="daily-board-controls"><button>REFRESH</button></div></div><div class="daily-board-list"><div class="daily-board-row you"><b>#1</b><strong>Cody</strong><span>9/10</span><small>Best 10/10 · 2x</small></div></div><div class="daily-community-card"><article><span>DAILY STREAK</span><strong>4 DAYS</strong><p>Keep the run alive.</p></article></div></section>
    <article class="play-streak-card"><span>DAILY STREAK</span><strong>4 DAYS</strong><small>Best: 8 days</small></article>
  </div></section>

  <section id="picks" class="view active-view"><div class="picks-shell">
    <label class="picks-event-picker">Event<select><option>UFC Abu Dhabi</option></select></label>
    <div class="picks-room-banner"><div class="picks-room-copy"><strong>GOAT26 Picks</strong><span class="picks-room-live">LIVE</span><small>4 players</small></div></div>
    <div class="picks-progress-card card"><div class="picks-progress-bar"><i style="width:86%"></i></div></div>
    <article class="pick-fight"><header class="pick-fight-head"><div><span class="pick-fight-number">06</span><strong>Main Card</strong></div><span class="pick-lock has-pick">Your pick: Fighter A · saved automatically</span></header><div class="pick-matchup"><button class="pick-fighter selected"><span class="pick-selected-mark">✓</span><span class="pick-fighter-name">Fighter A</span><span class="pick-fighter-odds">+155 <b>FAV</b></span></button><span class="pick-vs">VS</span><button class="pick-fighter"><span class="pick-fighter-name">Fighter B</span><span class="pick-fighter-odds">-180</span></button></div><button class="pick-underdog-action">Underdog Lock</button></article>
    <div class="card picks-standings-card"><h3>Event Standings</h3><div class="picks-standings"><div class="picks-standing-row"><div class="picks-standing-rank">#1</div><div><strong>Cody <span class="picks-you">YOU</span></strong><div class="meta">3 correct · 4 picks</div></div><div class="picks-standing-score"><strong>5</strong><small>PTS</small></div></div></div></div>
  </div></section>

  <section class="community-directory"><div class="community-directory-summary"><div><span>OCTAGON HQ COMMUNITY</span><strong>Member Profiles</strong></div></div><div class="community-directory-body"><button class="community-directory-action primary">BUILD YOUR TOP 10</button><button class="community-directory-action">OPEN YOUR PROFILE</button><button class="community-member-card"><span class="community-member-main"><span class="community-member-name">Cody</span><span class="community-member-active">Active now</span><span class="community-member-pills"><b class="complete">Top 10 ready</b><b class="missing">Top 10 needed</b></span></span></button></div></section>

  <section id="octagon" class="view active-view"><div class="octagon-board" data-octagon-board><header class="octagon-board-head"><div><div class="octagon-board-kicker">GOAT26 WAR ROOM</div><h2>The War Room</h2><p class="octagon-board-week">Jul 20 – Jul 26</p></div><div class="octagon-board-head-actions"><span class="octagon-live live"><i></i><b>LIVE</b></span><button class="octagon-manage-beta">Manage Access</button><button class="octagon-intelligence-button">Take to Intelligence</button></div></header><section class="octagon-access-panel"><div class="octagon-access-panel-inner"><div class="octagon-access-row"><div class="octagon-access-member"><strong>Cody</strong><small class="admin">ADMIN</small></div><button class="octagon-access-toggle enabled"><i></i><b>ENABLED</b></button></div></div></section><div class="octagon-feed"><article class="octagon-message"><div class="octagon-message-head"><div class="octagon-message-author"><strong>Cody</strong><small>Mon 3:03 PM</small></div><span class="octagon-admin-label">ADMIN</span></div><p class="octagon-message-body">Read the <a href="#">shared verdict</a>.</p></article></div></div></section>
</main>
<nav class="native-bottom-nav"><button class="native-nav-button active"><span>Home</span></button><button class="native-nav-button"><span>Rankings</span></button><button class="native-nav-button"><span>Play</span></button><button class="native-nav-button"><span>Picks</span></button><button class="native-nav-button"><span>War Room</span></button></nav>
</body></html>`;

const dark=['rgb(0, 0, 0)','rgb(13, 13, 13)','rgb(23, 23, 23)','rgb(32, 32, 32)'];
const retired=[
  'rgb(248, 250, 252)','rgb(241, 245, 249)','rgb(238, 242, 247)',
  'rgb(249, 115, 22)','rgb(251, 146, 60)','rgb(250, 204, 21)','rgb(253, 230, 138)','rgb(253, 186, 116)','rgb(254, 215, 170)',
  'rgb(17, 24, 39)','rgb(23, 32, 51)','rgb(15, 23, 42)','rgb(30, 41, 59)','rgb(37, 50, 71)','rgb(16, 23, 37)','rgb(25, 38, 59)','rgb(12, 19, 33)','rgb(17, 26, 42)','rgb(13, 21, 35)','rgb(51, 65, 85)','rgb(71, 85, 105)','rgb(82, 103, 134)'
];
const black='rgb(0, 0, 0)';
const panel='rgb(13, 13, 13)';
const panel2='rgb(23, 23, 23)';
const textColor='rgb(245, 245, 245)';
const muted='rgb(163, 163, 163)';
const red='rgb(225, 6, 0)';
const redHighlight='rgb(255, 90, 95)';
const amber='rgb(245, 158, 11)';
const amberSoft='rgb(251, 191, 36)';
const success='rgb(34, 197, 94)';
const successSoft='rgb(134, 239, 172)';
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
      tokens:{bg:root.getPropertyValue('--bg').trim(),panel:root.getPropertyValue('--panel').trim(),panel2:root.getPropertyValue('--panel2').trim(),panel3:root.getPropertyValue('--panel3').trim(),text:root.getPropertyValue('--text').trim(),muted:root.getPropertyValue('--muted').trim(),line:root.getPropertyValue('--line').trim(),accent:root.getPropertyValue('--accent').trim(),accent2:root.getPropertyValue('--accent2').trim(),amber:root.getPropertyValue('--accent-amber').trim(),amberSoft:root.getPropertyValue('--accent-amber-soft').trim(),success:root.getPropertyValue('--success').trim(),successSoft:root.getPropertyValue('--success-soft').trim(),link:root.getPropertyValue('--link').trim()},
      body:read('body'),hero:read('.hero'),headerTitle:read('#paletteHeaderTitle'),shell:read('main.shell'),headerControl:read('.native-ask-action'),
      homeDaily:read('.home-daily'),homeAction:read('.home-daily .home-dashboard-action'),
      subnav:read('.rankings-subnav'),subnavActive:read('.rankings-subnav button.active'),input:read('.toolbar input'),reset:read('#resetBtn'),rankingTitle:read('#paletteRankingTitle'),rankingSubtitle:read('#paletteRankingSubtitle'),rankingRow:read('#men .row'),rankingName:read('#men .name'),rankingMeta:read('#men .row-main .meta'),rankingScore:read('#men .score'),rankingRank:read('#men .rank'),resumeTag:read('#men .resume-tag'),rowAction:read('#men .watch-moment-link'),
      playDaily:read('#play .play-daily-card'),playKicker:read('#play .play-daily-kicker span'),playTime:read('#play .play-daily-kicker time'),playAction:read('#play .play-daily-button'),playBoard:read('#playDailyLeaderboard'),playBoardRow:read('#playDailyLeaderboard .daily-board-row'),playBoardRank:read('#playDailyLeaderboard .daily-board-row>b'),playBoardName:read('#playDailyLeaderboard .daily-board-row strong'),playBoardScore:read('#playDailyLeaderboard .daily-board-row span'),playBoardMeta:read('#playDailyLeaderboard .daily-board-row small'),playStreak:read('#play .play-streak-card'),playStreakValue:read('#play .play-streak-card strong'),playStreakMeta:read('#play .play-streak-card small'),playDot:read('#play .play-daily-dot.active'),playSwipe:read('#play .play-daily-swipe-hint'),
      picksPicker:read('#picks .picks-event-picker select'),picksRoom:read('#picks .picks-room-banner'),picksRoomLive:read('#picks .picks-room-live'),picksProgress:read('#picks .picks-progress-card'),picksFill:read('#picks .picks-progress-bar i'),selected:read('#picks .pick-fighter.selected'),fighter:read('#picks .pick-fighter:not(.selected)'),fighterName:read('#picks .pick-fighter-name'),odds:read('#picks .pick-fighter.selected .pick-fighter-odds'),favorite:read('#picks .pick-fighter-odds b'),underdog:read('#picks .pick-underdog-action'),fightNumber:read('#picks .pick-fight-number'),yourPick:read('#picks .pick-lock.has-pick'),standings:read('#picks .picks-standings-card'),standingRow:read('#picks .picks-standing-row'),standingName:read('#picks .picks-standing-row strong'),standingMeta:read('#picks .picks-standing-row .meta'),standingPoints:read('#picks .picks-standing-score strong'),standingPointsLabel:read('#picks .picks-standing-score small'),
      community:read('.community-directory'),memberCard:read('.community-member-card'),profilePrimary:read('.community-directory-action.primary'),profileSecondary:read('.community-directory-action:not(.primary)'),profileReady:read('.community-member-pills .complete'),profileNeeded:read('.community-member-pills .missing'),
      shaneBoard:read('.home-shane-watchlist'),shaneCard:read('.home-shane-card'),shaneBand:read('.home-shane-card-band'),shaneStatus:read('.home-shane-status'),shaneStat:read('.home-shane-stats div'),shaneStatValue:read('.home-shane-stats strong'),shaneStatLabel:read('.home-shane-stats span'),shaneLink:read('.home-shane-ufc-link'),
      warHead:read('.octagon-board-head'),warMessage:read('.octagon-message'),warLink:read('.octagon-message-body a'),warAction:read('.octagon-intelligence-button'),warManage:read('.octagon-manage-beta'),warLive:read('.octagon-live.live'),warAdmin:read('.octagon-admin-label'),warAccess:read('.octagon-access-panel'),
      nav:read('.native-bottom-nav'),navActive:read('.native-nav-button.active'),navActiveLabel:read('.native-nav-button.active span'),navActiveIndicator:read('.native-nav-button.active','::before'),navInactive:read('.native-nav-button:not(.active)')
    };
  });

  fs.writeFileSync(reportPath,JSON.stringify({proof:'semantic-production-palette',result},null,2));
  console.log('PALETTE_TOKENS',JSON.stringify(result.tokens));

  assert.deepEqual(result.tokens,{bg:'#000000',panel:'#0d0d0d',panel2:'#171717',panel3:'#202020',text:'#f5f5f5',muted:'#a3a3a3',line:'#2b2b2b',accent:'#e10600',accent2:'#ff5a5f',amber:'#f59e0b',amberSoft:'#fbbf24',success:'#22c55e',successSoft:'#86efac',link:'#8ab4f8'},'Final palette owner did not replace cached theme tokens.');
  assert.equal(result.body.backgroundColor,black,'Body is not true black.');
  assert.equal(result.hero.backgroundColor,black,'Header is not true black.');
  assert.equal(result.shell.backgroundColor,black,'App canvas is not true black.');
  assert.equal(result.headerTitle.color,textColor,'Octagon HQ lost white header contrast.');
  for(const key of ['headerControl','homeDaily','subnav','input','reset','rankingRow','playDaily','playBoard','playBoardRow','playStreak','picksPicker','picksRoom','picksProgress','selected','fighter','standings','standingRow','community','memberCard','profileSecondary','shaneBoard','shaneCard','shaneBand','shaneStat','warHead','warMessage','warManage','warAccess'])assert.ok(isDark(result[key]),`${key} is not using a black/charcoal surface.`);

  assert.equal(result.homeAction.backgroundColor,red,'Primary Home action is not UFC red.');
  assert.equal(result.subnavActive.borderColor,red,'Active Rankings filter is missing the restrained red outline.');
  assert.ok(isDark(result.subnavActive),'Active Rankings filter became a filled accent button.');
  assert.equal(result.rankingTitle.color,textColor,'UFC All-Time P4P title is not white.');
  assert.equal(result.rankingSubtitle.color,muted,'Rankings supporting copy is not gray.');
  assert.equal(result.rankingName.color,textColor,'Fighter name is not white.');
  assert.equal(result.rankingScore.color,textColor,'OVR is not white.');
  assert.equal(result.rankingMeta.color,muted,'Record and division are not gray.');
  assert.equal(result.rankingRank.color,redHighlight,'Top ranking number lost its restrained red accent.');
  assert.equal(result.resumeTag.backgroundColor,panel,'Resume tag is not neutral charcoal.');
  assert.equal(result.rowAction.backgroundColor,transparent,'Watch Moment should be an outline, not a filled button.');
  assert.equal(result.rowAction.borderColor,red,'Watch Moment is missing its restrained red outline.');

  assert.equal(result.playKicker.backgroundColor,red,'Featured Play kicker is not red.');
  assert.equal(result.playTime.color,muted,'Play date should be supporting gray text.');
  assert.equal(result.playAction.backgroundColor,red,'Primary Play action is not red.');
  assert.equal(result.playBoardName.color,textColor,'Play leaderboard player name is not white.');
  assert.equal(result.playBoardScore.color,textColor,'Play leaderboard score is not white.');
  assert.equal(result.playBoardMeta.color,muted,'Play leaderboard metadata is not gray.');
  assert.equal(result.playBoardRank.color,muted,'Play leaderboard rank still uses yellow.');
  assert.equal(result.playStreakValue.color,textColor,'Play streak value is not white.');
  assert.equal(result.playStreakMeta.color,muted,'Play streak metadata is not gray.');
  assert.equal(result.playDot.backgroundColor,red,'Active Play carousel indicator is not red.');
  assert.equal(result.playSwipe.color,muted,'Play swipe instruction is not supporting gray.');

  assert.equal(result.picksFill.backgroundColor,red,'Picks progress is not red.');
  assert.equal(result.selected.borderColor,red,'Selected fighter is missing the red outline.');
  assert.equal(result.fighterName.color,textColor,'Fighter name is not white.');
  assert.equal(result.odds.color,'rgb(184, 184, 184)','Fight odds are not neutral gray.');
  assert.equal(result.favorite.color,'rgb(255, 146, 150)','FAV badge lost its muted-red treatment.');
  assert.equal(result.underdog.borderColor,amber,'Underdog Lock is not using amber.');
  assert.equal(result.underdog.color,amberSoft,'Underdog Lock label is not amber.');
  assert.equal(result.fightNumber.color,redHighlight,'Fight number lost its small red accent.');
  assert.equal(result.yourPick.color,muted,'Your pick text still uses orange.');
  assert.equal(result.standingName.color,textColor,'Picks standings player name is not white.');
  assert.equal(result.standingPoints.color,textColor,'Picks standings points are not white.');
  assert.equal(result.standingMeta.color,muted,'Picks standings supporting stats are not gray.');
  assert.equal(result.standingPointsLabel.color,muted,'Picks standings points label is not gray.');
  assert.equal(result.picksRoomLive.color,successSoft,'Picks room Live status is not green.');

  assert.equal(result.profilePrimary.backgroundColor,red,'Member Profile primary action is not red.');
  assert.ok(isDark(result.profileSecondary),'Member Profile secondary action is not neutral charcoal.');
  assert.equal(result.profileReady.color,successSoft,'Top 10 ready is not green.');
  assert.equal(result.profileNeeded.color,amberSoft,'Top 10 needed is not amber.');

  assert.equal(result.shaneStatus.color,redHighlight,"Shane's scouting status lost its small red accent.");
  assert.equal(result.shaneStatValue.color,textColor,"Shane's primary stats are not white.");
  assert.equal(result.shaneStatLabel.color,muted,"Shane's supporting stats are not gray.");
  assert.equal(result.shaneLink.color,linkBlue,"Shane's UFC profile link is not blue.");

  assert.equal(result.warLink.color,linkBlue,'War Room links are not blue.');
  assert.equal(result.warAction.backgroundColor,red,'Take to Intelligence is not UFC red.');
  assert.ok(isDark(result.warManage),'Manage Access is not a neutral charcoal control.');
  assert.equal(result.warManage.borderColor,'rgb(43, 43, 43)','Manage Access is not using a gray outline.');
  assert.equal(result.warLive.color,successSoft,'War Room Live is not green.');
  assert.equal(result.warAdmin.color,redHighlight,'War Room admin label lost its small red accent.');

  assert.equal(result.nav.backgroundColor,black,'Bottom navigation is not black.');
  assert.equal(result.navActive.backgroundColor,transparent,'Active navigation still uses a large maroon tile.');
  assert.equal(result.navActive.color,redHighlight,'Active navigation icon is not red.');
  assert.equal(result.navActiveLabel.color,redHighlight,'Active navigation label is not red.');
  assert.equal(result.navActiveIndicator.backgroundColor,red,'Active navigation indicator is not red.');
  assert.equal(result.navActiveIndicator.opacity,'1','Active navigation indicator is hidden.');
  assert.equal(result.navInactive.color,'rgb(143, 143, 143)','Inactive navigation is not neutral gray.');

  const renderedSurfaces=Object.entries(result)
    .filter(([key,value])=>key!=='tokens'&&value&&typeof value==='object')
    .flatMap(([key,value])=>[`${key}.backgroundColor=${value.backgroundColor}`,`${key}.backgroundImage=${value.backgroundImage}`]);
  for(const color of retired)assert.ok(!renderedSurfaces.some(value=>value.includes(color)),`Retired production surface color survived the semantic theme: ${color}`);
  assert.equal(result.body.color,textColor,'Primary text is not white.');
}finally{
  await browser.close();
}

console.log('Semantic production palette sweep passed.');
