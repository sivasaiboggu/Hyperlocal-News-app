/**
 * Hyperlocal News Module Configurations
 */
export const CONFIG = {
  // Feature flag to toggle instant mock API vs real remote Axios endpoints
  USE_MOCK_DATA: true,
  
  // Real endpoint configuration
  API_BASE_URL: 'https://api.hyperlocalnews.local/v1',
  
  // Retry strategy limits
  MAX_RETRY_ATTEMPTS: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  
  // Storage keys
  CACHE_ARTICLES_PREFIX: '@news_cache_articles_',
  CACHE_COMMENTS_PREFIX: '@news_cache_comments_',
};
