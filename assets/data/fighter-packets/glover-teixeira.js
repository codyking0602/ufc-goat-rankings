// Glover Teixeira presentation-only fighter packet.
(function(){
  'use strict';
  const VERSION='fighter-packet-glover-teixeira-20260716a-profile-copy-audit';
  const fighter='Glover Teixeira';
  const packet={
    status:{stage:'profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/glover-teixeira.js',displayFallback:'assets/data/fighter-packets/glover-teixeira.js'},
    display:{
      divisionLabel:'LHW',resumeTag:'Late-career title miracle',
      oneLiner:'The late-career title miracle: sixteen UFC wins, thirteen ranked victories, relentless finishing, and a championship breakthrough after nearly a decade among the elite.',
      whyRankedHere:'Teixeira ranks here because his light-heavyweight résumé combines extraordinary longevity with real opponent depth and an improbable championship finish. He beat Rampage Jackson, Ryan Bader, Rashad Evans, Anthony Smith, Thiago Santos, and Jan Błachowicz, collected seven Top-5 wins, and finally won the belt during an elite run in his forties.',
      whyNotHigher:'He does not rank higher because the championship chapter produced only one title-fight win and no successful defense. His 12-6 prime contains several meaningful defeats, including finish losses to Anthony Johnson, Alexander Gustafsson, and Jiří Procházka, while the Corey Anderson decision is a damaging non-elite prime loss in the model.',
      keyJudgmentCalls:[
        ['Jan Błachowicz','The title-winning submission is full championship proof and the defining achievement of Glover’s late-career run.'],
        ['Longevity','Nearly nine active elite years are the central strength of the résumé, not empty roster time.'],
        ['Corey Anderson','The prime loss carries unusually heavy damage because it came against a non-elite opponent in the locked loss rules.'],
        ['Jiří Procházka','The late fifth-round submission is a real prime finish loss and prevents a completed title defense.'],
        ['Jamahal Hill','The later decision loss is treated as post-prime and does not define the championship version of Glover.']
      ],
      finalTakeaway:'Glover is one of the greatest longevity stories in UFC history and a legitimate light-heavyweight champion with a deep ranked-win ledger. One title victory and a loss-heavy prime keep him below the division’s sustained rulers.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
