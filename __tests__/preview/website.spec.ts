import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context, baseURL }) => {
  await context.route("**/*", async (route) => {
    if (new URL(route.request().url()).origin === baseURL) await route.continue();
    else await route.abort();
  });
});

test("the landing and pricing pages work without a backend", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator("header").getByRole("link", { name: "Pricing", exact: true }).click();
  await expect(page).toHaveURL("/pricing");
  await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();
});

test("the mobile navigation supports Escape and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Toggle main menu" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const mobilePricing = page.locator("header").getByRole("link", { name: "Pricing", exact: true });
  await mobilePricing.focus();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("the selected locale is reflected on the document", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "Language" }).click();
  await page.getByRole("menuitem", { name: /Portugu/ }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-br");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-br");
});
