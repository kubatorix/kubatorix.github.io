// @ts-check
const { test } = require('@playwright/test');

test('measure section8 pills + connector', async ({ page }) => {
    await page.goto('/index.html');
    await page.locator('.section8__phase8').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const data = await page.evaluate(() => {
        const card = document.querySelector('.s8__card--story');
        if (!card) return null;
        const cardR = card.getBoundingClientRect();
        const pills = Array.from(card.querySelectorAll('.s8__pill, .s8__connector')).map((el) => {
            const r = el.getBoundingClientRect();
            return {
                cls: el.className,
                left: r.left - cardR.left,
                right: r.right - cardR.left,
                width: r.width,
                text: el.textContent.trim(),
            };
        });
        return pills;
    });
    console.log(JSON.stringify(data, null, 2));
});
