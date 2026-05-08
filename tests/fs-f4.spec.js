// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const SHOTS_DIR = path.join(__dirname, '..', 'screenshots');
fs.mkdirSync(SHOTS_DIR, { recursive: true });

for (const state of ['both', 'fundraisers', 'employers']) {
    test(`fs-f4 section visual (${state})`, async ({ page }, testInfo) => {
        await page.goto('/fullstudy.html');

        const section = page.locator('section.fs-f4');
        await section.waitFor({ state: 'visible' });
        await section.scrollIntoViewIfNeeded();

        if (state !== 'both') {
            await section.locator(`.s3p5__seg[data-action="${state}"]`).click();
        }
        // Mega numbers animate (count-up) on state change; wait for it.
        await page.waitForTimeout(1800);

        const file = path.join(SHOTS_DIR, `fs-f4.${state}.${testInfo.project.name}.png`);
        await section.screenshot({ path: file });
        console.log('Saved screenshot:', file);
    });
}
