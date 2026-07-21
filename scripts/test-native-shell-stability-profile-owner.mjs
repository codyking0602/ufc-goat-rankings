import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-native-shell-stability-profile-contract.mjs');

const fixtureUrl='http://127.0.0.1:4173/phase-3-native-profile-owner-proof.html#rankings';
const reportPath='/tmp/native-shell-stability-profile-owner-report.json';
const report={proof:'native-shell-stability-profile-owner',phase:'launch',snapshots:{}};

const fixture=`<!doctype html>
<html><head><meta charset="utf-8"><title>Phase 3 profile ownership</title></head>
<body>
  <nav class="tabs"><button id="nativeHome" type="button" data-native-destination="home">Home</button></nav>
  <main class="shell"><section id="men" class="view active-view"></section></main>
  <aside id="drawer" aria-hidden="true"><div class="drawer-panel"><button id="closeDrawer" type="button">Close</button><div id="fighterDetail"></div></div></aside>
  <div id="manualRefreshControl"><button id="whatsNewBtn" type="button"><span data-whats-new-label>NEW</span><span id="whatsNewUnread" hidden></span></button></div>
  <script>
  (function(){
    const counts={detailWrites:0,snapshotTextWrites:0};
    const inner=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');
    const textContent=Object.getOwnPropertyDescriptor(Node.prototype,'textContent');
    Object.defineProperty(Element.prototype,'innerHTML',{
      configurable:true,
      get(){return inner.get.call(this);},
      set(value){if(this.id==='fighterDetail')counts.detailWrites+=1;return inner.set.call(this,value);}
    });
    Object.defineProperty(Node.prototype,'textContent',{
      configurable:true,
      get(){return textContent.get.call(this);},
      set(value){if(this.nodeType===1&&this.matches?.('.snapshot-item strong'))counts.snapshotTextWrites+=1;return textContent.set.call(this,value);}
    });
    window.__PHASE3_PROFILE_PROOF__={counts};
    window.snapshotGrid=items=>'<div class="snapshot-grid">'+items.map(([label,value])=>'<div class="snapshot-item"><strong>'+value+'</strong><small>'+label+'</small></div>').join('')+'</div>';
    window.categoryCards=()=>'<div class="category-card">Categories</div>';
    window.attachCategoryExplanations=()=>{};
    window.fighterInitials=()=> 'JJ';
    window.overallOvr=fighter=>fighter.overallOvr;
    window.RANKING_DATA={
      men:[{fighter:'Jon Jones',rank:1,overallOvr:99,primaryDivision:'Light Heavyweight',ufcRecord:'22-1 (1 NC)',visibleStats:{ufcRecord:'22-1 (1 NC)',titleFightWins:16,topFiveWins:11,primeRecord:'18-0',finishRatePct:68.2,roundsWonPct:72.5,activeEliteYears:12.3,longestUfcWinStreak:2}}],
      women:[],
      fighters:[{fighter:'Jon Jones',ufcRecord:'21-2',titleFightWins:14,topFiveWins:9,primeRecord:'16-1',finishRatePct:60,roundsWonPct:65,activeEliteYears:10,longestUfcWinStreak:1}]
    };
    window.DISPLAY_OVERRIDES={'Jon Jones':{oneLiner:'The UFC-only benchmark.'}};
    window.UFC_CANONICAL_FIGHTER_FACTS={get(){return{fights:[
      {scoringDisposition:'count-win'},{scoringDisposition:'count-win'},{scoringDisposition:'count-win'},
      {scoringDisposition:'count-loss'},{scoringDisposition:'count-win'}
    ]};}};
    document.getElementById('closeDrawer').addEventListener('click',()=>{
      const drawer=document.getElementById('drawer');
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden','true');
    });
  })();
  </script>
  <script src="/assets/js/calculated-profile-runtime.js"></script>
  <script src="/assets/js/native-app-shell-stability.js"></script>
</body></html>`;

async function snapshot(page){
  return page.evaluate(()=>({
    counts:{...window.__PHASE3_PROFILE_PROOF__.counts},
    profileVersion:window.UFC_CALCULATED_PROFILE_RUNTIME?.version||'',
    stabilityVersion:window.UFC_NATIVE_APP_SHELL_STABILITY?.version||'',
    drawerOpen:document.getElementById('drawer')?.classList.contains('open')||false,
    drawerAria:document.getElementById('drawer')?.getAttribute('aria-hidden')||'',
    bodyOpen:document.body.classList.contains('fighter-profile-open'),
    currentFighter:document.getElementById('drawer')?.dataset.currentFighter||'',
    snapshotCount:document.querySelectorAll('#fighterDetail .snapshot-grid').length,
    values:Object.fromEntries([...document.querySelectorAll('#fighterDetail .snapshot-item')].map(item=>[
      item.querySelector('small')?.textContent||'',
      item.querySelector('strong')?.textContent||''
    ]))
  }));
}

