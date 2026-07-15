import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const CHARLES_WATCH_URL='https://youtube.com/shorts/zHUAvACSUk4?is=VYzwsuIvxV85k8zH';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(error.message));

try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready',null,{timeout:90000});
  await page.waitForFunction(()=>{
    const personality=window.UFC_FIGHTER_CARD_PERSONALITY;
    const rowCount=document.querySelectorAll('#menList .fighter-row[data-fighter],#womenList .fighter-row[data-fighter]').length;
    return Boolean(personality)&&rowCount===73;
  },null,{timeout:30000});
  await page.waitForFunction(expected=>document.querySelector('.fighter-row[data-fighter="Charles Oliveira"] .watch-moment-link')?.getAttribute('href')===expected,CHARLES_WATCH_URL,{timeout:30000});

  const audit=await page.evaluate(charlesUrl=>{
    const rows=[...document.querySelectorAll('#menList .fighter-row[data-fighter],#womenList .fighter-row[data-fighter]')].map(row=>({
      fighter:row.dataset.fighter,
      tagline:row.querySelector('.resume-tag')?.textContent.trim()||''
    }));
    const generic=rows.filter(row=>/\b(?:ufc|resume|résumé)\b/i.test(row.tagline));
    const empty=rows.filter(row=>!row.tagline);
    const tags=Object.fromEntries(rows.map(row=>[row.fighter,row.tagline]));
    const personality=window.UFC_FIGHTER_CARD_PERSONALITY;
    const futureTag=personality?.taglineFor?.({fighter:'Future Contender',finishRatePct:72,roundsWonPct:58,activeEliteYears:2});
    return{
      rows,
      generic,
      empty,
      uniqueTagCount:new Set(rows.map(row=>row.tagline)).size,
      tags,
      futureTag,
      personality,
      charlesOverride:window.DISPLAY_OVERRIDES?.['Charles Oliveira']?.watchUrl||null,
      charlesHref:document.querySelector('.fighter-row[data-fighter="Charles Oliveira"] .watch-moment-link')?.getAttribute('href')||null,
      charlesExpected:charlesUrl
    };
  },CHARLES_WATCH_URL);

  assert.equal(audit.rows.length,73,'all 73 ranked fighters render a pill tagline');
  assert.deepEqual(audit.generic,[],'no visible fighter pill uses generic UFC/resume wording');
  assert.deepEqual(audit.empty,[],'no visible fighter pill is blank');
  assert.ok(audit.uniqueTagCount>=70,`fighter pills stay personal instead of collapsing into repeated rank labels (${audit.uniqueTagCount} unique)`);
  assert.equal(audit.tags['Jon Jones'],'The measuring stick');
  assert.equal(audit.tags['Georges St-Pierre'],'The complete champion');
  assert.equal(audit.tags['Merab Dvalishvili'],'A cardio avalanche');
  assert.equal(audit.tags['Charles Oliveira'],'Knock him down, wake him up');
  assert.equal(audit.tags['Amanda Nunes'],'The Lioness ate legends');
  assert.ok(audit.futureTag&&!/\b(?:ufc|resume|résumé)\b/i.test(audit.futureTag),'future fighters receive a personable data-driven fallback');
  assert.equal(audit.personality?.mutatesScores,false);
  assert.equal(audit.personality?.mutatesRanks,false);
  assert.equal(audit.personality?.mutatesOvr,false);
  assert.equal(audit.charlesOverride,CHARLES_WATCH_URL,'Charles override uses the requested Short');
  assert.equal(audit.charlesHref,CHARLES_WATCH_URL,'Charles rendered Watch Moment uses the requested Short');
  assert.deepEqual(pageErrors,[],'fighter-card personality layer causes no uncaught page errors');

  console.log('FIGHTER_CARD_PERSONALITY_CERTIFICATION');
  console.log(JSON.stringify({fighterCount:audit.rows.length,uniqueTagCount:audit.uniqueTagCount,samples:{jon:audit.tags['Jon Jones'],gsp:audit.tags['Georges St-Pierre'],merab:audit.tags['Merab Dvalishvili'],charles:audit.tags['Charles Oliveira'],amanda:audit.tags['Amanda Nunes']},futureTag:audit.futureTag,charlesHref:audit.charlesHref,pageErrors},null,2));
}finally{
  await browser.close();
}
