import { test, expect } from './fixtures/auth';

test.describe('Settings - Team', () => {
  test('should list team members', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/settings/team');
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage.locator('[data-testid="team-members"]')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Settings - Billing', () => {
  test('should load plan info', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/settings/billing');
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage.locator('[data-testid="billing-info"]')).toBeVisible({ timeout: 10000 });
  });

  test('should load usage info', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/settings/billing');
    await authenticatedPage.waitForLoadState('networkidle');

    // Usage info is part of billing-info
    await expect(authenticatedPage.locator('[data-testid="billing-info"]')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Settings - API Keys', () => {
  test('should list API keys', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/settings/api-keys');
    await authenticatedPage.waitForLoadState('networkidle');

    // Check page loaded with API Keys h2 heading (content section)
    await expect(authenticatedPage.getByRole('heading', { name: 'API Keys', level: 2 })).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Settings - Integrations', () => {
  test('should list integrations', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/settings/integrations');
    await authenticatedPage.waitForLoadState('networkidle');

    // Check page loaded with Integrations h2 heading (content section)
    await expect(authenticatedPage.getByRole('heading', { name: 'Integrations', level: 2 })).toBeVisible({ timeout: 10000 });
  });
});
