(function(){
  'use strict';

  const play = document.getElementById('play');
  if(!play) return;

  function escapeHtml(value){
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[char]));
  }

  function divisionOnly(text){
    const parts = String(text || '').split('·').map(part => part.trim()).filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 1] : String(text || '').replace(/^(Official|Model rank)\s*#\d+\s*/i, '').trim();
  }

  function lossContextLabel(value){
    const text = String(value ?? '').trim();
    if(!text || text === '—') return '—';
    if(!/^[-+]?\d+(\.\d+)?$/.test(text)) return text;
    const penalty = Number(text);
    if(!Number.isFinite(penalty) || penalty >= 0) return 'Clean';
    if(penalty > -3) return 'Light damage';
    if(penalty > -7) return 'Moderate damage';
    return 'Heavy damage';
  }

  function hideBuilderModelRanks(){
    play.querySelectorAll('.play-rank-copy small').forEach(node => {
      const cleaned = divisionOnly(node.textContent);
      if(cleaned) node.textContent = cleaned;
    });
    play.querySelectorAll('.play-search-result span small').forEach(node => {
      const cleaned = divisionOnly(node.textContent);
      if(cleaned) node.textContent = cleaned;
    });
  }

  function extractBlindCard(card){
    const label = card.querySelector('.blind-label')?.textContent?.trim() || '';
    const stats = {};
    card.querySelectorAll('.blind-stat-list > div').forEach(row => {
      const key = row.querySelector('span')?.textContent?.trim() || '';
      const value = row.querySelector('strong')?.textContent?.trim() || '—';
      if(key) stats[key.toLowerCase()] = value;
    });
    return { label, stats };
  }

  function statValue(card, aliases){
    for(const alias of aliases){
      const value = card.stats[alias.toLowerCase()];
      if(value !== undefined) return value;
    }
    return '—';
  }

  function polishBlindMatchup(){
    const target = document.getElementById('blindMatchup');
    if(!target || target.dataset.playPolished === 'true') return;
    const cards = [...target.querySelectorAll('.blind-fighter-card')];
    if(cards.length !== 2) return;

    const a = extractBlindCard(cards[0]);
    const b = extractBlindCard(cards[1]);
    const rows = [
      ['Adjusted title wins', ['adjusted title wins']],
      ['Elite wins', ['elite win ledger', 'elite wins']],
      ['Prime UFC record', ['prime ufc record']],
      ['Rounds won', ['rounds won']],
      ['Finish rate', ['finish rate']],
      ['Active elite years', ['active elite years']],
      ['Loss context', ['loss context']]
    ].map(([label, aliases]) => {
      let aValue = statValue(a, aliases);
      let bValue = statValue(b, aliases);
      if(label === 'Loss context'){
        aValue = lossContextLabel(aValue);
        bValue = lossContextLabel(bValue);
      }
      return { label, aValue, bValue };
    });

    target.dataset.playPolished = 'true';
    target.innerHTML = `
      <div class="blind-compare-card">
        <div class="blind-compare-head">
          <div class="blind-compare-fighter"><span>FIGHTER A</span><div class="blind-compare-avatar">?</div></div>
          <div class="blind-compare-vs">VS</div>
          <div class="blind-compare-fighter"><span>FIGHTER B</span><div class="blind-compare-avatar">?</div></div>
        </div>
        <div class="blind-compare-table">
          ${rows.map(row => `<div class="blind-compare-row"><strong>${escapeHtml(row.aValue)}</strong><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.bValue)}</strong></div>`).join('')}
        </div>
        <div class="blind-compare-actions">
          <button type="button" data-blind-choice="A">PICK A</button>
          <button type="button" data-blind-choice="B">PICK B</button>
        </div>
      </div>`;
  }

  function applyPolish(){
    hideBuilderModelRanks();
    polishBlindMatchup();
  }

  const observer = new MutationObserver(applyPolish);
  observer.observe(play, { childList:true, subtree:true });
  applyPolish();
})();
