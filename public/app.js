import { createMissionStageSet } from "./stages.js?v=gmeta-layouts-20261017-2";

const labels={up:"위로",down:"아래로",left:"왼쪽으로",right:"오른쪽으로"};
const vectors={up:[-1,0],down:[1,0],left:[0,-1],right:[0,1]};
const directionPaths={up:"M24 6 9 22h9v20h12V22h9L24 6Z",down:"m24 42 15-16h-9V6H18v20H9l15 16Z",left:"M6 24 22 9v9h20v12H22v9L6 24Z",right:"m42 24-16-15v9H6v12h20v9l16-15Z"};
const directionIcon=dir=>`<span class="program-direction" aria-hidden="true"><svg class="program-symbol" viewBox="0 0 48 48"><path d="${directionPaths[dir]}"></path></svg></span>`;
const repeatIcon='<span class="repeat-symbol" aria-hidden="true"><svg class="program-symbol" viewBox="0 0 48 48"><path d="M38.7 13.5A19 19 0 1 0 42 30h-8a11 11 0 1 1-1.8-10.7L25 26h19V7l-5.3 6.5Z"></path></svg></span>';
const el=id=>document.getElementById(id);
const grid=el("gameGrid"),programList=el("programList"),codingCanvas=document.querySelector(".coding-canvas");
const key=(r,c)=>`${r},${c}`;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

let stages=[],stageIndex=0,program=[],openRepeat=null,player={r:0,c:0},collected=new Set();
let running=true,startedAt=0,totalScore=0,totalTime=0,totalCoins=0,timerId,soundOn=true,missionLabel="",dragPayload=null,audioContext=null;

