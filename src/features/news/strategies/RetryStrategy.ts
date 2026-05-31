import { ErrorStrategy, ErrorContext } from './ErrorStrategy';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class RetryStrategy implements ErrorStrategy {
  private maxRetries: number;
  private initialDelayMs: number;

  constructor(maxRetries: number = 3, initialDelayMs: number = 1000) {
    this.maxRetries = maxRetries;
    this.initialDelayMs = initialDelayMs;
  }

  /**
   * Automatically retries the remote operation using exponential backoff.
   * If all retries fail, it throws the final error or triggers the fallbackAction.
   */
  async handle<T>(
    error: any,
    context: ErrorContext,
    fallbackAction?: () => Promise<T>
  ): Promise<T> {
    console.warn(`[RetryStrategy] Initiating recovery for: ${context.operationName}. Error: ${context.errorMessage}`);
    
    let attempt = 0;
    while (attempt < this.maxRetries) {
      attempt++;
      const backoffDelay = this.initialDelayMs * Math.pow(2, attempt - 1);
      console.log(`[RetryStrategy] Retry attempt ${attempt}/${this.maxRetries} in ${backoffDelay}ms...`);
      
      await sleep(backoffDelay);

      try {
        if (fallbackAction) {
          return await fallbackAction();
        }
        throw new Error('No retry action provided');
      } catch (retryError) {
        console.error(`[RetryStrategy] Attempt ${attempt} failed.`);
        if (attempt >= this.maxRetries) {
          throw retryError;
        }
      }
    }

    throw error;
  }
}
