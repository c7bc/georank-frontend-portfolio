import { test as base, expect, Page } from '@playwright/test';

const API_BASE_URL = 'http://localhost:8080/api';

// Generate unique test user data
function generateTestUser() {
  const timestamp = Date.now();
  return {
    name: `Test User ${timestamp}`,
    email: `test.${timestamp}@example.com`,
    password: 'TestPassword1234',
  };
}

// Extended test with authenticated page fixture
export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page, context }, provide) => {
    const testUser = generateTestUser();

    // Create user via API
    const signupResponse = await page.request.post(`${API_BASE_URL}/auth/signup`, {
      data: testUser,
    });

    if (!signupResponse.ok()) {
      throw new Error(`Failed to create test user: HTTP ${signupResponse.status()}`);
    }

    const authData = await signupResponse.json();

    // Handle both wrapped and unwrapped response formats
    const token = authData.data?.token || authData.token;

    if (!token) {
      throw new Error("No token received from test signup");
    }

    // Set the access_token cookie
    await context.addCookies([
      {
        name: 'access_token',
        value: token,
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        sameSite: 'Lax',
      },
    ]);

    // Also set in localStorage for client-side access
    await page.addInitScript((tkn) => {
      localStorage.setItem('access_token', tkn);
    }, token);

    // Navigate to a page to ensure cookies/localStorage are applied
    await page.goto('/en/dashboard');
    await page.waitForLoadState('networkidle');

    await provide(page);
  },
});

export { expect };
