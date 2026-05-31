export type CategoryType =
  | 'Local'
  | 'Sports'
  | 'Politics'
  | 'Entertainment'
  | 'Business'
  | 'Technology'
  | 'Health';

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  source: string;
  timestamp: number; // epoch milliseconds
  category: CategoryType;
  likes: number;
  views: number;
  commentsCount: number;
}

export interface AdContent {
  id: string;
  title: string;
  description: string;
  image: string;
  sponsorName: string;
  ctaUrl: string;
}

export interface LocalEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string; // e.g. "June 15, 2026"
  location: string;
  ctaLabel: string;
}

export type FeedItemType = 'news' | 'ad' | 'event';

export type FeedItem =
  | { id: string; type: 'news'; data: NewsArticle }
  | { id: string; type: 'ad'; data: AdContent }
  | { id: string; type: 'event'; data: LocalEvent };

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: number; // epoch milliseconds
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}
