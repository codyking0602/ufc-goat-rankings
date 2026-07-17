// Frank Shamrock presentation-only profile copy.
(function(){
  'use strict';
  const VERSION='fighter-packet-frank-shamrock-20260716b-profile-card-copy';
  const fighter='Frank Shamrock';
  const packet={
    status:{stage:'live profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/frank-shamrock.js',displayFallback:'assets/data/fighter-packets/frank-shamrock.js'},
    display:{
      oneLiner:'A perfect early-UFC champion who went 5-0 with five title-fight wins, five finishes, and a defining victory over Tito Ortiz.',
      whyRankedHere:'Shamrock ranks here because his short UFC run was flawless at championship level. He won all five appearances, finished every opponent, controlled every tracked round, and closed the run by stopping Tito Ortiz in the strongest performance of his UFC résumé.',
      whyNotHigher:'He does not rank higher because the entire UFC case spans only five fights and roughly 1.8 active elite years. The early light-heavyweight field was much thinner than later eras, only three wins reach Top-5 quality in the current model, and the limited sample cannot match champions who proved themselves across multiple generations.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
