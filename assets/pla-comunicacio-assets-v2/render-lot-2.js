const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });

  const assets = [
    { html: 'A10-carta-etica-1.html', png: 'A10-carta-etica-1.png', w: 1080, h: 1350 },
    { html: 'A13-carta-etica-2.html', png: 'A13-carta-etica-2.png', w: 1080, h: 1350 },
    { html: 'A14-semaforo-metodologic.html', png: 'A14-semaforo-metodologic.png', w: 1200, h: 630 },
    { html: 'N1-silenci-sabien.html', png: 'N1-silenci-sabien.png', w: 1080, h: 1350 },
    { html: 'N2-cinc-setmanes.html', png: 'N2-cinc-setmanes.png', w: 1080, h: 1350 },
    { html: 'N3-manifest-llancament.html', png: 'N3-manifest-llancament.png', w: 1080, h: 1350 },
  ];

  const baseDir = '/home/z/my-project/scripts/assets-redisseny/';
  const outDir = '/home/z/my-project/download/assets-pla-comunicacio-v2/';

  for (const a of assets) {
    await page.goto('file://' + path.resolve(baseDir + a.html), { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: a.w, height: a.h });
    await page.waitForTimeout(800);
    await page.screenshot({ path: outDir + a.png, clip: { x: 0, y: 0, width: a.w, height: a.h } });
    console.log('Generat:', a.png);
  }

  await browser.close();
})();
