// Explicit Rankings nickname presentation and thumbnail-surface polish.
// Canonical fighter keys stay unchanged. This file owns nickname position data;
// visible formatting is shared through window.UFC_FORMAT_FIGHTER_NAME.
(function(){
  'use strict';

  const VERSION='rankings-presentation-20260728a';
  const POSITIONS=new Set(['prefix','middle','suffix']);
  const PRESENTATION=Object.freeze({
    'Alexandre Pantoja':{nickname:'The Cannibal',position:'middle'},
    'Anthony Pettis':{nickname:'Showtime',position:'middle'},
    'Brandon Moreno':{nickname:'The Assassin Baby',position:'middle'},
    'Brock Lesnar':{nickname:'The Beast Incarnate',position:'middle'},
    'Chael Sonnen':{nickname:'The American Gangster',position:'middle'},
    'Chris Weidman':{nickname:'The All-American',position:'middle'},
    'Conor McGregor':{nickname:'The Notorious',position:'prefix'},
    'Deiveson Figueiredo':{nickname:'Deus da Guerra',position:'middle'},
    'Dricus du Plessis':{nickname:'Stillknocks',position:'middle'},
    'Junior dos Santos':{nickname:'Cigano',position:'middle'},
    'Khamzat Chimaev':{nickname:'Borz',position:'middle'},
    'Lyoto Machida':{nickname:'The Dragon',position:'middle'},
    'Mauricio "Shogun" Rua':{nickname:'Shogun',position:'middle',baseName:'Mauricio Rua'},
    'Maurício "Shogun" Rua':{nickname:'Shogun',position:'middle',baseName:'Mauricio Rua'},
    'Mauricio Rua':{nickname:'Shogun',position:'middle',baseName:'Mauricio Rua'},
    'Maurício Rua':{nickname:'Shogun',position:'middle',baseName:'Mauricio Rua'},
    'Michael Bisping':{nickname:'The Count',position:'middle'},
    'Miesha Tate':{nickname:'Cupcake',position:'middle'},
    'Quinton Jackson':{nickname:'Rampage',position:'middle'},
    'Robbie Lawler':{nickname:'Ruthless',position:'middle'},
    'Robert Whittaker':{nickname:'The Reaper',position:'middle'},
    'Rose Namajunas':{nickname:'Thug',position:'prefix'},
    "Sean O'Malley":{nickname:'Sugar',position:'prefix',baseName:'Sean O’Malley'},
    'Sean Strickland':{nickname:'Tarzan',position:'middle'},
    'Tito Ortiz':{nickname:'The Huntington Beach Bad Boy',position:'middle'},
    'Tom Aspinall':{nickname:'Honey Badger',position:'middle'},
    'Tony Ferguson':{nickname:'El Cucuy',position:'middle'},
    'Tyron Woodley':{nickname:'The Chosen One',position:'middle'},
    'Zhang Weili':{nickname:'Magnum',position:'middle'}
  });
  const RESUME_TAG_RESTORE={
    'Dricus du Plessis':'Two-division title threat',
    'Tyron Woodley':'Welterweight title enforcer',
    'Sean Strickland':'Awkward title spoiler',
    'Robert Whittaker':'Middleweight elite mainstay',
    "Sean O'Malley":'Bantamweight star champion',
    'Lyoto Machida':'Karate-era LHW champion',
    'Khamzat Chimaev':'Explosive short-window title case',
    'Deiveson Figueiredo':'Flyweight chaos champion',
    'Tito Ortiz':'Early UFC title-reign anchor',
    'Junior dos Santos':'Heavyweight win-streak destroyer',
    'Michael Bisping':'Middleweight title shocker',
    'Tony Ferguson':'Uncrowned lightweight terror',
    'Brock Lesnar':'Short-window heavyweight champ',
    'Chael Sonnen':'Middleweight title agitator',
    'Robbie Lawler':'Ruthless title-war champion',
    'Zhang Weili':'Two-reign strawweight force',
    'Rose Namajunas':'Two-reign strawweight giant killer',
    'Miesha Tate':'Bantamweight title comeback'
  };
  const SHOGUN_LINKS={
    signatureFightUrl:'https://youtu.be/08YmP1EM2ms?is=gQIDS9i91zPsk3kX',
    signatureFightLabel:'Watch Signature Fight',
    watchUrl:'https://youtube.com/shorts/F6K-CKBntck?is=heruCDLgIBMrWtQc',
    watchLabel:'Watch Moment'
  };

  function cleanNickname(value){
    return String(value||'').trim().replace(/^[“”"']+|[“”"']+$/g,'').trim();
  }
  function normalizeName(value){
    return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[“”"'’‘`´]/g,' ').replace(/\bshogun\b/gi,' ').replace(/[^a-z0-9]+/gi,' ').replace(/\s+/g,' ').trim().toLowerCase();
  }
  function isShogunName(value){
    const normalized=normalizeName(value);
    return normalized==='mauricio'||normalized==='mauricio rua';
  }
  function presentationFor(value){
    const name=String(value?.fighter||value||'').trim();
    if(PRESENTATION[name])return PRESENTATION[name];
    if(isShogunName(name))return PRESENTATION['Mauricio Rua'];
    return null;
  }
  function formatFighterName(value){
    const canonical=String(value?.fighter||value||'').trim();
    if(!canonical)return'';
    const entry=presentationFor(canonical);
    const overrides=window.DISPLAY_OVERRIDES||{};
    const fallback=overrides[canonical]||{};
    if(!entry)return fallback.displayName||fallback.profileDisplayName||canonical;
    const nickname=cleanNickname(entry.nickname);
    const position=String(entry.position||'').toLowerCase();
    const baseName=String(entry.baseName||canonical).trim();
    if(!nickname||!POSITIONS.has(position))return fallback.displayName||fallback.profileDisplayName||baseName;
    const quoted=`“${nickname}”`;
    if(position==='prefix')return`${quoted} ${baseName}`;
    if(position==='suffix')return`${baseName} ${quoted}`;
    const parts=baseName.split(/\s+/).filter(Boolean);
    return parts.length<2?`${baseName} ${quoted}`:`${parts[0]} ${quoted} ${parts.slice(1).join(' ')}`;
  }

  function syncOverrides(){
    const overrides=window.DISPLAY_OVERRIDES||(window.DISPLAY_OVERRIDES={});
    Object.entries(PRESENTATION).forEach(([fighter,entry])=>{
      const override=overrides[fighter]||(overrides[fighter]={});
      override.nickname=entry.nickname;
      override.nicknamePosition=entry.position;
      override.displayBaseName=entry.baseName||fighter;
      override.displayName=formatFighterName(fighter);
      override.profileDisplayName=override.displayName;
      if(RESUME_TAG_RESTORE[fighter])override.resumeTag=RESUME_TAG_RESTORE[fighter];
      if(isShogunName(fighter))Object.assign(override,SHOGUN_LINKS);
    });
  }

  function installBlackThumbnailSurface(){
    if(document.getElementById('rankings-true-black-thumbnails'))return;
    const style=document.createElement('style');
    style.id='rankings-true-black-thumbnails';
    style.textContent='#menList .row-photo,#womenList .row-photo,#divisionList .row-photo,#categoryBoardList .row-photo{background:#000000!important}#menList .row-photo img,#womenList .row-photo img,#divisionList .row-photo img,#categoryBoardList .row-photo img{background:#000000!important}';
    document.head.appendChild(style);
  }

  function applyVisibleNames(root=document){
    root.querySelectorAll?.('#menList [data-fighter],#womenList [data-fighter],#divisionList [data-fighter],#categoryBoardList [data-fighter]').forEach(row=>{
      const canonical=row.getAttribute('data-fighter')||'';
      const displayName=formatFighterName(canonical);
      const label=row.querySelector('.name');
      if(label&&label.textContent!==displayName)label.textContent=displayName;
      const image=row.querySelector('.row-photo img');
      if(image)image.alt=`${displayName} thumbnail`;
    });
    const drawer=document.getElementById('drawer');
    const canonical=drawer?.dataset?.fighter;
    const heading=document.querySelector('#fighterDetail .profile-summary h2');
    if(canonical&&heading){
      const displayName=formatFighterName(canonical);
      if(heading.textContent!==displayName)heading.textContent=displayName;
    }
  }

  function updateKpi(id,rows){
    const top=rows?.[0];
    const label=document.querySelector(`#${id} .kpi:nth-child(2) span`);
    if(top&&label)label.textContent=formatFighterName(top.fighter);
  }
  function assignGlobal(name,value){
    window[name]=value;
    try{
      if(name==='openFighter')openFighter=value;
      else if(name==='renderList')renderList=value;
      else if(name==='renderDivision')renderDivision=value;
      else if(name==='setKpis')setKpis=value;
    }catch(error){}
  }
  function installWrappers(){
    const originalOpen=window.openFighter;
    if(typeof originalOpen==='function'&&!originalOpen.__explicitNicknameWrapped){
      const wrapped=function(name){
        const result=originalOpen.apply(this,arguments);
        const drawer=document.getElementById('drawer');
        if(drawer)drawer.dataset.fighter=String(name||'');
        applyVisibleNames(document);
        return result;
      };
      wrapped.__explicitNicknameWrapped=true;
      assignGlobal('openFighter',wrapped);
    }
    const originalList=window.renderList;
    if(typeof originalList==='function'&&!originalList.__explicitNicknameWrapped){
      const wrapped=function(containerId,rows){
        const result=originalList.apply(this,arguments);
        applyVisibleNames(document.getElementById(containerId)||document);
        return result;
      };
      wrapped.__explicitNicknameWrapped=true;
      assignGlobal('renderList',wrapped);
    }
    const originalDivision=window.renderDivision;
    if(typeof originalDivision==='function'&&!originalDivision.__explicitNicknameWrapped){
      const wrapped=function(){
        const result=originalDivision.apply(this,arguments);
        applyVisibleNames(document.getElementById('divisionList')||document);
        return result;
      };
      wrapped.__explicitNicknameWrapped=true;
      assignGlobal('renderDivision',wrapped);
    }
    const originalKpis=window.setKpis;
    if(typeof originalKpis==='function'&&!originalKpis.__explicitNicknameWrapped){
      const wrapped=function(id,rows){
        const result=originalKpis.apply(this,arguments);
        updateKpi(id,rows);
        return result;
      };
      wrapped.__explicitNicknameWrapped=true;
      assignGlobal('setKpis',wrapped);
    }
  }

  let queued=false;
  function queueApply(){
    if(queued)return;
    queued=true;
    Promise.resolve().then(()=>{
      queued=false;
      syncOverrides();
      installWrappers();
      applyVisibleNames(document);
      const data=window.RANKING_DATA||{};
      updateKpi('menStats',data.men||[]);
      updateKpi('womenStats',data.women||[]);
    });
  }
  function apply(){
    syncOverrides();
    installBlackThumbnailSurface();
    installWrappers();
    queueApply();
  }

  window.UFC_NICKNAME_PRESENTATION=PRESENTATION;
  window.UFC_FORMAT_FIGHTER_NAME=formatFighterName;
  window.UFC_CARD_NICKNAMES={
    version:VERSION,
    fighters:Object.keys(PRESENTATION),
    positions:Array.from(POSITIONS),
    displayNames:Object.fromEntries(Object.keys(PRESENTATION).map(fighter=>[fighter,formatFighterName(fighter)])),
    scope:'rankings-profile-explicit-position-and-black-thumbnail-surface',
    formatterOwner:'assets/js/card-nicknames.js'
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
  document.addEventListener('click',queueApply);
  document.addEventListener('input',queueApply);
  document.addEventListener('change',queueApply);
  ['ufc-ranking-data-patches-ready','ufc-scoring-pipeline-ready','ufc-production-ranking-ready'].forEach(eventName=>window.addEventListener(eventName,apply));
})();
