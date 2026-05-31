import { INewsRepository } from './INewsRepository';
import { CategoryType, FeedItem, Comment, PaginatedResponse } from '../../../core/types';
import { MOCK_CATEGORIES, generateMockFeed, generateMockComments } from '../../../core/mocks';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockNewsRepository implements INewsRepository {
  private networkDelayMs: number;

  constructor(networkDelayMs: number = 800) {
    this.networkDelayMs = networkDelayMs;
  }

  async fetchCategories(): Promise<CategoryType[]> {
    await delay(this.networkDelayMs);
    return [...MOCK_CATEGORIES];
  }

  async fetchArticles(category: CategoryType, page: number): Promise<PaginatedResponse<FeedItem>> {
    await delay(this.networkDelayMs);
    
    // Simulate empty/null return bounds
    if (page > 3) {
      return {
        data: [],
        page,
        totalPages: 3,
        totalItems: 30,
      };
    }

    const data = generateMockFeed(category, page);
    return {
      data,
      page,
      totalPages: 3,
      totalItems: 30,
    };
  }

  async fetchComments(articleId: string, page: number): Promise<PaginatedResponse<Comment>> {
    await delay(this.networkDelayMs);
    
    // Generate comments for the article
    const allComments = generateMockComments(articleId, 15);
    const limit = 5;
    const start = (page - 1) * limit;
    const paginated = allComments.slice(start, start + limit);

    return {
      data: paginated,
      page,
      totalPages: Math.ceil(allComments.length / limit),
      totalItems: allComments.length,
    };
  }

  async addComment(articleId: string, commentText: string): Promise<Comment> {
    await delay(500); // Quick turnaround for posting
    
    if (!commentText.trim()) {
      throw new Error('Comment text cannot be empty');
    }

    return {
      id: `comment-new-${Date.now()}`,
      articleId,
      authorName: 'You (Local Citizen)',
      authorAvatar: 'https://ui-avatars.com/api/?name=You&background=06B6D4&color=fff',
      content: commentText,
      timestamp: Date.now(),
    };
  }
}
