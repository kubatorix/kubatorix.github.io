// @ts-check
const { test } = require('@playwright/test');

test('inspect fs-f8 sub2 elements', async ({ page }) => {
    await page.goto('/fullstudy.html');
    const sec = page.locator('section.fs-f8');
    await sec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const items = await page.evaluate(() => {
        const sels = ['.fs-f8__heading--2', '.fs-f8__word--orange', '.fs-f8__word--purple', '.fs-f8__deco', '.fs-f8__lead--purple', '.fs-f8__lead--orange'];
        return sels.map((s) => {
            const el = document.querySelector(s);
            const r = el ? el.getBoundingClientRect() : null;
            const cs = el ? getComputedStyle(el) : null;
            return {
                sel: s,
                box: r ? { y: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) } : null,
                marginTop: cs?.marginTop,
                marginBottom: cs?.marginBottom,
                lineHeight: cs?.lineHeight,
                fontSize: cs?.fontSize,
                height: cs?.height,
            };
        });
    });
    for (const i of items) console.log(i.sel, JSON.stringify(i));
});
