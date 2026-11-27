import { test, expect } from './fixtures/auth';

test.describe('Reports', () => {
  test('should list reports', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/reports');
    await authenticatedPage.waitForLoadState('networkidle');

    // Check page loaded with Reports heading
    await expect(authenticatedPage.getByRole('heading', { name: 'Reports', level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('should display report settings', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/reports');
    await authenticatedPage.waitForLoadState('networkidle');

    // Check page loaded with Scheduled Reports section
    await expect(authenticatedPage.getByText('Scheduled Reports')).toBeVisible({ timeout: 10000 });
  });

  test('should show generate report button', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/reports');
    await authenticatedPage.waitForLoadState('networkidle');

    // Check generate report button is visible
    await expect(authenticatedPage.getByRole('button', { name: /Generate Report/i })).toBeVisible({ timeout: 10000 });
  });
});
