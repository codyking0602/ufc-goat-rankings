# Opponent Quality Audit Pass

Last updated: 2026-07-03

Purpose: make the Opponent Quality / Quality Wins category simple, reviewable, and formula-driven. This is the audit trail before scoring-table edits are made.

## Core rule

Opponent Quality is a 25-point category.

```text
Opponent Quality Score = 25 × Fighter Opponent Quality Index ÷ Current Best Opponent Quality Index
```

Current standard: Georges St-Pierre, Opponent Quality Score 25.00.

If a future fighter passes GSP's audited Opponent Quality Index, that fighter becomes the new 25-point standard and everyone else scales down.

## What this category measures

This category asks:

> Who did this fighter beat in the UFC, how good were they at the time, and how strong was that division/context?

It does not measure title volume, prime dominance, longevity, or losses. Those live in the other categories.

## Locked simplified credit table

Cody locked the simplified version on 2026-07-03.

| Win type | Credit | Plain-English rule |
|---|---:|---|
| Beat sitting UFC champion | 1.25 | The cleanest opponent-quality proof. |
| Beat elite top-5 / title-level contender | 1.00 | Main building block of the category. |
| Beat strong ranked contender / former champ still good | 0.50 | Good résumé win, but not full elite credit. |
| Beat name-value guy past prime / future elite before prime | 0.25 | Small context credit only. |
| Weird / injury / fluky win | Cody call, usually 0.25-0.50 | Count the win, but do not pretend it was clean proof. |
| Loss / no contest / draw | 0.00 | No win, no opponent-quality credit. |

## Locked diminishing returns rule

This category should reward repeated elite proof, but it cannot become a raw-volume contest.

Use this simple diminishing-return step after assigning each UFC win its base credit:

| Credit bucket | Treatment |
|---|---|
| First 8 elite wins, sorted by credit | 100% value |
| Elite wins 9-12 | 75% value |
| Elite wins after 12 | 50% value |
| Support wins under 1.00 credit | Add normally, but support total is capped at 2.00 index points |

Definition: an elite win is any win worth 1.00 or 1.25 before diminishing returns. Support wins are 0.50 or 0.25 wins.

## Locked simple context rules

| Context | Locked treatment |
|---|---|
| Division strength | Can slightly bump or lower the final index, but do not create complicated per-win math. Default band is usually 0.90-1.10. |
| Close/controversial official win | Counts in Opponent Quality; dominance concerns move to Prime Dominance. |
| Repeat elite wins | Count separately if the opponent was still elite at the time, then diminishing returns handles volume. |
| Partial/name wins | Help the résumé, but the 2.00 support cap stops them from driving the category. |
| Non-UFC wins | Excluded from score; context only. |

## Required scoring workflow

No Opponent Quality score should be manually slotted.

Use this sequence:

```text
1. List every UFC win.
2. Assign base credit using the locked table.
3. Apply diminishing returns.
4. Apply one broad division/era adjustment if needed.
5. Produce Opponent Quality Index.
6. Scale to 25 using the current benchmark.
```

Important: previous “recommended OQ ranges” were directional only and are no longer enough to approve score edits. Live changes require a computed index.

---

# Batch 1A — actual UFC win-by-win audit

Status: score changes are still paused. These tables are the audit base before final score corrections.

## Georges St-Pierre — benchmark

Current OQ: 25.00.

| UFC win | Base credit | Reason |
|---|---:|---|
| Karo Parisyan | 0.25 | early quality UFC win, not clean elite credit |
| Jay Hieron | 0.00 | UFC win, not counted for quality tier |
| Jason Miller | 0.50 | strong ranked/supporting WW win |
| Frank Trigg | 0.50 | strong ranked/supporting WW win |
| Sean Sherk | 0.50 | strong ranked/supporting WW win |
| B.J. Penn 1 | 1.00 | elite/top-5 opponent |
| Matt Hughes 2 | 1.25 | sitting UFC champion |
| Josh Koscheck 1 | 1.00 | elite/top-5 opponent |
| Matt Hughes 3 | 1.00 | elite/top-5/former champion still good |
| Matt Serra 2 | 1.25 | sitting UFC champion |
| Jon Fitch | 1.00 | elite/top-5 opponent |
| B.J. Penn 2 | 0.50 | cross-division champion/elite, not full same-division credit |
| Thiago Alves | 1.00 | elite/top-5 opponent |
| Dan Hardy | 1.00 | title-level/top-5 contender by ranking logic |
| Josh Koscheck 2 | 1.00 | elite/top-5 opponent |
| Jake Shields | 1.00 | elite/top-5 opponent |
| Carlos Condit | 1.00 | elite/top-5/interim champion opponent |
| Nick Diaz | 1.00 | elite/top-5 opponent at the time |
| Johny Hendricks | 1.00 | elite/top-5 opponent; close official win |
| Michael Bisping | 1.25 | sitting UFC champion, second division |

