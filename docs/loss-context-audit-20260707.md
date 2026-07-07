# UFC-only Loss Context Audit — 2026-07-07

Purpose: create the first full-board loss-context target for the formula calculator. This is **not** a score update by itself. It is the working audit that should drive future `losses: []` ledger entries and calculated penalties.

## Locked rules

| Rule | Penalty |
|---|---:|
| Pre-prime loss to champion/top-5 | -0.75 |
| Pre-prime loss to non-elite | -1.25 |
| Prime loss to champion/top-5 | -1.50 |
| Prime loss to non-elite | -4.00 |
| Normal finish add-on | -0.75 |
| Reduced injury/technical finish add-on | -0.50 |
| Post-prime loss | 0.00 |
| Prime upward-division loss to champ/top-5 | -0.75 |
| Normal upward-division finish add-on | -0.50 |
| Reduced upward injury finish add-on | -0.25 |

## Cody decisions locked for this audit

- Keep only two opponent tiers: `championTop5` and `nonElite`.
- No pre-prime cap. All pre-prime UFC losses count normally.
- Close/controversial decisions use normal penalty, with notes only.
- Short-notice is notes only unless already covered by upward-division logic.
- Upward-division reduced rule applies to the first/upward risk. Once established in that division, losses count normally.
- Post-prime losses stay in the record/profile but score 0.
- Jon Jones/Matt Hamill DQ is excluded as a real competitive loss.
- Petr Yan/Sterling DQ is reduced to -0.75.
- Injury/technical finish examples use reduced finish treatment.

## Current-result verification notes before implementation

These active/current calls need to be treated as current facts at implementation time:

- Ilia Topuria has a recent UFC lightweight title loss to Justin Gaethje. Target treatment: prime elite finish loss, -2.25.
- Khamzat Chimaev has a recent UFC middleweight title loss to Sean Strickland. Target treatment: prime elite decision loss, -1.50.
- Dricus du Plessis lost the UFC middleweight title to Khamzat Chimaev. Target treatment: prime elite decision loss, -1.50.
- Mackenzie Dern won the vacant UFC strawweight title against Virna Jandiroba. Dern is still in-prime/elite.
- Kayla Harrison beat Julianna Pena for the UFC bantamweight title. Pena/Kayla counts for Pena.
- Natalia Silva beat Jessica Andrade and Rose Namajunas. Andrade post-prime line starts after Natalia Silva; Rose/Silva is counted because Rose was established at flyweight.

---

# Men

