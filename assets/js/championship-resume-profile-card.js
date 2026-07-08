// Championship Resume profile-card explainer polish.
// Keeps scoring unchanged; only changes the expanded profile-card copy and 4 evidence boxes.
(function(){
  const VERSION='championship-resume-profile-card-20260707a';
  const DEFINITION='Championship Resume measures how much a fighter actually won at UFC title level. It rewards repeated title-fight wins, undisputed reigns, second-division titles, and elite title opponents, while discounting interim, vacant, softer, or weird title context.';
  function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d;}
  function fmt(v,dec=2){const x=n(v);return x.toFixed(dec).replace(/\.00$/,'');}
  function cleanOpponent(name){return String(name||'').replace(/\s+\d+$/,'').trim();}
  function titleTypeLabel(type){
    const t=String(type||'normal');
    if(t==='interim')return'interim';
    if(t==='vacantUndisputed')return'vacant';
    if(t==='secondDivisionUndisputed')return'second belt';
    if(t==='vacantSecondDivision')return'vacant second belt';
    return'';
  }
  function auditFor(f){return f?.championshipResumeAudit||{};}
  function winsFor(f){
    const audit=auditFor(f);
    if(Array.isArray(audit.wins)&&audit.wins.length)return audit.wins;
    const ledger=window.UFC_CHAMPIONSHIP_RESUME_LEDGERS;
    const raw=ledger?.getLedger?ledger.getLedger(f?.fighter):ledger?.ledgers?.[f?.fighter];
    if(Array.isArray(raw?.championshipWins))return raw.championshipWins;
    return [];
  }
  function titleFightWins(f){
    const audit=auditFor(f);
    const title=f?.title||{};
    return n(audit.titleFightWins||title.titleFightWins||winsFor(f).length,0);
  }
  function adjustedCredit(f){
    const audit=auditFor(f);
    const title=f?.title||{};
    return n(audit.adjustedTitleCredit||title.adjustedTitleWins,0);
  }
  function bestTitleWins(f){
    const picked=[];
    winsFor(f).slice().sort((a,b)=>n(b.adjustedCredit)-n(a.adjustedCredit)).forEach(w=>{
      const name=cleanOpponent(w.opponent);
      if(name&&!picked.includes(name))picked.push(name);
    });
    return picked.slice(0,5).join(', ')||'No UFC title wins loaded';
  }
  function contextNotes(f){
    const wins=winsFor(f);
    const notes=[];
    wins.forEach(w=>{
      const name=cleanOpponent(w.opponent);
      if(!name)return;
      const type=titleTypeLabel(w.titleType);
      const strength=n(w.strength,1);
      const pieces=[];
      if(type)pieces.push(type);
      if(strength<1)pieces.push('discounted');
      if(String(w.reviewStatus||'').includes('high-risk'))pieces.push('weird context');
      if(pieces.length)notes.push(`${name} (${pieces.join(', ')})`);
    });
    if(notes.length)return notes.slice(0,4).join(', ');
    if(titleFightWins(f)>0)return'Full-strength title résumé with no major title-context discounts.';
    return'No UFC championship wins loaded for this category.';
  }
  function championshipItems(f){
    return [
      ['UFC title-fight wins', String(titleFightWins(f))],
      ['Adjusted title credit', fmt(adjustedCredit(f),2)],
      ['Best title wins', bestTitleWins(f)],
      ['Context notes', contextNotes(f)]
    ];
  }
  const previousEvidence=typeof categoryEvidenceItems==='function'?categoryEvidenceItems:null;
  if(previousEvidence){
    categoryEvidenceItems=function(f,key){
      if(key==='championship')return championshipItems(f);
      return previousEvidence(f,key);
    };
  }
  const previousLogic=typeof categoryLogicSentence==='function'?categoryLogicSentence:null;
  if(previousLogic){
    categoryLogicSentence=function(f,key){
      if(key==='championship')return DEFINITION;
      return previousLogic(f,key);
    };
  }
  window.UFC_CHAMPIONSHIP_RESUME_PROFILE_CARD={version:VERSION,mode:'profile-card-copy-and-boxes-only',boxes:['UFC title-fight wins','Adjusted title credit','Best title wins','Context notes'],definition:DEFINITION,appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-championship-resume-profile-card',VERSION);
  if(typeof refresh==='function'){try{refresh();}catch(e){}}
})();