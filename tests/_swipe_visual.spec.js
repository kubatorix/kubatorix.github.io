// @ts-check
const { test } = require('@playwright/test');
const path = require('path');

const SHOTS = path.join(__dirname, '..', 'screenshots');

test('fs-f8 swipe visual at both steps', async ({ page }) => {
    await page.goto('/fullstudy.html');
    const swipe = page.locator('.fs-f8__bodyswipe--1');
    await swipe.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Capture wider area: track + bodies
    const wrap = page.locator('.fs-f8__canvas');

    await page.locator('.fs-f8__swipe-track').scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(SHOTS, 'fs-f8.swipe-step0.png'), clip: { x: 0, y: 200, width: 381, height: 600 }, fullPage: true });

    await swipe.evaluate((el) => el.scrollTo({ left: el.scrollWidth, behavior: 'instant' }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SHOTS, 'fs-f8.swipe-step1.png'), clip: { x: 0, y: 200, width: 381, height: 600 }, fullPage: true });
});
