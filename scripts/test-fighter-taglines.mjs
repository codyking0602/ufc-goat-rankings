import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const CHARLES_WATCH_URL='https://youtube.com/shorts/zHUAvACSUk4?is=VYzwsuIvxV85k8zH';
const GENERIC_TAG=/\b(?:ufc|resume|résumé)\b/i;
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(error.message));

function auditRows(rows){
  const generic=rows.filter(row=>GENERIC_TAG.test(row.tagline));
  const empty=rows.filter(row=>!row.tagline);
  return{generic,empty,uniqueTagCount:new Set(rows.map(row=>row.tagline)).size};
}

try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready',null,{timeout:90000});
  await page.waitForFunction(()=>{
    const system=window.UFC_FIGHTER_TAGLINE_SYSTEM;
    const count=document.querySelectorAll('#menList .fighter-row[data-fighter],#womenList .fighter-row[data-fighter]').length;
    return Boolean(system)&&count===73;
  },null,{timeout:30000});
  await page.waitForFunction(expected=>document.querySelector('.fighter-row[data-fighter="Charles Oliveira"] .watch-moment-link')?.href===expected,CHARLES_WATCH_URL,{timeout:30000});

  const leaderboard=await page.evaluate(()=>{
    const rows=[...document.querySelectorAll('#menList .fighter-row[data-fighter],#womenList .fighter-row[data-fighter]')].map(row=>({
      fighter:row.dataset.fighter,
      tagline:row.querySelector('.resume-tag')?.textContent.trim()||''
    }));
    const tags=Object.fromEntries(rows.map(row=>[row.fighter,row.tagline]));
    const system=window.UFC_FIGHTER_TAGLINE_SYSTEM;
    return{
      rows,
      tags,
      futureTag:system?.taglineFor?.({fighter:'Future Contender',penalty:-2}),
      system,
      charlesOverride:window.DISPLAY_OVERRIDES?.['Charles Oliveira']?.watchUrl||null,
      charlesHref:document.querySelector('.fighter-row[data-fighter="Charles Oliveira"] .watch-moment-link')?.href||null
    };
  });

  const leaderboardAudit=auditRows(leaderboard.rows);
  assert.equal(leaderboard.rows.length,73,'all 73 ranked fighters render a pill tagline');
  assert.deepEqual(leaderboardAudit.generic,[],'no leaderboard pill uses generic UFC/resume wording');
  assert.deepEqual(leaderboardAudit.empty,[],'no leaderboard pill is blank');
  assert.ok(leaderboardAudit.uniqueTagCount>=65,`pill copy stays personal (${leaderboardAudit.uniqueTagCount} unique taglines)`);
  assert.equal(leaderboard.tags['Jon Jones'],'The standard everyone chases');
  assert.equal(leaderboard.tags['Georges St-Pierre'],'No weakness left unanswered');
  assert.equal(leaderboard.tags['Merab Dvalishvili'],'The pace is the weapon');
  assert.equal(leaderboard.tags['Charles Oliveira'],'Chaos, courage, and submissions');
  assert.equal(leaderboard.tags['Amanda Nunes'],'Power that cleared two divisions');
  assert.ok(leaderboard.futureTag&&!GENERIC_TAG.test(leaderboard.futureTag),'future fighters receive a personable automatic fallback');
  assert.equal(leaderboard.system?.mutatesScores,false,'tagline system remains presentation-only');
  assert.equal(leaderboard.charlesOverride,CHARLES_WATCH_URL,'Charles override uses the requested Short');
  assert.equal(leaderboard.charlesHref,CHARLES_WATCH_URL,'Charles rendered Watch Moment uses the requested Short');

  await page.locator('.tab[data-view="division"]').click();
  await page.waitForSelector('#divisionList .fighter-row[data-fighter]');
  const divisionRows=await page.locator('#divisionList .fighter-row[data-fighter]').evaluateAll(rows=>rows.map(row=>({
    fighter:row.dataset.fighter,
    tagline:row.querySelector('.resume-tag')?.textContent.trim()||''
  })));
  const divisionAudit=auditRows(divisionRows);
  assert.ok(divisionRows.length>0,'division board renders fighter pills');
  assert.deepEqual(divisionAudit.generic,[],'no division-board pill uses generic UFC/resume wording');
  assert.deepEqual(divisionAudit.empty,[],'no division-board pill is blank');
  assert.deepEqual(pageErrors,[],'tagline system causes no uncaught page errors');

  console.log('FIGHTER_TAGLINE_CERTIFICATION');
  console.log(JSON.stringify({fighterCount:leaderboard.rows.length,uniqueTagCount:leaderboardAudit.uniqueTagCount,divisionFighterCount:divisionRows.length,samples:{jon:leaderboard.tags['Jon Jones'],gsp:leaderboard.tags['Georges St-Pierre'],merab:leaderboard.tags['Merab Dvalishvili'],charles:leaderboard.tags['Charles Oliveira'],amanda:leaderboard.tags['Amanda Nunes']},futureTag:leaderboard.futureTag,charlesHref:leaderboard.charlesHref,pageErrors},null,2));
}finally{
  await browser.close();
}
