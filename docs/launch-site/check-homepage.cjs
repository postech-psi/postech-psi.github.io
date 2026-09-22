const {setTheme} = require('./test-helpers.cjs');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.PSI_URL || 'http://127.0.0.1:8767';

async function checkHomepage(browser) {
  const failures = [];
  const check = async (name, run) => {
    try { await run(); console.log(`PASS: ${name}`); }
    catch (error) { failures.push(`${name}: ${error.message}`); }
  };
  for (const locale of ['', 'ko/']) {
    const context = await browser.newContext({viewport:{width:1440,height:1000}});
    const page = await context.newPage();
    await page.goto(`${base}/${locale}index.html`);
    await check(`${locale || 'en/'} two program previews link to direct project panels`,async()=>{
      assert.equal(await page.locator('[data-program]').count(),2);
      for(const id of ['pslv','aircraft']){
        await page.locator(`[data-program-choice="${id}"]`).click();
        const preview=page.locator(`[data-program="${id}"]`);
        assert.ok(await preview.locator('h2').isVisible());
        await preview.locator('a').first().click();
        assert.ok(page.url().endsWith(`/projects.html#project-${id}`));
        assert.ok(await page.locator(`[data-project-panel="${id}"]`).isVisible());
        assert.equal(await page.locator('h1').count(),1);
        await page.goBack();
      }
    });
    await check(`${locale || 'en/'} hero exposes one playback interface and preserves keyboard focus`, async () => {
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.setViewportSize({width:1440,height:1000});
      await page.goto(`${base}/${locale}index.html`);
      const video = page.locator('[data-flight-video]');
      const play = page.locator('[data-media-play]');
      assert.equal(await video.evaluate(v => v.controls),false,'Native controls wait until intentional playback');
      assert.ok(await play.isVisible());
      await play.focus();
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => document.querySelector('[data-flight-video]').currentTime > .2);
      assert.equal(await video.evaluate(v => v.controls),true);
      assert.equal(await page.evaluate(() => document.activeElement.tagName),'VIDEO');
      await video.evaluate(v => v.pause());
      assert.equal(await play.isVisible(),false,'Pausing must not cover native controls');
      await page.locator('[data-media="onboard"]').click();
      assert.equal(await video.evaluate(v => v.controls),false);
      assert.ok(await video.evaluate(v => v.paused));
      assert.ok((await video.getAttribute('poster')).endsWith('onboard-poster.webp'));
      assert.equal(await video.evaluate(v => getComputedStyle(v).objectFit),'contain','Onboard video retains its complete frame');
      assert.ok(await play.isVisible());
      assert.equal(await page.locator('[data-media-description]').count(),0,'Film tabs have no scene-description prose');
      await play.click();
      await page.waitForFunction(() => document.querySelector('[data-flight-video]').currentTime > .2);
      await video.evaluate(v => v.pause());
      assert.equal(await play.isVisible(),false);
      await page.locator('[data-media="pad"]').click();
      assert.ok((await video.getAttribute('poster')).endsWith('launch-poster.webp'));
      assert.ok(await video.evaluate(v => v.paused));
    });
    await check(`${locale || 'en/'} failed-video link has a visible keyboard outline in both themes`, async () => {
      await page.route('**/assets/onboard.mp4', route => route.abort());
      await page.goto(`${base}/${locale}index.html`);
      await page.locator('[data-media="onboard"]').click();
      const failure = page.locator('[data-media-failure]');
      await failure.waitFor({state:'visible'});
      for (const theme of ['light','dark']) {
        await setTheme(page,theme);
        await page.keyboard.press('Tab');
        const link = failure.locator('a');
        await link.focus();
        const contrast = await link.evaluate(node => {
          const luminance = color => color.match(/[\d.]+/g).slice(0,3).map(Number).map(value => {
            const c = value / 255;
            return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
          }).reduce((sum,c,i) => sum + c * [.2126,.7152,.0722][i],0);
          const style = getComputedStyle(node);
          const foreground = luminance(style.outlineColor);
          const background = luminance(getComputedStyle(node.closest('[data-media-failure]')).backgroundColor);
          return {visible:node.matches(':focus-visible') && style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0,ratio:(Math.max(foreground,background)+.05)/(Math.min(foreground,background)+.05)};
        });
        assert.ok(contrast.visible,'Error link must show a keyboard focus indicator');
        assert.ok(contrast.ratio >= 3,`${theme} error-link outline contrast ${contrast.ratio.toFixed(2)}:1 must reach 3:1`);
      }
    });
    await context.close();
    const fallback = await browser.newContext({javaScriptEnabled:false});
    const plain = await fallback.newPage();
    await plain.goto(`${base}/${locale}index.html`);
    await check(`${locale || 'en/'} no-JavaScript programs and native playback remain available`, async () => {
      assert.equal(await plain.locator('[data-program]:visible').count(),2);
      assert.ok(await plain.locator('[data-flight-video]').evaluate(v => v.controls));
      assert.equal(await plain.locator('[data-media-play]').isVisible(),false);
    });
    await fallback.close();
  }
  assert.deepEqual(failures, [], 'Homepage behavior checks');
}
if (require.main === module) (async () => {
  const browser = await chromium.launch({channel:process.env.PSI_BROWSER_CHANNEL||undefined,headless:true});
  try { await checkHomepage(browser); } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exitCode=1;});
module.exports = {checkHomepage};
