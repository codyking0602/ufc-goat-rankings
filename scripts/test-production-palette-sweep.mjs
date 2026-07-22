import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

const index=fs.readFileSync('index.html','utf8');
const styles=[...index.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)]
  .map(match=>`<link rel="stylesheet" href="/${match[1]}">`)
  .join('\n');

const legacyTokens='<style>:root{--bg:#f8fafc;--panel:#172033;--panel2:#1e293b;--text:#111827;--muted:#64748b;--line:#3b4352;--accent:#f97316;--accent2:#facc15}html,body{background:#f8fafc;color:#111827}</style>';
const lateLegacyRuntimeStyles=`<style>
  .hero{background:linear-gradient(90deg,#000 55%,#351708)!important;color:#111827}
  .hero::after{content:"";display:block;background:#f97316}
  .toolbar #search,.toolbar #eraFilter,.toolbar #divisionFilter{background:#172033!important;border-color:#526786!important}
  #menList .fighter-row,#womenList .fighter-row,#divisionList .fighter-row,#categoryBoardList .fighter-row{background:#1e293b!important;border-color:#526786!important}
  #menList .resume-tag,#womenList .resume-tag{background:#31372f!important;border-color:#8b7600!important;color:#fde68a!important}
  #menList .watch-moment-link,#womenList .watch-moment-link{background:rgba(255,90,95,.14)!important;border-color:#ff7f87!important;color:#ffc1c5!important}
  #categories .category-leader-pill,#categories .category-sex-toggle button,#division .division-leader-pill{background:#111827!important;border-color:#3b4352!important;color:#f8fafc!important}
  #categories .category-leader-summary,#division .division-leader-summary{background:#0f172a!important;border-color:#8b7600!important;color:#fde68a!important}
  #communityProfilesMount .community-directory-summary-meta i{background:#111827!important;border-color:#526786!important;color:#fb923c!important}

  #picks>.section-title h2,#picks>.section-title p{color:#0f172a!important}
  #picks .picks-group-card,#picksHistoryCard,#picks .picks-pin-card,#picks .picks-profile-clean,#picks .picks-commissioner-clean,#picks .commissioner-clean-section,#picks .picks-upcoming-event-section{background:#172033!important;border-color:#526786!important}
  #picks .picks-group-content,#picks .picks-history-list,#picks .picks-pin-content,#picks .commissioner-clean-section>.commissioner-section{background:#f8fafc!important;color:#172033!important}
  #picks .picks-group-member,#picks .picks-group-event,#picks .picks-history-row,#picks .picks-pin-fields,#picks .picks-group-owner,#picks .picks-correction-gate{background:#fff7ed!important;border-color:#fdba74!important;color:#7c2d12!important}
  #picks .picks-pin-fields input,#picks .picks-group-owner select{background:#172033!important;border-color:#526786!important;color:#fff!important}
  #picks .picks-pin-primary,#picks .picks-history-row button,#picks .picks-group-event button,#picks .picks-group-owner button{background:#f97316!important;border-color:#f97316!important;color:#111827!important}
  #picks .picks-standing-row{background:#fff!important;border-color:#dbe3ef!important;color:#111827!important}

  .profile-activity-panel{background:linear-gradient(180deg,#1c293d,#0d1421)!important;border-color:#f97316!important}
  .profile-activity-head{background:radial-gradient(circle at 92% 0,rgba(249,115,22,.18),transparent 35%)!important}
  .profile-activity-stat,.profile-activity-card,.profile-activity-metric,.profile-achievement,.profile-recent-row{background:#0b1220!important;border-color:#33445f!important}
  .profile-activity-edit,.profile-activity-actions button:first-child{background:#f97316!important;border-color:#f97316!important;color:#111827!important}

  #whatChangedDialog{background:linear-gradient(180deg,#111a2b,#07101d)!important;border-color:#f97316!important}
  .what-changed-head{background:linear-gradient(145deg,#1a273a,#0b1423)!important}
  .what-changed-entry{background:linear-gradient(145deg,#172336,#0a121f)!important;border-color:#526786!important}
  .what-changed-type,.what-changed-verified span{background:rgba(249,115,22,.14)!important;color:#ffd3b2!important}
  .what-changed-arrow{color:#f97316!important}

  #octagon .octagon-intelligence-button{background:#f97316!important;border-color:#f97316!important;color:#111827!important}
  #octagon .octagon-manage-beta{background:rgba(30,41,59,.9)!important;border-color:#526786!important;color:#aebbd0!important}
</style>`;

