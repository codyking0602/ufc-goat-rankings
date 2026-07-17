// Forrest Griffin presentation-only profile copy.
(function(){
  'use strict';
  const VERSION='fighter-packet-forrest-griffin-20260716b-profile-card-copy';
  const fighter='Forrest Griffin';
  const packet={
    status:{stage:'live profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/forrest-griffin.js',displayFallback:'assets/data/fighter-packets/forrest-griffin.js'},
    display:{
      oneLiner:'An upset-driven light-heavyweight champion whose wins over Shogun Rua and Rampage Jackson created a legitimate but short-lived elite peak.',
      whyRankedHere:'Griffin ranks here because his best two-fight stretch carried real historical weight. He submitted Mauricio Rua in a major upset, then beat Quinton Jackson to win the UFC light-heavyweight title. Wins over Rich Franklin and Tito Ortiz add useful depth, while the Stephan Bonnar fight remains important context even though it is not an elite quality win.',
      whyNotHigher:'He does not rank higher because the championship run ended in his first defense, the counted prime finished only 4-3, and Rashad Evans, Anderson Silva, and Rua all stopped him during that window. With one title-fight win, three Top-5 victories, and a 30% UFC finish rate, the résumé lacks the sustained dominance of the champions above him.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
