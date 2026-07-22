import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

const index=fs.readFileSync('index.html','utf8');
const productPolish=fs.readFileSync('assets/js/product-polish.js','utf8').replace(/<\/script/gi,'<\\/script');
const styles=[...index.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)]
  .map(match=>`<link rel="stylesheet" href="/${match[1]}">`)
  .join('\n');

const legacyTokens='<style>:root{--bg:#f8fafc;--panel:#172033;--panel2:#1e293b;--text:#111827;--muted:#64748b;--line:#3b4352;--accent:#f97316;--accent2:#facc15}html,body{background:#f8fafc;color:#111827}</style>';
const lateLegacyRuntimeStyles=`<style>
  .hero{background:linear-gradient(90deg,#000 55%,#351708)!important;color:#111827}
  .hero::after{content:"";display:block;background:#f97316}
  .hero h1{font-size:78px!important}
  .toolbar #search,.toolbar #eraFilter,.toolbar #divisionFilter{background:#172033!important;border-color:#526786!important}
  #menList .fighter-row,#womenList .fighter-row,#divisionList .fighter-row,#categoryBoardList .fighter-row{background:#1e293b!important;border-color:#526786!important}
  #menList .rank,#womenList .rank,#divisionList .rank,#categoryBoardList .rank{color:#facc15!important}
  #menList .resume-tag,#womenList .resume-tag{background:#31372f!important;border:1px solid #8b7600!important;border-radius:999px!important;color:#fde68a!important;padding:5px 10px!important}
  #menList .watch-moment-link,#womenList .watch-moment-link{background:rgba(255,90,95,.14)!important;border-color:#ff7f87!important;color:#ffc1c5!important}
  #categories .category-leader-pill,#categories .category-sex-toggle button,#division .division-leader-pill{background:#111827!important;border-color:#3b4352!important;color:#f8fafc!important}
  #categories .category-leader-summary,#division .division-leader-summary{background:#0f172a!important;border-color:#8b7600!important;color:#fde68a!important}
  .era-context{background:radial-gradient(circle at 90% 0,rgba(249,115,22,.2),transparent 35%),linear-gradient(145deg,#1a273a,#0b1423)!important;border-color:#f97316!important}
  .era-context-kicker,.era-context-fight>span{color:#fb923c!important}
  .era-context-heading b{color:#facc15!important}
  .era-context-fight{background:#0b1220!important;border-color:#8b7600!important}
  .era-context-fight a{background:#facc15!important;border-color:#facc15!important;color:#111827!important}

  .find-retention-card{background:linear-gradient(145deg,#182438,#0d1523)!important;border-color:#33445f!important}
  .find-retention-metric,.find-retention-day,.find-retention-row{background:#0b1220!important;border-color:#30415b!important}
  .find-retention-card>summary span{color:#fb923c!important}
  .find-retention-day.perfect{background:rgba(249,115,22,.12)!important;border-color:#f97316!important;color:#fed7aa!important}
  .find-retention-row b{color:#fed7aa!important}

  #picks>.section-title h2,#picks>.section-title p{color:#0f172a!important}
  #picks .picks-home-group-header,#picks .picks-home-current,#picks .picks-home-leaderboard{background:#fff!important;border-color:#cbd5e1!important;color:#172033!important}
  #picks .picks-home-group-header{background:linear-gradient(135deg,#172033,#223755)!important}
  #picks .picks-home-share-slot button,#picks .picks-home-current-event button{background:#f97316!important;border-color:#f97316!important;color:#111827!important}
  #picks .picks-home-current-event{background:#fff7ed!important;border-color:#f97316!important}
  #picks .picks-season-summary{background:linear-gradient(135deg,#17243a,#101827)!important;border-color:#33445f!important}
  #picks .picks-season-summary-rank{background:rgba(249,115,22,.1)!important;border-color:#f97316!important}
  #picks .picks-season-summary-grid div{background:#0b1220!important;border-color:#30415b!important}
  #picks .picks-group-card,#picksHistoryCard,#picks .picks-pin-card,#picks .picks-profile-clean,#picks .picks-commissioner-clean,#picks .commissioner-clean-section,#picks .picks-upcoming-event-section{background:#172033!important;border-color:#526786!important}
  #picks .picks-group-content,#picks .picks-history-list,#picks .picks-pin-content,#picks .commissioner-clean-section>.commissioner-section{background:#f8fafc!important;color:#172033!important}
  #picks .picks-group-member,#picks .picks-group-event,#picks .picks-history-row,#picks .picks-pin-fields,#picks .picks-group-owner,#picks .picks-correction-gate{background:#fff7ed!important;border-color:#fdba74!important;color:#7c2d12!important}
  #picks .picks-pin-fields input,#picks .picks-group-owner select{background:#172033!important;border-color:#526786!important;color:#fff!important}
  #picks .picks-pin-primary,#picks .picks-history-row button,#picks .picks-group-event button,#picks .picks-group-owner button{background:#f97316!important;border-color:#f97316!important;color:#111827!important}
  #picks .picks-standing-row{background:#fff!important;border-color:#dbe3ef!important;color:#111827!important}
  #picks #picksAdminPanel.picks-final-corrections{background:#172033!important;border-color:#526786!important}
  #picks #picksAdminPanel.picks-final-corrections>summary{background:#223755!important}
  #picks #picksAdminPanel.picks-final-corrections>summary span{background:#fff7ed!important;border-color:#fdba74!important;color:#c2410c!important}
  #picks .picks-member-correction{background:#121a27!important;border-color:#334155!important}
  #picks .picks-member-correction-row{background:#17202e!important;border-color:#2c3749!important}
  #picks .picks-member-correction>summary>b{color:#fb923c!important}

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
  <section id="men" class="view active-view"><div class="section-title"><h2 id="paletteRankingTitle">UFC All-Time P4P</h2><p id="paletteRankingSubtitle">Main leaderboard for UFC all-time rankings.</p></div><div id="menList" class="leaderboard">
    <article class="row fighter-row"><div class="rank">#1</div><div class="row-main"><div class="name">Jon Jones</div><div class="meta">22–1, 1 NC · Light Heavyweight</div><div class="resume-tag">The standard everyone chases</div><a class="watch-moment-link" role="button" href="#">Watch Moment</a></div><div class="score">99<span class="meta">OVR</span></div></article>
    <article class="row fighter-row"><div class="rank">#2</div><div class="row-main"><div class="name">Georges St-Pierre</div><div class="resume-tag">No weakness left unanswered</div></div></article>
    <article class="row fighter-row"><div class="rank">#5</div><div class="row-main"><div class="name">Khabib Nurmagomedov</div><div class="resume-tag">Perfection under pressure</div></div></article>
    <article class="row fighter-row"><div class="rank">#48</div><div class="row-main"><div class="name">Vitor Belfort</div><div class="resume-tag">Fast hands before anyone was ready</div></div></article>
  </div></section>
  <section class="era-context"><div class="era-context-heading"><div><span class="era-context-kicker">UFC HISTORY FILTER</span><h3>Tournament Era <b>1993–1997</b></h3></div></div><div class="era-context-copy"><p>The UFC begins as a style-vs-style experiment.</p></div><div class="era-context-fight"><span>DEFINING FIGHT</span><h4>Royce Gracie vs. Gerard Gordeau</h4><a href="#">Watch Fight</a></div></section>
  <section id="categories"><button class="category-leader-pill active">Championship Resume</button><button class="category-leader-pill">Prime Dominance</button><div class="category-leader-summary"><strong>Championship Resume · Men</strong></div><div id="categoryBoardList"><article class="row fighter-row"><div class="rank">#1</div></article><article class="row fighter-row"><div class="rank">#2</div></article></div></section>
  <section id="division"><button class="division-leader-pill active">Heavyweight</button><button class="division-leader-pill">Light Heavyweight</button><div class="division-leader-summary"><strong>Heavyweight · Men</strong></div><div id="divisionList"><article class="row fighter-row"><div class="rank">#1</div></article><article class="row fighter-row"><div class="rank">#2</div></article></div></section>

  <section id="play"><article class="play-daily-card"><button class="play-daily-button">Play Now</button></article><section id="playDailyLeaderboard"><div class="daily-board-row you"><b>#1</b><strong>Cody</strong><span>9/10</span><small>Best 10/10</small></div></section><details class="find-retention-card" open><summary><div><span>DAILY HISTORY</span><strong>Find the Leader streak</strong></div><small>7-day current</small></summary><div class="find-retention-body"><div class="find-retention-metrics"><div class="find-retention-metric"><span>CURRENT</span><strong>7</strong><small>Consecutive days</small></div></div><div class="find-retention-calendar"><button class="find-retention-day complete"><b>22</b><span>9/10</span></button><button class="find-retention-day perfect"><b>19</b><span>10/10</span></button></div><div class="find-retention-recent"><button class="find-retention-row"><div><strong>Wed, Jul 22</strong><small>Official first attempt</small></div><b>9/10</b><em>#1 of 2</em></button></div></div></details><button class="play-daily-dot active"></button></section>

  <section id="picks" class="view active-view"><div class="section-title"><h2 id="picksTitle">UFC Picks</h2><p id="picksSubtitle">Pick every fight and compete across the season.</p></div><div class="picks-shell">
    <section class="picks-home-group-header"><div><span>SEASON 2026</span><h3>UFC Picks</h3><p>6 members · Cody & Shane lead</p></div><div class="picks-home-share-slot"><button>Share Group</button></div><small>Send the permanent group link.</small></section>
    <section class="picks-season-summary"><div class="picks-season-summary-head"><div><span>2026 PICKS SEASON</span><strong>Your season</strong><small>22 points · 2 event wins</small></div><div class="picks-season-summary-rank"><b>T-1</b><em>GOAT26 RANK</em></div></div><div class="picks-season-summary-grid"><div><span>SEASON RECORD</span><strong>9-3</strong><small>12 graded picks</small></div></div></section>
    <section class="picks-home-leaderboard"><div class="picks-home-section-head"><div><span>SEASON 2026</span><h3>Season Leaderboard</h3></div><b>6 PLAYERS</b></div><p>Current events use four points per correct pick.</p><div class="picks-group-member leader"><span>T-1</span><div><strong>Cody</strong><small>9/12 correct · 75%</small></div><b>22</b></div></section>
    <label class="picks-event-picker">Event<select><option>UFC Abu Dhabi</option></select></label><div class="picks-room-banner"><strong>UFC Picks</strong><span class="picks-room-live">LIVE</span></div><article class="pick-fight"><button class="pick-fighter selected"><span class="pick-fighter-name">Fighter A</span><span class="pick-fighter-odds">-180 <b>FAV</b></span></button><button class="pick-underdog-action">Underdog Lock</button><span class="pick-lock has-pick">Your pick saved</span></article>
    <div class="card picks-standings-card"><div class="picks-standing-row"><strong>Cody</strong><span class="meta">9/12 correct</span><div class="picks-standing-score"><strong>22</strong><small>PTS</small></div></div></div>
    <details id="picksHistoryCard" open><summary><div><span>YOUR ARCHIVE</span><strong>Past Events</strong></div><b>2 SAVED</b></summary><div class="picks-history-list"><div class="picks-history-row current"><div class="picks-history-main"><strong>UFC Oklahoma City</strong><small>Du Plessis vs. Usman</small></div><button>Open recap</button></div></div></details>
    <details class="picks-pin-card" open><summary><div><span>PROFILE ACCESS</span><strong>Member PIN</strong></div><b>READY</b></summary><div class="picks-pin-content"><div class="picks-pin-profile-state ready"><span>PIN READY</span><strong>Portable profile</strong></div><div class="picks-pin-fields"><label>New PIN<input value="••••"></label></div><button class="picks-pin-primary">Change PIN</button></div></details>
    <details id="picksAdminPanel" class="picks-admin-card picks-final-corrections" open><summary>Event Corrections <span>Commissioner</span></summary><div id="picksAdminContent"><section class="picks-member-corrections"><div class="picks-member-corrections-head"><div><span>COMMISSIONER</span><h4>Member Pick Corrections</h4><p>Edit a saved pick.</p></div><b>6 MEMBERS</b></div><div class="picks-member-correction-list"><details class="picks-member-correction"><summary><div><strong>Tyler</strong><small>0/0 correct · 0 pts</small></div><b>Edit picks</b></summary><div class="picks-member-correction-fights"><div class="picks-member-correction-row"><div><span>01</span><strong>Fighter A vs. Fighter B</strong><small>Awaiting result</small></div><select><option>No pick</option></select><label>Lock</label></div></div></details></div></section></div></details>
  </div></section>

  <section class="profile-activity-overlay"><div class="profile-activity-panel"><header class="profile-activity-head"><button class="profile-activity-edit">Edit Profile</button></header><div class="profile-activity-stat"><strong>7</strong></div></div></section>
  <section id="whatChangedOverlay"><div id="whatChangedDialog"><header class="what-changed-head"><h1>What Changed</h1></header><button class="what-changed-entry"><h3>Tyron Woodley moves</h3><p>Moved six spots.</p><i class="what-changed-arrow">→</i></button></div></section>
  <section id="octagon"><div class="octagon-board"><header class="octagon-board-head"><span class="octagon-live live"><i></i>LIVE</span><button class="octagon-intelligence-button">Take to Intelligence</button><button class="octagon-manage-beta">Manage Access</button></header><article class="octagon-message"><span class="octagon-admin-label">ADMIN</span><p class="octagon-message-body"><a href="#">shared verdict</a></p></article></div></section>
</main>
<nav class="native-bottom-nav"><button class="native-nav-button active"><span>Home</span></button><button class="native-nav-button"><span>Rankings</span></button></nav>
<script>${productPolish}</script></body></html>`;

