import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-native-shell-stability-drawer-contract.mjs');

const fixtureUrl='http://127.0.0.1:4173/phase-3-drawer-owner-proof.html#rankings';
const reportPath='/tmp/native-shell-stability-drawer-owner-report.json';
const report={proof:'native-shell-stability-drawer-owner',phase:'launch',snapshots:{}};
const visible={ufcRecord:'22-1 (1 NC)',titleFightWins:16,topFiveWins:11,primeRecord:'18-0',finishRatePct:68.2,roundsWonPct:72.5,activeEliteYears:12.3,longestUfcWinStreak:3};
const fixture=`<!doctype html><html><head><meta charset="utf-8"><title>Phase 3 drawer ownership</title></head><body>
<nav><button id="nativeHome" type="button" data-native-destination="home">Home</button></nav>
<input id="search"><select id="divisionFilter"><option value="All">All</option></select><button id="resetBtn"></button>
<span id="fighterCount"></span><select id="fighterA"></select><select id="fighterB"></select><select id="categoryBoardSelect"></select>
<div id="menList"></div><div id="womenList"></div><div id="menStats"></div><div id="womenStats"></div><div id="divisionList"></div><div id="compareResult"></div><div id="rulesContent"></div>
<aside id="drawer" aria-hidden="true"><div class="drawer-panel"><button id="closeDrawer" type="button">Close</button><div id="fighterDetail"></div></div></aside>
<script>window.RANKING_DATA={men:[{fighter:'Jon Jones',rank:1,overallOvr:99,primaryDivision:'Light Heavyweight',ufcRecord:'22-1 (1 NC)',visibleStats:${JSON.stringify(visible)}}],women:[],fighters:[{fighter:'Jon Jones',gender:'Men',rank:1,totalScore:100,overallOvr:99,primaryDivision:'Light Heavyweight',ufcRecord:'22-1 (1 NC)',visibleStats:${JSON.stringify(visible)}}],divisions:[],divisionStrength:[],primeRecords:{'Jon Jones':{record:'18-0'}},categoryBoards:{}};window.DISPLAY_OVERRIDES={};</script>
<script src="/assets/js/app.js"></script><script>window.__BASE_OPEN_FIGHTER__=window.openFighter;</script><script src="/assets/js/calculated-profile-runtime.js"></script><script src="/assets/js/native-app-shell-stability.js"></script>
</body></html>`;

async function snapshot(page){return page.evaluate(()=>({drawerOpen:document.getElementById('drawer')?.classList.contains('open')||false,drawerAria:document.getElementById('drawer')?.getAttribute('aria-hidden')||'',bodyOpen:document.body.classList.contains('fighter-profile-open'),profiles:document.querySelectorAll('#fighterDetail .profile-hero').length,stabilityVersion:window.UFC_NATIVE_APP_SHELL_STABILITY?.version||'',hasSchedule:typeof window.UFC_NATIVE_APP_SHELL_STABILITY?.schedule==='function'}));}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route('**/phase-3-drawer-owner-proof.html*',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto(fixtureUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.__BASE_OPEN_FIGHTER__&&window.UFC_CALCULATED_PROFILE_RUNTIME&&window.UFC_NATIVE_APP_SHELL_STABILITY,null,{timeout:10000});

  report.phase='base-open-and-close';
  await page.evaluate(()=>window.__BASE_OPEN_FIGHTER__('Jon Jones'));
  let state=await snapshot(page);report.snapshots.baseOpen=state;
  assert.equal(state.drawerOpen,true);assert.equal(state.drawerAria,'false');assert.equal(state.bodyOpen,true,'Base profile owner did not set the body lock.');
  await page.click('#closeDrawer');
  state=await snapshot(page);report.snapshots.baseClose=state;
  assert.equal(state.drawerOpen,false);assert.equal(state.drawerAria,'true');assert.equal(state.bodyOpen,false,'Canonical close did not clear the body lock.');

  report.phase='calculated-open';
  await page.evaluate(()=>window.openFighter('Jon Jones'));
  state=await snapshot(page);report.snapshots.calculatedOpen=state;
  assert.equal(state.drawerOpen,true);assert.equal(state.bodyOpen,true,'Calculated profile owner did not set the body lock.');assert.equal(state.profiles,1);
  assert.match(state.stabilityVersion,/drawer-owner/);assert.equal(state.hasSchedule,false,'Retired drawer repair scheduler remains exported.');

  report.phase='retired-trigger-window';
  await page.evaluate(()=>{const noise=document.createElement('span');document.querySelector('.drawer-panel').appendChild(noise);noise.remove();window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'rankings'}}));window.dispatchEvent(new CustomEvent('octagon-hq:soft-refresh'));});
  await page.waitForTimeout(3900);
  state=await snapshot(page);report.snapshots.delayed=state;
  assert.equal(state.drawerOpen,true);assert.equal(state.bodyOpen,true);assert.equal(state.profiles,1);

  report.phase='retired-repair-boundary';
  await page.evaluate(()=>{document.body.classList.remove('fighter-profile-open');window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'rankings'}}));window.dispatchEvent(new CustomEvent('octagon-hq:soft-refresh'));});
  await page.waitForTimeout(250);
  state=await snapshot(page);report.snapshots.corrupted=state;
  assert.equal(state.drawerOpen,true);assert.equal(state.bodyOpen,false,'The stability layer still inferred body state from the drawer.');
  await page.evaluate(()=>window.openFighter('Jon Jones'));
  state=await snapshot(page);report.snapshots.reopened=state;
  assert.equal(state.bodyOpen,true,'Canonical reopen did not restore its body state.');

  report.phase='native-destination-dismissal';
  await page.click('#nativeHome');
  await page.waitForFunction(()=>!document.getElementById('drawer').classList.contains('open')&&!document.body.classList.contains('fighter-profile-open'),null,{timeout:10000});
  state=await snapshot(page);report.snapshots.nativeClose=state;
  assert.equal(state.drawerAria,'true');

  report.phase='missing-close-fallback';
  await page.evaluate(()=>{document.getElementById('closeDrawer').remove();const drawer=document.getElementById('drawer');drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');document.body.classList.add('fighter-profile-open');window.UFC_NATIVE_APP_SHELL_STABILITY.closeFighterProfile();});
  state=await snapshot(page);report.snapshots.fallback=state;
  assert.equal(state.drawerOpen,false);assert.equal(state.drawerAria,'true');assert.equal(state.bodyOpen,false);

  report.phase='complete';report.passed=true;console.log(JSON.stringify(report,null,2));await context.close();
}catch(error){report.passed=false;report.error={name:error?.name||'Error',message:error?.message||String(error),stack:error?.stack||''};fs.writeFileSync(reportPath,JSON.stringify(report,null,2));console.error(JSON.stringify(report,null,2));throw error;}finally{await browser.close();}
