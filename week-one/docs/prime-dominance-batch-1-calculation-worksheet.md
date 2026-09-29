# Prime Dominance Batch 1 Calculation Worksheet

Last updated: 2026-07-04

Purpose: calculate the first Prime Dominance batch using Cody's locked data-first formula.

No live app score changes are approved from this worksheet.

Related docs:

- `docs/prime-dominance-data-audit.md`
- `docs/prime-dominance-batch-1-data-worksheet.md`
- `docs/prime-dominance-batch-1-locked-calls.md`

---

# Locked formula

Prime Dominance / 30:

| Component | Max |
|---|---:|
| Prime record score | 6 |
| Prime rounds-won score | 6 |
| Consecutive title-defense dominance | 7 |
| Prime finish/stoppage score | 5 |
| Prime loss safety | 4 |
| Prime sample confidence | 2 |
| **Total** | **30** |

Important note: this formula intentionally makes **consecutive title defenses a huge marker**. That means fighters with shorter title-defense streaks, even if they were extremely dominant, will not automatically max this category.

---

# Scoring guide used in this batch

## Prime record score / 6

| Profile | Range |
|---|---:|
| Undefeated prime | 5.75-6.00 |
| One close/elite prime loss | 5.00-5.50 |
| One bad or finished prime loss | 4.25-5.00 |
| Multiple prime losses | 3.00-4.50 |
| Mixed/chaotic prime | below 3.50 |

## Rounds-won score / 6

| Prime rounds-won % | Range |
|---|---:|
| 85%+ | 6.00 |
| 80-84.9% | 5.50-5.90 |
| 70-79.9% | 4.75-5.50 |
| 60-69.9% | 3.75-4.75 |
| 50-59.9% | 2.50-3.75 |
| Under 50% | below 2.50 |

## Consecutive title-defense dominance / 7

| Best consecutive UFC title defenses | Range |
|---|---:|
| 10+ | 7.00 |
| 7-9 | 6.00-6.75 |
| 4-6 | 4.75-5.75 |
| 2-3 | 3.25-4.50 |
| 1 | 1.75-2.75 |
| 0 | 0.00-1.00 |

## Prime finish/stoppage score / 5

| Profile | Range |
|---|---:|
| Historic finisher / frequent elite stoppages | 4.50-5.00 |
| Strong finisher | 3.50-4.50 |
| Moderate finisher / damage-heavy decision fighter | 2.50-3.50 |
| Low finisher but dominant controller | 1.50-2.75 |
| Low finish / low separation | below 1.50 |

## Prime loss safety / 4

Start at 4 and subtract for prime blemishes.

| Blemish | Typical effect |
|---|---:|
| Prime loss to champ/top-5 | -0.75 |
| Prime loss to non-elite | -1.50 |
| Finished in prime loss | extra -0.75 |
| Upward-division elite loss | -0.25 to -0.50 |
| Weird technical/non-competitive result | 0 or tiny context note |

## Prime sample confidence / 2

| Sample | Range |
|---|---:|
| Long elite/title prime | 1.80-2.00 |
| Solid champion/elite prime | 1.50-1.90 |
| Short but proven elite prime | 1.00-1.50 |
| Tiny/active sample | under 1.00 |

---

# Batch 1 calculated scores

## Summary table

| Fighter | Current Prime | Calculated Prime | Change | Main driver |
|---|---:|---:|---:|---|
| Jon Jones | 27.20 | 27.30 | +0.10 | Undefeated competitive prime, 8-defense streak, no finish losses; close late fights cap round control. |
| Georges St-Pierre | 22.73 | 24.10 | +1.37 | 9-defense streak and elite round control outweigh lower finish rate; Serra keeps him below the cleanest primes. |
| Demetrious Johnson | 23.42 | 26.35 | +2.93 | 11-defense streak, no finish losses, strong finish/control blend; Cejudo 2 prevents perfection. |
| Anderson Silva | 20.35 | 24.25 | +3.90 | 10-defense streak and historic finish rate; Weidman losses sharply cap safety. |
| Khabib Nurmagomedov | 28.82 | 26.45 | -2.37 | Undefeated dominance stays elite, but 3-defense streak and shorter UFC elite-prime sample limit the new formula. |
| Alexander Volkanovski | 16.74 | 21.55 | +4.81 | 5-defense FW streak and strong same-division prime; Topuria and Islam context cap safety. |
| Max Holloway | 17.85 | 20.10 | +2.25 | Long elite prime, durability, and volume rise; Volk rivalry/title-prime cap keeps him below Volk. |
| Amanda Nunes | 23.79 | 25.35 | +1.56 | 7 total title defenses across belts and elite finish rate; Pena finish loss caps safety. |

