const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:process.env.PSI_BROWSER_CHANNEL||'msedge'});
 const base=process.env.PSI_URL||'http://127.0.0.1:8870';
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await page.goto(`${base}/ko/index.html`);
  await page.evaluate(()=>document.fonts.ready);
  const lines=locator=>locator.evaluate(e=>{const range=document.createRange();range.selectNodeContents(e);return new Set([...range.getClientRects()].filter(r=>r.width>0).map(r=>Math.round(r.top))).size;});
  assert.equal(await page.locator('.archive-preview').count(),0,'The removed activity block does not retain a heading or blank placeholder');
  assert.equal(await lines(page.locator('[data-program=pslv] p').first()),1,'The desktop PSLV summary has no orphaned last word');
  await page.goto(`${base}/ko/pslv.html`);
  await page.evaluate(()=>document.fonts.ready);
  const title=page.locator('#project-pslv .project-subtitle');
  assert.equal((await title.innerText()).trim(),'POSTECH Science Launch Vehicle');
  assert.equal(await page.locator('main h1:visible').count(),1,'The selected programme owns the visible page heading');
  assert.equal(await page.locator('.page-head .affiliation').count(),0,'Remove the repeated PSI affiliation above the title');
  assert.equal(await lines(title),1,'The full English name fits the desktop title column');
  const styles=await title.evaluate(e=>({page:parseFloat(getComputedStyle(e.closest('.project-hero').querySelector('h1')).fontSize),panel:parseFloat(getComputedStyle(e).fontSize)}));
  assert.ok(styles.panel<styles.page,'The expanded name is subordinate to the programme heading');
  await page.setViewportSize({width:390,height:844});
  assert.ok(await title.evaluate(e=>e.getBoundingClientRect().right<=innerWidth&&e.scrollWidth<=e.clientWidth+1),'The mobile title wraps without overflowing');
  console.log('PASS title hierarchy, desktop line breaks, removed eyebrows and mobile fit');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
