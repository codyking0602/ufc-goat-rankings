// Final profile renderer for the calculated ranking runtime.
// Preserves presentation copy/layout while taking rank, OVR, and snapshot stats only from calculated app data.
(function(){
  'use strict';

  const VERSION='calculated-profile-runtime-20260715d-streak-fallback';
  const pct=value=>Number.isFinite(Number(value))?`${Number(value).toFixed(1).replace(/\.0$/,'')}%`:'—';
  const years=value=>Number.isFinite(Number(value))?Number(value).toFixed(1):'—';
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function rowFor(name){
    const target=String(name||'').trim().toLowerCase();
    const data=window.RANKING_DATA||{};
    const board=[...(data.men||[]),...(data.women||[])].find(row=>String(row?.fighter||'').trim().toLowerCase()===target)||null;
    const profile=(data.fighters||[]).find(row=>String(row?.fighter||'').trim().toLowerCase()===target)||null;
    return board||profile?{...(profile||{}),...(board||{})}:null;
  }

  function longestWinStreakFromFights(fights){
    let current=0;
    let longest=0;
    (Array.isArray(fights)?fights:[]).forEach(fight=>{
      if(fight?.scoringDisposition==='count-win'){
        current+=1;
        longest=Math.max(longest,current);
      }else{
        current=0;
      }
    });
    return longest;
  }

  function longestWinStreakFor(name){
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    if(!facts?.get)return null;
    const record=facts.get(name);
    return record?longestWinStreakFromFights(record.fights):null;
  }

  function rowStreak(f){
    const visible=f?.visibleStats||{};
    const value=Number(visible.longestUfcWinStreak??visible.longestWinStreak??f?.longestUfcWinStreak??f?.longestWinStreak);
    return Number.isInteger(value)&&value>=0?value:null;
  }

  function snapshotFor(f){
    const visible=f.visibleStats||{};
    const canonicalStreak=longestWinStreakFor(f.fighter);
    const longestWinStreak=Number.isInteger(canonicalStreak)?canonicalStreak:rowStreak(f);
    return [
      ['UFC Record',visible.ufcRecord||f.ufcRecord||'—'],
      ['UFC Title-Fight Wins',visible.titleFightWins??f.titleFightWins??'—'],
      ['Top-5 Wins',visible.topFiveWins??f.topFiveWins??'—'],
      ['Prime UFC Record',visible.primeRecord||f.primeRecord||'—'],
      ['Finish Rate',pct(visible.finishRatePct??f.finishRatePct)],
      ['Rounds Won',pct(visible.roundsWonPct??f.roundsWonPct)],
      ['Active Elite Years',years(visible.activeEliteYears??f.activeEliteYears)],
      ['Longest UFC Win Streak',Number.isInteger(longestWinStreak)?longestWinStreak:'—']
    ];
  }

  function renderSnapshot(rows){
    if(typeof window.snapshotGrid==='function')return window.snapshotGrid(rows);
    return `<div class="snapshot-grid">${rows.map(([label,value])=>`<div class="snapshot-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div>`;
  }

  function displayNameFor(f,override){
    return override?.profileDisplayName
      ||override?.fighterDisplayName
      ||window.UFC_PROFILE_TEMPLATE_SYSTEM?.profileDisplayNames?.[f.fighter]
      ||f.fighter;
  }

  function categoryMarkup(f){
    return typeof window.categoryCards==='function'?window.categoryCards(f):'';
  }

  function install(){
    window.openFighter=function(name){
      const f=rowFor(name);
      if(!f)return;
      const override=window.DISPLAY_OVERRIDES?.[f.fighter]||{};
      const rankLabel=f.rank||'—';
      const divisionLabel=override.divisionLabel||`${f.primaryDivision||''}${f.secondaryDivision?` / ${f.secondaryDivision}`:''}`;
      const photoUrl=override.photoUrl||'';
      const photoClass=photoUrl?'fighter-photo has-photo':'fighter-photo';
      const rankedSectionTitle=Number(rankLabel)===1?'Why Not Lower?':'Why Not Ranked Higher?';
      const rankedSectionBody=Number(rankLabel)===1
        ?`<p>${override.whyNotLower||'The #1 case holds because the fighters below do not match the same full blend of title volume, elite wins, longevity, and clean loss context.'}</p>`
        :`<p>${override.whyNotHigher||'The ranking is showing which inputs keep the resume from climbing higher.'}</p>`;
      const displayName=displayNameFor(f,override);
      const ovr=Number.isFinite(Number(f.overallOvr))?Number(f.overallOvr):(typeof window.overallOvr==='function'?window.overallOvr(f):'—');
      const detail=document.getElementById('fighterDetail');
      if(!detail)return;

      detail.innerHTML=`
        <section class="profile-hero">
          <div class="${photoClass}">
            ${photoUrl?`<img src="${photoUrl}" alt="${f.fighter} profile photo" class="fighter-photo-img" style="object-position:${override.photoPosition||'center top'}">`:`<div class="photo-initials">${typeof window.fighterInitials==='function'?window.fighterInitials(f.fighter):escapeHtml(f.fighter.slice(0,2).toUpperCase())}</div>`}
            ${override.photoNote?`<div class="photo-note">${override.photoNote}</div>`:(!photoUrl?'<div class="photo-note">Photo slot: use a licensed upper-half fighter crop, centered from head to waist.</div>':'')}
          </div>
          <div class="profile-summary">
            <div class="profile-topline"><span class="profile-pill gold">UFC All-Time Rank: #${rankLabel}</span><span class="profile-pill">${divisionLabel}</span></div>
            <h2>${displayName}</h2>
            <div class="profile-ovr-wrap"><div class="profile-ovr">${ovr} <small>OVR</small></div></div>
            <p class="profile-copy">${override.oneLiner||`${f.fighter}'s UFC resume is graded across championship success, quality wins, prime dominance, elite longevity, and loss context.`}</p>
          </div>
        </section>
        <section class="profile-main-flow">
          <div class="card"><h3>Resume Snapshot</h3>${renderSnapshot(snapshotFor(f))}</div>
          <div class="category-grid">${categoryMarkup(f)}</div>
          <div id="categoryExplanation"></div>
          <div class="card"><h3>Why Ranked Here</h3><p>${override.whyRankedHere||`${f.fighter} ranks here based on the current UFC-only balance of championship success, quality wins, prime dominance, and active elite longevity.`}</p></div>
          <div class="card"><h3>${rankedSectionTitle}</h3>${rankedSectionBody}</div>
        </section>`;

      const drawer=document.getElementById('drawer');
      drawer?.classList.add('open');
      drawer?.setAttribute('aria-hidden','false');
      const panel=document.querySelector('.drawer-panel');
      if(panel)panel.scrollTop=0;
      if(typeof window.attachCategoryExplanations==='function')window.attachCategoryExplanations(f);
    };

    window.UFC_CALCULATED_PROFILE_RUNTIME={
      version:VERSION,
      rankOwner:'RANKING_DATA.rank',
      ovrOwner:'RANKING_DATA.overallOvr',
      snapshotOwner:'RANKING_DATA.visibleStats',
      streakOwner:'UFC_CANONICAL_FIGHTER_FACTS.fights with calculated-row fallback',
      longestWinStreakFromFights,
      longestWinStreakFor,
      rowStreak,
      snapshotFor
    };
    document.documentElement.setAttribute('data-calculated-profile-runtime',VERSION);
  }

  install();
})();