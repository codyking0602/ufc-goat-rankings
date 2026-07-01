// Phase 1 safe data layer.
// This file is intentionally designed as a patch layer first, not a full UI rewrite.
// It can be loaded after the existing inline app script without changing the old product layout.
// It mutates window.RANKING_DATA in place so the old const DATA reference still sees the same object.

(function () {
  function findRow(boardName, fighterName) {
    const data = window.RANKING_DATA;
    const board = data && data[boardName];
    if (!Array.isArray(board)) return null;
    return board.find(row => row.fighter === fighterName) || null;
  }

  function patchRow(boardName, fighterName, patch) {
    const row = findRow(boardName, fighterName);
    if (!row) return;
    Object.assign(row, patch);
  }

  window.UFC_RANKING_DATA_PATCHES_V1 = {
    meta: {
      purpose: 'Phase 1 modular-refactor-v2-safe ranking data patch layer',
      note: 'Keeps the old UI intact while allowing fighter scoring fixes outside index.html.',
      updated: '2026-07-01'
    },
    apply() {
      patchRow('men', 'Georges St-Pierre', {
        timesFinishedPrime: 1
      });

      patchRow('men', 'Charles Oliveira', {
        rank: 24,
        totalScore: 40.13,
        championship: 5.32,
        opponentQuality: 17.85,
        primeDominance: 20.96,
        longevity: 5.99,
        penalty: -10.0
      });

      patchRow('men', 'Ilia Topuria', {
        rank: 15,
        totalScore: 43.44,
        championship: 5.99,
        opponentQuality: 13.10,
        primeDominance: 23.60,
        longevity: 2.97,
        penalty: -2.25
      });

      patchRow('men', 'Petr Yan', {
        rank: 16,
        totalScore: 43.35,
        championship: 5.04,
        opponentQuality: 13.10,
        primeDominance: 21.43,
        longevity: 5.98,
        penalty: -5.25
      });
    }
  };

  if (window.RANKING_DATA) {
    window.UFC_RANKING_DATA_PATCHES_V1.apply();
  }
})();
