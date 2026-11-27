import { test, expect, type APIRequestContext } from '@playwright/test';

const API_BASE_URL = 'http://localhost:8080/api';

// Helper to generate unique email
function generateEmail() {
  return `test.${Date.now()}@example.com`;
}

// Helper to create user via API
async function createUserViaAPI(request: APIRequestContext, email: string, password: string, name = 'Test User') {
  const response = await request.post(`${API_BASE_URL}/auth/signup`, {
    data: {
      name,
      email,
      password,
    },
  });
  return response;
}

test.describe('Authentication Flow', () => {
  test('should signup successfully', async ({ page }) => {
    const email = generateEmail();

    await page.goto('/en/signup');

    // Wait for page to fully load and hydrate
    await page.waitForLoadState('networkidle');

    // Wait for the form to be interactive
    await page.waitForSelector('input#name', { state: 'visible', timeout: 10000 });

    // Fill the signup form
    await page.fill('input#name', 'Test User');
    await page.fill('input#email', email);
    await page.fill('input#password', 'TestPassword123!');

    // Accept terms - click the checkbox
    await page.click('#terms');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to onboarding or dashboard
    await expect(page).toHaveURL(/\/(onboarding|dashboard)/, { timeout: 15000 });
  });

  test('should login with valid credentials', async ({ page, request }) => {
    const email = generateEmail();
    const password = 'TestPassword123!';

    // First create user via API
    const signupResponse = await createUserViaAPI(request, email, password);
    expect(signupResponse.ok()).toBeTruthy();

    // Now login via form
    await page.goto('/en/login');

    // Wait for page to fully load and hydrate
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input#email', { state: 'visible', timeout: 10000 });

    await page.fill('input#email', email);
    await page.fill('input#password', password);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/en/login');

    // Wait for page to fully load and hydrate
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input#email', { state: 'visible', timeout: 10000 });

    await page.fill('input#email', 'invalid@test.com');
    await page.fill('input#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Wait for form submission
    await page.waitForTimeout(2000);

    // Should show error message (in destructive color)
    const errorMessage = page.locator('.bg-destructive\\/10, .text-destructive');
    await expect(errorMessage.first()).toBeVisible({ timeout: 10000 });

    // Should stay on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect unauthenticated user from dashboard', async ({ page, context }) => {
    // Clear all cookies to ensure we're not authenticated
    await context.clearCookies();

    // Clear localStorage on next navigation
    await page.addInitScript(() => {
      localStorage.clear();
    });

    // Try to access dashboard without auth
    await page.goto('/en/dashboard', { waitUntil: 'networkidle' });

    // Should redirect to login (may take a moment for SSR to process)
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});
