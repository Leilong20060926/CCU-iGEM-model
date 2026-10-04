// Population model: limonene evaporation + stage-structured leaf-roller dynamics
const THRESHOLD=20;
const LETHAL_RATE=0.40;
const DAYS_SIM=120;
const TEMP_5YR=[29.1,28.7,28.3,26.2];

function simulate(p){
  const temp=TEMP_5YR[p.month-7];
  // Module 1: limonene physical evaporation prediction
  const kEvap=0.035*(temp/25)*(1+p.wind);
  const evapTimeMin=(3*Math.cbrt(p.dose))/kEvap;
  const durationDays=Math.ceil(evapTimeMin/(24*60));
  // Module 2: temperature-driven development days and base transition matrix
  const daysEgg=60.2/(temp-12);
  const daysLarva=240.0/(temp-11);
  const daysPupa=84.0/(temp-14);
  const genDays=daysEgg+daysLarva+daysPupa;
  const s=[0.9,0.8,0.9,0.85];
  const P=[1/daysEgg,1/daysLarva,1/daysPupa];
  const f=(200*0.5)/14;
  const M=[
    [s[0]*(1-P[0]),0,0,f],
    [s[0]*P[0],s[1]*(1-P[1]),0,0],
    [0,s[1]*P[1],s[2]*(1-P[2]),0],
    [0,0,s[2]*P[2],s[3]]
  ];
  const mul=(x)=>M.map(row=>row[0]*x[0]+row[1]*x[1]+row[2]*x[2]+row[3]*x[3]);
  // Module 3: no-intervention simulation (first threshold-crossing alert)
  let x=[p.eggs,0,0,0];
  let outbreakDay=null,outbreakLarva=null;
  for(let d=1;d<=DAYS_SIM;d++){
    if(d>1)x=mul(x);
    if(x[1]>THRESHOLD){outbreakDay=d;outbreakLarva=x[1];break;}
  }
  // Module 4: full-season dynamic intervention (spray schedule and dynamic doses)
  const pop=[[p.eggs,0,0,0]];
  const sprays=[];
  let cooldown=0;
  for(let t=1;t<DAYS_SIM;t++){
    const n=mul(pop[t-1]);
    if(cooldown>0)cooldown--;
    if(n[1]>THRESHOLD&&cooldown===0){
      const day=t+1;
      let ratio=(n[1]-THRESHOLD)/n[1];
      ratio=Math.max(ratio,LETHAL_RATE*0.5);
      const doseMl=p.area*p.dose*(ratio/LETHAL_RATE);
      n[0]*=(1-ratio);n[1]*=(1-ratio);
      sprays.push({day,gen:Math.ceil(day/genDays),doseMl,larva:n[1]});
      cooldown=durationDays+5;
    }
    pop.push(n);
  }
  const series=[0,1,2,3].map(k=>pop.map(v=>v[k]));
  const totalDose=sprays.reduce((a,b)=>a+b.doseMl,0);
  return {temp,durationDays,daysEgg,daysLarva,daysPupa,genDays,outbreakDay,outbreakLarva,series,sprays,totalDose};
}