---

## Jon Jones

Locked prime treatment:

```text
Bader/Shogun 2011 through Reyes 2020, with Gane as HW extension.
Hamill DQ excluded as competitive prime loss.
Stipe 2024 excluded from Prime Dominance.
```

Working prime inputs:

| Field | Value | Notes |
|---|---:|---|
| Prime record | 16-0 | DC 2 NC noted separately; Hamill DQ excluded. |
| Prime wins | 16 | Includes Gane extension. |
| Prime losses | 0 | No competitive prime loss. |
| Prime finished losses | 0 | Never finished. |
| Best consecutive title-defense streak | 8 | First LHW reign streak. |
| Prime finish rate | about 50% | Finish-heavy early/mid prime, more decision-heavy late prime. |
| Prime rounds-won profile | strong, but capped | Gus 1, Santos, Reyes reduce round-control score. |
| Sample confidence | elite long sample | Longest/highest confidence batch case. |

Component calculation:

| Component | Score |
|---|---:|
| Prime record score / 6 | 6.00 |
| Prime rounds-won score / 6 | 5.25 |
| Consecutive title-defense dominance / 7 | 6.50 |
| Prime finish/stoppage score / 5 | 3.65 |
| Prime loss safety / 4 | 4.00 |
| Prime sample confidence / 2 | 1.90 |
| **Calculated Prime Dominance** | **27.30** |

Why not higher:

- Not because of losses.
- The cap is from close/controversial late-prime fights: Gustafsson 1, Santos, Reyes.
- Finish rate also drops later in the LHW reign.

---

## Georges St-Pierre

Locked prime treatment:

```text
Post-Hughes-loss prime includes Bisping as late-prime extension.
Hughes 2004 stays early/pre-prime elite loss.
Serra 2007 is the counted prime finished loss.
```

Working prime inputs:

| Field | Value | Notes |
|---|---:|---|
| Prime record | 18-1 | Existing app framing after first Hughes loss; Bisping included. |
| Prime wins | 18 | Includes Bisping as late-prime extension. |
| Prime losses | 1 | Serra. |
| Prime finished losses | 1 | Serra TKO. |
| Best consecutive title-defense streak | 9 | WW title-defense streak after Serra. |
| Prime finish rate | low/moderate | Dominated by control more than finishes after Serra. |
| Prime rounds-won profile | elite | One of the best round-control profiles ever. |
| Sample confidence | elite long sample | Long title-prime plus Bisping extension. |

Component calculation:

| Component | Score |
|---|---:|
| Prime record score / 6 | 5.35 |
| Prime rounds-won score / 6 | 5.75 |
| Consecutive title-defense dominance / 7 | 6.65 |
| Prime finish/stoppage score / 5 | 2.35 |
| Prime loss safety / 4 | 2.00 |
| Prime sample confidence / 2 | 2.00 |
| **Calculated Prime Dominance** | **24.10** |

Why not higher:

- Serra loss hits both record consistency and safety because it was a finished loss.
- Lower post-Serra finish rate keeps him below DJ/Anderson/Amanda in stoppage separation.

Why still rises:

- The old score undersold how dominant GSP was round-to-round and how massive a 9-defense streak is.

---

## Demetrious Johnson

Locked prime treatment:

```text
Benavidez 1 through Cejudo 2.
Cejudo 2 included as close prime-ending loss.
ONE excluded.
```

