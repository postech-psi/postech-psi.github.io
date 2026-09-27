const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.PSI_URL||'http://127.0.0.1:8767';

// Protect the approved photo-led presentation against fixed-height image boxes,
// loss of alternating composition and landscape photos squeezed into thumbnails.
async function checkPhotoLayout(browser){
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const failures=[];
 const check=async(name,run)=>{try{await run();console.log('PASS: '+name);}catch(e){failures.push(name+': '+e.message);}};
 const load=async(route)=>{
  await page.goto(base+'/'+route+'.html');
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('main img').evaluateAll(images=>Promise.all(images.map(img=>{img.loading='eager';return img.decode().catch(()=>{});})));
 };
 const natural=async(selector)=>{
  const sizes=await page.locator(selector).evaluateAll(images=>images.map(img=>{
   const r=img.getBoundingClientRect();
   return {src:img.getAttribute('src'),ratio:r.width/r.height,natural:img.naturalWidth/img.naturalHeight};
  }));
  assert.ok(sizes.length>0);
  for(const size of sizes)assert.ok(Math.abs(size.ratio/size.natural-1)<.015,JSON.stringify(size));
 };
 try{
  for(const locale of ['', 'ko/']){
   await page.setViewportSize({width:1440,height:1000});
   await check(locale+'Home restores a portrait reel and alternating programme imagery',async()=>{
    await load(locale+'index');
    const reel=await page.locator('.reel-image:visible').boundingBox();
    assert.ok(reel.height>reel.width,'Portrait rocket photos need a portrait frame');
    const picture=await page.locator('[data-program="aircraft"] .program-picture').boundingBox();
    const copy=await page.locator('[data-program="aircraft"] h2').boundingBox();
    assert.ok(picture.x<copy.x,'The second programme reverses the first composition');
   });
   await check(locale+'Research visuals alternate without changing reading order on mobile',async()=>{
    await load(locale+'research');
    const sides=await page.locator('.study-feature').evaluateAll(items=>items.map(item=>item.querySelector('.study-visual').getBoundingClientRect().left<item.querySelector('.study-copy').getBoundingClientRect().left));
    assert.equal(new Set(sides).size,2,'Visuals should not all occupy the same column');
   });
   await check(locale+'Gallery has side captions, varied photo scales and natural image proportions',async()=>{
    await load(locale+'gallery');
    const header=await page.locator('#launch-dec-2025 header').boundingBox();
    const photos=await page.locator('#launch-dec-2025 .event-photos').boundingBox();
    assert.ok(header.x+header.width<=photos.x,'Album information sits beside the photographs');
    const widths=await page.locator('#launch-dec-2025 figure').evaluateAll(items=>items.map(item=>item.getBoundingClientRect().width));
    assert.ok(widths[0]>widths[2]*1.7&&widths[2]>widths[1]*1.5,'Wide lead, prominent detail and narrow portraits');
    await natural('.event-photos img');
    assert.equal(await page.locator('[data-gallery-open]').count(),14);
   });
   await check(locale+'Projects and About photographs are not cropped into fixed-height boxes',async()=>{
    await load(locale+'projects');
    await natural('.vehicle-overview img');
    await load(locale+'about');
    await natural('.about-team img,.founder-photo,.join-intro img');
   });
   await page.setViewportSize({width:390,height:844});
   await check(locale+'Mobile photos retain their proportions and the page stays within the viewport',async()=>{
    for(const route of ['index','projects','research','gallery','about']){
     await load(locale+route);
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,route);
     if(route==='gallery')await natural('.event-photos img');
     if(route==='about')await natural('.about-team img,.founder-photo,.join-intro img');
     if(route==='research')assert.ok(await page.locator('.study-feature').evaluateAll(items=>items.every(item=>item.querySelector('.study-visual').getBoundingClientRect().top<item.querySelector('.study-copy').getBoundingClientRect().top)));
    }
   });
  }
 }finally{await page.close();}
 assert.deepEqual(failures,[],'Photo composition regressions');
}
if(require.main===module)(async()=>{const browser=await chromium.launch({headless:true});try{await checkPhotoLayout(browser);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={checkPhotoLayout};
