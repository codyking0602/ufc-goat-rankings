(function(){
  'use strict';

  const VERSION = 'play-data-20260715a-phase-two';
  const VALID_GENDERS = new Set(['men','women']);
  const VALID_TIERS = new Set(['legend','elite','contender','recognizable','wildcard']);
  const GAME_KEYS = {
    'blind-rank':'blindRank',
    blindRank:'blindRank',
    'keep-cut':'keepCut',
    keepCut:'keepCut',
    'better-than':'betterThan',
    betterThan:'betterThan',
    'find-leader':'findLeader',
    findLeader:'findLeader'
  };

  const EXTRA_FIGHTERS = [
    {name:'CM Punk',aliases:['Phil Brooks'],gender:'men',divisions:['Welterweight'],eras:['superstar'],selectionTier:'wildcard',tags:['celebrity','wildcard','cult']},
    {name:'Kevin Holland',aliases:['Trailblazer','Big Mouth'],gender:'men',divisions:['Welterweight','Middleweight'],eras:['apex','new-blood'],selectionTier:'recognizable',tags:['action','personality','fan-favorite']},
    {name:'Tai Tuivasa',aliases:['Bam Bam'],gender:'men',divisions:['Heavyweight'],eras:['apex','new-blood'],selectionTier:'recognizable',tags:['action','personality','fan-favorite']},
    {name:'Clay Guida',aliases:['The Carpenter'],gender:'men',divisions:['Lightweight','Featherweight'],eras:['tuf-boom','golden-age'],selectionTier:'recognizable',tags:['action','veteran','fan-favorite']},
    {name:'Diego Sanchez',aliases:['The Nightmare','The Dream'],gender:'men',divisions:['Welterweight','Lightweight','Middleweight'],eras:['tuf-boom','golden-age'],selectionTier:'recognizable',tags:['tuf-winner','action','cult']},
    {name:'Jorge Masvidal',aliases:['Gamebred'],gender:'men',divisions:['Welterweight','Lightweight'],eras:['superstar','apex'],selectionTier:'elite',tags:['star','action','title-challenger','never-undisputed-champion']},
    {name:'Nate Diaz',aliases:['Nathan Diaz'],gender:'men',divisions:['Welterweight','Lightweight'],eras:['golden-age','superstar'],selectionTier:'elite',tags:['star','action','fan-favorite','never-undisputed-champion']},
    {name:'Nick Diaz',aliases:[],gender:'men',divisions:['Welterweight','Middleweight'],eras:['tuf-boom','golden-age'],selectionTier:'elite',tags:['pioneer','cult','action','never-undisputed-champion']},
    {name:'Carlos Condit',aliases:['The Natural Born Killer'],gender:'men',divisions:['Welterweight'],eras:['tuf-boom','golden-age'],selectionTier:'elite',tags:['interim-champion','action','title-challenger']},
    {name:'Alexander Gustafsson',aliases:['The Mauler'],gender:'men',divisions:['Light Heavyweight','Heavyweight'],eras:['golden-age','superstar'],selectionTier:'elite',tags:['title-challenger','action','never-undisputed-champion']},
    {name:'Donald Cerrone',aliases:['Cowboy Cerrone','Cowboy'],gender:'men',divisions:['Lightweight','Welterweight'],eras:['golden-age','superstar'],selectionTier:'elite',tags:['action','veteran','fan-favorite','never-undisputed-champion']},
    {name:'Derrick Lewis',aliases:['The Black Beast'],gender:'men',divisions:['Heavyweight'],eras:['superstar','apex'],selectionTier:'recognizable',tags:['knockout','personality','title-challenger']},
    {name:'Dan Hooker',aliases:['The Hangman'],gender:'men',divisions:['Lightweight','Featherweight'],eras:['superstar','apex'],selectionTier:'contender',tags:['action','fan-favorite','never-undisputed-champion']},
    {name:'Michael Chandler',aliases:['Iron Michael Chandler','Iron'],gender:'men',divisions:['Lightweight'],eras:['apex','new-blood'],selectionTier:'elite',tags:['action','star','title-challenger','never-undisputed-champion']},
    {name:'Paulo Costa',aliases:['The Eraser','Borrachinha'],gender:'men',divisions:['Middleweight'],eras:['superstar','apex'],selectionTier:'contender',tags:['power','personality','title-challenger']},
    {name:'Yoel Romero',aliases:['Soldier of God'],gender:'men',divisions:['Middleweight','Light Heavyweight'],eras:['superstar','apex'],selectionTier:'elite',tags:['power','title-challenger','never-undisputed-champion']},
    {name:'Anthony Pettis',aliases:['Showtime Pettis','Showtime'],gender:'men',divisions:['Lightweight','Welterweight','Featherweight'],eras:['golden-age','superstar'],selectionTier:'elite',tags:['former-champion','highlight','star']},
    {name:'Rory MacDonald',aliases:['The Red King'],gender:'men',divisions:['Welterweight'],eras:['golden-age'],selectionTier:'elite',tags:['title-challenger','technical','never-undisputed-champion']},
    {name:'Colby Covington',aliases:['Chaos'],gender:'men',divisions:['Welterweight'],eras:['superstar','apex'],selectionTier:'elite',tags:['title-challenger','personality','never-undisputed-champion']},
    {name:'Stephen Thompson',aliases:['Wonderboy','Stephen Wonderboy Thompson'],gender:'men',divisions:['Welterweight'],eras:['superstar','apex'],selectionTier:'elite',tags:['striker','fan-favorite','title-challenger','never-undisputed-champion']},
    {name:'Cub Swanson',aliases:[],gender:'men',divisions:['Featherweight'],eras:['golden-age','superstar'],selectionTier:'contender',tags:['action','veteran','fan-favorite']},
    {name:'Chan Sung Jung',aliases:['The Korean Zombie','Korean Zombie'],gender:'men',divisions:['Featherweight'],eras:['golden-age','apex'],selectionTier:'elite',tags:['action','fan-favorite','title-challenger']},
    {name:'Urijah Faber',aliases:['The California Kid'],gender:'men',divisions:['Bantamweight'],eras:['tuf-boom','golden-age'],selectionTier:'elite',tags:['pioneer','title-challenger','fan-favorite']},
    {name:'Kevin Lee',aliases:['The Motown Phenom'],gender:'men',divisions:['Lightweight','Welterweight'],eras:['superstar','apex'],selectionTier:'contender',tags:['contender','interim-title-challenger']},
    {name:'Sage Northcutt',aliases:['Super Sage'],gender:'men',divisions:['Lightweight','Welterweight'],eras:['superstar'],selectionTier:'wildcard',tags:['prospect','personality','wildcard']},
    {name:'Kimbo Slice',aliases:['Kevin Ferguson','Kimbo'],gender:'men',divisions:['Heavyweight'],eras:['tuf-boom'],selectionTier:'wildcard',tags:['celebrity','cult','wildcard']},
    {name:'Matt Brown',aliases:['The Immortal'],gender:'men',divisions:['Welterweight'],eras:['tuf-boom','golden-age'],selectionTier:'recognizable',tags:['action','veteran','fan-favorite']},
    {name:'Joe Lauzon',aliases:['J-Lau'],gender:'men',divisions:['Lightweight'],eras:['tuf-boom','golden-age'],selectionTier:'recognizable',tags:['action','veteran','fan-favorite']},
    {name:'Chris Leben',aliases:['The Crippler'],gender:'men',divisions:['Middleweight'],eras:['tuf-boom','golden-age'],selectionTier:'recognizable',tags:['tuf-original','action','cult']},
    {name:'Houston Alexander',aliases:['The Assassin'],gender:'men',divisions:['Light Heavyweight'],eras:['tuf-boom'],selectionTier:'wildcard',tags:['knockout','wildcard','cult']},
    {name:'Edson Barboza',aliases:[],gender:'men',divisions:['Lightweight','Featherweight'],eras:['golden-age','superstar'],selectionTier:'elite',tags:['striker','highlight','action']},
    {name:'Mike Perry',aliases:['Platinum Mike Perry','Platinum'],gender:'men',divisions:['Welterweight'],eras:['superstar','apex'],selectionTier:'recognizable',tags:['action','personality','cult']},
    {name:'Darren Till',aliases:['The Gorilla'],gender:'men',divisions:['Welterweight','Middleweight'],eras:['superstar','apex'],selectionTier:'contender',tags:['star','title-challenger','personality']},
    {name:'Sam Alvey',aliases:['Smile’n Sam','Smilin Sam'],gender:'men',divisions:['Middleweight','Light Heavyweight'],eras:['superstar','apex'],selectionTier:'wildcard',tags:['veteran','personality','wildcard']},
    {name:'Artem Lobov',aliases:['The Russian Hammer'],gender:'men',divisions:['Featherweight','Lightweight'],eras:['superstar'],selectionTier:'wildcard',tags:['cult','personality','wildcard']},
    {name:'Michel Pereira',aliases:['Demolidor'],gender:'men',divisions:['Welterweight','Middleweight'],eras:['apex','new-blood'],selectionTier:'recognizable',tags:['highlight','action','wildcard']},
    {name:'Paige VanZant',aliases:['PVZ'],gender:'women',divisions:['Strawweight','Flyweight'],eras:['golden-age','superstar'],selectionTier:'recognizable',tags:['star','personality','fan-favorite']},
    {name:'Michelle Waterson-Gomez',aliases:['Michelle Waterson','The Karate Hottie'],gender:'women',divisions:['Strawweight'],eras:['superstar','apex'],selectionTier:'contender',tags:['striker','veteran','fan-favorite']},
    {name:'Angela Hill',aliases:['Overkill'],gender:'women',divisions:['Strawweight'],eras:['superstar','apex'],selectionTier:'recognizable',tags:['veteran','action','personality']},
    {name:'Maycee Barber',aliases:['The Future'],gender:'women',divisions:['Flyweight'],eras:['apex','new-blood'],selectionTier:'contender',tags:['contender','prospect','power']},
    {name:'Molly McCann',aliases:['Meatball Molly','Meatball'],gender:'women',divisions:['Flyweight','Strawweight'],eras:['apex','new-blood'],selectionTier:'recognizable',tags:['personality','action','fan-favorite']},
    {name:'Karolina Kowalkiewicz',aliases:[],gender:'women',divisions:['Strawweight'],eras:['golden-age','superstar'],selectionTier:'contender',tags:['title-challenger','veteran','striker']}
  ];

  function text(value){ return String(value ?? '').trim(); }
  function normal(value){
    return text(value)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/[’‘`]/g,"'")
      .replace(/[^a-zA-Z0-9]+/g,' ')
      .trim()
      .toLowerCase();
  }
  function slug(value){ return normal(value).replace(/\s+/g,'-'); }
  function unique(values){ return [...new Set((values || []).map(text).filter(Boolean))]; }
  function first(...values){ return values.find(value => text(value)) || ''; }
  function number(...values){
    const found = values.find(value => Number.isFinite(Number(value)));
    return found === undefined ? null : Number(found);
  }
  function normalizeDivisions(value){
    if(Array.isArray(value)) return unique(value);
    return unique(text(value).split(/\s*(?:\/|,|&|\band\b)\s*/i));
  }
  function tierFromRank(rank){
    if(!Number.isFinite(Number(rank))) return 'recognizable';
    if(rank <= 10) return 'legend';
    if(rank <= 25) return 'elite';
    if(rank <= 50) return 'contender';
    return 'recognizable';
  }
  function liveRows(){
    const data = window.RANKING_DATA || {};
    const women = new Set((data.women || []).map(row => normal(row?.fighter)));
    const rows = [...(data.fighters || []), ...(data.men || []), ...(data.women || [])];
    const merged = new Map();

    rows.forEach(row => {
      const name = text(row?.fighter);
      if(!name) return;
      const id = slug(name);
      const existing = merged.get(id) || {fighter:name};
      merged.set(id,{...existing,...row,fighter:name});
    });

    return [...merged.values()].map(row => {
      const name = row.fighter;
      const override = window.DISPLAY_OVERRIDES?.[name] || {};
      const modelRank = number(row.rank,override.allTimeRank);
      const divisions = normalizeDivisions(first(row.primaryDivision,row.division,row.weightClass));
      const titleWins = number(row.adjustedTitleWins,row.titleFightWins,row.ufcTitleFightWins,row.titleWins) || 0;
      const eraIds = window.UFC_ERA_FILTER_DATA?.eraIdsFor?.(name) || [];
      const gender = women.has(normal(name)) ? 'women' : 'men';
      const tags = unique([
        'model-ranked',
        gender,
        titleWins > 0 ? 'championship-experience' : '',
        row.active === true ? 'active' : '',
        ...divisions.map(division => slug(division))
      ]);

      return {
        id:slug(name),
        name,
        aliases:unique([name.replace(/[’]/g,"'")]),
        gender,
        primaryDivision:divisions[0] || '',
        divisions,
        eras:unique(eraIds),
        selectionTier:tierFromRank(modelRank),
        tags,
        source:'ranking-model',
        modelRanked:true,
        modelRank,
        modelScore:number(row.totalScore,row.rawScore),
        thumbUrl:first(override.thumbUrl,row.thumbUrl),
        profileUrl:first(override.photoUrl,row.photoUrl),
        eligibility:{
          blindRank:true,
          keepCut:true,
          betterThan:true,
          findLeader:false
        }
      };
    });
  }

  function extraRecord(row){
    return {
      id:slug(row.name),
      name:row.name,
      aliases:unique(row.aliases),
      gender:row.gender,
      primaryDivision:row.divisions?.[0] || '',
      divisions:unique(row.divisions),
      eras:unique(row.eras),
      selectionTier:row.selectionTier,
      tags:unique(['play-only',row.gender,...(row.tags || []),...(row.divisions || []).map(division => slug(division))]),
      source:'play-only',
      modelRanked:false,
      modelRank:null,
      modelScore:null,
      thumbUrl:'',
      profileUrl:'',
      eligibility:{
        blindRank:true,
        keepCut:true,
        betterThan:false,
        findLeader:false
      }
    };
  }

  function mergeRecord(base,extra){
    if(!base) return extra;
    return {
      ...base,
      aliases:unique([...(base.aliases || []),...(extra.aliases || [])]),
      divisions:unique([...(base.divisions || []),...(extra.divisions || [])]),
      eras:unique([...(base.eras || []),...(extra.eras || [])]),
      tags:unique([...(base.tags || []),...(extra.tags || [])]),
      primaryDivision:base.primaryDivision || extra.primaryDivision,
      selectionTier:base.modelRanked ? base.selectionTier : extra.selectionTier,
      eligibility:{
        blindRank:Boolean(base.eligibility?.blindRank || extra.eligibility?.blindRank),
        keepCut:Boolean(base.eligibility?.keepCut || extra.eligibility?.keepCut),
        betterThan:Boolean(base.modelRanked || base.eligibility?.betterThan),
        findLeader:Boolean(base.eligibility?.findLeader || extra.eligibility?.findLeader)
      }
    };
  }

  function matchesFilters(fighter,filters={}){
    if(filters.gender && filters.gender !== 'all' && fighter.gender !== filters.gender) return false;
    if(filters.division && filters.division !== 'all'){
      const target = normal(filters.division);
      if(!fighter.divisions.some(division => normal(division) === target)) return false;
    }
    if(filters.era && filters.era !== 'all' && !fighter.eras.includes(filters.era)) return false;
    if(filters.selectionTier && filters.selectionTier !== 'all' && fighter.selectionTier !== filters.selectionTier) return false;
    if(filters.modelRanked === true && !fighter.modelRanked) return false;
    if(filters.modelRanked === false && fighter.modelRanked) return false;
    if(filters.requirePhoto && !fighter.thumbUrl) return false;
    const tags = Array.isArray(filters.tags) ? filters.tags : filters.tag ? [filters.tag] : [];
    if(tags.length && !tags.every(tag => fighter.tags.includes(tag))) return false;
    return true;
  }

  const api = {
    version:VERSION,
    extras:EXTRA_FIGHTERS.map(row => ({...row})),
    allFighters:[],
    modelRanked:[],
    playOnly:[],
    byId:{},
    byName:{},
    audit:null,
    rebuild,
    resolve(value){
      const target = normal(value);
      if(!target) return null;
      return api.byId[slug(value)] || api.byName[target] || api.allFighters.find(fighter =>
        fighter.aliases.some(alias => normal(alias) === target)
      ) || null;
    },
    poolFor(gameId,filters={}){
      const key = GAME_KEYS[gameId] || gameId;
      return api.allFighters.filter(fighter => fighter.eligibility?.[key] && matchesFilters(fighter,filters));
    },
    search(query,options={}){
      const target = normal(query);
      const pool = options.game ? api.poolFor(options.game,options.filters) : api.allFighters.filter(fighter => matchesFilters(fighter,options.filters));
      const limit = Number.isFinite(Number(options.limit)) ? Number(options.limit) : 20;
      if(!target) return pool.slice(0,limit);
      return pool
        .map(fighter => {
          const haystack = normal([fighter.name,...fighter.aliases,...fighter.divisions,...fighter.eras,...fighter.tags].join(' '));
          const score = normal(fighter.name).startsWith(target) ? 3 : fighter.aliases.some(alias => normal(alias).startsWith(target)) ? 2 : haystack.includes(target) ? 1 : 0;
          return {fighter,score};
        })
        .filter(row => row.score > 0)
        .sort((a,b) => b.score - a.score || (a.fighter.modelRank || 999) - (b.fighter.modelRank || 999) || a.fighter.name.localeCompare(b.fighter.name))
        .slice(0,limit)
        .map(row => row.fighter);
    }
  };

  let lastSignature = '';

  function buildAudit(records){
    const errors = [];
    const idSet = new Set();
    const nameSet = new Set();
    const eraIds = new Set((window.UFC_ERA_FILTER_DATA?.eras || []).map(era => era.id));

    records.forEach(fighter => {
      if(!fighter.id || idSet.has(fighter.id)) errors.push(`Duplicate or missing fighter id: ${fighter.id || fighter.name}`);
      idSet.add(fighter.id);
      const nameKey = normal(fighter.name);
      if(!nameKey || nameSet.has(nameKey)) errors.push(`Duplicate or missing fighter name: ${fighter.name}`);
      nameSet.add(nameKey);
      if(!VALID_GENDERS.has(fighter.gender)) errors.push(`${fighter.name} has invalid gender.`);
      if(!VALID_TIERS.has(fighter.selectionTier)) errors.push(`${fighter.name} has invalid selection tier.`);
      if(!fighter.divisions.length) errors.push(`${fighter.name} needs at least one UFC division.`);
      fighter.eras.forEach(era => {
        if(eraIds.size && !eraIds.has(era)) errors.push(`${fighter.name} uses unknown era ${era}.`);
      });
      if(fighter.source === 'play-only' && (fighter.thumbUrl || fighter.profileUrl)) errors.push(`${fighter.name} has a photo path before a real file was approved.`);
    });

    const eligibilityCounts = Object.fromEntries(['blindRank','keepCut','betterThan','findLeader'].map(key => [
      key,
      records.filter(fighter => fighter.eligibility?.[key]).length
    ]));

    return {
      passed:errors.length === 0,
      errors,
      total:records.length,
      modelRanked:records.filter(fighter => fighter.modelRanked).length,
      playOnly:records.filter(fighter => !fighter.modelRanked).length,
      photoReady:records.filter(fighter => fighter.thumbUrl).length,
      eligibilityCounts
    };
  }

  function rebuild(){
    const map = new Map();
    liveRows().forEach(fighter => map.set(fighter.id,fighter));
    EXTRA_FIGHTERS.map(extraRecord).forEach(extra => map.set(extra.id,mergeRecord(map.get(extra.id),extra)));

    const records = [...map.values()].sort((a,b) => {
      if(a.modelRanked !== b.modelRanked) return a.modelRanked ? -1 : 1;
      if(a.modelRanked && b.modelRanked) return (a.modelRank || 999) - (b.modelRank || 999);
      return a.name.localeCompare(b.name);
    });

    api.allFighters.splice(0,api.allFighters.length,...records);
    api.modelRanked.splice(0,api.modelRanked.length,...records.filter(fighter => fighter.modelRanked));
    api.playOnly.splice(0,api.playOnly.length,...records.filter(fighter => !fighter.modelRanked));
    api.byId = Object.fromEntries(records.map(fighter => [fighter.id,fighter]));
    api.byName = Object.fromEntries(records.map(fighter => [normal(fighter.name),fighter]));
    api.audit = buildAudit(records);

    const signature = `${api.audit.total}|${api.audit.modelRanked}|${api.audit.photoReady}|${api.audit.passed}`;
    document.documentElement.setAttribute('data-play-data',VERSION);
    document.documentElement.setAttribute('data-play-roster-size',String(api.audit.total));
    document.documentElement.setAttribute('data-play-data-audit',api.audit.passed ? 'passed' : 'failed');

    if(signature !== lastSignature){
      lastSignature = signature;
      window.dispatchEvent(new CustomEvent('ufc-play-data-ready',{detail:{version:VERSION,audit:api.audit}}));
    }
    return api;
  }

  window.UFC_PLAY_DATA = api;
  rebuild();
  window.addEventListener('ufc-scoring-pipeline-ready',rebuild);
  window.addEventListener('ufc-division-era-depth-finalized',rebuild);
  window.addEventListener('ufc-fighter-photos-ready',rebuild);
})();