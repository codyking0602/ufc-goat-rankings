import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const reportPath='/tmp/phase-4b-mobile-report.json';
const screenshotPath='/tmp/phase-4b-mobile-preview.png';
const report={
  passed:false,
  stage:'boot',
  memberCount:0,
  samples:[],
  delayedSamples:[],
  viewChanges:[],
  directoryReplacements:0,
  profileReplacements:0,
  top10Saved:false,
  sharedProfileOpenedPicks:false,
  consoleErrors:[],
  error:null
};
let browser;
let page;

const members=[
  {id:'m1',display_name:'Cody',fighter_avatar_slug:'alexander-volkanovski',is_admin:true,top_ten:['Jon Jones','Georges St-Pierre','Demetrious Johnson','Anderson Silva','Khabib Nurmagomedov','Alexander Volkanovski','Islam Makhachev','Jose Aldo','Max Holloway','Matt Hughes'],profile_updated_at:'2026-07-18T20:00:00Z',last_active_at:'2026-07-18T22:00:00Z',challenge_stats:{sent:4,received:3,completed:5},daily_stats:{days:4,perfect_tens:1},war_stats:{posts:3,replies:5}},
  {id:'m2',display_name:'Shane',fighter_avatar_slug:'alex-pereira',is_admin:false,top_ten:[],profile_updated_at:'2026-07-18T19:00:00Z',last_active_at:'2026-07-18T21:30:00Z',challenge_stats:{sent:1,received:2,completed:2},daily_stats:{days:2,perfect_tens:1},war_stats:{posts:2,replies:0}},
  {id:'m3',display_name:'Tony',fighter_avatar_slug:'tony-ferguson',is_admin:false,top_ten:[],profile_updated_at:'2026-07-17T19:00:00Z',last_active_at:'2026-07-18T18:00:00Z',challenge_stats:{sent:1,received:1,completed:1},daily_stats:{days:1,perfect_tens:0},war_stats:{posts:1,replies:1}},
  {id:'m4',display_name:'Brock',fighter_avatar_slug:'brock-lesnar',is_admin:false,top_ten:[],profile_updated_at:'2026-07-16T19:00:00Z',last_active_at:'2026-07-18T17:00:00Z',challenge_stats:{sent:0,received:1,completed:0},daily_stats:{days:1,perfect_tens:0},war_stats:{posts:0,replies:1}},
  {id:'m5',display_name:'Rhonda',fighter_avatar_slug:'ronda-rousey',is_admin:false,top_ten:[],profile_updated_at:'2026-07-15T19:00:00Z',last_active_at:'2026-07-18T16:00:00Z',challenge_stats:{sent:0,received:0,completed:0},daily_stats:{days:0,perfect_tens:0},war_stats:{posts:0,replies:0}},
  {id:'m6',display_name:'Tyler',fighter_avatar_slug:'max-holloway',is_admin:false,top_ten:[],profile_updated_at:'2026-07-14T19:00:00Z',last_active_at:'2026-07-18T15:00:00Z',challenge_stats:{sent:0,received:0,completed:0},daily_stats:{days:0,perfect_tens:0},war_stats:{posts:0,replies:0}}
];

