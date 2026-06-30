(function () {
  const PROFILES = {
    "Jon Jones": {
      shortCase: "The benchmark case: unmatched title-fight volume, elite wins across eras, long-term dominance, and no true competitive loss.",
      peak: "At his best, Jones was a cheat-code champion: impossible reach, elite wrestling, creative striking, and the ability to beat elite fighters in multiple ways.",
      resume: "Jones has the biggest total resume in the model: the light heavyweight reign, the title-fight volume, the multi-era opponent list, and the late heavyweight title value.",
      championship: "His championship case is the clearest in the sport. He did not just win the belt; he controlled the title picture for years.",
      opponentQuality: "The win list is massive: Cormier, Shogun, Rashad, Rampage, Machida, Gustafsson, Glover, Bader, Gane, and more. Some late-career wins need context, but the total ledger is huge.",
      longevity: "Jones' longevity is not just time passed. He stayed elite across multiple versions of light heavyweight, then returned years later and won heavyweight gold.",
      counter: "The counterargument is cleanliness. The Hamill DQ, no contest, long gaps, outside-the-cage controversy, and close late-career decisions make his case messier than GSP's.",
      edge: "Jones wins most comparisons because the total championship weight is overwhelming. Even when the case gets messy, the title volume, opponent depth, and multi-era separation are too much."
    },
    "Georges St-Pierre": {
      shortCase: "GSP is the cleanest elite GOAT case: deep opponent quality, long welterweight control, avenged losses, and one of the most complete skill sets ever.",
      peak: "At his best, GSP was control without chaos. He could out-wrestle strikers, out-strike wrestlers, win rounds safely, and make elite opponents look limited.",
      resume: "GSP's resume is built on quality and polish. He beat elite names across multiple generations, reclaimed his belt after the Serra upset, and later added the middleweight title.",
      championship: "His championship case is elite: a long welterweight reign, repeated title-fight wins, and a second-division title that adds value without carrying the whole case.",
      opponentQuality: "This is GSP's best lane. Hughes, Penn, Fitch, Shields, Condit, Diaz, Hendricks, and Bisping give him one of the strongest quality-win ledgers in the ranking.",
      longevity: "GSP's elite window was long, consistent, and unusually clean. He did not hang around collecting post-prime damage, which makes the resume easier to defend.",
      counter: "GSP's argument against anyone is cleanliness. He avenged the losses, controlled elite opponents, and has fewer awkward resume questions than Jones.",
      edge: "GSP wins comparisons when opponent quality, resume polish, and clean championship control matter more than raw title-fight volume."
    },
    "Demetrious Johnson": {
      shortCase: "DJ is the flyweight standard: historic title control, elite technical completeness, and one of the cleanest dominance cases in the ranking.",
      peak: "At his best, DJ was the most complete fighter in the sport: pace, wrestling, scrambling, submissions, striking, cardio, and fight IQ all working together.",
      resume: "DJ's resume is built on championship consistency. He ruled flyweight for years, defended repeatedly, and rarely looked out of control during his prime run.",
      championship: "His championship case is historically strong, even with division-strength context. The title reign was long, stable, and clearly separated him from the division.",
      opponentQuality: "The opponent list is good but division-adjusted. Benavidez, Dodson, Cejudo, Horiguchi, and others matter, but flyweight depth keeps the score below the very top names.",
      longevity: "DJ's longevity is strong because he stayed elite across a long title window without many ugly resume dents.",
      counter: "DJ's best counterargument is skill and cleanliness. He may not have the biggest names, but his technical control and consistency are almost impossible to ignore.",
      edge: "DJ wins when the debate rewards complete dominance, clean title control, and fewer resume holes over bigger-name but messier cases.",
      scope: "His later ONE run adds historical context, but this ranking is scoring the UFC portion of the career."
    },
    "Anderson Silva": {
      shortCase: "Anderson is the peak-aura legend: the most iconic middleweight reign, terrifying finishing ability, and some of the most memorable dominance moments ever.",
      peak: "At his best, Anderson felt untouchable. The counters, the creativity, the front kick, the matrix defense, and the sudden finishes gave his prime a mythology few fighters can match.",
      resume: "Anderson's resume is built on title reign plus aura. He ruled middleweight for years, finished challengers spectacularly, and became the symbol of peak dominance.",
      championship: "His championship case is huge: a long middleweight reign, repeated title wins, and a stretch where he felt like the most dangerous champion in the sport.",
      opponentQuality: "The opponent-quality case is strong but not perfect. The names matter, but middleweight division-strength context keeps this from being as clean as GSP or Jones.",
      longevity: "Anderson's elite window was long, but the back end is messy. The model protects later post-prime losses, while the Weidman losses still matter.",
      counter: "Anderson's argument is aura and peak fear factor. If someone values the most terrifying prime, he has one of the strongest cases ever.",
      edge: "Anderson wins comparisons when peak impact, finishing danger, and iconic championship dominance outweigh cleaner but less explosive resumes."
    },
    "Khabib Nurmagomedov": {
      shortCase: "Khabib is the cleanest peak-dominance case: unbeaten, overwhelming, and almost never in real trouble once he reached elite lightweight level.",
      peak: "At his best, Khabib was the most suffocating fighter in the sport. Everyone knew the game plan, and almost nobody could stop it.",
      resume: "Khabib's resume is short compared with the biggest title-volume cases, but it is incredibly clean: no losses, elite lightweight wins, and a final stretch that felt dominant and complete.",
      championship: "The championship case is strong but compact. He beat elite lightweights and retired on top, but he does not have the long title-fight volume of the highest-ranked champions.",
      opponentQuality: "The best wins are excellent: RDA, Barboza, McGregor, Poirier, and Gaethje give him a strong lightweight-quality case.",
      longevity: "Khabib's longevity is not weak, but it is not his main argument. His ranking is built more on peak dominance and perfect record than a massive title reign.",
      counter: "Khabib's argument against almost anyone is purity. No losses, no real collapse, no post-prime damage, and one of the clearest primes ever.",
      edge: "Khabib wins when the debate rewards dominance, perfection, and how unbeatable a fighter looked at his best."
    },
    "Islam Makhachev": {
      shortCase: "Islam is the modern lightweight resume case: elite skill, growing championship volume, and a deeper title-level resume than Khabib's shorter run.",
      peak: "At his best, Islam is a complete control fighter with elite grappling, improved striking, patience, defense, and the ability to beat champions across styles.",
      resume: "Islam's resume has grown into one of the strongest lightweight cases. The championship volume and elite-win depth have pushed him beyond a pure successor argument.",
      championship: "His championship case is now the separator from Khabib. He has more title-fight volume and more time proving the belt against elite opponents.",
      opponentQuality: "The best wins carry serious weight: Oliveira, Volkanovski, Poirier, Tsarukyan, Hooker, and others give him a deep modern lightweight ledger.",
      longevity: "Islam's longevity is still building, but he has already stacked enough elite years to make the resume feel more complete than a short peak-only case.",
      counter: "The counterargument against Islam is that he still does not feel as untouchable as Khabib. The resume may be bigger, but the aura is not quite as clean.",
      edge: "Islam wins when the debate rewards total resume over pure peak. His championship volume and elite-win depth have become too much to ignore."
    },
    "Alexander Volkanovski": {
      shortCase: "Volk is the defining modern featherweight champion: elite title control, Max trilogy separation, Aldo win value, and a strong case across skill, resume, and era strength.",
      peak: "At his best, Volk was adaptable, disciplined, fast, and almost impossible to solve. He could strike, wrestle, defend, adjust mid-fight, and win tactical battles against elite opponents.",
      resume: "Volk's resume is built on featherweight separation. He beat Aldo, took the belt from Holloway, won the trilogy, and defended against multiple top contenders.",
      championship: "His championship case is extremely clean at featherweight. The Max trilogy gives him direct separation over another all-time great from the same division.",
      opponentQuality: "Aldo, Holloway, Ortega, Korean Zombie, Yair, and Makhachev context give Volk a strong opponent-quality case, even with the Islam losses treated carefully.",
      longevity: "Volk's elite window was strong, but not as long as Holloway's. His case is more about clean championship separation than pure career volume.",
      counter: "Volk's best argument is direct separation. He did not just share an era with Max — he beat him three times and became the defining featherweight champion.",
      edge: "Volk wins when head-to-head separation, championship control, and modern featherweight strength matter more than raw career volume.",
      rivalry: "Against Holloway, Volk's case is simple: Max has the volume, but Volk took the belt, won the trilogy, and owned the championship separation."
    },
    "Max Holloway": {
      shortCase: "Holloway is the volume king at featherweight: elite durability, huge opponent depth, long-term relevance, and one of the deepest bodies of work in the ranking.",
      peak: "At his best, Max was pace, boxing, durability, and pressure. He overwhelmed great fighters by turning fights into long, exhausting conversations they could not keep up with.",
      resume: "Holloway's resume is built on volume and staying power. He kept beating top-tier names before, during, and after his title reign.",
      championship: "His championship case is strong, but not as clean as Volk's because the trilogy directly separates them in the same era.",
      opponentQuality: "Holloway's win depth is excellent: Aldo twice, Ortega, Kattar, Yair, Korean Zombie, Gaethje, and many more give him one of the best opponent-volume cases.",
      longevity: "This is one of Max's biggest edges. He has stayed elite for years, across multiple phases, even after losing the belt.",
      counter: "Max's argument is total body of work. Even when someone peaked higher, Max often has more elite volume and more proof over time.",
      edge: "Holloway wins when the debate rewards longevity, opponent volume, durability, and sustained elite relevance."
    },
    "Kamaru Usman": {
      shortCase: "Usman is the great welterweight champion of the post-GSP era: dominant title run, elite round control, strong defenses, and one of the best championship peaks in the ranking.",
      peak: "At his best, Usman was a suffocating champion with pressure, wrestling threat, cardio, clinch control, and improving power that made him feel like the clear best fighter in the world.",
      resume: "Usman's resume is built on championship authority. He ruled welterweight, defended repeatedly, and beat top contenders during a strong modern era.",
      championship: "His championship case is stronger than his overall volume case. The title run was clean, controlled, and had real champion energy.",
      opponentQuality: "Woodley, Covington twice, Burns, Masvidal, Edwards, and RDA give Usman a strong modern welterweight ledger.",
      longevity: "Usman's elite window was excellent but not as long as Holloway's or GSP's. That is why he can peak higher than some fighters but still trail them in total resume.",
      counter: "Usman's argument is champion peak. If the debate is who looked more in control at the top, Usman has a real lane.",
      edge: "Usman wins when championship peak, round control, and title-defense authority outweigh longer but less dominant resumes."
    },
    "Jose Aldo": {
      shortCase: "Aldo is one of the great featherweight legends: championship skill, elite longevity, and enough late-career bantamweight relevance to keep his ranking case alive.",
      peak: "At his best, Aldo was explosive, technical, violent, and almost impossible to pressure cleanly. The takedown defense, leg kicks, boxing, and athleticism made him feel like a complete champion.",
      resume: "Aldo's resume in this ranking is complicated but still strong. His WEC run is historical context, while the scored portion still has enough title value, elite wins, and longevity to rank highly.",
      championship: "His championship case is strong, but not fully captured by this model because part of his legendary reign happened before the UFC portion being scored.",
      opponentQuality: "Aldo's UFC win list has real value: Edgar, Mendes, Korean Zombie, Lamas, Stephens, Moicano, Vera, and Font all help the case.",
      longevity: "Aldo's longevity is a major strength. Even after losing the featherweight belt, he stayed relevant and made a serious run at bantamweight.",
      counter: "Aldo's argument is historical greatness plus longevity. Even with the scoring boundary, he has more sustained elite relevance than many champions above and below him.",
      edge: "Aldo wins when the debate values long-term elite relevance, championship skill, and the ability to stay dangerous across eras and divisions.",
      scope: "Aldo's WEC greatness matters historically, but this ranking only scores his UFC resume. That keeps the app consistent even if it underrates his full career legacy."
    },
    "Dominick Cruz": {
      shortCase: "Cruz is one of the smartest and most unique champions ever: brilliant footwork, elite fight IQ, a historic comeback, and a complicated resume shaped by injuries and gaps.",
      peak: "At his best, Cruz was a puzzle. The movement, timing, defensive reads, and awkward entries made him one of the hardest champions to prepare for.",
      resume: "Cruz's resume is brilliant but fragmented. The highs are elite, especially the Dillashaw comeback, but the injuries and gaps limit the total volume.",
      championship: "His championship case has real shine because of how unique the reign and comeback were, but the scored volume is lighter than the longer title-run champions.",
      opponentQuality: "Dillashaw, Faber, Demetrious Johnson, and Mizugaki give Cruz meaningful win value, though part of his broader historical case sits outside this scoring boundary.",
      longevity: "Cruz's longevity is complicated. He stayed relevant over a huge calendar span, but the model cares about active elite years, and injuries created major gaps.",
      counter: "Cruz's argument is uniqueness and comeback value. Few fighters ever returned from that much time away and beat a champion like Dillashaw.",
      edge: "Cruz wins when the debate values tactical brilliance, comeback legacy, and peak skill over raw fight volume.",
      scope: "Cruz's WEC run is historical context, but this ranking scores his UFC resume. That makes his case cleaner to compare, but it also limits the full historical picture."
    },
    "Conor McGregor": {
      shortCase: "Conor is the star-power and iconic-moment case: the Aldo knockout, the Alvarez masterclass, the double-champ moment, and the biggest cultural impact in UFC history.",
      peak: "At his best, Conor was a terrifying precision striker with timing, distance control, confidence, and left-hand power that changed fights instantly.",
      resume: "Conor's resume is high-impact but short. The best moments are enormous, but the long-term ranked body of work does not match the deeper all-time champions.",
      championship: "His championship case is historically important because of the two-division achievement, but he lacks the title-defense volume that drives the top of the ranking.",
      opponentQuality: "Aldo, Alvarez, Poirier, Holloway, Mendes, and Diaz give Conor real name value, but timing and volume keep the opponent-quality case below the elite resume monsters.",
      longevity: "Longevity is the problem. Conor's prime window was electric, but short, and later inactivity keeps the resume from growing.",
      counter: "Conor's argument is impact. If the debate is iconic moments, star power, and changing the business, he is in a class almost by himself.",
      edge: "Conor wins comparisons when peak fame, historic moments, and two-division star power outweigh deeper but less spectacular resumes.",
      starPower: "Conor should never be treated like a normal resume case. His ranking score should stay honest, but the app should respect that his cultural impact is unmatched."
    },
    "Matt Hughes": {
      shortCase: "Hughes is one of the defining welterweight champions: a physical, title-winning force from the earlier UFC era with real championship volume and a long list of important wins.",
      peak: "At his best, Hughes was the standard at welterweight: overwhelming grappling, brutal top control, and a title-level style that shaped the division before GSP took over.",
      resume: "Hughes has the deeper championship resume here: more title-fight volume, more sustained divisional control, and a longer run as one of the sport's defining champions.",
      championship: "His best argument is championship weight. Hughes did not just win a belt; he spent years as the face of the welterweight title picture.",
      opponentQuality: "Hughes' win list carries strong era value, especially when the model gives credit for title-level opponents and former champions in his division.",
      longevity: "The edge for Hughes is that his case is not just one great moment or one short burst. He stayed relevant at championship level for longer than most compact-resume fighters.",
      counter: "The knock on Hughes is era context. His welterweight run was historically huge, but the division was not as deep or modernized as later welterweight eras.",
      edge: "Hughes wins when the debate becomes total title weight and sustained divisional control rather than pure peak efficiency."
    },
    "Henry Cejudo": {
      shortCase: "Cejudo is one of the best short-window legacy cases in the sport: Olympic gold medalist, flyweight champion, bantamweight champion, and a fighter who packed a lot of value into a compact UFC run.",
      peak: "Cejudo's peak was absurdly efficient: he beat Demetrious Johnson, finished T.J. Dillashaw, moved up, and won bantamweight gold against Marlon Moraes.",
      resume: "His issue is volume. The high-end wins are excellent, but the long-term UFC resume is short compared with the deeper all-time champions.",
      championship: "Cejudo has real championship shine because of the two-division achievement, but he does not have the long title reign or defense volume of the bigger all-time cases.",
      opponentQuality: "The best Cejudo names are strong: Demetrious Johnson, T.J. Dillashaw, Marlon Moraes, Dominick Cruz, and Jussier Formiga give him real elite-name value.",
      longevity: "The retirement gap and short title window keep Cejudo from climbing as high as fighters with years of sustained championship relevance.",
      counter: "Cejudo's argument is peak efficiency. He did a lot in a small window, and his best wins are loud enough to make him dangerous in almost any comparison.",
      edge: "Cejudo loses ground when the model asks for long-term title volume and sustained elite years."
    }
  };

  function install() {
    if (typeof DISPLAY_OVERRIDES === "undefined") return;
    Object.entries(PROFILES).forEach(([fighter, compareProfile]) => {
      DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
      DISPLAY_OVERRIDES[fighter].compareProfile = {
        ...(DISPLAY_OVERRIDES[fighter].compareProfile || {}),
        ...compareProfile
      };
    });
  }

  install();
})();
