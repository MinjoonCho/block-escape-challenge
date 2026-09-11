import { stages } from "./stages.js";

const key=(r,c)=>`${r},${c}`;
const previews=document.getElementById("stagePreviews");

stages.forEach((stage,index)=>{
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
  item.innerHTML=`<div class="ticket-label"><span>${index+1}</span><strong>${stage.title}</strong><small>최대 ${stage.limit}블록</small></div>`;
  item.append(board);previews.append(item);
});
