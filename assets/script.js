document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');
  const footerYear = document.getElementById('footerYear');
  const headerActions = document.querySelector('.header-actions');

  const siteBrand = document.querySelector('.site-brand');
  if (siteBrand) siteBrand.remove();

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

    const makeSocialLink = (href, label, iconMarkup, className) => {
      const link = document.createElement('a');
      link.className = `social-icon ${className}`;
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', label);
      link.setAttribute('title', label);
      link.innerHTML = iconMarkup;
      return link;
    };

    const linkedin = makeSocialLink(
      'https://www.linkedin.com/in/nakmouchemedfarouk/',
      'LinkedIn profile',
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="img"><path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.941v5.665H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/></svg>',
      'linkedin-icon'
    );

    const researchGate = makeSocialLink(
      'https://www.researchgate.net/profile/Mohammed-Farouk-Nakmouche',
      'ResearchGate profile',
      '<img src="https://cdn.simpleicons.org/researchgate/00CCBB" alt="" aria-hidden="true">',
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