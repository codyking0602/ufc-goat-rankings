from pathlib import Path
import re
import sys

path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('index.html')
s = path.read_text()

# Public-facing language cleanup.
s = s.replace('In plain English:', 'What it means:')
s = s.replace('Plain-English read', 'What to know')
s = s.replace('plain-English read', 'what to know')
s = s.replace('Plain-English', 'Plain English')
s = s.replace('résumé', 'resume')
s = s.replace('résumés', 'resumes')
s = s.replace('Resume impact from losses', 'How losses affect it')
s = s.replace('Win-depth score', 'Win depth')
s = s.replace('Adjusted title credit', 'Adjusted title wins')
s = s.replace('title-win value', 'weighted wins')

# Replace category detail helpers with more fighter-specific, public-facing copy.
helpers_and_evidence = r'''function knownEliteWindow(f){
  const windows = {
    "Jon Jones": "Ryan Bader 2011 → Ciryl Gane 2023",
    "Georges St-Pierre": "Matt Hughes II 2006 → Michael Bisping 2017",
    "Demetrious Johnson": "Joseph Benavidez 2012 → Henry Cejudo II 2018",
    "Anderson Silva": "Chris Leben 2006 → Chris Weidman II 2013",
    "Khabib Nurmagomedov": "Rafael dos Anjos 2014 → Justin Gaethje 2020",
    "Islam Makhachev": "Drew Dober 2021 → active",
    "Alexander Volkanovski": "Jose Aldo 2019 → active",
    "Jose Aldo": "Frankie Edgar II 2016 → Merab Dvalishvili 2022"
  };
  if(windows[f.fighter]) return windows[f.fighter];
  if(f.primeStart || f.primeEnd) return `${f.primeStart || 'elite start TBD'} → ${f.primeEnd || 'active/elite end TBD'}`;
  return null;
}
function primeRecordText(f){
  return f.primeRecord || f.primeUfcRecord || f.prime_record || null;
}
function roundControlText(f){
  const candidates = [f.roundsWonPct, f.roundsWonPercentage, f.roundWinPct, f.roundsWonPercent];
  const val = candidates.find(x => x !== undefined && x !== null && Number.isFinite(Number(x)));
  if(val !== undefined) return pct(Number(val));
  const rounds = f.rounds || [];
  if(rounds.length) return `${rounds.length} tracked UFC fights`;
  return null;
}
function divisionContextText(f){
  const d = String(f.division || f.weightClass || '').toLowerCase();
  if(d.includes('lightweight')) return 'Lightweight is treated as one of the toughest UFC divisions.';
  if(d.includes('welterweight')) return 'Welterweight depth gives strong wins extra value.';
  if(d.includes('featherweight')) return 'Modern featherweight depth gives strong wins extra value.';
  if(d.includes('middleweight')) return 'Middleweight gets some era/division-strength context.';
  if(d.includes('flyweight')) return 'Flyweight dominance is respected, but division depth is discounted slightly.';
  if(d.includes('bantamweight')) return 'Bantamweight is treated as a deep modern division.';
  return 'Division strength is part of how opponent wins are valued.';
}
function lossImpactText(f){
  const penalty = lossPenaltyValue(f);
  if(penalty === 0) return 'No meaningful damage to the UFC-only resume.';
  if(penalty <= -3) return 'Meaningful damage because at least one counted loss came in a worse context.';
  return 'Small damage because the loss has timing, opponent, or division context.';
}
function categoryEvidenceItems(f, key){
  const title = f.title || {};
  const opps = f.opponents || [];
  const rounds = f.rounds || [];
  const penalty = lossPenaltyValue(f);
  const items = [];
  if(key === 'championship'){
    const tfw = titleFightWinsFromNotes(title);
    if(tfw) items.push(['UFC title-fight wins', tfw]);
    if(title.adjustedTitleWins) items.push(['Adjusted title wins', `${Number(title.adjustedTitleWins).toFixed(1)} weighted wins`]);
    items.push(['Title resume type', titleMix(title)]);
    items.push(['Why it ranks here', 'This category favors fighters who repeatedly won at UFC championship level.']);
  } else if(key === 'opponentQuality'){
    items.push(['Key UFC wins', compactOpponentNames(opps, 5)]);
    items.push(['Best win context', compactOpponentContext(opps, 3)]);
    items.push(['Division context', divisionContextText(f)]);
    items.push(['Why it ranks here', 'Name value alone is not enough; timing, ranking, and division strength matter.']);
  } else if(key === 'primeDominance'){
    const window = knownEliteWindow(f);
    if(window) items.push(['Peak window', window]);
    const pr = primeRecordText(f);
    if(pr) items.push(['Prime UFC record', pr]);
    items.push(['Finish rate', pct(f.finishRatePct)]);
    const rc = roundControlText(f);
    if(rc) items.push(['Round control', rc]);
    items.push(['Finished at peak', `${f.timesFinishedPrime ?? 0} time${Number(f.timesFinishedPrime||0) === 1 ? '' : 's'}`]);
  } else if(key === 'longevity'){
    const window = knownEliteWindow(f);
    if(window) items.push(['Elite UFC window', window]);
    items.push(['Active elite years', fmt(f.activeEliteYears)]);
    items.push(['How gaps are handled', 'Long inactive stretches are limited, so time away does not inflate the score.']);
    items.push(['Why it ranks here', 'This rewards repeatedly proving elite status in UFC fights.']);
  } else if(key === 'penalty'){
    items.push(['UFC record context', ufcRecordLine(f)]);
    items.push(['How losses affect it', lossImpactText(f)]);
    items.push(['Finished at peak', `${f.timesFinishedPrime ?? 0} time${Number(f.timesFinishedPrime||0) === 1 ? '' : 's'}`]);
    items.push(['Important context', f.notes || 'Losses are weighed by timing, opponent quality, and whether the fighter was finished.']);
  }
  return items.filter(([,v]) => v !== null && v !== undefined && String(v).trim() !== '' && String(v).trim() !== '— to —');
}
'''

