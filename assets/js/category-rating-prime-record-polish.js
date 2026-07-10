// Presentation cleanup for category ratings and Prime Record snapshots.
// Keeps scoring, ranks, tier thresholds, and tier colors unchanged.
(function(){
  'use strict';

  const VERSION='category-rating-prime-record-polish-20260710b';
  const DATA=window.RANKING_DATA;
  const OVERRIDES=window.DISPLAY_OVERRIDES||{};
  const EXPLICIT_PRIME_RECORDS={
    'Michael Bisping':'7-4'
  };
  const FORBIDDEN_TEXT_PARENTS=new Set(['SCRIPT','STYLE','NOSCRIPT','TEMPLATE']);

  function normalizeName(value){
    return String(value||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  }

  function normalizePrimeRecord(value){
    const text=String(value??'').trim();
    if(!text||text==='—') return null;
    const match=text.match(/(?:^|[^0-9])(\d+)\s*-\s*(\d+)(?:\s*-\s*(\d+))?(?:\s*[,;]?\s*\(?\s*(\d+)\s*NC\s*\)?)?/i);
    if(!match) return null;
    const wins=Number(match[1]);
    const losses=Number(match[2]);
    const draws=match[3]===undefined?null:Number(match[3]);
    const noContests=match[4]===undefined?null:Number(match[4]);
    return `${wins}-${losses}${draws===null?'':`-${draws}`}${noContests===null?'':`, ${noContests} NC`}`;
  }

  function snapshotValue(override,label){
    if(!Array.isArray(override?.snapshot)) return null;
    return override.snapshot.find(item=>Array.isArray(item)&&item[0]===label)?.[1]??null;
  }

  function mergedRow(name){
    const profile=(DATA?.fighters||[]).find(row=>row?.fighter===name)||{};
    const board=[...(DATA?.men||[]),...(DATA?.women||[])].find(row=>row?.fighter===name)||{};
    return {...profile,...board};
  }

  function primeRecordCandidates(name,row){
    const override=OVERRIDES[name]||{};
    return [
      row?.snapshotStats?.primeRecord,
      override?.snapshotStats?.primeRecord,
      override?.packetProfileStats?.primeRecord,
      row?.primeRecord,
      row?.primeUfcRecord,
      row?.prime_record,
      snapshotValue(override,'Prime Record')
    ].filter(value=>value!==null&&value!==undefined&&String(value).trim()!=='');
  }

  function rawPrimeRecordFor(name,row){
    const candidates=primeRecordCandidates(name,row);
    return candidates.find(value=>normalizePrimeRecord(value))??candidates[0]??null;
  }

  function ledgerComputedRecord(name,row){
    const ledger=window.UFC_FIGHTER_ERA_LEDGERS?.entryFor?.(name)||null;
    const start=String(ledger?.window?.start||'').trim();
    const end=String(ledger?.window?.end||'').trim();
    const rounds=Array.isArray(row?.rounds)?row.rounds:[];
    if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||!rounds.length) return null;
    let wins=0,losses=0,draws=0,noContests=0,counted=0;
    rounds.forEach(fight=>{
      const date=String(fight?.date||'').trim();
      if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||date<start||(end&&/^\d{4}-\d{2}-\d{2}$/.test(end)&&date>end)) return;
      const text=[fight?.method,fight?.result,fight?.notes].filter(Boolean).join(' ').toLowerCase();
      if(/\bno contest\b|\bnc\b/.test(text)){noContests+=1;counted+=1;return;}
      if(/\bdraw\b/.test(text)){draws+=1;counted+=1;return;}
      if(/\bwin\b/.test(text)){wins+=1;counted+=1;return;}
      if(/\bloss\b/.test(text)){losses+=1;counted+=1;}
    });
    if(!counted) return null;
    return `${wins}-${losses}${draws?`-${draws}`:''}${noContests?`, ${noContests} NC`:''}`;
  }

  function patchSnapshotArray(override,record){
    if(!Array.isArray(override?.snapshot)) return;
    override.snapshot=override.snapshot.map(item=>Array.isArray(item)&&item[0]==='Prime Record'?[item[0],record]:item);
  }

  function patchPrimeRecord(name,record,context){
    const profile=(DATA?.fighters||[]).find(row=>row?.fighter===name)||null;
    const board=[...(DATA?.men||[]),...(DATA?.women||[])].find(row=>row?.fighter===name)||null;
    [profile,board].filter(Boolean).forEach(target=>{
      target.primeRecord=record;
      if(target.snapshotStats&&typeof target.snapshotStats==='object') target.snapshotStats.primeRecord=record;
      if(context&&!target.primeRecordContext) target.primeRecordContext=context;
    });
    const override=OVERRIDES[name]||(OVERRIDES[name]={});
    override.snapshotStats={...(override.snapshotStats||{}),primeRecord:record};
    if(override.packetProfileStats) override.packetProfileStats={...override.packetProfileStats,primeRecord:record};
    if(context&&!override.primeRecordContext) override.primeRecordContext=context;
    patchSnapshotArray(override,record);

    const packet=window.UFC_FIGHTER_PACKETS?.[name];
    if(packet){
      if(packet.profile) packet.profile.primeRecord=record;
      if(packet.boardRow) packet.boardRow.primeRecord=record;
      if(packet.profileStats) packet.profileStats.primeRecord=record;
      if(packet.display?.snapshotStats) packet.display.snapshotStats.primeRecord=record;
      if(context&&!packet.primeRecordContext) packet.primeRecordContext=context;
    }
  }

  function ratingLanguage(value){
    return String(value||'')
      .replace(/\bPCTL\b/g,'RATING')
      .replace(/\b(\d+)(?:st|nd|rd|th) percentile\b/gi,'$1 category rating')
      .replace(/\bpercentile-style scores\b/gi,'category ratings')
      .replace(/\bpercentile\b/gi,'rating');
  }

  function allowedTextNode(node){
    return Boolean(node&&node.parentElement&&!FORBIDDEN_TEXT_PARENTS.has(node.parentElement.tagName));
  }

  function polishDom(root){
    if(!root) return;
    if(root.nodeType===Node.ELEMENT_NODE&&FORBIDDEN_TEXT_PARENTS.has(root.tagName)) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:node=>allowedTextNode(node)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const next=ratingLanguage(node.nodeValue);
      if(next!==node.nodeValue) node.nodeValue=next;
    });
    if(root.querySelectorAll){
      root.querySelectorAll('[aria-label],[title]').forEach(element=>{
        if(FORBIDDEN_TEXT_PARENTS.has(element.tagName)) return;
        ['aria-label','title'].forEach(attr=>{
          const current=element.getAttribute(attr);
          if(current){const next=ratingLanguage(current);if(next!==current)element.setAttribute(attr,next);}
        });
      });
    }
  }

  function wrapHtmlFunction(name){
    const original=window[name];
    if(typeof original!=='function'||original.__categoryRatingPolishWrapped) return false;
    const wrapped=function(...args){
      const result=original.apply(this,args);
      return typeof result==='string'?ratingLanguage(result):result;
    };
    wrapped.__categoryRatingPolishWrapped=true;
    wrapped.__original=original;
    window[name]=wrapped;
    return true;
  }

  function wrapRenderFunction(name){
    const original=window[name];
    if(typeof original!=='function'||original.__categoryRatingPolishWrapped) return false;
    const wrapped=function(...args){
      const result=original.apply(this,args);
      polishDom(document.body);
      return result;
    };
    wrapped.__categoryRatingPolishWrapped=true;
    wrapped.__original=original;
    window[name]=wrapped;
    return true;
  }

  const boardRows=[...(DATA?.men||[]),...(DATA?.women||[])];
  const duplicateNames=[];
  const seen=new Set();
  boardRows.forEach(row=>{
    const key=normalizeName(row?.fighter);
    if(seen.has(key)) duplicateNames.push(row?.fighter);
    else seen.add(key);
  });

  const rows=boardRows.map(boardRow=>{
    const fighter=boardRow.fighter;
    const row=mergedRow(fighter);
    const raw=rawPrimeRecordFor(fighter,row);
    const normalized=normalizePrimeRecord(raw);
    const explicit=EXPLICIT_PRIME_RECORDS[fighter]||null;
    const computed=normalized||explicit?null:ledgerComputedRecord(fighter,row);
    const record=normalized||explicit||computed;
    const source=normalized?'existing-record':explicit?'explicit-reviewed':computed?'era-ledger-rounds':'unresolved';
    const context=raw&&record&&String(raw).trim()!==record?String(raw).trim():null;
    if(record) patchPrimeRecord(fighter,record,context);
    return {fighter,raw,record:record||null,context,source,passed:Boolean(record&&normalizePrimeRecord(record))};
  });

  const unresolved=rows.filter(row=>!row.passed);

  const evidenceOriginal=window.categoryEvidenceItems;
  if(typeof evidenceOriginal==='function'&&!evidenceOriginal.__primeRecordContextWrapped){
    const wrapped=function(f,key){
      const items=evidenceOriginal.call(this,f,key)||[];
      if(key!=='primeDominance') return items;
      const context=f?.primeRecordContext||OVERRIDES[f?.fighter]?.primeRecordContext||null;
      const hasWindow=items.some(item=>/window/i.test(String(item?.[0]||'')));
      if(context&&!hasWindow) items.unshift(['Prime window context',context]);
      return items;
    };
    wrapped.__primeRecordContextWrapped=true;
    window.categoryEvidenceItems=wrapped;
  }

  const htmlWrappers=['categoryCards','categoryExplanation','categoryMeter','categoryChip'];
  const renderWrappers=['refresh','openFighter','renderCompare','renderRules','renderDivision'];
  const wrappedHtml=htmlWrappers.filter(wrapHtmlFunction);
  const wrappedRender=renderWrappers.filter(wrapRenderFunction);

  if(document.body){
    polishDom(document.body);
    const observer=new MutationObserver(mutations=>{
      mutations.forEach(mutation=>mutation.addedNodes.forEach(node=>{
        if(node.nodeType===Node.TEXT_NODE&&allowedTextNode(node)){
          const next=ratingLanguage(node.nodeValue);
          if(next!==node.nodeValue) node.nodeValue=next;
        }else if(node.nodeType===Node.ELEMENT_NODE&&!FORBIDDEN_TEXT_PARENTS.has(node.tagName)){
          polishDom(node);
        }
      }));
    });
    observer.observe(document.body,{childList:true,subtree:true});
    window.UFC_CATEGORY_RATING_PRIME_RECORD_OBSERVER=observer;
  }

  const report={
    version:VERSION,
    mutatesScores:false,
    fighterCount:boardRows.length,
    auditedPrimeRecords:rows.length,
    resolvedPrimeRecords:rows.length-unresolved.length,
    unresolved,
    duplicateNames,
    rows,
    tierThresholdsUnchanged:true,
    tierColorsUnchanged:true,
    ratingLanguageInstalled:true,
    wrappedHtml,
    wrappedRender,
    passed:boardRows.length>0&&unresolved.length===0&&duplicateNames.length===0
  };

  window.UFC_CATEGORY_RATING_PRIME_RECORD_POLISH=report;
  document.documentElement.setAttribute('data-category-rating-prime-record-polish',VERSION);
})();