| Fighter | Target penalty | Confidence | Loss-context notes |
|---|---:|---|---|
| Jon Jones | 0.00 | High | Hamill DQ excluded. No real competitive UFC loss. |
| Georges St-Pierre | -6.25 | High | Hughes 2004 = pre-prime elite finish -1.50. Serra = prime non-elite finish -4.75. |
| Demetrious Johnson | -2.25 | High | Cruz = pre-prime elite decision -0.75. Cejudo = prime elite decision -1.50. ONE excluded. |
| Anderson Silva | -4.25 | High | Weidman I = prime elite finish -2.25. Weidman II = prime elite reduced injury finish -2.00. Post-prime starts after Weidman II. |
| Islam Makhachev | -2.00 | High | Adriano Martins = pre-prime non-elite finish -2.00. |
| Khabib Nurmagomedov | 0.00 | High | No UFC losses. |
| Alexander Volkanovski | -4.25 | High | Islam I = upward elite decision -0.75. Islam II = upward elite finish -1.25. Topuria = same-division elite finish -2.25. |
| Randy Couture | -10.00 | Medium | Multi-era case. Ricco, Vitor cut stoppage, Chuck losses, and selected title-window losses drive this. Needs exact ledger before scoring write. |
| Max Holloway | -8.25 | High | Conor = pre-prime elite -0.75. Poirier II = upward elite -0.75. Volk trilogy = -4.50. Topuria finish counts = -2.25. |
| Kamaru Usman | -4.50 | High | Edwards KO -2.25. Edwards decision -1.50. Chimaev upward/short-notice elite decision -0.75. |
| Jose Aldo | -10.50 | Medium | McGregor -2.25. Holloway I/II -4.50. Volkanovski counts -1.50. Yan counts -2.25. Vera/Merab post-prime. Moraes remains note-only/transition unless Cody reopens. |
| Matt Hughes | -8.75 | High | Hallman pre-prime non-elite finish -2.00. BJ I -2.25. GSP II/III -4.50. Later decline losses post-prime. |
| Daniel Cormier | -5.25 | High | Jones I -1.50. Jones II NC excluded. Stipe II finish -2.25. Stipe III decision -1.50. |
| Stipe Miocic | -7.25 | High | Struve pre-prime non-elite finish -2.00. JDS I pre-prime elite -0.75. DC I -2.25. Ngannou II -2.25. Jones post-prime = 0. |
| Dricus du Plessis | -1.50 | High/current | Khamzat title loss = prime elite decision -1.50. |
| Tyron Woodley | -3.75 | High | Rory pre-prime elite -0.75. Usman and Burns = prime elite decisions -3.00. Post-prime after Burns. |
| Ilia Topuria | -2.25 | High/current | Gaethje = prime same-division elite finish -2.25. |
| Israel Adesanya | -6.75 | High | Jan = upward elite decision -0.75. Pereira finish -2.25. Strickland decision -1.50. DDP finish -2.25. Post-prime after DDP. |
| Aljamain Sterling | -4.50 | High | Moraes pre-prime elite finish -1.50. O'Malley prime elite finish -2.25. Evloev upward FW elite decision -0.75. |
| Petr Yan | -5.25 | High | Sterling DQ reduced -0.75. Sterling II, O'Malley, Merab decisions -4.50. |
| Cain Velasquez | -4.50 | High | JDS I and Werdum finishes count. Ngannou post-prime/injury = 0. |
| Merab Dvalishvili | -2.00 | High | Ricky Simon pre-prime non-elite technical submission/finish -2.00. |
| B.J. Penn | -9.75 | Medium | Count through Diaz; everything after Diaz post-prime. GSP/Hughes/Edgar/Diaz drive penalty. Needs final line-by-line ledger. |
| Alex Pereira | -3.50 | Medium/current | Adesanya KO = -2.25. Gane HW loss, if active data includes it, is upward elite finish -1.25. |
| Chuck Liddell | -10.75 | Medium | Couture I, Rampage, Jardine, Rashad count. Shogun/Franklin and later post-prime. Jardine non-elite decision creates heavy penalty. |
| Junior dos Santos | -8.25 | High | Cain II decision -1.50. Cain III, Overeem, Stipe II finishes -6.75. Later heavyweight slide post-prime. |
| Tito Ortiz | -7.50 | Medium | Frank Shamrock, Couture, Chuck I/II are counted. Later Evans/Machida/Forrest-era decline needs notes but likely post-prime. |
| Deiveson Figueiredo | -6.75 | Medium/current | Formiga pre-prime elite -0.75. Moreno II/IV finishes -4.50. Yan at established BW = elite decision -1.50. Verify any newer BW losses. |
| Khamzat Chimaev | -1.50 | High/current | Sean Strickland title loss = prime elite decision -1.50. |
| Dustin Poirier | -15.25 | Medium | Conor I pre-prime elite finish -1.50. Michael Johnson prime non-elite finish -4.75. Khabib, Oliveira, Gaethje II, Makhachev finishes = -9.00. Very harsh but follows no-cap/two-tier rule. |
| T.J. Dillashaw | -7.50 | Medium | Dodson pre-prime elite finish -1.50. Assuncao pre-prime elite -0.75. Cruz -1.50. Cejudo finish -2.25. Sterling shoulder = elite loss only -1.50. |
| Justin Gaethje | -11.25 | High | Alvarez, Poirier I, Khabib, Oliveira, Holloway all count as prime elite finishes/losses. |
| Dominick Cruz | -3.75 | High | Garbrandt elite decision -1.50. Cejudo elite finish -2.25. Vera post-prime = 0. |
| Francis Ngannou | -3.00 | High | Stipe I and Derrick Lewis elite/top-contender decisions -3.00 total. |
| Charles Oliveira | -15.25 | Medium | No pre-prime cap. Early UFC losses plus Felder count normally; Islam and Arman count in-prime. This is the biggest literal-formula stress test. |
| Henry Cejudo | -4.50 | Medium | DJ I and Benavidez pre-prime elite decisions -1.50 total. Sterling and Merab comeback losses currently counted -3.00 unless Cody later says return run is post-prime. |
| Frankie Edgar | -6.00 | High | Benson I/II and Aldo I/II elite decisions count. Ortega/Korean Zombie/Vera/Gutierrez are post-prime. |
| Lyoto Machida | -13.50 | Medium | Shogun II, Rampage, Jones, Davis, Weidman, Rockhold, Romero count. Later losses post-prime. Needs careful LHW/MW prime-end note. |
| Conor McGregor | -6.75 | High | Diaz I = prime elite finish -2.25. Khabib = prime elite finish -2.25. Poirier II = prime elite finish -2.25. Post-prime after Poirier II. |
| Sean Strickland | -9.25 | Medium/current | Ponzinibbio, Usman, Elizeu, Pereira, Cannonier, DDP count. Current Khamzat win does not affect penalty. |
| Robert Whittaker | -11.75 | High/current | Court McGee, Wonderboy, Adesanya I/II, DDP, Chimaev count. Post-prime after Chimaev. |
| Sean O'Malley | -3.50 | High | Vera I weird injury reduced -2.00. Merab elite decision -1.50. |
| Dan Henderson | -3.75 | High | UFC-only: Rampage decision -1.50 and Anderson finish -2.25 count. Most late UFC losses post-prime. Pride excluded. |
| Brock Lesnar | -6.00 | High | Mir pre-prime elite finish -1.50. Cain and Overeem elite finishes -4.50. |
| Tony Ferguson | -5.00 | High | Michael Johnson pre-prime non-elite decision -1.25. Gaethje finish -2.25. Oliveira decision -1.50. Later collapse post-prime. |
| Michael Bisping | -15.50 | Medium | Rashad, Hendo, Wanderlei, Chael, Vitor, Rockhold, Kennedy, GSP count. Gastelum short-notice after GSP post-prime. This is harsh due no middle tier. |
| Chael Sonnen | -8.00 | High | Maia finish -2.25. Anderson I/II -4.50. Jones upward elite finish -1.25. Later Rashad/Tito-era not counted. |
| Robbie Lawler | -8.75 | Medium | Diaz, Spratt, Tanner, Hendricks I, Woodley count. Post-prime after Woodley. |

