import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';

const v1=process.env.V1_SUPABASE_URL, v2=process.env.V2_SUPABASE_URL;
const k1=process.env.V1_SERVICE_ROLE_KEY, k2=process.env.V2_SERVICE_ROLE_KEY;
const report=process.env.RECOVERY_REPORT||'/tmp/ankalaev-guskov-pick-recovery.json';
const srcEvent='ufc-abu-dhabi-2026-07-25';
const dstEvent='ufc-fight-night-ankalaev-guskov-2026-07-25';
const six=['BROCK','CODY','RHONDA','SHANE','TONY','TYLER'];
const entrants=['CODY','SHANE'];
for(const [n,v] of Object.entries({v1,v2,k1,k2})) if(!v) throw new Error(`${n} required`);
const h1={apikey:k1,authorization:`Bearer ${k1}`}, h2={apikey:k2,authorization:`Bearer ${k2}`};
const norm=s=>String(s||'').trim().replace(/\s+/g,' ').toUpperCase().replace(/\s*\((?:CANCELED|CANCELLED)\)\s*$/,'');
const slug=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').replace(/-(?:canceled|cancelled)$/,'');
const pair=(a,b)=>[slug(a),slug(b)].sort().join('|');
const oldPair=pair('Ismael Bonfim','Axel Sola');
const newPair=pair('Saygid Izagakhmaev','Abubakar Vagaev');
const seteq=(a,b)=>JSON.stringify([...new Set(a)].sort())===JSON.stringify([...new Set(b)].sort());
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const inf=x=>`in.(${[...new Set(x)].join(',')})`;

async function req(url,opt={},label='request'){
  const r=await fetch(url,opt), text=await r.text(); let body;
  try{body=text?JSON.parse(text):null}catch{body=text}
  if(!r.ok) throw new Error(`${label} (${r.status}): ${typeof body==='string'?body.slice(0,500):JSON.stringify(body).slice(0,500)}`);
  return body;
}
async function get(base,headers,table,params={},label=table){
  const u=new URL(`${base}/rest/v1/${table}`); Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,String(v)));
  const rows=await req(u,{headers:{...headers,Range:'0-999','Range-Unit':'items'}},label);
  if(!Array.isArray(rows)) throw new Error(`${label} not array`); return rows;
}
async function mut(method,table,params={},body,label=table){
  const u=new URL(`${v2}/rest/v1/${table}`); Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,String(v)));
  return req(u,{method,headers:{...h2,'content-type':'application/json',Prefer:'return=representation,resolution=ignore-duplicates'},body:body===undefined?undefined:JSON.stringify(body)},label);
}

