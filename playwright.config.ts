import { defineConfig, devices } from "@playwright/test";

/**
 * E2E suite against the production export (out/) served like the real host.
 *   npm run build && npm run test:e2e
 * Uses the system Google Chrome (no browser download needed).
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 2,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    channel: "chrome",
    trace: "off",
  },
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4173",
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
});
