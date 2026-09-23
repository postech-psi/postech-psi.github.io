const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:process.env.PSI_BROWSER_CHANNEL||undefined});
 try{
  for(const lang of ['', 'ko/']){
   const page=await browser.newPage({viewport:{width:1440,height:950}});
   await page.goto(`${process.env.PSI_URL||'http://127.0.0.1:8874'}/${lang}about.html`);
   assert.equal(await page.locator('.photo-motion-toggle').count(),0,'No playback controls on still images');
   const photo=page.locator('.about-team img');
   await photo.scrollIntoViewIfNeeded();
   assert.equal(await photo.evaluate(el=>el.getAnimations().some(a=>a.effect.getTiming().iterations===Infinity)),false,'No continuous still-image animation');
   await photo.hover({position:{x:20,y:20}});
   assert.notEqual(await photo.evaluate(el=>el.style.getPropertyValue('--tilt-y')),'');
   await page.mouse.move(0,0);
   assert.equal(await photo.evaluate(el=>el.style.getPropertyValue('--tilt-y')),'','Pointer exit resets the image');
   await page.emulateMedia({reducedMotion:'reduce'});
   assert.equal(await photo.evaluate(el=>getComputedStyle(el).transform),'none');
   await page.setViewportSize({width:320,height:800});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   await page.close();
  }
  console.log('PASS bilingual still photographs: hover-only, no playback buttons, reduced motion and mobile width');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
