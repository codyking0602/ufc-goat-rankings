(function(){
  'use strict';

  const VERSION='play-roster-batch-one-20260717a';
  const FIGHTERS=[{"name":"Ben Askren","aliases":["Funky"],"gender":"men","divisions":["Welterweight"],"eras":["superstar","apex"],"selectionTier":"recognizable","tags":["wrestler","personality","what-if","cult","never-undisputed-champion"]},{"name":"Cody Garbrandt","aliases":["No Love"],"gender":"men","divisions":["Bantamweight"],"eras":["superstar","apex"],"selectionTier":"elite","tags":["former-champion","knockout","action","what-if"]},{"name":"Anthony Johnson","aliases":["Rumble","Anthony Rumble Johnson"],"gender":"men","divisions":["Light Heavyweight","Middleweight","Welterweight"],"eras":["tuf-boom","golden-age","superstar"],"selectionTier":"elite","tags":["power","knockout","title-challenger","what-if","never-undisputed-champion"]},{"name":"Lyoto Machida","aliases":["The Dragon"],"gender":"men","divisions":["Light Heavyweight","Middleweight"],"eras":["tuf-boom","golden-age"],"selectionTier":"elite","tags":["former-champion","striker","technical","highlight"]},{"name":"Josh Koscheck","aliases":["Kos"],"gender":"men","divisions":["Welterweight"],"eras":["tuf-boom","golden-age"],"selectionTier":"contender","tags":["wrestler","title-challenger","tuf-original","never-undisputed-champion"]},{"name":"Gilbert Melendez","aliases":["El Niño","El Nino"],"gender":"men","divisions":["Lightweight"],"eras":["golden-age","superstar"],"selectionTier":"contender","tags":["title-challenger","action","what-if","never-undisputed-champion"]},{"name":"Rafael Fiziev","aliases":["Ataman"],"gender":"men","divisions":["Lightweight"],"eras":["apex","new-blood"],"selectionTier":"contender","tags":["striker","action","highlight","what-if"]},{"name":"Renato Moicano","aliases":["Money Moicano","Moicano"],"gender":"men","divisions":["Lightweight","Featherweight"],"eras":["superstar","apex","new-blood"],"selectionTier":"contender","tags":["grappler","action","personality","contender"]},{"name":"Mackenzie Dern","aliases":[],"gender":"women","divisions":["Strawweight"],"eras":["apex","new-blood"],"selectionTier":"contender","tags":["grappler","submission","star","what-if"]},{"name":"Germaine de Randamie","aliases":["The Iron Lady"],"gender":"women","divisions":["Bantamweight","Featherweight"],"eras":["golden-age","superstar","apex"],"selectionTier":"contender","tags":["former-champion","striker","title-challenger","what-if"]},{"name":"Jessica Eye","aliases":["Evil"],"gender":"women","divisions":["Flyweight","Bantamweight"],"eras":["golden-age","superstar","apex"],"selectionTier":"recognizable","tags":["title-challenger","veteran"]},{"name":"Bethe Correia","aliases":["Pitbull"],"gender":"women","divisions":["Bantamweight"],"eras":["golden-age","superstar"],"selectionTier":"recognizable","tags":["title-challenger","personality","action"]}];
  const MANUAL_RATINGS={"Ben Askren":{"ratings":{"ufcCareer":38,"allCareers":38,"bestPrime":60,"hardestAtPeak":58,"mostComplete":50,"bestFinisher":38,"actionFighter":68,"starPower":72,"biggestWhatIf":84,"cultChaos":82},"divisions":{"Welterweight":38}},"Cody Garbrandt":{"ratings":{"ufcCareer":68,"allCareers":68,"bestPrime":89,"hardestAtPeak":90,"mostComplete":80,"bestFinisher":82,"actionFighter":86,"starPower":75,"biggestWhatIf":90,"cultChaos":65},"divisions":{"Bantamweight":74}},"Anthony Johnson":{"ratings":{"ufcCareer":76,"allCareers":76,"bestPrime":91,"hardestAtPeak":92,"mostComplete":72,"bestFinisher":96,"actionFighter":88,"starPower":77,"biggestWhatIf":86,"cultChaos":68},"divisions":{"Light Heavyweight":80,"Middleweight":55,"Welterweight":42}},"Lyoto Machida":{"ratings":{"ufcCareer":82,"allCareers":82,"bestPrime":90,"hardestAtPeak":91,"mostComplete":88,"bestFinisher":80,"actionFighter":76,"starPower":82,"biggestWhatIf":72,"cultChaos":80},"divisions":{"Light Heavyweight":84,"Middleweight":68}},"Josh Koscheck":{"ratings":{"ufcCareer":70,"allCareers":70,"bestPrime":77,"hardestAtPeak":76,"mostComplete":74,"bestFinisher":62,"actionFighter":72,"starPower":65,"biggestWhatIf":55,"cultChaos":52},"divisions":{"Welterweight":70}},"Gilbert Melendez":{"ratings":{"ufcCareer":44,"allCareers":44,"bestPrime":73,"hardestAtPeak":70,"mostComplete":78,"bestFinisher":45,"actionFighter":75,"starPower":60,"biggestWhatIf":80,"cultChaos":58},"divisions":{"Lightweight":44}},"Rafael Fiziev":{"ratings":{"ufcCareer":58,"allCareers":58,"bestPrime":76,"hardestAtPeak":77,"mostComplete":73,"bestFinisher":78,"actionFighter":88,"starPower":65,"biggestWhatIf":78,"cultChaos":55},"divisions":{"Lightweight":62}},"Renato Moicano":{"ratings":{"ufcCareer":67,"allCareers":67,"bestPrime":78,"hardestAtPeak":76,"mostComplete":80,"bestFinisher":74,"actionFighter":78,"starPower":62,"biggestWhatIf":70,"cultChaos":64},"divisions":{"Lightweight":66,"Featherweight":65}},"Mackenzie Dern":{"ratings":{"ufcCareer":61,"allCareers":61,"bestPrime":70,"hardestAtPeak":68,"mostComplete":63,"bestFinisher":82,"actionFighter":75,"starPower":78,"biggestWhatIf":82,"cultChaos":60},"divisions":{"Strawweight":61}},"Germaine de Randamie":{"ratings":{"ufcCareer":70,"allCareers":70,"bestPrime":84,"hardestAtPeak":84,"mostComplete":72,"bestFinisher":68,"actionFighter":65,"starPower":68,"biggestWhatIf":82,"cultChaos":45},"divisions":{"Bantamweight":70,"Featherweight":72}},"Jessica Eye":{"ratings":{"ufcCareer":40,"allCareers":40,"bestPrime":58,"hardestAtPeak":55,"mostComplete":56,"bestFinisher":32,"actionFighter":55,"starPower":55,"biggestWhatIf":45,"cultChaos":45},"divisions":{"Flyweight":42,"Bantamweight":38}},"Bethe Correia":{"ratings":{"ufcCareer":38,"allCareers":38,"bestPrime":52,"hardestAtPeak":48,"mostComplete":45,"bestFinisher":42,"actionFighter":62,"starPower":62,"biggestWhatIf":40,"cultChaos":58},"divisions":{"Bantamweight":38}}};
  const COMPARE_PROFILES={"Ben Askren":{"shortCase":"Askren is the UFC what-if wrestler: elite control reputation arrived late, the run lasted only three fights, and the Masvidal knockout permanently reshaped the story.","peak":"His UFC best was pressure wrestling, chain takedowns, scrambling, toughness, and relentless positional pursuit, but the striking limitations were obvious.","resume":"The UFC-only résumé is extremely small: a controversial Lawler win followed by losses to Masvidal and Maia. Non-UFC achievements are context only.","championship":"He never reached a UFC title fight, so his championship case is potential rather than accomplishment.","opponentQuality":"Lawler, Masvidal, and Maia made the short run high-profile, but there was no sustained UFC win depth.","longevity":"Longevity is the major weakness because the entire UFC career occurred in 2019.","counter":"His best argument is that he entered the UFC late and physically diminished after proving elite wrestling elsewhere.","edge":"Askren wins comparisons mainly in What-If, wrestling-specialist, personality, and cult-value debates—not UFC résumé debates.","eliteCounter":false,"signatureWins":"Robbie Lawler is the only official UFC win, and even that result remains heavily debated.","titleSummary":"No UFC title fights or title wins.","primeSummary":"A late-arriving, short UFC window that showed the wrestling identity but not a complete elite UFC run.","titleStyle":"noUfcTitleCase","primeStyle":"lateWrestlingWhatIf","legacyStats":{"titleFightWins":0,"beltsWon":0,"titleDefenses":0,"activeEliteYearsLabel":"less than 1 UFC year","primeNote":"late UFC arrival with elite wrestling reputation, limited striking, and only three UFC appearances"}},"Cody Garbrandt":{"shortCase":"Garbrandt is the brilliant short-peak bantamweight champion: the Cruz masterpiece proved an elite ceiling, while the Dillashaw losses and later knockouts crushed the long-term case.","peak":"At his best he combined hand speed, footwork, counters, takedown defense, power, and composure into one of the division's best single championship performances.","resume":"The UFC résumé has a real title win and recognizable finishes, but the losing stretch after the belt makes it far less stable than the peak suggested.","championship":"He won the bantamweight title from Dominick Cruz but did not record a successful defense.","opponentQuality":"Cruz, Almeida, Mizugaki, Assunção, and Font are the main UFC wins, with Cruz carrying most of the elite résumé weight.","longevity":"His elite window was brief, and repeated knockout losses sharply limited active elite years.","counter":"The counterargument is simple: one spectacular title win cannot erase the lack of defenses and negative post-title record.","edge":"Garbrandt wins when peak brilliance and the Cruz performance matter more than sustained championship volume.","eliteCounter":true,"signatureWins":"Dominick Cruz is the defining win, supported by Almeida, Mizugaki, Assunção, and Font.","titleSummary":"Won the UFC bantamweight title from Cruz and lost it in his first defense.","primeSummary":"A spectacular but fragile peak centered on speed, power, and the Cruz title performance.","titleStyle":"shortBantamweightChampion","primeStyle":"brilliantFragilePeak","legacyStats":{"titleFightWins":1,"beltsWon":1,"titleDefenses":0,"activeEliteYearsLabel":"roughly 2 active elite years","primeNote":"elite short peak with a masterful Cruz win, followed by damaging knockout losses"}},"Anthony Johnson":{"shortCase":"Johnson is the terrifying UFC knockout contender: a destructive light-heavyweight peak, two title shots, and enough missed opportunities to remain a major What-If.","peak":"Peak Rumble was explosive entries, frightening power, fast finishing instincts, improved wrestling defense, and the ability to erase elite contenders immediately.","resume":"His best UFC work came at light heavyweight, where he ran through contenders but twice met Daniel Cormier for the title and lost both times.","championship":"He fought for UFC light-heavyweight gold twice but never won the belt.","opponentQuality":"Gustafsson, Teixeira, Bader, Davis, Manuwa, Nogueira, and Arlovski give him a dangerous contender résumé.","longevity":"The elite light-heavyweight run was meaningful but interrupted by an earlier weight-cutting period and retirement.","counter":"The ceiling is championship conversion: the power looked title-worthy, but Cormier beat him twice and the UFC title never came.","edge":"Johnson wins when finishing danger, peak intimidation, and contender destruction outweigh title accomplishment.","eliteCounter":true,"signatureWins":"Gustafsson, Teixeira, Bader, Davis, Manuwa, Nogueira, and Arlovski define the UFC run.","titleSummary":"Two UFC light-heavyweight title losses to Daniel Cormier; no UFC belt.","primeSummary":"One of the most frightening knockout peaks the division has seen, with limited championship conversion.","titleStyle":"twoTimePowerChallenger","primeStyle":"eliteKnockoutTerror","legacyStats":{"titleFightWins":0,"beltsWon":0,"titleDefenses":0,"activeEliteYearsLabel":"roughly 4 active elite years","primeNote":"destructive light-heavyweight knockout prime capped by two title losses to Cormier"}},"Lyoto Machida":{"shortCase":"Machida is the elusive UFC champion technician: an unbeaten title rise, distinctive karate style, major names on the ledger, and a long two-division elite run.","peak":"At his best, Machida controlled range with feints, stance switches, counters, explosive entries, takedown timing, and elite defensive awareness.","resume":"The UFC résumé includes a light-heavyweight title, a defense-level draw win sequence, multiple former champions, and a later middleweight title challenge.","championship":"He won the UFC light-heavyweight title and defended it once before losing the rematch to Shogun, then later challenged for middleweight gold.","opponentQuality":"Evans, Rua, Ortiz, Franklin, Henderson, Bader, Mousasi, Couture, and Belfort are the major UFC names.","longevity":"Machida remained relevant across light heavyweight and middleweight for years, though late-career losses lower the clean résumé.","counter":"The title reign was short, several major decisions were close, and he never built prolonged divisional control.","edge":"Machida wins when championship value, technical completeness, style difficulty, and two-division relevance matter.","eliteCounter":true,"signatureWins":"Evans, Rua, Ortiz, Franklin, Henderson, Bader, Mousasi, Couture, and Belfort anchor the case.","titleSummary":"UFC light-heavyweight champion with one successful defense, plus a later middleweight title challenge.","primeSummary":"An elusive, technically complete karate peak that briefly made him appear unsolvable.","titleStyle":"technicalLightHeavyweightChampion","primeStyle":"elusiveKaratePrime","legacyStats":{"titleFightWins":2,"beltsWon":1,"titleDefenses":1,"activeEliteYearsLabel":"roughly 7 active elite years","primeNote":"unbeaten title rise and long two-division relevance built on range control and counter striking"}},"Josh Koscheck":{"shortCase":"Koscheck is the durable TUF-era welterweight contender: elite wrestling, improved power, a title shot, and a long UFC run just below championship level.","peak":"His best version mixed explosive wrestling, physical top control, a dangerous right hand, and the toughness to survive hard contender fights.","resume":"The UFC résumé has strong volume and several ranked-level wins, but the two GSP losses clearly separate him from the division's champions.","championship":"He challenged Georges St-Pierre for the welterweight title and lost a one-sided decision.","opponentQuality":"Hughes, Rumble Johnson, Daley, Sanchez, Lytle, Trigg, and Alves are the key UFC wins.","longevity":"Koscheck stayed relevant for many years, though a long losing finish to the career damages the back end.","counter":"He never won UFC gold and lost most of the fights that could have elevated him into the division's historical elite.","edge":"Koscheck wins when UFC volume, wrestling, durability, and sustained contender relevance matter.","eliteCounter":false,"signatureWins":"Matt Hughes, Anthony Johnson, Paul Daley, Diego Sanchez, Chris Lytle, Frank Trigg, and Thiago Alves.","titleSummary":"One UFC welterweight title challenge, lost to Georges St-Pierre.","primeSummary":"A strong wrestling-and-power contender prime that remained below GSP's championship tier.","titleStyle":"tufEraTitleChallenger","primeStyle":"wrestlingPowerContender","legacyStats":{"titleFightWins":0,"beltsWon":0,"titleDefenses":0,"activeEliteYearsLabel":"roughly 6 active elite years","primeNote":"long TUF-era contender run built on wrestling, physicality, and improved knockout power"}},"Gilbert Melendez":{"shortCase":"Melendez is an UFC-only scope casualty: he nearly won the lightweight title immediately, but went 1-6 in the promotion and cannot receive credit here for his Strikeforce legacy.","peak":"His best UFC showing was the razor-close Benson Henderson title fight, backed by pressure boxing, scrambling, toughness, and veteran pace.","resume":"UFC-only, the résumé is thin: one win over Diego Sanchez and losses to Henderson, Pettis, Alvarez, Barboza, Stephens, and Allen.","championship":"He challenged for the UFC lightweight title twice and lost both fights.","opponentQuality":"The schedule was excellent, but opponent quality cannot replace actual UFC wins in this model.","longevity":"The UFC run lasted several years but produced very little sustained elite success.","counter":"The strongest defense is scope: his full career is far better than the UFC-only record, but those outside achievements are excluded.","edge":"Melendez wins only when close title-fight performance, toughness, and broader historical context are discussed separately from UFC résumé.","eliteCounter":false,"signatureWins":"Diego Sanchez is the lone UFC win; the close Henderson title loss is the most important performance.","titleSummary":"Two UFC lightweight title challenges, no title-fight wins.","primeSummary":"Entered the UFC near the end of an elite broader career and never converted that reputation into UFC win volume.","titleStyle":"outsideLegacyScopeCasualty","primeStyle":"lateArrivalVeteranPrime","legacyStats":{"titleFightWins":0,"beltsWon":0,"titleDefenses":0,"activeEliteYearsLabel":"roughly 2 UFC elite years","primeNote":"close UFC title debut followed by a 1-6 promotional record; Strikeforce success is context only"}},"Rafael Fiziev":{"shortCase":"Fiziev is the action-striker contender: elite kicking offense, speed, combinations, memorable finishes, and a lightweight run interrupted before title-level proof.","peak":"At his best he is a fast, layered Muay Thai striker with body work, kicks, counters, balance, and sudden finishing combinations.","resume":"The UFC résumé includes a strong six-fight winning streak and recognizable lightweight wins, but losses to Gaethje and Gamrot-level opposition limit the ceiling.","championship":"He has not fought for UFC gold.","opponentQuality":"dos Anjos, Green, Moicano, Riddell, and Diakiese are the core UFC wins.","longevity":"The contender window has been meaningful but interrupted by injury and inactivity.","counter":"He lacks championship fights, top-five win volume, and a long healthy elite run.","edge":"Fiziev wins in striking, action, finishing-threat, and What-If comparisons more than career résumé comparisons.","eliteCounter":false,"signatureWins":"Rafael dos Anjos, Bobby Green, Renato Moicano, Brad Riddell, and Marc Diakiese.","titleSummary":"No UFC title fights.","primeSummary":"A dangerous modern lightweight striking peak interrupted before sustained top-five proof.","titleStyle":"noTitleActionContender","primeStyle":"muayThaiWhatIfPrime","legacyStats":{"titleFightWins":0,"beltsWon":0,"titleDefenses":0,"activeEliteYearsLabel":"roughly 3 active elite years","primeNote":"high-level Muay Thai contender run with injuries and limited top-five conversion"}},"Renato Moicano":{"shortCase":"Moicano is the adaptable grappling veteran: elite back-taking, improving pressure boxing, two-division relevance, and a late-career lightweight surge.","peak":"His best version blends long-range combinations, body work, reactive takedowns, back control, submissions, cardio, and veteran adjustments.","resume":"The UFC résumé has useful depth across featherweight and lightweight without a championship win or sustained top-five control.","championship":"He has not won or challenged for an undisputed UFC title.","opponentQuality":"Saint Denis, Turner, Hernandez, Swanson, Kattar, and Stephens are the strongest UFC wins.","longevity":"Longevity is a strength because he remained relevant through a division move and multiple career phases.","counter":"The missing piece is elite separation: the best opponents on his record often beat him, and there is no title-fight accomplishment.","edge":"Moicano wins when versatility, grappling, longevity, and depth of solid UFC wins matter.","eliteCounter":false,"signatureWins":"Benoît Saint Denis, Jalin Turner, Alexander Hernandez, Cub Swanson, Calvin Kattar, and Jeremy Stephens.","titleSummary":"No UFC title-fight wins.","primeSummary":"A late-developing, adaptable two-division prime built around submissions and improved pressure striking.","titleStyle":"veteranNonChampion","primeStyle":"adaptiveGrapplingPrime","legacyStats":{"titleFightWins":0,"beltsWon":0,"titleDefenses":0,"activeEliteYearsLabel":"roughly 6 active elite years","primeNote":"two-division veteran prime with elite grappling and a meaningful late lightweight surge"}},"Mackenzie Dern":{"shortCase":"Dern is the elite-submission specialist: world-class grappling threat, improved striking, star recognition, and an incomplete contender case.","peak":"At her best she creates constant submission danger from scrambles, guard exchanges, back takes, and opportunistic transitions.","resume":"The UFC résumé has several ranked-level wins but no title fight and inconsistent results against the strongest strawweights.","championship":"She has not fought for UFC gold.","opponentQuality":"Jandiroba, Ribas, Hill, Torres, Cifers, and Markos are the main UFC wins.","longevity":"She has maintained relevance for several years, although alternating wins and losses has prevented a clean title run.","counter":"The striking and wrestling-entry gaps keep the overall skill package below the most complete champions.","edge":"Dern wins in submission threat, grappling, star potential, and What-If arguments.","eliteCounter":false,"signatureWins":"Virna Jandiroba, Amanda Ribas, Angela Hill, Tecia Torres, Hannah Cifers, and Randa Markos.","titleSummary":"No UFC title fights.","primeSummary":"A dangerous specialist prime whose grappling ceiling remains higher than the complete MMA résumé.","titleStyle":"submissionContender","primeStyle":"eliteGrapplingSpecialist","legacyStats":{"titleFightWins":0,"beltsWon":0,"titleDefenses":0,"activeEliteYearsLabel":"roughly 5 active elite years","primeNote":"elite submission threat with improving striking but inconsistent contender conversion"}},"Germaine de Randamie":{"shortCase":"De Randamie is the underfilled champion case: elite kickboxing, a UFC featherweight title win, strong bantamweight performances, and too little activity to build a complete legacy.","peak":"At her best she was a precise, powerful kickboxer with excellent timing, clinch knees, distance management, and strong defensive instincts.","resume":"The UFC résumé contains a championship win and credible contender victories, but inactivity and division circumstances limit depth.","championship":"She won the inaugural UFC women's featherweight title, vacated without defending, and later lost a bantamweight title challenge to Amanda Nunes.","opponentQuality":"Holm, Peña, Ladd, Pennington, and Budd are the key UFC wins.","longevity":"Calendar longevity was long, but active elite-year credit should be limited because of major gaps.","counter":"The title reign had no defense, the featherweight division was shallow, and Nunes beat her twice.","edge":"De Randamie wins when pure striking, peak difficulty, and championship capture matter more than activity and division depth.","eliteCounter":false,"signatureWins":"Holly Holm, Julianna Peña, Aspen Ladd, Raquel Pennington, and Julia Budd.","titleSummary":"Won the inaugural UFC women's featherweight title, made no defense, and later challenged for bantamweight gold.","primeSummary":"Elite kickboxing peak with sparse activity and an incomplete championship reign.","titleStyle":"inauguralFeatherweightChampion","primeStyle":"eliteKickboxingSparsePrime","legacyStats":{"titleFightWins":1,"beltsWon":1,"titleDefenses":0,"activeEliteYearsLabel":"roughly 4 active elite years","primeNote":"elite striking and championship capture limited by inactivity, shallow featherweight depth, and Nunes losses"}},"Jessica Eye":{"shortCase":"Eye is the shallow-division title challenger: durable veteran experience and a flyweight title shot, but a losing UFC record and very little finishing value.","peak":"Her best work came through boxing volume, toughness, clinch work, and enough consistency to climb a developing flyweight division.","resume":"The UFC-only résumé is losing overall, with a short flyweight winning streak providing most of the positive value.","championship":"She challenged Valentina Shevchenko for the flyweight title and was knocked out.","opponentQuality":"Chookagian, Jessica-Rose Clark, and Kalindra Faria are the principal UFC wins.","longevity":"She remained on the roster for years, but longevity without sustained elite success adds limited GOAT value.","counter":"The title shot came in a shallow division, and the record lacks elite wins, finishes, and championship competitiveness.","edge":"Eye mainly serves as a realistic lower-tier career, finishing, and completeness trap in game categories.","eliteCounter":false,"signatureWins":"Katlyn Chookagian, Jessica-Rose Clark, and Kalindra Faria.","titleSummary":"One UFC flyweight title loss to Valentina Shevchenko.","primeSummary":"A brief contender window in a developing division without lasting elite separation.","titleStyle":"shallowDivisionChallenger","primeStyle":"briefVolumeBoxingPrime","legacyStats":{"titleFightWins":0,"beltsWon":0,"titleDefenses":0,"activeEliteYearsLabel":"roughly 2 active elite years","primeNote":"brief flyweight contender run within a long losing UFC record"}},"Bethe Correia":{"shortCase":"Correia is the personality-and-title-shot underdog: an unbeaten UFC start created a Rousey rivalry, but the championship loss and later results exposed the ceiling.","peak":"Her best version used pressure boxing, toughness, confidence, and steady output more than elite athletic or technical advantages.","resume":"The UFC résumé has a few wins and a memorable title build, but no elite win depth and a negative championship-level result.","championship":"She challenged Ronda Rousey for the bantamweight title and was knocked out in the first round.","opponentQuality":"Duke, Baszler, Kedzie, and Evinger are the main UFC wins.","longevity":"She stayed in the promotion for years but did not maintain contender-level success after the title shot.","counter":"The title opportunity came before a deep elite résumé, and the later record confirms a below-average historical standing.","edge":"Correia contributes personality, chaos, star-recognition, and genuine lower-tier lineup variety.","eliteCounter":false,"signatureWins":"Jessamyn Duke, Shayna Baszler, Julie Kedzie, and Sijara Eubanks are the notable UFC wins.","titleSummary":"One UFC bantamweight title loss to Ronda Rousey.","primeSummary":"A short unbeaten rise driven by pressure and personality, followed by a decisive title-level ceiling.","titleStyle":"personalityTitleChallenger","primeStyle":"shortUnderdogRise","legacyStats":{"titleFightWins":0,"beltsWon":0,"titleDefenses":0,"activeEliteYearsLabel":"roughly 1 active elite year","primeNote":"short unbeaten UFC rise that produced a major title build but little sustained elite success"}}};
  const FIGHT_LEDGER={"ben askren|jorge masvidal":{"fighters":["Ben Askren","Jorge Masvidal"],"fights":1,"winner":"Jorge Masvidal","importance":"major","summary":"Masvidal stopped Askren in five seconds, creating the defining result of Askren's UFC run and one of the promotion's most famous knockouts."},"ben askren|robbie lawler":{"fighters":["Ben Askren","Robbie Lawler"],"fights":1,"winner":"Ben Askren","importance":"contextual","summary":"Askren received the submission win over Lawler after surviving early damage, though the stoppage remains disputed and should carry technical-result context."},"cody garbrandt|dominick cruz":{"fighters":["Cody Garbrandt","Dominick Cruz"],"fights":1,"winner":"Cody Garbrandt","importance":"major","summary":"Garbrandt outpointed Cruz to win the bantamweight title in the defining performance of his career."},"cody garbrandt|t.j. dillashaw":{"fighters":["Cody Garbrandt","T.J. Dillashaw"],"fights":2,"winner":"T.J. Dillashaw","importance":"major","summary":"Dillashaw stopped Garbrandt twice in title fights, taking decisive rivalry separation and ending Cody's championship run."},"anthony johnson|daniel cormier":{"fighters":["Anthony Johnson","Daniel Cormier"],"fights":2,"winner":"Daniel Cormier","importance":"major","summary":"Cormier submitted Johnson in both light-heavyweight title fights, providing the clearest championship ceiling on Rumble's UFC case."},"anthony johnson|glover teixeira":{"fighters":["Anthony Johnson","Glover Teixeira"],"fights":1,"winner":"Anthony Johnson","importance":"major","summary":"Johnson knocked out Teixeira in seconds, one of the strongest examples of his peak finishing danger against an elite contender."},"jon jones|lyoto machida":{"fighters":["Jon Jones","Lyoto Machida"],"fights":1,"winner":"Jon Jones","importance":"major","summary":"Jones submitted Machida in a light-heavyweight title defense after Machida gave him a difficult opening round."},"lyoto machida|rashad evans":{"fighters":["Lyoto Machida","Rashad Evans"],"fights":1,"winner":"Lyoto Machida","importance":"major","summary":"Machida knocked out the unbeaten Evans to win the light-heavyweight title and complete his championship rise."},"georges st-pierre|josh koscheck":{"fighters":["Georges St-Pierre","Josh Koscheck"],"fights":2,"winner":"Georges St-Pierre","importance":"major","summary":"St-Pierre beat Koscheck twice, including a dominant title defense, establishing clear separation between champion and contender."},"anthony johnson|josh koscheck":{"fighters":["Anthony Johnson","Josh Koscheck"],"fights":1,"winner":"Josh Koscheck","importance":"contextual","summary":"Koscheck submitted Johnson during Rumble's troubled welterweight period, a result that matters with major division and weight-cut context."},"benson henderson|gilbert melendez":{"fighters":["Benson Henderson","Gilbert Melendez"],"fights":1,"winner":"Benson Henderson","importance":"major","summary":"Henderson retained the lightweight title by split decision over Melendez in a very close UFC debut title fight."},"anthony pettis|gilbert melendez":{"fighters":["Anthony Pettis","Gilbert Melendez"],"fights":1,"winner":"Anthony Pettis","importance":"major","summary":"Pettis submitted Melendez in a lightweight title defense, giving Gilbert his second unsuccessful UFC championship opportunity."},"rafael fiziev|renato moicano":{"fighters":["Rafael Fiziev","Renato Moicano"],"fights":1,"winner":"Rafael Fiziev","importance":"contextual","summary":"Fiziev stopped Moicano at lightweight, a direct result between two skilled modern contenders whose later career paths developed differently."},"amanda nunes|germaine de randamie":{"fighters":["Amanda Nunes","Germaine de Randamie"],"fights":2,"winner":"Amanda Nunes","importance":"major","summary":"Nunes beat de Randamie twice, including a bantamweight title defense, creating clear direct separation despite Germaine's striking credentials."},"germaine de randamie|holly holm":{"fighters":["Germaine de Randamie","Holly Holm"],"fights":1,"winner":"Germaine de Randamie","importance":"major","summary":"De Randamie beat Holm to win the inaugural UFC women's featherweight title, the central championship result of her résumé."},"jessica eye|valentina shevchenko":{"fighters":["Jessica Eye","Valentina Shevchenko"],"fights":1,"winner":"Valentina Shevchenko","importance":"major","summary":"Shevchenko knocked out Eye in a flyweight title fight, demonstrating the large gap between the champion and challenger."},"bethe correia|ronda rousey":{"fighters":["Bethe Correia","Ronda Rousey"],"fights":1,"winner":"Ronda Rousey","importance":"major","summary":"Rousey knocked out Correia in the first round of their bantamweight title fight, ending Bethe's unbeaten UFC rise."},"jessica andrade|mackenzie dern":{"fighters":["Jessica Andrade","Mackenzie Dern"],"fights":1,"winner":"Jessica Andrade","importance":"contextual","summary":"Andrade stopped Dern in a strawweight contender fight, exposing the striking-defense ceiling in Dern's otherwise dangerous grappling case."}};
  const VALID_TIERS=new Set(['legend','elite','contender','recognizable','wildcard']);
  const TIER_BANDS=[
    {id:'elite',min:92,max:100},
    {id:'great',min:82,max:91},
    {id:'good',min:70,max:81},
    {id:'average',min:55,max:69},
    {id:'below-average',min:35,max:54},
    {id:'bad',min:0,max:34}
  ];
  let lastRosterSignature='';

  function text(value){return String(value??'').trim();}
  function normal(value){
    return text(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`]/g,"'").replace(/[^a-zA-Z0-9]+/g,' ').trim().toLowerCase();
  }
  function slug(value){return normal(value).replace(/\s+/g,'-');}
  function unique(values){return [...new Set((values||[]).map(text).filter(Boolean))];}
  function tierForRating(value){
    const rating=Math.max(0,Math.min(100,Math.round(Number(value)||0));
    return TIER_BANDS.find(tier=>rating>=tier.min&&rating<=tier.max)?.id||'bad';
  }

  function fighterRecord(row){
    const base={
      id:slug(row.name),
      name:row.name,
      aliases:unique(row.aliases),
      gender:row.gender,
      primaryDivision:row.divisions?.[0]||'',
      divisions:unique(row.divisions),
      eras:unique(row.eras),
      selectionTier:VALID_TIERS.has(row.selectionTier)?row.selectionTier:'recognizable',
      tags:unique(['play-only','batch-one',row.gender,...(row.tags||[]),...(row.divisions||[]).map(slug)]),
      source:'play-only-batch-one',
      modelRanked:false,
      modelRank:null,
      modelScore:null,
      thumbUrl:'',
      profileUrl:'',
      eligibility:{blindRank:true,keepCut:true,betterThan:false,findLeader:false}
    };
    return window.UFC_PLAY_DATA?.photoResolver?.apply?.(base)||base;
  }

  function refreshPlayAudit(api){
    const records=api.allFighters||[];
    const errors=[];
    const ids=new Set();
    const names=new Set();
    records.forEach(fighter=>{
      if(!fighter?.id||ids.has(fighter.id))errors.push(`Duplicate or missing fighter id: ${fighter?.id||fighter?.name||'unknown'}`);
      ids.add(fighter?.id);
      const nameKey=normal(fighter?.name);
      if(!nameKey||names.has(nameKey))errors.push(`Duplicate or missing fighter name: ${fighter?.name||'unknown'}`);
      names.add(nameKey);
      if(!['men','women'].includes(fighter?.gender))errors.push(`${fighter?.name} has invalid gender.`);
      if(!VALID_TIERS.has(fighter?.selectionTier))errors.push(`${fighter?.name} has invalid selection tier.`);
      if(!Array.isArray(fighter?.divisions)||!fighter.divisions.length)errors.push(`${fighter?.name} needs at least one UFC division.`);
    });
    api.audit={
      ...(api.audit||{}),
      passed:errors.length===0,
      errors,
      total:records.length,
      modelRanked:records.filter(fighter=>fighter.modelRanked).length,
      playOnly:records.filter(fighter=>!fighter.modelRanked).length,
      photoReady:records.filter(fighter=>fighter.photoExplicit).length,
      photoConvention:records.filter(fighter=>fighter.photoConvention).length,
      eligibilityCounts:Object.fromEntries(['blindRank','keepCut','betterThan','findLeader'].map(key=>[
        key,records.filter(fighter=>fighter.eligibility?.[key]).length
      ]))
    };
    document.documentElement.setAttribute('data-play-roster-size',String(api.audit.total));
    document.documentElement.setAttribute('data-play-data-audit',api.audit.passed?'passed':'failed');
    document.documentElement.setAttribute('data-play-roster-batch-one',VERSION);
  }

  function installRoster(options={}){
    const api=window.UFC_PLAY_DATA;
    if(!api)return false;
    let changed=false;
    FIGHTERS.forEach(row=>{
      const existing=api.resolve?.(row.name);
      if(existing){
        existing.aliases=unique([...(existing.aliases||[]),...(row.aliases||[])]);
        existing.divisions=unique([...(existing.divisions||[]),...(row.divisions||[])]);
        existing.eras=unique([...(existing.eras||[]),...(row.eras||[])]);
        existing.tags=unique([...(existing.tags||[]),'batch-one',...(row.tags||[])]);
        existing.eligibility={...(existing.eligibility||{}),blindRank:true,keepCut:true};
        return;
      }
      const fighter=fighterRecord(row);
      api.allFighters.push(fighter);
      api.playOnly.push(fighter);
      changed=true;
    });

    api.allFighters.sort((a,b)=>{
      if(Boolean(a.modelRanked)!==Boolean(b.modelRanked))return a.modelRanked?-1:1;
      if(a.modelRanked&&b.modelRanked)return (a.modelRank||999)-(b.modelRank||999);
      return a.name.localeCompare(b.name);
    });
    api.playOnly.splice(0,api.playOnly.length,...api.allFighters.filter(fighter=>!fighter.modelRanked));
    api.modelRanked.splice(0,api.modelRanked.length,...api.allFighters.filter(fighter=>fighter.modelRanked));
    api.byId=Object.fromEntries(api.allFighters.map(fighter=>[fighter.id,fighter]));
    api.byName=Object.fromEntries(api.allFighters.map(fighter=>[normal(fighter.name),fighter]));
    FIGHTERS.forEach(row=>{
      if(!api.extras.some(extra=>normal(extra.name)===normal(row.name)))api.extras.push({...row});
    });
    refreshPlayAudit(api);

    const signature=`${api.audit.total}|${api.audit.playOnly}|${api.audit.passed}`;
    if(!options.silent&&signature!==lastRosterSignature){
      lastRosterSignature=signature;
      window.dispatchEvent(new CustomEvent('ufc-play-data-ready',{detail:{version:VERSION,audit:api.audit,batch:'one'}}));
    }
    return changed;
  }

  function wrapRosterRebuild(){
    const api=window.UFC_PLAY_DATA;
    if(!api||api.__batchOneRebuildWrapped)return;
    const nativeRebuild=api.rebuild.bind(api);
    api.rebuild=function(){
      const result=nativeRebuild();
      installRoster({silent:true});
      return result;
    };
    api.__batchOneRebuildWrapped=true;
  }

  function mergeCompareProfiles(){
    window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
    const overrides=window.DISPLAY_OVERRIDES||null;
    Object.entries(COMPARE_PROFILES).forEach(([fighter,profile])=>{
      window.COMPARE_PROFILES[fighter]={
        ...(window.COMPARE_PROFILES[fighter]||{}),
        ...profile,
        legacyStats:{
          ...((window.COMPARE_PROFILES[fighter]||{}).legacyStats||{}),
          ...(profile.legacyStats||{})
        }
      };
      if(overrides){
        overrides[fighter]=overrides[fighter]||{};
        overrides[fighter].compareProfile={
          ...(overrides[fighter].compareProfile||{}),
          ...window.COMPARE_PROFILES[fighter],
          legacyStats:{
            ...((overrides[fighter].compareProfile||{}).legacyStats||{}),
            ...(window.COMPARE_PROFILES[fighter].legacyStats||{})
          }
        };
      }
    });
    window.COMPARE_FIGHT_LEDGER={...(window.COMPARE_FIGHT_LEDGER||{}),...FIGHT_LEDGER};
  }

  function refreshLedgerAudit(ledger){
    const entries=ledger.entries||[];
    const roster=window.UFC_PLAY_DATA?.allFighters||[];
    const categoryIds=ledger.categoryIds||Object.keys(ledger.categories||{});
    const errors=[];
    const rosterIds=new Set(roster.map(fighter=>fighter.id));
    const entryIds=new Set(entries.map(entry=>entry.id));
    const missingFighters=roster.filter(fighter=>!entryIds.has(fighter.id)).map(fighter=>fighter.name);
    const orphanedEntries=entries.filter(entry=>!rosterIds.has(entry.id)).map(entry=>entry.name);
    const missingRatings={};
    const invalidRatings={};
    const tierCounts={};
    const sourceCounts={};
    const statusCounts={};

    categoryIds.forEach(category=>{
      missingRatings[category]=entries.filter(entry=>!Number.isFinite(Number(entry.ratings?.[category]))).map(entry=>entry.name);
      invalidRatings[category]=entries.filter(entry=>Number(entry.ratings?.[category])<0||Number(entry.ratings?.[category])>100).map(entry=>entry.name);
      tierCounts[category]=Object.fromEntries(TIER_BANDS.map(tier=>[tier.id,entries.filter(entry=>entry.tiers?.[category]===tier.id).length]));
      sourceCounts[category]=entries.reduce((counts,entry)=>{
        const source=entry.ratingSources?.[category]||'missing';
        counts[source]=(counts[source]||0)+1;
        return counts;
      },{});
      statusCounts[category]=entries.reduce((counts,entry)=>{
        const status=entry.reviewStatus?.[category]||'missing';
        counts[status]=(counts[status]||0)+1;
        return counts;
      },{});
    });

    entries.forEach(entry=>{
      if(!entry.divisions?.length)errors.push(`${entry.name} has no division eligibility.`);
      (entry.divisions||[]).forEach(division=>{
        if(!Number.isFinite(Number(entry.divisionRatings?.[division])))errors.push(`${entry.name} is missing a ${division} rating.`);
      });
    });
    if(missingFighters.length)errors.push(`Missing roster fighters: ${missingFighters.join(', ')}`);
    if(orphanedEntries.length)errors.push(`Orphaned rating entries: ${orphanedEntries.join(', ')}`);
    categoryIds.forEach(category=>{
      if(missingRatings[category].length)errors.push(`${category} missing ${missingRatings[category].length} ratings.`);
      if(invalidRatings[category].length)errors.push(`${category} has ${invalidRatings[category].length} invalid ratings.`);
    });

    ledger.audit={
      ...(ledger.audit||{}),
      passed:errors.length===0,
      errors,
      rosterTotal:roster.length,
      ledgerTotal:entries.length,
      modelRanked:entries.filter(entry=>entry.modelRanked).length,
      playOnly:entries.filter(entry=>!entry.modelRanked).length,
      ready:entries.filter(entry=>entry.overallReviewStatus==='ready').length,
      provisional:entries.filter(entry=>entry.overallReviewStatus==='provisional').length,
      missingFighters,
      orphanedEntries,
      missingRatings,
      invalidRatings,
      tierCounts,
      sourceCounts,
      statusCounts
    };
    document.documentElement.setAttribute('data-keep-cut-rating-ledger-size',String(entries.length));
    document.documentElement.setAttribute('data-keep-cut-rating-ledger-audit',ledger.audit.passed?'passed':'failed');
    document.documentElement.setAttribute('data-keep-cut-rating-batch-one',VERSION);
  }

  function applyRatings(){
    const ledger=window.UFC_KEEP_CUT_CATEGORY_RATINGS;
    if(!ledger)return false;
    Object.entries(MANUAL_RATINGS).forEach(([fighterName,manual])=>{
      const entry=ledger.resolve?.(fighterName);
      if(!entry)return;
      Object.entries(manual.ratings||{}).forEach(([category,value])=>{
        entry.ratings[category]=Math.max(0,Math.min(100,Math.round(Number(value)||0)));
        entry.tiers[category]=tierForRating(value);
        entry.ratingSources[category]='manual-batch-one';
        entry.reviewStatus[category]='approved';
      });
      Object.entries(manual.divisions||{}).forEach(([division,value])=>{
        entry.divisionRatings[division]=Math.max(0,Math.min(100,Math.round(Number(value)||0)));
        entry.divisionTiers[division]=tierForRating(value);
        entry.divisionSources[division]='manual-batch-one';
        entry.divisionReviewStatus[division]='approved';
        entry.eligibility.divisions[division]=true;
      });
      entry.rosterSource='play-only-batch-one';
      entry.overallReviewStatus='ready';
    });
    refreshLedgerAudit(ledger);
    window.dispatchEvent(new CustomEvent('ufc-keep-cut-batch-one-ratings-ready',{detail:{version:VERSION,audit:ledger.audit}}));
    return true;
  }

  function installLedgerHooks(){
    const ledger=window.UFC_KEEP_CUT_CATEGORY_RATINGS;
    if(!ledger)return;
    if(!ledger.__batchOneRebuildWrapped){
      const nativeRebuild=ledger.rebuild.bind(ledger);
      ledger.rebuild=function(){
        const result=nativeRebuild();
        applyRatings();
        return result;
      };
      ledger.__batchOneRebuildWrapped=true;
    }
    applyRatings();
    setTimeout(()=>{
      if(window.__ufcBatchOneDeferredHooks)return;
      window.__ufcBatchOneDeferredHooks=true;
      window.addEventListener('ufc-scoring-pipeline-ready',applyRatings);
      window.addEventListener('ufc-division-era-depth-finalized',applyRatings);
    },0);
  }

  installRoster();
  wrapRosterRebuild();
  mergeCompareProfiles();
  window.addEventListener('ufc-keep-cut-ratings-ready',installLedgerHooks);
  if(window.UFC_KEEP_CUT_CATEGORY_RATINGS)installLedgerHooks();

  window.UFC_PLAY_ROSTER_BATCH_ONE={
    version:VERSION,
    fighters:FIGHTERS.map(row=>({...row})),
    ratings:MANUAL_RATINGS,
    compareProfiles:COMPARE_PROFILES,
    fightLedger:FIGHT_LEDGER,
    installRoster,
    applyRatings,
    audit(){
      return {
        rosterPresent:FIGHTERS.every(row=>Boolean(window.UFC_PLAY_DATA?.resolve?.(row.name))),
        ratingsPresent:Object.keys(MANUAL_RATINGS).every(name=>Boolean(window.UFC_KEEP_CUT_CATEGORY_RATINGS?.resolve?.(name))),
        compareProfilesPresent:Object.keys(COMPARE_PROFILES).every(name=>Boolean(window.COMPARE_PROFILES?.[name])),
        rosterTotal:window.UFC_PLAY_DATA?.audit?.total||0,
        ledgerTotal:window.UFC_KEEP_CUT_CATEGORY_RATINGS?.audit?.ledgerTotal||0
      };
    }
  };
  document.documentElement.setAttribute('data-play-roster-batch-one',VERSION);
})();
