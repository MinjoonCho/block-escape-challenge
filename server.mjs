import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createMissionStageSet, missionCatalog } from "./stage-catalog.mjs";

const root=fileURLToPath(new URL("./public",import.meta.url));
const port=Number(process.env.PORT||4173);
const types={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp"};
const send=(res,status,body,type="application/json; charset=utf-8",headers={})=>{res.writeHead(status,{"content-type":type,"cache-control":"no-store",...headers});res.end(typeof body==="string"?body:JSON.stringify(body))};

async function bodyJson(req){let raw="";for await(const chunk of req){raw+=chunk;if(raw.length>10000)throw new Error("too-large")}return JSON.parse(raw||"{}")}

function decodeProgram(nodes){
  if(!Array.isArray(nodes)||!nodes.length)return null;
  const commands=[];let blocks=0;
  for(const node of nodes){
    if(node?.type==="move"&&["up","down","left","right"].includes(node.dir)){blocks++;commands.push(node.dir)}
    else if(node?.type==="repeat"&&Number.isInteger(node.count)&&node.count>=2&&node.count<=6&&Array.isArray(node.body)&&node.body.length){blocks++;const body=[];for(const child of node.body){if(child?.type!=="move"||!["up","down","left","right"].includes(child.dir))return null;blocks++;body.push(child.dir)}for(let count=0;count<node.count;count++)commands.push(...body)}
    else return null;
    if(commands.length>120)return null;
  }
  return{commands,blocks};
}

export function verifyStage(maps,stage,program){
  const map=maps?.[stage],decoded=decodeProgram(program);if(!map||!decoded)return null;
  if(decoded.blocks>map.blockLimit)return null;
  let[r,c]=map.start;const collected=new Set(),at=(list,row,col)=>list.some(([a,b])=>a===row&&b===col),vectors={up:[-1,0],down:[1,0],left:[0,-1],right:[0,1]};
  for(const command of decoded.commands){const[dr,dc]=vectors[command],nr=r+dr,nc=c+dc;if(nr<0||nc<0||nr>=map.rows||nc>=map.cols||at(map.walls,nr,nc)||at(map.bombs,nr,nc))return null;r=nr;c=nc;if(at(map.coins,r,c))collected.add(`${r},${c}`);if(r===map.flag[0]&&c===map.flag[1])return{coins:collected.size,blocks:decoded.blocks}}
  return null;
}

export async function handler(req,res){
  const url=new URL(req.url,`http://${req.headers.host||"localhost"}`);
  if(url.pathname==="/api/runs"&&req.method==="POST"){
    try{const input=await bodyJson(req),mission=missionCatalog[input.mission];if(!mission)return send(res,400,{error:"중급 또는 고급 미션을 선택해 주세요."});const stages=createMissionStageSet(crypto.randomUUID(),mission.id);return send(res,201,{mission:mission.id,missionLabel:mission.label,stages})}catch{return send(res,400,{error:"미션을 준비하지 못했어요."})}
  }
  if(url.pathname.startsWith("/api/"))return send(res,404,{error:"사용하지 않는 기능입니다."});
  if(req.method!=="GET")return send(res,405,{error:"지원하지 않는 요청입니다."});
  const requestPath=url.pathname==="/"?"/index.html":url.pathname,filePath=normalize(join(root,requestPath));if(!filePath.startsWith(root))return send(res,403,"Forbidden","text/plain");
  try{const data=await readFile(filePath);res.writeHead(200,{"content-type":types[extname(filePath)]||"application/octet-stream"});res.end(data)}catch{send(res,404,"Not found","text/plain; charset=utf-8")}
}

if(!process.env.VERCEL)createServer(handler).listen(port,"0.0.0.0",()=>console.log(`코딩할고양: http://localhost:${port}`));
export default handler;
