const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createHash}=require('node:crypto');
const {chromium} = require('playwright');
const {setTheme} = require('./test-helpers.cjs');
const base = process.env.PSI_URL || 'http://127.0.0.1:8767';
async function checkSupporters(browser) {
  const originalHashes={
    'postech':'f449fa29b4a481dc531230f29739741fcc304cc4b2550cca7320d1bd298b9d06',
    'postech-me':'33501122416aa118b7f67e468b4a3e9bdef73d88947006b5ba79ad8d96777e73',
    'matlab':'58f2545e61e209cf0f6e0facd5430c0f44f4814a4a1b021f5815da5a0a955b6d',
    'kai-light':'24bd36e416083f96ae2bf858ddb29057d5aee6934ad282845e4e241c3a35e27d',
    'kai-dark':'bf62326069b7a6a5df9bb264c0a8eebc26196f825bc23e60e5bac2056f56a6de',
    'mathworks-light':'48d1d3eda53a7d4ad7d2d5e898f04303c26eee704395489aa4316961f88b9cb1',
    'mathworks-dark':'33681415ecab3619112c8f4dd11bfb5d32f452e45e5fa1378c4c22655841f51f',
    'ansys':'eef30b4dd3d70a7a142f4fb344ec6cd437fbe4f465b8dfb6d2f2b62ea3014d7e',
    'ansys-light':'0f8116cd04765d1dccab7f69ac3d70bfa67712cdf1c4ad322ed8a169d2ae3752'
  };
  for(const [name,hash] of Object.entries(originalHashes))assert.equal(createHash('sha256').update(fs.readFileSync(path.join(__dirname,`assets/supporter-${name}.png`))).digest('hex'),hash,'Official artwork remains unaltered: '+name);
  const expected = [
    ['POSTECH','https://www.postech.ac.kr/eng/'],
    ['POSTECH Mechanical Engineering','https://me.postech.ac.kr/ko/'],
    ['KAI (Korea Aerospace Industries)','https://www.koreaaero.com/'],
    ['MATLAB (MathWorks)','https://www.mathworks.com/products/matlab.html'],
    ['Ansys, part of Synopsys','https://ansys.synopsys.com/']
  ];
  let passes=0;
  for(const locale of ['', 'ko/']) {
    const context=await browser.newContext({reducedMotion:'reduce'});
    const page=await context.newPage();
    await page.goto(`${base}/${locale}about.html`);
    assert.equal(await page.locator('.supporter-list').count(),1,'Merged About has one supporter list');
    assert.match(await page.locator('.organisation-table').innerText(),locale ? /재정[\s\S]*예산[\s\S]*지출/ : /Finance[\s\S]*budget[\s\S]*expenses/);
    await page.goto(`${base}/${locale}support.html`);
    const links=page.locator('.supporter-list a');
    assert.equal(await links.count(),5,'Five confirmed supporters are present');
    for(let i=0;i<expected.length;i++) {
      assert.equal(await links.nth(i).getAttribute('href'),expected[i][1]);
      assert.equal(await links.nth(i).getAttribute('aria-label'),expected[i][0]);
      const img=links.nth(i).locator('img:visible');
      assert.equal(await img.count(),1);
      assert.ok((await img.getAttribute('alt')).length>0);
      const src=await img.getAttribute('src');
      assert.ok(fs.existsSync(path.resolve(__dirname,locale,src)));
    }
    for(const width of [320,390,768,1200,1440]) for(const theme of ['light','dark']) {
      await page.setViewportSize({width,height:1000});
      await setTheme(page,theme);
      await page.locator('.supporter-list').scrollIntoViewIfNeeded();
      assert.equal(await page.locator('.supporter-list').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)','Supporter band follows the theme');
      await page.waitForFunction(()=>[...document.querySelectorAll('.supporter-list img')].filter(img=>getComputedStyle(img).display!=='none').every(img=>img.complete && img.naturalWidth>0));
      const layout=await links.evaluateAll(items=>items.map(el=>{const img=[...el.querySelectorAll('img')].find(img=>getComputedStyle(img).display!=='none'),box=img.getBoundingClientRect();return {matlab:el.getAttribute('aria-label').startsWith('MATLAB'),x:el.getBoundingClientRect().x,w:box.width,h:box.height,ratio:img.naturalWidth/img.naturalHeight,filter:getComputedStyle(img).filter};}));
      assert.equal(new Set(layout.map(item=>Math.round(item.x))).size,width>=1200 ? 5 : width>=600 ? 2 : 1);
      for(const item of layout) {
        assert.ok(item.w>=100 && item.h>=15,'Logos are legible');
        assert.ok(Math.abs(item.w/item.h-item.ratio)<.05,'Original proportions');
        assert.equal(item.filter,'none','Original logo colors remain unchanged in both themes');
      }
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
      if(width!==768) await page.locator('.support-section').screenshot({path:path.join(__dirname,`review/task4-${locale?'ko':'en'}-supporters-${theme}-${width}.png`)});
      console.log(`PASS: ${locale||'en/'} supporters ${theme} ${width}`); passes++;
    }
    await context.close();
  }
  console.log(`Supporters: ${passes} layout checks passed; links, assets, names and finance verified in both languages.`);
}
if(require.main===module)(async()=>{const browser=await chromium.launch({channel:process.env.PSI_BROWSER_CHANNEL||undefined});try{await checkSupporters(browser);}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1});
module.exports={checkSupporters};
