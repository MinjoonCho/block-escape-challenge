import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stages } from "../public/stages.js";

assert.equal(stages.length,5);
assert.deepEqual(stages.map(stage=>stage.stageNumber),[1,2,3,4,5]);
assert.deepEqual(stages.map(stage=>stage.blockLimit),[8,9,9,10,12]);
assert.ok(stages.every(stage=>stage.rows===stage.cols));

const appSource=await readFile(new URL("../public/app.js",import.meta.url),"utf8");
assert.match(appSource,/intermediate:\{label:"중급 미션",indexes:\[0,1,2\]\}/);
assert.match(appSource,/advanced:\{label:"고급 미션",indexes:\[2,3,4\]\}/);
assert.doesNotMatch(appSource,/fetch\s*\(/);
assert.doesNotMatch(appSource,/\/api\//);

console.log("정적 프론트 미션 구성 검증 완료: API·저장소 연결 없음");
