(function(){
  'use strict';

  // Editorial release rule: keep this feed intentionally small.
  // Add one concise card for a major product release and one card for each newly added fighter.
  // Rank and OVR movement must use approved before/after values; never infer history from the current board alone.
  const source={
    version:'what-changed-data-20260718f-phase-3',
    timezone:'America/Chicago',
    seenStorageKey:'octagon-hq-what-changed-seen-v1',
    entries:[
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
})();
