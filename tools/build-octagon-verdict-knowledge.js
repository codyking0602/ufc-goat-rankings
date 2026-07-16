#!/usr/bin/env node
/*
 * Build the official human-readable Octagon Verdict knowledge pack from the
 * fully calculated browser runtime. This intentionally uses the same live
 * runtime as tools/build-octagon-verdict-data.js rather than reimplementing
 * the scoring pipeline in Node.
 */
const fs=require('fs');
const path=require('path');
const assert=require('assert/strict');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const outputPath=path.join(root,'octagon-verdict-knowledge.md');
const validationPath=path.join(root,'assets/data/octagon-verdict/knowledge-validation.json');
const appUrl=process.env.OCTAGON_VERDICT_APP_URL||'http://127.0.0.1:4173';
const expectedFighterCount=76;
const validationFighters=[
  'Jon Jones','Georges St-Pierre','Demetrious Johnson','Anderson Silva',
  'Khabib Nurmagomedov','Alexander Volkanovski','Islam Makhachev','Jose Aldo',
  'Alexandre Pantoja','Cain Velasquez','Francis Ngannou'
];
const scoreCategoryKeys=['championship','opponentQuality','primeDominance','longevity'];

const round=(value,digits=2)=>{
  if(!Number.isFinite(Number(value)))return undefined;
  const result=Number(Number(value).toFixed(digits));
  return Object.is(result,-0)?0:result;
};
const fmt=(value,digits=2)=>Number.isFinite(Number(value))?Number(value).toFixed(digits).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1'):'—';
const signed=(value,digits=2)=>Number.isFinite(Number(value))?`${Number(value)>0?'+':''}${fmt(value,digits)}`:'—';
const pct=(value,digits=1)=>Number.isFinite(Number(value))?`${fmt(value,digits)}%`:'—';
const text=(value,fallback='—')=>{
  const result=String(value??'').replace(/\s+/g,' ').trim();
  return result||fallback;
};
const cell=value=>text(value).replace(/\|/g,'\\|').replace(/\r?\n/g,'<br>');
const table=(headers,rows)=>{
  if(!rows.length)return '_No rows._\n';
  return [
    `| ${headers.map(cell).join(' | ')} |`,
    `| ${headers.map(()=> '---').join(' | ')} |`,
    ...rows.map(row=>`| ${row.map(cell).join(' | ')} |`)
  ].join('\n')+'\n';
};
const write=(filePath,content)=>{
  fs.mkdirSync(path.dirname(filePath),{recursive:true});
  fs.writeFileSync(filePath,content.endsWith('\n')?content:`${content}\n`,'utf8');
};

