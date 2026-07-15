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

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(error.message));

try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready',null,{timeout:90000});
  await page.waitForSelector('#menList .fighter-row',{timeout:15000});
  await page.locator('#menList .fighter-row').first().click();
  await page.waitForSelector('#drawer.open');

  const profile=await page.locator('#fighterDetail').evaluate(root=>{
    const snapshotLabels=[...root.querySelectorAll('.snapshot-item small,.snapshot-item span')].map(node=>node.textContent.trim());
    const cards=[...root.querySelectorAll('.category-grid .category-card')].map(card=>({
      category:card.dataset.category,
      label:card.querySelector('.category-label')?.textContent.trim()||'',
      rating:card.querySelector('strong')?.textContent.trim()||'',
      context:card.querySelector('small')?.textContent.trim()||'',
      tier:card.querySelector('.tier-pill')?.textContent.trim()||'',
      bar:card.querySelector('.category-bar i')?.style.width||'',
      className:card.className
    }));
    return{snapshotLabels,cards};
  });

  assert.equal(profile.snapshotLabels.includes('Adjusted Title Wins'),false,'Adjusted Title Wins is hidden from the visible Resume Snapshot');
  assert.equal(profile.snapshotLabels.length,7,'Resume Snapshot contains the seven intended visible stats');
  assert.deepEqual(profile.cards.map(card=>card.category),expectedCategories,'profile categories render once in the canonical order');
  assert.deepEqual(profile.cards.map(card=>card.label),expectedLabels,'profile category labels use the approved app-facing names');
  assert.equal(profile.cards.filter(card=>card.category==='apexPeak').length,1,'Peak Apex renders exactly once');

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
  console.log(JSON.stringify({viewport:'390x844',snapshotLabels:profile.snapshotLabels,categories:profile.cards,pageErrors},null,2));
}finally{
  await browser.close();
}
