import fs from 'node:fs/promises';
import path from 'node:path';

const [baselinePath='docs/runtime-scoring-snapshot.json',candidatePath='docs/runtime-scoring-snapshot.json']=process.argv.slice(2);
const reportPath='docs/runtime-scoring-snapshot-parity-report.json';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const pick=(source,keys)=>Object.fromEntries(keys.map(key=>[key,source?.[key]??null]));

function stableSnapshot(snapshot){
  const source=snapshot?.source||{};
  return {
    schemaVersion:snapshot?.schemaVersion??null,
    captureMode:snapshot?.captureMode??null,
    source:{
      appBuild:source.appBuild??null,
      moduleVersions:source.moduleVersions??null,
      scoringPipeline:pick(source.scoringPipeline,[
        'version','mode','status','sequence','timerCount','repeatedLoadCount',
        'finalScoreApplyCount','scoreAuthority','scoreApplicationDeferred','error','fighterCount'
      ]),
      scoringOwnershipContract:pick(source.scoringOwnershipContract,[
        'version','applied','status','settled','mode','rosterCount','expectedRosterCount','owners',
        'canonicalScoringRecordsVersion','canonicalSourceSha','finalScoreEngineVersion',
        'finalScoreEngineApplyCount','engineParity','profileMismatchCount','profileMismatches',
        'displayOverrideViolationCount','displayOverrideViolations','compareScoreViolationCount',
        'compareScoreViolations','missingLossContextDetailCount','missingLossContextDetail',
        'missingEraDepthDetailCount','missingEraDepthDetail','wrongOwnerCount','wrongOwners',
        'removedLegacyScoreLayers'
      ]),
      finalScoreEngine:pick(source.finalScoreEngine,['version','applyCount']),
      lossContextHybridLive:pick(source.lossContextHybridLive,['version','applied','rosterCount','mismatchCount','rules']),
      divisionEraDepthLive:pick(source.divisionEraDepthLive,['version','applied','rosterCount','mismatchCount'])
    },
    summary:snapshot?.summary??null,
    invariants:snapshot?.invariants??null,
    fighters:snapshot?.fighters??null,
    captureDiagnostics:snapshot?.captureDiagnostics??null,
    fighterDataSha256:snapshot?.fighterDataSha256??null
  };
}

function stableDifferences(left,right,limit=250){
  const differences=[];
  const walk=(a,b,currentPath)=>{
    if(differences.length>=limit)return;
    if(Object.is(a,b))return;
    const aArray=Array.isArray(a);
    const bArray=Array.isArray(b);
    if(aArray||bArray){
      if(!aArray||!bArray){differences.push({path:currentPath,baseline:a,candidate:b});return;}
      const length=Math.max(a.length,b.length);
      for(let index=0;index<length&&differences.length<limit;index++)walk(a[index],b[index],`${currentPath}[${index}]`);
      return;
    }
    const aObject=a!==null&&typeof a==='object';
    const bObject=b!==null&&typeof b==='object';
    if(aObject||bObject){
      if(!aObject||!bObject){differences.push({path:currentPath,baseline:a,candidate:b});return;}
      const keys=[...new Set([...Object.keys(a),...Object.keys(b)])].sort();
      for(const key of keys){
        if(differences.length>=limit)break;
        walk(a[key],b[key],currentPath?`${currentPath}.${key}`:key);
      }
      return;
    }
    differences.push({path:currentPath,baseline:a??null,candidate:b??null});
  };
  walk(left,right,'');
  return differences;
}

const baseline=await read(baselinePath);
const candidate=await read(candidatePath);
const stableBaseline=stableSnapshot(baseline);
const stableCandidate=stableSnapshot(candidate);
const baselineJson=JSON.stringify(stableBaseline);
const candidateJson=JSON.stringify(stableCandidate);
const differences=stableDifferences(stableBaseline,stableCandidate);
const passed=baselineJson===candidateJson
  &&candidate?.summary?.status==='clean'
  &&candidate?.summary?.rosterCount===72
  &&candidate?.fighterDataSha256===baseline?.fighterDataSha256;

const report={
  generatedAt:new Date().toISOString(),
  baselinePath,
  candidatePath,
  passed,
  baselineCapturedAt:baseline?.capturedAt??null,
  candidateCapturedAt:candidate?.capturedAt??null,
  baselineFighterDataSha256:baseline?.fighterDataSha256??null,
  candidateFighterDataSha256:candidate?.fighterDataSha256??null,
  baselineStatus:baseline?.summary?.status??null,
  candidateStatus:candidate?.summary?.status??null,
  baselineRosterCount:baseline?.summary?.rosterCount??null,
  candidateRosterCount:candidate?.summary?.rosterCount??null,
  stableContentEqual:baselineJson===candidateJson,
  differenceCount:differences.length,
  differences,
  differenceReportTruncated:differences.length>=250
};
await fs.mkdir(path.dirname(reportPath),{recursive:true});
await fs.writeFile(reportPath,`${JSON.stringify(report,null,2)}\n`,'utf8');
console.log('RUNTIME_SCORING_SNAPSHOT_PARITY');
console.log(JSON.stringify(report,null,2));
if(!passed)process.exitCode=1;
