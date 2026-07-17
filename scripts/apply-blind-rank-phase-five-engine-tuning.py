from pathlib import Path

engine_path = Path('assets/js/blind-rank.js')
engine = engine_path.read_text(encoding='utf-8')

engine = engine.replace(
    "const VERSION='blind-rank-20260717k-absolute-role-generator';",
    "const VERSION='blind-rank-20260717l-relax-before-emergency';"
)

old = """    function generateLineup(pack,history,prepared={}){
      const rows=prepared.rows||ratedPool(pack);if(rows.length<LINEUP_RULES.lineupSize)return {fighters:[],meta:{packId:pack.id,broken:true,reason:'pool-under-five',poolSize:rows.length}};
      const audit=prepared.audit||bucketedPool(pack,rows);const previousSignature=lineupSignature(history?.lastLineup);const roleTargets=prepared.roleTargets||rollRoleTargets();let selected=null;let usedWindow=0;let attempts=0;let blockedImmediateRepeat=false;let immediateRepeatUnavoidable=false;
      for(const windowSize of RELAX_WINDOWS){const excluded=new Set(windowSize?(history?.recent||[]).slice(-windowSize):[]);if(rows.length-excluded.size<LINEUP_RULES.lineupSize)continue;const attemptLimit=windowSize===0?80:30;for(let attempt=0;attempt<attemptLimit;attempt+=1){attempts+=1;const candidate=buildCandidate(rows,audit,excluded,roleTargets);if(!candidate)continue;const signature=lineupSignature(candidate.fighters);if(previousSignature&&signature===previousSignature){blockedImmediateRepeat=true;continue;}selected=candidate;usedWindow=windowSize;break;}if(selected)break;}
      if(!selected){const candidate=buildCandidate(rows,audit,new Set(),roleTargets);if(candidate){selected=candidate;usedWindow=0;if(previousSignature&&lineupSignature(candidate.fighters)===previousSignature){blockedImmediateRepeat=true;immediateRepeatUnavoidable=!breakImmediateRepeat(candidate,rows,history?.lastLineup);}}}
      if(!selected)return {fighters:[],meta:{packId:pack.id,broken:true,reason:'role-build-failed',poolSize:rows.length,roleTargets}};
      const fallbackCounts=selected.assignments.reduce((counts,assignment)=>{increment(counts,assignment.fallback);return counts;},{exact:0,adjacent:0,emergency:0,'repeat-break-adjacent':0,'repeat-break-emergency':0});
      return {fighters:selected.fighters,meta:{packId:pack.id,categoryId:pack.categoryId,ratingPaths:[...pack.ratingPaths],rankingSource:pack.rankingSource,generationMode:'absolute-category-tiers',poolSize:rows.length,counts:audit.counts,percentages:audit.percentages,roleTargets:selected.roleTargets,roleAssignments:selected.assignments,targets:selected.assignments.map(assignment=>assignment.targetTier),actual:selected.assignments.map(assignment=>assignment.actualTier),fighterBuckets:selected.fighters.map(fighter=>audit.bucketById[fighter.id]||'unknown'),badFighters:selected.badCount,fallbackCounts,repeatProtection:{configuredWindow:MAX_RECENT_REVEALS,usedWindow,relaxed:usedWindow<MAX_RECENT_REVEALS,recentCount:(history?.recent||[]).length,excludedCount:usedWindow?new Set((history?.recent||[]).slice(-usedWindow)).size:0,immediateRepeatBlocked:blockedImmediateRepeat,immediateRepeatUnavoidable,attempts}}};
    }
"""

