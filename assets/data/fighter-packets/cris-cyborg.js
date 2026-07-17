// Cris Cyborg presentation-only fighter packet.
(function(){
  'use strict';
  const VERSION='fighter-packet-cris-cyborg-20260716a-profile-copy-audit';
  const fighter='Cris Cyborg';
  const packet={
    status:{stage:'profile copy audited',lastUpdated:'2026-07-16',nextFix:'None.'},
    repoLocations:{centralPacket:'assets/data/fighter-packets/cris-cyborg.js',displayFallback:'assets/data/fighter-packets/cris-cyborg.js'},
    display:{
      divisionLabel:'WFW',resumeTag:'Short UFC featherweight reign',
      oneLiner:'A terrifying short-run featherweight champion who went 5-1 in the UFC, won three title fights, and finished four opponents before Amanda Nunes ended the reign.',
      whyRankedHere:'Cyborg ranks here because her UFC sample was brief but clearly championship-level. She won the featherweight belt, defeated Holly Holm over five rounds, defended again against Yana Kunitskaya, finished four of her five UFC victories, and won nearly 85% of her tracked rounds during the run.',
      whyNotHigher:'She does not rank higher because this is a UFC-only list, so the long Strikeforce and Invicta portions of her legacy are excluded. Her UFC résumé contains only six fights, roughly 2.6 active elite years, and one Top-5 win. The Amanda Nunes knockout is also a decisive prime title-loss finish that sharply limits an otherwise dominant sample.',
      keyJudgmentCalls:[
        ['UFC-only scope','Strikeforce, Invicta, and later non-UFC championships are historical context only and receive no ranking credit.'],
        ['Holly Holm','The five-round title defense is Cyborg’s strongest UFC opponent-quality win and her clearest proof against an established elite name.'],
        ['Featherweight depth','The division offered very few established elite challengers, which caps the quality-wins ceiling.'],
        ['Amanda Nunes','The 51-second knockout is a real prime championship loss and the decisive result that ends the UFC reign.'],
        ['Short sample','Five wins with four finishes create strong dominance, but six total UFC fights cannot support a long-form GOAT résumé.']
      ],
      finalTakeaway:'Cyborg looked like an all-time force during a short UFC stay, but the UFC-only evidence is narrow: three title wins, one elite opponent victory, and a decisive loss to Nunes. Her broader MMA legacy is much larger than her scoreable UFC résumé.'
    }
  };
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status;DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations;}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};}
  applyDisplay();registerPacket();
})();
