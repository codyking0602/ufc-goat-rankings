(function(){
  'use strict';

  const VERSION='what-changed-data-20260721f-ready-lifecycle';
  const DAY_MS=86400000;
  const RULES=Object.freeze({liveDays:7,retentionDays:15,maxLiveEntries:6,rankMoveThreshold:3});
  const AUTO_STORAGE_KEY='octagon-hq-what-changed-auto-v1';

  // Keep manual cards for major launches only. Routine game changes stay out of this feed.
  const releaseEntries=[
    {
      id:'shanes-fighters-to-watch-20260719',
      publishedAt:'2026-07-19T09:00:00-05:00',
      type:'New Feature',
      headline:'New: Shane’s Fighters to Watch',
      summary:'A new scouting board at the bottom of Home tracks Shane’s early prospect calls, led by Fatima “The Archangel” Kline, with UFC profile links and headshots as they are added.',
      destination:'home'
    },
    {
      id:'wavelength-game-20260719',
      publishedAt:'2026-07-19T20:00:00-05:00',
      type:'New Game',
      headline:'New game: Wavelength',
      summary:'Four adaptive UFC clues steer you toward one hidden 1–100 number. Every Play game can now challenge a profile or share by text.',
      destination:'play'
    },
    {
      id:'smart-notifications-20260718',
      publishedAt:'2026-07-18T11:46:00-05:00',
      type:'App Updated',
      headline:'Smart notifications are live',
      summary:'Get direct challenges, missing-Picks reminders, and War Room alerts on your device.',
      destination:'home'
    },
    {
      id:'octagon-hq-redesign-20260718',
      publishedAt:'2026-07-18T10:20:00-05:00',
      type:'App Updated',
      headline:'Octagon HQ app redesign',
      summary:'A cleaner six-tab app with rebuilt Home, Play, Picks, War Room, Intelligence, profiles, and challenges.',
      destination:'home'
    },
    {
      id:'anthony-pettis-added-20260717',
      publishedAt:'2026-07-17T15:46:03-05:00',
      type:'Fighter Added',
      headline:'New fighter: Anthony Pettis',
      summary:'Showtime joined the UFC-only rankings at #80 with a full profile and Watch Moments.',
      fighterSlug:'anthony-pettis',
      verified:{rankAtPublish:80}
    }
  ];

  const text=value=>String(value??'').trim();
  const slugify=value=>text(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const number=value=>Number.isFinite(Number(value))?Number(value):null;
  const pipelineReady=()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready';

  function centralDayParts(date){
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
      return Object.fromEntries(parts.map(part=>[part.type,part.value]));
    }catch(_error){
      return{year:String(date.getFullYear()),month:String(date.getMonth()+1).padStart(2,'0'),day:String(date.getDate()).padStart(2,'0')};
    }
  }

  function dayNumber(value){
    const date=value instanceof Date?value:new Date(value);
    if(Number.isNaN(date.getTime()))return NaN;
    const parts=centralDayParts(date);
    return Date.UTC(Number(parts.year),Number(parts.month)-1,Number(parts.day));
  }

  function ageDays(publishedAt,now){
    const published=dayNumber(publishedAt);
    const current=dayNumber(now);
    if(!Number.isFinite(published)||!Number.isFinite(current))return Infinity;
    return Math.floor((current-published)/DAY_MS);
  }

  function rankingRows(){
    const data=window.RANKING_DATA||{};
    return [...(Array.isArray(data.men)?data.men:[]),...(Array.isArray(data.women)?data.women:[])];
  }

  function currentSnapshot(){
    const fighters={};
    rankingRows().forEach(row=>{
      const slug=slugify(row?.fighter);
      if(!slug)return;
      fighters[slug]={name:text(row.fighter),rank:number(row.rank)};
    });

    const games=(window.UFC_PLAY_HUB?.games||[])
      .filter(game=>game?.live)
      .map(game=>text(game.id))
      .filter(Boolean)
      .sort();

    const watchlist=(window.SHANES_FIGHTERS_TO_WATCH?.fighters||[])
      .map(fighter=>text(fighter?.id))
      .filter(Boolean)
      .sort();

    return{fighters,games,watchlist};
  }

  function readAutoState(){
    try{
      const parsed=JSON.parse(localStorage.getItem(AUTO_STORAGE_KEY)||'null');
      return parsed&&typeof parsed==='object'?parsed:{snapshot:null,events:[]};
    }catch(_error){
      return{snapshot:null,events:[]};
    }
  }

  function writeAutoState(value){
    try{localStorage.setItem(AUTO_STORAGE_KEY,JSON.stringify(value));}catch(_error){}
  }

  function fighterDetails(slug,snapshot){
    return snapshot?.fighters?.[slug]||{name:slug.replace(/-/g,' '),rank:null};
  }

  function fighterAddedEntries(slugs,publishedAt,snapshot){
    if(slugs.length>=3){
      const names=slugs.map(slug=>fighterDetails(slug,snapshot).name);
      return[{
        id:`fighters-added-${publishedAt.slice(0,10)}-${slugs.join('-')}`,
        publishedAt,
        type:'Fighter Added',
        headline:`${slugs.length} new fighters added`,
        summary:`${names.join(', ')} joined the UFC-only rankings.`,
        destination:'rankings'
      }];
    }

    return slugs.map(slug=>{
      const fighter=fighterDetails(slug,snapshot);
      return{
        id:`fighter-added-${slug}-${publishedAt.slice(0,10)}`,
        publishedAt,
        type:'Fighter Added',
        headline:`New fighter: ${fighter.name}`,
        summary:`${fighter.name} joined the UFC-only rankings${fighter.rank?` at #${fighter.rank}`:''}.`,
        fighterSlug:slug,
        verified:fighter.rank?{rankAtPublish:fighter.rank}:undefined
      };
    });
  }

  function rankChangedEntries(changes,publishedAt){
    if(changes.length===1){
      const change=changes[0];
      return[{
        id:`rank-change-${change.slug}-${publishedAt.slice(0,10)}`,
        publishedAt,
        type:'Rank Changed',
        headline:`${change.name} moves to #${change.after}`,
        summary:`${change.name} moved ${Math.abs(change.before-change.after)} spots in the UFC-only rankings.`,
        fighterSlug:change.slug,
        verified:{beforeRank:change.before,afterRank:change.after}
      }];
    }

    if(!changes.length)return[];
    return[{
      id:`rank-changes-${publishedAt.slice(0,10)}-${changes.map(change=>change.slug).join('-')}`,
      publishedAt,
      type:'Rank Changed',
      headline:`${changes.length} fighters moved 3+ spots`,
      summary:changes.map(change=>`${change.name} #${change.before} → #${change.after}`).join(' · '),
      destination:'rankings'
    }];
  }

  function gameAddedEntries(ids,publishedAt){
    const games=window.UFC_PLAY_HUB?.games||[];
    return ids.map(id=>{
      const game=games.find(item=>item?.id===id)||{};
      const title=text(game.title)||id.replace(/-/g,' ');
      return{
        id:`new-game-${id}-${publishedAt.slice(0,10)}`,
        publishedAt,
        type:'New Game',
        headline:`New game: ${title}`,
        summary:text(game.description)||`${title} is now live in Play.`,
        destination:'play'
      };
    });
  }

  function watchlistAddedEntries(ids,publishedAt){
    const fighters=window.SHANES_FIGHTERS_TO_WATCH?.fighters||[];
    const names=ids.map(id=>text(fighters.find(fighter=>fighter?.id===id)?.name)||id.replace(/-/g,' '));
    if(ids.length>=3){
      return[{
        id:`watchlist-added-${publishedAt.slice(0,10)}-${ids.join('-')}`,
        publishedAt,
        type:'Fighter to Watch',
        headline:`${ids.length} fighters added to Shane’s watchlist`,
        summary:`Shane added ${names.join(', ')} to Fighters to Watch.`,
        destination:'home'
      }];
    }
    return ids.map((id,index)=>({
      id:`watchlist-added-${id}-${publishedAt.slice(0,10)}`,
      publishedAt,
      type:'Fighter to Watch',
      headline:`New fighter to watch: ${names[index]}`,
      summary:`Shane added ${names[index]} to Fighters to Watch.`,
      destination:'home'
    }));
  }

  function detectAutomaticEntries(){
    const now=new Date();
    const stored=readAutoState();
    const retained=(Array.isArray(stored.events)?stored.events:[])
      .filter(entry=>ageDays(entry?.publishedAt,now)<=RULES.retentionDays);

    // Consume the canonical ranking-ready state; never baseline transient startup rows.
    if(!pipelineReady())return retained;

    const publishedAt=now.toISOString();
    const current=currentSnapshot();
    const previous=stored.snapshot;

    if(!previous?.fighters){
      writeAutoState({snapshot:current,events:retained});
      return retained;
    }

    const previousFighters=previous.fighters||{};
    const addedFighters=Object.keys(current.fighters).filter(slug=>!previousFighters[slug]);
    const rankChanges=Object.keys(current.fighters).flatMap(slug=>{
      if(!previousFighters[slug]||addedFighters.includes(slug))return[];
      const before=number(previousFighters[slug]?.rank);
      const after=number(current.fighters[slug]?.rank);
      if(before===null||after===null||Math.abs(before-after)<RULES.rankMoveThreshold)return[];
      return[{slug,name:current.fighters[slug].name,before,after}];
    });
    const addedGames=current.games.filter(id=>!(previous.games||[]).includes(id));
    const addedWatchlist=current.watchlist.filter(id=>!(previous.watchlist||[]).includes(id));

    const detected=[
      ...fighterAddedEntries(addedFighters,publishedAt,current),
      ...rankChangedEntries(rankChanges,publishedAt),
      ...gameAddedEntries(addedGames,publishedAt),
      ...watchlistAddedEntries(addedWatchlist,publishedAt)
    ];

    const byId=new Map([...retained,...detected].filter(entry=>entry?.id).map(entry=>[entry.id,entry]));
    const events=[...byId.values()];
    writeAutoState({snapshot:current,events});
    return events;
  }

  function completePicksEvent(event){
    if(!event)return false;
    if(event.status==='complete')return true;
    const fights=Array.isArray(event.fights)?event.fights:[];
    return fights.length>0&&fights.every(fight=>fight?.resultStatus==='complete'&&fight?.winner);
  }

  function picksRecapEntries(){
    return (window.UFC_PICKS_EVENTS||[]).flatMap(event=>{
      if(!completePicksEvent(event))return[];
      const fights=Array.isArray(event.fights)?event.fights:[];
      const completed=fights.filter(fight=>fight?.resultStatus==='complete'&&fight?.winner);
      const main=completed.find(fight=>text(fight.cardSection).toLowerCase()==='main event')||completed.at(-1);
      if(!main?.winner)return[];
      const locks=completed.map(fight=>new Date(fight.lockAt).getTime()).filter(Number.isFinite);
      const latestLock=locks.length?Math.max(...locks):new Date(event.eventDate).getTime();
      const publishedAt=text(event.completedAt)||(Number.isFinite(latestLock)?new Date(latestLock+2*3600000).toISOString():event.eventDate);
      return[{
        id:`picks-recap-${event.id}`,
        publishedAt,
        type:'Picks Results',
        headline:`${text(event.name)||'UFC event'} recap: ${main.winner} wins`,
        summary:`${main.winner} won the main event. Open Picks for the final standings, winning picks, and misses.`,
        destination:'picks',
        eventId:event.id
      }];
    });
  }

  function getEntries({now=new Date()}={}){
    const current=now instanceof Date?now:new Date(now);
    const combined=[...releaseEntries,...detectAutomaticEntries(),...picksRecapEntries()];
    const byId=new Map(combined.filter(entry=>entry?.id).map(entry=>[entry.id,entry]));
    const eligible=[...byId.values()].flatMap(entry=>{
      const age=ageDays(entry.publishedAt,current);
      if(age<0||age>RULES.retentionDays)return[];
      return[{...entry,lifecycle:age<=RULES.liveDays?'live':'archive',ageDays:age}];
    }).sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt));

    const live=eligible.filter(entry=>entry.lifecycle==='live').slice(0,RULES.maxLiveEntries);
    const archive=eligible.filter(entry=>entry.lifecycle==='archive');
    return[...live,...archive];
  }

  const source={
    version:VERSION,
    timezone:'America/Chicago',
    seenStorageKey:'octagon-hq-what-changed-seen-v1',
    autoStorageKey:AUTO_STORAGE_KEY,
    rules:RULES,
    automaticCategories:Object.freeze(['Fighter Added','Rank Changed','New Game','Picks Results','Fighter to Watch']),
    getEntries
  };
  Object.defineProperty(source,'entries',{enumerable:true,get:()=>getEntries()});
  window.OCTAGON_CHANGELOG=Object.freeze(source);

  window.addEventListener('ufc-picks-events-updated',()=>window.UFC_APP_UPDATE_WATCHER?.syncUnread?.());
  if(!pipelineReady()){
    window.addEventListener('ufc-scoring-pipeline-ready',()=>window.UFC_APP_UPDATE_WATCHER?.syncUnread?.(),{once:true});
  }

  if(!document.querySelector('script[data-all-game-challenges-loader]')){
    const script=document.createElement('script');
    script.src='assets/js/game-challenges.js?v=game-challenges-20260721c-wavelength-play-now';
    script.async=false;
    script.dataset.allGameChallengesLoader='true';
    document.head.appendChild(script);
  }
})();
