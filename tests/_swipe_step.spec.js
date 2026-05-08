// @ts-check
const { test, expect } = require('@playwright/test');

test('fs-f8 swipe track step toggles on horizontal scroll', async ({ page }) => {
    await page.goto('/fullstudy.html');
    const swipe = page.locator('.fs-f8__bodyswipe--1');
    const track = page.locator('.fs-f8__bodyswipe--1 + .fs-f8__swipe-track');
    await swipe.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Initial: step 0
    await expect(track).toHaveAttribute('data-step', '0');

    // Take screenshot of just the track at step 0
    await track.screenshot({ path: 'screenshots/fs-f8.track-step0.png' });

    // Scroll to end → step 1
    await swipe.evaluate((el) => el.scrollTo({ left: el.scrollWidth, behavior: 'instant' }));
    await page.waitForTimeout(400);
    await expect(track).toHaveAttribute('data-step', '1');
    await track.screenshot({ path: 'screenshots/fs-f8.track-step1.png' });

    // Scroll back → step 0
    await swipe.evaluate((el) => el.scrollTo({ left: 0, behavior: 'instant' }));
    await page.waitForTimeout(400);
    await expect(track).toHaveAttribute('data-step', '0');
});
