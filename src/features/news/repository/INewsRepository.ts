import { CategoryType, FeedItem, Comment, PaginatedResponse } from '../../../core/types';

export interface INewsRepository {
  fetchCategories(): Promise<CategoryType[]>;
  fetchArticles(category: CategoryType, page: number): Promise<PaginatedResponse<FeedItem>>;
  fetchComments(articleId: string, page: number): Promise<PaginatedResponse<Comment>>;
  addComment(articleId: string, commentText: string): Promise<Comment>;
}
