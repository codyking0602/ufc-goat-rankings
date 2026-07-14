(function(){
  'use strict';

  const STORAGE_KEY = 'ufc-goat-play-top10-v1';
  const SITE_URL = 'https://codyking0602.github.io/ufc-goat-rankings/';
  const DISPLAY_URL = 'codyking0602.github.io/ufc-goat-rankings';
  const DATA = window.RANKING_DATA || {};
  const OVERRIDES = window.DISPLAY_OVERRIDES || {};
  const button = document.getElementById('playShareBtn');
  if(!button || !Array.isArray(DATA.men)) return;

  function clamp(value,min,max){ return Math.max(min, Math.min(max, value)); }
  function key(value){ return String(value || '').trim().toLowerCase(); }
  function liveRow(name){
    const target = key(name);
    return [...(DATA.men || []), ...(DATA.women || [])].find(row => key(row?.fighter) === target) || null;
  }
  function liveProfile(name){
    const target = key(name);
    return (DATA.fighters || []).find(row => key(row?.fighter) === target) || null;
  }
  function liveFighter(name){
    return { ...(liveProfile(name) || {}), ...(liveRow(name) || {}), fighter:name };
  }
  function rankFor(name){
    const live = Number(liveRow(name)?.rank);
    if(Number.isFinite(live) && live > 0) return live;
    const override = Number(OVERRIDES[name]?.allTimeRank);
    if(Number.isFinite(override) && override > 0) return override;
    return 999;
  }
  function photoFor(name){
    return OVERRIDES[name]?.thumbUrl || OVERRIDES[name]?.photoUrl || '';
  }
  function initials(name){
    return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(part => part[0]).join('').toUpperCase();
  }
  function loadTop10(){
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if(!Array.isArray(saved)) return [];
      const names = new Set((DATA.men || []).map(row => row.fighter));
      return saved.filter(name => typeof name === 'string' && names.has(name)).slice(0,10);
    } catch(_error){
      return [];
    }
  }
  function comparisonData(top10){
    const rows = top10.map((name,index) => ({
      name,
      userRank:index + 1,
      modelRank:rankFor(name),
      delta:rankFor(name) - (index + 1)
    }));
    const biggest = [...rows].sort((a,b) => Math.abs(b.delta) - Math.abs(a.delta))[0];
    const averageGap = rows.reduce((sum,row) => sum + Math.abs(row.delta), 0) / Math.max(rows.length,1);
    const agreement = clamp(Math.round(100 - averageGap * 5), 0, 100);
    return { rows, biggest, agreement };
  }
  function disagreementShort(row){
    if(!row) return 'No major disagreement';
    if(row.delta > 0) return `${row.name} +${row.delta}`;
    if(row.delta < 0) return `${row.name} ${row.delta}`;
    return `${row.name} even`;
  }
  function shareText(top10){
    const result = comparisonData(top10);
    return `My Top 10 active fighters\n${result.agreement}% model agreement\nBiggest disagreement: ${disagreementShort(result.biggest)}\nBuild yours: ${SITE_URL}`;
  }
  function loadImage(url){
    return new Promise(resolve => {
      if(!url){ resolve(null); return; }
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = url;
    });
  }
  function roundedRect(context,x,y,width,height,radius){
    const r = Math.min(radius,width / 2,height / 2);
    context.beginPath();
    context.moveTo(x + r,y);
    context.arcTo(x + width,y,x + width,y + height,r);
    context.arcTo(x + width,y + height,x,y + height,r);
    context.arcTo(x,y + height,x,y,r);
    context.arcTo(x,y,x + width,y,r);
    context.closePath();
  }
  function drawCoverImage(context,image,x,y,size){
    const sourceSize = Math.min(image.naturalWidth || image.width,image.naturalHeight || image.height);
    const sourceX = ((image.naturalWidth || image.width) - sourceSize) / 2;
    const sourceY = ((image.naturalHeight || image.height) - sourceSize) / 2;
    context.drawImage(image,sourceX,sourceY,sourceSize,sourceSize,x,y,size,size);
  }
  function drawCircularPortrait(context,image,name,cx,cy,radius,rank,large){
    context.save();
    context.beginPath();
    context.arc(cx,cy,radius,0,Math.PI * 2);
    context.clip();
    if(image){
      drawCoverImage(context,image,cx - radius,cy - radius,radius * 2);
    } else {
      const fallback = context.createLinearGradient(cx - radius,cy - radius,cx + radius,cy + radius);
      fallback.addColorStop(0,'#203451');
      fallback.addColorStop(1,'#0a111d');
      context.fillStyle = fallback;
      context.fillRect(cx - radius,cy - radius,radius * 2,radius * 2);
      context.fillStyle = '#ffffff';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.font = `900 ${large ? 62 : 38}px system-ui, sans-serif`;
      context.fillText(initials(name),cx,cy);
    }
    context.restore();

    context.strokeStyle = rank <= 4 ? '#f59e0b' : '#94a3b8';
    context.lineWidth = large ? 5 : 4;
    context.beginPath();
    context.arc(cx,cy,radius,0,Math.PI * 2);
    context.stroke();

    const badgeRadius = large ? 28 : 22;
    const badgeY = cy + radius - 4;
    context.fillStyle = '#07101c';
    context.beginPath();
    context.arc(cx,badgeY,badgeRadius,0,Math.PI * 2);
    context.fill();
    context.strokeStyle = '#f97316';
    context.lineWidth = 3;
    context.stroke();
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `900 ${large ? 28 : 22}px system-ui, sans-serif`;
    context.fillText(String(rank),cx,badgeY + 1);
  }
  function splitName(name){
    const parts = String(name || '').trim().split(/\s+/);
    if(parts.length <= 1) return [name];
    if(parts.length === 2) return parts;
    return [parts.slice(0,-1).join(' '),parts[parts.length - 1]];
  }
  function drawPortraitName(context,name,cx,y,large){
    const lines = splitName(name);
    const fontSize = large ? 26 : 19;
    const lineHeight = large ? 30 : 23;
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    context.font = `850 ${fontSize}px system-ui, sans-serif`;
    lines.forEach((line,index) => context.fillText(line.toUpperCase(),cx,y + (index * lineHeight)));
  }
  function fitText(context,text,maxWidth,startSize,minSize,weight='800'){
    let size = startSize;
    while(size > minSize){
      context.font = `${weight} ${size}px system-ui, sans-serif`;
      if(context.measureText(text).width <= maxWidth) return size;
      size -= 1;
    }
    return minSize;
  }
  async function makeTop10Card(top10){
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const context = canvas.getContext('2d');
    const result = comparisonData(top10);
    const fighters = top10.map(name => liveFighter(name));
    const images = await Promise.all(fighters.map(fighter => loadImage(photoFor(fighter.fighter))));

    const background = context.createLinearGradient(0,0,1080,1920);
    background.addColorStop(0,'#111b2b');
    background.addColorStop(.52,'#07101c');
    background.addColorStop(1,'#03070d');
    context.fillStyle = background;
    context.fillRect(0,0,1080,1920);

    const glow = context.createRadialGradient(540,180,0,540,180,620);
    glow.addColorStop(0,'rgba(33,92,173,.34)');
    glow.addColorStop(1,'rgba(5,9,16,0)');
    context.fillStyle = glow;
    context.fillRect(0,0,1080,850);

    context.fillStyle = '#f97316';
    context.fillRect(0,0,18,1920);

    context.textAlign = 'center';
    context.fillStyle = '#f59e0b';
    context.font = '850 25px system-ui, sans-serif';
    context.fillText('ACTIVE FIGHTERS',540,64);
    context.fillStyle = '#ffffff';
    context.font = '950 70px system-ui, sans-serif';
    context.fillText('MY UFC GOAT TOP 10',540,142);

    const topCenters = [150,410,670,930];
    fighters.slice(0,4).forEach((fighter,index) => {
      drawCircularPortrait(context,images[index],fighter.fighter,topCenters[index],310,94,index + 1,true);
      drawPortraitName(context,fighter.fighter,topCenters[index],438,true);
    });

    const bottomCenters = [92,271,450,629,808,987];
    fighters.slice(4,10).forEach((fighter,index) => {
      const rank = index + 5;
      const imageIndex = index + 4;
      drawCircularPortrait(context,images[imageIndex],fighter.fighter,bottomCenters[index],590,61,rank,false);
      drawPortraitName(context,fighter.fighter,bottomCenters[index],682,false);
    });

    context.fillStyle = 'rgba(3,9,17,.78)';
    roundedRect(context,46,742,988,728,24);
    context.fill();
    context.strokeStyle = 'rgba(148,163,184,.22)';
    context.lineWidth = 2;
    context.stroke();

    result.rows.forEach((row,index) => {
      const rowTop = 760 + (index * 70);
      const baseline = rowTop + 45;
      context.fillStyle = '#f97316';
      context.textAlign = 'left';
      context.font = '900 31px system-ui, sans-serif';
      context.fillText(`#${row.userRank}`,78,baseline);

      const nameSize = fitText(context,row.name,650,31,24,'850');
      context.fillStyle = '#ffffff';
      context.font = `850 ${nameSize}px system-ui, sans-serif`;
      context.fillText(row.name,160,baseline);

      context.fillStyle = '#cbd5e1';
      context.textAlign = 'right';
      context.font = '700 23px system-ui, sans-serif';
      context.fillText(`MODEL #${row.modelRank}`,1000,baseline);

      if(index < 9){
        context.strokeStyle = 'rgba(148,163,184,.18)';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(76,rowTop + 67);
        context.lineTo(1002,rowTop + 67);
        context.stroke();
      }
    });

    context.fillStyle = 'rgba(4,10,18,.93)';
    roundedRect(context,46,1506,988,276,24);
    context.fill();
    context.strokeStyle = '#f97316';
    context.lineWidth = 3;
    context.stroke();

    context.textAlign = 'left';
    context.fillStyle = '#f59e0b';
    context.font = '900 25px system-ui, sans-serif';
    context.fillText('MODEL AGREEMENT',82,1565);
    context.fillStyle = '#ffffff';
    context.font = '950 60px system-ui, sans-serif';
    context.fillText(`${result.agreement}/100`,82,1632);

    context.strokeStyle = 'rgba(148,163,184,.28)';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(82,1662);
    context.lineTo(998,1662);
    context.stroke();

    context.fillStyle = '#f59e0b';
    context.font = '900 25px system-ui, sans-serif';
    context.fillText('BIGGEST DISAGREEMENT',82,1714);
    const short = disagreementShort(result.biggest);
    const shortSize = fitText(context,short,900,38,28,'850');
    context.fillStyle = '#ffffff';
    context.font = `850 ${shortSize}px system-ui, sans-serif`;
    context.fillText(short,82,1761);

    context.fillStyle = '#94a3b8';
    context.textAlign = 'center';
    context.font = '650 24px system-ui, sans-serif';
    context.fillText(DISPLAY_URL,540,1870);

    return canvas;
  }
  async function shareTop10(event){
    event.preventDefault();
    event.stopImmediatePropagation();

    const top10 = loadTop10();
    if(top10.length !== 10) return;

    const original = button.textContent;
    button.textContent = 'CREATING CARD…';
    button.disabled = true;

    try {
      const canvas = await makeTop10Card(top10);
      const blob = await new Promise(resolve => canvas.toBlob(resolve,'image/png'));
      const file = blob ? new File([blob],'my-ufc-goat-top-10.png',{type:'image/png'}) : null;
      const text = shareText(top10);

      if(file && navigator.canShare?.({files:[file]})){
        await navigator.share({title:'My UFC GOAT Top 10',text,files:[file]});
      } else if(navigator.share){
        await navigator.share({title:'My UFC GOAT Top 10',text});
      } else if(blob){
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'my-ufc-goat-top-10.png';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url),1000);
        try { await navigator.clipboard.writeText(text); } catch(_copyError){}
      } else {
        await navigator.clipboard.writeText(text);
        button.textContent = 'COPIED';
        setTimeout(() => { button.textContent = original; button.disabled = false; },1300);
        return;
      }
    } catch(error){
      if(error?.name !== 'AbortError'){
        try {
          await navigator.clipboard.writeText(shareText(top10));
          button.textContent = 'COPIED';
        } catch(_copyError){
          button.textContent = 'SHARE FAILED';
        }
        setTimeout(() => { button.textContent = original; button.disabled = false; },1300);
        return;
      }
    }

    button.textContent = original;
    button.disabled = false;
  }

  button.addEventListener('click',shareTop10,true);
})();