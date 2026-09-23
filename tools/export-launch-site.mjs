import {createHash} from 'node:crypto';
import {lstat, mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {routes} from '../docs/launch-site/content.mjs';
import {render} from '../docs/launch-site/templates.mjs';

const repository = fileURLToPath(new URL('../', import.meta.url));
const source = join(repository, 'docs', 'launch-site');
const generator = 'psi-launch-site';
const digest = value => createHash('sha256').update(value).digest('hex');

async function statIfPresent(path) {
  try { return await lstat(path); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

async function safeTarget(destination, name) {
  const target = resolve(destination, name);
  const local = relative(destination, target);
  if (!local || local.startsWith('..') || resolve(destination) === target) throw new Error(`Unsafe release path: ${name}`);
  let current = destination;
  for (const part of ['', ...local.split(sep)]) {
    if (part) current = join(current, part);
    const stat = await statIfPresent(current);
    if (stat?.isSymbolicLink()) throw new Error(`Unsafe linked release path: ${current}`);
  }
  return target;
}

function redirect(target, label) {
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><link rel="icon" type="image/png" href="assets/psi-emblem.png"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${label} — PSI</title><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="${target}"></head><body><p>This page has moved to <a href="${target}">${label}</a>.</p></body></html>\n`;
}

export async function exportSite(output = repository) {
  const destination = resolve(output);
  const outputFiles = new Map();
  for (const lang of ['en', 'ko']) for (const page of routes) {
    const name = `${lang === 'ko' ? 'ko/' : ''}${page}.html`;
    const content = await readFile(join(source, name));
    if (content.toString() !== render(page, lang)) throw new Error(`Stale page: ${name}; run node docs/launch-site/build.mjs first`);
    outputFiles.set(name, content);
  }
  for (const name of ['site.css', 'program-pages.css', 'site.js', 'motion.js', 'telemetry.mjs', 'tvc-viewer.mjs']) outputFiles.set(name, await readFile(join(source, name)));

  // The onboard source is selected at runtime, rather than preloaded in HTML.
  const assets = new Set(['onboard.mp4', 'onboard-poster.webp', 'Pretendard-LICENSE.txt', 'supporter-sources.md']);
  for (const content of outputFiles.values()) for (const match of content.toString().matchAll(/assets\/([A-Za-z0-9][A-Za-z0-9._-]*\.[A-Za-z0-9]+)/g)) assets.add(match[1]);
  for (const name of assets) {
    if (!/\.(?:webp|png|mp4|woff2)$/.test(name) && !['archive-telemetry.json', 'Pretendard-LICENSE.txt', 'supporter-sources.md'].includes(name)) throw new Error(`Unexpected public asset: ${name}`);
    outputFiles.set(`assets/${name}`, await readFile(join(source, 'assets', name)));
  }
  outputFiles.set('assets/index.html',await readFile(join(source,'assets','index.html')));
  for (const [name, target, label] of [['team.html', 'about.html', 'About PSI'], ['events.html', 'gallery.html', 'Gallery']]) outputFiles.set(name, Buffer.from(redirect(target, label)));
  for (const lang of ['en','ko']) {
    const name=`${lang==='ko'?'ko/':''}contact.html`;
    const content=await readFile(join(source,name));
    if(content.toString()!==render('contact',lang))throw new Error(`Stale page: ${name}; run node docs/launch-site/build.mjs first`);
    outputFiles.set(name,content);
  }
  // Nested results data is exported only through the reviewed immutable lock.
  const resultLock = JSON.parse(await readFile(join(source, 'assets/results/source-lock.json'), 'utf8'));
  for (const name of resultLock.publicFiles) {
    if (name.startsWith('/') || name.includes('..') || name.includes('\\') || !/^[A-Za-z0-9_ ./-]+$/.test(name)) throw Error(`Unsafe results asset: ${name}`);
    const content = await readFile(join(source, 'assets/results', name));
    const expected = [...resultLock.files, ...resultLock.generated].find(file => file.path === name);
    if (expected && digest(content) !== expected.sha256) throw Error(`Changed results asset: ${name}`);
    outputFiles.set(`assets/results/${name}`, content);
  }

  // Public CAD and pinned renderer dependencies; never export arbitrary research files.
  const tvcLock=JSON.parse(await readFile(join(source,'assets/tvc/source-lock.json'),'utf8'));
  for(const file of tvcLock.files){
    if(!/^[A-Za-z0-9_.-]+$/.test(file.path)||file.path.includes('..'))throw Error(`Unsafe TVC asset: ${file.path}`);
    const content=await readFile(join(source,'assets/tvc',file.path));
    if(digest(content)!==file.sha256)throw Error(`Changed TVC asset: ${file.path}`);
    outputFiles.set(`assets/tvc/${file.path}`,content);
  }
  outputFiles.set('assets/tvc/source-lock.json',Buffer.from(JSON.stringify(tvcLock,null,2)+'\n'));
  const files = [...outputFiles].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([path, content]) => ({path, sha256:digest(content), bytes:content.length}));
  const release = {generator, revision:digest(JSON.stringify(files)), files};
  const manifestPath = await safeTarget(destination, 'release.json');
  let previous;
  if (await statIfPresent(manifestPath)) {
    try { previous = JSON.parse(await readFile(manifestPath, 'utf8')); }
    catch { throw new Error('Refusing to overwrite an unowned release.json'); }
    if (previous.generator !== generator || !Array.isArray(previous.files)) throw new Error('Refusing to overwrite an unowned release.json');
  }
  const owned = new Map((previous?.files || []).map(file => [file.path, file.sha256]));

  // Preflight every file before writing anything. Preserve unrelated legacy files
  // and refuse hand-edited outputs; edits belong in the source, then a fresh export.
  for (const file of files) {
    const target = await safeTarget(destination, file.path);
    if (await statIfPresent(target)) {
      const existing = digest(await readFile(target));
      if (existing !== file.sha256 && existing !== owned.get(file.path)) throw new Error(`Refusing to overwrite unowned or modified file: ${file.path}`);
    }
  }
  for (const [name, content] of outputFiles) {
    const target = join(destination, name);
    await mkdir(dirname(target), {recursive:true});
    await writeFile(target, content);
  }
  await writeFile(manifestPath, `${JSON.stringify(release, null, 2)}\n`);
  return release;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const destination = resolve(process.argv[2] || repository);
  const release = await exportSite(destination);
  console.log(JSON.stringify({destination, revision:release.revision, files:release.files.length}, null, 2));
}
