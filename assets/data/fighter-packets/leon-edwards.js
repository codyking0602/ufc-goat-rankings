// Leon Edwards presentation-only fighter packet.
(function(){
  'use strict';
  const VERSION='fighter-packet-leon-edwards-20260716a-profile-copy-audit';
  const fighter='Leon Edwards';
  const packet={
    status:{stage:'profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/leon-edwards.js',displayFallback:'assets/data/fighter-packets/leon-edwards.js'},
    display:{
      divisionLabel:'WW',resumeTag:'Usman-slaying welterweight champion',
      oneLiner:'A patient welterweight champion whose two victories over Kamaru Usman, three title-fight wins, and long ranked ledger created a serious modern résumé.',
      whyRankedHere:'Edwards ranks here because he paired a long climb through the welterweight rankings with championship proof at the very top. He dethroned Kamaru Usman with one of the sport’s greatest late knockouts, beat him again over five rounds, defended against Colby Covington, and accumulated eleven ranked UFC wins across a durable elite run.',
      whyNotHigher:'He does not rank higher because the reign stopped at three title-fight wins, his finishing rate is modest, and the Belal Muhammad title loss followed by the Sean Brady submission weakened the back end of the prime. His résumé is deep, but it lacks the title volume and sustained control of the welterweight legends above him.',
      keyJudgmentCalls:[
        ['Usman title win','The head-kick comeback earns enormous championship and Apex value even though Edwards was losing most of the fight.'],
        ['Usman trilogy','The five-round rematch win is the cleaner proof that he could control an elite champion rather than relying on one moment.'],
        ['Colby Covington','A legitimate defense, but the opponent’s inactivity and fight quality keep it below the Usman wins.'],
        ['Belal Muhammad','The title loss is a real prime elite defeat and ends the reign.'],
        ['Sean Brady','The submission is the damaging prime finish that prevents the late résumé from remaining clean.']
      ],
      finalTakeaway:'Edwards has a real modern welterweight champion case built around two Usman wins and years of ranked consistency. Three title victories are meaningful; the short reign and damaging late-prime losses keep him out of the all-time welterweight top tier.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