---

# Women

| Fighter | Target penalty | Confidence | Loss-context notes |
|---|---:|---|---|
| Amanda Nunes | -3.75 | High | Zingano pre-prime elite finish -1.50. Pena I = prime elite finish -2.25, not non-elite upset. |
| Valentina Shevchenko | -3.75 | High | Nunes I/II upward BW elite decisions -1.50 total. Grasso finish -2.25. |
| Joanna Jedrzejczyk | -4.50 | High | Rose I finish -2.25. Rose II decision -1.50. Valentina upward elite decision -0.75. Zhang II post-prime/inactive return = 0. |
| Ronda Rousey | -4.50 | High | Holm and Nunes elite finishes -4.50 total. |
| Zhang Weili | -4.50 | High | Rose I finish -2.25. Rose II decision -1.50. Valentina upward elite decision -0.75. |
| Rose Namajunas | -9.00 | Medium/current | Esparza I pre-prime elite finish -1.50. Karolina elite/title-contender decision -1.50. Andrade finish -2.25. Esparza II -1.50. Fiorot upward -0.75. Natalia Silva at established flyweight -1.50. |
| Miesha Tate | -6.00 | High | Zingano pre-prime elite finish -1.50. Rousey and Nunes finishes -4.50. Later Tate losses post-prime after Nunes. |
| Holly Holm | -8.25 | High | Tate finish, Valentina decision, GDR decision, Cyborg upward decision, Nunes finish. Post-prime after Nunes. |
| Mackenzie Dern | -8.00 | Medium/current | Prime starts at Marina Rodriguez main event. Ribas I pre-prime non-elite -1.25. Rodriguez/Yan/Lemos decisions and Andrade finish count. Dern remains prime after winning title. |
| Kayla Harrison | 0.00 | High/current | No UFC loss in current UFC-only sample. PFL excluded. |
| Jessica Andrade | -16.50 | Medium/current | Reneau pre-prime, Joanna, Zhang, Rose II, Shevchenko upward finish, Blanchfield, Suarez, Natalia Silva count. Post-prime after Natalia Silva. Heavy but formula-consistent. |
| Carla Esparza | -9.75 | Medium | Joanna, Suarez, Marina, Yan, Zhang count. Post-prime after Zhang. Needs exact early/second-reign ledger before score write. |
| Julianna Pena | -8.25 | High/current | Valentina finish, GDR finish, Nunes II decision, Kayla title finish count. |
| Alexa Grasso | -7.25 | Medium/current | Herrig pre-prime non-elite, Suarez pre-prime elite finish, Esparza decision, Valentina trilogy decision, Natalia Silva decision count. Draw is not a loss. |

