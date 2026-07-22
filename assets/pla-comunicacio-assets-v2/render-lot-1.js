const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });

  const assets = [
    { html: '/home/z/my-project/scripts/assets-redisseny/A4-mapa-estandards-og.html', png: '/home/z/my-project/download/assets-pla-comunicacio-v2/A4-mapa-estandards-og.png', w: 1200, h: 630 },
    { html: '/home/z/my-project/scripts/assets-redisseny/A7-llista-30-fonts.html', png: '/home/z/my-project/download/assets-pla-comunicacio-v2/A7-llista-30-fonts.png', w: 1080, h: 1350 },
    { html: '/home/z/my-project/scripts/assets-redisseny/A9-saber-sin-poder.html', png: '/home/z/my-project/download/assets-pla-comunicacio-v2/A9-saber-sin-poder.png', w: 1080, h: 1350 },
    { html: '/home/z/my-project/scripts/assets-redisseny/A12-on-es-perd-temps.html', png: '/home/z/my-project/download/assets-pla-comunicacio-v2/A12-on-es-perd-temps.png', w: 1200, h: 630 },
  ];

  for (const a of assets) {
    await page.goto('file://' + path.resolve(a.html), { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: a.w, height: a.h });
    await page.waitForTimeout(800);
    await page.screenshot({ path: a.png, clip: { x: 0, y: 0, width: a.w, height: a.h } });
    console.log('Generat:', path.basename(a.png));
  }

  await browser.close();
})();
