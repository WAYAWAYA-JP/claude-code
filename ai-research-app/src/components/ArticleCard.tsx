import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    url: string;
    content?: string | null;
    summary?: string | null;
    author?: string | null;
    publishedAt?: Date | string | null;
    source: string;
    category: string;
    tags?: string[];
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const displayContent = article.summary || article.content?.substring(0, 200);
  const timeAgo = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: ja })
    : '不明';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {article.category}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {article.source}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 dark:hover:text-blue-400"
        >
          {article.title}
        </a>
      </h3>

      {displayContent && (
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {displayContent}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{article.author || '著者不明'}</span>
        <span>{timeAgo}</span>
      </div>
    </div>
  );
}
