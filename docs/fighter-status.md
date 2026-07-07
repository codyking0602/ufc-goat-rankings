# UFC GOAT App Fighter Status

Last updated: 2026-07-07

This is the permanent tracker for fighter completion and score-audit status. Use this instead of chat spreadsheets.

## Canonical source of truth

All fighter data now lives in:

`assets/data/ranking-data.js`

Do **not** add new fighter data to:

- `index.html`
- `assets/data/ranking-data-additions.js`
- `assets/data/display-overrides.js`
- `assets/data/fighter-packets/*.js`
- `assets/data/fighter-packet-manifest.js`
- `assets/js/watch-moments.js`
- compare pack files
- correction/patch files

Legacy files may still exist for audit/history, but they are not the workflow.

## New fighter / audit workflow

For every fighter, update only the canonical fighter object in `assets/data/ranking-data.js`.

Each fighter should be reviewed in small batches. It is okay to update scores during the audit, but every score change should be intentional and easy to explain.

Audit order for each fighter:

1. **Identity / placement** — name, slug/id, gender, leaderboard, divisions, UFC record.
2. **Scoring** — totalScore, Championship, Quality Wins, Prime Dominance, Longevity, Apex Peak, Loss Context.
3. **Resume Snapshot** — visible stat boxes. These must be real stats, not category scores.
4. **Title context** — actual title-fight wins, adjusted title wins, title losses/defenses, notes.
5. **Quality wins** — elite/top-5 win count and opponent ledger.
6. **Prime / rounds** — prime record, finish rate, rounds won %, active elite years, times finished in prime.
7. **Loss context** — penalty matches locked loss rules and notes explain weird cases.
8. **Display copy** — resume tag, one-liner, why ranked here, why not higher, final takeaway.
9. **Watch Moment** — canonical URL exists and renders on P4P/Women card/profile.
10. **Photos** — real `assets/fighters/<slug>-thumb.webp` and `assets/fighters/<slug>.webp` paths only after files exist.
11. **Compare** — compare profile/copy exists.
12. **Fight ledger** — only real direct fights/rivalries.

## Resume Snapshot contract

These are display stats, not scoring fields:

| Visible stat | Correct source | Do not use |
|---|---|---|
| UFC Record | actual UFC record | total score |
| UFC Title-Fight Wins | actual UFC title-fight wins | Championship score |
| Adjusted Title Wins | weighted title-win credit | title-fight wins if different |
| Elite / Top-5 Wins | real elite/top-5 wins or approved quality-win count | Opponent Quality score |
| Prime Record | approved UFC prime/elite window record | full career record unless same |
| Finish Rate | real UFC/prime finish rate as approved | finish score |
| Rounds Won | approved rounds-won % | round-control score |
| Active Elite Years | approved active elite years | Longevity score |
| Times Finished in Prime | counted prime finish losses | all late/post-prime finishes |

Example issue caught: Julianna Peña showed `21.8` UFC Title-Fight Wins because a championship score was mapped into a visible stat slot. That is a data/display bug, not a scoring call.

## Status legend

- ✅ verified
- 🟡 partial / needs review
- ❌ missing or known wrong
- ➡️ not needed / not applicable

## Active audit batches

### Batch 1 — newer women additions

Priority because these were added recently and are most likely to have profile-stat mapping issues.

| Fighter | Board | Scores | Snapshot | Title context | Quality wins | Prime/rounds | Loss context | Display | Watch | Photos | Compare | Ledger | Current issue / next step |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Zhang Weili | Women | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Audit visible stats vs canonical score fields. |
| Rose Namajunas | Women | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Audit visible stats and title/quality-win math. |
| Miesha Tate | Women | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Confirm UFC-only title/elite wins; WEC/non-UFC excluded. |
| Holly Holm | Women | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Audit title upset credit, elite wins, and post-prime losses. |
| Mackenzie Dern | Women | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | 🟡 | Audit if score/title status is still current and UFC-only. |
| Kayla Harrison | Women | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Confirm UFC-only sample, title win, and active scoring. |
| Jessica Andrade | Women | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Audit multi-division UFC value and loss context. |
| Carla Esparza | Women | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Confirm actual title-fight wins/defenses and quality wins. |
| Julianna Peña | Women | 🟡 | ✅ | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Snapshot patched: title wins 2, elite/top-5 wins 2. Needs canonical object cleanup and score review. |
| Alexa Grasso | Women | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Audit draw/title credit, Shevchenko ledger, and current score. |

### Batch 2 — newer men additions

