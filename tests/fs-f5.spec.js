// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const SHOTS_DIR = path.join(__dirname, '..', 'screenshots');
fs.mkdirSync(SHOTS_DIR, { recursive: true });

for (const genState of ['older', 'younger']) {
    test(`fs-f5 section visual (${genState})`, async ({ page }, testInfo) => {
        await page.goto('/fullstudy.html');

        const section = page.locator('section.fs-f5');
        await section.waitFor({ state: 'visible' });
        await section.scrollIntoViewIfNeeded();

        if (genState === 'younger') {
            await section.locator('.fs-f5__legend--gen .fs-f5__legend-swatch--purple').click();
        }
        await page.waitForTimeout(800);

        const file = path.join(SHOTS_DIR, `fs-f5.${genState}.${testInfo.project.name}.png`);
        await section.screenshot({ path: file });
        console.log('Saved screenshot:', file);
    });
}
