document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');
  const footerYear = document.getElementById('footerYear');

  const storedTheme = localStorage.getItem('theme');
  const preferredDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  body.setAttribute('data-theme', storedTheme || (preferredDark ? 'dark' : 'light'));

  const updateThemeIcon = () => {
    if (!themeToggle) return;
    const dark = body.getAttribute('data-theme') === 'dark';
    themeToggle.textContent = dark ? '☀' : '◐';
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };
  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon();
    });
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      siteNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', siteNav.classList.contains('open') ? 'true' : 'false');
    });
  }

  const page = body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === page) link.classList.add('active');
  });

  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

  const searchInput = document.getElementById('publicationSearch');
  if (searchInput) {
    const publications = [...document.querySelectorAll('[data-publication]')];
    const yearGroups = [...document.querySelectorAll('[data-year-group]')];
    const sections = [...document.querySelectorAll('[data-publication-section]')];
    const noResults = document.getElementById('noPublicationResults');

    const runSearch = () => {
      const q = searchInput.value.trim().toLowerCase();
      let visibleCount = 0;
      publications.forEach(pub => {
        const matches = !q || pub.textContent.toLowerCase().includes(q);
        pub.style.display = matches ? '' : 'none';
        if (matches) visibleCount += 1;
      });
      yearGroups.forEach(group => {
        group.style.display = group.querySelector('[data-publication]:not([style*="display: none"])') ? '' : 'none';
      });
      sections.forEach(section => {
        const hasVisibleGroup = [...section.querySelectorAll('[data-year-group]')].some(group => group.style.display !== 'none');
        section.style.display = hasVisibleGroup ? '' : 'none';
      });
      if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    };
    searchInput.addEventListener('input', runSearch);
  }
});