async function readRuntime(){
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const pageErrors=[];
  page.on('pageerror',error=>pageErrors.push(String(error?.message||error)));
  try{
    await page.goto(appUrl,{waitUntil:'domcontentloaded',timeout:120000});
    await page.waitForFunction(()=>{
      const ready=document.documentElement.getAttribute('data-scoring-pipeline')==='ready';
      const projection=window.UFC_CALCULATED_RANKING_PROJECTION;
      const roster=window.UFC_CANONICAL_FIGHTER_FACTS;
      const woodley=window.UFC_CANONICAL_WOODLEY_AUDIT_ADJUSTMENTS;
      return ready&&projection?.rows?.length===76&&roster?.count?.()===76&&woodley?.passed===true;
    },null,{timeout:180000});

    const runtime=await page.evaluate(()=>{
      const DATA=window.RANKING_DATA||{men:[],women:[],fighters:[]};
      const OVERRIDES=window.DISPLAY_OVERRIDES||{};
      const COMPARE=window.COMPARE_PROFILES||{};
      const FACTS=window.UFC_CANONICAL_FIGHTER_FACTS;
      const CALCULATORS=window.UFC_CATEGORY_CALCULATORS;
      const ERAS=window.UFC_FIGHTER_ERA_LEDGERS;
      const DEPTH=window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS;
      const PROJECTION=window.UFC_CALCULATED_RANKING_PROJECTION;
      const profiles=new Map((DATA.fighters||[]).map(profile=>[profile.fighter,profile]));
      const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
      const finite=value=>Number.isFinite(Number(value))?Number(value):undefined;
      const first=(...values)=>values.find(value=>value!==undefined&&value!==null&&value!=='');
      const clean=(value,max=3000)=>{
        if(value===undefined||value===null)return undefined;
        const result=String(value).replace(/\s+/g,' ').trim();
        if(!result)return undefined;
        return result.length>max?`${result.slice(0,max-1).trim()}…`:result;
      };
      const titleTypes=new Set(['normal','vacant-undisputed','second-division-undisputed','vacant-second-division']);
      const tracesFor=name=>({
        championship:CALCULATORS?.rowFor?.('championship',name),
        opponentQuality:CALCULATORS?.rowFor?.('opponentQuality',name),
        primeDominance:CALCULATORS?.rowFor?.('primeDominance',name),
        longevity:CALCULATORS?.rowFor?.('longevity',name),
        penalty:CALCULATORS?.rowFor?.('penalty',name),
        apex:CALCULATORS?.rowFor?.('apex',name),
        eraDepth:CALCULATORS?.rowFor?.('eraDepth',name)
      });
      const eraFor=name=>ERAS?.entryFor?.(name)||ERAS?.ledgers?.[name]||null;
      const depthFor=name=>DEPTH?.entryFor?.(name)||null;
      const championshipReceipt=trace=>({
        score:finite(trace?.reconstructedScore),
        adjustedTitleCredit:finite(trace?.adjustedTitleCredit),
        benchmarkCredit:finite(trace?.benchmarkCredit),
        inputs:(trace?.inputs||[]).map(input=>({
          fightId:input.fightId,opponent:input.opponent,date:input.date,event:input.event,
          titleType:first(input.titleType,input.canonicalTitleType,input.type),
          baseCredit:finite(input.baseCredit),opponentStrength:finite(input.opponentStrength),
          eraTitleContextAdjustment:finite(input.eraTitleContextAdjustment),
          finalAdjustedCredit:finite(input.finalAdjustedCredit),reviewStatus:input.reviewStatus,
          note:clean(first(input.notes,input.note,input.context),500)
        }))
      });
      const qualityReceipt=trace=>({
        score:finite(trace?.reconstructedScore),rawCredit:finite(trace?.rawCredit),
        preAdjustmentDiminishedCredit:finite(trace?.preAdjustmentDiminishedCredit),
        fighterAdjustment:finite(trace?.fighterAdjustment),diminishedCredit:finite(trace?.diminishedCredit),
        benchmarkCredit:finite(trace?.benchmarkCredit),
        inputs:(trace?.inputs||[]).map(input=>({
          fightId:input.fightId,opponent:input.opponent,date:input.date,slot:finite(input.slot),
          baseTier:first(input.baseTier,input.qualityTier,input.tierLabel),baseCredit:finite(input.baseCredit),
          finalCredit:finite(input.finalCredit),countedRate:finite(input.countedRate),countedCredit:finite(input.countedCredit),
          adjustments:clone(input.adjustments),reviewStatus:input.reviewStatus,
          note:clean(first(input.note,input.notes,input.context),600)
        }))
      });
      const primeReceipt=trace=>{
        const stats=trace?.stats||{};
        const elite=stats.eliteLevelValidation||{};
        return {
          score:finite(trace?.reconstructedScore),source:trace?.source,
          stats:{
            eraStartDate:stats.eraStartDate,eraEndDate:stats.eraEndDate,open:Boolean(stats.open),
            primeFightCount:finite(stats.primeFightCount),scoredFightCount:finite(stats.scoredFightCount),
            effectivePrimeSampleCount:finite(stats.effectivePrimeSampleCount),wins:finite(stats.wins),losses:finite(stats.losses),
            draws:finite(stats.draws),noContests:finite(stats.noContests),technicalExceptions:finite(stats.technicalExceptions),
            recordPct:finite(stats.recordPct),roundsWon:finite(stats.roundsWon),roundsLost:finite(stats.roundsLost),
            roundsDrawn:finite(stats.roundsDrawn),roundControlPct:finite(stats.roundControlPct),
            finishWins:finite(stats.finishWins),finishPressurePct:finite(stats.finishPressurePct),
            components:clone(stats.components),rawScore:finite(stats.rawScore),baseSampleMultiplier:finite(stats.baseSampleMultiplier),
            sampleMultiplier:finite(stats.sampleMultiplier),samplePercent:finite(stats.samplePercent),
            longestConsecutiveEliteSamples:finite(stats.longestConsecutiveEliteSamples),
            eliteDensityFloorApplied:Boolean(stats.eliteDensityFloorApplied),missingRoundRows:clone(stats.missingRoundRows)||[],
            eliteLevelValidation:{
              fightCount:finite(elite.fightCount),eventCount:finite(elite.eventCount),volumeUnits:finite(elite.volumeUnits),
              wins:finite(elite.wins),losses:finite(elite.losses),draws:finite(elite.draws),resultRate:finite(elite.resultRate),
              roundControlRate:finite(elite.roundControlRate),finishRate:finite(elite.finishRate),volumeScore:finite(elite.volumeScore),
              performanceScore:finite(elite.performanceScore),performanceBreakdown:clone(elite.performanceBreakdown),score:finite(elite.score),
              fights:clone(elite.fights)||[]
            }
          }
        };
      };
      const longevityReceipt=trace=>({
        score:finite(trace?.reconstructedScore),source:trace?.source,
        stats:clone(trace?.stats)||{}
      });
      const penaltyReceipt=trace=>({
        penalty:finite(trace?.reconstructedPenalty),source:trace?.source,exposure:finite(trace?.exposure),
        severity:finite(trace?.severity),frequency:finite(trace?.frequency),primeVolumeFloor:finite(trace?.primeVolumeFloor),
        preDivision:finite(trace?.preDivision),divisionMultiplier:finite(trace?.divisionMultiplier),
        divisionDiscountPct:finite(trace?.divisionDiscountPct),
        events:(trace?.events||[]).map(event=>({
          fightId:event.fightId,date:event.date,opponent:event.opponent,phase:event.phase,qualityTier:event.qualityTier,
          elite:Boolean(event.elite),finished:Boolean(event.finished),upwardDivision:Boolean(event.upwardDivision),
          competitive:Boolean(event.competitive),technicalException:Boolean(event.technicalException),
          penaltyEligible:Boolean(event.penaltyEligible),methodCategory:event.methodCategory,divisionContext:event.divisionContext,
          base:finite(event.base),finishExtra:finite(event.finishExtra),rawPenalty:finite(event.rawPenalty),overrideRule:event.overrideRule
        }))
      });
      const fighters=[];
      for(const [group,board] of [['men',DATA.men||[]],['women',DATA.women||[]]]){
        for(const row of board){
          const name=row.fighter;
          const profile=profiles.get(name)||{};
          const display=OVERRIDES[name]||{};
          const compare=COMPARE[name]||display.compareProfile||{};
          const record=FACTS?.get?.(name)||{};
          const derived=FACTS?.deriveFor?.(name)||{};
          const traces=tracesFor(name);
          const era=eraFor(name)||{};
          const resolution=depthFor(name)||{};
          const visible=row.visibleStats||{};
          const titleWins=(record.fights||[]).filter(fight=>fight?.scoringDisposition==='count-win'&&fight?.championshipContext?.fighterEligible!==false);
          const primary=row.primaryDivision||record?.identity?.primaryDivision||profile.primaryDivision;
          const secondary=row.secondaryDivision||(record?.identity?.secondaryDivisions||[]).join(' / ')||profile.secondaryDivision;
          fighters.push({
            name,group,rank:finite(row.rank),appOvr:finite(row.overallOvr),totalScore:finite(row.totalScore),
            categories:{
              championship:finite(row.championship),opponentQuality:finite(row.opponentQuality),
              primeDominance:finite(row.primeDominance),longevity:finite(row.longevity),
              apex:finite(row.apexPeak),penalty:finite(row.penalty),eraDepth:finite(row.eraDepthAdjustment)
            },
            weightedScoreBreakdown:clone(row.weightedScoreBreakdown),
            division:[primary,secondary].filter(Boolean).join(' / '),
            stats:{
              ufcRecord:first(visible.ufcRecord,row.ufcRecord,derived?.officialUfcRecord?.text),
              titleFightWins:finite(first(visible.titleFightWins,row.titleFightWins,derived?.championship?.titleFightWins)),
              adjustedTitleWins:finite(first(visible.adjustedTitleWins,row.adjustedTitleWins,derived?.championship?.adjustedTitleWins)),
              undisputedTitleWinCount:titleWins.filter(fight=>titleTypes.has(fight?.championshipContext?.type)).length,
              interimTitleWinCount:titleWins.filter(fight=>fight?.championshipContext?.type==='interim').length,
              topFiveWins:finite(first(visible.topFiveWins,row.topFiveWins,derived?.opponentQuality?.topFiveWins)),
              rankedWins:finite(first(visible.rankedWins,row.rankedWins,derived?.opponentQuality?.rankedWins)),
              finishRatePct:finite(first(visible.finishRatePct,row.finishRatePct,derived?.finishRatePct)),
              primeRecord:first(visible.primeRecord,row.primeRecord,derived?.prime?.recordText),
              roundsWonPct:finite(first(visible.roundsWonPct,row.roundsWonPct,traces.primeDominance?.stats?.roundControlPct)),
              activeEliteYears:finite(first(visible.activeEliteYears,row.activeEliteYears,traces.longevity?.stats?.activeEliteYears)),
              timesFinishedPrime:finite(first(visible.timesFinishedPrime,row.timesFinishedPrime,derived?.prime?.stoppageLosses)),
              throughPrimeUfcFights:finite(first(visible.throughPrimeUfcFights,row.throughPrimeUfcFights,derived?.lossExposure?.throughPrimeUfcFights))
            },
            recordContext:{coverage:clone(record.coverage),primeWindow:clone(record.primeWindow),divisionStrength:clone(record.divisionStrength)},
            eraLedger:clone(era),
            receipts:{
              championship:championshipReceipt(traces.championship),
              opponentQuality:qualityReceipt(traces.opponentQuality),
              primeDominance:primeReceipt(traces.primeDominance),
              longevity:longevityReceipt(traces.longevity),
              penalty:penaltyReceipt(traces.penalty),
              apex:{score:finite(traces.apex?.reconstructedScore),performances:clone(traces.apex?.performances)||[],components:clone(traces.apex?.components),notes:clean(traces.apex?.notes,700)},
              eraDepth:{adjustment:finite(traces.eraDepth?.canonicalAdjustment),depthIndex:finite(traces.eraDepth?.depthIndex),recomputedAdjustment:finite(traces.eraDepth?.recomputedAdjustment),resolutionApplied:Boolean(traces.eraDepth?.resolutionApplied),source:traces.eraDepth?.source,decision:clean(resolution?.decision,700),classification:resolution?.classification,approvalStatus:resolution?.approvalStatus}
            },
            presentation:{
              tag:clean(first(display.resumeTag,row.resumeTag),150),oneLiner:clean(first(display.oneLiner,compare.shortCase),1200),
              whyRankedHere:clean(display.whyRankedHere,1800),whyNotHigher:clean(first(display.whyNotHigher,display.whyNotLower),1800),
              keyJudgmentCalls:clone(display.keyJudgmentCalls),finalTakeaway:clean(display.finalTakeaway,1400),
              compare:{shortCase:clean(compare.shortCase,1000),counter:clean(first(compare.counter,compare.weakness),1200),edge:clean(first(compare.edge,compare.bestArgument),1200)}
            }
          });
        }
      }
      return {
        fighters,
        modelAsOfDate:FACTS?.modelAsOfDate,
        fighterCount:window.UFC_SCORING_PIPELINE?.fighterCount,
        pipelineStatus:window.UFC_SCORING_PIPELINE?.status,
        methodology:{categoryMax:PROJECTION?.categoryMax,weights:clone(PROJECTION?.weights),ovr:clone(PROJECTION?.ovr)},
        sourceVersions:{
          scoringPipeline:window.UFC_SCORING_PIPELINE?.version,rankingPipeline:window.UFC_RANKING_PIPELINE?.version,
          categoryCalculators:CALCULATORS?.version,canonicalFacts:FACTS?.version,fighterEraLedgers:ERAS?.version,
          scoringJudgments:window.UFC_CANONICAL_SCORING_JUDGMENTS?.version,
          opponentQualityAdjustments:window.UFC_CANONICAL_OPPONENT_QUALITY_AUDIT_ADJUSTMENTS?.version,
          championshipAdjustments:window.UFC_CANONICAL_CHAMPIONSHIP_AUDIT_ADJUSTMENTS?.version,
          divisionDepthResolutions:DEPTH?.version,woodleyAudit:window.UFC_CANONICAL_WOODLEY_AUDIT_ADJUSTMENTS?.version
        }
      };
    });
    runtime.pageErrors=pageErrors;
    return runtime;
  }finally{
    await browser.close();
  }
}