async function source(){
  const gm=await get(v1,h1,'pick_group_members',{select:'id,group_id,display_name',order:'created_at.asc'});
  const by=new Map(); for(const m of gm){const a=by.get(m.group_id)||[];a.push(m);by.set(m.group_id,a)}
  const gs=[...by.entries()].filter(([,m])=>seteq(m.map(x=>norm(x.display_name)),six));
  if(gs.length!==1) throw new Error(`canonical V1 group count ${gs.length}`);
  const [gid,members]=gs[0], memberById=new Map(members.map(x=>[x.id,x]));
  const ev=await get(v1,h1,'pick_events',{select:'id,name,subtitle,event_date,status',id:`eq.${srcEvent}`});
  if(ev.length!==1||norm(ev[0].subtitle)!=='ANKALAEV VS. GUSKOV') throw new Error('V1 event identity failed');
  const ge=await get(v1,h1,'pick_group_events',{select:'group_id,event_id,room_id',group_id:`eq.${gid}`,event_id:`eq.${srcEvent}`});
  if(ge.length!==1) throw new Error(`canonical V1 room count ${ge.length}`);
  const rm=await get(v1,h1,'pick_room_members',{select:'id,display_name,group_member_id',room_id:`eq.${ge[0].room_id}`});
  const names=new Map(rm.map(x=>[x.id,norm(memberById.get(x.group_member_id)?.display_name||x.display_name)]));
  const fights=await get(v1,h1,'pick_fights',{select:'id,bout_order,weight_class,red_name,blue_name,red_odds,blue_odds',event_id:`eq.${srcEvent}`,order:'bout_order.asc'});
  const fb=new Map(fights.map(x=>[x.id,x]));
  const sel=await get(v1,h1,'pick_selections',{select:'member_id,fight_id,fighter_name,picked_at,is_underdog_lock',member_id:inf([...names.keys()]),fight_id:inf(fights.map(x=>x.id)),order:'picked_at.asc'});
  const picks=sel.map(s=>{const n=names.get(s.member_id),f=fb.get(s.fight_id);if(!n||!f)return null;const fn=String(s.fighter_name||'').trim();if(![norm(f.red_name),norm(f.blue_name)].includes(norm(fn)))throw new Error(`bad V1 pick ${n}/${f.id}`);return{member:n,pair:pair(f.red_name,f.blue_name),fighter:fn,fkey:slug(fn),at:s.picked_at||ev[0].event_date,lock:s.is_underdog_lock===true,odds:Number(norm(fn)===norm(f.red_name)?f.red_odds:f.blue_odds),fight:{order:Number(f.bout_order),weight:f.weight_class,red:f.red_name,blue:f.blue_name}}}).filter(Boolean);
  if(!seteq(picks.map(x=>x.member),entrants)) throw new Error(`V1 entrants ${JSON.stringify([...new Set(picks.map(x=>x.member))])}`);
  for(const n of entrants){const p=picks.filter(x=>x.member===n),l=p.filter(x=>x.lock);if(p.length!==6||new Set(p.map(x=>x.pair)).size!==6)throw new Error(`${n} V1 pick count ${p.length}`);if(l.length>1)throw new Error(`${n} multiple locks`);if(l.length&&(!Number.isInteger(l[0].odds)||l[0].odds<100))throw new Error(`${n} invalid lock odds`)}
  const pairs=[...new Set(picks.map(x=>x.pair))]; if(pairs.length!==6||!pairs.includes(newPair)||pairs.includes(oldPair)) throw new Error(`unexpected V1 card ${JSON.stringify(pairs)}`);
  return{picks,gid:digest(gid).slice(0,16)};
}

async function target(){
  const [e,b,p,pk,lk]=await Promise.all([
    get(v2,h2,'pick_events',{select:'event_id,name,subtitle,status,starts_at,locks_at,season,completed_at',event_id:`eq.${dstEvent}`}),
    get(v2,h2,'pick_bouts',{select:'event_id,bout_id,position,weight_class,red_fighter_slug,red_fighter_name,blue_fighter_slug,blue_fighter_name,result_status,winner_fighter_slug,red_american_odds,blue_american_odds',event_id:`eq.${dstEvent}`,order:'position.asc'}),
    get(v2,h2,'profiles',{select:'id,display_name,normalized_name',normalized_name:'in.(CODY,SHANE)',order:'normalized_name.asc'}),
    get(v2,h2,'profile_event_picks',{select:'profile_id,event_id,bout_id,fighter_slug,picked_at,updated_at',event_id:`eq.${dstEvent}`,order:'profile_id.asc,bout_id.asc'}),
    get(v2,h2,'profile_event_underdog_locks',{select:'profile_id,event_id,bout_id,fighter_slug,selected_at,frozen_american_odds,frozen_at',event_id:`eq.${dstEvent}`,order:'profile_id.asc'})]);
  if(e.length!==1||!['upcoming','locked'].includes(e[0].status)||e[0].completed_at) throw new Error(`bad V2 event state`);
  if(b.length!==6||b.some(x=>x.result_status!=='pending'||x.winner_fighter_slug)) throw new Error(`bad V2 bout state`);
  if(p.length!==2||!seteq(p.map(x=>norm(x.normalized_name)),entrants)) throw new Error('V2 profiles failed');
  const ids=new Set(p.map(x=>x.id)); if(pk.some(x=>!ids.has(x.profile_id))||lk.some(x=>!ids.has(x.profile_id))) throw new Error('unexpected V2 entrant rows');
  return{event:e[0],bouts:b,profiles:p,picks:pk,locks:lk};
}

