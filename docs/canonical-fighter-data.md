# Canonical fighter data workflow

All fighter scoring, profile, display, watch moment, compare, and ledger data now lives in `assets/data/ranking-data.js`.

## Add a new fighter

1. Add one object to `window.RANKING_DATA.fighters` in `assets/data/ranking-data.js`.
2. Include scoring fields both at top level and in `scoring` for compatibility.
3. Put profile/display copy in `display`.
4. Put compare copy in `compareProfile` or `compare`.
5. Put direct fight history in `fightLedger`.
6. Do not add new fighter-packet, additions, watch-moment, display override, compare pack, or correction files.

Legacy files are kept for audit history only and are no longer active app data dependencies.
