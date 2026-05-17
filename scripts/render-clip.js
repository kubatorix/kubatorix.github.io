// Render a local HTML and screenshot a CLIP rectangle.
// Usage: node scripts/render-clip.js article-3.html 1440 0 1700 1440 600 out.png
//                                              html  vp_w  x  y    w   h   out
const { chromium } = require('playwright-core');
const path = require('path');

async function main() {
  const [, , htmlRel, vpwStr, xStr, yStr, wStr, hStr, outRel] = process.argv;
  const root = path.resolve(__dirname, '..');
  const htmlAbs = path.resolve(root, htmlRel);
  const outAbs = path.resolve(root, outRel);
  const vpw = parseInt(vpwStr, 10);
  const clip = { x: +xStr, y: +yStr, width: +wStr, height: +hStr };
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: vpw, height: 800 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('file:///' + htmlAbs.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const imgs = Array.from(document.images || []);
    await Promise.all(imgs.map(img => img.complete ? null : new Promise(r => {
      img.addEventListener('load', r, { once: true });
      img.addEventListener('error', r, { once: true });
    })));
  });
  await page.waitForTimeout(400);
  // Resize viewport tall enough to include the clip.
  await page.setViewportSize({ width: vpw, height: clip.y + clip.height + 100 });
  await page.waitForTimeout(200);
  await page.screenshot({ path: outAbs, clip });
  await browser.close();
  console.log('wrote', outAbs);
}
main().catch(e => { console.error(e); process.exit(1); });
