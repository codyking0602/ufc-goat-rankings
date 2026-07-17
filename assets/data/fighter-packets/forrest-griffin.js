// Forrest Griffin presentation-only fighter packet.
(function(){
  'use strict';
  const VERSION='fighter-packet-forrest-griffin-20260716a-profile-copy-audit';
  const fighter='Forrest Griffin';
  const packet={
    status:{stage:'profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/forrest-griffin.js',displayFallback:'assets/data/fighter-packets/forrest-griffin.js'},
    display:{
      divisionLabel:'LHW',resumeTag:'Upset-driven title peak',
      oneLiner:'An upset-driven light-heavyweight champion whose wins over Shogun Rua and Rampage Jackson created a legitimate but short-lived elite peak.',
      whyRankedHere:'Griffin ranks here because his best two-fight stretch carried real historical weight. He submitted Mauricio Rua in a major upset, then beat Quinton Jackson to win the UFC light-heavyweight title. Wins over Rich Franklin and Tito Ortiz add useful depth, while the Stephan Bonnar fight remains important context even though it is not an elite quality win.',
      whyNotHigher:'He does not rank higher because the championship run ended in his first defense, the counted prime finished only 4-3, and Rashad Evans, Anderson Silva, and Rua all stopped him during that window. With one title-fight win, three Top-5 victories, and a 30% UFC finish rate, the résumé lacks the sustained dominance of the champions above him.',
      keyJudgmentCalls:[
        ['Mauricio Rua I','The submission upset is full elite credit and the performance that launched Griffin into the title picture.'],
        ['Rampage Jackson','The official title win counts fully, while the close decision keeps the dominance value below a decisive championship takeover.'],
        ['Stephan Bonnar','The fight is historically essential to the UFC, but Bonnar’s competitive standing limits its opponent-quality credit.'],
        ['Anderson Silva','The knockout is a damaging prime finish and one of the clearest examples of Griffin’s ceiling against an all-time peak.'],
        ['Rua rematch','The first-round knockout closes the reviewed prime with a third stoppage loss.']
      ],
      finalTakeaway:'Griffin is a real UFC champion with two excellent signature wins, not merely a popularity story. The reign was brief and the prime was stopped three times, which keeps the all-time résumé in the accomplished-champion tier rather than the great-champion tier.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
