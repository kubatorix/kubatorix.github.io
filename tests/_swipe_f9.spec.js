// @ts-check
const { test, expect } = require('@playwright/test');

test('fs-f9 body row swipes + step indicator toggles', async ({ page }) => {
    await page.goto('/fullstudy.html');
    const swipe = page.locator('.fs-f9__bodyswipe');
    const track = page.locator('.fs-f9__swipe-track');
    await swipe.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await expect(track).toHaveAttribute('data-step', '0');

    await swipe.evaluate((el) => el.scrollTo({ left: el.scrollWidth, behavior: 'instant' }));
    await page.waitForTimeout(300);
    await expect(track).toHaveAttribute('data-step', '1');
});
