import { MockNewsRepository } from '../repository/MockNewsRepository';
import { MOCK_CATEGORIES } from '../../../core/mocks';

describe('MockNewsRepository', () => {
  let repository: MockNewsRepository;

  beforeEach(() => {
    // Initialize repository with 0 delay for instant testing runs
    repository = new MockNewsRepository(0);
  });

  it('should fetch the correct set of hyperlocal categories matching domain specs', async () => {
    const categories = await repository.fetchCategories();
    expect(categories).toEqual(MOCK_CATEGORIES);
    expect(categories).toContain('Local');
    expect(categories).toContain('Sports');
  });

  it('should retrieve a paginated feed response for selected categories', async () => {
    const response = await repository.fetchArticles('Local', 1);
    
    expect(response.page).toBe(1);
    expect(response.totalPages).toBe(3);
    expect(response.data.length).toBeGreaterThan(0);

    // Verify card structure contains the correct types
    const firstItem = response.data[0];
    expect(firstItem).toHaveProperty('id');
    expect(firstItem).toHaveProperty('type');
    expect(firstItem).toHaveProperty('data');
  });

  it('should return empty list on page index exceeding limit bounds', async () => {
    const response = await repository.fetchArticles('Local', 4);
    expect(response.data).toEqual([]);
    expect(response.page).toBe(4);
  });

  it('should correctly format and add a new user comment', async () => {
    const articleId = 'news-Local-1-0';
    const commentText = 'This is a test comment!';
    
    const comment = await repository.addComment(articleId, commentText);
    
    expect(comment.articleId).toBe(articleId);
    expect(comment.content).toBe(commentText);
    expect(comment.authorName).toBe('You (Local Citizen)');
    expect(comment.id).toBeDefined();
  });
});
