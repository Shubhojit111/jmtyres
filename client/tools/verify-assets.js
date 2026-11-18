/* verify-assets.js — fail if any picture bypasses Assets.jsx or any image is unmapped. */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const barrel = fs.readFileSync(path.join(root, 'assets/Assets.jsx'), 'utf8');
const images = fs.readdirSync(path.join(root, 'assets/images')).sort();
const imports = [...barrel.matchAll(/^import (\w+) from '\.\/images\/([^']+)';$/gm)].map(([, key, file]) => ({ key, file }));
assert.equal(imports.length, images.length, `Image count mismatch: ${images.length} files, ${imports.length} imports`);
assert.deepEqual(imports.map(x => x.file), images, 'Asset imports must be alphabetical and cover each file exactly once');
assert.equal(new Set(imports.map(x => x.key)).size, images.length, 'Duplicate asset names');
for (const { key } of imports) assert(barrel.includes(`${key}: asset(${key})`), `Missing URL-string export for ${key}`);

const sourcePaths = [];
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.name === 'node_modules' || item.name === '.next') continue;
    const filename = path.join(dir, item.name);
    if (item.isDirectory()) walk(filename);
    else if (/\.(js|jsx|css)$/.test(item.name) && filename !== path.join(root, 'assets/Assets.jsx')) sourcePaths.push(filename);
  }
}
for (const directory of ['app', 'components', 'lib', 'hooks', 'styles']) walk(path.join(root, directory));
const names = new Set(imports.map(x => x.key));
for (const file of sourcePaths) {
  const text = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file);
  assert(!text.includes('./images/') && !text.includes('assets/images/'), `${relative} imports an image outside Assets.jsx`);
  assert(!/src=["']\/images\//.test(text), `${relative} has a hardcoded /images src`);
  assert(!/<svg[\s>]/.test(text), `${relative} has hand-coded icon SVG`);
  for (const [, name] of text.matchAll(/Assets\.(\w+)/g)) assert(names.has(name), `${relative} uses missing Assets.${name}`);
  if (relative.startsWith('lib/data/')) for (const [, name] of text.matchAll(/\bimage:\s*'([A-Za-z0-9]+)'/g)) assert(names.has(name), `${relative} data points to missing ${name}`);
}
for (const file of fs.readdirSync(path.join(root, 'public'))) assert(['fonts','demo','brand-logos'].includes(file), `public/${file} is not an approved frontend asset directory`);
assert(!fs.existsSync(path.join(root, 'app/api')) && !fs.existsSync(path.join(root, 'lib/server')), 'Backend source must not be shipped inside Next.js');
console.log(`PASS: ${images.length} images -> ${imports.length} sorted URL-string imports; ${sourcePaths.length} source files checked; no direct image paths or handwritten SVG icons.`);
