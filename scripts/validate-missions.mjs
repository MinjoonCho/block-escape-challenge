import assert from "node:assert/strict";
import { createMissionStageSet, missionCatalog } from "../stage-catalog.mjs";

assert.deepEqual(Object.keys(missionCatalog),["intermediate","advanced"]);
assert.deepEqual(missionCatalog.intermediate.stageNumbers,[1,2,3]);
assert.deepEqual(missionCatalog.advanced.stageNumbers,[3,4,5]);
assert.equal(missionCatalog.intermediate.label,"중급 미션");
assert.equal(missionCatalog.advanced.label,"고급 미션");

for(const mission of Object.values(missionCatalog)){
  const stages=createMissionStageSet("mission-validation",mission.id);
  assert.equal(stages.length,3);
  assert.deepEqual(stages.map(stage=>stage.stageNumber),mission.stageNumbers);
  assert.ok(stages.every(stage=>Number.isInteger(stage.blockLimit)&&stage.blockLimit>stage.idealBlocks));
}

assert.throws(()=>createMissionStageSet("mission-validation","unknown"),/올바른 미션/);
console.log("미션 구성 및 여유 있는 블록 제한 검증 완료");
