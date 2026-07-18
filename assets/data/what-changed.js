(function(){
  'use strict';

  // Editorial release rule: add verified fighter and major feature milestones here in the same production change.
  // Rank and OVR movement must use approved before/after values; never infer history from the current board alone.
  const source={
    version:'what-changed-data-20260718d-profile-challenges',
    timezone:'America/Chicago',
    seenStorageKey:'octagon-hq-what-changed-seen-v1',
    entries:[
      {
        id:'profile-challenges-live-20260718',
        publishedAt:'2026-07-18T10:15:00-05:00',
        type:'Game Updated',
        headline:'Profile challenges are live',
        summary:'Finish Find the Leader, send the exact board to another Octagon HQ profile, or copy a short challenge link.',
        destination:'play',
        action:'find-leader'
      },
      {
        id:'picks-season-launched-20260718',
        publishedAt:'2026-07-18T06:39:54-05:00',
        type:'Picks Updated',
        headline:'Picks Season is live',
        summary:'Season Home, one leaderboard, event standings, recaps, and past events are now connected.',
        destination:'picks'
      },
      {
        id:'find-leader-retention-20260718',
        publishedAt:'2026-07-18T00:05:00-05:00',
        type:'Game Updated',
        headline:'Find the Leader remembers the run',
        summary:'Streaks, first-attempt scores, replay bests, history, placements, achievements, and Central-time resets are now tracked.',
        destination:'play',
        action:'find-leader'
      },
      {
        id:'activity-profile-launched-20260717',
        publishedAt:'2026-07-17T23:05:00-05:00',
        type:'App Updated',
        headline:'Shared Activity Profile launched',
        summary:'One profile now connects Play, Picks, The War Room, achievements, activity, and your shared photo.'
      },
      {
        id:'war-room-rebuilt-20260717',
        publishedAt:'2026-07-17T22:17:46-05:00',
        type:'War Room Updated',
        headline:'The War Room was rebuilt',
        summary:'Cleaner hierarchy, shared identity, realtime connection, and the permanent War Room name.',
        destination:'war-room'
      },
      {
        id:'octagon-hq-single-shell-20260717',
        publishedAt:'2026-07-17T21:41:45-05:00',
        type:'App Updated',
        headline:'One connected Octagon HQ',
        summary:'All six destinations now run through one connected Octagon HQ shell.',
        destination:'home'
      },
      {
        id:'intelligence-profile-actions-20260717',
        publishedAt:'2026-07-17T20:13:00-05:00',
        type:'App Updated',
        headline:'Profiles connect to Intelligence',
        summary:'Compare prepares a matchup. Ask Why creates a fighter-specific Octagon Verdict question.',
        destination:'intelligence'
      },
      {
        id:'home-rebuilt-20260717',
        publishedAt:'2026-07-17T17:36:45-05:00',
        type:'App Updated',
        headline:'Home rebuilt around the daily UFC loop',
        summary:'Find the Leader, the next event, The War Room, and Ranking Spotlight now anchor Home.',
        destination:'home'
      },
      {
        id:'anthony-pettis-watch-moments-20260717',
        publishedAt:'2026-07-17T15:54:59-05:00',
        type:'Watch Moment Added',
        headline:'Anthony Pettis Watch Moments added',
        summary:'Showtime’s profile now links to a featured moment and signature UFC title fight.',
        fighterSlug:'anthony-pettis'
      },
      {
        id:'anthony-pettis-added-20260717',
        publishedAt:'2026-07-17T15:46:03-05:00',
        type:'Fighter Added',
        headline:'Anthony Pettis entered the rankings',
        summary:'The former UFC lightweight champion became the 80th fighter in the roster.',
        fighterSlug:'anthony-pettis',
        verified:{rankAtPublish:80}
      }
    ]
  };

  source.entries.sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt));
  Object.freeze(source.entries);
  window.OCTAGON_CHANGELOG=Object.freeze(source);
})();
