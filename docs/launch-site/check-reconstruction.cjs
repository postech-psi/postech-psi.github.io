const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {setTheme}=require('./test-helpers.cjs');
const base=process.env.PSI_URL||'http://127.0.0.1:8767';

async function checkReconstruction(browser){
 for(const locale of ['', 'ko/']){
  const context=await browser.newContext({reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  try{
   await page.goto(`${base}/${locale}projects.html#flight-reconstruction`);
   const replay=page.locator('[data-telemetry]'),seek=page.locator('[data-replay-seek]');
   await seek.waitFor({state:'visible'});
   const data=await (await context.request.get(`${base}/assets/archive-telemetry.json`)).json();
   assert.equal(data.samples.length,343);assert.equal(data.gaps.length,7);
   assert.equal(Math.max(...data.samples.map(sample=>sample.altitudeMeters)),186.632);
   assert.deepEqual(data.samples.at(-1),{elapsedSeconds:29.38,altitudeMeters:45.841,verticalVelocityMetersPerSecond:-6.764,state:'DEPLOY'});
   for(const sample of data.samples)assert.deepEqual(Object.keys(sample).sort(),['altitudeMeters','elapsedSeconds','state','verticalVelocityMetersPerSecond']);
   assert.equal(await replay.locator('[data-trace-segment]').count(),8,'Seven recorded gaps leave eight distinct traces');
   assert.equal(await replay.locator('a').count(),0,'Detailed source links stay removed');
   assert.match(await page.locator('.reconstruction-context').innerText(),locale?/확인되지/:/unconfirmed/);
   assert.equal(await replay.getAttribute('data-replaying'),'false','Playback waits for the reader');
   await seek.fill('342');
   assert.match(await page.locator('[data-replay-readout]').innerText(),/45\.841/);
   assert.match(await seek.getAttribute('aria-valuetext'),/29\.38/);
   await page.locator('[data-replay-reset]').click();assert.equal(await seek.inputValue(),'0');
   await page.locator('[data-replay-toggle]').click();
   await page.waitForFunction(()=>Number(document.querySelector('[data-replay-seek]').value)>2);
   await page.locator('[data-replay-toggle]').click();const paused=await seek.inputValue();
   await page.waitForTimeout(150);assert.equal(await seek.inputValue(),paused);
   await seek.focus();await page.keyboard.press('ArrowRight');assert.equal(Number(await seek.inputValue()),Number(paused)+1,'Keyboard can inspect consecutive samples');
   await seek.fill('340');await page.locator('[data-replay-toggle]').click();
   await page.waitForFunction(()=>document.querySelector('[data-replay-seek]').value==='342');
   assert.equal(await replay.getAttribute('data-replaying'),'false');
   assert.match(await page.locator('[data-replay-status]').innerText(),locale?/착륙은 기록되어 있지/:/Landing is not recorded/);
   await page.locator('[data-replay-toggle]').click();
   await page.locator('[data-project-tab="aircraft"]').click();
   assert.equal(await replay.getAttribute('data-replaying'),'false','Switching programmes pauses the hidden replay');
   await page.goBack();assert.ok(await replay.isVisible());
   for(const width of [320,390,768,1440])for(const theme of ['light','dark']){
    await page.setViewportSize({width,height:900});await setTheme(page,theme);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    const labels=await replay.locator('svg text').evaluateAll(nodes=>nodes.filter(node=>getComputedStyle(node).display!=='none').map(node=>{
     const box=node.getBoundingClientRect(),svg=node.closest('svg').getBoundingClientRect();
     return{size:parseFloat(getComputedStyle(node).fontSize)*node.getScreenCTM().a,contained:box.left>=svg.left&&box.right<=svg.right};
    }));
    assert.ok(labels.every(label=>label.size>=12&&label.contained),`${locale}${theme} chart labels remain readable at ${width}px`);
   }
   await page.locator('.replay-summary summary').click();assert.equal(await page.locator('.replay-summary tbody tr:visible').count(),3);
   assert.deepEqual(errors,[]);
  }finally{await context.close();}
  for(const mode of ['no-js','failed-data']){
   const fallback=await browser.newContext({javaScriptEnabled:mode!=='no-js',reducedMotion:'reduce',viewport:{width:390,height:844}});
   try{
    const page=await fallback.newPage();
    if(mode==='failed-data')await page.route('**/archive-telemetry.json',route=>route.abort());
    await page.goto(`${base}/${locale}projects.html#flight-reconstruction`);
    if(mode==='failed-data')await page.waitForFunction(()=>/unavailable|불러올 수 없습니다/.test(document.querySelector('[data-replay-status]').textContent));
    assert.equal(await page.locator('[data-replay-controls]').isVisible(),false);
    assert.ok(await page.locator('[data-telemetry] svg').isVisible());
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('.replay-summary summary').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('.replay-summary tbody tr:visible').count(),3,`${locale}${mode} keeps the static summary keyboard accessible`);
   }finally{await fallback.close();}
  }
  console.log(`PASS: ${locale||'en/'} original reconstruction data, playback, seek, keyboard, programme pause, chart labels, themes and fallbacks`);
 }
}
module.exports={checkReconstruction};
if(require.main===module)(async()=>{const browser=await chromium.launch();try{await checkReconstruction(browser);}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
