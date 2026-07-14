// Cody-approved resolutions from the July 14, 2026 canonical Loss Context audit.
// Shadow-only: records approved controls and classifications without mutating live penalties.
(function(){
  'use strict';
  const VERSION='canonical-loss-context-approved-resolutions-20260714a-all-ten';
  const approvedBy='Cody';
  const approvedAt='2026-07-14';
  const RESOLUTIONS={
    'Randy Couture':{approvedPenalty:-5.25,tolerance:.01,classification:'Cody-approved shared Era Ledger correction',decision:'Start the shared prime at Vitor Belfort I. Barnett, Ricco Rodriguez, Vitor Belfort II, Chuck Liddell II/III, and Brock Lesnar are prime losses.'},
    'Israel Adesanya':{approvedPenalty:-3.52,tolerance:.02,classification:'Cody-approved factual date correction with frozen rounding retention',decision:'Correct the Dricus du Plessis endpoint to August 18, 2024. Retain the approved -3.52 control; the complete 17-fight canonical exposure produces an immaterial two-hundredths calculator difference.'},
    'Chael Sonnen':{approvedPenalty:-4.75,tolerance:.01,classification:'Cody-approved clean canonical reconstruction',decision:'Accept the complete canonical loss burden with no unjustified strong-division relief.'},
    'Sean Strickland':{approvedPenalty:-3.42,tolerance:.01,classification:'Cody-approved shared Era Ledger correction',decision:'Start the shared prime at Uriah Hall. Pereira, Cannonier, and both Dricus losses occur during the elite window.'},
    'Jessica Andrade':{approvedPenalty:-4.08,tolerance:.01,classification:'Cody-approved factual exposure correction',decision:'Use all 23 official UFC appearances through Erin Blanchfield instead of the stale 19-fight exposure table.'},
    'Miesha Tate':{approvedPenalty:-4.50,tolerance:.01,classification:'Cody-approved clean canonical reconstruction',decision:'Use the approved Rousey II through Amanda Nunes shared window. Both title losses are prime elite finishes.'},
    'Francis Ngannou':{approvedPenalty:-1.07,tolerance:.01,classification:'Cody-approved opponent-quality recovery',decision:'Treat both Stipe Miocic and Derrick Lewis as pre-prime elite decision losses.'},
    'Tito Ortiz':{approvedPenalty:-3.82,tolerance:.01,classification:'Cody-approved clean canonical reconstruction',decision:'Use the approved Machida endpoint and the complete 21-fight UFC exposure through prime.'},
    'Benson Henderson':{approvedPenalty:-3.26,tolerance:.01,classification:'Cody-approved division-relief correction',decision:'Use the locked 1.05 division multiplier rather than the maximum 1.10 relief treatment.'},
    'Leon Edwards':{approvedPenalty:-2.61,tolerance:.01,classification:'Cody-approved new canonical control',decision:'Create the first approved Loss Context control using the RDA through Sean Brady shared window.'}
  };
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const byKey=new Map(Object.entries(RESOLUTIONS).map(([fighter,resolution])=>[key(fighter),{fighter,...resolution,approved:true,approvedBy,approvedAt,version:VERSION}]));
  window.UFC_CANONICAL_LOSS_CONTEXT_APPROVED_RESOLUTIONS={
    version:VERSION,
    applied:true,
    approvedBy,
    approvedAt,
    count:byKey.size,
    fighters:Array.from(byKey.values()).map(row=>row.fighter),
    resolutions:Object.fromEntries(Array.from(byKey.values()).map(row=>[row.fighter,{...row}])),
    entryFor:fighter=>byKey.get(key(fighter))||null,
    mutatesPenalty:false,
    mutatesScores:false,
    appliedAt:new Date().toISOString()
  };
  if(typeof document!=='undefined'&&document?.documentElement?.setAttribute){
    document.documentElement.setAttribute('data-canonical-loss-context-approved-resolutions',VERSION);
  }
})();
