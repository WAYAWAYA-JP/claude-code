import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/ArticleCard';
import FilterBar from '@/components/FilterBar';

interface PageProps {
  searchParams: Promise<{
    category?: string;
    source?: string;
    search?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const { category, source, search } = params;

  const where: any = {};

  if (category) {
    where.category = category;
  }

  if (source) {
    where.source = source;
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
    ];
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: {
      publishedAt: 'desc',
    },
    take: 50,
  });

  const stats = {
    total: await prisma.article.count(),
    today: await prisma.article.count({
      where: {
        publishedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  };

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
