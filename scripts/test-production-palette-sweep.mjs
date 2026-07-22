import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

const index=fs.readFileSync('index.html','utf8');
const styles=[...index.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)]
  .map(match=>`<link rel="stylesheet" href="/${match[1]}">`)
  .join('\n');

const fixture=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${styles}</head><body>
<section id="play" class="view active-view">
  <div class="play-shell">
    <div class="play-mode-switch"><button class="active">Top 10</button><button>Blind</button></div>
    <div class="play-intro-card"><h3>Build Your Top 10</h3><p>Canonical palette proof.</p><div class="play-progress"><i style="width:70%"></i></div></div>
    <div class="play-list-card"><div class="play-rank-row"><span class="play-rank-number">1</span><div class="play-fighter-photo">JJ</div><div class="play-rank-copy"><strong>Jon Jones</strong><small>Heavyweight</small></div><div class="play-rank-actions"><button>↑</button></div></div></div>
    <button class="play-primary">Compare</button><button class="play-secondary">Clear</button>
    <div class="blind-comparison-card"><div class="blind-compare-head"><div class="blind-identity"><span>A</span></div><div class="blind-resume-label">Resume</div><div class="blind-identity"><span>B</span></div></div><div class="blind-pick-row"><button class="blind-pick-button blind-pick-a">A</button><button class="blind-pick-button blind-pick-b">B</button></div></div>
  </div>
</section>
<section id="picks" class="view active-view">
  <div class="picks-shell">
    <div class="picks-event-hero"><span class="picks-event-kicker">Next event</span><h3>UFC Fight Night</h3><div class="picks-event-matchup">Fighter A vs Fighter B</div><div class="picks-event-meta"><span class="picks-pill">Saturday</span></div></div>
    <div class="picks-room-card card"><div class="picks-mode-switch"><button class="active">Start</button><button>Join</button></div></div>
    <div class="picks-progress-card card"><div class="picks-progress-top"><strong>4 / 12</strong><span>picks</span></div><div class="picks-progress-bar"><i style="width:33%"></i></div><div class="picks-summary-chips"><span>Open</span></div></div>
    <div class="picks-tiered-scoring"><div class="picks-tiered-head"><span>LOCK</span><strong><b>+3</b> points</strong><small>Tiered scoring</small></div><div class="picks-tiered-levels"><span><b>+100</b><em>1</em></span></div></div>
    <article class="pick-fight"><header class="pick-fight-head"><div><span class="pick-fight-number">Fight 1</span><strong>Main card</strong></div><span>Open</span></header><div class="pick-matchup"><button class="pick-fighter selected"><span class="pick-selected-mark">✓</span><span class="pick-fighter-photo">A</span><span class="pick-fighter-name">Fighter A</span><span class="pick-fighter-odds"><b>EVEN</b></span></button><span class="pick-vs">VS</span><button class="pick-fighter"><span class="pick-fighter-photo">B</span><span class="pick-fighter-name">Fighter B</span></button></div><button class="pick-underdog-action">Underdog Lock</button></article>
    <details class="picks-room-more" open><summary>•••</summary><div class="picks-room-more-menu"><button id="picksSwitchRoom">Switch room</button></div></details>
  </div>
