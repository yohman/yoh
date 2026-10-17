(() => {
  const language = new URLSearchParams(location.search).get('lang') === 'ja' ? 'ja' : 'en';
  window.portfolioLanguage = language;
  const translations = {
    'All work': 'すべて', Courses: '授業', Projects: 'プロジェクト', Films: '映画', Hobbies: '趣味', Zemi: 'ゼミ',
    'About Yoh': 'Yohについて', 'The work': '活動について', Now: '現在', Teaching: '教育', 'Before Reitaku': '麗澤大学以前',
    'Visualizing spatial stories, public data, and ways of learning.': '場所の物語、公共のデータ、学びのかたちを可視化する。',
    '← Index': '← 一覧へ', 'Visit project': 'サイトを見る', 'Read about': '詳しく見る：', Visit: 'サイトを見る：',
    'Could not load content.md. Please try again from the published site.': 'コンテンツを読み込めませんでした。ページを再読み込みしてください。'
  };
  window.portfolioText = text => language === 'ja' ? translations[text] || text : text;
  document.documentElement.lang = language;
  document.title = language === 'ja' ? (location.pathname.endsWith('about.html') ? 'Yohについて' : 'Yoh — 授業・プロジェクト・映画') : document.title;
  document.querySelectorAll('.sidebar nav, .sidebar-note, .wordmark').forEach(root => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const trimmed = node.textContent.trim();
      if (translations[trimmed] && language === 'ja') node.textContent = node.textContent.replace(trimmed, translations[trimmed]);
    }
  });
  document.querySelector('.wordmark').setAttribute('aria-label', window.portfolioText('About Yoh'));
  document.querySelector('nav').setAttribute('aria-label', language === 'ja' ? 'サイトメニュー' : 'Site navigation');
  const toggle = document.createElement('div');
  toggle.className = 'language-toggle';
  toggle.setAttribute('role', 'group');
  toggle.setAttribute('aria-label', language === 'ja' ? '言語' : 'Language');
  toggle.innerHTML = ['en', 'ja'].map(code => {
    const url = new URL(location.href);
    url.searchParams.set('lang', code);
    return `<a href="${url.pathname}${url.search}${url.hash}" lang="${code}" ${code === language ? 'aria-current="true"' : ''}>${code === 'en' ? 'EN' : 'JP'}</a>`;
  }).join('<span aria-hidden="true">/</span>');
  document.querySelector('.sidebar nav').before(toggle);
  // Preserve the selected language on navigation and after filters change the hash.
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (link.closest('.language-toggle')) url.hash = location.hash;
    else if (url.origin === location.origin && /\/(index|about)\.html$/.test(url.pathname)) url.searchParams.set('lang', language);
    link.href = url.href;
  });
})();
