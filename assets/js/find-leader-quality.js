(function(){
  'use strict';

  const VERSION='find-leader-quality-20260717a-control-center';
  const RECENT_LIMIT=14;
  const FAMILY_CYCLE=['wins','finishes','record-book','era','championship','filtered','main-event','wins','finishes','record-book','filtered','streaks','quality','rates','longevity','durability'];
  const FILTERS={
    all:{label:'All',families:null},
    history:{label:'History',families:new Set(['era'])},
    finishes:{label:'Finishes',families:new Set(['finishes'])},
    championship:{label:'Championship',families:new Set(['championship','main-event','quality'])},
    statistics:{label:'Statistics',families:new Set(['record-book','rates','longevity','durability','streaks','filtered','wins'])}
  };
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const normal=value=>String(value||'').trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const hashSeed=value=>{let hash=2166136261;for(let index=0;index<String(value).length;index+=1){hash^=String(value).charCodeAt(index);hash=Math.imul(hash,16777619);}return hash>>>0;};
  const mulberry32=seed=>{let value=seed>>>0;return()=>{value+=0x6D2B79F5;let next=value;next=Math.imul(next^(next>>>15),next|1);next^=next+Math.imul(next^(next>>>7),next|61);return((next^(next>>>14))>>>0)/4294967296;};};
  const dayNumber=day=>{const [year,month,date]=String(day||'2026-07-16').split('-').map(Number);return Math.floor(Date.UTC(year,month-1,date)/86400000);};
  const dayFromNumber=number=>new Date(number*86400000).toISOString().slice(0,10);

  function install(){
    const bank=window.UFC_FIND_LEADER_QUESTION_BANK;
    if(!bank||bank.qualityVersion===VERSION)return Boolean(bank);
    const original={
      audit:bank.audit.bind(bank),
      buildDefinition:bank.buildDefinition.bind(bank),
      create:bank.create.bind(bank),
      random:bank.random.bind(bank),
      daily:bank.daily?.bind(bank),
      dailyPlan:bank.dailyPlan?.bind(bank),
      scheduledDefinition:bank.scheduledDefinition?.bind(bank)
    };
    const definitions=bank.definitions.map(clone);
    const definitionById=new Map(definitions.map(row=>[row.id,row]));
    const dailyRules={
      anchor:String(bank.dailyRules?.anchor||'2026-07-16'),
      gameGapDays:Number(bank.dailyRules?.gameGapDays||6),
      noRepeatSelections:Number(bank.dailyRules?.noRepeatSelections||RECENT_LIMIT)
    };
    let cache=null;

    function isTitleFight(fight){
      const types=window.UFC_CANONICAL_FIGHTER_FACTS?.rules?.championshipTypes||{};
      return Boolean(types?.[fight?.championshipContext?.type]?.officialTitleFight)&&fight?.championshipContext?.fighterEligible!==false;
    }
    function matchesScope(record,definition){
      const scope=definition?.scope||{};
      if(scope.board&&record?.board!==scope.board)return false;
      if(scope.primaryDivision&&normal(record?.identity?.primaryDivision)!==normal(scope.primaryDivision))return false;
      if(scope.championsOnly){
        const titleWin=(Array.isArray(record?.fights)?record.fights:[]).some(fight=>fight?.scoringDisposition==='count-win'&&isTitleFight(fight));
        if(!titleWin)return false;
      }
      return true;
    }
    function resolved(names){
      const resolver=window.UFC_PLAY_DATA?.resolve;
      if(typeof resolver!=='function')return null;
      for(const name of names.filter(Boolean)){const row=resolver(name);if(row)return row;}
      return null;
    }
    function ledgerPool(definition){
      const api=window.UFC_CANONICAL_FIGHTER_FACTS;
      if(!api?.list)return [];
      return api.list().filter(record=>record?.coverage?.complete===true&&Array.isArray(record?.fights)&&matchesScope(record,definition)).map(record=>{
        const value=definition?.source==='main-event-ledger'
          ?window.UFC_FIND_LEADER_MAIN_EVENTS?.valueFor?.(record,definition.metric)
          :bank.valueFor(record,definition);
        const profile=resolved([record?.fighter]);
        return {
          id:String(profile?.id||normal(record?.fighter)),name:String(profile?.name||record?.fighter||''),value:Number(value),
          primaryDivision:String(profile?.primaryDivision||profile?.divisions?.[0]||record?.identity?.primaryDivision||''),
          thumbUrl:String(profile?.thumbUrl||''),profileUrl:String(profile?.profileUrl||''),resolved:Boolean(profile)
        };
      }).filter(row=>Number.isFinite(row.value)).sort((a,b)=>b.value-a.value||a.name.localeCompare(b.name)).map((row,index)=>({...row,statRank:index+1}));
    }
    function recordBookPool(definition){
      const metric=window.UFC_FIND_LEADER_RECORD_BOOK?.metrics?.[definition.recordBookMetric];
      return (Array.isArray(metric?.rows)?metric.rows:[]).map(row=>{
        const profile=resolved([row?.appName,row?.name,...(Array.isArray(row?.aliases)?row.aliases:[])]);
        const name=String(profile?.name||row?.appName||row?.name||'');
        return {
          id:String(profile?.id||normal(name)),name,value:Number(row?.value),primaryDivision:String(profile?.primaryDivision||profile?.divisions?.[0]||row?.primaryDivision||''),
          thumbUrl:String(profile?.thumbUrl||''),profileUrl:String(profile?.profileUrl||''),resolved:Boolean(profile)
        };
      }).filter(row=>Number.isFinite(row.value)).sort((a,b)=>b.value-a.value||a.name.localeCompare(b.name)).map((row,index)=>({...row,statRank:index+1}));
    }
    function poolFor(definition){return definition?.source==='official-record-book'?recordBookPool(definition):ledgerPool(definition);}
    function sourceLabel(definition){
      if(definition?.source==='official-record-book')return 'UFC Record Book';
      if(definition?.source==='main-event-ledger')return 'Main-Event Ledger';
      return 'Canonical Fight Ledger';
    }
    function gradeRow(baseRow,definition){
      if(!baseRow?.valid)return {
        grade:'Excluded',playable:false,issues:[String(baseRow?.reason||'Question failed validation.')],sourceLabel:sourceLabel(definition),topPool:[],
        leader:null,second:null,leaderMargin:null,leaderMarginPct:null,positivePoolCount:0,uniqueTopTenValues:0,missingPhotos:0,unresolvedNames:0
      };
      const pool=poolFor(definition),positive=pool.filter(row=>row.value>0),topPool=positive.slice(0,20),leader=positive[0]||null,second=positive[1]||null;
      const margin=leader&&second?leader.value-second.value:null;
      const marginPct=leader&&second&&leader.value?margin/leader.value:null;
      const uniqueTopTenValues=new Set(positive.slice(0,10).map(row=>row.value)).size;
      const missingPhotos=topPool.filter(row=>!row.thumbUrl&&!row.profileUrl).length;
      const unresolvedNames=topPool.filter(row=>!row.resolved).length;
      const issues=[];
      if(positive.length<14)issues.push(`Limited decoy depth: ${positive.length} positive performers.`);
      if(uniqueTopTenValues<=3)issues.push('Too many repeated values in the top 10.');
      if(Number.isFinite(marginPct)&&marginPct>=.7&&Number(leader?.value)>=5)issues.push('Leader margin may be too obvious.');
      if(missingPhotos)issues.push(`${missingPhotos} top-pool fighter${missingPhotos===1?' is':'s are'} missing a photo.`);
      if(unresolvedNames)issues.push(`${unresolvedNames} top-pool name${unresolvedNames===1?' is':'s are'} unresolved in app data.`);
      const serious=uniqueTopTenValues<=3||(Number.isFinite(marginPct)&&marginPct>=.7&&Number(leader?.value)>=5)||missingPhotos>2||unresolvedNames>0;
      const elite=!serious&&positive.length>=18&&uniqueTopTenValues>=6&&(!Number.isFinite(marginPct)||marginPct<=.35)&&missingPhotos===0;
      const grade=serious?'Needs review':elite?'Elite':'Good';
      return {
        grade,playable:grade==='Elite'||grade==='Good',issues,sourceLabel:sourceLabel(definition),topPool:topPool.map(clone),leader:clone(leader),second:clone(second),
        leaderMargin:margin,leaderMarginPct:Number.isFinite(marginPct)?Math.round(marginPct*1000)/10:null,positivePoolCount:positive.length,
        uniqueTopTenValues,missingPhotos,unresolvedNames
      };
    }
    function enhancedAudit(force=false){
      if(cache&&!force)return clone(cache);
      window.UFC_PLAY_DATA?.rebuild?.();
      const raw=original.audit();
      const rows=raw.rows.map(baseRow=>{
        const definition=definitionById.get(baseRow?.definition?.id)||baseRow.definition;
        const quality=gradeRow(baseRow,definition);
        return {...baseRow,definition:clone(definition),quality};
      });
      const gradeCounts=rows.reduce((counts,row)=>{const grade=row.quality.grade;counts[grade]=(counts[grade]||0)+1;return counts;},{});
      const report={...raw,version:`${raw.version}+${VERSION}`,rows,gradeCounts,playable:rows.filter(row=>row.quality.playable).map(row=>row.definition.id),
        excluded:rows.filter(row=>!row.valid).map(row=>({questionId:row.definition.id,reason:row.reason})),
        needsReview:rows.filter(row=>row.valid&&row.quality.grade==='Needs review').map(row=>row.definition.id)};
      const transient=rows.some(row=>!row.valid&&/not-ready/.test(String(row.reason||'')));
      if(!transient)cache=report;
      return clone(report);
    }
    function rowFor(id){return enhancedAudit().rows.find(row=>row.definition.id===id)||null;}
    function attachQuality(setup,id){
      if(!setup)return null;
      const row=rowFor(id||setup.questionId),quality=row?.quality;
      if(!quality)return setup;
      setup.qualityGrade=quality.grade;
      setup.sourceLabel=quality.sourceLabel;
      setup.leaderMargin=quality.leaderMargin;
      setup.secondValue=quality.second?.value??null;
      setup.secondName=quality.second?.name||null;
      setup.fullPoolCount=quality.positivePoolCount;
      setup.uniqueTopTenValues=quality.uniqueTopTenValues;
      return setup;
    }
    function playableDefinitions(filter='all'){
      const rule=FILTERS[filter]||FILTERS.all;
      return enhancedAudit().rows.filter(row=>row.quality.playable&&(!rule.families||rule.families.has(row.definition.family))).map(row=>row.definition);
    }
    function randomDefinition(rows,random=Math.random){return rows.length?rows[Math.floor(random()*rows.length)]||rows[0]:null;}
    function endless(input={}){
      const history=Array.isArray(input.history)?input.history.map(String):[];
      const filter=FILTERS[input.filter]?input.filter:'all';
      const slot=Math.max(0,Number(input.slot)||0);
      const random=typeof input.random==='function'?input.random:Math.random;
      const recent=new Set(history.slice(-RECENT_LIMIT));
      const eligible=playableDefinitions(filter);
      if(!eligible.length)return null;
      const fresh=eligible.filter(row=>!recent.has(row.id));
      let pool=fresh.length?fresh:eligible;
      if(filter==='all'){
        const family=FAMILY_CYCLE[slot%FAMILY_CYCLE.length];
        const preferred=pool.filter(row=>row.family===family);
        if(preferred.length)pool=preferred;
      }
      const definition=randomDefinition(pool,random);
      return definition?attachQuality(original.buildDefinition(definition,random).setup,definition.id):null;
    }
    const deterministicOrder=(rows,slot)=>[...rows].sort((a,b)=>hashSeed(`${bank.version}|${VERSION}|${slot}|${a.id}`)-hashSeed(`${bank.version}|${VERSION}|${slot}|${b.id}`)||a.id.localeCompare(b.id));
    function occurrenceForDay(day){return Math.max(0,Math.floor((dayNumber(day)-dayNumber(dailyRules.anchor))/dailyRules.gameGapDays));}
    function scheduledDefinition(day){
      const eligible=playableDefinitions('all');
      if(!eligible.length)return null;
      const targetSlot=occurrenceForDay(day),history=[];
      let selected=null;
      for(let slot=0;slot<=targetSlot;slot+=1){
        const recent=new Set(history.slice(-dailyRules.noRepeatSelections)),family=FAMILY_CYCLE[slot%FAMILY_CYCLE.length];
        const preferred=eligible.filter(row=>row.family===family&&!recent.has(row.id));
        const fresh=eligible.filter(row=>!recent.has(row.id));
        const pool=preferred.length?preferred:fresh.length?fresh:eligible;
        selected=deterministicOrder(pool,slot)[0]||null;
        if(selected)history.push(selected.id);
      }
      return selected;
    }
    function daily(input={}){
      const context=typeof input==='string'?{challenge_day:input}:input||{};
      const day=String(context.challenge_day||dailyRules.anchor),definition=scheduledDefinition(day);
      if(!definition)return null;
      const seed=String(context.seed||context.challenge_key||`find-leader|${day}|${bank.version}`),random=mulberry32(hashSeed(`${seed}|${definition.id}|${VERSION}`));
      return attachQuality(original.buildDefinition(definition,random).setup,definition.id);
    }
    function dailyPlan(startDay=dailyRules.anchor,count=20){
      const startSlot=occurrenceForDay(startDay),rows=[];
      for(let offset=0;offset<Math.max(0,count);offset+=1){
        const slot=startSlot+offset,day=dayFromNumber(dayNumber(dailyRules.anchor)+(slot*dailyRules.gameGapDays)),definition=scheduledDefinition(day);
        rows.push({slot,day,questionId:definition?.id||null,family:definition?.family||null,grade:definition?rowFor(definition.id)?.quality?.grade||null:null});
      }
      return rows;
    }

    bank.audit=enhancedAudit;
    bank.refreshAudit=()=>enhancedAudit(true);
    bank.available=()=>playableDefinitions('all').map(definition=>attachQuality(original.buildDefinition(definition,()=>.5).setup,definition.id)).filter(Boolean);
    bank.random=random=>endless({random:typeof random==='function'?random:Math.random});
    bank.create=(questionId,random=Math.random)=>{const definition=definitionById.get(questionId);return definition?attachQuality(original.buildDefinition(definition,random).setup,questionId):null;};
    bank.endless=endless;
    bank.daily=daily;
    bank.dailyPlan=dailyPlan;
    bank.scheduledDefinition=scheduledDefinition;
    bank.qualityFor=questionId=>clone(rowFor(questionId)?.quality||null);
    bank.playableDefinitions=filter=>playableDefinitions(filter).map(clone);
    bank.filters=Object.fromEntries(Object.entries(FILTERS).map(([id,row])=>[id,{label:row.label}]));
    bank.qualityVersion=VERSION;
    bank.originalMethods=original;
    document.documentElement.setAttribute('data-find-leader-quality',VERSION);
    window.dispatchEvent(new CustomEvent('ufc-find-leader-quality-ready',{detail:{version:VERSION}}));
    return true;
  }

  if(!install()){
    window.addEventListener('ufc-scoring-pipeline-ready',install,{once:true});
    window.addEventListener('ufc-production-ranking-ready',install,{once:true});
    const timer=setInterval(()=>{if(install())clearInterval(timer);},100);
    setTimeout(()=>clearInterval(timer),20000);
  }
})();
