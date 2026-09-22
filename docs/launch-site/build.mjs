import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { routes } from './content.mjs';
import { render } from './templates.mjs';
const root = fileURLToPath(new URL('.', import.meta.url));
await mkdir(`${root}/ko`, {recursive:true});
await mkdir(`${root}/assets`, {recursive:true});
for (const lang of ['en','ko']) for (const page of routes) {
  await writeFile(`${root}/${lang==='ko'?'ko/':''}${page}.html`,render(page,lang));
}
for (const lang of ['en','ko']) await writeFile(`${root}/${lang==='ko'?'ko/':''}contact.html`,render('contact',lang));
console.log(`Built ${routes.length * 2} PSI pages and 2 contact redirects in docs/launch-site.`);
