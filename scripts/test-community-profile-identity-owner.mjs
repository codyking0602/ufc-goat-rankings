import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN='http://127.0.0.1:4173';
const REPORT='/tmp/community-profile-identity-owner-report.json';
const report={passed:false,stage:'boot',uncached:null,cached:null,explicit:null,error:null};
let browser;

const identity={
  ok:true,
  group:{code:'GOAT26',name:'GOAT26'},
  groupCode:'GOAT26',
  member:{id:'m1',display_name:'Cody',is_admin:true,top_ten:[]},
  memberToken:'community-token',
  member_token:'community-token',
  rooms:[]
};

function harness(mode){
  return `<!doctype html><html><head><meta charset="utf-8"><title>Community profile identity owner</title></head><body>
    <section id="home" class="view active-view"><div id="homeDashboardMount"></div></section>
    <script>
      window.RANKING_DATA={men:[],women:[]};
      window.DISPLAY_OVERRIDES={};
      window.__COMMUNITY_IDENTITY_PROOF__={editorResolves:0,canonicalResolves:0,requires:0,communityCalls:0,updates:0};
      const proof=window.__COMMUNITY_IDENTITY_PROOF__;
      const identity=${JSON.stringify(identity)};
      const client={async rpc(name,args){
        if(name==='app_profile_community_snapshot'){
          proof.communityCalls+=1;
          await new Promise(resolve=>setTimeout(resolve,180));
          return {data:{ok:true,group:identity.group,me_id:identity.member.id,members:[{...identity.member}]},error:null};
        }
        if(name==='app_profile_set_top_ten')return {data:{ok:true,top_ten_updated_at:'2026-07-20T00:00:00Z'},error:null};
        return {data:{ok:true},error:null};
      }};
      window.UFC_PLAY_PROFILE={
        identity:${mode==='cached'?'identity':'null'},
        client,
        async resolve(){proof.canonicalResolves+=1;throw new Error('Passive Community Profiles work must not resolve canonical identity.');},
        async require(){proof.requires+=1;this.identity=identity;return identity;}
      };
      window.UFC_APP_PROFILE={
        identity:null,
        group:null,
        async resolve(){proof.editorResolves+=1;throw new Error('Community Profiles must not invoke the editor resolver.');},
        avatarMarkup(member){return '<span class="app-profile-avatar friend"><span>'+String(member?.display_name||'U').slice(0,2)+'</span></span>';},
        open(){}
      };
      window.addEventListener('octagon-hq:community-updated',()=>{proof.updates+=1;});
    </script>
  </body></html>`;
}

async function openScenario(context,mode){
  const page=await context.newPage();
  await page.setContent(harness(mode),{waitUntil:'domcontentloaded'});
  await page.addScriptTag({url:`${ORIGIN}/assets/js/community-profiles.js`});
  await page.waitForFunction(()=>window.UFC_COMMUNITY_PROFILES);
  return page;
}

try{
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});

  report.stage='uncached-startup';
  const uncached=await openScenario(context,'uncached');
  await uncached.waitForTimeout(120);
  let uncachedBefore=await uncached.evaluate(()=>window.__COMMUNITY_IDENTITY_PROOF__);
  assert.deepEqual({
    editorResolves:uncachedBefore.editorResolves,
    canonicalResolves:uncachedBefore.canonicalResolves,
    communityCalls:uncachedBefore.communityCalls,
    requires:uncachedBefore.requires
  },{editorResolves:0,canonicalResolves:0,communityCalls:0,requires:0},'Uncached passive startup must wait for canonical readiness without resolving or opening sign-in.');

  await uncached.evaluate(identity=>{
    window.UFC_PLAY_PROFILE.identity=identity;
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:identity}));
    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'home'}}));
    void window.UFC_COMMUNITY_PROFILES.load(true);
  },identity);
  await uncached.waitForFunction(()=>window.__COMMUNITY_IDENTITY_PROOF__.updates===1);
  await uncached.waitForTimeout(220);
  report.uncached=await uncached.evaluate(()=>({
    ...window.__COMMUNITY_IDENTITY_PROOF__,
    mounts:document.querySelectorAll('#communityProfilesMount').length,
    directories:document.querySelectorAll('#communityProfilesMount .community-directory').length
  }));
  assert.equal(report.uncached.editorResolves,0);
  assert.equal(report.uncached.canonicalResolves,0);
  assert.equal(report.uncached.requires,0);
  assert.equal(report.uncached.communityCalls,1,'Readiness, Home routing, and direct refresh must share one community snapshot request.');
  assert.equal(report.uncached.updates,1);
  assert.equal(report.uncached.mounts,1);
  assert.equal(report.uncached.directories,1);
  await uncached.close();

  report.stage='cached-startup';
  const cached=await openScenario(context,'cached');
  await cached.waitForFunction(()=>window.__COMMUNITY_IDENTITY_PROOF__.updates===1);
  report.cached=await cached.evaluate(()=>({
    ...window.__COMMUNITY_IDENTITY_PROOF__,
    mounts:document.querySelectorAll('#communityProfilesMount').length
  }));
  assert.equal(report.cached.editorResolves,0);
  assert.equal(report.cached.canonicalResolves,0);
  assert.equal(report.cached.requires,0);
  assert.equal(report.cached.communityCalls,1,'Cached startup must perform one direct community handoff.');
  assert.equal(report.cached.updates,1);
  assert.equal(report.cached.mounts,1);
  await cached.close();

  report.stage='explicit-top-ten';
  const explicit=await openScenario(context,'uncached');
  const opened=await explicit.evaluate(()=>window.UFC_COMMUNITY_PROFILES.openTop10());
  assert.equal(opened,true,'Explicit Top 10 editing must remain available through canonical require().');
  report.explicit=await explicit.evaluate(()=>({
    ...window.__COMMUNITY_IDENTITY_PROOF__,
    editors:document.querySelectorAll('.community-top10-overlay').length,
    mounts:document.querySelectorAll('#communityProfilesMount').length
  }));
  assert.equal(report.explicit.editorResolves,0);
  assert.equal(report.explicit.canonicalResolves,0);
  assert.equal(report.explicit.requires,1,'Explicit Top 10 editing must request sign-in exactly once when identity is absent.');
  assert.equal(report.explicit.communityCalls,1);
  assert.equal(report.explicit.updates,1);
  assert.equal(report.explicit.editors,1,'Explicit sign-in must open one visible Top 10 editor.');
  assert.equal(report.explicit.mounts,1);
  await explicit.close();

  report.passed=true;
  report.stage='complete';
  console.log('Community profile identity ownership proof passed.');
  await context.close();
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}
