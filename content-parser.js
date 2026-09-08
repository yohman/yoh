window.loadPortfolioContent = async function loadPortfolioContent() {
  const response = await fetch('content.md');
  if (!response.ok) throw new Error('content.md could not be loaded');
  return parsePortfolioMarkdown(await response.text());
};

function parsePortfolioMarkdown(markdown) {
  const [aboutSource = '', cardsSource = ''] = markdown.split(/^# Portfolio cards\s*$/m);
  const about = parseAbout(aboutSource.replace(/^.*?^# About\s*$/ms, ''));
  const cards = parseCards(cardsSource);
  return {
    categories: {
      course: { label: 'Courses', singular: 'Course', colour: 'blue' },
      project: { label: 'Projects', singular: 'Project', colour: 'black' },
      film: { label: 'Films', singular: 'Film', colour: 'red' },
      hobby: { label: 'Hobbies', singular: 'Hobby', colour: 'violet' },
      zemi: { label: 'Zemi', singular: 'Zemi', colour: 'green' },
    },
    about,
    cards,
  };
}

function parseMetadata(source) {
  const match = source.match(/^\s*---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return [{}, source.trim()];
  const metadata = Object.fromEntries(match[1].split('\n').filter(Boolean).map(line => {
    const colon = line.indexOf(':');
    return [line.slice(0, colon).trim(), line.slice(colon + 1).trim()];
  }));
  return [metadata, match[2].trim()];
}

function getSection(source, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`^## ${escaped}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm'));
  return match ? match[1].trim() : '';
}

function paragraphs(source) {
  return source.split(/\n\s*\n/).map(text => text.replace(/\n/g, ' ').trim()).filter(Boolean);
}

function parseAbout(source) {
  const [meta] = parseMetadata(source);
  const sections = ['Now', 'Teaching', 'Before Reitaku'].map(label => {
    const [data, body] = parseMetadata(getSection(source, label));
    return { label, title: data.title || '', paragraphs: paragraphs(body) };
  });
  const works = [...getSection(source, 'Films & books').matchAll(/^### (.+)\n([\s\S]*?)(?=^### |(?![\s\S]))/gm)].map(match => {
    const [data, body] = parseMetadata(match[2]);
    return { title: match[1].trim(), year: data.year || '', role: data.role || '', text: paragraphs(body).join(' ') };
  });
  const education = getSection(source, 'Education').split('\n').filter(line => line.startsWith('- ')).map(line => {
    const [year, text] = line.slice(2).split('|');
    return [year.trim(), text.trim()];
  });
  return { ...meta, statement: paragraphs(getSection(source, 'Statement')).join(' '), sections, works, education };
}

function parseCards(source) {
  return [...source.matchAll(/^## (.+)\n([\s\S]*?)(?=^## |(?![\s\S]))/gm)].map(match => {
    const [data, body] = parseMetadata(match[2]);
    return { id: data.id, category: data.category, title: match[1].trim(), year: data.year, url: data.link || '', image: data.image || '', cue: data.cue || '', summary: data.summary || '', body: paragraphs(body) };
  }).filter(card => card.id && card.category && card.title);
}
