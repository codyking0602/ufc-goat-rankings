// Ensures optional app containers exist before late-loaded modules request a refresh.
(function(){
  'use strict';
  const VERSION='refresh-safety-20260710a-modular-containers';
  const original=window.refresh;
  if(typeof original!=='function'){
    window.UFC_REFRESH_SAFETY={version:VERSION,applied:false,reason:'window.refresh was unavailable.'};
    return;
  }

  const CONTAINERS={
    menList:['men','leaderboard'],womenList:['women','leaderboard'],menStats:['men','kpis'],womenStats:['women','kpis'],
    divisionList:['division',''],compareResult:['compare','compare-grid'],rulesContent:['rules','rules-grid']
  };

  function ensure(id,parentId,className){
    if(document.getElementById(id))return false;
    const parent=document.getElementById(parentId);
    if(!parent)return false;
    const node=document.createElement('div');
    node.id=id;
    if(className)node.className=className;
    parent.appendChild(node);
    return true;
  }

  function ensureContainers(){
    const created=[];
    Object.entries(CONTAINERS).forEach(([id,[parentId,className]])=>{if(ensure(id,parentId,className))created.push(id);});
    return created;
  }

  function safeRefresh(){
    const created=ensureContainers();
    const result=original.apply(this,arguments);
    window.UFC_REFRESH_SAFETY.lastRefresh={created,refreshedAt:new Date().toISOString()};
    return result;
  }

  window.refresh=safeRefresh;
  window.UFC_REFRESH_SAFETY={version:VERSION,applied:true,ensureContainers,originalRefresh:original,lastRefresh:null};
  ensureContainers();
  document.documentElement.setAttribute('data-refresh-safety',VERSION);
})();
