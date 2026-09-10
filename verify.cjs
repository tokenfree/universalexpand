const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('dist/index.html','utf8');
class Element{constructor(){this.children=[];this.attrs={};this.style={};this.dataset={};this.value='';this.classList={toggle(){}};this.clientWidth=500;this.events={};}setAttribute(k,v){this.attrs[k]=v}append(e){this.children.push(e)}addEventListener(k,fn){this.events[k]=fn}focus(){doc.activeElement=this}scrollIntoView(){}get firstChild(){return this.children[0]}get lastChild(){return this.children.at(-1)}getContext(){return null}setPointerCapture(){}}
const nodes={};for(const m of html.matchAll(/id="([^"]+)"/g)){assert(!nodes[m[1]],'Duplicate ID '+m[1]);nodes[m[1]]=new Element();}
nodes['speed'].value='1';nodes['lab-scale'].value='1';nodes['reaction'].value='quarks';
const tabs=['inventory','elements','expansion','processes'].map(tab=>{const e=new Element();e.dataset.tab=tab;return e});
const doc={events:{},addEventListener(k,fn){this.events[k]=fn},getElementById:id=>{assert(nodes[id],'Missing element '+id);return nodes[id]},createElement:()=>new Element(),createElementNS:()=>new Element(),querySelectorAll:()=>tabs,querySelector:s=>s.includes('inventory')?tabs[0]:new Element(),hidden:false};
const ctx={document:doc,matchMedia:()=>({matches:false}),requestAnimationFrame:()=>{},console,devicePixelRatio:1};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('dist/science.js','utf8')+'\n'+fs.readFileSync('dist/universe.js','utf8')+'\n'+fs.readFileSync('dist/atlas.js','utf8'),ctx);
function run(code){return vm.runInContext(code,ctx)}
// Assertions must not depend on the host computer's regional settings.
run('numberLocale="en-US"');
assert.equal(run('ELEMENTS.length'),118);assert.equal(run('new Set(ELEMENTS.map(e=>e.symbol)).size'),118);assert.equal(run('ERAS.length'),12);
assert(Math.abs(run('expansionTable.at(-1)[0]/YEAR/1e9')-13.8)<.03);
assert(Math.abs(run('COSMO.T0/scaleAtTime(380000*YEAR)')-3000)<100);
assert.equal(run('hubble(1)'),67.4);
assert(run('expansionTable.every((p,i)=>!i||p[0]>expansionTable[i-1][0])'));
for(let i=0;i<12;i++){run(`setChapter(${i},true)`);assert.equal(run('lastEra'),i);assert.equal(nodes['era-title'].textContent,run(`ERAS[${i}].name`));assert(!nodes['materials'].innerHTML.includes('undefined'));assert(Math.abs(run(`timeAtChapter(${i})/ERAS[${i}].t`)-1)<1e-12);}
assert.equal(nodes['scale'].textContent,'1.0000');assert.equal(nodes['temperature'].textContent,'2.73 K');
run('setChapter(0,true)');assert.equal(nodes['scale'].textContent,'—');nodes['play'].onclick();assert.equal(run('playing'),true);nodes['play'].onclick();assert.equal(run('playing'),false);
for(let o=0;o<7;o++){run(`labObserver=${o}`);for(let i=0;i<7;i++)assert(Math.abs(run(`labDistances(2.5,${o})[${i}].d-labDistances(1,${o})[${i}].d*2.5`))<1e-10);}
for(let i=0;i<4;i++){tabs[i].onclick();assert.equal(run('activeTab'),tabs[i].dataset.tab);assert.equal(nodes[tabs[i].dataset.tab].hidden,false);}
for(const reaction of ['quarks','deuterium','hydrogen','carbon']){nodes['reaction'].value=reaction;nodes['reaction'].onchange();for(const progress of [0,.5,1]){run(`reactionProgress=${progress};updateReaction()`);const points=[];ctx.collectPoint=(p,c,s)=>{assert(p.every(Number.isFinite));assert(c.every(Number.isFinite));assert(s>0);points.push(p)};ctx.collectLine=()=>{};run('drawReaction(collectPoint,collectLine)');assert(points.length>0);}}
for(let z=1;z<=118;z++){run(`inspectElement(${z})`);assert(!nodes['element-detail'].innerHTML.includes('undefined'));}
for(const file of ['index.html','research.html','guide.html']){const body=fs.readFileSync('dist/'+file,'utf8');for(const m of body.matchAll(/(?:src|href)="([^"#]+)"/g)){if(/^(https?:|data:)/.test(m[1]))continue;assert(fs.existsSync('dist/'+m[1].split('#')[0]),'Missing local reference '+m[1]);}}
const report=fs.readFileSync('dist/research.html','utf8');for(const m of report.matchAll(/href="#([^"]+)"/g))assert(report.includes('id="'+m[1]+'"'),'Broken research anchor '+m[1]);
console.log('PASS: numerical cosmology, monotonic history, all 12 era transitions, play/pause, 118 element entries, all tabs, observer distance scaling, four reaction paths, local assets and research anchors.');
console.log('Scope: non-browser runtime contract checks. WebGL rendering and browser layout were not exercised.');

assert.equal(run('new Set(ELEMENTS.map(e=>JSON.stringify(periodicPosition(e.z)))).size'),118);
for(const [z,row,column] of [[1,1,1],[2,1,18],[5,2,13],[10,2,18],[26,4,8],[57,9,4],[71,9,18],[72,6,4],[89,10,4],[103,10,18],[118,7,18]])assert.equal(run(`JSON.stringify(periodicPosition(${z}))`),JSON.stringify({row,column}));
assert(run('ELEMENTS.every(e=>{const p=periodicPosition(e.z);return p.column>=1&&p.column<=18&&p.row>=1&&p.row<=10;})'));
for(const [term,z] of [['H',1],['fe',26],['79',79],[' Aluminum ',13],['cesium',55],['sulphur',16]])assert.equal(run(`matchingElements(${JSON.stringify(term)})[0].z`),z);
assert.equal(run('matchingElements("<script>").length'),0);
assert.equal(run('matchingElements("").length'),118);
run('inspectElement(3)');assert.equal(run('selectedElement'),3);assert.equal(run('elementButtons.filter(b=>b.tabIndex===0).length'),1);
run('inspectElement(0)');assert.equal(run('selectedElement'),3);
run('elementButtons[0].events.keydown({key:"ArrowDown",preventDefault(){}})');assert.equal(doc.activeElement,run('elementButtons[2]'));
run('numberLocale="de-DE";updateUI();updateLab()');assert.equal(run('formatNumber(1234.56,2)'), '1.234,56');assert.equal(run('formatNumber(1,4,4)'),'1,0000');
run('numberLocale="ar-EG"');assert.equal(run('formatNumber(1234.56,2)'),new Intl.NumberFormat('ar-EG',{maximumFractionDigits:2}).format(1234.56));
run('numberLocale="";reactionPlaying=true');tabs[1].onclick();assert.equal(run('reactionPlaying'),false);
run('playing=true;reactionPlaying=true');doc.hidden=true;doc.events.visibilitychange();assert.equal(run('playing'),false);assert.equal(run('reactionPlaying'),false);doc.hidden=false;
console.log('PASS: periodic positions, spelling aliases, search empty state, keyboard focus, selection validation, locale formatting without storage, reaction tab pause and background pause.');
let draws=0;ctx.recordDraw=()=>draws++;
run('render=recordDraw;playing=false;reactionPlaying=false;lastRenderState="";frame(1000);frame(1050)');assert.equal(draws,1);
run('zoom+=1;frame(1100)');assert.equal(draws,2);
console.log('PASS: unchanged scenes skip rendering; camera changes redraw.');
