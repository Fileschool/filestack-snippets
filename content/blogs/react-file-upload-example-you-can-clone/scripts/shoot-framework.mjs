import { chromium } from 'playwright';
const NAME = process.argv[2];            // 'nextjs' | 'remix'
const BASE = 'http://127.0.0.1:5500/';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errs = [];
p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 120)));
await p.goto(BASE, { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
await p.screenshot({ path: `docs/screenshots/${NAME}-page.png` });
console.log(`  ✓ ${NAME}-page`);
const btn = p.getByRole('button', { name: /upload/i });
if (await btn.count()) {
  await btn.first().click();
  await p.waitForTimeout(3000);
  await p.screenshot({ path: `docs/screenshots/${NAME}-picker.png` });
  console.log(`  ✓ ${NAME}-picker`);
} else {
  await p.waitForTimeout(3000);
  await p.screenshot({ path: `docs/screenshots/${NAME}-picker.png` });
  console.log(`  ✓ ${NAME}-picker (inline)`);
}
await b.close();
console.log('  console errors:', errs.length, [...new Set(errs)].slice(0,2).join(' | '));
