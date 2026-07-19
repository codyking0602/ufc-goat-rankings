(function(){
  'use strict';

  const VERSION='wavelength-20260718a-live-replacement';
  const SITE_URL='https://codyking0602.github.io/ufc-goat-rankings/';
  const DATA=window.RANKING_DATA||{};
  const OVERRIDES=window.DISPLAY_OVERRIDES||{};
  const panel=document.getElementById('playTop10Panel');
  const modeButton=document.querySelector('[data-play-mode="top10"]');
  if(!panel||!modeButton)return;

  const ROUNDS=Object.freeze([
    {id:'chaos-eight',target:8,clues:[
      {category:'FIGHTER TRAIT',text:'Michael Chandler’s ability to follow a game plan',rating:12},
      {category:'LOCATION',text:'The UFC Apex as a live crowd atmosphere',rating:5},
      {category:'UFC LEGACY',text:'Greg Hardy’s UFC legacy',rating:9},
      {category:'FIGHTER',text:'CM Punk as an overall UFC fighter',rating:2}
    ]},
    {id:'ufc-chaos-eighteen',target:18,clues:[
      {category:'UFC CULTURE',text:'Dana White’s press-conference honesty',rating:20},
      {category:'UFC DATA',text:'The accuracy of UFC height listings',rating:15},
      {category:'PERSONALITY',text:'Hasbulla’s relevance to the UFC product',rating:19},
      {category:'FIGHTER TRAIT',text:'An average heavyweight’s five-round cardio',rating:17}
    ]},
    {id:'low-prestige-twenty-seven',target:27,clues:[
      {category:'CHAMPIONSHIP',text:'The legitimacy of a typical UFC interim belt',rating:30},
      {category:'UFC RESUME',text:'Paige VanZant’s UFC-only résumé',rating:25},
      {category:'LOCATION',text:'The UFC Apex as a fan travel destination',rating:22},
      {category:'PERSONALITY',text:'Tito Ortiz’s public speaking',rating:29}
    ]},
    {id:'rough-thirty-one',target:31,clues:[
      {category:'UFC DECISION',text:'Signing CM Punk as a sporting decision',rating:27},
      {category:'ATMOSPHERE',text:'The crowd energy for an average Apex prelim',rating:28},
      {category:'POPULARITY',text:'Greg Hardy’s popularity with hardcore UFC fans',rating:32},
      {category:'UFC SYSTEM',text:'The usefulness of the official UFC rankings',rating:34}
    ]},
    {id:'mixed-thirty-five',target:35,clues:[
      {category:'UFC SYSTEM',text:'UFC judging as a whole',rating:37},
      {category:'MATCHMAKING',text:'The need for a fourth Moreno–Figueiredo fight',rating:32},
      {category:'UFC LEGACY',text:'Sage Northcutt’s UFC legacy',rating:34},
      {category:'UFC CULTURE',text:'The quality of an average modern UFC poster',rating:38}
    ]},
    {id:'tested-forty-three',target:43,clues:[
      {category:'UFC HISTORY',text:'The BMF belt’s importance to UFC history',rating:39},
      {category:'CONTENDER',text:'Paulo Costa’s reliability as a contender',rating:47},
      {category:'PERSONALITY',text:'Nina Drama as a UFC personality',rating:44},
      {category:'CHAMPIONSHIP',text:'Colby Covington’s championship credibility',rating:42}
    ]},
    {id:'resume-forty-seven',target:47,clues:[
      {category:'CHAMPIONSHIP',text:'Jorge Masvidal’s championship résumé',rating:45},
      {category:'CHAMPIONSHIP',text:'Chael Sonnen’s actual UFC championship résumé',rating:48},
      {category:'UFC CULTURE',text:'The prestige of the BMF title',rating:50},
      {category:'UFC HISTORY',text:'Tito Ortiz’s relevance to modern UFC fans',rating:46}
    ]},
    {id:'balanced-fifty',target:50,clues:[
      {category:'UFC RESUME',text:'Michael Chandler’s UFC-only résumé',rating:53},
      {category:'UFC CULTURE',text:'The BMF belt’s competitive meaning',rating:47},
      {category:'UFC CONTENT',text:'UFC Embedded as weekly viewing',rating:51},
      {category:'CONTENDER',text:'Kevin Holland’s reliability as a contender',rating:49}
    ]},
    {id:'solid-fifty-six',target:56,clues:[
      {category:'FIGHTER SKILL',text:'Derrick Lewis’s technical depth',rating:53},
      {category:'UFC RESUME',text:'Jorge Masvidal’s UFC-only résumé',rating:58},
      {category:'COMMENTARY',text:'Joe Rogan’s technical commentary',rating:55},
      {category:'LOCATION',text:'Las Vegas as a UFC travel destination',rating:59}
    ]},
    {id:'career-sixty',target:60,clues:[
      {category:'UFC CAREER',text:'Michael Chandler’s UFC career',rating:61},
      {category:'PRESENTATION',text:'Fight Island’s visual presentation',rating:63},
      {category:'UFC RESUME',text:'Colby Covington’s UFC-only résumé',rating:58},
      {category:'UFC SYSTEM',text:'The consistency of UFC Hall of Fame selections',rating:57}
    ]},
    {id:'culture-sixty-two',target:62,clues:[
      {category:'STAR POWER',text:'Paddy Pimblett’s star power',rating:65},
      {category:'GOAT CASE',text:'Tony Ferguson’s UFC-only GOAT case',rating:59},
      {category:'PRESENTATION',text:'Bruce Buffer’s catchphrase quality',rating:64},
      {category:'UFC CULTURE',text:'The Reebok era’s visual identity',rating:60}
    ]},
    {id:'depth-sixty-five',target:65,clues:[
      {category:'CHAMPIONSHIP',text:'Dustin Poirier’s championship résumé',rating:62},
      {category:'OFFICIATING',text:'Herb Dean’s overall refereeing reputation',rating:66},
      {category:'PRESENTATION',text:'Israel Adesanya’s walkout creativity',rating:68},
      {category:'UFC HISTORY',text:'The Ultimate Fighter’s importance to modern UFC fans',rating:64}
    ]},
    {id:'variety-sixty-seven',target:67,clues:[
      {category:'FIGHTER SKILL',text:'Khamzat Chimaev’s microphone skills',rating:65},
      {category:'ATMOSPHERE',text:'Madison Square Garden’s UFC crowd atmosphere',rating:70},
      {category:'UFC RESUME',text:'Anthony Pettis’s UFC-only résumé',rating:66},
      {category:'FIGHTER SKILL',text:'A spinning back kick as a high-percentage technique',rating:63}
    ]},
    {id:'crowd-seventy',target:70,clues:[
      {category:'UFC RESUME',text:'Donald Cerrone’s UFC-only résumé',rating:71},
      {category:'COMMENTARY',text:'Dominick Cruz as a commentator',rating:68},
      {category:'ATMOSPHERE',text:'A packed UFC Fight Night crowd in London',rating:73},
      {category:'UFC CULTURE',text:'The BMF belt as entertainment',rating:69}
    ]},
    {id:'original-seventy-two',target:72,clues:[
      {category:'FIGHTER SKILL',text:'Justin Gaethje’s wrestling',rating:74},
      {category:'CHAMPIONSHIP',text:'Belal Muhammad’s championship résumé',rating:70},
      {category:'LOCATION',text:'Abu Dhabi as a UFC location',rating:75},
      {category:'FIGHTER',text:'Chase Hooper as an overall UFC fighter',rating:69}
    ]},
    {id:'fun-seventy-five',target:75,clues:[
      {category:'PERSONALITY',text:'Alex Pereira’s ability to create hype without saying much',rating:76},
      {category:'FIGHTER SKILL',text:'Charles Oliveira’s recovery',rating:78},
      {category:'ATMOSPHERE',text:'A major UFC crowd in London',rating:74},
      {category:'UFC CULTURE',text:'“The Korean Zombie” as a fighter nickname',rating:77}
    ]},
    {id:'promotion-seventy-seven',target:77,clues:[
      {category:'FIGHTER SKILL',text:'Alexander Volkanovski’s fight IQ',rating:80},
      {category:'UFC HISTORY',text:'McGregor–Aldo’s historical importance',rating:79},
      {category:'COMMENTARY',text:'Laura Sanko as a commentator',rating:75},
      {category:'UFC CONTENT',text:'UFC Embedded as promotional content',rating:74}
    ]},
    {id:'sharp-seventy-nine',target:79,clues:[
      {category:'FIGHTER SKILL',text:'Sean O’Malley’s striking accuracy',rating:81},
      {category:'UFC HISTORY',text:'UFC 205’s historical importance',rating:78},
      {category:'COMMENTARY',text:'Daniel Cormier as an analyst',rating:76},
      {category:'PERSONALITY',text:'Nate Diaz’s authenticity',rating:80}
    ]},
    {id:'event-eighty-two',target:82,clues:[
      {category:'PROMOTION',text:'Conor McGregor’s promotional impact',rating:86},
      {category:'FIGHT',text:'Zhang Weili vs. Joanna Jędrzejczyk’s rewatchability',rating:84},
      {category:'COACHING',text:'Trevor Wittman as a coach',rating:79},
      {category:'VENUE',text:'Madison Square Garden as a UFC venue',rating:81}
    ]},
    {id:'complete-eighty-four',target:84,clues:[
      {category:'UFC LEGACY',text:'José Aldo’s UFC-only legacy',rating:82},
      {category:'FIGHTER SKILL',text:'Islam Makhachev’s technical completeness',rating:87},
      {category:'EVENT',text:'UFC 300’s card depth',rating:85},
      {category:'UFC HISTORY',text:'Joe Rogan’s importance to UFC history',rating:83}
    ]},
    {id:'elite-eighty-five',target:85,clues:[
      {category:'FIGHTER TRAIT',text:'Max Holloway’s durability',rating:88},
      {category:'COMMENTARY',text:'Jon Anik’s play-by-play',rating:84},
      {category:'PRIME',text:'Khabib Nurmagomedov’s prime dominance',rating:87},
      {category:'EVENT',text:'UFC 300 as an event',rating:83}
    ]},
    {id:'historic-eighty-eight',target:88,clues:[
      {category:'FIGHTER SKILL',text:'Georges St-Pierre’s fight IQ',rating:91},
      {category:'AURA',text:'Alex Pereira’s aura',rating:89},
      {category:'UFC HISTORY',text:'Bruce Buffer’s importance to the UFC',rating:86},
      {category:'FIGHT',text:'Jones–Gustafsson I’s historical value',rating:87}
    ]},
    {id:'greatness-ninety-one',target:91,clues:[
      {category:'FIGHTER SKILL',text:'Demetrious Johnson’s technical skill',rating:93},
      {category:'AURA',text:'Anderson Silva’s peak aura',rating:92},
      {category:'PRIME',text:'Khabib Nurmagomedov’s UFC prime record',rating:95},
      {category:'ATMOSPHERE',text:'UFC 229’s atmosphere',rating:89}
    ]},
    {id:'goat-ninety-five',target:95,clues:[
      {category:'GOAT CASE',text:'Jon Jones’s UFC-only GOAT résumé',rating:99},
      {category:'FIGHTER SKILL',text:'Georges St-Pierre’s completeness',rating:96},
      {category:'GOAT CASE',text:'Amanda Nunes’s women’s UFC GOAT case',rating:94},
      {category:'FIGHTER TRAIT',text:'Max Holloway’s chin',rating:93}
    ]}
  ]);

  const state={round:null,clueIndex:0,guesses:[],guess:50,complete:false,shareStatus:''};

  const nativeShare=navigator.share;
  if(typeof nativeShare==='function'){
    const polishedShare=function(data){
      if(data?.title==='My Blind Resume Score'){
        const lines=String(data.text||'').split('\n').map(line=>line.trim()).filter(Boolean);
        const score=lines.find(line=>/^I scored\s+\d+\/5\s+in Blind Resume/i.test(line))||'I played the 5-matchup Blind Resume challenge.';
        const miss=lines.find(line=>/^Biggest miss:/i.test(line))||'';
        return nativeShare.call(this,{...data,text:[score,miss,'Can you beat my score?',SITE_URL].filter(Boolean).join('\n\n')});
      }
      return nativeShare.call(this,data);
    };
    try{Object.defineProperty(navigator,'share',{configurable:true,value:polishedShare});}
    catch(_error){try{Object.getPrototypeOf(navigator).share=polishedShare;}catch(_ignored){}}
  }

  function esc(value){
    return String(value??'').replace(/[&<>"']/g,char=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[char]));
  }
  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function scoreFor(guess,target){return clamp(100-Math.abs(Number(guess)-Number(target)),0,100);}
  function distanceCopy(distance){
    if(distance===0)return 'NAILED IT';
    if(distance===1)return 'ONE POINT OFF';
    if(distance<=3)return `${distance} POINTS OFF · ELITE READ`;
    if(distance<=7)return `${distance} POINTS OFF · CLOSE`;
    return `${distance} POINTS OFF`;
  }
  function lastRoundId(){try{return localStorage.getItem('ufc-wavelength-last-round')||'';}catch(_error){return '';}}
  function rememberRound(id){try{localStorage.setItem('ufc-wavelength-last-round',id);}catch(_error){}}
  function pickRound(){
    const last=lastRoundId();
    const options=ROUNDS.filter(round=>round.id!==last);
    return options[Math.floor(Math.random()*options.length)]||ROUNDS[0];
  }

  function injectStyles(){
    if(document.getElementById('ufc-wavelength-css'))return;
    const style=document.createElement('style');
    style.id='ufc-wavelength-css';
    style.textContent=`
      #playTop10Panel{max-width:780px;margin:0 auto}
      #playTop10Panel .wavelength-shell{display:grid;gap:14px}
      #playTop10Panel .wavelength-topline{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:2px 2px 0}
      #playTop10Panel .wavelength-kicker{color:#facc15;font-size:11px;font-weight:950;letter-spacing:.12em}
      #playTop10Panel .wavelength-round-label{color:#94a3b8;font-size:11px;font-weight:850;letter-spacing:.08em}
      #playTop10Panel .wavelength-progress{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}
      #playTop10Panel .wavelength-progress i{height:6px;border-radius:999px;background:#263244;transition:background .2s ease,transform .2s ease}
      #playTop10Panel .wavelength-progress i.is-complete{background:#f97316}
      #playTop10Panel .wavelength-progress i.is-current{background:#facc15;transform:scaleY(1.35)}
      #playTop10Panel .wavelength-card{position:relative;overflow:hidden;border:1px solid #334155;border-radius:20px;background:linear-gradient(150deg,#172033 0%,#0a101c 70%);padding:18px}
      #playTop10Panel .wavelength-card:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 90% 5%,rgba(249,115,22,.17),transparent 38%);pointer-events:none}
      #playTop10Panel .wavelength-card>*{position:relative}
      #playTop10Panel .wavelength-clue-meta{display:flex;align-items:center;justify-content:space-between;gap:10px}
      #playTop10Panel .wavelength-category{display:inline-flex;border:1px solid rgba(250,204,21,.45);border-radius:999px;background:rgba(250,204,21,.08);padding:5px 9px;color:#facc15;font-size:10px;font-weight:950;letter-spacing:.1em}
      #playTop10Panel .wavelength-clue-number{color:#94a3b8;font-size:11px;font-weight:850}
      #playTop10Panel .wavelength-prompt{min-height:90px;display:flex;align-items:center;margin:10px 0 14px;color:#f8fafc;font-size:clamp(22px,5vw,34px);font-weight:950;line-height:1.07;letter-spacing:-.025em}
      #playTop10Panel .wavelength-question{color:#94a3b8;font-size:12px;font-weight:700}
      #playTop10Panel .wavelength-guess-panel{border:1px solid #334155;border-radius:18px;background:#0a1019;padding:15px}
      #playTop10Panel .wavelength-guess-head{display:flex;align-items:end;justify-content:space-between;gap:12px}
      #playTop10Panel .wavelength-guess-head span{color:#94a3b8;font-size:11px;font-weight:900;letter-spacing:.08em}
      #playTop10Panel .wavelength-number{color:#fff;font-size:52px;font-weight:1000;line-height:.9;letter-spacing:-.06em}
      #playTop10Panel .wavelength-range{width:100%;margin:18px 0 8px;accent-color:#f97316}
      #playTop10Panel .wavelength-scale{display:flex;justify-content:space-between;color:#64748b;font-size:10px;font-weight:850}
      #playTop10Panel .wavelength-lock{width:100%;margin-top:14px;border:0;border-radius:14px;background:linear-gradient(90deg,#f97316,#facc15);padding:13px 16px;color:#111827;font-size:12px;font-weight:1000;letter-spacing:.08em;cursor:pointer}
      #playTop10Panel .wavelength-lock:active{transform:translateY(1px)}
      #playTop10Panel .wavelength-history{display:flex;align-items:center;gap:7px;min-height:29px;overflow:hidden}
      #playTop10Panel .wavelength-history-label{color:#64748b;font-size:10px;font-weight:900;letter-spacing:.08em}
      #playTop10Panel .wavelength-history b{display:inline-flex;align-items:center;justify-content:center;min-width:32px;border:1px solid #334155;border-radius:999px;background:#111827;padding:5px 8px;color:#f8fafc;font-size:11px}
      #playTop10Panel .wavelength-history em{color:#475569;font-style:normal;font-size:11px}
      #playTop10Panel .wavelength-rules{margin:0;color:#64748b;font-size:11px;line-height:1.45;text-align:center}
      #playTop10Panel .wavelength-result{display:grid;gap:14px}
      #playTop10Panel .wavelength-result-hero{border:1px solid rgba(249,115,22,.6);border-radius:20px;background:linear-gradient(145deg,rgba(249,115,22,.15),rgba(250,204,21,.06),#0a1019 70%);padding:18px;text-align:center}
      #playTop10Panel .wavelength-result-hero span{display:block;color:#facc15;font-size:10px;font-weight:950;letter-spacing:.12em}
      #playTop10Panel .wavelength-score{display:block;margin:5px 0;color:#fff;font-size:64px;font-weight:1000;line-height:.9;letter-spacing:-.07em}
      #playTop10Panel .wavelength-result-hero small{color:#cbd5e1;font-size:12px;font-weight:800}
      #playTop10Panel .wavelength-result-metrics{display:grid;grid-template-columns:1fr 1fr;gap:9px}
      #playTop10Panel .wavelength-result-metrics div{border:1px solid #334155;border-radius:15px;background:#0b111c;padding:12px;text-align:center}
      #playTop10Panel .wavelength-result-metrics span{display:block;color:#64748b;font-size:9px;font-weight:950;letter-spacing:.1em}
      #playTop10Panel .wavelength-result-metrics strong{display:block;margin-top:4px;color:#f8fafc;font-size:24px;font-weight:1000}
      #playTop10Panel .wavelength-reveal{display:grid;gap:8px}
      #playTop10Panel .wavelength-reveal-row{display:grid;grid-template-columns:42px 1fr 40px;align-items:center;gap:10px;border:1px solid #263244;border-radius:14px;background:#0b111b;padding:10px}
      #playTop10Panel .wavelength-reveal-row b{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:10px;background:#172033;color:#facc15;font-size:12px}
      #playTop10Panel .wavelength-reveal-copy span,#playTop10Panel .wavelength-reveal-copy strong{display:block}
      #playTop10Panel .wavelength-reveal-copy span{color:#64748b;font-size:9px;font-weight:950;letter-spacing:.08em}
      #playTop10Panel .wavelength-reveal-copy strong{margin-top:2px;color:#e2e8f0;font-size:12px;line-height:1.25}
      #playTop10Panel .wavelength-reveal-rating{color:#fff;font-size:20px;font-weight:1000;text-align:right}
      #playTop10Panel .wavelength-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}
      #playTop10Panel .wavelength-actions button{border-radius:14px;padding:12px;font-size:11px;font-weight:950;letter-spacing:.06em;cursor:pointer}
      #playTop10Panel .wavelength-again{border:0;background:linear-gradient(90deg,#f97316,#facc15);color:#111827}
      #playTop10Panel .wavelength-share{border:1px solid #475569;background:#111827;color:#f8fafc}
      #playTop10Panel .wavelength-share-status{min-height:15px;color:#94a3b8;font-size:10px;text-align:center}
      @media(max-width:620px){
        #playTop10Panel .wavelength-card{padding:15px;border-radius:17px}
        #playTop10Panel .wavelength-prompt{min-height:78px;font-size:25px}
        #playTop10Panel .wavelength-number{font-size:46px}
        #playTop10Panel .wavelength-result-hero{padding:16px}
        #playTop10Panel .wavelength-score{font-size:58px}
      }
    `;
    document.head.appendChild(style);
  }

  function shellMarkup(){
    return `
      <div class="wavelength-shell" data-wavelength-shell>
        <div class="wavelength-topline"><span class="wavelength-kicker">FIND THE HIDDEN NUMBER</span><span class="wavelength-round-label" data-wavelength-round>CLUE 1 OF 4</span></div>
        <div class="wavelength-progress" aria-label="Wavelength clue progress">${[0,1,2,3].map(index=>`<i data-wavelength-progress="${index}"></i>`).join('')}</div>
        <div data-wavelength-stage></div>
      </div>`;
  }

  function historyMarkup(){
    if(!state.guesses.length)return '<span class="wavelength-history-label">YOUR GUESSES WILL STAY HERE</span>';
    return `<span class="wavelength-history-label">PATH</span>${state.guesses.map((guess,index)=>`${index?'<em>→</em>':''}<b>${guess}</b>`).join('')}`;
  }

  function clueMarkup(){
    const clue=state.round.clues[state.clueIndex];
    return `
      <section class="wavelength-card" aria-live="polite">
        <div class="wavelength-clue-meta"><span class="wavelength-category">${esc(clue.category)}</span><span class="wavelength-clue-number">CLUE ${state.clueIndex+1}</span></div>
        <div class="wavelength-prompt">${esc(clue.text)}</div>
        <div class="wavelength-question">Where does it land on the app’s 1–100 UFC scale?</div>
      </section>
      <section class="wavelength-guess-panel">
        <div class="wavelength-guess-head"><span>${state.clueIndex===3?'FINAL ANSWER':'YOUR GUESS'}</span><strong class="wavelength-number" data-wavelength-number>${state.guess}</strong></div>
        <input class="wavelength-range" data-wavelength-range type="range" min="1" max="100" step="1" value="${state.guess}" aria-label="Your Wavelength guess from 1 to 100">
        <div class="wavelength-scale"><span>1</span><span>50</span><span>100</span></div>
        <button class="wavelength-lock" data-wavelength-lock type="button">${state.clueIndex===3?'LOCK FINAL GUESS':'LOCK GUESS & REVEAL NEXT CLUE'}</button>
      </section>
      <div class="wavelength-history" data-wavelength-history>${historyMarkup()}</div>
      <p class="wavelength-rules">No high-or-low hints. Use each new UFC clue to recalibrate. Only your fourth guess scores.</p>`;
  }

  function resultMarkup(){
    const finalGuess=state.guesses[3];
    const distance=Math.abs(finalGuess-state.round.target);
    const score=scoreFor(finalGuess,state.round.target);
    return `
      <section class="wavelength-result" aria-live="polite">
        <div class="wavelength-result-hero"><span>FINAL SCORE</span><strong class="wavelength-score">${score}</strong><small>${esc(distanceCopy(distance))}</small></div>
        <div class="wavelength-result-metrics">
          <div><span>HIDDEN NUMBER</span><strong>${state.round.target}</strong></div>
          <div><span>FINAL GUESS</span><strong>${finalGuess}</strong></div>
        </div>
        <div class="wavelength-history"><span class="wavelength-history-label">YOUR PATH</span>${state.guesses.map((guess,index)=>`${index?'<em>→</em>':''}<b>${guess}</b>`).join('')}</div>
        <div class="wavelength-reveal">${state.round.clues.map((clue,index)=>`
          <div class="wavelength-reveal-row"><b>${index+1}</b><div class="wavelength-reveal-copy"><span>${esc(clue.category)}</span><strong>${esc(clue.text)}</strong></div><div class="wavelength-reveal-rating">${clue.rating}</div></div>`).join('')}</div>
        <div class="wavelength-actions"><button class="wavelength-again" data-wavelength-again type="button">PLAY ANOTHER</button><button class="wavelength-share" data-wavelength-share type="button">SHARE SCORE</button></div>
        <div class="wavelength-share-status" data-wavelength-share-status>${esc(state.shareStatus)}</div>
      </section>`;
  }

  function render(){
    const stage=panel.querySelector('[data-wavelength-stage]');
    if(!stage||!state.round)return;
    const roundLabel=panel.querySelector('[data-wavelength-round]');
    if(roundLabel)roundLabel.textContent=state.complete?'RESULT':`CLUE ${state.clueIndex+1} OF 4`;
    panel.querySelectorAll('[data-wavelength-progress]').forEach((bar,index)=>{
      bar.classList.toggle('is-complete',state.complete||index<state.clueIndex);
      bar.classList.toggle('is-current',!state.complete&&index===state.clueIndex);
    });
    stage.innerHTML=state.complete?resultMarkup():clueMarkup();
    wireStage();
  }

  function wireStage(){
    const range=panel.querySelector('[data-wavelength-range]');
    const number=panel.querySelector('[data-wavelength-number]');
    range?.addEventListener('input',event=>{
      state.guess=clamp(Number(event.target.value)||50,1,100);
      if(number)number.textContent=String(state.guess);
    });
    panel.querySelector('[data-wavelength-lock]')?.addEventListener('click',lockGuess);
    panel.querySelector('[data-wavelength-again]')?.addEventListener('click',newRound);
    panel.querySelector('[data-wavelength-share]')?.addEventListener('click',shareResult);
  }

  function lockGuess(){
    if(state.complete||!state.round)return;
    state.guesses.push(state.guess);
    if(state.clueIndex>=3){
      state.complete=true;
      render();
      panel.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    state.clueIndex+=1;
    render();
  }

  function newRound(){
    state.round=pickRound();
    state.clueIndex=0;
    state.guesses=[];
    state.guess=50;
    state.complete=false;
    state.shareStatus='';
    rememberRound(state.round.id);
    render();
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function shareText(){
    const finalGuess=state.guesses[3];
    const score=scoreFor(finalGuess,state.round.target);
    return `WAVELENGTH · UFC EDITION\nScore: ${score}/100\nTarget: ${state.round.target} · Final guess: ${finalGuess}\nPath: ${state.guesses.join(' → ')}\n\nCan you find the hidden number?\n${SITE_URL}`;
  }

  async function shareResult(){
    const text=shareText();
    state.shareStatus='';
    try{
      if(navigator.share){
        await navigator.share({title:'My UFC Wavelength Score',text});
        return;
      }
      await navigator.clipboard.writeText(text);
      state.shareStatus='SCORE COPIED';
    }catch(error){
      if(error?.name==='AbortError')return;
      try{
        await navigator.clipboard.writeText(text);
        state.shareStatus='SCORE COPIED';
      }catch(_copyError){state.shareStatus='SHARE FAILED';}
    }
    const status=panel.querySelector('[data-wavelength-share-status]');
    if(status)status.textContent=state.shareStatus;
  }

  function applyWavelengthCopy(){
    modeButton.textContent='Wavelength';
    modeButton.setAttribute('aria-label','Play Wavelength');
    const hub=window.UFC_PLAY_HUB;
    const model=hub?.games?.find?.(game=>game.id==='top10');
    if(model){
      model.icon='≈';
      model.title='Wavelength';
      model.description='Use four completely different UFC clues to find one hidden number from 1–100.';
    }
    const card=document.querySelector('#playHub [data-open-game="top10"]');
    if(card){
      const icon=card.querySelector('.play-game-icon');
      const title=card.querySelector('.play-game-copy strong');
      const description=card.querySelector('.play-game-copy small');
      if(icon)icon.textContent='≈';
      if(title)title.textContent='Wavelength';
      if(description)description.textContent='Use four completely different UFC clues to find one hidden number from 1–100.';
      card.setAttribute('aria-label','Open Wavelength');
    }
  }

  function applyWavelengthHeading(){
    const screen=document.documentElement.getAttribute('data-play-screen');
    if(screen!=='top10'&&screen!=='wavelength')return;
    if(screen==='top10')document.documentElement.setAttribute('data-play-screen','wavelength');
    const eyebrow=document.getElementById('playGameEyebrow');
    const title=document.getElementById('playGameTitle');
    const subtitle=document.querySelector('#play .section-title p');
    if(eyebrow)eyebrow.textContent='FIND THE NUMBER';
    if(title)title.textContent='Wavelength';
    if(subtitle)subtitle.textContent='Four UFC clues. Four guesses. One hidden number.';
  }

  function open(){
    if(!state.round)newRound();
    applyWavelengthCopy();
    window.setTimeout(applyWavelengthHeading,0);
  }

  injectStyles();
  panel.innerHTML=shellMarkup();
  modeButton.addEventListener('click',()=>window.setTimeout(()=>{open();applyWavelengthHeading();},0));
  document.addEventListener('click',event=>{
    if(event.target.closest?.('#playHub [data-open-game="top10"]'))window.setTimeout(()=>{open();applyWavelengthHeading();},0);
  },true);
  new MutationObserver(()=>applyWavelengthHeading()).observe(document.documentElement,{attributes:true,attributeFilter:['data-play-screen']});
  window.addEventListener('ufc-play-hub-ready',()=>{applyWavelengthCopy();window.setTimeout(applyWavelengthCopy,0);});
  window.setTimeout(applyWavelengthCopy,0);
  window.setTimeout(applyWavelengthCopy,800);
  window.UFC_WAVELENGTH={version:VERSION,state,rounds:ROUNDS.map(round=>({...round,clues:round.clues.map(clue=>({...clue}))})),open,newRound};
  document.documentElement.setAttribute('data-wavelength',VERSION);

  function key(value){return String(value||'').trim().toLowerCase();}
  function numberFrom(object,names){
    if(!object)return null;
    for(const name of names){const value=Number(object[name]);if(Number.isFinite(value))return value;}
    return null;
  }
  function formatCount(value){
    if(value===null||!Number.isFinite(Number(value)))return '';
    const number=Number(value);
    return Number.isInteger(number)?String(number):number.toFixed(1).replace(/\.0$/,'');
  }
  function allRows(name){
    const target=key(name);
    return [...(DATA.men||[]),...(DATA.women||[]),...(DATA.fighters||[])].filter(row=>key(row?.fighter)===target);
  }
  function reportRow(source,name){
    const target=key(name);
    const report=Array.isArray(source?.report)?source.report:[];
    return report.find(row=>key(row?.fighter)===target)||null;
  }
  function topFiveWinsFor(name){
    const override=OVERRIDES[name]||{};
    const compare=window.COMPARE_PROFILES?.[name]?.legacyStats||{};
    const liveAudit=reportRow(window.UFC_OPPONENT_QUALITY_LIVE,name);
    const shadowAudit=reportRow(window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT,name);
    const auditSummary=typeof window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT?.summaryFor==='function'?window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT.summaryFor(name):null;
    const sources=[liveAudit,shadowAudit,auditSummary,...allRows(name),override.snapshotStats,override.packetProfileStats,compare];
    for(const source of sources){
      const value=numberFrom(source,['topFivePlusWins','topFiveWins','top5Wins']);
      if(value!==null)return formatCount(value);
    }
    return '';
  }
  function currentPairNames(){
    const pair=window.UFC_BLIND_MATCHMAKING?.state?.pair;
    if(!Array.isArray(pair)||pair.length!==2)return [];
    return pair.map(fighter=>fighter?.fighter).filter(Boolean);
  }
  function repairTopFiveRow(){
    const row=[...document.querySelectorAll('#blindMatchup .blind-compare-row')].find(node=>/^top-5 wins$/i.test(node.querySelector('span')?.textContent?.trim()||''));
    const names=currentPairNames();
    if(!row||names.length!==2)return;
    const values=names.map(topFiveWinsFor);
    const cells=row.querySelectorAll('strong');
    if(cells[0]&&values[0]&&cells[0].textContent!==values[0])cells[0].textContent=values[0];
    if(cells[1]&&values[1]&&cells[1].textContent!==values[1])cells[1].textContent=values[1];
  }
  function ensureFiveMatchupBanner(){
    const stage=document.querySelector('#playBlindPanel .blind-stage');
    const matchup=document.getElementById('blindMatchup');
    if(!stage||!matchup)return;
    let banner=document.getElementById('blindFiveMatchupBanner');
    if(!banner){
      banner=document.createElement('div');
      banner.id='blindFiveMatchupBanner';
      banner.className='blind-five-matchup-banner';
      banner.innerHTML='<div><strong>5-MATCHUP CHALLENGE</strong><span>Pick the higher UFC resume five times. Your final score comes after Matchup 5.</span></div><div class="blind-five-progress"><i></i></div>';
      stage.insertBefore(banner,matchup);
    }
    const roundText=document.getElementById('blindRound')?.textContent||'';
    const match=roundText.match(/(?:ROUND|MATCHUP)\s+(\d+)/i);
    const current=Math.max(1,Math.min(5,Number(match?.[1])||1));
    const strong=banner.querySelector('strong');
    const fill=banner.querySelector('i');
    if(strong)strong.textContent=`5-MATCHUP CHALLENGE · ${current} OF 5`;
    if(fill)fill.style.width=`${current*20}%`;
  }
  function polishApexCopy(){
    const blindCopy='APEX RATING = BEST TWO UFC PERFORMANCES WITHIN A TWO-YEAR WINDOW.';
    document.querySelectorAll('#blindMatchup .blind-apex-note').forEach(note=>{if(note.textContent!==blindCopy)note.textContent=blindCopy;});
    const summary=document.getElementById('categoryLeaderSummary');
    const activeApex=document.querySelector('[data-category-leader="apexPeak"].active');
    if(summary&&activeApex&&!/Best two UFC performances within a two-year window/i.test(summary.textContent)){
      const strong=summary.querySelector('strong')?.outerHTML||'<strong>Apex Peak</strong>';
      const countMatch=summary.textContent.match(/Showing\s+\d+\s+fighters\.?/i);
      summary.innerHTML=`${strong}<br>Best two UFC performances within a two-year window — who looked most unbeatable at their absolute best. ${countMatch?.[0]||''}`;
    }
  }
  function injectBlindStyles(){
    if(document.getElementById('blind-resume-polish-css'))return;
    const style=document.createElement('style');
    style.id='blind-resume-polish-css';
    style.textContent=`
      #play .blind-five-matchup-banner{margin-top:13px;border:1px solid rgba(250,204,21,.52);border-radius:15px;background:linear-gradient(135deg,rgba(250,204,21,.11),rgba(249,115,22,.08));padding:11px 12px;color:#f8fafc}
      #play .blind-five-matchup-banner strong,#play .blind-five-matchup-banner span{display:block}
      #play .blind-five-matchup-banner strong{color:#facc15;font-size:12px;font-weight:950;letter-spacing:.08em}
      #play .blind-five-matchup-banner span{margin-top:4px;color:#cbd5e1;font-size:11px;line-height:1.35}
      #play .blind-five-progress{height:6px;margin-top:9px;border:1px solid #334155;border-radius:999px;background:#0b0f17;overflow:hidden}
      #play .blind-five-progress i{display:block;height:100%;width:20%;border-radius:999px;background:linear-gradient(90deg,#f97316,#facc15);transition:width .2s ease}
      #play .blind-five-matchup-banner + .blind-matchup{margin-top:10px}
      @media(max-width:620px){#play .blind-five-matchup-banner strong{font-size:11px}#play .blind-five-matchup-banner span{font-size:10px}}
    `;
    document.head.appendChild(style);
  }
  function applyBlindPolish(){
    injectBlindStyles();
    ensureFiveMatchupBanner();
    repairTopFiveRow();
    polishApexCopy();
    document.documentElement.setAttribute('data-blind-resume-polish','blind-polish-20260718a');
  }
  const blindMatchup=document.getElementById('blindMatchup');
  if(blindMatchup)new MutationObserver(()=>window.requestAnimationFrame(applyBlindPolish)).observe(blindMatchup,{childList:true,subtree:true});
  window.addEventListener('ufc-opponent-quality-ready',applyBlindPolish);
  window.addEventListener('ufc-scoring-pipeline-ready',applyBlindPolish);
  document.addEventListener('click',event=>{
    if(event.target.closest?.('[data-category-leader="apexPeak"],[data-play-mode="blind"]'))window.setTimeout(applyBlindPolish,0);
  });
  window.setTimeout(applyBlindPolish,0);
  window.setTimeout(applyBlindPolish,1200);
})();
