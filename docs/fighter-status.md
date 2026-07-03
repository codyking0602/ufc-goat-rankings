# UFC GOAT App Fighter Status

Last updated: 2026-07-02

This is the permanent tracker for fighter completion. Use this instead of chat spreadsheets.

## New source-of-truth direction

Going forward, fighter-facing content should move into the fighter packet system:

`assets/data/fighter-packets.js`

and, as the roster grows:

`assets/data/fighter-packets/<fighter-slug>.js`

The packet system feeds the older app systems while we migrate slowly.

Scoring math still lives in:

`assets/data/ranking-data.js`

Do not put fighter data back into `index.html`.

## Legacy file map

| Need | Current location | Future target |
|---|---|---|
| Raw ranking score and UFC stat row | `assets/data/ranking-data.js` | Keep here until scoring model refactor |
| Card/profile polish | `assets/data/display-overrides.js` | Fighter packet system |
| Standard profile stats | `assets/js/fighter-profile-packages.js` | Replaced by fighter packet system as fighters migrate |
| Compare seasoning | `assets/compare-data.js`, compare coverage packs, phase files | Fighter packet system |
| Direct fight/rivalry ledger | compare files only | Keep separate unless direct-rivalry system is refactored |
| Watch Moment | `assets/js/watch-moments.js` | Fighter packet system |
| Photos | `assets/fighters/` | Keep here |
| Module loading | `assets/data/ranking-data-patches.js` | Keep as loader/status hook for now |

## Fighter checklist

Legend: ✅ done, 🟡 partial, ❌ missing, ➡️ migrate later

| Fighter | Board | Status | Packet | Ranking | Display | Profile stats | Compare seasoning | Ledger | Watch | Photos | Next fix | Main edit location |
|---|---:|---|---|---|---|---|---|---|---|---|---|---|
| Jon Jones | Men #1 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Jon fix needed | `assets/data/fighter-packets.js` |
| Georges St-Pierre | Men #2 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No GSP fix needed | `assets/data/fighter-packets.js` |
| Demetrious Johnson | Men #3 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No DJ fix needed | `assets/data/fighter-packets/demetrious-johnson.js` |
| Anderson Silva | Men #4 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Anderson fix needed | `assets/data/fighter-packets/anderson-silva.js` |
| Islam Makhachev | Men #5 | Strong core, migrate next | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Move content into packet | Fighter packet system |
| Khabib Nurmagomedov | Men #6 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Move to Islam | `assets/data/fighter-packets/khabib-nurmagomedov.js` |
| Alexander Volkanovski | Men #7 | Strong core, migrate later | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | Move content into packet | Fighter packet system |
| Randy Couture | Men #8 | Needs display polish | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | Add packet/display polish | Fighter packet system |
| Max Holloway | Men #9 | Strong core, migrate later | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | Move content into packet | Fighter packet system |
| Kamaru Usman | Men #10 | Needs display polish | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | Add packet/display polish | Fighter packet system |
| Jose Aldo | Men #11 | Strong core, migrate later | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | Move content into packet | Fighter packet system |
| Matt Hughes | Men #12 | Needs display polish | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | Add packet/display polish | Fighter packet system |
| Daniel Cormier | Men #13 | Needs display polish | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | Add packet/display polish | Fighter packet system |
| Stipe Miocic | Men #14 | Needs display polish | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | Add packet/display polish | Fighter packet system |
| Ilia Topuria | Men #15 | Needs display polish | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | Add packet/display polish | Fighter packet system |
| Israel Adesanya | Men #15 | Needs display polish | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | Add packet/display polish | Fighter packet system |
| Cain Velasquez | Men #16 | Ranking only | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 | Full packet needed | Fighter packet system |
| Petr Yan | Men #16 | Compare/display strong, profile incomplete | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | Fighter packet system |
| Merab Dvalishvili | Men #17 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | Fighter packet system |
| B.J. Penn | Men #18 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | Fighter packet system |
| Alex Pereira | Men #20 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | Fighter packet system |
| Chuck Liddell | Men #21 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | Fighter packet system |
| Dominick Cruz | Men #22 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | Fighter packet system |
| Francis Ngannou | Men #23 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | Fighter packet system |
| Charles Oliveira | Men #24 | Partial compare only | ❌ | ✅ | ❌ | ❌ | 🟡 | ✅ | ❌ | 🟡 | Full packet needed | Fighter packet system |
| Henry Cejudo | Men #24 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | Fighter packet system |
| Conor McGregor | Men #26 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | Fighter packet system |
| Amanda Nunes | Women #1 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | Fighter packet system |
| Valentina Shevchenko | Women #2 | Compare strong, app polish incomplete | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | 🟡 | Add packet/profile/watch | Fighter packet system |
| Joanna Jedrzejczyk | Women #3 | Ranking only | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 | Full packet needed | Fighter packet system |
| Ronda Rousey | Women #4 | Ranking only | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 | Full packet needed | Fighter packet system |

## Current priorities

1. Jon is complete in the packet system.
2. GSP is complete in the packet system.
3. DJ is complete in the packet system.
4. Anderson is complete in the packet system.
5. Khabib is complete in the packet system.
6. Migrate Islam next.
7. Then migrate Volk.
8. After the top tier is stable, add display/profile/watch polish for the mid-board fighters.
9. Only add new fighters after the current roster has clean packets or intentional partial status.
