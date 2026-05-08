// @ts-check
const { test } = require('@playwright/test');
const path = require('path');

const SHOTS = path.join(__dirname, '..', 'screenshots');

[ 380, 600, 768, 820, 900, 1024, 1200, 1440, 1700, 1900 ].forEach((width) => {
    test(`hero caption at ${width}px`, async ({ browser }) => {
        const ctx = await browser.newContext({ viewport: { width, height: 800 } });
        const page = await ctx.newPage();
        await page.goto('http://127.0.0.1:8080/fullstudy.html');
        const caption = page.locator('.fs-hero__caption');
        await caption.waitFor({ state: 'visible' });
        await caption.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);

        const data = await page.evaluate(() => {
            const cap = document.querySelector('.fs-hero__caption');
            const lines = Array.from(document.querySelectorAll('.fs-hero__caption-line'));
            return {
                caption: {
                    rect: cap.getBoundingClientRect(),
                    cs: { position: getComputedStyle(cap).position, fontSize: getComputedStyle(cap).fontSize },
                },
                lines: lines.map(l => ({
                    text: l.textContent.trim(),
                    rect: l.getBoundingClientRect(),
                    cs: { display: getComputedStyle(l).display, position: getComputedStyle(l).position, textAlign: getComputedStyle(l).textAlign, width: getComputedStyle(l).width },
                })),
            };
        });
        console.log(`\n=== ${width}px ===`);
        console.log('caption fs:', data.caption.cs.fontSize, 'pos:', data.caption.cs.position);
        for (const l of data.lines) {
            console.log(`  ${l.cs.textAlign.padEnd(8)} ${l.cs.display.padEnd(8)} ${l.cs.position.padEnd(10)} w=${l.cs.width.padEnd(10)} y=${Math.round(l.rect.top)} "${l.text}"`);
        }

        await caption.screenshot({ path: path.join(SHOTS, `hero-${width}.png`) });
        await page.locator('.fs-hero').screenshot({ path: path.join(SHOTS, `hero-section-${width}.png`) });
        await ctx.close();
    });
});
