const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=(process.env.PSI_URL||'http://127.0.0.1:8767').replace(/\/$/,'');

// Catch lost archive panels/deep links, misleading still-photo controls,
// incomplete Gallery migration, and stacked whitespace at content boundaries.
async function checkReviewFollowups(browser){
 const failures=[];
 for(const prefix of ['', 'ko/']){
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  page.setDefaultTimeout(6000);
  for(const [name,run] of [
   ['Records switches immediately without losing archive entries',async()=>{
    await page.goto(`${base}/${prefix}records.html`);
    assert.equal(await page.locator('[data-record-tab]').count(),4,'Four archive categories must be switchable');
    assert.equal(await page.locator('[data-record-panel]:visible').count(),1);
    assert.ok(await page.locator('#tests').isVisible());
    const tabs=page.locator('[data-record-tab]');
    await tabs.nth(2).click();
    assert.equal(new URL(page.url()).hash,'#research-archive');
    assert.equal(await page.locator('[data-research-item]:visible').count(),15);
    await page.locator('[data-filter-type]').selectOption('award');
    assert.equal(await page.locator('[data-research-item]:visible').count(),6);
    await tabs.nth(1).click();
    assert.ok(await page.locator('#flights').isVisible());
    await page.goBack();
    assert.ok(await page.locator('#research-archive').isVisible());
    assert.equal(await page.locator('[data-research-item]:visible').count(),6);
    await page.locator('[data-filter-reset]').click();
    await tabs.nth(0).focus();await page.keyboard.press('End');
    assert.ok(await page.locator('#milestones').isVisible());
    assert.equal(await tabs.nth(3).evaluate(el=>el===document.activeElement),true);
    await page.keyboard.press('Home');assert.ok(await page.locator('#tests').isVisible());
    await tabs.nth(1).click();
    assert.match(await page.locator('[data-language-link]').getAttribute('href'),/records\.html#flights$/);
    for(const [hash,owner] of [['ksas-2025-fusion','research-archive'],['launch-dec-2025','milestones'],['flights','flights']]){
     await page.goto(`${base}/${prefix}records.html#${hash}`);
     assert.ok(await page.locator('#'+hash).isVisible(),`Deep link ${hash} reveals its content`);
     assert.equal(await page.locator('[data-record-panel]:visible').getAttribute('id'),owner);
    }
    await page.goto(`${base}/${prefix}records.html#unknown`);assert.ok(await page.locator('#tests').isVisible());
    for(const width of [320,390,768,1440]){
     await page.setViewportSize({width,height:900});
     for(const tab of await tabs.all()){await tab.click();assert.equal(await page.locator('[data-record-panel]:visible').count(),1);}
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`Record tabs fit ${width}px`);
    }
    const context=await browser.newContext({javaScriptEnabled:false});
    try{const plain=await context.newPage();await plain.goto(`${base}/${prefix}records.html`);assert.equal(await plain.locator('[data-record-panel]:visible').count(),4,'No-JS retains all archive content');}finally{await context.close();}
   }],
   ['Records keeps its category when navigating to page-level anchors',async()=>{
    await page.goto(`${base}/${prefix}records.html#research-archive`);
    await page.locator('[data-filter-type]').selectOption('award');
    await page.locator('footer a[href="#main"]').click();
    await page.waitForURL(`${base}/${prefix}records.html?type=award#main`);
    assert.ok(await page.locator('#research-archive').isVisible(),'Back to top preserves the active category');
    assert.equal(await page.locator('[data-research-item]:visible').count(),6);
    await page.locator('[data-record-tab="flights"]').click();
    await page.goBack();
    assert.equal(new URL(page.url()).hash,'#main');
    assert.ok(await page.locator('#research-archive').isVisible(),'Back to the page-level anchor restores its original category');
    assert.equal(await page.locator('[data-research-item]:visible').count(),6);
    await page.goForward();
    assert.ok(await page.locator('#flights').isVisible());
    await page.goBack();
    await page.goBack();
    await page.locator('.skip-link').focus();await page.keyboard.press('Enter');
    await page.waitForURL(`${base}/${prefix}records.html?type=award#main`);
    assert.ok(await page.locator('#research-archive').isVisible(),'Skip link preserves the active category');
    assert.equal(await page.locator('[data-research-item]:visible').count(),6);
   }],
   ['Gallery is canonical and old News links retain their destination',async()=>{
    await page.goto(`${base}/${prefix}gallery.html`);
    assert.equal(new URL(page.url()).pathname,`/${prefix}gallery.html`);
    assert.equal(await page.locator('h1').innerText(),prefix?'갤러리':'Gallery');
    assert.equal(await page.locator('.site-nav a[href="gallery.html"]').innerText(),prefix?'갤러리':'Gallery');
    assert.equal(await page.locator('[data-gallery-open]').count(),14);
    await page.goto(`${base}/${prefix}news.html?from=old#award-dec-2025`);
    await page.waitForURL(`${base}/${prefix}gallery.html?from=old#award-dec-2025`);
    assert.ok(await page.locator('#award-dec-2025').isVisible());
    await page.goto(`${base}/${prefix}news.html#tests`);
    await page.waitForURL(`${base}/${prefix}records.html#tests`);
    for(const route of ['index','projects','research','records','about','support','gallery']){
     await page.goto(`${base}/${prefix}${route}.html`);
     assert.equal(await page.locator('a[href^="news.html"]').count(),0,`${route} links directly to Gallery`);
    }
   }],
   ['Hybrid touch input never activates or retains photo motion',async()=>{
    await page.setViewportSize({width:1440,height:900});
    await page.goto(`${base}/${prefix}about.html`);
    assert.ok(await page.evaluate(()=>matchMedia('(hover:hover) and (pointer:fine)').matches));
    const photo=page.locator('.founder-photo');
    await photo.scrollIntoViewIfNeeded();await page.mouse.move(0,0);
    await photo.dispatchEvent('pointermove',{pointerType:'touch',clientX:20,clientY:20});
    assert.equal(await photo.evaluate(el=>el.style.getPropertyValue('--tilt-y')),'','Touch on a fine-pointer device does not tilt');
    await photo.hover({position:{x:20,y:20}});
    assert.notEqual(await photo.evaluate(el=>el.style.getPropertyValue('--tilt-y')),'');
    await photo.dispatchEvent('pointerdown',{pointerType:'touch',clientX:20,clientY:20});
    assert.equal(await photo.evaluate(el=>el.style.getPropertyValue('--tilt-y')),'','Switching from mouse to touch clears tilt');
    assert.equal(await photo.evaluate(el=>el.hasAttribute('data-photo-hover')),false);
    await photo.dispatchEvent('pointermove',{pointerType:'touch',clientX:30,clientY:30});
    assert.equal(await photo.evaluate(el=>el.style.getPropertyValue('--tilt-y')),'');
   }],
   ['Still photos have hover-only motion and never video controls',async()=>{
    await page.goto(`${base}/${prefix}about.html`);
    assert.equal(await page.locator('.photo-motion-toggle').count(),0,'Still photos must not acquire play/pause buttons');
    for(const [route,selector] of [['about','.founder-photo'],['about','.about-team img'],['projects','.vehicle-overview img'],['projects','#structure img'],['gallery','[data-gallery-open]']]){
     await page.goto(`${base}/${prefix}${route}.html`);
     const photo=page.locator(selector).first();
     assert.equal(await photo.evaluate(el=>el.matches('[data-photo-motion]')||!!el.closest('[data-photo-motion]')),true,`${route}: ${selector} opts into the same photo rule`);
     assert.equal(await page.locator('.photo-motion-toggle').count(),0);
    }
    await page.goto(`${base}/${prefix}about.html`);
    const photo=page.locator('.founder-photo');
    await photo.scrollIntoViewIfNeeded();await page.mouse.move(0,0);
    assert.equal(await photo.evaluate(el=>el.getAnimations().some(a=>a.effect.getTiming().iterations===Infinity)),false);
    await photo.hover({position:{x:20,y:20}});
    assert.notEqual(await photo.evaluate(el=>el.style.getPropertyValue('--tilt-y')),'');
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await photo.evaluate(el=>getComputedStyle(el).transform),'none');
    await page.waitForFunction(()=>!document.querySelector('.founder-photo').style.getPropertyValue('--tilt-y'));
    assert.equal(await photo.evaluate(el=>el.style.getPropertyValue('--tilt-y')),'');
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.goto(`${base}/${prefix}gallery.html`);
    await page.locator('[data-gallery-open]').first().click();
    assert.ok(await page.locator('#photo-dialog').isVisible());
    assert.equal(await page.locator('#photo-dialog .motion-surface').count(),0,'Full-size viewer stays still');
    await page.locator('[data-gallery-close]').click();
    const touch=await browser.newContext({isMobile:true,hasTouch:true,viewport:{width:390,height:844}});
    try{const p=await touch.newPage();await p.goto(`${base}/${prefix}about.html`);await p.locator('.founder-photo').hover();assert.equal(await p.locator('.founder-photo').evaluate(el=>getComputedStyle(el).transform),'none');}finally{await touch.close();}
   }],
   ['Content follows headings without stacked blank space',async()=>{
    for(const width of [390,1440]){
     await page.setViewportSize({width,height:900});
     await page.goto(`${base}/${prefix}gallery.html`);
     const gap=await page.locator('.gallery-event').first().evaluate(el=>el.querySelector('header').getBoundingClientRect().top-document.querySelector('.page-head').getBoundingClientRect().bottom);
     assert.ok(gap<=48,`Gallery ${width}px content gap: ${gap}`);
     await page.goto(`${base}/${prefix}support.html`);
     const supportGap=await page.locator('main > .page-head + .support-intro').evaluate(el=>parseFloat(getComputedStyle(el).paddingTop));
     assert.ok(supportGap<=28,`Support ${width}px must not stack a full section pad after the page heading`);
     await page.goto(`${base}/${prefix}index.html`);
     const programmeGap=await page.locator('.home-programs').evaluate(el=>document.querySelector('.home-support h2').getBoundingClientRect().top-el.querySelector('.program-cards>article:last-child').getBoundingClientRect().bottom);
     assert.ok(programmeGap<=110,`Homepage ${width}px section gap: ${programmeGap}`);
    }
   }]
  ])try{await run();console.log(`PASS ${prefix||'en/'} ${name}`);}catch(error){failures.push(`${prefix||'en/'} ${name}: ${error.message}`);}
  await page.close();
 }
 assert.deepEqual(failures,[]);
}
module.exports={checkReviewFollowups};
if(require.main===module)(async()=>{const browser=await chromium.launch();try{await checkReviewFollowups(browser);}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
