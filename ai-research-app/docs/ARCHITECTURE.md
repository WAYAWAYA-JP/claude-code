# アーキテクチャドキュメント

## システム構成

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ Dashboard UI │  │ Filter Bar   │  │ Articles │  │
│  └──────────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              Next.js API Routes (Optional)           │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                  Services Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │  Collectors  │  │  Summarizer  │  │   DB     │  │
│  │  - RSS       │  │  - Claude    │  │ - Prisma │  │
│  │  - HN API    │  │    API       │  │          │  │
│  │  - arXiv     │  │              │  │          │  │
│  └──────────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                  Database (SQLite)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Articles │  │   Tags   │  │     Sources      │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## ディレクトリ構造

```
ai-research-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── page.tsx            # ホームページ
│   │   └── globals.css         # グローバルスタイル
│   ├── components/             # Reactコンポーネント
│   │   ├── ArticleCard.tsx     # 記事カード
│   │   └── FilterBar.tsx       # フィルターUI
│   ├── lib/                    # ユーティリティ
│   │   └── prisma.ts           # Prismaクライアント
│   ├── services/               # ビジネスロジック
│   │   ├── collectors/         # データ収集
│   │   │   ├── rss.ts          # RSSフィード
│   │   │   ├── hackernews.ts   # Hacker News API
│   │   │   └── arxiv.ts        # arXiv API
│   │   └── summarizer.ts       # AI要約機能
│   └── types/                  # TypeScript型定義
│       └── index.ts
├── prisma/
│   └── schema.prisma           # データベーススキーマ
├── scripts/
│   └── collect.ts              # 収集スクリプト
└── docs/
    ├── USAGE.md                # 使用ガイド
    └── ARCHITECTURE.md         # このファイル
```

## データフロー

### 1. 情報収集フロー

```
External Sources → Collectors → Database
     │                │             │
     │                ▼             │
     │          Parse & Transform   │
     │                │             │
     │                ▼             │
     └──────────→ Deduplication ───┘
                      │
                      ▼
                 Store in DB
```

### 2. 表示フロー

```
User Request → Next.js Page → Prisma Query → Database
                    │              │
                    ▼              ▼
              Apply Filters   Fetch Articles
                    │              │
                    └──────┬───────┘
                           ▼
                     Render UI
```

### 3. AI要約フロー

```
Article Content → Summarizer Service → Claude API
                        │                   │
                        ▼                   ▼
                  Format Prompt      Generate Summary
                        │                   │
                        └────────┬──────────┘
                                 ▼
                           Update Database
```

## 主要コンポーネント

### Collectors (情報収集)

各コレクターは以下のインターフェースを実装：

```typescript
interface CollectorResult {
  source: string;
  articlesCount: number;
  success: boolean;
  error?: string;
}
```

**RSS Collector** (`src/services/collectors/rss.ts`)
- RSS フィードをパースして記事を取得
- 主要なAIブログから情報収集

**Hacker News Collector** (`src/services/collectors/hackernews.ts`)
- HN API からトップストーリーを取得
- AIキーワードでフィルタリング

**arXiv Collector** (`src/services/collectors/arxiv.ts`)
- arXiv API から最新論文を取得
- カテゴリ別に自動分類

### Summarizer (AI要約)

Claude API を使用して記事を要約：

```typescript
interface SummarizeOptions {
  content: string;
  maxLength?: number;
  language?: 'ja' | 'en';
}
```

特徴：
- 最大長を指定可能
- 日本語/英語対応
- APIエラー時のフォールバック

### Database (Prisma + SQLite)

**Article Model**
- 記事の基本情報を保存
- タイトル、URL、本文、要約、カテゴリなど

**Tag Model**
- タグ情報（将来の拡張用）

**Source Model**
- 情報源の設定（将来の拡張用）

## パフォーマンス考慮事項

1. **データベース**
   - インデックス: publishedAt, category, source
   - ページネーション: 50件/ページ

2. **API呼び出し**
   - Claude API: エラーハンドリングとフォールバック
   - 外部API: タイムアウト設定

3. **キャッシング**
   - Next.js の静的生成を活用
   - 将来的に Redis 導入を検討

## セキュリティ

1. **環境変数**
   - API キーは `.env.local` で管理
   - Git にコミットしない

2. **外部URL**
   - `rel="noopener noreferrer"` を使用

3. **入力検証**
   - ユーザー入力のサニタイズ

## 今後の拡張案

1. **機能追加**
   - ブックマーク機能
   - 既読管理
   - タグ付け
   - メール通知

2. **データソース追加**
   - Reddit API
   - Twitter API
   - Papers with Code

3. **インフラ改善**
   - PostgreSQL への移行
   - Redis キャッシング
   - 全文検索エンジン (Elasticsearch)

4. **UI/UX改善**
   - ダークモード切り替え
   - レスポンシブデザイン改善
   - 無限スクロール
