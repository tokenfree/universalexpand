const assert=require('node:assert/strict');
const {createServer}=require('./serve.cjs');
const http=require('node:http');
const server=createServer();
server.listen(0,'127.0.0.1',async()=>{
  const request=(path,method='GET')=>new Promise((resolve,reject)=>{
    http.request({host:'127.0.0.1',port:server.address().port,path,method},res=>{
      let body='';res.on('data',chunk=>body+=chunk);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}));
    }).on('error',reject).end();
  });
  try {
    for(const path of ['/','/science.js','/universe.js','/atlas.js','/styles.css','/research.html','/guide.html']) {
      const r=await request(path);assert.equal(r.status,200);assert(r.body.length>0);assert.equal(r.headers['x-content-type-options'],'nosniff');assert(r.headers['content-security-policy'].includes("script-src 'self'"));
    }
    const head=await request('/','HEAD');assert.equal(head.status,200);assert.equal(head.body,'');assert(+head.headers['content-length']>0);
    assert.equal((await request('/','POST')).status,405);
    assert.equal((await request('/%')).status,400);
    assert.equal((await request('/%00')).status,400);
    assert.equal((await request('/..%2fREADME.md')).status,403);
    assert.equal((await request('/..%5cREADME.md')).status,403);
    assert.equal((await request('/missing.html')).status,404);
    console.log('PASS: assets, security headers, HEAD, method restriction, malformed paths, traversal rejection and 404.');
  } catch(error){console.error(error);process.exitCode=1;} finally {server.close();}
});
