#!/usr/bin/env node
/*
 * Required Octagon Verdict knowledge builder.
 *
 * The older knowledge-pack generator was written with a fixed roster count.
 * This wrapper makes it roster-dynamic, updates the pack's workflow language,
 * and writes only octagon-verdict-knowledge.md. JSON exports are optional.
 */
const fs=require('fs');
const path=require('path');
const {spawnSync}=require('child_process');

const root=path.resolve(__dirname,'..');
const sourcePath=path.join(__dirname,'build-octagon-verdict-knowledge.js');
const tempPath=path.join(__dirname,'.build-octagon-verdict-markdown.tmp.js');
const tempValidationPath=path.join(root,'.octagon-verdict-markdown-validation.tmp.json');
const outputPath=path.join(root,'octagon-verdict-knowledge.md');

function replaceRequired(source,pattern,replacement,label){
  if(!pattern.test(source))throw new Error(`Could not update ${label}; source builder changed unexpectedly.`);
  return source.replace(pattern,replacement);
}

let source=fs.readFileSync(sourcePath,'utf8');

source=replaceRequired(
  source,
  /const validationPath=path\.join\(root,'assets\/data\/octagon-verdict\/knowledge-validation\.json'\);/,
  "const validationPath=path.join(root,'.octagon-verdict-markdown-validation.tmp.json');",
  'temporary validation path'
);
source=replaceRequired(
  source,
  /const expectedFighterCount=76;/,
  'const expectedFighterCount=null;',
  'fixed fighter count'
);
source=replaceRequired(
  source,
  /'Alexandre Pantoja','Cain Velasquez','Francis Ngannou'\s*\n\];/,
  "'Alexandre Pantoja','Cain Velasquez','Francis Ngannou','Brandon Moreno'\n];",
  'Brandon Moreno validation coverage'
);
source=replaceRequired(
  source,
  /return ready&&projection\?\.rows\?\.length===76&&roster\?\.count\?\.\(\)===76&&woodley\?\.passed===true;/,
  'return ready&&projection?.rows?.length>0&&projection?.rows?.length===roster?.count?.()&&woodley?.passed===true;',
  'dynamic runtime readiness rule'
);
source=replaceRequired(
  source,
  /assert\.equal\(runtime\.fighters\.length,expectedFighterCount,'Knowledge fighter count mismatch\.'\);\s*assert\.equal\(Number\(runtime\.fighterCount\),expectedFighterCount,'Pipeline fighter count mismatch\.'\);/,
  "assert.ok(runtime.fighters.length>0,'Knowledge fighter list is empty.');\n  assert.equal(Number(runtime.fighterCount),runtime.fighters.length,'Pipeline fighter count mismatch.');",
  'dynamic fighter-count validation'
);
source=replaceRequired(
  source,
  /lines\.push\('7\. `tools\/build-octagon-verdict-data\.js` publishes machine-readable JSON\. This companion builder publishes the human-readable audit pack\.',''\);/,
  "lines.push('7. `octagon-verdict-knowledge.md` is the required Octagon Verdict knowledge artifact. Machine-readable JSON is optional and does not block fighter additions.','');",
  'Markdown authority rule'
);
source=replaceRequired(
  source,
  /lines\.push\('## 15\. Update workflow',''\);\s*lines\.push\('1\. Update canonical fighter facts and approved judgments\.'\);\s*lines\.push\('2\. The `Build Octagon Verdict Data` action loads the full app in Chromium\.'\);\s*lines\.push\('3\. It rebuilds the split JSON feed, this Markdown pack and the validation report\.'\);\s*lines\.push\('4\. The action commits generated artifacts to `main` only after validation passes\.'\);\s*lines\.push\('5\. Upload the new Markdown file to the Octagon Verdict Custom GPT and run the regression questions above\.',''\);/,
  "lines.push('## 15. Update workflow','');\n  lines.push('1. Update canonical fighter facts and approved judgments.');\n  lines.push('2. The `Build Octagon Verdict Markdown` action loads the full app in Chromium.');\n  lines.push('3. It rebuilds and validates `octagon-verdict-knowledge.md` from the live calculated runtime.');\n  lines.push('4. The action commits the refreshed Markdown file to `main` only after validation passes.');\n  lines.push('5. Upload the refreshed Markdown file to the Octagon Verdict Custom GPT and run the regression questions above.');\n  lines.push('6. JSON exports are optional, run only when explicitly requested, and never block a fighter addition.','');",
  'Markdown-only update workflow'
);

try{
  fs.writeFileSync(tempPath,source,'utf8');
  const result=spawnSync(process.execPath,[tempPath],{
    cwd:root,
    env:process.env,
    encoding:'utf8',
    stdio:['ignore','pipe','pipe']
  });
  if(result.stdout)process.stdout.write(result.stdout);
  if(result.stderr)process.stderr.write(result.stderr);
  if(result.status!==0)process.exit(result.status||1);

  const markdown=fs.readFileSync(outputPath,'utf8');
  const count=Number(markdown.match(/Fighters: \*\*(\d+)\*\*/)?.[1]||0);
  if(count<=0)throw new Error('Generated Markdown is missing its fighter count.');
  if(!/### \d+\. Brandon Moreno — \d+ OVR/.test(markdown))throw new Error('Generated Markdown is missing Brandon Moreno’s fighter card.');
  if(!markdown.includes('Machine-readable JSON is optional and does not block fighter additions.'))throw new Error('Generated Markdown is missing the Markdown-authority rule.');
  if(!markdown.includes('JSON exports are optional, run only when explicitly requested, and never block a fighter addition.'))throw new Error('Generated Markdown is missing the optional-JSON workflow rule.');

  console.log(`Built required Octagon Verdict Markdown pack for ${count} fighters.`);
}finally{
  fs.rmSync(tempPath,{force:true});
  fs.rmSync(tempValidationPath,{force:true});
}
