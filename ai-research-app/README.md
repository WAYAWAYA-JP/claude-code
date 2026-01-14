# AI Research App (デモ版)

AIの最新情報をリサーチ・収集・整理するためのWebアプリケーションのデモ版です。

## 主な機能

- **ダッシュボード**: AI関連記事を視覚的に整理・表示
- **カテゴリフィルター**: NLP、Computer Vision、Generative AI などで絞り込み
- **情報源フィルター**: arXiv、Hacker News、主要AIブログで絞り込み
- **全文検索**: タイトルと本文を検索
- **モックデータ**: サンプル記事でUIを確認可能

## 技術スタック

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **UI**: レスポンシブデザイン、ダーク/ライトモード対応

## セットアップ

### 必要要件

- Node.js 18以上
- npm または yarn

### インストールと起動

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

サーバーが起動したら、ブラウザで http://localhost:3000 にアクセスしてください。

## 使用方法

1. **開発サーバーを起動**: `npm run dev`
2. **ブラウザでアクセス**: http://localhost:3000
3. **フィルター機能を試す**:
   - カテゴリボタンで絞り込み
   - 情報源ボタンで絞り込み
   - 検索ボックスでキーワード検索

## プロジェクト構造

```
ai-research-app/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # レイアウト
│   │   ├── page.tsx      # ホームページ
│   │   └── globals.css   # グローバルスタイル
│   ├── components/       # Reactコンポーネント
│   │   ├── ArticleCard.tsx   # 記事カード
│   │   └── FilterBar.tsx     # フィルターUI
│   ├── lib/              # ユーティリティ
│   │   └── mockData.ts   # サンプルデータ
│   └── types/            # TypeScript型定義
├── docs/                 # ドキュメント
└── public/               # 静的ファイル
```

## 特徴

- **軽量**: 最小限の依存関係
- **高速**: サーバーサイドレンダリング
- **モダン**: Next.js 14 App Router使用
- **レスポンシブ**: モバイルフレンドリーなUI

## 将来の拡張

本格的な運用には以下の機能追加が推奨されます：

- データベース連携（PostgreSQL / SQLite）
- 実際のデータ収集（RSS、API）
- AI要約機能（Claude API）
- ユーザー認証
- ブックマーク機能

## ライセンス

MIT
