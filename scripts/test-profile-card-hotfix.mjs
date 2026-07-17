import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const expectedCategories=[
  'championship',
  'opponentQuality',
  'primeDominance',
  'longevity',
  'apexPeak',
  'penalty'
];
const expectedLabels=[
  'Championship Resume',
  'Quality Wins',
  'Prime Dominance',
  'Elite Longevity',
  'Peak Apex',
  'Loss Context'
];
const expectedSnapshotLabels=[
  'UFC Record',
  'UFC Title-Fight Wins',
  'Top-5 Wins',
  'Prime UFC Record',
  'Finish Rate',
  'Rounds Won',
  'Active Elite Years',
  'Longest UFC Win Streak'
];
const charlesWatchUrl='https://youtube.com/shorts/zHUAvACSUk4?is=VYzwsuIvxV85k8zH';

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(error.message));

try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready',null,{timeout:90000});
  await page.waitForSelector('#menList .fighter-row',{timeout:15000});
  await page.evaluate(()=>document.getElementById('whatsNewOverlay')?.remove());
  await page.waitForFunction(expected=>document.querySelector('.fighter-row[data-fighter="Charles Oliveira"] .watch-moment-link')?.href===expected,charlesWatchUrl,{timeout:15000});

  const taglineAudit=await page.evaluate(()=>{
    const system=window.UFC_FIGHTER_TAGLINE_SYSTEM;
    const rows=[...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[])];
    const tags=rows.map(row=>({fighter:row.fighter,tag:system?.taglineFor?.(row)||''}));
    const rendered=[...document.querySelectorAll('#menList .fighter-row')].map(row=>({
      fighter:row.dataset.fighter,
      tag:row.querySelector('.resume-tag')?.textContent.trim()||''
    }));
    const futureTag=system?.taglineFor?.({fighter:'Future Fighter',penalty:-1})||'';
    const charlesLink=document.querySelector('.fighter-row[data-fighter="Charles Oliveira"] .watch-moment-link')?.href||'';
    return{version:system?.version||null,tags,rendered,futureTag,charlesLink};
  });

  const badTagPattern=/\b(?:ufc|resume)\b/i;
  assert.ok(taglineAudit.version,'fighter tagline system is loaded');
  assert.ok(taglineAudit.tags.length>0,'current fighter rows are available for tagline coverage');
  assert.deepEqual(taglineAudit.tags.filter(row=>!row.tag||badTagPattern.test(row.tag)),[],'every current fighter receives a personable pill without UFC/resume wording');
  assert.deepEqual(taglineAudit.rendered.filter(row=>!row.tag||badTagPattern.test(row.tag)),[],'rendered leaderboard pills use the approved personable copy');
  assert.ok(taglineAudit.futureTag&&!badTagPattern.test(taglineAudit.futureTag),'future fighters automatically receive a personable fallback tagline');
  assert.equal(taglineAudit.charlesLink,charlesWatchUrl,'Charles Oliveira Watch Moment uses the approved Short');

  await page.locator('#menList .fighter-row').first().click();
  await page.waitForSelector('#drawer.open');

  const profile=await page.locator('#fighterDetail').evaluate(root=>{
    const snapshot=[...root.querySelectorAll('.snapshot-item')].map(item=>({
      label:item.querySelector('small,span')?.textContent.trim()||'',
      value:item.querySelector('strong')?.textContent.trim()||''
    }));
    const cards=[...root.querySelectorAll('.category-grid .category-card')].map(card=>({
      category:card.dataset.category,
      label:card.querySelector('.category-label')?.textContent.trim()||'',
      rating:card.querySelector('strong')?.textContent.trim()||'',
      context:card.querySelector('small')?.textContent.trim()||'',
      tier:card.querySelector('.tier-pill')?.textContent.trim()||'',
      bar:card.querySelector('.category-bar i')?.style.width||'',
      className:card.className
    }));
    return{
      snapshot,
      cards,
      standalonePeakApexPanels:root.querySelectorAll('#apexPeakProfileCard').length
    };
  });

  const streakAudit=await page.evaluate(()=>{
    const runtime=window.UFC_CALCULATED_PROFILE_RUNTIME;
    const rows=[...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[])];
    const failures=rows.map(row=>{
      const snapshot=runtime?.snapshotFor?.(row)||[];
      const streakRow=snapshot.find(([label])=>label==='Longest UFC Win Streak');
      const expected=runtime?.longestWinStreakFor?.(row.fighter);
      return{
        fighter:row.fighter,
        expected,
        actual:streakRow?.[1],
        passed:Number.isInteger(expected)&&streakRow?.[1]===expected
      };
    }).filter(row=>!row.passed);
    const synthetic=runtime?.longestWinStreakFromFights?.([
      {scoringDisposition:'count-win'},
      {scoringDisposition:'count-win'},
      {scoringDisposition:'count-loss'},
      {scoringDisposition:'count-win'},
      {scoringDisposition:'count-win'},
      {scoringDisposition:'count-win'},
      {scoringDisposition:'excluded-no-contest'},
      {scoringDisposition:'count-win'}
    ]);
    return{fighterCount:rows.length,failures,synthetic};
  });

  const snapshotLabels=profile.snapshot.map(row=>row.label);
  const longestStreak=profile.snapshot.find(row=>row.label==='Longest UFC Win Streak');
  assert.equal(snapshotLabels.includes('Adjusted Title Wins'),false,'Adjusted Title Wins is hidden from the visible Resume Snapshot');
  assert.deepEqual(snapshotLabels,expectedSnapshotLabels,'Resume Snapshot contains the eight intended visible stats in order');
  assert.equal(longestStreak?.value,'13','Jon Jones shows his ledger-derived longest UFC win streak');
  assert.ok(streakAudit.fighterCount>0,'calculated fighter rows are available for streak coverage');
  assert.deepEqual(streakAudit.failures,[],'every current fighter receives a ledger-derived longest UFC win streak automatically');
  assert.equal(streakAudit.synthetic,3,'the streak calculator resets on losses and no contests');
  assert.deepEqual(profile.cards.map(card=>card.category),expectedCategories,'profile categories render once in the canonical order');
  assert.deepEqual(profile.cards.map(card=>card.label),expectedLabels,'profile category labels use the approved app-facing names');
  assert.equal(profile.cards.filter(card=>card.category==='apexPeak').length,1,'Peak Apex renders exactly once');
  assert.equal(profile.standalonePeakApexPanels,0,'obsolete standalone Peak Apex profile panels are not rendered');

  const loss=profile.cards[5];
  assert.equal(loss.category,'penalty');
  assert.equal(loss.label,'Loss Context');
  assert.match(loss.rating,/^\d+\s+Rating$/,'Loss Context shows its calculated rating');
  assert.match(loss.context,/^#\d+\s+in category\s+·\s+Losses adjusted for timing, opponent, finish, division$/,'Loss Context shows rank and description');
  assert.ok(loss.tier,'Loss Context shows a tier');
  assert.match(loss.className,/tier-/,'Loss Context receives its calculated tier class');
  assert.match(loss.bar,/^\d+%$/,'Loss Context shows its calculated bar');
  assert.equal(Number.parseInt(loss.bar,10),Number.parseInt(loss.rating,10),'Loss Context bar matches its calculated rating');
  assert.deepEqual(pageErrors,[],'mobile fighter profile has no uncaught page errors');

  await page.screenshot({path:'/tmp/profile-card-mobile-hotfix.png',fullPage:true});
  console.log('PROFILE_CARD_MOBILE_HOTFIX_CERTIFICATION');
  console.log(JSON.stringify({viewport:'390x844',taglineAudit,snapshot:profile.snapshot,streakAudit,categories:profile.cards,standalonePeakApexPanels:profile.standalonePeakApexPanels,pageErrors},null,2));
}finally{
  await browser.close();
}
