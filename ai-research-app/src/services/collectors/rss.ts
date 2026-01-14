import Parser from 'rss-parser';
import { prisma } from '@/lib/prisma';

const parser = new Parser();

export interface RSSFeed {
  name: string;
  url: string;
  category: string;
}

// AI関連の主要RSSフィード
export const AI_RSS_FEEDS: RSSFeed[] = [
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'Generative AI',
  },
  {
    name: 'DeepMind Blog',
    url: 'https://deepmind.google/blog/rss.xml',
    category: 'Research',
  },
  {
    name: 'Anthropic News',
    url: 'https://www.anthropic.com/news/rss.xml',
    category: 'Generative AI',
  },
  {
    name: 'Hugging Face Blog',
    url: 'https://huggingface.co/blog/feed.xml',
    category: 'ML Infrastructure',
  },
];

export async function fetchRSSFeed(feed: RSSFeed) {
  try {
    const parsedFeed = await parser.parseURL(feed.url);
    const articles = [];

    for (const item of parsedFeed.items) {
      if (!item.link || !item.title) continue;

      const existingArticle = await prisma.article.findUnique({
        where: { url: item.link },
      });

      if (existingArticle) continue;

      const article = await prisma.article.create({
        data: {
          title: item.title,
          url: item.link,
          content: item.contentSnippet || item.content,
          author: item.creator || item.author,
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          source: feed.name,
          category: feed.category,
        },
      });

      articles.push(article);
    }

    return {
      source: feed.name,
      articlesCount: articles.length,
      success: true,
    };
  } catch (error) {
    console.error(`Error fetching RSS feed ${feed.name}:`, error);
    return {
      source: feed.name,
      articlesCount: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function fetchAllRSSFeeds() {
  const results = await Promise.all(
    AI_RSS_FEEDS.map(feed => fetchRSSFeed(feed))
  );
  return results;
}
