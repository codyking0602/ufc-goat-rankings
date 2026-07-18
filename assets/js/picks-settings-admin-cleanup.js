(function(){
  'use strict';

  const VERSION='picks-settings-admin-cleanup-20260718e-admin-only';
  let syncing=false;
  let correctionMode=false;
  let adminPreferredOpen=null;
  let adminState=null;
  const safe=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  function profileMember(){return window.UFC_APP_PROFILE?.group?.me||window.UFC_APP_PROFILE?.identity?.member||null;}
  function isAdmin(){return adminState===true||Boolean(profileMember()?.is_admin);}

  function installStyle(){if(document.getElementById('picksAdminOnlySettingsCss'))return;const style=document.createElement('style');style.id='picksAdminOnlySettingsCss';style.textContent='#picksInternalNav [data-picks-route="settings"][hidden],#picks [data-picks-view="settings"][data-admin-hidden="true"]{display:none!important}';document.head.appendChild(style);}
  function enforceSettingsVisibility(){
    const admin=isAdmin();const tab=document.querySelector('#picksInternalNav [data-picks-route="settings"]');const view=document.querySelector('#picks [data-picks-view="settings"]');
    if(tab){tab.hidden=!admin;tab.setAttribute('aria-hidden',String(!admin));tab.tabIndex=admin?0:-1;}
    if(view){view.dataset.adminHidden=String(!admin);if(!admin)view.hidden=true;}
    if(!admin){document.getElementById('picksProfileShell')?.setAttribute('hidden','');if(document.getElementById('picks')?.dataset.picksActiveView==='settings')window.UFCPicksNavigation?.setRoute?.('home',{updateUrl:true,scroll:false});}
    document.getElementById('picks')?.setAttribute('data-picks-admin',String(admin));
  }
  async function resolveAdmin(){try{await window.UFC_APP_PROFILE?.resolve?.();if(!window.UFC_APP_PROFILE?.group)await window.UFC_APP_PROFILE?.groupSnapshot?.();}catch(_error){}adminState=Boolean(profileMember()?.is_admin);sync();}
  function isFinalEvent(){const recap=document.getElementById('picksEventRecap');return Boolean(recap&&!recap.hidden&&recap.innerHTML.trim());}

  function cleanProfile(){
    const shell=document.getElementById('picksProfileShell');const profile=shell?.querySelector('.social-profile');if(!shell||!profile||!isAdmin())return;
    shell.hidden=false;shell.classList.add('picks-profile-clean');
    if(!shell.querySelector('.picks-profile-clean-heading')){const heading=document.createElement('div');heading.className='picks-profile-clean-heading';heading.innerHTML='<div><span>ADMIN SETTINGS</span><strong>Profile & Reminders</strong></div><small>Shared Octagon HQ identity and event alerts</small>';shell.prepend(heading);}
    const reminderTitle=profile.querySelector('.social-reminder-row label strong');if(reminderTitle)reminderTitle.textContent='In-app reminder';
    const reminderCopy=profile.querySelector('.social-reminder-row label small');if(reminderCopy)reminderCopy.textContent='Only works when the app is open near event time.';
    const calendar=profile.querySelector('#picksAddCalendar');if(calendar)calendar.textContent='Add Phone Reminders';
    let note=profile.querySelector('.picks-reminder-reliability');if(!note){note=document.createElement('p');note.className='picks-reminder-reliability';profile.querySelector('.social-reminder-row')?.insertAdjacentElement('afterend',note);}if(note)note.textContent='Adds calendar alerts eight hours and one hour before the card starts, even when the app is closed.';
  }

  function sectionLabel(section){return String(section?.querySelector('.commissioner-section-head span')?.textContent||'').trim().toUpperCase();}
  function wrapCommissionerSection(section,title,meta){if(!section||section.closest('.commissioner-clean-section'))return;const details=document.createElement('details');details.className='commissioner-clean-section';details.innerHTML=`<summary><div><span>GROUP CONTROL</span><strong>${safe(title)}</strong></div><b>${safe(meta||'')}</b></summary>`;section.insertAdjacentElement('beforebegin',details);details.appendChild(section);}
  function cleanCommissioner(){
    const card=document.getElementById('picksCommissionerCard');const content=document.getElementById('picksCommissionerContent');if(!card||!content||card.hidden||!isAdmin())return;
    card.classList.add('picks-commissioner-clean');const summaryTitle=card.querySelector(':scope > summary strong');const summaryMeta=document.getElementById('picksCommissionerSummary');if(summaryTitle)summaryTitle.textContent='Group & Season';if(summaryMeta&&!summaryMeta.textContent.trim())summaryMeta.textContent='Settings';if(!card.dataset.cleanupInitialized){card.open=false;card.dataset.cleanupInitialized='true';}
    const hero=content.querySelector('.commissioner-hero');const heroKicker=hero?.querySelector('span');const heroCopy=hero?.querySelector('p');if(heroKicker)heroKicker.textContent='GROUP SETTINGS';if(heroCopy)heroCopy.textContent='Rename the group, manage the season, and control membership.';
    [...content.querySelectorAll('.commissioner-section')].forEach(section=>{const label=sectionLabel(section);if(label==='EVENT CONTROL'){section.remove();return;}if(label==='ACTIVE SEASON'){const title=section.querySelector('.commissioner-section-head h3')?.textContent?.trim()||'Season Settings';const count=section.querySelector('.commissioner-section-head b')?.textContent?.trim()||'';wrapCommissionerSection(section,'Season Settings',`${title}${count?` · ${count}`:''}`);}if(label==='ROSTER'){const count=section.querySelector('.commissioner-section-head b')?.textContent?.trim()||'';wrapCommissionerSection(section,'Members & Ownership',count);}});
  }

  function fightState(card){const value=String(card?.querySelector('.picks-admin-fight-head span')?.textContent||'').trim().toLowerCase();if(value.includes('awaiting'))return 0;if(value.includes('winner'))return 2;return 1;}
  function sortAdminFights(content){const list=content?.querySelector('.picks-admin-fights');if(!list)return;[...list.children].sort((a,b)=>fightState(a)-fightState(b)).forEach(card=>list.appendChild(card));}
  function updateCorrectionButton(button){if(!button)return;button.textContent=correctionMode?'Exit Correction Mode':'Enter Correction Mode';button.classList.toggle('active',correctionMode);}
  function ensureCorrectionGate(panel,content){let gate=content.querySelector('.picks-correction-gate');if(!gate){gate=document.createElement('div');gate.className='picks-correction-gate';gate.innerHTML='<div><span>COMPLETED EVENT</span><strong>Results are locked for normal viewing</strong><small>Enter correction mode only to fix a result, mark a fight void, or reopen one matchup for 15 minutes.</small></div><button id="picksEnterCorrectionMode" type="button"></button>';content.prepend(gate);gate.querySelector('button')?.addEventListener('click',()=>{correctionMode=!correctionMode;panel.classList.toggle('correction-mode',correctionMode);updateCorrectionButton(gate.querySelector('button'));});}updateCorrectionButton(gate.querySelector('button'));panel.classList.toggle('correction-mode',correctionMode);}
  function preserveAdminToggle(panel){if(panel.dataset.cleanupToggleBound)return;panel.dataset.cleanupToggleBound='true';panel.querySelector(':scope > summary')?.addEventListener('click',()=>{adminPreferredOpen=!panel.open;},true);}
  function setAdminOpen(panel,value){if(panel.open!==value)panel.open=value;}
  function cleanAdmin(){
    const panel=document.getElementById('picksAdminPanel');const content=document.getElementById('picksAdminContent');if(!panel||!content||panel.hidden||!isAdmin())return;
    preserveAdminToggle(panel);sortAdminFights(content);const finalMode=isFinalEvent();panel.classList.toggle('picks-final-corrections',finalMode);const summary=panel.querySelector(':scope > summary');
    if(finalMode){if(summary)summary.childNodes[0].textContent='Results & Corrections ';if(adminPreferredOpen===null)adminPreferredOpen=false;setAdminOpen(panel,adminPreferredOpen);ensureCorrectionGate(panel,content);content.querySelector('.picks-admin-event-actions')?.setAttribute('hidden','');const note=content.querySelector('.picks-admin-note');if(note)note.textContent='Unresolved fights appear first. Existing picks and completed-event history stay intact when a result is corrected.';}
    else{correctionMode=false;panel.classList.remove('correction-mode');content.querySelector('.picks-correction-gate')?.remove();content.querySelector('.picks-admin-event-actions')?.removeAttribute('hidden');if(summary)summary.childNodes[0].textContent='Manage Live Results ';adminPreferredOpen=null;}
  }

  function sync(){if(syncing)return;syncing=true;try{enforceSettingsVisibility();cleanProfile();cleanCommissioner();cleanAdmin();}finally{syncing=false;}}
  function start(){installStyle();sync();resolveAdmin();const observer=new MutationObserver(()=>{clearTimeout(start.timer);start.timer=setTimeout(sync,90);});observer.observe(document.getElementById('picks')||document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class','open']});window.addEventListener('picks:routechange',()=>setTimeout(sync,30));['ufc-play-profile-ready','ufc-app-profile-updated'].forEach(name=>window.addEventListener(name,resolveAdmin));}
  window.UFC_PICKS_ADMIN_SETTINGS={version:VERSION,isAdmin,refresh:resolveAdmin};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();