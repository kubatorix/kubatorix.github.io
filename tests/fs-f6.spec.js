// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const SHOTS_DIR = path.join(__dirname, '..', 'screenshots');
fs.mkdirSync(SHOTS_DIR, { recursive: true });

test('fs-f6 section visual', async ({ page }, testInfo) => {
    await page.goto('/fullstudy.html');

    const section = page.locator('section.fs-f6');
    await section.waitFor({ state: 'visible' });
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const file = path.join(SHOTS_DIR, `fs-f6.${testInfo.project.name}.png`);
    await section.screenshot({ path: file });
    console.log('Saved screenshot:', file);
});

test('fs-f6 final block visual', async ({ page }, testInfo) => {
    await page.goto('/fullstudy.html');

    const block = page.locator('.fs-f6__final');
    await block.waitFor({ state: 'visible' });
    await block.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const file = path.join(SHOTS_DIR, `fs-f6-final.${testInfo.project.name}.png`);
    await block.screenshot({ path: file });
    console.log('Saved screenshot:', file);
});
