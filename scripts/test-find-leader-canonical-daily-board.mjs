import assert from 'node:assert/strict';
import fs from 'node:fs';

const findLeader=fs.readFileSync('assets/js/find-leader.js','utf8');
const compatibility=fs.readFileSync('assets/js/better-than-standalone-share.js','utf8');
const dailySurface=fs.readFileSync('assets/js/play-daily-find-leader.js','utf8');

assert.match(findLeader,/function dailySetup\(context=\{\}\)\{[\s\S]*bank\.scheduledDefinition[\s\S]*dailySetupCache/,'The Find the Leader owner must resolve and cache the canonical daily setup.');
assert.doesNotMatch(compatibility,/game\.dailySetup\s*=/,'Better Than compatibility must not replace the Find the Leader daily owner.');
assert.doesNotMatch(dailySurface,/game\.dailySetup\s*=/,'The Play daily surface must consume, not replace, the Find the Leader daily owner.');
assert.doesNotMatch(compatibility,/play-daily-find-leader\.js/,'Better Than compatibility must not initialize a second Find the Leader daily controller.');

console.log('Find the Leader canonical daily board proof passed.');
