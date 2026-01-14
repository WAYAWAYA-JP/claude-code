import { writeFileSync, mkdirSync } from 'fs';
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

// noteから記事を取得
async function fetchNoteArticles(): Promise<Article[]> {
  try {
    const hashtags = ['AI', '機械学習', 'ChatGPT'];
    const articles: Article[] = [];

    for (const hashtag of hashtags) {
      const url = `https://note.com/api/v2/hashtags/${encodeURIComponent(hashtag)}/notes?order=trend`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.data?.contents) {
        for (const item of data.data.contents) {
          articles.push({
            id: `note-${item.id}`,
            title: item.name,
            url: `https://note.com/n/${item.key}`,
            content: item.body?.substring(0, 200),
            author: item.user?.nickname || item.user?.urlname,
            publishedAt: new Date(item.publishAt),
            fetchedAt: new Date(),
            source: 'note',
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
    console.error('Error fetching note articles:', error);
    return [];
  }
}

async function main() {
  console.log('🚀 記事の取得を開始します...\n');

  console.log('📝 Zennから記事を取得中...');
  const zennArticles = await fetchZennArticles();
  console.log(`✓ Zenn: ${zennArticles.length}件\n`);

  console.log('📝 Qiitaから記事を取得中...');
  const qiitaArticles = await fetchQiitaArticles();
  console.log(`✓ Qiita: ${qiitaArticles.length}件\n`);

  console.log('📝 noteから記事を取得中...');
  const noteArticles = await fetchNoteArticles();
  console.log(`✓ note: ${noteArticles.length}件\n`);

  // すべての記事を結合
  const allArticles = [
    ...zennArticles,
    ...qiitaArticles,
    ...noteArticles,
  ];

  // 日付順にソート
  allArticles.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // ディレクトリを作成（存在しない場合）
  mkdirSync(join(process.cwd(), 'data'), { recursive: true });
  mkdirSync(join(process.cwd(), 'public'), { recursive: true });

  // JSONファイルに保存（2箇所）
  const dataPath = join(process.cwd(), 'data', 'articles.json');
  const publicDataPath = join(process.cwd(), 'public', 'articles.json');

  writeFileSync(dataPath, JSON.stringify(allArticles, null, 2), 'utf-8');
  writeFileSync(publicDataPath, JSON.stringify(allArticles, null, 2), 'utf-8');

  console.log(`✨ 完了！合計 ${allArticles.length}件の記事を取得しました`);
  console.log(`📁 保存先: ${dataPath}`);
  console.log(`📁 公開用: ${publicDataPath}`);
}

main().catch(error => {
  console.error('エラーが発生しました:', error);
  process.exit(1);
});
