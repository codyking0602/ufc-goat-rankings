import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const base='http://127.0.0.1:4173/index.html';
const reportPath='/tmp/profile-signin-stability-report.json';
const stub="window.supabase={createClient(){const c={select(){return c},eq(){return c},order(){return Promise.resolve({data:[],error:null})},limit(){return Promise.resolve({data:[],error:null})},single(){return Promise.resolve({data:null,error:null})}};return{rpc:async()=>({data:null,error:null}),from:()=>c,channel(){return{on(){return this},subscribe(){return this}}},removeChannel:async()=>{}}}};";
const report={proof:'fresh-launch-route-ownership',phase:'launch',snapshots:{}};

async function pageFor(context){
  const page=await context.newPage();
  await page.addInitScript(()=>{
    window.__freshLaunchRouteEvents=[];
    window.__freshLaunchRouteCalls=[];
    window.__freshLaunchHashChanges=[];
    window.__freshLaunchNavClicks=[];
    let shellApi;
    Object.defineProperty(window,'UFC_APP_SHELL',{
      configurable:true,
      get(){return shellApi;},
      set(value){
        shellApi=value;
        if(!value||value.__freshLaunchRouteProofWrapped)return;
        Object.defineProperty(value,'__freshLaunchRouteProofWrapped',{value:true});
        for(const method of ['activateDestination','activateView']){
          const original=value[method];
          if(typeof original!=='function')continue;
          value[method]=function(...args){
            window.__freshLaunchRouteCalls.push({method,args,current:value.currentDestination||'',stack:new Error().stack||''});
            return original.apply(value,args);
          };
        }
      }
    });
    window.addEventListener('octagon-hq:view-change',event=>window.__freshLaunchRouteEvents.push({destination:event.detail?.destination||'',view:event.detail?.view||''}));
    window.addEventListener('hashchange',()=>window.__freshLaunchHashChanges.push({url:location.href,stack:new Error().stack||''}));
    document.addEventListener('click',event=>{
      const node=event.target.closest?.('nav.tabs [data-destination],[data-rankings-subnav] [data-ranking-view]');
      if(node)window.__freshLaunchNavClicks.push({destination:node.dataset.destination||'',view:node.dataset.rankingView||'',trusted:event.isTrusted,stack:new Error().stack||''});
    },true);
  });
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'application/javascript',body:stub}));
  return page;
}

async function ready(page){
  await page.waitForFunction(()=>window.UFC_APP_SHELL&&window.UFC_FRESH_HOME_LAUNCH,null,{timeout:60000});
  await page.waitForTimeout(400);
}

const snap=page=>page.evaluate(()=>({
  url:location.href,
  destination:window.UFC_APP_SHELL.currentDestination,
  active:[...document.querySelectorAll('main.shell>.view.active-view')].map(node=>node.id),
  events:[...window.__freshLaunchRouteEvents],
  calls:[...window.__freshLaunchRouteCalls],
  hashChanges:[...window.__freshLaunchHashChanges],
  navClicks:[...window.__freshLaunchNavClicks],
  navigationType:window.UFC_FRESH_HOME_LAUNCH.navigationType
}));

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});

  report.phase='ordinary-home';
  const home=await pageFor(context);
  await home.goto(`${base}?freshLaunchRouteOwner=home`,{waitUntil:'domcontentloaded',timeout:60000});
  await ready(home);
  const homeStart=await snap(home);
  report.snapshots.homeStart=homeStart;
  assert.equal(homeStart.destination,'home');
  assert.deepEqual(homeStart.active,['home']);
  assert.deepEqual(homeStart.events,[{destination:'home',view:'home'}]);
  await home.evaluate(()=>window.UFC_FRESH_HOME_LAUNCH.activateHome('proof'));
  await home.waitForTimeout(100);
  report.snapshots.homeRepeat=await snap(home);
  assert.equal(report.snapshots.homeRepeat.events.length,1,'Already-active Home emitted a duplicate route event.');
  await home.evaluate(()=>window.UFC_FRESH_HOME_LAUNCH.activatePicks('proof'));
  await home.waitForTimeout(100);
  await home.evaluate(()=>window.UFC_FRESH_HOME_LAUNCH.activatePicks('proof-repeat'));
  await home.waitForTimeout(100);
  const direct=await snap(home);
  report.snapshots.direct=direct;
  assert.equal(direct.destination,'picks');
  assert.equal(direct.events.length,2,'Picks should receive one real handoff and no duplicate repeat.');
  await home.close();

  report.phase='browser-picks-reload';
  const reload=await pageFor(context);
  await reload.goto(`${base}?freshLaunchRouteOwner=reload#home`,{waitUntil:'domcontentloaded',timeout:60000});
  await ready(reload);
  await reload.evaluate(()=>history.replaceState(history.state,'',`${location.pathname}${location.search}#picks`));
  await reload.reload({waitUntil:'domcontentloaded',timeout:60000});
  await ready(reload);
  const picksReload=await snap(reload);
  report.snapshots.picksReload=picksReload;
  assert.equal(picksReload.navigationType,'reload');
  assert.equal(picksReload.destination,'picks');
  assert.deepEqual(picksReload.active,['picks']);
  assert.deepEqual(picksReload.events,[{destination:'picks',view:'picks'}]);
  await reload.close();

  report.phase='bare-picks-invite';
  const invite=await pageFor(context);
  await invite.goto(`${base}?group=GOAT26&freshLaunchRouteOwner=invite`,{waitUntil:'domcontentloaded',timeout:60000});
  await ready(invite);
  const bareInvite=await snap(invite);
  report.snapshots.bareInvite=bareInvite;
  assert.equal(bareInvite.destination,'picks');
  assert.deepEqual(bareInvite.active,['picks']);
  assert.deepEqual(bareInvite.events,[{destination:'home',view:'home'},{destination:'picks',view:'picks'}]);
  await invite.close();

  await context.close();
  report.phase='complete';
  report.passed=true;
  console.log(JSON.stringify(report,null,2));
}catch(error){
  report.passed=false;
  report.error={name:error?.name||'Error',message:error?.message||String(error),stack:error?.stack||''};
  fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
  throw error;
}finally{
  await browser.close();
}
