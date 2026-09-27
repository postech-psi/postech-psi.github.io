const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {setTheme}=require('./test-helpers.cjs');
const base=(process.env.PSI_URL||'http://127.0.0.1:8767').replace(/\/$/,'');

async function checkLayoutRefinement(browser){
 const failures=[];
 for(const locale of ['', 'ko/']){
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await context.route(url=>url.hostname.endsWith('openstreetmap.org'),route=>route.abort());
  const page=await context.newPage();page.setDefaultTimeout(5000);
  const check=async(name,run)=>{try{await run();console.log(`PASS ${locale||'en/'} ${name}`);}catch(e){failures.push(`${locale||'en/'} ${name}: ${e.message}`);}};
  await check('Home omits redundant activity/member blocks but retains project access',async()=>{
   await page.goto(`${base}/${locale}index.html`);
   assert.equal(await page.locator('.archive-preview,.community-section').count(),0);
   for(const id of ['pslv','aircraft']){await page.locator(`[data-program="${id}"] a`).first().click();assert.ok(await page.locator(`[data-project-panel="${id}"]`).isVisible());await page.goBack();}
   assert.ok(await page.locator('a[href="about.html#support"]').isVisible());
  });
  await check('About groups real leaders and channel actions without timeline or duplicate contacts',async()=>{
   await page.goto(`${base}/${locale}about.html`);
   assert.equal(await page.locator('.award-feature').count(),0);
   assert.equal(await page.locator('.leadership-group').count(),3);
   for(const name of ['Uikang Joo','Yeonho Kim','Taeho Lee','Jaeyoung Park','Jin-Tae Kim'])assert.ok((await page.locator('.leadership').innerText()).includes(name));
   const former=page.locator('.leadership details');assert.equal(await former.getAttribute('open'),null);
   await former.locator('summary').focus();await page.keyboard.press('Enter');assert.ok((await former.innerText()).includes('Un-Seong Baik'));
   assert.equal(await page.locator('.channel-grid a').count(),3);
   assert.equal(await page.locator('.channel-grid a[href="mailto:uikangee@postech.ac.kr"]').count(),0);
  });
  await check('Footer stays unified and brand assets remain sharp at larger sizes',async()=>{
   await page.goto(`${base}/${locale}index.html`);
   for(const width of [320,390,768,1200,1440])for(const theme of ['light','dark']){
    await page.setViewportSize({width,height:1000});await setTheme(page,theme);
    await page.locator('footer').scrollIntoViewIfNeeded();
    const footer=await page.locator('footer').evaluate(el=>({background:getComputedStyle(el).backgroundColor,bottom:getComputedStyle(el.querySelector('.footer-bottom')).backgroundColor}));
    assert.ok(footer.bottom==='rgba(0, 0, 0, 0)'||footer.bottom===footer.background,'Footer remains one surface');
    assert.equal(await page.locator('footer img[src$="psi-emblem.png"]').count(),1);
    for(const selector of ['.header-affiliation .postech-wordmark','.brand .psi-logo','.footer-postech-logo','.footer-logo .psi-logo']){
     const image=page.locator(selector);await image.scrollIntoViewIfNeeded();
     await image.evaluate(img=>img.decode());
     const size=await image.evaluate(img=>({native:img.naturalWidth,width:img.getBoundingClientRect().width,ratio:img.naturalWidth/img.naturalHeight,display:img.getBoundingClientRect().width/img.getBoundingClientRect().height}));
     assert.ok(size.native>=size.width*2,`${selector} has enough pixels for high-DPI`);
     assert.ok(Math.abs(size.ratio-size.display)<.05,`${selector} is not stretched`);
     if(width===1440&&selector.startsWith('.brand'))assert.ok(size.width>=150,'PSI remains the primary header mark');
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`No overflow at ${width}px`);
   }
  });
  await check('Project dropdown has aligned icon and keyboard-operable items',async()=>{
   await page.setViewportSize({width:1440,height:1000});await page.goto(`${base}/${locale}index.html`);
   const toggle=page.locator('[data-project-menu-toggle]');assert.equal(await toggle.locator('svg').count(),1);
   const gap=await toggle.evaluate(el=>el.getBoundingClientRect().left-el.previousElementSibling.getBoundingClientRect().right);assert.ok(gap<=8);
   await toggle.focus();await page.keyboard.press('Enter');assert.ok(await page.locator('[data-project-submenu]').isVisible());
   await page.keyboard.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');
   await toggle.click();await page.locator('[data-project-submenu] a').last().click();assert.ok(await page.locator('#project-aircraft').isVisible());
  });
  await check('Contact is compact, expands its form, and maps the wind-tunnel building',async()=>{
   await page.goto(`${base}/${locale}support.html`);
   assert.equal(await page.locator('.support-path').count(),0);
   const form=page.locator('[data-support-form]');assert.equal(await form.isVisible(),false);
   const map=page.locator('[data-campus-map]');const src=new URL(await map.getAttribute('src'));
   assert.equal(src.searchParams.get('marker'),'36.02159,129.32135');
   assert.ok((await page.locator('#contact').innerText()).includes('풍동동'));
   for(const width of [390,1440]){
    await page.setViewportSize({width,height:1000});const box=await map.boundingBox();assert.ok(box.height<=240&&box.width<=400,'Map stays small');
    for(const theme of ['light','dark']){await setTheme(page,theme);assert.equal(await page.locator('.supporter-list').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');}
   }
   await page.locator('[data-contact-compose] summary').focus();await page.keyboard.press('Enter');assert.ok(await form.isVisible());
   await form.locator('[name="name"]').fill('Preview visitor');await form.locator('[name="email"]').fill('visitor@example.com');await form.locator('[name="message"]').fill('Support enquiry');await form.locator('[type="submit"]').click();
   assert.match(await page.locator('[data-support-draft]').getAttribute('href'),/^mailto:uikangee@postech.ac.kr\?/);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  });
  await check('Redundant shortcuts are absent while source and navigation links remain',async()=>{
   const removed=/Earlier conference work and awards|Watch the field and onboard films|Explore the vehicle|Flight history|Photographs from launch day|이전 학회 발표와 수상 기록|발사대·탑재 영상 보기|비행체 살펴보기|비행 기록$|발사일 사진 보기/;
   for(const route of ['research','projects','gallery']){
    await page.goto(`${base}/${locale}${route}.html`);
    const links=await page.locator('a:visible').allTextContents();assert.ok(!links.some(text=>removed.test(text.trim())),`${route} omits promotional jump links`);
    assert.equal(await page.locator('.site-nav a[href="records.html"]').count(),1);
   }
  });
  await context.close();
 }
 assert.deepEqual(failures,[]);
}
module.exports={checkLayoutRefinement};
if(require.main===module)(async()=>{const browser=await chromium.launch();try{await checkLayoutRefinement(browser);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
