const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const base=process.env.PSI_URL||'http://127.0.0.1:8767';

async function checkSiteRefinement(browser){
 const page=await browser.newPage({viewport:{width:1280,height:720}});
 const failures=[];
 const check=async(name,run)=>{try{await run();console.log('PASS: '+name);}catch(e){failures.push(name+': '+e.message);}};
 for(const locale of ['', 'ko/']){
  await check(locale+'page introductions follow their heading',async()=>{
   for(const route of ['research','records']){
    await page.goto(`${base}/${locale}${route}.html`);
    const geometry=await page.locator('.page-head').evaluate(head=>{
     const h=head.querySelector('h1').getBoundingClientRect(),p=head.querySelector('.page-intro');
     const r=p?.getBoundingClientRect();return r?{below:r.top>=h.bottom-1,aligned:Math.abs(r.left-h.left)<2}:null;
    });
    if(geometry)assert.deepEqual(geometry,{below:true,aligned:true},route);
   }
  });
  await check(locale+'desktop hero keeps an uncropped edge-to-edge film frame',async()=>{
   await page.goto(`${base}/${locale}index.html`);
   const frame=await page.locator('.opening video').evaluate(n=>{
    const r=n.getBoundingClientRect();
    return {aspect:r.width/r.height,left:r.left,right:r.right,width:document.documentElement.clientWidth,fit:getComputedStyle(n).objectFit};
   });
   assert.ok(Math.abs(frame.aspect-16/9)<.02,`film aspect ratio is ${frame.aspect}`);
   assert.ok(Math.abs(frame.left)<1 && Math.abs(frame.right-frame.width)<1,'Film reaches both page edges');
   assert.equal(frame.fit,'contain');
   assert.equal(await page.locator('[data-program]').count(),2);
   assert.equal(await page.locator('main img[src*="field-team"],main img[src*="launch-day-team"],main img[src*="test-workshop"]').count(),0);
  });
  await check(locale+'record filters survive refresh, language and back navigation',async()=>{
   await page.goto(`${base}/${locale}records.html?ref=review#research-archive`);
   await page.locator('[data-filter-type]').selectOption('award');
   await page.waitForURL(url=>url.searchParams.get('type')==='award');
   assert.equal(new URL(page.url()).searchParams.get('type'),'award');
   await page.reload();
   assert.equal(await page.locator('[data-filter-type]').inputValue(),'award');
   assert.equal(await page.locator('[data-research-record]:visible').count(),6);
   const language=await page.locator('[data-language-link]').getAttribute('href');
   assert.equal(new URL(language,page.url()).searchParams.get('type'),'award');
   await page.locator('[data-filter-type]').selectOption('conference');
   await page.goBack();
   assert.equal(await page.locator('[data-filter-type]').inputValue(),'award');
   await page.locator('[data-filter-reset]').click();
   const url=new URL(page.url());
   assert.equal(url.searchParams.get('ref'),'review');
   assert.equal(url.searchParams.has('type'),false);
   assert.equal(await page.locator('[data-research-record]:visible').count(),15);
  });
  await check(locale+'email drafts invalidate when the message changes',async()=>{
   await page.goto(`${base}/${locale}support.html`);
   await page.locator('[data-contact-compose] summary').click();
   await page.locator('input[name="name"]').fill('Preview tester');
   await page.locator('input[name="email"]').fill('test@example.com');
   await page.locator('textarea[name="message"]').fill('Equipment enquiry');
   await page.locator('[data-support-form] button[type="submit"]').click();
   assert.ok(await page.locator('[data-support-draft]').isVisible());
   assert.ok((await page.locator('[data-support-status]').textContent()).length>0);
   await page.locator('textarea[name="message"]').fill('Updated enquiry');
   assert.equal(await page.locator('[data-support-draft]').isVisible(),false);
  });
  await check(locale+'invalid filters normalize and deep-linked records remain visible',async()=>{
   await page.goto(`${base}/${locale}records.html?ref=review&type=unknown&topic=bad#research-archive`);
   assert.equal(await page.locator('[data-research-record]:visible').count(),15);
   assert.equal(new URL(page.url()).searchParams.get('type'),null);
   await page.goto(`${base}/${locale}records.html?ref=review&type=award&q=unmatched#ksas-2025-fusion`);
   assert.ok(await page.locator('#ksas-2025-fusion').isVisible());
   assert.equal(new URL(page.url()).searchParams.get('ref'),'review');
   assert.equal(new URL(page.url()).searchParams.has('q'),false);
  });
  await check(locale+'literal all search is retained rather than treated as a select sentinel',async()=>{
   await page.goto(`${base}/${locale}records.html#research-archive`);
   await page.locator('[data-filter-search]').fill('all');
   await page.waitForURL(url=>url.searchParams.get('q')==='all');
   assert.equal(new URL(page.url()).searchParams.get('q'),'all');
   await page.reload();
   assert.equal(await page.locator('[data-filter-search]').inputValue(),'all');
   assert.ok(await page.locator('[data-research-record]:visible').count()>0);
  });
  await check(locale+'map fallback survives an unavailable external embed',async()=>{
   await page.route('**/*.openstreetmap.org/**',route=>route.abort());
   await page.goto(`${base}/${locale}support.html`);
   assert.ok((await page.locator('.campus-section').innerText()).includes('E-06'));
   assert.ok(await page.locator('.campus-section a[href="https://www.openstreetmap.org/way/631011007"]').isVisible());
   assert.ok((await page.locator('.campus-section address').innerText()).length>0);
   await page.unroute('**/*.openstreetmap.org/**');
  });
  await check(locale+'gallery is chronological and retains every photograph',async()=>{
   await page.goto(`${base}/${locale}gallery.html`);
   assert.equal(await page.locator('.gallery-page-head h1').count(),1);
   assert.ok((await page.locator('.gallery-page-head>p').innerText()).length>0,'Gallery has a short introduction and album count');
   assert.equal(await page.locator('[data-gallery-open]').count(),14);
   const dates=await page.locator('[data-gallery-event] time').evaluateAll(nodes=>nodes.map(n=>n.dateTime));
   assert.deepEqual(dates,[...dates].sort().reverse());
  });
  await check(locale+'gallery lead images do not reserve an empty second row',async()=>{
   const rows=await page.locator('.event-photos figure:first-child:not(:only-child)').evaluateAll(nodes=>nodes.map(n=>{const s=getComputedStyle(n);return [s.gridRowStart,s.gridRowEnd];}));
   assert.ok(rows.every(row=>row.every(value=>value==='auto')),JSON.stringify(rows));
  });
  await check(locale+'research evidence text has no flush decorative border',async()=>{
   await page.goto(`${base}/${locale}research.html`);
   const borders=await page.locator('.study-copy .current-stage').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).borderLeftWidth));
   assert.ok(borders.every(border=>border==='0px'),JSON.stringify(borders));
  });
 }
 await page.close();
 assert.deepEqual(failures,[],'Whole-site refinement regressions');
}
if(require.main===module)(async()=>{const browser=await chromium.launch({headless:true});try{await checkSiteRefinement(browser);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={checkSiteRefinement};
