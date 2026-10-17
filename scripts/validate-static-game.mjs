import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createMissionStageSet, stagePools, stages } from "../public/stages.js";

const vectors={up:[-1,0],down:[1,0],left:[0,-1],right:[0,1]};
const key=([row,column])=>`${row},${column}`;
const sourceBlocks=commands=>{
  const half=commands.length/2;
  return Number.isInteger(half)&&commands.slice(0,half).join()===commands.slice(half).join()?half+1:commands.length;
};

function runAnswer(stage){
  const blocked=new Set([...stage.walls,...stage.bombs].map(key));
  const coins=new Set(stage.coins.map(key));
  const collected=new Set();
  let[row,column]=stage.start;

  for(const command of stage.answer){
    const[dr,dc]=vectors[command];
    row+=dr;
    column+=dc;
    const position=`${row},${column}`;
    assert.ok(row>=0&&column>=0&&row<stage.rows&&column<stage.cols,`${stage.variant}: 정답이 지도 밖으로 나갑니다.`);
    assert.ok(!blocked.has(position),`${stage.variant}: 정답이 벽 또는 폭탄과 충돌합니다.`);
    if(coins.has(position))collected.add(position);
  }

  assert.equal(`${row},${column}`,key(stage.flag),`${stage.variant}: 정답이 깃발에 도착하지 않습니다.`);
  assert.equal(collected.size,stage.coins.length,`${stage.variant}: 정답이 모든 코인을 수집하지 않습니다.`);
  assert.equal(sourceBlocks(stage.answer),stage.idealBlocks,`${stage.variant}: 최소 블록 수가 기존 G메타 규칙과 다릅니다.`);
  assert.ok(stage.idealBlocks<=stage.blockLimit,`${stage.variant}: 블록 제한 안에서 풀 수 없습니다.`);
}

assert.equal(stagePools.length,5);
assert.ok(stagePools.every(pool=>pool.length===8));
assert.deepEqual(stagePools.map(pool=>pool[0].rows),[3,3,5,5,7]);
assert.deepEqual(stagePools.map(pool=>pool[0].blockLimit),[8,9,9,10,12]);
assert.ok(stagePools.flat().every(stage=>stage.rows===stage.cols));
stagePools.flat().forEach(runAnswer);

assert.equal(stages.length,5);
assert.deepEqual(stages.map(stage=>stage.stageNumber),[1,2,3,4,5]);
assert.deepEqual(createMissionStageSet("intermediate","test-seed").map(stage=>stage.stageNumber),[1,2,3]);
assert.deepEqual(createMissionStageSet("advanced","test-seed").map(stage=>stage.stageNumber),[3,4,5]);

const appSource=await readFile(new URL("../public/app.js",import.meta.url),"utf8");
assert.match(appSource,/createMissionStageSet\(mission,seed\)/);
assert.doesNotMatch(appSource,/fetch\s*\(/);
assert.doesNotMatch(appSource,/\/api\//);

console.log("G메타 스테이지 배치 검증 완료: 5단계 × 8개 변형, API·저장소 연결 없음");
