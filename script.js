window.loadPortfolioContent().then(({ cards, categories }) => {
const main = document.querySelector('main');
let visible = [];
let currentFilter = 'all';

function shuffle(items) { return [...items].sort(() => Math.random() - .5); }
function dot(category) { return `<i class="dot dot-${category}" aria-hidden="true"></i>`; }
function categoryLabel(category) { return `${categories[category].singular} ${dot(category)}`; }
function tileShape(index) {
  const shapes = ['hero', 'landscape', 'portrait', 'square', 'wide', 'portrait', 'square', 'landscape'];
  return shapes[index % shapes.length];
}
function updateCounts() {
  Object.keys(categories).forEach(category => {
    const count = String(cards.filter(card => card.category === category).length).padStart(2, '0');
    const target = document.querySelector(`[data-filter="${category}"] .count`);
    if (target) target.innerHTML = `${dot(category)}${count}`;
  });
}
function showIndex(filter = 'all', updateUrl = false) {
  currentFilter = filter;
  main.className = '';
  main.innerHTML = `<section class="work-field" id="index-view"><div class="work-grid" id="work-grid"></div></section>`;
  visible = filter === 'all' ? shuffle(cards) : cards.filter(card => card.category === filter);
  const grid = document.querySelector('#work-grid');
  grid.innerHTML = visible.map((card, index) => `<button class="work tile-${tileShape(index)} category-${card.category}${card.image ? ' has-image' : ''}" data-id="${card.id}" style="animation-delay:${index * .035}s" aria-label="Open ${card.title}">${card.image ? `<img class="card-image" src="${card.image}" alt="" />` : ''}<span class="card-type">${categoryLabel(card.category)}</span><span class="card-index">${String(index + 1).padStart(2, '0')}</span><h2 class="card-title">${card.title}</h2><p class="card-cue">${card.cue}</p><span class="card-hover">Read overview <span>↗</span></span></button>`).join('');
  document.querySelector('.filter.is-active')?.classList.remove('is-active');
  document.querySelector(`[data-filter="${filter}"]`)?.classList.add('is-active');
  if (updateUrl) history.pushState({ filter }, '', filter === 'all' ? '#top' : `#${categories[filter].label.toLowerCase()}`);
}
function showCard(id, updateUrl = true) {
  const card = cards.find(item => item.id === id);
  if (!card) return showIndex(currentFilter);
  const category = categories[card.category];
  main.className = 'reading-view';
  main.innerHTML = `<article class="reading category-${card.category}"><button class="back" type="button">← Back to ${currentFilter === 'all' ? 'all work' : category.label.toLowerCase()}</button>${card.image ? `<figure class="reading-image"><img src="${card.image}" alt="" /></figure>` : ''}<header class="reading-header"><p class="reading-category">${categoryLabel(card.category)}</p><p class="reading-year">${card.year}</p><h1>${card.title}</h1><p class="reading-cue">${card.cue}</p></header><div class="reading-body"><p class="reading-summary">${card.summary}</p>${card.body.map(paragraph => `<p>${paragraph}</p>`).join('')}${card.url ? `<a class="visit" href="${card.url}" target="_blank" rel="noreferrer">Visit site <span>↗</span></a>` : ''}</div></article>`;
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
main.addEventListener('click', event => { const card = event.target.closest('.work'); if (card) showCard(card.dataset.id); });
window.addEventListener('popstate', applyHash);
updateCounts();
applyHash();
}).catch(() => {
  document.querySelector('main').innerHTML = '<p class="load-error">Could not load content.md. Please try again from the published site.</p>';
});
