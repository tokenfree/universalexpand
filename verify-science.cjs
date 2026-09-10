'use strict';
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const context = vm.createContext({Intl});
vm.runInContext(fs.readFileSync('dist/science.js','utf8'), context);
const run = code => vm.runInContext(code, context);
const model = JSON.parse(run('JSON.stringify(COSMO)'));
// Independent variable, grid and quadrature from the app's logarithmic trapezoid.
// Algebraically: dt/da = a / (H0 sqrt(Or + Om*a + Ol*a^4)).
function age(a, n=100000) {
  const h=a/n, f=x=>x/Math.sqrt(model.Or+model.Om*x+model.Ol*x**4);
  let sum=f(0)+f(a);
  for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(i*h);
  return sum*h/3/(model.H0/3.0856775814913673e19);
}
const year=31557600;
for(const a of [.0005,.001,.01,.1,.5,1]) {
  const t=age(a);
  assert(Math.abs(age(a,50000)/t-1)<1e-8,'Reference quadrature convergence');
  assert(Math.abs(run(`scaleAtTime(${t})`)/a-1)<1e-5,'Independent age/scale agreement');
}
let lo=0,hi=.01;
for(let i=0;i<60;i++){const mid=(lo+hi)/2;if(age(mid)<380000*year)lo=mid;else hi=mid;}
const recombinationScale=(lo+hi)/2;
const plasmaK=Math.sqrt(2.4/Math.sqrt(106.75)/1e-12)*1.160451812e10;
assert(plasmaK>5e15&&plasmaK<6e15);
assert.equal(run('ERAS[5].name'),'Light nuclei assemble');
assert.equal(run('ERAS[6].name'),'Hydrogen recombination');
assert(fs.readFileSync('dist/index.html','utf8').includes('Radiative recombination → hydrogen'));
console.log(JSON.stringify({independentAgeGyr:age(1)/year/1e9,appAgeGyr:run('expansionTable.at(-1)[0]/YEAR/1e9'),independentTemperatureAt380k:model.T0/recombinationScale,appTemperatureAt380k:run('COSMO.T0/scaleAtTime(380000*YEAR)'),independentRedshiftAt380k:1/recombinationScale-1,standardModelTemperatureAt1ps:plasmaK},null,2));
console.log('PASS: independent Simpson quadrature, convergence, six scale/age comparisons and corrected scientific labels. This validates the specified approximation, not observational accuracy.');
