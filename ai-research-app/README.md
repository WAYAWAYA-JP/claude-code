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

### 方法1: ローカルでクローンして実行（推奨）

お使いのPCで直接実行する方法です：

```bash
# リポジトリをクローン
git clone <リポジトリURL>
cd ai-research-app

# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで http://localhost:3000 にアクセスしてください。

### 方法2: 静的ビルドを生成

静的HTMLファイルとして配布する場合：

```bash
# ビルド
npm run build

# outディレクトリが生成されます
# Python の簡易サーバーで確認
cd out
python3 -m http.server 8000
```

ブラウザで http://localhost:8000 にアクセスしてください。

## 使用方法

1. **フィルター機能**:
   - カテゴリボタンで絞り込み（NLP、Computer Vision など）
   - 情報源ボタンで絞り込み（arXiv、Hacker News など）
2. **検索機能**:
   - 検索ボックスでタイトルと本文を検索
3. **記事の確認**:
   - 記事カードをクリックして元記事を開く

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