Working prime inputs:

| Field | Value | Notes |
|---|---:|---|
| Prime record | 12-1 | Cejudo 2 included. |
| Prime wins | 12 | Title win plus 11 defenses. |
| Prime losses | 1 | Cejudo 2 split decision. |
| Prime finished losses | 0 | No UFC prime finish loss. |
| Best consecutive title-defense streak | 11 | UFC flyweight record streak. |
| Prime finish rate | about 50% | Strong finishing stretch for a smaller champion. |
| Prime rounds-won profile | strong | Excellent pace/control but not quite GSP-level round smothering. |
| Sample confidence | elite title sample | 12 title wins/defenses before close loss. |

Component calculation:

| Component | Score |
|---|---:|
| Prime record score / 6 | 5.40 |
| Prime rounds-won score / 6 | 5.20 |
| Consecutive title-defense dominance / 7 | 7.00 |
| Prime finish/stoppage score / 5 | 3.75 |
| Prime loss safety / 4 | 3.25 |
| Prime sample confidence / 2 | 1.75 |
| **Calculated Prime Dominance** | **26.35** |

Why not higher:

- Cejudo 2 breaks the perfect-prime case.
- Flyweight dominance was great, but round control is not treated as quite as overwhelming as GSP/Khabib/Jon.

Why he rises:

- The old score did not give enough credit for 11 straight title defenses plus no finish losses.

---

## Anderson Silva

Locked prime treatment:

```text
Leben / Franklin 1 through Weidman 2.
Both Weidman losses included as prime-context cap events.
Weidman 2 noted as weird injury-finish context.
Post-Weidman losses excluded as post-prime.
```

Working prime inputs:

| Field | Value | Notes |
|---|---:|---|
| Prime record | 16-2 | Includes Weidman 1 and 2. |
| Prime wins | 16 | UFC record win streak. |
| Prime losses | 2 | Weidman 1 and 2. |
| Prime finished losses | 2 official, 1.5 practical | Weidman 1 clear KO; Weidman 2 official TKO with weird leg-injury context. |
| Best consecutive title-defense streak | 10 | Middleweight title-defense streak. |
| Prime finish rate | historic | High finish rate and unmatched aura. |
| Prime rounds-won profile | good but not elite-control | Often created danger/finishes more than round-smothering control. |
| Sample confidence | elite long title sample | Long championship prime. |

Component calculation:

| Component | Score |
|---|---:|
| Prime record score / 6 | 4.65 |
| Prime rounds-won score / 6 | 4.35 |
| Consecutive title-defense dominance / 7 | 7.00 |
| Prime finish/stoppage score / 5 | 4.85 |
| Prime loss safety / 4 | 1.55 |
| Prime sample confidence / 2 | 1.85 |
| **Calculated Prime Dominance** | **24.25** |

Why not higher:

- The Weidman losses matter because they are locked as prime/prime-context losses.
- Anderson was not a pure round-control fighter, so rounds-won score is not maxed.

Why he rises:

- The old score badly undersold the combination of 10 defenses and historic stoppage dominance.

---

## Khabib Nurmagomedov

Locked prime treatment:

```text
Rafael dos Anjos 2014 through Justin Gaethje 2020.
Elite-prime record = 8-0.
Full UFC context = 13-0.
```

Working prime inputs:

| Field | Value | Notes |
|---|---:|---|
| Prime record | 8-0 | Elite-prime window only. |
| Prime wins | 8 | RDA through Gaethje. |
| Prime losses | 0 | No UFC losses. |
| Prime finished losses | 0 | Never finished. |
| Best consecutive title-defense streak | 3 | Conor, Dustin, Gaethje. |
| Prime finish rate | 50.0% | Johnson, Conor, Dustin, Gaethje in the RDA-through-Gaethje window. |
| Prime rounds-won profile | elite | One of the strongest control cases ever. |
| Sample confidence | strong but shorter | Elite sample is perfect but shorter than DJ/GSP/Jon/Anderson/Amanda. |

Component calculation:

| Component | Score |
|---|---:|
| Prime record score / 6 | 6.00 |
| Prime rounds-won score / 6 | 5.90 |
| Consecutive title-defense dominance / 7 | 4.45 |
| Prime finish/stoppage score / 5 | 4.10 |
| Prime loss safety / 4 | 4.00 |
| Prime sample confidence / 2 | 2.00 |
| **Calculated Prime Dominance** | **26.45** |

Why this drops from current:

- The new formula makes consecutive title defenses a huge marker.
- Khabib's dominance is nearly perfect, but the UFC title-defense streak is 3, not 8-11.

Important model consequence:

```text
If we want Khabib near 29 in Prime Dominance, this formula cannot weight consecutive title defenses this heavily.
```

My lean: the 26.45 result is defensible under Cody's new data-first/title-defense-heavy formula.

---

## Alexander Volkanovski

Locked prime treatment:

```text
Prime starts around Jose Aldo 2019.
Islam losses are separate upward-division context, not normal FW prime losses.
Topuria is a same-division prime loss, but Volk is still considered prime after Topuria unless later results prove decline.
```

Working prime inputs:

| Field | Value | Notes |
|---|---:|---|
| Prime record | 7-1 FW, plus 0-2 upward Islam context | Aldo through Yair wins, Topuria loss, Islam separate. |
| Prime wins | 7 FW wins | Aldo, Max 1, Max 2, Ortega, Korean Zombie, Max 3, Yair. |
| Prime losses | 1 same-division, 2 upward-division context | Topuria plus Islam 1/2. |
| Prime finished losses | 1 same-division, 1 upward-division | Topuria KO, Islam 2 KO. |
| Best consecutive title-defense streak | 5 | Holloway 2 through Yair. |
| Prime finish rate | about 28.6% FW prime | Korean Zombie and Yair finishes from proposed FW-prime wins. |
| Prime rounds-won profile | strong | Very strong FW round control, but Max 2/Islam/Topuria context caps. |
| Sample confidence | strong champion sample | Long enough FW title run. |

Component calculation:

| Component | Score |
|---|---:|
| Prime record score / 6 | 4.95 |
| Prime rounds-won score / 6 | 5.05 |
| Consecutive title-defense dominance / 7 | 5.35 |
| Prime finish/stoppage score / 5 | 2.55 |
| Prime loss safety / 4 | 1.85 |
| Prime sample confidence / 2 | 1.80 |
| **Calculated Prime Dominance** | **21.55** |

Why he rises a lot:

- Current score overpunishes Islam/upward-division and later blemish context.
- A 5-defense FW streak is a major Prime Dominance marker.

Why not higher:

- Low finish rate compared with Anderson/Amanda/Khabib.
- Topuria same-division finish loss is a real prime blemish.
- Islam 2 finish is lighter than normal because it was upward-division, but it is still safety context.

---

## Max Holloway

Locked prime treatment:

```text
Title prime and elite prime are separate concepts.
Title prime = championship-reign/title-defense dominance window.
Elite prime = broader high-level window that continues after losing the belt.
```

Working treatment:

- Volk rivalry caps Max's title-prime dominance.
- Max's elite prime continues after the belt because of Kattar, Yair, Allen, Zombie, Gaethje-type results.
- Losing the belt is not automatic prime end.

Working prime inputs:

| Field | Value | Notes |
|---|---:|---|
| Prime record | mixed long elite window | Strong wins plus Volk/Dustin/Topuria-type elite losses. |
| Prime wins | broad elite-window count TBD | Needs final exact fight list before data module. |
| Prime losses | multiple elite losses | Volk trilogy, Dustin LW, Topuria/current context depending timeline. |
| Prime finished losses | 0 or 1 depending Topuria/current timeline | Historically elite durability; current-table Topuria context needs exact treatment. |
| Best consecutive title-defense streak | 3 | Aldo 2, Ortega, Edgar. |
| Prime finish rate | moderate/high volume damage | Finish rate not as high as Anderson/Amanda, but damage separation is real. |
| Prime rounds-won profile | strong | Volume and pace won many rounds, but Volk rivalry caps. |
| Sample confidence | elite long sample | Long elite relevance. |