const fixture=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${legacyTokens}${styles}${lateLegacyRuntimeStyles}</head><body>
<header class="hero"><div><p class="eyebrow">UFC Rankings</p><h1 id="paletteHeaderTitle">Octagon HQ</h1></div><div class="product-header-tools"><button class="native-ask-action">Ask</button><button id="whatsNewBtn">NEW</button></div></header>
<main class="shell">
  <nav class="rankings-subnav"><button class="active" aria-selected="true">Overall</button><button>Women</button></nav>
  <section class="toolbar"><input id="search" placeholder="Search fighter"><select id="eraFilter"><option>All eras</option></select><select id="divisionFilter"><option>Heavyweight</option></select><button id="resetBtn" class="ghost">Reset</button></section>
  <section id="men" class="view active-view"><div class="section-title"><h2 id="paletteRankingTitle">UFC All-Time P4P</h2><p id="paletteRankingSubtitle">Main leaderboard for UFC all-time rankings.</p></div><div id="menList" class="leaderboard"><article class="row fighter-row"><div class="rank">#1</div><div class="row-photo">JJ</div><div class="row-main"><div class="name">Jon Jones</div><div class="meta">22–1, 1 NC · Light Heavyweight</div><div class="resume-tag">The standard everyone chases</div><a class="watch-moment-link" role="button" href="#">Watch Moment</a></div><div class="score">99<span class="meta">OVR</span></div></article></div></section>
  <section id="categories"><div class="category-leader-shell"><div class="category-pill-grid"><button class="category-leader-pill active">Championship Resume</button><button class="category-leader-pill">Prime Dominance</button></div><div class="category-sex-toggle"><button class="active">Men</button><button>Women</button></div><div class="category-leader-summary"><strong>Championship Resume · Men</strong><br>UFC title-level accomplishment.</div><div id="categoryBoardList"><article class="row fighter-row"><div class="rank">#1</div><div class="name">Jon Jones</div></article></div></div></section>
  <section id="division"><div class="division-leader-shell"><div class="division-leader-controls"><button class="division-leader-pill active">Heavyweight</button><button class="division-leader-pill">Light Heavyweight</button></div><div class="division-leader-summary"><strong>Heavyweight · Men</strong><br>9 fighters qualified.</div><div id="divisionList"><article class="row fighter-row"><div class="rank">#1</div><div class="name">Stipe Miocic</div></article></div></div></section>

  <section id="play"><article class="play-daily-card"><div class="play-daily-kicker"><span>Today's Challenge</span><time>Wed, Jul 22</time></div><button class="play-daily-button">Play Now</button></article><section id="playDailyLeaderboard"><div class="daily-board-row you"><b>#1</b><strong>Cody</strong><span>9/10</span><small>Best 10/10</small></div></section><article class="play-streak-card"><span>DAILY STREAK</span><strong>7 DAYS</strong><small>Best: 7 days</small></article><button class="play-daily-dot active"></button></section>

  <section id="picks" class="view active-view"><div class="section-title"><h2 id="picksTitle">UFC Picks</h2><p id="picksSubtitle">Pick every fight and compete across the season.</p></div><div class="picks-shell">
    <label class="picks-event-picker">Event<select><option>UFC Abu Dhabi</option></select></label><div class="picks-room-banner"><strong>UFC Picks</strong><span class="picks-room-live">LIVE</span></div><div class="picks-progress-card"><div class="picks-progress-bar"><i style="width:75%"></i></div></div>
    <article class="pick-fight"><button class="pick-fighter selected"><span class="pick-fighter-name">Fighter A</span><span class="pick-fighter-odds">-180 <b>FAV</b></span></button><button class="pick-underdog-action">Underdog Lock</button><span class="pick-lock has-pick">Your pick saved</span></article>
    <div class="card picks-standings-card"><div class="picks-standing-row"><strong>Cody</strong><span class="meta">9/12 correct</span><div class="picks-standing-score"><strong>22</strong><small>PTS</small></div></div></div>
    <details class="picks-group-card" open><summary><div><span>SEASON 2026</span><strong>Season Leaderboard</strong></div><b>6 PLAYERS</b></summary><div class="picks-group-content"><div class="picks-group-member leader"><span>T-1</span><div><strong>Cody <em>YOU</em></strong><small>9/12 correct · 75%</small></div><b>22<small>PTS</small></b></div><div class="picks-group-event active"><div><span>JUL 18</span><strong>UFC Oklahoma City</strong><small>Past event</small></div><button>Open recap</button></div></div></details>
    <details id="picksHistoryCard" open><summary><div><span>YOUR ARCHIVE</span><strong>Past Events</strong></div><b>2 SAVED</b></summary><div class="picks-history-list"><div class="picks-history-row current"><div class="picks-history-main"><span>JUL 18</span><strong>UFC Oklahoma City</strong><small>Du Plessis vs. Usman</small></div><button>Open recap</button></div></div></details>
    <details class="picks-pin-card" open><summary><div><span>PROFILE ACCESS</span><strong>Member PIN</strong></div><b>READY</b></summary><div class="picks-pin-content"><div class="picks-pin-profile-state ready"><span>PIN READY</span><strong>You can sign in on another device</strong><small>Your profile is portable.</small></div><div class="picks-pin-fields"><label>New 4-digit PIN<input value="••••"></label><label>Confirm PIN<input value="••••"></label></div><button class="picks-pin-primary">Change PIN</button></div></details>
    <section class="picks-profile-clean"><header class="picks-profile-clean-heading"><div><span>GROUP CONTROL</span><strong>Group & Season</strong></div></header><details class="commissioner-clean-section" open><summary><div><span>GROUP CONTROL</span><strong>Season Settings</strong></div><b>Season 2026</b></summary><div class="commissioner-section"><div class="picks-group-owner"><div><span>GROUP SETTINGS</span><strong>UFC Picks</strong><small>Manage the season.</small></div><select><option>UFC Picks</option></select><button>Rename Group</button></div></div></details></section>
  </div></section>

  <div id="communityProfilesMount"><details class="community-directory"><summary class="community-directory-summary"><div><span>OCTAGON HQ COMMUNITY</span><strong>Member Profiles</strong></div><div class="community-directory-summary-meta"><b>6 PROFILES</b><i>⌄</i></div></summary></details></div>

  <section class="profile-activity-overlay"><div class="profile-activity-panel"><header class="profile-activity-head"><div class="profile-activity-title"><span>ACTIVITY PROFILE · GOAT26</span><strong>Cody</strong><small>Your games, Picks, achievements, and War Room activity.</small></div><div class="profile-activity-head-actions"><button class="profile-activity-edit">Edit Profile</button><button class="profile-activity-close">×</button></div></header><div class="profile-activity-body"><div class="profile-activity-summary"><div class="profile-activity-stat"><span>CURRENT STREAK</span><strong>7</strong><small>Find the Leader days</small></div></div><div class="profile-activity-grid"><article class="profile-activity-card"><header class="profile-activity-card-head"><div><span>UFC PICKS</span><strong>Season Activity</strong></div><small>T-1</small></header><div class="profile-activity-metric"><span>POINTS</span><strong>22</strong><small>Total</small></div></article></div><div class="profile-activity-actions"><button>Play Games</button><button>Open Picks</button></div></div></div></section>

  <section id="whatChangedOverlay"><div id="whatChangedDialog"><header class="what-changed-head"><p class="what-changed-kicker">OCTAGON HQ UPDATES</p><h1>What Changed</h1><p>Verified ranking, fighter, game, Picks and product updates.</p><button id="whatChangedClose">×</button></header><div id="whatChangedFeed"><section class="what-changed-group"><h2>TODAY</h2><div><button class="what-changed-entry"><div class="what-changed-entry-top"><span class="what-changed-type">RANK CHANGED</span><span class="what-changed-date"><time>Jul 22</time><i class="what-changed-arrow">→</i></span></div><h3>Tyron Woodley moves to #35</h3><p>Tyron Woodley moved six spots.</p><div class="what-changed-verified"><span>#29 → #35</span></div><div class="what-changed-fighter"><div class="what-changed-avatar">TW</div><div><strong>Tyron Woodley</strong><small>#35 · 89 OVR</small></div></div></button></div></section></div></div></section>

  <section id="octagon"><div class="octagon-board"><header class="octagon-board-head"><span class="octagon-live live"><i></i>LIVE</span><button class="octagon-intelligence-button">Take to Intelligence</button><button class="octagon-manage-beta" data-octagon-manage-beta>Manage Access</button></header><article class="octagon-message"><span class="octagon-admin-label">ADMIN</span><p class="octagon-message-body">Read the <a href="#">shared verdict</a>.</p></article></div></section>