| Fighter | Board | Scores | Snapshot | Title context | Quality wins | Prime/rounds | Loss context | Display | Watch | Photos | Compare | Ledger | Current issue / next step |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Brock Lesnar | Men | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Audit short-window title case and loss penalty. |
| Tony Ferguson | Men | 🟡 | 🟡 | ➡️ | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Audit interim/elite-win credit and prime-collapse treatment. |
| Michael Bisping | Men | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Audit title win, defense/loss context, and elite wins. |
| Chael Sonnen | Men | 🟡 | 🟡 | ➡️ | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Confirm bottom OVR anchor and title-loss/no-title context. |
| Robbie Lawler | Men | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Audit title-fight record, Hendricks/MacDonald value, losses. |
| Junior dos Santos | Men | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Audit round rows and exact elite-win count. |
| Tito Ortiz | Men | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Audit early-era title volume and opponent-strength discount. |
| Deiveson Figueiredo | Men | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Audit draw-retain/missed-weight title logic. |
| Khamzat Chimaev | Men | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | 🟡 | Audit active sample, title credit, and quality-win cap. |

### Batch 3 — requested score audits

These should be reviewed after obvious profile-stat issues are cleaned up.

| Fighter | Board | Scores | Snapshot | Title context | Quality wins | Prime/rounds | Loss context | Display | Watch | Photos | Compare | Ledger | Current issue / next step |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Matt Hughes | Men | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ✅ | ✅ | ✅ | Full UFC-only score audit already started; review Quality Wins and longevity. |
| Khabib Nurmagomedov | Men | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Confirm championship vs dominance balance and no loss penalty. |
| Conor McGregor | Men | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Audit peak/two-division title credit and loss context. |
| Henry Cejudo | Men | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ❌ | ✅ | ✅ | Audit title wins, DJ/TJ/Cruz value, and late losses. |

## Full board audit backlog

### Men

| Fighter | Audit status | Notes |
|---|---|---|
| Jon Jones | 🟡 needs canonical verification | Benchmark, 99 OVR, Hamill DQ not treated as real competitive loss. |
| Georges St-Pierre | 🟡 needs canonical verification | Confirm Hughes/Serra loss context and title-fight volume. |
| Demetrious Johnson | 🟡 needs canonical verification | Confirm flyweight division-strength discount and UFC-only exclusion of ONE. |
| Anderson Silva | 🟡 needs canonical verification | Confirm Weidman losses count in-prime; later losses post-prime. |
| Islam Makhachev | 🟡 needs canonical verification | Prime starts around Drew Dober unless updated. |
| Khabib Nurmagomedov | 🟡 in requested audit batch | No UFC loss penalty; lightweight strength high. |
| Alexander Volkanovski | 🟡 needs canonical verification | Islam losses use upward-division elite-loss rule. |
| Randy Couture | 🟡 needs canonical verification | Audit multi-era title value and loss context. |
| Max Holloway | 🟡 needs canonical verification | Audit Volk trilogy, Aldo wins, featherweight longevity. |
| Kamaru Usman | 🟡 needs canonical verification | Audit title defenses, Woodley/Colby/Masvidal/Burns wins. |
| Jose Aldo | 🟡 needs canonical verification | UFC-only excludes WEC; historical context copy allowed. |
| Matt Hughes | 🟡 in requested audit batch | Quality Wins/longevity likely need close review. |
| Daniel Cormier | 🟡 needs canonical verification | Audit LHW/HW split, Jones losses, Stipe rivalry. |
| Stipe Miocic | 🟡 needs canonical verification | Audit HW title volume and DC/Ngannou context. |
| Dricus du Plessis | 🟡 needs canonical verification | Active champion; score may need current review. |
| Tyron Woodley | 🟡 needs canonical verification | Audit prime extension and Burns/Usman losses. |
| Ilia Topuria | 🟡 needs canonical verification | Active sample; score may move quickly. |
| Israel Adesanya | 🟡 needs canonical verification | Audit Pereira/DDP/Strickland losses and MW title volume. |
| Aljamain Sterling | 🟡 needs canonical verification | Audit controversial/valid title credits and BW depth. |
| Petr Yan | 🟡 needs canonical verification | Audit close losses/DQ context. |
| Cain Velasquez | 🟡 needs canonical verification | Audit short apex vs injuries/longevity. |
| Merab Dvalishvili | 🟡 needs canonical verification | Active sample; audit title and elite-win pace. |
| B.J. Penn | 🟡 needs canonical verification | UFC-only only; Pride/K-1/non-UFC context excluded. |
| Alex Pereira | 🟡 needs canonical verification | Audit rapid two-division title value and Gane update if present. |
| Chuck Liddell | 🟡 needs canonical verification | Audit early LHW era and late losses. |
| Junior dos Santos | 🟡 in newer men batch | Profile stats and round rows need verification. |
| Tito Ortiz | 🟡 in newer men batch | Early-era title volume/opponent discount. |
| Deiveson Figueiredo | 🟡 in newer men batch | Draw/missed-weight title logic. |
| Khamzat Chimaev | 🟡 in newer men batch | Active, small sample, title/quality cap. |
| Dustin Poirier | 🟡 needs canonical verification | Audit no-undisputed-title but elite LW wins. |
| T.J. Dillashaw | 🟡 needs canonical verification | Audit title volume and PED/layoff context if displayed. |
| Justin Gaethje | 🟡 needs canonical verification | Audit interim value and elite losses. |
| Dominick Cruz | 🟡 needs canonical verification | WEC excluded; UFC-only injury gaps. |
| Francis Ngannou | 🟡 needs canonical verification | UFC-only short title run; no PFL/boxing scoring. |
| Charles Oliveira | 🟡 needs canonical verification | Missed-weight title logic and elite LW wins. |
| Henry Cejudo | 🟡 in requested audit batch | Title/elite wins and late losses. |
| Frankie Edgar | 🟡 needs canonical verification | Audit LW title reign and multi-division longevity. |
| Lyoto Machida | 🟡 needs canonical verification | Audit title credit and MW/LHW quality wins. |
| Conor McGregor | 🟡 in requested audit batch | Two-division title credit, short elite window. |
| Sean Strickland | 🟡 needs canonical verification | Audit title upset and score placement. |
| Robert Whittaker | 🟡 needs canonical verification | Audit prime MW elite wins and Adesanya losses. |
| Sean O'Malley | 🟡 needs canonical verification | Audit Yan/Sterling/Vera/Dvalishvili context. |
| Dan Henderson | 🟡 needs canonical verification | UFC-only only; Pride excluded from score. |
| Brock Lesnar | 🟡 in newer men batch | Short-window title case. |
| Tony Ferguson | 🟡 in newer men batch | Interim/prime streak vs late losses. |
| Michael Bisping | 🟡 in newer men batch | Title win and elite-win value. |
| Chael Sonnen | 🟡 in newer men batch | Bottom anchor/near-title case. |
| Robbie Lawler | 🟡 in newer men batch | Title-fight record and war-era losses. |

