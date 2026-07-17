// Royce Gracie presentation-only profile copy.
(function(){
  'use strict';
  const VERSION='fighter-packet-royce-gracie-20260716b-profile-card-copy';
  const fighter='Royce Gracie';
  const packet={
    status:{stage:'live profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/royce-gracie.js',displayFallback:'assets/data/fighter-packets/royce-gracie.js'},
    display:{
      oneLiner:'The foundational tournament legend: an 11-0-1 opening run, complete finishing dominance, and the résumé that made Brazilian jiu-jitsu impossible to ignore.',
      whyRankedHere:'Gracie ranks here because his early UFC run was historically dominant inside the format that existed. He won three tournaments, opened 11-0-1, finished every UFC victory, and defeated the two strongest established opponents on the ledger in Ken Shamrock and Dan Severn.',
      whyNotHigher:'He does not rank higher because early tournaments were not the same as a modern UFC title reign, the opponent pool was undeveloped, only two victories receive Top-5-level credit, and his counted elite window lasted roughly 1.4 years. The model respects the dominance without pretending the competitive depth matched later divisions.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