</main>
<nav class="native-bottom-nav"><button class="native-nav-button active"><span>Home</span></button><button class="native-nav-button"><span>Rankings</span></button></nav>
</body></html>`;

const dark=['rgb(0, 0, 0)','rgb(13, 13, 13)','rgb(23, 23, 23)','rgb(32, 32, 32)'];
const retired=[
  'rgb(248, 250, 252)','rgb(241, 245, 249)','rgb(255, 247, 237)','rgb(255, 255, 255)',
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
      const node=document.querySelector(selector);if(!node)return null;
      const style=getComputedStyle(node,pseudo||null);
      return{backgroundColor:style.backgroundColor,backgroundImage:style.backgroundImage,color:style.color,borderColor:style.borderColor,opacity:style.opacity,display:style.display};
    };
    const root=getComputedStyle(document.documentElement);
    return{
      tokens:{bg:root.getPropertyValue('--bg').trim(),panel:root.getPropertyValue('--panel').trim(),panel2:root.getPropertyValue('--panel2').trim(),panel3:root.getPropertyValue('--panel3').trim(),text:root.getPropertyValue('--text').trim(),muted:root.getPropertyValue('--muted').trim(),line:root.getPropertyValue('--line').trim(),accent:root.getPropertyValue('--accent').trim(),accent2:root.getPropertyValue('--accent2').trim(),amber:root.getPropertyValue('--accent-amber').trim(),amberSoft:root.getPropertyValue('--accent-amber-soft').trim(),success:root.getPropertyValue('--success').trim(),successSoft:root.getPropertyValue('--success-soft').trim(),link:root.getPropertyValue('--link').trim()},
      body:read('body'),shell:read('main.shell'),hero:read('.hero'),heroAfter:read('.hero','::after'),headerTitle:read('#paletteHeaderTitle'),headerControl:read('.native-ask-action'),
      toolbarInput:read('#search'),toolbarSelect:read('#eraFilter'),rankingTitle:read('#paletteRankingTitle'),rankingSubtitle:read('#paletteRankingSubtitle'),rankingRow:read('#menList .fighter-row'),rankingName:read('#menList .name'),rankingMeta:read('#menList .meta'),rankingScore:read('#menList .score'),rankingRank:read('#menList .rank'),resumeTag:read('#menList .resume-tag'),watch:read('#menList .watch-moment-link'),categoryPill:read('#categories .category-leader-pill:not(.active)'),categoryActive:read('#categories .category-leader-pill.active'),categorySummary:read('#categories .category-leader-summary'),divisionPill:read('#division .division-leader-pill:not(.active)'),divisionActive:read('#division .division-leader-pill.active'),divisionSummary:read('#division .division-leader-summary'),
      playCard:read('#play .play-daily-card'),playAction:read('#play .play-daily-button'),playBoard:read('#playDailyLeaderboard'),playBoardRow:read('#playDailyLeaderboard .daily-board-row'),playStreak:read('#play .play-streak-card'),playDot:read('#play .play-daily-dot.active'),
      picksTitle:read('#picksTitle'),picksSubtitle:read('#picksSubtitle'),picksPicker:read('#picks .picks-event-picker select'),picksRoom:read('#picks .picks-room-banner'),picksLive:read('#picks .picks-room-live'),picksFill:read('#picks .picks-progress-bar i'),selected:read('#picks .pick-fighter.selected'),odds:read('#picks .pick-fighter-odds'),favorite:read('#picks .pick-fighter-odds b'),underdog:read('#picks .pick-underdog-action'),yourPick:read('#picks .pick-lock.has-pick'),standingRow:read('#picks .picks-standing-row'),standingName:read('#picks .picks-standing-row strong'),standingMeta:read('#picks .picks-standing-row .meta'),standingPoints:read('#picks .picks-standing-score strong'),
      seasonCard:read('#picks .picks-group-card'),seasonContent:read('#picks .picks-group-content'),seasonRow:read('#picks .picks-group-member'),seasonName:read('#picks .picks-group-member strong'),seasonMeta:read('#picks .picks-group-member small'),seasonPoints:read('#picks .picks-group-member>b'),archiveCard:read('#picksHistoryCard'),archiveList:read('#picks .picks-history-list'),archiveRow:read('#picks .picks-history-row'),pinCard:read('#picks .picks-pin-card'),pinContent:read('#picks .picks-pin-content'),pinFields:read('#picks .picks-pin-fields'),pinInput:read('#picks .picks-pin-fields input'),pinAction:read('#picks .picks-pin-primary'),pinReady:read('#picks .picks-pin-profile-state.ready'),pinReadyLabel:read('#picks .picks-pin-profile-state.ready>span'),settingsCard:read('#picks .picks-profile-clean'),settingsSection:read('#picks .commissioner-clean-section'),settingsOwner:read('#picks .picks-group-owner'),settingsAction:read('#picks .picks-group-owner button'),
      community:read('#communityProfilesMount .community-directory'),communityArrow:read('#communityProfilesMount .community-directory-summary-meta i'),
      activityPanel:read('.profile-activity-panel'),activityHead:read('.profile-activity-head'),activityStat:read('.profile-activity-stat'),activityCard:read('.profile-activity-card'),activityMetric:read('.profile-activity-metric'),activityEdit:read('.profile-activity-edit'),activitySecondary:read('.profile-activity-actions button:not(:first-child)'),
      changesDialog:read('#whatChangedDialog'),changesHead:read('.what-changed-head'),changesEntry:read('.what-changed-entry'),changesType:read('.what-changed-type'),changesArrow:read('.what-changed-arrow'),changesTitle:read('.what-changed-entry h3'),changesMeta:read('.what-changed-entry>p'),
      warHead:read('#octagon .octagon-board-head'),warMessage:read('#octagon .octagon-message'),warAction:read('#octagon .octagon-intelligence-button'),warManage:read('#octagon .octagon-manage-beta'),warLive:read('#octagon .octagon-live.live'),warAdmin:read('#octagon .octagon-admin-label'),warLink:read('#octagon .octagon-message-body a'),
      nav:read('.native-bottom-nav'),navActive:read('.native-nav-button.active'),navIndicator:read('.native-nav-button.active','::before'),navInactive:read('.native-nav-button:not(.active)')
    };
  });

  fs.writeFileSync(reportPath,JSON.stringify({proof:'semantic-production-palette-crevices',result},null,2));
  assert.deepEqual(result.tokens,{bg:'#000000',panel:'#0d0d0d',panel2:'#171717',panel3:'#202020',text:'#f5f5f5',muted:'#a3a3a3',line:'#2b2b2b',accent:'#e10600',accent2:'#ff5a5f',amber:'#f59e0b',amberSoft:'#fbbf24',success:'#22c55e',successSoft:'#86efac',link:'#8ab4f8'},'Final palette owner did not replace cached theme tokens.');
  assert.equal(result.body.backgroundColor,black,'Body is not true black.');
  assert.equal(result.shell.backgroundColor,black,'App canvas is not true black.');
  assert.equal(result.hero.backgroundColor,black,'Header is not true black.');
  assert.equal(result.heroAfter.display,'none','Header glow pseudo-element survived.');
  assert.equal(result.headerTitle.color,textColor,'Octagon HQ lost white contrast.');

  const darkSurfaces=['headerControl','toolbarInput','toolbarSelect','rankingRow','categoryPill','categorySummary','divisionPill','divisionSummary','playCard','playBoard','playBoardRow','playStreak','picksPicker','picksRoom','selected','standingRow','seasonCard','seasonContent','seasonRow','archiveCard','archiveList','archiveRow','pinCard','pinContent','pinFields','pinInput','settingsCard','settingsSection','settingsOwner','community','communityArrow','activityPanel','activityHead','activityStat','activityCard','activityMetric','activitySecondary','changesDialog','changesHead','changesEntry','warHead','warMessage','warManage','nav'];
  for(const key of darkSurfaces)assert.ok(isDark(result[key]),`${key} is not using a black/charcoal surface.`);

  assert.equal(result.rankingTitle.color,textColor,'Rankings title is not white.');
  assert.equal(result.rankingSubtitle.color,muted,'Rankings supporting copy is not gray.');
  assert.equal(result.rankingName.color,textColor,'Fighter name is not white.');
  assert.equal(result.rankingScore.color,textColor,'OVR is not white.');
  assert.equal(result.rankingMeta.color,muted,'Record/division is not gray.');
  assert.equal(result.rankingRank.color,redHighlight,'Top rank lost its red accent.');
  assert.equal(result.resumeTag.backgroundColor,panel,'Resume pill is not neutral charcoal.');
  assert.equal(result.resumeTag.color,muted,'Resume pill text is not neutral gray.');
  assert.equal(result.watch.backgroundColor,transparent,'Watch Moment is filled instead of outlined.');
  assert.equal(result.watch.borderColor,red,'Watch Moment is missing its red outline.');
  assert.equal(result.watch.color,textColor,'Watch Moment still uses pink text.');
  assert.equal(result.categoryActive.backgroundColor,red,'Selected category is not red.');
  assert.equal(result.divisionActive.backgroundColor,red,'Selected division is not red.');

  assert.equal(result.playAction.backgroundColor,red,'Primary Play action is not red.');
  assert.equal(result.playDot.backgroundColor,red,'Active Play indicator is not red.');

  assert.equal(result.picksTitle.color,textColor,'UFC Picks title is not white.');
  assert.equal(result.picksSubtitle.color,muted,'UFC Picks supporting copy is not gray.');
  assert.equal(result.picksLive.color,successSoft,'Live Picks status is not green.');
  assert.equal(result.picksFill.backgroundColor,red,'Picks progress is not red.');
  assert.equal(result.selected.borderColor,red,'Selected fighter is missing red outline.');
  assert.equal(result.odds.color,'rgb(184, 184, 184)','Odds are not neutral gray.');
  assert.equal(result.favorite.color,'rgb(255, 146, 150)','FAV badge lost muted-red treatment.');
  assert.equal(result.underdog.borderColor,amber,'Underdog Lock is not amber.');
  assert.equal(result.underdog.color,amberSoft,'Underdog Lock label is not amber.');
  assert.equal(result.yourPick.color,muted,'Your pick copy still uses orange.');
  assert.equal(result.standingName.color,textColor,'Standings name is not white.');
  assert.equal(result.standingMeta.color,muted,'Standings stats are not gray.');
  assert.equal(result.standingPoints.color,textColor,'Standings points are not white.');
  assert.equal(result.seasonName.color,textColor,'Season leaderboard name is not white.');
  assert.equal(result.seasonMeta.color,muted,'Season leaderboard stats are not gray.');
  assert.equal(result.seasonPoints.color,textColor,'Season leaderboard points are not white.');
  assert.equal(result.pinAction.backgroundColor,red,'Change PIN is not red.');
  assert.equal(result.pinReadyLabel.color,successSoft,'PIN ready state did not preserve green semantics.');
  assert.equal(result.settingsAction.backgroundColor,red,'Settings primary action is not red.');
  assert.equal(result.communityArrow.color,muted,'Member Profiles arrow still uses orange.');

  assert.equal(result.activityEdit.backgroundColor,red,'Edit Profile is not red.');
  assert.equal(result.changesTitle.color,textColor,'What Changed title is not white.');
  assert.equal(result.changesMeta.color,muted,'What Changed supporting copy is not gray.');
  assert.equal(result.changesArrow.color,redHighlight,'What Changed arrow is not red.');

  assert.equal(result.warAction.backgroundColor,red,'Take to Intelligence is not red.');
  assert.equal(result.warAction.color,'rgb(255, 255, 255)','Take to Intelligence text is not white.');
  assert.equal(result.warManage.borderColor,'rgb(43, 43, 43)','Manage Access is not gray outlined.');
  assert.equal(result.warLive.color,successSoft,'War Room Live is not green.');
  assert.equal(result.warAdmin.color,redHighlight,'Admin label is not red.');
  assert.equal(result.warLink.color,linkBlue,'War Room link is not blue.');

  assert.equal(result.nav.backgroundColor,black,'Bottom navigation is not black.');
  assert.equal(result.navActive.backgroundColor,transparent,'Active nav uses a filled tile.');
  assert.equal(result.navActive.color,redHighlight,'Active nav is not red.');
  assert.equal(result.navIndicator.backgroundColor,red,'Active nav indicator is not red.');
  assert.equal(result.navInactive.color,'rgb(143, 143, 143)','Inactive nav is not gray.');

  const surfaces=darkSurfaces.flatMap(key=>[`${key}.backgroundColor=${result[key]?.backgroundColor}`,`${key}.backgroundImage=${result[key]?.backgroundImage}`]);
  for(const color of retired)assert.ok(!surfaces.some(value=>value.includes(color)),`Retired production surface color survived: ${color}`);
}finally{
  await browser.close();
}

console.log('Semantic production palette crevice sweep passed.');