Component calculation:

| Component | Score |
|---|---:|
| Prime record score / 6 | 4.25 |
| Prime rounds-won score / 6 | 4.65 |
| Consecutive title-defense dominance / 7 | 4.15 |
| Prime finish/stoppage score / 5 | 3.35 |
| Prime loss safety / 4 | 1.80 |
| Prime sample confidence / 2 | 1.90 |
| **Calculated Prime Dominance** | **20.10** |

Why he rises:

- The old score undersold durability, pace, and long elite-prime sample.

Why not higher:

- Volk rivalry is a real cap on title-prime dominance.
- Consecutive title-defense streak is 3, not 5+.
- Multiple elite losses keep record/safety below the top tier.

Data note:

Max needs the most careful exact fight-list pass before live implementation because his title prime and elite prime are not the same thing.

---

## Amanda Nunes

Locked prime treatment:

```text
True title-level prime starts around Valentina 1 / Tate.
Use 7 total successful UFC title defenses across belts, with BW-only 5 noted.
Pena 1 is a real prime/late-prime finished loss.
```

Working prime inputs:

| Field | Value | Notes |
|---|---:|---|
| Prime record | about 13-1 | Valentina 1/Tate range through Aldana. |
| Prime wins | about 13 | Exact start point needs final structured data. |
| Prime losses | 1 | Pena 1. |
| Prime finished losses | 1 | Pena submission. |
| Best consecutive title-defense streak | 7 total, 5 BW-only noted | Cody locked 7 total successful defenses across belts. |
| Prime finish rate | elite | Multiple elite stoppages across two divisions. |
| Prime rounds-won profile | strong | Not pure GSP-style round control, but usually dominant. |
| Sample confidence | elite long sample | Long two-division championship sample. |

Component calculation:

| Component | Score |
|---|---:|
| Prime record score / 6 | 5.25 |
| Prime rounds-won score / 6 | 4.90 |
| Consecutive title-defense dominance / 7 | 6.10 |
| Prime finish/stoppage score / 5 | 4.85 |
| Prime loss safety / 4 | 2.25 |
| Prime sample confidence / 2 | 2.00 |
| **Calculated Prime Dominance** | **25.35** |

Why she rises:

- The old score slightly undersold two-division finishing dominance and the 7-defense cross-belt streak.

Why not higher:

- Pena 1 is a real prime/late-prime finished loss.
- Round control was very good, but her dominance was more damage/finish-driven than scorecard-control driven.

---

# Main model consequence

This data-first formula changes the Prime Dominance shape.

## Biggest risers

| Fighter | Why |
|---|---|
| Volkanovski | Current score overpunishes upward-division/later-loss context. |
| Anderson | Old score badly undersold 10 defenses + historic finishing aura. |
| DJ | 11 defenses become properly rewarded. |
| Max | Durability/volume/elite-prime sample get more credit. |

## Biggest drop

| Fighter | Why |
|---|---|
| Khabib | New formula heavily rewards consecutive title defenses, and Khabib's streak is 3. His undefeated dominance still scores elite, just not 29-level under this version. |

# Cody decision point before live changes

The only major philosophical question left:

```text
Are we okay with Khabib falling from 28.82 to about 26.45 because consecutive title defenses now carry 7 points?
```

My take: yes, if we truly want consecutive title defenses to be a huge checkable Prime Dominance marker.

If Cody wants Khabib closer to 28-29, then title-defense streak should be 5 points instead of 7, with the extra 2 points moved into prime record/control dominance.

# Next step

If these scores are directionally accepted, the next task is to calculate Batch 2:

- Kamaru Usman
- Israel Adesanya
- Jose Aldo
- Matt Hughes
- Stipe Miocic
- Daniel Cormier
- Cain Velasquez
- Charles Oliveira
- Islam Makhachev

Do not make Prime Dominance live until at least the top 20-ish men and the women board have been recalculated under the same formula.