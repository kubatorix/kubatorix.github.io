// @ts-check
const { test, expect } = require('@playwright/test');

test('fs-f8 body row swipes horizontally', async ({ page }) => {
    await page.goto('/fullstudy.html');
    const swipe = page.locator('.fs-f8__bodyswipe--1');
    await swipe.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const initial = await swipe.evaluate((el) => ({
        scrollLeft: el.scrollLeft,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        children: Array.from(el.children).map((c) => ({
            cls: c.className,
            w: c.getBoundingClientRect().width,
        })),
    }));
    console.log('initial:', JSON.stringify(initial, null, 2));

    // Programmatically scroll to next snap point
    await swipe.evaluate((el) => {
        el.scrollTo({ left: el.scrollWidth, behavior: 'instant' });
    });
    await page.waitForTimeout(200);

    const after = await swipe.evaluate((el) => ({ scrollLeft: el.scrollLeft }));
    console.log('after scroll:', JSON.stringify(after));

    expect(initial.scrollWidth).toBeGreaterThan(initial.clientWidth);
    expect(after.scrollLeft).toBeGreaterThan(0);
});
