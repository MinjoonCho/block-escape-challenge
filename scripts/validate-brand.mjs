import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const publicPages = ["index.html", "game.html", "tutorial.html", "ranking.html", "admin.html"];
const sourceFiles = [
  ...publicPages.map((name) => join(root, "public", name)),
  join(root, "public", "app.js"),
  join(root, "public", "tutorial.js"),
  join(root, "server.mjs"),
  join(root, "README.md"),
  join(root, "HANDOFF.md"),
  join(root, "PRODUCT.md"),
  join(root, "DESIGN.md"),
];

const requiredAssets = [
  "public/assets/branding/coding-goyang-slogan.png",
  "public/assets/branding/tanhyeon-youth-center.png",
  "public/assets/branding/proteen.png",
  "public/assets/goyang-cat-run.png",
  "public/assets/goyang-cat-fast-run.png",
];

const failures = [];
const source = (await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")))).join("\n");

for (const asset of requiredAssets) {
  try {
    await access(join(root, asset));
  } catch {
    failures.push(`필수 에셋 없음: ${asset}`);
  }
}

for (const page of publicPages) {
  const html = await readFile(join(root, "public", page), "utf8");
  if (!html.includes("코딩할고양")) failures.push(`${page}: 새 게임 이름 누락`);
  if (!html.includes("연세대학교 컴퓨터과학과 조민준")) failures.push(`${page}: 제작자 표기 누락`);
  if (!html.includes("공공누리 제3유형")) failures.push(`${page}: 캐릭터 이용조건 표기 누락`);
}

for (const page of ["game.html", "tutorial.html"]) {
  const html = await readFile(join(root, "public", page), "utf8");
  if (!html.includes('id="mobileRunButton"')) failures.push(`${page}: 모바일 첫 화면 실행 버튼 누락`);
}

for (const legacy of ["G메타ㄹ출", "G-META", "지메타 캐릭터"]) {
  if (source.includes(legacy)) failures.push(`공개 소스에 이전 브랜드가 남음: ${legacy}`);
}

for (const requiredText of [
  "연세대학교 컴퓨터과학과 조민준",
  "고양특례시",
  "공공누리 제3유형",
]) {
  if (!source.includes(requiredText)) failures.push(`필수 표기 누락: ${requiredText}`);
}

if (failures.length) {
  console.error(`브랜드 검증 실패 (${failures.length}건)`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("브랜드 검증 통과: 코딩할고양 이름, 로고, 마스코트, 출처 및 제작자 표기 확인");
