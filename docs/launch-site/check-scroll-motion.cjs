const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.PSI_URL||'http://127.0.0.1:8870';
(async()=>{
 const browser=await chromium.launch({channel:process.env.PSI_BROWSER_CHANNEL||'msedge'});
 try{
  for(const lang of ['', 'ko/']){
   const page=await browser.newPage({viewport:{width:1440,height:900},colorScheme:'light'});
   await page.goto(`${base}/${lang}index.html`);
   const header=page.locator('.site-header');
   assert.equal(await header.evaluate(el=>getComputedStyle(el).position),'sticky','Navigation stays available during scroll');
   assert.equal(await header.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 0)');
   const photograph=page.locator('[data-reel-slide]:not([hidden]) .reel-image');
   await photograph.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));
   await page.waitForFunction(()=>document.querySelector('[data-reel-slide]:not([hidden]) .reel-image').getAnimations().some(a=>a.playState==='running'));
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.waitForFunction(()=>!document.querySelector('[data-reel-slide]:not([hidden]) .reel-image').getAnimations().some(a=>a.playState==='running'),{},{timeout:250});
   assert.equal(await photograph.evaluate(el=>el.getAnimations().filter(a=>a.playState==='running').length),0,'Changing motion preference stops active image reveals');
   await page.emulateMedia({reducedMotion:'no-preference'});
   await page.evaluate(()=>scrollTo({top:900,behavior:'instant'}));
   await page.waitForFunction(()=>getComputedStyle(document.querySelector('.site-header')).backgroundColor==='rgb(255, 255, 255)');
   assert.equal(Math.round((await header.boundingBox()).y),0);
   await page.waitForFunction(()=>getComputedStyle(document.querySelector('[data-theme-toggle]')).color==='rgb(0, 0, 0)');
   const navBox=await page.locator('#site-navigation').boundingBox();
   assert.ok(Math.abs(navBox.x+navBox.width/2-720)<2,'Desktop navigation is centered independently of side controls');
   for(const width of [1101,1150,1200,1300,1399,1439,1440]){
    await page.setViewportSize({width,height:900});
    const nav=await page.locator('#site-navigation').boundingBox(),brand=await page.locator('.brand').boundingBox();
    assert.ok(Math.abs(nav.x+nav.width/2-width/2)<2,`Navigation centered at ${width}px`);
    assert.ok(brand.x+brand.width+12<nav.x,`Logo and navigation do not overlap at ${width}px`);
   }
   await page.setViewportSize({width:1440,height:900});
   assert.equal(await page.locator('.psi-wordmark').evaluate(el=>getComputedStyle(el,'::after').maskMode),'luminance','Original artwork is rendered without its opaque background');
   await page.locator('[data-theme-toggle]').click();
   await page.waitForFunction(()=>getComputedStyle(document.querySelector('.site-header')).backgroundColor==='rgb(0, 0, 0)');
   await page.locator('[data-theme-toggle]').click();
   await page.setViewportSize({width:390,height:844});
   await page.evaluate(()=>scrollTo({top:900,behavior:'instant'}));
   await page.waitForFunction(()=>document.querySelector('.site-header').dataset.scrolled==='true');
   await page.locator('[data-menu-toggle]').click();
   assert.equal(await page.locator('#site-navigation').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('main').evaluate(el=>el.inert),false);
   await page.emulateMedia({reducedMotion:'reduce'});
   assert.equal(await header.evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
   await page.goto(`${base}/${lang}pslv.html#test-results`);
   await page.locator('#dt-canvas-thrust canvas').waitFor();
   assert.ok((await page.locator('#test-results').boundingBox()).y >= (await header.boundingBox()).height,'Deep links clear the sticky navigation');
   await page.close();
  }
  console.log('PASS bilingual sticky theme transition, transparent logo, mobile menu, reduced motion and deep links');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
