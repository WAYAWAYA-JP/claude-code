import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface Article {
  id: string;
  title: string;
  url: string;
  content?: string;
  summary?: string;
  author?: string;
  publishedAt: Date;
  fetchedAt: Date;
  source: string;
  category: string;
  tags: string[];
}

// Zennから記事を取得
async function fetchZennArticles(): Promise<Article[]> {
  try {
    const topics = ['ai', '機械学習', 'chatgpt', 'llm'];
    const articles: Article[] = [];

    for (const topic of topics) {
      const url = `https://zenn.dev/api/articles?topic=${encodeURIComponent(topic)}&count=10&order=latest`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.articles) {
        for (const item of data.articles) {
          articles.push({
            id: `zenn-${item.id}`,
            title: item.title,
            url: `https://zenn.dev${item.path}`,
            content: item.body_letters_count ? `${item.body_letters_count}文字` : undefined,
            author: item.user?.name || item.user?.username,
            publishedAt: new Date(item.published_at),
            fetchedAt: new Date(),
            source: 'Zenn',
            category: 'Tech Article',
            tags: [],
          });
        }
      }
    }

    // 重複を削除
    const uniqueArticles = Array.from(
      new Map(articles.map(a => [a.id, a])).values()
    );

    return uniqueArticles.slice(0, 20);
  } catch (error) {
    console.error('Error fetching Zenn articles:', error);
    return [];
  }
}

// Qiitaから記事を取得
async function fetchQiitaArticles(): Promise<Article[]> {
  try {
    const tags = ['AI', '機械学習', 'ChatGPT', 'LLM'];
    const articles: Article[] = [];

    for (const tag of tags) {
      const url = `https://qiita.com/api/v2/items?query=tag:${encodeURIComponent(tag)}&per_page=10`;
      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        for (const item of data) {
          articles.push({
            id: `qiita-${item.id}`,
            title: item.title,
            url: item.url,
            content: item.body?.substring(0, 200),
            author: item.user?.id,
            publishedAt: new Date(item.created_at),
            fetchedAt: new Date(),
            source: 'Qiita',
            category: 'Tech Article',
            tags: item.tags?.map((t: any) => t.name) || [],
          });
        }
      }
    }

    // 重複を削除
    const uniqueArticles = Array.from(
      new Map(articles.map(a => [a.id, a])).values()
    );

    return uniqueArticles.slice(0, 20);
  } catch (error) {
    console.error('Error fetching Qiita articles:', error);
    return [];
  }
}

// AIクリエイターのnote ID一覧
const NOTE_CREATORS = [
  { id: 'kuzukumasan9', name: 'クズなくまさん' },
  { id: 'npaka', name: 'npaka' },
  { id: 'yaoyoroztech', name: 'YaroTech' },
  { id: 'ai_image_journey', name: 'きまま / Easygoi...' },
  { id: 'shikism', name: 'Shiki' },
  { id: 'yuki_ii', name: 'Yuki' },
{ id: 'monetize_tips', name: 'monetize_tips' },
  { id: 'hiro_seki', name: 'hiro_seki' },
];

// RSSからアイテムをパースするヘルパー関数
function parseRssItems(xml: string, authorName: string): Article[] {
  const articles: Article[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];

    const titleMatch = itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
                       itemContent.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
    const descMatch = itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
                      itemContent.match(/<description>([\s\S]*?)<\/description>/);
    const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const guidMatch = itemContent.match(/<guid[^>]*>([\s\S]*?)<\/guid>/);

    if (titleMatch && linkMatch) {
      const title = titleMatch[1].trim();
      const url = linkMatch[1].trim();
      const description = descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim().substring(0, 200) : undefined;
      const pubDate = pubDateMatch ? new Date(pubDateMatch[1].trim()) : new Date();
      const guid = guidMatch ? guidMatch[1].trim() : url;

      // IDはURLから生成
      const noteId = url.match(/\/n\/([a-zA-Z0-9]+)/)?.[1] || guid;

      articles.push({
        id: `note-${noteId}`,
        title,
        url,
        content: description,
        author: authorName,
        publishedAt: pubDate,
        fetchedAt: new Date(),
        source: 'note',
        category: 'Tech Article',
        tags: [],
      });
    }
  }

  return articles;
}

