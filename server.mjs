import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root=fileURLToPath(new URL("./public",import.meta.url));
const port=Number(process.env.PORT||4173);
const types={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp"};
const send=(res,status,body,type="application/json; charset=utf-8",headers={})=>{res.writeHead(status,{"content-type":type,"cache-control":"no-store",...headers});res.end(typeof body==="string"?body:JSON.stringify(body))};

export async function handler(req,res){
  const url=new URL(req.url,`http://${req.headers.host||"localhost"}`);
  if(req.method!=="GET")return send(res,405,{error:"지원하지 않는 요청입니다."});
  const requestPath=url.pathname==="/"?"/index.html":url.pathname,filePath=normalize(join(root,requestPath));if(!filePath.startsWith(root))return send(res,403,"Forbidden","text/plain");
  try{const data=await readFile(filePath);res.writeHead(200,{"content-type":types[extname(filePath)]||"application/octet-stream"});res.end(data)}catch{send(res,404,"Not found","text/plain; charset=utf-8")}
}

if(!process.env.VERCEL)createServer(handler).listen(port,"0.0.0.0",()=>console.log(`코딩할고양: http://localhost:${port}`));
export default handler;
