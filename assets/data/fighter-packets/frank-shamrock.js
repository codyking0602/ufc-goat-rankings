// Frank Shamrock presentation-only fighter packet.
(function(){
  'use strict';
  const VERSION='fighter-packet-frank-shamrock-20260716a-profile-copy-audit';
  const fighter='Frank Shamrock';
  const packet={
    status:{stage:'profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/frank-shamrock.js',displayFallback:'assets/data/fighter-packets/frank-shamrock.js'},
    display:{
      divisionLabel:'LHW',resumeTag:'Perfect early-UFC champion',
      oneLiner:'A perfect early-UFC champion who went 5-0 with five title-fight wins, five finishes, and a defining victory over Tito Ortiz.',
      whyRankedHere:'Shamrock ranks here because his short UFC run was flawless at championship level. He won all five appearances, finished every opponent, controlled every tracked round, and closed the run by stopping Tito Ortiz in the strongest performance of his UFC résumé.',
      whyNotHigher:'He does not rank higher because the entire UFC case spans only five fights and roughly 1.8 active elite years. The early light-heavyweight field was much thinner than later eras, only three wins reach Top-5 quality in the current model, and the limited sample cannot match champions who proved themselves across multiple generations.',
      keyJudgmentCalls:[
        ['Early title structure','All five championship-level wins matter, but the pre-modern title system receives less credit than a long modern defense schedule.'],
        ['Tito Ortiz','The comeback stoppage is the defining proof that Shamrock’s reign was more than an early-era curiosity.'],
        ['Perfect UFC record','The 5-0 finish sweep creates elite dominance, but perfection over five fights is not the same as perfection over a long career.'],
        ['Era depth','The early light-heavyweight pool receives one of the model’s largest depth discounts.'],
        ['Non-UFC career','Later accomplishments add historical context but are excluded from this UFC-only ranking.']
      ],
      finalTakeaway:'Shamrock is the perfect short-reign case: undefeated, all finishes, and genuinely championship-proven. His ceiling is created almost entirely by the tiny UFC sample and the limited depth of the era.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
