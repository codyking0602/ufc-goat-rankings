// Glover Teixeira presentation-only profile copy.
(function(){
  'use strict';
  const VERSION='fighter-packet-glover-teixeira-20260716b-profile-card-copy';
  const fighter='Glover Teixeira';
  const packet={
    status:{stage:'live profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/glover-teixeira.js',displayFallback:'assets/data/fighter-packets/glover-teixeira.js'},
    display:{
      oneLiner:'The late-career title miracle: sixteen UFC wins, thirteen ranked victories, relentless finishing, and a championship breakthrough after nearly a decade among the elite.',
      whyRankedHere:'Teixeira ranks here because his light-heavyweight résumé combines extraordinary longevity with real opponent depth and an improbable championship finish. He beat Rampage Jackson, Ryan Bader, Rashad Evans, Anthony Smith, Thiago Santos, and Jan Błachowicz, collected seven Top-5 wins, and finally won the belt during an elite run in his forties.',
      whyNotHigher:'He does not rank higher because the championship chapter produced only one title-fight win and no successful defense. His 12-6 prime contains several meaningful defeats, including finish losses to Anthony Johnson, Alexander Gustafsson, and Jiří Procházka, while the Corey Anderson decision is a damaging non-elite prime loss in the model.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
