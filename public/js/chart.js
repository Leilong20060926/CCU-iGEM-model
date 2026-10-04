// Canvas chart for the 120-day population dynamics
function renderChart(r,t){
  chartResizeState={r,t};
  const canvas=document.getElementById('chartCanvas');
  const wrap=canvas.parentElement;
  const ctx=canvas.getContext('2d');

  // Retina-sharp, responsive sizing
  const dpr=window.devicePixelRatio||1;
  const cssW=wrap.clientWidth;
  const cssH=wrap.clientHeight;
  canvas.width=Math.round(cssW*dpr);
  canvas.height=Math.round(cssH*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);

  const width=cssW,height=cssH;
  const padding={top:40,right:26,bottom:44,left:56};
  const chartW=width-padding.left-padding.right;
  const chartH=height-padding.top-padding.bottom;
  ctx.clearRect(0,0,width,height);

  const bodyStyle=getComputedStyle(document.body);
  const cssVar=(n)=>bodyStyle.getPropertyValue(n).trim();
  const lineColor=cssVar('--line');
  const inkColor=cssVar('--ink-soft');
  const inkStrong=cssVar('--ink');
  const brickColor=cssVar('--brick');
  const surface=cssVar('--surface')||'#fff';
  const colors=[cssVar('--egg-c'),cssVar('--larva-c'),cssVar('--pupa-c'),cssVar('--adult-c')];
  const labels=[t.chartEgg,t.chartLarva,t.chartPupa,t.chartAdult];

  // Y scale — nice round steps
  const maxValue=Math.max(...r.series.flat(),THRESHOLD);
  const rawStep=maxValue/5;
  const magnitude=Math.pow(10,Math.floor(Math.log10(rawStep||1)));
  const niceSteps=[1,2,2.5,5,10];
  let step=magnitude;
  for(const n of niceSteps){if(rawStep<=n*magnitude){step=n*magnitude;break;}}
  const yMax=Math.ceil(maxValue/step)*step;
  const scaleY=chartH/yMax;
  const scaleX=chartW/(DAYS_SIM-1);
  const px=(day)=>padding.left+(day-1)*scaleX;
  const py=(v)=>padding.top+chartH-v*scaleY;
  const fmtNum=(v)=>v>=1000?(v/1000)+'k':String(v);

  // Horizontal gridlines + Y labels
  ctx.font='11px "IBM Plex Mono", monospace';
  ctx.textAlign='right';
  ctx.textBaseline='middle';
  const ySteps=Math.round(yMax/step);
  for(let i=0;i<=ySteps;i++){
    const val=i*step;
    const y=py(val);
    ctx.strokeStyle=lineColor;
    ctx.lineWidth=1;
    ctx.setLineDash(i===0?[]:[3,4]);
    ctx.beginPath();ctx.moveTo(padding.left,y);ctx.lineTo(width-padding.right,y);ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle=inkColor;
    ctx.fillText(fmtNum(Math.round(val)),padding.left-10,y);
  }

  // X axis labels (every 20 days)
  ctx.textAlign='center';
  ctx.textBaseline='top';
  ctx.fillStyle=inkColor;
  for(let d=0;d<=DAYS_SIM;d+=20){
    ctx.fillText(d,px(Math.max(d,1)),padding.top+chartH+10);
  }

  // Larva area fill
  const larvaPts=r.series[1].map((v,i)=>({x:px(i+1),y:py(v)}));
  const grad=ctx.createLinearGradient(0,padding.top,0,padding.top+chartH);
  grad.addColorStop(0,colors[1]+'33');
  grad.addColorStop(1,colors[1]+'00');
  ctx.beginPath();
  larvaPts.forEach((pt,i)=>i?ctx.lineTo(pt.x,pt.y):ctx.moveTo(pt.x,pt.y));
  ctx.lineTo(larvaPts[larvaPts.length-1].x,padding.top+chartH);
  ctx.lineTo(larvaPts[0].x,padding.top+chartH);
  ctx.closePath();
  ctx.fillStyle=grad;
  ctx.fill();

  // Stage lines (larva drawn last & thicker)
  [0,2,3,1].forEach(k=>{
    ctx.save();
    ctx.strokeStyle=colors[k];
    ctx.lineWidth=k===1?2.6:1.5;
    ctx.lineJoin='round';
    ctx.lineCap='round';
    if(k===1){ctx.shadowColor=colors[k]+'55';ctx.shadowBlur=6;}
    ctx.beginPath();
    r.series[k].forEach((v,i)=>i?ctx.lineTo(px(i+1),py(v)):ctx.moveTo(px(i+1),py(v)));
    ctx.stroke();
    ctx.restore();
  });

  // Threshold line
  ctx.strokeStyle=brickColor;
  ctx.setLineDash([6,4]);
  ctx.lineWidth=1.5;
  const ty=py(THRESHOLD);
  ctx.beginPath();ctx.moveTo(padding.left,ty);ctx.lineTo(width-padding.right,ty);ctx.stroke();
  ctx.setLineDash([]);

  // Spray markers
  ctx.font='600 9.5px "IBM Plex Mono", monospace';
  ctx.textAlign='center';
  ctx.textBaseline='bottom';
  r.sprays.forEach((s,i)=>{
    const x=px(s.day),y=py(s.larva);
    ctx.beginPath();
    ctx.moveTo(x,y-7);ctx.lineTo(x-5,y+3);ctx.lineTo(x+5,y+3);ctx.closePath();
    ctx.fillStyle=brickColor;
    ctx.strokeStyle=surface;
    ctx.lineWidth=1.2;
    ctx.fill();ctx.stroke();
    if(scaleX<4)return;
    ctx.fillStyle=inkStrong;
    ctx.fillText(i+1,x,y-9);
  });

  // Threshold label pill
  ctx.font='600 10.5px "IBM Plex Mono", monospace';
  const labelText=t.chartThreshold;
  const labelW=ctx.measureText(labelText).width+16;
  const labelH=18;
  const labelX=width-padding.right-labelW-6;
  const labelY=Math.max(padding.top+2,ty-labelH-4);
  ctx.fillStyle=brickColor;
  ctx.beginPath();
  ctx.roundRect?ctx.roundRect(labelX,labelY,labelW,labelH,9):ctx.rect(labelX,labelY,labelW,labelH);
  ctx.fill();
  ctx.fillStyle=surface;
  ctx.textAlign='left';
  ctx.textBaseline='middle';
  ctx.fillText(labelText,labelX+8,labelY+labelH/2+0.5);

  // Axis titles
  ctx.font='600 11.5px "IBM Plex Mono", monospace';
  ctx.fillStyle=inkStrong;
  ctx.textAlign='center';
  ctx.textBaseline='alphabetic';
  ctx.fillText(t.axisX,padding.left+chartW/2,height-4);
  ctx.save();
  ctx.translate(14,padding.top+chartH/2);
  ctx.rotate(-Math.PI/2);
  ctx.textBaseline='middle';
  ctx.fillText(t.axisY,0,0);
  ctx.restore();

  // Legend — top left, wraps if narrow
  ctx.font='600 11px "IBM Plex Mono", monospace';
  ctx.textBaseline='middle';
  ctx.textAlign='left';
  const items=labels.map((l,k)=>({l,c:colors[k],tri:false})).concat([{l:t.chartSpray,c:brickColor,tri:true}]);
  let lx=padding.left,ly=12;
  items.forEach(it=>{
    const w=ctx.measureText(it.l).width+26;
    if(lx+w>width-padding.right){lx=padding.left;ly+=16;}
    ctx.fillStyle=it.c;
    ctx.beginPath();
    if(it.tri){ctx.moveTo(lx+4.5,ly-5);ctx.lineTo(lx,ly+4);ctx.lineTo(lx+9,ly+4);ctx.closePath();}
    else ctx.arc(lx+4.5,ly,4.5,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle=inkStrong;
    ctx.fillText(it.l,lx+14,ly);
    lx+=w;
  });
}

let chartResizeState=null;
window.addEventListener('resize',()=>{
  if(!chartResizeState)return;
  clearTimeout(window.__chartResizeTimer);
  window.__chartResizeTimer=setTimeout(()=>{
    if(document.getElementById('chartCanvas'))renderChart(chartResizeState.r,chartResizeState.t);
  },120);
});
