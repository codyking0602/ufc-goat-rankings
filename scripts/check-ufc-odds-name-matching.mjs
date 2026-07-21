import assert from 'node:assert/strict';
import {
  matchupMatches,
  normalizeName,
  sameFighterName
} from '../supabase/functions/_shared/ufc-name-matching.js';

assert.equal(normalizeName('Jan Błachowicz'), 'janblachowicz');
assert.equal(normalizeName('Uroš Medić'), 'urosmedic');
assert.equal(sameFighterName('Ramazan Temirov', 'Ramazonbek Temirov'), true);
assert.equal(sameFighterName('Steve Erceg', 'Steve Erceg'), true);
assert.equal(sameFighterName('Umar Nurmagomedov', 'Usman Nurmagomedov'), false);
assert.equal(sameFighterName('Magomed Ankalaev', 'Magomed Guskov'), false);

assert.equal(
  matchupMatches(
    { home_team: 'Steve Erceg', away_team: 'Ramazonbek Temirov' },
    { red_name: 'STEVE ERCEG', blue_name: 'RAMAZAN TEMIROV' }
  ),
  true
);

assert.equal(
  matchupMatches(
    { home_team: 'Bogdan Guskov', away_team: 'Magomed Ankalaev' },
    { red_name: 'MAGOMED ANKALAEV', blue_name: 'BOGDAN GUSKOV' }
  ),
  true
);

assert.equal(
  matchupMatches(
    { home_team: 'Abubakar Vagaev', away_team: 'Someone Else' },
    { red_name: 'ABUBAKAR VAGAEV', blue_name: 'SAYGID IZAGAKHMAEV' }
  ),
  false
);

console.log('UFC odds name matching checks passed.');
