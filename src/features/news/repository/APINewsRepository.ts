import axios, { AxiosInstance } from 'axios';
import { INewsRepository } from './INewsRepository';
import { CategoryType, FeedItem, Comment, PaginatedResponse } from '../../../core/types';
import { CONFIG } from '../../../core/constants';

export class APINewsRepository implements INewsRepository {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: CONFIG.API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async fetchCategories(): Promise<CategoryType[]> {
    const response = await this.client.get<CategoryType[]>('/categories');
    return response.data;
  }

  async fetchArticles(category: CategoryType, page: number): Promise<PaginatedResponse<FeedItem>> {
    const response = await this.client.get<PaginatedResponse<FeedItem>>('/articles', {
      params: { category, page },
    });
    return response.data;
  }

  async fetchComments(articleId: string, page: number): Promise<PaginatedResponse<Comment>> {
    const response = await this.client.get<PaginatedResponse<Comment>>(`/articles/${articleId}/comments`, {
      params: { page },
    });
    return response.data;
  }

  async addComment(articleId: string, commentText: string): Promise<Comment> {
    const response = await this.client.post<Comment>(`/articles/${articleId}/comments`, {
      content: commentText,
    });
    return response.data;
  }
}
