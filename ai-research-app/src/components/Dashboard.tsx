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
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

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

  // 日付順にソート（fetchedAtで）
  articles.sort((a, b) => {
    const dateA = a.fetchedAt ? new Date(a.fetchedAt).getTime() : 0;
    const dateB = b.fetchedAt ? new Date(b.fetchedAt).getTime() : 0;
    return dateB - dateA;
  });

  // 日付ごとにグループ化（fetchedAtの日付で）
  const articlesByDate: { [key: string]: Article[] } = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const article of articles) {
    const fetchedDate = new Date(article.fetchedAt);
    fetchedDate.setHours(0, 0, 0, 0);

    // 今日からの日数を計算
    const diffTime = today.getTime() - fetchedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 0日前（今日）、1日前、2日前、3日前でグループ化
    if (diffDays >= 0 && diffDays <= 3) {
      const key = `day${diffDays}`;
      if (!articlesByDate[key]) {
        articlesByDate[key] = [];
      }
      articlesByDate[key].push(article);
    }
  }

  // 記事がある日のリストを取得（ソート済み）
  const availableDays = [0, 1, 2, 3].filter(day => articlesByDate[`day${day}`]?.length > 0);

  // 記事があるページが無い場合のデフォルト
  const defaultPage = availableDays.length > 0 ? availableDays[0] + 1 : 1;

  // 有効なページかチェック（記事がある日のみ）
  const effectivePage = availableDays.includes(currentPage - 1) ? currentPage : defaultPage;

  // ページごとの記事を取得
  const pageKey = `day${effectivePage - 1}`;
  const currentPageArticles = articlesByDate[pageKey] || [];

  // 総ページ数を計算（記事がある日の数）
  const totalPages = availableDays.length;

  // 統計情報を計算
  const todayArticles = allArticles.filter(a => {
    const fetchedDate = new Date(a.fetchedAt);
    fetchedDate.setHours(0, 0, 0, 0);
    return fetchedDate.getTime() === today.getTime();
  });

  const stats = {
    total: allArticles.length,
    today: todayArticles.length,
  };

  // 現在のページの日付を計算
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - (effectivePage - 1));
  const dateLabel = effectivePage === 1 ? '今日' : `${effectivePage - 1}日前`;

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

      {/* ページネーション情報 */}
      {totalPages > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">{dateLabel}</span>の記事
            <span className="ml-2 text-gray-500">({currentPageArticles.length}件)</span>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentPageArticles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {currentPageArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            記事が見つかりませんでした
          </p>
        </div>
      )}

      {/* ページネーション */}
      {totalPages >= 1 && (
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {/* 前へボタン */}
            {(() => {
              const currentIndex = availableDays.indexOf(effectivePage - 1);
              if (currentIndex > 0) {
                const prevDay = availableDays[currentIndex - 1];
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', (prevDay + 1).toString());
                return (
                  <a
                    href={`?${params.toString()}`}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    ← 前へ
                  </a>
                );
              }
              return null;
            })()}

            {/* ページボタン - 記事がある日のみ表示 */}
            {availableDays.map((day) => {
              const page = day + 1;
              const pageLabel = day === 0 ? '今日' : `${day}日前`;
              const isActive = effectivePage === page;

              // URLを構築
              const params = new URLSearchParams(searchParams.toString());
              params.set('page', page.toString());
              const href = `?${params.toString()}`;

              return (
                <a
                  key={page}
                  href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {pageLabel}
                </a>
              );
            })}

            {/* 次へボタン */}
            {(() => {
              const currentIndex = availableDays.indexOf(effectivePage - 1);
              if (currentIndex < availableDays.length - 1) {
                const nextDay = availableDays[currentIndex + 1];
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', (nextDay + 1).toString());
                return (
                  <a
                    href={`?${params.toString()}`}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    次へ →
                  </a>
                );
              }
              return null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
