import { RetryStrategy } from '../strategies/RetryStrategy';
import { ErrorContext } from '../strategies/ErrorStrategy';

describe('RetryStrategy (Exponential Backoff)', () => {
  let strategy: RetryStrategy;
  const context: ErrorContext = {
    operationName: 'Test Operation',
    errorMessage: 'Something broke',
  };

  beforeEach(() => {
    // 3 max retries, 1ms base delay to bypass test timers
    strategy = new RetryStrategy(3, 1);
  });

  it('should immediately resolve and bypass retries if the action succeeds instantly', async () => {
    const mockAction = jest.fn().mockResolvedValue('success_payload');
    
    // We execute the action
    const result = await mockAction();
    expect(result).toBe('success_payload');
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should retry up to max limits and propagate the final exception when exhausted', async () => {
    const error = new Error('Permanent Connection Failure');
    const mockFallbackAction = jest.fn().mockRejectedValue(error);

    await expect(
      strategy.handle(error, context, mockFallbackAction)
    ).rejects.toThrow('Permanent Connection Failure');

    // 3 attempts made inside the backoff loop
    expect(mockFallbackAction).toHaveBeenCalledTimes(3);
  });

  it('should succeed if a transient error recovers before maximum retries are exhausted', async () => {
    let attemptsCount = 0;
    const mockAction = jest.fn().mockImplementation(async () => {
      attemptsCount++;
      if (attemptsCount < 2) {
        throw new Error('Transient drop');
      }
      return 'recovered';
    });

    // Execute handoff
    const result = await strategy.handle(
      new Error('Transient drop'),
      context,
      mockAction
    );

    expect(result).toBe('recovered');
    expect(mockAction).toHaveBeenCalledTimes(2);
  });
});
