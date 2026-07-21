import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-picks-commissioner-active-contract.mjs');

const fixtureUrl='http://127.0.0.1:4173/phase-4-picks-commissioner-active-proof.html';
const reportPath='/tmp/picks-commissioner-active-owner-report.json';
const report={proof:'picks-commissioner-active-owner',phase:'launch',scenarios:{}};

function fixture({active=false,lateShell=false}={}){
  const picksClass=active?'view active-view':'view';
  const homeClass=active?'view':'view active-view';
  const shellMarkup=lateShell?'':'<div class="picks-shell"><div id="picksGroupCard"></div></div>';
  return `<!doctype html><html><head><meta charset="utf-8"><title>Commissioner active proof</title></head><body>
  <main><section id="home" class="${homeClass}"></section><section id="picks" class="${picksClass}">${shellMarkup}</section></main>
  <div id="picksToast"></div>
  <script>
  (function(){
    let destination=${JSON.stringify(active?'picks':'home')};
    const proof=window.__COMMISSIONER_ACTIVE_PROOF__={calls:[],interval:null,setDestination(value){destination=value;},activate(value){destination=value;document.getElementById('home').classList.toggle('active-view',value==='home');document.getElementById('picks').classList.toggle('active-view',value==='picks');window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:value}}));}};
    window.UFC_APP_SHELL={get currentDestination(){return destination;}};
    window.UFC_SUPABASE_CONFIG={url:'https://example.supabase.co',anonKey:'anon'};
    window.supabase={createClient(){return{rpc:async(name,args)=>{proof.calls.push({name,args});await new Promise(resolve=>setTimeout(resolve,20));return{data:{group:{name:'GOAT Room'},seasons:[{is_active:true,name:'Season 1',event_count:0,correct_points:1,underdog_bonus:1}],members:[{id:'owner',display_name:'Cody',is_active:true,is_owner:true}],events:[],pending_transfer:null},error:null};}};}};
    const realSetInterval=window.setInterval.bind(window);
    window.setInterval=(callback,delay)=>{proof.interval={callback,delay};return 1;};
    localStorage.setItem('ufc-picks:group:GOAT26','member-token');
    localStorage.setItem('ufc-picks:group-admin:GOAT26','admin-token');
  })();
  </script>
  <script src="/assets/js/picks-commissioner.js"></script>
  </body></html>`;
}

async function open(browser,options){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route(`${fixtureUrl}*`,route=>route.fulfill({status:200,contentType:'text/html',body:fixture(options)}));
  await page.goto(fixtureUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.__COMMISSIONER_ACTIVE_PROOF__?.interval,null,{timeout:10000});
  return{context,page};
}

async function count(page){return page.evaluate(()=>window.__COMMISSIONER_ACTIVE_PROOF__.calls.length);}

const browser=await chromium.launch({headless:true});
try{
  report.phase='home-startup';
  {
    const {context,page}=await open(browser,{active:false});
    await page.waitForTimeout(500);
    assert.equal(await count(page),0,'Home startup requested hidden commissioner state.');
    assert.equal(await page.locator('#picksCommissionerCard').count(),1,'The local commissioner card shell was not installed.');

    await page.evaluate(()=>{const node=document.createElement('span');document.querySelector('#picks .picks-shell').appendChild(node);node.remove();});
    await page.waitForTimeout(400);
    assert.equal(await count(page),0,'A hidden Picks mutation requested commissioner state.');

    await page.evaluate(()=>window.__COMMISSIONER_ACTIVE_PROOF__.interval.callback());
    await page.waitForTimeout(60);
    assert.equal(await count(page),0,'The freshness interval polled commissioner state while Picks was hidden.');

    await page.evaluate(()=>window.__COMMISSIONER_ACTIVE_PROOF__.activate('picks'));
    await page.waitForFunction(()=>window.__COMMISSIONER_ACTIVE_PROOF__.calls.length===1,null,{timeout:10000});
    await page.waitForFunction(()=>document.getElementById('picksCommissionerCard')?.hidden===false,null,{timeout:10000});
    assert.equal(await page.locator('#picksCommissionerSummary').textContent(),'Season 1 · 1 members');

    await page.evaluate(()=>{const node=document.createElement('span');document.querySelector('#picks .picks-shell').appendChild(node);node.remove();});
    await page.waitForTimeout(400);
    assert.equal(await count(page),1,'Ordinary active Picks mutations triggered a duplicate commissioner RPC.');

    await page.evaluate(()=>window.__COMMISSIONER_ACTIVE_PROOF__.interval.callback());
    await page.waitForFunction(()=>window.__COMMISSIONER_ACTIVE_PROOF__.calls.length===2,null,{timeout:10000});

    await page.evaluate(()=>window.__COMMISSIONER_ACTIVE_PROOF__.activate('home'));
    await page.evaluate(()=>window.__COMMISSIONER_ACTIVE_PROOF__.interval.callback());
    await page.waitForTimeout(60);
    assert.equal(await count(page),2,'The interval continued polling after Picks was hidden.');
    report.scenarios.homeToPicks={calls:await page.evaluate(()=>window.__COMMISSIONER_ACTIVE_PROOF__.calls.map(row=>row.name)),cardVisible:await page.locator('#picksCommissionerCard').isVisible()};
    await context.close();
  }

  report.phase='direct-picks-startup';
  {
    const {context,page}=await open(browser,{active:true});
    await page.waitForFunction(()=>window.__COMMISSIONER_ACTIVE_PROOF__.calls.length===1,null,{timeout:10000});
    report.scenarios.direct={calls:await count(page)};
    assert.equal(report.scenarios.direct.calls,1,'Direct Picks startup did not request commissioner state exactly once.');
    await context.close();
  }

  report.phase='late-picks-shell';
  {
    const {context,page}=await open(browser,{active:true,lateShell:true});
    await page.waitForTimeout(100);
    assert.equal(await count(page),0,'Missing Picks shell triggered a premature commissioner RPC.');
    await page.evaluate(()=>{const shell=document.createElement('div');shell.className='picks-shell';shell.innerHTML='<div id="picksGroupCard"></div>';document.getElementById('picks').appendChild(shell);});
    await page.waitForFunction(()=>window.__COMMISSIONER_ACTIVE_PROOF__.calls.length===1,null,{timeout:10000});
    assert.equal(await page.locator('#picksCommissionerCard').count(),1,'Late Picks shell did not receive the commissioner card.');
    report.scenarios.lateShell={calls:await count(page)};
    await context.close();
  }

  report.phase='complete';
  report.passed=true;
  console.log(JSON.stringify(report,null,2));
}catch(error){
  report.passed=false;
  report.error={name:error?.name||'Error',message:error?.message||String(error),stack:error?.stack||''};
  fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
  console.error(JSON.stringify(report,null,2));
  throw error;
}finally{await browser.close();}