function categoryRank(board,fighter,key){
  const row=board.find(item=>item.name===fighter);
  return row?1+board.filter(item=>Number(item.categories[key]||0)>Number(row.categories[key]||0)).length:undefined;
}

function weightedRecalculation(fighter,methodology){
  const max=Number(methodology.categoryMax||30);
  const weights=methodology.weights||{};
  const contributions={};
  for(const key of scoreCategoryKeys)contributions[key]=round((Number(fighter.categories[key]||0)/max)*Number(weights[key]||0));
  const baseScore=round(Object.values(contributions).reduce((sum,value)=>sum+Number(value||0),0));
  const totalScore=round(baseScore+Number(fighter.categories.apex||0)+Number(fighter.categories.penalty||0)+Number(fighter.categories.eraDepth||0));
  return {contributions,baseScore,totalScore};
}

function ovrRecalculation(fighter,methodology){
  const config=methodology.ovr||{};
  const anchors=config.anchors?.[fighter.group]||config.anchors?.men;
  if(!anchors)return{};
  const range=Number(anchors.ceilingScore)-Number(anchors.floorScore);
  const normalized=Math.max(0,Math.min(1,(Number(fighter.totalScore)-Number(anchors.floorScore))/range));
  const curved=Math.pow(normalized,Number(config.curve));
  let ovr=Math.max(Number(config.floor),Math.min(Number(config.ceiling),Math.round(Number(config.floor)+(curved*(Number(config.ceiling)-Number(config.floor))))));
  if(config.leaderOnly99&&Number(fighter.rank)>1&&ovr===Number(config.ceiling))ovr=Number(config.ceiling)-1;
  return {ovr,anchors,normalized:round(normalized,6),curved:round(curved,6)};
}

function fallbackWhyRanked(fighter,recalculated){
  const labels={championship:'Championship',opponentQuality:'Opponent Quality',primeDominance:'Prime Dominance',longevity:'Longevity'};
  const strengths=Object.entries(recalculated.contributions).sort((a,b)=>Number(b[1])-Number(a[1]));
  return `${fighter.name} ranks #${fighter.rank} because ${labels[strengths[0]?.[0]]} and ${labels[strengths[1]?.[0]]} supply the largest weighted pieces of a ${fmt(fighter.totalScore)} UFC-only raw score. The placement is calculated from the full board rather than manually assigned.`;
}

