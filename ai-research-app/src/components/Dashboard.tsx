'use client';

import { useSearchParams } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard';
import FilterBar from '@/components/FilterBar';
import { mockArticles, mockStats } from '@/lib/mockData';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const source = searchParams.get('source');
  const search = searchParams.get('search');

  let articles = [...mockArticles];

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

  const stats = mockStats;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI最新情報ダッシュボード
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          総記事数: {stats.total} | 今日: {stats.today}件
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
