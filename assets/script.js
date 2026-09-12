document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');
  const footerYear = document.getElementById('footerYear');
  const headerActions = document.querySelector('.header-actions');

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

  /* Shared header profile links across every page. */
  if (headerActions) {
    const cvNavLink = siteNav ? siteNav.querySelector('a[href="cv.pdf"]') : null;
    if (cvNavLink) {
      cvNavLink.remove();
      cvNavLink.className = 'mini-link cv-link';
      cvNavLink.textContent = 'CV';
      cvNavLink.setAttribute('aria-label', 'Open CV');
      headerActions.insertBefore(cvNavLink, headerActions.firstChild);
    }

    const scholarLink = headerActions.querySelector('a[href*="scholar.google.com"]');
    if (scholarLink) {
      scholarLink.className = 'social-icon scholar-icon';
      scholarLink.setAttribute('aria-label', 'Google Scholar profile');
      scholarLink.setAttribute('title', 'Google Scholar');
      scholarLink.innerHTML = '<img src="https://cdn.simpleicons.org/googlescholar/4285F4" alt="" aria-hidden="true">';
    }

    const makeSocialLink = (href, label, iconUrl, className) => {
      const link = document.createElement('a');
      link.className = `social-icon ${className}`;
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', label);
      link.setAttribute('title', label);
      link.innerHTML = `<img src="${iconUrl}" alt="" aria-hidden="true">`;
      return link;
    };

    const linkedin = makeSocialLink(
      'https://www.linkedin.com/in/nakmouchemedfarouk/',
      'LinkedIn profile',
      'https://cdn.simpleicons.org/linkedin/0A66C2',
      'linkedin-icon'
    );

    const researchGate = makeSocialLink(
      'https://www.researchgate.net/profile/Mohammed-Farouk-Nakmouche',
      'ResearchGate profile',
      'https://cdn.simpleicons.org/researchgate/00CCBB',
      'researchgate-icon'
    );

    if (themeToggle) {
      headerActions.insertBefore(linkedin, themeToggle);
      headerActions.insertBefore(researchGate, themeToggle);
    } else {
      headerActions.append(linkedin, researchGate);
    }
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
        const hasVisible = [...group.querySelectorAll('[data-publication]')].some(pub => pub.style.display !== 'none');
        group.style.display = hasVisible ? '' : 'none';
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