function loadMission(mission){
  const missionConfig={
    intermediate:{label:"중급 미션"},
    advanced:{label:"고급 미션"}
  }[mission];
  if(!missionConfig)return false;
  const seed=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`;
  stages=createMissionStageSet(mission,seed);
  missionLabel=missionConfig.label;
  return true;
}
const stage=()=>stages[stageIndex];
const sourceBlockCount=(nodes=program)=>nodes.reduce((sum,node)=>sum+1+(node.type==="repeat"?node.body.length:0),0);
const canAddBlock=()=>{
  if(sourceBlockCount()<stage().blockLimit)return true;
  toast(`블록은 ${stage().blockLimit}개까지 사용할 수 있어요.`);return false;
};

function expandProgram(){
  const result=[];
  program.forEach((node,index)=>{
    if(node.type==="move")result.push({dir:node.dir,path:String(index)});
    else for(let count=0;count<node.count;count++)node.body.forEach((child,childIndex)=>result.push({dir:child.dir,path:`${index}-${childIndex}`}));
  });
  return result;
}

function resetPlayer(){const[r,c]=stage().start;player={r,c};collected=new Set()}

function renderGrid(){
  const current=stage();grid.style.setProperty("--cols",current.cols);grid.style.setProperty("--rows",current.rows);grid.innerHTML="";
  for(let r=0;r<current.rows;r++)for(let c=0;c<current.cols;c++){
    const cell=document.createElement("div");cell.className="cell";cell.setAttribute("role","gridcell");cell.dataset.key=key(r,c);
    if(current.walls.some(([a,b])=>a===r&&b===c))cell.classList.add("wall");
    if(current.bombs.some(([a,b])=>a===r&&b===c))cell.classList.add("bomb");
    if(current.coins.some(([a,b])=>a===r&&b===c)&&!collected.has(key(r,c)))cell.classList.add("coin");
    if(current.flag[0]===r&&current.flag[1]===c)cell.classList.add("flag");grid.append(cell);
  }
  placePlayer("",true);
}

function placePlayer(className="",instant=false){
  let img=grid.querySelector(".player");
  if(!img){img=document.createElement("img");img.src="/assets/goyang-cat-run.png";img.alt="고양시 마스코트";grid.append(img)}
  img.className=`player ${className}${instant?" instant":""}`;img.style.width=`${120/stage().cols}%`;img.style.height=`${120/stage().rows}%`;img.style.setProperty("--player-x",`${player.c*100-10}%`);img.style.setProperty("--player-y",`${player.r*100-10}%`);
  if(instant)requestAnimationFrame(()=>img.classList.remove("instant"));
}

function moveMarkup(node,parentIndex,childIndex=null){
  const target=childIndex===null?String(parentIndex):`${parentIndex}-${childIndex}`;
  return `${directionIcon(node.dir)}<strong>${labels[node.dir]}</strong><span class="drag-grip" aria-hidden="true"><i></i><i></i><i></i></span><button class="program-delete" data-delete="${target}" type="button" aria-label="${labels[node.dir]} 블록 삭제">×</button>`;
}

function readDrag(event){
  if(dragPayload)return dragPayload;
  try{return JSON.parse(event.dataTransfer.getData("application/json")||event.dataTransfer.getData("text/plain"))}catch{return null}
}

function startDrag(event,payload){
  if(running){event.preventDefault();return}
  dragPayload=payload;event.dataTransfer.effectAllowed=payload.origin==="palette"?"copy":"move";
  const data=JSON.stringify(payload);event.dataTransfer.setData("application/json",data);event.dataTransfer.setData("text/plain",data);
  document.body.classList.add("is-dragging");
}

function removeDraggedBlock(payload){
  if(payload.origin==="program"){
    const node=program[payload.index];if(!node)return false;if(openRepeat===node)openRepeat=null;program.splice(payload.index,1);
  }else if(payload.origin==="nested"){
    const parent=program[payload.parent];if(!parent?.body[payload.child])return false;parent.body.splice(payload.child,1);
  }else return false;
  renderProgram();toast("작업 영역 밖으로 뺀 블록을 삭제했어요.");return true;
}

function endDrag(event){
  const payload=dragPayload;
  if(event?.type==="dragend"&&payload&&(payload.origin==="program"||payload.origin==="nested")){
    const target=(event.clientX||event.clientY)?document.elementFromPoint(event.clientX,event.clientY):null;
    if(target&&!codingCanvas.contains(target))removeDraggedBlock(payload);
  }
  dragPayload=null;document.body.classList.remove("is-dragging");codingCanvas.classList.remove("canvas-drop-ready");document.querySelectorAll(".drag-over,.drop-before,.drop-after").forEach(node=>node.classList.remove("drag-over","drop-before","drop-after"));
}

function takeMove(payload){
  if(!payload)return null;
  if(payload.origin==="palette")return payload.type==="move"?{type:"move",dir:payload.dir}:null;
  if(payload.origin==="program"){
    const node=program[payload.index];if(node?.type!=="move")return null;program.splice(payload.index,1);return node;
  }
  if(payload.origin==="nested"){
    const parent=program[payload.parent];if(parent?.type!=="repeat")return null;return parent.body.splice(payload.child,1)[0]||null;
  }
  return null;
}

function dropAtProgram(event,insertIndex){
  event.preventDefault();event.stopPropagation();const payload=readDrag(event);if(!payload||running)return endDrag();
  if(payload.origin==="palette"&&!canAddBlock())return endDrag();
  let node;
  if(payload.origin==="palette"){
    node=payload.type==="repeat"?{type:"repeat",count:2,body:[]}:{type:"move",dir:payload.dir};
  }else if(payload.origin==="program"){
    node=program[payload.index];if(!node)return endDrag();program.splice(payload.index,1);if(payload.index<insertIndex)insertIndex--;
  }else node=takeMove(payload);
  if(!node)return endDrag();program.splice(Math.max(0,insertIndex),0,node);openRepeat=node.type==="repeat"?node:null;endDrag();renderProgram();playSound("block");
}

function dropInRepeat(event,target){
  event.preventDefault();event.stopPropagation();const payload=readDrag(event);if(!payload||payload.type==="repeat"||(payload.origin==="program"&&program[payload.index]?.type==="repeat"))return endDrag();
  if(payload.origin==="palette"&&!canAddBlock())return endDrag();
  const node=takeMove(payload);if(!node)return endDrag();target.body.push(node);openRepeat=target;endDrag();renderProgram();playSound("block");
}

function dropSlot(index){
  const slot=document.createElement("li");slot.className="program-drop";slot.dataset.dropIndex=index;slot.innerHTML="<span>여기에 놓기</span>";
  slot.ondragover=event=>{event.preventDefault();event.dataTransfer.dropEffect=dragPayload?.origin==="palette"?"copy":"move";slot.classList.add("drag-over")};
  slot.ondragleave=()=>slot.classList.remove("drag-over");slot.ondrop=event=>dropAtProgram(event,index);return slot;
}

function makeBlockDropTarget(item,index){
  item.ondragover=event=>{
    if(running||event.target.closest(".repeat-body")||event.target.closest("button"))return;
    const payload=readDrag(event);if(!payload)return;
    event.preventDefault();event.stopPropagation();const bounds=item.getBoundingClientRect(),after=event.clientY>=bounds.top+bounds.height/2;
    item.classList.toggle("drop-before",!after);item.classList.toggle("drop-after",after);event.dataTransfer.dropEffect=payload.origin==="palette"?"copy":"move";
  };
  item.ondragleave=event=>{if(!item.contains(event.relatedTarget))item.classList.remove("drop-before","drop-after")};
  item.ondrop=event=>{if(event.target.closest(".repeat-body"))return;dropAtProgram(event,item.classList.contains("drop-after")?index+1:index)};
}

function nearestProgramIndex(clientY){
  const items=[...programList.querySelectorAll(":scope > .program-item[data-index]")];
  for(const item of items){const bounds=item.getBoundingClientRect();if(clientY<bounds.top+bounds.height/2)return Number(item.dataset.index)}
  return program.length;
}

function renderProgram(){
  programList.innerHTML='<li class="program-item start-block" aria-label="고정된 시작 블록"><span class="start-light"></span><strong>시작</strong><span class="fixed-label">고정</span></li>';
  programList.append(dropSlot(0));
  program.forEach((node,index)=>{
    const li=document.createElement("li");li.dataset.index=index;li.dataset.path=String(index);li.draggable=!running;
    if(node.type==="move"){
      li.className=`program-item move ${node.dir}`;li.innerHTML=moveMarkup(node,index);
    }else{
      li.className=`program-item repeat-block ${openRepeat===node?"open":""}`;
      const body=node.body.map((item,childIndex)=>`<li class="nested-move ${item.dir}" draggable="${!running}" data-parent="${index}" data-child="${childIndex}" data-path="${index}-${childIndex}">${moveMarkup(item,index,childIndex)}</li>`).join("");
      li.innerHTML=`<div class="repeat-head">${repeatIcon}<strong>반복 <span>${node.count}</span>번</strong><span class="repeat-controls"><button data-repeat-minus="${index}" type="button" aria-label="반복 횟수 줄이기">−</button><button data-repeat-plus="${index}" type="button" aria-label="반복 횟수 늘리기">＋</button><button class="program-delete" data-delete="${index}" type="button" aria-label="반복 블록 삭제">×</button></span></div><ol class="repeat-body" data-repeat-drop="${index}">${body||'<li class="repeat-empty"><strong>명령을 여기에 끼우세요</strong><span>방향 블록만 넣을 수 있어요</span></li>'}</ol><div class="repeat-tail"><span>반복 끝</span></div>`;
    }
    li.ondragstart=event=>{if(event.target.closest("button")){event.preventDefault();return}if(event.target.closest(".nested-move"))return;startDrag(event,{origin:"program",index,type:node.type})};
    li.ondragend=endDrag;makeBlockDropTarget(li,index);programList.append(li);programList.append(dropSlot(index+1));
  });

  programList.querySelectorAll(".nested-move").forEach(item=>{
    item.ondragstart=event=>{event.stopPropagation();startDrag(event,{origin:"nested",parent:Number(item.dataset.parent),child:Number(item.dataset.child),type:"move"})};item.ondragend=endDrag;
  });
  programList.querySelectorAll("[data-repeat-drop]").forEach(body=>{
    const node=program[Number(body.dataset.repeatDrop)];body.ondragover=event=>{const payload=readDrag(event);if(payload?.type==="repeat")return;event.preventDefault();event.stopPropagation();body.classList.add("drag-over")};
    body.ondragleave=()=>body.classList.remove("drag-over");body.ondrop=event=>dropInRepeat(event,node);body.onclick=()=>{if(!running){openRepeat=node;renderProgram()}};
  });
  programList.querySelectorAll("[data-delete]").forEach(button=>button.onclick=event=>{
    event.stopPropagation();if(running)return;const[parent,child]=button.dataset.delete.split("-").map(Number);
    if(Number.isInteger(child))program[parent].body.splice(child,1);else{if(openRepeat===program[parent])openRepeat=null;program.splice(parent,1)}renderProgram();
  });
  programList.querySelectorAll("[data-repeat-minus]").forEach(button=>button.onclick=event=>{event.stopPropagation();const node=program[Number(button.dataset.repeatMinus)];node.count=Math.max(2,node.count-1);renderProgram()});
  programList.querySelectorAll("[data-repeat-plus]").forEach(button=>button.onclick=event=>{event.stopPropagation();const node=program[Number(button.dataset.repeatPlus)];node.count=Math.min(6,node.count+1);renderProgram()});
  programList.querySelectorAll(".repeat-head").forEach(head=>head.onclick=()=>{const node=program[Number(head.closest(".repeat-block").dataset.index)];openRepeat=openRepeat===node?null:node;renderProgram()});

  const currentStage=stage(),used=sourceBlockCount(),limit=currentStage?.blockLimit??0,withinLimit=!currentStage||used<=limit,valid=Boolean(currentStage)&&expandProgram().length>0&&!program.some(node=>node.type==="repeat"&&!node.body.length)&&withinLimit;
  el("blockCount").textContent=currentStage?`${used} / ${limit}개`:`${used}개`;el("blockCount").classList.toggle("over-limit",!withinLimit);el("emptyProgram").hidden=program.length>0;
  el("runButton").disabled=!valid||running;el("mobileRunButton").disabled=!valid||running;el("undoButton").disabled=!program.length||running;
  el("repeatButton").classList.remove("active");el("repeatButton").querySelector("b").textContent="반복하기";
  el("limitText").textContent=!currentStage?"미션을 선택해 주세요":withinLimit?`최대 ${limit}개 · 적게 쓸수록 고득점`:`${used-limit}개를 줄여 주세요`;
}

function addMove(dir){if(running||!canAddBlock())return;const move={type:"move",dir};if(openRepeat)openRepeat.body.push(move);else program.push(move);renderProgram();playSound("block")}
function addRepeat(){if(running||!canAddBlock())return;openRepeat={type:"repeat",count:2,body:[]};program.push(openRepeat);renderProgram();playSound("block")}
function setStatus(text,state=""){el("statusText").textContent=text;el("statusText").parentElement.className=`route-status ${state}`}
function blocked(r,c){const current=stage();return r<0||c<0||r>=current.rows||c>=current.cols||current.walls.some(([a,b])=>a===r&&b===c)}

function getAudio(){
  if(!soundOn)return null;const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return null;
  audioContext||=new Audio();if(audioContext.state==="suspended")audioContext.resume().catch(()=>{});return audioContext;
}
function beep(note=520,duration=.08,delay=0,type="sine",volume=.04){
  const ctx=getAudio();if(!ctx||ctx.state!=="running")return;const at=ctx.currentTime+delay,osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=type;osc.frequency.setValueAtTime(note,at);gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(volume,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);osc.connect(gain).connect(ctx.destination);osc.start(at);osc.stop(at+duration+.03);
}
function playSound(name){
  if(name==="block"){beep(260,.055,0,"square",.025);beep(390,.07,.045,"triangle",.03)}
  else if(name==="coin"){beep(720,.1,0,"triangle",.04);beep(960,.12,.08,"triangle",.045);beep(1240,.16,.17,"sine",.04)}
  else if(name==="bomb"){beep(135,.3,0,"sawtooth",.07);beep(78,.42,.09,"square",.055)}
  else if(name==="flag"){[660,830,990,1320].forEach((note,index)=>beep(note,.17,index*.09,"triangle",.045))}
  else if(name==="count"){beep(440,.13,0,"square",.035)}
  else if(name==="go"){beep(660,.12,0,"triangle",.045);beep(990,.24,.1,"triangle",.05)}
}

function setExecuting(path=""){document.querySelectorAll("[data-path].executing").forEach(node=>node.classList.remove("executing"));if(path)programList.querySelector(`[data-path="${path}"]`)?.classList.add("executing")}

function playCellEffect(r,c,type){
  const cell=grid.querySelector(`[data-key="${key(r,c)}"]`);if(!cell)return;
  const effect=document.createElement("span");effect.className=`cell-effect ${type}`;effect.setAttribute("aria-hidden","true");
  effect.innerHTML='<span class="effect-object"></span><span class="effect-core"></span><span class="effect-ring"></span>';
  const particleCount=type==="coin-burst"?10:type==="bomb-burst"?14:16;
  for(let index=0;index<particleCount;index++){
    const particle=document.createElement("i");particle.style.setProperty("--angle",`${index*360/particleCount+(Math.random()*12-6)}deg`);particle.style.setProperty("--distance",`${50+Math.random()*38}px`);particle.style.setProperty("--delay",`${Math.random()*.12}s`);effect.append(particle);
  }
  if(type==="bomb-burst")for(let index=0;index<7;index++){
    const smoke=document.createElement("b");smoke.style.setProperty("--smoke-x",`${-42+(index%4)*28}px`);smoke.style.setProperty("--smoke-y",`${-24-Math.floor(index/4)*26}px`);smoke.style.setProperty("--delay",`${.13+index*.035}s`);effect.append(smoke);
  }
  cell.append(effect);if(type==="bomb-burst")cell.classList.add("detonating");setTimeout(()=>{effect.remove();cell.classList.remove("detonating")},1100);
}

async function showOutcome(state,title,message){
  const banner=el("outcomeBanner");banner.className=`outcome-banner ${state}`;el("outcomeIcon").textContent=state==="success"?"✓":"×";el("outcomeTitle").textContent=title;el("outcomeMessage").textContent=message;banner.hidden=false;
  await sleep(1150);banner.classList.add("leaving");await sleep(220);banner.hidden=true;banner.className="outcome-banner";
}

async function runProgram(){
  const commands=expandProgram();if(running||!commands.length||sourceBlockCount()>stage().blockLimit||program.some(node=>node.type==="repeat"&&!node.body.length))return;
  openRepeat=null;running=true;document.querySelectorAll("button.command").forEach(button=>button.disabled=true);renderProgram();resetPlayer();renderGrid();setStatus("알고리즘 실행 중","running");let crashed=false,failureMessage="깃발까지 도착하지 못했어요.";
  for(const command of commands){
    setExecuting(command.path);const[dr,dc]=vectors[command.dir],nr=player.r+dr,nc=player.c+dc;
    if(blocked(nr,nc)){crashed=true;failureMessage="벽에 막혔어요. 블록 순서를 고쳐보세요!";placePlayer("hit");beep(150,.2);break}
    player.r=nr;player.c=nc;
    const hitBomb=stage().bombs.some(([r,c])=>r===player.r&&c===player.c);
    if(stage().coins.some(([r,c])=>r===player.r&&c===player.c)&&!collected.has(key(player.r,player.c))){collected.add(key(player.r,player.c));grid.querySelector(`[data-key="${key(player.r,player.c)}"]`)?.classList.remove("coin");playCellEffect(player.r,player.c,"coin-burst");playSound("coin");updateStats()}
    placePlayer(hitBomb?"hit":"step");
    if(hitBomb){playCellEffect(player.r,player.c,"bomb-burst");playSound("bomb");await sleep(920);crashed=true;failureMessage="폭탄을 만났어요! 다른 경로를 찾아보세요.";break}
    await sleep(460);
    if(stage().flag[0]===player.r&&stage().flag[1]===player.c){setExecuting();playCellEffect(player.r,player.c,"flag-burst");playSound("flag");await sleep(480);await finishStage();return}
  }
  setExecuting();setStatus(crashed?"블록을 고쳐 다시 실행하세요":"깃발까지 명령이 더 필요해요");await showOutcome("failure","실패",failureMessage);resetPlayer();renderGrid();updateStats();running=false;document.querySelectorAll("button.command").forEach(button=>button.disabled=false);renderProgram();
}

async function finishStage(){
  const elapsed=Math.max(500,Date.now()-startedAt),blocks=sourceBlockCount(),coins=collected.size,stageScore=Math.max(500,Math.round(5000-elapsed/25-blocks*45+coins*700));
  totalScore+=stageScore;totalTime+=elapsed;totalCoins+=coins;updateStats();beep(960,.3);setStatus(`스테이지 성공 · ${stageScore.toLocaleString()}점`);await showOutcome("success","성공!",`${stageScore.toLocaleString()}점을 획득했어요.`);
  if(stageIndex===stages.length-1){running=false;showResult();return}
  stageIndex++;program=[];openRepeat=null;resetPlayer();startedAt=Date.now();running=false;document.querySelectorAll("button.command").forEach(button=>button.disabled=false);renderStage();toast(`${stageIndex+1}단계 시작!`);
}

function renderStage(){el("missionLabel").textContent=missionLabel;el("stageLabel").textContent=`${stageIndex+1} / ${stages.length}`;el("missionTitle").textContent=stage().title;el("missionText").textContent=stage().text;resetPlayer();renderGrid();renderProgram();setStatus("블록을 조립하세요");updateStats()}
function updateStats(){el("coinLabel").textContent=totalCoins+collected.size;el("scoreLabel").textContent=totalScore.toLocaleString()}
function updateTimer(){if(!el("resultScreen").hidden)return;const seconds=Math.floor((Date.now()-startedAt)/1000);el("timeLabel").textContent=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`}
function toast(message){el("toast").textContent=message;el("toast").classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el("toast").classList.remove("show"),2200)}
async function playCountdown(){
  const screen=el("countdownScreen"),number=el("countdownNumber");
  await sleep(180);
  for(const value of [3,2,1]){number.className="";number.textContent=value;void number.offsetWidth;playSound("count");await sleep(780)}
  number.className="go";number.textContent="시작!";void number.offsetWidth;playSound("go");await sleep(650);
}
function showResult(){clearInterval(timerId);el("resultStamp").textContent=`${missionLabel} · 3개 단계 완료`;el("finalScore").textContent=totalScore.toLocaleString();el("finalCoins").textContent=totalCoins;const sec=Math.floor(totalTime/1000);el("finalTime").textContent=`${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;el("resultScreen").hidden=false;el("playAgainButton").focus()}

document.querySelectorAll("[data-move]").forEach(button=>{
  button.onclick=()=>addMove(button.dataset.move);button.ondragstart=event=>startDrag(event,{origin:"palette",type:"move",dir:button.dataset.move});button.ondragend=endDrag;
});
el("repeatButton").onclick=addRepeat;el("repeatButton").ondragstart=event=>startDrag(event,{origin:"palette",type:"repeat"});el("repeatButton").ondragend=endDrag;
el("undoButton").onclick=()=>{if(openRepeat?.body.length)openRepeat.body.pop();else if(program.length){if(openRepeat===program.at(-1))openRepeat=null;program.pop()}renderProgram()};
el("clearButton").onclick=()=>{if(!running){program=[];openRepeat=null;renderProgram()}};el("runButton").onclick=runProgram;el("mobileRunButton").onclick=runProgram;
el("soundToggle").onclick=()=>{soundOn=!soundOn;el("soundToggle").setAttribute("aria-pressed",String(soundOn));el("soundToggle").textContent=soundOn?"소리 켬":"소리 끔"};
document.addEventListener("pointerdown",()=>getAudio(),{capture:true});
document.addEventListener("dragend",endDrag);
codingCanvas.ondragover=event=>{if(running||!readDrag(event))return;event.preventDefault();event.dataTransfer.dropEffect=dragPayload?.origin==="palette"?"copy":"move";codingCanvas.classList.add("canvas-drop-ready")};
codingCanvas.ondragleave=event=>{if(!codingCanvas.contains(event.relatedTarget))codingCanvas.classList.remove("canvas-drop-ready")};
codingCanvas.ondrop=event=>{if(running)return endDrag();dropAtProgram(event,nearestProgramIndex(event.clientY))};

el("playAgainButton").onclick=()=>window.location.reload();

async function startMission(mission,button){
  const select=el("missionSelect"),status=el("missionSelectStatus");document.querySelectorAll("[data-mission]").forEach(item=>item.disabled=true);button.classList.add("selected");status.textContent="미션을 시작할게요!";
  if(!loadMission(mission)){status.textContent="미션을 다시 선택해 주세요.";document.querySelectorAll("[data-mission]").forEach(item=>item.disabled=false);button.classList.remove("selected");return}
  const countdownScreen=el("countdownScreen");select.hidden=true;countdownScreen.hidden=false;await playCountdown();running=false;renderStage();countdownScreen.classList.add("leaving");await sleep(380);countdownScreen.hidden=true;countdownScreen.classList.remove("leaving");startedAt=Date.now();timerId=setInterval(updateTimer,250);
}

document.querySelectorAll("[data-mission]").forEach(button=>button.onclick=()=>startMission(button.dataset.mission,button));
renderProgram();
