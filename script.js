window.loadPortfolioContent().then(({ cards, categories }) => {
const main = document.querySelector('main');
let visible = [];
let currentFilter = 'all';

function shuffle(items) { return [...items].sort(() => Math.random() - .5); }
function marker(category) { return `<i class="marker marker-${category}" aria-hidden="true"></i>`; }
function categoryLabel(category) { return `${marker(category)}${categories[category].singular}`; }
function tileShape(index) {
  const shapes = ['feature', 'landscape', 'standard', 'standard', 'portrait', 'landscape', 'standard', 'standard'];
  return shapes[index % shapes.length];
}
function updateCounts() {
  Object.keys(categories).forEach(category => {
    const count = String(cards.filter(card => card.category === category).length).padStart(2, '0');
    const target = document.querySelector(`[data-filter="${category}"] .count`);
    if (target) target.innerHTML = `${marker(category)}${count}`;
  });
}
function showIndex(filter = 'all', updateUrl = false) {
  currentFilter = filter;
  main.className = '';
  main.innerHTML = `<section class="work-field" id="index-view"><div class="work-grid" id="work-grid"></div></section>`;
  visible = filter === 'all' ? shuffle(cards) : cards.filter(card => card.category === filter);
  const grid = document.querySelector('#work-grid');
  grid.innerHTML = visible.map((card, index) => `<article class="work tile-${tileShape(index)}" style="animation-delay:${index * .035}s"><button class="card-reading" data-id="${card.id}" type="button" aria-label="Read about ${card.title}">${card.image ? `<span class="card-media"><img src="${card.image}" alt="" /></span>` : ''}<span class="card-copy"><span class="card-type">${categoryLabel(card.category)}</span><span class="card-index">${String(index + 1).padStart(2, '0')}</span><h2 class="card-title">${card.title}</h2><p class="card-cue">${card.cue}</p></span></button><span class="card-actions"><button class="card-action" data-id="${card.id}" type="button" aria-label="Read about ${card.title}">i</button>${card.url ? `<a class="card-action" href="${card.url}" target="_blank" rel="noreferrer" aria-label="Visit ${card.title}">↗</a>` : ''}</span></article>`).join('');
  document.querySelector('.filter.is-active')?.classList.remove('is-active');
  document.querySelector(`[data-filter="${filter}"]`)?.classList.add('is-active');
  if (updateUrl) history.pushState({ filter }, '', filter === 'all' ? '#top' : `#${categories[filter].label.toLowerCase()}`);
}
function showCard(id, updateUrl = true) {
  const card = cards.find(item => item.id === id);
  if (!card) return showIndex(currentFilter);
  const category = categories[card.category];
  main.className = 'reading-view';
  main.innerHTML = `<article class="reading"><button class="back" type="button">← Index</button><header class="reading-header"><p class="reading-category">${categoryLabel(card.category)} <span>${card.year}</span></p><h1>${card.title}</h1><p class="reading-cue">${card.cue}</p></header>${card.image ? `<figure class="reading-image"><img src="${card.image}" alt="" /></figure>` : ''}<div class="reading-body"><p class="reading-summary">${card.summary}</p>${card.body.map(paragraph => `<p>${paragraph}</p>`).join('')}${card.url ? `<a class="visit" href="${card.url}" target="_blank" rel="noreferrer">Visit project <span>↗</span></a>` : ''}</div></article>`;
  if (updateUrl) history.pushState({ card: id, filter: currentFilter }, '', `#card=${id}`);
  main.querySelector('.back').addEventListener('click', () => { history.pushState({ filter: currentFilter }, '', currentFilter === 'all' ? '#top' : `#${categories[currentFilter].label.toLowerCase()}`); showIndex(currentFilter); });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function applyHash() {
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash.startsWith('card=')) return showCard(hash.slice(5), false);
  const category = Object.entries(categories).find(([, value]) => value.label.toLowerCase() === hash)?.[0];
  showIndex(category || 'all');
}
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => showIndex(button.dataset.filter, true)));
main.addEventListener('click', event => { const card = event.target.closest('.card-reading, .card-action[type="button"]'); if (card) showCard(card.dataset.id); });
window.addEventListener('popstate', applyHash);
updateCounts();
applyHash();
}).catch(() => {
  document.querySelector('main').innerHTML = '<p class="load-error">Could not load content.md. Please try again from the published site.</p>';
});