const black='rgb(0, 0, 0)';
const panel='rgb(13, 13, 13)';
const panel2='rgb(23, 23, 23)';
const textColor='rgb(245, 245, 245)';
const muted='rgb(163, 163, 163)';
const lightGray='rgb(212, 212, 212)';
const red='rgb(225, 6, 0)';
const redHighlight='rgb(255, 90, 95)';
const amber='rgb(245, 158, 11)';
const amberSoft='rgb(251, 191, 36)';
const successSoft='rgb(134, 239, 172)';
const linkBlue='rgb(138, 180, 248)';
const transparent='rgba(0, 0, 0, 0)';
const darkColors=[black,panel,panel2,'rgb(32, 32, 32)'];
const retired=['rgb(248, 250, 252)','rgb(255, 247, 237)','rgb(255, 255, 255)','rgb(249, 115, 22)','rgb(251, 146, 60)','rgb(250, 204, 21)','rgb(23, 32, 51)','rgb(15, 23, 42)','rgb(30, 41, 59)','rgb(37, 50, 71)','rgb(51, 65, 85)','rgb(82, 103, 134)'];
const reportPath='/tmp/production-palette-sweep-report.json';
const isDark=value=>Boolean(value)&&(darkColors.includes(value.backgroundColor)||darkColors.some(color=>value.backgroundImage.includes(color)));