Audit note: GSP remains the benchmark unless another fighter's computed index passes him.

## Jon Jones

Current OQ: 16.92.

| UFC win | Base credit | Reason |
|---|---:|---|
| Andre Gusmao | 0.00 | UFC win, no quality tier |
| Stephan Bonnar | 0.25 | name/supporting early win |
| Jake O'Brien | 0.00 | UFC win, no quality tier |
| Brandon Vera | 0.25 | name/supporting early win |
| Vladimir Matyushenko | 0.25 | name/supporting veteran win |
| Ryan Bader | 1.00 | elite/top-5 contender |
| Mauricio Rua | 1.25 | sitting UFC champion |
| Rampage Jackson | 1.00 | elite/top-5/former champion still good |
| Lyoto Machida | 0.50 | strong former champion/name win, not max tier |
| Rashad Evans | 1.00 | elite/top-5/former champion still good |
| Vitor Belfort | 0.50 | strong name/former champion, cross-context |
| Chael Sonnen | 0.25 | moved-up name-value/title challenger context |
| Alexander Gustafsson 1 | 1.00 | elite/top-5 contender |
| Glover Teixeira | 0.50 | strong ranked/future champion context, not full at-the-time elite credit |
| Daniel Cormier 1 | 1.00 | elite/top-5 opponent |
| Ovince Saint Preux | 0.25 | interim-title context but not elite win tier |
| Alexander Gustafsson 2 | 0.50 | strong former title challenger, diminished from first win |
| Anthony Smith | 1.00 | title-level/top-5 challenger by current table |
| Thiago Santos | 1.00 | title-level/top-5 challenger by current table |
| Dominick Reyes | 1.00 | title-level/top-5 challenger by current table; close official win |
| Ciryl Gane | 1.00 | elite heavyweight/title-level opponent |
| Stipe Miocic | 0.25 | past-prime name-value former champion |

Audit note: Jon has a strong index, but diminishing returns should stop the long title-defense ledger from automatically becoming the category benchmark.

## Alexander Volkanovski

Current OQ: 14.45.

| UFC win | Base credit | Reason |
|---|---:|---|
| Yusuke Kasuya | 0.00 | UFC win, no quality tier |
| Mizuto Hirota | 0.00 | UFC win, no quality tier |
| Shane Young | 0.00 | UFC win, no quality tier |
| Jeremy Kennedy | 0.00 | UFC win, no quality tier |
| Darren Elkins | 0.50 | strong ranked/top-ten support win |
| Chad Mendes | 0.50 | strong former title challenger, just below full elite credit in current row |
| Jose Aldo | 1.00 | elite/top-5 former champion still good |
| Max Holloway 1 | 1.25 | sitting UFC champion |
| Max Holloway 2 | 1.00 | elite/top-5 opponent; close official win |
| Brian Ortega | 1.00 | elite/top-5 title challenger |
| Chan Sung Jung | 0.50 | strong ranked/former title challenger, not full top-five |
| Max Holloway 3 | 1.00 | elite/top-5 opponent, dominant third win |
| Yair Rodriguez | 1.00 | elite/top-5/interim champion opponent |
| Diego Lopes 1 | 1.00 | top-five/vacant title opponent in current app timeline |
| Diego Lopes 2 | 1.00 | top-five/title defense opponent in current app timeline |

Audit note: Volk's computed index should be checked against Jon and Kamaru after diminishing returns, not manually raised.

## Kamaru Usman

Current OQ: 13.63.

