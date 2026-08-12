// Captures the screenshots used in the Filestack React v7 blog series.
//
//   npm run dev            (terminal 1)
//   npm run policy-server  (terminal 2)
//   node scripts/shoot.mjs
//
// Writes PNGs to docs/screenshots/. Re-run after any UI change; the article
// images are these files, so a stale run means a stale article.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = 'docs/screenshots';
mkdirSync(OUT, { recursive: true });

const BASE = process.env.SHOOT_BASE ?? 'http://localhost:5173';
const shots = [];

async function shot(page, name, opts = {}) {
  await page.waitForTimeout(opts.settle ?? 900);
  const target = opts.selector ? page.locator(opts.selector) : page;
  await target.screenshot({ path: `${OUT}/${name}.png` });
  shots.push(name);
  console.log('  ✓', name);
}

async function tab(page, label) {
  await page.getByRole('button', { name: label, exact: true }).click();
  await page.waitForTimeout(700);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('console', (m) => m.type() === 'error' && console.log('   console error:', m.text().slice(0, 120)));

console.log('capturing from', BASE);
await page.goto(BASE, { waitUntil: 'networkidle' });
await shot(page, '01-app-home');

// PickerOverlay, closed then open
await tab(page, 'PickerOverlay');
await shot(page, '02-overlay-button');
await page.getByRole('button', { name: 'Upload a file' }).click();
await shot(page, '03-overlay-open', { settle: 2500 });
await page.keyboard.press('Escape');

// PickerInline
await tab(page, 'PickerInline');
await shot(page, '04-inline', { settle: 2500 });

// PickerDropPane
await tab(page, 'PickerDropPane');
await shot(page, '05-droppane', { settle: 2000 });

// Custom container
await tab(page, 'Custom container');
await shot(page, '06-custom-container', { settle: 2500 });

// Typed callbacks
await tab(page, 'Typed callbacks');
await shot(page, '07-typed-idle');

// Folder upload
await tab(page, 'Folder upload');
await shot(page, '08-folder-button');
await page.getByRole('button', { name: 'Choose a folder' }).click();
await shot(page, '09-folder-open', { settle: 2500 });
await page.keyboard.press('Escape');

// Signed policy
await tab(page, 'Signed policy');
await shot(page, '10-secure-ready', { settle: 1500 });
const secureBtn = page.getByRole('button', { name: 'Upload with a policy' });
if (await secureBtn.count()) {
  await secureBtn.click();
  await shot(page, '11-secure-open', { settle: 2500 });
  await page.keyboard.press('Escape');
}

// Narrow viewport, the responsive argument in the picker comparison article
await page.setViewportSize({ width: 390, height: 844 });
await tab(page, 'PickerInline');
await shot(page, '12-inline-mobile', { settle: 2000 });
await tab(page, 'PickerOverlay');
await page.getByRole('button', { name: 'Upload a file' }).click();
await shot(page, '13-overlay-mobile', { settle: 2500 });

await browser.close();
console.log(`\n${shots.length} screenshots written to ${OUT}/`);
