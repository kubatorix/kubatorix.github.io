// @ts-check
const { test } = require('@playwright/test');

test('inspect swipe positioning', async ({ page }) => {
    await page.goto('/fullstudy.html');
    const swipe = page.locator('.fs-f8__bodyswipe--1');
    await swipe.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const data = await swipe.evaluate((el) => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const purple = el.querySelector('.fs-f8__body--purple');
        const orange = el.querySelector('.fs-f8__body--orange');
        return {
            container: {
                rect: { x: rect.left, y: rect.top, w: rect.width },
                paddingLeft: cs.paddingLeft,
                marginLeft: cs.marginLeft,
                scrollLeft: el.scrollLeft,
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth,
            },
            purple: {
                rect: purple.getBoundingClientRect(),
            },
            orange: {
                rect: orange.getBoundingClientRect(),
            },
        };
    });
    console.log(JSON.stringify(data, null, 2));
});
