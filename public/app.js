import { stages } from "./stages.js";

const labels={up:"위로",down:"아래로",left:"왼쪽으로",right:"오른쪽으로"};
const vectors={up:[-1,0],down:[1,0],left:[0,-1],right:[0,1]};
const el=id=>document.getElementById(id);
const grid=el("gameGrid"),programList=el("programList");
const key=(r,c)=>`${r},${c}`;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

let stageIndex=0,program=[],openRepeat=null,player={r:0,c:0},collected=new Set();
let running=false,startedAt=Date.now(),totalScore=0,totalTime=0,totalCoins=0,timerId,soundOn=true,runId="",dragPayload=null;

const runReady=fetch("/api/runs",{method:"POST"}).then(response=>response.json()).then(result=>{runId=result.runId;return runId});
const stage=()=>stages[stageIndex];
const sourceBlockCount=(nodes=program)=>nodes.reduce((sum,node)=>sum+1+(node.type==="repeat"?node.body.length:0),0);

function expandProgram(){
  const result=[];
  program.forEach((node,index)=>{
    if(node.type==="move")result.push({dir:node.dir,path:String(index)});
    else for(let count=0;count<node.count;count++)node.body.forEach((child,childIndex)=>result.push({dir:child.dir,path:`${index}-${childIndex}`}));
  });
  return result;
}

function canAdd(amount=1){
  if(sourceBlockCount()+amount<=stage().limit)return true;
  toast(`이 스테이지는 블록을 ${stage().limit}개까지만 쓸 수 있어요.`);return false;
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
  placePlayer();
}

function placePlayer(className=""){
  document.querySelector(".player")?.remove();const cell=grid.querySelector(`[data-key="${key(player.r,player.c)}"]`);if(!cell)return;
  const img=document.createElement("img");img.className=`player ${className}`;img.src="/assets/gmeta-run.webp";img.alt="지메타 캐릭터";cell.append(img);
}

function moveMarkup(node,parentIndex,childIndex=null){
  const target=childIndex===null?String(parentIndex):`${parentIndex}-${childIndex}`,number=childIndex===null?parentIndex+1:childIndex+1;
  return `<span class="program-index">${number}</span><strong>${labels[node.dir]}</strong><span class="drag-grip" aria-hidden="true"><i></i><i></i><i></i></span><button class="program-delete" data-delete="${target}" type="button" aria-label="${labels[node.dir]} 블록 삭제">×</button>`;
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

function endDrag(){dragPayload=null;document.body.classList.remove("is-dragging");document.querySelectorAll(".drag-over").forEach(node=>node.classList.remove("drag-over"))}

function takeMove(payload){
  if(!payload)return null;
  if(payload.origin==="palette")return payload.type==="move"&&canAdd()?{type:"move",dir:payload.dir}:null;
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
  let node;
  if(payload.origin==="palette"){
    if(!canAdd())return endDrag();node=payload.type==="repeat"?{type:"repeat",count:2,body:[]}:{type:"move",dir:payload.dir};
  }else if(payload.origin==="program"){
    node=program[payload.index];if(!node)return endDrag();program.splice(payload.index,1);if(payload.index<insertIndex)insertIndex--;
  }else node=takeMove(payload);
  if(!node)return endDrag();program.splice(Math.max(0,insertIndex),0,node);openRepeat=node.type==="repeat"?node:null;endDrag();renderProgram();
}

function dropInRepeat(event,target){
  event.preventDefault();event.stopPropagation();const payload=readDrag(event);if(!payload||payload.type==="repeat"||(payload.origin==="program"&&program[payload.index]?.type==="repeat"))return endDrag();
  const node=takeMove(payload);if(!node)return endDrag();target.body.push(node);openRepeat=target;endDrag();renderProgram();
}

function dropSlot(index){
  const slot=document.createElement("li");slot.className="program-drop";slot.dataset.dropIndex=index;slot.innerHTML="<span>여기에 놓기</span>";
  slot.ondragover=event=>{event.preventDefault();event.dataTransfer.dropEffect=dragPayload?.origin==="palette"?"copy":"move";slot.classList.add("drag-over")};
  slot.ondragleave=()=>slot.classList.remove("drag-over");slot.ondrop=event=>dropAtProgram(event,index);return slot;
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
      li.innerHTML=`<div class="repeat-head"><span class="repeat-symbol" aria-hidden="true"></span><strong>반복 <span>${node.count}</span>번</strong><span class="repeat-controls"><button data-repeat-minus="${index}" type="button" aria-label="반복 횟수 줄이기">−</button><button data-repeat-plus="${index}" type="button" aria-label="반복 횟수 늘리기">＋</button><button class="program-delete" data-delete="${index}" type="button" aria-label="반복 블록 삭제">×</button></span></div><ol class="repeat-body" data-repeat-drop="${index}">${body||'<li class="repeat-empty"><strong>명령을 여기에 끼우세요</strong><span>방향 블록만 넣을 수 있어요</span></li>'}</ol><div class="repeat-tail"><span>반복 끝</span></div>`;
    }
    li.ondragstart=event=>{if(event.target.closest("button")){event.preventDefault();return}if(event.target.closest(".nested-move"))return;startDrag(event,{origin:"program",index,type:node.type})};
    li.ondragend=endDrag;programList.append(li);programList.append(dropSlot(index+1));
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

  const used=sourceBlockCount(),valid=expandProgram().length>0&&!program.some(node=>node.type==="repeat"&&!node.body.length);
  el("blockCount").textContent=`${used} / ${stage().limit}`;el("emptyProgram").hidden=program.length>0;
  el("runButton").disabled=!valid||running;el("undoButton").disabled=!program.length||running;
  el("repeatButton").classList.toggle("active",Boolean(openRepeat));el("repeatButton").querySelector("b").textContent=openRepeat?"반복 닫기":"반복하기";
  el("limitText").textContent=`제한 ${stage().limit}개 · 시작 제외`;
}

