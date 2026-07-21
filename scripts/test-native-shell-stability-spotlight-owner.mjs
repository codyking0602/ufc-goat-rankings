import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-native-shell-stability-spotlight-contract.mjs');

const fixtureUrl='http://127.0.0.1:4173/phase-3-native-spotlight-owner-proof.html#home';
const reportPath='/tmp/native-shell-stability-spotlight-owner-report.json';
const report={proof:'native-shell-stability-spotlight-owner',phase:'launch',snapshots:{}};

const fixture=`<!doctype html>
<html><head><meta charset="utf-8"><title>Phase 3 spotlight ownership</title></head>
<body>
  <nav class="tabs"><button type="button" data-destination="war-room" aria-disabled="true" disabled>War Room</button></nav>
  <main class="shell"><section id="home" class="view active-view"><div id="homeDashboardMount" aria-live="polite"></div></section></main>
  <aside id="drawer" aria-hidden="true"><button id="closeDrawer" type="button">Close</button><div id="fighterDetail"></div></aside>
  <div id="manualRefreshControl"><button id="whatsNewBtn" type="button"><span data-whats-new-label>NEW</span><span id="whatsNewUnread" hidden></span></button></div>
  <script>
  (function(){
    const counts={mountWrites:0,spotlightOuterWrites:0};
    const inner=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');
    const outer=Object.getOwnPropertyDescriptor(Element.prototype,'outerHTML');
    Object.defineProperty(Element.prototype,'innerHTML',{
      configurable:true,
      get(){return inner.get.call(this);},
      set(value){if(this.id==='homeDashboardMount')counts.mountWrites+=1;return inner.set.call(this,value);}
    });
    Object.defineProperty(Element.prototype,'outerHTML',{
      configurable:true,
      get(){return outer.get.call(this);},
      set(value){if(this.classList?.contains('home-spotlight-loading'))counts.spotlightOuterWrites+=1;return outer.set.call(this,value);}
    });
    window.__PHASE3_SPOTLIGHT_PROOF__={counts};
    window.RANKING_DATA={
      men:[{fighter:'Jon Jones',rank:1,overallOvr:99,primaryDivision:'Light Heavyweight',ufcRecord:'22-1 (1 NC)',visibleStats:{ufcRecord:'22-1 (1 NC)'}}],
      women:[],
      fighters:[{fighter:'Jon Jones',ufcRecord:'22-1 (1 NC)',visibleStats:{ufcRecord:'22-1 (1 NC)'}}]
    };
    window.DISPLAY_OVERRIDES={'Jon Jones':{oneLiner:'The UFC-only benchmark.'}};
    window.UFC_SCORING_PIPELINE={status:'loading'};
    window.UFC_PLAY_PROFILE={identity:null};
    window.UFC_APP_PROFILE={identity:null};
  })();
  </script>
  <script src="/assets/js/home-dashboard.js"></script>
  <script src="/assets/js/native-app-shell-stability.js"></script>
</body></html>`;

