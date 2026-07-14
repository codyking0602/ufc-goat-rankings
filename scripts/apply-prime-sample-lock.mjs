import fs from 'node:fs/promises';

const modelPath='assets/data/canonical-prime-dominance-reconstruction.js';
let model=await fs.readFile(modelPath,'utf8');

function replaceOnce(source,oldText,newText,label){
  const count=source.split(oldText).length-1;
  if(count!==1)throw new Error(`${label}: expected one match, found ${count}`);
  return source.replace(oldText,newText);
}

model=replaceOnce(
  model,
  "const VERSION='canonical-prime-dominance-reconstruction-20260714b-era-ledger-elite-validation';",
  "const VERSION='canonical-prime-dominance-reconstruction-20260714c-full-score-sample-lock';",
  'version'
);

model=replaceOnce(
  model,
  "  const ELITE_VOLUME_FULL_SAMPLE=8;\n  const ELITE_QUALITY_TIERS=new Set(['champion-level','top-five']);",
  "  const ELITE_VOLUME_FULL_SAMPLE=8;\n  const PRIME_SAMPLE_MIN=.70;\n  const PRIME_SAMPLE_STEP=.05;\n  const PRIME_SAMPLE_FULL_FIGHTS=7;\n  const ELITE_QUALITY_TIERS=new Set(['champion-level','top-five']);",
  'sample constants'
);

model=replaceOnce(
  model,
  "  function finishPressureScore(rate){\n    const normalized=clamp(rate,0,1);\n    return round2((FINISH_SCALE.find(row=>normalized>=row.min)||FINISH_SCALE.at(-1)).score);\n  }",
  "  function finishPressureScore(rate){\n    const normalized=clamp(rate,0,1);\n    return round2((FINISH_SCALE.find(row=>normalized>=row.min)||FINISH_SCALE.at(-1)).score);\n  }\n\n  function primeSampleMultiplier(scoredFightCount){\n    const fights=Math.max(0,Number(scoredFightCount||0));\n    if(!fights)return 0;\n    return round2(clamp(PRIME_SAMPLE_MIN+((fights-1)*PRIME_SAMPLE_STEP),PRIME_SAMPLE_MIN,1));\n  }",
  'sample function'
);

model=replaceOnce(
  model,
  "    const score=round2(clamp(Object.values(components).reduce((sum,value)=>sum+Number(value||0),0),0,CATEGORY_MAX));",
  "    const rawScore=round2(clamp(Object.values(components).reduce((sum,value)=>sum+Number(value||0),0),0,CATEGORY_MAX));\n    const sampleMultiplier=primeSampleMultiplier(scoredFightCount);\n    const score=round2(clamp(rawScore*sampleMultiplier,0,CATEGORY_MAX));",
  'score calculation'
);

model=replaceOnce(
  model,
  "      components,\n      rawScore:score,\n      score,",
  "      components,\n      rawScore,\n      sampleMultiplier,\n      samplePercent:round2(sampleMultiplier*100),\n      score,",
  'score return fields'
);

model=replaceOnce(
  model,
  "          reason:`The approved 9/9/5/7 Prime Dominance formula calculates ${stats.score.toFixed(2)}/30 versus the frozen ${currentScore.toFixed(2)}/30 control (${difference>0?'+':''}${difference.toFixed(2)}). Elite-Level Validation rewards objective elite-stage exposure and performance, including meaningful credit in losses.`",
  "          reason:`The approved 9/9/5/7 Prime Dominance formula produces a ${stats.rawScore.toFixed(2)}/30 raw score, then applies the locked ${stats.samplePercent.toFixed(0)}% prime-sample multiplier for ${stats.scoredFightCount} counted prime fights, resulting in ${stats.score.toFixed(2)}/30 versus the frozen ${currentScore.toFixed(2)}/30 control (${difference>0?'+':''}${difference.toFixed(2)}).`",
  'issue explanation'
);

model=replaceOnce(
  model,
  "        classification:'Cody-approved model formula; shadow only',",
  "        classification:'Cody-approved model formula and sample lock; shadow only',",
  'classification'
);

model=replaceOnce(
  model,
  "      status:'shadow-reconstruction-cody-approved-formula-not-live',",
  "      status:'shadow-reconstruction-cody-approved-formula-and-sample-lock-not-live',",
  'report status'
);

model=replaceOnce(
  model,
  "      eliteValidationMaxima:ELITE_VALIDATION_MAX,\n      categoryMax:CATEGORY_MAX,\n      formula:'Prime Record (9) + Round Control (9) + Finish Pressure (5) + Elite-Level Validation (7)',",
  "      eliteValidationMaxima:ELITE_VALIDATION_MAX,\n      primeSampleRule:{minimum:PRIME_SAMPLE_MIN,stepPerFight:PRIME_SAMPLE_STEP,fullAtFights:PRIME_SAMPLE_FULL_FIGHTS},\n      sampleDiscountedFighterCount:fighters.filter(row=>row.stats.sampleMultiplier<1).length,\n      categoryMax:CATEGORY_MAX,\n      formula:'[Prime Record (9) + Round Control (9) + Finish Pressure (5) + Elite-Level Validation (7)] × Prime Sample Percentage',",
  'report formula'
);

