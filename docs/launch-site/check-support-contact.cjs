const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {setTheme}=require('./test-helpers.cjs');
const base=process.env.PSI_URL||'http://127.0.0.1:8767';

async function checkSupportContact(browser){
 for(const prefix of ['','ko/']){
  const context=await browser.newContext();
  const page=await context.newPage();
  await page.route('**/openstreetmap.org/**',route=>route.abort());
  try{
   const response=await page.goto(`${base}/${prefix}support.html`);
   assert.equal(response.status(),200,'Support page is built');
   assert.equal(await page.locator('main h1').count(),1);
   assert.equal(await page.locator('.site-nav > a, .nav-projects > a').count(),6);
   assert.equal(await page.locator('.supporter-list a').count(),4);
   assert.equal(await page.locator('a[href="mailto:uikangee@postech.ac.kr"]').count(),1);
   assert.ok((await page.locator('#contact').innerText()).includes(prefix?'청암로 77':'77 Cheongam-ro'));
   assert.equal(await page.locator('[data-campus-map][loading="lazy"][title]').count(),1);
   assert.equal(await page.locator('a[href="https://www.postech.ac.kr/eng/about/campus_map.do"]').count(),1);
   for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});
    for(const theme of ['light','dark']){
     await setTheme(page,theme);
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${prefix} ${theme} support fits ${width}px`);
    }
   }
   await page.getByLabel(prefix?'이름':'Name',{exact:true}).fill('Test Visitor');
   await page.getByLabel(prefix?'답장 이메일':'Reply email',{exact:true}).fill('visitor@example.com');
   await page.getByLabel(prefix?'문의 내용':'Message',{exact:true}).fill('Materials for PSI');
   await page.locator('[data-support-form] button[type="submit"]').click();
   const draft=page.locator('[data-support-draft]');
   assert.ok(await draft.isVisible());
   const href=await draft.getAttribute('href');
   assert.ok(href.startsWith('mailto:uikangee@postech.ac.kr?'));
   assert.ok(decodeURIComponent(href).includes('visitor@example.com'));
   assert.ok(decodeURIComponent(href).includes('Materials for PSI'));
   assert.equal(await page.locator('[data-support-success]').count(),0,'A draft is not a delivered message');
   await page.goto(`${base}/${prefix}contact.html`);
   await page.waitForURL(`${base}/${prefix}support.html#contact`);
   console.log(`PASS: ${prefix||'en/'} support, email draft, map fallback and contact redirect`);
  }finally{await context.close();}
  const fallback=await browser.newContext({javaScriptEnabled:false});
  try{
   const plain=await fallback.newPage();
   await plain.route('**/openstreetmap.org/**',route=>route.abort());
   await plain.goto(`${base}/${prefix}support.html`);
   assert.ok(await plain.locator('a[href="mailto:uikangee@postech.ac.kr"]').isVisible());
   assert.ok((await plain.locator('#contact').innerText()).includes(prefix?'청암로 77':'77 Cheongam-ro'));
   assert.ok(await plain.locator('a[href="https://www.postech.ac.kr/eng/about/campus_map.do"]').isVisible());
   assert.equal(await plain.locator('[data-support-form]').getAttribute('action'),'mailto:uikangee@postech.ac.kr');
  }finally{await fallback.close();}
 }
}
if(require.main===module)(async()=>{const browser=await chromium.launch({channel:process.env.PSI_BROWSER_CHANNEL||undefined});try{await checkSupportContact(browser);}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1});
module.exports={checkSupportContact};
