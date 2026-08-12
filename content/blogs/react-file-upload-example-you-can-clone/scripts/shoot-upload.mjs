// Completes one real upload through the picker and captures the result states.
// Separated from shoot.mjs because this one writes a file to the Filestack account.
//
//   node scripts/shoot-upload.mjs
import { chromium } from 'playwright';

const OUT = 'docs/screenshots';
const BASE = process.env.SHOOT_BASE ?? 'http://localhost:5173';
const SAMPLE = 'docs/screenshots/sample-upload.png';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 160)));

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Typed callbacks', exact: true }).click();
await page.getByRole('button', { name: 'Upload', exact: true }).click();
await page.waitForTimeout(2500);

// The picker keeps a file input in the DOM; setting it is what a real selection does.
await page.locator('input[type="file"]').first().setInputFiles(SAMPLE);
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/14-file-selected.png` });
console.log('  ✓ 14-file-selected');

const uploadBtn = page.getByRole('button', { name: /Upload \d+ File/i });
if (await uploadBtn.count()) {
  await uploadBtn.first().click();
} else {
  await page.getByRole('button', { name: /^Upload$/ }).last().click();
}

// Wait for the component's own result table rather than a fixed sleep.
try {
  await page.waitForSelector('table', { timeout: 45000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/15-typed-result.png` });
  console.log('  ✓ 15-typed-result');
  const row = await page.locator('table tbody tr').first().innerText();
  console.log('  result row:', row.replace(/\s+/g, ' ').trim());
} catch {
  await page.screenshot({ path: `${OUT}/15-upload-failed.png` });
  console.log('  ✗ no result table appeared, captured 15-upload-failed');
}

await browser.close();
console.log('\nconsole errors:', errors.length);
for (const e of [...new Set(errors)].slice(0, 6)) console.log('  -', e);
