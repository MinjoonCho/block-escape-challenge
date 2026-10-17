import { stages } from "./stages.js";

const fullscreenButton=document.getElementById("fullscreenToggle");
const fullscreenLabel=document.getElementById("fullscreenLabel");
const fullscreenElement=()=>document.fullscreenElement||document.webkitFullscreenElement;
const requestFullscreen=document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen;
const exitFullscreen=document.exitFullscreen||document.webkitExitFullscreen;

function syncFullscreenButton(){
  if(!fullscreenButton)return;
  const active=Boolean(fullscreenElement());
  fullscreenButton.setAttribute("aria-pressed",String(active));
  fullscreenButton.setAttribute("aria-label",active?"전체화면 종료":"전체화면으로 보기");
  if(fullscreenLabel)fullscreenLabel.textContent=active?"전체화면 종료":"전체화면";
}

if(fullscreenButton){
  if(!requestFullscreen||!exitFullscreen)fullscreenButton.hidden=true;
  else{
    fullscreenButton.addEventListener("click",async()=>{
      try{
        if(fullscreenElement())await exitFullscreen.call(document);
        else await requestFullscreen.call(document.documentElement);
      }catch{fullscreenButton.hidden=true}
    });
    document.addEventListener("fullscreenchange",syncFullscreenButton);
    document.addEventListener("webkitfullscreenchange",syncFullscreenButton);
    syncFullscreenButton();
  }
}

const key=(r,c)=>`${r},${c}`;
const previews=document.getElementById("stagePreviews");

if(previews)stages.forEach((stage,index)=>{
  const item=document.createElement("li");
  item.className="stage-ticket";
  const board=document.createElement("div");
  board.className="mini-grid";
  board.style.setProperty("--cols",stage.cols);
  board.setAttribute("aria-label",`${index+1}단계 지도 미리보기`);
  const walls=new Set(stage.walls.map(([r,c])=>key(r,c)));
  const bombs=new Set(stage.bombs.map(([r,c])=>key(r,c)));
  const coins=new Set(stage.coins.map(([r,c])=>key(r,c)));
  for(let r=0;r<stage.rows;r++)for(let c=0;c<stage.cols;c++){
    const cell=document.createElement("span"),position=key(r,c);
    cell.className="mini-cell";
    if(walls.has(position))cell.classList.add("wall");
    if(bombs.has(position))cell.classList.add("bomb");
    if(coins.has(position))cell.classList.add("coin");
    if(stage.flag[0]===r&&stage.flag[1]===c)cell.classList.add("flag");
    if(stage.start[0]===r&&stage.start[1]===c)cell.classList.add("start");
    board.append(cell);
  }
  item.innerHTML=`<div class="ticket-label"><span>${index+1}</span><strong>${stage.title}</strong><small>최소 ${stage.idealBlocks}블록 도전</small></div>`;
  item.append(board);previews.append(item);
});
