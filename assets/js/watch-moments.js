// Watch Moment links for fighter cards and profiles.
// Keep links here as app-facing content, separate from scoring and nickname/display-name polish.
(function(){
  const VERSION = 'watch-moments-20260706t-signature-label';
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
    'Dricus du Plessis': 'https://youtube.com/shorts/ifsX-hgSzz4?is=NWgRwVVkTzsNBGVC',
    'Tyron Woodley': 'https://youtube.com/shorts/l6zNZ9e3UzI?si=hjrJtxKUri3XWzdC',
    'Ilia Topuria': 'https://youtube.com/shorts/8HrxSwOoLZM?is=eygzt_4-hGWU87kL',
    'Israel Adesanya': 'https://youtube.com/shorts/CbvjjHBCUQM?is=J86x9mup7tQHDZS7',
    'Aljamain Sterling': 'https://youtube.com/shorts/9u6oSybWX0o?is=vI7Sq1yLpVg-CsbN',
    'Petr Yan': 'https://youtube.com/shorts/WcKa_HG1CbA?is=CZxfIq317Q4sggsB',
    'Cain Velasquez': 'https://youtube.com/shorts/qF8yfMWdjgg?is=7q2cASkqgIQC9JVY',
    'Brock Lesnar': 'https://youtube.com/shorts/F3Z32PDzObA?is=uzqAk5wbnG7dx9TS',
    'Merab Dvalishvili': 'https://youtube.com/shorts/v8qciKt0g9Y?is=9I22lnhlQVqsQyQT',
    'B.J. Penn': 'https://youtube.com/shorts/FfBpWXo-EWo?is=4SrvWa7ntRkx5Bia',
    'Dustin Poirier': 'https://youtube.com/shorts/pykcFJHon8I?is=WgBo2b7RTRqozCYU',
    'Tony Ferguson': 'https://youtube.com/shorts/kwNQdTKvQbY?is=yeoa3ANZBlAMfEpv',
    'T.J. Dillashaw': 'https://youtube.com/shorts/FiV10zxE8RY?is=S7az7vuBDbjIuIfJ',
    'Alex Pereira': 'https://youtube.com/shorts/rb-yUzZNAcQ?is=o8jclP4Z3MTHGH0x',
    'Chuck Liddell': 'https://youtube.com/shorts/yx_Phoyotj0?is=37ZCvF_fOG0d62BR',
    'Tito Ortiz': 'https://youtube.com/shorts/oz2yVJTttC8?si=IPyqNy4AkugoWVfi',
    'Junior dos Santos': 'https://youtube.com/shorts/Lj6I1i8V0-Y?si=SCGyTCBodnA4CkbE',
    'Dominick Cruz': 'https://youtube.com/shorts/qtiyeEjlmNE?is=RFtIr9qAPjx98Ey5',
    'Francis Ngannou': 'https://youtube.com/shorts/UlZTD5oOgpU?is=dxMm-lAXt6S8UnTo',
    'Charles Oliveira': 'https://youtube.com/shorts/uqC1O-BdcxU?is=ON5Q8K7zkTqHj9_T',
    'Henry Cejudo': 'https://youtube.com/shorts/iqVU88zpDXw?is=NaDy1Ol5Kn1XlYzV',
    'Conor McGregor': 'https://youtube.com/shorts/eeHdLpBUmlU?is=rKzl28sGEKreaI2g',
    'Justin Gaethje': 'https://youtube.com/shorts/2LxEazU0vuM?is=tHj1Dxylleh4yGG7',
    'Frankie Edgar': 'https://youtube.com/shorts/lLpRwEN3PJk?is=QVVQjKx_0gVmw-wO',
    'Deiveson Figueiredo': 'https://youtube.com/shorts/SZqB9e5-Evs?si=95XRoS9BiLZ6jZnw',
    'Lyoto Machida': 'https://youtube.com/shorts/egQH6YZhYE8?is=dPiUxTvLAK3X4qu6',
    'Khamzat Chimaev': 'https://youtube.com/shorts/R8M89h0Y8qs?si=o2TK7J9c2YPcX3sy',
    'Sean Strickland': 'https://youtube.com/shorts/oOeeWkSuOIo?si=f2F9cDqI4ZOvPaKh',
    'Robert Whittaker': 'https://youtube.com/shorts/mmIGDqLaRVM?is=n7F_4C410g2bf3nm',
    "Sean O'Malley": 'https://youtube.com/shorts/Qelywtchvk8?is=C0v8L_ndxdC5BS9c',
    'Michael Bisping': 'https://youtube.com/shorts/YqLi--j4cMA?is=S7b7jX4a5yrGhV02',
    'Dan Henderson': 'https://youtube.com/shorts/dA2kztF7KpQ?is=wDxZ4DLlPA-C74uh',
    'Chael Sonnen': 'https://youtube.com/shorts/feVMRUL1R9o?is=fQrfnJ4c8IMVu0k4',
    'Robbie Lawler': 'https://youtu.be/GkBBqPkfGYg?is=aWsbqeDBGQmaJg4Q',
    'Amanda Nunes': 'https://youtu.be/t4wkBuFpoPs?is=CL7ge7FDuHQPrbMq',
    'Valentina Shevchenko': 'https://youtube.com/shorts/cucTCAAGTis?is=mf6p21fPtBheJuU8',
    'Zhang Weili': 'https://youtube.com/shorts/ZhdI2_I58YQ?is=TuRcxor17qZxSwUC',
    'Rose Namajunas': 'https://youtube.com/shorts/BVqANFBGq7w?si=FYfcFp-j5hSIXn7b',
    'Miesha Tate': 'https://youtube.com/shorts/b9uD21LpKvY?si=J1e02C6oGjmLRfuk',
    'Mackenzie Dern': 'https://youtube.com/shorts/FpPeheMbWcY?si=kpbSu9dKQ_1ZrJnF',
    'Kayla Harrison': 'https://youtube.com/shorts/iwq5RYsEmj0?si=xNAgtq1-FjeI4ozO',
    'Jessica Andrade': 'https://youtube.com/shorts/ifn-NLuFWi0?si=kjwT0ZO3k_kd4KX-',
    'Alexa Grasso': 'https://youtube.com/shorts/JXqN4rvMty4?si=Lige5a6x4R4JlITd',
    'Julianna Peña': 'https://youtube.com/shorts/l7vgw_69nvI?si=0PD-rPVHC9VbnoUE',
    'Carla Esparza': 'https://youtube.com/shorts/haoZSXlndok?si=gPH4hX-eBK8U8G_I',
    'Holly Holm': 'https://youtube.com/shorts/U_SlK5dA1Zw?si=M7W6XcHaTz4SlAMD',
    'Joanna Jedrzejczyk': 'https://youtube.com/shorts/rqxlySX0WwA?is=qmc_JW12ecYdL3KT',
    'Ronda Rousey': 'https://youtube.com/shorts/l4hilvKQgYc?is=diOKawJqeBkHdtcf'
  };

  Object.entries(WATCH_MOMENTS).forEach(([fighter, url]) => {
    DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
    DISPLAY_OVERRIDES[fighter].watchUrl = url;
    DISPLAY_OVERRIDES[fighter].watchLabel = 'Watch Signature Moment';
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

  function baseNameFor(label){
    if(WATCH_MOMENTS[label]) return label;
    const found = Object.keys(DISPLAY_OVERRIDES).find(name => DISPLAY_OVERRIDES[name]?.displayName === label);
    return found || label;
  }
  function watchUrlFor(fighter){ const base = baseNameFor(fighter); return DISPLAY_OVERRIDES[base]?.watchUrl || WATCH_MOMENTS[base] || ''; }
  function addCardButtons(){ document.querySelectorAll('.fighter-row[data-fighter]:not(.category-leader-row)').forEach(row => { const fighter = row.dataset.fighter; const url = watchUrlFor(fighter); if(!url || row.querySelector('.watch-moment-link')) return; const target = row.querySelector('.row-main'); if(!target) return; const a = document.createElement('a'); a.className = 'watch-moment-link'; a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = '▶ Watch Signature Moment'; a.addEventListener('click', e => e.stopPropagation()); target.appendChild(a); }); }
  function addProfileButton(){ const detail = document.getElementById('fighterDetail'); if(!detail || detail.querySelector('.profile-watch-moment')) return; const label = detail.querySelector('.profile-summary h2')?.textContent?.trim(); const url = watchUrlFor(label); if(!label || !url) return; const summary = detail.querySelector('.profile-summary'); if(!summary) return; const row = document.createElement('div'); row.className = 'profile-watch-row'; const a = document.createElement('a'); a.className = 'watch-moment-link profile-watch-moment'; a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = '▶ Watch Signature Moment'; a.addEventListener('click', e => e.stopPropagation()); row.appendChild(a); summary.appendChild(row); }
  function apply(){ injectCss(); addCardButtons(); addProfileButton(); window.UFC_WATCH_MOMENTS = { version: VERSION, fighters: Object.keys(WATCH_MOMENTS) }; }

  const observer = new MutationObserver(apply);
  observer.observe(document.body, { childList: true, subtree: true });
  apply();
})();