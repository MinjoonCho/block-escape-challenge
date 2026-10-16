const vectors={U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]};
const directionNames={U:"up",D:"down",L:"left",R:"right"};
const directionLetters={up:"U",down:"D",left:"L",right:"R"};
const key=([r,c])=>`${r},${c}`;
const cells=value=>value.split(" ").filter(Boolean).map(cell=>[Number(cell[0]),Number(cell[1])]);
const distance=([r1,c1],[r2,c2])=>Math.abs(r1-r2)+Math.abs(c1-c2);

function trace(size,start,answer){
  const path=[start];let[r,c]=start;
  for(const command of answer){const[dr,dc]=vectors[command];r+=dr;c+=dc;if(r<0||c<0||r>=size||c>=size)throw new Error(`맵 밖으로 나가는 정답: ${answer}`);path.push([r,c])}
  return path;
}

function placeBombs(size,idealPath,simplePath,coins,walls,count,variantIndex){
  const route=[...new Map([...idealPath,...simplePath].map(cell=>[key(cell),cell])).values()],occupied=new Set([...route,...walls].map(key)),flag=idealPath.at(-1),coinAnchors=coins.filter(cell=>key(cell)!==key(flag));
  const turns=idealPath.filter((_,index)=>index>0&&index<idealPath.length-1&&key([idealPath[index][0]-idealPath[index-1][0],idealPath[index][1]-idealPath[index-1][1]])!==key([idealPath[index+1][0]-idealPath[index][0],idealPath[index+1][1]-idealPath[index][1]]));
  const candidates=[];
  for(let r=0;r<size;r++)for(let c=0;c<size;c++){
    const cell=[r,c];if(occupied.has(key(cell)))continue;
    const routeNeighbors=route.filter(point=>distance(cell,point)===1).length;if(!routeNeighbors)continue;
    const coinDistance=coinAnchors.length?Math.min(...coinAnchors.map(point=>distance(cell,point))):99;
    const turnDistance=turns.length?Math.min(...turns.map(point=>distance(cell,point))):99;
    const score=routeNeighbors*7+(coinDistance===1?22:coinDistance===2?8:0)+(turnDistance===1?7:0)-(r===0||c===0||r===size-1||c===size-1?1:0)+((r*31+c*17+variantIndex*13)%11)/100;
    candidates.push({cell,score});
  }
  const selected=[];
  while(selected.length<count&&candidates.length){
    candidates.sort((a,b)=>(b.score+(selected.length?Math.min(...selected.map(cell=>distance(b.cell,cell)))*1.4:0))-(a.score+(selected.length?Math.min(...selected.map(cell=>distance(a.cell,cell)))*1.4:0)));
    selected.push(candidates.shift().cell);
  }
  if(selected.length!==count)throw new Error(`의미 있는 폭탄 위치 부족: ${selected.length}/${count}`);
  return selected;
}

function makeStage(spec,blueprint,index){
  const path=trace(spec.size,blueprint.start,blueprint.answer),simplePath=trace(spec.size,blueprint.start,blueprint.simple||blueprint.answer),blockers=cells(blueprint.blockers),walls=blockers.slice(0,spec.walls),coins=spec.coinSteps.map(step=>path[step]),bombs=placeBombs(spec.size,path,simplePath,coins,walls,spec.bombs,index);
  return{stageNumber:spec.stage,title:spec.title,text:spec.text,idealBlocks:spec.idealBlocks,blockLimit:spec.blockLimit,cols:spec.size,rows:spec.size,start:blueprint.start,flag:path.at(-1),walls,bombs,coins,answer:[...blueprint.answer].map(command=>directionNames[command]),simple:[...(blueprint.simple||blueprint.answer)].map(command=>directionNames[command]),variant:`${spec.stage}-${index+1}`,expectedBlocks:spec.idealBlocks};
}

