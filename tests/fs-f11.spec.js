// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const SHOTS_DIR = path.join(__dirname, '..', 'screenshots');
fs.mkdirSync(SHOTS_DIR, { recursive: true });

test('fs-f11 section visual', async ({ page }, testInfo) => {
    await page.goto('/fullstudy.html');

    const section = page.locator('section.fs-f11');
    await section.waitFor({ state: 'visible' });
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const file = path.join(SHOTS_DIR, `fs-f11.${testInfo.project.name}.png`);
    await section.screenshot({ path: file });
    console.log('Saved screenshot:', file);
});
