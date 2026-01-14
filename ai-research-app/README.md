# AI記事キュレーション

Zenn、Qiita、noteのAI関連記事を**毎日自動で収集**し、見やすく整理するキュレーションサイトです。

## 🌟 主な機能

- **毎日自動更新**: GitHub Actionsで毎朝9時に自動収集
- **3大プラットフォーム対応**: Zenn / Qiita / note
- **フィルタリング**: カテゴリ・情報源で絞り込み
- **全文検索**: タイトルと本文を検索
- **完全無料**: GitHub Pagesで無料ホスティング

## 🚀 デモサイト

GitHub Pagesでホスティングされたサイトにアクセス:
`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## 📋 技術スタック

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **自動化**: GitHub Actions（毎日自動実行）
- **ホスティング**: GitHub Pages（無料）
- **データソース**: Zenn / Qiita / note API

## 🛠️ セットアップ

### 1. リポジトリをフォーク/クローン

```bash
git clone <YOUR_REPO_URL>
cd claude-code/ai-research-app
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 記事を収集（任意）

```bash
npm run fetch
```

### 4. ローカルで確認

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

### 5. ビルド

```bash
npm run build
```

## 🤖 GitHub Pagesへのデプロイ

### GitHub Pagesを有効化

1. GitHubリポジトリの **Settings** > **Pages** に移動
2. **Source** を `GitHub Actions` に設定
3. 完了！次回のコミットから自動デプロイされます

### 自動実行の仕組み

`.github/workflows/deploy.yml` により以下のタイミングで自動実行：

- **毎日 JST 9:00** に自動実行（記事収集 → ビルド → デプロイ）
- **mainブランチへのpush** 時に実行
- **手動実行** も可能（Actionsタブから）

## 📝 使用方法

### フィルター機能

- **カテゴリ**: Tech Article、AI、ChatGPT、LLM など
- **情報源**: Zenn、Qiita、note

### 検索機能

検索ボックスでタイトルと本文を全文検索

### 記事の確認

記事カードをクリックして元記事を開く

## 📂 プロジェクト構造

```
ai-research-app/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions設定
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # レイアウト
│   │   ├── page.tsx         # ホームページ
│   │   └── globals.css      # グローバルスタイル
│   ├── components/          # Reactコンポーネント
│   │   ├── Dashboard.tsx    # メインダッシュボード
│   │   ├── ArticleCard.tsx  # 記事カード
│   │   └── FilterBar.tsx    # フィルターUI
│   ├── lib/                 # ユーティリティ
│   │   ├── articlesData.ts  # データローダー
│   │   └── mockData.ts      # フォールバックデータ
│   └── types/               # TypeScript型定義
├── scripts/
│   └── fetch-articles.ts    # 記事収集スクリプト
├── data/
│   └── articles.json        # 収集した記事データ
└── public/
    └── articles.json        # 公開用記事データ
```

## 🔧 カスタマイズ

### 収集するキーワードを変更

`scripts/fetch-articles.ts` を編集：

```typescript
// Zenn
const topics = ['ai', '機械学習', 'chatgpt', 'llm'];

// Qiita
const tags = ['AI', '機械学習', 'ChatGPT', 'LLM'];

// note
const hashtags = ['AI', '機械学習', 'ChatGPT'];
```

### 実行時刻を変更

`.github/workflows/deploy.yml` のcron式を編集：

```yaml
schedule:
  - cron: '0 0 * * *'  # UTC 0:00 = JST 9:00
```

## 💡 特徴

- ✅ **完全無料**: すべて無料サービスで運用可能
- ✅ **自動更新**: 毎日自動で最新記事を収集
- ✅ **サーバー不要**: 静的サイトとして配信
- ✅ **高速**: Next.js静的エクスポート
- ✅ **レスポンシブ**: モバイル対応

## 🎯 今後の拡張案

- AI要約機能（Claude API）
- ブックマーク機能
- RSSフィード配信
- メール通知
- より多くのプラットフォーム対応

## 📄 ライセンス

MIT

## 🙏 謝辞

- [Zenn](https://zenn.dev/)
- [Qiita](https://qiita.com/)
- [note](https://note.com/)
