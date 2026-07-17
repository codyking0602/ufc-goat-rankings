// Vitor Belfort presentation-only profile copy.
(function(){
  'use strict';
  const VERSION='fighter-packet-vitor-belfort-20260716b-profile-card-copy';
  const fighter='Vitor Belfort';
  const packet={
    status:{stage:'live profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/vitor-belfort.js',displayFallback:'assets/data/fighter-packets/vitor-belfort.js'},
    display:{
      oneLiner:'A three-era knockout threat whose explosive finishing, five Top-5 wins, and violent 2013 contender run created a dangerous but uneven UFC legacy.',
      whyRankedHere:'Belfort ranks here because he produced elite UFC wins across an extraordinary span. His ledger includes Rich Franklin, Randy Couture, Michael Bisping, Luke Rockhold, Dan Henderson, Wanderlei Silva, and Anthony Johnson, while fifteen UFC wins and a 93% finishing rate give the résumé rare offensive force and longevity.',
      whyNotHigher:'He does not rank higher because the championship case is thin and unusual: his only undisputed title win came through an early cut stoppage over Randy Couture, and he never defended the belt. Prime finish losses to Anderson Silva, Jon Jones, and Chris Weidman create major drag, while ten official UFC losses make the total résumé far less stable than the champions above him.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
