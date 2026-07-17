// Fabricio Werdum presentation-only fighter packet.
(function(){
  'use strict';
  const VERSION='fighter-packet-fabricio-werdum-20260716a-profile-copy-audit';
  const fighter='Fabricio Werdum';
  const packet={
    status:{stage:'profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/fabricio-werdum.js',displayFallback:'assets/data/fighter-packets/fabricio-werdum.js'},
    display:{
      divisionLabel:'HW',resumeTag:'Cain-slaying heavyweight champion',
      oneLiner:'A complete heavyweight champion whose submission of Cain Velasquez crowned a deep six-year run of elite wins, finishes, and high-level round control.',
      whyRankedHere:'Werdum ranks here because his UFC résumé is much deeper than a one-night title upset. He stopped Mark Hunt for the interim belt, submitted Cain Velasquez for the undisputed championship, beat Antônio Rodrigo Nogueira and Travis Browne, collected ten ranked wins, and maintained a 9-3 prime with strong finishing and round-winning numbers.',
      whyNotHigher:'He does not rank higher because he recorded only two UFC title-fight wins and never completed an undisputed defense. The Stipe Miocic knockout ended the reign immediately, and later prime losses to Alistair Overeem and Alexander Volkov added further damage. His contender résumé is excellent, but the championship control is too brief for the heavyweight GOAT tier.',
      keyJudgmentCalls:[
        ['Cain Velasquez','The Mexico City submission is a full elite championship win and the defining performance of Werdum’s UFC career.'],
        ['Mark Hunt','The interim-title finish carries real championship value, though less than an undisputed title win.'],
        ['Junior dos Santos','The early knockout is pre-prime damage and does not define the later championship version of Werdum.'],
        ['Stipe Miocic','A real prime title-loss knockout that ends the reign before a defense could be completed.'],
        ['Overeem and Volkov','Both are counted prime losses; the Volkov stoppage adds a second damaging finish inside the main window.']
      ],
      finalTakeaway:'Werdum is a deep, title-proven heavyweight great whose Cain victory gives him an elite peak. The lack of an undisputed defense and multiple late-prime losses keep the résumé below the division’s longest champions.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
