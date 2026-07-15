// App-facing Watch Moment and signature-fight links only.
(function(){
  'use strict';
  const VERSION='royce-watch-links-20260715a-presentation-only';
  if(typeof DISPLAY_OVERRIDES==='undefined')return;

  const WATCH_LINKS={
    'Royce Gracie':{
      photoUrl:'assets/fighters/royce-gracie.webp',
      thumbUrl:'assets/fighters/royce-gracie-thumb.webp',
      watchUrl:'https://youtube.com/shorts/OQlVzoAnM9M?is=p7sB7tAt3oEAzJSL',
      watchLabel:'Watch Moment',
      signatureFightUrl:'https://youtu.be/-y2SEefVNtE?is=NN1arJDFgj8_a7F9',
      signatureFightLabel:'Watch Signature Fight'
    },
    'Benson Henderson':{
      signatureFightUrl:'https://www.youtube.com/watch?v=P65mAfnAFhk',
      signatureFightLabel:'Watch Signature Fight',
      watchUrl:'https://youtube.com/shorts/ZAhtyftLDFM?is=CW0y_Eq4kDAXaN8b',
      watchLabel:'Watch Moment'
    },
    'Fabricio Werdum':{
      signatureFightUrl:'https://youtu.be/EA_u7Uge45Q?is=CP-pl6SIga7UptkJ',
      signatureFightLabel:'Watch Signature Fight',
      watchUrl:'https://youtube.com/shorts/cayrTy79QNo?is=zOsLCkArO7f6rMcx',
      watchLabel:'Watch Moment'
    },
    'Glover Teixeira':{
      signatureFightUrl:'https://www.youtube.com/watch?v=dAsCS4R0cuE',
      signatureFightLabel:'Watch Signature Fight',
      watchUrl:'https://youtube.com/shorts/fED8oDX1LBs?is=1iGeCVa-GP0UeZPS',
      watchLabel:'Watch Moment'
    },
    'Mauricio "Shogun" Rua':{
      signatureFightUrl:'https://youtu.be/08YmP1EM2ms?is=gQIDS9i91zPsk3kX',
      signatureFightLabel:'Watch Signature Fight',
      watchUrl:'https://youtube.com/shorts/F6K-CKBntck?is=heruCDLgIBMrWtQc',
      watchLabel:'Watch Moment'
    },
    'Frank Shamrock':{
      signatureFightUrl:'https://www.youtube.com/watch?v=obS1W3kHGvk',
      signatureFightLabel:'Watch Signature Fight',
      watchUrl:'https://youtube.com/shorts/paKVbCYymQo?is=VWwRMYAM2viXsbs8',
      watchLabel:'Watch Moment'
    },
    'Forrest Griffin':{
      signatureFightUrl:'https://youtu.be/dkECRNJCgOc?is=Bh3jqyclBSJ0X-G_',
      signatureFightLabel:'Watch Signature Fight',
      watchUrl:'https://youtube.com/shorts/jeOGMfFxufc?is=7uTdPAA4zChmN_a4',
      watchLabel:'Watch Moment'
    },
    'Rashad Evans':{
      signatureFightUrl:'https://youtu.be/YzJjSBV5jsg?is=F9l9dmmcWV30K4Bj',
      signatureFightLabel:'Watch Signature Fight',
      watchUrl:'https://youtube.com/shorts/1WKvEuvMXQs?is=h4BR1iaH5xE2siI1',
      watchLabel:'Watch Moment'
    },
    'Vitor Belfort':{
      signatureFightUrl:'https://www.youtube.com/watch?v=St35ub7lmNg',
      signatureFightLabel:'Watch Signature Fight',
      watchUrl:'https://youtube.com/shorts/Egqw0YGlkV0?is=2HmxpxhvOy_-xXyy',
      watchLabel:'Watch Moment'
    }
  };

  function apply(){
    const applied=[];
    Object.entries(WATCH_LINKS).forEach(([fighter,links])=>{
      const override=DISPLAY_OVERRIDES[fighter]=DISPLAY_OVERRIDES[fighter]||{};
      Object.assign(override,links);
      applied.push(fighter);
    });
    return applied;
  }

  const applied=apply();
  window.addEventListener('ufc-ranking-data-patches-ready',apply);
  window.addEventListener('ufc-scoring-pipeline-ready',apply);
  window.UFC_ROYCE_WATCH_LINKS={version:VERSION,mode:'presentation-only',fighters:applied,watchLinks:WATCH_LINKS,mutatesScores:false,loadsRegistry:false};
  document.documentElement.setAttribute('data-royce-watch-links',VERSION);
})();
