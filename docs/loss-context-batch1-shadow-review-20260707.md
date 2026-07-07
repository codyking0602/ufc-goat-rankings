# Loss Context Batch 1 Shadow Review — 2026-07-07

Purpose: review the first clean `losses: []` ledger batch before any stored penalty or ranking movement.

This file is the human-readable review target. The runtime report is exposed in the browser as:

```js
window.UFC_LOSS_CONTEXT_REPORT
window.UFC_SCORING_ENGINE.lossContextReport
```

## Batch 1 fighters

| Fighter | Calculated penalty from ledger | Expected status | Review note |
|---|---:|---|---|
| Jon Jones | 0.00 | Match expected | Hamill DQ is `counted:false`; no real competitive loss. |
| Khabib Nurmagomedov | 0.00 | Match expected | Empty ledger; no UFC losses. |
| Islam Makhachev | -2.00 | Match expected | Adriano Martins pre-prime non-elite finish. |
| Georges St-Pierre | -6.25 | Review expected | Hughes 2004 = -1.50; Serra = prime non-elite finish -4.75. Stored penalty may be lighter if Serra was previously treated differently. |
| Demetrious Johnson | -2.25 | Match expected | Cruz pre-prime elite decision and Cejudo prime elite decision. |
| Anderson Silva | -4.25 | Review expected | Weidman I = -2.25; Weidman II reduced injury finish = -2.00. Stored penalty may still be -4.50 from full finish add-on. |
| Alexander Volkanovski | -4.25 | Match expected | Islam upward losses and Topuria same-division elite finish. |
| Kamaru Usman | -4.50 | Match expected | Edwards KO, Edwards decision, Chimaev upward decision. |
| Daniel Cormier | -5.25 | Match expected | Jones I, Stipe II, Stipe III; Jones II NC excluded. |
| Stipe Miocic | -7.25 | Match expected | Struve, JDS I, DC I, Ngannou II; Jones post-prime 0. |
| Zhang Weili | -4.50 | Match expected | Rose I, Rose II, Valentina upward. |
| Amanda Nunes | -3.75 | Match expected | Zingano pre-prime elite finish; Pena I prime elite finish. |
| Valentina Shevchenko | -3.75 | Match expected | Nunes I/II upward; Grasso finish. |
| Joanna Jedrzejczyk | -4.50 | Match expected | Rose I/II, Valentina upward; Zhang II post-prime. |
| Ronda Rousey | -4.50 | Match expected | Holm and Nunes elite finishes. |

## Expected deltas to review first

These are the two likely review rows from Batch 1:

### Georges St-Pierre

Target calculated penalty: **-6.25**

Breakdown:

- Matt Hughes 2004: pre-prime loss to champion/top-5 + finished = **-1.50**
- Matt Serra 2007: prime non-elite loss + finished = **-4.75**

Reason for review: if the current stored penalty is lighter, it likely means Serra was not previously receiving full prime non-elite finish treatment.

### Anderson Silva

Target calculated penalty: **-4.25**

Breakdown:

- Chris Weidman I: prime elite finish = **-2.25**
- Chris Weidman II: prime elite loss + reduced injury/technical finish = **-2.00**
- Later UFC losses: post-prime = **0**

Reason for review: if the current stored penalty is -4.50, it means Weidman II was previously treated as a normal finish instead of reduced injury/technical finish.

## What should happen next

1. Open the live app after deploy.
2. In DevTools console, run:

```js
window.UFC_LOSS_CONTEXT_REPORT
  .filter(r => ['Jon Jones','Khabib Nurmagomedov','Islam Makhachev','Georges St-Pierre','Demetrious Johnson','Anderson Silva','Alexander Volkanovski','Kamaru Usman','Daniel Cormier','Stipe Miocic','Zhang Weili','Amanda Nunes','Valentina Shevchenko','Joanna Jedrzejczyk','Ronda Rousey'].includes(r.fighter))
```

3. Confirm which rows are `match` and which are `review`.
4. Only after that, decide whether to update stored `penalty` / `lossPenalty` fields for review rows.

## No ranking action yet

Do not move rankings from this review alone. The engine still uses stored penalty for visible total score. The calculated penalty is for audit until Cody approves score writes.
