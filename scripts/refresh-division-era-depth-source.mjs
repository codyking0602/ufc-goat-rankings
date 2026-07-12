// Stable import path for the current UFCStats-derived depth source.
import { buildCurrentDepthCsv as buildPinnedDepthCsv } from './refresh-division-era-depth-source-fast.mjs';

export async function buildCurrentDepthCsv(options = {}) {
  const result = await buildPinnedDepthCsv(options);
  const metadata = result.metadata || {};
  return {
    ...result,
    metadata: {
      ...metadata,
      // Compatibility fields consumed by the existing orchestration script.
      liveSourceUrl: metadata.sourceUrl,
      historicalSourceUrl: metadata.sourceUrl,
      historicalFightCount: metadata.datasetFightCount,
      historicalCutoff: metadata.datasetEnd,
      addedEventCount: 0,
      addedFightCount: 0
    }
  };
}
