'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ArticleCard from '@/components/ArticleCard';
import FilterBar from '@/components/FilterBar';
import { mockArticles } from '@/lib/mockData';

interface Article {
  id: string;
  title: string;
  url: string;
  content?: string;
  summary?: string;
  author?: string;
  publishedAt: Date | string;
  fetchedAt: Date | string;
  source: string;
  category: string;
  tags: string[];
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const source = searchParams.get('source');
  const search = searchParams.get('search');

  const [allArticles, setAllArticles] = useState<Article[]>(mockArticles);
  const [loading, setLoading] = useState(true);

  // 記事を取得
  useEffect(() => {
    async function loadArticles() {
      try {
        const response = await fetch('/claude-code/articles.json');
        if (response.ok) {
          const data = await response.json();
          setAllArticles(data);
        } else {
          console.log('記事の取得に失敗しました。モックデータを使用します。');
        }
      } catch (error) {
        console.error('記事の読み込みエラー:', error);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  let articles = [...allArticles];

  // カテゴリフィルター
  if (category && category !== 'すべて') {
    articles = articles.filter(a => a.category === category);
  }

  // 情報源フィルター
  if (source && source !== 'すべて') {
    articles = articles.filter(a => a.source === source);
  }

  // 検索フィルター
  if (search) {
    const searchLower = search.toLowerCase();
    articles = articles.filter(a =>
      a.title.toLowerCase().includes(searchLower) ||
      (a.content && a.content.toLowerCase().includes(searchLower))
    );
  }

  // 日付順にソート
  articles.sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  });

  // 統計情報を計算
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayArticles = allArticles.filter(a => {
    const publishedDate = new Date(a.publishedAt);
    return publishedDate >= today;
  });

  const stats = {
    total: allArticles.length,
    today: todayArticles.length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI記事キュレーション
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Zenn / Qiita / note から毎日自動収集
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
          総記事数: {stats.total}件 | 本日: {stats.today}件
        </p>
      </div>

      <FilterBar />

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            記事が見つかりませんでした
          </p>
        </div>
      )}
    </div>
  );
}
