# Longevity Compression Audit

Version: `longevity-compression-audit-20260705a`  
Status: Batch 1 worksheet only. Not live scoring.  
Live app impact: None.

## Goal

Compress only the very top of the Longevity category so the visible scoring tiers feel more intuitive:

| Tier | Meaning |
| --- | --- |
| 15.0 | Almost impossible UFC longevity case |
| 14.0+ | Only truly absurd UFC longevity |
| 13.0–13.9 | Elite long-career case |
| 11.0–12.9 | Strong longevity |

This is not a formula rebuild. It is a top-end compression pass.

## Guardrails

- Do not touch live scoring until Cody approves the full shape.
- Do not change the Longevity formula mechanics yet.
- Do not punish compact-prime fighters again; they are already naturally lower in Longevity.
- Keep Max Holloway as the clean 15.0 benchmark unless Cody changes that call.
- Use small, explainable adjustments only.
- This should cool the old/long-career cluster without nuking anyone.

## Batch 1: Top-End Longevity Compression

| Fighter | Current Longevity | Proposed Longevity | Change | Tier After | Reason |
| --- | ---: | ---: | ---: | --- | --- |
| Max Holloway | 15.00 | 15.00 | 0.00 | Almost impossible | Best active-37 UFC longevity benchmark: huge fight count, elite relevance across years, and late elite proof. |
| Frankie Edgar | 15.00 | 14.50 | -0.50 | Truly absurd | Still absurd UFC longevity, but no longer tied with Max. Late career was longer and messier, so 15.0 should not be shared. |
| Jon Jones | 14.25 | 14.00 | -0.25 | Truly absurd | Stays in the 14+ absurd tier because the UFC title relevance spans eras, including HW relevance, but gaps keep him off the 15.0 benchmark. |
| Jose Aldo | 14.36 | 13.75 | -0.61 | Elite long-career | Main correction target. UFC-only longevity remains elite, but not truly absurd once WEC is excluded and late BW run is not a full second elite chapter. |
| Dustin Poirier | 13.99 | 13.70 | -0.29 | Elite long-career | Elite long-career UFC case, but should sit below the truly absurd 14+ tier. |
| Randy Couture | 13.77 | 13.55 | -0.22 | Elite long-career | Era-spanning UFC title relevance stays valuable, but not quite 14+ under the compressed tier language. |
| Georges St-Pierre | 13.67 | 13.45 | -0.22 | Elite long-career | Bisping comeback matters, but long retirement gap keeps him below 14+ in pure Longevity. |
| Matt Hughes | 13.39 | 13.20 | -0.19 | Elite long-career | Long UFC title-era case remains elite, but not enough to carry him into the truly absurd tier. |
| Valentina Shevchenko | 13.15 | 12.90 | -0.25 | Strong longevity | Strong long title relevance, but just below the elite-long-career tier after top-end compression. |

## Expected Ranking Shape From Batch 1 Only

This batch should mostly affect the Aldo/Randy/Max cluster.

Expected movement if these values later go live:

| Fighter | Expected Movement |
| --- | --- |
| Max Holloway | likely rises into or near top 10 because Aldo drops more than Max. |
| Jose Aldo | likely drops behind Randy and Max. |
| Randy Couture | likely moves ahead of Aldo. |
| Matt Hughes | likely stays high; this adjustment alone does not move him below Khabib. |
| Khabib Nurmagomedov | relative benefit, but likely no direct movement from this batch alone. |

Projected cluster after Batch 1:

```text
#7 Matt Hughes
#8 Khabib Nurmagomedov
#9 Randy Couture
#10 Max Holloway
#11 Jose Aldo
```

## Batch 1 Read

This batch accomplishes the main philosophical goal without reopening the model:

- 15.0 becomes basically exclusive.
- 14+ becomes truly rare.
- Aldo cools down without being disrespected.
- Max/Frankie/Jon remain the obvious top Longevity cases.
- Hughes remains high, but no longer gets extra top-tier inflation.

## Next Batch Candidates

After Cody reviews Batch 1, audit the next high-longevity band:

- Amanda Nunes
- Stipe Miocic
- Justin Gaethje
- Demetrious Johnson
- Aljamain Sterling
- Anderson Silva
- Daniel Cormier
- Israel Adesanya
- B.J. Penn
- Cain Velasquez

## Approval Gate

Do not update `assets/data/longevity-score-corrections.js` until Cody approves the complete compression shape.
