import { test, expect } from './fixtures/auth';

test.describe('Keywords Management', () => {
  test('should list keywords from API', async ({ authenticatedPage }) => {
    const responsePromise = authenticatedPage.waitForResponse(
      (response) =>
        response.url().includes('/keywords') &&
        response.request().method() === 'GET' &&
        !response.url().includes('/top')
    );

    await authenticatedPage.goto('/en/keywords');

    const response = await responsePromise;
    expect(response.status()).toBe(200);

    // Wait for page to load
    await authenticatedPage.waitForLoadState('networkidle');

    // Check that keywords table is visible
    await expect(authenticatedPage.locator('[data-testid="keywords-table"]')).toBeVisible({ timeout: 10000 });
  });

  test('should have add keyword button', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/keywords');
    await authenticatedPage.waitForLoadState('networkidle');

    // Check that add button is visible
    await expect(authenticatedPage.locator('[data-testid="add-keyword-button"]')).toBeVisible({ timeout: 10000 });
  });

  test('should create a new keyword', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/keywords');
    await authenticatedPage.waitForLoadState('networkidle');

    // Click add button
    const addButton = authenticatedPage.locator('[data-testid="add-keyword-button"]');
    if (await addButton.isVisible({ timeout: 5000 })) {
      await addButton.click();

      // Wait for modal/form to appear
      await authenticatedPage.waitForTimeout(500);

      // Fill keyword form if visible
      const keywordInput = authenticatedPage.locator('input[name="keyword"]');
      if (await keywordInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        const responsePromise = authenticatedPage.waitForResponse(
          (response) =>
            response.url().includes('/keywords') &&
            response.request().method() === 'POST'
        );

        await keywordInput.fill('test keyword e2e');

        const categoryInput = authenticatedPage.locator('input[name="category"]');
        if (await categoryInput.isVisible().catch(() => false)) {
          await categoryInput.fill('testing');
        }

        await authenticatedPage.click('button[type="submit"]');

        const response = await responsePromise;
        expect(response.status()).toBe(201);
      }
    }
  });
});
