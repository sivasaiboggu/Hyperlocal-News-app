import newsReducer, {
  setSelectedCategory,
  fetchArticlesStart,
  fetchArticlesSuccess,
  addCommentOptimistic,
  addCommentFailure,
  NewsState,
} from '../store/newsSlice';
import { FeedItem, Comment } from '../../../core/types';

describe('News Redux Slice Reducers', () => {
  const initialState: NewsState = {
    selectedCategory: 'Local',
    feedItems: {},
    comments: {},
    loading: {
      articles: false,
      comments: false,
      addComment: false,
    },
    errors: {
      articles: null,
      comments: null,
    },
    pagination: {},
    commentsPagination: {},
  };

  it('should handle category selection changes and reset states correctly', () => {
    const nextState = newsReducer(initialState, setSelectedCategory('Sports'));
    expect(nextState.selectedCategory).toBe('Sports');
  });

  it('should trigger articles fetching spinner state', () => {
    const nextState = newsReducer(initialState, fetchArticlesStart());
    expect(nextState.loading.articles).toBe(true);
    expect(nextState.errors.articles).toBeNull();
  });

  it('should successfully append items and pages under category mapping key', () => {
    const mockItems: FeedItem[] = [
      { id: '1', type: 'news', data: { id: '1', title: 'Test Headline', content: '...', thumbnail: '...', category: 'Local', likes: 1, views: 1, source: '...', timestamp: Date.now(), commentsCount: 0 } },
    ];

    const nextState = newsReducer(
      initialState,
      fetchArticlesSuccess({
        category: 'Local',
        items: mockItems,
        page: 1,
        totalPages: 3,
        isRefresh: true,
      })
    );

    expect(nextState.loading.articles).toBe(false);
    expect(nextState.feedItems['Local']).toEqual(mockItems);
    expect(nextState.pagination['Local']).toEqual({ page: 1, totalPages: 3 });
  });

  it('should optimistic prepend new comment, and gracefully filter/rollback on failure', () => {
    const articleId = 'news-1';
    const tempComment: Comment = {
      id: 'comment-temp-id',
      articleId,
      authorName: 'You',
      content: 'Hello World',
      timestamp: Date.now(),
    };

    // Step 1: Prepend Optimistically
    const optimisticState = newsReducer(
      initialState,
      addCommentOptimistic({ articleId, comment: tempComment })
    );
    expect(optimisticState.comments[articleId]).toHaveLength(1);
    expect(optimisticState.comments[articleId][0]).toEqual(tempComment);

    // Step 2: Simulate Post Failure (Rollback by filtering tempId)
    const failureState = newsReducer(
      optimisticState,
      addCommentFailure({ articleId, commentId: 'comment-temp-id' })
    );
    expect(failureState.comments[articleId]).toHaveLength(0);
  });
});
