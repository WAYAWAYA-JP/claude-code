#!/usr/bin/env tsx

import { fetchAllRSSFeeds } from '../src/services/collectors/rss';
import { fetchHackerNews } from '../src/services/collectors/hackernews';
import { fetchArxivPapers } from '../src/services/collectors/arxiv';

async function main() {
  console.log('Starting AI research data collection...\n');

  console.log('📰 Fetching RSS feeds...');
  const rssResults = await fetchAllRSSFeeds();
  rssResults.forEach(result => {
    if (result.success) {
      console.log(`✓ ${result.source}: ${result.articlesCount} new articles`);
    } else {
      console.log(`✗ ${result.source}: ${result.error}`);
    }
  });

  console.log('\n🔶 Fetching Hacker News...');
  const hnResult = await fetchHackerNews();
  if (hnResult.success) {
    console.log(`✓ ${hnResult.source}: ${hnResult.articlesCount} new articles`);
  } else {
    console.log(`✗ ${hnResult.source}: ${hnResult.error}`);
  }

  console.log('\n📚 Fetching arXiv papers...');
  const arxivResult = await fetchArxivPapers();
  if (arxivResult.success) {
    console.log(`✓ ${arxivResult.source}: ${arxivResult.articlesCount} new articles`);
  } else {
    console.log(`✗ ${arxivResult.source}: ${arxivResult.error}`);
  }

  const totalArticles = [
    ...rssResults,
    hnResult,
    arxivResult,
  ].reduce((sum, result) => sum + result.articlesCount, 0);

  console.log(`\n✨ Collection complete! Total new articles: ${totalArticles}`);
}

main()
  .catch(error => {
    console.error('Error during collection:', error);
    process.exit(1);
  });
