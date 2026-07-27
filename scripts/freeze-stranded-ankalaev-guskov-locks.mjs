const base=String(process.env.V2_SUPABASE_URL||'').replace(/\/$/,'');
const key=String(process.env.V2_SERVICE_ROLE_KEY||'');
const eventId='ufc-fight-night-ankalaev-guskov-2026-07-25';
if(!base||!key)throw new Error('V2 Supabase credentials are required.');
const headers={apikey:key,authorization:`Bearer ${key}`};

async function request(url,options={},label='request'){
  const response=await fetch(url,options);
  const text=await response.text();
  let body;
  try{body=text?JSON.parse(text):null}catch{body=text}
  if(!response.ok)throw new Error(`${label} failed (${response.status}): ${typeof body==='string'?body.slice(0,400):JSON.stringify(body).slice(0,400)}`);
  return body;
}
async function rows(table,params,label=table){
  const url=new URL(`${base}/rest/v1/${table}`);
  for(const [name,value] of Object.entries(params))url.searchParams.set(name,String(value));
  const body=await request(url,{headers},label);
  if(!Array.isArray(body))throw new Error(`${label} did not return rows.`);
  return body;
}
async function mutate(method,table,params,body,label){
  const url=new URL(`${base}/rest/v1/${table}`);
  for(const [name,value] of Object.entries(params))url.searchParams.set(name,String(value));
  return request(url,{method,headers:{...headers,'content-type':'application/json',Prefer:'return=representation'},body:body===undefined?undefined:JSON.stringify(body)},label);
}

const [events,bouts,picks,locks,profiles]=await Promise.all([
  rows('pick_events',{select:'event_id,status,locks_at,completed_at',event_id:`eq.${eventId}`},'read target event'),
  rows('pick_bouts',{select:'bout_id,red_fighter_slug,blue_fighter_slug,red_american_odds,blue_american_odds,result_status,winner_fighter_slug',event_id:`eq.${eventId}`},'read target bouts'),
  rows('profile_event_picks',{select:'profile_id,bout_id,fighter_slug',event_id:`eq.${eventId}`},'read target picks'),
  rows('profile_event_underdog_locks',{select:'profile_id,bout_id,fighter_slug,frozen_american_odds,frozen_at',event_id:`eq.${eventId}`},'read target locks'),
  rows('profiles',{select:'id,normalized_name',normalized_name:'in.(CODY,SHANE)'},'read Cody and Shane profiles')
]);
if(events.length!==1||!['upcoming','locked'].includes(events[0].status)||events[0].completed_at)throw new Error('Target event is not recoverable.');
if(bouts.length!==6||bouts.some(b=>b.result_status!=='pending'||b.winner_fighter_slug))throw new Error('Target bouts are not all unresolved.');
const allowed=new Map(profiles.map(p=>[p.id,p.normalized_name]));
if(allowed.size!==2)throw new Error('Cody and Shane profiles were not resolved exactly.');
const pickByKey=new Map(picks.map(p=>[`${p.profile_id}|${p.bout_id}`,p]));
const boutById=new Map(bouts.map(b=>[b.bout_id,b]));
const repaired=[];
const removedStale=[];
for(const lock of locks){
  const member=allowed.get(lock.profile_id);
  if(!member)throw new Error('Unexpected member lock exists on the target event.');
  const pick=pickByKey.get(`${lock.profile_id}|${lock.bout_id}`);
  const bout=boutById.get(lock.bout_id);
  if(!bout)throw new Error(`Stranded ${member} lock references a missing bout.`);
  if(!pick||pick.fighter_slug!==lock.fighter_slug){
    await mutate('DELETE','profile_event_underdog_locks',{profile_id:`eq.${lock.profile_id}`,event_id:`eq.${eventId}`},undefined,`remove stale ${member} lock`);
    removedStale.push({member,boutId:lock.bout_id,fighterSlug:lock.fighter_slug});
    continue;
  }
  if(Number.isInteger(Number(lock.frozen_american_odds))&&Number(lock.frozen_american_odds)>=100&&lock.frozen_at)continue;
  const odds=lock.fighter_slug===bout.red_fighter_slug?Number(bout.red_american_odds):lock.fighter_slug===bout.blue_fighter_slug?Number(bout.blue_american_odds):NaN;
  if(!Number.isInteger(odds)||odds<100)throw new Error(`Stranded ${member} lock has no recoverable positive stored odds.`);
  await mutate('PATCH','profile_event_underdog_locks',{profile_id:`eq.${lock.profile_id}`,event_id:`eq.${eventId}`},{frozen_american_odds:odds,frozen_at:events[0].locks_at},`freeze ${member} lock`);
  repaired.push({member,boutId:lock.bout_id,fighterSlug:lock.fighter_slug,odds});
}
const verified=await rows('profile_event_underdog_locks',{select:'profile_id,bout_id,fighter_slug,frozen_american_odds,frozen_at',event_id:`eq.${eventId}`},'verify target locks');
for(const lock of verified){
  const pick=pickByKey.get(`${lock.profile_id}|${lock.bout_id}`);
  if(!pick||pick.fighter_slug!==lock.fighter_slug||!Number.isInteger(Number(lock.frozen_american_odds))||Number(lock.frozen_american_odds)<100||!lock.frozen_at)throw new Error('A target lock remains invalid.');
}
console.log(JSON.stringify({status:'verified',repaired,removedStale,lockCount:verified.length}));
