import { prisma } from '@/lib/prisma';
import * as cheerio from 'cheerio';

const ARXIV_API_BASE = 'http://export.arxiv.org/api/query';

interface ArxivEntry {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: Date;
  link: string;
  category: string;
}

function parseArxivResponse(xml: string): ArxivEntry[] {
  const $ = cheerio.load(xml, { xmlMode: true });
  const entries: ArxivEntry[] = [];

  $('entry').each((_, entry) => {
    const $entry = $(entry);
    const id = $entry.find('id').text();
    const title = $entry.find('title').text().replace(/\s+/g, ' ').trim();
    const summary = $entry.find('summary').text().replace(/\s+/g, ' ').trim();
    const published = new Date($entry.find('published').text());
    const link = $entry.find('link[type="text/html"]').attr('href') || id;

    const authors: string[] = [];
    $entry.find('author name').each((_, name) => {
      authors.push($(name).text());
    });

    const primaryCategory = $entry.find('arxiv\\:primary_category').attr('term') || 'cs.AI';
    let category = 'Research';

    if (primaryCategory.includes('cs.CL') || primaryCategory.includes('cs.AI')) {
      category = 'NLP';
    } else if (primaryCategory.includes('cs.CV')) {
      category = 'Computer Vision';
    } else if (primaryCategory.includes('cs.LG')) {
      category = 'Research';
    }

    entries.push({
      id,
      title,
      summary,
      authors,
      published,
      link,
      category,
    });
  });

  return entries;
}

export async function fetchArxivPapers() {
  try {
    const searchQuery = 'cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV';
    const url = `${ARXIV_API_BASE}?search_query=${encodeURIComponent(searchQuery)}&start=0&max_results=50&sortBy=submittedDate&sortOrder=descending`;

    const response = await fetch(url);
    const xml = await response.text();
    const entries = parseArxivResponse(xml);

    const articles = [];

    for (const entry of entries) {
      const existingArticle = await prisma.article.findUnique({
        where: { url: entry.link },
      });

      if (existingArticle) continue;

      const article = await prisma.article.create({
        data: {
          title: entry.title,
          url: entry.link,
          content: entry.summary,
          author: entry.authors.join(', '),
          publishedAt: entry.published,
          source: 'arXiv',
          category: entry.category,
        },
      });

      articles.push(article);
    }

    return {
      source: 'arXiv',
      articlesCount: articles.length,
      success: true,
    };
  } catch (error) {
    console.error('Error fetching arXiv papers:', error);
    return {
      source: 'arXiv',
      articlesCount: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
