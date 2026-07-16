(function(){
  'use strict';

  const VERSION='blind-resume-standalone-share-20260716a';
  const TOTAL_ROUNDS=5;
  const APEX_MAX=6;
  const DATA=window.RANKING_DATA||{};
  const OVERRIDES=window.DISPLAY_OVERRIDES||{};
  const profile=window.UFC_PLAY_PROFILE;
  const client=profile?.client;
  let creating=false;

  function toast(message){
    let node=document.getElementById('blindResumeStandaloneToast');
    if(!node){
      node=document.createElement('div');
      node.id='blindResumeStandaloneToast';
      node.setAttribute('role','status');
      node.style.cssText='position:fixed;left:50%;bottom:22px;z-index:4500;transform:translateX(-50%);max-width:calc(100% - 32px);border:1px solid rgba(250,204,21,.72);border-radius:999px;background:#101725;color:#fef3c7;padding:10px 14px;font:850 12px/1.25 system-ui;text-align:center;box-shadow:0 14px 42px rgba(0,0,0,.38)';
      document.body.appendChild(node);
    }
    node.textContent=message;
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.remove(),3000);
  }

  const key=value=>String(value||'').trim().toLowerCase();
  const number=(value,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback;
  function numberFrom(object,keys){
    if(!object)return null;
    for(const name of keys){
      const value=Number(object[name]);
      if(Number.isFinite(value))return value;
    }
    return null;
  }
  function formatCount(value){
    if(value===null||!Number.isFinite(Number(value)))return '—';
    const num=Number(value);
    return Number.isInteger(num)?String(num):num.toFixed(1).replace(/\.0$/,'');
  }
  function liveRow(name){
    const target=key(name);
    return [...(DATA.men||[]),...(DATA.women||[])].find(row=>key(row?.fighter)===target)||null;
  }
  function liveProfile(name){
    const target=key(name);
    return (DATA.fighters||[]).find(row=>key(row?.fighter)===target)||null;
  }
  function fighterFor(name){
    return {...(liveProfile(name)||{}),...(liveRow(name)||{}),fighter:name};
  }
  function titleFightWins(fighter){
    const name=fighter?.fighter;
    const override=OVERRIDES[name]||{};
    const compareStats=window.COMPARE_PROFILES?.[name]?.legacyStats||{};
    const sources=[fighter?.title,fighter?.championshipResumeAudit,fighter,override.snapshotStats,override.packetProfileStats,compareStats];
    for(const source of sources){
      const direct=numberFrom(source,['titleFightWins','ufcTitleFightWins']);
      if(direct!==null)return formatCount(direct);
    }
    const title=fighter?.title||{};
    const parts=['normalTitleWins','interimTitleWins','vacantUndisputedWins'];
    const present=parts.filter(name=>Number.isFinite(Number(title[name])));
    if(present.length)return formatCount(present.reduce((sum,name)=>sum+Number(title[name]),0));
    const notes=String(title.notes||fighter?.notes||'');
    const match=notes.match(/(?:total\s+)?title[- ]fight wins\s*(?:=|:)\s*([0-9.]+)/i);
    return match?formatCount(Number(match[1])):'—';
  }
  function topFiveWins(fighter){
    const name=fighter?.fighter;
    const override=OVERRIDES[name]||{};
    const compareStats=window.COMPARE_PROFILES?.[name]?.legacyStats||{};
    const sources=[fighter,fighter?.opponentQualityAudit,fighter?.opponentQualityLiveAudit,override.snapshotStats,override.packetProfileStats,compareStats];
    for(const source of sources){
      const direct=numberFrom(source,['topFiveWins','top5Wins']);
      if(direct!==null)return formatCount(direct);
    }
    const opponents=Array.isArray(fighter?.opponents)?fighter.opponents:[];
    const count=opponents.filter(row=>/top[\s-]?(?:5|five)/i.test(`${row?.type||''} ${row?.context||''}`)).length;
    return count?String(count):'—';
  }
  function primeRecord(fighter){return DATA.primeRecords?.[fighter.fighter]?.record||fighter.primeRecord||'—';}
  function apexRating(fighter){
    const score=numberFrom(fighter,['apexPeak'])??numberFrom(fighter?.apexPeakAudit,['score','total']);
    if(score===null)return '—';
    return String(Math.max(55,Math.min(99,Math.round(55+(score/APEX_MAX)*44))));
  }
  function roundControl(fighter){
    const direct=numberFrom(fighter,['roundsWonPct','roundsWonPercentage','roundWinPct','roundsWonPercent']);
    if(direct!==null)return `${direct.toFixed(1)}%`;
    const rounds=Array.isArray(fighter.rounds)?fighter.rounds:[];
    const won=rounds.reduce((sum,row)=>sum+number(row.roundsWon),0);
    const total=rounds.reduce((sum,row)=>sum+number(row.roundsCounted),0);
    return total?`${((won/total)*100).toFixed(1)}%`:'—';
  }
  function blindStats(fighter){
    const finishRate=numberFrom(fighter,['finishRatePct']);
    const eliteYears=numberFrom(fighter,['activeEliteYears']);
    return [
      ['UFC title-fight wins',titleFightWins(fighter)],
      ['Top-5 wins',topFiveWins(fighter)],
      ['Prime UFC record',primeRecord(fighter)],
      ['Apex rating',apexRating(fighter)],
      ['Rounds won',roundControl(fighter)],
      ['Finish rate',finishRate!==null?`${finishRate.toFixed(1)}%`:'—'],
      ['Active elite years',eliteYears!==null?eliteYears.toFixed(1):'—']
    ];
  }
  function fighterSnapshot(name,index){
    const resolved=window.UFC_PLAY_DATA?.resolve?.(name)||{};
    const live=fighterFor(name);
    return {
      id:String(resolved.id||name||`fighter-${index+1}`),
      name:String(resolved.name||name||`Fighter ${index+1}`),
      primaryDivision:String(resolved.primaryDivision||live.primaryDivision||resolved.divisions?.[0]||''),
      divisions:Array.isArray(resolved.divisions)?resolved.divisions:[],
      thumbUrl:String(resolved.thumbUrl||OVERRIDES[name]?.thumbUrl||''),
      profileUrl:String(resolved.profileUrl||OVERRIDES[name]?.photoUrl||'')
    };
  }
  function exportChallenge(){
    const state=window.UFC_BLIND_MATCHMAKING?.state;
    if(!state?.finalVisible||!Array.isArray(state.history)||state.history.length!==TOTAL_ROUNDS)return null;
    const rounds=state.history.map((result,index)=>{
      const fighterA=fighterFor(result.fighterA);
      const fighterB=fighterFor(result.fighterB);
      return {
        round:index+1,
        fighterA:fighterSnapshot(result.fighterA,index*2),
        fighterB:fighterSnapshot(result.fighterB,index*2+1),
        statsA:blindStats(fighterA),
        statsB:blindStats(fighterB),
        rankA:number(result.rankA,999),
        rankB:number(result.rankB,999),
        winnerSide:result.winner===result.fighterA?'A':'B',
        gender:result.gender==='women'?'women':'men'
      };
    });
    const choices=state.history.map(result=>result.picked===result.fighterA?'A':'B');
    const score=choices.reduce((sum,choice,index)=>sum+(choice===rounds[index].winnerSide?1:0),0);
    return {setup:{packId:'blind-resume-five-round',rounds},result:{choices},score};
  }
  function standaloneUrl(code){
    const url=new URL('blind-resume-challenge.html',window.location.href);
    url.searchParams.set('code',String(code||'').trim().toUpperCase());
    url.searchParams.set('v','1');
    return url.toString();
  }
  async function createChallenge(trigger){
    if(creating)return;
    const exported=exportChallenge();
    if(!exported){toast('Finish all five Blind Resume rounds first.');return;}
    if(!client){toast('Challenge sharing is not connected.');return;}
    creating=true;
    const original=trigger?.textContent||'CHALLENGE A FRIEND';
    if(trigger){trigger.disabled=true;trigger.textContent='CONNECTING PROFILE…';}
    try{
      const identity=await profile.require({
        title:'Create the Blind Resume challenge',
        description:'Use your existing Picks profile. Your exact five matchups, A/B order, completed picks, and score will be saved for the friend link.'
      });
      if(!identity)return;
      if(trigger)trigger.textContent='CREATING LINK…';
      const {data,error}=await client.rpc('play_create_challenge',{
        p_game_type:'blind-resume',
        p_game_version:'blind-resume-standalone-v1',
        p_group_code:identity.groupCode,
        p_member_token:identity.memberToken,
        p_setup:exported.setup,
        p_result:exported.result,
        p_score:exported.score,
        p_metadata:{comparison:'blind-resume-round-picks',route:'standalone',client:VERSION},
        p_expires_days:365
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Challenge link could not be created.');
      const url=standaloneUrl(data.code);
      try{
        if(navigator.share)await navigator.share({url});
        else{await navigator.clipboard.writeText(url);toast('Challenge link copied.');}
      }catch(error){
        if(error?.name==='AbortError')return;
        await navigator.clipboard.writeText(url);
        toast('Challenge link copied.');
      }
    }catch(error){toast(String(error?.message||'Challenge link could not be created.'));}
    finally{creating=false;if(trigger){trigger.disabled=false;trigger.textContent='CHALLENGE A FRIEND';}}
  }
  function relabelChallengeButton(){
    const button=document.querySelector('[data-five-round-share]');
    if(!button)return;
    button.textContent='CHALLENGE A FRIEND';
    button.setAttribute('aria-label','Challenge a friend to the same five Blind Resume matchups');
    button.dataset.blindResumeChallenge='true';
  }
  function installRelabelHooks(){
    const reveal=document.getElementById('blindReveal');
    reveal?.addEventListener('click',()=>window.setTimeout(relabelChallengeButton,0));
    document.querySelector('[data-play-mode="blind"]')?.addEventListener('click',()=>window.setTimeout(relabelChallengeButton,0));
    window.addEventListener('ufc-scoring-pipeline-ready',()=>window.setTimeout(relabelChallengeButton,0));
    window.setTimeout(relabelChallengeButton,1800);
  }

  document.addEventListener('click',event=>{
    const trigger=event.target.closest?.('[data-five-round-share],[data-blind-resume-challenge]');
    if(!trigger)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    createChallenge(trigger);
  },true);

  installRelabelHooks();
  document.documentElement.setAttribute('data-blind-resume-standalone-share',VERSION);
})();
