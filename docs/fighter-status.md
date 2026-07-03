# UFC GOAT App Fighter Status

Last updated: 2026-07-02

This is the permanent tracker for fighter completion. Use this instead of chat spreadsheets.

## New source-of-truth direction

Going forward, fighter-facing content should move into:

`assets/data/fighter-packets.js`

That file is the new central packet layer. It can feed the older systems while we migrate slowly.

Scoring math still lives in:

`assets/data/ranking-data.js`

Do not put fighter data back into `index.html`.

## Legacy file map

| Need | Current location | Future target |
|---|---|---|
| Raw ranking score and UFC stat row | `assets/data/ranking-data.js` | Keep here until scoring model refactor |
| Card/profile polish | `assets/data/display-overrides.js` | `assets/data/fighter-packets.js` |
| Standard profile stats | `assets/js/fighter-profile-packages.js` | Replaced by `assets/data/fighter-packets.js` as fighters migrate |
| Compare seasoning | `assets/compare-data.js`, compare coverage packs, phase files | `assets/data/fighter-packets.js` |
| Direct fight/rivalry ledger | compare files only | Keep separate unless direct-rivalry system is refactored |
| Watch Moment | `assets/js/watch-moments.js` | `assets/data/fighter-packets.js` |
| Photos | `assets/fighters/` | Keep here |
| Module loading | `assets/data/ranking-data-patches.js` | Keep as loader/status hook for now |

## Fighter checklist

Legend: ✅ done, 🟡 partial, ❌ missing, ➡️ migrate later

| Fighter | Board | Status | Packet | Ranking | Display | Profile stats | Compare seasoning | Ledger | Watch | Photos | Next fix | Main edit location |
|---|---:|---|---|---|---|---|---|---|---|---|---|---|
| Jon Jones | Men #1 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Jon fix needed | `assets/data/fighter-packets.js` |
| Georges St-Pierre | Men #2 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Move to DJ | `assets/data/fighter-packets.js` |
| Demetrious Johnson | Men #3 | Strong core, migrate next | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | Move content into packet | `assets/data/fighter-packets.js` |
| Anderson Silva | Men #4 | Strong core, migrate later | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | Move content into packet | `assets/data/fighter-packets.js` |
| Islam Makhachev | Men #5 | Strong core, migrate later | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Move content into packet | `assets/data/fighter-packets.js` |
| Khabib Nurmagomedov | Men #6 | Strong core, migrate later | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | Move content into packet | `assets/data/fighter-packets.js` |
| Alexander Volkanovski | Men #7 | Strong core, migrate later | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | Move content into packet | `assets/data/fighter-packets.js` |
| Randy Couture | Men #8 | Needs display polish | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | Add packet/display polish | `assets/data/fighter-packets.js` |
| Max Holloway | Men #9 | Strong core, migrate later | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | Move content into packet | `assets/data/fighter-packets.js` |
| Kamaru Usman | Men #10 | Needs display polish | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | Add packet/display polish | `assets/data/fighter-packets.js` |
| Jose Aldo | Men #11 | Strong core, migrate later | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | Move content into packet | `assets/data/fighter-packets.js` |
| Matt Hughes | Men #12 | Needs display polish | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | Add packet/display polish | `assets/data/fighter-packets.js` |
| Daniel Cormier | Men #13 | Needs display polish | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | Add packet/display polish | `assets/data/fighter-packets.js` |
| Stipe Miocic | Men #14 | Needs display polish | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | Add packet/display polish | `assets/data/fighter-packets.js` |
| Ilia Topuria | Men #15 | Needs display polish | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | Add packet/display polish | `assets/data/fighter-packets.js` |
| Israel Adesanya | Men #15 | Needs display polish | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | Add packet/display polish | `assets/data/fighter-packets.js` |
| Cain Velasquez | Men #16 | Ranking only | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 | Full packet needed | `assets/data/fighter-packets.js` |
| Petr Yan | Men #16 | Compare/display strong, profile incomplete | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | `assets/data/fighter-packets.js` |
| Merab Dvalishvili | Men #17 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | `assets/data/fighter-packets.js` |
| B.J. Penn | Men #18 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | `assets/data/fighter-packets.js` |
| Alex Pereira | Men #20 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | `assets/data/fighter-packets.js` |
| Chuck Liddell | Men #21 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | `assets/data/fighter-packets.js` |
| Dominick Cruz | Men #22 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | `assets/data/fighter-packets.js` |
| Francis Ngannou | Men #23 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | `assets/data/fighter-packets.js` |
| Charles Oliveira | Men #24 | Partial compare only | ❌ | ✅ | ❌ | ❌ | 🟡 | ✅ | ❌ | 🟡 | Full packet needed | `assets/data/fighter-packets.js` |
| Henry Cejudo | Men #24 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | `assets/data/fighter-packets.js` |
| Conor McGregor | Men #26 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | `assets/data/fighter-packets.js` |
| Amanda Nunes | Women #1 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | `assets/data/fighter-packets.js` |
| Valentina Shevchenko | Women #2 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | `assets/data/fighter-packets.js` |
| Joanna Jedrzejczyk | Women #3 | Ranking only | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 | Full packet needed | `assets/data/fighter-packets.js` |
| Ronda Rousey | Women #4 | Ranking only | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 | Full packet needed | `assets/data/fighter-packets.js` |

## Current priorities

1. Jon is complete in the new packet system.
2. GSP is complete in the new packet system.
3. Migrate DJ next.
4. Then migrate Anderson, Khabib, Islam, and Volk.
5. After the top tier is stable, add display/profile/watch polish for the mid-board fighters.
6. Only add new fighters after the current roster has clean packets or intentional partial status.
