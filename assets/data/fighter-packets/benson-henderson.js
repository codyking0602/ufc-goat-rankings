// Benson Henderson presentation-only fighter packet.
(function(){
  'use strict';
  const VERSION='fighter-packet-benson-henderson-20260716a-profile-copy-audit';
  const fighter='Benson Henderson';
  const packet={
    status:{stage:'profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/benson-henderson.js',displayFallback:'assets/data/fighter-packets/benson-henderson.js'},
    display:{
      divisionLabel:'LW / WW',resumeTag:'Deep lightweight title résumé',
      oneLiner:'A decision-heavy lightweight champion whose four UFC title-fight wins and seven Top-5 victories give him one of the division’s deepest UFC-only ledgers.',
      whyRankedHere:'Henderson ranks here because his lightweight run combined real championship volume with elite opponent depth. He beat Frankie Edgar twice, defended against Nate Diaz and Gilbert Melendez, and added strong contender wins over Jim Miller and Clay Guida while winning roughly two-thirds of his tracked rounds.',
      whyNotHigher:'He does not rank higher because the title reign was strong rather than historically dominant, his 18% UFC finish rate limits the separation case, and prime stoppage losses to Anthony Pettis and Rafael dos Anjos damaged the résumé. Several signature decisions were close enough that his dominance case trails the cleaner lightweight peaks above him.',
      keyJudgmentCalls:[
        ['Frankie Edgar rematch','The official title-defense win counts fully, while the close scoring keeps it from creating extra dominance separation.'],
        ['Gilbert Melendez','A legitimate elite title defense, but another narrow decision rather than a defining dominant performance.'],
        ['Anthony Pettis','The submission title loss is a real prime finish loss and ends Henderson’s championship control.'],
        ['Rafael dos Anjos','The knockout is the second damaging prime stoppage and materially caps the peak.'],
        ['Welterweight wins','Thatch and Masvidal add useful résumé depth, but the all-time case is built overwhelmingly at lightweight.']
      ],
      finalTakeaway:'Henderson owns a genuinely deep UFC lightweight résumé: four title-fight wins, repeated elite victories, and strong round control. The close-decision profile and two prime stoppage losses keep him below the division’s cleanest all-time peaks.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
