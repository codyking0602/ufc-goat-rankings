// Global profile snapshot cleanup.
// Keeps profile stats readable and rejects formula/category values that accidentally leak into the snapshot.
(function(){
  const VERSION='profile-snapshot-sanity-20260707a';
  const MAX={titleWins:25,eliteWins:25,years:25,finishedPrime:20};
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function num(v){if(v===null||v===undefined||v==='')return null;const m=String(v).match(/-?\d+(?:\.\d+)?/);if(!m)return null;const n=Number(m[0]);return Number.isFinite(n)?n:null;}
  function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
  function fighterRows(){return Array.isArray(window.RANKING_DATA?.fighters)?window.RANKING_DATA.fighters:[];}
  function boardRows(){return (window.RANKING_DATA?.men||[]).concat(window.RANKING_DATA?.women||[]);}
  function activeName(){const h=document.querySelector('#fighterDetail .profile-summary h2');return h?.textContent?.trim()||'';}
  function fighterFor(name){const wanted=norm(name);return fighterRows().find(f=>norm(f.fighter)===wanted)||boardRows().find(f=>norm(f.fighter)===wanted)||null;}
  function overridesFor(name){try{return window.DISPLAY_OVERRIDES?.[name]||{};}catch(e){return{};}}
  function pick(f,keys){const o=overridesFor(f?.fighter||'');const pools=[o.snapshotStats,o.packetProfileStats,f?.snapshot,f?.resume,f?.profileStats,f];for(const pool of pools){if(!pool)continue;for(const key of keys){if(pool[key]!==undefined&&pool[key]!==null&&pool[key]!=='')return pool[key];}}return null;}
  function validRecord(v){const s=String(v||'').trim();return /^\d+\s*-\s*\d+(?:\s*-\s*\d+)?(?:\s*,\s*\d+\s*NC)?$/i.test(s)?s.replace(/\s+/g,' '):null;}
  function fmtInt(v,max){const n=num(v);if(!Number.isFinite(n)||n<0||n>max)return null;return String(Math.round(n));}
  function fmtPct(v){const n=num(v);if(!Number.isFinite(n)||n<0||n>100)return null;return `${n.toFixed(1)}%`;}
  function fmtYears(v){const n=num(v);if(!Number.isFinite(n)||n<0||n>MAX.years)return null;return n.toFixed(1).replace(/\.0$/,'');}
  function primeRecord(f){const raw=pick(f,['primeRecord','primeUfcRecord','prime_record']);const s=String(raw||'').trim();if(/^\d+\s*-\s*\d+(?:\s*-\s*\d+)?$/i.test(s))return s.replace(/\s+/g,' ');const w=num(pick(f,['primeWins'])),l=num(pick(f,['primeLosses']));if(Number.isFinite(w)&&Number.isFinite(l))return `${w}-${l}`;return null;}
  function titleWins(f){let v=fmtInt(pick(f,['titleFightWins','ufcTitleFightWins']),MAX.titleWins);if(v)return v;const title=f?.title||{};const keys=['normalTitleWins','interimTitleWins','vacantUndisputedWins','secondDivisionUndisputedWins','vacantSecondDivisionWins'];const total=keys.reduce((sum,k)=>sum+(num(title[k])||0),0);if(total>0&&total<=MAX.titleWins)return String(Math.round(total));const m=String(title.notes||'').match(/title[-\s]?fight wins\s*=\s*([0-9.]+)/i);return m?fmtInt(m[1],MAX.titleWins):null;}
  function cleanOpponentName(name){return String(name||'').replace(/\s+(?:I{1,3}|IV|V)$/i,'').replace(/\s+\d+$/,'').trim();}
  function opponentDerivedEliteWins(f){const wins=Array.isArray(f?.qualityWins)?f.qualityWins:(Array.isArray(f?.opponents)?f.opponents:[]);const names=new Set();wins.forEach(o=>{const credit=num(o?.credit??o?.value)??0;const context=String([o?.context,o?.type,o?.notes,o?.note].filter(Boolean).join(' ')).toLowerCase();if(credit>=0.75||/champion|top\s*-?\s*5|top-five|elite|p4p/.test(context)){const n=cleanOpponentName(o?.opponent);if(n)names.add(n);}});return names.size||null;}
  function eliteWins(f){const direct=pick(f,['eliteTopFiveWins','eliteWins','topFiveWins']);const n=num(direct);if(Number.isInteger(n)&&n>=0&&n<=MAX.eliteWins)return String(n);const derived=opponentDerivedEliteWins(f);return Number.isFinite(derived)?String(derived):null;}
  function finishedPrime(f){const v=fmtInt(pick(f,['timesFinishedPrime','finishedInPrime','primeFinishedLosses']),MAX.finishedPrime);return v!==null?v:null;}
  function snapshotItems(f){return[
    ['UFC Record',validRecord(pick(f,['ufcRecord','record']))||'—'],
    ['UFC Title-Fight Wins',titleWins(f)||'—'],
    ['Elite / Top-5 Wins',eliteWins(f)||'—'],
    ['Prime Record',primeRecord(f)||'—'],
    ['Finish Rate',fmtPct(pick(f,['finishRatePct','finishPct']))||'—'],
    ['Rounds Won',fmtPct(pick(f,['roundsWonPct','roundsWonPercentage','roundWinPct']))||'—'],
    ['Active Elite Years',fmtYears(pick(f,['activeEliteYears','eliteYears']))||'—'],
    ['Times Finished in Prime',finishedPrime(f)||'—']
  ];}
  function grid(items){return `<div class="snapshot-grid ufc-snapshot-sane">${items.map(([label,value])=>`<div class="snapshot-item"><strong>${esc(value)}</strong><small>${esc(label)}</small></div>`).join('')}</div>`;}
  function apply(){const detail=document.getElementById('fighterDetail');if(!detail)return;const f=fighterFor(activeName());if(!f)return;const card=Array.from(detail.querySelectorAll('.card')).find(c=>/^Resume Snapshot$/i.test(c.querySelector('h3')?.textContent?.trim()||''));if(!card)return;const existing=card.querySelector('.snapshot-grid');if(existing)existing.outerHTML=grid(snapshotItems(f));else card.insertAdjacentHTML('beforeend',grid(snapshotItems(f)));window.UFC_PROFILE_SNAPSHOT_SANITY={version:VERSION,fighter:f.fighter,items:snapshotItems(f)};}
  function style(){if(document.getElementById('profile-snapshot-sanity-style'))return;const css=document.createElement('style');css.id='profile-snapshot-sanity-style';css.textContent=`.snapshot-grid .snapshot-item,.category-explainer-grid .category-explainer-item{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:6px!important}.snapshot-grid .snapshot-item strong,.category-explainer-grid .category-explainer-item strong{display:block!important;line-height:1.05!important}.snapshot-grid .snapshot-item small,.category-explainer-grid .category-explainer-item small{display:block!important;line-height:1.25!important}.snapshot-grid .snapshot-item small{font-size:12px!important;color:var(--muted)!important}`;document.head.appendChild(css);}
  const run=()=>{style();apply();setTimeout(apply,200);setTimeout(apply,700);};
  document.addEventListener('click',()=>setTimeout(run,0),true);document.addEventListener('change',()=>setTimeout(run,0),true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
