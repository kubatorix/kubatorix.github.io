// @ts-check
const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Map current implementation selectors to figma frame info (id, name, w, h, y).
// Selectors should match a single visible block we can measure directly.
const TARGETS = [
    // fs-f7
    { fig: '282:1598', figW: 336, figH: 49, sel: '.fs-f7__heading', label: 'fs-f7 heading' },
    { fig: '282:1610', figW: 347, figH: 516, sel: '.fs-f7__bridge', label: 'fs-f7 bridge' },
    { fig: '282:1610-tail', figW: 347, figH: 60, sel: '.fs-f7__bridge-tail', label: 'fs-f7 bridge-tail' },
    { fig: '282:1601-num-orange', figW: 80, figH: 30, sel: '.fs-f7__num--orange', label: 'fs-f7 num orange' },
    { fig: '282:1601-num-purple', figW: 80, figH: 30, sel: '.fs-f7__num--purple', label: 'fs-f7 num purple' },
    // fs-f8 sub-block 1
    { fig: '282:1613', figW: 339, figH: 54, sel: '.fs-f8__heading--1', label: 'fs-f8 heading-1' },
    { fig: '282:1647', figW: 330, figH: 135, sel: '.fs-f8__mega-1', label: 'fs-f8 mega-1' },
    { fig: '282:1650', figW: 333, figH: 63, sel: '.fs-f8__minicopy-1', label: 'fs-f8 minicopy-1' },
    { fig: '282:1617', figW: 341, figH: 40, sel: '.fs-f8__toggle--1', label: 'fs-f8 toggle-1' },
    { fig: '282:1837+1838', figW: 280, figH: 200, sel: '.fs-f8__body--purple', label: 'fs-f8 body-purple' },
    { fig: '282:1839', figW: 335, figH: 80, sel: '.fs-f8__body--orange', label: 'fs-f8 body-orange' },
];

test('measure', async ({ page }) => {
    await page.goto('/fullstudy.html');
    await page.waitForTimeout(500);

    const out = [];
    for (const t of TARGETS) {
        const el = page.locator(t.sel).first();
        await el.scrollIntoViewIfNeeded().catch(() => {});
        const box = await el.boundingBox().catch(() => null);
        const w = box?.width ?? null;
        const h = box?.height ?? null;
        out.push({
            label: t.label,
            sel: t.sel,
            figmaW: t.figW,
            figmaH: t.figH,
            renderW: w,
            renderH: h,
            dW: w !== null ? +(w - t.figW).toFixed(1) : null,
            dH: h !== null ? +(h - t.figH).toFixed(1) : null,
            ratioW: w !== null ? +(w / t.figW).toFixed(3) : null,
            ratioH: h !== null ? +(h / t.figH).toFixed(3) : null,
        });
    }
    fs.writeFileSync(path.join(__dirname, '..', 'screenshots', '_measurements.json'), JSON.stringify(out, null, 2));
    console.log(JSON.stringify(out, null, 2));
});
