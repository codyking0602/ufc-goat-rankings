// Ensures optional app containers exist before late-loaded modules request a refresh.
(function(){
  'use strict';
  const VERSION='refresh-safety-20260710b-optional-container-errors';
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

  function optionalContainerError(error){
    const message=String(error?.message||error||'');
    return /Cannot set properties of null \(setting 'innerHTML'\)/.test(message)
      ||/Cannot read properties of null/.test(message);
  }

  function safeRefresh(){
    const created=ensureContainers();
    try{
      const result=original.apply(this,arguments);
      window.UFC_REFRESH_SAFETY.lastRefresh={created,containedError:null,refreshedAt:new Date().toISOString()};
      return result;
    }catch(error){
      if(!optionalContainerError(error))throw error;
      const retryCreated=ensureContainers();
      window.UFC_REFRESH_SAFETY.lastRefresh={created:[...created,...retryCreated],containedError:String(error?.message||error),refreshedAt:new Date().toISOString()};
      return null;
    }
  }

  window.refresh=safeRefresh;
  window.UFC_REFRESH_SAFETY={version:VERSION,applied:true,ensureContainers,originalRefresh:original,lastRefresh:null};
  ensureContainers();
  document.documentElement.setAttribute('data-refresh-safety',VERSION);
})();
