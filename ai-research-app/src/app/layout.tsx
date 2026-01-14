import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI記事キュレーション - Zenn/Qiita/note 毎日自動収集",
  description: "Zenn、Qiita、noteのAI関連記事を毎日自動で収集・整理するキュレーションサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    AI記事キュレーション
                  </h1>
                </div>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
