// @ts-check
const { test } = require('@playwright/test');
const path = require('path');

for (const state of ['fundraisers', 'both', 'employers']) {
    test(`index hero state ${state}`, async ({ page }, testInfo) => {
        await page.goto('/index.html');
        const hero = page.locator('.hero');
        await hero.waitFor({ state: 'visible' });
        await hero.scrollIntoViewIfNeeded();
        if (state !== 'both') {
            await hero.locator(`.hero__toggle-segment[data-action="${state}"]`).click();
        }
        await page.waitForTimeout(400);
        await hero.screenshot({
            path: path.join(__dirname, '..', 'screenshots', `index-hero-${state}.${testInfo.project.name}.png`),
        });
    });
}
