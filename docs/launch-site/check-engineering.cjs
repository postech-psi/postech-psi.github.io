const {setTheme} = require('./test-helpers.cjs');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.PSI_URL||'http://127.0.0.1:8767';
const portal='https://postech-psi.github.io/test-results/';
async function checkEngineering(browser){
 const errors=[];
 for(const locale of ['', 'ko/']){
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
  for(const [name,run] of [
   ['program links remain keyboard accessible',async()=>{
    await page.goto(`${base}/${locale}index.html`);
    assert.equal(await page.locator('[data-program]').count(),2);
   }],
   ['Avionics chapters and source boundaries',async()=>{
    await page.goto(`${base}/${locale}pslv.html#avionics`);assert.ok(await page.locator('[data-system]').count());
    assert.equal(await page.locator('.site-nav [aria-current=page]').getAttribute('href'),'projects.html');
    assert.equal(await page.locator('[data-language-link]').getAttribute('href'),locale?'../projects.html#avionics':'ko/projects.html#avionics');
    for(const id of ['architecture','estimation','ground-station','flight-record'])assert.equal(await page.locator(`#${id}`).count(),1);
    const text=await page.locator('#main').innerText();
    if(!locale)assert.ok(text.includes('A separate transmission thread forwards framed, checksum-checked inter-core messages containing measurements and status.'),'Transmission thread forwards queued frames; it does not assemble them');
    for(const term of ['M7','M4','100 Hz','50 Hz','25 Hz','IMU','BMP390','GNSS','UKF','microSD','XBee'])assert.ok(text.includes(term),term);
    assert.match(await page.locator('[data-gnss-boundary]').innerText(),locale?/입력.*아닙니다/:/not inputs/);
    assert.equal(await page.locator('[data-architecture-flow] li').count(),4,'Four actual responsibility stages are readable');
    assert.match(text,locale?/소프트웨어.*도식/:/software.*diagram/);
    assert.ok(await page.locator('a[href*="7cfb5be044e539c2e3c6d79a6538416a2741cd67"]').count()>=5);
    assert.equal(await page.locator('[data-telemetry]').count(),1);
    assert.equal(await page.locator('[data-trace-segment]').count(),8);
    assert.match(text,locale?/이륙 시점.*뜻하지/:/not liftoff/);
   }],
   ['Compact combustion tests and original key results',async()=>{
    await page.goto(`${base}/${locale}pslv.html#tms`);
    assert.equal(await page.locator('.site-nav [aria-current=page]').getAttribute('href'),'projects.html');
    assert.equal(await page.locator('[data-language-link]').getAttribute('href'),locale?'../projects.html#tms':'ko/projects.html#tms');
    for(const id of ['instrument','processing','analysis','test-results'])assert.equal(await page.locator(`#${id}`).count(),1);
    await page.locator('[data-results-status="ready"]').waitFor({state:'attached'});
    const tms=page.locator('[data-system="tms"]');
    assert.equal(await tms.locator('.case-chapter,.case-head,.case-results,.processing-steps,img,[data-results-comparison]').count(),0);
    assert.equal(await tms.locator('[data-results-select] option').count(),4);
    assert.equal(await tms.locator('[role="tab"]').count(),3);
    assert.equal(await tms.locator(`a[href="${portal}"]`).count(),1);
    assert.equal(await tms.locator('a').count(),1,'Portal is the only extra link in the compact component');
    const {resultCatalog}=await import('./test-results-view.mjs');
    for(const test of resultCatalog.tests){
      const row=page.locator('[data-results-fallback] tbody tr').filter({hasText:test.date});
      for(const metric of ['maxThrustN','totalImpulseNs','burnTimeMs','maxPressureBar'])assert.ok((await row.textContent()).includes(test.metrics[metric].display));
    }
   }],
   ['overview links, canonical player and selected display weight',async()=>{
    await page.goto(`${base}/${locale}pslv.html`);
    for(const name of ['avionics','tms']){assert.ok(await page.locator(`#systems [data-system="${name}"] > summary`).count());}
    assert.equal(await page.locator('[data-telemetry]').count(),1,'PSLV owns the sole replay');
    assert.equal(await page.locator('a[href="avionics.html"]').count(),0);
    await page.goto(`${base}/${locale}index.html`);
    assert.ok(await page.locator('a[href="projects.html#project-pslv"]').count(),'Home leads directly to the PSLV project');
    assert.equal(await page.locator('[data-program]').count(),2);
    await page.goto(`${base}/${locale}records.html`);
    const {resultCatalog}=await import('./test-results-view.mjs');
    for(const test of resultCatalog.tests)assert.ok(await page.locator(`a[href="projects.html?test=${test.id}#test-results"]`).count());
   }],
   ['anchors clear the sticky header',async()=>{
    await page.setViewportSize({width:390,height:844});
    for(const [route,selector]of [['pslv.html#avionics','.case-nav a[href="#estimation"]'],['news.html','.album-navigation a']]){
      await page.goto(`${base}/${locale}${route.includes('.html')?route:'pslv.html#'+route}`);
      const anchor=page.locator(selector).first(),href=await anchor.getAttribute('href');
      await anchor.click();
      const box=await page.locator(href).boundingBox();
      const headerHeight=(await page.locator('.site-header').boundingBox()).height;
      assert.ok(box.y>=headerHeight&&box.y<=headerHeight+150,'Anchor target stays below the persistent navigation');
    }
    await page.goto(`${base}/${locale}research.html`);
    const article=page.locator('[data-current-research]').last();
    await article.evaluate(el=>el.scrollIntoView());
    const box=await article.boundingBox();
    const headerHeight=(await page.locator('.site-header').boundingBox()).height;
    assert.ok(box.y>=headerHeight&&box.y<=headerHeight+150,'Research anchor clears the sticky header');
    assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto','Reduced motion keeps anchor movement immediate');
   }],
   ['new chapters fit both themes at four widths',async()=>{
    for(const route of ['avionics','tms'])for(const width of [320,390,901,1440])for(const theme of ['light','dark']){
      await page.setViewportSize({width,height:1000});const response=await page.goto(`${base}/${locale}${route}.html`);assert.equal(response.status(),200);
      await setTheme(page,theme);await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${route}/${theme} fits ${width}px`);
    }
    await page.setViewportSize({width:320,height:1000});
    for(const route of ['avionics','tms']){
      await page.goto(`${base}/${locale}${route}.html`);
      for(const heading of await page.locator('.case-heading h3,.case-chapter>h3').all()){
        const joins=await heading.evaluate(el=>[...el.querySelectorAll('br')].filter(br=>getComputedStyle(br).display==='none').map(br=>[br.previousSibling?.textContent||'',br.nextSibling?.textContent||'']));
        for(const [before,after]of joins)assert.ok(/\s$/.test(before)||/^\s/.test(after),'Hidden responsive heading break retains word separation');
      }
    }
   }]
  ])try{await run();console.log(`PASS: ${locale||'en/'} ${name}`);}catch(e){errors.push(`${locale||'en/'} ${name}: ${e.message}`);}
  await context.close();
  const plain=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  try{const p=await plain.newPage();for(const route of ['avionics','tms']){assert.equal((await p.goto(`${base}/${locale}pslv.html`)).status(),200);await p.locator(`[data-system="${route}"] > summary`).click();assert.deepEqual(await p.locator(`[data-system="${route}"] .case-chapter`).evaluateAll(nodes=>nodes.map(node=>node.id)),route==='avionics'?['architecture','estimation','recording','ground-station']:[],'Every expected static chapter is present in order');if(route==='avionics')assert.ok((await p.locator('#main').innerText()).length>2000,'Substantive avionics chapters remain without JavaScript');else {assert.equal(await p.locator('[data-results-fallback] tbody tr').count(),4);assert.ok(await p.locator('[data-results-fallback]').isVisible(),'Key results remain readable without JavaScript');}}console.log(`PASS: ${locale||'en/'} static engineering content`);}catch(e){errors.push(`${locale||'en/'} no-JavaScript: ${e.message}`);}finally{await plain.close();}
 }
 assert.deepEqual(errors,[],'Engineering case-study checks');
}
if(require.main===module)(async()=>{const browser=await chromium.launch({channel:process.env.PSI_BROWSER_CHANNEL||undefined,headless:true});try{await checkEngineering(browser);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={checkEngineering};
