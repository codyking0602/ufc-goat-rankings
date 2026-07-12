import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const exists=relative=>fs.existsSync(path.join(root,relative));
const failures=[];

function check(condition,message){
  if(condition) return;
  failures.push(message);
  console.error(`CHECK FAILED: ${message}`);
}

function requireFile(relative){
  check(exists(relative),`Missing required file: ${relative}`);
}

const index=read('index.html');
const nav=read('assets/js/picks-internal-navigation.js');
const profile=read('assets/js/picks-social-retention.js');
const recovery=read('assets/js/picks-device-recovery.js');
const recoverySql=read('supabase/picks-device-recovery-phase.sql');
const settingsCleanup=read('assets/js/picks-settings-admin-cleanup.js');
const mobilePolish=read('assets/js/picks-mobile-polish.js');
const mobilePolishCss=read('assets/css/picks-mobile-polish.css');
const oddsCoverage=read('assets/js/picks-odds-coverage.js');
const oddsFunction=read('supabase/functions/refresh-ufc-odds/index.ts');
const oddsSchedule=read('.github/workflows/refresh-ufc-odds.yml');
const oddsDeploy=read('.github/workflows/deploy-ufc-odds-refresh.yml');
const events=read('assets/data/picks-events.js');
const photos=read('assets/data/picks-photo-overrides.js');
const setup=read('docs/picks-setup.md');

const requiredFiles=[
  'assets/js/picks.js',
  'assets/js/picks-persistent-groups.js',
  'assets/js/picks-post-event.js',
  'assets/js/picks-history.js',
  'assets/js/picks-live-experience.js',
  'assets/js/picks-commissioner.js',
  'assets/js/picks-social-retention.js',
  'assets/js/picks-device-recovery.js',
  'assets/js/picks-correctness-cleanup.js',
  'assets/js/picks-internal-navigation.js',
  'assets/js/picks-home-event-cleanup.js',
  'assets/js/picks-settings-admin-cleanup.js',
  'assets/js/picks-upcoming-event-settings.js',
  'assets/js/picks-mobile-polish.js',
  'assets/js/picks-odds-coverage.js',
  'assets/data/picks-events.js',
  'assets/data/picks-photo-overrides.js',
  'assets/css/picks-device-recovery.css',
  'assets/css/picks-internal-navigation.css',
  'assets/css/picks-home-event-cleanup.css',
  'assets/css/picks-settings-admin-cleanup.css',
  'assets/css/picks-final-cleanup.css',
  'assets/css/picks-mobile-polish.css',
  'assets/css/picks-odds-coverage.css',
  'supabase/functions/refresh-ufc-odds/index.ts',
  '.github/workflows/refresh-ufc-odds.yml',
  '.github/workflows/deploy-ufc-odds-refresh.yml',
  'supabase/picks-device-recovery-phase.sql',
  'supabase/ufc-oklahoma-city-event.sql'
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
  'assets/css/picks-device-recovery.css',
  'assets/css/picks-mobile-polish.css',
  'assets/css/picks-odds-coverage.css',
  'assets/js/picks-social-retention.js',
  'assets/js/picks-internal-navigation.js',
  'assets/js/picks-home-event-cleanup.js',
  'assets/js/picks-settings-admin-cleanup.js',
  'assets/js/picks-upcoming-event-settings.js',
  'assets/js/picks-device-recovery.js',
  'assets/js/picks-mobile-polish.js',
  'assets/js/picks-odds-coverage.js'
];
requiredIndexRefs.forEach(relative=>check(index.includes(relative),`index.html does not load ${relative}`));

