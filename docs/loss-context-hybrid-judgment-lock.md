# Hybrid Loss Context Judgment Lock

**Lock version:** `loss-context-hybrid-judgment-lock-20260711a`

**Status:** Approved for live-score implementation.

This lock approves the **Loss Context outputs**, not every projected overall ranking position. When a fighter barely changes in Loss Context but moves several leaderboard spots, that is a broader board-rebalancing effect and should be reviewed through Championship Resume, Quality Wins, Prime Dominance, Longevity, and Apex Peak—not corrected by distorting Loss Context.

## Locked model

Loss Context is a negative category with a maximum magnitude of 6.00 points.

1. **Severity:** Average of the two worst counted losses, capped at 3.50.
2. **Frequency:** Total counted loss burden divided by UFC fights through the canonical prime endpoint, multiplied by 3.00 and capped at 2.50.
3. **Prime-loss volume floor:** Each prime loss contributes 0.75 to the minimum burden; each prime finish loss adds another 0.25. The floor is capped at 5.25.
4. **Division strength:** Strong divisions can reduce the completed penalty by up to 15%. Weak divisions do not receive extra punishment.
5. **Post-prime fights:** Excluded from both the numerator and denominator.
6. **No contests:** Excluded.
7. **Final cap:** 6.00 penalty points.

The prime-loss volume floor is locked because the first exposure-adjusted version gave too much relief to fighters with long careers and five or six counted prime losses.

## 15-fighter judgment review

| Fighter | Recommended penalty | Projected movement | Judgment |
|---|---:|---:|---|
| Dustin Poirier | -3.40 | +7 | Lock. Four prime finish losses remain meaningful, while 30 through-prime UFC fights and lightweight strength prevent the old -10 overkill. |
| Ilia Topuria | -2.75 | -7 | Lock Loss Context. One prime elite finish loss should be worse than -2.25 after frequency is included. The rank drop is field rebasing, not an Ilia-specific penalty problem. |
| Charles Oliveira | -3.27 | +6 | Lock. Heavy career loss volume remains represented, but 36 UFC fights and elite lightweight strength justify major relief from -10. |
| Robert Whittaker | -3.75 | +6 | Lock. The prime-volume floor correctly prevents four prime losses and three finishes from being diluted too far. |
| Robbie Lawler | -3.65 | +6 | Lock. The old -9.25 treated career volume too harshly; his main counted damage remains clear. |
| Tito Ortiz | -4.15 | +6 | Lock. Three prime losses, two finishes, and no division discount keep the score appropriately heavy. |
| Dominick Cruz | -3.49 | -6 | Lock Loss Context. His penalty barely improves from -3.75; the overall drop comes from other fighters receiving justified relief. |
| Khamzat Chimaev | -1.89 | -6 | Lock Loss Context. One prime elite decision loss across ten UFC fights is correctly light. The overall drop is a résumé/category issue. |
| Dricus du Plessis | -1.95 | -6 | Lock. One prime elite decision loss across ten UFC fights should remain light but not stay at only -1.50. |
| Aljamain Sterling | -2.87 | +5 | Lock. His previous -7.25 was excessive for two counted prime losses across a long UFC sample. |
| Justin Gaethje | -3.93 | +4 | Lock. Three prime finish losses still produce a heavier penalty than DDP, but UFC fight volume and maximum lightweight strength credit eliminate the absurd -10 gap. Gaethje projects ahead of DDP overall. |
| Frankie Edgar | -4.51 | +4 | Lock. The prime-volume floor catches six prime losses and prevents his long career from producing excessive relief. |
| Cain Velasquez | -3.29 | -4 | Lock Loss Context. Two prime elite finish losses remain significant; the rank drop is caused by board compression elsewhere. |
| Francis Ngannou | -1.43 | -4 | Lock Loss Context. Both counted losses occurred before the locked apex window and neither was a finish. |
| Petr Yan | -2.34 | -3 | Lock Loss Context. Three prime elite decision losses are meaningful but should not equal the old -4.50 after exposure is considered. |

## Anchor review

- Jon Jones remains at a 0.00 penalty. The Matt Hamill DQ is still excluded as a competitive loss.
- Georges St-Pierre remains #2 in the projection with a -3.78 penalty. The Serra loss drives severity, but 22 UFC fights through the endpoint reduce frequency.
- Jose Aldo remains #8 with a -5.15 penalty. The prime-volume floor catches seven counted prime losses and preserves the UFC-only top-8-to-11 range.
- Max Holloway receives relief but remains meaningfully penalized at -4.37 because six prime losses trigger the volume floor.
- Khabib Nurmagomedov remains at a 0.00 penalty. If broader board recalibration moves him outside the desired top tier, that must be resolved through the positive résumé categories—not by inventing negative points for other fighters.

## Final decision

The hybrid Loss Context formula is **judgment-approved**. The next implementation step may replace live penalties with the approved shadow values, followed by a full leaderboard, OVR, profile-copy, and Compare Mode regression audit.
