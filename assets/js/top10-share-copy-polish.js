(function(){
  'use strict';

  const VERSION = 'share-and-blind-polish-20260713b';
  const SITE_URL = 'https://codyking0602.github.io/ufc-goat-rankings/';
  const DATA = window.RANKING_DATA || {};
  const OVERRIDES = window.DISPLAY_OVERRIDES || {};

  function compactDisagreement(value){
    const text = String(value || '').trim();
    const match = text.match(/^(.*?)(\s(?:[+-]\d+|even))$/i);
    if(!match) return text;
    const surname = match[1].trim().split(/\s+/).pop();
    return `${surname}${match[2]}`;
  }

  function polishedTop10ShareText(text){
    const lines = String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
    const agreement = lines.find(line => /model agreement/i.test(line)) || '';
    const disagreementLine = lines.find(line => /^biggest disagreement:/i.test(line)) || '';
    const disagreement = disagreementLine.replace(/^biggest disagreement:\s*/i,'');
    return [
      agreement,
      `Biggest disagreement: ${compactDisagreement(disagreement)}`,
      'Think your Top 10 is better?',
      SITE_URL
    ].filter(Boolean).join('\n');
  }

  function polishedBlindShareText(text){
    const lines = String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
    const score = lines.find(line => /^I scored\s+\d+\/5\s+in Blind Resume/i.test(line)) || 'I played the 5-matchup Blind Resume challenge.';
    const miss = lines.find(line => /^Biggest miss:/i.test(line)) || '';
    return [
      score,
      miss,
      'Can you beat my score?',
      SITE_URL
    ].filter(Boolean).join('\n\n');
  }

  const nativeFillText = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function(text,...args){
    const nextText = text === 'ACTIVE FIGHTERS' ? 'ALL-TIME PICKS' : text;
    return nativeFillText.call(this,nextText,...args);
  };

  const nativeShare = navigator.share;
  if(typeof nativeShare === 'function'){
    const polishedShare = function(data){
      if(data?.title === 'My UFC GOAT Top 10'){
        return nativeShare.call(this,{ ...data, text:polishedTop10ShareText(data.text) });
      }
      if(data?.title === 'My Blind Resume Score'){
        return nativeShare.call(this,{ ...data, text:polishedBlindShareText(data.text) });
      }
      return nativeShare.call(this,data);
    };
    try {
      Object.defineProperty(navigator,'share',{configurable:true,value:polishedShare});
    } catch(_error){
      try { Object.getPrototypeOf(navigator).share = polishedShare; } catch(_ignored){}
    }
  }

  function key(value){ return String(value || '').trim().toLowerCase(); }
  function numberFrom(object,names){
    if(!object) return null;
    for(const name of names){
      const value = Number(object[name]);
      if(Number.isFinite(value)) return value;
    }
    return null;
  }
  function formatCount(value){
    if(value === null || !Number.isFinite(Number(value))) return '';
    const number = Number(value);
    return Number.isInteger(number) ? String(number) : number.toFixed(1).replace(/\.0$/,'');
  }
  function allRows(name){
    const target = key(name);
    return [...(DATA.men || []), ...(DATA.women || []), ...(DATA.fighters || [])]
      .filter(row => key(row?.fighter) === target);
  }
  function reportRow(source,name){
    const target = key(name);
    const report = Array.isArray(source?.report) ? source.report : [];
    return report.find(row => key(row?.fighter) === target) || null;
  }
  function topFiveWinsFor(name){
    const override = OVERRIDES[name] || {};
    const compare = window.COMPARE_PROFILES?.[name]?.legacyStats || {};
    const liveAudit = reportRow(window.UFC_OPPONENT_QUALITY_LIVE,name);
    const shadowAudit = reportRow(window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT,name);
    const auditSummary = typeof window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT?.summaryFor === 'function'
      ? window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT.summaryFor(name)
      : null;
    const sources = [
      liveAudit,
      shadowAudit,
      auditSummary,
      ...allRows(name),
      override.snapshotStats,
      override.packetProfileStats,
      compare
    ];
    for(const source of sources){
      const value = numberFrom(source,['topFivePlusWins','topFiveWins','top5Wins']);
      if(value !== null) return formatCount(value);
    }
    return '';
  }

  function currentPairNames(){
    const pair = window.UFC_BLIND_MATCHMAKING?.state?.pair;
    if(!Array.isArray(pair) || pair.length !== 2) return [];
    return pair.map(fighter => fighter?.fighter).filter(Boolean);
  }

  function repairTopFiveRow(){
    const row = [...document.querySelectorAll('#blindMatchup .blind-compare-row')]
      .find(node => /^top-5 wins$/i.test(node.querySelector('span')?.textContent?.trim() || ''));
    const names = currentPairNames();
    if(!row || names.length !== 2) return;
    const values = names.map(topFiveWinsFor);
    const cells = row.querySelectorAll('strong');
    if(cells[0] && values[0]) cells[0].textContent = values[0];
    if(cells[1] && values[1]) cells[1].textContent = values[1];
  }

  function ensureFiveMatchupBanner(){
    const stage = document.querySelector('#playBlindPanel .blind-stage');
    const matchup = document.getElementById('blindMatchup');
    if(!stage || !matchup) return;
    let banner = document.getElementById('blindFiveMatchupBanner');
    if(!banner){
      banner = document.createElement('div');
      banner.id = 'blindFiveMatchupBanner';
      banner.className = 'blind-five-matchup-banner';
      banner.innerHTML = '<div><strong>5-MATCHUP CHALLENGE</strong><span>Pick the higher UFC resume five times. Your final score comes after Matchup 5.</span></div><div class="blind-five-progress"><i></i></div>';
      stage.insertBefore(banner,matchup);
    }
    const roundText = document.getElementById('blindRound')?.textContent || '';
    const match = roundText.match(/(?:ROUND|MATCHUP)\s+(\d+)/i);
    const current = Math.max(1,Math.min(5,Number(match?.[1]) || 1));
    const strong = banner.querySelector('strong');
    const fill = banner.querySelector('i');
    if(strong) strong.textContent = `5-MATCHUP CHALLENGE · ${current} OF 5`;
    if(fill) fill.style.width = `${current * 20}%`;
  }

  function polishApexCopy(){
    document.querySelectorAll('#blindMatchup .blind-apex-note').forEach(note => {
      note.textContent = 'APEX RATING = BEST TWO UFC PERFORMANCES WITHIN A TWO-YEAR WINDOW.';
    });
    const summary = document.getElementById('categoryLeaderSummary');
    const activeApex = document.querySelector('[data-category-leader="apexPeak"].active');
    if(summary && activeApex){
      const strong = summary.querySelector('strong')?.outerHTML || '<strong>Apex Peak</strong>';
      const countMatch = summary.textContent.match(/Showing\s+\d+\s+fighters\.?/i);
      summary.innerHTML = `${strong}<br>Best two UFC performances within a two-year window — who looked most unbeatable at their absolute best. ${countMatch?.[0] || ''}`;
    }
  }

  function injectStyles(){
    if(document.getElementById('blind-resume-polish-css')) return;
    const style = document.createElement('style');
    style.id = 'blind-resume-polish-css';
    style.textContent = `
      #play .blind-five-matchup-banner{margin-top:13px;border:1px solid rgba(250,204,21,.52);border-radius:15px;background:linear-gradient(135deg,rgba(250,204,21,.11),rgba(249,115,22,.08));padding:11px 12px;color:#f8fafc}
      #play .blind-five-matchup-banner strong,#play .blind-five-matchup-banner span{display:block}
      #play .blind-five-matchup-banner strong{color:#facc15;font-size:12px;font-weight:950;letter-spacing:.08em}
      #play .blind-five-matchup-banner span{margin-top:4px;color:#cbd5e1;font-size:11px;line-height:1.35}
      #play .blind-five-progress{height:6px;margin-top:9px;border:1px solid #334155;border-radius:999px;background:#0b0f17;overflow:hidden}
      #play .blind-five-progress i{display:block;height:100%;width:20%;border-radius:999px;background:linear-gradient(90deg,#f97316,#facc15);transition:width .2s ease}
      #play .blind-five-matchup-banner + .blind-matchup{margin-top:10px}
      @media(max-width:620px){#play .blind-five-matchup-banner strong{font-size:11px}#play .blind-five-matchup-banner span{font-size:10px}}
    `;
    document.head.appendChild(style);
  }

  function applyBlindPolish(){
    injectStyles();
    ensureFiveMatchupBanner();
    repairTopFiveRow();
    polishApexCopy();
    document.documentElement.setAttribute('data-blind-resume-polish',VERSION);
  }

  const observer = new MutationObserver(() => window.requestAnimationFrame(applyBlindPolish));
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  window.addEventListener('ufc-opponent-quality-ready',applyBlindPolish);
  window.addEventListener('ufc-scoring-pipeline-ready',applyBlindPolish);
  document.addEventListener('click',event => {
    if(event.target.closest?.('[data-category-leader="apexPeak"],[data-play-mode="blind"]')){
      window.setTimeout(applyBlindPolish,0);
    }
  });
  window.setTimeout(applyBlindPolish,0);
  window.setTimeout(applyBlindPolish,1200);
})();