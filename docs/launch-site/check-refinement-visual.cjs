const assert=require('node:assert/strict');
const {mkdirSync}=require('node:fs');
const {chromium}=require('playwright');
const base=process.env.PSI_URL||'http://127.0.0.1:8767';
const output='output/playwright/site-refinement';
(async()=>{
 mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({reducedMotion:'reduce'});
 await page.route(url=>!url.hostname.match(/^(127\.0\.0\.1|localhost)$/),route=>route.abort());
 const failures=[];
 try{
  for(const locale of ['', 'ko/'])for(const width of [320,390,768,1280,1440])for(const route of ['index','projects','research','records','gallery','about','support']){
   await page.setViewportSize({width,height:900});
   await page.goto(`${base}/${locale}${route}.html`,{waitUntil:'domcontentloaded'});
   await page.evaluate(()=>document.fonts.ready);
   for(const theme of ['light','dark']){
    await page.evaluate(theme=>{document.documentElement.dataset.theme=theme;},theme);
    const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,headings:document.querySelectorAll('h1').length}));
    if(result.overflow||result.headings!==1)failures.push(`${locale}${route} ${theme} ${width}: ${JSON.stringify(result)}`);
    if(width===1440&&theme==='light'&&locale===''){
     await page.locator('img').evaluateAll(images=>Promise.all(images.map(img=>{img.loading='eager';return img.decode().catch(()=>{});})));
     await page.screenshot({path:`${output}/${route}-desktop.png`,fullPage:true});
    }
    if(width===390&&locale==='ko/'&&theme==='dark'&&['index','about','support','projects'].includes(route)){
     await page.locator('img').evaluateAll(images=>Promise.all(images.map(img=>{img.loading='eager';return img.decode().catch(()=>{});})));
     await page.screenshot({path:`${output}/${route}-mobile-dark.png`,fullPage:true});
    }
   }
  }
  // Deep system content must remain readable after the collapsed overview changes layout.
  for(const width of [320,390,768,1440])for(const hash of ['avionics','test-results']){
   await page.setViewportSize({width,height:900});
   await page.goto(`${base}/projects.html#${hash}`,{waitUntil:'domcontentloaded'});
   await page.locator(`#${hash}`).waitFor({state:'visible'});
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))failures.push(`expanded ${hash} overflow ${width}`);
  }
  assert.deepEqual(failures,[]);
  console.log('PASS: 140 route/locale/theme/viewport layouts and 8 expanded-system layouts; screenshots in '+output);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
