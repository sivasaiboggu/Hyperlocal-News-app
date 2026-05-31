import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Comment, PaginatedResponse } from '../../../core/types';
import { getNewsRepository } from '../repository';
import { CONFIG } from '../../../core/constants';
import { CacheFallbackStrategy, ErrorContext } from '../strategies';
import {
  fetchCommentsStart,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  addCommentOptimistic,
  addCommentFailure,
  selectCommentsForArticle,
  selectCommentsLoading,
  selectCommentsPagination,
} from '../store/newsSlice';

export const useComments = (articleId: string) => {
  const dispatch = useDispatch();
  
  // Selectors subscribing to Redux Store (Observer Pattern)
  const comments = useSelector(selectCommentsForArticle(articleId));
  const loading = useSelector(selectCommentsLoading);
  const pagination = useSelector(selectCommentsPagination(articleId));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = useCallback(
    async (isRefresh: boolean = false) => {
      const repository = getNewsRepository();
      const pageToFetch = isRefresh ? 1 : pagination.page + 1;
      const cacheKey = `${CONFIG.CACHE_COMMENTS_PREFIX}${articleId}`;

      if (!isRefresh && pagination.page >= pagination.totalPages) {
        return;
      }

      dispatch(fetchCommentsStart());

      const operationContext: ErrorContext = {
        operationName: 'Article Comments Feed',
        errorMessage: '',
        articleId,
      };

      try {
        const result = await repository.fetchComments(articleId, pageToFetch);
        
        // Cache the first page of comments
        if (pageToFetch === 1) {
          await CacheFallbackStrategy.saveCache(cacheKey, result);
        }

        dispatch(
          fetchCommentsSuccess({
            articleId,
            comments: result.data,
            page: result.page,
            totalPages: result.totalPages,
            isRefresh,
          })
        );
      } catch (error: any) {
        operationContext.errorMessage = error.message || 'Comments retrieval failed';
        
        // Caching fallback strategy for comments
        try {
          const cacheFallback = new CacheFallbackStrategy();
          const cachedResult = await cacheFallback.handle<PaginatedResponse<Comment>>(
            error,
            operationContext
          );

          dispatch(
            fetchCommentsSuccess({
              articleId,
              comments: cachedResult.data,
              page: cachedResult.page,
              totalPages: cachedResult.totalPages,
              isRefresh: true,
            })
          );
        } catch (cacheError) {
          dispatch(fetchCommentsFailure(error.message || 'Failed to retrieve comments'));
        }
      }
    },
    [articleId, pagination, dispatch]
  );

  // Optimistic UI updates implementation for submitting comments
  const submitComment = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const repository = getNewsRepository();
      const tempId = `comment-optimistic-${Date.now()}`;
      
      const tempComment: Comment = {
        id: tempId,
        articleId,
        authorName: 'You (Local Citizen)',
        authorAvatar: 'https://ui-avatars.com/api/?name=You&background=06B6D4&color=fff',
        content: text,
        timestamp: Date.now(),
      };

      setIsSubmitting(true);

      // Step 1: Instantly dispatch optimistic update to store
      dispatch(addCommentOptimistic({ articleId, comment: tempComment }));

      try {
        // Step 2: Make actual API post
        await repository.addComment(articleId, text);
        // Refresh first page of comments to get official backend IDs and correct sorting
        await fetchComments(true);
      } catch (error) {
        console.error('[OptimisticComment] Submission failed. Rolling back:', error);
        
        // Step 3: API failed. Rollback changes gracefully
        dispatch(addCommentFailure({ articleId, commentId: tempId }));
        throw new Error('Could not submit comment. Please check connection.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [articleId, dispatch, fetchComments]
  );

  useEffect(() => {
    fetchComments(true);
  }, [articleId]);

  return {
    comments,
    loading,
    pagination,
    isSubmitting,
    fetchNextCommentsPage: () => fetchComments(false),
    submitComment,
  };
};

export default useComments;