const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await page.route('**/production-palette-sweep-proof.html',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto('http://127.0.0.1:4173/production-palette-sweep-proof.html',{waitUntil:'networkidle',timeout:60000});
  await page.evaluate(()=>window.UFC_PRODUCT_POLISH?.apply?.());
  const result=await page.evaluate(()=>{
    const read=(selector,pseudo='')=>{
      const node=document.querySelector(selector);if(!node)return null;
      const style=getComputedStyle(node,pseudo||null);
      return{backgroundColor:style.backgroundColor,backgroundImage:style.backgroundImage,color:style.color,borderColor:style.borderColor,borderTopWidth:style.borderTopWidth,borderRadius:style.borderRadius,fontSize:style.fontSize,overflowX:style.overflowX,display:style.display};
    };
    const root=getComputedStyle(document.documentElement);
    return{
      tokens:{bg:root.getPropertyValue('--bg').trim(),panel:root.getPropertyValue('--panel').trim(),panel2:root.getPropertyValue('--panel2').trim(),panel3:root.getPropertyValue('--panel3').trim(),text:root.getPropertyValue('--text').trim(),muted:root.getPropertyValue('--muted').trim(),line:root.getPropertyValue('--line').trim(),accent:root.getPropertyValue('--accent').trim(),accent2:root.getPropertyValue('--accent2').trim(),amber:root.getPropertyValue('--accent-amber').trim(),amberSoft:root.getPropertyValue('--accent-amber-soft').trim(),success:root.getPropertyValue('--success').trim(),successSoft:root.getPropertyValue('--success-soft').trim(),link:root.getPropertyValue('--link').trim()},
      body:read('body'),shell:read('main.shell'),hero:read('.hero'),heroAfter:read('.hero','::after'),headerTitle:read('#paletteHeaderTitle'),headerControl:read('.native-ask-action'),
      toolbarInput:read('#search'),rankingTitle:read('#paletteRankingTitle'),rankingSubtitle:read('#paletteRankingSubtitle'),rankingRow:read('#menList .fighter-row'),rankingName:read('#menList .name'),rankingMeta:read('#menList .meta'),rankingScore:read('#menList .score'),rankFirst:read('#menList .fighter-row:nth-child(1) .rank'),rankSecond:read('#menList .fighter-row:nth-child(2) .rank'),rankFifth:read('#menList .fighter-row:nth-child(3) .rank'),rankField:read('#menList .fighter-row:nth-child(4) .rank'),resumeTag:read('#menList .resume-tag'),resumeRail:read('#menList .resume-tag','::before'),watch:read('#menList .watch-moment-link'),categoryFirst:read('#categoryBoardList .fighter-row:nth-child(1) .rank'),categorySecond:read('#categoryBoardList .fighter-row:nth-child(2) .rank'),
      eraCard:read('.era-context'),eraYear:read('.era-context-heading b'),eraFight:read('.era-context-fight'),eraAction:read('.era-context-fight a'),
      playCard:read('#play .play-daily-card'),playAction:read('#play .play-daily-button'),playBoard:read('#playDailyLeaderboard'),retentionCard:read('.find-retention-card'),retentionMetric:read('.find-retention-metric'),retentionComplete:read('.find-retention-day.complete'),retentionPerfect:read('.find-retention-day.perfect'),retentionScore:read('.find-retention-row b'),playDot:read('#play .play-daily-dot.active'),
      picksTitle:read('#picksTitle'),picksSubtitle:read('#picksSubtitle'),picksHomeHeader:read('.picks-home-group-header'),picksShare:read('.picks-home-share-slot button'),seasonSummary:read('.picks-season-summary'),seasonMetric:read('.picks-season-summary-grid div'),seasonRank:read('.picks-season-summary-rank'),homeLeaderboard:read('.picks-home-leaderboard'),homeLeader:read('.picks-home-leaderboard .picks-group-member'),picksPicker:read('#picks .picks-event-picker select'),picksRoom:read('#picks .picks-room-banner'),picksLive:read('#picks .picks-room-live'),selected:read('#picks .pick-fighter.selected'),odds:read('#picks .pick-fighter-odds'),favorite:read('#picks .pick-fighter-odds b'),underdog:read('#picks .pick-underdog-action'),yourPick:read('#picks .pick-lock.has-pick'),standingRow:read('#picks .picks-standing-row'),archiveCard:read('#picksHistoryCard'),pinCard:read('#picks .picks-pin-card'),pinAction:read('#picks .picks-pin-primary'),pinReadyLabel:read('#picks .picks-pin-profile-state.ready>span'),correctionPanel:read('#picksAdminPanel'),correctionSummary:read('#picksAdminPanel>summary'),commissionerBadge:read('#picksAdminPanel>summary span'),correctionMember:read('.picks-member-correction'),correctionRow:read('.picks-member-correction-row'),correctionEdit:read('.picks-member-correction>summary>b'),
      activityPanel:read('.profile-activity-panel'),activityEdit:read('.profile-activity-edit'),changesDialog:read('#whatChangedDialog'),changesEntry:read('.what-changed-entry'),changesArrow:read('.what-changed-arrow'),warHead:read('#octagon .octagon-board-head'),warMessage:read('#octagon .octagon-message'),warAction:read('#octagon .octagon-intelligence-button'),warManage:read('#octagon .octagon-manage-beta'),warLive:read('#octagon .octagon-live.live'),warAdmin:read('#octagon .octagon-admin-label'),warLink:read('#octagon .octagon-message-body a'),nav:read('.native-bottom-nav'),navActive:read('.native-nav-button.active'),navIndicator:read('.native-nav-button.active','::before'),navInactive:read('.native-nav-button:not(.active)'),
      cohesion:{htmlOverflow:getComputedStyle(document.documentElement).overflowX,bodyOverflow:getComputedStyle(document.body).overflowX,shellOverflow:getComputedStyle(document.querySelector('main.shell')).overflowX}
    };
  });

  fs.writeFileSync(reportPath,JSON.stringify({proof:'final-semantic-production-palette',result},null,2));
  assert.deepEqual(result.tokens,{bg:'#000000',panel:'#0d0d0d',panel2:'#171717',panel3:'#202020',text:'#f5f5f5',muted:'#a3a3a3',line:'#2b2b2b',accent:'#e10600',accent2:'#ff5a5f',amber:'#f59e0b',amberSoft:'#fbbf24',success:'#22c55e',successSoft:'#86efac',link:'#8ab4f8'});
  assert.equal(result.body.backgroundColor,black);
  assert.equal(result.shell.backgroundColor,black);
  assert.equal(result.hero.backgroundColor,black);
  assert.equal(result.heroAfter.display,'none');
  assert.equal(result.headerTitle.color,textColor);
  assert.ok(parseFloat(result.headerTitle.fontSize)<=44,`Mobile Octagon HQ is still oversized: ${result.headerTitle.fontSize}`);

  assert.equal(result.rankingTitle.color,textColor);
  assert.equal(result.rankingSubtitle.color,muted);
  assert.equal(result.rankingName.color,textColor);
  assert.equal(result.rankingMeta.color,muted);
  assert.equal(result.rankingScore.color,textColor);
  assert.equal(result.rankFirst.color,redHighlight);
  assert.equal(result.rankSecond.color,textColor);
  assert.equal(result.rankFifth.color,lightGray);
  assert.equal(result.rankField.color,muted);
  assert.equal(result.categoryFirst.color,redHighlight);
  assert.equal(result.categorySecond.color,textColor);
  assert.equal(result.resumeTag.backgroundColor,transparent);
  assert.equal(result.resumeTag.borderTopWidth,'0px');
  assert.equal(result.resumeTag.borderRadius,'0px');
  assert.equal(result.resumeTag.color,muted);
  assert.equal(result.resumeRail.backgroundColor,red);
  assert.equal(result.watch.backgroundColor,transparent);
  assert.equal(result.watch.borderColor,red);
  assert.equal(result.watch.color,textColor);

  assert.ok(isDark(result.eraCard));
  assert.ok(isDark(result.eraFight));
  assert.equal(result.eraYear.color,muted);
  assert.equal(result.eraAction.backgroundColor,red);
  assert.equal(result.eraAction.color,'rgb(255, 255, 255)');

  assert.ok(isDark(result.retentionCard));
  assert.ok(isDark(result.retentionMetric));
  assert.equal(result.retentionComplete.color,successSoft);
  assert.equal(result.retentionPerfect.borderColor,red);
  assert.equal(result.retentionPerfect.color,textColor);
  assert.equal(result.retentionScore.color,textColor);
  assert.equal(result.playAction.backgroundColor,red);
  assert.equal(result.playDot.backgroundColor,red);

  assert.equal(result.picksTitle.color,textColor);
  assert.equal(result.picksSubtitle.color,muted);
  assert.ok(isDark(result.picksHomeHeader));
  assert.ok(isDark(result.seasonSummary));
  assert.ok(isDark(result.seasonMetric));
  assert.ok(isDark(result.seasonRank));
  assert.ok(isDark(result.homeLeaderboard));
  assert.ok(isDark(result.homeLeader));
  assert.equal(result.picksShare.backgroundColor,red);
  assert.equal(result.seasonRank.borderColor,red);
  assert.equal(result.picksLive.color,successSoft);
  assert.equal(result.selected.borderColor,red);
  assert.equal(result.odds.color,'rgb(184, 184, 184)');
  assert.equal(result.favorite.color,'rgb(255, 146, 150)');
  assert.equal(result.underdog.borderColor,amber);
  assert.equal(result.underdog.color,amberSoft);
  assert.equal(result.yourPick.color,muted);
  assert.ok(isDark(result.standingRow));
  assert.ok(isDark(result.archiveCard));
  assert.ok(isDark(result.pinCard));
  assert.equal(result.pinAction.backgroundColor,red);
  assert.equal(result.pinReadyLabel.color,successSoft);

  assert.ok(isDark(result.correctionPanel));
  assert.ok(isDark(result.correctionSummary));
  assert.ok(isDark(result.commissionerBadge));
  assert.equal(result.commissionerBadge.borderColor,red);
  assert.equal(result.commissionerBadge.color,redHighlight);
  assert.ok(isDark(result.correctionMember));
  assert.ok(isDark(result.correctionRow));
  assert.equal(result.correctionEdit.color,redHighlight);

  assert.equal(result.activityEdit.backgroundColor,red);
  assert.equal(result.changesArrow.color,redHighlight);
  assert.equal(result.warAction.backgroundColor,red);
  assert.equal(result.warManage.borderColor,'rgb(43, 43, 43)');
  assert.equal(result.warLive.color,successSoft);
  assert.equal(result.warAdmin.color,redHighlight);
  assert.equal(result.warLink.color,linkBlue);
  assert.equal(result.nav.backgroundColor,black);
  assert.equal(result.navActive.backgroundColor,transparent);
  assert.equal(result.navActive.color,redHighlight);
  assert.equal(result.navIndicator.backgroundColor,red);
  assert.equal(result.navInactive.color,'rgb(143, 143, 143)');
  assert.equal(result.cohesion.htmlOverflow,'hidden');
  assert.equal(result.cohesion.bodyOverflow,'hidden');
  assert.equal(result.cohesion.shellOverflow,'clip');

  const surfaceKeys=['headerControl','toolbarInput','rankingRow','eraCard','eraFight','playCard','playBoard','retentionCard','retentionMetric','picksHomeHeader','seasonSummary','seasonMetric','seasonRank','homeLeaderboard','homeLeader','picksPicker','picksRoom','selected','standingRow','archiveCard','pinCard','correctionPanel','correctionSummary','commissionerBadge','correctionMember','correctionRow','activityPanel','changesDialog','changesEntry','warHead','warMessage','warManage','nav'];
  for(const key of surfaceKeys)assert.ok(isDark(result[key]),`${key} is not using a black/charcoal surface.`);
  const surfaces=surfaceKeys.flatMap(key=>[result[key]?.backgroundColor||'',result[key]?.backgroundImage||'']);
  for(const color of retired)assert.ok(!surfaces.some(value=>value.includes(color)),`Retired production surface color survived: ${color}`);
}finally{
  await browser.close();
}

console.log('Final semantic production palette sweep passed.');
