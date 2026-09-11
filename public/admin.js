const loginPanel=document.getElementById("loginPanel");
const adminPanel=document.getElementById("adminPanel");
const loginForm=document.getElementById("loginForm");
const passwordInput=document.getElementById("adminPassword");
const loginMessage=document.getElementById("loginMessage");
const statusMessage=document.getElementById("statusMessage");
const scoreRows=document.getElementById("scoreRows");
const scoreCount=document.getElementById("scoreCount");
const emptyMessage=document.getElementById("emptyMessage");
const deleteAllButton=document.getElementById("deleteAllButton");

function formatTime(ms){const seconds=Math.max(0,Math.round(Number(ms||0)/1000));return `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`}
function formatDate(value){const date=new Date(value);return Number.isNaN(date.getTime())?"-":new Intl.DateTimeFormat("ko-KR",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).format(date)}
function showLogin(message=""){loginPanel.hidden=false;adminPanel.hidden=true;loginMessage.textContent=message;passwordInput.value="";passwordInput.focus()}
function showAdmin(){loginPanel.hidden=true;adminPanel.hidden=false}

async function request(url,options={}){
  const response=await fetch(url,{...options,headers:{"content-type":"application/json",...(options.headers||{})}}),data=await response.json().catch(()=>({}));
  if(response.status===401){showLogin(data.error||"관리자 로그인이 필요합니다.");throw new Error("unauthorized")}
  if(!response.ok)throw new Error(data.error||"요청을 처리하지 못했습니다.");return data;
}

function renderScores(scores){
  scoreRows.replaceChildren();scoreCount.textContent=`${scores.length}명`;emptyMessage.hidden=scores.length>0;deleteAllButton.disabled=!scores.length;
  scores.forEach((score,index)=>{
    const row=document.createElement("tr"),values=[`${index+1}위`,score.name,`${Number(score.score||0).toLocaleString()}점`,`${Number(score.coins||0)}개`,formatTime(score.timeMs),formatDate(score.createdAt)];
    values.forEach(value=>{const cell=document.createElement("td");cell.textContent=value;row.append(cell)});
    const action=document.createElement("td"),button=document.createElement("button");button.type="button";button.className="delete-button";button.textContent="삭제";button.setAttribute("aria-label",`${score.name} 기록 삭제`);button.addEventListener("click",()=>deleteScore(score));action.append(button);row.append(action);scoreRows.append(row);
  });
}

async function loadScores(initial=false){try{const scores=await request("/api/admin/scores");showAdmin();renderScores(scores)}catch(error){if(error.message==="unauthorized"&&initial)loginMessage.textContent="";else if(error.message!=="unauthorized")statusMessage.textContent=error.message}}
async function deleteScore(score){if(!confirm(`${score.name}의 ${Number(score.score||0).toLocaleString()}점 기록을 삭제할까요?`))return;try{await request(`/api/admin/scores/${score.id}`,{method:"DELETE"});statusMessage.textContent="기록을 삭제했습니다.";await loadScores()}catch(error){if(error.message!=="unauthorized")statusMessage.textContent=error.message}}

loginForm.addEventListener("submit",async event=>{event.preventDefault();loginMessage.textContent="";try{await request("/api/admin/login",{method:"POST",body:JSON.stringify({password:passwordInput.value})});statusMessage.textContent="";await loadScores()}catch(error){if(error.message!=="unauthorized")loginMessage.textContent=error.message}});
document.getElementById("logoutButton").addEventListener("click",async()=>{try{await request("/api/admin/logout",{method:"POST"})}catch{}showLogin()});
deleteAllButton.addEventListener("click",async()=>{if(!confirm("순위표의 모든 기록을 삭제할까요? 이 작업은 되돌릴 수 없습니다."))return;try{await request("/api/admin/scores",{method:"DELETE"});statusMessage.textContent="전체 기록을 삭제했습니다.";await loadScores()}catch(error){if(error.message!=="unauthorized")statusMessage.textContent=error.message}});

loadScores(true);