---

# Implementation buckets

## Clean automatic ledgers

These are ready to convert first because the penalty math is straightforward:

- Jon Jones
- Georges St-Pierre
- Demetrious Johnson
- Anderson Silva
- Islam Makhachev
- Khabib Nurmagomedov
- Alexander Volkanovski
- Kamaru Usman
- Daniel Cormier
- Stipe Miocic
- Israel Adesanya
- Petr Yan
- Cain Velasquez
- Dominick Cruz
- Francis Ngannou
- Conor McGregor
- Brock Lesnar
- Tony Ferguson
- Amanda Nunes
- Valentina Shevchenko
- Joanna Jedrzejczyk
- Ronda Rousey
- Zhang Weili
- Miesha Tate
- Holly Holm
- Kayla Harrison
- Julianna Pena

## Needs careful ledger wording but policy is locked

- Jose Aldo
- Matt Hughes
- Tyron Woodley
- Aljamain Sterling
- Merab Dvalishvili
- B.J. Penn
- Alex Pereira
- Chuck Liddell
- Junior dos Santos
- Tito Ortiz
- Deiveson Figueiredo
- Dustin Poirier
- T.J. Dillashaw
- Justin Gaethje
- Henry Cejudo
- Frankie Edgar
- Lyoto Machida
- Sean Strickland
- Robert Whittaker
- Sean O'Malley
- Dan Henderson
- Chael Sonnen
- Robbie Lawler
- Rose Namajunas
- Mackenzie Dern
- Jessica Andrade
- Carla Esparza
- Alexa Grasso

## Formula stress tests

These should be reviewed carefully because the no-cap/two-tier rules create harsh penalties:

- Charles Oliveira — no pre-prime cap makes his early UFC development losses very expensive.
- Dustin Poirier — Michael Johnson plus many elite title-level losses make the number high despite an elite resume.
- Michael Bisping — Kennedy/non-elite bucket and many elite losses make the number high.
- Jessica Andrade — multi-division volume creates a very large penalty.
- Lyoto Machida — long two-division prime makes the count heavy.
- Jose Aldo — UFC-only treatment plus late-prime Volk/Yan losses makes the number heavy.

## Next build step

Create a canonical `losses` array for each fighter with this shape:

```js
{
  opponent: "",
  date: "",
  result: "Decision | KO/TKO | Submission | DQ",
  phase: "prePrime | prime | postPrime",
  opponentTier: "championTop5 | nonElite",
  upwardDivision: false,
  finished: false,
  finishTreatment: "none | normal | reducedInjury",
  counted: true,
  penalty: -1.5,
  rule: "Prime loss to champion/top-5",
  notes: ""
}
```

Then the calculator should sum `losses[].penalty` and compare it to the stored `penalty` / `lossPenalty` field before any ranking score movement.
