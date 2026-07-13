(function(){
  'use strict';

  const RESTORE_KEY = 'ufc-goat-manual-refresh-v1';
  const LEGACY_KEYS = ['ufc-goat-update-restore-v1','ufc-goat-update-target-v1'];

  function activeView(){
    return document.querySelector('.tab.active')?.dataset.view || 'men';
  }

  function activePlayMode(){
    return document.querySelector('[data-play-mode].active')?.dataset.playMode || 'top10';
  }

  function cleanRefreshParameter(){
    const url = new URL(window.location.href);
    if(!url.searchParams.has('__manual_refresh')) return;
    url.searchParams.delete('__manual_refresh');
    window.history.replaceState(window.history.state,'',`${url.pathname}${url.search}${url.hash}`);
  }

  function saveState(){
    const state = {
      activeView:activeView(),
      playMode:activePlayMode(),
      search:document.getElementById('search')?.value || '',
      division:document.getElementById('divisionFilter')?.value || 'All',
      fighterA:document.getElementById('fighterA')?.value || '',
      fighterB:document.getElementById('fighterB')?.value || '',
      category:document.getElementById('categoryBoardSelect')?.value || '',
      scrollY:window.scrollY || 0
    };
    try { sessionStorage.setItem(RESTORE_KEY,JSON.stringify(state)); }
    catch(_error){}
  }

  function setControlValue(id,value){
    const node = document.getElementById(id);
    if(!node) return;
    if(node.options){
      if([...node.options].some(option => option.value === value)) node.value = value;
      return;
    }
    node.value = value || '';
  }

  function restoreState(){
    let state = null;
    try {
      state = JSON.parse(sessionStorage.getItem(RESTORE_KEY) || 'null');
      sessionStorage.removeItem(RESTORE_KEY);
    } catch(_error){}
    if(!state) return;

    setControlValue('search',state.search);
    setControlValue('divisionFilter',state.division);
    setControlValue('fighterA',state.fighterA);
    setControlValue('fighterB',state.fighterB);
    setControlValue('categoryBoardSelect',state.category);

    if(typeof window.refresh === 'function'){
      try { window.refresh(); } catch(_error){}
    }

    const tab = document.querySelector(`.tab[data-view="${state.activeView || 'men'}"]`);
    if(tab) tab.click();

    if(state.activeView === 'play'){
      const mode = document.querySelector(`[data-play-mode="${state.playMode || 'top10'}"]`);
      if(mode) mode.click();
    }

    if(state.category){
      document.getElementById('categoryBoardSelect')?.dispatchEvent(new Event('change',{bubbles:true}));
    }

    window.setTimeout(() => window.scrollTo({top:Number(state.scrollY) || 0,left:0,behavior:'auto'}),150);
  }

  function installButton(){
    const hero = document.querySelector('.hero');
    if(!hero || document.getElementById('manualRefreshBtn')) return;

    const style = document.createElement('style');
    style.textContent = `
      #manualRefreshBtn{
        position:static;
        z-index:1;
        flex:0 0 auto;
        align-self:flex-start;
        min-height:40px;
        padding:9px 13px;
        border:1px solid rgba(249,115,22,.72);
        border-radius:999px;
        background:rgba(10,13,19,.9);
        box-shadow:0 10px 30px rgba(0,0,0,.24);
        color:#fed7aa;
        font:800 .78rem/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        letter-spacing:.02em;
        white-space:nowrap;
        cursor:pointer;
      }
      #manualRefreshBtn:active{transform:translateY(1px) scale(.98)}
      #manualRefreshBtn.refreshing{opacity:.72;pointer-events:none}
      @media (max-width:900px){
        #manualRefreshBtn{order:-1;align-self:flex-end;min-height:38px;padding:8px 11px;font-size:.72rem}
      }
    `;
    document.head.appendChild(style);

    const button = document.createElement('button');
    button.id = 'manualRefreshBtn';
    button.type = 'button';
    button.textContent = '↻ Refresh';
    button.setAttribute('aria-label','Refresh app for the latest updates');
    button.addEventListener('click',() => {
      saveState();
      button.classList.add('refreshing');
      button.textContent = 'Refreshing…';
      const url = new URL(window.location.href);
      url.searchParams.set('__manual_refresh',String(Date.now()));
      window.location.replace(url.toString());
    });
    hero.appendChild(button);
  }

  LEGACY_KEYS.forEach(key => {
    try { sessionStorage.removeItem(key); } catch(_error){}
  });

  cleanRefreshParameter();
  installButton();
  window.setTimeout(restoreState,250);
})();