(function(){
  'use strict';

  const VERSION='app-profile-20260718b-photo-upload';
  const CANONICAL_CODE='GOAT26';
  const OUTPUT_SIZE=320;
  const state={identity:null,group:null,selectedSlug:'',pendingPhotoData:null,photoChanged:false,modal:null,crop:null};

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'
  }[char]));
  const text=value=>String(value??'').trim();
  const slug=value=>text(value).toLowerCase().replace(/[’'“”".]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const initials=value=>text(value).split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';
  const tokenFor=identity=>text(identity?.memberToken||identity?.member_token);

  function fighterForSlug(value){
    const clean=slug(value);
    if(!clean)return null;
    const play=window.UFC_PLAY_DATA;
    const direct=play?.byId?.[clean]||play?.resolve?.(clean)||play?.resolve?.(value);
    if(direct)return direct;
    const rows=[...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[])];
    const row=rows.find(item=>slug(item?.id||item?.fighter||item?.name)===clean);
    if(!row)return null;
    const name=row.fighter||row.name||value;
    const override=window.DISPLAY_OVERRIDES?.[name]||{};
    return {id:clean,name,thumbUrl:row.thumbUrl||row.photo||override.thumb||override.thumbUrl||override.photoThumb||'',profileUrl:row.profileUrl||override.photo||override.profilePhoto||override.profileUrl||''};
  }

  function fighterPhoto(fighter,kind='thumb'){
    if(!fighter)return'';
    if(kind==='profile'&&fighter.profileUrl)return fighter.profileUrl;
    if(fighter.thumbUrl)return fighter.thumbUrl;
    const candidates=window.UFC_PLAY_PHOTO_AUTHORITY?.candidatesFor?.(fighter);
    return kind==='profile'?(candidates?.profiles?.[0]||candidates?.thumbs?.[0]||''):(candidates?.thumbs?.[0]||candidates?.profiles?.[0]||'');
  }

  function memberPhoto(member){return text(member?.profile_photo_data||member?.profilePhotoData);}
  function memberFighter(member){return fighterForSlug(member?.fighter_avatar_slug);}
  function avatarSource(member){return memberPhoto(member)||fighterPhoto(memberFighter(member));}
  function avatarLabel(member){return memberPhoto(member)?`${text(member?.display_name)||'UFC profile'} profile photo`:(memberFighter(member)?.name||member?.display_name||'UFC profile');}
  function avatarMarkup(member,className=''){
    const src=avatarSource(member);const fighter=memberFighter(member);const label=avatarLabel(member);
    return `<span class="app-profile-avatar ${esc(className)}" aria-label="${esc(label)}">${src?`<img src="${esc(src)}" alt="${esc(label)}" data-profile-avatar-image data-fighter-photo="${memberPhoto(member)?'false':'true'}" data-fighter-name="${esc(fighter?.name||'')}">`:`<span>${esc(initials(member?.display_name))}</span>`}</span>`;
  }

  function hydrateBrokenImages(root=document){
    root?.querySelectorAll?.('img[data-profile-avatar-image]').forEach(image=>{
      if(image.dataset.profileErrorBound)return;
      image.dataset.profileErrorBound='true';
      image.addEventListener('error',()=>{const fallback=document.createElement('span');fallback.textContent=initials(image.closest('[data-member-name]')?.dataset.memberName||image.alt);image.replaceWith(fallback);},{once:true});
    });
  }

  function currentMember(){return state.group?.me||state.identity?.member||null;}
  function mergeMember(saved={}){
    if(state.identity?.member)Object.assign(state.identity.member,saved);
    if(window.UFC_PLAY_PROFILE?.identity?.member)Object.assign(window.UFC_PLAY_PROFILE.identity.member,saved);
    if(state.group?.me)Object.assign(state.group.me,saved);
    const member=state.group?.members?.find(row=>row.id===saved.id);if(member)Object.assign(member,saved);
  }

  async function groupSnapshot(identity=state.identity){
    const client=window.UFC_PLAY_PROFILE?.client;const token=tokenFor(identity);if(!client||!token)return null;
    const {data,error}=await client.rpc('app_profile_group_snapshot',{p_member_token:token});
    if(error)throw error;if(!data?.ok)throw new Error(data?.error||'Could not load the UFC App group.');
    state.group=data;if(data.me&&state.identity?.member)Object.assign(state.identity.member,data.me);return data;
  }

  async function resolve(force=false){
    if(state.identity&&!force)return state.identity;
    const identity=await window.UFC_PLAY_PROFILE?.resolve?.();state.identity=identity||null;
    if(identity){try{await groupSnapshot(identity);}catch(_error){state.group=null;}}else state.group=null;
    renderChip();return state.identity;
  }

  function installStyles(){
    let style=document.getElementById('appProfileCss');if(!style){style=document.createElement('style');style.id='appProfileCss';document.head.appendChild(style);}
    style.textContent=`
      .app-profile-tools{display:grid;gap:10px;min-width:184px}.app-profile-tools .hero-card{min-width:0}.app-profile-chip{width:100%;min-height:56px;border:1px solid #34445d;border-radius:18px;background:linear-gradient(180deg,#1a2435,#111827);color:#fff;display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:10px;padding:7px 10px;cursor:pointer;text-align:left;box-shadow:0 14px 35px rgba(0,0,0,.24)}.app-profile-chip:hover{border-color:#f97316;transform:translateY(-1px)}.app-profile-chip-copy{min-width:0}.app-profile-chip-copy small,.app-profile-chip-copy strong{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.app-profile-chip-copy small{color:#94a3b8;font:900 9px/1 system-ui;letter-spacing:.1em}.app-profile-chip-copy strong{margin-top:4px;font:950 14px/1 system-ui}.app-profile-chip-badge{color:#fdba74;font:950 9px/1 system-ui;letter-spacing:.08em}
      .app-profile-avatar{width:42px;height:42px;min-width:42px;border-radius:50%;overflow:hidden;border:1px solid rgba(249,115,22,.55);background:radial-gradient(circle at 50% 20%,rgba(249,115,22,.38),#111827 65%);display:flex;align-items:center;justify-content:center;color:#fff;font:950 12px/1 system-ui}.app-profile-avatar img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}.app-profile-avatar.large{width:92px;height:92px;min-width:92px;border-radius:50%;font-size:24px}.app-profile-avatar.friend{width:38px;height:38px;min-width:38px;border-radius:50%;font-size:10px}
      .app-profile-open{overflow:hidden}.app-profile-overlay{position:fixed;inset:0;z-index:6000;padding:18px;display:grid;place-items:center;background:rgba(3,7,18,.86);backdrop-filter:blur(12px)}.app-profile-panel{width:min(780px,100%);max-height:min(900px,94vh);overflow:auto;border:1px solid rgba(249,115,22,.7);border-radius:26px;background:linear-gradient(180deg,#202c40,#0f1624);box-shadow:0 32px 110px rgba(0,0,0,.62);color:#f8fafc}.app-profile-head{display:flex;justify-content:space-between;gap:18px;padding:20px;border-bottom:1px solid #34445d}.app-profile-head-copy{display:flex;align-items:center;gap:14px;min-width:0}.app-profile-head-copy span,.app-profile-head-copy strong,.app-profile-head-copy small{display:block}.app-profile-head-copy span{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.14em}.app-profile-head-copy strong{margin-top:6px;font:950 24px/1 system-ui}.app-profile-head-copy small{margin-top:7px;color:#94a3b8;font:700 11px/1.3 system-ui}.app-profile-close{width:40px;height:40px;border:1px solid #475569;border-radius:12px;background:#111827;color:#fff;font-size:24px;cursor:pointer}.app-profile-body{padding:20px}
      .app-profile-photo-section{display:grid;grid-template-columns:112px minmax(0,1fr);align-items:center;gap:18px;margin-bottom:20px;padding:16px;border:1px solid #34445d;border-radius:20px;background:#101827}.app-profile-photo-preview{width:112px;height:112px;border-radius:50%;overflow:hidden;border:3px solid #f97316;background:#0b1220;display:grid;place-items:center;color:#fff;font:950 26px/1 system-ui}.app-profile-photo-preview img{width:100%;height:100%;object-fit:cover;display:block}.app-profile-photo-copy h3{margin:0;font:950 18px/1 system-ui}.app-profile-photo-copy p{margin:7px 0 12px;color:#94a3b8;font:650 11px/1.4 system-ui}.app-profile-photo-actions{display:flex;flex-wrap:wrap;gap:8px}.app-profile-photo-actions button{min-height:42px;border:1px solid #475569;border-radius:12px;background:#172033;color:#fff;padding:0 13px;font:900 10px/1 system-ui;cursor:pointer}.app-profile-photo-actions .primary{border-color:#f97316;background:#f97316;color:#111827}
      .app-profile-friends{display:flex;gap:8px;overflow-x:auto;padding:2px 0 16px}.app-profile-friend{min-width:108px;border:1px solid #34445d;border-radius:15px;background:#111827;padding:9px;display:grid;grid-template-columns:38px minmax(0,1fr);align-items:center;gap:8px}.app-profile-friend strong,.app-profile-friend small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.app-profile-friend strong{font:900 11px/1 system-ui}.app-profile-friend small{margin-top:4px;color:#94a3b8;font:750 8px/1 system-ui;letter-spacing:.06em}.app-profile-section-title{display:flex;align-items:end;justify-content:space-between;gap:12px;margin:2px 0 10px}.app-profile-section-title h3{margin:0;font:950 17px/1 system-ui}.app-profile-section-title span{color:#94a3b8;font:700 10px/1.3 system-ui}.app-profile-search{width:100%;min-width:0!important;margin-bottom:12px;border-color:#475569!important;background:#0b1220!important}.app-profile-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;max-height:360px;overflow:auto;padding-right:3px}.app-profile-fighter{min-width:0;border:1px solid #34445d;border-radius:15px;background:#111827;color:#fff;padding:8px;cursor:pointer;text-align:left}.app-profile-fighter:hover,.app-profile-fighter.selected{border-color:#f97316;background:rgba(249,115,22,.12)}.app-profile-fighter-photo{aspect-ratio:1;border-radius:50%;overflow:hidden;background:#0b1220;display:flex;align-items:center;justify-content:center;font:950 16px/1 system-ui}.app-profile-fighter-photo img{width:100%;height:100%;object-fit:cover;object-position:center 12%}.app-profile-fighter strong{display:block;margin-top:7px;font:900 10px/1.15 system-ui;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.app-profile-footer{position:sticky;bottom:0;display:grid;grid-template-columns:auto 1fr auto;gap:9px;padding:14px 20px;border-top:1px solid #34445d;background:rgba(15,22,36,.97);backdrop-filter:blur(10px)}.app-profile-footer button{min-height:44px;border:1px solid #475569;border-radius:13px;background:#172033;color:#fff;padding:0 15px;font:950 10px/1 system-ui;cursor:pointer}.app-profile-footer .save{border-color:#f97316;background:#f97316;color:#111827}.app-profile-status{align-self:center;color:#fdba74;font:750 10px/1.35 system-ui}.app-profile-empty{grid-column:1/-1;padding:24px;border:1px dashed #475569;border-radius:15px;color:#94a3b8;text-align:center;font:750 12px/1.4 system-ui}
      .app-profile-crop-overlay{position:fixed;inset:0;z-index:7000;display:grid;place-items:center;padding:18px;background:rgba(2,6,23,.92)}.app-profile-crop-panel{width:min(460px,100%);padding:20px;border:1px solid rgba(249,115,22,.72);border-radius:24px;background:#111827;color:#fff}.app-profile-crop-panel h3{margin:0;font:950 22px/1 system-ui}.app-profile-crop-panel p{margin:8px 0 16px;color:#94a3b8;font:650 12px/1.4 system-ui}.app-profile-crop-viewport{position:relative;width:220px;height:220px;margin:0 auto 18px;border-radius:50%;overflow:hidden;border:4px solid #f97316;background:#020617}.app-profile-crop-viewport img{position:absolute;max-width:none;user-select:none;pointer-events:none}.app-profile-crop-controls{display:grid;gap:11px}.app-profile-crop-controls label{display:grid;grid-template-columns:72px 1fr;align-items:center;gap:10px;color:#cbd5e1;font:850 10px/1 system-ui}.app-profile-crop-controls input{width:100%;min-width:0}.app-profile-crop-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px}.app-profile-crop-actions button{min-height:44px;border:1px solid #475569;border-radius:12px;background:#172033;color:#fff;font:950 10px/1 system-ui}.app-profile-crop-actions .primary{border-color:#f97316;background:#f97316;color:#111827}
      @media(max-width:900px){.app-profile-tools{width:100%;grid-template-columns:1fr}.app-profile-chip{min-height:52px}.app-profile-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:520px){.app-profile-overlay{padding:0;align-items:end}.app-profile-panel{max-height:94vh;border-radius:24px 24px 0 0}.app-profile-head,.app-profile-body{padding:16px}.app-profile-head-copy{align-items:flex-start}.app-profile-head-copy .app-profile-avatar.large{width:72px;height:72px;min-width:72px}.app-profile-photo-section{grid-template-columns:92px minmax(0,1fr);gap:13px;padding:13px}.app-profile-photo-preview{width:92px;height:92px}.app-profile-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.app-profile-footer{grid-template-columns:1fr 1fr;padding:12px 16px}.app-profile-status{grid-column:1/-1;grid-row:1}.app-profile-footer button{padding:0 10px}.app-profile-crop-overlay{padding:10px}.app-profile-crop-panel{padding:16px}.app-profile-crop-viewport{width:200px;height:200px}.app-profile-crop-actions{grid-template-columns:1fr}}
    `;
  }

  function ensureChip(){
    const hero=document.querySelector('.hero');const card=hero?.querySelector('.hero-card');if(!hero)return null;
    let tools=hero.querySelector('.app-profile-tools');if(!tools){tools=document.createElement('div');tools.className='app-profile-tools';if(card)card.before(tools);else hero.appendChild(tools);if(card)tools.appendChild(card);}
    let chip=tools.querySelector('.app-profile-chip');if(!chip){chip=document.createElement('button');chip.type='button';chip.className='app-profile-chip';chip.addEventListener('click',open);tools.appendChild(chip);}return chip;
  }

  function renderChip(){
    const chip=ensureChip();if(!chip)return;const member=currentMember();
    chip.innerHTML=member?`${avatarMarkup(member)}<span class="app-profile-chip-copy"><small>UFC APP PROFILE</small><strong>${esc(member.display_name)}</strong></span><span class="app-profile-chip-badge">${member.is_admin?'ADMIN':'GOAT26'}</span>`:`${avatarMarkup({display_name:'UFC'})}<span class="app-profile-chip-copy"><small>UFC APP PROFILE</small><strong>Sign in</strong></span><span class="app-profile-chip-badge">GOAT26</span>`;
    hydrateBrokenImages(chip);
  }

  function roster(query=''){
    const api=window.UFC_PLAY_DATA;if(api){const options={limit:80,filters:{requirePhoto:true}};const rows=query?api.search(query,options):api.search('',options);return rows.filter(fighter=>fighter?.id&&fighter?.name);}
    const rows=[...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[])];const needle=text(query).toLowerCase();return rows.map(row=>fighterForSlug(row.fighter||row.name)).filter(Boolean).filter(row=>!needle||row.name.toLowerCase().includes(needle)).slice(0,80);
  }

  function friendStrip(){
    const members=state.group?.members||[];if(!members.length)return'';
    return `<div class="app-profile-friends">${members.map(member=>`<div class="app-profile-friend" data-member-name="${esc(member.display_name)}">${avatarMarkup(member,'friend')}<div><strong>${esc(member.display_name)}</strong><small>${member.is_admin?'ADMIN':member.profile_photo_data?'PHOTO SET':member.fighter_avatar_slug?'FIGHTER SET':'CHOOSE PROFILE'}</small></div></div>`).join('')}</div>`;
  }

  function previewSource(){if(state.photoChanged)return state.pendingPhotoData||fighterPhoto(fighterForSlug(state.selectedSlug));return memberPhoto(currentMember())||fighterPhoto(fighterForSlug(state.selectedSlug));}
  function renderPhotoPreview(){
    const node=state.modal?.querySelector('[data-profile-photo-preview]');if(!node)return;const src=previewSource();node.innerHTML=src?`<img src="${esc(src)}" alt="Profile preview">`:esc(initials(currentMember()?.display_name));
    const remove=state.modal?.querySelector('[data-profile-remove-photo]');if(remove)remove.hidden=!memberPhoto(currentMember())&&!state.pendingPhotoData;
  }

  function renderFighterGrid(query=''){
    const grid=state.modal?.querySelector('[data-profile-fighter-grid]');if(!grid)return;const rows=roster(query);
    if(!rows.length){grid.innerHTML='<div class="app-profile-empty">Fighter photos are still loading. Try again in a moment.</div>';return;}
    grid.innerHTML=rows.map(fighter=>{const src=fighterPhoto(fighter);return `<button class="app-profile-fighter${fighter.id===state.selectedSlug?' selected':''}" type="button" data-avatar-slug="${esc(fighter.id)}" aria-pressed="${fighter.id===state.selectedSlug?'true':'false'}"><span class="app-profile-fighter-photo">${src?`<img src="${esc(src)}" alt="${esc(fighter.name)}" data-profile-avatar-image data-fighter-photo="true" data-fighter-name="${esc(fighter.name)}">`:esc(initials(fighter.name))}</span><strong>${esc(fighter.name)}</strong></button>`;}).join('');
    grid.querySelectorAll('[data-avatar-slug]').forEach(button=>button.addEventListener('click',()=>{state.selectedSlug=button.dataset.avatarSlug||'';renderFighterGrid(state.modal?.querySelector('[data-profile-search]')?.value||'');if(!state.pendingPhotoData)renderPhotoPreview();const status=state.modal?.querySelector('[data-profile-status]');const fighter=fighterForSlug(state.selectedSlug);if(status)status.textContent=fighter?`${fighter.name} selected as your fallback avatar.`:'Fighter selected.';}));hydrateBrokenImages(grid);
  }

  async function saveAvatar(value=state.selectedSlug){
    const identity=state.identity||await resolve();const client=window.UFC_PLAY_PROFILE?.client;const token=tokenFor(identity);if(!client||!token)throw new Error('Sign in to your UFC App profile first.');
    const {data,error}=await client.rpc('app_profile_set_avatar',{p_member_token:token,p_fighter_avatar_slug:text(value)});if(error)throw error;if(!data?.ok)throw new Error(data?.error||'Could not save that fighter avatar.');const saved=data.member||{};mergeMember(saved);state.selectedSlug=text(saved.fighter_avatar_slug);renderChip();return saved;
  }

  async function savePhoto(photoData=state.pendingPhotoData){
    const identity=state.identity||await resolve();const client=window.UFC_PLAY_PROFILE?.client;const token=tokenFor(identity);if(!client||!token)throw new Error('Sign in to your UFC App profile first.');
    const {data,error}=await client.rpc('app_profile_set_photo',{p_member_token:token,p_profile_photo_data:text(photoData)});
    if(error){const message=text(error.message);if(/app_profile_set_photo|schema cache|does not exist/i.test(message))throw new Error('Profile photo support needs the new Supabase migration before uploads can be saved.');throw error;}
    if(!data?.ok)throw new Error(data?.error||'Could not save that profile photo.');const saved=data.member||{};mergeMember(saved);state.pendingPhotoData=memberPhoto(saved);state.photoChanged=false;renderChip();return saved;
  }

  function closeCrop(){document.querySelector('.app-profile-crop-overlay')?.remove();if(state.crop?.objectUrl)URL.revokeObjectURL(state.crop.objectUrl);state.crop=null;}
  function cropGeometry(viewSize=220){const crop=state.crop;if(!crop?.image?.naturalWidth)return null;const base=Math.max(OUTPUT_SIZE/crop.image.naturalWidth,OUTPUT_SIZE/crop.image.naturalHeight);const scale=base*crop.zoom;const width=crop.image.naturalWidth*scale;const height=crop.image.naturalHeight*scale;const x=(width-OUTPUT_SIZE)*(crop.x/100);const y=(height-OUTPUT_SIZE)*(crop.y/100);return{width,height,x,y,ratio:viewSize/OUTPUT_SIZE};}
  function updateCropPreview(){const image=document.querySelector('.app-profile-crop-viewport img');const viewport=document.querySelector('.app-profile-crop-viewport');if(!image||!viewport)return;const geo=cropGeometry(viewport.clientWidth||220);if(!geo)return;image.style.width=`${geo.width*geo.ratio}px`;image.style.height=`${geo.height*geo.ratio}px`;image.style.left=`${-geo.x*geo.ratio}px`;image.style.top=`${-geo.y*geo.ratio}px`;}
  function exportCrop(){const geo=cropGeometry(OUTPUT_SIZE);if(!geo)return'';const canvas=document.createElement('canvas');canvas.width=OUTPUT_SIZE;canvas.height=OUTPUT_SIZE;const ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#111827';ctx.fillRect(0,0,OUTPUT_SIZE,OUTPUT_SIZE);ctx.drawImage(state.crop.image,-geo.x,-geo.y,geo.width,geo.height);let data=canvas.toDataURL('image/webp',.82);if(!data.startsWith('data:image/webp'))data=canvas.toDataURL('image/jpeg',.84);return data;}

  function openCrop(file){
    if(!file||!/^image\//.test(file.type))return;if(file.size>12*1024*1024){const status=state.modal?.querySelector('[data-profile-status]');if(status)status.textContent='Choose a photo smaller than 12 MB.';return;}
    closeCrop();const objectUrl=URL.createObjectURL(file);const image=new Image();state.crop={objectUrl,image,zoom:1,x:50,y:50};
    image.onload=()=>{const overlay=document.createElement('div');overlay.className='app-profile-crop-overlay';overlay.innerHTML=`<section class="app-profile-crop-panel" role="dialog" aria-modal="true" aria-labelledby="profileCropTitle"><h3 id="profileCropTitle">Fit your profile photo</h3><p>The circle shows exactly how your photo will appear across Octagon HQ.</p><div class="app-profile-crop-viewport"><img src="${esc(objectUrl)}" alt="Crop preview"></div><div class="app-profile-crop-controls"><label>Zoom<input type="range" min="1" max="3" step=".01" value="1" data-crop-zoom></label><label>Left / right<input type="range" min="0" max="100" step="1" value="50" data-crop-x></label><label>Up / down<input type="range" min="0" max="100" step="1" value="50" data-crop-y></label></div><div class="app-profile-crop-actions"><button type="button" data-crop-cancel>CANCEL</button><button type="button" class="primary" data-crop-save>USE PHOTO</button></div></section>`;document.body.appendChild(overlay);overlay.querySelector('[data-crop-cancel]')?.addEventListener('click',closeCrop);overlay.addEventListener('click',event=>{if(event.target===overlay)closeCrop();});[['zoom','[data-crop-zoom]'],['x','[data-crop-x]'],['y','[data-crop-y]']].forEach(([key,selector])=>overlay.querySelector(selector)?.addEventListener('input',event=>{state.crop[key]=Number(event.target.value);updateCropPreview();}));overlay.querySelector('[data-crop-save]')?.addEventListener('click',()=>{state.pendingPhotoData=exportCrop();state.photoChanged=true;closeCrop();renderPhotoPreview();const status=state.modal?.querySelector('[data-profile-status]');if(status)status.textContent='Photo ready. Tap Save Profile to publish it everywhere.';});requestAnimationFrame(updateCropPreview);};
    image.onerror=()=>{closeCrop();const status=state.modal?.querySelector('[data-profile-status]');if(status)status.textContent='That image could not be opened.';};image.src=objectUrl;
  }

  function close(){closeCrop();state.modal?.remove();state.modal=null;document.body.classList.remove('app-profile-open');}

  async function open(){
    installStyles();let identity=await resolve().catch(()=>null);
    if(!identity){identity=await window.UFC_PLAY_PROFILE?.require?.({title:'Open your UFC App profile',description:'Use your GOAT26 display name and four-digit PIN. This same profile follows you through Picks, Play, and The War Room.'});if(!identity)return;state.identity=identity;try{await groupSnapshot(identity);}catch(_error){state.group=null;}renderChip();}
    close();const member=currentMember()||{};state.selectedSlug=text(member.fighter_avatar_slug);state.pendingPhotoData=memberPhoto(member);state.photoChanged=false;
    const overlay=document.createElement('div');overlay.className='app-profile-overlay';overlay.innerHTML=`<section class="app-profile-panel" role="dialog" aria-modal="true" aria-labelledby="appProfileTitle"><header class="app-profile-head"><div class="app-profile-head-copy" data-member-name="${esc(member.display_name)}">${avatarMarkup(member,'large')}<div><span>UFC APP PROFILE · ${CANONICAL_CODE}</span><strong id="appProfileTitle">${esc(member.display_name)}</strong><small>One identity across Picks, Play, leaderboards, and The War Room.</small></div></div><button class="app-profile-close" type="button" aria-label="Close profile" data-profile-close>×</button></header><div class="app-profile-body">${friendStrip()}<section class="app-profile-photo-section"><div class="app-profile-photo-preview" data-profile-photo-preview></div><div class="app-profile-photo-copy"><h3>Your profile photo</h3><p>Upload and position a photo, or keep a UFC fighter as your fallback avatar.</p><div class="app-profile-photo-actions"><button class="primary" type="button" data-profile-upload>UPLOAD PHOTO</button><button type="button" data-profile-remove-photo>REMOVE PHOTO</button><input type="file" accept="image/jpeg,image/png,image/webp" hidden data-profile-file></div></div></section><div class="app-profile-section-title"><h3>Choose your fighter</h3><span>Used whenever you do not have an uploaded photo.</span></div><input class="app-profile-search" type="search" placeholder="Search the UFC roster…" autocomplete="off" data-profile-search><div class="app-profile-grid" data-profile-fighter-grid></div></div><footer class="app-profile-footer"><button type="button" data-profile-clear>CLEAR FIGHTER</button><div class="app-profile-status" data-profile-status>${state.selectedSlug?`${esc(fighterForSlug(state.selectedSlug)?.name||state.selectedSlug)} is your fallback fighter.`:'Choose a fighter or upload a photo.'}</div><button class="save" type="button" data-profile-save>SAVE PROFILE</button></footer></section>`;
    document.body.appendChild(overlay);document.body.classList.add('app-profile-open');state.modal=overlay;
    overlay.querySelector('[data-profile-close]')?.addEventListener('click',close);overlay.addEventListener('click',event=>{if(event.target===overlay)close();});overlay.querySelector('[data-profile-search]')?.addEventListener('input',event=>renderFighterGrid(event.target.value));const fileInput=overlay.querySelector('[data-profile-file]');overlay.querySelector('[data-profile-upload]')?.addEventListener('click',()=>fileInput?.click());fileInput?.addEventListener('change',event=>{const file=event.target.files?.[0];if(file)openCrop(file);event.target.value='';});overlay.querySelector('[data-profile-remove-photo]')?.addEventListener('click',()=>{state.pendingPhotoData='';state.photoChanged=true;renderPhotoPreview();overlay.querySelector('[data-profile-status]').textContent='Uploaded photo removed. Your fighter will be used after you save.';});overlay.querySelector('[data-profile-clear]')?.addEventListener('click',()=>{state.selectedSlug='';renderFighterGrid(overlay.querySelector('[data-profile-search]')?.value||'');renderPhotoPreview();overlay.querySelector('[data-profile-status]').textContent='Fighter fallback cleared. Save to use your photo or initials.';});
    overlay.querySelector('[data-profile-save]')?.addEventListener('click',async event=>{const button=event.currentTarget;const status=overlay.querySelector('[data-profile-status]');button.disabled=true;button.textContent='SAVING…';status.textContent='Saving your UFC App profile…';try{await saveAvatar();if(state.photoChanged)await savePhoto();await groupSnapshot(state.identity).catch(()=>null);renderChip();window.dispatchEvent(new CustomEvent('ufc-app-profile-updated',{detail:{identity:state.identity,group:state.group,member:currentMember()}}));status.textContent='Saved. This profile is now live across the app.';button.textContent='SAVED';setTimeout(close,650);}catch(error){status.textContent=text(error?.message)||'Could not save your profile.';button.disabled=false;button.textContent='SAVE PROFILE';}});
    renderPhotoPreview();hydrateBrokenImages(overlay);renderFighterGrid();
  }

  function createAvatar(member,options={}){const wrapper=document.createElement(options.tagName||'span');wrapper.innerHTML=avatarMarkup(member,options.className||'');const node=wrapper.firstElementChild;hydrateBrokenImages(node);return node;}
  function start(){installStyles();renderChip();resolve().catch(()=>renderChip());}

  window.UFC_APP_PROFILE={version:VERSION,canonicalGroupCode:CANONICAL_CODE,resolve,open,close,saveAvatar,savePhoto,groupSnapshot,fighterForSlug,fighterForMember:memberFighter,avatarUrl:avatarSource,avatarSource,avatarMarkup,createAvatar,get identity(){return state.identity;},get group(){return state.group;}};
  document.documentElement.setAttribute('data-app-profile',VERSION);
  window.addEventListener('ufc-play-profile-ready',event=>{state.identity=event.detail||null;groupSnapshot(state.identity).catch(()=>null).finally(renderChip);});
  window.addEventListener('ufc-play-data-ready',()=>{renderChip();if(state.modal)renderFighterGrid(state.modal.querySelector('[data-profile-search]')?.value||'');});
  window.addEventListener('ufc-production-ranking-ready',renderChip);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();