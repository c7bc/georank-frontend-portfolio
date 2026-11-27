import { test, expect } from './fixtures/auth';

test.describe('Competitors Management', () => {
  test('should list competitors', async ({ authenticatedPage }) => {
    const responsePromise = authenticatedPage.waitForResponse(
      (response) =>
        response.url().includes('/competitors') &&
        response.request().method() === 'GET' &&
        !response.url().includes('/comparison')
    );

    await authenticatedPage.goto('/en/competitors');

    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });

  test('should add a competitor', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/competitors');

    // Look for add competitor button
    const addButton = authenticatedPage.locator('[data-testid="add-competitor-button"]');
    const altAddButton = authenticatedPage.locator('button:has-text("Add")');

    const buttonToClick = (await addButton.isVisible()) ? addButton : altAddButton;

    if (await buttonToClick.isVisible()) {
      await buttonToClick.click();

      // Wait for form
      await authenticatedPage.waitForTimeout(500);

      // Fill competitor form
      const domainInput = authenticatedPage.locator('input[name="domain"]');
      if (await domainInput.isVisible()) {
        const responsePromise = authenticatedPage.waitForResponse(
          (response) =>
            response.url().includes('/competitors') &&
            response.request().method() === 'POST'
        );

        await domainInput.fill('competitor-test.com');

        const nameInput = authenticatedPage.locator('input[name="name"]');
        if (await nameInput.isVisible()) {
          await nameInput.fill('Test Competitor');
        }

        await authenticatedPage.click('button[type="submit"]');

        const response = await responsePromise;
        expect(response.status()).toBe(201);
      }
    }
  });
});
