const express = require('express');
const path = require('path');
const NodeCache = require('node-cache');
const { fetchAllFeeds, calculateKynoraRelevance, processArticles, filterByDays } = require('./src/feeds');
const { GENERAL_AI_FEEDS, KYNORA_NICHE_FEEDS, CACHE_TTL_SECONDS } = require('./src/config');

const app = express();
const cache = new NodeCache({ stdTTL: CACHE_TTL_SECONDS });
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API: General AI news
app.get('/api/news/general', async (req, res) => {
  try {
    const cacheKey = 'general_news';
    let articles = cache.get(cacheKey);

    if (!articles) {
      const raw = await fetchAllFeeds(GENERAL_AI_FEEDS);
      articles = processArticles(raw);
      articles = filterByDays(articles, 3);
      cache.set(cacheKey, articles);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const start = (page - 1) * limit;
    const paginated = articles.slice(start, start + limit);

    res.json({
      total: articles.length,
      page,
      limit,
      articles: paginated,
    });
  } catch (err) {
    console.error('Error fetching general news:', err.message);
    res.status(500).json({ error: 'Failed to fetch general AI news' });
  }
});

// API: Kynora niche news (Blockchain + AI for Research IP)
app.get('/api/news/kynora', async (req, res) => {
  try {
    const cacheKey = 'kynora_news';
    let articles = cache.get(cacheKey);

    if (!articles) {
      const raw = await fetchAllFeeds(KYNORA_NICHE_FEEDS);
      let all = processArticles(raw);
      all = filterByDays(all, 7); // Wider window for niche content

      // Score and sort by relevance
      articles = all
        .map((article) => ({
          ...article,
          relevanceScore: calculateKynoraRelevance(article),
        }))
        .sort((a, b) => {
          // Primary: relevance, secondary: date
          if (b.relevanceScore !== a.relevanceScore) {
            return b.relevanceScore - a.relevanceScore;
          }
          const dateA = a.pubDate ? new Date(a.pubDate) : new Date(0);
          const dateB = b.pubDate ? new Date(b.pubDate) : new Date(0);
          return dateB - dateA;
        });

      cache.set(cacheKey, articles);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const start = (page - 1) * limit;
    const paginated = articles.slice(start, start + limit);

    res.json({
      total: articles.length,
      page,
      limit,
      articles: paginated,
    });
  } catch (err) {
    console.error('Error fetching Kynora news:', err.message);
    res.status(500).json({ error: 'Failed to fetch Kynora niche news' });
  }
});

// API: Force refresh cache
app.post('/api/refresh', (req, res) => {
  cache.flushAll();
  res.json({ message: 'Cache cleared. Next request will fetch fresh data.' });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AI News Aggregator running at http://localhost:${PORT}`);
});
