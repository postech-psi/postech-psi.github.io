const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.PSI_URL||'http://127.0.0.1:8767';
async function checkInformationDesign(browser,group=process.env.PSI_DESIGN_GROUP){
 const failures=[];
 const page=await browser.newPage({viewport:{width:1280,height:720},reducedMotion:'reduce'});
 const check=async(kind,name,run)=>{if(group&&group!==kind)return;try{await run();console.log('PASS: '+name);}catch(e){failures.push(name+': '+e.message);}};
 try{for(const locale of ['', 'ko/']){
  await check('chrome',locale+'identity remains ordered and footer is compact without clipping',async()=>{
   for(const width of [1280,1440,1024,768,390,320]){
    await page.setViewportSize({width,height:844});await page.goto(`${base}/${locale}index.html`);await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('.header-emblem').count(),1,'Header needs the authentic emblem');
    const g=await page.evaluate(()=>{const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right};};return{psi:box('.brand .psi-wordmark'),emblem:box('.header-emblem'),postech:box('.header-affiliation'),preferences:box('.header-preferences'),footer:box('.site-footer'),overflow:document.documentElement.scrollWidth>innerWidth+1,footerOverflow:document.querySelector('.site-footer').scrollHeight>document.querySelector('.site-footer').clientHeight+1};});
    assert.ok(g.psi.width>g.postech.width,'PSI is the primary mark');assert.ok(g.emblem.x>g.psi.x);assert.ok(g.postech.x>g.emblem.x);
    if(width>1100){assert.ok(g.postech.x>g.preferences.x);assert.ok(g.footer.height<=175,`Footer is ${g.footer.height}px`);}
    assert.equal(g.overflow,false,`${width}px page overflow`);assert.equal(g.footerOverflow,false,'Footer must not clip content');
    const footer=await page.evaluate(()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return{x:r.x,y:r.y,right:r.right,bottom:r.bottom};};return{postech:rect('.footer-postech-link'),emblem:rect('.footer-logo .footer-emblem'),psi:rect('.footer-logo .psi-wordmark'),identity:rect('.footer-identity'),privacy:rect('.footer-privacy-link'),channels:[...document.querySelectorAll('.footer-channels a')].map(n=>n.getBoundingClientRect().y)};});
    assert.ok(footer.postech.right<=footer.emblem.x&&footer.emblem.right<=footer.psi.x,'Footer order is POSTECH, PSI emblem, PSI wordmark');
    assert.ok(footer.channels.every(y=>Math.abs(y-footer.channels[0])<1),`${width}px: contact links stay on one row`);
    assert.ok(footer.privacy.y>=footer.identity.bottom&&Math.abs(footer.privacy.x-footer.postech.x)<1,'Privacy policy sits below and aligns with POSTECH');
   }
  });
  await check('about',locale+'support is visible first and the laboratory team closes the information page',async()=>{
   for(const width of [1280,390]){
    await page.setViewportSize({width,height:width===390?844:720});await page.goto(`${base}/${locale}about.html`);
    assert.equal(await page.locator('[data-support-primary]').count(),1,'Direct support enquiry must exist');
    const action=page.locator('[data-support-primary]');assert.match(await action.getAttribute('href'),/^mailto:uikangee@postech\.ac\.kr\?subject=/);
    const r=await action.boundingBox();assert.ok(r.y+r.height<(width===390?844:720),'Support action is visible without scrolling');
    assert.equal(await page.locator('main h1').count(),1);
    assert.equal(await page.locator('.supporter-list li').count(),5);
    assert.ok(await page.evaluate(()=>document.querySelector('main').lastElementChild.classList.contains('about-team')),'Laboratory photograph is the final main element');
    assert.ok(await page.evaluate(()=>document.querySelector('#contact').compareDocumentPosition(document.querySelector('.supporter-list'))&Node.DOCUMENT_POSITION_FOLLOWING));
    for(const theme of ['light','dark']){
     await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
     const backgrounds=await page.locator('.supporter-list,.supporter-art').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).backgroundColor));
     assert.ok(backgrounds.every(bg=>bg==='rgba(0, 0, 0, 0)'),`${theme}: logos must sit on the page canvas`);
    }
   }
  });
  await check('about',locale+'legacy support and contact routes retain query and target',async()=>{
   for(const [from,to] of [['support.html','about.html#support'],['support.html?ref=partner#contact','about.html?ref=partner#contact'],['contact.html','about.html#contact'],['support.html#supporters-heading','about.html#supporters-heading'],['support.html#support-path-heading','about.html#support-path-heading'],['support.html#campus','about.html#campus']]){
    await page.goto(`${base}/${locale}${from}`);await page.waitForURL(`${base}/${locale}${to}`,{timeout:2000});
    assert.ok(await page.locator(new URL(page.url()).hash).isVisible());
   }
  });
  await check('systems',locale+'subsystem selection keeps the reading grid stable and supports history',async()=>{
   await page.setViewportSize({width:1440,height:1000});await page.goto(`${base}/${locale}projects.html#avionics`);
   assert.equal(await page.locator('[data-system-tab]').count(),5,'Persistent subsystem navigation must exist');
   const bounds=()=>page.locator('[data-system][open]').evaluate(n=>{const r=n.getBoundingClientRect();return{x:r.x,width:r.width};});
   const first=await bounds();assert.ok(await page.locator('.vehicle-overview').isVisible());
   await page.locator('[data-system-tab="tms"]').click();assert.equal(new URL(page.url()).hash,'#tms');
   const second=await bounds();assert.ok(Math.abs(first.x-second.x)<1);assert.ok(Math.abs(first.width-second.width)<1);
   assert.equal(await page.locator('[data-system][open]').count(),1);assert.ok(await page.locator('.vehicle-overview').isVisible());
   await page.locator('[data-project-tab="aircraft"]').click();
   await page.locator('[data-project-tab="pslv"]').click();
   assert.equal(new URL(page.url()).hash,'#tms','Returning to PSLV keeps the selected system in its shareable URL');
   await page.reload();assert.ok(await page.locator('[data-system="tms"] .system-content').isVisible());
   await page.locator('[data-language-link]').click();await page.locator('[data-system="tms"] .system-content').waitFor({state:'visible'});assert.ok(await page.locator('[data-system="tms"] .system-content').isVisible());
   await page.goto(`${base}/${locale}projects.html#avionics`);await page.locator('[data-system-tab="tms"]').click();
   await page.goBack();assert.equal(await page.locator('[data-system-tab="avionics"]').getAttribute('aria-selected'),'true');
   await page.goto(`${base}/${locale}projects.html#architecture`);assert.ok(await page.locator('#architecture').isVisible());
   await page.reload();assert.ok(await page.locator('#architecture').isVisible());
   assert.ok((await page.locator('[data-language-link]').getAttribute('href')).endsWith('#architecture'));
   await page.locator('[data-system-tab="avionics"]').focus();await page.keyboard.press('ArrowDown');
   assert.equal(await page.locator('[data-system-tab="structure"]').getAttribute('aria-selected'),'true');
   await page.setViewportSize({width:390,height:844});await page.locator('[data-system-select]').selectOption('recovery');
   assert.equal(new URL(page.url()).hash,'#recovery');assert.ok(await page.locator('[data-system="recovery"] .system-content').isVisible());
   await page.goto(`${base}/${locale}projects.html#not-a-system`);assert.equal(await page.locator('[data-system][open]').count(),1);
  });
  await check('home',locale+'Home identity remains visible during playback and support is direct',async()=>{
   await page.setViewportSize({width:1280,height:720});await page.goto(`${base}/${locale}index.html`);
   assert.equal(await page.locator('.home-identity').count(),1,'Mission must be outside the disappearing film overlay');
   assert.equal(await page.locator('main h1').count(),1);assert.equal(await page.locator('[data-program]').count(),2);
   assert.equal(await page.locator('.current-research-invitation,.testing-feature').count(),0);
   assert.equal(await page.locator('.home-support a').getAttribute('href'),'about.html#support');
   await page.locator('[data-media-play]').click();await page.waitForFunction(()=>document.querySelector('video').currentTime>.2);
   assert.ok(await page.locator('.home-identity h1').isVisible());await page.locator('video').evaluate(v=>v.pause());
  });
 }
 }finally{await page.close();}
 assert.deepEqual(failures,[],'PSI information design');
}
if(require.main===module)(async()=>{const browser=await chromium.launch({headless:true});try{await checkInformationDesign(browser);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={checkInformationDesign};
