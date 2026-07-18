import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const reportPath='/tmp/phase-4b-mobile-report.json';
const screenshotPath='/tmp/phase-4b-mobile-preview.png';
const report={passed:false,stage:'boot',memberCount:0,samples:[],viewChanges:[],consoleErrors:[],error:null};
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
    const identity={memberToken:'phase-4b-preview-token',member:fixtureMembers[0],group:{code:'GOAT26',members:fixtureMembers,me:fixtureMembers[0]}};
    const originalPlay=window.UFC_PLAY_PROFILE||{};
    const originalApp=window.UFC_APP_PROFILE||{};
    const originalClient=originalPlay.client||null;
    const client={
      ...(originalClient||{}),
      rpc:async(name,args)=>{
        if(name==='app_profile_community_snapshot')return{data:{ok:true,group:{code:'GOAT26',name:'Octagon HQ',member_count:fixtureMembers.length},me_id:'m1',members:fixtureMembers},error:null};
        if(name==='app_profile_set_top_ten')return{data:{ok:true,member_id:'m1',top_ten:args?.p_top_ten||[],top_ten_updated_at:new Date().toISOString()},error:null};
        return originalClient?.rpc?originalClient.rpc(name,args):{data:null,error:null};
      }
    };
    window.UFC_PLAY_PROFILE={...originalPlay,client,resolve:async()=>identity};
    window.UFC_APP_PROFILE={...originalApp,group:identity.group,resolve:async()=>identity};
    await window.UFC_COMMUNITY_PROFILES.refresh();
  },members);

  report.stage='directory';
  await page.waitForSelector('#communityProfilesMount .community-directory',{timeout:30000});
  await page.waitForFunction(()=>document.querySelectorAll('[data-community-member]').length===6,null,{timeout:30000});

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
  assert(report.samples.every(sample=>sample.members===6),'Member roster changed during the stability window.');

  report.stage='public-profile-open';
  report.memberCount=await page.locator('[data-community-member]').count();
  const shaneCard=page.locator('[data-community-member]').filter({hasText:'Shane'}).first();
  await shaneCard.click();
  await page.waitForSelector('.community-profile-overlay .community-profile-panel',{state:'visible',timeout:30000});
  assert.equal(await page.locator('.community-profile-summary article').count(),4,'Public profile summary is incomplete.');
  assert((await page.locator('.community-profile-card').count())>=5,'Public profile activity sections are incomplete.');
  assert.equal((await page.locator('.community-profile-title strong').first().textContent())?.trim(),'Shane','Wrong public profile opened.');

  report.stage='public-profile-close';
  await page.locator('[data-community-close]').first().click();
  await page.waitForSelector('.community-profile-overlay',{state:'detached',timeout:10000});
  assert(await page.locator('#home').evaluate(node=>node.classList.contains('active-view')),'Closing a member profile left Home.');

  report.stage='final-stability';
  await page.waitForTimeout(1500);
  assert.equal(await page.locator('#communityProfilesMount .community-directory').count(),1,'Directory did not remain stable after closing a profile.');
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
    try{await page.screenshot({path:screenshotPath,fullPage:true});}catch(_error){}
  }
  throw error;
}finally{
  fs.writeFileSync(reportPath,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}
