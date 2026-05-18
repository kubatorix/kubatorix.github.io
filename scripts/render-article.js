// Render a local HTML at a given viewport width and save a full-page screenshot.
// Usage: node scripts/render-article.js article-3.html 1440 screenshot-3-web.png
//        node scripts/render-article.js article-3.html  375 screenshot-3-mob.png
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

async function main() {
  const [, , htmlRel, widthStr, outRel] = process.argv;
  if (!htmlRel || !widthStr || !outRel) {
    console.error('usage: node render-article.js <html-relative-path> <viewport-width> <out-png-path>');
    process.exit(2);
  }
  const root = path.resolve(__dirname, '..');
  const htmlAbs = path.resolve(root, htmlRel);
  const outAbs = path.resolve(root, outRel);
  if (!fs.existsSync(htmlAbs)) {
    console.error('html not found:', htmlAbs);
    process.exit(2);
  }
  const width = parseInt(widthStr, 10);
  if (!width) {
    console.error('bad width:', widthStr);
    process.exit(2);
  }

  // Launch the Chromium that ships with playwright-core.
  // Use a small initial viewport — full-page screenshot expands height.
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width, height: 800 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const fileUrl = 'file:///' + htmlAbs.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'load', timeout: 30000 });
  // Wait for fonts and images to settle.
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    const imgs = Array.from(document.images || []);
    await Promise.all(imgs.map(img => img.complete ? null : new Promise(r => {
      img.addEventListener('load', r, { once: true });
      img.addEventListener('error', r, { once: true });
    })));
  });
  // Small settle pause for any deferred layout (header/footer injection scripts).
  await page.waitForTimeout(400);
  await page.screenshot({ path: outAbs, fullPage: true });
  await browser.close();
  console.log('wrote', outAbs);
}

main().catch(err => { console.error(err); process.exit(1); });