const scriptOrder=[
  'assets/js/picks-social-retention.js',
  'assets/js/picks-internal-navigation.js',
  'assets/js/picks-home-event-cleanup.js',
  'assets/js/picks-settings-admin-cleanup.js',
  'assets/js/picks-upcoming-event-settings.js',
  'assets/js/picks-device-recovery.js',
  'assets/js/picks-mobile-polish.js',
  'assets/js/picks-odds-coverage.js'
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
check(profile.includes("'TRIGGER:-PT8H'") && profile.includes("'TRIGGER:-PT1H'"),'Fight-day calendar alerts are missing');
check(settingsCleanup.includes('Add Phone Reminders'),'Settings cleanup does not preserve the phone-reminder label');

check(mobilePolish.includes('formatRemaining'),'Readable fight countdown formatter is missing');
check(mobilePolish.includes('day${days===1') && mobilePolish.includes('hour${hours===1'),'Countdown does not support day/hour copy');
check(mobilePolish.includes('fighterSlug') && mobilePolish.includes('-thumb.webp'),'Automatic fighter thumbnail path wiring is missing');
check(mobilePolish.includes('picks-room-more'),'Compact room overflow menu is missing');
check(mobilePolish.includes("inline:'center'"),'Mobile top-tab auto-centering is missing');
check(mobilePolishCss.includes('position:relative!important') && mobilePolishCss.includes('top:auto!important'),'Picks internal navigation still overlays fight content on mobile');
check(mobilePolishCss.includes('picks-room-banner-compact'),'Compact room banner styling is missing');
check(mobilePolishCss.includes('scroll-snap-type:x proximity'),'Mobile top navigation scroll affordance is missing');

check(oddsCoverage.includes('Not all odds available yet'),'Partial odds availability copy is missing');
check(oddsCoverage.includes('Odds have not been posted yet'),'No-odds state is missing');
check(oddsCoverage.includes('Underdog Lock waiting on posted odds'),'Underdog Lock no-odds state is missing');
check(oddsFunction.includes('THE_ODDS_API_KEY') && oddsFunction.includes('ODDS_REFRESH_SECRET'),'Odds function secrets are missing');
check(oddsFunction.includes('mma_mixed_martial_arts'),'Odds function is not restricted to MMA');
check(oddsFunction.includes('red_odds') && oddsFunction.includes('blue_odds'),'Odds function does not update both fight lines');
check(oddsFunction.includes('.eq("result_status", "scheduled")'),'Odds function can overwrite resolved fights');
check(oddsSchedule.includes("cron: '17 12 * * *'"),'Daily odds refresh schedule is missing');
check(oddsSchedule.includes('refresh-ufc-odds'),'Daily workflow does not invoke the odds function');
check(oddsDeploy.includes('secrets set') && oddsDeploy.includes('--no-verify-jwt'),'Odds function deployment workflow is incomplete');

check(events.includes("id: 'ufc-oklahoma-city-2026-07-18'"),'UFC Oklahoma City event is missing');
check(events.includes("red:'Chase Hooper', blue:'Mitch Ramirez'"),'Current Oklahoma City main card is missing Hooper vs. Ramirez');
check(!events.includes('okc-tavares-barriault'),'Stale Oklahoma City main-card bout remains');
check(photos.includes('"Dricus Du Plessis": "assets/fighters/dricus-du-plessis-thumb.webp"'),'Dricus event-name photo mapping is missing');

check(recovery.includes('picks_member_recovery_status'),'Recovery status RPC hook is missing');
check(recovery.includes('picks_member_generate_recovery_key'),'Recovery key creation hook is missing');
check(recovery.includes('picks_member_recover'),'New-device profile recovery hook is missing');
check(recovery.includes('picks_commissioner_issue_member_recovery'),'Commissioner recovery-code hook is missing');
check(recovery.includes('Profile recovered'),'Recovery completion flow is missing');
check(recoverySql.includes('recovery_key_hash'),'Recovery key hash storage is missing');
check(recoverySql.includes('last_recovered_at'),'Recovery audit timestamp is missing');
check(recoverySql.includes('update public.pick_room_members'),'Room-token rotation is missing');
check(recoverySql.includes('update public.pick_rooms'),'Commissioner-token rotation is missing');

check(!settingsCleanup.includes('removeRetiredTools'),'Runtime retired-tool removal hook still exists');
check(settingsCleanup.includes('Enter Correction Mode'),'Completed-event correction gate is missing');
check(settingsCleanup.includes("label==='EVENT CONTROL'"),'Commissioner event-control fallback filter is missing');

check(setup.includes('picks-event-automation-phase.sql` is retired and should not be run'),'Setup guide does not clearly retire Phase 11');
check(setup.includes('picks-device-recovery-phase.sql'),'Setup guide does not include the device recovery migration');
check(setup.includes('Home') && setup.includes('Event') && setup.includes('Settings'),'Setup guide does not document the current Picks structure');
check(setup.includes('THE_ODDS_API_KEY') && setup.includes('ODDS_REFRESH_SECRET'),'Setup guide does not document automated odds secrets');
check(setup.includes('Refresh UFC Odds'),'Setup guide does not document the daily odds workflow');

if(failures.length){
  console.error(`Picks UI smoke check failed with ${failures.length} issue${failures.length===1?'':'s'}:`);
  failures.forEach((failure,indexValue)=>console.error(`${indexValue+1}. ${failure}`));
  process.exit(1);
}

console.log(`Picks UI smoke check passed: ${assetRefs.length} local assets resolved, ${requiredFiles.length} required files present, current event, reminders, mobile polish, and automated odds verified.`);
