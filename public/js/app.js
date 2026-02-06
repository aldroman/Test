(() => {
  'use strict';

  // State
  const state = {
    currentSection: 'general',
    general: { articles: [], page: 1, total: 0, loading: false },
    kynora: { articles: [], page: 1, total: 0, loading: false },
  };

  const LIMIT = 20;

  // DOM elements
  const $generalNews = document.getElementById('general-news');
  const $kynoraNews = document.getElementById('kynora-news');
  const $loading = document.getElementById('loading');
  const $errorState = document.getElementById('error-state');
  const $loadMoreGeneral = document.getElementById('load-more-general');
  const $loadMoreKynora = document.getElementById('load-more-kynora');
  const $refreshBtn = document.getElementById('refresh-btn');
  const $currentDate = document.getElementById('current-date');

  // Set current date
  const now = new Date();
  $currentDate.textContent = now.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // --- API ---
  async function fetchNews(section, page = 1) {
    const res = await fetch(`/api/news/${section}?page=${page}&limit=${LIMIT}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function refreshCache() {
    await fetch('/api/refresh', { method: 'POST' });
  }

  // --- Rendering ---
  function timeAgo(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const diff = (now - date) / 1000;
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
    if (diff < 172800) return 'ayer';
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  function getRelevanceLevel(score) {
    if (score >= 5) return { label: 'Alta relevancia', cls: 'high' };
    if (score >= 2) return { label: 'Media', cls: 'medium' };
    return { label: 'Explorar', cls: 'low' };
  }

  function createArticleCard(article, index, section) {
    const card = document.createElement('article');
    const isKynora = section === 'kynora';
    const isFeatured = index === 0 && state[section].page === 1;

    card.className = `article-card${isKynora ? ' kynora-card' : ''}${isFeatured ? ' featured' : ''}`;

    // Image section
    let imageHtml = '';
    if (article.image) {
      imageHtml = `<img class="card-image" src="${escapeHtml(article.image)}" alt="" loading="lazy" onerror="this.remove()">`;
    }

    // Relevance badge for Kynora
    let relevanceBadge = '';
    if (isKynora && article.relevanceScore !== undefined) {
      const rel = getRelevanceLevel(article.relevanceScore);
      relevanceBadge = `<span class="relevance-badge ${rel.cls}">${rel.label}</span>`;
    }

    const title = escapeHtml(article.title);
    const description = escapeHtml(article.description);
    const source = escapeHtml(article.source);
    const link = escapeHtml(article.link);
    const date = timeAgo(article.pubDate);

    if (isFeatured && article.image) {
      card.innerHTML = `
        ${imageHtml}
        <div class="card-content">
          ${relevanceBadge}
          <div class="card-meta">
            <span class="card-source">${source}</span>
            <span class="card-date">${date}</span>
          </div>
          <h3 class="card-title"><a href="${link}" target="_blank" rel="noopener">${title}</a></h3>
          <p class="card-description">${description}</p>
        </div>
      `;
    } else {
      card.innerHTML = `
        ${imageHtml}
        ${relevanceBadge}
        <div class="card-meta">
          <span class="card-source">${source}</span>
          <span class="card-date">${date}</span>
        </div>
        <h3 class="card-title"><a href="${link}" target="_blank" rel="noopener">${title}</a></h3>
        <p class="card-description">${description}</p>
      `;
    }

    return card;
  }

  function renderArticles(section) {
    const container = section === 'general' ? $generalNews : $kynoraNews;
    const data = state[section];
    const loadMoreBtn = section === 'general' ? $loadMoreGeneral : $loadMoreKynora;

    if (data.page === 1) {
      container.innerHTML = '';
    }

    if (data.articles.length === 0 && data.page === 1) {
      container.innerHTML = '<div class="empty-state">No se encontraron noticias recientes. Intenta actualizar.</div>';
      loadMoreBtn.style.display = 'none';
      return;
    }

    const startIndex = (data.page - 1) * LIMIT;
    data.articles.forEach((article, i) => {
      container.appendChild(createArticleCard(article, startIndex + i, section));
    });

    // Show/hide load more
    const totalShown = container.children.length;
    loadMoreBtn.style.display = totalShown < data.total ? 'inline-block' : 'none';
  }

  // --- Loading ---
  async function loadSection(section, page = 1) {
    const data = state[section];
    if (data.loading) return;
    data.loading = true;

    if (page === 1) {
      $loading.classList.remove('hidden');
      $errorState.style.display = 'none';
    }

    try {
      const result = await fetchNews(section, page);
      data.articles = result.articles;
      data.page = page;
      data.total = result.total;

      if (page === 1) {
        $loading.classList.add('hidden');
      }

      renderArticles(section);
    } catch (err) {
      console.error(`Error loading ${section}:`, err);
      if (page === 1) {
        $loading.classList.add('hidden');
        $errorState.style.display = 'block';
      }
    } finally {
      data.loading = false;
    }
  }

  // --- Tab Switching ---
  function switchSection(section) {
    state.currentSection = section;

    // Update tabs
    document.querySelectorAll('.tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.section === section);
    });

    // Update sections
    document.querySelectorAll('.section').forEach((s) => {
      s.classList.toggle('active', s.id === `section-${section}`);
    });

    // Load if needed
    const data = state[section];
    if (data.articles.length === 0 && !data.loading) {
      loadSection(section);
    }
  }

  // --- Events ---
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => switchSection(tab.dataset.section));
  });

  $loadMoreGeneral.addEventListener('click', () => {
    const data = state.general;
    loadSection('general', data.page + 1);
  });

  $loadMoreKynora.addEventListener('click', () => {
    const data = state.kynora;
    loadSection('kynora', data.page + 1);
  });

  $refreshBtn.addEventListener('click', async () => {
    $refreshBtn.classList.add('spinning');
    try {
      await refreshCache();
      // Reset and reload current section
      state.general = { articles: [], page: 1, total: 0, loading: false };
      state.kynora = { articles: [], page: 1, total: 0, loading: false };
      $generalNews.innerHTML = '';
      $kynoraNews.innerHTML = '';
      await loadSection(state.currentSection);
    } finally {
      $refreshBtn.classList.remove('spinning');
    }
  });

  // --- Utils ---
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Init ---
  loadSection('general');
})();
