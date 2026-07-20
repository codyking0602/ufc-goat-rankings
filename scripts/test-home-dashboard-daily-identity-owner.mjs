import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN='http://127.0.0.1:4173';
const REPORT='/tmp/home-dashboard-daily-identity-owner-report.json';
const report={passed:false,stage:'boot',uncached:null,cachedConcurrent:null,error:null};
let browser;

const identity={
  ok:true,
  group:{code:'GOAT26'},
  groupCode:'GOAT26',
  member:{id:'m1',display_name:'Cody'},
  memberToken:'home-daily-token'
};

function harness(cached=false){
  return `<!doctype html><html><head><meta charset="utf-8"><title>Home daily identity ownership</title></head><body>
    <nav><button data-destination="war-room" disabled></button></nav>
    <main class="shell"><section id="home" class="view active-view"><div id="homeDashboardMount"></div></section></main>
    <script>
      window.RANKING_DATA={fighters:[],men:[],women:[]};
      window.DISPLAY_OVERRIDES={};
      window.UFC_PICKS_EVENTS=[];
      window.UFC_PLAY_HUB={dailyChallenge:{challengeDay:'2026-07-20',challengeKey:'find-leader:2026-07-20'}};
      window.__HOME_DAILY_IDENTITY__=${JSON.stringify(identity)};
      window.__HOME_DAILY_PROOF__={resolverCalls:0,contextCalls:0,leaderboardCalls:0};
      const proof=window.__HOME_DAILY_PROOF__;
      const identity=window.__HOME_DAILY_IDENTITY__;
      window.UFC_PLAY_PROFILE={identity:${cached?'identity':'null'}};
      window.UFC_APP_PROFILE={identity:null};
      window.UFC_PLAY_SHARED={
        async resolveIdentity(){proof.resolverCalls+=1;return identity;},
        async dailyContext(){proof.contextCalls+=1;await new Promise(resolve=>setTimeout(resolve,180));return{challenge_day:'2026-07-20'};},
        client:{async rpc(name){if(name==='play_daily_leaderboard'){proof.leaderboardCalls+=1;await new Promise(resolve=>setTimeout(resolve,180));return{data:{ok:true,rows:[{display_name:'Cody',official_score:7,max_score:10,completed_at:'2026-07-20T12:00:00Z'}]},error:null};}return{data:{ok:true},error:null};}}
      };
    </script>
    <script src="/assets/js/home-dashboard.js"></script>
  </body></html>`;
}

async function openCase(name,cached=false){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const page=await context.newPage();
  const path=`/home-daily-identity-${name}.html`;
  await page.route(`${ORIGIN}${path}`,route=>route.fulfill({status:200,contentType:'text/html',body:harness(cached)}));
  await page.goto(`${ORIGIN}${path}`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_HOME_DASHBOARD&&window.__HOME_DAILY_PROOF__,null,{timeout:30000});
  return{context,page};
}

try{
  browser=await chromium.launch({headless:true});

  report.stage='uncached-startup';
  {
    const{context,page}=await openCase('uncached',false);
    await page.waitForTimeout(320);
    report.uncached={beforeReady:await page.evaluate(()=>({...window.__HOME_DAILY_PROOF__,saved:localStorage.getItem('ufc-play:daily-completion:find-leader:2026-07-20')||''}))};
    assert.deepEqual(report.uncached.beforeReady,{resolverCalls:0,contextCalls:0,leaderboardCalls:0,saved:''},'Uncached passive Home startup must wait for canonical readiness without resolving identity or starting daily RPCs.');

    await page.evaluate(()=>{
      window.UFC_PLAY_PROFILE.identity=window.__HOME_DAILY_IDENTITY__;
      window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__HOME_DAILY_IDENTITY__}));
    });
    await page.waitForFunction(()=>Boolean(localStorage.getItem('ufc-play:daily-completion:find-leader:2026-07-20')),null,{timeout:30000});
    await page.waitForTimeout(80);
    report.uncached.afterReady=await page.evaluate(()=>({
      ...window.__HOME_DAILY_PROOF__,
      saved:JSON.parse(localStorage.getItem('ufc-play:daily-completion:find-leader:2026-07-20')),
      mounts:document.querySelectorAll('#homeDashboardMount .home-dashboard').length,
      text:document.getElementById('homeDashboardMount')?.textContent||''
    }));
    assert.equal(report.uncached.afterReady.resolverCalls,0,'Readiness-driven Home sync must consume the canonical cache without calling the shared resolver.');
    assert.equal(report.uncached.afterReady.contextCalls,1,'One readiness event must produce one daily context request.');
    assert.equal(report.uncached.afterReady.leaderboardCalls,1,'One readiness event must produce one leaderboard request.');
    assert.equal(report.uncached.afterReady.saved.score,7);
    assert.equal(report.uncached.afterReady.mounts,1,'Home must retain one dashboard renderer.');
    assert.match(report.uncached.afterReady.text,/COMPLETED · 7\/10/);
    await context.close();
  }

  report.stage='cached-concurrent';
  {
    const{context,page}=await openCase('cached',true);
    await page.evaluate(()=>{
      window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'home'}}));
      void window.UFC_HOME_DASHBOARD.syncOfficialDaily();
      void window.UFC_HOME_DASHBOARD.syncOfficialDaily();
    });
    await page.waitForFunction(()=>Boolean(localStorage.getItem('ufc-play:daily-completion:find-leader:2026-07-20')),null,{timeout:30000});
    await page.waitForTimeout(250);
    report.cachedConcurrent=await page.evaluate(()=>({
      ...window.__HOME_DAILY_PROOF__,
      mounts:document.querySelectorAll('#homeDashboardMount .home-dashboard').length,
      signInSurfaces:document.querySelectorAll('[role="dialog"],.app-profile-overlay,.picks-pin-signin').length
    }));
    assert.equal(report.cachedConcurrent.resolverCalls,0,'Cached Home startup must not call the shared identity resolver.');
    assert.equal(report.cachedConcurrent.contextCalls,1,'Cached startup, Home re-entry, and concurrent direct refreshes must share the existing in-flight daily sync.');
    assert.equal(report.cachedConcurrent.leaderboardCalls,1,'Competing cached Home paths must produce one leaderboard request.');
    assert.equal(report.cachedConcurrent.mounts,1);
    assert.equal(report.cachedConcurrent.signInSurfaces,0,'Passive Home daily sync must not open a sign-in or profile surface.');
    await context.close();
  }

  report.passed=true;
  report.stage='complete';
  console.log('Home dashboard daily identity ownership proof passed.');
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}
