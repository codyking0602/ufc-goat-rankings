(function(){
  'use strict';

  const source={
    version:'what-changed-data-20260718a-phase-2d',
    timezone:'America/Chicago',
    seenStorageKey:'octagon-hq-what-changed-seen-v1',
    entries:[
      {
        id:'picks-season-launched-20260718',
        publishedAt:'2026-07-18T06:39:54-05:00',
        type:'Picks Updated',
        headline:'Picks Season is live',
        summary:'Picks now has a season home, one canonical leaderboard, event standings, completed-event recaps, and a past-events archive.',
        destination:'picks'
      },
      {
        id:'find-leader-retention-20260718',
        publishedAt:'2026-07-18T00:05:00-05:00',
        type:'Game Updated',
        headline:'Find the Leader now remembers the run',
        summary:'Current streak, best streak, first-attempt scores, replay bests, daily history, placements, achievements, and the Central-time reset are now connected.',
        destination:'play',
        action:'find-leader'
      },
      {
        id:'activity-profile-launched-20260717',
        publishedAt:'2026-07-17T23:05:00-05:00',
        type:'App Updated',
        headline:'The shared Activity Profile launched',
        summary:'One profile now connects Play, Picks, The War Room, achievements, recent activity, and the shared photo identity used throughout Octagon HQ.'
      },
      {
        id:'war-room-rebuilt-20260717',
        publishedAt:'2026-07-17T22:17:46-05:00',
        type:'War Room Updated',
        headline:'The War Room was rebuilt',
        summary:'The private discussion space now has a cleaner hierarchy, shared identity, realtime connection, and the permanent War Room name.',
        destination:'war-room'
      },
      {
        id:'octagon-hq-single-shell-20260717',
        publishedAt:'2026-07-17T21:41:45-05:00',
        type:'App Updated',
        headline:'Octagon HQ became one connected product',
        summary:'Home, Rankings, Play, Picks, The War Room, and Intelligence now run through one six-destination shell.',
        destination:'home'
      },
      {
        id:'intelligence-profile-actions-20260717',
        publishedAt:'2026-07-17T20:13:00-05:00',
        type:'App Updated',
        headline:'Fighter profiles now connect to Intelligence',
        summary:'Compare opens a prepared matchup builder, while Ask Why creates a fighter-specific question for Octagon Verdict.',
        destination:'intelligence'
      },
      {
        id:'home-rebuilt-20260717',
        publishedAt:'2026-07-17T17:36:45-05:00',
        type:'App Updated',
        headline:'Home was rebuilt around the daily UFC loop',
        summary:'Today’s Find the Leader challenge, the next UFC event, The War Room, and Ranking Spotlight now anchor the Home experience.',
        destination:'home'
      },
      {
        id:'anthony-pettis-watch-moments-20260717',
        publishedAt:'2026-07-17T15:54:59-05:00',
        type:'Watch Moment Added',
        headline:'Anthony Pettis Watch Moments added',
        summary:'Showtime’s profile now connects directly to his featured UFC moment and signature UFC title fight.',
        fighterSlug:'anthony-pettis'
      },
      {
        id:'anthony-pettis-added-20260717',
        publishedAt:'2026-07-17T15:46:03-05:00',
        type:'Fighter Added',
        headline:'Anthony Pettis entered the rankings',
        summary:'The former UFC lightweight champion became the 80th ranked fighter in the production roster.',
        fighterSlug:'anthony-pettis',
        verified:{rankAtPublish:80}
      }
    ]
  };

  source.entries.sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt));
  Object.freeze(source.entries);
  window.OCTAGON_CHANGELOG=Object.freeze(source);
})();
