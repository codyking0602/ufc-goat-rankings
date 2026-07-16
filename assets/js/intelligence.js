(function(){
  'use strict';

  const GPT_URL='https://chatgpt.com/g/g-6a4c40425d4881919ddebc7231bff09f-octagon-verdict';
  const PROMPTS=[
    {icon:'👑',text:'Who is the best UFC fighter never to win undisputed gold?'},
    {icon:'📈',text:'What would Islam need to reach the top three?'},
    {icon:'🔥',text:'Who has the best prime outside the current top 10?'},
    {icon:'🚀',text:'Which active fighter has the clearest path to the all-time top 10?'},
    {icon:'🧩',text:'Which fighter’s clean record hides a lack of career volume?'},
    {icon:'🔍',text:'Why is Pantoja’s quality-of-wins ranking lower than expected?'}
  ];
  const copyMatchupButton=document.getElementById('intelligenceCopyMatchup');
  const toast=document.getElementById('intelligenceToast');
  let toastTimer=0;

  function ensureIntelligenceLabel(){
    const tab=document.querySelector('.tab[data-view="compare"]');
    if(tab&&tab.textContent.trim()!=='Intelligence')tab.textContent='Intelligence';
  }

  function renderStarterPrompts(){
    const list=document.querySelector('.intelligence-prompt-list');
    if(!list)return;
    list.replaceChildren(...PROMPTS.map(({icon,text})=>{
      const button=document.createElement('button');
      button.className='intelligence-prompt';
      button.type='button';
      button.dataset.intelligencePrompt=text;

      const iconNode=document.createElement('span');
      iconNode.className='intelligence-prompt-icon';
      iconNode.textContent=icon;

      const copy=document.createElement('span');
      copy.className='intelligence-prompt-copy';
      copy.textContent=text;

      const status=document.createElement('span');
      status.className='intelligence-prompt-status';
      status.textContent='Copy';

      button.append(iconNode,copy,status);
      return button;
    }));
  }

  ensureIntelligenceLabel();
  renderStarterPrompts();
  const tabs=document.querySelector('.tabs');
  if(tabs)new MutationObserver(ensureIntelligenceLabel).observe(tabs,{childList:true,subtree:true,characterData:true});
  window.addEventListener?.('ufc-production-ranking-ready',ensureIntelligenceLabel);
  window.addEventListener?.('ufc-scoring-pipeline-ready',ensureIntelligenceLabel);

  document.querySelectorAll('[data-intelligence-open]').forEach(link=>{
    link.href=GPT_URL;
    link.target='_blank';
    link.rel='noopener noreferrer';
  });

  function cleanText(value){
    return String(value||'').replace(/\s+/g,' ').trim();
  }

  async function copyText(text){
    const value=cleanText(text);
    if(!value)return false;
    try{
      if(navigator.clipboard&&window.isSecureContext){
        await navigator.clipboard.writeText(value);
        return true;
      }
    }catch(_error){}
    try{
      const area=document.createElement('textarea');
      area.value=value;
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

  function showToast(message){
    if(!toast)return;
    window.clearTimeout(toastTimer);
    toast.textContent=message;
    toast.classList.add('show');
    toastTimer=window.setTimeout(()=>toast.classList.remove('show'),1900);
  }

  document.querySelectorAll('[data-intelligence-prompt]').forEach(button=>{
    button.addEventListener('click',async()=>{
      const copied=await copyText(button.dataset.intelligencePrompt);
      const status=button.querySelector('.intelligence-prompt-status');
      if(copied){
        button.classList.add('is-copied');
        if(status)status.textContent='Copied';
        showToast('Question copied. Open Octagon Verdict when you’re ready.');
        window.setTimeout(()=>{
          button.classList.remove('is-copied');
          if(status)status.textContent='Copy';
        },1800);
      }else{
        showToast('Could not copy automatically. Press and hold the question to copy it.');
      }
    });
  });

  function matchupPrompt(){
    const fighterA=document.getElementById('fighterA')?.value;
    const fighterB=document.getElementById('fighterB')?.value;
    if(!fighterA||!fighterB)return'';
    return `Compare ${fighterA} and ${fighterB}. Start with the verdict, give the losing fighter's best counterargument, explain why the winner still wins, and separate the better fighter from the better UFC-only GOAT resume.`;
  }

  copyMatchupButton?.addEventListener('click',async()=>{
    const prompt=matchupPrompt();
    if(!prompt){
      showToast('Choose two fighters first.');
      return;
    }
    const copied=await copyText(prompt);
    showToast(copied?'Matchup copied. Open Octagon Verdict to paste it.':'Could not copy the matchup automatically.');
  });
})();