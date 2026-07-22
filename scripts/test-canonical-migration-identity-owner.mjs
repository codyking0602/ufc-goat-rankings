import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-canonical-migration-identity-contract.mjs');

const base='http://127.0.0.1:4173/canonical-migration-identity-proof.html';
const reportPath='/tmp/canonical-migration-identity-owner-report.json';
const report={proof:'canonical-migration-identity-owner',phase:'launch',scenarios:{}};

const fixture=`<!doctype html>
<html><head><meta charset="utf-8"><title>Canonical migration identity proof</title></head>
<body>
  <input id="picksPinGroupCode"><input id="playProfileGroup">
  <button type="button" data-view="picks">Picks</button>
  <script>
  (function(){
    const params=new URLSearchParams(location.search);
    const scenario=params.get('scenario')||'canonical';
    const canonical='GOAT26';
    const legacy='OLD123';
    const canonicalToken='canonical-token-1234';
    const legacyToken='legacy-token-5678';
    const proof=window.__MIGRATION_IDENTITY_PROOF__={scenario,rpcs:[],canonicalEvents:[],profileEvents:[],reloads:0};

    if(scenario==='canonical'||scenario==='schema-fallback')localStorage.setItem('ufc-picks:group:'+canonical,canonicalToken);
    if(scenario==='legacy'){
      localStorage.setItem('ufc-picks:group:'+legacy,legacyToken);
      localStorage.setItem('ufc-picks:group-admin:'+legacy,'legacy-admin-token');
      sessionStorage.setItem('ufc-app:goat26-adoption-reload',legacy+':'+legacyToken.slice(0,8));
    }

    const identity=token=>({
      ok:true,
      group:{code:canonical,name:'UFC Picks'},
      member:{id:'member-1',display_name:token===legacyToken?'Legacy Cody':'Canonical Cody'},
      rooms:[{code:'ROOM01',name:'Main Room'}],
      active_room:{code:'ROOM01'}
    });

    window.UFC_SUPABASE_CONFIG={url:'https://proof.supabase.co',anonKey:'proof-key'};
    window.supabase={createClient(){return{
      async rpc(name,args){
        proof.rpcs.push({name,args:{...(args||{})}});
        const token=String(args?.p_member_token||'');
        if(scenario==='schema-fallback'&&name==='app_profile_resolve')return{data:null,error:{message:'schema cache app_profile_resolve does not exist'}};
        if(!token)return{data:{ok:false},error:null};
        return{data:identity(token),error:null};
      }
    };}};

    window.addEventListener('ufc-canonical-group-ready',event=>proof.canonicalEvents.push(event.detail));
    window.addEventListener('ufc-play-profile-ready',event=>proof.profileEvents.push(event.detail));
  })();
  </script>
  <script src="/assets/js/app-canonical-group.js"></script>
  <script src="/assets/js/play-profile-identity.js"></script>
</body></html>`;

