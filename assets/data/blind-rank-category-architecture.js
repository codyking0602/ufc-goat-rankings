(function(root){
  'use strict';

  const VERSION='blind-rank-category-architecture-20260717c-phase-five-tuning';
  const EPSILON=0.000001;
  const TIERS=[
    {id:'elite',name:'Elite',minScore:92,description:'All-time or category-defining level.'},
    {id:'great',name:'Great',minScore:82,description:'Clearly high-end UFC level with major strengths.'},
    {id:'good',name:'Good',minScore:70,description:'Strong and credible, but below the category’s top class.'},
    {id:'average',name:'Average',minScore:55,description:'Solid UFC level with meaningful limitations.'},
    {id:'below-average',name:'Below Average',minScore:35,description:'Recognizable value, but clearly limited in this category.'},
    {id:'bad',name:'Bad',minScore:0,description:'Poor UFC-level performance or an intentionally weak category fit.'}
  ];
  const CATEGORIES=[
    {id:'ufc-career',ratingPath:'career.overall',name:'UFC Career',group:'Career',status:'launch',definition:'UFC-only greatness across championship accomplishment, opponent quality, prime dominance, active elite longevity, and loss context.',criteria:['Championship','Opponent Quality','Prime Dominance','Longevity','Penalty Context']},
    {id:'striking',ratingPath:'striking',name:'Striking',group:'Skill',status:'launch',definition:'UFC striking effectiveness, craft, defense, adaptability, and performance against strong opposition.',criteria:['Effectiveness','Craft','Defense','Adaptability','Elite-Level Proof']},
    {id:'wrestling-grappling',ratingPath:'grappling',name:'Wrestling & Grappling',group:'Skill',status:'launch',definition:'UFC wrestling, submissions, positional control, transitions, defensive grappling, and ability to impose the phase.',criteria:['Wrestling Control','Submissions','Position','Transitions','Defensive Grappling']},
    {id:'hardest-at-peak',ratingPath:'peak',name:'Hardest to Beat at Peak',group:'Debate',status:'launch',definition:'How difficult the fighter was to defeat during their best UFC stretch, independent of total career length.',criteria:['Prime Control','Round Separation','Durability','Adaptability','Opponent Level']},
    {id:'best-finisher',ratingPath:'finishing',name:'Best Finisher',group:'Debate',status:'launch',definition:'UFC finishing threat using rate, volume, opponent quality, title stakes, variety, and repeatability.',criteria:['Finish Rate','Finish Volume','Elite Finishes','Title Stakes','Variety']},
    {id:'most-complete',ratingPath:'complete',name:'Most Complete Fighter',group:'Debate',status:'launch',definition:'Breadth and balance across striking, wrestling, grappling, defense, cardio, and adaptability.',criteria:['Striking','Wrestling','Grappling','Defense','Cardio','Adaptability']},
    {id:'action-fighter',ratingPath:'action',name:'Action Fighter',group:'Entertainment',status:'launch',definition:'Reliable UFC entertainment through pace, violence, volatility, memorable fights, and willingness to engage.',criteria:['Pace','Damage','Volatility','Memorable Fights','Reliability']},
    {id:'ufc-star-power',ratingPath:'starPower',name:'UFC Star Power',group:'Entertainment',status:'planned',definition:'UFC drawing power, mainstream recognition, cultural footprint, and sustained relevance.',criteria:['Drawing Power','Mainstream Reach','Cultural Impact','UFC Relevance']}
  ];
  const PACKS=[
    {id:'ufc-careers',name:'UFC Careers',categoryId:'ufc-career',ratingPaths:['career.overall'],filters:{gender:'men'},status:'launch'},
    {id:'all-careers',name:'All UFC Careers',categoryId:'ufc-career',ratingPaths:['career.overall'],filters:{},status:'launch'},
    {id:'womens-careers',name:'Women’s UFC Careers',categoryId:'ufc-career',ratingPaths:['career.overall'],filters:{gender:'women'},status:'launch'},
    {id:'lightweight',name:'Lightweight Careers',categoryId:'ufc-career',ratingPaths:['career.divisions.lightweight','career.overall'],filters:{gender:'men',division:'Lightweight'},status:'launch'},
    {id:'welterweight',name:'Welterweight Careers',categoryId:'ufc-career',ratingPaths:['career.divisions.welterweight','career.overall'],filters:{gender:'men',division:'Welterweight'},status:'launch'},
    {id:'heavyweight',name:'Heavyweight Careers',categoryId:'ufc-career',ratingPaths:['career.divisions.heavyweight','career.overall'],filters:{gender:'men',division:'Heavyweight'},status:'launch'},
    {id:'early-ufc',name:'Early UFC Careers',categoryId:'ufc-career',ratingPaths:['career.overall'],filters:{gender:'men'},eras:['tournament','survival','zuffa-rebuild'],status:'planned'},
    {id:'striking',name:'Striking',categoryId:'striking',ratingPaths:['striking'],filters:{},status:'launch'},
    {id:'wrestling-grappling',name:'Wrestling & Grappling',categoryId:'wrestling-grappling',ratingPaths:['grappling'],filters:{},status:'launch'},
    {id:'hardest-at-peak',name:'Hardest to Beat at Peak',categoryId:'hardest-at-peak',ratingPaths:['peak'],filters:{},status:'planned'},
    {id:'best-finisher',name:'Best Finisher',categoryId:'best-finisher',ratingPaths:['finishing'],filters:{},status:'planned'},
    {id:'most-complete',name:'Most Complete Fighter',categoryId:'most-complete',ratingPaths:['complete'],filters:{},status:'planned'},
    {id:'action-fighter',name:'Action Fighter',categoryId:'action-fighter',ratingPaths:['action'],filters:{},status:'planned'},
    {id:'ufc-star-power',name:'UFC Star Power',categoryId:'ufc-star-power',ratingPaths:['starPower'],filters:{},status:'future'}
  ];
  const LINEUP_ROLES=[
    {id:'top-anchor',name:'Top Anchor',weights:{elite:0.60,great:0.40}},
    {id:'strong-option',name:'Strong Option',weights:{great:0.45,good:0.55}},
    {id:'middle-option',name:'Middle Option',weights:{good:0.50,average:0.50}},
    {id:'trap-option',name:'Potential Trap',weights:{average:0.55,'below-average':0.45}},
    {id:'wildcard',name:'Wildcard',weights:{elite:0.08,great:0.12,good:0.20,average:0.25,'below-average':0.25,bad:0.10}}
  ];
  const LINEUP_RULES={
    lineupSize:5,
    maximumBadFighters:1,
    badGameTargetRate:0.10,
    duplicateFighters:false,
    revealOrder:'shuffle-after-selection',
    sharedChallenges:'preserve-exact-lineup',
    fallback:{primary:'exact-tier',secondary:'adjacent-tier',maximumTierDistance:1,emergency:'any-rated-fighter-with-audit-warning'},
    repeatProtection:{historyScope:'per-pack',recentRevealWindow:15,relaxWindows:[15,10,5,0]}
  };
  const RATING_CONTRACT={
    scoreMinimum:0,
    scoreMaximum:100,
    scoreType:'number',
    tierPolicy:'absolute-score-bands',
    requiredLaunchPaths:['career.overall','striking','grappling','peak','finishing','complete','action'],
    optionalPaths:['career.divisions.lightweight','career.divisions.welterweight','career.divisions.heavyweight','starPower'],
    recordShape:{
      fighterId:'stable fighter slug',
      fighterName:'display name',
      ratings:{career:{overall:'0-100',divisions:{lightweight:'0-100',welterweight:'0-100',heavyweight:'0-100'}},striking:'0-100',grappling:'0-100',peak:'0-100',finishing:'0-100',complete:'0-100',action:'0-100',starPower:'optional 0-100'},
      ineligible:'optional category-id array'
    }
  };

  function deepFreeze(value){if(!value||typeof value!=='object'||Object.isFrozen(value))return value;Object.freeze(value);Object.values(value).forEach(deepFreeze);return value;}
  function getPath(object,path){return String(path||'').split('.').filter(Boolean).reduce((value,key)=>value==null?undefined:value[key],object);}
  function validScore(value){return Number.isFinite(Number(value))&&Number(value)>=RATING_CONTRACT.scoreMinimum&&Number(value)<=RATING_CONTRACT.scoreMaximum;}
  function tierForScore(value){if(!validScore(value))return null;const score=Number(value);return TIERS.find(tier=>score>=tier.minScore)||TIERS.at(-1);}
  function categoryFor(id){return CATEGORIES.find(category=>category.id===id)||null;}
  function packFor(id){return PACKS.find(pack=>pack.id===id)||null;}
  function roleFor(id){return LINEUP_ROLES.find(role=>role.id===id)||null;}
  function ratingForPack(record,packId){const pack=packFor(packId);if(!pack)return null;for(const path of pack.ratingPaths){const value=getPath(record?.ratings,path);if(validScore(value))return {score:Number(value),tier:tierForScore(value),path,fallback:path!==pack.ratingPaths[0]};}return null;}
  function validateRatingRecord(record){
    const errors=[];
    const ineligible=new Set(Array.isArray(record?.ineligible)?record.ineligible:[]);
    if(!String(record?.fighterId||'').trim())errors.push('fighterId is required.');
    if(!String(record?.fighterName||'').trim())errors.push('fighterName is required.');
    CATEGORIES.filter(category=>category.status==='launch').forEach(category=>{if(ineligible.has(category.id))return;const value=getPath(record?.ratings,category.ratingPath);if(!validScore(value))errors.push(`${category.ratingPath} must be rated 0-100 or ${category.id} must be explicitly ineligible.`);});
    return {passed:errors.length===0,errors};
  }
  function audit(){
    const errors=[];const warnings=[];const tierIds=new Set();const categoryIds=new Set();const packIds=new Set();const roleIds=new Set();
    TIERS.forEach((tier,index)=>{if(tierIds.has(tier.id))errors.push(`Duplicate tier id: ${tier.id}`);tierIds.add(tier.id);if(!Number.isFinite(tier.minScore)||tier.minScore<0||tier.minScore>100)errors.push(`${tier.id} has an invalid minimum score.`);if(index&&tier.minScore>=TIERS[index-1].minScore)errors.push('Tier minimums must descend from Elite to Bad.');});
    for(let score=0;score<=100;score+=0.25)if(!tierForScore(score))errors.push(`No tier covers score ${score}.`);
    CATEGORIES.forEach(category=>{if(categoryIds.has(category.id))errors.push(`Duplicate category id: ${category.id}`);categoryIds.add(category.id);if(!category.ratingPath)errors.push(`${category.id} needs a rating path.`);if(!['launch','planned'].includes(category.status))warnings.push(`${category.id} is marked ${category.status}.`);});
    PACKS.forEach(pack=>{if(packIds.has(pack.id))errors.push(`Duplicate pack id: ${pack.id}`);packIds.add(pack.id);if(!categoryIds.has(pack.categoryId))errors.push(`${pack.id} references unknown category ${pack.categoryId}.`);if(!Array.isArray(pack.ratingPaths)||!pack.ratingPaths.length)errors.push(`${pack.id} needs at least one rating path.`);});
    LINEUP_ROLES.forEach(role=>{if(roleIds.has(role.id))errors.push(`Duplicate lineup role id: ${role.id}`);roleIds.add(role.id);const total=Object.entries(role.weights||{}).reduce((sum,[tier,weight])=>{if(!tierIds.has(tier))errors.push(`${role.id} references unknown tier ${tier}.`);if(!Number.isFinite(weight)||weight<0)errors.push(`${role.id} has invalid weight for ${tier}.`);return sum+(Number(weight)||0);},0);if(Math.abs(total-1)>EPSILON)errors.push(`${role.id} weights total ${total}, not 1.`);});
    if(LINEUP_ROLES.length!==LINEUP_RULES.lineupSize)errors.push('The number of lineup roles must equal the lineup size.');
    if(Math.abs((roleFor('wildcard')?.weights?.bad||0)-LINEUP_RULES.badGameTargetRate)>EPSILON)errors.push('Wildcard Bad weight must match the target Bad-game rate.');
    if(LINEUP_RULES.maximumBadFighters!==1)errors.push('Blind Rank 5 must allow no more than one Bad fighter.');
    return {passed:errors.length===0,version:VERSION,errors,warnings,counts:{tiers:TIERS.length,categories:CATEGORIES.length,launchCategories:CATEGORIES.filter(category=>category.status==='launch').length,packs:PACKS.length,lineupRoles:LINEUP_ROLES.length}};
  }
  function loadScriptOnce(selector,src,attribute,onload){
    const document=root.document;if(!document)return;
    const existing=document.querySelector(selector);
    if(existing){if(existing.dataset.loaded==='true')onload?.();else if(onload)existing.addEventListener('load',onload,{once:true});return;}
    const script=document.createElement('script');script.src=src;script.setAttribute(attribute,'true');script.addEventListener('load',()=>{script.dataset.loaded='true';onload?.();},{once:true});document.head.appendChild(script);
  }
  function loadPhaseThreeAudit(){
    if(root.UFC_BLIND_RANK_POOL_AUDIT){root.UFC_BLIND_RANK_POOL_AUDIT.rebuild?.();return;}
    loadScriptOnce('script[data-blind-rank-pool-audit]','assets/data/blind-rank-pool-audit.js?v=blind-rank-pool-audit-20260717a-phase-three','data-blind-rank-pool-audit');
  }
  function loadPhaseTwoLedger(){
    const loadBlindLedger=()=>{
      if(root.UFC_BLIND_RANK_CATEGORY_RATINGS){loadPhaseThreeAudit();return;}
      loadScriptOnce('script[data-blind-rank-category-ratings]','assets/data/blind-rank-category-ratings.js?v=blind-rank-category-ratings-20260717a-phase-two','data-blind-rank-category-ratings',loadPhaseThreeAudit);
    };
    if(root.UFC_KEEP_CUT_CATEGORY_RATINGS){loadBlindLedger();return;}
    loadScriptOnce('script[data-keep-cut-category-ratings]','assets/data/keep-cut-category-ratings.js?v=keep-cut-category-ratings-20260717a-phase-one','data-keep-cut-category-ratings',loadBlindLedger);
  }

  const auditResult=audit();
  const api=deepFreeze({version:VERSION,phase:1,liveGameplayMode:'absolute-category-tiers-phase-five-tuned',tiers:TIERS,categories:CATEGORIES,packs:PACKS,lineupRoles:LINEUP_ROLES,lineupRules:LINEUP_RULES,ratingContract:RATING_CONTRACT,tierForScore,categoryFor,packFor,roleFor,ratingForPack,validateRatingRecord,audit:()=>auditResult});
  root.UFC_BLIND_RANK_CATEGORY_ARCHITECTURE=api;
  root.document?.documentElement?.setAttribute('data-blind-rank-category-architecture',auditResult.passed?'passed':'failed');
  if(typeof root.dispatchEvent==='function'&&typeof root.CustomEvent==='function')root.dispatchEvent(new root.CustomEvent('ufc-blind-rank-category-architecture-ready',{detail:{version:VERSION,audit:auditResult}}));
  loadPhaseTwoLedger();
})(typeof window!=='undefined'?window:globalThis);
