const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });

  // 1. A12 quadrat
  await page.goto('file://' + path.resolve('/home/z/my-project/scripts/assets-redisseny/A12-quadrat.html'), { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 1080, height: 1080 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/home/z/my-project/download/LinkedIn/A12-on-es-perd-temps-quadrat.png', clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  console.log('✓ A12 quadrat');

  // 2. A14 quadrat
  await page.goto('file://' + path.resolve('/home/z/my-project/scripts/assets-redisseny/A14-quadrat.html'), { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 1080, height: 1080 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/home/z/my-project/download/LinkedIn/A14-semaforo-metodologic-quadrat.png', clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  console.log('✓ A14 quadrat');

  // 3. C1 Carousel - renderitzat com a PDF per a LinkedIn
  await page.goto('file://' + path.resolve('/home/z/my-project/scripts/assets-redisseny/C1-carousel.html'), { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 1080, height: 1080 });
  await page.waitForTimeout(800);
  await page.pdf({
    path: '/home/z/my-project/download/LinkedIn/C1-carousel-que-es-criteri-esg.pdf',
    width: '1080px',
    height: '1080px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log('✓ C1 carousel PDF');

  // 4. C1 Carousel - també PNG individuals per a previsualització
  // Cada .page és una pàgina del carousel. Renderitzem cadascuna.
  const pages = await page.$$('.page');
  for (let i = 0; i < pages.length; i++) {
    await pages[i].screenshot({ path: `/home/z/my-project/download/LinkedIn/C1-carousel-page-${String(i + 1).padStart(2, '0')}.png` });
    console.log(`✓ C1 page ${i + 1}`);
  }

  await browser.close();
})();
