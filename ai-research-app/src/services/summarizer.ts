import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface SummarizeOptions {
  content: string;
  maxLength?: number;
  language?: 'ja' | 'en';
}

export async function summarizeArticle(options: SummarizeOptions): Promise<string> {
  const { content, maxLength = 300, language = 'ja' } = options;

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('ANTHROPIC_API_KEY not set, skipping summarization');
    return content.substring(0, maxLength);
  }

  try {
    const prompt = language === 'ja'
      ? `以下の記事を${maxLength}文字程度の日本語で要約してください。重要なポイントを3つ程度含めてください。\n\n記事:\n${content}`
      : `Please summarize the following article in about ${maxLength} characters. Include 3 key points.\n\nArticle:\n${content}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find(block => block.type === 'text');
    if (textContent && textContent.type === 'text') {
      return textContent.text;
    }

    return content.substring(0, maxLength);
  } catch (error) {
    console.error('Error summarizing article:', error);
    return content.substring(0, maxLength);
  }
}

export async function extractKeyPoints(content: string): Promise<string[]> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return [];
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `以下の記事から重要なポイントを3〜5つ抽出してください。各ポイントは1行で簡潔に書いてください。\n\n記事:\n${content}`,
        },
      ],
    });

    const textContent = message.content.find(block => block.type === 'text');
    if (textContent && textContent.type === 'text') {
      return textContent.text
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[-•*]\s*/, '').trim());
    }

    return [];
  } catch (error) {
    console.error('Error extracting key points:', error);
    return [];
  }
}
