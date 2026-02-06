const Parser = require('rss-parser');
const { KYNORA_KEYWORDS } = require('./config');

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'AI-News-Aggregator/1.0',
  },
});

/**
 * Fetch articles from a single RSS feed.
 */
async function fetchFeed(feed) {
  try {
    const result = await parser.parseURL(feed.url);
    return (result.items || []).map((item) => ({
      title: item.title || '',
      link: item.link || '',
      description: stripHtml(item.contentSnippet || item.content || item.summary || ''),
      pubDate: item.pubDate || item.isoDate || null,
      source: feed.name,
      category: feed.category,
      image: extractImage(item),
    }));
  } catch (err) {
    console.error(`Error fetching feed "${feed.name}": ${err.message}`);
    return [];
  }
}

/**
 * Fetch articles from multiple feeds concurrently.
 */
async function fetchAllFeeds(feeds) {
  const results = await Promise.allSettled(feeds.map(fetchFeed));
  const articles = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    }
  }
  return articles;
}

/**
 * Calculate a relevance score for Kynora niche topics.
 */
function calculateKynoraRelevance(article) {
  const text = `${article.title} ${article.description}`.toLowerCase();
  let score = 0;
  for (const keyword of KYNORA_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      // Title matches are worth more
      if (article.title.toLowerCase().includes(keyword.toLowerCase())) {
        score += 3;
      } else {
        score += 1;
      }
    }
  }
  return score;
}

/**
 * Sort articles by date (newest first) and deduplicate by title similarity.
 */
function processArticles(articles) {
  // Sort by date
  articles.sort((a, b) => {
    const dateA = a.pubDate ? new Date(a.pubDate) : new Date(0);
    const dateB = b.pubDate ? new Date(b.pubDate) : new Date(0);
    return dateB - dateA;
  });

  // Deduplicate by normalized title
  const seen = new Set();
  return articles.filter((article) => {
    const normalized = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seen.has(normalized) || !article.title.trim()) return false;
    seen.add(normalized);
    return true;
  });
}

/**
 * Filter articles from the last N days.
 */
function filterByDays(articles, days = 2) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return articles.filter((article) => {
    if (!article.pubDate) return true;
    return new Date(article.pubDate) >= cutoff;
  });
}

/**
 * Strip HTML tags from text.
 */
function stripHtml(text) {
  return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 300);
}

/**
 * Try to extract an image URL from a feed item.
 */
function extractImage(item) {
  if (item.enclosure && item.enclosure.url) return item.enclosure.url;
  if (item['media:content'] && item['media:content']['$'] && item['media:content']['$'].url) {
    return item['media:content']['$'].url;
  }
  // Try to find image in content
  const content = item.content || item['content:encoded'] || '';
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/);
  return match ? match[1] : null;
}

module.exports = { fetchFeed, fetchAllFeeds, calculateKynoraRelevance, processArticles, filterByDays };
