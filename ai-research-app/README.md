# AI Research App

AIの最新情報をリサーチ・収集・整理するためのWebアプリケーション

## 主な機能

- **自動情報収集**: 最新のAI関連ニュース、論文、ブログ記事を自動で収集
- **AI要約**: Claude APIを使用して重要な情報を自動要約
- **カテゴリ分類**: 技術トピック別に自動分類
- **検索・フィルタリング**: 強力な検索とフィルタリング機能
- **ダッシュボード**: 視覚的に情報を整理・表示

## 技術スタック

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (Prisma ORM)
- **AI**: Claude API (要約機能)
- **情報源**:
  - arXiv (論文)
  - Hacker News
  - Reddit (r/MachineLearning)
  - RSS フィード (AI関連ブログ)

## セットアップ

### 必要要件

- Node.js 18以上
- npm または yarn

### インストール

```bash
# 依存パッケージのインストール
npm install

# データベースのセットアップ
npm run db:setup

# 開発サーバーの起動
npm run dev
```

### 環境変数

`.env.local` ファイルを作成して以下の環境変数を設定：

```env
# Claude API
ANTHROPIC_API_KEY=your_api_key_here

# データベース
DATABASE_URL="file:./dev.db"

# オプション: 外部API
HACKER_NEWS_API=https://hacker-news.firebaseio.com/v0
```

## 使用方法

1. 開発サーバーを起動: `npm run dev`
2. ブラウザで http://localhost:3000 にアクセス
3. ダッシュボードで最新のAI情報を確認
4. 情報収集を実行: `npm run collect`

## プロジェクト構造

```
ai-research-app/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Reactコンポーネント
│   ├── lib/              # ユーティリティ関数
│   ├── services/         # ビジネスロジック
│   └── types/            # TypeScript型定義
├── prisma/               # データベーススキーマ
├── public/               # 静的ファイル
└── scripts/              # 収集スクリプト
```

## 開発ロードマップ

- [x] プロジェクトセットアップ
- [ ] データベーススキーマ設計
- [ ] 情報収集エンジン
- [ ] AI要約機能
- [ ] フロントエンドUI
- [ ] 検索・フィルタリング
- [ ] 自動更新機能

## ライセンス

MIT
