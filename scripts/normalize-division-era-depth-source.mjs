import fs from 'node:fs/promises';

const REPORT_PATH = 'docs/division-era-depth-shadow-report.json';
const RUNTIME_PATH = 'assets/data/division-era-depth-shadow.js';
const SOURCE = {
  url: 'https://raw.githubusercontent.com/komaksym/UFC-DataLab/3268146c05211de9deab8b9b4c0bb4a954815f0b/data/stats/stats_raw.csv',
  repository: 'komaksym/UFC-DataLab',
  commit: '3268146c05211de9deab8b9b4c0bb4a954815f0b',
  file: 'data/stats/stats_raw.csv',
  description: 'Pinned UFCStats-derived all-bouts mirror including decisive fights, draws, and no contests.',
  underlyingSource: 'UFCStats',
  updateLabel: 'Datasets refreshed through 2026-06-27'
};

function normalizedSource(existing = {}) {
  return {
    ...SOURCE,
    datasetFightCount: existing.datasetFightCount,
    datasetStart: existing.datasetStart,
    datasetEnd: existing.datasetEnd,
    modelDate: existing.modelDate,
    ageDays: existing.ageDays,
    sourceFresh: existing.sourceFresh
  };
}

const report = JSON.parse(await fs.readFile(REPORT_PATH, 'utf8'));
report.source = normalizedSource(report.source);
await fs.writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

const runtimeText = await fs.readFile(RUNTIME_PATH, 'utf8');
const match = runtimeText.match(/const SHADOW=(\{[\s\S]*\});\n  window\.UFC_DIVISION_ERA_DEPTH_SHADOW/);
if (!match) throw new Error('Unable to parse generated Division-Era Depth runtime payload.');
const runtime = JSON.parse(match[1]);
runtime.source = normalizedSource(report.source);
const rebuilt = `// Full-roster Division-Era Depth Index. Generated evidence plus approved curved live candidate.\n(function(){\n  'use strict';\n  const SHADOW=${JSON.stringify(runtime)};\n  window.UFC_DIVISION_ERA_DEPTH_SHADOW=SHADOW;\n  document.documentElement.setAttribute('data-division-era-depth-shadow',SHADOW.version);\n  window.dispatchEvent(new CustomEvent('ufc-division-era-depth-shadow-ready',{detail:SHADOW}));\n})();\n`;
await fs.writeFile(RUNTIME_PATH, rebuilt, 'utf8');

console.log(JSON.stringify(report.source, null, 2));