model=replaceOnce(
  model,
  "        eliteStagePerformance:'up to 4 points: elite result rate × 2, elite round-control rate × 1.5, elite finish rate × 0.5',\n        primeWindow:'Fighter Era Ledger start/end dates are the sole phase source. Fighter-local category windows are audit comparisons only.'",
  "        eliteStagePerformance:'up to 4 points: elite result rate × 2, elite round-control rate × 1.5, elite finish rate × 0.5',\n        primeSamplePercentage:'70% at one counted prime fight, plus 5 percentage points per additional counted prime fight, capped at 100% from seven fights onward; applied to the full 30-point raw score',\n        primeWindow:'Fighter Era Ledger start/end dates are the sole phase source. Fighter-local category windows are audit comparisons only.'",
  'methodology'
);

await fs.writeFile(modelPath,model,'utf8');

const testPath='scripts/test-canonical-prime-dominance-reconstruction.mjs';
let test=await fs.readFile(testPath,'utf8');
test=replaceOnce(
  test,
  "assert.equal(report.eliteValidationMaxima.performance,4);",
  "assert.equal(report.eliteValidationMaxima.performance,4);\nassert.deepEqual(JSON.parse(JSON.stringify(report.primeSampleRule)),{minimum:.70,stepPerFight:.05,fullAtFights:7});",
  'sample rule assertion'
);
test=replaceOnce(
  test,
  "assert.equal('sampleConfidence' in kayla.stats,false,'The approved formula no longer uses a global confidence multiplier');",
  "assert.equal('sampleConfidence' in kayla.stats,false,'The retired confidence formula must stay removed');\nassert.equal(kayla.stats.sampleMultiplier,.80,'Three counted prime fights receive 80% of the full score');\nassert.equal(frank.stats.sampleMultiplier,.90,'Five counted prime fights receive 90% of the full score');\nassert.equal(khabib.stats.sampleMultiplier,1,'Seven or more counted prime fights receive the full score');\nassert.equal(kayla.stats.score,Math.round(kayla.stats.rawScore*.80*100)/100,'The multiplier applies to the entire 30-point raw score');",
  'fighter sample assertions'
);
test=replaceOnce(
  test,
  "  '- Elite-Level Validation: 7 points',\n  '  - Elite-stage volume: 3 points; result-neutral, full credit at eight counted elite-stage prime fights',",
  "  '- Elite-Level Validation: 7 points',\n  '- Prime Sample Percentage: 70% at one counted prime fight, +5 percentage points per additional fight, full score at seven fights',\n  '  - Elite-stage volume: 3 points; result-neutral, full credit at eight counted elite-stage prime fights',",
  'markdown formula bullets'
);
test=replaceOnce(
  test,
  "  'The Fighter Era Ledger is the sole prime-window source for Prime Dominance. Category-local prime windows are retained only as drift checks and cannot override it.','',",
  "  'The complete 30-point raw score is multiplied by the locked prime-sample percentage. This is a uniform sample-size control, not a fighter-specific adjustment.','',\n  'The Fighter Era Ledger is the sole prime-window source for Prime Dominance. Category-local prime windows are retained only as drift checks and cannot override it.','',",
  'markdown explanation'
);
test=replaceOnce(
  test,
  "  '| Rank | Fighter | Prime Dominance | Prime record | Rounds | Finish | Elite validation | Elite fights |',\n  '|---:|---|---:|---:|---:|---:|---:|---:|',\n  ...leaders.map((row,index)=>`| ${index+1} | ${row.fighter} | ${row.reconstructedScore.toFixed(2)} | ${row.stats.components.primeRecord.toFixed(2)} | ${row.stats.components.roundControl.toFixed(2)} | ${row.stats.components.finishPressure.toFixed(2)} | ${row.stats.components.eliteLevelValidation.toFixed(2)} | ${row.stats.eliteLevelValidation.fightCount} |`),",
  "  '| Rank | Fighter | Adjusted | Raw / 30 | Sample | Prime record | Rounds | Finish | Elite validation | Elite fights |',\n  '|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|',\n  ...leaders.map((row,index)=>`| ${index+1} | ${row.fighter} | ${row.reconstructedScore.toFixed(2)} | ${row.stats.rawScore.toFixed(2)} | ${row.stats.samplePercent.toFixed(0)}% | ${row.stats.components.primeRecord.toFixed(2)} | ${row.stats.components.roundControl.toFixed(2)} | ${row.stats.components.finishPressure.toFixed(2)} | ${row.stats.components.eliteLevelValidation.toFixed(2)} | ${row.stats.eliteLevelValidation.fightCount} |`),",
  'leader table'
);
test=replaceOnce(
  test,
  "  leaders:leaders.slice(0,10).map(row=>({fighter:row.fighter,score:row.reconstructedScore,delta:row.difference,eliteFights:row.stats.eliteLevelValidation.fightCount})),",
  "  sampleDiscountedFighterCount:report.sampleDiscountedFighterCount,\n  leaders:leaders.slice(0,10).map(row=>({fighter:row.fighter,score:row.reconstructedScore,rawScore:row.stats.rawScore,samplePercent:row.stats.samplePercent,delta:row.difference,eliteFights:row.stats.eliteLevelValidation.fightCount})),",
  'console leaders'
);
await fs.writeFile(testPath,test,'utf8');

console.log('Locked full-score Prime Dominance sample percentage and updated audit assertions.');
