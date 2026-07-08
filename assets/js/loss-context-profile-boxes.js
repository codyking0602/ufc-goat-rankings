// Replaces the Loss Context profile explainer with loss-timeline boxes.
(function(){
  const VERSION='loss-context-profile-boxes-20260707a';
  const WHAT='How clean the fighter’s UFC loss profile is once early losses, prime losses, post-prime losses, finishes, and opponent level are separated.';
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function phase(e){const p=String(e?.phase||'').toLowerCase();if(p.includes('pre'))return'pre';if(p.includes('post'))return'post';return'prime';}
  function doneByStoppage(e){return e?.finished===true||/ko|tko|sub|finish/.test(String(e?.result||e?.method||'').toLowerCase());}
  function entries(f){const a=Array.isArray(f?.lossContextAudit?.entries)?f.lossContextAudit.entries:[];const raw=Array.isArray(f?.losses)?f.losses:[];return (a.length?a:raw).filter(x=>x?.counted!==false);}
  function names(list){const out=[];list.forEach(e=>{const n=String(e?.opponent||'').trim();if(n&&!out.includes(n))out.push(n);});return out.slice(0,2).join(', ')+(out.length>2?' + more':'');}
  function line(list){const n=names(list);return String(list.length)+(n?' — '+n:'');}
  function stats(f){const all=entries(f);const pre=all.filter(e=>phase(e)==='pre');const prime=all.filter(e=>phase(e)==='prime');const post=all.filter(e=>phase(e)==='post');const stopped=all.filter(doneByStoppage);const primeStopped=prime.filter(doneByStoppage);return{all,pre,prime,post,stopped,primeStopped};}
  function keyContext(f,s){
    if(f?.fighter==='Merab Dvalishvili')return'Yan 2 counts as prime; Simon/Saenz are pre-prime.';
    if(f?.fighter==='Jon Jones')return'Hamill DQ is not treated like a real competitive loss.';
    if(f?.lossContextNoLosses||!s.all.length)return'No counted UFC losses.';
    if(s.primeStopped.length)return'Prime stoppage losses carry the strongest context hit.';
    if(s.prime.length)return'Prime losses are counted; decisions hurt less than stoppages.';
    if(s.pre.length)return'Losses came before the scored prime window.';
    if(s.post.length)return'Post-prime losses are separated from the peak résumé.';
    return'Losses are separated by career timing and opponent level.';
  }
  function html(f){
    const rating=typeof categoryOvr==='function'?categoryOvr(f,'penalty'):97;
    const rank=typeof categoryRank==='function'?categoryRank(f,'penalty'):null;
    const tier=typeof tierByCategoryRank==='function'?tierByCategoryRank(f,'penalty'):(typeof tierForOvr==='function'?tierForOvr(rating):{label:'Rated',cls:'tier-average'});
    const s=stats(f);
    const boxes=[['Pre-Prime Losses',line(s.pre)],['Prime Losses',line(s.prime)],['Post-Prime Losses',line(s.post)],['Finished Losses',`${s.stopped.length} total · ${s.primeStopped.length} prime`]];
    return `<div class="category-explainer ${tier.cls}"><div class="category-explainer-kicker">${esc(tier.label)} · #${rank||'—'} in category</div><h3>Loss Context: ${esc(rating)} rating</h3><p><strong>What it means:</strong> ${esc(WHAT)}</p><div class="category-explainer-grid">${boxes.map(([k,v])=>`<div class="category-explainer-item"><strong>${esc(k)}</strong><small>${esc(v)}</small></div>`).join('')}</div><p><strong>Key context:</strong> ${esc(keyContext(f,s))}</p></div>`;
  }
  function install(){
    if(typeof categoryExplanation!=='function'||categoryExplanation.__lossBoxes)return false;
    const old=categoryExplanation;
    const next=function(f,key){return key==='penalty'?html(f):old.apply(this,arguments);};
    next.__lossBoxes=true;
    window.categoryExplanation=categoryExplanation=next;
    window.UFC_LOSS_CONTEXT_PROFILE_BOXES={version:VERSION,what:WHAT};
    document.documentElement.setAttribute('data-loss-context-profile-boxes',VERSION);
    return true;
  }
  const run=()=>{install();setTimeout(install,300);setTimeout(install,900);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
