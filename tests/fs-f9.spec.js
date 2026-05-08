// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const SHOTS_DIR = path.join(__dirname, '..', 'screenshots');
fs.mkdirSync(SHOTS_DIR, { recursive: true });

test('fs-f9 section visual', async ({ page }, testInfo) => {
    await page.goto('/fullstudy.html');

    const section = page.locator('section.fs-f9');
    await section.waitFor({ state: 'visible' });
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const file = path.join(SHOTS_DIR, `fs-f9.${testInfo.project.name}.png`);
    await section.screenshot({ path: file });
    console.log('Saved screenshot:', file);
});
