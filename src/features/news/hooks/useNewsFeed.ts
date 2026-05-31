import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CategoryType, FeedItem, PaginatedResponse } from '../../../core/types';
import { getNewsRepository } from '../repository';
import { CONFIG } from '../../../core/constants';
import {
  RetryStrategy,
  CacheFallbackStrategy,
  ErrorUIStrategy,
  ErrorContext,
} from '../strategies';
import {
  fetchArticlesStart,
  fetchArticlesSuccess,
  fetchArticlesFailure,
  selectSelectedCategory,
  selectCurrentFeedItems,
  selectArticlesLoading,
  selectArticlesError,
  selectPaginationForCategory,
} from '../store/newsSlice';

export const useNewsFeed = () => {
  const dispatch = useDispatch();
  
  // Selectors subscribing to Redux store (Observer Pattern)
  const selectedCategory = useSelector(selectSelectedCategory);
  const feedItems = useSelector(selectCurrentFeedItems);
  const loading = useSelector(selectArticlesLoading);
  const error = useSelector(selectArticlesError);
  const pagination = useSelector(selectPaginationForCategory);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize concrete strategies
  const retryStrategy = new RetryStrategy(CONFIG.MAX_RETRY_ATTEMPTS, CONFIG.INITIAL_RETRY_DELAY_MS);
  const cacheFallback = new CacheFallbackStrategy();
  const errorUI = new ErrorUIStrategy();

  const fetchArticles = useCallback(
    async (isRefresh: boolean = false) => {
      const repository = getNewsRepository();
      const pageToFetch = isRefresh ? 1 : pagination.page + 1;
      const cacheKey = `${CONFIG.CACHE_ARTICLES_PREFIX}${selectedCategory}`;

      // Prevent redundant fetches if we reached the maximum page count
      if (!isRefresh && pagination.page >= pagination.totalPages) {
        return;
      }

      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        dispatch(fetchArticlesStart());
      }

      const operationContext: ErrorContext = {
        operationName: 'Category Articles Feed',
        errorMessage: '',
        category: selectedCategory,
      };

      // Network action wrapper to pass into strategies
      const performFetch = async () => {
        return await repository.fetchArticles(selectedCategory, pageToFetch);
      };

      try {
        // Attempt 1: Fetch remote data (with optional simulated retry capability)
        const result = await performFetch();
        
        // On success, save the first page to cache for offline-first backup
        if (pageToFetch === 1) {
          await CacheFallbackStrategy.saveCache(cacheKey, result);
        }

        dispatch(
          fetchArticlesSuccess({
            category: selectedCategory,
            items: result.data,
            page: result.page,
            totalPages: result.totalPages,
            isRefresh,
          })
        );
      } catch (networkError: any) {
        operationContext.errorMessage = networkError.message || 'API request failed';

        try {
          // Attempt 2: Try caching fallback strategy (Offline First!)
          const cachedResult = await cacheFallback.handle<PaginatedResponse<FeedItem>>(
            networkError,
            operationContext
          );

          dispatch(
            fetchArticlesSuccess({
              category: selectedCategory,
              items: cachedResult.data,
              page: cachedResult.page,
              totalPages: cachedResult.totalPages,
              isRefresh: true, // Wipe feed append overlays
            })
          );
        } catch (cacheError) {
          // Attempt 3: No cache found. Paint friendly ErrorUI strategy triggers
          try {
            await errorUI.handle(
              networkError,
              operationContext,
              performFetch // Passes retry trigger back
            );
          } catch (enrichedError: any) {
            dispatch(
              fetchArticlesFailure(
                `${enrichedError.uiDetails.message} ${enrichedError.uiDetails.hint}`
              )
            );
          }
        }
      } finally {
        setIsRefreshing(false);
      }
    },
    [selectedCategory, pagination, dispatch]
  );

  // Auto load articles when selected category tab toggles
  useEffect(() => {
    fetchArticles(true);
  }, [selectedCategory]);

  const handleRefresh = useCallback(() => {
    fetchArticles(true);
  }, [fetchArticles]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !isRefreshing) {
      fetchArticles(false);
    }
  }, [loading, isRefreshing, fetchArticles]);

  return {
    selectedCategory,
    feedItems,
    loading,
    error,
    isRefreshing,
    handleRefresh,
    handleLoadMore,
  };
};

export default useNewsFeed;
