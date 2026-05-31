import { CONFIG } from '../../../core/constants';
import { INewsRepository } from './INewsRepository';
import { MockNewsRepository } from './MockNewsRepository';
import { APINewsRepository } from './APINewsRepository';

export * from './INewsRepository';
export * from './MockNewsRepository';
export * from './APINewsRepository';

let repositoryInstance: INewsRepository | null = null;

/**
 * Resolves and provides the configured INewsRepository singleton.
 * Uses USE_MOCK_DATA config flag to swap implementations instantly.
 */
export const getNewsRepository = (): INewsRepository => {
  if (repositoryInstance) return repositoryInstance;

  if (CONFIG.USE_MOCK_DATA) {
    repositoryInstance = new MockNewsRepository();
  } else {
    repositoryInstance = new APINewsRepository();
  }

  return repositoryInstance;
};
