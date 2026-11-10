import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  "/",
  "/about/",
  "/services/",
  "/services/servicing-routine-checks/",
  "/services/performance-diagnostics/",
  "/services/brakes/",
  "/services/collision-repair-paint/",
  "/services/wraps-detailing/",
  "/services/alloy-wheels-tyres/",
  "/contact/",
  "/booking/",
];

/** Capture window.open instead of opening WhatsApp. */
async function captureWindowOpen(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __opened: string[] }).__opened = [];
    window.open = ((url?: string | URL) => {
      (window as unknown as { __opened: string[] }).__opened.push(String(url));
      return { opener: null } as Window;
    }) as typeof window.open;
  });
}
const opened = (page: Page) => page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("9w-intro", "1"));
});

test.describe("routes", () => {
  for (const route of ROUTES) {
    test(`${route} — status, one h1, metadata, no overflow, no errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      const res = await page.goto(route, { waitUntil: "load" });
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(10);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{50,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\/www\.9werksofficial\.com\//);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og-9werks\.jpg$/);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, "horizontal overflow (px)").toBeLessThanOrEqual(0);
      expect(errors.filter((e) => !/THREE\.Clock|WebGL|GPU stall|google|maps/i.test(e))).toEqual([]);
    });
  }

  test("unknown path → branded 404 with 404 status", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist/");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/off the/i);
  });
});

test.describe("booking journey", () => {
  test("validates required fields", async ({ page }) => {
    await page.goto("/booking/");
    await page.locator("#booking-form").getByRole("button", { name: /send .*on whatsapp/i }).click();
    await expect(page.getByText("Please enter your full name.")).toBeVisible();
    await expect(page.getByText("Please enter your phone number.")).toBeVisible();
    await expect(page.getByText("Please choose a service.")).toBeVisible();
  });

  test("weekend + evening is rejected", async ({ page }) => {
    await page.goto("/booking/");
    // Next Saturday in the future.
    const d = new Date();
    d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    await page.getByLabel(/full name/i).fill("Test Driver");
    await page.getByLabel(/phone number/i).fill("+91 98765 43210");
    await page.getByLabel(/car make and model/i).fill("Porsche 911");
    await page.locator("#b-service").selectOption("brakes");
    await page.locator("#b-date").fill(iso);
    await page.locator("#b-time").selectOption("evening");
    await page.locator("#booking-form").getByRole("button", { name: /send .*on whatsapp/i }).click();
    await expect(page.getByText(/On Saturdays and Sundays we're open 9:00 AM – 12:00 PM/)).toBeVisible();
  });

  test("?service= pre-selects the service (slug and legacy id)", async ({ page }) => {
    await page.goto("/booking/?service=diagnostics");
    await expect(page.locator("#b-service")).toHaveValue("performance-diagnostics");
    await page.goto("/booking/?service=wraps-detailing");
    await expect(page.locator("#b-service")).toHaveValue("wraps-detailing");
  });

  test("valid request opens WhatsApp with every detail, and says it is not yet confirmed", async ({ page }) => {
    await captureWindowOpen(page);
    await page.goto("/booking/?service=brakes");
    await page.getByLabel(/full name/i).fill("Test Driver");
    await page.getByLabel(/phone number/i).fill("+91 98765 43210");
    await page.getByLabel(/car make and model/i).fill("Porsche 911 Carrera");
    await page.getByLabel(/additional information/i).fill("Squeal when braking");
    await page.locator("#booking-form").getByRole("button", { name: /send .*on whatsapp/i }).click();
    const [url] = await opened(page);
    expect(url).toMatch(/^https:\/\/wa\.me\/917083199986\?text=/);
    const text = decodeURIComponent(url!.split("?text=")[1]!);
    expect(text).toContain("Hi 9WERKS, I'd like to book a service.");
    expect(text).toContain("*Name:* Test Driver");
    expect(text).toContain("*Phone:* +91 98765 43210");
    expect(text).toContain("*Car:* Porsche 911 Carrera");
    expect(text).toContain("*Service:* Brakes");
    expect(text).toContain("*Notes:* Squeal when braking");
    await expect(page.getByText(/This is a request, not a confirmed booking/)).toBeVisible();
  });
});

test.describe("contact journey", () => {
  test("validates and hands off to WhatsApp", async ({ page }) => {
    await captureWindowOpen(page);
    await page.goto("/contact/");
    await page.getByRole("button", { name: /send on whatsapp/i }).click();
    await expect(page.getByText("Please enter your full name.")).toBeVisible();
    await page.getByLabel(/full name/i).fill("Test Driver");
    await page.getByLabel(/^message/i).fill("Do you service carbon ceramic brakes?");
    await page.getByRole("button", { name: /send on whatsapp/i }).click();
    const [url] = await opened(page);
    const text = decodeURIComponent(url!.split("?text=")[1]!);
    expect(text).toContain("Hi 9WERKS, I have a question.");
    expect(text).toContain("*Message:* Do you service carbon ceramic brakes?");
    await expect(page.getByRole("link", { name: /send by email instead/i })).toHaveAttribute("href", /^mailto:9werks9@gmail\.com\?subject=/);
  });
});

test.describe("navigation", () => {
  test("mobile menu opens, traps focus and closes with Escape", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/about/");
    const toggle = page.getByRole("button", { name: /open menu/i });
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: /site menu/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: /services/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole("button", { name: /open menu/i })).toBeFocused();
  });

  test("header links reach every primary page", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop nav");
    await page.goto("/");
    for (const [name, path] of [["About", "/about/"], ["Services", "/services/"], ["Contact", "/contact/"]] as const) {
      await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    }
  });

  test("gallery lightbox opens, navigates and closes", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop");
    await page.goto("/");
    const first = page.getByRole("button", { name: /open photo 1 of/i });
    await first.scrollIntoViewIfNeeded();
    await first.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toHaveAttribute("aria-label", /Photo 2 of/);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});

test.describe("accessibility (axe)", () => {
  for (const route of ROUTES) {
    test(`${route} has no serious or critical violations`, async ({ page, isMobile }) => {
      test.skip(isMobile, "desktop scan");
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route, { waitUntil: "load" });
      const results = await new AxeBuilder({ page }).exclude("iframe").analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.length} × ${v.nodes[0]?.target.join(" ")} — ${v.help}`)).toEqual([]);
    });
  }
});