</section>
<section id="compare" class="intelligence-view"><details class="intelligence-matchup" open><div class="intelligence-matchup-body"><select><option>Jon Jones</option></select><button class="intelligence-secondary">Open Verdict</button></div></details></section>
</body></html>`;

const dark=['rgb(8, 8, 8)','rgb(17, 17, 17)','rgb(25, 25, 25)'];
const retired=['rgb(249, 115, 22)','rgb(251, 146, 60)','rgb(250, 204, 21)','rgb(17, 24, 39)','rgb(23, 32, 51)','rgb(15, 23, 42)','rgb(30, 41, 59)','rgb(37, 50, 71)','rgb(59, 67, 82)','rgb(248, 250, 252)','rgb(241, 245, 249)','rgb(238, 242, 247)'];
const canonicalRed='rgb(210, 10, 10)';
const canonicalRedHighlight='rgb(255, 77, 77)';
const white='rgb(255, 255, 255)';
const reportPath='/tmp/production-palette-sweep-report.json';

const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await page.route('**/production-palette-sweep-proof.html',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto('http://127.0.0.1:4173/production-palette-sweep-proof.html',{waitUntil:'networkidle',timeout:60000});

  const result=await page.evaluate(()=>{
    const read=selector=>{
      const node=document.querySelector(selector);
      if(!node)return null;
      const style=getComputedStyle(node);
      return{backgroundColor:style.backgroundColor,backgroundImage:style.backgroundImage,color:style.color,borderColor:style.borderColor};
    };
    return{
      playMode:read('#play .play-mode-switch'),
      playActive:read('#play .play-mode-switch button.active'),
      playIntro:read('#play .play-intro-card'),
      playRow:read('#play .play-rank-row'),
      playSecondary:read('#play .play-secondary'),
      blindB:read('#play .blind-pick-b'),
      picksHero:read('#picks .picks-event-hero'),
      picksRoom:read('#picks .picks-room-card'),
      picksMode:read('#picks .picks-mode-switch button.active'),
      picksProgress:read('#picks .picks-progress-card'),
      picksFill:read('#picks .picks-progress-bar i'),
      picksTier:read('#picks .picks-tiered-scoring'),
      fight:read('#picks .pick-fight'),
      fighter:read('#picks .pick-fighter:not(.selected)'),
      selected:read('#picks .pick-fighter.selected'),
      fightNumber:read('#picks .pick-fight-number'),
      more:read('#picks .picks-room-more>summary'),
      intelligenceSelect:read('#compare select'),
      intelligenceSecondary:read('#compare .intelligence-secondary')
    };
  });

  const report={proof:'production-palette-sweep',result};
  fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));

  const text=JSON.stringify(result);
  for(const color of retired)assert.ok(!text.includes(color),`Retired production color survived the final owner: ${color}`);
  for(const key of ['playMode','playRow','playSecondary','picksRoom','picksProgress','picksTier','fight','more']){
    const value=result[key];
    assert.ok(value,`${key} palette sample is missing.`);
    assert.ok(dark.includes(value.backgroundColor)||dark.some(color=>value.backgroundImage.includes(color)),`${key} is not using a canonical dark surface.`);
  }
  assert.equal(result.playActive.borderColor,canonicalRed,'Play active control is not owned by canonical UFC red.');
  assert.equal(result.playActive.color,white,'Play active control lost white contrast text.');
  assert.equal(result.blindB.borderColor,canonicalRed,'Blind Resume choice B retained a yellow/orange action.');
  assert.equal(result.blindB.color,white,'Blind Resume choice B lost white contrast text.');
  assert.equal(result.picksMode.backgroundColor,canonicalRed,'Picks mode selection is not UFC red.');
  assert.equal(result.picksMode.color,white,'Picks mode selection lost white contrast text.');
  assert.equal(result.picksFill.backgroundColor,canonicalRed,'Picks progress fill is not UFC red.');
  assert.equal(result.fightNumber.color,canonicalRedHighlight,'Fight number is not using the canonical red highlight.');
  assert.equal(result.selected.borderColor,canonicalRed,'Selected fighter is not owned by canonical UFC red.');
  assert.ok(dark.includes(result.fighter.backgroundColor)||dark.some(color=>result.fighter.backgroundImage.includes(color)),'Unselected fighter is not using a canonical dark surface.');
  assert.ok(dark.some(color=>result.intelligenceSelect.backgroundImage.includes(color))||dark.includes(result.intelligenceSelect.backgroundColor),'Intelligence select retained a navy surface.');
  assert.ok(dark.some(color=>result.intelligenceSecondary.backgroundImage.includes(color))||dark.includes(result.intelligenceSecondary.backgroundColor),'Intelligence secondary action retained a navy surface.');
}finally{
  await browser.close();
}

console.log('Production palette sweep passed.');
