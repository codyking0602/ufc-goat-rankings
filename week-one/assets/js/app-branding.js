// App shell branding and navigation cleanup.
(function(){
  const VERSION = 'app-branding-20260702c';

  function upsertMeta(attr, key, content){
    let meta = document.querySelector(`meta[${attr}="${key}"]`);
    if(!meta){
      meta = document.createElement('meta');
      meta.setAttribute(attr, key);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  function upsertLink(rel, href, attrs={}){
    let link = document.querySelector(`link[rel="${rel}"]`);
    if(!link){
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
    Object.entries(attrs).forEach(([k,v]) => link.setAttribute(k,v));
  }

  function applyBranding(){
    document.title = 'UFC Rankings';
    upsertMeta('name', 'application-name', 'UFC Rankings');
    upsertMeta('name', 'apple-mobile-web-app-title', 'UFC Rankings');
    upsertMeta('name', 'apple-mobile-web-app-capable', 'yes');
    upsertMeta('name', 'mobile-web-app-capable', 'yes');
    upsertMeta('name', 'theme-color', '#f97316');
    upsertMeta('name', 'msapplication-TileColor', '#172033');
    upsertMeta('name', 'msapplication-TileImage', 'assets/app-icon-512.png?v=20260702c');
    upsertLink('manifest', 'manifest.webmanifest?v=20260702c');
    upsertLink('icon', 'assets/app-icon.png?v=20260702c', {type:'image/png', sizes:'1024x1024'});
    upsertLink('apple-touch-icon', 'assets/apple-touch-icon.png?v=20260702c', {sizes:'180x180'});
  }

  function removeRulesTab(){
    const rulesTab = document.querySelector('.tab[data-view="rules"]');
    if(rulesTab) rulesTab.remove();
    const rulesView = document.getElementById('rules');
    if(rulesView) rulesView.remove();
    const activeView = document.querySelector('.view.active-view');
    if(!activeView){
      const menTab = document.querySelector('.tab[data-view="men"]');
      const menView = document.getElementById('men');
      if(menTab) menTab.classList.add('active');
      if(menView) menView.classList.add('active-view');
    }
  }

  function apply(){
    applyBranding();
    removeRulesTab();
    window.UFC_APP_BRANDING = { version: VERSION, name: 'UFC Rankings', shortName: 'UFC Rankings' };
  }

  apply();
})();
