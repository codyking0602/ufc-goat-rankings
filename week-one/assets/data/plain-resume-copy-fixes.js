// Plain-wording copy fixes for app-facing text.
(function(){
  const VERSION='plain-resume-copy-fixes-20260706a';
  function apply(){
    if(typeof DISPLAY_OVERRIDES==='undefined') return;
    const machida=DISPLAY_OVERRIDES['Lyoto Machida'];
    if(machida){
      if(Array.isArray(machida.keyJudgmentCalls)){
        machida.keyJudgmentCalls=machida.keyJudgmentCalls.map(row=>Array.isArray(row) && row[0]==='Mousasi win' ? ['Mousasi win','Strong five-round middleweight win that helps the non-title resume.'] : row);
      }
      if(machida.compareProfile){
        machida.compareProfile.resume='The resume has excellent top-end wins, but the depth is not as strong as the long-reign or murderers-row lightweight cases.';
      }
    }
    window.UFC_PLAIN_RESUME_COPY_FIXES={version:VERSION,appliedAt:new Date().toISOString()};
  }
  apply();
  setTimeout(apply,250);
  setTimeout(apply,1000);
})();