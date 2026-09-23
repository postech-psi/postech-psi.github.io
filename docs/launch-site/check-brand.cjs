const {setTheme}=require('./test-helpers.cjs');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.PSI_URL||'http://127.0.0.1:8767';
async function checkBrand(browser){
  const failures=[];
  for(const locale of ['', 'ko/']){
    const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',colorScheme:'light'});
    const page=await context.newPage();
    for(const [name,run] of [
      ['authentic PSI logo closes every canonical footer',async()=>{
        for(const route of ['index','projects','research','records','gallery','about','support']){
          await page.goto(`${base}/${locale}${route}.html`);
          const logo=page.locator('footer .footer-logo img');
          assert.equal(await logo.count(),1,`${route} has one footer logo`);
          assert.ok((await logo.getAttribute('src')).endsWith('assets/psi-logo.png'));
          assert.equal(await logo.getAttribute('alt'),'PSI');
          assert.equal(await logo.evaluate(img=>getComputedStyle(img).filter),'none');
          const ratio=await logo.evaluate(img=>img.getBoundingClientRect().width/img.getBoundingClientRect().height);
          assert.ok(Math.abs(ratio-1280/317)<.05,`${route} preserves logo proportions`);
          assert.ok(await page.locator('.footer-brand-bottom').evaluate(el=>el.compareDocumentPosition(document.querySelector('.footer-top'))&Node.DOCUMENT_POSITION_PRECEDING));
        }
        await page.goto(`${base}/${locale}index.html`);
        for(const width of [320,390,768,1440])for(const theme of ['light','dark']){
          await page.setViewportSize({width,height:900});
          await setTheme(page,theme);
          const logo=page.locator('footer .footer-logo img');
          assert.ok(await logo.evaluate(img=>img.complete&&img.naturalWidth>0));
          assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${width}px ${theme} footer fits`);
        }
      }],
      ['shared variable portal face without synthetic weight',async()=>{
        await page.goto(`${base}/${locale}index.html`);await page.evaluate(()=>document.fonts.ready);
        const heading=await page.locator('.hero-identity h1').evaluate(el=>({family:getComputedStyle(el).fontFamily,weight:getComputedStyle(el).fontWeight}));
        assert.equal(heading.family.split(',')[0].replaceAll('"','').trim(),'Pretendard','Both locales share the portal face');
        assert.equal(heading.weight,'650');
        assert.ok(await page.evaluate(()=>[...document.fonts].some(face=>face.family.includes('Pretendard')&&face.status==='loaded')),'Variable font loaded');
      }],
      ['neutral identity palette',async()=>{
        await page.goto(`${base}/${locale}index.html`);
        for(const theme of ['light','dark']){
          await setTheme(page,theme);
          const colors=await page.evaluate(()=>['canvas','surface','text','secondary','action','border','wash'].map(name=>{
            const probe=document.createElement('span');probe.style.color=`var(--${name})`;document.body.append(probe);
            const color=getComputedStyle(probe).color;probe.remove();return {name,channels:color.match(/[\d.]+/g).slice(0,3).map(Number)};
          }));
          for(const color of colors)assert.ok(Math.max(...color.channels)-Math.min(...color.channels)<=2,`${theme} ${color.name} is neutral: ${color.channels}`);
          assert.equal((await page.locator('meta[name="theme-color"]').getAttribute('content')).toLowerCase(),theme==='dark'?'#000000':'#ffffff');
          assert.equal(await page.locator('.site-header').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 0)','Official wordmark retains a black header');
        }
      }],
      ['direct icon toggle and responsive header',async()=>{
        await page.goto(`${base}/${locale}index.html`);
        assert.equal(await page.locator('[data-theme-control]').count(),1,'A visible icon toggle exists');
        for(const width of [320,390,901,1440]){
          await page.setViewportSize({width,height:1000});await page.evaluate(()=>document.fonts.ready);
          for(const choice of ['light','dark']){
            await setTheme(page,choice);
            assert.equal(await page.locator('html').getAttribute('data-theme-choice'),choice);
            const visible=await page.locator('[data-theme-icon]').evaluateAll(icons=>icons.filter(icon=>getComputedStyle(icon).display!=='none').map(icon=>icon.dataset.themeIcon));
            assert.deepEqual(visible,[choice],'Only the resolved palette icon is visible');
            const wrapper=await page.locator('[data-theme-control]').boundingBox();
            assert.ok(wrapper.width>=44&&wrapper.height>=44,'Preference target is at least44px');
            assert.equal(await page.locator('[data-theme-toggle]').getAttribute('aria-pressed'),String(choice==='dark'));
            assert.equal(await page.locator('[data-theme-control]').evaluate(el=>el.tagName),'BUTTON','Icon is a directly operable button');
            const logoGroup=await page.locator('.brand').boundingBox();
            assert.ok(logoGroup.width>=(width===1440?280:width<=360?110:140),`Logo group is readable at ${width}px`);
            const postechLogo=page.locator('.brand .postech-wordmark');
            assert.ok((await postechLogo.getAttribute('src')).endsWith('assets/postech-red-logo.png'));
            assert.equal(await postechLogo.getAttribute('width'),'118');
            assert.equal(await postechLogo.getAttribute('height'),'10');
            assert.equal(await page.locator('.postech-link').getAttribute('href'),'https://postech.ac.kr');
            const psiLogo=page.locator('.brand .psi-logo');
            assert.ok((await psiLogo.getAttribute('src')).endsWith('assets/psi-logo.png'));
            assert.equal(await psiLogo.getAttribute('width'),'1280');
            assert.equal(await psiLogo.getAttribute('height'),'317');
            const footerPostech=page.locator('.footer-postech-link');
            assert.equal(await footerPostech.getAttribute('href'),'https://postech.ac.kr');
            assert.ok((await footerPostech.locator('img').getAttribute('src')).endsWith('assets/postech-black-logo.png'));
            const privacyLink=page.locator('.footer-privacy-link');
            assert.equal(await privacyLink.textContent(),'개인정보처리방침');
            assert.equal(await privacyLink.getAttribute('href'),'https://www.postech.ac.kr/kor/usage-guide/privacy_policy.do');
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Header fits ${width}px`);
            const boxes=await page.locator('.brand,[data-theme-control],.language-link,.menu-toggle').evaluateAll(els=>els.filter(el=>getComputedStyle(el).display!=='none').map(el=>el.getBoundingClientRect()).sort((a,b)=>a.left-b.left).map(r=>({left:r.left,right:r.right})));
            assert.ok(boxes.every((r,i)=>!i||r.left>=boxes[i-1].right),`Header control bounds do not overlap at ${width}px`);
          }
        }
      }],
      ['menu releases page at the new navigation breakpoint',async()=>{
        await page.setViewportSize({width:901,height:1000});await page.goto(`${base}/${locale}index.html`);
        await page.locator('[data-menu-toggle]').click();
        assert.equal(await page.locator('main').evaluate(el=>el.inert),true);
        await page.setViewportSize({width:1440,height:1000});await page.waitForTimeout(100);
        assert.equal(await page.locator('main').evaluate(el=>el.inert),false,'Desktop resize releases content from the mobile menu');
        assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'),'false');
      }],
      ['preference persistence, system changes and keyboard toggle',async()=>{
        await page.goto(`${base}/${locale}index.html`);
        await setTheme(page,'system');await page.emulateMedia({colorScheme:'dark'});
        await page.waitForFunction(()=>document.documentElement.dataset.theme==='dark');
        assert.equal(await page.locator('html').getAttribute('data-theme-choice'),'system','Previously saved system preference still follows the OS');
        const button=page.locator('[data-theme-toggle]');
        await button.click();await page.reload();
        assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
        assert.equal(await button.getAttribute('aria-pressed'),'false');
        await page.emulateMedia({colorScheme:'light'});await page.emulateMedia({colorScheme:'dark'});
        assert.equal(await page.locator('html').getAttribute('data-theme'),'light','Explicit light wins over OS');
        await button.focus();await page.keyboard.press('Enter');
        assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
        assert.equal(await page.evaluate(()=>localStorage.getItem('psi-theme')),'dark');
        await page.keyboard.press('Space');
        assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
        await page.emulateMedia({forcedColors:'active'});await button.focus();
        const focus=await button.evaluate(el=>{const s=getComputedStyle(el);return {width:parseFloat(s.outlineWidth),style:s.outlineStyle,color:s.outlineColor,background:getComputedStyle(el.closest('header')).backgroundColor};});
        assert.ok(focus.width>=2&&focus.style!=='none'&&focus.color!==focus.background,'Forced-colours keyboard focus is visible');
        await page.keyboard.press('Enter');assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
        await page.emulateMedia({forcedColors:'none'});
      }]
    ])try{await run();console.log(`PASS: ${locale||'en/'} ${name}`);}catch(error){failures.push(`${locale||'en/'} ${name}: ${error.message}`);}
    await context.close();
  }
  assert.deepEqual(failures,[],'Brand and preference checks');
}
if(require.main===module)(async()=>{const browser=await chromium.launch({channel:process.env.PSI_BROWSER_CHANNEL||undefined,headless:true});try{await checkBrand(browser);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={checkBrand};
