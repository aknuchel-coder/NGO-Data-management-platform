import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { get } from "node:http";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
function serverReady() {
  return new Promise((resolve, reject) => {
    const request = get(base, { timeout: 1000, agent: false }, (response) => {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () =>
        response.statusCode === 200 && body.includes('id="root"')
          ? resolve()
          : reject(new Error("Unexpected development server response.")),
      );
    });
    request.on("error", reject);
    request.on("timeout", () =>
      request.destroy(new Error("Development server probe timed out.")),
    );
  });
}
let server;
try {
  await serverReady();
} catch {
  if (process.env.TEST_BASE_URL)
    throw new Error("TEST_BASE_URL is not reachable.");
  server = spawn(
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      "--host",
      "127.0.0.1",
      "--port",
      "5173",
      "--strictPort",
    ],
    { stdio: "ignore" },
  );
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      await serverReady();
      ready = true;
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  if (!ready) {
    server.kill();
    throw new Error("Development server did not start.");
  }
}
const browser = await chromium.launch({
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
    : {}),
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(30000);
page.setDefaultNavigationTimeout(30000);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await mkdir("test-results", { recursive: true });
try {
  await page.goto(base);
  await page.waitForLoadState("networkidle");
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.waitForFunction(() => document.querySelector("canvas")?.width > 0);
  await page.screenshot({ path: "test-results/home-desktop.png" });
  console.log("Checked: initial desktop rendering.");
  assert.equal(
    await page.getByRole("heading", { level: 1 }).innerText(),
    "A world worth\nacting for.",
  );
  assert.ok((await page.locator(".globe-marker").count()) > 0);
  const span = await page
    .locator(".earth-scroll")
    .evaluate((node) => node.offsetHeight - (window.innerHeight - 80));
  await page.evaluate((y) => window.scrollTo(0, y), span / 2);
  await page.waitForFunction(
    () =>
      document
        .querySelector(".rotation-progress")
        ?.getAttribute("aria-label") === "Globe rotation: 180 of 360 degrees",
  );
  const before = await page.evaluate(() => window.scrollY);
  await page.getByRole("button", { name: "Problems", exact: true }).click();
  assert.equal(await page.evaluate(() => window.scrollY), before);
  assert.equal(
    await page
      .getByRole("button", { name: "Problems", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.getByRole("checkbox", { name: "Climate variations" }).uncheck();
  assert.equal(await page.locator(".risk-marker.climate").count(), 0);
  await page.getByRole("button", { name: "Solutions", exact: true }).click();
  await page.evaluate((y) => window.scrollTo(0, y), span);
  await page.waitForFunction(
    () =>
      document
        .querySelector(".rotation-progress")
        ?.getAttribute("aria-label") === "Globe rotation: 360 of 360 degrees",
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page
    .getByRole("link", {
      name: "Open report: Revive the Spirit of Mosul",
      exact: true,
    })
    .click();
  await page.waitForURL("**/projects/mosul");
  console.log("Checked: globe rotation and marker navigation.");
  await page.waitForFunction(() => {
    const image = document.querySelector(".report-cover img");
    return image?.complete && image.naturalWidth > 0;
  });
  assert.equal(
    await page.getByRole("heading", { level: 1 }).innerText(),
    "Revive the Spirit of Mosul",
  );
  assert.ok(
    await page
      .locator(".report-cover img")
      .evaluate((img) => img.complete && img.naturalWidth > 0),
  );
  assert.equal(await page.locator("iframe").count(), 0);
  assert.ok(
    (await page.locator(".dashboard-empty").innerText()).includes(
      "No Power BI report",
    ),
  );
  await page.screenshot({
    path: "test-results/report-desktop.png",
    fullPage: true,
  });
  await page.reload();
  await page
    .getByRole("heading", { name: "Revive the Spirit of Mosul", exact: true })
    .waitFor();
  await page.goto(`${base}/projects/no-such-project`);
  assert.ok(
    (await page.getByRole("heading", { level: 1 }).innerText()).includes(
      "another place",
    ),
  );
  await page.goto(base);
  await page.getByRole("link", { name: "Skip to projects" }).click();
  await page.locator("#notable").waitFor();
  assert.ok((await page.evaluate(() => window.scrollY)) > span);
  await page.getByRole("button", { name: "CHF 100", exact: true }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "CHF 100", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page
    .getByRole("button", { name: "Choose a project", exact: false })
    .click();
  assert.ok(
    (await page.locator("#donation-options").innerText()).includes(
      "not charged",
    ),
  );
  await page.getByLabel("Your name", { exact: true }).fill("Test Reader");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("test@example.com");
  await page
    .getByLabel("Tell us about your project", { exact: true })
    .fill("Test message, not sent.");
  await page
    .getByRole("button", { name: "Start a conversation", exact: false })
    .click();
  assert.ok(
    (await page.locator(".form-notice").innerText()).includes(
      "no message was sent",
    ),
  );
  console.log("Checked: reports, direct URLs and donation/contact previews.");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
    false,
  );
  await page.screenshot({ path: "test-results/home-mobile.png" });
  await page.goto(`${base}/projects/mosul`);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
    false,
  );
  await page.screenshot({
    path: "test-results/report-mobile.png",
    fullPage: true,
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base);
  await page.waitForFunction(() =>
    document
      .querySelector(".earth-scroll")
      ?.classList.contains("reduced-motion"),
  );
  assert.equal(
    await page
      .locator(".earth-sticky")
      .evaluate((node) => getComputedStyle(node).position),
    "relative",
  );
  console.log("Checked: mobile layouts and reduced-motion mode.");

  // Simulate supplied configuration and a Power BI response; no real account/report is accessed.
  await page.route("**/src/data/projects.ts", async (route) => {
    const response = await route.fetch({ timeout: 10000 });
    const body = (await response.text()).replace(
      'embedUrl: ""',
      'embedUrl: "https://app.powerbi.com/reportEmbed?reportId=test-report"',
    );
    await route.fulfill({ response, body });
  });
  await page.route("https://app.powerbi.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<html><body>Simulated Power BI report</body></html>",
    }),
  );
  await page.goto(`${base}/projects/mosul`);
  await page.locator("iframe").waitFor();
  assert.equal(
    await page.locator("iframe").getAttribute("src"),
    "https://app.powerbi.com/reportEmbed?reportId=test-report",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: desktop/mobile layouts, scroll 0–360°, mode preservation, layer filtering, report routes, deep-link refresh, donation/contact previews, reduced motion and mocked Power BI embedding.",
  );
} catch (error) {
  console.error("Browser failure:", {
    url: page.url(),
    body: (await page.locator("body").innerText()).slice(0, 1200),
    errors,
  });
  await page.screenshot({ path: "test-results/failure.png", fullPage: true });
  throw error;
} finally {
  await browser.close();
  if (server) server.kill();
}
