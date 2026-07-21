import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN='http://127.0.0.1:4173';
const BASE=`${ORIGIN}/octagon-board-identity-owner-proof.html`;
const REPORT='/tmp/octagon-board-identity-owner-report.json';
const report={passed:false,stage:'static-contract',uncached:null,readiness:null,concurrent:null,explicitSignIn:null,post:null,error:null};
let browser;

const source=fs.readFileSync('assets/js/octagon-message-board.js','utf8');
assert.match(source,/function passiveIdentity\(\)[\s\S]*UFC_PLAY_PROFILE\?\.identity[\s\S]*UFC_APP_PROFILE\?\.identity/,'War Room must consume published identity caches.');
assert.doesNotMatch(source,/UFC_PLAY_PROFILE\?\.(?:resolve|resolveIdentity)\?\.\(/,'War Room passive work must not invoke the canonical identity owner.');
assert.doesNotMatch(source,/UFC_APP_PROFILE\?\.resolve\?\.\(/,'War Room must not invoke the profile editor resolver.');
assert.doesNotMatch(source,/TOKEN_KEY|localStorage\.getItem\(/,'War Room must not own or read canonical access storage.');

const identity={
  ok:true,
  group:{code:'GOAT26'},
  groupCode:'GOAT26',
  member:{id:'m1',display_name:'Cody',is_admin:true},
  memberToken:'octagon-owner-token',
  member_token:'octagon-owner-token'
};
const board={
  ok:true,
  board:{is_current:true,week_start:'2026-07-20',week_end:'2026-07-26'},
  messages:[],
  available_weeks:['2026-07-20']
};

const html=`<!doctype html><html><head><meta charset="utf-8"><title>War Room identity ownership</title></head><body>
  <button type="button" class="tab" data-octagon-beta-tab>War Room</button>
  <section id="octagon" class="active-view"></section>
  <script>
    window.__OCTAGON_IDENTITY__=${JSON.stringify(identity)};
    window.__OCTAGON_BOARD__=${JSON.stringify(board)};
    window.__OCTAGON_PROOF__={canonicalResolves:0,canonicalRequires:0,editorResolves:0,rpcs:[],channels:0};
    const proof=window.__OCTAGON_PROOF__;
    const identity=window.__OCTAGON_IDENTITY__;
    const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    const channel={
      on(){return this;},
      subscribe(callback){callback('SUBSCRIBED');return this;},
      async send(){return'ok';},
      async unsubscribe(){return'ok';}
    };
    const client={
      async rpc(name,args){
        proof.rpcs.push({name,args});
        if(name==='octagon_snapshot'){await sleep(180);return{data:structuredClone(window.__OCTAGON_BOARD__),error:null};}
        if(name==='octagon_post_message')return{data:{ok:true,message:{id:'new-message',parent_message_id:null}},error:null};
        if(name==='octagon_set_reaction')return{data:{ok:true,likes:1,dislikes:0,my_reaction:'like'},error:null};
        if(name==='octagon_delete_message')return{data:{ok:true},error:null};
        return{data:{ok:true},error:null};
      },
      channel(){proof.channels+=1;return channel;},
      async removeChannel(){return'ok';}
    };
    window.UFC_PLAY_PROFILE={
      identity:null,
      client,
      async resolve(){proof.canonicalResolves+=1;this.identity=identity;return identity;},
      async require(){proof.canonicalRequires+=1;this.identity=identity;return identity;}
    };
    window.UFC_APP_PROFILE={
      identity:null,
      async resolve(){proof.editorResolves+=1;throw new Error('War Room invoked the editor resolver.');}
    };
  </script>
  <script src="/assets/js/octagon-message-board.js"></script>
</body></html>`;

async function snapshot(page){
  return page.evaluate(()=>({
    ...window.__OCTAGON_PROOF__,
    storageReads:window.__OCTAGON_STORAGE_READS__,
    authCards:document.querySelectorAll('.octagon-auth-card').length,
    signInSurfaces:document.querySelectorAll('[role="dialog"],.app-profile-overlay,.play-profile-modal,.picks-pin-signin').length,
    boardReady:Boolean(window.UFC_OCTAGON_BOARD?.snapshot?.ok),
    boardText:document.querySelector('[data-octagon-feed]')?.textContent||''
  }));
}

async function openProofPage(context){
  const page=await context.newPage();
  await page.addInitScript(()=>{
    localStorage.setItem('ufc-picks:group:GOAT26','stale-octagon-token');
    const originalGet=Storage.prototype.getItem;
    window.__OCTAGON_STORAGE_READS__=[];
    Storage.prototype.getItem=function(key){
      const value=String(key);
      if(this===window.localStorage&&value==='ufc-picks:group:GOAT26'){
        window.__OCTAGON_STORAGE_READS__.push({key:value,stack:String(new Error().stack||'')});
      }
      return originalGet.call(this,key);
    };
  });
  await page.route(BASE,route=>route.fulfill({status:200,contentType:'text/html',body:html}));
  await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_OCTAGON_BOARD&&window.__OCTAGON_PROOF__,null,{timeout:10000});
  await page.waitForTimeout(260);
  return page;
}

try{
  report.stage='browser-launch';
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});

  const page=await openProofPage(context);

  report.stage='uncached-startup';
  report.uncached=await snapshot(page);
  assert.equal(report.uncached.canonicalResolves,0,'Uncached passive War Room startup must not invoke the canonical resolver.');
  assert.equal(report.uncached.canonicalRequires,0,'Passive War Room startup must not require sign-in.');
  assert.equal(report.uncached.editorResolves,0,'Passive War Room startup must not invoke the editor resolver.');
  assert.equal(report.uncached.rpcs.length,0,'Uncached War Room entry must wait for published identity before any board RPC.');
  assert.equal(report.uncached.storageReads.some(row=>/octagon-message-board\.js/i.test(row.stack)),false,'War Room must not read the canonical GOAT26 token from storage.');
  assert.equal(report.uncached.authCards,1,'Uncached War Room entry must preserve one explicit reconnect card.');
  assert.equal(report.uncached.signInSurfaces,0,'Passive War Room startup must not create a sign-in modal.');

  report.stage='canonical-readiness';
  await page.evaluate(()=>{
    window.UFC_PLAY_PROFILE.identity=window.__OCTAGON_IDENTITY__;
    window.UFC_APP_PROFILE.identity=window.__OCTAGON_IDENTITY__;
    window.__OCTAGON_PROOF__.rpcs=[];
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__OCTAGON_IDENTITY__}));
  });
  await page.waitForFunction(()=>window.UFC_OCTAGON_BOARD?.snapshot?.ok,null,{timeout:10000});
  report.readiness=await snapshot(page);
  assert.equal(report.readiness.canonicalResolves,0,'Readiness-driven War Room loading must not re-enter the canonical resolver.');
  assert.equal(report.readiness.canonicalRequires,0);
  assert.equal(report.readiness.editorResolves,0);
  assert.equal(report.readiness.rpcs.filter(row=>row.name==='octagon_snapshot').length,1,'One readiness event must load one War Room snapshot.');
  assert.equal(report.readiness.rpcs.find(row=>row.name==='octagon_snapshot')?.args?.p_member_token,'octagon-owner-token','War Room loading must use the published member token.');
  assert.equal(report.readiness.storageReads.some(row=>/octagon-message-board\.js/i.test(row.stack)),false);
  assert.equal(report.readiness.authCards,0,'Published identity must replace the reconnect card with the board.');
  assert.equal(report.readiness.boardReady,true);

  report.stage='concurrent-refresh';
  await page.evaluate(()=>{
    window.__OCTAGON_PROOF__.rpcs=[];
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__OCTAGON_IDENTITY__}));
    window.dispatchEvent(new CustomEvent('ufc-app-profile-updated',{detail:{identity:window.__OCTAGON_IDENTITY__}}));
    void window.UFC_OCTAGON_BOARD.load();
  });
  await page.waitForFunction(()=>window.__OCTAGON_PROOF__.rpcs.some(row=>row.name==='octagon_snapshot'),null,{timeout:10000});
  await page.waitForTimeout(260);
  report.concurrent=await snapshot(page);
  assert.equal(report.concurrent.rpcs.filter(row=>row.name==='octagon_snapshot').length,1,'Competing War Room readiness and refresh paths must share one in-flight load.');
  assert.equal(report.concurrent.canonicalResolves,0);
  assert.equal(report.concurrent.canonicalRequires,0);
  assert.equal(report.concurrent.editorResolves,0);

  report.stage='explicit-post';
  await page.evaluate(()=>{
    window.__OCTAGON_PROOF__.rpcs=[];
    const input=document.querySelector('[data-octagon-input]');
    input.value='Jones is still number one.';
    input.dispatchEvent(new Event('input',{bubbles:true}));
    document.querySelector('[data-octagon-composer]').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  });
  await page.waitForFunction(()=>window.__OCTAGON_PROOF__.rpcs.some(row=>row.name==='octagon_post_message'),null,{timeout:10000});
  await page.waitForTimeout(260);
  report.post=await snapshot(page);
  const postRpc=report.post.rpcs.find(row=>row.name==='octagon_post_message');
  assert.equal(postRpc?.args?.p_member_token,'octagon-owner-token','Explicit War Room posts must reuse the published member token.');
  assert.equal(report.post.canonicalResolves,0);
  assert.equal(report.post.canonicalRequires,0);
  assert.equal(report.post.editorResolves,0);
  assert.equal(report.post.storageReads.some(row=>/octagon-message-board\.js/i.test(row.stack)),false);

  await page.close();

  report.stage='explicit-sign-in';
  const signInPage=await openProofPage(context);
  await signInPage.click('[data-octagon-sign-in]');
  await signInPage.waitForFunction(()=>window.UFC_OCTAGON_BOARD?.snapshot?.ok,null,{timeout:10000});
  report.explicitSignIn=await snapshot(signInPage);
  assert.equal(report.explicitSignIn.canonicalRequires,1,'The visible War Room sign-in button must retain one explicit require boundary.');
  assert.equal(report.explicitSignIn.canonicalResolves,0,'Explicit War Room sign-in must not also invoke the resolver.');
  assert.equal(report.explicitSignIn.editorResolves,0);
  assert.equal(report.explicitSignIn.rpcs.filter(row=>row.name==='octagon_snapshot').length,1,'Explicit sign-in must hand the returned identity to one board load.');
  assert.equal(report.explicitSignIn.rpcs.find(row=>row.name==='octagon_snapshot')?.args?.p_member_token,'octagon-owner-token');
  assert.equal(report.explicitSignIn.storageReads.some(row=>/octagon-message-board\.js/i.test(row.stack)),false);
  assert.equal(report.explicitSignIn.signInSurfaces,0);

  report.passed=true;
  report.stage='complete';
  console.log('War Room passive identity ownership proof passed.');
  await context.close();
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}