async function protectedHash(){
  const data=await Promise.all([
    get(v2,h2,'pick_events',{select:'event_id,name,subtitle,status,starts_at,locks_at,season,completed_at',event_id:`neq.${dstEvent}`,order:'event_id.asc'}),
    get(v2,h2,'pick_bouts',{select:'event_id,bout_id,position,red_fighter_slug,blue_fighter_slug,result_status,winner_fighter_slug',event_id:`neq.${dstEvent}`,order:'event_id.asc,bout_id.asc'}),
    get(v2,h2,'profile_event_picks',{select:'profile_id,event_id,bout_id,fighter_slug,picked_at,updated_at',event_id:`neq.${dstEvent}`,order:'event_id.asc,profile_id.asc,bout_id.asc'}),
    get(v2,h2,'profile_event_underdog_locks',{select:'profile_id,event_id,bout_id,fighter_slug,selected_at,frozen_american_odds,frozen_at',event_id:`neq.${dstEvent}`,order:'event_id.asc,profile_id.asc'}),
    get(v2,h2,'pick_events',{select:'event_id,name,subtitle,status,starts_at,locks_at,season,completed_at',event_id:`eq.${dstEvent}`})]);
  return digest(data);
}

async function card(src,t){
  const sf=new Map();src.picks.forEach(x=>sf.set(x.pair,x.fight));
  const tb=new Map(t.bouts.map(x=>[pair(x.red_fighter_name,x.blue_fighter_name),x]));
  const sp=[...sf.keys()],tp=[...tb.keys()]; if(seteq(sp,tp))return{changed:false};
  const missing=sp.filter(x=>!tb.has(x)),extra=tp.filter(x=>!sf.has(x));
  if(missing.length!==1||extra.length!==1||missing[0]!==newPair||extra[0]!==oldPair) throw new Error(`unexpected V2 card mismatch ${JSON.stringify({missing,extra})}`);
  const stale=tb.get(oldPair),fresh=sf.get(newPair);
  await mut('DELETE','profile_event_underdog_locks',{event_id:`eq.${dstEvent}`,bout_id:`eq.${stale.bout_id}`},undefined,'delete stale locks');
  await mut('DELETE','profile_event_picks',{event_id:`eq.${dstEvent}`,bout_id:`eq.${stale.bout_id}`},undefined,'delete stale picks');
  await mut('DELETE','pick_bouts',{event_id:`eq.${dstEvent}`,bout_id:`eq.${stale.bout_id}`},undefined,'delete stale bout');
  await mut('POST','pick_bouts',{},[{event_id:dstEvent,bout_id:'izagakhmaev-vagaev',position:stale.position,weight_class:fresh.weight||'Welterweight',red_fighter_slug:slug(fresh.red),red_fighter_name:fresh.red,blue_fighter_slug:slug(fresh.blue),blue_fighter_name:fresh.blue,result_status:'pending'}],'insert final bout');
  if(!seteq((await target()).bouts.map(x=>pair(x.red_fighter_name,x.blue_fighter_name)),sp))throw new Error('card reconcile failed');
  return{changed:true,removed:stale.bout_id,inserted:'izagakhmaev-vagaev'};
}

