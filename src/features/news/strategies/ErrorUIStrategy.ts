import { ErrorStrategy, ErrorContext } from './ErrorStrategy';

export interface UIErrorDetails {
  message: string;
  hint: string;
  canRetry: boolean;
}

export class ErrorUIStrategy implements ErrorStrategy {
  /**
   * Evaluates the error and constructs user-facing visual messages.
   */
  async handle<T>(
    error: any,
    context: ErrorContext,
    fallbackAction?: () => Promise<T>
  ): Promise<T> {
    const details = this.resolveErrorDetails(error, context);
    
    // Throw an enriched error that the UI screen can parse directly
    throw {
      ...error,
      uiDetails: details,
      retryAction: fallbackAction,
    };
  }

  private resolveErrorDetails(error: any, context: ErrorContext): UIErrorDetails {
    const isNetworkError = error.message?.toLowerCase().includes('network') || error.code === 'ERR_NETWORK';
    const isTimeout = error.code === 'ECONNABORTED';

    if (isNetworkError) {
      return {
        message: 'No internet connection detected.',
        hint: 'Please check your Wi-Fi or cellular networks and try again.',
        canRetry: true,
      };
    }

    if (isTimeout) {
      return {
        message: 'The connection timed out.',
        hint: 'Our servers are taking too long to respond. Let’s try that again.',
        canRetry: true,
      };
    }

    return {
      message: `Failed to load ${context.operationName}.`,
      hint: 'Something went wrong on our end. Please drag down to refresh.',
      canRetry: true,
    };
  }
}
