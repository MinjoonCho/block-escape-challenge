import assert from "node:assert/strict";

process.env.VERCEL="1";
process.env.UPSTASH_REDIS_REST_URL="https://current.example.com";
process.env.UPSTASH_REDIS_REST_TOKEN="current-token";
process.env.KV_REST_API_URL="https://legacy.example.com";
process.env.KV_REST_API_TOKEN="legacy-token";
const { storageConfigurationNames, storageTimeoutMs, verifyStage }=await import("../server.mjs");

const map={rows:3,cols:3,start:[2,0],flag:[0,2],walls:[],bombs:[],coins:[],blockLimit:4};
const valid=[{type:"repeat",count:2,body:[{type:"move",dir:"right"},{type:"move",dir:"up"}]}];
const tooMany=[{type:"move",dir:"right"},{type:"move",dir:"right"},{type:"move",dir:"up"},{type:"move",dir:"up"},{type:"move",dir:"left"}];

assert.deepEqual(verifyStage([map],0,valid),{coins:0,blocks:3});
assert.equal(verifyStage([map],0,tooMany),null);
assert.deepEqual(storageConfigurationNames,["UPSTASH_REDIS","KV_REST_API"]);
assert.equal(storageTimeoutMs,2500);
console.log("서버 블록 제한 검증 완료");
