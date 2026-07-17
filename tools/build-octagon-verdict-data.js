#!/usr/bin/env node
/*
 * Build the Octagon Verdict knowledge feed from the fully calculated browser runtime.
 * This file is generated from the same canonical facts, category calculators, ranking
 * projection, and automatic division boards that power the app.
 */
const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const outputPath=path.join(root,'assets/data/octagon-verdict-data.json');
const dataDir=path.join(root,'assets/data/octagon-verdict');
const fightersDir=path.join(dataDir,'fighters');
const matchupsDir=path.join(dataDir,'matchups');
const appUrl=process.env.OCTAGON_VERDICT_APP_URL||'http://127.0.0.1:4173';

const round=(value,digits=2)=>Number.isFinite(Number(value))?Number(Number(value).toFixed(digits)):undefined;
const compact=obj=>Object.fromEntries(Object.entries(obj).filter(([,value])=>value!==undefined&&value!==null&&value!==''&&(!Array.isArray(value)||value.length)&&(!(typeof value==='object'&&!Array.isArray(value))||Object.keys(value).length)));
const slugify=name=>String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,' and ').replace(/[’']/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const pairKey=(a,b)=>[slugify(a),slugify(b)].sort().join('--');
const writeJson=(filePath,data)=>{fs.mkdirSync(path.dirname(filePath),{recursive:true});fs.writeFileSync(filePath,`${JSON.stringify(data)}\n`,'utf8');};

async function readRuntime(){
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const pageErrors=[];
  page.on('pageerror',error=>pageErrors.push(String(error?.message||error)));
  try{
    await page.goto(appUrl,{waitUntil:'domcontentloaded',timeout:120000});
    await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready',null,{timeout:120000});
    return await page.evaluate(()=>{
      const DATA=window.RANKING_DATA||{men:[],women:[],fighters:[]};
      const OVERRIDES=window.DISPLAY_OVERRIDES||{};
      const COMPARE=window.COMPARE_PROFILES||{};
      const DIRECT=window.COMPARE_FIGHT_LEDGER||{};
      const FACTS=window.UFC_CANONICAL_FIGHTER_FACTS;
      const CALCULATORS=window.UFC_CATEGORY_CALCULATORS;
      const DIVISIONS=window.UFC_DIVISION_RANKING_PIPELINE;
      const profiles=new Map((DATA.fighters||[]).map(profile=>[profile.fighter,profile]));
      const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
      const finite=value=>Number.isFinite(Number(value))?Number(value):undefined;
      const first=(...values)=>values.find(value=>value!==undefined&&value!==null&&value!=='');
      const clean=(value,max=900)=>{if(value===undefined||value===null)return undefined;const text=String(value).replace(/\s+/g,' ').trim();if(!text)return undefined;return text.length>max?`${text.slice(0,max-1).trim()}…`:text;};
      const compact=obj=>Object.fromEntries(Object.entries(obj).filter(([,value])=>value!==undefined&&value!==null&&value!==''&&(!Array.isArray(value)||value.length)&&(!(typeof value==='object'&&!Array.isArray(value))||Object.keys(value).length)));
      const slugify=name=>String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,' and ').replace(/[’']/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
      const qualityLedger=trace=>(trace?.inputs||[]).slice(0,16).map(input=>({fightId:input.fightId,opponent:input.opponent,date:input.date,finalCredit:finite(input.finalCredit),countedCredit:finite(input.countedCredit),tier:clean(input.tierLabel||input.qualityTier,80),context:clean(input.context||input.note||input.notes,260)})).filter(row=>row.opponent);
      const titleLedger=trace=>(trace?.inputs||[]).filter(input=>finite(input.finalAdjustedCredit)>0).slice(0,20).map(input=>({fightId:input.fightId,opponent:input.opponent,date:input.date,adjustedCredit:finite(input.finalAdjustedCredit),type:input.type,context:clean(input.context||input.note||input.notes,260)})).filter(row=>row.opponent);
      const lossEvents=trace=>(trace?.events||[]).slice(0,16).map(event=>({fightId:event.fightId,opponent:event.opponent,date:event.date,phase:event.phase,method:event.methodCategory,divisionContext:event.divisionContext,rawPenalty:finite(event.rawPenalty),context:clean(event.note||event.context,260)})).filter(row=>row.opponent);
      const divisionRowsFor=name=>(DIVISIONS?.entryFor?.(name)||[]).map(row=>({division:row.division,rank:row.rank,divisionScore:finite(row.divisionScore),resumeSharePct:finite(row.resumeSharePct),role:row.role,stats:clone(row.stats),components:clone(row.components),historicalDivisionFallback:Boolean(row.historicalDivisionFallback)}));
      const fighters=[];
      for(const [group,board] of [['men',DATA.men||[]],['women',DATA.women||[]]]){
        for(const row of board){
          const name=row.fighter;
          const profile=profiles.get(name)||{};
          const display=OVERRIDES[name]||{};
          const compare=COMPARE[name]||display.compareProfile||{};
          const record=FACTS?.get?.(name)||{};
          const derived=FACTS?.deriveFor?.(name)||{};
          const traces={
            championship:CALCULATORS?.rowFor?.('championship',name),
            opponentQuality:CALCULATORS?.rowFor?.('opponentQuality',name),
            primeDominance:CALCULATORS?.rowFor?.('primeDominance',name),
            longevity:CALCULATORS?.rowFor?.('longevity',name),
            penalty:CALCULATORS?.rowFor?.('penalty',name),
            apex:CALCULATORS?.rowFor?.('apex',name),
            eraDepth:CALCULATORS?.rowFor?.('eraDepth',name)
          };
          const visible=row.visibleStats||{};
          const qualityWins=qualityLedger(traces.opponentQuality);
          const prime=traces.primeDominance?.stats||{};
          const longevity=traces.longevity?.stats||{};
          const apex=traces.apex||{};
          const primary=row.primaryDivision||record?.identity?.primaryDivision||profile.primaryDivision;
          const secondary=row.secondaryDivision||(record?.identity?.secondaryDivisions||[]).join(' / ')||profile.secondaryDivision;
          fighters.push(compact({
            slug:slugify(name),name,group,rank:finite(row.rank),appOvr:finite(row.overallOvr),totalScore:finite(row.totalScore),
            displayName:clean(first(display.displayName,display.profileDisplayName,name),120),
            profileDisplayName:clean(first(display.profileDisplayName,display.displayName,name),120),
            photoUrl:clean(display.photoUrl,260),
            thumbUrl:clean(display.thumbUrl,260),
            watchUrl:clean(display.watchUrl,500),
            watchLabel:clean(display.watchLabel,80),
            signatureFightUrl:clean(display.signatureFightUrl,500),
            signatureFightLabel:clean(display.signatureFightLabel,80),
            categories:{championship:finite(row.championship),opponentQuality:finite(row.opponentQuality),primeDominance:finite(row.primeDominance),longevity:finite(row.longevity),apexPeak:finite(row.apexPeak),lossPenalty:finite(row.penalty),divisionEraDepth:finite(row.eraDepthAdjustment)},
            weightedScoreBreakdown:clone(row.weightedScoreBreakdown),
            division:[primary,secondary].filter(Boolean).join(' / '),
            divisionBoards:divisionRowsFor(name),
            tag:clean(first(display.resumeTag,row.resumeTag),100),
            ufcRecord:first(visible.ufcRecord,row.ufcRecord,derived?.officialUfcRecord?.text),
            titleFightWins:finite(first(visible.titleFightWins,row.titleFightWins,derived?.championship?.titleFightWins)),
            adjustedTitleWins:finite(first(visible.adjustedTitleWins,row.adjustedTitleWins,derived?.championship?.adjustedTitleWins)),
            topFiveWins:finite(first(visible.topFiveWins,row.topFiveWins,derived?.opponentQuality?.topFiveWins)),
            rankedWins:finite(first(visible.rankedWins,row.rankedWins,derived?.opponentQuality?.rankedWins)),
            bestWins:qualityWins.slice(0,8).map(win=>win.opponent),
            qualityWinLedger:qualityWins,
            titleWinLedger:titleLedger(traces.championship),
            primeRecord:first(visible.primeRecord,row.primeRecord,derived?.prime?.recordText),
            primeWindow:{startFightId:record?.primeWindow?.startFightId,endFightId:record?.primeWindow?.endFightId||null,open:Boolean(record?.primeWindow?.open),startDate:prime.eraStartDate,endDate:prime.eraEndDate},
            roundsWonPct:finite(first(visible.roundsWonPct,row.roundsWonPct,prime.roundControlPct)),
            finishRatePct:finite(first(visible.finishRatePct,row.finishRatePct,derived?.finishRatePct)),
            activeEliteYears:finite(first(visible.activeEliteYears,row.activeEliteYears,longevity.activeEliteYears)),
            timesFinishedPrime:finite(first(visible.timesFinishedPrime,row.timesFinishedPrime,derived?.prime?.stoppageLosses)),
            apexPeakDetail:{bonus:finite(row.apexPeak),performances:clone(apex.performances),components:clone(apex.components),notes:clean(apex.notes,400)},
            lossContextEvents:lossEvents(traces.penalty),
            divisionEraDepthDetail:{adjustment:finite(row.eraDepthAdjustment),depthIndex:finite(traces.eraDepth?.depthIndex),source:traces.eraDepth?.source},
            shortCase:clean(first(compare.shortCase,display.oneLiner),650),
            bestArgument:clean(first(compare.bestArgument,compare.edge,compare.peak),650),
            counterArgument:clean(first(compare.counter,compare.weakness,display.whyNotHigher),650),
            whyRankedHere:clean(display.whyRankedHere,750),
            whyNotHigher:clean(display.whyNotHigher,750),
            finalTakeaway:clean(display.finalTakeaway,650)
          }));
        }
      }
      const directMatchups=Object.values(DIRECT).map(item=>({fighters:Array.isArray(item.fighters)?item.fighters.slice(0,2):[],fights:finite(item.fights),headToHeadWinner:item.winner,importance:item.importance,headToHeadSummary:clean(item.summary,650)})).filter(item=>item.fighters.length===2);
      return{
        fighters,directMatchups,
        sourceVersions:{
          scoringPipeline:window.UFC_SCORING_PIPELINE?.version,
          rankingPipeline:window.UFC_RANKING_PIPELINE?.version,
          categoryCalculators:CALCULATORS?.version,
          canonicalFacts:FACTS?.version,
          divisionRankings:DIVISIONS?.version,
          divisionReconciliation:window.UFC_DIVISION_RANKING_RECONCILIATION?.version
        },
        pipelineFighterCount:window.UFC_SCORING_PIPELINE?.fighterCount,
        pipelineStatus:window.UFC_SCORING_PIPELINE?.status,
        divisionReport:DIVISIONS?.latest||null
      };
    });
  }finally{await browser.close();}
}

function addVerdict(matchup,fightersByName){
  const [a,b]=matchup.fighters;
  const fighterA=fightersByName.get(a),fighterB=fightersByName.get(b);
  const base={pairKey:pairKey(a,b),fighters:[a,b],slugs:[slugify(a),slugify(b)]};
  if(!fighterA||!fighterB)return compact({...base,dataStatus:'missing-fighter-data'});
  const scoreA=Number(fighterA.totalScore),scoreB=Number(fighterB.totalScore);
  const tied=Math.abs(scoreA-scoreB)<.005;
  const winner=tied?undefined:(scoreA>scoreB?fighterA:fighterB);
  const loser=tied?undefined:(scoreA>scoreB?fighterB:fighterA);
  return compact({...base,verdictRule:'The higher totalScore is the UFC-only GOAT comparison winner. Real head-to-head results are context only.',verdictStatus:tied?'essentially-even':'decided-by-totalScore',verdictWinner:winner?.name,verdictLoser:loser?.name,winnerScore:round(winner?.totalScore),loserScore:round(loser?.totalScore),winnerRank:winner?.rank,loserRank:loser?.rank,margin:round(Math.abs(scoreA-scoreB)),headToHead:compact({seriesWinner:matchup.headToHeadWinner,fights:matchup.fights,importance:matchup.importance,summary:matchup.headToHeadSummary,contextOnly:true,doesNotOverrideVerdict:true})});
}

function validate(runtime,fighters,matchups){
  if(runtime.pipelineStatus!=='ready')throw new Error(`Scoring pipeline is ${runtime.pipelineStatus||'unknown'}.`);
  if(fighters.length!==Number(runtime.pipelineFighterCount))throw new Error(`Expected ${runtime.pipelineFighterCount} fighters, received ${fighters.length}.`);
  if(runtime.divisionReport?.passed!==true)throw new Error('Automatic division ranking pipeline did not pass.');
  const byName=new Map(fighters.map(fighter=>[fighter.name,fighter]));
  for(const matchup of matchups){
    const [a,b]=matchup.fighters;
    const fighterA=byName.get(a),fighterB=byName.get(b);
    if(!fighterA||!fighterB)throw new Error(`Missing fighter data for ${matchup.pairKey}.`);
    if(Number(fighterA.totalScore)!==Number(fighterB.totalScore)){
      const expected=Number(fighterA.totalScore)>Number(fighterB.totalScore)?a:b;
      if(matchup.verdictWinner!==expected)throw new Error(`Verdict mismatch for ${matchup.pairKey}.`);
    }
    if(matchup.headToHead?.doesNotOverrideVerdict!==true)throw new Error(`Head-to-head safeguard missing for ${matchup.pairKey}.`);
  }
}

async function build(){
  const runtime=await readRuntime();
  const fighters=runtime.fighters.sort((a,b)=>a.group!==b.group?(a.group==='men'?-1:1):Number(a.rank||999)-Number(b.rank||999));
  const fightersByName=new Map(fighters.map(fighter=>[fighter.name,fighter]));
  const matchups=runtime.directMatchups.filter(matchup=>matchup.fighters.every(name=>fightersByName.has(name))).map(matchup=>addVerdict(matchup,fightersByName)).sort((a,b)=>a.pairKey.localeCompare(b.pairKey));
  validate(runtime,fighters,matchups);
  const generatedAt=new Date().toISOString();
  const guidance={
    sourceOfTruth:'Retrieve both fighter objects and compare totalScore numerically. The higher totalScore is the UFC-only GOAT verdict winner.',
    divisionRule:'For division-only questions, use each fighter’s matching divisionBoards entry and compare divisionScore and divisional stats. Do not substitute overall rank for the division verdict.',
    scope:'Judge UFC accomplishments by default. Non-UFC achievements may be mentioned only as context.',
    verdictRule:'Use verdictWinner exactly when a direct-fight matchup object exists. headToHead.seriesWinner is context only and never overrides the ranking verdict.',
    retrievalRule:'Do not issue a verdict until both fighter records have been found. If either fighter is missing, say the data is incomplete.',
    explainWith:['current rank and OVR','UFC record','title-fight wins and adjusted title credit','Top-5 and ranked wins','prime record and rounds won','finish percentage','active elite years','Apex Peak','loss context','division-only résumé when asked'],
    writingStyle:['Start with the verdict','Give the losing fighter a real counterargument','Explain why the winner still wins','Separate better fighter from better UFC-only GOAT resume when relevant'],
    avoid:['hypothetical fight analysis unless directly asked','raw formula narration in normal answers','database/model language','outside citations unless asked','letting a head-to-head winner override totalScore','mentioning Knowledge filenames']
  };
  const divisionBoards=runtime.divisionReport?.boards||{};
  const index={name:'Octagon Verdict Index',version:generatedAt.slice(0,10),generatedAt,source:'calculated-browser-runtime',sourceVersions:runtime.sourceVersions,guidance,fighterCount:fighters.length,divisionBoardCount:Object.keys(divisionBoards).length,fighters:fighters.map(fighter=>compact({slug:fighter.slug,name:fighter.name,group:fighter.group,rank:fighter.rank,appOvr:fighter.appOvr,totalScore:fighter.totalScore,division:fighter.division,divisionBoards:fighter.divisionBoards,tag:fighter.tag})),directFightMatchups:matchups.map(matchup=>compact({pairKey:matchup.pairKey,fighters:matchup.fighters,verdictWinner:matchup.verdictWinner,verdictLoser:matchup.verdictLoser,margin:matchup.margin,headToHead:matchup.headToHead}))};
  const feed={name:'Octagon Verdict Data',version:index.version,generatedAt,source:index.source,sourceVersions:runtime.sourceVersions,defaultScope:guidance.scope,guidance,fighterCount:fighters.length,divisionBoards,fighters,directFightMatchups:matchups};
  fs.rmSync(dataDir,{recursive:true,force:true});
  fs.mkdirSync(fightersDir,{recursive:true});
  fs.mkdirSync(matchupsDir,{recursive:true});
  writeJson(path.join(dataDir,'index.json'),index);
  fighters.forEach(fighter=>writeJson(path.join(fightersDir,`${fighter.slug}.json`),fighter));
  matchups.forEach(matchup=>writeJson(path.join(matchupsDir,`${matchup.pairKey}.json`),matchup));
  writeJson(outputPath,feed);
  console.log(`Built Octagon Verdict feed from the calculated runtime: ${fighters.length} fighters, ${Object.keys(divisionBoards).length} division boards, ${matchups.length} direct-fight matchups.`);
}

build().catch(error=>{console.error(error?.stack||error);process.exit(1);});