### Women

| Fighter | Audit status | Notes |
|---|---|---|
| Amanda Nunes | 🟡 needs canonical verification | Benchmark women case; audit title volume and quality wins. |
| Valentina Shevchenko | 🟡 needs canonical verification | Audit flyweight dominance and Nunes/Grasso context. |
| Joanna Jedrzejczyk | 🟡 needs canonical verification | Audit strawweight title reign and Zhang/Rose losses. |
| Ronda Rousey | 🟡 needs canonical verification | Audit short dominance, title volume, late losses. |
| Zhang Weili | 🟡 in newer women batch | Two-reign SW case. |
| Rose Namajunas | 🟡 in newer women batch | Two-reign SW case and quality wins. |
| Miesha Tate | 🟡 in newer women batch | UFC-only title case; Strikeforce excluded. |
| Holly Holm | 🟡 in newer women batch | Nunes/Rousey context, losses. |
| Mackenzie Dern | 🟡 in newer women batch | Current status and title score need review. |
| Kayla Harrison | 🟡 in newer women batch | UFC-only sample; PFL excluded. |
| Jessica Andrade | 🟡 in newer women batch | Multi-division UFC value. |
| Carla Esparza | 🟡 in newer women batch | Two-time champ, title context. |
| Julianna Peña | 🟡 in newer women batch | Snapshot patched; full canonical cleanup still needed. |
| Alexa Grasso | 🟡 in newer women batch | Shevchenko win/draw/title-credit audit. |

## Locked scoring reminders

- UFC-only scoring.
- No Pride, WEC, Strikeforce, Bellator, ONE, PFL, regional, or boxing scoring in the main ranking.
- Non-UFC achievements may be mentioned only as context.
- Jon Jones' Matt Hamill DQ is not treated like a real competitive loss.
- Volkanovski's Islam losses use the upward-division elite-loss rule.
- Score and snapshot can be updated together during audit, but every changed score needs a short explanation.
