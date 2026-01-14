import { prisma } from '@/lib/prisma';

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';
const AI_KEYWORDS = ['ai', 'machine learning', 'deep learning', 'llm', 'gpt', 'neural', 'openai', 'anthropic'];

interface HNItem {
  id: number;
  title?: string;
  url?: string;
  by?: string;
  time?: number;
  score?: number;
  text?: string;
}

async function fetchItem(id: number): Promise<HNItem | null> {
  try {
    const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching HN item ${id}:`, error);
    return null;
  }
}

function isAIRelated(title: string): boolean {
  const lowerTitle = title.toLowerCase();
  return AI_KEYWORDS.some(keyword => lowerTitle.includes(keyword));
}

export async function fetchHackerNews() {
  try {
    const response = await fetch(`${HN_API_BASE}/topstories.json`);
    const storyIds: number[] = await response.json();

    const topStories = storyIds.slice(0, 100);
    const articles = [];

    for (const storyId of topStories) {
      const item = await fetchItem(storyId);

      if (!item || !item.title || !item.url) continue;
      if (!isAIRelated(item.title)) continue;

      const existingArticle = await prisma.article.findUnique({
        where: { url: item.url },
      });

      if (existingArticle) continue;

      const article = await prisma.article.create({
        data: {
          title: item.title,
          url: item.url,
          author: item.by,
          publishedAt: item.time ? new Date(item.time * 1000) : new Date(),
          source: 'Hacker News',
          category: 'News',
        },
      });

      articles.push(article);
    }

    return {
      source: 'Hacker News',
      articlesCount: articles.length,
      success: true,
    };
  } catch (error) {
    console.error('Error fetching Hacker News:', error);
    return {
      source: 'Hacker News',
      articlesCount: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
