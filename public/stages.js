const borderWalls = [
  [0,0],[0,1],[0,2],[0,3],[0,4],
  [1,0],[2,0],[3,0],[1,4],[2,4],[3,4],
  [4,0],[4,1],[4,2],[4,3],[4,4]
];

export const stages = [
  { title:"스테이지 1", text:"가장 짧은 길로 첫 깃발에 도착해 보세요.", idealBlocks:4, cols:5, rows:5, start:[3,1], flag:[1,3], walls:borderWalls, bombs:[], coins:[] },
  { title:"스테이지 2", text:"폭탄을 피해 코인을 챙기고 깃발로 이동하세요.", idealBlocks:4, cols:5, rows:5, start:[3,1], flag:[1,2], walls:borderWalls, bombs:[[2,2]], coins:[[2,1]] },
  { title:"스테이지 3", text:"세 코인을 잇는 안전한 지그재그 경로를 찾아보세요.", idealBlocks:6, cols:4, rows:4, start:[3,0], flag:[0,3], walls:[], bombs:[[0,1],[1,0]], coins:[[0,2],[1,1],[2,0]] },
  { title:"스테이지 4", text:"반복 블록을 활용해 멀리 돌아가는 경로를 줄여보세요.", idealBlocks:8, cols:4, rows:4, start:[3,0], flag:[0,2], walls:[], bombs:[[1,1],[2,1],[2,3]], coins:[[0,0],[1,2],[3,1]] },
  { title:"스테이지 5", text:"마지막 폭탄 지대를 돌파하고 코인과 함께 탈출하세요.", idealBlocks:10, cols:5, rows:5, start:[4,0], flag:[4,4], walls:[], bombs:[[1,1],[2,2],[3,3],[4,2]], coins:[[0,1],[0,4],[2,3]], note:"원본 배치에서 시작점 바로 위 폭탄은 탈출 경로 확보를 위해 제외했습니다." }
];
