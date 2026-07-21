import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const VIEWPORT={width:390,height:844};
const ENABLED_DESTINATIONS=['home','rankings','play','picks','intelligence'];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:VIEWPORT,deviceScaleFactor:1});
const pageErrors=[];
let diagnosticLabel='startup';
let diagnosticSnapshot=null;
page.on('pageerror',error=>pageErrors.push(String(error?.message||error)));

async function navSnapshot(){
  return page.evaluate(()=>{
    const nav=document.querySelector('.tabs[data-app-shell]');
    if(!nav)return null;
    const navRect=nav.getBoundingClientRect();
    const tabs=[...nav.querySelectorAll(':scope > .tab')].map(tab=>{
      const rect=tab.getBoundingClientRect();
      return{
        destination:tab.dataset.destination||'',
        selected:tab.getAttribute('aria-selected')==='true',
        disabled:Boolean(tab.disabled)||tab.getAttribute('aria-disabled')==='true',
        rect:{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:rect.width,height:rect.height}
      };
    });
    return{
      viewport:{width:window.innerWidth,height:window.innerHeight},
      scroll:{x:window.scrollX,y:window.scrollY},
      nav:{
        scrollWidth:nav.scrollWidth,
        clientWidth:nav.clientWidth,
        scrollLeft:nav.scrollLeft,
        rect:{left:navRect.left,right:navRect.right,top:navRect.top,bottom:navRect.bottom,width:navRect.width,height:navRect.height}
      },
      tabs
    };
  });
}

function assertUsefulVisibility(snapshot,label){
  diagnosticLabel=label;
  diagnosticSnapshot=snapshot;
  assert.ok(snapshot,`${label}: primary app navigation exists`);
  assert.deepEqual(snapshot.viewport,VIEWPORT,`${label}: certification uses the 390×844 mobile viewport`);
  assert.equal(snapshot.tabs.length,6,`${label}: all six primary destinations render`);
  assert.ok(snapshot.nav.scrollWidth<=snapshot.nav.clientWidth+1,`${label}: primary navigation has no horizontal overflow`);
  assert.ok(Math.abs(snapshot.nav.scrollLeft)<=1,`${label}: primary navigation has no horizontal scroll offset`);
  for(const tab of snapshot.tabs){
    assert.ok(tab.rect.width>0&&tab.rect.height>0,`${label}: ${tab.destination} has a visible hit target`);
    assert.ok(tab.rect.left>=-1&&tab.rect.right<=snapshot.viewport.width+1,`${label}: ${tab.destination} stays horizontally visible`);
    assert.ok(tab.rect.top>=-1&&tab.rect.bottom<=snapshot.viewport.height+1,`${label}: ${tab.destination} stays vertically visible`);
  }
  assert.equal(snapshot.tabs.filter(tab=>tab.selected).length,1,`${label}: exactly one top tab is selected`);
}

try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>Boolean(window.UFC_APP_SHELL)&&Boolean(document.querySelector('.tabs[data-app-shell]')),null,{timeout:30000});
  await page.evaluate(async()=>{
    document.getElementById('whatsNewOverlay')?.remove();
    if(document.fonts?.ready)await document.fonts.ready;
  });

  const initial=await navSnapshot();
  assertUsefulVisibility(initial,'initial shell');
  const warRoom=initial.tabs.find(tab=>tab.destination==='war-room');
  assert.ok(warRoom,'War Room tab renders');
  assert.equal(warRoom.disabled,true,'War Room stays visible but disabled until access is enabled');

  const routeSnapshots=[];
  for(const destination of ENABLED_DESTINATIONS){
    const tab=page.locator(`.tabs[data-app-shell] .tab[data-destination="${destination}"]`);
    await tab.click();
    await page.waitForFunction(next=>document.querySelector(`.tabs[data-app-shell] .tab[data-destination="${next}"]`)?.getAttribute('aria-selected')==='true',destination,{timeout:15000});
    const snapshot=await navSnapshot();
    assertUsefulVisibility(snapshot,`${destination} route`);
    assert.equal(snapshot.tabs.find(item=>item.destination===destination)?.selected,true,`${destination}: newly opened top tab is selected and visible`);
    routeSnapshots.push({destination,scroll:snapshot.scroll,nav:snapshot.nav,selected:snapshot.tabs.find(item=>item.selected)?.destination||null});
  }

  assert.deepEqual(pageErrors,[],'mobile top-tab navigation causes no uncaught page errors');
  console.log('PICKS_MOBILE_TOP_TAB_CERTIFICATION');
  console.log(JSON.stringify({viewport:'390x844',layout:'six-tab 3x2 shell grid',warRoomDisabled:true,routes:routeSnapshots,pageErrors},null,2));
}catch(error){
  console.error('PICKS_MOBILE_TOP_TAB_FAILURE');
  console.error(JSON.stringify({label:diagnosticLabel,snapshot:diagnosticSnapshot,pageErrors},null,2));
  throw error;
}finally{
  await browser.close();
}
