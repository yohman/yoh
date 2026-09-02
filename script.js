const image = (name) => `assets/placeholder-${name}.png`;

const work = [
  { id: 'mirai', type: 'project', title: 'Ishiguro Mirai', theme: 'culture', image: image('memory'), crop: '1.08', rotate: '-1.5deg', url: 'https://reitaku-lab.github.io/mirai/', description: 'An event site for Ishiguro Mirai: a living record of art, place, and the people gathered around it.', meta: 'Web experience · 2026' },
  { id: 'gallery', type: 'project', title: 'Takashima, in photographs', theme: 'culture', image: image('memory'), crop: '1.16', rotate: '2deg', url: 'https://reitaku-lab.github.io/mirai/gallery/', description: 'A continuously unfolding photographic mosaic from the Ishiguro Mirai event in Takashima.', meta: 'Photography · visual archive · 2026' },
  { id: 'programming', type: 'course', title: 'Programming', theme: 'learning', image: image('learning'), crop: '1.11', rotate: '-2deg', url: 'https://yohman.github.io/26-2-Programming/agenda.html', description: 'Fall 2026. A hands-on route through programming as a medium for thinking, making, and inquiry.', meta: 'Reitaku University · Fall 2026' },
  { id: 'dataviz', type: 'course', title: 'Data Visualization', theme: 'learning', image: image('learning'), crop: '1.02', rotate: '1deg', url: 'https://yohman.github.io/26-2-Dataviz/', description: 'Fall 2026. Methods for noticing patterns, questioning data, and communicating evidence with care.', meta: 'Reitaku University · Fall 2026' },
  { id: 'engineer', type: 'course', title: 'Global Engineer', theme: 'learning', image: image('learning'), crop: '1.18', rotate: '2deg', url: 'https://yohman.github.io/26-2-Global-Engineer/', description: 'Fall 2026. A studio for examining engineering practice through global contexts and public responsibility.', meta: 'Reitaku University · Fall 2026' },
  { id: 'stats', type: 'course', title: 'Statistics B', theme: 'learning', image: image('learning'), crop: '1.07', rotate: '-1deg', url: 'https://yohman.github.io/26-2-StatsB/', description: 'Fall 2026. A course in probability, inference, estimation, testing, and explaining relationships with data.', meta: 'Reitaku University · Fall 2026' },
  { id: 'airi', type: 'film', title: 'Airi', theme: 'culture', image: image('memory'), crop: '1.04', rotate: '-2deg', url: null, description: 'A documentary about silence, memory, dialogue, identity, and the enduring human impact of disaster.', meta: 'Director · 2026' },
  { id: 'human-error', type: 'film', title: 'Human Error', theme: 'culture', image: image('memory'), crop: '1.15', rotate: '1.5deg', url: null, description: 'A documentary examining the Fukushima nuclear disaster through the experiences of residents displaced from their homes and communities.', meta: 'Director · 2019' },
  { id: 'mirai-film', type: 'film', title: 'Mirai', theme: 'culture', image: image('memory'), crop: '1.09', rotate: '-1deg', url: null, description: 'An upcoming film project about futures, memory, and the long arc of place.', meta: 'Director · Fall 2027' },
  { id: 'xaviz', type: 'project', title: 'XaViz', theme: 'history', image: image('archive'), crop: '1.04', rotate: '-1deg', url: 'https://github.com/yohman/xaviz', description: 'An interactive way into Japanese historical demographic records, opening archival data to new questions about households and social life.', meta: 'Historical data · interactive visualization' },
  { id: 'kiseki', type: 'project', title: 'Kiseki', theme: 'place', image: image('place'), crop: '1.12', rotate: '1deg', url: 'https://github.com/yohman/kiseki', description: 'A collaborative map for tracing memory through place, connecting geotagged stories across generations.', meta: 'Participatory mapping · digital memory' },
  { id: 'reitaku-map', type: 'project', title: 'Reitaku Campus Map', theme: 'place', image: image('place'), crop: '1.04', rotate: '-2deg', url: 'https://github.com/yohman/reitaku-map', description: 'An interactive campus map designed for orientation, exploration, and accessible everyday use.', meta: 'Cartography · wayfinding' },
  { id: 'map-library', type: 'project', title: 'HyperCities Map Library', theme: 'history', image: image('archive'), crop: '1.14', rotate: '1.5deg', url: 'https://github.com/yohman/maplibrary', description: 'A curated and renewed archive of digital mapping projects from the HyperCities era.', meta: 'Digital humanities · map archive' },
];

