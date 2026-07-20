const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: 'criteri', password: 'esg2026' },
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  // Informe detall
  const informePage = await context.newPage();
  await informePage.goto('http://localhost:3000/informes/esrs-revision-mayo-2026', { waitUntil: 'networkidle', timeout: 30000 });
  await informePage.waitForTimeout(2000);
  await informePage.screenshot({
    path: '/home/z/my-project/download/auditoria-web/capturas/07-informe-detalle-desktop.png',
    fullPage: true,
  });
  console.log('✓ 07-informe-detalle-desktop');
  await informePage.close();

  // Estàndard detall
  const estandarPage = await context.newPage();
  await estandarPage.goto('http://localhost:3000/estandares-esg/ecovadis', { waitUntil: 'networkidle', timeout: 30000 });
  await estandarPage.waitForTimeout(2000);
  await estandarPage.screenshot({
    path: '/home/z/my-project/download/auditoria-web/capturas/08-estandar-detalle-desktop.png',
    fullPage: true,
  });
  console.log('✓ 08-estandar-detalle-desktop');
  await estandarPage.close();

  // Detall mobile
  const mobileContext = await browser.newContext({
    httpCredentials: { username: 'criteri', password: 'esg2026' },
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const informeMobile = await mobileContext.newPage();
  await informeMobile.goto('http://localhost:3000/informes/esrs-revision-mayo-2026', { waitUntil: 'networkidle', timeout: 30000 });
  await informeMobile.waitForTimeout(2000);
  await informeMobile.screenshot({
    path: '/home/z/my-project/download/auditoria-web/capturas/07-informe-detalle-mobile.png',
    fullPage: true,
  });
  console.log('✓ 07-informe-detalle-mobile');
  await informeMobile.close();

  await browser.close();
})();