const specs=[
  {stage:1,title:"스테이지 1",text:"3×3 지도에서 가장 짧은 길로 깃발에 도착하세요.",size:3,idealBlocks:4,blockLimit:8,walls:2,bombs:0,coinSteps:[],maps:[
    {start:[2,0],answer:"RRUU",blockers:"11 10"},{start:[2,0],answer:"RUUR",blockers:"12 10"},
    {start:[2,0],answer:"URRU",blockers:"21 01"},{start:[2,0],answer:"UURR",blockers:"11 21"},
    {start:[2,2],answer:"LLUU",blockers:"11 12"},{start:[2,2],answer:"LUUL",blockers:"10 12"},
    {start:[2,2],answer:"ULLU",blockers:"21 01"},{start:[2,2],answer:"UULL",blockers:"11 21"}
  ]},
  {stage:2,title:"스테이지 2",text:"3×3 지도에서 폭탄을 피해 깃발에 도착하고, 가능하면 코인도 챙기세요.",size:3,idealBlocks:5,blockLimit:9,walls:0,bombs:1,coinSteps:[2,4],maps:[
    {start:[2,0],answer:"RRUUL",simple:"UUR",blockers:"11"},{start:[0,0],answer:"DDRRU",simple:"DRR",blockers:"01"},
    {start:[0,2],answer:"LLDDR",simple:"DDL",blockers:"11"},{start:[2,2],answer:"UULLD",simple:"ULL",blockers:"21"},
    {start:[2,0],answer:"UURRD",simple:"URR",blockers:"21"},{start:[0,0],answer:"RRDDL",simple:"DDR",blockers:"11"},
    {start:[0,2],answer:"DDLLU",simple:"DLL",blockers:"01"},{start:[2,2],answer:"LLUUR",simple:"UUL",blockers:"11"}
  ]},
  {stage:3,title:"스테이지 3",text:"5×5 지도에서 서로 다른 세 칸 규칙을 찾아 반복하세요.",size:5,idealBlocks:4,blockLimit:9,walls:2,bombs:2,coinSteps:[2,4,6],maps:[
    {start:[4,0],answer:"RRURRU",simple:"UURRRR",blockers:"04 12 00 01"},{start:[4,0],answer:"RURRUR",simple:"UURRRR",blockers:"13 14 12 04"},
    {start:[4,0],answer:"RUURUU",simple:"UUUURR",blockers:"03 14 32 04"},{start:[4,0],answer:"URUURU",simple:"UUUURR",blockers:"34 43 24 41"},
    {start:[0,0],answer:"DDRDDR",simple:"RRDDDD",blockers:"34 13 03 04"},{start:[0,0],answer:"DRDDRD",simple:"DDDDRR",blockers:"23 14 22 01"},
    {start:[0,4],answer:"LLDLLD",simple:"DDLLLL",blockers:"00 41 44 01"},{start:[0,4],answer:"LDLLDL",simple:"DDLLLL",blockers:"31 42 02 00"}
  ]},
  {stage:4,title:"스테이지 4",text:"5×5 지도에서 네 칸짜리 이동 규칙을 찾아 반복하세요.",size:5,idealBlocks:5,blockLimit:10,walls:3,bombs:3,coinSteps:[2,4,6],maps:[
    {start:[4,0],answer:"RRUURRUU",simple:"UUUURRRR",blockers:"34 33 44 31 11 12"},{start:[4,0],answer:"RUURRUUR",simple:"RRRRUUUU",blockers:"01 33 32 30 10 00"},
    {start:[4,0],answer:"URRUURRU",simple:"UUUURRRR",blockers:"11 21 23 44 43 24"},{start:[4,0],answer:"UURRUURR",simple:"RRRRUUUU",blockers:"31 33 32 13 00 01"},
    {start:[4,4],answer:"LLUULLUU",simple:"UUUULLLL",blockers:"31 33 23 12 13 11"},{start:[4,4],answer:"LUULLUUL",simple:"UUUULLLL",blockers:"30 10 12 32 13 20"},
    {start:[4,4],answer:"ULLUULLU",simple:"UUUULLLL",blockers:"42 21 23 41 30 13"},{start:[4,4],answer:"UULLUULL",simple:"LLLLUUUU",blockers:"21 11 13 03 04 14"}
  ]},
  {stage:5,title:"스테이지 5",text:"7×7 지도에서 여섯 칸짜리 이동 규칙을 찾아 반복하세요.",size:7,idealBlocks:7,blockLimit:12,walls:5,bombs:5,coinSteps:[3,6,9,12],maps:[
    {start:[6,0],answer:"RRURUURRURUU",simple:"RRRRRRUUUUUU",blockers:"21 20 04 50 15 32 44 01 51 00"},{start:[6,0],answer:"RRUURURRUURU",simple:"RRRRRRUUUUUU",blockers:"53 10 03 12 24 22 54 11 30 00"},
    {start:[6,0],answer:"RURRUURURRUU",simple:"RRRRRRUUUUUU",blockers:"15 32 23 20 35 44 11 50 03 10"},{start:[6,0],answer:"RUURRURUURRU",simple:"UUUUUURRRRRR",blockers:"25 26 55 44 36 32 64 11 12 13"},
    {start:[6,0],answer:"URRUURURRUUR",simple:"UUUUUURRRRRR",blockers:"41 26 54 16 21 31 65 62 11 12"},{start:[6,0],answer:"URUURRURUURR",simple:"UUUUUURRRRRR",blockers:"42 66 55 46 16 64 61 36 35 11"},
    {start:[6,0],answer:"UURRURUURRUR",simple:"RRRRRRUUUUUU",blockers:"30 10 24 01 34 53 35 00 02 03"},{start:[6,0],answer:"UURURRUURURR",simple:"RRRRRRUUUUUU",blockers:"55 00 20 42 11 25 44 10 01 02"}
  ]}
];