logic = r'''function categoryLogicSentence(f, key){
  const title = f.title || {};
  const opps = f.opponents || [];
  const rank = categoryRank(f, key);
  const penalty = lossPenaltyValue(f);
  if(key === 'championship'){
    const adj = title.adjustedTitleWins ? Number(title.adjustedTitleWins).toFixed(1) : null;
    const tfw = titleFightWinsFromNotes(title);
    if(rank <= 3) return `${f.fighter} is this high because his UFC title resume has rare volume and staying power${tfw ? `: ${tfw} UFC title-fight wins` : ''}${adj ? ` and ${adj} adjusted title-win credit` : ''}.`;
    return `${f.fighter} scores well here, but this category rewards longer UFC title reigns and repeated title-fight wins.`;
  }
  if(key === 'opponentQuality'){
    return `${f.fighter}'s quality-wins rank is built around ${compactOpponentNames(opps, 5)}. The score asks how strong those wins were at the time, not just how famous the names are now.`;
  }
  if(key === 'primeDominance'){
    const window = knownEliteWindow(f);
    const record = primeRecordText(f);
    const parts = [];
    if(window) parts.push(`elite window: ${window}`);
    if(record) parts.push(`prime record: ${record}`);
    parts.push(`${pct(f.finishRatePct)} finish rate`);
    parts.push(`${f.timesFinishedPrime ?? 0} finish losses at peak`);
    const rc = roundControlText(f);
    if(rc) parts.push(`round control: ${rc}`);
    return `${f.fighter}'s dominance rank comes from ${parts.join(', ')}. This is about how little opponents could do to him when he was at his best.`;
  }
  if(key === 'longevity'){
    const window = knownEliteWindow(f);
    return `${f.fighter}'s longevity rank is based on ${fmt(f.activeEliteYears)} active elite UFC years${window ? `, roughly from ${window}` : ''}. It rewards proven elite UFC fights, not simply being on the roster for a long time.`;
  }
  if(key === 'penalty'){
    if(penalty === 0) return `${f.fighter}'s loss context is extremely clean in this UFC-only model. Official weirdness can still appear in the record, but it is not treated the same as a real competitive loss.`;
    return `${f.fighter}'s loss context is still strong, but not spotless. The score looks at when the loss happened, who it was against, and whether he was finished.`;
  }
  return '';
}
'''

s = re.sub(
    r'function knownEliteWindow\(f\)[\s\S]*?function categoryLogicSentence\(f, key\)\{',
    helpers_and_evidence + '\nfunction categoryLogicSentence(f, key){',
    s
)
# If prior helper block was not present, replace from categoryEvidenceItems to categoryLogicSentence.
s = re.sub(
    r'function categoryEvidenceItems\(f, key\)[\s\S]*?function categoryLogicSentence\(f, key\)\{',
    helpers_and_evidence + '\nfunction categoryLogicSentence(f, key){',
    s
)
s = re.sub(
    r'function categoryLogicSentence\(f, key\)\{[\s\S]*?\n\}\nfunction whyNotHigher',
    logic + '\nfunction whyNotHigher',
    s
)

# Remove category-level “Why not higher?” blocks. The full fighter profile already has this.
s = re.sub(
    r'\n\s*<div class="category-why"><strong>Why not higher\?</strong> \$\{whyNotHigher\(f, key\)\}</div>',
    '',
    s
)

# Remove leftover CSS for removed block if present.
s = re.sub(r'\n\.category-why \{[^}]+\}', '', s)
s = re.sub(r'\n\.category-why strong \{[^}]+\}', '', s)

path.write_text(s)