function addMove(dir){if(running||!canAdd())return;const move={type:"move",dir};if(openRepeat)openRepeat.body.push(move);else program.push(move);renderProgram()}
function toggleRepeat(){if(running)return;if(openRepeat)openRepeat=null;else{if(!canAdd())return;openRepeat={type:"repeat",count:2,body:[]};program.push(openRepeat)}renderProgram()}
function setStatus(text,state=""){el("statusText").textContent=text;el("statusText").parentElement.className=`route-status ${state}`}
function blocked(r,c){const current=stage();return r<0||c<0||r>=current.rows||c>=current.cols||current.walls.some(([a,b])=>a===r&&b===c)}

function beep(note=520,duration=.08){
  if(!soundOn)return;const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
  const ctx=new Audio(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.frequency.value=note;gain.gain.setValueAtTime(.035,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration);
}

function setExecuting(path=""){document.querySelectorAll("[data-path].executing").forEach(node=>node.classList.remove("executing"));if(path)programList.querySelector(`[data-path="${path}"]`)?.classList.add("executing")}

async function runProgram(){
  const commands=expandProgram();if(running||!commands.length||program.some(node=>node.type==="repeat"&&!node.body.length))return;
  openRepeat=null;running=true;document.querySelectorAll("button.command").forEach(button=>button.disabled=true);renderProgram();resetPlayer();renderGrid();setStatus("알고리즘 실행 중","running");let crashed=false;
  for(const command of commands){
    setExecuting(command.path);const[dr,dc]=vectors[command.dir],nr=player.r+dr,nc=player.c+dc;
    if(blocked(nr,nc)){crashed=true;placePlayer("hit");beep(150,.2);toast("벽에 막혔어요. 블록 순서를 고쳐보세요!");break}
    player.r=nr;player.c=nc;
    if(stage().bombs.some(([r,c])=>r===player.r&&c===player.c)){crashed=true;placePlayer("hit");beep(120,.25);toast("폭탄을 만났어요! 다른 블록 순서를 찾아보세요.");break}
    if(stage().coins.some(([r,c])=>r===player.r&&c===player.c)&&!collected.has(key(player.r,player.c))){collected.add(key(player.r,player.c));beep(760);updateStats()}
    renderGrid();placePlayer("step");await sleep(340);if(stage().flag[0]===player.r&&stage().flag[1]===player.c){setExecuting();await finishStage();return}
  }
  setExecuting();running=false;document.querySelectorAll("button.command").forEach(button=>button.disabled=false);renderProgram();setStatus(crashed?"블록을 고쳐 다시 실행하세요":"깃발까지 명령이 더 필요해요");
}

async function finishStage(){
  try{
    const id=await runReady,response=await fetch(`/api/runs/${id}/stage`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({stage:stageIndex,program})}),result=await response.json();if(!response.ok)throw new Error(result.error);
    totalScore=result.score;totalTime=result.timeMs;totalCoins=result.coins;updateStats();beep(960,.3);setStatus(`스테이지 성공 · ${result.stageScore.toLocaleString()}점`);await sleep(700);
    if(result.complete){running=false;showResult();return}
    stageIndex++;program=[];openRepeat=null;resetPlayer();startedAt=Date.now();running=false;document.querySelectorAll("button.command").forEach(button=>button.disabled=false);renderStage();toast(`${stageIndex+1}단계 시작!`);
  }catch(error){running=false;document.querySelectorAll("button.command").forEach(button=>button.disabled=false);renderProgram();setStatus("기록 서버를 확인해 주세요");toast(error.message||"경기 기록을 저장하지 못했어요.")}
}