export const stagePools=specs.map(spec=>spec.maps.map((map,index)=>makeStage(spec,map,index)));

export const missionCatalog={
  intermediate:{id:"intermediate",label:"중급 미션",stageNumbers:[1,2,3]},
  advanced:{id:"advanced",label:"고급 미션",stageNumbers:[3,4,5]}
};

function seeded(seed){
  let state=2166136261;for(const character of seed)state=Math.imul(state^character.charCodeAt(0),16777619);
  return()=>{state+=0x6d2b79f5;let value=state;value=Math.imul(value^value>>>15,value|1);value^=value+Math.imul(value^value>>>7,value|61);return((value^value>>>14)>>>0)/4294967296};
}

const publicStage=({answer,simple,expectedBlocks,...stage})=>stage;
export function createStageSet(seed){const random=seeded(seed);return stagePools.map(pool=>publicStage(pool[Math.floor(random()*pool.length)]))}
export function createMissionStageSet(seed,missionId){
  const mission=missionCatalog[missionId];if(!mission)throw new Error("올바른 미션을 선택해 주세요.");
  const stages=createStageSet(seed);return mission.stageNumbers.map(stageNumber=>stages[stageNumber-1]);
}

function idealProgramBlocks(commands){const value=commands.map(direction=>directionLetters[direction]).join(""),half=value.length/2;return Number.isInteger(half)&&value.slice(0,half)===value.slice(half)?half+1:value.length}
function simpleProgramBlocks(commands){let blocks=0,index=0;while(index<commands.length){let end=index+1;while(end<commands.length&&commands[end]===commands[index])end++;blocks+=end-index===1?1:2;index=end}return blocks}
function routeStats(map,commands){
  const blocked=new Set([...map.walls,...map.bombs].map(key)),coins=new Set(map.coins.map(key)),collected=new Set();let[r,c]=map.start;
  for(const direction of commands){const command=directionLetters[direction],[dr,dc]=vectors[command];r+=dr;c+=dc;const position=`${r},${c}`;if(r<0||c<0||r>=map.rows||c>=map.cols||blocked.has(position))return null;if(coins.has(position))collected.add(position);if(position===key(map.flag))return{coins:collected.size}}
  return null;
}

export function validateStagePools(){
  return stagePools.map((pool,index)=>{
    const expected={size:pool[0].rows,moves:pool[0].answer.length,blocks:pool[0].expectedBlocks,coins:pool[0].coins.length,walls:pool[0].walls.length,bombs:pool[0].bombs.length};
    const signatures=new Set(),solutions=new Set();
    for(const map of pool){
      const path=trace(map.rows,map.start,map.answer.map(direction=>directionLetters[direction])),blocked=new Set([...map.walls,...map.bombs].map(key));
      if(map.rows!==expected.size||map.cols!==expected.size||map.answer.length!==expected.moves||map.expectedBlocks!==expected.blocks||map.coins.length!==expected.coins||map.walls.length!==expected.walls||map.bombs.length!==expected.bombs)throw new Error(`${index+1}단계 난이도 지표 불일치`);
      if(key(path.at(-1))!==key(map.flag)||path.some(cell=>blocked.has(key(cell))))throw new Error(`${index+1}단계 정답 경로 오류`);
      const ideal=routeStats(map,map.answer),simple=routeStats(map,map.simple),idealBlocks=idealProgramBlocks(map.answer),simpleBlocks=simpleProgramBlocks(map.simple);
      if(!ideal||ideal.coins!==map.coins.length||idealBlocks!==map.idealBlocks)throw new Error(`${index+1}단계 전체 코인 경로 오류`);
      if(!simple||(map.coins.length&&simple.coins>=map.coins.length))throw new Error(`${index+1}단계 쉬운 탈출 경로 오류`);
      const meaningfulRoute=[...path,...trace(map.rows,map.start,map.simple.map(direction=>directionLetters[direction]))];if(map.bombs.some(bomb=>!meaningfulRoute.some(cell=>distance(bomb,cell)===1)))throw new Error(`${index+1}단계 경로와 무관한 폭탄 위치`);
      signatures.add(JSON.stringify([map.start,map.flag,map.walls,map.bombs,map.coins]));solutions.add(map.answer.join(","));
    }
    if(signatures.size!==pool.length||solutions.size<4)throw new Error(`${index+1}단계 변주 부족`);
    return{stage:index+1,variants:pool.length,grid:`${expected.size}x${expected.size}`,moves:expected.moves,idealBlocks:expected.blocks,easyBlocks:index===0?expected.blocks:simpleProgramBlocks(pool[0].simple),easyCoins:index===0?0:routeStats(pool[0],pool[0].simple).coins,coins:expected.coins,walls:expected.walls,bombs:expected.bombs,uniqueSolutions:solutions.size};
  });
}
