import assert from "node:assert/strict";
import { Readable } from "node:stream";

process.env.VERCEL="1";
const { handler, verifyStage }=await import("../server.mjs");

const map={rows:3,cols:3,start:[2,0],flag:[0,2],walls:[],bombs:[],coins:[],blockLimit:4};
const valid=[{type:"repeat",count:2,body:[{type:"move",dir:"right"},{type:"move",dir:"up"}]}];
const tooMany=[{type:"move",dir:"right"},{type:"move",dir:"right"},{type:"move",dir:"up"},{type:"move",dir:"up"},{type:"move",dir:"left"}];

assert.deepEqual(verifyStage([map],0,valid),{coins:0,blocks:3});
assert.equal(verifyStage([map],0,tooMany),null);

async function request(path,body){
  const req=Readable.from(body?[JSON.stringify(body)]:[]);req.url=path;req.method=body?"POST":"GET";req.headers={host:"localhost"};
  return new Promise(resolve=>{const response={status:0,headers:{},writeHead(status,headers){this.status=status;this.headers=headers},end(value=""){resolve({status:this.status,body:String(value)})}};handler(req,response)});
}

const missionResponse=await request("/api/runs",{mission:"intermediate"}),missionBody=JSON.parse(missionResponse.body);
assert.equal(missionResponse.status,201);
assert.equal(missionBody.stages.length,3);
assert.equal(missionBody.missionLabel,"중급 미션");
assert.equal((await request("/api/scores")).status,404);
console.log("서버 블록 제한 및 무저장소 미션 API 검증 완료");
