import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {render} from './templates.mjs';

// A returning visitor must request the version matching the generated document.
for (const language of ['en','ko']) for (const page of ['index','projects']) {
  const html=render(page,language);
  for (const asset of ['site.css','program-pages.css','site.js','motion.js',...(page==='projects'?['telemetry.mjs']:[])]) {
    const digest=createHash('sha256').update(readFileSync(new URL(asset,import.meta.url))).digest('hex').slice(0,12);
    assert.ok(html.includes(asset+'?v='+digest),asset+' must use its current content fingerprint');
  }
}
const assetsIndex=readFileSync(new URL('./assets/index.html',import.meta.url),'utf8');
assert.match(assetsIndex,/name="robots" content="noindex,nofollow"/);
assert.match(assetsIndex,/href="\.\.\/index\.html"/);
assert.doesNotMatch(assetsIndex,/\.mp4|\.webp|directory|listing/i);
console.log('PASS: versioned styles and scripts, plus a deliberate assets landing page.');
