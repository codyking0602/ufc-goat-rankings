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

const baseline=await read(baselinePath);
const candidate=await read(candidatePath);
const stableBaseline=stableSnapshot(baseline);
const stableCandidate=stableSnapshot(candidate);
const baselineJson=JSON.stringify(stableBaseline);
const candidateJson=JSON.stringify(stableCandidate);
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
  stableContentEqual:baselineJson===candidateJson
};
await fs.mkdir(path.dirname(reportPath),{recursive:true});
await fs.writeFile(reportPath,`${JSON.stringify(report,null,2)}\n`,'utf8');
console.log('RUNTIME_SCORING_SNAPSHOT_PARITY');
console.log(JSON.stringify(report,null,2));
if(!passed)process.exitCode=1;
