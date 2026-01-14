import { NextResponse } from 'next/server';
import { fetchAllRSSFeeds } from '@/services/collectors/rss';
import { fetchHackerNews } from '@/services/collectors/hackernews';
import { fetchArxivPapers } from '@/services/collectors/arxiv';

export async function POST() {
  try {
    console.log('Starting collection...');

    const [rssResults, hnResult, arxivResult] = await Promise.all([
      fetchAllRSSFeeds(),
      fetchHackerNews(),
      fetchArxivPapers(),
    ]);

    const totalArticles = [
      ...rssResults,
      hnResult,
      arxivResult,
    ].reduce((sum, result) => sum + result.articlesCount, 0);

    return NextResponse.json({
      success: true,
      totalArticles,
      results: {
        rss: rssResults,
        hackerNews: hnResult,
        arxiv: arxivResult,
      },
    });
  } catch (error) {
    console.error('Collection error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
