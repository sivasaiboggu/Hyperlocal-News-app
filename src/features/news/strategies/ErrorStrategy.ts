export interface ErrorContext {
  operationName: string;
  errorMessage: string;
  category?: string;
  articleId?: string;
  [key: string]: any;
}

/**
 * Base Strategy Interface for handling error contexts.
 * All concrete recovery strategies must implement this contract.
 */
export interface ErrorStrategy {
  handle<T>(
    error: any,
    context: ErrorContext,
    fallbackAction?: () => Promise<T>
  ): Promise<T>;
}
