const {setTheme} = require('./test-helpers.cjs');
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const base = process.env.PSI_URL || 'http://127.0.0.1:8767';
const still = async page => {
  const before = await page.locator('[data-flight-video]').evaluate(v => v.currentTime);
  await page.waitForTimeout(300);
  assert.ok(Math.abs(await page.locator('[data-flight-video]').evaluate(v => v.currentTime) - before) < .05,'Video must remain still');
};
async function checkMotionGallery(browser, only = 'all') {
  const failures=[];
  for (const locale of ['', 'ko/']) {
    const context=await browser.newContext({viewport:{width:1440,height:1000}});
    const page=await context.newPage();
    for (const [name,run] of [
      ['theme',async()=>{
        await page.goto(`${base}/${locale}index.html`);
        assert.equal(await page.locator('meta[name="theme-color"]').count(),1,'Browser theme color is present');
        for(const [theme,color] of [['dark','#000000'],['light','#FFFFFF']]) {
          await setTheme(page,theme);
          assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'),color);
          await page.reload();assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'),color);
        }
        await page.emulateMedia({colorScheme:'dark'});await setTheme(page,'system');
        assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'),'#000000');
      }],
      ['handoff',async()=>{
        await page.emulateMedia({reducedMotion:'no-preference'});
        await page.goto(`${base}/${locale}index.html`);
        await page.waitForFunction(()=>document.querySelector('[data-flight-video]').currentTime > .2);
        await page.locator('[data-media-play]').focus();await page.keyboard.press('Enter');
        await page.waitForFunction(()=>document.querySelector('[data-flight-video]').currentTime > .2);
        assert.ok(await page.locator('[data-flight-video]').evaluate(v=>v.controls && !v.loop && !v.muted),'Running background hands off to audible native controls');
        assert.equal(await page.evaluate(()=>document.activeElement.tagName),'VIDEO');
        assert.equal(await page.locator('[data-media-play]').isVisible(),false);
        assert.equal(await page.locator('[data-motion-toggle]').isVisible(),false);
        await page.keyboard.press('Space');await still(page);
      }],
      ['hero',async()=>{
        await page.goto(`${base}/${locale}index.html`);
        assert.equal(await page.locator('[data-motion-toggle]').count(),1,'Homepage exposes a persistent motion control');
        await page.waitForFunction(()=>document.querySelector('[data-flight-video]').currentTime > .2);
        assert.ok(await page.locator('.hero-identity').isVisible());
        assert.ok(await page.locator('[data-flight-video]').evaluate(v=>v.muted && v.loop && !v.controls));
        const toggle=page.locator('[data-motion-toggle]');
        await toggle.focus();await page.keyboard.press('Enter');await still(page);
        assert.equal(await toggle.evaluate(el=>el===document.activeElement),true,'Pause keeps control focus');
        await page.locator('footer').scrollIntoViewIfNeeded();await page.evaluate(()=>scrollTo(0,0));await still(page);
        await toggle.click();await page.waitForFunction(()=>!document.querySelector('[data-flight-video]').paused);
        await page.locator('footer').scrollIntoViewIfNeeded();
        await page.waitForFunction(()=>document.querySelector('[data-flight-video]').paused);
        await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>!document.querySelector('[data-flight-video]').paused);
        await page.emulateMedia({reducedMotion:'reduce'});await still(page);
        await page.reload();await still(page);
        await page.locator('[data-media-play]').click();
        await page.waitForFunction(()=>document.querySelector('[data-flight-video]').currentTime > .2);
        assert.ok(await page.locator('[data-flight-video]').evaluate(v=>v.controls && !v.loop));
        await page.locator('[data-flight-video]').evaluate(v=>v.pause());await still(page);
        await page.locator('[data-media="onboard"]').click();await still(page);
        assert.ok(await page.locator('[data-flight-video]').evaluate(v=>v.paused && !v.loop));
        await page.emulateMedia({reducedMotion:'no-preference'});await still(page);
        await page.locator('[data-media-play]').click();
        await page.waitForFunction(()=>document.querySelector('[data-flight-video]').currentTime > .2);
        await page.locator('[data-flight-video]').evaluate(v=>v.pause());
      }],
      ['gallery',async()=>{
        const response=await page.goto(`${base}/${locale}gallery.html`);
        assert.equal(response.status(),200,'Gallery route exists');
        assert.equal(await page.locator('[data-gallery-event]').count(),6);
        assert.equal(await page.locator('[data-gallery-open]').count(),14);
        const links=await page.locator('[data-gallery-open]').evaluateAll(els=>els.map(el=>el.href));
        assert.equal(new Set(links).size,14,'Gallery shows fourteen distinct photos');
        assert.equal(await page.locator('#award-dec-2025 [data-gallery-open]').count(),1);
        assert.equal(await page.locator('main [data-photo-motion]').count(),await page.locator('main [data-photo-motion].motion-surface').count(),'Every marked photograph receives the shared motion contract');
        for(const width of [1440,390]){
          await page.setViewportSize({width,height:844});
          const gap=await page.locator('#award-dec-2025').evaluate(section=>section.querySelector('.event-photos').getBoundingClientRect().top-section.querySelector('header').getBoundingClientRect().bottom);
          assert.ok(gap <= (width===1440?160:96),`${width}px award photo follows its heading without an empty row`);
        }
        await page.setViewportSize({width:1440,height:1000});
        const movingPhoto=page.locator('main [data-photo-motion]').first();
        await movingPhoto.scrollIntoViewIfNeeded();
        let box=await movingPhoto.boundingBox();
        await page.mouse.move(box.x+box.width*.7,box.y+box.height*.4);
        await page.waitForFunction(()=>document.querySelector('main [data-photo-motion]')?.style.getPropertyValue('--tilt-y'));
        await page.emulateMedia({reducedMotion:'reduce'});
        await page.waitForFunction(()=>!document.querySelector('main [data-photo-motion]')?.style.getPropertyValue('--tilt-y'));
        box=await movingPhoto.boundingBox();
        await page.mouse.move(box.x+box.width*.3,box.y+box.height*.6);
        assert.equal(await movingPhoto.evaluate(el=>el.style.getPropertyValue('--tilt-y')),'','Reduced motion must keep photographs still');
        await page.emulateMedia({reducedMotion:'no-preference'});
        const opener=page.locator('#launch-dec-2025 [data-gallery-open]').first();
        await opener.click();
        const dialog=page.locator('#photo-dialog');assert.ok(await dialog.isVisible());
        // Native Escape removes `open` before its queued close event restores
        // body scrolling. Wait for that real state, not an arbitrary delay.
        const waitForClose=()=>page.waitForFunction(()=>!document.querySelector('#photo-dialog').open&&!document.body.classList.contains('dialog-open'),null,{timeout:1000});
        assert.match(await page.locator('[data-gallery-count]').textContent(),/1\s*\/\s*5/);
        const first=await dialog.locator('img').getAttribute('src');
        await page.keyboard.press('ArrowRight');
        assert.notEqual(await dialog.locator('img').getAttribute('src'),first);
        assert.match(await page.locator('[data-gallery-count]').textContent(),/2\s*\/\s*5/);
        await dialog.locator('img').evaluate(img=>img.decode());
        assert.equal(await dialog.locator('img').evaluate(img=>getComputedStyle(img).objectFit),'contain');
        for(let i=0;i<6;i++)await page.keyboard.press('Tab');
        assert.ok(await dialog.evaluate(el=>el.contains(document.activeElement)),'Dialog traps focus');
        await page.keyboard.press('Escape');await waitForClose();assert.equal(await dialog.isVisible(),false);
        assert.ok(await opener.evaluate(el=>el===document.activeElement));
        assert.notEqual(await page.locator('body').evaluate(el=>getComputedStyle(el).overflow),'hidden');
        await page.locator('#rocket-dec-2025 [data-gallery-open]').click();
        assert.ok(await page.locator('[data-gallery-next]').isDisabled());
        assert.ok(await page.locator('[data-gallery-prev]').isDisabled());
        await page.locator('[data-gallery-close]').click();await waitForClose();
        await page.locator('#award-dec-2025 [data-gallery-open]').click();
        assert.match(await page.locator('[data-gallery-count]').textContent(),/1\s*\/\s*1/);
        await page.locator('[data-gallery-close]').click();await waitForClose();
        await page.setViewportSize({width:390,height:844});
        await page.locator('#nura-aug-2025 [data-gallery-open]').first().click();
        await page.locator('[data-gallery-next]').click();
        assert.match(await page.locator('[data-gallery-count]').textContent(),/2\s*\/\s*4/);
        await page.locator('[data-gallery-close]').click();await waitForClose();
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      }],
      ['loading',async()=>{
        await page.goto(`${base}/${locale}gallery.html`);
        let release;const held=new Promise(resolve=>{release=resolve;});
        await page.route('**/*?loading-test',async route=>{await held;await route.continue().catch(()=>{});});
        const opener=page.locator('#launch-dec-2025 [data-gallery-open]').first();
        await opener.evaluate(el=>el.href+='?loading-test');
        try {
          await opener.click();
          assert.equal(await page.locator('[data-gallery-loading]').count(),1,'Gallery exposes a loading status');
          assert.ok(await page.locator('[data-gallery-loading]').isVisible());
          assert.match(await page.locator('[data-gallery-loading]').textContent(),locale?/사진을 불러오는 중/:/Loading photograph/);
          await page.locator('[data-gallery-next]').click();
          await page.waitForFunction(()=>{const img=document.querySelector('[data-gallery-image]');return img.complete&&img.naturalWidth>0&&!img.hidden;});
          assert.equal(await page.locator('[data-gallery-loading]').isVisible(),false);
          const current=await page.locator('[data-gallery-image]').getAttribute('src');
          release();await page.waitForTimeout(150);
          assert.equal(await page.locator('[data-gallery-image]').getAttribute('src'),current,'Stale photo cannot replace current image');
          assert.equal(await page.locator('[data-gallery-loading]').isVisible(),false);
          await page.keyboard.press('Escape');
        } finally {release();await page.unroute('**/*?loading-test');}
      }],
      ['preferences',async()=>{
        const saved=await browser.newContext();
        try {
          await saved.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,addEventListener(){}}}));
          const p=await saved.newPage();await p.goto(`${base}/${locale}index.html`);await still(p);
          await p.locator('[data-motion-toggle]').click();await p.waitForFunction(()=>document.querySelector('[data-flight-video]').currentTime>.2);
        } finally {await saved.close();}
        const guarded=await browser.newContext();
        try {
          await guarded.addInitScript(()=>{
            Object.defineProperty(document,'hidden',{get:()=>window.testHidden||false,configurable:true});
            const original=HTMLMediaElement.prototype.play;let held=false;
            HTMLMediaElement.prototype.play=function(){const promise=original.call(this);if(this.muted&&!held){held=true;return promise.then(()=>new Promise(resolve=>{window.releaseBackground=resolve;}));}return promise;};
          });
          const p=await guarded.newPage();await p.goto(`${base}/${locale}index.html`);
          await p.waitForFunction(()=>typeof window.releaseBackground==='function');
          await p.locator('[data-media="onboard"]').click();await p.evaluate(()=>window.releaseBackground());
          await p.waitForFunction(()=>document.querySelector('[data-flight-video]').currentTime>.2);
          assert.ok((await p.locator('[data-flight-video]').getAttribute('src')).endsWith('onboard.mp4'));
          assert.ok(await p.locator('[data-flight-video]').evaluate(v=>v.controls&&!v.loop&&v.muted&&!v.paused),'Stale pad promise cannot change selected onboard playback');
          await p.goto(`${base}/${locale}pslv.html#flight-record`);
          await p.locator('[data-replay-toggle]').click();await p.waitForFunction(()=>Number(document.querySelector('[data-replay-seek]').value)>1);
          await p.evaluate(()=>{window.testHidden=true;document.dispatchEvent(new Event('visibilitychange'));});
          const index=await p.locator('[data-replay-seek]').inputValue();await p.waitForTimeout(150);assert.equal(await p.locator('[data-replay-seek]').inputValue(),index);
          await p.evaluate(()=>{window.testHidden=false;document.dispatchEvent(new Event('visibilitychange'));});
          assert.equal(await p.locator('[data-telemetry]').getAttribute('data-replaying'),'false');
        } finally {await guarded.close();}
        const blocked=await browser.newContext();
        try {
          await blocked.addInitScript(()=>{const original=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){if(this.muted)return Promise.reject(new DOMException('Autoplay denied','NotAllowedError'));return original.call(this);};});
          const p=await blocked.newPage();await p.goto(`${base}/${locale}index.html`);await still(p);
          assert.ok(await p.locator('.hero-identity').isVisible());
          await p.locator('[data-media-play]').click();await p.waitForFunction(()=>document.querySelector('[data-flight-video]').currentTime>.2);
          assert.ok(await p.locator('[data-flight-video]').evaluate(v=>v.controls));
        } finally {await blocked.close();}
      }],
      ['fallbacks',async()=>{
        const plain=await browser.newContext({javaScriptEnabled:false,reducedMotion:'reduce'});
        try {
          const p=await plain.newPage();await p.goto(`${base}/${locale}gallery.html`);
          assert.equal(await p.locator('[data-gallery-open]').count(),14);
          assert.ok((await p.locator('[data-gallery-open]').first().getAttribute('href')).endsWith('.webp'));
          await p.goto(`${base}/${locale}projects.html#flight-record`);assert.equal(await p.locator('[data-trace-segment]').count(),8);
          await p.evaluate(()=>document.fonts.ready);
          if(!await p.locator('[data-system="avionics"]').evaluate(el=>el.open))await p.locator('[data-system="avionics"] > summary').click();await p.locator('.replay-summary summary').click();assert.equal(await p.locator('.replay-summary tbody tr:visible').count(),3);
        } finally {await plain.close();}
        const failed=await browser.newContext();
        try {
          const p=await failed.newPage();await p.route('**/archive-telemetry.json',route=>route.abort());
          await p.goto(`${base}/${locale}pslv.html#flight-record`);
          await p.waitForFunction(()=>/unavailable|불러올 수 없습니다/.test(document.querySelector('[data-replay-status]').textContent));
          assert.equal(await p.locator('[data-replay-controls]').isVisible(),false);
          assert.ok(await p.locator('[data-telemetry] svg').isVisible());
        } finally {await failed.close();}
      }],
      ['replay',async()=>{
        await page.goto(`${base}/${locale}pslv.html#flight-record`);
        assert.equal(await page.locator('[data-telemetry]').count(),1,'Recorded telemetry tool exists');
        const data=await (await context.request.get(`${base}/assets/archive-telemetry.json`)).json();
        assert.equal(data.samples.length,343);assert.equal(data.gaps.length,7);
        assert.equal(Math.max(...data.samples.map(s=>s.altitudeMeters)),186.632);
        assert.deepEqual(data.samples.at(-1),{elapsedSeconds:29.38,altitudeMeters:45.841,verticalVelocityMetersPerSecond:-6.764,state:'DEPLOY'});
        for(const s of data.samples)assert.deepEqual(Object.keys(s).sort(),['altitudeMeters','elapsedSeconds','state','verticalVelocityMetersPerSecond']);
        assert.equal(await page.locator('[data-telemetry] [data-trace-segment]').count(),8,'Seven real gaps create eight unconnected traces');
        const seek=page.locator('[data-replay-seek]');await seek.waitFor({state:'visible'});
        const cursorBox=await page.locator('[data-replay-cursor]').boundingBox();
        assert.ok(cursorBox && cursorBox.width>0 && cursorBox.height>0,'The SVG cursor must be visibly rendered');
        await seek.fill('342');
        assert.match(await page.locator('[data-replay-readout]').textContent(),/45\.841/);
        assert.match(await page.locator('[data-replay-readout]').textContent(),/DEPLOY/);
        assert.match(await seek.getAttribute('aria-valuetext'),/29\.38/);
        assert.equal(await page.locator('[data-replay-toggle]').textContent(),locale?'기록 다시 보기':'Replay excerpt','End position offers replay');
        await page.locator('[data-replay-reset]').click();assert.equal(await seek.inputValue(),'0');
        assert.equal(await page.locator('[data-replay-toggle]').textContent(),locale?'기록 재생':'Play excerpt','Reset position offers play');
        await page.locator('[data-replay-toggle]').click();
        await page.waitForFunction(()=>Number(document.querySelector('[data-replay-seek]').value)>2);
        await page.locator('[data-replay-toggle]').click();const index=await seek.inputValue();
        await page.waitForTimeout(150);assert.equal(await seek.inputValue(),index);
        await seek.fill('340');await page.locator('[data-replay-toggle]').click();
        await page.waitForFunction(()=>document.querySelector('[data-replay-seek]').value==='342');
        assert.equal(await page.locator('[data-telemetry]').getAttribute('data-replaying'),'false');
        for(const width of [390,320]) {
          await page.setViewportSize({width,height:844});
          const minimum=await page.locator('[data-telemetry] svg text').evaluateAll(labels=>Math.min(...labels.filter(label=>getComputedStyle(label).display!=='none').map(label=>parseFloat(getComputedStyle(label).fontSize)*label.getScreenCTM().a)));
          assert.ok(minimum>=12,`Chart labels at ${width}px render at ${minimum.toFixed(2)}px, below 12px`);
          const contained=await page.locator('[data-telemetry] svg').evaluate(svg=>{
            const frame=svg.getBoundingClientRect();
            return [...svg.querySelectorAll('text')].filter(label=>getComputedStyle(label).display!=='none').every(label=>{const box=label.getBoundingClientRect();return box.left>=frame.left && box.right<=frame.right;});
          });
          assert.ok(contained,`All chart labels fit inside the SVG at ${width}px`);
          const gaps=await page.locator('[data-time-tick]').evaluateAll(labels=>{
            const boxes=labels.filter(label=>getComputedStyle(label).display!=='none').map(label=>label.getBoundingClientRect());
            return boxes.slice(1).map((box,i)=>box.left-boxes[i].right);
          });
          assert.ok(Math.min(...gaps)>=8,`Time-axis tick labels have at least8px clear space at${width}`);
        }
      }]
    ]) {
      if(only!=='all' && only!==name)continue;
      try{await run();console.log(`PASS: ${locale||'en/'} ${name}`);}catch(e){failures.push(`${locale||'en/'} ${name}: ${e.message}`);}
    }
    await context.close();
  }
  assert.deepEqual(failures,[],'Motion/gallery/replay checks');
}
if(require.main===module)(async()=>{const browser=await chromium.launch({channel:process.env.PSI_BROWSER_CHANNEL||undefined,headless:true});try{await checkMotionGallery(browser,process.argv[2]);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={checkMotionGallery};
