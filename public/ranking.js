const cards=[...document.querySelectorAll(".winner")];
const confetti=document.querySelector(".confetti");
const revealOrder=[3,2,1];
let revealIndex=0;

function formatTime(ms){
  const seconds=Math.max(0,Math.round(Number(ms||0)/1000));
  return `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
}

function fillCard(card,score){
  card.querySelector(".winner-name").textContent=score?.name||"기록 없음";
  card.querySelector(".winner-score").textContent=score?`${score.missionLabel||"전체 미션"} · ${Number(score.score).toLocaleString()}점 · ${formatTime(score.timeMs)}`:"-";
}

function celebrate(rank){
  confetti.innerHTML="";
  const colors=["#f7c948","#ed6972","#55b4ca","#fffdf7"];
  const count=rank===1?80:34;
  for(let index=0;index<count;index++){
    const piece=document.createElement("i");
    piece.style.setProperty("--x",`${Math.random()*100}vw`);piece.style.setProperty("--delay",`${Math.random()*.35}s`);piece.style.setProperty("--fall",`${1.3+Math.random()*1.4}s`);piece.style.setProperty("--spin",`${Math.random()*540+180}deg`);piece.style.background=colors[index%colors.length];confetti.append(piece);
  }
}

function revealNext(){
  if(revealIndex>=revealOrder.length)return;
  const rank=revealOrder[revealIndex++],card=document.querySelector(`[data-rank="${rank}"]`);
  card.classList.add("revealed");card.setAttribute("aria-hidden","false");document.body.dataset.revealed=String(revealIndex);celebrate(rank);
}

document.addEventListener("keydown",event=>{
  if(event.code!=="Space"||event.repeat)return;
  event.preventDefault();revealNext();
});

try{
  const response=await fetch("/api/scores");if(!response.ok)throw new Error();
  const scores=await response.json();cards.forEach(card=>fillCard(card,scores[Number(card.dataset.rank)-1]));
}catch{
  cards.forEach(card=>fillCard(card,null));
}
