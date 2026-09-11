import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { Redis } from "@upstash/redis";
import { createStageSet } from "./stage-catalog.mjs";

const root=fileURLToPath(new URL("./public",import.meta.url));
const scoreFile=fileURLToPath(new URL("./data/scores.json",import.meta.url));
const port=Number(process.env.PORT||4173);
const redisUrl=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL;
const redisToken=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN;
const redis=redisUrl&&redisToken?new Redis({url:redisUrl,token:redisToken,automaticDeserialization:false}):null;
const runs=new Map(),adminSessions=new Map();
const adminPassword=process.env.ADMIN_PASSWORD||"0912";
const scoreKey="block-escape:scores",scoreMemberKey="block-escape:score-members",scoreInitKey="block-escape:scores-initialized";
const types={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp"};
const send=(res,status,body,type="application/json; charset=utf-8",headers={})=>{res.writeHead(status,{"content-type":type,"cache-control":"no-store",...headers});res.end(typeof body==="string"?body:JSON.stringify(body))};

async function readLocalScores(){try{const value=JSON.parse(await readFile(scoreFile,"utf8"));return Array.isArray(value)?value:[]}catch{return[]}}
const rankValue=score=>Number(score.score||0)*1_000_000_000+(999_999_999-Math.min(999_999_999,Number(score.timeMs||0)));
async function ensureRemoteScores(){
  if(!redis||await redis.get(scoreInitKey))return;
  for(const score of await readLocalScores()){const payload=JSON.stringify(score);await redis.zadd(scoreKey,{score:rankValue(score),member:payload});await redis.hset(scoreMemberKey,{[score.id]:payload})}
  await redis.set(scoreInitKey,"1");
}
async function readScores(){if(!redis)return readLocalScores();await ensureRemoteScores();const values=await redis.zrange(scoreKey,0,99,{rev:true});return values.map(value=>typeof value==="string"?JSON.parse(value):value)}
async function addScore(entry){
  if(!redis){const all=await readLocalScores();all.push(entry);all.sort((a,b)=>b.score-a.score||a.timeMs-b.timeMs);await writeFile(scoreFile,JSON.stringify(all.slice(0,100),null,2)+"\n");return all.findIndex(item=>item.id===entry.id)+1}
  await ensureRemoteScores();const previous=await redis.hget(scoreMemberKey,entry.id),payload=JSON.stringify(entry);if(previous)await redis.zrem(scoreKey,previous);await redis.zadd(scoreKey,{score:rankValue(entry),member:payload});await redis.hset(scoreMemberKey,{[entry.id]:payload});return(await readScores()).findIndex(item=>item.id===entry.id)+1;
}
async function deleteScore(id){
  if(!redis){const scores=await readLocalScores(),next=scores.filter(score=>score.id!==id);if(next.length===scores.length)return false;await writeFile(scoreFile,JSON.stringify(next,null,2)+"\n");return true}
  await ensureRemoteScores();const member=await redis.hget(scoreMemberKey,id);if(!member)return false;await redis.zrem(scoreKey,member);await redis.hdel(scoreMemberKey,id);return true;
}
async function clearScores(){if(redis){await ensureRemoteScores();await redis.del(scoreKey,scoreMemberKey)}else await writeFile(scoreFile,"[]\n")}
async function bodyJson(req){let raw="";for await(const chunk of req){raw+=chunk;if(raw.length>10000)throw new Error("too-large")}return JSON.parse(raw||"{}")}
function cleanupRuns(){const cutoff=Date.now()-3*60*60*1000;for(const[id,run]of runs)if(run.createdAt<cutoff)runs.delete(id)}
async function getRun(id){if(redis){const value=await redis.get(`block-escape:run:${id}`);return value?JSON.parse(value):null}return runs.get(id)}
async function setRun(id,run){if(redis)await redis.set(`block-escape:run:${id}`,JSON.stringify(run),{ex:3*60*60});else runs.set(id,run)}
function adminToken(req){const cookie=String(req.headers.cookie||"").split(";").map(value=>value.trim()).find(value=>value.startsWith("block_admin="));return cookie?.slice("block_admin=".length)||""}
async function isAdmin(req){
  const token=adminToken(req);if(!token)return false;if(redis)return Boolean(await redis.get(`block-escape:admin:${token}`));
  const now=Date.now();for(const[value,expiresAt]of adminSessions)if(expiresAt<=now)adminSessions.delete(value);return Boolean(adminSessions.get(token)>now);
}
async function requireAdmin(req,res){if(await isAdmin(req))return true;send(res,401,{error:"관리자 로그인이 필요합니다."});return false}

function decodeProgram(nodes,limit){
  if(!Array.isArray(nodes)||!nodes.length||!Number.isInteger(limit))return null;
  const commands=[];let blocks=0;
  for(const node of nodes){
    if(node?.type==="move"&&["up","down","left","right"].includes(node.dir)){blocks++;commands.push(node.dir)}
    else if(node?.type==="repeat"&&Number.isInteger(node.count)&&node.count>=2&&node.count<=6&&Array.isArray(node.body)&&node.body.length){blocks++;const body=[];for(const child of node.body){if(child?.type!=="move"||!["up","down","left","right"].includes(child.dir))return null;blocks++;body.push(child.dir)}for(let count=0;count<node.count;count++)commands.push(...body)}
    else return null;
    if(blocks>limit||commands.length>120)return null;
  }
  return{commands,blocks};
}

function verifyStage(maps,stage,program){
  const map=maps?.[stage],decoded=decodeProgram(program,map?.limit);if(!map||!decoded)return null;
  let[r,c]=map.start;const collected=new Set(),at=(list,row,col)=>list.some(([a,b])=>a===row&&b===col),vectors={up:[-1,0],down:[1,0],left:[0,-1],right:[0,1]};
  for(const command of decoded.commands){const[dr,dc]=vectors[command],nr=r+dr,nc=c+dc;if(nr<0||nc<0||nr>=map.rows||nc>=map.cols||at(map.walls,nr,nc)||at(map.bombs,nr,nc))return null;r=nr;c=nc;if(at(map.coins,r,c))collected.add(`${r},${c}`);if(r===map.flag[0]&&c===map.flag[1])return{coins:collected.size,blocks:decoded.blocks}}
  return null;
}

export async function handler(req,res){
  const url=new URL(req.url,`http://${req.headers.host||"localhost"}`);
  if(url.pathname==="/api/admin/login"&&req.method==="POST"){
    try{const input=await bodyJson(req);if(String(input.password||"")!==adminPassword)return send(res,401,{error:"비밀번호가 맞지 않습니다."});const token=crypto.randomUUID(),maxAge=4*60*60;if(redis)await redis.set(`block-escape:admin:${token}`,"1",{ex:maxAge});else adminSessions.set(token,Date.now()+maxAge*1000);return send(res,200,{ok:true},undefined,{"set-cookie":`block_admin=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`})}catch{return send(res,400,{error:"로그인 요청을 확인하지 못했습니다."})}
  }
  if(url.pathname==="/api/admin/logout"&&req.method==="POST"){const token=adminToken(req);if(redis&&token)await redis.del(`block-escape:admin:${token}`);else adminSessions.delete(token);return send(res,200,{ok:true},undefined,{"set-cookie":"block_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"})}
  if(url.pathname==="/api/admin/scores"&&req.method==="GET"){if(!await requireAdmin(req,res))return;return send(res,200,await readScores())}
  if(url.pathname==="/api/admin/scores"&&req.method==="DELETE"){if(!await requireAdmin(req,res))return;await clearScores();return send(res,200,{ok:true,deleted:"all"})}
  const adminScoreMatch=url.pathname.match(/^\/api\/admin\/scores\/([a-f0-9-]+)$/);
  if(adminScoreMatch&&req.method==="DELETE"){if(!await requireAdmin(req,res))return;if(!await deleteScore(adminScoreMatch[1]))return send(res,404,{error:"해당 기록을 찾지 못했습니다."});return send(res,200,{ok:true,deleted:adminScoreMatch[1]})}
  if(url.pathname==="/api/runs"&&req.method==="POST"){cleanupRuns();const id=crypto.randomUUID(),stages=createStageSet(id);await setRun(id,{createdAt:Date.now(),stageStartedAt:Date.now(),nextStage:0,score:0,timeMs:0,coins:0,complete:false,stages});return send(res,201,{runId:id,stages})}
  const stageMatch=url.pathname.match(/^\/api\/runs\/([a-f0-9-]+)\/stage$/);
  if(stageMatch&&req.method==="POST"){
    try{const run=await getRun(stageMatch[1]),input=await bodyJson(req),stage=Math.round(Number(input.stage)),proof=verifyStage(run?.stages,stage,input.program);if(!run||run.complete||stage!==run.nextStage||!proof)return send(res,400,{error:"실제로 깃발에 도착한 명령이 필요해요."});const{coins,blocks}=proof,now=Date.now(),elapsed=Math.max(500,now-run.stageStartedAt),stageScore=Math.max(500,Math.round(5000-elapsed/25-blocks*45+coins*700));run.score+=stageScore;run.timeMs+=elapsed;run.coins+=coins;run.nextStage++;run.stageStartedAt=now;run.complete=run.nextStage===run.stages.length;await setRun(stageMatch[1],run);return send(res,200,{stageScore,score:run.score,timeMs:run.timeMs,coins:run.coins,complete:run.complete})}catch{return send(res,400,{error:"스테이지 결과를 확인하지 못했어요."})}
  }
  if(url.pathname==="/api/scores"&&req.method==="GET")return send(res,200,(await readScores()).slice(0,20));
  if(url.pathname==="/api/scores"&&req.method==="POST"){
    try{const input=await bodyJson(req),name=String(input.name||"").trim().replace(/[<>]/g,"").slice(0,12),runId=String(input.runId||""),run=await getRun(runId);if(!name||!run?.complete||run.submitted)return send(res,400,{error:"완료된 경기 기록이 필요해요."});run.submitted=true;await setRun(runId,run);const entry={id:runId,name,score:run.score,timeMs:run.timeMs,coins:run.coins,createdAt:new Date().toISOString()},rank=await addScore(entry);return send(res,201,{ok:true,rank})}catch{return send(res,400,{error:"점수를 저장하지 못했어요. 다시 시도해 주세요."})}
  }
  if(req.method!=="GET")return send(res,405,{error:"지원하지 않는 요청입니다."});
  const requestPath=url.pathname==="/"?"/index.html":url.pathname,filePath=normalize(join(root,requestPath));if(!filePath.startsWith(root))return send(res,403,"Forbidden","text/plain");
  try{const data=await readFile(filePath);res.writeHead(200,{"content-type":types[extname(filePath)]||"application/octet-stream"});res.end(data)}catch{send(res,404,"Not found","text/plain; charset=utf-8")}
}

if(!process.env.VERCEL)createServer(handler).listen(port,"0.0.0.0",()=>console.log(`블록 탈출 대회: http://localhost:${port}`));
export default handler;
