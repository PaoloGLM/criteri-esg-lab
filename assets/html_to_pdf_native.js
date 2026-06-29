// Converteix HTML multi-pàgina a PDF usant Playwright native pdf()
const { chromium } = require('playwright');
const path = require('path');

const HTML_PATH = process.argv[2];
const PDF_PATH = process.argv[3];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('file://' + path.resolve(HTML_PATH), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // wait for fonts
  
  await page.pdf({
    path: PDF_PATH,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });
  
  await browser.close();
  console.log('✓ PDF generat:', PDF_PATH);
})();