function fallbackWhyNotHigher(fighter,board){
  if(Number(fighter.rank)===1)return 'This is the current UFC-only benchmark. Close decisions, inactivity and late-career context remain legitimate debate points, but no other fighter currently passes the total model score.';
  const index=board.findIndex(item=>item.name===fighter.name);
  const above=index>0?board[index-1]:null;
  if(!above)return 'The fighters above have a stronger total combination of championship work, quality wins, prime dominance, longevity and loss context.';
  const gaps=scoreCategoryKeys.map(key=>({key,gap:round(Number(above.categories[key]||0)-Number(fighter.categories[key]||0))})).sort((a,b)=>b.gap-a.gap);
  const labels={championship:'Championship',opponentQuality:'Opponent Quality',primeDominance:'Prime Dominance',longevity:'Longevity'};
  return `${fighter.name} is ${fmt(Number(above.totalScore)-Number(fighter.totalScore))} raw points behind #${above.rank} ${above.name}. The largest category separation versus that next target is ${labels[gaps[0]?.key]}; future movement must come from new UFC evidence and a full pipeline rerun.`;
}

function validate(runtime){
  assert.equal(runtime.pipelineStatus,'ready','Scoring pipeline is not ready.');
  assert.equal(runtime.fighters.length,expectedFighterCount,'Knowledge fighter count mismatch.');
  assert.equal(Number(runtime.fighterCount),expectedFighterCount,'Pipeline fighter count mismatch.');
  assert.ok(runtime.methodology?.weights,'Missing ranking weights.');
  assert.ok(runtime.methodology?.ovr?.anchors,'Missing OVR anchors.');
  const byName=new Map(runtime.fighters.map(fighter=>[fighter.name,fighter]));
  const boardByGroup={
    men:runtime.fighters.filter(fighter=>fighter.group==='men').sort((a,b)=>a.rank-b.rank),
    women:runtime.fighters.filter(fighter=>fighter.group==='women').sort((a,b)=>a.rank-b.rank)
  };
  for(const fighter of runtime.fighters){
    const recalculated=weightedRecalculation(fighter,runtime.methodology);
    assert.ok(Math.abs(Number(recalculated.totalScore)-Number(fighter.totalScore))<=.011,`${fighter.name}: raw total does not reconcile.`);
    const ovr=ovrRecalculation(fighter,runtime.methodology);
    assert.equal(Number(ovr.ovr),Number(fighter.appOvr),`${fighter.name}: OVR does not reconcile.`);
    for(const receipt of ['championship','opponentQuality','primeDominance','longevity','penalty','apex','eraDepth'])assert.ok(fighter.receipts?.[receipt],`${fighter.name}: missing ${receipt} receipt.`);
  }
  for(const name of validationFighters)assert.ok(byName.has(name),`Missing validation fighter: ${name}`);
  const jones=byName.get('Jon Jones');
  assert.equal(jones.rank,1,'Jon Jones is not current #1.');
  assert.equal(jones.appOvr,99,'Jon Jones is not the 99 OVR benchmark.');
  assert.ok(byName.get('Alexandre Pantoja')?.receipts?.opponentQuality?.inputs?.length,'Pantoja quality-win receipts are missing.');
  assert.ok(byName.get('Anderson Silva')?.receipts?.penalty?.events?.length,'Anderson Silva loss receipts are missing.');
  const cain=byName.get('Cain Velasquez'),ngannou=byName.get('Francis Ngannou');
  assert.ok(cain&&ngannou,'Cain/Ngannou validation pair is incomplete.');
  return {
    passed:true,generatedAt:new Date().toISOString(),fighterCount:runtime.fighters.length,
    validatedFighters:validationFighters,
    currentFacts:{
      jonJones:{rank:jones.rank,appOvr:jones.appOvr,totalScore:jones.totalScore},
      cainVsNgannou:{cainRank:cain.rank,ngannouRank:ngannou.rank,currentLeader:cain.rank<ngannou.rank?cain.name:ngannou.name}
    },
    sourceVersions:runtime.sourceVersions,
    pageErrors:runtime.pageErrors
  };
}

