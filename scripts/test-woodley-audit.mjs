import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const pageErrors=[];
const consoleErrors=[];
page.on('pageerror',error=>pageErrors.push(error.message));
page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});

try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.UFC_CANONICAL_WOODLEY_AUDIT_ADJUSTMENTS?.passed===true,null,{timeout:90000});

  const audit=await page.evaluate(()=>{
    const fighter='Tyron Woodley';
    const row=window.UFC_CALCULATED_RANKING_PROJECTION?.entryFor?.(fighter)||null;
    const oq=window.UFC_CATEGORY_CALCULATORS?.rowFor?.('opponentQuality',fighter)||null;
    const longevity=window.UFC_CATEGORY_CALCULATORS?.rowFor?.('longevity',fighter)||null;
    const penalty=window.UFC_CATEGORY_CALCULATORS?.rowFor?.('penalty',fighter)||null;
    const era=window.UFC_CATEGORY_CALCULATORS?.rowFor?.('eraDepth',fighter)||null;
    const ww=window.OCTAGON_VERDICT_DATA?.divisionBoards?.Welterweight||[];
    const divisionIndex=ww.findIndex(entry=>entry.fighter===fighter||entry.name===fighter);
    return{
      row,
      oq,
      longevity,
      penalty,
      era,
      divisionRank:divisionIndex>=0?divisionIndex+1:null,
      audit:window.UFC_CANONICAL_WOODLEY_AUDIT_ADJUSTMENTS,
      marker:document.documentElement.getAttribute('data-canonical-woodley-audit')
    };
  });

  assert.ok(audit.row,'Woodley calculated projection exists');
  assert.equal(audit.row.totalScore,47.49);
  assert.equal(audit.row.overallOvr,89);
  assert.equal(audit.row.opponentQuality,14.81);
  assert.equal(audit.row.longevity,13.41);
  assert.equal(audit.row.penalty,-2.37);
  assert.equal(audit.row.eraDepthAdjustment,0);
  assert.equal(audit.row.primeRecord,'7-2-1');
  assert.equal(audit.row.roundsWonPct,59.38);
  assert.equal(audit.row.adjustedTitleWins,3.65);
  assert.equal(audit.row.activeEliteYears,4.97);
  assert.equal(audit.row.topFiveWins,6);

  const credits=Object.fromEntries(audit.oq.inputs.map(input=>[input.opponent,{baseTier:input.baseTier,baseCredit:input.baseCredit,finalCredit:input.finalCredit}]));
  assert.deepEqual(credits['Carlos Condit'],{baseTier:'top-five',baseCredit:1,finalCredit:.85});
  assert.deepEqual(credits['Josh Koscheck'],{baseTier:'ranked',baseCredit:.65,finalCredit:.45});
  assert.deepEqual(credits['Kelvin Gastelum'],{baseTier:'top-five',baseCredit:1,finalCredit:.85});
  assert.deepEqual(credits['Demian Maia'],{baseTier:'top-five',baseCredit:1,finalCredit:.85});
  assert.equal(audit.longevity.stats.divisionMultiplier,1);
  assert.equal(audit.penalty.divisionMultiplier,1);
  assert.equal(audit.penalty.divisionDiscountPct,0);
  assert.equal(audit.era.canonicalAdjustment,0);
  assert.match(audit.marker,/clean/);
  assert.deepEqual(pageErrors,[],'Woodley audit causes no uncaught page errors');
  assert.deepEqual(consoleErrors,[],'Woodley audit causes no console errors');

  console.log('WOODLEY_INPUT_AUDIT_CERTIFICATION');
  console.log(JSON.stringify({rank:audit.row.rank,divisionRank:audit.divisionRank,totalScore:audit.row.totalScore,overallOvr:audit.row.overallOvr,categories:{championship:audit.row.championship,opponentQuality:audit.row.opponentQuality,primeDominance:audit.row.primeDominance,longevity:audit.row.longevity,apex:audit.row.apexPeak,penalty:audit.row.penalty,eraDepth:audit.row.eraDepthAdjustment},visible:{primeRecord:audit.row.primeRecord,roundsWonPct:audit.row.roundsWonPct,adjustedTitleWins:audit.row.adjustedTitleWins,activeEliteYears:audit.row.activeEliteYears,topFiveWins:audit.row.topFiveWins},credits,marker:audit.marker,pageErrors,consoleErrors},null,2));
}finally{
  await browser.close();
}
