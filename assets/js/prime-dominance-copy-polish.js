// App-facing Prime Dominance copy polish.
(function(){
  const VERSION = 'prime-dominance-copy-polish-20260708b';

  function entryFor(fighter){
    return window.UFC_PRIME_DOMINANCE_LEDGERS?.entryFor?.(fighter)
      || window.UFC_PRIME_DOMINANCE_SHADOW_MODEL?.report?.find(entry => entry.fighter === fighter)
      || null;
  }

  function shortRecord(entry){
    if(!entry?.primeRecord) return 'Prime window loaded';
    return `${entry.primeRecord} prime run`;
  }

  function roundControl(entry){
    const audit = entry?.roundControlAudit;
    if(audit?.roundsWon !== undefined && audit?.roundsCounted !== undefined){
      return `${audit.roundsWon} of ${audit.roundsCounted} rounds won`;
    }
    if(entry?.roundControlPct !== undefined) return `${entry.roundControlPct}% round control`;
    return 'Round control review';
  }

  function finishPressure(entry){
    if(entry?.primeFinishes !== undefined && entry?.primeFights){
      return `${entry.primeFinishes} finishes in ${entry.primeFights} prime fights`;
    }
    return 'Finish threat review';
  }

  function installCopy(){
    if(typeof CATEGORY_INFO !== 'undefined'){
      const prime = CATEGORY_INFO.find(([key]) => key === 'primeDominance');
      if(prime){
        prime[2] = 'Clean prime record, round control, finishing pressure, and elite-stage proof';
      }
    }

    const oldEvidence = typeof categoryEvidenceItems === 'function' ? categoryEvidenceItems : null;
    if(oldEvidence && !categoryEvidenceItems.__primeDominanceCopyPolished){
      const polishedEvidence = function(f, key){
        if(key !== 'primeDominance') return oldEvidence(f, key);
        const entry = entryFor(f?.fighter);
        if(!entry) return oldEvidence(f, key);
        return [
          ['Prime record', shortRecord(entry)],
          ['Round control', roundControl(entry)],
          ['Finish pressure', finishPressure(entry)],
          ['Dominance profile', entry.dominanceProfile || 'Prime dominance profile pending']
        ];
      };
      polishedEvidence.__primeDominanceCopyPolished = true;
      categoryEvidenceItems = polishedEvidence;
    }

    const oldSentence = typeof categoryLogicSentence === 'function' ? categoryLogicSentence : null;
    if(oldSentence && !categoryLogicSentence.__primeDominanceCopyPolished){
      const polishedSentence = function(f, key){
        if(key !== 'primeDominance') return oldSentence(f, key);
        return 'Prime Dominance measures how overwhelming a fighter was during their best UFC window. It rewards clean prime records, round control, finishing pressure, and proof against elite opponents.';
      };
      polishedSentence.__primeDominanceCopyPolished = true;
      categoryLogicSentence = polishedSentence;
    }

    window.UFC_PRIME_DOMINANCE_COPY_POLISH = {version: VERSION};
    document.documentElement.setAttribute('data-prime-dominance-copy-polish', VERSION);
  }

  installCopy();
  if(typeof refresh === 'function'){
    try{ refresh(); }catch(e){}
  }
})();