const presentation = {
  mirai: { cue: 'event site · takashima', layout: 'split', tone: 'ink' },
  gallery: { cue: 'photographic archive', layout: 'offset', tone: 'red' },
  programming: { cue: 'fall 2026 · make systems', layout: 'top', tone: 'blue' },
  dataviz: { cue: 'fall 2026 · see / make / question', layout: 'bottom', tone: 'paper' },
  engineer: { cue: 'fall 2026 · people / places / systems', layout: 'split', tone: 'acid' },
  stats: { cue: 'fall 2026 · variation → inference', layout: 'offset', tone: 'blue' },
  airi: { cue: 'documentary · 2026', layout: 'bottom', tone: 'ink' },
  'human-error': { cue: 'documentary · fukushima · 2019', layout: 'top', tone: 'red' },
  'mirai-film': { cue: 'film project · fall 2027', layout: 'offset', tone: 'ink' },
  xaviz: { cue: 'historical demographics', layout: 'split', tone: 'paper' },
  kiseki: { cue: 'memory mapping', layout: 'bottom', tone: 'blue' },
  'reitaku-map': { cue: 'cartography · wayfinding', layout: 'top', tone: 'slate' },
  'map-library': { cue: 'digital humanities · map archive', layout: 'offset', tone: 'ink' },
};

const grid = document.querySelector('#work-grid');
const svg = document.querySelector('.connections');
const dialog = document.querySelector('#detail');
let visible = [];

function shuffle(items) { return [...items].sort(() => Math.random() - .5); }
function render(filter = 'all') {
  visible = filter === 'all' ? shuffle(work) : work.filter(item => item.type === filter);
  grid.innerHTML = visible.map((item, i) => { const face = presentation[item.id]; return `<button class="work layout-${face.layout} tone-${face.tone}" data-id="${item.id}" style="animation-delay:${i * .035}s" aria-label="Open ${item.title}"><span class="card-type">${item.type}</span><span class="card-index">${String(i + 1).padStart(2, '0')}</span><h2 class="card-title">${item.title}</h2><p class="card-cue">${face.cue}</p><span class="card-hover">Read overview <span>↗</span></span></button>`; }).join('');
  requestAnimationFrame(drawNetwork);
}
function drawNetwork() {
  const field = document.querySelector('.work-field').getBoundingClientRect();
  const tiles = [...grid.children];
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${field.width} ${field.height}`);
  const nodes = tiles.map((tile, i) => { const b = tile.getBoundingClientRect(); return { x: b.left - field.left + b.width / 2, y: b.top - field.top + b.height / 2, item: visible[i], tile }; });
  nodes.forEach((node, i) => nodes.slice(i + 1).forEach(other => {
    if (node.item.theme === other.item.theme) svg.insertAdjacentHTML('beforeend', `<line data-a="${i}" data-b="${nodes.indexOf(other)}" x1="${node.x}" y1="${node.y}" x2="${other.x}" y2="${other.y}" />`);
  }));
  nodes.forEach((node, i) => svg.insertAdjacentHTML('beforeend', `<circle data-node="${i}" cx="${node.x}" cy="${node.y}" r="3" />`));
  nodes.forEach((node, i) => { node.tile.onmouseenter = () => highlight(i, nodes); node.tile.onmouseleave = clearHighlight; node.tile.onfocus = () => highlight(i, nodes); node.tile.onblur = clearHighlight; });
}
function highlight(index, nodes) { const theme = nodes[index].item.theme; svg.querySelectorAll('line').forEach(line => { const a = nodes[line.dataset.a], b = nodes[line.dataset.b]; line.classList.toggle('related', a.item.theme === theme && b.item.theme === theme); }); svg.querySelectorAll('circle').forEach((circle, i) => circle.classList.toggle('related', nodes[i].item.theme === theme)); }
function clearHighlight() { svg.querySelectorAll('.related').forEach(el => el.classList.remove('related')); }
function openDetail(item) { const link = document.querySelector('#detail-link'); const face = presentation[item.id]; const poster = document.querySelector('#detail-poster'); poster.className = `detail-poster tone-${face.tone}`; document.querySelector('#detail-type').textContent = item.type; document.querySelector('#detail-title').textContent = item.title; document.querySelector('#detail-cue').textContent = face.cue; document.querySelector('#detail-description').textContent = item.description; document.querySelector('#detail-meta').textContent = item.meta; link.hidden = !item.url; if (item.url) link.href = item.url; dialog.showModal(); }

function selectFilter(type) {
  document.querySelector('.filter.is-active')?.classList.remove('is-active');
  document.querySelector(`.filter[data-filter="${type}"]`)?.classList.add('is-active');
  document.querySelector('#heading').textContent = type === 'all' ? 'Selected work' : type === 'course' ? 'Courses' : type === 'project' ? 'Projects' : 'Films';
  document.querySelector('#deck').textContent = type === 'all' ? 'A small, shuffled selection of courses, projects, and films. Follow a square to enter its story.' : type === 'film' ? 'Documentary films about disaster, memory, and the futures people make together.' : `A focused index of ${type === 'course' ? 'teaching' : 'research and creative'} work.`;
  render(type);
}
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => selectFilter(button.dataset.filter)));
grid.addEventListener('click', (event) => { const tile = event.target.closest('.work'); if (tile) openDetail(work.find(item => item.id === tile.dataset.id)); });
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
window.addEventListener('resize', () => requestAnimationFrame(drawNetwork));
selectFilter(location.hash === '#courses' ? 'course' : location.hash === '#projects' ? 'project' : location.hash === '#films' ? 'film' : 'all');