| UFC win | Base credit | Reason |
|---|---:|---|
| Hayder Hassan | 0.00 | UFC win, no quality tier |
| Leon Edwards 1 | 0.25 | future champion before elite status |
| Alexander Yakovlev | 0.00 | UFC win, no quality tier |
| Warlley Alves | 0.00 | UFC win, no quality tier |
| Sean Strickland | 0.25 | future champion before elite status, not elite WW at time |
| Sergio Moraes | 0.00 | UFC win, no quality tier |
| Emil Meek | 0.00 | UFC win, no quality tier |
| Demian Maia | 0.50 | strong ranked/former title challenger |
| Rafael dos Anjos | 1.00 | elite/top-5 welterweight at the time |
| Tyron Woodley | 1.25 | sitting UFC champion |
| Colby Covington 1 | 1.00 | elite/top-5 opponent |
| Jorge Masvidal 1 | 1.00 | top-five/title challenger by ranking logic |
| Gilbert Burns | 1.00 | elite/top-5 opponent |
| Jorge Masvidal 2 | 1.00 | top-five/title challenger by ranking logic |
| Colby Covington 2 | 1.00 | elite/top-5 opponent |
| Joaquin Buckley | 1.00 | top-five win in current app timeline |

Audit note: Kamaru's computed index depends heavily on whether Masvidal title fights remain full top-five credit and whether Buckley is included in the current scoring timeline.

## Max Holloway

Current OQ: 19.64.

| UFC win | Base credit | Reason |
|---|---:|---|
| Pat Schilling | 0.00 | UFC win, no quality tier |
| Justin Lawrence | 0.00 | UFC win, no quality tier |
| Leonard Garcia | 0.25 | name/supporting early win |
| Will Chope | 0.00 | UFC win, no quality tier |
| Andre Fili | 0.50 | strong ranked/support win |
| Clay Collard | 0.00 | UFC win, no quality tier |
| Akira Corassani | 0.00 | UFC win, no quality tier |
| Cole Miller | 0.25 | name/supporting win |
| Cub Swanson | 1.00 | elite/top-5 style FW contender win |
| Charles Oliveira | 0.25 | injury/weird win context, not clean full credit |
| Jeremy Stephens | 0.50 | strong ranked contender win |
| Ricardo Lamas | 1.00 | elite/top-5/title-level contender |
| Anthony Pettis | 0.50 | former champion/interim title context, not prime same-division champ credit |
| Jose Aldo 1 | 1.25 | sitting UFC champion |
| Jose Aldo 2 | 1.00 | elite/former champion still good |
| Brian Ortega | 1.00 | elite/top-5 title challenger |
| Frankie Edgar | 0.50 | former champion still good, but older/smaller context |
| Calvin Kattar | 1.00 | elite/top-5 contender |
| Yair Rodriguez | 1.00 | elite/top-5 contender |
| Arnold Allen | 1.00 | elite/top-5 contender |
| Chan Sung Jung | 0.25 | past-prime name-value win |
| Justin Gaethje | 1.00 | elite lightweight/BMF title-level opponent |

Audit note: Diminishing returns are critical for Max because his ledger is very deep. He should stay elite in this category, but the formula must decide how close he gets to GSP.

## Dustin Poirier

Current OQ: 18.85.

| UFC win | Base credit | Reason |
|---|---:|---|
| Josh Grispi | 0.00 | UFC win, no quality tier |
| Jason Young | 0.00 | UFC win, no quality tier |
| Pablo Garza | 0.00 | UFC win, no quality tier |
| Max Holloway 1 | 0.25 | future elite before prime |
| Jonathan Brookins | 0.00 | UFC win, no quality tier |
| Diego Brandao | 0.25 | name/supporting win |
| Akira Corassani | 0.00 | UFC win, no quality tier |
| Carlos Diego Ferreira | 0.50 | strong ranked/supporting LW win |
| Yancy Medeiros | 0.00 | UFC win, no quality tier |
| Joe Duffy | 0.25 | strong name/supporting win |
| Bobby Green | 0.25 | strong name/supporting win |
| Jim Miller | 0.50 | strong veteran/former contender support win |
| Anthony Pettis | 0.50 | former champion still relevant |
| Justin Gaethje 1 | 1.00 | elite/top-5 lightweight win |
| Eddie Alvarez | 1.00 | elite former champion still good |
| Max Holloway 2 | 1.00 | elite/former champion moving up, interim-title context |
| Dan Hooker | 0.50 | strong ranked lightweight win |
| Conor McGregor 2 | 0.50 | former champion still dangerous/name-value win |
| Conor McGregor 3 | 0.25 | weird/injury finish context, partial only |
| Michael Chandler | 1.00 | elite/top-5 lightweight contender |
| Benoit Saint Denis | 0.50 | strong ranked contender win |

Audit note: Dustin should be high, but support-win cap and diminishing returns prevent action-fight volume from becoming the whole category.

## Charles Oliveira

Current OQ: 17.85.

