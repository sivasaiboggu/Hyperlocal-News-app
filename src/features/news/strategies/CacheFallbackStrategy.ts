import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorStrategy, ErrorContext } from './ErrorStrategy';
import { CONFIG } from '../../../core/constants';

export class CacheFallbackStrategy implements ErrorStrategy {
  /**
   * Resolves the request by loading cache from AsyncStorage.
   * If no cache exists, it rethrows the original error.
   */
  async handle<T>(
    error: any,
    context: ErrorContext,
    fallbackAction?: () => Promise<T>
  ): Promise<T> {
    console.warn(`[CacheFallbackStrategy] Falling back to offline cache for: ${context.operationName}`);

    try {
      let cacheKey = '';
      if (context.category) {
        cacheKey = `${CONFIG.CACHE_ARTICLES_PREFIX}${context.category}`;
      } else if (context.articleId) {
        cacheKey = `${CONFIG.CACHE_COMMENTS_PREFIX}${context.articleId}`;
      } else {
        cacheKey = `@news_cache_general_${context.operationName}`;
      }

      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        console.log(`[CacheFallbackStrategy] Cache hit for: ${cacheKey}`);
        return JSON.parse(cachedData) as T;
      }
      
      console.warn(`[CacheFallbackStrategy] Cache miss for: ${cacheKey}`);
    } catch (cacheError) {
      console.error('[CacheFallbackStrategy] Failed to retrieve cache:', cacheError);
    }

    // If cache was empty or threw, rethrow the original networking error
    throw error;
  }

  /**
   * Helper to write cache data to AsyncStorage for future fallbacks.
   */
  static async saveCache(key: string, data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('[CacheFallbackStrategy] Failed to save cache:', error);
    }
  }
}
