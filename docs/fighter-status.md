# UFC GOAT App Fighter Status

Last updated: 2026-07-06

This is the permanent tracker for fighter completion. Use this instead of chat spreadsheets.

## New source-of-truth direction

Going forward, fighter-facing content should move into the fighter packet system:

`assets/data/fighter-packets/<fighter-slug>.js`

Scoring math still lives in:

`assets/data/ranking-data.js`

Permanent hand-added fighters live in:

`assets/data/ranking-data-additions.js`

Do not put fighter data back into `index.html`.

## Fighter checklist

Legend: ✅ done, 🟡 partial, ❌ missing, ➡️ migrate later

Visible ranks are recalculated dynamically in the app from the current sorted board. The Board column below is tracker context, not the front-end source of truth.

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
| Dricus du Plessis | Men #13 | Permanent hand-added fighter; OQ/Apex/Prime reviewed; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Dricus photos after real files exist | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/dricus-du-plessis.js` |
| Tyron Woodley | Men #14 | Permanent hand-added fighter; prime extended through Burns; packet, rounds, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Woodley photos; audit exact round-control rows next rebuild | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/tyron-woodley.js` |
| Aljamain Sterling | Men #15 | Permanent hand-added fighter; packet live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | Add Aljo photos; add Watch Moment only if URL is provided | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/aljamain-sterling.js` |
| Daniel Cormier | Men #13 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No DC fix needed | `assets/data/fighter-packets/daniel-cormier.js` |
| Stipe Miocic | Men #14 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Stipe fix needed | `assets/data/fighter-packets/stipe-miocic.js` |
| Ilia Topuria | Men #15 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Ilia fix needed | `assets/data/fighter-packets/ilia-topuria.js` |
| Israel Adesanya | Men #15 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Izzy fix needed | `assets/data/fighter-packets/israel-adesanya.js` |
| Cain Velasquez | Men #16 | Packet live, Watch Moment added | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | Add direct ledger only if needed | `assets/data/fighter-packets/cain-velasquez.js` |
| Petr Yan | Men #16 | Complete in packet system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Yan fix needed | `assets/data/fighter-packets/petr-yan.js` |
| Merab Dvalishvili | Men #17 | Packet live, Watch Moment added | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Merab fix needed | `assets/data/fighter-packets/merab-dvalishvili.js` |
| B.J. Penn | Men #18 | Packet live, Watch Moment added | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No BJ fix needed | `assets/data/fighter-packets/bj-penn.js` |
| Dustin Poirier | Men #20 | Permanent hand-added fighter; packet live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | Add Dustin photos | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/dustin-poirier.js` |
| T.J. Dillashaw | Men #21 | Permanent hand-added fighter; packet live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | Add TJ photos | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/tj-dillashaw.js` |
| Alex Pereira | Men #20 | Packet live, Watch Moment added, Gane loss updated | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Raw scoring table can be recalculated later | `assets/data/fighter-packets/alex-pereira.js` |
| Chuck Liddell | Men #21 | Packet live, Watch Moment added | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | No Chuck fix needed | `assets/data/fighter-packets/chuck-liddell.js` |
| Junior dos Santos | Men #21 | Fighter-packet live add; UFC heavyweight title case, win ledger, round-control rows, ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add JDS photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/junior-dos-santos.js` |
| Tito Ortiz | Men #21 | Fighter-packet live add; five-defense early UFC title reign with era/opponent-strength discount; packet, rounds, ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Tito photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/tito-ortiz.js` |
| Deiveson Figueiredo | Men #22 | Fighter-packet live add; draw-retainment and missed-weight title logic corrected; packet, rounds, ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Deiveson photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/deiveson-figueiredo.js` |
| Khamzat Chimaev | Men #23 | Fighter-packet live add; corrected title-win and Quality Wins caps; packet, rounds, ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Khamzat photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/khamzat-chimaev.js` |
| Justin Gaethje | Men #23 | Permanent hand-added fighter; Watch Moment added; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Gaethje photos | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/justin-gaethje.js` |
| Dominick Cruz | Men #22 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Cruz photos | `assets/data/fighter-packets/dominick-cruz.js` |
| Francis Ngannou | Men #23 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Francis photos | `assets/data/fighter-packets/francis-ngannou.js` |
| Charles Oliveira | Men #24 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Charles photos | `assets/data/fighter-packets/charles-oliveira.js` |
| Henry Cejudo | Men #24 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Henry photos | `assets/data/fighter-packets/henry-cejudo.js` |
| Frankie Edgar | Men #26 | Permanent hand-added fighter; Watch Moment added; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Frankie photos | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/frankie-edgar.js` |
| Lyoto Machida | Men #27 | Permanent hand-added fighter; corrected Quality Wins cap; packet, rounds, ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Machida photos; audit exact round-control rows next rebuild | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/lyoto-machida.js` |
| Conor McGregor | Men #26 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Conor photos | `assets/data/fighter-packets/conor-mcgregor.js` |
| Sean Strickland | Men #28 | Permanent hand-added fighter; Apex adjustment reviewed; packet, rounds, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Strickland photos; audit exact round-control rows next rebuild | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/sean-strickland.js` |
| Robert Whittaker | Men #29 | Permanent hand-added fighter; Romero treatment approved; packet, rounds, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Whittaker photos; audit exact round-control rows next rebuild | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/robert-whittaker.js` |
| Sean O'Malley | Men #30 | Permanent hand-added fighter; Quality Wins reviewed; packet, rounds, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Sean photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/sean-omalley.js` |
| Dan Henderson | Men #31 | Permanent hand-added fighter; packet live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | Add Hendo photos; add Watch Moment only if URL is provided | `assets/data/ranking-data-additions.js` + `assets/data/fighter-packets/dan-henderson.js` |
| Amanda Nunes | Women #1 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Amanda photos | `assets/data/fighter-packets/amanda-nunes.js` |
| Valentina Shevchenko | Women #2 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Valentina photos | `assets/data/fighter-packets/valentina-shevchenko.js` |
| Zhang Weili | Women elite | Fighter-packet live add; two-reign strawweight case, win ledger, round-control rows, ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Zhang photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/zhang-weili.js` |
| Rose Namajunas | Women elite | Fighter-packet live add; two-reign strawweight case, win ledger, round-control rows, ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Rose photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/rose-namajunas.js` |
| Miesha Tate | Women depth | Fighter-packet live add; UFC bantamweight title case, win ledger, round-control rows, ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Miesha photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/miesha-tate.js` |
| Mackenzie Dern | Women current champ | Fighter-packet live add; vacant strawweight title case, corrected apex aura, win ledger, round-control rows, ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Dern photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/mackenzie-dern.js` |
| Kayla Harrison | Women current champ | Fighter-packet live add; bantamweight title case, short-window dominance, win ledger, round-control rows, ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Kayla photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/kayla-harrison.js` |
| Jessica Andrade | Women champion tier | Fighter-packet live add; strawweight title case, three-division win volume, ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Andrade photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/jessica-andrade.js` |
| Alexa Grasso | Women champion tier | Fighter-packet live add; flyweight title case, Valentina rivalry ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Grasso photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/alexa-grasso.js` |
| Julianna Peña | Women champion tier | Fighter-packet live add; Nunes upset title case, bantamweight ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Peña photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/julianna-pena.js` |
| Carla Esparza | Women champion tier | Fighter-packet live add; two-time strawweight champion case, Rose ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Carla photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/carla-esparza.js` |
| Holly Holm | Women champion tier | Fighter-packet live add; Ronda upset title case, title-loss ledger, and Watch Moment live; photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Holly photos; audit exact round-control rows next rebuild | `assets/data/fighter-packets/holly-holm.js` |
| Joanna Jedrzejczyk | Women #3 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Joanna photos | `assets/data/fighter-packets/joanna-jedrzejczyk.js` |
| Ronda Rousey | Women #4 | Packet live, Watch Moment added, photos needed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Add Ronda photos | `assets/data/fighter-packets/ronda-rousey.js` |

## Current priorities

1. Zhang Weili, Rose Namajunas, Miesha Tate, Mackenzie Dern, Kayla Harrison, Jessica Andrade, Alexa Grasso, Julianna Peña, Carla Esparza, Holly Holm, Junior dos Santos, Tito Ortiz, Deiveson Figueiredo, Khamzat Chimaev, Tyron Woodley, Lyoto Machida, Sean Strickland, Robert Whittaker, and Sean O'Malley are live additions with dedicated fighter packets and round-control rows.
2. Dynamic visible ranks are now handled by `assets/js/rank-fluidity-fixes.js`; packet rank values should not be treated as the front-end source of truth.
3. Dricus du Plessis is permanent and reviewed across Quality Wins, Apex Peak, and Prime Dominance.
4. Photos remain missing until real files exist.
5. During the next full scoring-table rebuild, fold `assets/data/ranking-data-additions.js` and fighter-packet live adds into `assets/data/ranking-data.js`.