function expected(src,t){
  const pm=new Map(t.profiles.map(x=>[norm(x.normalized_name),x])), bm=new Map(t.bouts.map(x=>[pair(x.red_fighter_name,x.blue_fighter_name),x]));
  const picks=src.picks.map(x=>{const p=pm.get(x.member),b=bm.get(x.pair);if(!p||!b)throw new Error(`map failed ${x.member}/${x.pair}`);const fs=x.fkey===slug(b.red_fighter_name)?b.red_fighter_slug:x.fkey===slug(b.blue_fighter_name)?b.blue_fighter_slug:null;if(!fs)throw new Error(`fighter map failed ${x.fighter}`);return{profile_id:p.id,event_id:dstEvent,bout_id:b.bout_id,fighter_slug:fs,picked_at:x.at,updated_at:x.at,member:x.member,fighter:fs===b.red_fighter_slug?b.red_fighter_name:b.blue_fighter_name,lock:x.lock,odds:x.odds}});
  if(picks.length!==12||new Set(picks.map(x=>`${x.profile_id}|${x.bout_id}`)).size!==12)throw new Error('expected 12 picks');
  const current=new Map(t.picks.map(x=>[`${x.profile_id}|${x.bout_id}`,x]));
  const skippedSourceLocks=picks.filter(x=>x.lock&&current.has(`${x.profile_id}|${x.bout_id}`)&&current.get(`${x.profile_id}|${x.bout_id}`).fighter_slug!==x.fighter_slug).map(x=>({member:x.member,boutId:x.bout_id,olderV1:x.fighter,reason:'final V2 pick differs'}));
  const locks=picks.filter(x=>x.lock&&(!current.has(`${x.profile_id}|${x.bout_id}`)||current.get(`${x.profile_id}|${x.bout_id}`).fighter_slug===x.fighter_slug)).map(x=>({profile_id:x.profile_id,event_id:dstEvent,bout_id:x.bout_id,fighter_slug:x.fighter_slug,selected_at:x.picked_at,frozen_american_odds:x.odds,frozen_at:t.event.locks_at,member:x.member,fighter:x.fighter}));
  return{picks,locks,skippedSourceLocks};
}

function diff(t,e){
  const ep=new Map(e.picks.map(x=>[`${x.profile_id}|${x.bout_id}`,x]));
  const cp=new Map(t.picks.map(x=>[`${x.profile_id}|${x.bout_id}`,x]));
  const bouts=new Map(t.bouts.map(x=>[x.bout_id,x]));
  const preserved=[],pickConflicts=[];
  for(const x of t.picks){
    const y=ep.get(`${x.profile_id}|${x.bout_id}`),b=bouts.get(x.bout_id);
    if(!y||!b)throw new Error(`unexpected V2 pick ${x.profile_id}/${x.bout_id}`);
    const currentName=x.fighter_slug===b.red_fighter_slug?b.red_fighter_name:x.fighter_slug===b.blue_fighter_slug?b.blue_fighter_name:null;
    if(!currentName)throw new Error(`invalid V2 fighter ${x.profile_id}/${x.bout_id}`);
    preserved.push({member:y.member,boutId:x.bout_id,fighter:currentName});
    if(y.fighter_slug!==x.fighter_slug)pickConflicts.push({member:y.member,boutId:x.bout_id,preservedV2:currentName,olderV1:y.fighter});
  }
  const missingPicks=e.picks.filter(x=>!cp.has(`${x.profile_id}|${x.bout_id}`));
  const sourceLocks=new Map(e.locks.map(x=>[x.profile_id,x]));
  const currentLocks=new Map(t.locks.map(x=>[x.profile_id,x]));
  const lockConflicts=[];
  for(const x of t.locks){
    const currentPick=cp.get(`${x.profile_id}|${x.bout_id}`),sourceLock=sourceLocks.get(x.profile_id),b=bouts.get(x.bout_id);
    if(!currentPick||currentPick.fighter_slug!==x.fighter_slug||!b||!Number.isInteger(Number(x.frozen_american_odds))||Number(x.frozen_american_odds)<100)throw new Error(`invalid V2 lock after normalization ${x.profile_id}`);
    const currentName=x.fighter_slug===b.red_fighter_slug?b.red_fighter_name:b.blue_fighter_name;
    if(!sourceLock||sourceLock.bout_id!==x.bout_id||sourceLock.fighter_slug!==x.fighter_slug||Number(sourceLock.frozen_american_odds)!==Number(x.frozen_american_odds)){
      const member=e.picks.find(p=>p.profile_id===x.profile_id)?.member||x.profile_id;
      lockConflicts.push({member,preservedV2:{boutId:x.bout_id,fighter:currentName,odds:Number(x.frozen_american_odds)},olderV1:sourceLock?{boutId:sourceLock.bout_id,fighter:sourceLock.fighter,odds:Number(sourceLock.frozen_american_odds)}:null});
    }
  }
  const missingLocks=e.locks.filter(x=>!currentLocks.has(x.profile_id));
  return{picks:missingPicks,locks:missingLocks,preserved,pickConflicts,lockConflicts};
}