function renderStage(){el("stageLabel").textContent=`${stageIndex+1} / ${stages.length}`;el("missionTitle").textContent=stage().title;el("missionText").textContent=stage().text;resetPlayer();renderGrid();renderProgram();setStatus("블록을 조립하세요");updateStats()}
function updateStats(){el("coinLabel").textContent=totalCoins+collected.size;el("scoreLabel").textContent=totalScore.toLocaleString()}
function updateTimer(){if(!el("resultScreen").hidden)return;const seconds=Math.floor((Date.now()-startedAt)/1000);el("timeLabel").textContent=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`}
function toast(message){el("toast").textContent=message;el("toast").classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el("toast").classList.remove("show"),2200)}
function showResult(){clearInterval(timerId);el("finalScore").textContent=totalScore.toLocaleString();el("finalCoins").textContent=totalCoins;const sec=Math.floor(totalTime/1000);el("finalTime").textContent=`${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;el("resultScreen").hidden=false;el("playerName").focus()}
const escapeHtml=value=>String(value).replace(/[&<>"']/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character]));
async function loadScores(){const list=el("leaderList");list.innerHTML='<li class="leader-empty">순위를 불러오는 중...</li>';try{const data=await fetch("/api/scores").then(response=>response.json());list.innerHTML=data.length?data.map((score,index)=>`<li class="leader-row"><span class="leader-rank">${index+1}</span><span><strong>${escapeHtml(score.name)}</strong><small class="leader-meta">코인 ${score.coins}개 · ${Math.round(score.timeMs/1000)}초</small></span><span class="leader-score">${score.score.toLocaleString()}점</span></li>`).join(""):'<li class="leader-empty">첫 번째 기록의 주인공이 되어보세요!</li>'}catch{list.innerHTML='<li class="leader-empty">순위를 불러오지 못했어요.<br>잠시 후 다시 열어주세요.</li>'}}

document.querySelectorAll("[data-move]").forEach(button=>{
  button.onclick=()=>addMove(button.dataset.move);button.ondragstart=event=>startDrag(event,{origin:"palette",type:"move",dir:button.dataset.move});button.ondragend=endDrag;
});
el("repeatButton").onclick=toggleRepeat;el("repeatButton").ondragstart=event=>startDrag(event,{origin:"palette",type:"repeat"});el("repeatButton").ondragend=endDrag;
el("undoButton").onclick=()=>{if(openRepeat?.body.length)openRepeat.body.pop();else if(program.length){if(openRepeat===program.at(-1))openRepeat=null;program.pop()}renderProgram()};
el("clearButton").onclick=()=>{if(!running){program=[];openRepeat=null;renderProgram()}};el("runButton").onclick=runProgram;
el("leaderButton").onclick=()=>{el("leaderboard").hidden=false;loadScores()};el("closeLeader").onclick=()=>el("leaderboard").hidden=true;
el("soundToggle").onclick=()=>{soundOn=!soundOn;el("soundToggle").setAttribute("aria-pressed",String(soundOn));el("soundToggle").textContent=soundOn?"소리 켬":"소리 끔"};
document.addEventListener("dragend",endDrag);

el("scoreForm").onsubmit=async event=>{event.preventDefault();const button=event.submitter;button.disabled=true;el("formMessage").textContent="점수를 등록하고 있어요...";try{const response=await fetch("/api/scores",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:el("playerName").value,runId})}),result=await response.json();if(!response.ok)throw new Error(result.error);el("formMessage").textContent=`등록 완료! 현재 ${result.rank}위예요.`;button.textContent="등록 완료";setTimeout(()=>{el("resultScreen").hidden=true;el("leaderboard").hidden=false;loadScores()},900)}catch(error){el("formMessage").textContent=error.message||"등록하지 못했어요. 다시 시도해 주세요.";button.disabled=false}};

renderStage();timerId=setInterval(updateTimer,250);
