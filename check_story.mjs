import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 5000 }});
await page.goto('http://localhost:8088/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const card = await page.$('.s8__card--story.s8__card--pos2');
if (card) {
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
  await page.waitForTimeout(400);
  await card.screenshot({ path: '/tmp/s8_story_hover.png' });
  console.log('saved');
} else {
  console.log('no card');
}
await browser.close();
