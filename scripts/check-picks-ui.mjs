import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const exists=relative=>fs.existsSync(path.join(root,relative));
const failures=[];

function check(condition,message){
  if(!condition) failures.push(message);
}

function requireFile(relative){
  check(exists(relative),`Missing required file: ${relative}`);
}

const index=read('index.html');
const nav=read('assets/js/picks-internal-navigation.js');
const profile=read('assets/js/picks-social-retention.js');
const settingsCleanup=read('assets/js/picks-settings-admin-cleanup.js');
const setup=read('docs/picks-setup.md');

const requiredFiles=[
  'assets/js/picks.js',
  'assets/js/picks-persistent-groups.js',
  'assets/js/picks-post-event.js',
  'assets/js/picks-history.js',
  'assets/js/picks-live-experience.js',
  'assets/js/picks-commissioner.js',
  'assets/js/picks-social-retention.js',
  'assets/js/picks-correctness-cleanup.js',
  'assets/js/picks-internal-navigation.js',
  'assets/js/picks-home-event-cleanup.js',
  'assets/js/picks-settings-admin-cleanup.js',
  'assets/css/picks-internal-navigation.css',
  'assets/css/picks-home-event-cleanup.css',
  'assets/css/picks-settings-admin-cleanup.css',
  'assets/css/picks-final-cleanup.css'
];
requiredFiles.forEach(requireFile);

const retiredFiles=[
  'assets/js/picks-event-manager.js',
  'assets/css/picks-event-manager.css',
  'assets/js/picks-event-automation.js',
  'assets/css/picks-event-automation.css'
];
retiredFiles.forEach(relative=>check(!exists(relative),`Retired frontend file still exists: ${relative}`));

const assetRefs=[...index.matchAll(/(?:src|href)="([^"?#]+)(?:\?[^"#]*)?"/g)]
  .map(match=>match[1])
  .filter(value=>!/^https?:\/\//.test(value) && !value.startsWith('data:') && !value.startsWith('#'));
assetRefs.forEach(requireFile);

for(const retired of retiredFiles){
  check(!index.includes(retired),`index.html still loads retired asset: ${retired}`);
}

const requiredIndexRefs=[
  'assets/css/picks-final-cleanup.css',
  'assets/js/picks-social-retention.js',
  'assets/js/picks-internal-navigation.js',
  'assets/js/picks-home-event-cleanup.js',
  'assets/js/picks-settings-admin-cleanup.js'
];
requiredIndexRefs.forEach(relative=>check(index.includes(relative),`index.html does not load ${relative}`));

const scriptOrder=[
  'assets/js/picks-social-retention.js',
  'assets/js/picks-internal-navigation.js',
  'assets/js/picks-home-event-cleanup.js',
  'assets/js/picks-settings-admin-cleanup.js'
].map(relative=>index.indexOf(relative));
check(scriptOrder.every(position=>position>=0),'One or more Picks cleanup scripts are missing from index.html');
check(scriptOrder.every((position,indexValue)=>indexValue===0 || position>scriptOrder[indexValue-1]),'Picks cleanup scripts are loaded in an unsafe order');

const requiredStaticIds=[
  'picks','picksEventPicker','picksEventHero','picksRoomBanner','picksRoomSetup',
  'picksAdminPanel','picksProgress','picksFightList','picksStandingsCard','picksRoomPicksCard'
];
requiredStaticIds.forEach(id=>check(index.includes(`id="${id}"`),`Missing Picks mount point: #${id}`));

const ids=[...index.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
const duplicateIds=[...new Set(ids.filter((id,indexValue)=>ids.indexOf(id)!==indexValue))];
check(duplicateIds.length===0,`Duplicate static HTML ids: ${duplicateIds.join(', ')}`);

check(nav.includes("const ROUTES=['home','event','settings']"),'Internal Picks routes changed unexpectedly');
check(nav.includes("home:['picksGroupCard','picksHistoryCard']"),'Home route is not limited to group and history content');
check(nav.includes("settings:['picksProfileShell','picksCommissionerCard']"),'Settings route contains retired tools');
check(!nav.includes('picksSocialCard'),'Social Hub is still routed into the live app');
check(!nav.includes('picksEventManagerCard'),'Event Manager is still routed into the live app');
check(!nav.includes('picksAutomationCard'),'Card Automation is still routed into the live app');
check(nav.includes("window.addEventListener('popstate'"),'Back/forward route restoration is missing');
check(nav.includes('ArrowRight') && nav.includes('ArrowLeft'),'Keyboard tab navigation is missing');

const retiredSocialSymbols=['awardsSection','activitySection','shareGraphic','buildCanvas','picksShareWinnerCard','picksShareSeasonCard'];
retiredSocialSymbols.forEach(symbol=>check(!profile.includes(symbol),`Retired Social Hub code remains: ${symbol}`));
check(profile.includes('profileMarkup'),'Profile settings renderer is missing');
check(profile.includes('picks_social_update_profile'),'Profile persistence RPC is missing');
check(profile.includes('picksAddCalendar'),'Calendar reminder support is missing');

check(!settingsCleanup.includes('removeRetiredTools'),'Runtime retired-tool removal hook still exists');
check(settingsCleanup.includes('Enter Correction Mode'),'Completed-event correction gate is missing');
check(settingsCleanup.includes("label==='EVENT CONTROL'"),'Commissioner event-control fallback filter is missing');

check(setup.includes('picks-event-automation-phase.sql` is retired and should not be run'),'Setup guide does not clearly retire Phase 11');
check(setup.includes('Home') && setup.includes('Event') && setup.includes('Settings'),'Setup guide does not document the current Picks structure');

if(failures.length){
  console.error(`Picks UI smoke check failed with ${failures.length} issue${failures.length===1?'':'s'}:`);
  failures.forEach((failure,indexValue)=>console.error(`${indexValue+1}. ${failure}`));
  process.exit(1);
}

console.log(`Picks UI smoke check passed: ${assetRefs.length} local assets resolved, ${requiredFiles.length} required files present, retired interfaces absent.`);