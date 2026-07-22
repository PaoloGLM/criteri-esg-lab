const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: 'criteri', password: 'esg2026' },
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  // Informe ESRS - desktop
  const p1 = await context.newPage();
  await p1.goto('http://localhost:3000/informes/revisio-esrs-maig-2026', { waitUntil: 'networkidle', timeout: 30000 });
  await p1.waitForTimeout(3000);
  await p1.screenshot({ path: '/home/z/my-project/download/auditoria-web/capturas/07-informe-detalle-desktop.png', fullPage: true });
  console.log('✓ 07-informe-detalle-desktop');
  await p1.close();

  // EcoVadis - desktop
  const p2 = await context.newPage();
  await p2.goto('http://localhost:3000/informes/ecovadis-methodology-q1-2026', { waitUntil: 'networkidle', timeout: 30000 });
  await p2.waitForTimeout(3000);
  await p2.screenshot({ path: '/home/z/my-project/download/auditoria-web/capturas/07b-informe-ecovadis-desktop.png', fullPage: true });
  console.log('✓ 07b-informe-ecovadis-desktop');
  await p2.close();

  // Estàndard detall (ecovadis)
  const p3 = await context.newPage();
  await p3.goto('http://localhost:3000/estandares-esg/ecovadis', { waitUntil: 'networkidle', timeout: 30000 });
  await p3.waitForTimeout(3000);
  await p3.screenshot({ path: '/home/z/my-project/download/auditoria-web/capturas/08-estandar-detalle-desktop.png', fullPage: true });
  console.log('✓ 08-estandar-detalle-desktop');
  await p3.close();

  // Mobile informe
  const mobileContext = await browser.newContext({
    httpCredentials: { username: 'criteri', password: 'esg2026' },
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const p4 = await mobileContext.newPage();
  await p4.goto('http://localhost:3000/informes/revisio-esrs-maig-2026', { waitUntil: 'networkidle', timeout: 30000 });
  await p4.waitForTimeout(3000);
  await p4.screenshot({ path: '/home/z/my-project/download/auditoria-web/capturas/07-informe-detalle-mobile.png', fullPage: true });
  console.log('✓ 07-informe-detalle-mobile');
  await p4.close();

  await browser.close();
})();
