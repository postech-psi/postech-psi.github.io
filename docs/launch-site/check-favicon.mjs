import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {routes} from './content.mjs';
import {render} from './templates.mjs';

// Catches missing head metadata and paths that break inside Korean/project URLs.
for(const lang of ['en','ko']) for(const route of routes){
  const html=render(route,lang);
  const icons=[...html.matchAll(/<link\b[^>]*\brel="icon"[^>]*>/g)];
  assert.equal(icons.length,1,`${lang}/${route} declares one browser icon`);
  const href=icons[0][0].match(/\bhref="([^"]+)"/)?.[1];
  assert.ok(href,`${lang}/${route} icon has a URL`);
  assert.match(icons[0][0],/type="image\/png"/);
  const resolved=new URL(href,`https://postech-psi.github.io/psi-website/${lang==='ko'?'ko/':''}${route}.html`);
  assert.equal(resolved.pathname,'/psi-website/assets/psi-emblem.png','Icon stays inside the project base path');
  const local=new URL(`.${resolved.pathname.replace('/psi-website','')}`,import.meta.url);
  const bytes=await readFile(fileURLToPath(local));
  assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10],'Referenced icon is a real PNG');
  assert.ok(bytes.readUInt32BE(16)>0&&bytes.readUInt32BE(20)>0,'Icon contains image dimensions');
}
console.log(`PASS all ${routes.length*2} bilingual pages declare the existing PSI emblem with prefix-safe URLs`);
