/* ============================================================
   SecureAI Blog — main.js
   Search, tag filter, hamburger nav, scroll effects, TOC
   ============================================================ */

(function () {
  'use strict';

  /* ── Theme toggle ── */
  const themeToggle = document.getElementById('themeToggle');
  const THEME_KEY   = 'secureai-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'light' ? '☀' : '☾';
      themeToggle.title = theme === 'light' ? 'Switch to Dark mode' : 'Switch to Light mode';
    }
  }

  // Load saved preference, default to dark
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next    = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ── Hamburger nav ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('nav-open');
    });
    // Close nav when a link is clicked (mobile)
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('nav-open'));
    });
  }

  /* ── Search ── */
  const searchInput = document.getElementById('searchInput');
  const postsGrid   = document.getElementById('postsGrid');
  const noResults   = document.getElementById('noResults');

  function filterCards() {
    if (!postsGrid) return;
    const query      = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeBtn  = document.querySelector('.filter-btn.active');
    const activeTag  = activeBtn ? activeBtn.dataset.tag : 'all';
    const cards      = postsGrid.querySelectorAll('.post-card');
    let   visible    = 0;

    cards.forEach(card => {
      const title   = (card.dataset.title   || '').toLowerCase();
      const tags    = (card.dataset.tags    || '').toLowerCase();
      const excerpt = (card.dataset.excerpt || '').toLowerCase();

      const matchesQuery = !query ||
        title.includes(query) ||
        tags.includes(query)  ||
        excerpt.includes(query);

      const matchesTag = activeTag === 'all' || tags.includes(activeTag);

      if (matchesQuery && matchesTag) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = visible === 0 ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }

  /* ── Tag filter buttons ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCards();
    });
  });

  /* ── Back to top button ── */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 320) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Reading progress bar (post pages only) ── */
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    function updateProgress() {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ── Table of Contents — active section highlight ── */
  const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length > 0) {
    const headings = Array.from(
      document.querySelectorAll('.post-content h2, .post-content h3')
    ).filter(h => h.id);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id   = entry.target.id;
          const link = document.querySelector(`.toc a[href="#${id}"]`);
          if (!link) return;
          if (entry.isIntersecting) {
            tocLinks.forEach(l => l.classList.remove('toc-active'));
            link.classList.add('toc-active');
          }
        });
      },
      {
        rootMargin: '0px 0px -60% 0px',
        threshold: 0
      }
    );

    headings.forEach(h => observer.observe(h));
  }

})();
