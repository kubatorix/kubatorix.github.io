// @ts-check
const { test } = require('@playwright/test');

test('inspect fs-f9 swipe positioning', async ({ page }) => {
    await page.goto('/fullstudy.html');
    const swipe = page.locator('.fs-f9__bodyswipe');
    await swipe.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const data = await swipe.evaluate((el) => {
        const purple = el.querySelector('.fs-f9__bodyswipe-card--purple').getBoundingClientRect();
        const orange = el.querySelector('.fs-f9__bodyswipe-card--orange').getBoundingClientRect();
        return {
            scrollLeft: el.scrollLeft,
            purpleLeft: Math.round(purple.left),
            purpleWidth: Math.round(purple.width),
            orangeLeft: Math.round(orange.left),
            orangeWidth: Math.round(orange.width),
        };
    });
    console.log(JSON.stringify(data));
});
