# UFC GOAT App Fighter Status

Last updated: 2026-07-05

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
| Raw ranking score and UFC stat row | `assets/data/ranking-data.js` plus `assets/data/ranking-data-additions.js` for hand-added fighters | Fold additions into base table during next scoring-table rebuild |
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
| Islam Makhachev | Men #5 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Islam fix needed | `assets/data/fighter-packets/islam-makhachev.js` |
| Khabib Nurmagomedov | Men #6 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Khabib fix needed | `assets/data/fighter-packets/khabib-nurmagomedov.js` |
| Alexander Volkanovski | Men #7 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Volk fix needed | `assets/data/fighter-packets/alexander-volkanovski.js` |
| Randy Couture | Men #8 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Randy fix needed | `assets/data/fighter-packets/randy-couture.js` |
| Max Holloway | Men #9 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Max fix needed | `assets/data/fighter-packets/max-holloway.js` |
| Kamaru Usman | Men #10 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Usman fix needed | `assets/data/fighter-packets/kamaru-usman.js` |
| Jose Aldo | Men #11 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Aldo fix needed | `assets/data/fighter-packets/jose-aldo.js` |
| Matt Hughes | Men #12 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Hughes fix needed | `assets/data/fighter-packets/matt-hughes.js` |
| Dricus du Plessis | Men #13 | Permanent hand-added fighter; packet live; Apex Peak and Watch Moment added; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Dricus photos after Cody uploads real files; audit round-control percentage next rebuild | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/dricus-du-plessis.js` |
| Aljamain Sterling | Men #14 | Permanent hand-added fighter; packet live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | Add Aljo photos; add Watch Moment only if Cody provides URL | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/aljamain-sterling.js` |
| Daniel Cormier | Men #13 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No DC fix needed | `assets/data/fighter-packets/daniel-cormier.js` |
| Stipe Miocic | Men #14 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Stipe fix needed | `assets/data/fighter-packets/stipe-miocic.js` |
| Ilia Topuria | Men #15 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Ilia fix needed | `assets/data/fighter-packets/ilia-topuria.js` |
| Israel Adesanya | Men #15 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Izzy fix needed | `assets/data/fighter-packets/israel-adesanya.js` |
| Cain Velasquez | Men #16 | Packet live, Watch Moment added | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | Add direct ledger only if needed | `assets/data/fighter-packets/cain-velasquez.js` |
| Petr Yan | Men #16 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Yan fix needed | `assets/data/fighter-packets/petr-yan.js` |
| Merab Dvalishvili | Men #17 | Packet live, Watch Moment added | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Merab Watch Moment fix needed | `assets/data/fighter-packets/merab-dvalishvili.js` |
| B.J. Penn | Men #18 | Packet live, Watch Moment added | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No BJ Watch Moment fix needed | `assets/data/fighter-packets/bj-penn.js` |
| Dustin Poirier | Men #19 | Permanent hand-added fighter; packet live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | Add Dustin photos; add Watch Moment only if Cody provides URL | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/dustin-poirier.js` |
| T.J. Dillashaw | Men #20 | Permanent hand-added fighter; packet live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | Add TJ photos; add Watch Moment only if Cody provides URL | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/tj-dillashaw.js` |
| Alex Pereira | Men #20 | Packet live, Watch Moment added, Gane loss updated | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Raw scoring table can be recalculated later | `assets/data/fighter-packets/alex-pereira.js` |
| Chuck Liddell | Men #21 | Packet live, Watch Moment added | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Chuck Watch Moment fix needed | `assets/data/fighter-packets/chuck-liddell.js` |
| Justin Gaethje | Men #22 | Permanent hand-added fighter; Watch Moment added; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Gaethje photos | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/justin-gaethje.js` |
| Dominick Cruz | Men #22 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Cruz photos | `assets/data/fighter-packets/dominick-cruz.js` |
| Francis Ngannou | Men #23 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Francis photos | `assets/data/fighter-packets/francis-ngannou.js` |
| Charles Oliveira | Men #24 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Charles photos | `assets/data/fighter-packets/charles-oliveira.js` |
| Henry Cejudo | Men #24 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Henry photos | `assets/data/fighter-packets/henry-cejudo.js` |
| Frankie Edgar | Men #25 | Permanent hand-added fighter; Watch Moment added; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Frankie photos | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/frankie-edgar.js` |
| Conor McGregor | Men #26 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Conor photos | `assets/data/fighter-packets/conor-mcgregor.js` |
| Dan Henderson | Men #27 | Permanent hand-added fighter; packet live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | Add Hendo photos; add Watch Moment only if Cody provides URL | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/dan-henderson.js` |
| Amanda Nunes | Women #1 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Amanda photos | `assets/data/fighter-packets/amanda-nunes.js` |
| Valentina Shevchenko | Women #2 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Valentina photos | `assets/data/fighter-packets/valentina-shevchenko.js` |
| Joanna Jedrzejczyk | Women #3 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Joanna photos | `assets/data/fighter-packets/joanna-jedrzejczyk.js` |
| Ronda Rousey | Women #4 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Ronda photos | `assets/data/fighter-packets/ronda-rousey.js` |

## Current priorities

1. Dricus du Plessis is permanent through `assets/data/ranking-data-additions.js`, scored for Apex Peak, and has a dedicated fighter packet plus Watch Moment.
2. Justin Gaethje, Frankie Edgar, Dustin Poirier, Aljamain Sterling, T.J. Dillashaw, and Dan Henderson are permanent through `assets/data/ranking-data-additions.js` plus fighter packets.
3. Photos still needed for Dricus, Cruz, Francis, Charles, Henry, Conor, Justin Gaethje, Frankie Edgar, Dustin Poirier, Aljamain Sterling, T.J. Dillashaw, Dan Henderson, Amanda, Valentina, Joanna, and Ronda.
4. During the next full scoring-table rebuild, fold `assets/data/ranking-data-additions.js` into `assets/data/ranking-data.js`.
5. Next cleanup should focus on photos, then testing Compare Mode pairings.