// noteから記事を取得（RSSフィードを使用）
async function fetchNoteArticles(): Promise<Article[]> {
  const articles: Article[] = [];

  for (const creator of NOTE_CREATORS) {
    try {
      const rssUrl = `https://note.com/${creator.id}/rss`;

      const response = await fetch(rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AI-Research-App/1.0)',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        },
      });

      if (!response.ok) {
        console.log(`  - ${creator.name}: ${response.status} エラー`);
        continue;
      }

      const xml = await response.text();
      const creatorArticles = parseRssItems(xml, creator.name);

      // 各クリエイターから最新3件を取得
      articles.push(...creatorArticles.slice(0, 3));
      console.log(`  - ${creator.name}: ${Math.min(creatorArticles.length, 3)}件`);

      // レート制限を避けるため少し待機
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.log(`  - ${creator.name}: 取得失敗`);
    }
  }

  // 重複を削除
  const uniqueArticles = Array.from(
    new Map(articles.map(a => [a.id, a])).values()
  );

  // 日付順にソートして最新30件を返す
  return uniqueArticles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 30);
}

async function main() {
  console.log('🚀 記事の取得を開始します...\n');

  // 既存の記事を読み込む
  const dataPath = join(process.cwd(), 'data', 'articles.json');
  let existingArticles: Article[] = [];

  if (existsSync(dataPath)) {
    try {
      const fileContent = readFileSync(dataPath, 'utf-8');
      existingArticles = JSON.parse(fileContent);
      console.log(`📂 既存記事: ${existingArticles.length}件\n`);
    } catch (error) {
      console.log('⚠️  既存ファイルの読み込みに失敗しました。新規作成します。\n');
    }
  }

  console.log('📝 Zennから記事を取得中...');
  const zennArticles = await fetchZennArticles();
  console.log(`✓ Zenn: ${zennArticles.length}件\n`);

  console.log('📝 Qiitaから記事を取得中...');
  const qiitaArticles = await fetchQiitaArticles();
  console.log(`✓ Qiita: ${qiitaArticles.length}件\n`);

  console.log('📝 noteから記事を取得中...');
  const noteArticles = await fetchNoteArticles();
  console.log(`✓ note: ${noteArticles.length}件\n`);

  // 新しく取得した記事を結合
  const newArticles = [
    ...zennArticles,
    ...qiitaArticles,
    ...noteArticles,
  ];

  // 新規記事が取得できなかった場合は既存記事をそのまま保持
  let recentArticles = existingArticles;

  // 新規記事が1件以上取得できた場合のみ、古い記事を削除
  if (newArticles.length > 0) {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    threeDaysAgo.setHours(0, 0, 0, 0);

    recentArticles = existingArticles.filter(article => {
      const fetchedDate = new Date(article.fetchedAt);
      return fetchedDate >= threeDaysAgo;
    });

    if (recentArticles.length < existingArticles.length) {
      console.log(`🗑️  ${existingArticles.length - recentArticles.length}件の古い記事を削除しました\n`);
    }
  } else {
    console.log('⚠️  新規記事が取得できませんでした。既存記事を保持します。\n');
  }

  // 既存記事と新規記事をマージ（重複を除く）
  const allArticlesMap = new Map<string, Article>();

  // 既存記事を追加
  for (const article of recentArticles) {
    allArticlesMap.set(article.id, article);
  }

  // 新規記事を追加（同じIDがあれば上書き）
  for (const article of newArticles) {
    allArticlesMap.set(article.id, article);
  }

  const allArticles = Array.from(allArticlesMap.values());

  // 日付順にソート（fetchedAtの新しい順）
  allArticles.sort((a, b) =>
    new Date(b.fetchedAt).getTime() - new Date(a.fetchedAt).getTime()
  );

  // ディレクトリを作成（存在しない場合）
  mkdirSync(join(process.cwd(), 'data'), { recursive: true });
  mkdirSync(join(process.cwd(), 'public'), { recursive: true });

  // JSONファイルに保存（2箇所）
  const publicDataPath = join(process.cwd(), 'public', 'articles.json');

  writeFileSync(dataPath, JSON.stringify(allArticles, null, 2), 'utf-8');
  writeFileSync(publicDataPath, JSON.stringify(allArticles, null, 2), 'utf-8');

  console.log(`✨ 完了！合計 ${allArticles.length}件の記事を保存しました`);
  console.log(`   新規取得: ${newArticles.length}件`);
  console.log(`   保持済み: ${recentArticles.length}件`);
  console.log(`📁 保存先: ${dataPath}`);
  console.log(`📁 公開用: ${publicDataPath}`);
}

main().catch(error => {
  console.error('エラーが発生しました:', error);
  process.exit(1);
});
