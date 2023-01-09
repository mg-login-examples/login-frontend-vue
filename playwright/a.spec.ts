import { test, expect } from "@playwright/test";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("visits the app root url", async ({ page }) => {
  await page.goto("/");
  // expect(page.url()).toBe("/");
  expect(page).toHaveURL("/");
  await delay(5000);
});
