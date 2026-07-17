(function(){
  'use strict';

  const VERSION='blind-rank-polish-20260717c-role-generator-ui';

  function injectStyles(){
    if(document.getElementById('blind-rank-polish-css'))return;
    const style=document.createElement('style');
    style.id='blind-rank-polish-css';
    style.textContent=`
      #playBlindRankPanel[hidden]{display:none!important}
      #play .br-wrap{display:grid;gap:12px;color:#f8fafc}
      #play .br-intro{display:flex;justify-content:space-between;align-items:end;gap:18px;border:1px solid rgba(249,115,22,.55);border-radius:20px;background:linear-gradient(135deg,#29364b,#182236 62%,#101522);padding:17px}
      #play .br-kicker{display:block;color:#facc15;font-size:10px;font-weight:950;letter-spacing:.13em}
      #play .br-intro h3{margin:5px 0 0;color:#fff;font-size:27px;line-height:1}
      #play .br-intro p{max-width:650px;margin:7px 0 0;color:#cbd5e1;font-size:12px;line-height:1.45}
      #play .br-pack-control{display:grid;grid-template-columns:minmax(180px,1fr) auto;gap:7px;min-width:330px}
      #play .br-pack-control select,#play .br-pack-control button{min-height:42px;border-radius:12px;font:850 11px/1 system-ui}
      #play .br-pack-control select{border:1px solid #526786;background:#101725;color:#f8fafc;padding:0 10px}
      #play .br-pack-control button{border:1px solid #f97316;background:#f97316;color:#111827;padding:0 12px;cursor:pointer}
      #play .br-game-card{display:grid;gap:13px;border:1px solid #4b5f7e;border-radius:21px;background:linear-gradient(180deg,#223047,#172033);padding:15px}
      #play .br-progress{display:flex;justify-content:space-between;gap:10px;align-items:center}
      #play .br-progress strong{color:#facc15;font-size:11px;letter-spacing:.08em}
      #play .br-progress span{color:#cbd5e1;font-size:11px}
      #play .br-slots{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}
      #play .br-slot{position:relative;min-height:116px;border:1px solid #526786;border-radius:15px;background:#101725;color:#f8fafc;padding:8px;text-align:left;cursor:pointer;overflow:hidden}
      #play .br-slot.empty:hover{border-color:#f97316;background:#172033;transform:translateY(-1px)}
      #play .br-slot:disabled{cursor:default}
      #play .br-slot-number{position:absolute;top:8px;left:9px;color:#facc15;font-size:18px;font-weight:950;z-index:2}
      #play .br-slot.empty{display:flex;align-items:center;justify-content:center;color:#64748b;font-size:10px;font-weight:900;letter-spacing:.08em}
      #play .br-slot-fighter{display:grid;justify-items:center;gap:6px;padding-top:17px;text-align:center}
      #play .br-slot-fighter strong{max-width:100%;color:#fff;font-size:11px;line-height:1.12;overflow:hidden;text-overflow:ellipsis}
      #play .br-mini-photo{width:52px;height:52px;border:1px solid #475569;border-radius:13px;overflow:hidden;background:#26364e;display:flex;align-items:center;justify-content:center;color:#e2e8f0;font-weight:950}
      #play .br-mini-photo img,#play .br-current-photo img,#play .br-result-photo img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
      #play .br-current{display:grid;grid-template-columns:minmax(135px,.55fr) minmax(0,1.45fr);gap:15px;align-items:center;border:1px solid rgba(250,204,21,.42);border-radius:18px;background:radial-gradient(circle at 18% 25%,rgba(249,115,22,.18),transparent 42%),#0f1624;padding:15px}
      #play .br-current-photo{width:100%;max-width:220px;aspect-ratio:1/1;border:1px solid rgba(250,204,21,.45);border-radius:18px;overflow:hidden;background:linear-gradient(180deg,#35445d,#172033);display:flex;align-items:center;justify-content:center;color:#f8fafc;font-size:48px;font-weight:950;margin:auto}
      #play .br-current-copy>span{display:block;color:#facc15;font-size:10px;font-weight:950;letter-spacing:.11em}
      #play .br-current-copy h4{margin:6px 0 0;color:#fff;font-size:32px;line-height:.98}
      #play .br-current-copy p{margin:8px 0 0;color:#cbd5e1;font-size:12px;line-height:1.4}
      #play .br-current-meta{display:none!important}
      #play .br-current-instruction{margin-top:13px;color:#fdba74;font-size:11px;font-weight:900}
      #play .br-finish{display:grid;gap:12px}
      #play .br-results-title{color:#facc15;font-size:9px;font-weight:950;letter-spacing:.12em}
      #play .br-results{display:grid;gap:6px}
      #play .br-result-row{display:grid;grid-template-columns:42px 48px minmax(0,1fr);gap:9px;align-items:center;border:1px solid #465a78;border-radius:14px;background:#101725;padding:7px 9px}
      #play .br-result-rank{color:#facc15;font-size:20px;font-weight:950;text-align:center}
      #play .br-result-photo{width:48px;height:48px;border-radius:12px;overflow:hidden;background:#26364e;display:flex;align-items:center;justify-content:center;color:#e2e8f0;font-weight:950}
      #play .br-result-copy strong,#play .br-result-copy small{display:block}
      #play .br-result-copy strong{color:#fff;font-size:14px}
      #play .br-result-copy small{margin-top:3px;color:#94a3b8;font-size:10px}
      #play .br-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      #play .br-actions button{min-height:43px;border-radius:12px;font:950 10px/1 system-ui;letter-spacing:.04em;cursor:pointer}
      #play .br-actions .primary{border:1px solid #f97316;background:#f97316;color:#111827}
      #play .br-actions .secondary{border:1px solid #526786;background:#101725;color:#f8fafc}
      #play .br-toast{position:fixed;left:50%;bottom:22px;z-index:1000;transform:translate(-50%,14px);opacity:0;pointer-events:none;border:1px solid rgba(250,204,21,.5);border-radius:999px;background:#101725;padding:9px 13px;color:#fde68a;font-size:11px;font-weight:900;transition:.18s ease}
      #play .br-toast.show{opacity:1;transform:translate(-50%,0)}
      @media(max-width:700px){
        #play .br-intro{display:grid;align-items:start;padding:14px}
        #play .br-intro h3{font-size:23px}
        #play .br-pack-control{min-width:0;grid-template-columns:1fr auto}
        #play .br-slots{grid-template-columns:repeat(5,minmax(57px,1fr));gap:4px;overflow-x:auto;padding-bottom:2px}
        #play .br-slot{min-height:91px;padding:5px}
        #play .br-slot-number{top:5px;left:6px;font-size:15px}
        #play .br-mini-photo{width:38px;height:38px;border-radius:9px}
        #play .br-slot-fighter{gap:4px;padding-top:15px}
        #play .br-slot-fighter strong{font-size:8px}
        #play .br-current{grid-template-columns:92px minmax(0,1fr);gap:11px;padding:12px}
        #play .br-current-photo{width:92px;border-radius:15px;font-size:34px}
        #play .br-current-copy h4{font-size:24px}
        #play .br-current-copy p{font-size:10px}
        #play .br-current-instruction{margin-top:9px;font-size:9px}
        #play .br-actions{grid-template-columns:1fr}
        #play .br-result-row{grid-template-columns:34px 42px minmax(0,1fr)}
        #play .br-result-photo{width:42px;height:42px}
      }
    `;
    document.head.appendChild(style);
  }

  function mark(){document.documentElement.setAttribute('data-blind-rank-refinements',VERSION);}
  function init(){injectStyles();mark();}

  document.addEventListener('ufc-blind-rank-rendered',mark);
  if(window.UFC_BLIND_RANK)init();
  else window.addEventListener('ufc-blind-rank-ready',init,{once:true});
})();