try{
  browser=await chromium.launch({headless:true});
  page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push(message.text());});
  page.on('pageerror',error=>report.consoleErrors.push(error.stack||error.message));
  await page.addInitScript(()=>{
    window.__phase4bViewChanges=[];
    window.addEventListener('octagon-hq:view-change',event=>window.__phase4bViewChanges.push({destination:event.detail?.destination||'',at:Date.now()}));
  });

  report.stage='fresh-launch';
  await page.goto('http://127.0.0.1:4173/index.html#picks',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>document.querySelector('#home')?.classList.contains('active-view'),null,{timeout:60000});
  await page.waitForFunction(()=>window.UFC_COMMUNITY_PROFILES&&window.UFC_PLAY_PROFILE&&window.UFC_APP_PROFILE,null,{timeout:60000});

  report.stage='inject-community-fixture';
  await page.evaluate(async fixtureMembers=>{
    const identity={memberToken:'phase-4b-preview-token',member:fixtureMembers[0],rooms:[],group:{code:'GOAT26',members:fixtureMembers,me:fixtureMembers[0]}};
    const picksMembers=fixtureMembers.map((member,index)=>({
      ...member,
      points:Math.max(0,60-index*7),
      score:Math.max(0,60-index*7),
      correct:Math.max(0,14-index),
      picks_made:18,
      picks_count:18,
      event_wins:index===0?1:0
    }));
    const originalPlay=window.UFC_PLAY_PROFILE||{};
    const originalApp=window.UFC_APP_PROFILE||{};
    const client={
      rpc:async(name,args)=>{
        if(name==='app_profile_community_snapshot')return{data:{ok:true,group:{code:'GOAT26',name:'Octagon HQ',member_count:fixtureMembers.length},me_id:'m1',members:fixtureMembers},error:null};
        if(name==='app_profile_group_snapshot')return{data:{ok:true,group:{code:'GOAT26',name:'Octagon HQ'},me:fixtureMembers[0],members:fixtureMembers},error:null};
        if(name==='app_profile_set_top_ten'){
          window.__phase4bSavedTop10=args?.p_top_ten||[];
          return{data:{ok:true,member_id:'m1',top_ten:args?.p_top_ten||[],top_ten_updated_at:new Date().toISOString()},error:null};
        }
        if(name==='picks_group_snapshot')return{data:{group:{code:'GOAT26',season:{correct_points:4}},me:picksMembers[0],members:picksMembers,events:[]},error:null};
        if(name==='picks_public_events')return{data:[],error:null};
        if(name==='picks_social_snapshot')return{data:{group:{me:{id:'m1'},members:[]}},error:null};
        if(name==='picks_member_pin_status')return{data:{has_pin:true},error:null};
        return{data:null,error:null};
      }
    };
    window.__phase4bIdentity=identity;
    window.UFC_PLAY_PROFILE={...originalPlay,client,resolve:async()=>identity};
    window.UFC_APP_PROFILE={...originalApp,group:identity.group,resolve:async()=>identity};
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:identity}));
    await window.UFC_PICKS_SEASON_LOOP?.refresh?.();
    await window.UFC_COMMUNITY_PROFILES.refresh();
  },members);

  report.stage='directory';
  await page.waitForSelector('#communityProfilesMount .community-directory',{timeout:30000});
  await page.waitForFunction(()=>document.querySelectorAll('[data-community-member]').length===6,null,{timeout:30000});
  await page.waitForTimeout(500);
  assert.equal(await page.locator('#communityProfilesMount .community-directory').evaluate(node=>node.open),false,'Member directory should start collapsed.');

  await page.evaluate(()=>{
    const mount=document.getElementById('communityProfilesMount');
    window.__phase4bDirectoryNode=mount?.querySelector('.community-directory')||null;
    window.__phase4bDirectoryReplacements=0;
    window.__phase4bDirectoryObserver=new MutationObserver(records=>{
      if(records.some(record=>record.type==='childList'))window.__phase4bDirectoryReplacements+=1;
    });
    if(mount)window.__phase4bDirectoryObserver.observe(mount,{childList:true});
  });

  for(let index=0;index<16;index+=1){
    report.samples.push(await page.evaluate(()=>({
      hash:location.hash,
      home:document.querySelector('#home')?.classList.contains('active-view')||false,
      picks:document.querySelector('#picks')?.classList.contains('active-view')||false,
      directories:document.querySelectorAll('#communityProfilesMount .community-directory').length,
      members:document.querySelectorAll('[data-community-member]').length
    })));
    await page.waitForTimeout(250);
  }
  assert(report.samples.every(sample=>sample.home&&!sample.picks),'Home did not remain the only active destination.');
  assert(report.samples.every(sample=>sample.directories===1),'Community directory was duplicated or removed.');
  assert(report.samples.every(sample=>sample.members===6),'Member roster changed during the initial stability window.');

  report.stage='event-storm';
  for(let index=0;index<8;index+=1){
    await page.evaluate(index=>{
      window.dispatchEvent(new CustomEvent('ufc-picks-season-updated',{detail:window.UFC_PICKS_SEASON_LOOP?.data||null}));
      window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__phase4bIdentity}));
      if(index%2===0)window.dispatchEvent(new CustomEvent('ufc-app-profile-updated',{detail:{identity:window.__phase4bIdentity}}));
    },index);
    await page.waitForTimeout(180);
  }
  await page.waitForTimeout(1200);
  assert(await page.evaluate(()=>window.__phase4bDirectoryNode===document.querySelector('#communityProfilesMount .community-directory')),'Directory node was replaced during unchanged live updates.');
  assert.equal(await page.evaluate(()=>window.__phase4bDirectoryReplacements),0,'Directory was rebuilt during unchanged live updates.');

  report.stage='delayed-stability';
  await page.waitForTimeout(32000);
  await page.evaluate(()=>{
    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'home',view:'home'}}));
    window.dispatchEvent(new CustomEvent('octagon-hq:soft-refresh',{detail:{source:'phase-4b-delayed-test'}}));
  });
  await page.waitForTimeout(1400);
  report.delayedSamples.push(await page.evaluate(()=>({
    home:document.querySelector('#home')?.classList.contains('active-view')||false,
    directories:document.querySelectorAll('#communityProfilesMount .community-directory').length,
    members:document.querySelectorAll('[data-community-member]').length,
    sameNode:window.__phase4bDirectoryNode===document.querySelector('#communityProfilesMount .community-directory'),
    replacements:window.__phase4bDirectoryReplacements
  })));
  assert(report.delayedSamples.every(sample=>sample.home&&sample.directories===1&&sample.members===6),'Directory did not survive the delayed stability window.');
  assert(report.delayedSamples.every(sample=>sample.sameNode&&sample.replacements===0),'Directory was replaced after the delayed refresh window.');

  report.stage='profile-top10-editor';
  await page.locator('.community-directory-summary').click();
  assert.equal(await page.locator('#communityProfilesMount .community-directory').evaluate(node=>node.open),true,'Member directory did not expand.');
  const viewCountBeforeTop10=(await page.evaluate(()=>window.__phase4bViewChanges.length));
  await page.locator('[data-community-build-top10]').click();
  await page.waitForSelector('.community-top10-overlay .community-top10-panel',{state:'visible',timeout:30000});
  assert(await page.locator('#home').evaluate(node=>node.classList.contains('active-view')),'Top 10 editor left Home.');
  assert.equal(await page.locator('#play').evaluate(node=>node.classList.contains('active-view')),false,'Top 10 editor opened the Play game.');
  await page.locator('[data-top10-save]').click();
  await page.waitForSelector('.community-top10-overlay',{state:'detached',timeout:10000});
  report.top10Saved=await page.evaluate(()=>Array.isArray(window.__phase4bSavedTop10)&&window.__phase4bSavedTop10.length===10);
  assert.equal(report.top10Saved,true,'Top 10 did not save directly to the profile RPC.');
  const top10ViewChanges=(await page.evaluate(index=>window.__phase4bViewChanges.slice(index),viewCountBeforeTop10));
  assert.equal(top10ViewChanges.some(change=>change.destination==='play'),false,'Top 10 action routed through Play.');

  await page.evaluate(()=>{
    window.__phase4bDirectoryObserver?.disconnect();
    const mount=document.getElementById('communityProfilesMount');
    window.__phase4bDirectoryNode=mount?.querySelector('.community-directory')||null;
    window.__phase4bDirectoryReplacements=0;
    window.__phase4bDirectoryObserver=new MutationObserver(records=>{
      if(records.some(record=>record.type==='childList'))window.__phase4bDirectoryReplacements+=1;
    });
    if(mount)window.__phase4bDirectoryObserver.observe(mount,{childList:true});
  });

  report.stage='public-profile-open';
  report.memberCount=await page.locator('[data-community-member]').count();
  const shaneCard=page.locator('[data-community-member]').filter({hasText:'Shane'}).first();
  await shaneCard.click();
  await page.waitForSelector('.community-profile-overlay .community-profile-panel',{state:'visible',timeout:30000});
  assert.equal(await page.locator('.community-profile-summary article').count(),4,'Public profile summary is incomplete.');
  assert((await page.locator('.community-profile-card').count())>=5,'Public profile activity sections are incomplete.');
  assert.equal((await page.locator('.community-profile-title strong').first().textContent())?.trim(),'Shane','Wrong public profile opened.');

  await page.evaluate(()=>{
    const panel=document.querySelector('.community-profile-panel');
    window.__phase4bProfileNode=panel;
    window.__phase4bProfileReplacements=0;
    window.__phase4bProfileObserver=new MutationObserver(records=>{
      if(records.some(record=>record.type==='childList'))window.__phase4bProfileReplacements+=1;
    });
    if(panel)window.__phase4bProfileObserver.observe(panel,{childList:true});
  });
  for(let index=0;index<4;index+=1){
    await page.evaluate(()=>{
      window.dispatchEvent(new CustomEvent('ufc-picks-season-updated',{detail:window.UFC_PICKS_SEASON_LOOP?.data||null}));
      window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__phase4bIdentity}));
    });
    await page.waitForTimeout(220);
  }
  await page.waitForTimeout(900);
  assert(await page.evaluate(()=>window.__phase4bProfileNode===document.querySelector('.community-profile-panel')),'Open member profile panel was replaced during unchanged live updates.');
  assert.equal(await page.evaluate(()=>window.__phase4bProfileReplacements),0,'Open member profile content was rebuilt during unchanged live updates.');

  report.stage='public-profile-close';
  await page.locator('[data-community-close]').first().click();
  await page.waitForSelector('.community-profile-overlay',{state:'detached',timeout:10000});
  assert(await page.locator('#home').evaluate(node=>node.classList.contains('active-view')),'Closing a member profile left Home.');

  report.stage='shared-profile-picks-access';
  await page.evaluate(()=>window.UFC_APP_SHELL.activateDestination('picks'));
  await page.waitForFunction(()=>document.querySelector('#picks')?.classList.contains('active-view'),null,{timeout:10000});
  await page.waitForTimeout(600);
  report.sharedProfileOpenedPicks=await page.evaluate(()=>localStorage.getItem('ufc-picks:group:GOAT26')==='phase-4b-preview-token'&&!document.getElementById('picksPinSignInCard'));
  assert.equal(report.sharedProfileOpenedPicks,true,'The shared Octagon HQ profile did not carry into Picks.');
  await page.evaluate(()=>window.UFC_APP_SHELL.activateDestination('home'));
  await page.waitForFunction(()=>document.querySelector('#home')?.classList.contains('active-view'),null,{timeout:10000});

  report.stage='final-stability';
  await page.waitForTimeout(1500);
  assert.equal(await page.locator('#communityProfilesMount .community-directory').count(),1,'Directory did not remain stable after closing a profile.');
  report.directoryReplacements=await page.evaluate(()=>window.__phase4bDirectoryReplacements||0);
  report.profileReplacements=await page.evaluate(()=>window.__phase4bProfileReplacements||0);
  const featureErrors=report.consoleErrors.filter(message=>/community-profiles|fresh-home-launch|SyntaxError|ReferenceError/i.test(message));
  assert.deepEqual(featureErrors,[],'Phase 4B emitted a browser error.');
  report.viewChanges=await page.evaluate(()=>window.__phase4bViewChanges);
  await page.screenshot({path:screenshotPath,fullPage:true});
  report.passed=true;
  report.stage='complete';
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  if(page){
    try{report.viewChanges=await page.evaluate(()=>window.__phase4bViewChanges||[]);}catch(_error){}
    try{report.directoryReplacements=await page.evaluate(()=>window.__phase4bDirectoryReplacements||0);}catch(_error){}
    try{report.profileReplacements=await page.evaluate(()=>window.__phase4bProfileReplacements||0);}catch(_error){}
    try{await page.screenshot({path:screenshotPath,fullPage:true});}catch(_error){}
  }
  throw error;
}finally{
  fs.writeFileSync(reportPath,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}
