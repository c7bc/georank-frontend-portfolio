import { test, expect } from './fixtures/auth';

test.describe('Dashboard', () => {
  test('should display metrics from API', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/dashboard');
    await authenticatedPage.waitForLoadState('networkidle');

    // Check that metric cards are visible
    const metricCards = authenticatedPage.locator('[data-testid="metric-card"]');
    await expect(metricCards.first()).toBeVisible({ timeout: 10000 });
    await expect(metricCards).toHaveCount(4);
  });

  test('should load visibility chart data', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/dashboard');
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage.locator('[data-testid="visibility-chart"]')).toBeVisible({ timeout: 10000 });
  });

  test('should load recent mentions', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/dashboard');
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage.locator('[data-testid="recent-mentions"]')).toBeVisible({ timeout: 10000 });
  });

  test('should load top keywords', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/dashboard');
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage.locator('[data-testid="top-keywords"]')).toBeVisible({ timeout: 10000 });
  });

  test('should load competitor comparison', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/dashboard');
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage.locator('[data-testid="competitor-comparison"]')).toBeVisible({ timeout: 10000 });
  });
});
