const SPECIAL_LATIN = [
  [/[ł]/g, 'l'],
  [/[đð]/g, 'd'],
  [/[þ]/g, 'th'],
  [/[æ]/g, 'ae'],
  [/[œ]/g, 'oe'],
  [/[ø]/g, 'o']
];

export function nameTokens(value) {
  let text = String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  for (const [pattern, replacement] of SPECIAL_LATIN) {
    text = text.replace(pattern, replacement);
  }

  return text
    .replace(/\b(jr|sr|ii|iii|iv)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function normalizeName(value) {
  return nameTokens(value).join('');
}

function commonPrefixLength(left, right) {
  const limit = Math.min(left.length, right.length);
  let index = 0;
  while (index < limit && left[index] === right[index]) index += 1;
  return index;
}

export function sameFighterName(leftValue, rightValue) {
  const left = nameTokens(leftValue);
  const right = nameTokens(rightValue);
  if (!left.length || !right.length) return false;

  const leftCompact = left.join('');
  const rightCompact = right.join('');
  if (leftCompact === rightCompact) return true;

  const leftSurname = left.at(-1);
  const rightSurname = right.at(-1);
  if (!leftSurname || leftSurname !== rightSurname) return false;

  const leftGiven = left.slice(0, -1).join('');
  const rightGiven = right.slice(0, -1).join('');
  if (!leftGiven || !rightGiven) return false;
  if (leftGiven === rightGiven) return true;

  const prefix = commonPrefixLength(leftGiven, rightGiven);
  const shorterLength = Math.min(leftGiven.length, rightGiven.length);
  const lengthGap = Math.abs(leftGiven.length - rightGiven.length);

  // Sportsbooks sometimes use an extended legal given name while UFC uses a shorter form.
  // Requiring the same surname, a long shared prefix and a limited length gap avoids broad fuzzy matching.
  return prefix >= 5 && prefix / shorterLength >= 0.65 && lengthGap <= 5;
}

export function matchupMatches(providerEvent, fight) {
  const home = providerEvent?.home_team;
  const away = providerEvent?.away_team;
  const red = fight?.red_name || fight?.red;
  const blue = fight?.blue_name || fight?.blue;

  return (
    sameFighterName(home, red) && sameFighterName(away, blue)
  ) || (
    sameFighterName(home, blue) && sameFighterName(away, red)
  );
}
