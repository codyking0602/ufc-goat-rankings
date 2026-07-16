(function(){
  'use strict';

  const GPT_URL='https://chatgpt.com/g/g-6a4c40425d4881919ddebc7231bff09f-octagon-verdict';
  const input=document.getElementById('intelligenceQuestion');
  const form=document.getElementById('intelligenceQuestionForm');
  const ready=document.getElementById('intelligenceReady');
  const readyQuestion=document.getElementById('intelligenceReadyQuestion');
  const openLink=document.getElementById('intelligenceOpenGpt');
  const copyButton=document.getElementById('intelligenceCopyQuestion');
  const status=document.getElementById('intelligenceCopyStatus');
  const compareButton=document.getElementById('intelligenceComparePrompt');

  if(!input||!form||!ready||!readyQuestion||!openLink)return;
  openLink.href=GPT_URL;

  function ensureIntelligenceLabel(){
    const tab=document.querySelector('.tab[data-view="compare"]');
    if(tab&&tab.textContent.trim()!=='Intelligence')tab.textContent='Intelligence';
  }

  ensureIntelligenceLabel();
  const tabs=document.querySelector('.tabs');
  if(tabs){
    new MutationObserver(ensureIntelligenceLabel).observe(tabs,{childList:true,subtree:true,characterData:true});
  }
  window.addEventListener?.('ufc-production-ranking-ready',ensureIntelligenceLabel);
  window.addEventListener?.('ufc-scoring-pipeline-ready',ensureIntelligenceLabel);

  const backdrop=document.createElement('button');
  backdrop.type='button';
  backdrop.className='intelligence-modal-backdrop';
  backdrop.setAttribute('aria-label','Close question dialog');
  backdrop.hidden=true;

  const closeButton=document.createElement('button');
  closeButton.type='button';
  closeButton.className='intelligence-modal-close';
  closeButton.setAttribute('aria-label','Close');
  closeButton.textContent='×';
  ready.querySelector('.intelligence-ready-head')?.appendChild(closeButton);
  ready.setAttribute('role','dialog');
  ready.setAttribute('aria-modal','true');
  document.body.append(backdrop,ready);

  function cleanQuestion(value){
    return String(value||'').replace(/\s+/g,' ').trim();
  }

  async function copyText(text){
    if(!text)return false;
    try{
      if(navigator.clipboard&&window.isSecureContext){
        await navigator.clipboard.writeText(text);
        return true;
      }
    }catch(_error){}
    try{
      const area=document.createElement('textarea');
      area.value=text;
      area.setAttribute('readonly','');
      area.style.position='fixed';
      area.style.opacity='0';
      area.style.pointerEvents='none';
      document.body.appendChild(area);
      area.select();
      const copied=document.execCommand('copy');
      area.remove();
      return copied;
    }catch(_error){
      return false;
    }
  }

  function setStatus(message){
    if(status)status.textContent=message;
  }

  function openModal(){
    backdrop.hidden=false;
    ready.hidden=false;
    document.body.classList.add('intelligence-modal-open');
    window.setTimeout(()=>closeButton.focus(),0);
  }

  function closeModal(){
    ready.hidden=true;
    backdrop.hidden=true;
    document.body.classList.remove('intelligence-modal-open');
  }

  async function prepareQuestion(question,options={}){
    const value=cleanQuestion(question||input.value);
    if(!value){
      input.focus();
      return;
    }
    input.value=value;
    readyQuestion.textContent=value;
    openModal();
    const copied=options.copy===false?false:await copyText(value);
    setStatus(copied?'Copied. Open Octagon Verdict and paste your question.':'Question ready. Use Copy Question, then open Octagon Verdict.');
  }

  form.addEventListener('submit',event=>{
    event.preventDefault();
    prepareQuestion(input.value);
  });

  document.querySelectorAll('[data-intelligence-prompt]').forEach(button=>{
    button.addEventListener('click',()=>prepareQuestion(button.dataset.intelligencePrompt||button.textContent));
  });

  copyButton?.addEventListener('click',async()=>{
    const value=cleanQuestion(readyQuestion.textContent||input.value);
    const copied=await copyText(value);
    setStatus(copied?'Copied. Paste it into Octagon Verdict.':'Could not copy automatically. Press and hold the question above to copy it.');
  });

  openLink.addEventListener('click',()=>{
    const value=cleanQuestion(readyQuestion.textContent||input.value);
    copyText(value).then(copied=>{
      setStatus(copied?'Copied. Paste it into Octagon Verdict.':'Octagon Verdict opened. Copy the question above if needed.');
    });
  });

  compareButton?.addEventListener('click',()=>{
    const fighterA=document.getElementById('fighterA')?.value;
    const fighterB=document.getElementById('fighterB')?.value;
    if(!fighterA||!fighterB)return;
    prepareQuestion(`Compare ${fighterA} and ${fighterB}. Start with the verdict, give the losing fighter's best counterargument, explain why the winner still wins, and separate the better fighter from the better UFC-only GOAT resume.`);
  });

  closeButton.addEventListener('click',closeModal);
  backdrop.addEventListener('click',closeModal);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!ready.hidden)closeModal();
  });
})();
