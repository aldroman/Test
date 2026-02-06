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
];

// Niche feeds relevant to Kynora (conversational AI, chatbots, voice agents, NLP)
const KYNORA_NICHE_FEEDS = [
  {
    name: 'Voicebot.ai',
    url: 'https://voicebot.ai/feed/',
    category: 'kynora',
  },
  {
    name: 'Chatbot News Daily',
    url: 'https://chatbotnewsdaily.com/feed',
    category: 'kynora',
  },
  {
    name: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss/',
    category: 'kynora',
  },
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'kynora',
  },
  {
    name: 'Hugging Face Blog',
    url: 'https://huggingface.co/blog/feed.xml',
    category: 'kynora',
  },
];

// Keywords to filter/boost relevance for Kynora niche
const KYNORA_KEYWORDS = [
  'chatbot', 'voice agent', 'voice ai', 'conversational ai',
  'virtual assistant', 'natural language processing', 'nlp',
  'speech recognition', 'text to speech', 'tts', 'stt',
  'dialogue', 'dialog system', 'customer support ai',
  'voice bot', 'voicebot', 'chat agent', 'ai assistant',
  'large language model', 'llm', 'gpt', 'claude',
  'customer experience', 'contact center', 'call center',
  'sentiment analysis', 'intent recognition', 'nlu',
  'natural language understanding', 'rag', 'retrieval augmented',
  'fine-tuning', 'fine tuning', 'prompt engineering',
  'ai agent', 'agentic', 'multi-agent', 'tool use',
  'function calling', 'embeddings', 'vector database',
];

const CACHE_TTL_SECONDS = 30 * 60; // 30 minutes

module.exports = {
  GENERAL_AI_FEEDS,
  KYNORA_NICHE_FEEDS,
  KYNORA_KEYWORDS,
  CACHE_TTL_SECONDS,
};
