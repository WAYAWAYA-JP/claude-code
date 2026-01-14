'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const CATEGORIES = [
  'すべて',
  'Tech Article',
  'AI',
  'ChatGPT',
  'LLM',
  '機械学習',
];

const SOURCES = [
  'すべて',
  'Zenn',
  'Qiita',
  'note',
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const currentCategory = searchParams.get('category') || 'すべて';
  const currentSource = searchParams.get('source') || 'すべて';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'すべて') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="記事を検索..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            検索
          </button>
        </form>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            カテゴリ
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => updateFilters('category', category)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  currentCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            情報源
          </label>
          <div className="flex flex-wrap gap-2">
            {SOURCES.map((source) => (
              <button
                key={source}
                onClick={() => updateFilters('source', source)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  currentSource === source
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {source}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
