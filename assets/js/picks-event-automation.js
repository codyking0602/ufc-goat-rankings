(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  if(!config.url || !config.anonKey || !window.supabase?.createClient) return;

  const client=window.supabase.createClient(config.url,config.anonKey);
  const GROUP_ADMIN_PREFIX='ufc-picks:group-admin:';
  const state={
    code:'',adminToken:'',events:[],selectedId:'',loading:false,signature:'',
    cardText:'',oddsText:'',source:'Manual card paste',spacing:30,buffer:15,
    orderMode:'auto',removeMissing:false,updateHeadline:true,cardPreview:null,oddsPreview:null
  };

  const safe=value=>String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalizeCode=value=>String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  const normalizeName=value=>String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'');
  const pairKey=(a,b)=>[normalizeName(a),normalizeName(b)].sort().join('::');
  const SECTION_MAP=new Map([
    ['mainevent','Main Event'],['main','Main Event'],['comainevent','Co-Main Event'],['comain','Co-Main Event'],
    ['maincard','Main Card'],['prelims','Prelims'],['preliminarycard','Prelims'],['preliminary','Prelims'],
    ['earlyprelims','Early Prelims'],['earlypreliminarycard','Early Prelims']
  ]);
  const WEIGHT_HINTS=['strawweight','flyweight','bantamweight','featherweight','lightweight','welterweight','middleweight','heavyweight','catchweight','weight bout'];

  function toast(message){
    const node=document.getElementById('picksToast');
    if(!node) return;
    node.textContent=message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.classList.remove('show'),1900);
  }

  function resolveOwner(){
    const urlCode=normalizeCode(new URL(window.location.href).searchParams.get('group'));
    if(urlCode){
      const token=localStorage.getItem(`${GROUP_ADMIN_PREFIX}${urlCode}`);
      if(token) return {code:urlCode,token};
    }
    const matches=[];
    for(let index=0;index<localStorage.length;index+=1){
      const key=localStorage.key(index) || '';
      if(!key.startsWith(GROUP_ADMIN_PREFIX)) continue;
      const code=normalizeCode(key.slice(GROUP_ADMIN_PREFIX.length));
      const token=localStorage.getItem(key);
      if(code && token) matches.push({code,token});
    }
    return matches.length===1 ? matches[0] : null;
  }

  function ensureCard(){
    if(document.getElementById('picksAutomationCard')) return;
    const shell=document.querySelector('#picks .picks-shell');
    if(!shell) return;
    const card=document.createElement('details');
    card.id='picksAutomationCard';
    card.className='picks-automation-card';
    card.hidden=true;
    card.innerHTML='<summary><div><span>PHASE 11</span><strong>Card Automation</strong></div><b id="picksAutomationSummary">Paste · compare · sync</b></summary><div id="picksAutomationContent" class="picks-automation-content"></div>';
    const manager=document.getElementById('picksEventManagerCard');
    const social=document.getElementById('picksSocialCard');
    if(manager) manager.insertAdjacentElement('afterend',card);
    else if(social) social.insertAdjacentElement('beforebegin',card);
    else shell.prepend(card);
  }

  function selectedEvent(){
    return state.events.find(event=>event.id===state.selectedId) || state.events.find(event=>['hidden','upcoming'].includes(event.status)) || state.events[0] || null;
  }

  function statusLabel(status){
    return status==='hidden' ? 'Draft' : String(status || '').charAt(0).toUpperCase()+String(status || '').slice(1);
  }

  function formatDate(value){
    if(!value) return 'TBD';
    return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value));
  }

  function formatOdds(value){
    const number=Number(value);
    if(!Number.isFinite(number) || number===0) return '—';
    return number>0 ? `+${number}` : String(number);
  }

  function normalizeSection(value){
    const key=normalizeName(value);
    return SECTION_MAP.get(key) || '';
  }

  function looksLikeWeight(value){
    const text=String(value || '').toLowerCase();
    return WEIGHT_HINTS.some(hint=>text.includes(hint));
  }

  function parseOddsValue(value){
    const match=String(value || '').match(/(?:^|\s)([+-]\d{2,4})(?:\s|$)/);
    if(!match) return null;
    const number=Number(match[1]);
    return Number.isFinite(number) && number!==0 ? number : null;
  }

  function stripOdds(value){
    return String(value || '').replace(/(?:^|\s)[+-]\d{2,4}(?=\s|$)/g,' ').replace(/\s+/g,' ').trim();
  }

  function splitFields(line){
    if(line.includes('\t')) return line.split('\t').map(item=>item.trim()).filter(Boolean);
    if(line.includes('|')) return line.split('|').map(item=>item.trim()).filter(Boolean);
    if(line.includes(';')) return line.split(';').map(item=>item.trim()).filter(Boolean);
    const commas=(line.match(/,/g) || []).length;
    if(commas>=2) return line.split(',').map(item=>item.trim()).filter(Boolean);
    return [line.trim()];
  }

  function vsNames(value){
    const match=String(value || '').match(/^(.+?)\s+(?:vs\.?|v\.?|versus)\s+(.+)$/i);
    if(!match) return null;
    const red=stripOdds(match[1]);
    const blue=stripOdds(match[2]);
    return red && blue ? {red,blue} : null;
  }

  function inferSection(order,total,eventType){
    if(eventType==='fight-night'){
      if(order===total) return 'Main Event';
      if(order===total-1) return 'Co-Main Event';
      return 'Main Card';
    }
    if(order===total) return 'Main Event';
    if(order===total-1) return 'Co-Main Event';
    if(order>=Math.max(1,total-4)) return 'Main Card';
    if(order>=Math.max(1,total-8)) return 'Prelims';
    return 'Early Prelims';
  }

  function shouldReverse(rows,rawSections){
    if(state.orderMode==='main-event-first') return true;
    if(state.orderMode==='first-fight-first') return false;
    if(rows.some(row=>row.explicitOrder)) return false;
    const first=rawSections.find(Boolean) || rows[0]?.section || '';
    const laterPrelims=rawSections.some(section=>section==='Prelims' || section==='Early Prelims');
    return first==='Main Event' || first==='Co-Main Event' || (first==='Main Card' && laterPrelims);
  }

  function parseCard(event){
    const lines=state.cardText.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
    const rows=[];
    const ignored=[];
    const rawSections=[];
    let currentSection='';
    let sequence=0;

    lines.forEach((raw,index)=>{
      const line=raw.replace(/^[-•*]\s*/,'').trim();
      if(!line || /^#/.test(line)) return;
      const exactSection=normalizeSection(line.replace(/[:\-–—]+$/,''));
      if(exactSection){ currentSection=exactSection; rawSections.push(exactSection); return; }
      if(/^(order|bout|fighter|matchup|odds|card)\b/i.test(line) && !/(?:vs\.?|versus)/i.test(line)){ ignored.push(raw); return; }

      const fields=splitFields(line);
      let explicitOrder=null;
      let section=currentSection;
      let weight='';
      let lockAt='';
      const odds=[];
      let red='';
      let blue='';

      fields.forEach((field,fieldIndex)=>{
        if(fieldIndex===0 && /^\d{1,2}$/.test(field)) explicitOrder=Number(field);
        const sectionValue=normalizeSection(field);
        if(sectionValue) section=sectionValue;
        if(!weight && looksLikeWeight(field)) weight=field;
        const odd=parseOddsValue(field);
        if(odd!==null) odds.push(odd);
        if(!lockAt && /^\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}/.test(field)) lockAt=field;
        const pair=vsNames(field);
        if(pair){ red=pair.red; blue=pair.blue; }
      });

      if(!red || !blue){
        const candidates=fields.filter((field,fieldIndex)=>{
          if(fieldIndex===0 && explicitOrder!==null) return false;
          if(normalizeSection(field) || looksLikeWeight(field)) return false;
          if(/^\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}/.test(field)) return false;
          if(parseOddsValue(field)!==null && stripOdds(field)==='') return false;
          return true;
        }).map(stripOdds).filter(value=>value && !/^\d+$/.test(value));
        if(candidates.length>=2){ red=candidates[0]; blue=candidates[1]; }
      }

      if((!red || !blue) && fields.length===1){
        const spaced=line.match(/^(.+?)\s+([+-]\d{2,4})\s+(.+?)\s+([+-]\d{2,4})$/);
        if(spaced){ red=spaced[1].trim(); blue=spaced[3].trim(); odds.splice(0,odds.length,Number(spaced[2]),Number(spaced[4])); }
      }

      if(!red || !blue){ ignored.push(raw); return; }
      sequence+=1;
      rows.push({
        inputIndex:index,
        sequence,
        explicitOrder:explicitOrder!==null,
        order:explicitOrder || sequence,
        section,
        weight:weight || 'TBD',
        red:red.trim(),blue:blue.trim(),
        redOdds:odds[0] ?? null,blueOdds:odds[1] ?? null,
        lockAt
      });
      rawSections.push(section);
    });

    const reverse=shouldReverse(rows,rawSections);
    const total=rows.length;
    rows.forEach((row,index)=>{
      if(!row.explicitOrder) row.order=reverse ? total-index : index+1;
      if(!row.section) row.section=inferSection(row.order,total,event.event_type);
      if(!row.lockAt){
        const start=new Date(event.event_date);
        if(!Number.isNaN(start.getTime())){
          start.setMinutes(start.getMinutes()+Math.max(0,row.order-1)*Number(state.spacing || 30)-Number(state.buffer || 0));
          row.lockAt=start.toISOString();
        }
      }else{
        const parsed=new Date(row.lockAt);
        row.lockAt=Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString();
      }
    });

    rows.sort((a,b)=>a.order-b.order || a.inputIndex-b.inputIndex);
    return {rows,ignored,reverse};
  }

  function fieldChanges(row,fight){
    const changes=[];
    if(Number(row.order)!==Number(fight.order)) changes.push('order');
    if(row.section!==fight.card_section) changes.push('section');
    if(row.weight!==fight.weight_class) changes.push('weight');
    if(row.red!==fight.red || row.blue!==fight.blue) changes.push('fighters');
    if(String(row.lockAt)!==String(fight.lock_at)) changes.push('lock');
    if((row.redOdds ?? null)!==(fight.red_odds ?? null) || (row.blueOdds ?? null)!==(fight.blue_odds ?? null)) changes.push('odds');
    return changes;
  }

  function buildCardPreview(event){
    const parsed=parseCard(event);
    const used=new Set();
    const currentByPair=new Map((event.fights || []).map(fight=>[pairKey(fight.red,fight.blue),fight]));
    const currentByOrder=new Map((event.fights || []).map(fight=>[Number(fight.order),fight]));
    const rows=parsed.rows.map(row=>{
      let fight=currentByPair.get(pairKey(row.red,row.blue));
      let replacement=false;
      if(fight && used.has(fight.id)) fight=null;
      if(!fight){
        const orderFight=currentByOrder.get(Number(row.order));
        if(orderFight && !used.has(orderFight.id)){ fight=orderFight; replacement=pairKey(row.red,row.blue)!==pairKey(orderFight.red,orderFight.blue); }
      }
      if(fight) used.add(fight.id);
      const changes=fight ? fieldChanges(row,fight) : [];
      const blocked=Boolean(fight && replacement && Number(fight.selection_count || 0)>0);
      return {...row,existingId:fight?.id || null,selectionCount:Number(fight?.selection_count || 0),replacement,changes,blocked,status:!fight?'add':changes.length?'change':'same'};
    });
    const missing=(event.fights || []).filter(fight=>!used.has(fight.id));
    const warnings=[];
    const orderCounts=new Map();
    const pairCounts=new Map();
    rows.forEach(row=>{
      orderCounts.set(row.order,(orderCounts.get(row.order)||0)+1);
      const key=pairKey(row.red,row.blue);
      pairCounts.set(key,(pairCounts.get(key)||0)+1);
      if(row.weight==='TBD') warnings.push(`${row.red} vs. ${row.blue} needs a weight class`);
      if(!row.lockAt) warnings.push(`${row.red} vs. ${row.blue} needs a lock time`);
    });
    orderCounts.forEach((count,order)=>{ if(count>1) warnings.push(`Bout order ${order} appears ${count} times`); });
    pairCounts.forEach((count,key)=>{ if(count>1) warnings.push(`A matchup is duplicated (${key})`); });
    if(event.event_type==='numbered' && rows.length<8) warnings.push('Numbered events normally need the full card');
    if(event.event_type==='fight-night' && rows.length<5) warnings.push('Fight Nights normally need the full main card');
    if(parsed.ignored.length) warnings.push(`${parsed.ignored.length} line${parsed.ignored.length===1?' was':'s were'} not recognized`);
    const blocked=rows.filter(row=>row.blocked);
    return {rows,missing,warnings,ignored:parsed.ignored,reverse:parsed.reverse,blocked};
  }

  function parseOddsPaste(event){
    const pairRows=[];
    const singles=new Map();
    const ignored=[];
    state.oddsText.split(/\r?\n/).map(line=>line.trim()).filter(Boolean).forEach(raw=>{
      const line=raw.replace(/^[-•*]\s*/,'').trim();
      const fields=splitFields(line);
      const allOdds=[...line.matchAll(/(?:^|\s)([+-]\d{2,4})(?=\s|$)/g)].map(match=>Number(match[1]));
      const pair=fields.map(vsNames).find(Boolean) || vsNames(line.replace(/\s+[+-]\d{2,4}/g,''));
      if(pair && allOdds.length>=2){ pairRows.push({red:pair.red,blue:pair.blue,redOdds:allOdds[0],blueOdds:allOdds[1],raw}); return; }
      if(fields.length>=4){
        const redOdds=parseOddsValue(fields[1]);
        const blueOdds=parseOddsValue(fields[3]);
        if(redOdds!==null && blueOdds!==null){ pairRows.push({red:stripOdds(fields[0]),blue:stripOdds(fields[2]),redOdds,blueOdds,raw}); return; }
      }
      const one=line.match(/^(.+?)\s+([+-]\d{2,4})$/);
      if(one){ singles.set(normalizeName(one[1]),{name:one[1].trim(),odds:Number(one[2]),raw}); return; }
      ignored.push(raw);
    });

    const matches=[];
    const usedLines=new Set();
    (event.fights || []).forEach(fight=>{
      const pair=pairRows.find(row=>pairKey(row.red,row.blue)===pairKey(fight.red,fight.blue));
      if(pair){
        const sameOrientation=normalizeName(pair.red)===normalizeName(fight.red);
        matches.push({fightId:fight.id,red:fight.red,blue:fight.blue,redOdds:sameOrientation?pair.redOdds:pair.blueOdds,blueOdds:sameOrientation?pair.blueOdds:pair.redOdds});
        usedLines.add(pair.raw);
        return;
      }
      const red=singles.get(normalizeName(fight.red));
      const blue=singles.get(normalizeName(fight.blue));
      if(red || blue){
        matches.push({fightId:fight.id,red:fight.red,blue:fight.blue,redOdds:red?.odds ?? null,blueOdds:blue?.odds ?? null});
        if(red) usedLines.add(red.raw);
        if(blue) usedLines.add(blue.raw);
      }
    });
    pairRows.forEach(row=>{ if(!usedLines.has(row.raw)) ignored.push(row.raw); });
    singles.forEach(row=>{ if(!usedLines.has(row.raw)) ignored.push(row.raw); });
    return {matches,ignored};
  }

  function health(event){
    const fights=event.fights || [];
    const issues=[];
    if(!fights.length) issues.push('No fights loaded');
    if(fights.some(fight=>!fight.weight_class || fight.weight_class==='TBD')) issues.push('Missing weight classes');
    if(fights.some(fight=>fight.red_odds==null || fight.blue_odds==null)) issues.push('Some odds are missing');
    if(fights.some(fight=>!fight.lock_at)) issues.push('Missing lock times');
    if(fights.some(fight=>fight.import_status==='missing')) issues.push('Card-change review needed');
    const ready=fights.length>0 && !issues.some(issue=>issue==='No fights loaded' || issue==='Missing lock times' || issue==='Card-change review needed');
    return {issues,ready};
  }

  function previewBadge(row){
    if(row.blocked) return '<span class="automation-badge blocked">BLOCKED</span>';
    if(row.status==='add') return '<span class="automation-badge add">ADD</span>';
    if(row.status==='change') return '<span class="automation-badge change">CHANGE</span>';
    return '<span class="automation-badge same">SAME</span>';
  }

  function cardPreviewMarkup(preview){
    if(!preview) return '';
    const adds=preview.rows.filter(row=>row.status==='add').length;
    const changes=preview.rows.filter(row=>row.status==='change').length;
    const same=preview.rows.filter(row=>row.status==='same').length;
    return `<section class="automation-preview">
      <div class="automation-preview-head"><div><span>SYNC PREVIEW</span><h4>${adds} add · ${changes} change · ${preview.missing.length} missing</h4></div><b>${same} unchanged</b></div>
      ${preview.warnings.length ? `<div class="automation-warnings">${preview.warnings.map(item=>`<div>⚠ ${safe(item)}</div>`).join('')}</div>` : ''}
      <div class="automation-preview-list">${preview.rows.map(row=>`<article class="automation-preview-row${row.blocked?' blocked':''}">
        <span>${String(row.order).padStart(2,'0')}</span>
        <div><strong>${safe(row.red)} <em>vs.</em> ${safe(row.blue)}</strong><small>${safe(row.section)} · ${safe(row.weight)} · ${safe(formatDate(row.lockAt))}${row.changes.length?` · changes: ${safe(row.changes.join(', '))}`:''}${row.selectionCount?` · ${row.selectionCount} submitted pick${row.selectionCount===1?'':'s'}`:''}</small></div>
        <div class="automation-row-odds"><span>${safe(formatOdds(row.redOdds))}</span><span>${safe(formatOdds(row.blueOdds))}</span></div>
        ${previewBadge(row)}
      </article>`).join('')}</div>
      ${preview.missing.length ? `<div class="automation-missing"><strong>Missing from this paste</strong>${preview.missing.map(fight=>`<div><span>${safe(fight.red)} vs. ${safe(fight.blue)}</span><small>${fight.selection_count || 0} picks · ${safe(fight.import_status || 'manual')}</small></div>`).join('')}</div>` : ''}
      ${preview.ignored.length ? `<details class="automation-ignored"><summary>Unrecognized lines (${preview.ignored.length})</summary><pre>${safe(preview.ignored.join('\n'))}</pre></details>` : ''}
      <button id="automationApplyCard" class="automation-primary" type="button" ${!preview.rows.length || preview.blocked.length?'disabled':''}>Apply Card Sync</button>
    </section>`;
  }

  function oddsPreviewMarkup(preview){
    if(!preview) return '';
    return `<section class="automation-preview odds-preview">
      <div class="automation-preview-head"><div><span>ODDS PREVIEW</span><h4>${preview.matches.length} matchup${preview.matches.length===1?'':'s'} matched</h4></div><b>${preview.ignored.length} unmatched</b></div>
      <div class="automation-preview-list">${preview.matches.map(row=>`<article class="automation-preview-row">
        <div><strong>${safe(row.red)} <em>vs.</em> ${safe(row.blue)}</strong><small>Existing fight matched by fighter names</small></div>
        <div class="automation-row-odds"><span>${safe(formatOdds(row.redOdds))}</span><span>${safe(formatOdds(row.blueOdds))}</span></div>
        <span class="automation-badge change">UPDATE</span>
      </article>`).join('') || '<div class="automation-empty">No odds matched the selected event.</div>'}</div>
      ${preview.ignored.length ? `<details class="automation-ignored"><summary>Unmatched lines (${preview.ignored.length})</summary><pre>${safe(preview.ignored.join('\n'))}</pre></details>` : ''}
      <button id="automationApplyOdds" class="automation-primary" type="button" ${!preview.matches.length?'disabled':''}>Apply Odds Update</button>
    </section>`;
  }

  function render(){
    ensureCard();
    const card=document.getElementById('picksAutomationCard');
    const target=document.getElementById('picksAutomationContent');
    const summary=document.getElementById('picksAutomationSummary');
    if(!card || !target || !summary) return;
    const editable=state.events.filter(event=>['hidden','upcoming'].includes(event.status));
    if(!editable.length){ card.hidden=true; return; }
    if(!editable.some(event=>event.id===state.selectedId)) state.selectedId=editable[0].id;
    const event=selectedEvent();
    if(!event){ card.hidden=true; return; }
    const report=health(event);
    card.hidden=false;
    summary.textContent=event.last_card_import_at ? `Last sync ${formatDate(event.last_card_import_at)}` : 'Paste · compare · sync';
    const options=editable.map(item=>`<option value="${safe(item.id)}" ${item.id===event.id?'selected':''}>${safe(item.name)} · ${safe(statusLabel(item.status))}</option>`).join('');
    target.innerHTML=`
      <section class="automation-hero">
        <div><span>NO SUBSCRIPTION REQUIRED</span><h3>Card & Odds Automation</h3><p>Paste a card again anytime to see additions, replacements, cancellations, order changes, lock changes, and odds changes before anything is saved.</p></div>
        <label>Managed event<select id="automationEventSelect">${options}</select></label>
      </section>
      <section class="automation-health ${report.ready?'ready':'review'}">
        <div><span>${report.ready?'READY':'REVIEW'}</span><strong>${safe(event.name)}</strong><small>${event.fights.length} fights · revision ${event.card_import_revision || 0}${event.last_card_import_source?` · ${safe(event.last_card_import_source)}`:''}</small></div>
        <div>${report.issues.length?report.issues.map(issue=>`<span>${safe(issue)}</span>`).join(''):'<span>Card checks passed</span>'}</div>
      </section>
      <section class="automation-importer">
        <div class="automation-section-head"><div><span>FULL CARD IMPORT</span><h3>Paste the card</h3></div><button id="automationCopyTemplate" type="button">Copy template</button></div>
        <textarea id="automationCardText" rows="8" placeholder="1 | Early Prelims | Flyweight | Fighter A | Fighter B | -150 | +130\n2 | Prelims | Lightweight | Fighter C | Fighter D | +120 | -140">${safe(state.cardText)}</textarea>
        <div class="automation-controls">
          <label>Paste order<select id="automationOrderMode"><option value="auto" ${state.orderMode==='auto'?'selected':''}>Auto-detect</option><option value="first-fight-first" ${state.orderMode==='first-fight-first'?'selected':''}>First line = first fight</option><option value="main-event-first" ${state.orderMode==='main-event-first'?'selected':''}>First line = main event</option></select></label>
          <label>Minutes between fights<input id="automationSpacing" type="number" min="10" max="60" value="${safe(state.spacing)}"></label>
          <label>Lock buffer<input id="automationBuffer" type="number" min="0" max="60" value="${safe(state.buffer)}"><small>Minutes before estimated fight</small></label>
          <label>Source note<input id="automationSource" value="${safe(state.source)}" maxlength="80"></label>
        </div>
        <div class="automation-checks">
          <label><input id="automationUpdateHeadline" type="checkbox" ${state.updateHeadline?'checked':''}> Update headline from main event</label>
          <label><input id="automationRemoveMissing" type="checkbox" ${state.removeMissing?'checked':''}> Remove missing fights; submitted picks become void cancellations</label>
        </div>
        <button id="automationPreviewCard" class="automation-secondary" type="button">Preview Card Changes</button>
        ${cardPreviewMarkup(state.cardPreview)}
      </section>
      <section class="automation-importer">
        <div class="automation-section-head"><div><span>BULK ODDS</span><h3>Paste an odds sheet</h3></div><small>Matches by fighter names</small></div>
        <textarea id="automationOddsText" rows="6" placeholder="Fighter A -150\nFighter B +130\n\nor\nFighter A vs Fighter B | -150 | +130">${safe(state.oddsText)}</textarea>
        <button id="automationPreviewOdds" class="automation-secondary" type="button">Match Odds to Card</button>
        ${oddsPreviewMarkup(state.oddsPreview)}
      </section>`;
    bind(event);
  }

  function captureInputs(){
    state.cardText=document.getElementById('automationCardText')?.value || state.cardText;
    state.oddsText=document.getElementById('automationOddsText')?.value || state.oddsText;
    state.source=document.getElementById('automationSource')?.value.trim() || 'Manual card paste';
    state.spacing=Number(document.getElementById('automationSpacing')?.value || 30);
    state.buffer=Number(document.getElementById('automationBuffer')?.value || 15);
    state.orderMode=document.getElementById('automationOrderMode')?.value || 'auto';
    state.removeMissing=Boolean(document.getElementById('automationRemoveMissing')?.checked);
    state.updateHeadline=Boolean(document.getElementById('automationUpdateHeadline')?.checked);
  }

  function bind(event){
    document.getElementById('automationEventSelect')?.addEventListener('change',change=>{
      captureInputs();
      state.selectedId=change.target.value;
      state.cardPreview=null;
      state.oddsPreview=null;
      render();
    });
    document.getElementById('automationPreviewCard')?.addEventListener('click',()=>{
      captureInputs();
      state.cardPreview=buildCardPreview(event);
      render();
      document.querySelector('.automation-preview')?.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
    document.getElementById('automationPreviewOdds')?.addEventListener('click',()=>{
      captureInputs();
      state.oddsPreview=parseOddsPaste(event);
      render();
      document.querySelector('.odds-preview')?.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
    document.getElementById('automationApplyCard')?.addEventListener('click',()=>applyCard(event));
    document.getElementById('automationApplyOdds')?.addEventListener('click',()=>applyOdds(event));
    document.getElementById('automationCopyTemplate')?.addEventListener('click',copyTemplate);
  }

  async function copyTemplate(){
    const template='1 | Early Prelims | Flyweight | Fighter A | Fighter B | -150 | +130\n2 | Prelims | Lightweight | Fighter C | Fighter D | +120 | -140\n3 | Main Event | Welterweight | Fighter E | Fighter F | -110 | -110';
    try{ await navigator.clipboard.writeText(template); toast('Card template copied'); }
    catch(_error){ toast('Copy was blocked'); }
  }

  async function applyCard(event){
    captureInputs();
    const preview=state.cardPreview || buildCardPreview(event);
    if(!preview.rows.length || preview.blocked.length) return;
    if(!window.confirm(`Apply ${preview.rows.length} fights to ${event.name}? ${preview.missing.length} existing fight${preview.missing.length===1?' is':'s are'} missing from this paste.`)) return;
    const button=document.getElementById('automationApplyCard');
    if(button){ button.disabled=true; button.textContent='Applying…'; }
    const fights=preview.rows.map(row=>({
      existing_id:row.existingId,
      order:row.order,
      card_section:row.section,
      weight_class:row.weight,
      red_name:row.red,
      blue_name:row.blue,
      lock_at:row.lockAt,
      red_odds:row.redOdds,
      blue_odds:row.blueOdds
    }));
    const {data,error}=await client.rpc('picks_automation_apply_card',{
      p_group_code:state.code,
      p_admin_token:state.adminToken,
      p_event_id:event.id,
      p_fights:fights,
      p_remove_missing:state.removeMissing,
      p_source_label:state.source,
      p_update_headline:state.updateHeadline,
      p_expected_revision:Number(event.card_import_revision || 0)
    });
    if(error){ if(button){button.disabled=false;button.textContent='Apply Card Sync';} toast(error.message || 'Card sync failed'); return; }
    state.cardPreview=null;
    toast(`Card synced · ${data.added || 0} added · ${data.updated || 0} updated`);
    await refresh(true);
  }

  async function applyOdds(event){
    captureInputs();
    const preview=state.oddsPreview || parseOddsPaste(event);
    if(!preview.matches.length) return;
    const button=document.getElementById('automationApplyOdds');
    if(button){ button.disabled=true; button.textContent='Applying…'; }
    const oddsRows=preview.matches.map(row=>({fight_id:row.fightId,red_odds:row.redOdds,blue_odds:row.blueOdds}));
    const {data,error}=await client.rpc('picks_automation_apply_odds',{
      p_group_code:state.code,
      p_admin_token:state.adminToken,
      p_event_id:event.id,
      p_odds:oddsRows,
      p_source_label:state.source || 'Bulk odds paste'
    });
    if(error){ if(button){button.disabled=false;button.textContent='Apply Odds Update';} toast(error.message || 'Odds update failed'); return; }
    state.oddsPreview=null;
    toast(`${data.updated || preview.matches.length} fight odds updated`);
    await refresh(true);
  }

  async function refresh(force=false){
    if(state.loading) return;
    ensureCard();
    const owner=resolveOwner();
    if(!owner) return;
    state.code=owner.code;
    state.adminToken=owner.token;
    state.loading=true;
    try{
      const {data,error}=await client.rpc('picks_automation_snapshot',{p_group_code:state.code,p_admin_token:state.adminToken});
      if(error || !data?.group) return;
      const events=data.events || [];
      const signature=JSON.stringify(events);
      state.events=events;
      if(!state.selectedId || !events.some(event=>event.id===state.selectedId && ['hidden','upcoming'].includes(event.status))){
        state.selectedId=events.find(event=>event.status==='hidden')?.id || events.find(event=>event.status==='upcoming')?.id || '';
      }
      if(force || signature!==state.signature || !document.getElementById('picksAutomationContent')?.children.length){
        state.signature=signature;
        render();
      }
    }finally{
      state.loading=false;
    }
  }

  function start(){
    ensureCard();
    refresh();
    const observer=new MutationObserver(()=>{
      ensureCard();
      clearTimeout(start.timer);
      start.timer=setTimeout(()=>refresh(false),280);
    });
    observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true});
    window.setInterval(()=>refresh(false),60000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
