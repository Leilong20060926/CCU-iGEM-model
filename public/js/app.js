// App state, theme / language, modal pages, rendering and text report
let lang = localStorage.getItem('lang') || 'en';
let theme = localStorage.getItem('theme') || 'light';
let lastRun = null; // {month, eggs, area, dose, wind}

function applyTheme(){
  document.body.setAttribute('data-theme', theme);
  const iconSrc = theme === 'dark' ? 'public/assets/sun.svg' : 'public/assets/moon.svg';
  const iconImg = document.getElementById('themeIcon');
  if(iconImg) iconImg.src = iconSrc;
  const modalIconImg = document.getElementById('themeIconModal');
  if(modalIconImg) modalIconImg.src = iconSrc;
  localStorage.setItem('theme', theme);
}
function toggleTheme(){ theme = theme === 'light' ? 'dark' : 'light'; applyTheme(); if(lastRun) renderAll(lastRun); }

let currentModal = null; // 'info' | 'about' | null

function toggleLanguage(){
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('lang', lang);
  applyStaticText();
  if(lastRun) renderAll(lastRun);
  if(currentModal) renderModalContent();
}

function applyStaticText(){
  const t = T[lang];
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  document.title = t.title;
  document.getElementById('brandText').textContent = t.brand;
  document.getElementById('tagText').textContent = t.tag;
  document.getElementById('titleText').textContent = t.title;
  document.getElementById('subtitleText').textContent = t.subtitle;
  document.getElementById('monthLabel').textContent = t.monthLabel;
  document.getElementById('eggsLabel').textContent = t.eggsLabel;
  document.getElementById('areaLabel').textContent = t.areaLabel;
  document.getElementById('doseLabel').textContent = t.doseLabel;
  document.getElementById('windLabel').textContent = t.windLabel;
  document.getElementById('runButton').textContent = t.runButton;
  document.getElementById('langToggle').textContent = lang === 'zh' ? 'English' : '中文';
  const langModalBtn = document.getElementById('langToggleModal');
  if(langModalBtn) langModalBtn.textContent = lang === 'zh' ? 'English' : '中文';
  document.getElementById('infoToggle').textContent = t.info.title;
  document.getElementById('aboutToggle').textContent = t.about.title;
  document.getElementById('pageBackText').textContent = t.back;
  const empty = document.getElementById('emptyState');
  if(empty){
    empty.querySelector('strong').textContent = t.emptyTitle;
    document.getElementById('emptyHint').textContent = t.emptyHint;
  }
}

function escHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderModalContent(){
  if(!currentModal) return;
  const t = T[lang];
  const data = t[currentModal];
  document.getElementById('modalTitle').textContent = data.title;
  let html = '';
  if(currentModal === 'info'){
    data.items.forEach(item => {
      html += '<div class="info-block">';
      html += `<div class="info-heading">${escHtml(item.heading)}</div>`;
      if(item.body) html += `<p class="info-body">${escHtml(item.body)}</p>`;
      if(item.blocks) item.blocks.forEach(b => {
        if(b.p) html += `<p class="info-body">${b.p}</p>`;
        if(b.math) html += `<div class="info-math">${b.math}</div>`;
      });
      if(item.list){
        html += '<ul class="info-list">';
        item.list.forEach(li => { html += `<li>${escHtml(li)}</li>`; });
        html += '</ul>';
      }
      if(item.link){
        html += `<a class="info-link" href="${escHtml(item.link.href)}" target="_blank" rel="noopener noreferrer">${escHtml(item.link.label)}</a>`;
      }
      html += '</div>';
    });
  } else if(currentModal === 'about'){
    html += `<div class="info-block">`;
    html += `<div class="info-heading">${escHtml(data.introLabel)}</div>`;
    data.paras.forEach(p => { html += `<p class="about-para">${escHtml(p)}</p>`; });
    html += `<div class="about-links-title">${escHtml(data.linksLabel)}</div>`;
    html += '<ul class="about-links">';
    data.links.forEach(l => {
      html += `<li><a href="${escHtml(l.href)}" target="_blank" rel="noopener noreferrer"><span>${escHtml(l.label)}</span><span>→</span></a></li>`;
    });
    html += '</ul>';
    html += '</div>';
  }
  document.getElementById('modalBody').innerHTML = html;
}

