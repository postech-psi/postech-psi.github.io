const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=(process.env.PSI_URL||'http://127.0.0.1:8870').replace(/\/$/,'');
async function checkSimpleNavigation(browser){
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 try{
 for(const prefix of ['', 'ko/']){
  await page.goto(`${base}/${prefix}projects.html#project-aircraft`);
  assert.equal(await page.locator('[data-project-tab]').count(),2,'Projects exposes two direct project tabs');
  assert.equal(await page.locator('[data-project-tab="aircraft"]').getAttribute('aria-selected'),'true');
  assert.ok(await page.locator('[data-project-panel="aircraft"]').isVisible());
  assert.equal(await page.locator('[data-project-panel="pslv"]').isVisible(),false);
  await page.locator('[data-project-tab="pslv"]').click();
  assert.equal(new URL(page.url()).hash,'#project-pslv');
  await page.goBack();
  assert.equal(await page.locator('[data-project-tab="aircraft"]').getAttribute('aria-selected'),'true');
  await page.goto(`${base}/${prefix}pslv.html`);
  assert.equal(await page.locator('.site-nav a').count(),5,'Five destinations keep the navigation focused');
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.locator('[data-system][open]').count(),0,'Systems start collapsed');
  const originalPath=new URL(page.url()).pathname;
  await page.locator('[data-system="avionics"] > summary').click();
  assert.equal(new URL(page.url()).pathname,originalPath);
  assert.ok(await page.locator('[data-system="avionics"] [data-architecture-flow]').isVisible());
  assert.ok(await page.locator('[data-system="avionics"]').evaluate(el=>el.getAnimations().length>0),'Disclosure has a real animation');
  await page.locator('[data-system="tms"] > summary').click();
  await page.locator('[data-results-status="ready"]').waitFor({state:'attached'});
  await page.locator('#dt-canvas-thrust canvas').waitFor({state:'visible'});
  assert.ok((await page.locator('#dt-canvas-thrust canvas').boundingBox()).width>100);
  assert.ok(await page.locator('#dt-canvas-thrust canvas').isVisible());
  await page.waitForFunction(()=>document.querySelectorAll('[data-system][open]').length===1);
  assert.equal(await page.locator('[data-system][open]').count(),1,'One focal system stays open');
  const avionics=page.locator('[data-system="avionics"] > summary');
  await avionics.focus();await page.keyboard.press('Enter');await page.keyboard.press('Space');await page.keyboard.press('Enter');
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>document.querySelectorAll('[data-system][open]').length===1&&document.querySelector('[data-system="avionics"]').open);
  assert.equal(await page.locator('[data-system][open]').getAttribute('data-system'),'avionics','Interrupted keyboard toggles settle on the last requested system');
  assert.equal(await page.locator('[data-system="avionics"]').evaluate(el=>el.style.height),'','Resize does not leave a fixed clipping height');
  await page.locator('[data-theme-toggle]').click();
  assert.ok(await page.locator('[data-theme-toggle]').evaluate(el=>el.getAnimations().length>0));
  await page.locator('[data-menu-toggle]').click();
  assert.ok(await page.locator('.site-nav').evaluate(el=>el.getAnimations().length>0));
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#main').evaluate(el=>el.inert),false);
  await page.setViewportSize({width:1440,height:1000});
  for(const [from,to] of [['tms.html?test=2026-04-08-combustion#test-results','projects.html?test=2026-04-08-combustion#test-results'],['avionics.html#architecture','projects.html#architecture'],['gallery.html#launch-dec-2025','news.html#launch-dec-2025'],['join.html','about.html#participation'],['learning.html','about.html#learning']]){
   await page.goto(`${base}/${prefix}${from}`);await page.waitForURL(`${base}/${prefix}${to}`);
   if(from.startsWith('avionics'))assert.ok(await page.locator('#architecture').isVisible());
  }
  await page.goto(`${base}/${prefix}news.html`);
  const newsPath=new URL(page.url()).pathname;
  await page.locator('[data-gallery-open]').first().click();
  assert.ok(await page.locator('#photo-dialog').isVisible());
  assert.equal(new URL(page.url()).pathname,newsPath);
  await page.locator('[data-gallery-next]').click();
  await page.locator('[data-gallery-image]').waitFor({state:'visible'});
  assert.ok(await page.locator('[data-gallery-image]').evaluate(el=>el.getAnimations().length>0),'Gallery animates photo changes');
  await page.locator('[data-gallery-close]').click();
  await page.goto(`${base}/${prefix}about.html`);
  assert.equal(await page.locator('#participation').count(),1);assert.equal(await page.locator('#learning').count(),1);
  for(const route of ['index','projects','pslv','aircraft','research','records','news','about']){
   await page.goto(`${base}/${prefix}${route}.html`);
   assert.equal(await page.locator('a[href]').evaluateAll(as=>as.filter(a=>/^(avionics|tms|gallery|join|learning)\.html/.test(a.getAttribute('href'))).length),0,`${route} exposes only canonical destinations`);
  }
  await page.goto(`${base}/${prefix}projects.html`);
  assert.equal(await page.locator('main h1').count(),1);
  await page.locator('[data-project-tab="aircraft"]').click();
  assert.ok(await page.locator('[data-project-panel="aircraft"]').isVisible());
  assert.equal(await page.locator('[data-project-panel="pslv"]').isVisible(),false);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/pslv.html');
 await page.locator('[data-system="avionics"] > summary').click();
 assert.ok(await page.locator('#architecture').isVisible());
 assert.equal(await page.locator('[data-system="avionics"]').evaluate(el=>el.getAnimations().length),0);
 await page.locator('[data-theme-toggle]').click();assert.equal(await page.locator('[data-theme-toggle]').evaluate(el=>el.getAnimations().length),0);
 const nojs=await browser.newContext({javaScriptEnabled:false});const fallback=await nojs.newPage();
 await fallback.goto(base+'/projects.html');
 assert.equal(await fallback.locator('[data-project-panel]:visible').count(),2);
 assert.equal(await fallback.locator('main h1').count(),1);
 await fallback.locator('[data-system="tms"] > summary').click();
 assert.ok(await fallback.locator('[data-results-fallback]').isVisible());
 await nojs.close();
 console.log('PASS simple navigation: bilingual canonical routes, native engineering disclosures, original charts, compatibility deep links, News photos, About participation, project switch and reduced motion');
 }finally{await page.close();}
}
module.exports={checkSimpleNavigation};
if(require.main===module)(async()=>{const browser=await chromium.launch({channel:process.env.PSI_BROWSER_CHANNEL||undefined});try{await checkSimpleNavigation(browser);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
