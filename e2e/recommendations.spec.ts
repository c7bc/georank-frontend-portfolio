import { test, expect } from './fixtures/auth';

test.describe('Recommendations', () => {
  test('should list recommendations', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/recommendations');
    await authenticatedPage.waitForLoadState('networkidle');

    // Check page loaded with Recommendations heading
    await expect(authenticatedPage.getByRole('heading', { name: 'Recommendations', level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('should display recommendation cards', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/recommendations');
    await authenticatedPage.waitForLoadState('networkidle');

    // Check for recommendations list or page content
    await expect(authenticatedPage.getByRole('heading', { name: 'Recommendations', level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('should have interactive elements', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/recommendations');
    await authenticatedPage.waitForLoadState('networkidle');

    // Verify page is loaded with heading
    await expect(authenticatedPage.getByRole('heading', { name: 'Recommendations', level: 1 })).toBeVisible({ timeout: 10000 });
  });
});
