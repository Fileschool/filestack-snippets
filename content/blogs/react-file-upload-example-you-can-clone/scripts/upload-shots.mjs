// Uploads the article screenshots to Filestack and prints a filename -> handle map.
// The key comes from the environment and is never written to disk or logged.
import { readFile, readdir, writeFile } from 'node:fs/promises';

const KEY = process.env.FILESTACK_API_KEY;
if (!KEY) throw new Error('FILESTACK_API_KEY not set');

const dir = 'docs/screenshots';
const files = (await readdir(dir)).filter((f) => f.endsWith('.png') && f !== 'sample-upload.png');
const map = {};

for (const f of files) {
  const body = await readFile(`${dir}/${f}`);
  const res = await fetch(
    `https://www.filestackapi.com/api/store/S3?key=${KEY}&filename=${encodeURIComponent(f)}`,
    { method: 'POST', headers: { 'Content-Type': 'image/png' }, body },
  );
  if (!res.ok) { console.log(`  ✗ ${f} ${res.status} ${(await res.text()).slice(0,80)}`); continue; }
  const json = await res.json();
  const handle = (json.url || '').split('/').pop();
  map[f] = handle;
  console.log(`  ✓ ${f} -> ${handle}`);
}
await writeFile('docs/screenshots/handles.json', JSON.stringify(map, null, 2));
console.log(`\n${Object.keys(map).length} uploaded, map in docs/screenshots/handles.json`);