const expected={
  'UFC Record':'22-1 (1 NC)',
  'UFC Title-Fight Wins':'16',
  'Top-5 Wins':'11',
  'Prime UFC Record':'18-0',
  'Finish Rate':'68.2%',
  'Rounds Won':'72.5%',
  'Active Elite Years':'12.3',
  'Longest UFC Win Streak':'3'
};

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route('**/phase-3-native-profile-owner-proof.html*',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto(fixtureUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_CALCULATED_PROFILE_RUNTIME&&window.UFC_NATIVE_APP_SHELL_STABILITY,null,{timeout:10000});

  report.phase='canonical-open';
  await page.evaluate(()=>window.openFighter('Jon Jones'));
  await page.waitForFunction(()=>document.body.classList.contains('fighter-profile-open'),null,{timeout:10000});
  const opened=await snapshot(page);
  report.snapshots.opened=opened;
  assert.match(opened.profileVersion,/calculated-profile-runtime/,'The calculated profile owner did not load.');
  assert.match(opened.stabilityVersion,/profile-owner/,'The corrected Phase 3 stability runtime did not load.');
  assert.equal(opened.counts.detailWrites,1,'The canonical profile owner must write the profile exactly once when opened.');
  assert.equal(opened.counts.snapshotTextWrites,0,'The stability layer rewrote snapshot values during canonical open.');
  assert.equal(opened.snapshotCount,1,'Canonical open must render exactly one Resume Snapshot.');
  assert.deepEqual(opened.values,expected,'The canonical calculated snapshot rendered unexpected values.');
  assert.equal(opened.currentFighter,'','The retired stability repair still published hidden drawer fighter state.');

  report.phase='observer-route-and-delayed-window';
  await page.evaluate(()=>{
    const noise=document.createElement('span');
    noise.textContent='observer noise';
    document.querySelector('.snapshot-grid').appendChild(noise);
    noise.remove();
    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'rankings'}}));
    window.dispatchEvent(new CustomEvent('octagon-hq:soft-refresh'));
    window.UFC_NATIVE_APP_SHELL_STABILITY.schedule();
    window.UFC_NATIVE_APP_SHELL_STABILITY.schedule();
  });
  await page.waitForTimeout(3900);
  const delayed=await snapshot(page);
  report.snapshots.delayed=delayed;
  assert.equal(delayed.counts.detailWrites,1,'Delayed stability work caused a competing profile render.');
  assert.equal(delayed.counts.snapshotTextWrites,0,'Observer, route, or delayed stability work rewrote canonical snapshot values.');
  assert.deepEqual(delayed.values,expected,'Delayed stability work changed the canonical Resume Snapshot.');
  assert.equal(delayed.bodyOpen,true,'Drawer/body synchronization was lost while retiring the snapshot writer.');

  report.phase='corruption-boundary';
  await page.evaluate(()=>{
    const item=[...document.querySelectorAll('.snapshot-item')].find(node=>node.querySelector('small')?.textContent==='Top-5 Wins');
    item.querySelector('strong').firstChild.nodeValue='BROKEN';
    document.body.classList.remove('fighter-profile-open');
    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'rankings'}}));
    window.dispatchEvent(new CustomEvent('octagon-hq:soft-refresh'));
    window.UFC_NATIVE_APP_SHELL_STABILITY.schedule();
  });
  await page.waitForTimeout(250);
  const corrupted=await snapshot(page);
  report.snapshots.corrupted=corrupted;
  assert.equal(corrupted.values['Top-5 Wins'],'BROKEN','The stability layer still repairs canonical profile content.');
  assert.equal(corrupted.counts.snapshotTextWrites,0,'The retired snapshot writer still mutated a snapshot value.');
  assert.equal(corrupted.bodyOpen,true,'The retained drawer/body recovery did not restore presentation state.');

  report.phase='canonical-reopen';
  await page.evaluate(()=>window.openFighter('Jon Jones'));
  await page.waitForTimeout(150);
  const reopened=await snapshot(page);
  report.snapshots.reopened=reopened;
  assert.equal(reopened.counts.detailWrites,2,'Canonical reopen must own the replacement profile render.');
  assert.equal(reopened.counts.snapshotTextWrites,0,'Canonical reopen was followed by a second snapshot writer.');
  assert.deepEqual(reopened.values,expected,'Canonical reopen did not restore calculated Resume Snapshot values.');
  assert.equal(reopened.snapshotCount,1,'Canonical reopen duplicated the Resume Snapshot.');

  report.phase='native-destination-close';
  await page.click('#nativeHome');
  await page.waitForTimeout(100);
  const closed=await snapshot(page);
  report.snapshots.closed=closed;
  assert.equal(closed.drawerOpen,false,'Native destination navigation no longer closes the fighter profile.');
  assert.equal(closed.drawerAria,'true','Native destination navigation did not restore drawer accessibility state.');
  assert.equal(closed.bodyOpen,false,'Native destination navigation left the body in profile-open state.');

  report.phase='complete';
  report.passed=true;
  console.log(JSON.stringify(report,null,2));
  await context.close();
}catch(error){
  report.passed=false;
  report.error={name:error?.name||'Error',message:error?.message||String(error),stack:error?.stack||''};
  fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
  console.error(JSON.stringify(report,null,2));
  throw error;
}finally{
  await browser.close();
}
