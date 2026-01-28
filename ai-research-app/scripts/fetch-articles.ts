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

// noteから記事を取得
async function fetchNoteArticles(): Promise<Article[]> {
  try {
    const keywords = ['AI', '機械学習', 'ChatGPT'];
    const articles: Article[] = [];

    // noteの検索APIを使用（v3）
    for (const keyword of keywords) {
      const url = `https://note.com/api/v3/searches?context=note&q=${encodeURIComponent(keyword)}&size=10&start=0&sort=new`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
          'Referer': 'https://note.com/',
          'Origin': 'https://note.com',
        },
      });

      if (!response.ok) {
        console.log(`note API returned ${response.status} for keyword: ${keyword}`);
        continue;
      }

      const data = await response.json();

      // 検索APIのレスポンス構造に対応
      const contents = data.data?.notes?.contents || data.data?.contents || [];

      for (const item of contents) {
        // noteの記事URLは https://note.com/{username}/n/{key} 形式
        const noteUrl = item.noteUrl || `https://note.com/${item.user?.urlname}/n/${item.key}`;

        articles.push({
          id: `note-${item.id}`,
          title: item.name || item.title,
          url: noteUrl,
          content: item.body?.substring(0, 200) || item.excerpt,
          author: item.user?.nickname || item.user?.name || item.user?.urlname,
          publishedAt: new Date(item.publishAt || item.publish_at || item.created_at),
          fetchedAt: new Date(),
          source: 'note',
          category: 'Tech Article',
          tags: [],
        });
      }

      // APIレート制限を避けるため少し待機
      await new Promise(resolve => setTimeout(resolve, 500));
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
