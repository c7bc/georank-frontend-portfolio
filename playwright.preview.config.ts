import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PREVIEW_PORT ?? 3818);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "__tests__/preview",
  reporter: "list",
  retries: 0,
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE },
  },
  webServer: {
    command: "npm start",
    url: baseURL,
    reuseExistingServer: false,
    env: { NEXT_TELEMETRY_DISABLED: "1", HOSTNAME: "127.0.0.1", PORT: String(port) },
  },
});