| UFC win | Base credit | Reason |
|---|---:|---|
| Darren Elkins | 0.00 | UFC win, no quality tier at time |
| Efrain Escudero | 0.00 | UFC win, no quality tier |
| Jonathan Brookins | 0.00 | UFC win, no quality tier |
| Eric Wisely | 0.00 | UFC win, no quality tier |
| Andy Ogle | 0.00 | UFC win, no quality tier |
| Hatsu Hioki | 0.25 | name/supporting win |
| Jeremy Stephens | 0.50 | strong ranked/name win |
| Nik Lentz 2 | 0.25 | supporting ranked-ish win |
| Myles Jury | 0.25 | supporting ranked-ish win |
| Will Brooks | 0.25 | name/context win, not UFC elite at time |
| Clay Guida | 0.25 | veteran/name win |
| Christos Giagos | 0.00 | UFC win, no quality tier |
| Jim Miller 2 | 0.50 | strong veteran/former contender support win |
| David Teymur | 0.50 | strong ranked/supporting lightweight win |
| Nik Lentz 3 | 0.25 | supporting win |
| Jared Gordon | 0.00 | UFC win, no quality tier |
| Kevin Lee | 0.50 | strong ranked contender win |
| Tony Ferguson | 0.50 | former interim champ/name still relevant but declining |
| Michael Chandler | 1.00 | elite/top-5 title opponent |
| Dustin Poirier | 1.00 | elite/top-5 lightweight win |
| Justin Gaethje | 1.00 | elite/top-5 lightweight win, stripped-title context belongs in Championship not OQ |
| Beneil Dariush | 1.00 | elite/top-5 lightweight win |

Audit note: Charles has fewer elite wins than Max/GSP, but his best wins are excellent and modern lightweight strength can help final index.

## Aljamain Sterling

Current OQ: 13.90.

| UFC win | Base credit | Reason |
|---|---:|---|
| Cody Gibson | 0.00 | UFC win, no quality tier |
| Takeya Mizugaki | 0.25 | name/supporting veteran win |
| Johnny Eduardo | 0.00 | UFC win, no quality tier |
| Augusto Mendes | 0.00 | UFC win, no quality tier |
| Renan Barao | 0.25 | former champion, clearly declined |
| Brett Johns | 0.50 | strong ranked/supporting BW win |
| Cody Stamann | 0.50 | strong ranked/supporting BW win |
| Jimmie Rivera | 0.50 | strong ranked contender win |
| Pedro Munhoz | 0.50 | strong ranked contender win |
| Cory Sandhagen | 1.00 | elite/top-5 bantamweight win |
| Petr Yan 1 DQ | 0.25 | weird/DQ title win; not clean opponent-quality proof |
| Petr Yan 2 | 1.00 | elite/top-5 bantamweight win |
| T.J. Dillashaw | 0.25 | injury-compromised win |
| Henry Cejudo | 1.00 | elite former two-division champion still credible |
| Calvin Kattar | 0.50 | strong FW contender/name win |
| Brian Ortega | 0.50 | strong former title challenger/name win in current app timeline |
| Youssef Zalal / late supporting win | 0.25 | supporting contender context if included in current app timeline |

Audit note: Aljo's weird/context wins should not be allowed to inflate the score. The support cap handles much of this, but DQ Yan and injured TJ still need locked credit values.

---

# Batch 1A unresolved inputs before computed score

The formula is locked, but these exact base-credit inputs should be confirmed before calculating final indices:

| Fight | Working credit | Question |
|---|---:|---|
| Max over Charles injury-stoppage | 0.25 | Is this enough, or should it be 0.00 because it was not a clean win? |
| Dustin over Conor 3 injury finish | 0.25 | Is partial credit okay, or should injury finish be 0.00? |
| Charles over Gaethje stripped-title fight | 1.00 | Keep as elite Gaethje OQ win even though title context moved to Championship? |
| Aljo over Yan by DQ | 0.25 | Count weird DQ title win as small OQ credit? |
| Aljo over injured TJ | 0.25 | Count injury-compromised defense as small OQ credit? |
| Jon over Smith/Santos/Reyes | 1.00 each | Keep all as full title-level/top-5 wins? |
| Kamaru over Masvidal twice | 1.00 each | Keep full top-five/title-challenger credit by ranking logic? |

# Next action

After the unresolved inputs are locked, calculate each fighter's Opponent Quality Index using the diminishing-return rule. Then scale the final Opponent Quality score to the benchmark and only then consider a live correction module.