import { readFileSync, existsSync } from 'fs';
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

// JSONファイルから記事を読み込む
export function loadArticles(): Article[] {
  try {
    const dataPath = join(process.cwd(), 'data', 'articles.json');

    if (existsSync(dataPath)) {
      const fileContent = readFileSync(dataPath, 'utf-8');
      const articles = JSON.parse(fileContent);
      console.log(`✓ ${articles.length}件の記事を読み込みました`);
      return articles;
    } else {
      console.log('⚠ articles.json が見つかりません。フォールバックデータを使用します。');
      return getFallbackArticles();
    }
  } catch (error) {
    console.error('記事の読み込みエラー:', error);
    return getFallbackArticles();
  }
}

// フォールバック用のサンプルデータ
function getFallbackArticles(): Article[] {
  return [
    {
      id: 'sample-1',
      title: 'ChatGPTを使った業務効率化の実例',
      url: 'https://zenn.dev',
      content: 'ChatGPTを活用して業務を効率化した具体的な事例を紹介します。',
      author: 'sample_user',
      publishedAt: new Date('2024-01-14'),
      fetchedAt: new Date(),
      source: 'Zenn',
      category: 'Tech Article',
      tags: ['ChatGPT', 'AI'],
    },
    {
      id: 'sample-2',
      title: 'LLMアプリケーション開発入門',
      url: 'https://qiita.com',
      content: '大規模言語モデルを使ったアプリケーション開発の基礎を学びます。',
      author: 'qiita_user',
      publishedAt: new Date('2024-01-13'),
      fetchedAt: new Date(),
      source: 'Qiita',
      category: 'Tech Article',
      tags: ['LLM', 'AI'],
    },
    {
      id: 'sample-3',
      title: 'AI時代のエンジニアリング',
      url: 'https://note.com',
      content: 'AIの発展により変化するエンジニアリングの未来について考察します。',
      author: 'note_user',
      publishedAt: new Date('2024-01-12'),
      fetchedAt: new Date(),
      source: 'note',
      category: 'Tech Article',
      tags: ['AI', 'エンジニアリング'],
    },
  ];
}

export const articlesData = loadArticles();
