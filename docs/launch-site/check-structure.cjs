const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:process.env.PSI_BROWSER_CHANNEL||undefined});
 const page=await browser.newPage();
 const base=process.env.PSI_BASE_URL||(process.env.PSI_URL||'http://127.0.0.1:8767').replace(/\/$/,'')+'/';
 const {research,routes}=await import('./content.mjs');
 const {resultCatalog}=await import('./test-results-view.mjs');
 try {
 for(const prefix of ['', 'ko/']){
  await page.goto(base+prefix+'about.html');
  const recordsLink=page.getByRole('link',{name:prefix?'날짜별 기록 살펴보기':'Browse the dated records',exact:true});
  assert.equal(await recordsLink.getAttribute('href'),'records.html','About uses the canonical Records destination');
  await recordsLink.click();await page.waitForURL(base+prefix+'records.html');
  assert.equal(await page.locator('#research-archive').count(),1);
  await page.goto(base+prefix+'pslv.html#avionics');
  const relatedLink=page.getByRole('link',{name:prefix?'관련 센서 퓨전 연구':'Related sensor-fusion research',exact:true});
  assert.equal(await relatedLink.getAttribute('href'),'records.html#ksas-2025-fusion','Related historical work uses its canonical Records anchor');
  await relatedLink.click();await page.waitForURL(base+prefix+'records.html#ksas-2025-fusion');
  assert.equal(await page.locator('#ksas-2025-fusion').count(),1);
  await page.goto(base+prefix+'index.html');
  assert.equal(await page.locator('.current-research-invitation h2').innerText(),prefix?'연구':'Research','Research invitation uses the concise section title');
  assert.equal(await page.locator('[data-program]').count(),2);
  assert.equal(await page.locator('.testing-feature a.test-action').first().getAttribute('href'),'projects.html#test-results');
  await page.goto(base+prefix+'projects.html');
  assert.deepEqual(await page.locator('.site-nav > a, .nav-projects > a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href'))),['projects.html','research.html','records.html','news.html','about.html']);
  assert.equal(await page.locator('[data-project-tab]').count(),2);
  await page.locator('[data-project-tab="aircraft"]').click();
  assert.match(page.url(),/projects\.html#project-aircraft$/);
  assert.ok(await page.locator('[data-project-panel="aircraft"]').isVisible());
  assert.equal(await page.locator('a[href="projects.html"]').count()>0,true);
  await page.goto(base+prefix+'research.html');
  assert.equal(await page.locator('[data-current-research]').count(),5);
  assert.equal(await page.locator('[data-current-research] figure').count(),5);
  assert.equal(await page.locator('[data-research-record]').count(),0);
  await page.goto(base+prefix+'records.html');
  assert.equal(await page.locator('[data-research-record]').count(),15);
  for(const r of research)assert.equal(await page.locator('#'+r.id).count(),1);
  assert.equal(await page.locator('[data-filter-type]').count(),1,'Historical evidence remains filterable in Records');
  await page.locator('[data-filter-type]').selectOption('award');
  assert.equal(await page.locator('[data-research-record]:visible').count(),6);
  await page.locator('[data-filter-reset]').click();
  for(const r of research){await page.goto(base+prefix+'research.html#'+r.id);await page.waitForURL(base+prefix+'records.html#'+r.id);}
  for(const [from,to] of [['learning.html','about.html#learning'],['pslv.html#avionics','projects.html#avionics'],['tms.html#tms','projects.html#tms'],['news.html#tests','records.html#tests'],['research.html#research-archive','records.html#research-archive'],['research.html#ksas-2025-fusion','records.html#ksas-2025-fusion']]){
   await page.goto(base+prefix+from); await page.waitForURL(base+prefix+to);
  }
  for(const id of [resultCatalog.tests.at(-1).id,'unknown-test']){
   await page.goto(base+prefix+'tms.html?test='+id+'#test-results');
   const selected=resultCatalog.tests.find(t=>t.id===id)||resultCatalog.tests[0];
   assert.equal(await page.locator('[data-results-select]').inputValue(),selected.id);
   await page.locator('[data-results-status="ready"]').waitFor({state:'attached'});
   assert.ok((await page.locator('[data-results-select] option:checked').innerText()).includes(selected.date),'Requested trial is identified by the compact selector');
   assert.equal(await page.locator('[data-results-detail] #dt-canvas-thrust canvas').count(),1,'Selected trial chart is mounted');
   assert.ok(await page.locator('[data-system="tms"]').evaluate(el=>el.open));
  }
  for(const route of ['projects','aircraft','research','records','news'])for(const width of [390,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(base+prefix+route+'.html');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${prefix}${route} at ${width}`);
   assert.equal(await page.locator('main a[href*="sharepoint"],main a[href*="onedrive"],main iframe').count(),0);
   await page.screenshot({path:require('node:path').join(__dirname,'review',`task2-${prefix?'ko':'en'}-${route}-${width}.png`),fullPage:true});
  }
  for(const route of routes){
   await page.goto(base+prefix+route+'.html');
   assert.deepEqual(await page.locator('main h1,main h2,main h3,main h4,main h5,main h6').evaluateAll(nodes=>nodes.map(n=>n.textContent.trim()).filter(text=>text.endsWith('.'))),[],`${prefix}${route} generated headings remove final full stops`);
  }
 }
 console.log('PASS bilingual navigation, two programs, research/records segregation, legacy redirects and validated trial selection');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
