import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const reportPath='/tmp/profile-signin-stability-report.json';
const report={passed:false,stage:'boot',scriptCounts:{},viewClassMutations:0,activeViews:[],consoleErrors:[],error:null};
let browser;
let page;

try{
  browser=await chromium.launch({headless:true});
  page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push(message.text());});
  page.on('pageerror',error=>report.consoleErrors.push(error.stack||error.message));

  report.stage='launch';
  await page.goto('http://127.0.0.1:4173/index.html#home',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_PRODUCT_ARCHITECTURE&&window.UFC_NATIVE_APP_SHELL&&window.UFC_APP_NOTIFICATION_SURFACE_FIX,null,{timeout:60000});
  await page.waitForFunction(()=>document.querySelector('#home')?.classList.contains('active-view'),null,{timeout:60000});
  await page.waitForTimeout(800);

  report.stage='single-owner-audit';
  report.scriptCounts=await page.evaluate(()=>({
    productArchitecture:document.querySelectorAll('script[src*="assets/js/product-architecture.js"]').length,
    nativeShell:document.querySelectorAll('script[src*="assets/js/native-app-shell.js"]').length,
    notificationSurface:document.querySelectorAll('script[src*="assets/js/app-notification-surface-fix.js"]').length,
    bottomNav:document.querySelectorAll('[data-native-bottom-nav]').length
  }));
  assert.equal(report.scriptCounts.productArchitecture,1,'Product architecture loaded more than once.');
  assert.equal(report.scriptCounts.nativeShell,1,'Native app shell loaded more than once.');
  assert.equal(report.scriptCounts.notificationSurface,1,'Notification surface loaded more than once.');
  assert.equal(report.scriptCounts.bottomNav,1,'Native bottom navigation was duplicated.');

  report.stage='profile-signin-event';
  await page.evaluate(()=>{
    window.__profileSigninViewClassMutations=0;
    window.__profileSigninObserver=new MutationObserver(records=>{
      for(const record of records){
        if(record.type==='attributes'&&record.attributeName==='class'&&record.target?.classList?.contains('view')){
          window.__profileSigninViewClassMutations+=1;
        }
      }
    });
    document.querySelectorAll('main.shell>.view').forEach(view=>window.__profileSigninObserver.observe(view,{attributes:true,attributeFilter:['class']}));
  });

  const identity={memberToken:'signin-stability-token',member:{id:'m1',display_name:'Cody',is_admin:true}};
  for(let index=0;index<8;index+=1){
    await page.evaluate(({identity,index})=>{
      window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:identity}));
      if(index%2===0)window.dispatchEvent(new CustomEvent('ufc-app-profile-updated',{detail:{identity,member:identity.member}}));
    },{identity,index});
    await page.waitForTimeout(180);
  }
  await page.waitForTimeout(5000);

  report.viewClassMutations=await page.evaluate(()=>window.__profileSigninViewClassMutations||0);
  report.activeViews=await page.evaluate(()=>[...document.querySelectorAll('main.shell>.view.active-view')].map(node=>node.id));
  const finalCounts=await page.evaluate(()=>({
    nativeShell:document.querySelectorAll('script[src*="assets/js/native-app-shell.js"]').length,
    notificationSurface:document.querySelectorAll('script[src*="assets/js/app-notification-surface-fix.js"]').length,
    bottomNav:document.querySelectorAll('[data-native-bottom-nav]').length
  }));

  assert.deepEqual(report.activeViews,['home'],'Profile sign-in changed or duplicated the active app view.');
  assert.equal(report.viewClassMutations,0,'Profile sign-in repeatedly changed view classes.');
  assert.equal(finalCounts.nativeShell,1,'Profile sign-in caused another native shell load.');
  assert.equal(finalCounts.notificationSurface,1,'Profile sign-in caused another notification surface load.');
  assert.equal(finalCounts.bottomNav,1,'Profile sign-in duplicated the native navigation.');

  const featureErrors=report.consoleErrors.filter(message=>/product-architecture|native-app-shell|notification-surface|SyntaxError|ReferenceError/i.test(message));
  assert.deepEqual(featureErrors,[],'Profile sign-in emitted a shell or notification error.');

  report.passed=true;
  report.stage='complete';
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(reportPath,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}