function fighterSection(fighter,board,runtime){
  const r=fighter.receipts;
  const recalculated=weightedRecalculation(fighter,runtime.methodology);
  const ovr=ovrRecalculation(fighter,runtime.methodology);
  const ranks=Object.fromEntries(scoreCategoryKeys.map(key=>[key,categoryRank(board,fighter.name,key)]));
  const whyRanked=fighter.presentation?.whyRankedHere||fallbackWhyRanked(fighter,recalculated);
  const whyNot=fighter.presentation?.whyNotHigher||fallbackWhyNotHigher(fighter,board);
  const primeStart=fighter.eraLedger?.window?.startLabel||r.primeDominance?.stats?.eraStartDate||fighter.recordContext?.primeWindow?.startFightId;
  const primeEnd=fighter.eraLedger?.window?.endLabel||(r.primeDominance?.stats?.open?'active':r.primeDominance?.stats?.eraEndDate)||fighter.recordContext?.primeWindow?.endFightId;
  const lines=[];
  lines.push(`### ${fighter.rank}. ${fighter.name} — ${fighter.appOvr} OVR`,'');
  lines.push(text(fighter.presentation?.oneLiner,`${fighter.name} is ranked by the current UFC-only calculated pipeline.`),'');
  lines.push(table(
    ['Board','Raw score','UFC record','Division(s)','Title-fight wins','Adjusted title wins','Top-5 wins','Prime record','Rounds won','Elite years'],
    [[fighter.group,fmt(fighter.totalScore),fighter.stats.ufcRecord,fighter.division,fighter.stats.titleFightWins,fmt(fighter.stats.adjustedTitleWins),fighter.stats.topFiveWins,fighter.stats.primeRecord,pct(fighter.stats.roundsWonPct),fmt(fighter.stats.activeEliteYears)]]
  ).trimEnd(),'');
  lines.push('#### Exact model math','');
  lines.push(table(
    ['Component','Category value','Weight','Weighted contribution'],
    [
      ['Championship',fmt(fighter.categories.championship),runtime.methodology.weights.championship,fmt(recalculated.contributions.championship)],
      ['Opponent Quality',fmt(fighter.categories.opponentQuality),runtime.methodology.weights.opponentQuality,fmt(recalculated.contributions.opponentQuality)],
      ['Prime Dominance',fmt(fighter.categories.primeDominance),runtime.methodology.weights.primeDominance,fmt(recalculated.contributions.primeDominance)],
      ['Longevity',fmt(fighter.categories.longevity),runtime.methodology.weights.longevity,fmt(recalculated.contributions.longevity)]
    ]
  ).trimEnd(),'');
  lines.push(`Base score: **${fmt(recalculated.baseScore)}**. Modifiers: Apex **${signed(fighter.categories.apex)}**, Loss Penalty **${signed(fighter.categories.penalty)}**, Division-Era Depth **${signed(fighter.categories.eraDepth)}**. Final raw score: **${fmt(fighter.totalScore)}**.`,'');
  lines.push(`OVR conversion: ${fmt(ovr.anchors?.floorScore)}–${fmt(ovr.anchors?.ceilingScore)} board anchors, normalized score **${fmt(ovr.normalized,6)}**, curved score **${fmt(ovr.curved,6)}**, resulting in **${fighter.appOvr} OVR**. Only the board leader may receive 99.`,'');
  lines.push('#### Category breakdown','');
  lines.push(table(
    ['Category','Score','Board rank','Primary receipt'],
    [
      ['Championship',fmt(fighter.categories.championship),`#${ranks.championship}`,`${fmt(r.championship.adjustedTitleCredit)} adjusted credit / ${fmt(r.championship.benchmarkCredit)} benchmark`],
      ['Opponent Quality',fmt(fighter.categories.opponentQuality),`#${ranks.opponentQuality}`,`${fmt(r.opponentQuality.diminishedCredit)} diminished credit / ${fmt(r.opponentQuality.benchmarkCredit)} benchmark`],
      ['Prime Dominance',fmt(fighter.categories.primeDominance),`#${ranks.primeDominance}`,`${fmt(r.primeDominance.stats.rawScore)} raw × ${pct(r.primeDominance.stats.samplePercent)} sample`],
      ['Longevity',fmt(fighter.categories.longevity),`#${ranks.longevity}`,`${fmt(r.longevity.stats.countedEliteMonths)} counted elite months`],
      ['Apex',signed(fighter.categories.apex),'Modifier',text(r.apex.notes,'Two approved peak performances plus proof/aura components')],
      ['Loss Penalty',signed(fighter.categories.penalty),'Modifier',`${r.penalty.events.length} official/technical loss events reviewed`],
      ['Division-Era Depth',signed(fighter.categories.eraDepth),'Modifier',text(r.eraDepth.decision||r.eraDepth.source)]
    ]
  ).trimEnd(),'');
  lines.push('#### Championship receipts','');
  lines.push(`UFC title-fight wins: **${fighter.stats.titleFightWins}**. Adjusted title wins: **${fmt(fighter.stats.adjustedTitleWins)}**. Derived undisputed-title win count: **${fighter.stats.undisputedTitleWinCount}**. Interim-title win count: **${fighter.stats.interimTitleWinCount}**.`,'');
  lines.push(table(
    ['Date','Opponent','Title type','Base','Opponent strength','Final credit','Context'],
    r.championship.inputs.map(input=>[input.date,input.opponent,input.titleType,fmt(input.baseCredit),fmt(input.opponentStrength),fmt(input.finalAdjustedCredit),input.note||input.reviewStatus])
  ).trimEnd(),'');
  lines.push('#### Opponent Quality receipts','');
  lines.push(`Raw win credit: **${fmt(r.opponentQuality.rawCredit)}**. Diminishing-return credit before fighter adjustment: **${fmt(r.opponentQuality.preAdjustmentDiminishedCredit)}**. Fighter adjustment: **${signed(r.opponentQuality.fighterAdjustment)}**. Final diminished credit: **${fmt(r.opponentQuality.diminishedCredit)}**.`,'');
  lines.push(table(
    ['Slot','Date','Opponent','Tier','Final credit','Slot rate','Counted credit','Context'],
    r.opponentQuality.inputs.map(input=>[input.slot,input.date,input.opponent,input.baseTier,fmt(input.finalCredit),fmt(input.countedRate),fmt(input.countedCredit),input.note||input.adjustments?.map(item=>item.note||item.type).join('; ')||input.reviewStatus])
  ).trimEnd(),'');
  const prime=r.primeDominance.stats;
  lines.push('#### Prime Dominance receipts','');
  lines.push(`Prime window: **${text(primeStart)} → ${text(primeEnd)}**. Prime record: **${fighter.stats.primeRecord}**. Effective samples: **${fmt(prime.effectivePrimeSampleCount)}**. Sample multiplier: **${pct(prime.samplePercent)}**.`,'');
  lines.push(table(
    ['Prime component','Score','Evidence'],
    [
      ['Prime record',fmt(prime.components?.primeRecord),`${fmt(prime.wins)}-${fmt(prime.losses)}${prime.draws?`-${fmt(prime.draws)}`:''}; ${pct(prime.recordPct)}`],
      ['Round control',fmt(prime.components?.roundControl),`${pct(prime.roundControlPct)}; rounds ${fmt(prime.roundsWon)}-${fmt(prime.roundsLost)}`],
      ['Finish pressure',fmt(prime.components?.finishPressure),`${fmt(prime.finishWins)} finishes; ${pct(prime.finishPressurePct)}`],
      ['Elite-level validation',fmt(prime.components?.eliteLevelValidation),`${fmt(prime.eliteLevelValidation?.fightCount)} elite-stage fights; ${fmt(prime.eliteLevelValidation?.score)} points`],
      ['Raw prime score',fmt(prime.rawScore),'Before sample multiplier'],
      ['Final Prime Dominance',fmt(fighter.categories.primeDominance),`${fmt(prime.rawScore)} × ${fmt(prime.sampleMultiplier)}`]
    ]
  ).trimEnd(),'');
  if(prime.missingRoundRows?.length)lines.push(`Round-data limitation: ${prime.missingRoundRows.map(item=>item.opponent||item.fightId).join(', ')} do not have audited round allocation.`,'');
  const longevity=r.longevity.stats;
  lines.push('#### Longevity receipts','');
  lines.push(`Active elite years: **${fmt(fighter.stats.activeEliteYears)}**. Raw calendar months: **${fmt(longevity.rawCalendarMonths)}**. Gap-adjusted months: **${fmt(longevity.gapAdjustedMonths)}**. Status multiplier: **${fmt(longevity.statusMultiplier)}**. Division multiplier: **${fmt(longevity.divisionMultiplier)}**. Counted elite months: **${fmt(longevity.countedEliteMonths)}**.`,'');
  if(longevity.intervals?.length)lines.push(table(
    ['From','To','Raw months','Counted months','Capped?'],
    longevity.intervals.map(interval=>[interval.fromDate,interval.toDate,fmt(interval.rawMonths),fmt(interval.countedMonths),interval.capped?'Yes':'No'])
  ).trimEnd(),'');
  const penalty=r.penalty;
  lines.push('#### Loss-penalty receipts','');
  lines.push(`The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **${fmt(penalty.exposure)}** fights. Severity: **${fmt(penalty.severity)}**. Frequency: **${fmt(penalty.frequency)}**. Prime-volume floor: **${fmt(penalty.primeVolumeFloor)}**. Pre-division magnitude: **${fmt(penalty.preDivision)}**. Division discount: **${pct(Number(penalty.divisionDiscountPct||0)*100)}**. Final penalty: **${signed(fighter.categories.penalty)}**.`,'');
  lines.push(table(
    ['Date','Opponent','Phase','Quality','Division','Finished','Competitive','Base','Finish extra','Raw event','Special rule'],
    penalty.events.map(event=>[event.date,event.opponent,event.phase,event.qualityTier,event.divisionContext,event.finished?'Yes':'No',event.competitive?'Yes':'No',signed(event.base),signed(event.finishExtra),signed(event.rawPenalty),event.overrideRule||(event.technicalException?'technical exception / no penalty':'standard rule')])
  ).trimEnd(),'');
  lines.push('#### Division-strength context','');
  lines.push(`Default division key: **${text(fighter.recordContext?.divisionStrength?.defaultKey)}**. Era-ledger division multiplier: **${fmt(fighter.eraLedger?.longevity?.divisionMultiplier)}**. Division-era modifier: **${signed(fighter.categories.eraDepth)}**.`,'');
  lines.push(text(fighter.recordContext?.divisionStrength?.note||fighter.eraLedger?.longevity?.adjustmentNote||r.eraDepth.decision,'No additional division note.'),'');
  lines.push('#### Key judgment calls','');
  if(fighter.presentation?.keyJudgmentCalls?.length){
    fighter.presentation.keyJudgmentCalls.forEach(([label,explanation])=>lines.push(`- **${text(label)}:** ${text(explanation)}`));
  }else{
    lines.push(`- **Prime window:** ${text(primeStart)} → ${text(primeEnd)}.`);
    lines.push(`- **Coverage:** ${text(fighter.recordContext?.coverage?.note,'Complete UFC-only ledger.')}`);
    lines.push(`- **Prime endpoint:** ${text(fighter.eraLedger?.window?.endReason,'Controlled by the shared fighter-era ledger.')}`);
  }
  lines.push('','#### Why ranked here','',text(whyRanked),'');
  lines.push(`#### ${Number(fighter.rank)===1?'Why not ranked lower?':'Why not ranked higher?'}`,'',text(whyNot),'');
  if(fighter.presentation?.compare?.counter||fighter.presentation?.compare?.edge){
    lines.push('#### Compare-mode guidance','');
    if(fighter.presentation.compare.counter)lines.push(`- **Best counterargument:** ${text(fighter.presentation.compare.counter)}`);
    if(fighter.presentation.compare.edge)lines.push(`- **Why this résumé can still win:** ${text(fighter.presentation.compare.edge)}`);
    lines.push('');
  }
  lines.push('#### Final takeaway','',text(fighter.presentation?.finalTakeaway||fighter.presentation?.compare?.shortCase||whyRanked),'');
  lines.push(`_Ledger verified through ${text(fighter.recordContext?.coverage?.verifiedThrough)}. Scores come from ${runtime.sourceVersions.categoryCalculators} and ${runtime.sourceVersions.rankingPipeline}._`,'');
  return lines.join('\n');
}

