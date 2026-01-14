# AI Research App 使用ガイド

## セットアップ

### 1. 依存パッケージのインストール

```bash
cd ai-research-app
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成：

```bash
cp .env.example .env.local
```

`.env.local` を編集して、Claude API キーを設定：

```env
ANTHROPIC_API_KEY=your_actual_api_key_here
DATABASE_URL="file:./dev.db"
```

### 3. データベースのセットアップ

```bash
npm run db:setup
```

これにより、Prisma クライアントが生成され、データベースが初期化されます。

## 使い方

### 情報収集

最新のAI関連情報を収集するには：

```bash
npm run collect
```

このコマンドは以下のソースから情報を収集します：
- arXiv（AI/ML 関連論文）
- Hacker News（AI関連トップストーリー）
- OpenAI Blog
- DeepMind Blog
- Anthropic News
- Hugging Face Blog

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスしてダッシュボードを表示します。

### 本番ビルド

```bash
npm run build
npm start
```

## 機能詳細

### フィルタリング

ダッシュボードでは以下のフィルタリングが可能です：

1. **カテゴリフィルタ**
   - NLP
   - Computer Vision
   - Reinforcement Learning
   - Generative AI
   - ML Infrastructure
   - Research
   - News

2. **情報源フィルタ**
   - arXiv
   - Hacker News
   - OpenAI Blog
   - DeepMind Blog
   - Anthropic News
   - Hugging Face Blog

3. **検索**
   - タイトルと本文を全文検索

### AI要約機能

記事を自動で要約するには、環境変数に Claude API キーが設定されている必要があります。

要約機能は以下のように使用できます：

```typescript
import { summarizeArticle } from '@/services/summarizer';

const summary = await summarizeArticle({
  content: article.content,
  maxLength: 300,
  language: 'ja'
});
```

## 自動化

### Cron での定期実行

Linux/Mac で cron を使って定期的に情報収集を実行：

```bash
# crontab を編集
crontab -e

# 毎日午前9時に実行
0 9 * * * cd /path/to/ai-research-app && npm run collect
```

## トラブルシューティング

### データベースエラー

データベースをリセットする：

```bash
rm prisma/dev.db
npm run db:setup
```

### API エラー

Claude API の利用制限を確認してください。エラーが発生した場合、要約機能は元のテキストの先頭部分を返します。

### 収集エラー

ネットワークエラーやAPIの変更により収集に失敗することがあります。エラーログを確認して対処してください。
