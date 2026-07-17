// Benson Henderson presentation-only profile copy.
(function(){
  'use strict';
  const VERSION='fighter-packet-benson-henderson-20260716b-profile-card-copy';
  const fighter='Benson Henderson';
  const packet={
    status:{stage:'live profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/benson-henderson.js',displayFallback:'assets/data/fighter-packets/benson-henderson.js'},
    display:{
      oneLiner:'A decision-heavy lightweight champion whose four UFC title-fight wins and seven Top-5 victories give him one of the division’s deepest UFC-only ledgers.',
      whyRankedHere:'Henderson ranks here because his lightweight run combined real championship volume with elite opponent depth. He beat Frankie Edgar twice, defended against Nate Diaz and Gilbert Melendez, and added strong contender wins over Jim Miller and Clay Guida while winning roughly two-thirds of his tracked rounds.',
      whyNotHigher:'He does not rank higher because the title reign was strong rather than historically dominant, his 18% UFC finish rate limits the separation case, and prime stoppage losses to Anthony Pettis and Rafael dos Anjos damaged the résumé. Several signature decisions were close enough that his dominance case trails the cleaner lightweight peaks above him.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
