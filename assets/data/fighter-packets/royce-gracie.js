// Royce Gracie presentation-only fighter packet.
(function(){
  'use strict';
  const VERSION='fighter-packet-royce-gracie-20260716a-profile-copy-audit';
  const fighter='Royce Gracie';
  const packet={
    status:{stage:'profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/royce-gracie.js',displayFallback:'assets/data/fighter-packets/royce-gracie.js'},
    display:{
      divisionLabel:'Openweight',resumeTag:'Foundational tournament legend',
      oneLiner:'The foundational tournament legend: an 11-0-1 opening run, complete finishing dominance, and the résumé that made Brazilian jiu-jitsu impossible to ignore.',
      whyRankedHere:'Gracie ranks here because his early UFC run was historically dominant inside the format that existed. He won three tournaments, opened 11-0-1, finished every UFC victory, and defeated the two strongest established opponents on the ledger in Ken Shamrock and Dan Severn.',
      whyNotHigher:'He does not rank higher because early tournaments were not the same as a modern UFC title reign, the opponent pool was undeveloped, only two victories receive Top-5-level credit, and his counted elite window lasted roughly 1.4 years. The model respects the dominance without pretending the competitive depth matched later divisions.',
      keyJudgmentCalls:[
        ['Tournament championships','The UFC 1, UFC 2, and UFC 4 wins receive championship value, but not the same value as repeated modern title defenses.'],
        ['Ken Shamrock and Dan Severn','These are the two strongest quality wins and carry the serious sporting proof in the early résumé.'],
        ['Opponent depth','Several famous early opponents had little established mixed-rules proof when Royce beat them.'],
        ['Matt Hughes loss','The 2006 defeat is official but clearly post-prime, so it does not erase the original tournament run.'],
        ['UFC-only scope','The case is based only on official UFC bouts; broader Gracie-family influence is historical context rather than scoring credit.']
      ],
      finalTakeaway:'Royce is the UFC’s foundational dominance case and the clear historical openweight standard. The ranking separates enormous influence and perfect early execution from the deeper championship proof required for the modern GOAT tier.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
