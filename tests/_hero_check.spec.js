// @ts-check
const { test } = require('@playwright/test');
const path = require('path');

test('fs-hero caption visual', async ({ page }, testInfo) => {
    await page.goto('/fullstudy.html');
    const caption = page.locator('.fs-hero__caption');
    await caption.waitFor({ state: 'visible' });
    await caption.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await caption.screenshot({
        path: path.join(__dirname, '..', 'screenshots', `fs-hero-caption.${testInfo.project.name}.png`),
    });
});

test('index hero caption visual', async ({ page }, testInfo) => {
    await page.goto('/index.html');
    const caption = page.locator('.hero__caption').first();
    await caption.waitFor({ state: 'visible' });
    await caption.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await caption.screenshot({
        path: path.join(__dirname, '..', 'screenshots', `index-hero-caption.${testInfo.project.name}.png`),
    });
});
