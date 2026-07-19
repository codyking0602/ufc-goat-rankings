// Public browser credentials only. Never place a Supabase service-role key here.
window.UFC_SUPABASE_CONFIG = {
  url: 'https://hdkjwezaswhisxupxydc.supabase.co',
  anonKey: ['sb_publishable_','thQI0qVmK_zOMjlmSiITww_MgWO-RNi'].join('')
};

(function loadPicksAutoAdvance(){
  if(document.querySelector('script[data-picks-auto-advance]')) return;
  const script=document.createElement('script');
  script.src='assets/js/picks-auto-advance.js?v=picks-auto-advance-20260719a';
  script.dataset.picksAutoAdvance='true';
  document.head.appendChild(script);
})();
