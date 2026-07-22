const RESOLVED_STATUSES = new Set(['complete', 'draw', 'no-contest']);

function normalizeSpace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

export function normalizeName(value) {
  return normalizeSpace(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\b(jr|sr|ii|iii|iv)\b/g, '')
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

export function normalizeWeight(value) {
  return normalizeName(value).replace(/womens/g, '');
}

export function matchupKey(first, second) {
  return [normalizeName(first), normalizeName(second)].sort().join('|');
}

export function isMainCard(section) {
  return String(section || '').toLowerCase().includes('main');
}

export function isPickable(event, fight) {
  return event.event_type === 'numbered' || /full card/i.test(String(event.card_rule || '')) || isMainCard(fight.card_section);
}

function sharedFighterCount(left, right) {
  const leftNames = new Set([normalizeName(left.red_name), normalizeName(left.blue_name)]);
  return [normalizeName(right.red_name), normalizeName(right.blue_name)].filter((name) => leftNames.has(name)).length;
}

function findPreviousFight(incoming, unmatched, byPair) {
  let previous = unmatched.get(incoming.id) || null;
  if (!previous) {
    previous = (byPair.get(matchupKey(incoming.red_name, incoming.blue_name)) || [])
      .find((fight) => unmatched.has(fight.id)) || null;
  }
  if (!previous) {
    const candidates = [...unmatched.values()].filter((fight) =>
      !RESOLVED_STATUSES.has(fight.result_status) &&
      sharedFighterCount(fight, incoming) === 1 &&
      normalizeWeight(fight.weight_class) === normalizeWeight(incoming.weight_class)
    );
    if (candidates.length === 1) previous = candidates[0];
  }
  return previous;
}

/**
 * UFC.com owns card slots: section, order, lock time, additions and removals.
 * A fallback source may only reconcile an opponent replacement inside an
 * already-known slot. It cannot add/remove/reorder/resection the card.
 */
export function buildReconciliationPlan(existing, incomingFights, event, sourceType) {
  const authoritative = sourceType === 'official-ufc';
  const activeExisting = existing.filter((fight) => !RESOLVED_STATUSES.has(fight.result_status));

  if (!authoritative && !activeExisting.length) {
    throw new Error('Fallback card source cannot establish an event without an existing UFC-confirmed baseline');
  }
  if (!authoritative && incomingFights.length !== activeExisting.length) {
    throw new Error(`Fallback card source cannot add or remove fight slots (${activeExisting.length} existing vs ${incomingFights.length} incoming)`);
  }

  const unmatched = new Map(existing.map((fight) => [fight.id, fight]));
  const byPair = new Map();
  for (const fight of existing) {
    const pair = matchupKey(fight.red_name, fight.blue_name);
    const list = byPair.get(pair) || [];
    list.push(fight);
    byPair.set(pair, list);
  }

  const actions = [];
  for (const incoming of incomingFights) {
    const previous = findPreviousFight(incoming, unmatched, byPair);
    if (!previous) {
      if (!authoritative) {
        throw new Error(`Fallback card source cannot create a new slot for ${incoming.red_name} vs. ${incoming.blue_name}`);
      }
      actions.push({ type: 'insert', incoming });
      continue;
    }

    unmatched.delete(previous.id);
    const matchupChanged = matchupKey(previous.red_name, previous.blue_name) !== matchupKey(incoming.red_name, incoming.blue_name);
    const effectiveIncoming = authoritative ? incoming : {
      ...incoming,
      id: previous.id,
      bout_order: previous.bout_order,
      card_section: previous.card_section,
      lock_at: previous.lock_at,
    };
    const wasPickable = isPickable(event, previous);
    const nowPickable = isPickable(event, effectiveIncoming);

    actions.push({
      type: 'update',
      previous,
      incoming: effectiveIncoming,
      matchupChanged,
      promoted: !wasPickable && nowPickable,
      demoted: wasPickable && !nowPickable,
    });
  }

  const stale = [...unmatched.values()];
  if (!authoritative) {
    const activeStale = stale.filter((fight) => !RESOLVED_STATUSES.has(fight.result_status));
    if (activeStale.length) {
      throw new Error(`Fallback card source cannot remove existing slots: ${activeStale.map((fight) => fight.id).join(', ')}`);
    }
  }

  return { authoritative, actions, stale };
}
