import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {routes} from '../docs/launch-site/content.mjs';
import {exportSite} from './export-launch-site.mjs';

const scratch=await mkdtemp(join(tmpdir(),'psi-release-check-'));
const destination=join(scratch,'psi-website');
const release=await exportSite(destination);
const names=release.files.map(file=>file.path);
assert.ok(names.includes('assets/psi-emblem.png'),'The browser icon ships with the website');
assert.ok(names.includes('assets/index.html'),'The public assets path has an owned landing page');
const assetsIndex=await readFile(join(destination,'assets/index.html'),'utf8');
assert.match(assetsIndex,/name="robots" content="noindex,nofollow"/);
assert.match(assetsIndex,/href="\.\.\/index\.html"/);
assert.doesNotMatch(assetsIndex,/\.mp4|\.webp|directory|listing/i);
for(const prefix of ['', 'ko/'])for(const route of routes)assert.ok(names.includes(`${prefix}${route}.html`));
assert.equal(routes.length,14);
for(const name of ['site.css','site.js','motion.js','program-pages.css','telemetry.mjs','assets/onboard.mp4','assets/onboard-poster.webp','assets/archive-telemetry.json','assets/Pretendard.woff2','assets/Pretendard-LICENSE.txt','assets/rocket-detail.webp'])assert.ok(names.includes(name),'Required runtime asset '+name);
assert.ok(!names.some(name=>/docs\/|review\/|manifest|spring-community|Barlow|\.(pdf|pptx|cjs)$/i.test(name)),'Only the intended public subset is exported');
for(const name of ['postech','postech-me','matlab','ansys'])assert.ok(names.includes(`assets/supporter-${name}.png`),'Supporter logo exports: '+name);
assert.ok(names.includes('assets/supporter-sources.md'),'Public logo provenance exports');
assert.ok(!names.some(name=>/ansys\.zip|mathworks-white|matlab-icon|task4|extract-prose/.test(name)),'Unused artwork and editorial scratch stay private');
for(const [name,target] of [['team.html','about.html'],['events.html','news.html']]) {
 const html=await readFile(join(destination,name),'utf8');
 assert.ok(html.includes('rel="icon" type="image/png" href="assets/psi-emblem.png"'),'Legacy routes carry the browser icon');
 assert.ok(html.includes('url='+target)&&html.includes('href="'+target+'"'),'Legacy address has a no-JS destination');
}
for(const [prefix,lang,icon] of [['','en','assets/psi-emblem.png'],['ko/','ko','../assets/psi-emblem.png']]){
 const name=`${prefix}contact.html`,html=await readFile(join(destination,name),'utf8');
 assert.ok(html.includes(`<html lang="${lang}"`));
 assert.ok(html.includes(`href="${icon}"`),'Contact redirect carries a prefix-safe browser icon');
 assert.ok(html.includes('support.html#contact'),'Contact redirects to the new enquiry page');
}
for(const file of release.files) {
 const content=await readFile(join(destination,file.path));
 assert.equal(createHash('sha256').update(content).digest('hex'),file.sha256,'Digest for '+file.path);
}
assert.deepEqual(await exportSite(destination),release,'Repeated export is deterministic');
const foreign=join(scratch,'foreign');
await mkdir(foreign);
await writeFile(join(foreign,'index.html'),'User-owned file');
await assert.rejects(exportSite(foreign),/unowned|modified/i,'Never overwrite an unrelated file');
assert.equal(await readFile(join(foreign,'index.html'),'utf8'),'User-owned file');
await writeFile(join(destination,'site.css'),'User modified the exported CSS');
await assert.rejects(exportSite(destination),/modified/i,'Never overwrite a modified owned output');
assert.equal(await readFile(join(destination,'site.css'),'utf8'),'User modified the exported CSS');
await writeFile(join(destination,'site.css'),await readFile(new URL('../docs/launch-site/site.css',import.meta.url)));
assert.deepEqual(await exportSite(destination),release);
await access(join(destination,'release.json'));
console.log(JSON.stringify({files:names.length,revision:release.revision,stagingRoot:scratch,siteDirectory:destination,checks:'passed'},null,2));
