// @ts-check
const { test } = require('@playwright/test');

test('inspect zoom', async ({ page }) => {
    await page.goto('/fullstudy.html');
    await page.waitForTimeout(300);

    const data = await page.evaluate(() => {
        const sec = document.querySelector('.fs-f8');
        const canvas = document.querySelector('.fs-f8__canvas');
        return {
            viewport: window.innerWidth,
            sec: {
                rect: sec.getBoundingClientRect(),
                zoom: getComputedStyle(sec).zoom,
            },
            canvas: {
                rect: canvas.getBoundingClientRect(),
                width: getComputedStyle(canvas).width,
            },
        };
    });
    console.log(JSON.stringify(data, null, 2));
});
