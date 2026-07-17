// Vitor Belfort presentation-only fighter packet.
(function(){
  'use strict';
  const VERSION='fighter-packet-vitor-belfort-20260716a-profile-copy-audit';
  const fighter='Vitor Belfort';
  const packet={
    status:{stage:'profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/vitor-belfort.js',displayFallback:'assets/data/fighter-packets/vitor-belfort.js'},
    display:{
      divisionLabel:'MW / LHW / HW',resumeTag:'Three-era knockout threat',
      oneLiner:'A three-era knockout threat whose explosive finishing, five Top-5 wins, and violent 2013 contender run created a dangerous but uneven UFC legacy.',
      whyRankedHere:'Belfort ranks here because he produced elite UFC wins across an extraordinary span. His ledger includes Rich Franklin, Randy Couture, Michael Bisping, Luke Rockhold, Dan Henderson, Wanderlei Silva, and Anthony Johnson, while fifteen UFC wins and a 93% finishing rate give the résumé rare offensive force and longevity.',
      whyNotHigher:'He does not rank higher because the championship case is thin and unusual: his only undisputed title win came through an early cut stoppage over Randy Couture, and he never defended the belt. Prime finish losses to Anderson Silva, Jon Jones, and Chris Weidman create major drag, while ten official UFC losses make the total résumé far less stable than the champions above him.',
      keyJudgmentCalls:[
        ['Randy Couture title win','The cut stoppage remains an official championship win, but its technical nature keeps it below a normal decisive title victory.'],
        ['2013 contender run','The finishes of Bisping, Rockhold, and Henderson form the strongest peak of Belfort’s UFC case.'],
        ['Regulatory context','The official wins count, while the heavily debated TRT-era context is acknowledged rather than ignored.'],
        ['Jon Jones','The upward-division title loss receives reduced division context, but the submission still counts as a prime finish loss.'],
        ['Non-UFC résumé','PRIDE and other outside accomplishments are excluded; only Belfort’s official UFC results build this ranking.']
      ],
      finalTakeaway:'Belfort’s UFC case is built on longevity, elite names, and terrifying finishing rather than sustained championship control. The peak was real, but the strange title win and repeated prime stoppage losses keep him well below the clean all-time champion tier.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
