// Rashad Evans presentation-only fighter packet.
(function(){
  'use strict';
  const VERSION='fighter-packet-rashad-evans-20260716a-profile-copy-audit';
  const fighter='Rashad Evans';
  const packet={
    status:{stage:'profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/rashad-evans.js',displayFallback:'assets/data/fighter-packets/rashad-evans.js'},
    display:{
      divisionLabel:'LHW',resumeTag:'Deep one-reign light-heavyweight case',
      oneLiner:'A deep one-reign light-heavyweight champion whose seven Top-5 wins, iconic Chuck Liddell knockout, and Forrest Griffin title victory built a stronger résumé than the brief reign suggests.',
      whyRankedHere:'Evans ranks here because his UFC light-heavyweight ledger is loaded with meaningful wins. He knocked out Chuck Liddell, stopped Forrest Griffin to win the title, beat Rampage Jackson, Michael Bisping, Phil Davis, Thiago Silva, and Dan Henderson, and produced a 9-3 prime across six active elite years.',
      whyNotHigher:'He does not rank higher because the championship reign lasted only one title-fight win and ended immediately against Lyoto Machida. The Jon Jones loss is understandable elite damage, but the Antônio Rogério Nogueira upset is a costly non-elite prime loss. With no successful defense and only a 60% rounds-won rate, his résumé trails the longer and cleaner light-heavyweight champions above him.',
      keyJudgmentCalls:[
        ['Chuck Liddell','The knockout is one of the strongest signature performances in Evans’s résumé and a major part of his Apex score.'],
        ['Forrest Griffin','The comeback stoppage is full championship proof and Evans’s only UFC title-fight win.'],
        ['Lyoto Machida','The knockout is a real prime title-loss finish and ends the reign before a defense.'],
        ['Jon Jones','The decision loss is meaningful but comes against the division’s all-time benchmark, so it is less damaging than a non-elite defeat.'],
        ['Nogueira upset','The flat decision loss is the most damaging résumé result because it came during the prime against a non-elite opponent in the model.'],
        ['Late losses','Bader, Teixeira, Kelly, Alvey, and Smith are treated as post-prime context rather than the core Evans case.']
      ],
      finalTakeaway:'Evans is a legitimate all-time light-heavyweight résumé with real depth, a title win, and several elite names. The lack of a defense and the damaging Nogueira loss keep a very good championship case from becoming a great reign.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
