const {setTheme} = require('./test-helpers.cjs');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const {chromium} = require('playwright');
const base = process.env.PSI_URL || 'http://127.0.0.1:8767';

// These independent source fixtures catch missing teams, stale April topics and
// current/history mixing in the generated reader-facing research index.
const titles = [
  '단 분리 로켓의 과도 동역학 기반 점화 안전 한계선 정의 및 자율 점화 시스템 개발',
  'PPO 기반 잔차 제어를 이용한 무인항공기의 강건한 정밀 착륙 기법',
  '재사용 발사체 기술 개발을 위한 전기식 TVC 수직이착륙 시연체의 개발 및 제어',
  '120 N급 End-burning 하이브리드 로켓용 환형 스월 인젝터의 설계 모델',
  '게인 스케줄링 PID 제어를 이용한 아음속 사운딩 로켓의 테일핀 제어 시스템 개발'
];

async function checkCurrentContent(browser) {
  const failures = [];
  const check = async (name, run) => {
    try { await run(); console.log(`PASS: ${name}`); }
    catch(error) { failures.push(`${name}: ${error.message}`); }
  };
  for (const locale of ['', 'ko/']) {
    const context = await browser.newContext({viewport:{width:1440,height:1000}});
    const page = await context.newPage();
    try {
      await check(`${locale || 'en/'} five current studies remain distinct from historical records`, async () => {
        await page.goto(`${base}/${locale}research.html`);
        assert.equal(await page.locator('.study-navigation').count(),0,'Research should open directly on current studies');
        assert.equal(await page.locator('[data-current-research]').count(),5,'Five current research records must exist');
        const current = page.locator('#main');
        const text = await current.textContent();
        for (const title of titles) assert.ok(text.includes(title),`Missing current manuscript: ${title}`);
        assert.doesNotMatch(text,/canard|카나드|moving.platform landing/i,'Old April topics must not replace current research');
        assert.equal(await current.locator('.current-stage:visible').count(),5,'Stage boundaries stay visible when details are closed');
        assert.match(text,/publication status have not been verified|게재 확정·출판 여부는 확인되지/);
        const details = current.locator('details').first();
        await details.locator('summary').focus();
        await page.keyboard.press('Enter');
        assert.ok(await details.evaluate(el=>el.open),'Keyboard opens native research details');
        assert.ok(await details.locator('[data-research-method]').isVisible());
        assert.ok(await details.locator('[data-research-next]').isVisible());
        assert.equal(await page.locator('[data-research-item]').count(),0,'History is absent from current research');
        await page.goto(`${base}/${locale}records.html#research-archive`);
        assert.equal(await page.locator('.study-navigation').count(),0,'Records does not need a second navigation strip');
        assert.equal(await page.locator('[data-filter-type]').count(),1,'Archive filters remain available');
        assert.equal(await page.locator('[data-research-item]:visible').count(),15,'Historical archive remains complete in Records');
        await page.locator('[data-filter-type]').selectOption('award');
        assert.equal(await page.locator('[data-research-item]:visible').count(),6,'Historical award filter still works');
        assert.equal(await page.locator('[data-current-research]').count(),0,'Records does not duplicate current studies');
        await page.locator('[data-filter-reset]').click();
        assert.equal(await page.locator('[data-research-item]:visible').count(),15);
        assert.equal(await current.locator('a[href*="sharepoint"],a[href*="onedrive"]').count(),0,'Private manuscript storage must not be linked');
        await page.goto(`${base}/${locale}gallery.html`);
        assert.equal(await page.locator('.album-navigation').count(),0,'Gallery does not need a jump-link strip');
        assert.equal(await page.locator('#award-dec-2025 [data-gallery-open]').count(),1,'The public award photograph belongs in Gallery');
        assert.equal(await page.locator('[data-gallery-open] .media-play').count(),0,'Photo links are not video controls');
      });
      await check(`${locale || 'en/'} first study reaches the initial research viewport`, async () => {
        await page.setViewportSize({width:1000,height:792});
        await page.goto(`${base}/${locale}research.html`);
        await page.evaluate(()=>document.fonts.ready);
        const first = page.locator('[data-current-research]').first();
        assert.ok((await first.locator('figure').boundingBox()).y<792,'A substantial research visual begins in the first viewport');
        assert.ok(await first.locator('.current-stage').isVisible(),'Stage is visible without expanding details');
      });
      await check(`${locale || 'en/'} essential Avionics and pinned combustion data are delivered`, async () => {
        await page.goto(`${base}/${locale}pslv.html#avionics`);
        const avionics = page.locator('#main');
        const text = await avionics.textContent();
        assert.match(text,/Portenta H7/);assert.match(text,/GNSS/);
        assert.equal(await avionics.locator('.avionics-essentials>div').count(),3);
        assert.equal(await avionics.locator('#avionics a').getAttribute('href'),'https://github.com/postech-psi/Avionics');
        await page.goto(`${base}/${locale}pslv.html#tms`);
        const resultsLock=await page.request.get(`${base}/assets/results/source-lock.json`).then(response=>response.json());
        assert.equal(resultsLock.revision,'11df0dc525da7113dd504e363662f59498e2a587','Original results implementation and datasets remain pinned');
        assert.equal(await page.locator('.selection-list').count(),0,'Stale April team-selection section is replaced');
      });
      await page.goto(`${base}/${locale}research.html`);
      for (const width of [320,390,768,1440]) {
        await page.setViewportSize({width,height:1000});
        for (const theme of ['light','dark']) {
          await setTheme(page,theme);
          await check(`${locale || 'en/'} ${theme} research fits ${width}px`, async () => {
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
          });
        }
      }
    } finally { await context.close(); }
    const fallback = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    try {
      const plain = await fallback.newPage();
      await check(`${locale || 'en/'} research method and next step are available without JavaScript`, async () => {
        await plain.goto(`${base}/${locale}research.html`);
        assert.equal(await plain.locator('[data-current-research]').count(),5);
        const details = plain.locator('[data-current-research] details').last();
        await details.locator('summary').focus();
        await plain.keyboard.press('Enter');
        assert.ok(await details.locator('[data-research-method]').isVisible());
        assert.ok(await details.locator('[data-research-next]').isVisible());
      });
    } finally { await fallback.close(); }
  }
  for (const file of ['index.html','projects.html','research.html','ko/index.html','ko/projects.html','ko/research.html']) {
    const html=fs.readFileSync(path.join(__dirname,file),'utf8');
    assert.doesNotMatch(html,/postechackr\.sharepoint|sourcedoc=|1DACC425|F9C0CDC2|AFECC867/,'No private manuscript identifiers in generated pages');
  }
  assert.deepEqual(failures,[],'Current content checks');
}
if(require.main===module)(async()=>{
  const browser=await chromium.launch({channel:process.env.PSI_BROWSER_CHANNEL||undefined,headless:true});
  try{await checkCurrentContent(browser);}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
module.exports={checkCurrentContent};
