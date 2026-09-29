// The continuous page check covers essential engineering, data links and all legacy anchors.
const {chromium}=require('playwright');
const {checkPslvClean:checkEngineering}=require('./check-pslv-clean.cjs');
module.exports={checkEngineering};
if(require.main===module)(async()=>{const browser=await chromium.launch();try{await checkEngineering(browser);}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
