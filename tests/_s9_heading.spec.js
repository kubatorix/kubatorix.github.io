// @ts-check
const { test } = require('@playwright/test');
const path = require('path');

test('s9 heading visual', async ({ page }, testInfo) => {
    await page.goto('/index.html');
    const heading = page.locator('.s9__heading');
    await heading.waitFor({ state: 'visible' });
    await heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await heading.screenshot({
        path: path.join(__dirname, '..', 'screenshots', `s9-heading.${testInfo.project.name}.png`),
    });
});
