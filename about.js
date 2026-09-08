window.loadPortfolioContent().then(({ about, cards, categories }) => {
const aboutRoot = document.querySelector('#about-content');
const dot = category => `<i class="dot dot-${category}" aria-hidden="true"></i>`;

aboutRoot.innerHTML = `
  <section class="about-hero">
    <div class="portrait"><img src="assets/yoh.png" alt="Yoh" /></div>
    <div class="about-intro"><p class="eyebrow">${about.eyebrow}</p><h1>${about.title}</h1><p class="large-copy">${about.lead}</p><p>${about.intro}</p></div>
  </section>
  <section class="about-section statement"><p class="section-kicker">The work <span class="dot dot-film"></span></p><p class="statement-copy">${about.statement}</p></section>
  ${about.sections.map(section => `<section class="about-section two-column"><div><p class="section-kicker">${section.label}</p><h2>${section.title}</h2></div><div class="prose">${section.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}</div></section>`).join('')}
  <section class="about-section film-section"><p class="section-kicker">${about.worksLabel}</p><div class="film-grid">${about.works.map(work => `<article><p>${work.year}</p><h2><em>${work.title}</em></h2><span>${work.role}</span><p>${work.text}</p></article>`).join('')}</div></section>
  <section class="about-section two-column education"><div><p class="section-kicker">${about.educationLabel}</p><h2>${about.educationTitle}</h2></div><div class="timeline">${about.education.map(([year, text]) => `<p><span>${year}</span>${text}</p>`).join('')}</div></section>
  <footer class="about-footer"><p>${about.footer}</p><a href="assets/Yoh-Kawano-CV-Bio.docx">${about.cvLabel}</a></footer>`;

Object.keys(categories).forEach(category => {
  const target = document.querySelector(`[href="index.html#${categories[category].label.toLowerCase()}"] .count`);
  if (target) target.innerHTML = `${dot(category)}${String(cards.filter(card => card.category === category).length).padStart(2, '0')}`;
});
}).catch(() => {
  document.querySelector('#about-content').innerHTML = '<p class="load-error">Could not load content.md. Please try again from the published site.</p>';
});
