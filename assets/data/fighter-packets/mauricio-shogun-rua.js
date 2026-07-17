// Mauricio "Shogun" Rua presentation-only profile copy.
(function(){
  'use strict';
  const VERSION='fighter-packet-mauricio-shogun-rua-20260716b-profile-card-copy';
  const fighter='Mauricio "Shogun" Rua';
  const packet={
    status:{stage:'live profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/mauricio-shogun-rua.js',displayFallback:'assets/data/fighter-packets/mauricio-shogun-rua.js'},
    display:{
      oneLiner:'A violent light-heavyweight champion whose knockout of Lyoto Machida created an elite UFC peak, even though the broader UFC résumé was far less consistent than his legend suggests.',
      whyRankedHere:'Rua ranks here because his best UFC stretch delivered real championship proof. He stopped Chuck Liddell, pushed Lyoto Machida to a disputed decision, knocked Machida out in the rematch to win the belt, and later avenged the Forrest Griffin loss. Those performances create a legitimate Apex and quality-win case despite the uneven total record.',
      whyNotHigher:'He does not rank higher because this ranking is UFC-only, so his celebrated PRIDE run is excluded. His UFC record is 11-12-1, he won only one title fight, and his counted prime finished 3-3 with damaging losses to Jon Jones and Dan Henderson. The late-career win volume adds context, but it cannot overcome the short championship window and losing overall record.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
