// Percentile-based category tier labels.
// Read-only presentation layer. Scoring modules must already be settled before this file loads.
(function(){
  'use strict';
  const VERSION='category-percentile-tiers-20260710b-deterministic';

  function ensureApexPeakCategory(){
    if(typeof CATEGORY_INFO==='undefined'||!Array.isArray(CATEGORY_INFO)) return;
    const entry=['apexPeak','Apex Peak','The best two-win stretch of a UFC career—capturing performance, proof, and peak greatness'];
    const existing=CATEGORY_INFO.find(item=>item[0]==='apexPeak');
    if(existing){existing[1]=entry[1];existing[2]=entry[2];return;}
    const penaltyIndex=CATEGORY_INFO.findIndex(item=>item[0]==='penalty');
    if(penaltyIndex>=0) CATEGORY_INFO.splice(penaltyIndex,0,entry);
    else CATEGORY_INFO.push(entry);
  }
  function categoryBoardFor(f){
    const data=window.RANKING_DATA||{};
    const women=data.women||[];
    const men=data.men||[];
    const isWomen=f?.leaderboard==='women'||women.some(row=>row.fighter===f?.fighter);
    return isWomen?women:men;
  }
  function installBelowAverageStyle(){
    if(document.getElementById('ufc-category-percentile-tier-styles')) return;
    const style=document.createElement('style');
    style.id='ufc-category-percentile-tier-styles';
    style.textContent=':root{--tier-below-average:#64748b}.tier-below-average{--tier-color:var(--tier-below-average)}';
    document.head.appendChild(style);
  }
  function primeEntryFor(row){
    if(!row?.fighter) return null;
    return row.primeDominanceLiveAudit
      ||row.primeDominanceShadowAudit
      ||window.UFC_PRIME_DOMINANCE_LEDGERS?.entryFor?.(row.fighter)
      ||window.UFC_PRIME_DOMINANCE_SHADOW_MODEL?.report?.find(entry=>entry.fighter===row.fighter)
      ||null;
  }
  function primeValue(row){
    const entry=primeEntryFor(row);
    const value=Number(entry?.total??row?.primeDominance??0);
    return Number.isFinite(value)?value:0;
  }
  function liveCategoryRank(f,key){
    if(key==='primeDominance'){
      const board=categoryBoardFor(f);
      const value=primeValue(f);
      return 1+board.filter(row=>primeValue(row)>value).length;
    }
    return categoryRank(f,key);
  }
  function liveCategoryOvr(f,key){
    if(key!=='primeDominance') return categoryOvr(f,key);
    const board=categoryBoardFor(f);
    const rank=liveCategoryRank(f,key);
    if(!rank) return 75;
    if(board.length<=1) return 99;
    const progress=1-((rank-1)/Math.max(board.length-1,1));
    return Math.max(75,Math.min(99,Math.round(75+Math.pow(Math.max(progress,0),2)*24)));
  }
  function tierByCategoryRank(f,key){
    const board=categoryBoardFor(f);
    const total=Math.max(board.length,1);
    const rank=Number(liveCategoryRank(f,key)||total);
    const legendaryCutoff=Math.max(1,Math.ceil(total*.05));
    const eliteCutoff=Math.max(legendaryCutoff,Math.ceil(total*.20));
    const greatCutoff=Math.max(eliteCutoff,Math.ceil(total*.45));
    const goodCutoff=Math.max(greatCutoff,Math.ceil(total*.70));
    const averageCutoff=Math.max(goodCutoff,Math.floor(total*.90));
    if(rank<=legendaryCutoff) return {label:'Legendary',cls:'tier-legendary'};
    if(rank<=eliteCutoff) return {label:'Elite',cls:'tier-elite'};
    if(rank<=greatCutoff) return {label:'Great',cls:'tier-great'};
    if(rank<=goodCutoff) return {label:'Good',cls:'tier-good'};
    if(rank<=averageCutoff) return {label:'Average',cls:'tier-average'};
    return {label:'Below Average',cls:'tier-below-average'};
  }
  function categoryTierContext(f,key){
    const pctScore=liveCategoryOvr(f,key);
    const rank=liveCategoryRank(f,key);
    const tier=tierByCategoryRank(f,key);
    const width=Math.max(0,Math.min(100,pctScore));
    return {pctScore,rank,tier,width};
  }
  function install(){
    if(typeof CATEGORY_INFO==='undefined'||typeof categoryOvr!=='function'||typeof categoryRank!=='function') return false;
    ensureApexPeakCategory();
    installBelowAverageStyle();
    window.UFC_CATEGORY_PERCENTILE_TIERS={
      version:VERSION,
      mode:'read-only-after-scoring',
      mutatesScores:false,
      reappliesPrime:false,
      buckets:[['top 5%','Legendary'],['top 20%','Elite'],['top 45%','Great'],['top 70%','Good'],['top 90%','Average'],['bottom 10%','Below Average']],
      belowAverageColor:'#64748b',
      tierByCategoryRank,
      install
    };
    window.tierByCategoryRank=tierByCategoryRank;
    categoryCards=function(f){
      ensureApexPeakCategory();
      return CATEGORY_INFO.map(([key,label,description])=>{
        const {pctScore,rank,tier,width}=categoryTierContext(f,key);
        return `<button type="button" class="category-card ${tier.cls}" data-category="${key}" aria-label="Explain ${label} percentile for ${f.fighter}"><span class="category-label">${label}</span><strong>${pctScore} <span class="meta">PCTL</span></strong><small>#${rank||'—'} in category · ${description}</small><span class="tier-pill">${tier.label}</span><div class="category-bar"><i style="width:${width}%"></i></div></button>`;
      }).join('');
    };
    categoryExplanation=function(f,key){
      const info=CATEGORY_INFO.find(([k])=>k===key)||[key,key,''];
      const label=info[1];
      const description=info[2];
      const {pctScore,rank,tier}=categoryTierContext(f,key);
      const items=categoryEvidenceItems(f,key);
      return `<div class="category-explainer ${tier.cls}"><div class="category-explainer-kicker">${tier.label} · #${rank||'—'} in category</div><h3>${label}: ${ordinal(pctScore)} percentile</h3><p><strong>What it means:</strong> ${categoryLogicSentence(f,key)||description}</p><div class="category-explainer-grid">${items.map(([k,v])=>`<div class="category-explainer-item"><strong>${k}</strong><small>${v}</small></div>`).join('')}</div></div>`;
    };
    categoryMeter=function(f,key){
      const info=CATEGORY_INFO.find(([k])=>k===key)||[key,key,''];
      const label=info[1];
      const {pctScore,rank,tier,width}=categoryTierContext(f,key);
      return `<div class="category-mini ${tier.cls}"><div class="category-mini-head"><b>${label}</b><span>${pctScore} PCTL · #${rank||'—'} · ${tier.label}</span></div><div class="bar"><i style="width:${width}%"></i></div></div>`;
    };
    categoryChip=function(f,key){
      const info=CATEGORY_INFO.find(([k])=>k===key)||[key,key,''];
      const label=info[1];
      const {pctScore,rank,tier}=categoryTierContext(f,key);
      return `<div class="category-chip ${tier.cls}"><b>${label}</b><span>${pctScore} PCTL · #${rank||'—'}</span><small>${tier.label}</small></div>`;
    };
    categoryChipGrid=function(f){
      return `<div class="category-chips">${categoryChip(f,'championship')}${categoryChip(f,'opponentQuality')}${categoryChip(f,'primeDominance')}${categoryChip(f,'longevity')}${categoryChip(f,'apexPeak')}${categoryChip(f,'penalty')}</div>`;
    };
    document.documentElement.setAttribute('data-category-percentile-tiers',VERSION);
    return true;
  }

  install();
})();
