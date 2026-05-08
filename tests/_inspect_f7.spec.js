// @ts-check
const { test } = require('@playwright/test');

test('inspect fs-f7 elements', async ({ page }) => {
    await page.goto('/fullstudy.html');
    const sec = page.locator('section.fs-f7');
    await sec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Get every visible element inside fs-f7 with a non-zero box, sorted by Y
    const items = await sec.evaluate((root) => {
        const out = [];
        const all = root.querySelectorAll('*');
        for (const el of all) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden') continue;
            out.push({
                tag: el.tagName.toLowerCase(),
                cls: el.className && el.className.toString ? el.className.toString().slice(0, 60) : '',
                text: (el.textContent || '').trim().slice(0, 40),
                x: Math.round(r.left), y: Math.round(r.top),
                w: Math.round(r.width), h: Math.round(r.height),
                bg: cs.backgroundColor,
                borderColor: cs.borderColor,
            });
        }
        return out.sort((a, b) => a.y - b.y);
    });
    for (const i of items) {
        console.log(`${i.y.toString().padStart(4)} ${i.x.toString().padStart(3)} ${i.w}x${i.h} <${i.tag}> .${i.cls}  "${i.text}"`);
    }
});