async function pageFor(browser,scenario){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route(`${base}*`,route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto(`${base}?scenario=${scenario}&group=GOAT26`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_APP_IDENTITY_CONFIG&&window.UFC_PLAY_PROFILE,null,{timeout:10000});
  return{context,page};
}

async function resolveTwice(page){
  await page.evaluate(async()=>{
    window.__MIGRATION_IDENTITY_PROOF__.first=await window.UFC_PLAY_PROFILE.resolve();
    window.__MIGRATION_IDENTITY_PROOF__.second=await window.UFC_PLAY_PROFILE.resolve();
  });
  return page.evaluate(()=>({
    scenario:window.__MIGRATION_IDENTITY_PROOF__.scenario,
    rpcs:[...window.__MIGRATION_IDENTITY_PROOF__.rpcs],
    canonicalEvents:[...window.__MIGRATION_IDENTITY_PROOF__.canonicalEvents],
    profileEvents:[...window.__MIGRATION_IDENTITY_PROOF__.profileEvents],
    first:window.__MIGRATION_IDENTITY_PROOF__.first,
    second:window.__MIGRATION_IDENTITY_PROOF__.second,
    cache:window.UFC_PLAY_PROFILE.identity,
    bridgeVersion:window.UFC_APP_IDENTITY_CONFIG.version,
    ownerVersion:window.UFC_PLAY_PROFILE.version,
    canonicalToken:localStorage.getItem('ufc-picks:group:GOAT26'),
    canonicalAdmin:localStorage.getItem('ufc-picks:group-admin:GOAT26'),
    activeGroup:localStorage.getItem('ufc-player:group-code'),
    displayName:localStorage.getItem('ufc-picks:display-name'),
    roomToken:localStorage.getItem('ufc-picks:room:ROOM01'),
    roomAdmin:localStorage.getItem('ufc-picks:admin:ROOM01')
  }));
}

function assertShared(value,{token,rpcNames,displayName,legacy=false}){
  assert.match(value.bridgeVersion,/home-route-safe/,'Home-route-safe migration bridge runtime did not load.');
  assert.match(value.ownerVersion,/startup-ready/,'Canonical identity owner did not load the startup-ready runtime.');
  assert.deepEqual(value.rpcs.map(row=>row.name),rpcNames,'Migration and canonical owner performed the wrong RPC sequence.');
  assert.equal(value.canonicalEvents.length,1,'Migration-specific readiness must publish exactly once.');
  assert.equal(value.profileEvents.length,1,'Canonical profile readiness must publish exactly once across repeated resolve calls.');
  assert.equal(value.first.memberToken,token);
  assert.equal(value.second.memberToken,token);
  assert.equal(value.cache.memberToken,token);
  assert.equal(value.canonicalToken,token);
  assert.equal(value.activeGroup,'GOAT26');
  assert.equal(value.displayName,displayName);
  assert.equal(value.roomToken,token);
  if(legacy){
    assert.equal(value.canonicalAdmin,'legacy-admin-token');
    assert.equal(value.roomAdmin,'legacy-admin-token');
    assert.equal(value.first.migrationSourceCode,'OLD123');
  }
}

const browser=await chromium.launch({headless:true});
try{
  report.phase='canonical-token';
  {
    const {context,page}=await pageFor(browser,'canonical');
    const value=await resolveTwice(page);
    report.scenarios.canonical=value;
    assertShared(value,{token:'canonical-token-1234',rpcNames:['app_profile_resolve'],displayName:'Canonical Cody'});
    await context.close();
  }

  report.phase='legacy-token';
  {
    const {context,page}=await pageFor(browser,'legacy');
    const value=await resolveTwice(page);
    report.scenarios.legacy=value;
    assertShared(value,{token:'legacy-token-5678',rpcNames:['app_profile_resolve'],displayName:'Legacy Cody',legacy:true});
    await context.close();
  }

  report.phase='migration-rpc-fallback';
  {
    const {context,page}=await pageFor(browser,'schema-fallback');
    const value=await resolveTwice(page);
    report.scenarios.schemaFallback=value;
    assertShared(value,{token:'canonical-token-1234',rpcNames:['app_profile_resolve','play_identity_snapshot'],displayName:'Canonical Cody'});
    await context.close();
  }

  report.phase='independent-owner-fallback';
  {
    const {context,page}=await pageFor(browser,'empty');
    await page.evaluate(async()=>{
      await window.UFC_APP_IDENTITY_CONFIG.ready;
      localStorage.setItem('ufc-picks:group:GOAT26','late-token-9012');
      window.__MIGRATION_IDENTITY_PROOF__.first=await window.UFC_PLAY_PROFILE.resolve();
      window.__MIGRATION_IDENTITY_PROOF__.second=await window.UFC_PLAY_PROFILE.resolve();
    });
    const value=await page.evaluate(()=>({
      rpcs:[...window.__MIGRATION_IDENTITY_PROOF__.rpcs],
      canonicalEvents:[...window.__MIGRATION_IDENTITY_PROOF__.canonicalEvents],
      profileEvents:[...window.__MIGRATION_IDENTITY_PROOF__.profileEvents],
      first:window.__MIGRATION_IDENTITY_PROOF__.first,
      second:window.__MIGRATION_IDENTITY_PROOF__.second,
      canonicalToken:localStorage.getItem('ufc-picks:group:GOAT26'),
      displayName:localStorage.getItem('ufc-picks:display-name'),
      roomToken:localStorage.getItem('ufc-picks:room:ROOM01')
    }));
    report.scenarios.independentFallback=value;
    assert.deepEqual(value.rpcs.map(row=>row.name),['app_profile_resolve'],'Canonical owner fallback must resolve independently exactly once when migration has no candidate.');
    assert.equal(value.canonicalEvents.length,0,'An empty migration must not publish migration readiness.');
    assert.equal(value.profileEvents.length,1,'Independent canonical fallback must publish readiness once.');
    assert.equal(value.first.memberToken,'late-token-9012');
    assert.equal(value.second.memberToken,'late-token-9012');
    assert.equal(value.canonicalToken,'late-token-9012');
    assert.equal(value.displayName,'Canonical Cody');
    assert.equal(value.roomToken,'late-token-9012');
    await context.close();
  }

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