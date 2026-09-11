const vectors={U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]},directions=Object.keys(vectors);
const key=([r,c])=>`${r},${c}`;
const specs=[
  {stage:3,size:5,target:4,blockers:4,items:[
    [[4,0],"RRURRU"],[[4,0],"RURRUR"],[[4,0],"RUURUU"],[[4,0],"URUURU"],
    [[0,0],"DDRDDR"],[[0,0],"DRDDRD"],[[0,4],"LLDLLD"],[[0,4],"LDLLDL"]
  ]},
  {stage:4,size:5,target:5,blockers:6,items:[
    [[4,0],"RRUURRUU"],[[4,0],"RUURRUUR"],[[4,0],"URRUURRU"],[[4,0],"UURRUURR"],
    [[4,4],"LLUULLUU"],[[4,4],"LUULLUUL"],[[4,4],"ULLUULLU"],[[4,4],"UULLUULL"]
  ]},
  {stage:5,size:7,target:7,blockers:10,items:[
    [[6,0],"RRURUURRURUU"],[[6,0],"RRUURURRUURU"],[[6,0],"RURRUURURRUU"],[[6,0],"RUURRURUURRU"],
    [[6,0],"URRUURURRUUR"],[[6,0],"URUURRURUURR"],[[6,0],"UURRURUURRUR"],[[6,0],"UURURRUURURR"]
  ]}
];

function trace(size,start,answer){const path=[start];let[r,c]=start;for(const command of answer){const[dr,dc]=vectors[command];r+=dr;c+=dc;if(r<0||c<0||r>=size||c>=size)return null;path.push([r,c])}return path}
function random(seed){let s=seed;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}}
function shuffle(values,next){const result=[...values];for(let i=result.length-1;i;i--){const j=Math.floor(next()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result}
function repeat(value,count){return Array.from({length:count},()=>value).join("")}
function tokenGroups(maxCost){const groups=Array.from({length:maxCost+1},()=>[]);directions.forEach(d=>groups[1].push(d));for(let length=1;length<maxCost;length++){const bodies=[];const build=prefix=>prefix.length===length?bodies.push(prefix):directions.forEach(d=>build(prefix+d));build("");for(const body of bodies)for(let count=2;count<=6;count++)groups[length+1].push(repeat(body,count))}return groups}
const groups=tokenGroups(7);
function minCost(size,start,flag,blocked,maxCost){const states=Array.from({length:maxCost+1},()=>new Set());states[0].add(key(start));for(let cost=0;cost<=maxCost;cost++)for(const id of states[cost]){const[r,c]=id.split(",").map(Number);for(let tokenCost=1;cost+tokenCost<=maxCost;tokenCost++)for(const token of groups[tokenCost]){let nr=r,nc=c,valid=true;for(const command of token){const[dr,dc]=vectors[command];nr+=dr;nc+=dc;const next=`${nr},${nc}`;if(nr<0||nc<0||nr>=size||nc>=size||blocked.has(next)){valid=false;break}if(nr===flag[0]&&nc===flag[1])return cost+tokenCost}if(valid)states[cost+tokenCost].add(`${nr},${nc}`)}}return Infinity}

const output=[];
for(const spec of specs){const next=random(7000+spec.stage);for(let index=0;index<spec.items.length;index++){
  const[start,answer]=spec.items[index],path=trace(spec.size,start,answer),flag=path.at(-1),safe=new Set(path.map(key)),available=[];
  for(let r=0;r<spec.size;r++)for(let c=0;c<spec.size;c++)if(!safe.has(`${r},${c}`))available.push([r,c]);
  let blockers=null,cost=null;
  for(let attempt=0;attempt<5000;attempt++){const sample=shuffle(available,next).slice(0,spec.blockers),blocked=new Set(sample.map(key));cost=minCost(spec.size,start,flag,blocked,spec.target);if(cost===spec.target){blockers=sample;break}}
  if(!blockers)throw new Error(`stage ${spec.stage} map ${index+1} failed, last cost ${cost}`);
  output.push({stage:spec.stage,id:index+1,start,flag,answer,blockers,minBlocks:cost});
}}
console.log(JSON.stringify(output,null,2));
