'use strict';
// Keep the table geometry independent of selection, filtering, and article length.
let selectedElement = 1;
const elementButtons = [];
for (let group = 1; group <= 18; group++) {
  const label = document.createElement('span');
  label.textContent = group;
  $('element-groups').append(label);
}
function inspectElement(z) {
  if (!Number.isInteger(z) || z < 1 || z > ELEMENTS.length) return;
  selectedElement = z;
  const e = ELEMENTS[z - 1], origin = elementOrigin(z);
  $('element-detail').innerHTML = '<p class="eyebrow">ATOMIC NUMBER ' + z + '</p><h3>' + e.symbol + ' · ' + e.name + '</h3><h4>' + origin[0] + '</h4><p>' + origin[1] + '</p><p>There is no measured universal first-production date for this element. Origins are isotope-dependent.</p><a href="' + SOURCES.elements + '" target="_blank" rel="noopener noreferrer">NASA origin chart (opens new tab) ↗</a><br><a href="' + SOURCES.iupac + '" target="_blank" rel="noopener noreferrer">IUPAC element reference (opens new tab) ↗</a>';
  $('element-detail').scrollTop = 0;
  elementButtons.forEach((b, i) => {
    b.setAttribute('aria-pressed', String(i + 1 === z));
    b.tabIndex = i + 1 === z ? 0 : -1;
  });
  $('element-announcement').textContent = e.name + ', atomic number ' + z + '. ' + origin[0] + '. Details follow the table.';
}
ELEMENTS.forEach(e => {
  const b = document.createElement('button'), position = periodicPosition(e.z);
  b.innerHTML = '<small>' + e.z + '</small><span translate="no">' + e.symbol + '</span>';
  b.style.gridColumn = position.column;
  b.style.gridRow = position.row;
  b.setAttribute('aria-label', e.name + ', atomic number ' + e.z);
  b.title = e.name;
  b.onclick = () => inspectElement(e.z);
  b.addEventListener('keydown', event => {
    let target;
    const positions = ELEMENTS.map(item => ({z:item.z, ...periodicPosition(item.z)}));
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const delta = event.key === 'ArrowRight' ? 1 : -1;
      target = Math.max(1, Math.min(118, e.z + delta));
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      const candidates = positions.filter(p => p.column === position.column && (p.row - position.row) * delta > 0);
      candidates.sort((a,b) => Math.abs(a.row-position.row)-Math.abs(b.row-position.row));
      target = candidates[0]?.z || e.z;
    } else if (event.key === 'Home') target = 1;
    else if (event.key === 'End') target = 118;
    else return;
    event.preventDefault();
    elementButtons.forEach((button,i) => button.tabIndex = i + 1 === target ? 0 : -1);
    elementButtons[target - 1].focus({preventScroll:true});
    elementButtons[target - 1].scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
  });
  elementButtons.push(b);
  $('element-grid').append(b);
});
for (const [row, text] of [[6, '57–71'], [7, '89–103']]) {
  const label = document.createElement('span');
  label.className = 'series-marker';
  label.style.gridRow = row;
  label.style.gridColumn = 3;
  label.textContent = text;
  $('element-grid').append(label);
}
function matchingElements(value) {
  const query = value.trim().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const aliases = {aluminum:'aluminium',cesium:'caesium',sulphur:'sulfur'};
  const term = aliases[query] || query;
  return ELEMENTS.filter(e => !term || String(e.z) === term || e.symbol.toLowerCase() === term || e.name.toLowerCase().includes(term));
}
function searchElements() {
  const matches = matchingElements($('element-search').value), ids = new Set(matches.map(e => e.z));
  elementButtons.forEach((b,i) => b.classList.toggle('search-muted', !ids.has(i+1)));
  $('element-results').textContent = matches.length === 118 ? '118 elements · all shown' : matches.length ? matches.length + ' matching element' + (matches.length === 1 ? '' : 's') + ' · press Enter to select the first' : 'No matches. Try a name, symbol or atomic number.';
  return matches;
}
$('element-search').oninput = searchElements;
$('element-search').addEventListener('keydown', event => {
  if (event.key === 'Escape') { $('element-search').value = ''; searchElements(); }
  if (event.key === 'Enter') {
    event.preventDefault();
    const first = matchingElements($('element-search').value)[0];
    if (first) inspectElement(first.z);
  }
});
$('clear-search').onclick = () => { $('element-search').value = ''; searchElements(); $('element-search').focus({preventScroll:true}); };
inspectElement(1);
