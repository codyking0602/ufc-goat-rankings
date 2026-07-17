(function(){
  'use strict';

  const VERSION='blind-rank-polish-20260717a-category-architecture-bootstrap';
  const ARCHITECTURE_SRC='assets/data/blind-rank-category-architecture.js?v=blind-rank-category-architecture-20260717a-phase-one';

  function injectStyles(){
    if(document.getElementById('blind-rank-polish-css'))return;
    const style=document.createElement('style');
    style.id='blind-rank-polish-css';
    style.textContent=`
      #play .br-current-meta{display:none!important}
      #play .br-results-title{color:#facc15;font-size:9px;font-weight:950;letter-spacing:.12em}
      #play .br-result-row{grid-template-columns:42px 48px minmax(0,1fr)!important}
      #play .br-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      @media(max-width:700px){
        #play .br-result-row{grid-template-columns:34px 42px minmax(0,1fr)!important}
        #play .br-actions{grid-template-columns:1fr!important}
      }
    `;
    document.head.appendChild(style);
  }

  function mark(){
    document.documentElement.setAttribute('data-blind-rank-refinements',VERSION);
  }

  function ensureCategoryArchitecture(){
    if(window.UFC_BLIND_RANK_CATEGORY_ARCHITECTURE)return;
    if(document.querySelector('script[data-blind-rank-category-architecture-loader]'))return;
    const script=document.createElement('script');
    script.src=ARCHITECTURE_SRC;
    script.async=false;
    script.dataset.blindRankCategoryArchitectureLoader='true';
    script.addEventListener('error',()=>{
      document.documentElement.setAttribute('data-blind-rank-category-architecture','load-error');
    },{once:true});
    document.head.appendChild(script);
  }

  function init(){
    injectStyles();
    mark();
    ensureCategoryArchitecture();
  }

  document.addEventListener('ufc-blind-rank-rendered',mark);
  if(window.UFC_BLIND_RANK)init();
  else window.addEventListener('ufc-blind-rank-ready',init,{once:true});
})();
