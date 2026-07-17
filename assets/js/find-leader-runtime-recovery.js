(function(){
  'use strict';

  const VERSION='find-leader-runtime-recovery-20260717a';
  const RECENT_LIMIT=14;
  const FAMILY_CYCLE=['wins','finishes','record-book','era','championship','filtered','main-event','wins','finishes','record-book','filtered','streaks','quality','rates','longevity','durability'];
  const FILTER_FAMILIES={
    all:null,
    history:new Set(['era']),
    finishes:new Set(['finishes']),
    championship:new Set(['championship','main-event','quality']),
    statistics:new Set(['record-book','rates','longevity','durability','streaks','filtered','wins'])
  };
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const hashSeed=value=>{let hash=2166136261;for(let index=0;index<String(value).length;index+=1){hash^=String(value).charCodeAt(index);hash=Math.imul(hash,16777619);}return hash>>>0;};
  const mulberry32=seed=>{let value=seed>>>0;return()=>{value+=0x6D2B79F5;let next=value;next=Math.imul(next^(next>>>15),next|1);next^=next+Math.imul(next^(next>>>7),next|61);return((next^(next>>>14))>>>0)/4294967296;};};

  function install(){
    const bank=window.UFC_FIND_LEADER_QUESTION_BANK;
    const game=window.UFC_FIND_LEADER;
    const experience=window.UFC_FIND_LEADER_EXPERIENCE;
    if(!bank||!game||!experience||!bank.originalMethods?.audit||!bank.originalMethods?.buildDefinition)return false;
    if(bank.runtimeRecoveryVersion===VERSION)return true;

    const qualityEndless=typeof bank.endless==='function'?bank.endless.bind(bank):()=>null;
    const qualityDaily=typeof bank.daily==='function'?bank.daily.bind(bank):()=>null;
    const qualityAvailable=typeof bank.available==='function'?bank.available.bind(bank):()=>[];
    const raw=bank.originalMethods;

    function rawDefinitions(filter='all'){
      const families=FILTER_FAMILIES[filter]||null;
      const audit=raw.audit();
      return (audit?.rows||[])
        .filter(row=>row?.valid&&row?.definition&&(!families||families.has(row.definition.family)))
        .map(row=>row.definition);
    }

    function build(definition,random){
      const setup=definition?raw.buildDefinition(definition,random).setup:null;
      if(!setup)return null;
      setup.qualityGrade=setup.qualityGrade||'Verified fallback';
      setup.sourceLabel=setup.sourceLabel||({
        'official-record-book':'UFC Record Book',
        'main-event-ledger':'Main-Event Ledger',
        'canonical-ledger':'Canonical Fight Ledger'
      }[setup.sourceType]||setup.source?.name||'Verified UFC data');
      return setup;
    }

    function emergencyEndless(input={}){
      const history=Array.isArray(input.history)?input.history.map(String):[];
      const filter=FILTER_FAMILIES[input.filter]!==undefined?input.filter:'all';
      const slot=Math.max(0,Number(input.slot)||0);
      const random=typeof input.random==='function'?input.random:Math.random;
      const recent=new Set(history.slice(-RECENT_LIMIT));
      const valid=rawDefinitions(filter);
      if(!valid.length)return null;
      const fresh=valid.filter(row=>!recent.has(row.id));
      let pool=fresh.length?fresh:valid;
      if(filter==='all'){
        const preferred=pool.filter(row=>row.family===FAMILY_CYCLE[slot%FAMILY_CYCLE.length]);
        if(preferred.length)pool=preferred;
      }
      const definition=pool[Math.floor(random()*pool.length)]||pool[0];
      return build(definition,random);
    }

    function emergencyDaily(input={}){
      if(typeof raw.daily==='function'){
        const setup=raw.daily(input);
        if(setup)return setup;
      }
      const context=typeof input==='string'?{challenge_day:input}:input||{};
      const day=String(context.challenge_day||new Date().toISOString().slice(0,10));
      const random=mulberry32(hashSeed(`${bank.version}|${day}|recovery`));
      const rows=rawDefinitions('all');
      const definition=rows.length?rows[hashSeed(day)%rows.length]:null;
      return build(definition,random);
    }

    bank.endless=input=>qualityEndless(input)||emergencyEndless(input);
    bank.random=random=>bank.endless({random:typeof random==='function'?random:Math.random});
    bank.daily=input=>qualityDaily(input)||emergencyDaily(input);
    bank.available=()=>{
      const quality=qualityAvailable();
      if(Array.isArray(quality)&&quality.length)return quality;
      return rawDefinitions('all').map(definition=>build(definition,()=>0.5)).filter(Boolean);
    };

    const currentOpen=game.open.bind(game);
    function showRecovery(){
      const panel=document.getElementById('playFindLeaderPanel');
      if(!panel)return;
      panel.hidden=false;
      panel.innerHTML='<section class="find-leader-loading" data-find-leader-runtime-recovery><span>REBUILDING QUESTION BANK</span><h2>Find the Leader is reconnecting…</h2><p>The verified UFC data is still initializing. Tap retry, or return to All Games.</p><div class="find-leader-actions"><button type="button" class="find-leader-primary" data-find-leader-runtime-retry>RETRY</button><button type="button" class="find-leader-secondary" data-find-leader-home>ALL GAMES</button></div></section>';
    }
    game.open=options=>{
      const result=currentOpen(options);
      if(result===false)showRecovery();
      return result;
    };

    document.addEventListener('click',event=>{
      if(!event.target.closest?.('[data-find-leader-runtime-retry]'))return;
      event.preventDefault();
      game.open();
    },true);
    const retryIfVisible=()=>{
      if(document.querySelector('[data-find-leader-runtime-recovery]'))game.open();
    };
    window.addEventListener('ufc-scoring-pipeline-ready',retryIfVisible);
    window.addEventListener('ufc-production-ranking-ready',retryIfVisible);

    bank.runtimeRecoveryVersion=VERSION;
    game.runtimeRecoveryVersion=VERSION;
    window.UFC_FIND_LEADER_RUNTIME_RECOVERY={version:VERSION,emergencyEndless,emergencyDaily,rawDefinitions};
    document.documentElement.setAttribute('data-find-leader-runtime-recovery',VERSION);
    return true;
  }

  if(!install()){
    const timer=setInterval(()=>{if(install())clearInterval(timer);},80);
    setTimeout(()=>clearInterval(timer),20000);
    window.addEventListener('ufc-find-leader-quality-ready',install,{once:true});
    window.addEventListener('ufc-production-ranking-ready',install,{once:true});
  }
})();