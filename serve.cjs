const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json'};
function createServer() {
  return http.createServer((req,res) => {
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'");
    res.setHeader('Cache-Control','no-store');
    if (!['GET','HEAD'].includes(req.method)) {res.setHeader('Allow','GET, HEAD');res.writeHead(405).end('Method not allowed');return;}
    let pathname;
    try {pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);} catch {res.writeHead(400).end('Invalid URL');return;}
    if(pathname.includes('\0')){res.writeHead(400).end('Invalid URL');return;}
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    const relative=path.relative(root,file);
    if(!relative || relative.startsWith('..') || path.isAbsolute(relative)){res.writeHead(403).end('Forbidden');return;}
    fs.readFile(file,(error,data) => {
      if(error){res.writeHead(404).end('Not found');return;}
      res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':data.length});
      res.end(req.method==='HEAD'?undefined:data);
    });
  });
}
if(require.main===module){
  const port = process.env.PORT ? Number(process.env.PORT) : 4173;
  const host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';
  createServer().listen(port,host,()=>console.log(`UniversalExpand: http://${host}:${port}`));
}
module.exports={createServer};