function buildMarkdown(runtime,validation){
  const generatedAt=validation.generatedAt;
  const men=runtime.fighters.filter(fighter=>fighter.group==='men').sort((a,b)=>a.rank-b.rank);
  const women=runtime.fighters.filter(fighter=>fighter.group==='women').sort((a,b)=>a.rank-b.rank);
  const byName=new Map(runtime.fighters.map(fighter=>[fighter.name,fighter]));
  const latestVerified=runtime.fighters.map(fighter=>fighter.recordContext?.coverage?.verifiedThrough).filter(Boolean).sort().at(-1);
  const missingWhy=runtime.fighters.filter(fighter=>!fighter.presentation?.whyRankedHere).map(fighter=>fighter.name);
  const missingWhyNot=runtime.fighters.filter(fighter=>fighter.rank!==1&&!fighter.presentation?.whyNotHigher).map(fighter=>fighter.name);
  const missingCompare=runtime.fighters.filter(fighter=>!fighter.presentation?.compare?.shortCase&&!fighter.presentation?.compare?.counter&&!fighter.presentation?.compare?.edge).map(fighter=>fighter.name);
  const missingRounds=runtime.fighters.filter(fighter=>fighter.receipts?.primeDominance?.stats?.missingRoundRows?.length).map(fighter=>fighter.name);
  const noUndisputed=men.filter(fighter=>Number(fighter.stats.undisputedTitleWinCount||0)===0).sort((a,b)=>a.rank-b.rank);
  const bestNoUndisputed=noUndisputed[0];
  const bestPrimeOutsideTop10=men.filter(fighter=>fighter.rank>10).sort((a,b)=>b.categories.primeDominance-a.categories.primeDominance)[0];
  const islam=byName.get('Islam Makhachev'),gsp=byName.get('Georges St-Pierre');
  const cain=byName.get('Cain Velasquez'),ngannou=byName.get('Francis Ngannou');
  const lines=[];
  lines.push('# Octagon Verdict — Official UFC-Only Knowledge Pack','');
  lines.push(`Generated: **${generatedAt}**  `);
  lines.push(`Canonical model-as-of date: **${text(runtime.modelAsOfDate)}**  `);
  lines.push(`Latest fighter-ledger verification date: **${text(latestVerified)}**  `);
  lines.push(`Fighters: **${runtime.fighters.length}**`,'');
  lines.push('> Generated from the live browser scoring runtime. This file is authoritative for Octagon Verdict explanations. Do not replace calculated values with legacy score patches, visible category percentiles, memory, or non-UFC achievements.','');
  lines.push('## 1. Purpose and scope','');
  lines.push('Octagon Verdict explains and debates the same UFC-only rankings shown by the app. Every answer should distinguish **model fact**, **documented judgment call**, and **opinion/inference**. Model facts come from the calculated pipeline and the receipts below. Judgment calls come from approved canonical classifications. Anything else must be labeled as opinion.','');
  lines.push('## 2. Source architecture','');
  lines.push('1. `canonical-fighter-facts*.js` and canonical roster batches own complete UFC fight ledgers, quality tiers, title contexts, prime windows, round audits and loss classifications.');
  lines.push('2. `fighter-era-ledgers.js` plus approved resolutions own shared prime/longevity windows and loss endpoints.');
  lines.push('3. `canonical-scoring-judgments.js` plus approved Opponent Quality and Championship adjustments own fight-level judgment inputs—not final totals.');
  lines.push('4. `category-calculators.js` reconstructs Championship, Opponent Quality, Prime Dominance, Longevity, Loss Penalty, Apex and Division-Era Depth.');
  lines.push('5. `ranking-pipeline.js` applies weights, modifiers, ranks, visible stats and fixed-anchor OVRs.');
  lines.push('6. `display-overrides.js` supplies human-facing explanations but does not own scores.');
  lines.push('7. `tools/build-octagon-verdict-data.js` publishes machine-readable JSON. This companion builder publishes the human-readable audit pack.','');
  lines.push('**Legacy warning:** compare coverage packs may contain old frozen score patches. They may supply narrative context, but the calculated runtime remains score authority.','');
  lines.push(table(['Layer','Version'],Object.entries(runtime.sourceVersions).map(([key,value])=>[key,value])).trimEnd(),'');
  lines.push('## 3. UFC-only rules','');
  lines.push('- Score official UFC achievements only. Pride, Strikeforce, WEC, ONE, Bellator, Cage Warriors, regional titles and TUF exhibitions may be mentioned only as context.');
  lines.push('- Official no contests are excluded from scored wins/losses.');
  lines.push('- Weird technical results keep official record status but may receive a non-competitive or technical-exception classification. Jon Jones’s Matt Hamill DQ is not a real competitive loss.');
  lines.push('- Prime windows are fighter-specific and controlled by canonical facts plus fighter-era ledgers.');
  lines.push('- Long inactivity gaps are capped at 18 months.');
  lines.push('- Correct a false premise before debating it.','');
  lines.push('## 4. Scoring model','');
  lines.push(table(
    ['Category','Raw range','Final weight','What it rewards'],
    [
      ['Championship','0–30',runtime.methodology.weights.championship,'Adjusted UFC title-fight wins and title-opponent context'],
      ['Opponent Quality','0–30',runtime.methodology.weights.opponentQuality,'Quality of UFC wins with diminishing returns and fighter adjustments'],
      ['Prime Dominance','0–30',runtime.methodology.weights.primeDominance,'Prime record, round control, finish pressure, elite validation and sample strength'],
      ['Longevity','0–30',runtime.methodology.weights.longevity,'Gap-adjusted active elite months with status/division multipliers'],
      ['Apex','0–6','Direct modifier','Two approved peak performances, proof, best-fighter claim and aura'],
      ['Loss Penalty','0 to -6','Direct modifier','Contextual loss burden after event rules and aggregate compression'],
      ['Division-Era Depth','Approved adjustment','Direct modifier','Approved division/era depth context']
    ]
  ).trimEnd(),'');
  lines.push('`Total = Championship/30×35 + OpponentQuality/30×25 + PrimeDominance/30×30 + Longevity/30×10 + Apex + LossPenalty + DivisionEraDepth`','');
  const ovr=runtime.methodology.ovr;
  lines.push('## 5. OVR versus raw score','');
  lines.push(`Raw score decides rank. OVR is presentation: floor **${ovr.floor}**, ceiling **${ovr.ceiling}**, curve exponent **${ovr.curve}**, fixed board anchors and a leader-only 99 rule. Men use ${fmt(ovr.anchors.men.floorScore)}–${fmt(ovr.anchors.men.ceilingScore)} anchors; women use ${fmt(ovr.anchors.women.floorScore)}–${fmt(ovr.anchors.women.ceilingScore)}. OVR is not added back into the model.`,'');
  lines.push('## 6. Loss-penalty rules','');
  lines.push(table(
    ['Situation','Raw event rule'],
    [
      ['Pre-prime loss to champion/top-five','-0.75'],['Pre-prime loss to non-elite','-1.25'],
      ['Prime loss to champion/top-five','-1.50'],['Prime loss to non-elite','-4.00'],
      ['Finished in counted loss','extra -0.75'],['Post-prime loss','0'],
      ['Prime upward-division loss to champion/top-five','-0.75'],['Finished upward-division vs champion/top-five','extra -0.50']
    ]
  ).trimEnd(),'');
  lines.push('The current calculator does not simply sum every raw event. It compresses the ledger through worst-loss severity, loss frequency relative to exposure and a prime-loss volume floor; the final magnitude is capped at 6 and can receive a limited division-strength discount.','');
  lines.push('## 7. Division-strength framework','');
  lines.push('Division strength is implemented through fighter-specific canonical keys, era-ledger multipliers and approved Division-Era Depth adjustments. Defaults are guidance, not blind constants. Use the fighter’s own receipts below.','');
  lines.push('## 8. Current all-time leaderboard','');
  lines.push('### Men','');
  lines.push(table(['Rank','Fighter','OVR','Raw','Champ','OQ','Prime','Long','Apex','Penalty','Era'],men.map(f=>[f.rank,f.name,f.appOvr,fmt(f.totalScore),fmt(f.categories.championship),fmt(f.categories.opponentQuality),fmt(f.categories.primeDominance),fmt(f.categories.longevity),signed(f.categories.apex),signed(f.categories.penalty),signed(f.categories.eraDepth)])).trimEnd(),'');
  lines.push('### Women','');
  lines.push(table(['Rank','Fighter','OVR','Raw','Champ','OQ','Prime','Long','Apex','Penalty','Era'],women.map(f=>[f.rank,f.name,f.appOvr,fmt(f.totalScore),fmt(f.categories.championship),fmt(f.categories.opponentQuality),fmt(f.categories.primeDominance),fmt(f.categories.longevity),signed(f.categories.apex),signed(f.categories.penalty),signed(f.categories.eraDepth)])).trimEnd(),'');
  lines.push('## 9. Query indexes','');
  lines.push(`- **Highest-ranked men’s fighter with no derived undisputed UFC title win:** ${bestNoUndisputed?`#${bestNoUndisputed.rank} ${bestNoUndisputed.name} (${bestNoUndisputed.appOvr} OVR)`:'none'}. Separate résumé rank from subjective ability.`);
  lines.push(`- **Best Prime Dominance score outside the men’s top 10:** ${bestPrimeOutsideTop10?`#${bestPrimeOutsideTop10.rank} ${bestPrimeOutsideTop10.name}, ${fmt(bestPrimeOutsideTop10.categories.primeDominance)}`:'none'}.`);
  lines.push(`- **Islam-to-GSP current raw-score gap:** ${fmt(Number(gsp.totalScore)-Number(islam.totalScore))} points. Passing GSP requires a full scenario rerun.`);
  lines.push(`- **Cain vs Ngannou current ordering:** ${cain.rank<ngannou.rank?`Cain is ahead (#${cain.rank} vs #${ngannou.rank})`:`Ngannou is ahead (#${ngannou.rank} vs #${cain.rank})`}. Correct any conflicting premise.`);
  lines.push('- **“Most hurt by UFC-only scoring” is an opinion question.** Use excluded-achievement context, label the inference and never invent a counterfactual score.','');
  lines.push('## 10. Fighter-by-fighter data cards','');
  for(const fighter of [...men,...women])lines.push(fighterSection(fighter,fighter.group==='men'?men:women,runtime));
  lines.push('## 11. Comparison guidance','');
  lines.push('1. Start with the verdict.');
  lines.push('2. Say whether the verdict is about **better fighter/ability** or **better UFC-only GOAT résumé**.');
  lines.push('3. Cite actual category values and decisive receipts.');
  lines.push('4. Give the losing fighter’s strongest real counterargument.');
  lines.push('5. Explain why the winner still wins.');
  lines.push('6. Use fight-ledger history only when the fighters actually fought or had a real rivalry.');
  lines.push('7. Lead with the decisive two or three differences, not a spreadsheet recital.','');
  lines.push('## 12. Scenario-analysis guidance','');
  lines.push('- Start with the current raw-score and OVR gap.');
  lines.push('- Define the hypothetical UFC fight: opponent tier, champion status, title type, division, result, method, rounds and date.');
  lines.push('- Update the canonical fight ledger, Championship/Opponent Quality judgments, prime sample, longevity, loss exposure, Apex and division context as applicable.');
  lines.push('- Rerun all seven categories, weighted totals, ranks and OVRs.');
  lines.push('- Do not promise a pass from one win unless the full rerun produces it.');
  lines.push('- Separate deterministic model output from judgment-dependent estimates.','');
  lines.push('## 13. Validation and regression readiness','');
  lines.push(`Automated validation passed for **${validation.fighterCount} fighters** and specifically checked ${validation.validatedFighters.join(', ')}.`,'');
  lines.push(table(
    ['Regression question','Status','Required answer behavior'],
    [
      ['Show me exactly how Jon Jones got 99 OVR.','Ready','Use exact weighted raw total, OVR anchors, curve and leader-only 99 rule.'],
      ['Why is Pantoja’s quality-wins score low?','Ready','Use final-credit inputs, diminishing-return slots, benchmark and flyweight context.'],
      ['Who is the best UFC fighter never to win undisputed gold?','Ready with definition',`Current derived résumé leader: ${bestNoUndisputed?.name||'—'}. Separate ability from résumé.`],
      ['Compare Khabib and Volkanovski.','Ready','Verdict first; give the loser’s best case and separate ability from résumé.'],
      ['What would Islam need to do to pass GSP?','Scenario-ready','State current gap, define assumptions and require a full rerun.'],
      ['Why is Cain behind Ngannou overall?','Premise check required',cain.rank<ngannou.rank?'Current data has Cain ahead; correct the premise before comparing.':'Current data has Ngannou ahead; explain the category/modifier gaps.'],
      ['How was Anderson Silva’s loss penalty calculated?','Ready','Show each event and the severity/frequency/volume compression.'],
      ['Who has the best prime outside the top 10?','Ready',`Current answer: ${bestPrimeOutsideTop10?.name||'—'} by Prime Dominance score.`],
      ['Which fighter is hurt most by UFC-only scoring?','Opinion only','Use excluded-achievement context and never invent a non-UFC score.'],
      ['Who has the strongest UFC résumé without becoming undisputed champion?','Ready with definition',`Current derived leader: ${bestNoUndisputed?.name||'—'}.`]
    ]
  ).trimEnd(),'');
  lines.push('## 14. Known limitations and data gaps','');
  lines.push(`- **Bespoke ranking copy:** ${missingWhy.length} fighters lack custom “Why ranked here” copy; ${missingWhyNot.length} lack custom “Why not ranked higher?” copy. Calculated fallbacks are supplied.`);
  lines.push(`- **Compare-profile coverage:** ${missingCompare.length} fighters lack a full current compare narrative.`);
  lines.push(`- **Round audit coverage:** ${missingRounds.length} fighters have at least one prime fight without audited round allocation${missingRounds.length?`: ${missingRounds.join(', ')}`:'.'}`);
  lines.push(`- **Freshness metadata:** model-as-of is ${text(runtime.modelAsOfDate)}; latest fighter ledger is verified through ${text(latestVerified)}.`);
  lines.push('- **Non-UFC counterfactuals:** the model intentionally does not calculate what excluded achievements would add.');
  lines.push('- **Future scenarios:** rankings, title context and round allocations require explicit assumptions.','');
  lines.push('## 15. Update workflow','');
  lines.push('1. Update canonical fighter facts and approved judgments.');
  lines.push('2. The `Build Octagon Verdict Data` action loads the full app in Chromium.');
  lines.push('3. It rebuilds the split JSON feed, this Markdown pack and the validation report.');
  lines.push('4. The action commits generated artifacts to `main` only after validation passes.');
  lines.push('5. Upload the new Markdown file to the Octagon Verdict Custom GPT and run the regression questions above.','');
  return lines.join('\n');
}

async function build(){
  const runtime=await readRuntime();
  runtime.fighters.sort((a,b)=>a.group!==b.group?(a.group==='men'?-1:1):Number(a.rank||999)-Number(b.rank||999));
  const validation=validate(runtime);
  const markdown=buildMarkdown(runtime,validation);
  write(outputPath,markdown);
  write(validationPath,`${JSON.stringify({
    ...validation,
    modelAsOfDate:runtime.modelAsOfDate,
    methodology:runtime.methodology,
    output:path.relative(root,outputPath)
  },null,2)}\n`);
  console.log(`Built official Octagon Verdict knowledge pack: ${runtime.fighters.length} fighters, ${markdown.split('\n').length} Markdown lines.`);
}

build().catch(error=>{console.error(error?.stack||error);process.exit(1);});
