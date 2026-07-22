const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: 'criteri', password: 'esg2026' },
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const pages = [
    { url: 'http://localhost:3000/', name: '01-homepage' },
    { url: 'http://localhost:3000/que-fem', name: '02-que-fem' },
    { url: 'http://localhost:3000/qui-som', name: '03-qui-som' },
    { url: 'http://localhost:3000/informes', name: '04-biblioteca-informes' },
    { url: 'http://localhost:3000/estandares-esg', name: '05-estandares-esg' },
    { url: 'http://localhost:3000/cuenta', name: '06-cuenta' },
  ];

  for (const p of pages) {
    const page = await context.newPage();
    try {
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: `/home/z/my-project/download/auditoria-web/capturas/${p.name}-desktop.png`,
        fullPage: true,
      });
      console.log(`✓ Desktop: ${p.name}`);
    } catch (e) {
      console.log(`✗ Error en ${p.name}: ${e.message.substring(0, 80)}`);
    }
    await page.close();
  }

  const mobileContext = await browser.newContext({
    httpCredentials: { username: 'criteri', password: 'esg2026' },
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });

  for (const p of pages.slice(0, 4)) {
    const page = await mobileContext.newPage();
    try {
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: `/home/z/my-project/download/auditoria-web/capturas/${p.name}-mobile.png`,
        fullPage: true,
      });
      console.log(`✓ Mobile: ${p.name}`);
    } catch (e) {
      console.log(`✗ Mobile error en ${p.name}: ${e.message.substring(0, 80)}`);
    }
    await page.close();
  }

  const informePage = await context.newPage();
  try {
    await informePage.goto('http://localhost:3000/informes', { waitUntil: 'networkidle', timeout: 30000 });
    await informePage.waitForTimeout(1000);
    const firstInforme = await informePage.$('a[href*="/informes/"]');
    if (firstInforme) {
      await firstInforme.click();
      await informePage.waitForLoadState('networkidle');
      await informePage.waitForTimeout(1500);
      await informePage.screenshot({
        path: '/home/z/my-project/download/auditoria-web/capturas/07-informe-detalle-desktop.png',
        fullPage: true,
      });
      console.log('✓ Desktop: 07-informe-detalle');
    } else {
      console.log('✗ No s\'ha trobat cap informe per clicar');
    }
  } catch (e) {
    console.log(`✗ Error en informe detall: ${e.message.substring(0, 80)}`);
  }
  await informePage.close();

  const estandarPage = await context.newPage();
  try {
    await estandarPage.goto('http://localhost:3000/estandares-esg', { waitUntil: 'networkidle', timeout: 30000 });
    await estandarPage.waitForTimeout(1000);
    const firstEstandar = await estandarPage.$('a[href*="/estandares-esg/"]');
    if (firstEstandar) {
      await firstEstandar.click();
      await estandarPage.waitForLoadState('networkidle');
      await estandarPage.waitForTimeout(1500);
      await estandarPage.screenshot({
        path: '/home/z/my-project/download/auditoria-web/capturas/08-estandar-detalle-desktop.png',
        fullPage: true,
      });
      console.log('✓ Desktop: 08-estandar-detalle');
    }
  } catch (e) {
    console.log(`✗ Error en estàndard detall: ${e.message.substring(0, 80)}`);
  }
  await estandarPage.close();

  await browser.close();
  console.log('\n✓ Captures completades');
})();
