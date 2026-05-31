import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { CategoryType, FeedItem, Comment, NewsArticle } from '../../../core/types';

export interface NewsState {
  selectedCategory: CategoryType;
  feedItems: Record<string, FeedItem[]>; // keyed by CategoryType
  comments: Record<string, Comment[]>;   // keyed by ArticleId
  loading: {
    articles: boolean;
    comments: boolean;
    addComment: boolean;
  };
  errors: {
    articles: string | null;
    comments: string | null;
  };
  pagination: Record<string, { page: number; totalPages: number }>; // keyed by CategoryType
  commentsPagination: Record<string, { page: number; totalPages: number }>; // keyed by ArticleId
}

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

export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<CategoryType>) => {
      state.selectedCategory = action.payload;
    },
    fetchArticlesStart: (state) => {
      state.loading.articles = true;
      state.errors.articles = null;
    },
    fetchArticlesSuccess: (
      state,
      action: PayloadAction<{
        category: CategoryType;
        items: FeedItem[];
        page: number;
        totalPages: number;
        isRefresh: boolean;
      }>
    ) => {
      const { category, items, page, totalPages, isRefresh } = action.payload;
      state.loading.articles = false;
      state.errors.articles = null;
      
      const currentItems = state.feedItems[category] || [];
      state.feedItems[category] = isRefresh ? items : [...currentItems, ...items];
      
      state.pagination[category] = {
        page,
        totalPages,
      };
    },
    fetchArticlesFailure: (state, action: PayloadAction<string>) => {
      state.loading.articles = false;
      state.errors.articles = action.payload;
    },
    fetchCommentsStart: (state) => {
      state.loading.comments = true;
      state.errors.comments = null;
    },
    fetchCommentsSuccess: (
      state,
      action: PayloadAction<{
        articleId: string;
        comments: Comment[];
        page: number;
        totalPages: number;
        isRefresh: boolean;
      }>
    ) => {
      const { articleId, comments, page, totalPages, isRefresh } = action.payload;
      state.loading.comments = false;
      state.errors.comments = null;
      
      const currentComments = state.comments[articleId] || [];
      state.comments[articleId] = isRefresh ? comments : [...currentComments, ...comments];
      
      state.commentsPagination[articleId] = {
        page,
        totalPages,
      };
    },
    fetchCommentsFailure: (state, action: PayloadAction<string>) => {
      state.loading.comments = false;
      state.errors.comments = action.payload;
    },
    // Optimistic Comment addition UI updates
    addCommentOptimistic: (
      state,
      action: PayloadAction<{ articleId: string; comment: Comment }>
    ) => {
      const { articleId, comment } = action.payload;
      const currentComments = state.comments[articleId] || [];
      // Prepends to support standard social comments layout
      state.comments[articleId] = [comment, ...currentComments];
    },
    // Fallback UI adjustments if optimistic write failed
    addCommentFailure: (
      state,
      action: PayloadAction<{ articleId: string; commentId: string }>
    ) => {
      const { articleId, commentId } = action.payload;
      const currentComments = state.comments[articleId] || [];
      state.comments[articleId] = currentComments.filter(
        (c) => c.id !== commentId
      );
    },
    clearErrors: (state) => {
      state.errors.articles = null;
      state.errors.comments = null;
    },
  },
});

export const {
  setSelectedCategory,
  fetchArticlesStart,
  fetchArticlesSuccess,
  fetchArticlesFailure,
  fetchCommentsStart,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  addCommentOptimistic,
  addCommentFailure,
  clearErrors,
} = newsSlice.actions;

// Base State Selector
const selectNewsState = (state: { news: NewsState }) => state.news;

// Memoized Selectors (Observer Subscriptions)
export const selectSelectedCategory = createSelector(
  [selectNewsState],
  (news) => news.selectedCategory
);

export const selectCurrentFeedItems = createSelector(
  [selectNewsState, selectSelectedCategory],
  (news, category) => news.feedItems[category] || []
);

export const selectArticlesLoading = createSelector(
  [selectNewsState],
  (news) => news.loading.articles
);

export const selectArticlesError = createSelector(
  [selectNewsState],
  (news) => news.errors.articles
);

export const selectPaginationForCategory = createSelector(
  [selectNewsState, selectSelectedCategory],
  (news, category) => news.pagination[category] || { page: 0, totalPages: 1 }
);

export const selectCommentsForArticle = (articleId: string) =>
  createSelector([selectNewsState], (news) => news.comments[articleId] || []);

export const selectCommentsLoading = createSelector(
  [selectNewsState],
  (news) => news.loading.comments
);

export const selectCommentsPagination = (articleId: string) =>
  createSelector(
    [selectNewsState],
    (news) => news.commentsPagination[articleId] || { page: 0, totalPages: 1 }
  );

export const selectArticleById = (articleId: string) =>
  createSelector([selectNewsState], (news) => {
    // Searches across all categories for the target article
    for (const category of Object.keys(news.feedItems)) {
      const found = news.feedItems[category].find(
        (item) => item.type === 'news' && item.id === articleId
      );
      if (found) return found.data as NewsArticle;
    }
    return null;
  });

export default newsSlice.reducer;
