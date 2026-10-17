window.loadPortfolioContent().then(({ about, cards, categories }) => {
const aboutRoot = document.querySelector('#about-content');
const marker = category => `<i class="marker marker-${category}" aria-hidden="true"></i>`;
const places = (about.journey || '').split('|').map(place => place.trim()).filter(Boolean);
const points = [22, 42, 18, 35, 16, 30];
const journey = places.length ? `<figure class="journey" aria-label="${about['journey-label']}"><svg viewBox="0 0 60 312" preserveAspectRatio="none" aria-hidden="true"><path d="M22 24 C22 49 42 51 42 76 S18 103 18 128 S35 155 35 180 S16 207 16 232 S30 259 30 284" />${places.map((place, index) => `<circle class="${index === places.length - 1 ? 'journey-current' : ''}" cx="${points[index] || 22}" cy="${24 + index * 52}" r="3" />`).join('')}</svg><ol>${places.map((place, index) => { const [city, country] = place.split(',').map(part => part.trim()); return `<li${index === places.length - 1 ? ' aria-current="location"' : ''}><span class="journey-city">${city}</span><span class="journey-country">${country || ''}${index === places.length - 1 ? ` · ${about['journey-now']}` : ''}</span></li>`; }).join('')}</ol></figure>` : '';

aboutRoot.innerHTML = `
  <section class="about-hero">
    <div class="portrait-journey"><div class="portrait"><img src="${about.portrait}" alt="Yoh" /></div>${journey}</div>
    <div class="about-intro"><p class="eyebrow">${about.eyebrow}</p><h1>${about.title.replace(/([.。])$/, '<span class="title-period">$1</span>')}</h1><p class="large-copy">${about.lead}</p><p>${about.intro}</p></div>
  </section>
  <section class="about-section statement"><p class="section-kicker">${window.portfolioText('The work')} ${marker('project')}</p><p class="statement-copy">${about.statement}</p></section>
  ${about.sections.map(section => `<section class="about-section two-column"><div><p class="section-kicker">${window.portfolioText(section.label)}</p><h2>${section.title}</h2></div><div class="prose">${section.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}</div></section>`).join('')}
  <section class="about-section film-section"><p class="section-kicker">${about['works-label']}</p><div class="film-grid">${about.works.map(work => `<article><p>${work.year}</p><h2><em>${work.title}</em></h2><span>${work.role}</span><p>${work.text}</p></article>`).join('')}</div></section>
  <section class="about-section two-column education"><div><p class="section-kicker">${about['education-label']}</p><h2>${about['education-title']}</h2></div><div class="timeline">${about.education.map(([year, text]) => `<p><span>${year}</span>${text}</p>`).join('')}</div></section>
  <footer class="about-footer"><p>${about.footer}</p><a href="assets/Yoh-Kawano-CV-Bio.docx">${about['cv-label']}</a></footer>`;

Object.keys(categories).forEach(category => {
  const target = document.querySelector(`[href="index.html#${categories[category].label.toLowerCase()}"] .count`);
  if (target) target.textContent = String(cards.filter(card => card.category === category).length).padStart(2, '0');
});

}).catch(() => {
  document.querySelector('#about-content').innerHTML = `<p class="load-error">${window.portfolioText('Could not load content.md. Please try again from the published site.')}</p>`;
});
