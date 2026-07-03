// Watch Moment links for fighter cards and profiles.
// Keep links here as app-facing content, separate from scoring.
(function(){
  const VERSION = 'watch-moments-20260702c';
  if(typeof DISPLAY_OVERRIDES === 'undefined') return;

  const WATCH_MOMENTS = {
    'Jon Jones': 'https://youtube.com/shorts/yG-D2r6HVp4?is=fstX4Wc_rvCITSw0',
    'Georges St-Pierre': 'https://youtube.com/shorts/Gb0lJf0-lZU?is=ViJReSsAfOjWw1xf',
    'Demetrious Johnson': 'https://youtube.com/shorts/U6EH3w_Kg84?is=GNVuKz921_a_zud9',
    'Anderson Silva': 'https://youtube.com/shorts/KITOr2BPlyg?is=czgA_fjxyDuXlbpO',
    'Islam Makhachev': 'https://youtube.com/shorts/_S2i56bqwE8?is=WYg2MSMlw8IGYa9H',
    'Khabib Nurmagomedov': 'https://youtube.com/shorts/VqN3MN87_FU?is=O2pn1pdk6aS9aqo2',
    'Alexander Volkanovski': 'https://youtube.com/shorts/5zVynz57V-c?is=UsPP0oG5BB8Xlg8r',
    'Randy Couture': 'https://youtube.com/shorts/nU1eSclGMeA?is=R8t0HlpAbHb_E1DO',
    'Max Holloway': 'https://youtube.com/shorts/z4m1wNoAC7k?is=BRWVC4am_k8yJQzZ',
    'Kamaru Usman': 'https://youtube.com/shorts/IESw7PEdMVo?is=okf-XopaawJFybfz',
    'Jose Aldo': 'https://youtube.com/shorts/BC0MG13fz20?is=3YJEJvXqUfyAMg6W',
    'Matt Hughes': 'https://youtube.com/shorts/GmHGebqse1A?is=5ebbOhdaf9CEd8jN',
    'Daniel Cormier': 'https://youtube.com/shorts/seA_5VuSqFM?is=2bLCZ4sd8urFGiE8',
    'Stipe Miocic': 'https://youtube.com/shorts/h_ThhOpI_dg?is=4Sr5Mcp01GkYxtrG',
    'Ilia Topuria': 'https://youtube.com/shorts/8HrxSwOoLZM?is=eygzt_4-hGWU87kL',
    'Israel Adesanya': 'https://youtube.com/shorts/CbvjjHBCUQM?is=J86x9mup7tQHDZS7',
    'Petr Yan': 'https://youtube.com/shorts/WcKa_HG1CbA?is=CZxfIq317Q4sggsB',
    'Cain Velasquez': 'https://youtube.com/shorts/qF8yfMWdjgg?is=7q2cASkqgIQC9JVY',
    'Merab Dvalishvili': 'https://youtube.com/shorts/v8qciKt0g9Y?is=9I22lnhlQVqsQyQT',
    'B.J. Penn': 'https://youtube.com/shorts/FfBpWXo-EWo?is=4SrvWa7ntRkx5Bia',
    'Alex Pereira': 'https://youtube.com/shorts/rb-yUzZNAcQ?is=o8jclP4Z3MTHGH0x',
    'Chuck Liddell': 'https://youtube.com/shorts/yx_Phoyotj0?is=37ZCvF_fOG0d62BR',
    'Dominick Cruz': 'https://youtube.com/shorts/qtiyeEjlmNE?is=RFtIr9qAPjx98Ey5',
    'Francis Ngannou': 'https://youtube.com/shorts/UlZTD5oOgpU?is=dxMm-lAXt6S8UnTo',
    'Charles Oliveira': 'https://youtube.com/shorts/uqC1O-BdcxU?is=ON5Q8K7zkTqHj9_T',
    'Henry Cejudo': 'https://youtube.com/shorts/iqVU88zpDXw?is=NaDy1Ol5Kn1XlYzV',
    'Conor McGregor': 'https://youtube.com/shorts/eeHdLpBUmlU?is=rKzl28sGEKreaI2g',
    'Justin Gaethje': 'https://youtube.com/shorts/2LxEazU0vuM?is=tHj1Dxylleh4yGG7',
    'Amanda Nunes': 'https://youtu.be/t4wkBuFpoPs?is=CL7ge7FDuHQPrbMq',
    'Valentina Shevchenko': 'https://youtube.com/shorts/cucTCAAGTis?is=mf6p21fPtBheJuU8',
    'Joanna Jedrzejczyk': 'https://youtube.com/shorts/rqxlySX0WwA?is=qmc_JW12ecYdL3KT',
    'Ronda Rousey': 'https://youtube.com/shorts/l4hilvKQgYc?is=diOKawJqeBkHdtcf'
  };

  Object.entries(WATCH_MOMENTS).forEach(([fighter, url]) => {
    DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
    DISPLAY_OVERRIDES[fighter].watchUrl = url;
    DISPLAY_OVERRIDES[fighter].watchLabel = 'Watch Moment';
  });

  function injectCss(){
    if(document.getElementById('watch-moments-css')) return;
    const style = document.createElement('style');
    style.id = 'watch-moments-css';
    style.textContent = `
      .watch-moment-link{display:inline-flex;align-items:center;justify-content:center;gap:6px;margin-top:7px;border:1px solid rgba(248,113,113,.35);background:rgba(248,113,113,.1);color:#fecaca;border-radius:999px;padding:5px 8px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;text-decoration:none;max-width:max-content}
      .watch-moment-link:hover{border-color:rgba(248,113,113,.75);background:rgba(248,113,113,.18);color:#fff}
      .profile-watch-moment{margin-top:14px;padding:9px 12px;font-size:12px;border-color:rgba(248,113,113,.45);background:rgba(248,113,113,.12)}
      .profile-watch-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
    `;
    document.head.appendChild(style);
  }

  function watchUrlFor(fighter){
    return DISPLAY_OVERRIDES[fighter]?.watchUrl || WATCH_MOMENTS[fighter] || '';
  }

  function addCardButtons(){
    document.querySelectorAll('.fighter-row[data-fighter]').forEach(row => {
      const fighter = row.dataset.fighter;
      const url = watchUrlFor(fighter);
      if(!url || row.querySelector('.watch-moment-link')) return;
      const target = row.querySelector('.row-main');
      if(!target) return;
      const a = document.createElement('a');
      a.className = 'watch-moment-link';
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = '▶ Watch Moment';
      a.addEventListener('click', e => e.stopPropagation());
      target.appendChild(a);
    });
  }

  function addProfileButton(){
    const detail = document.getElementById('fighterDetail');
    if(!detail || detail.querySelector('.profile-watch-moment')) return;
    const name = detail.querySelector('.profile-summary h2')?.textContent?.trim();
    const url = watchUrlFor(name);
    if(!name || !url) return;
    const summary = detail.querySelector('.profile-summary');
    if(!summary) return;
    const row = document.createElement('div');
    row.className = 'profile-watch-row';
    const a = document.createElement('a');
    a.className = 'watch-moment-link profile-watch-moment';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = '▶ Watch Signature Moment';
    a.addEventListener('click', e => e.stopPropagation());
    row.appendChild(a);
    summary.appendChild(row);
  }

  function apply(){
    injectCss();
    addCardButtons();
    addProfileButton();
    window.UFC_WATCH_MOMENTS = { version: VERSION, fighters: Object.keys(WATCH_MOMENTS) };
  }

  const observer = new MutationObserver(apply);
  observer.observe(document.body, { childList: true, subtree: true });
  apply();
})();