function openModal(type){
  currentModal = type;
  renderModalContent();
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.add('open');
  overlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  currentModal = null;
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && currentModal) closeModal();
});

function readNum(id){return parseFloat(document.getElementById(id).value);}

function runSimulation(){
  const p={
    month:parseInt(document.getElementById('month').value,10),
    eggs:readNum('initialEggs'),
    area:readNum('fieldArea'),
    dose:readNum('baseDose'),
    wind:readNum('windSpeed')
  };
  const t=T[lang];
  if(isNaN(p.month)||p.month<7||p.month>10){alert(t.alertMonth);return;}
  if(isNaN(p.eggs)||p.eggs<0){alert(t.alertEggs);return;}
  if(isNaN(p.area)||p.area<=0){alert(t.alertArea);return;}
  if(isNaN(p.dose)||p.dose<=0){alert(t.alertDose);return;}
  if(isNaN(p.wind)||p.wind<0){alert(t.alertWind);return;}
  lastRun=p;
  renderAll(p);
}

function renderAll(p){
  const t=T[lang];
  const r=simulate(p);
  renderCards(p,r,t);
  renderChart(r,t);
  renderTextReport(p,r,t);
}

function renderCards(p,r,t){
  const area=document.getElementById('resultsArea');
  area.innerHTML='';
  const wEgg=(r.daysEgg/r.genDays*100).toFixed(1);
  const wLarva=(r.daysLarva/r.genDays*100).toFixed(1);
  const wPupa=(r.daysPupa/r.genDays*100).toFixed(1);
  const warn=r.outbreakDay!==null;
  const statusCls=warn?'warn':'safe';
  const statusLabel=warn?t.statusWarn:t.statusSafe;
  const peakHtml=warn?t.outbreakText(r.outbreakDay,r.outbreakLarva):t.safeText(THRESHOLD);

  let actionHtml='';
  if(r.sprays.length){
    actionHtml=`<div class="action-card">
        <div class="action-title">${t.actionWarnTitle}</div>
        <ul class="action-list">
          <li>${t.duration(r.durationDays)}</li>
          <li>${t.sprayCount(r.sprays.length)}</li>
          <li>${t.totalDose(p.area,r.totalDose)}</li>
        </ul>
      </div>`;
  }else{
    actionHtml=`<div class="action-card safe">
        <div class="action-title">${t.actionSafeTitle}</div>
        <ul class="action-list"><li>${t.safeAdvice}</li><li>${t.duration(r.durationDays)}</li></ul>
      </div>`;
  }

  const grid=document.createElement('div');
  grid.className='scenario-grid';
  const card=document.createElement('div');
  card.className='scenario-card';
  card.innerHTML=`
      <div class="scenario-head">
        <div class="scenario-name">${t.scenarioName}</div>
        <div class="temp-badge">${r.temp.toFixed(1)}℃</div>
      </div>
      <div class="timeline-label">${t.timelineLabel}</div>
      <div class="timeline">
        <div class="seg egg" style="flex-basis:${wEgg}%">${r.daysEgg.toFixed(1)}${t.dayUnit}</div>
        <div class="seg larva" style="flex-basis:${wLarva}%">${r.daysLarva.toFixed(1)}${t.dayUnit}</div>
        <div class="seg pupa" style="flex-basis:${wPupa}%">${r.daysPupa.toFixed(1)}${t.dayUnit}</div>
      </div>
      <div class="timeline-legend">
        <span><span class="swatch" style="background:var(--egg-c)"></span>${t.eggSeg}</span>
        <span><span class="swatch" style="background:var(--larva-c)"></span>${t.larvaSeg}</span>
        <span><span class="swatch" style="background:var(--pupa-c)"></span>${t.pupaSeg}</span>
      </div>
      <div class="stat-grid">
        <div class="stat-tile"><span class="val">${r.daysEgg.toFixed(1)}</span><span class="lbl">${t.statEgg}</span></div>
        <div class="stat-tile"><span class="val">${r.daysLarva.toFixed(1)}</span><span class="lbl">${t.statLarva}</span></div>
        <div class="stat-tile"><span class="val">${r.daysPupa.toFixed(1)}</span><span class="lbl">${t.statPupa}</span></div>
        <div class="stat-tile"><span class="val">${r.genDays.toFixed(1)}</span><span class="lbl">${t.statGen}</span></div>
      </div>
      <div class="peak-row">
        <div class="peak-text">${peakHtml}</div>
        <div class="status-badge ${statusCls}">${statusLabel}</div>
      </div>
      ${actionHtml}
    `;
  grid.appendChild(card);
  area.appendChild(grid);

  const chartPanel=document.createElement('div');
  chartPanel.className='panel chart-panel';
  chartPanel.innerHTML=`<h3>${t.chartTitle}</h3><div class="chart-wrap"><canvas id="chartCanvas"></canvas></div>`;
  area.appendChild(chartPanel);

  const sched=document.createElement('div');
  sched.className='panel sched-panel';
  let schedBody='';
  if(r.sprays.length){
    const rows=r.sprays.map((s,i)=>`<tr><td>${t.schedRow(i+1)}</td><td>${t.schedDay(s.day)}</td><td>${t.schedGen(s.gen)}</td><td class="num">${s.doseMl.toFixed(0)}</td></tr>`).join('');
    schedBody=`<div class="sched-scroll"><table class="sched-table">
        <thead><tr>${t.schedCols.map((c,i)=>`<th${i===3?' class="num"':''}>${c}</th>`).join('')}</tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
  }else{
    schedBody=`<div class="action-card safe"><ul class="action-list"><li>${t.safeAdvice}</li></ul></div>`;
  }
  sched.innerHTML=`<h3>${t.schedTitle}</h3>
      <div class="stat-grid">
        <div class="stat-tile"><span class="val">${r.sprays.length}</span><span class="lbl">${t.statSprays}</span></div>
        <div class="stat-tile"><span class="val">${r.totalDose.toFixed(0)}</span><span class="lbl">${t.statTotal}</span></div>
        <div class="stat-tile"><span class="val">${r.durationDays}</span><span class="lbl">${t.statDuration}</span></div>
        <div class="stat-tile"><span class="val">${p.area}</span><span class="lbl">${t.statArea}</span></div>
      </div>
      ${schedBody}`;
  area.appendChild(sched);

  const reportDetails=document.createElement('details');
  reportDetails.className='report';
  reportDetails.innerHTML=`<summary>${t.reportToggle}</summary><pre id="resultOutput"></pre>`;
  area.appendChild(reportDetails);
}

function renderTextReport(p,r,t){
  const sep='------------------------------------------------------\n';
  let out=t.header(p.month)+'\n';
  out+=t.baseline(r.temp)+'\n';
  out+=t.devTitle+'\n';
  out+=t.eggStage(r.daysEgg)+'\n';
  out+=t.larvaStage(r.daysLarva)+'\n';
  out+=t.pupaStage(r.daysPupa)+'\n';
  out+=t.fullGen(r.genDays)+'\n\n';
  out+=t.warnTitle+'\n';
  if(r.outbreakDay!==null){
    out+=t.outbreakSimple(r.outbreakDay,r.outbreakLarva)+'\n';
    out+=t.durationSimple(r.durationDays)+'\n\n';
  }else{
    out+=t.safeSimple(THRESHOLD)+'\n\n';
  }
  out+=sep+t.schedTitle+'\n'+sep;
  if(!r.sprays.length){
    out+=t.noSpraySimple+'\n';
  }else{
    r.sprays.forEach((s,i)=>{out+=t.sprayLine(i+1,s.day,s.gen,s.doseMl)+'\n';});
    out+='\n'+t.totalSimple(r.sprays.length,p.area,r.totalDose)+'\n';
  }
  const pre=document.getElementById('resultOutput');
  if(pre)pre.textContent=out;
}

applyTheme();
applyStaticText();
