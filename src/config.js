// RSS feed sources for AI news aggregation

const GENERAL_AI_FEEDS = [
  {
    name: 'MIT Technology Review - AI',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed',
    category: 'general',
  },
  {
    name: 'The Verge - AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    category: 'general',
  },
  {
    name: 'TechCrunch - AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'general',
  },
  {
    name: 'Ars Technica - AI',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    category: 'general',
  },
  {
    name: 'VentureBeat - AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    category: 'general',
  },
  {
    name: 'AI News',
    url: 'https://www.artificialintelligence-news.com/feed/',
    category: 'general',
  },
  {
    name: 'Wired - AI',
    url: 'https://www.wired.com/feed/tag/ai/latest/rss',
    category: 'general',
  },
];

// Niche feeds relevant to Kynora (Blockchain + AI for Research IP protection)
const KYNORA_NICHE_FEEDS = [
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'kynora',
  },
  {
    name: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss/',
    category: 'kynora',
  },
  {
    name: 'Hugging Face Blog',
    url: 'https://huggingface.co/blog/feed.xml',
    category: 'kynora',
  },
  {
    name: 'ScienceDaily - AI',
    url: 'https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml',
    category: 'kynora',
  },
  {
    name: 'CoinDesk',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    category: 'kynora',
  },
  {
    name: 'The Block',
    url: 'https://www.theblock.co/rss.xml',
    category: 'kynora',
  },
  {
    name: 'Retraction Watch',
    url: 'https://retractionwatch.com/feed/',
    category: 'kynora',
  },
  {
    name: 'Scholarly Kitchen',
    url: 'https://scholarlykitchen.sspnet.org/feed/',
    category: 'kynora',
  },
  {
    name: 'DeepMind Blog',
    url: 'https://deepmind.google/blog/rss.xml',
    category: 'kynora',
  },
];

// Keywords to filter/boost relevance for Kynora niche
// Kynora = Blockchain + AI solution for IP in the research sector
const KYNORA_KEYWORDS = [
  // Research & Academia
  'scientific research', 'academic publishing', 'peer review', 'scholarly',
  'research integrity', 'scientific writing', 'preprint', 'open access',
  'research paper', 'scientific paper', 'manuscript', 'citation',
  'reproducibility', 'replication crisis', 'research fraud',
  'scientific misconduct', 'retraction', 'plagiarism detection',

  // AI for Research
  'prism', 'ai research tool', 'ai for science', 'ai writing',
  'ai paper', 'research assistant', 'literature review',
  'ai peer review', 'automated review', 'scientific ai',
  'ai lab', 'research automation', 'ai discovery',
  'ai publishing', 'research workflow',

  // Intellectual Property
  'intellectual property', 'ip protection', 'patent', 'copyright',
  'ip rights', 'ip management', 'ip theft', 'data ownership',
  'content provenance', 'attribution', 'digital rights',
  'licensing', 'royalties', 'creative commons',
  'ip strategy', 'trade secret',

  // Blockchain for IP & Research
  'blockchain research', 'blockchain ip', 'blockchain provenance',
  'decentralized science', 'desci', 'story protocol',
  'nft ip', 'token', 'smart contract', 'web3 ip',
  'immutable record', 'timestamping', 'proof of ownership',
  'on-chain', 'decentralized', 'blockchain verification',
  'camp network', 'prove ai',

  // AI + IP intersection
  'ai copyright', 'ai authorship', 'ai generated content',
  'ai ip', 'ai training data', 'data scraping',
  'watermarking', 'ai watermark', 'content authenticity',
  'ai regulation', 'ai governance', 'ai ethics',
  'fair use', 'generative ai ip', 'model ownership',
];

const CACHE_TTL_SECONDS = 30 * 60; // 30 minutes

module.exports = {
  GENERAL_AI_FEEDS,
  KYNORA_NICHE_FEEDS,
  KYNORA_KEYWORDS,
  CACHE_TTL_SECONDS,
};
