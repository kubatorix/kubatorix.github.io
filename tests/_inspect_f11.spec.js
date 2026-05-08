// @ts-check
const { test } = require('@playwright/test');

test('inspect fs-f11 staircase positioning', async ({ page }) => {
    await page.goto('/fullstudy.html');
    const staircase = page.locator('.fs-f11 .fs-f10__staircase');
    await staircase.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const data = await page.evaluate(() => {
        const sel = '.fs-f11 .fs-f10__staircase';
        const el = document.querySelector(sel);
        if (!el) return { err: 'not found' };
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const pdf = document.querySelector('.fs-f11__cta-pdf');
        const pdfR = pdf?.getBoundingClientRect();
        const pdfCs = pdf ? getComputedStyle(pdf) : null;
        return {
            staircase: {
                position: cs.position,
                display: cs.display,
                order: cs.order,
                top: r.top,
                bottom: r.bottom,
            },
            pdf: pdfR ? {
                position: pdfCs.position,
                order: pdfCs.order,
                top: pdfR.top,
                bottom: pdfR.bottom,
            } : null,
        };
    });
    console.log(JSON.stringify(data, null, 2));
});
