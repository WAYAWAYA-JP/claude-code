// Type definitions for AI Research App

export interface Article {
  id: string;
  title: string;
  url: string;
  content?: string;
  summary?: string;
  author?: string;
  publishedAt?: Date;
  fetchedAt: Date;
  source: string;
  category: string;
  tags: Tag[];
  bookmarked: boolean;
  read: boolean;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  url: string;
  enabled: boolean;
  lastFetched?: Date;
}

export type SourceType = 'RSS' | 'API' | 'SCRAPER';

export type Category =
  | 'NLP'
  | 'Computer Vision'
  | 'Reinforcement Learning'
  | 'Generative AI'
  | 'ML Infrastructure'
  | 'Research'
  | 'News'
  | 'Other';

export interface FetchResult {
  source: string;
  articlesCount: number;
  success: boolean;
  error?: string;
}

export interface SummaryRequest {
  content: string;
  maxLength?: number;
}

export interface SummaryResponse {
  summary: string;
  keyPoints: string[];
}
