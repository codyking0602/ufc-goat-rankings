(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  if(!config.url || !config.anonKey || !window.supabase?.createClient) return;

  const client=window.supabase.createClient(config.url,config.anonKey);
  let lastSignature='';
  let loading=false;

  const safe=value=>String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  function roomCode(){
    const urlCode=new URL(window.location.href).searchParams.get('room');
    const bannerCode=document.querySelector('#picksRoomBanner .picks-code')?.textContent;
    return String(urlCode || bannerCode || '').trim().toUpperCase();
  }

  function memberToken(code){
    return code ? localStorage.getItem(`ufc-picks:room:${code}`) : null;
  }

  function isFinal(event){
    if(!event) return false;
    if(event.status==='complete') return true;
    const fights=event.fights || [];
    return fights.length>0 && fights.every(fight=>fight.resultStatus && fight.resultStatus!=='scheduled');
  }

  function gradedFights(event){
    return (event?.fights || []).filter(fight=>fight.resultStatus==='complete' && fight.winner);
  }

  function pickFor(member,fightId){
    return (member.visible_picks || []).find(pick=>pick.fight_id===fightId) || null;
  }

  function scoreMembers(members){
    return [...members].sort((a,b)=>(b.score||0)-(a.score||0) || (b.correct||0)-(a.correct||0) || String(a.display_name).localeCompare(String(b.display_name)));
  }

  function accuracy(correct,total){
    return total ? Math.round((correct/total)*100) : 0;
  }

  function formatOdds(value){
    const n=Number(value);
    if(!Number.isFinite(n) || n===0) return '';
    return n>0 ? `+${n}` : String(n);
  }

  function recapData(event,snapshot){
    const members=scoreMembers(snapshot.members || []);
    const graded=gradedFights(event);
    const topScore=members.length ? Math.max(...members.map(member=>member.score||0)) : 0;
    const champions=members.filter(member=>(member.score||0)===topScore);

    let groupCorrect=0;
    let groupPicks=0;
    let bestUpset=null;
    let consensusHit=null;
    let roomTrap=null;
    const lockHits=[];

    members.forEach(member=>{
      graded.forEach(fight=>{
        const pick=pickFor(member,fight.id);
        if(!pick) return;
        groupPicks+=1;
        if(pick.fighter_name===fight.winner) groupCorrect+=1;
        if(pick.is_underdog_lock && pick.fighter_name===fight.winner) lockHits.push(member.display_name);
      });
    });

    graded.forEach(fight=>{
      const fightPicks=members.map(member=>pickFor(member,fight.id)).filter(Boolean);
      if(!fightPicks.length) return;
      const correct=fightPicks.filter(pick=>pick.fighter_name===fight.winner).length;
      const rate=correct/fightPicks.length;
      const winnerOdds=fight.winner===fight.red ? Number(fight.redOdds) : Number(fight.blueOdds);

      if(correct>0 && Number.isFinite(winnerOdds) && winnerOdds>0){
        if(!bestUpset || winnerOdds>bestUpset.odds){
          bestUpset={fight,winner:fight.winner,odds:winnerOdds,correct};
        }
      }

      if(!consensusHit || rate>consensusHit.rate){
        consensusHit={fight,winner:fight.winner,rate,correct,total:fightPicks.length};
      }
      if(!roomTrap || rate<roomTrap.rate){
        roomTrap={fight,winner:fight.winner,rate,correct,total:fightPicks.length};
      }
    });

    return {
      members,
      graded,
      champions,
      topScore,
      groupCorrect,
      groupPicks,
      groupAccuracy:accuracy(groupCorrect,groupPicks),
      bestUpset,
      consensusHit,
      roomTrap,
      lockHits:[...new Set(lockHits)]
    };
  }

  function memberRecord(member,graded){
    let made=0;
    let correct=0;
    graded.forEach(fight=>{
      const pick=pickFor(member,fight.id);
      if(!pick) return;
      made+=1;
      if(pick.fighter_name===fight.winner) correct+=1;
    });
    return {made,correct,pct:accuracy(correct,made)};
  }

  function awardCard(kicker,title,copy){
    return `<div class="picks-recap-award"><span>${safe(kicker)}</span><strong>${safe(title)}</strong><small>${safe(copy)}</small></div>`;
  }

  function renderRecap(event,snapshot){
    const data=recapData(event,snapshot);
    const me=snapshot.me;
    const myMember=data.members.find(member=>member.id===me?.id) || me;
    const myRecord=myMember ? memberRecord(myMember,data.graded) : {made:0,correct:0,pct:0};
    const championNames=data.champions.map(member=>member.display_name).join(' & ') || 'No winner';
    const championLabel=data.champions.length>1 ? 'Co-Champions' : 'Room Champion';
    const allPicked=data.members.length;

    const awards=[];
    if(data.bestUpset){
      awards.push(awardCard('BEST UPSET CALL',`${data.bestUpset.winner} ${formatOdds(data.bestUpset.odds)}`,`${data.bestUpset.correct} player${data.bestUpset.correct===1?'':'s'} got it right`));
    }else{
      awards.push(awardCard('BEST UPSET CALL','No plus-money winner hit','The room played this one straight'));
    }
    if(data.consensusHit){
      awards.push(awardCard('ROOM NAILED IT',data.consensusHit.winner,`${Math.round(data.consensusHit.rate*100)}% of submitted picks were correct`));
    }
    if(data.roomTrap){
      awards.push(awardCard('ROOM TRAP',`${data.roomTrap.fight.red} vs. ${data.roomTrap.fight.blue}`,`Only ${data.roomTrap.correct}/${data.roomTrap.total} picked ${data.roomTrap.winner}`));
    }
    awards.push(awardCard('UNDERDOG LOCK',data.lockHits.length ? data.lockHits.join(', ') : 'No lock winner',data.lockHits.length ? `${data.lockHits.length} bonus hit${data.lockHits.length===1?'':'s'}` : 'Nobody landed the bonus'));

    const leaderboard=data.members.map((member,index)=>{
      const record=memberRecord(member,data.graded);
      return `<div class="picks-recap-row${index===0?' champion':''}">
        <span class="picks-recap-place">${index+1}</span>
        <div><strong>${safe(member.display_name)}${member.id===me?.id?' <em>YOU</em>':''}</strong><small>${record.correct}/${record.made} correct · ${record.pct}%${member.upset_bonus?' · +1 lock':''}</small></div>
        <b>${member.score||0}<small>PTS</small></b>
      </div>`;
    }).join('');

    const card=document.getElementById('picksEventRecap');
    if(!card) return;
    card.hidden=false;
    card.innerHTML=`
      <div class="picks-recap-hero">
        <div class="picks-recap-kicker">EVENT FINAL</div>
        <div class="picks-recap-title-row">
          <div><h3>${safe(event.name)} Room Recap</h3><p>${safe(event.subtitle || '')}</p></div>
          <span>${data.graded.length} graded fights</span>
        </div>
        <div class="picks-recap-champion">
          <span>${safe(championLabel)}</span>
          <strong>${safe(championNames)}</strong>
          <b>${data.topScore} PTS</b>
        </div>
        <div class="picks-recap-stats">
          <div><strong>${allPicked}</strong><span>players</span></div>
          <div><strong>${data.groupAccuracy}%</strong><span>group accuracy</span></div>
          <div><strong>${myRecord.correct}/${myRecord.made}</strong><span>your picks</span></div>
          <div><strong>${myMember?.score||0}</strong><span>your points</span></div>
        </div>
      </div>
      <div class="picks-recap-awards">${awards.join('')}</div>
      <div class="picks-recap-board">
        <div class="picks-recap-board-head"><div><span>FINAL TABLE</span><h4>Room Standings</h4></div><button id="picksShareRecap" type="button">Share recap</button></div>
        <div class="picks-recap-rows">${leaderboard}</div>
      </div>
      <div class="picks-recap-actions"><button id="picksSeeAllResults" type="button">See fight results</button><button id="picksSeeAllRoomPicks" type="button">See every room pick</button></div>`;

    document.getElementById('picksShareRecap')?.addEventListener('click',()=>shareRecap(event,data));
    document.getElementById('picksSeeAllResults')?.addEventListener('click',()=>{
      const details=document.querySelector('.picks-locked-section');
      if(details) details.open=true;
      details?.scrollIntoView({behavior:'smooth',block:'start'});
    });
    document.getElementById('picksSeeAllRoomPicks')?.addEventListener('click',()=>{
      const card=document.getElementById('picksRoomPicksCard');
      card?.scrollIntoView({behavior:'smooth',block:'start'});
      window.setTimeout(()=>document.querySelector('.picks-room-picks-toggle')?.click(),350);
    });

    applyFinalMode(event);
  }

  async function shareRecap(event,data){
    const championNames=data.champions.map(member=>member.display_name).join(' & ') || 'No winner';
    const text=`${championNames} won ${event.name} Picks with ${data.topScore} points. Group accuracy: ${data.groupAccuracy}%.`;
    try{
      if(navigator.share) await navigator.share({title:`${event.name} Picks Recap`,text,url:window.location.href});
      else{
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        const toast=document.getElementById('picksToast');
        if(toast){ toast.textContent='Recap copied'; toast.classList.add('show'); window.setTimeout(()=>toast.classList.remove('show'),1600); }
      }
    }catch(_error){}
  }

  function applyFinalMode(event){
    document.getElementById('picksProgress')?.closest('.picks-progress-card')?.setAttribute('hidden','');
    document.getElementById('picksStandingsCard')?.setAttribute('hidden','');

    const admin=document.getElementById('picksAdminPanel');
    if(admin){
      admin.open=false;
      const summary=admin.querySelector('summary');
      if(summary) summary.childNodes[0].textContent='Results & Corrections ';
    }

    document.querySelectorAll('.picks-locked-section summary span').forEach(node=>{ node.textContent='Fight results'; });
    const roomPicksTitle=document.querySelector('#picksRoomPicksCard h3');
    if(roomPicksTitle) roomPicksTitle.textContent='Full Room Pick History';
    const subtitle=document.querySelector('#picksRoomPicksCard .picks-card-subtitle');
    if(subtitle) subtitle.textContent='Every revealed pick from the completed event.';

    const hero=document.getElementById('picksEventHero');
    hero?.classList.add('is-complete');
  }

  function clearFinalMode(){
    const card=document.getElementById('picksEventRecap');
    if(card){ card.hidden=true; card.innerHTML=''; }
    document.getElementById('picksProgress')?.closest('.picks-progress-card')?.removeAttribute('hidden');
  }

  async function refresh(){
    if(loading) return;
    const code=roomCode();
    const token=memberToken(code);
    if(!code || !token){ clearFinalMode(); return; }

    loading=true;
    try{
      const [{data:events,error:eventError},{data:snapshot,error:snapshotError}]=await Promise.all([
        client.rpc('picks_public_events'),
        client.rpc('picks_room_snapshot',{p_room_code:code,p_member_token:token})
      ]);
      if(eventError || snapshotError || !snapshot?.room) return;
      const event=(events || []).find(item=>item.id===snapshot.room.event_id);
      if(!isFinal(event)){ clearFinalMode(); return; }

      const signature=JSON.stringify({
        event:event.id,
        status:event.status,
        fights:(event.fights||[]).map(fight=>[fight.id,fight.resultStatus,fight.winner]),
        members:(snapshot.members||[]).map(member=>[member.id,member.score,member.correct,member.picks_made,member.upset_bonus])
      });
      if(signature===lastSignature && document.getElementById('picksEventRecap')?.innerHTML) return;
      lastSignature=signature;
      renderRecap(event,snapshot);
    }finally{
      loading=false;
    }
  }

  function ensureCard(){
    if(document.getElementById('picksEventRecap')) return;
    const shell=document.querySelector('#picks .picks-shell');
    const banner=document.getElementById('picksRoomBanner');
    if(!shell || !banner) return;
    const card=document.createElement('section');
    card.id='picksEventRecap';
    card.className='picks-event-recap';
    card.hidden=true;
    banner.insertAdjacentElement('afterend',card);
  }

  function start(){
    ensureCard();
    refresh();
    const observer=new MutationObserver(()=>{
      ensureCard();
      window.clearTimeout(start.timer);
      start.timer=window.setTimeout(refresh,120);
    });
    observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true});
    window.setInterval(refresh,30000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();