window.loadPortfolioContent().then(({ about, cards, categories }) => {
const aboutRoot = document.querySelector('#about-content');
const inlineLinks = text => text.replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>');
const marker = category => `<i class="marker marker-${category}" aria-hidden="true"></i>`;
const places = (about.journey || '').split('|').map(place => place.trim()).filter(Boolean);
const points = [22, 42, 18, 35, 16, 30];
const journeyTop = 36;
const journeyStep = 46;
const journeyNodes = places.map((place, index) => ({ x: points[index] || 22, y: journeyTop + index * journeyStep + 8 }));
const journeyPath = journeyNodes.map((point, index) => {
  if (!index) return `M${point.x} ${point.y}`;
  const previous = journeyNodes[index - 1];
  const middle = (previous.y + point.y) / 2;
  return `C${previous.x} ${middle} ${point.x} ${middle} ${point.x} ${point.y}`;
}).join(' ');
const journey = places.length ? `<figure class="journey" aria-label="${about['journey-label']}"><svg class="journey-route" viewBox="0 0 52 312" aria-hidden="true"><path d="${journeyPath}" />${journeyNodes.map((point, index) => `<circle class="${index === places.length - 1 ? 'journey-current' : ''}" cx="${point.x}" cy="${point.y}" r="3" />`).join('')}</svg><ol>${places.map((place, index) => { const [city, country] = place.split(',').map(part => part.trim()); const isCurrent = index === places.length - 1; const point = journeyNodes[index]; return `<li class="journey-label-${point.x < 26 ? 'left' : 'right'}" style="--node-x:${point.x}px;--label-y:${point.y - 8}px"${isCurrent ? ' aria-current="location"' : ''}><span class="journey-city">${city}${isCurrent && about['journey-other-home'] ? `<span class="journey-other-home"><i aria-hidden="true"></i>${about['journey-other-home']}</span>` : ''}</span><span class="journey-country">${country || ''}${isCurrent ? ` · ${about['journey-now']}` : ''}</span></li>`; }).join('')}</ol></figure>` : '';

aboutRoot.innerHTML = `
  <section class="about-hero">
    <div class="portrait-journey"><div class="portrait"><img src="${about.portrait}" alt="Yoh" /></div>${journey}</div>
    <div class="about-intro"><p class="eyebrow">${about.eyebrow}</p><h1>${about.title.replace(/([.。])$/, '<span class="title-period">$1</span>')}</h1><p class="large-copy">${about.lead}</p><p>${about.intro}</p></div>
  </section>
  <section class="about-section statement"><p class="section-kicker">${window.portfolioText('The work')} ${marker('project')}</p><p class="statement-copy">${about.statement}</p></section>
  ${about.sections.map(section => `<section class="about-section two-column"><div><p class="section-kicker">${window.portfolioText(section.label)}</p><h2>${section.title}</h2></div><div class="prose">${section.paragraphs.map(paragraph => `<p>${inlineLinks(paragraph)}</p>`).join('')}</div></section>`).join('')}
  <section class="about-section film-section"><p class="section-kicker">${about['works-label']}</p><div class="film-grid">${about.works.map(work => `<article>${work.image ? `<a class="work-thumbnail" href="${work.url}" aria-label="${work.title}"><img src="${work.image}" alt="${work.title}" loading="lazy" /></a>` : ''}<p>${work.year}</p><h2><a href="${work.url}">${work.title}</a></h2><span>${work.role}</span><p>${work.text}</p></article>`).join('')}</div></section>
  <section class="about-section two-column education"><div><p class="section-kicker">${about['education-label']}</p><h2>${about['education-title']}</h2></div><div class="timeline">${about.education.map(([year, text]) => `<p><span>${year}</span>${text}</p>`).join('')}</div></section>
  <footer class="about-footer"><p>${about.footer}</p><a href="assets/Yoh-Kawano-CV-Bio.docx">${about['cv-label']}</a></footer>`;

Object.keys(categories).forEach(category => {
  const target = document.querySelector(`[href="index.html#${categories[category].label.toLowerCase()}"] .count`);
  if (target) target.textContent = String(cards.filter(card => card.categories.includes(category)).length).padStart(2, '0');
});

}).catch(() => {
  document.querySelector('#about-content').innerHTML = `<p class="load-error">${window.portfolioText('Could not load content.md. Please try again from the published site.')}</p>`;
});
