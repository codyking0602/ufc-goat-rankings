import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const VIEWPORT={width:390,height:844};
const ENABLED_BOTTOM_DESTINATIONS=['home','rankings','play','picks'];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:VIEWPORT,deviceScaleFactor:1});
const pageErrors=[];
let diagnosticLabel='startup';
let diagnosticSnapshot=null;
page.on('pageerror',error=>pageErrors.push(String(error?.message||error)));

async function navSnapshot(){
  return page.evaluate(()=>{
    const nav=document.querySelector('[data-native-bottom-nav]');
    const source=document.querySelector('.tabs[data-app-shell]');
    const ask=document.querySelector('[data-native-ask]');
    if(!nav||!ask)return null;
    const navRect=nav.getBoundingClientRect();
    const askRect=ask.getBoundingClientRect();
    const sourceRect=source?.getBoundingClientRect();
    const buttons=[...nav.querySelectorAll('[data-native-destination]')].map(button=>{
      const rect=button.getBoundingClientRect();
      return{
        destination:button.dataset.nativeDestination||'',
        selected:button.getAttribute('aria-selected')==='true',
        disabled:Boolean(button.disabled)||button.getAttribute('aria-disabled')==='true',
        hidden:Boolean(button.hidden)||getComputedStyle(button).display==='none',
        rect:{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:rect.width,height:rect.height}
      };
    });
    return{
      viewport:{width:window.innerWidth,height:window.innerHeight},
      scroll:{x:window.scrollX,y:window.scrollY},
      currentDestination:(window.UFC_APP_SHELL||window.UFC_PRODUCT_ARCHITECTURE)?.currentDestination||null,
      sourceHidden:Boolean(source)&&sourceRect?.width===0&&sourceRect?.height===0,
      nav:{
        scrollWidth:nav.scrollWidth,
        clientWidth:nav.clientWidth,
        scrollLeft:nav.scrollLeft,
        rect:{left:navRect.left,right:navRect.right,top:navRect.top,bottom:navRect.bottom,width:navRect.width,height:navRect.height}
      },
      ask:{rect:{left:askRect.left,right:askRect.right,top:askRect.top,bottom:askRect.bottom,width:askRect.width,height:askRect.height}},
      buttons
    };
  });
}

function withinViewport(rect,viewport){
  return rect.width>0&&rect.height>0&&rect.left>=-1&&rect.right<=viewport.width+1&&rect.top>=-1&&rect.bottom<=viewport.height+1;
}

function assertNativeShellVisibility(snapshot,label,{selectedCount=1}={}){
  diagnosticLabel=label;
  diagnosticSnapshot=snapshot;
  assert.ok(snapshot,`${label}: native mobile navigation and Ask action exist`);
  assert.deepEqual(snapshot.viewport,VIEWPORT,`${label}: certification uses the 390×844 mobile viewport`);
  assert.equal(snapshot.sourceHidden,true,`${label}: obsolete desktop tab row stays hidden on mobile`);
  assert.equal(snapshot.buttons.length,5,`${label}: all five native bottom destinations remain represented in the canonical shell`);
  const visibleButtons=snapshot.buttons.filter(button=>!button.hidden);
  assert.equal(visibleButtons.length,4,`${label}: locked War Room stays hidden while the four eligible destinations remain visible`);
  assert.ok(snapshot.nav.scrollWidth<=snapshot.nav.clientWidth+1,`${label}: native bottom navigation has no horizontal overflow`);
  assert.ok(Math.abs(snapshot.nav.scrollLeft)<=1,`${label}: native bottom navigation has no horizontal scroll offset`);
  assert.ok(withinViewport(snapshot.nav.rect,snapshot.viewport),`${label}: native bottom navigation remains fixed inside the viewport`);
  assert.ok(withinViewport(snapshot.ask.rect,snapshot.viewport),`${label}: Intelligence Ask action remains visible in the sticky header`);
  for(const button of visibleButtons){
    assert.ok(withinViewport(button.rect,snapshot.viewport),`${label}: ${button.destination} remains fully visible`);
  }
  assert.equal(snapshot.buttons.filter(button=>button.selected).length,selectedCount,`${label}: native selection state is unambiguous`);
}

try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>Boolean(window.UFC_APP_SHELL)&&Boolean(document.querySelector('[data-native-bottom-nav]'))&&Boolean(document.querySelector('[data-native-ask]')),null,{timeout:30000});
  await page.evaluate(async()=>{
    document.getElementById('whatsNewOverlay')?.remove();
    if(document.fonts?.ready)await document.fonts.ready;
  });

  const initial=await navSnapshot();
  assertNativeShellVisibility(initial,'initial shell');
  const warRoom=initial.buttons.find(button=>button.destination==='war-room');
  assert.ok(warRoom,'War Room native destination remains represented for permission-aware activation');
  assert.equal(warRoom.hidden,true,'War Room stays hidden while access is locked');
  assert.equal(warRoom.disabled,true,'War Room remains non-interactive while access is locked');

  const routeSnapshots=[];
  for(const destination of ENABLED_BOTTOM_DESTINATIONS){
    const button=page.locator(`[data-native-bottom-nav] [data-native-destination="${destination}"]`);
    await button.click();
    await page.waitForFunction(next=>document.querySelector(`[data-native-bottom-nav] [data-native-destination="${next}"]`)?.getAttribute('aria-selected')==='true',destination,{timeout:15000});
    const snapshot=await navSnapshot();
    assertNativeShellVisibility(snapshot,`${destination} route`);
    assert.equal(snapshot.buttons.find(item=>item.destination===destination)?.selected,true,`${destination}: newly opened native destination remains visible and selected`);
    routeSnapshots.push({destination,scroll:snapshot.scroll,nav:snapshot.nav,selected:snapshot.buttons.find(item=>item.selected)?.destination||null});
  }

  await page.locator('[data-native-ask]').click();
  await page.waitForFunction(()=>document.getElementById('compare')?.classList.contains('active-view'),null,{timeout:15000});
  const intelligence=await navSnapshot();
  assertNativeShellVisibility(intelligence,'intelligence route',{selectedCount:0});
  assert.equal(intelligence.currentDestination,'intelligence','Intelligence Ask action opens the canonical Intelligence destination');
  routeSnapshots.push({destination:'intelligence',scroll:intelligence.scroll,nav:intelligence.nav,selected:'header-ask'});

  assert.deepEqual(pageErrors,[],'mobile native navigation causes no uncaught page errors');
  console.log('PICKS_MOBILE_NAV_CERTIFICATION');
  console.log(JSON.stringify({viewport:'390x844',layout:'four visible native destinations plus sticky-header Intelligence action',desktopSourceHidden:true,warRoomHidden:true,routes:routeSnapshots.length,pageErrors}));
}catch(error){
  console.error('PICKS_MOBILE_NAV_FAILURE');
  console.error(JSON.stringify({label:diagnosticLabel,snapshot:diagnosticSnapshot,pageErrors}));
  throw error;
}finally{
  await browser.close();
}

await import('./test-production-palette-sweep.mjs');