new = """    function generateLineup(pack,history,prepared={}){
      const rows=prepared.rows||ratedPool(pack);if(rows.length<LINEUP_RULES.lineupSize)return {fighters:[],meta:{packId:pack.id,broken:true,reason:'pool-under-five',poolSize:rows.length}};
      const audit=prepared.audit||bucketedPool(pack,rows);const previousSignature=lineupSignature(history?.lastLineup);const roleTargets=prepared.roleTargets||rollRoleTargets();let selected=null;let usedWindow=0;let attempts=0;let blockedImmediateRepeat=false;let immediateRepeatUnavoidable=false;
      for(const windowSize of RELAX_WINDOWS){
        const excluded=new Set(windowSize?(history?.recent||[]).slice(-windowSize):[]);if(rows.length-excluded.size<LINEUP_RULES.lineupSize)continue;
        const attemptLimit=windowSize===0?100:40;let bestEmergencyCandidate=null;let bestEmergencyScore=Infinity;
        for(let attempt=0;attempt<attemptLimit;attempt+=1){
          attempts+=1;const candidate=buildCandidate(rows,audit,excluded,roleTargets);if(!candidate)continue;
          const signature=lineupSignature(candidate.fighters);if(previousSignature&&signature===previousSignature){blockedImmediateRepeat=true;continue;}
          const emergencyCount=candidate.assignments.filter(assignment=>assignment.fallback==='emergency').length;
          const adjacentCount=candidate.assignments.filter(assignment=>assignment.fallback==='adjacent').length;
          if(emergencyCount){const score=(emergencyCount*100)+adjacentCount;if(score<bestEmergencyScore){bestEmergencyCandidate=candidate;bestEmergencyScore=score;}continue;}
          selected=candidate;usedWindow=windowSize;break;
        }
        if(selected)break;
        if(windowSize===0&&bestEmergencyCandidate){selected=bestEmergencyCandidate;usedWindow=0;break;}
      }
      if(!selected){const candidate=buildCandidate(rows,audit,new Set(),roleTargets);if(candidate){selected=candidate;usedWindow=0;if(previousSignature&&lineupSignature(candidate.fighters)===previousSignature){blockedImmediateRepeat=true;immediateRepeatUnavoidable=!breakImmediateRepeat(candidate,rows,history?.lastLineup);}}}
      if(!selected)return {fighters:[],meta:{packId:pack.id,broken:true,reason:'role-build-failed',poolSize:rows.length,roleTargets}};
      const fallbackCounts=selected.assignments.reduce((counts,assignment)=>{increment(counts,assignment.fallback);return counts;},{exact:0,adjacent:0,emergency:0,'repeat-break-adjacent':0,'repeat-break-emergency':0});
      return {fighters:selected.fighters,meta:{packId:pack.id,categoryId:pack.categoryId,ratingPaths:[...pack.ratingPaths],rankingSource:pack.rankingSource,generationMode:'absolute-category-tiers',poolSize:rows.length,counts:audit.counts,percentages:audit.percentages,roleTargets:selected.roleTargets,roleAssignments:selected.assignments,targets:selected.assignments.map(assignment=>assignment.targetTier),actual:selected.assignments.map(assignment=>assignment.actualTier),fighterBuckets:selected.fighters.map(fighter=>audit.bucketById[fighter.id]||'unknown'),badFighters:selected.badCount,fallbackCounts,repeatProtection:{configuredWindow:MAX_RECENT_REVEALS,usedWindow,relaxed:usedWindow<MAX_RECENT_REVEALS,recentCount:(history?.recent||[]).length,excludedCount:usedWindow?new Set((history?.recent||[]).slice(-usedWindow)).size:0,immediateRepeatBlocked:blockedImmediateRepeat,immediateRepeatUnavoidable,attempts}}};
    }
"""

if old not in engine:
    raise SystemExit('Could not locate the Phase 4 generateLineup block.')
engine = engine.replace(old, new)
engine_path.write_text(engine, encoding='utf-8')

architecture_path = Path('assets/data/blind-rank-category-architecture.js')
architecture = architecture_path.read_text(encoding='utf-8')
architecture = architecture.replace(
    "const VERSION='blind-rank-category-architecture-20260717b-phase-three-handoff';",
    "const VERSION='blind-rank-category-architecture-20260717c-phase-five-tuning';"
)
architecture = architecture.replace(
    "{id:'early-ufc',name:'Early UFC Careers',categoryId:'ufc-career',ratingPaths:['career.overall'],filters:{gender:'men'},eras:['tournament','survival','zuffa-rebuild'],status:'launch'},",
    "{id:'early-ufc',name:'Early UFC Careers',categoryId:'ufc-career',ratingPaths:['career.overall'],filters:{gender:'men'},eras:['tournament','survival','zuffa-rebuild'],status:'planned'},"
)
architecture = architecture.replace(
    "liveGameplayMode:'legacy-generator-until-phase-four'",
    "liveGameplayMode:'absolute-category-tiers-phase-five-tuned'"
)
architecture_path.write_text(architecture, encoding='utf-8')

index_path = Path('index.html')
index = index_path.read_text(encoding='utf-8')
index = index.replace(
    'blind-rank-category-architecture.js?v=blind-rank-category-architecture-20260717a-phase-one',
    'blind-rank-category-architecture.js?v=blind-rank-category-architecture-20260717c-phase-five-tuning'
)
index = index.replace(
    'blind-rank.js?v=blind-rank-20260717k-absolute-role-generator',
    'blind-rank.js?v=blind-rank-20260717l-relax-before-emergency'
)
index_path.write_text(index, encoding='utf-8')

for path, markers in {
    engine_path: ['blind-rank-20260717l-relax-before-emergency','bestEmergencyCandidate'],
    architecture_path: ['blind-rank-category-architecture-20260717c-phase-five-tuning',"id:'early-ufc'", "status:'planned'"],
    index_path: ['blind-rank-20260717l-relax-before-emergency','blind-rank-category-architecture-20260717c-phase-five-tuning']
}.items():
    content=path.read_text(encoding='utf-8')
    missing=[marker for marker in markers if marker not in content]
    if missing:
        raise SystemExit(f'{path} is missing expected markers: {missing}')
