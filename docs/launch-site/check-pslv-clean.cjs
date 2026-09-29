const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {setTheme}=require('./test-helpers.cjs');
const base=(process.env.PSI_URL||'http://127.0.0.1:8767').replace(/\/$/,'');
async function checkPslvClean(browser){
 const page=await browser.newPage({reducedMotion:'reduce'});
 page.setDefaultTimeout(10000);
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const fits=async label=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,label);
 const tabsClear=()=>page.waitForFunction(()=>{const bottom=document.querySelector('.site-header').getBoundingClientRect().bottom;return [...document.querySelectorAll('[data-project-tab]')].every(tab=>{const r=tab.getBoundingClientRect();return r.top>=bottom-1&&r.bottom<=innerHeight;});});
 const allSections=async()=>{for(const id of ['vehicle','avionics','flight-reconstruction','tms','flights'])assert.ok(await page.locator('#'+id).isVisible(),`${id} stays in the continuous PSLV page`);};
 const heroMetrics=()=>page.locator('[data-project-panel]:visible .project-hero').evaluate(hero=>{const heading=hero.querySelector('h1'),style=getComputedStyle(heading),box=heading.getBoundingClientRect();return{font:style.fontSize,line:style.lineHeight,x:Math.round(box.x),y:Math.round(box.y),grid:getComputedStyle(hero).gridTemplateColumns};});
 const natural=async selector=>{const photo=page.locator(selector);await photo.scrollIntoViewIfNeeded();await photo.evaluate(img=>img.decode());assert.ok(await photo.evaluate(img=>Math.abs(img.clientHeight-img.clientWidth*img.naturalHeight/img.naturalWidth)<1),'Complete photograph retains its natural proportions');};
 try{
  for(const locale of ['', 'ko/']){
   for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});await page.goto(`${base}/${locale}projects.html`);
    for(const theme of ['light','dark']){
     await setTheme(page,theme);await page.locator('[data-project-tab="pslv"]').click();await tabsClear();await page.evaluate(()=>document.fonts.ready);
     const metrics=await heroMetrics();await allSections();await fits(`${locale}PSLV ${theme} ${width}`);
     assert.equal(await page.locator('main h1:visible').count(),1);
     assert.equal(await page.locator('[data-pslv-view],.case-sources').count(),0,'No separate reading views or implementation references');
     assert.equal(await page.locator('[data-telemetry]').count(),1,'The original reconstruction sits in the continuous page');
     assert.equal(await page.locator('#avionics dl>div').count(),3);
     const copy=await page.locator('#avionics').innerText();
     for(const term of ['Portenta H7','M7','M4','microSD','XBee','IMU','BMP390','UKF','GNSS'])assert.ok(copy.includes(term),`Avionics explains ${term}`);
     assert.deepEqual(await page.locator('#project-pslv a[href^="https://"]').evaluateAll(as=>as.map(a=>a.href)),['https://github.com/postech-psi/Avionics','https://github.com/postech-psi/TMS'],'Only the two main repository references remain');
     assert.match(await page.locator('.pslv-flight-records').innerText(),locale?/회수 실패/:/recovery failed/);
     await page.locator('[data-project-tab="aircraft"]').click();await tabsClear();
     assert.deepEqual(await heroMetrics(),metrics,'Programme titles share their typography and grid');await fits(`${locale}Aircraft ${theme} ${width}`);
     await page.locator('[data-project-tab="pslv"]').click();await tabsClear();
    }
    for(const id of ['avionics','flight-reconstruction','tms','flights']){await page.locator(`.project-jumps a[href="#${id}"]`).click();await allSections();}
    await natural('.pslv-engineering img');
    assert.deepEqual(await page.locator('.pslv-engineering img').evaluate(img=>[img.naturalWidth,img.naturalHeight]),[747,819]);
    await page.locator('.project-jumps a[href="#tms"]').click();await page.locator('[data-results-status="ready"]').waitFor({state:'attached'});
    await page.waitForFunction(min=>document.querySelector('[data-results-detail]').shadowRoot.querySelector('#dt-canvas-thrust canvas')?.getBoundingClientRect().width>min,width*.6);
    await page.locator('[data-project-tab="aircraft"]').click();await page.goBack();await allSections();
    await page.goForward();assert.ok(await page.locator('#project-aircraft').isVisible());await page.reload();await tabsClear();
    await page.goto(`${base}/${locale}about.html`);
    for(const theme of ['light','dark']){
     await setTheme(page,theme);await fits(`${locale}About ${theme} ${width}`);
     assert.equal(await page.locator('.supporter-list a').count(),5);
     assert.ok(await page.evaluate(()=>document.querySelector('.about-intro').nextElementSibling.id==='support'));
     assert.ok(await page.evaluate(()=>document.querySelector('main').lastElementChild.classList.contains('about-team')),'The group photo closes About');
     assert.equal(await page.locator('.support-contact .about-founding').count(),1);
     assert.ok((await page.locator('.about-founding img').boundingBox()).width<=120);
     assert.equal(await page.locator('.organisation-table,.organisation-section,.channel-grid').count(),0);
     assert.equal(await page.locator('main a[href="https://github.com/postech-psi"],main a[href*="sites.google.com/view/mechanicslab"]').count(),0);
     assert.equal(await page.locator('.footer-channels a[href="https://github.com/postech-psi"]').count(),1);
    }
    await natural('.about-team img');await natural('.about-people img');
    assert.ok((await page.locator('.about-team img').boundingBox()).width<=640,'Closing photograph stays at a restrained size');
   }
   for(const anchor of ['project-pslv','vehicle','systems','structure','control','avionics','architecture','estimation','recording','ground-station','flight-reconstruction','tms','test-results','instrument','processing','analysis','flight-record','recovery','flights']){
    await page.goto(`${base}/${locale}pslv.html#${anchor}`);await page.waitForURL(`**/projects.html#${anchor}`);await allSections();assert.equal(await page.locator('#'+anchor).count(),1);
   }
   await page.goto(`${base}/${locale}projects.html?test=2026-04-08-combustion#test-results`);await page.locator('[data-results-status="ready"]').waitFor({state:'attached'});
   assert.equal(await page.locator('[data-results-select]').inputValue(),'2026-04-08-combustion');
   await page.locator('[data-language-link]').click();await allSections();assert.equal(await page.locator('[data-results-select]').inputValue(),'2026-04-08-combustion');
   await page.locator('.footer-bottom a').click();await tabsClear();
   await page.locator('[data-project-tab="pslv"]').focus();await page.keyboard.press('ArrowRight');assert.ok(await page.locator('#project-aircraft').isVisible());
   await page.locator('.skip-link').focus();await page.keyboard.press('Enter');assert.ok(await page.locator('#project-aircraft').isVisible(),'Skip to content retains the selected programme');
   await page.locator('[data-project-tab="aircraft"]').focus();
   await page.keyboard.press('ArrowLeft');await allSections();
   await page.locator('[data-media-play]').click();await page.waitForFunction(()=>document.querySelector('[data-flight-video]').currentTime>.2);
   await page.locator('[data-project-tab="aircraft"]').click();assert.ok(await page.locator('[data-flight-video]').evaluate(video=>video.paused),'Changing programmes pauses the hidden film');
  }
  const plain=await browser.newContext({javaScriptEnabled:false,reducedMotion:'reduce'});
  try{const fallback=await plain.newPage();await fallback.goto(`${base}/projects.html`);await fallback.locator('[data-project-tab="pslv"]').focus();await fallback.keyboard.press('Tab');assert.equal(await fallback.evaluate(()=>document.activeElement.id),'project-tab-aircraft','Native project links remain keyboard accessible without JavaScript');for(const id of ['avionics','tms','flights']){await fallback.locator(`.project-jumps a[href="#${id}"]`).click();await fallback.waitForURL(`**/projects.html#${id}`);assert.ok(await fallback.locator('#'+id).isVisible());}assert.equal(await fallback.locator('[data-results-fallback] tbody tr').count(),4);}finally{await plain.close();}
  assert.deepEqual(errors,[]);
  console.log('PASS: continuous PSLV, essential Avionics, two repository links, closing About photo, EN/KO, light/dark, 4 widths, charts, deep links, history, keyboard, media and no-JS');
 }finally{await page.close();}
}
if(require.main===module)(async()=>{const browser=await chromium.launch();try{await checkPslvClean(browser);}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={checkPslvClean};
