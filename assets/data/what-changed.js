(function(){
  'use strict';

  // Editorial release rule: keep this feed intentionally small.
  // Add one concise card for a major product release and one card for each newly added fighter.
  // Rank and OVR movement must use approved before/after values; never infer history from the current board alone.
  // Deployment touch: load the immediate all-game challenge controller.
  const source={
    version:'what-changed-data-20260719c-shane-watchlist',
    timezone:'America/Chicago',
    seenStorageKey:'octagon-hq-what-changed-seen-v1',
    entries:[
      {
        id:'shanes-fighters-to-watch-20260719',
        publishedAt:'2026-07-19T09:00:00-05:00',
        type:'New Feature',
        headline:'New: Shane’s Fighters to Watch',
        summary:'A new scouting board at the bottom of Home tracks Shane’s early prospect calls, led by Fatima “The Archangel” Kline, with UFC profile links and headshots as they are added.',
        destination:'home'
      },
      {
        id:'wavelength-game-20260719',
        publishedAt:'2026-07-19T20:00:00-05:00',
        type:'New Game',
        headline:'New game: Wavelength',
        summary:'Four adaptive UFC clues steer you toward one hidden 1–100 number. Every Play game can now challenge a profile or share by text.',
        destination:'play'
      },
      {
        id:'smart-notifications-20260718',
        publishedAt:'2026-07-18T11:46:00-05:00',
        type:'App Updated',
        headline:'Smart notifications are live',
        summary:'Get direct challenges, missing-Picks reminders, and War Room alerts on your device.',
        destination:'home'
      },
      {
        id:'octagon-hq-redesign-20260718',
        publishedAt:'2026-07-18T10:20:00-05:00',
        type:'App Updated',
        headline:'Octagon HQ app redesign',
        summary:'A cleaner six-tab app with rebuilt Home, Play, Picks, War Room, Intelligence, profiles, and challenges.',
        destination:'home'
      },
      {
        id:'anthony-pettis-added-20260717',
        publishedAt:'2026-07-17T15:46:03-05:00',
        type:'Fighter Added',
        headline:'New fighter: Anthony Pettis',
        summary:'Showtime joined the UFC-only rankings at #80 with a full profile and Watch Moments.',
        fighterSlug:'anthony-pettis',
        verified:{rankAtPublish:80}
      }
    ]
  };

  source.entries.sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt));
  Object.freeze(source.entries);
  window.OCTAGON_CHANGELOG=Object.freeze(source);

  if(!document.querySelector('script[data-all-game-challenges-loader]')){
    const script=document.createElement('script');
    script.src='assets/js/game-challenges.js?v=game-challenges-20260719b-immediate-buttons';
    script.async=false;
    script.dataset.allGameChallengesLoader='true';
    document.head.appendChild(script);
  }
})();