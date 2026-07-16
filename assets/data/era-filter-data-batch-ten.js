// Permanent era-filter membership additions for shared roster batch ten.
(function(){
  'use strict';

  const VERSION='era-filter-data-batch-ten-20260715a';
  const memberships={
    'Paddy Pimblett':{primary:'new-blood',secondary:'apex'},
    'Chris Weidman':{primary:'golden-age',secondary:'superstar'}
  };
  const data=window.UFC_ERA_FILTER_DATA;
  if(!data?.curatedMembership||!Array.isArray(data.eras))throw new Error(`[${VERSION}] Era-filter data is unavailable.`);
  const validEraIds=new Set(data.eras.map(era=>era.id));
  Object.entries(memberships).forEach(([fighter,membership])=>{
    if(data.curatedMembership[fighter])throw new Error(`[${VERSION}] Duplicate era membership: ${fighter}`);
    const ids=[membership.primary,membership.secondary].filter(Boolean);
    if(ids.length>2||new Set(ids).size!==ids.length||ids.some(id=>!validEraIds.has(id)))throw new Error(`[${VERSION}] Invalid era membership for ${fighter}.`);
    data.curatedMembership[fighter]={...membership};
  });
  const errors=[];
  Object.entries(data.curatedMembership).forEach(([fighter,membership])=>{
    const ids=[membership.primary,membership.secondary].filter(Boolean);
    if(ids.length>2)errors.push(`${fighter} has more than two eras.`);
    if(new Set(ids).size!==ids.length)errors.push(`${fighter} repeats the same era.`);
    ids.forEach(id=>{if(!validEraIds.has(id))errors.push(`${fighter} uses unknown era ${id}.`);});
  });
  data.audit={fighterCount:Object.keys(data.curatedMembership).length,errors,passed:errors.length===0};
  data.version=`${data.version}+${VERSION}`;
  window.UFC_ERA_FILTER_BATCH_TEN={version:VERSION,fighters:Object.keys(memberships),audit:data.audit,passed:data.audit.passed};
  if(!data.audit.passed)throw new Error(`[${VERSION}] ${errors.join(' ')}`);
  document.documentElement.setAttribute('data-era-filter-batch-ten',`${VERSION}-clean-${Object.keys(memberships).length}`);
})();