async function snapshot(page){
  return page.evaluate(()=>({
    counts:{...window.__PHASE3_SPOTLIGHT_PROOF__.counts},
    stabilityVersion:window.UFC_NATIVE_APP_SHELL_STABILITY?.version||'',
    spotlightCount:document.querySelectorAll('#home .home-spotlight').length,
    loadingCount:document.querySelectorAll('#home .home-spotlight-loading').length,
    fighter:document.querySelector('#home .home-spotlight h3')?.textContent||'',
    markup:document.querySelector('#homeDashboardMount')?.innerHTML||''
  }));
}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route('**/phase-3-native-spotlight-owner-proof.html*',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto(fixtureUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_HOME_DASHBOARD&&window.UFC_NATIVE_APP_SHELL_STABILITY,null,{timeout:10000});

  report.phase='cold-start';
  const cold=await snapshot(page);
  report.snapshots.cold=cold;
  assert.match(cold.stabilityVersion,/^native-app-shell-stability-/,'The Phase 3 stability runtime did not load.');
  assert.equal(cold.spotlightCount,1,'Cold startup must render one canonical spotlight card.');
  assert.equal(cold.loadingCount,1,'Cold startup must remain on the canonical owner’s loading placeholder until rankings are ready.');
  assert.equal(cold.counts.mountWrites,1,'Cold startup must have one canonical Home render.');
  assert.equal(cold.counts.spotlightOuterWrites,0,'The stability layer rewrote the spotlight during cold startup.');

  report.phase='home-mutation-and-retired-delay-window';
  await page.evaluate(()=>{
    const noise=document.createElement('div');
    noise.id='phase3-home-noise';
    document.getElementById('home').appendChild(noise);
    noise.remove();
  });
  await page.waitForTimeout(3900);
  const delayed=await snapshot(page);
  report.snapshots.delayed=delayed;
  assert.equal(delayed.loadingCount,1,'A Home mutation bypassed ranking readiness.');
  assert.equal(delayed.counts.mountWrites,1,'Unrelated Home activity caused a competing Home render.');
  assert.equal(delayed.counts.spotlightOuterWrites,0,'The retired Spotlight repair or delayed retry returned.');

  report.phase='canonical-readiness';
  await page.evaluate(()=>{
    window.UFC_SCORING_PIPELINE.status='ready';
    document.documentElement.setAttribute('data-scoring-pipeline','ready');
    window.dispatchEvent(new CustomEvent('ufc-scoring-pipeline-ready'));
    window.dispatchEvent(new CustomEvent('ufc-production-ranking-ready'));
  });
  await page.waitForFunction(()=>document.querySelector('#home .home-spotlight h3')?.textContent==='Jon Jones',null,{timeout:10000});
  await page.waitForTimeout(150);
  const ready=await snapshot(page);
  report.snapshots.ready=ready;
  assert.equal(ready.loadingCount,0,'Canonical ranking readiness did not replace the placeholder.');
  assert.equal(ready.fighter,'Jon Jones','Canonical Home owner rendered the wrong spotlight fighter.');
  assert.equal(ready.counts.mountWrites,2,'Ranking readiness must produce exactly one additional canonical Home render.');
  assert.equal(ready.counts.spotlightOuterWrites,0,'The stability layer competed with canonical readiness rendering.');

  report.phase='repeated-events-route-and-resume';
  await page.evaluate(()=>{
    for(let index=0;index<3;index+=1){
      window.dispatchEvent(new CustomEvent('ufc-scoring-pipeline-ready'));
      window.dispatchEvent(new CustomEvent('ufc-production-ranking-ready'));
      window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:{identity:index===2?{member:{display_name:'Cody'}}:null}}));
    }
    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'picks'}}));
    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'home'}}));
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(350);
  const stable=await snapshot(page);
  report.snapshots.stable=stable;
  assert.equal(stable.spotlightCount,1,'Repeated readiness, route, or resume events duplicated the spotlight card.');
  assert.equal(stable.fighter,'Jon Jones','Repeated events destabilized the canonical spotlight.');
  assert.equal(stable.counts.mountWrites,2,'Stable repeated events must not rewrite unchanged Home markup.');
  assert.equal(stable.counts.spotlightOuterWrites,0,'The stability layer still rewrote the spotlight.');

  await page.reload({waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_HOME_DASHBOARD&&window.UFC_NATIVE_APP_SHELL_STABILITY,null,{timeout:10000});
  const refresh=await snapshot(page);
  report.snapshots.refresh=refresh;
  assert.equal(refresh.loadingCount,1,'Refresh must restart at the canonical loading boundary when ranking readiness is delayed.');
  assert.equal(refresh.counts.mountWrites,1,'Refresh introduced duplicate cold-start Home renders.');
  assert.equal(refresh.counts.spotlightOuterWrites,0,'Refresh revived the retired spotlight repair.');

  report.phase='complete';
  report.passed=true;
  console.log(JSON.stringify(report,null,2));
  await context.close();
}catch(error){
  report.passed=false;
  report.error={name:error?.name||'Error',message:error?.message||String(error),stack:error?.stack||''};
  fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
  throw error;
}finally{
  await browser.close();
}