async function rows(src,label){
  const t=await target(),e=expected(src,t),d=diff(t,e);
  if(d.picks.length)await mut('POST','profile_event_picks',{},d.picks.map(({member,fighter,lock,odds,...x})=>x),`${label} picks`);
  if(d.locks.length)await mut('POST','profile_event_underdog_locks',{},d.locks.map(({member,fighter,...x})=>x),`${label} locks`);
  const a=await target(),r=diff(a,expected(src,a));
  if(r.picks.length||r.locks.length||a.picks.length!==12||a.locks.length>2)throw new Error(`${label} incomplete`);
  return{
    insertedPicks:d.picks.length,insertedLocks:d.locks.length,pickCount:a.picks.length,lockCount:a.locks.length,
    recoveredFromV1:d.picks.map(x=>({member:x.member,boutId:x.bout_id,fighter:x.fighter})),
    preservedV2:r.preserved,pickConflicts:r.pickConflicts,lockConflicts:r.lockConflicts,skippedSourceLocks:e.skippedSourceLocks,
    finalPicks:a.picks.map(x=>{const b=a.bouts.find(y=>y.bout_id===x.bout_id),p=a.profiles.find(y=>y.id===x.profile_id);return{member:norm(p?.normalized_name),boutId:x.bout_id,fighter:x.fighter_slug===b?.red_fighter_slug?b.red_fighter_name:b?.blue_fighter_name}}).sort((x,y)=>x.member.localeCompare(y.member)||x.boutId.localeCompare(y.boutId)),
    finalLocks:a.locks.map(x=>{const b=a.bouts.find(y=>y.bout_id===x.bout_id),p=a.profiles.find(y=>y.id===x.profile_id);return{member:norm(p?.normalized_name),boutId:x.bout_id,fighter:x.fighter_slug===b?.red_fighter_slug?b.red_fighter_name:b?.blue_fighter_name,odds:Number(x.frozen_american_odds)}})
  };
}

const src=await source(), before=await protectedHash();
const card1=await card(src,await target()), first=await rows(src,'first pass');
if(before!==await protectedHash())throw new Error('protected V2 data changed');
const card2=await card(src,await target()), second=await rows(src,'second pass');
if(before!==await protectedHash())throw new Error('protected V2 data changed on second pass');
if(card2.changed||second.insertedPicks||second.insertedLocks)throw new Error('second pass not idempotent');
const out={schemaVersion:2,operation:'ankalaev-guskov-pick-recovery',sourceEventId:srcEvent,targetEventId:dstEvent,generatedAt:new Date().toISOString(),source:{groupFingerprint:src.gid,entrants,pickCount:src.picks.length,lockCount:src.picks.filter(x=>x.lock).length},safety:{resultsChanged:false,eventStatusChanged:false,unrelatedRowsChanged:false,protectedHash:before},cardRecovery:card1,firstPass:first,secondPass:second};
await writeFile(report,JSON.stringify(out,null,2)+'\n',{mode:0o600});
console.log(JSON.stringify({status:'reconciled',cardRecovery:card1,firstPass:{insertedPicks:first.insertedPicks,insertedLocks:first.insertedLocks,pickCount:first.pickCount,lockCount:first.lockCount},secondPass:{insertedPicks:second.insertedPicks,insertedLocks:second.insertedLocks},protectedHash:before}));
