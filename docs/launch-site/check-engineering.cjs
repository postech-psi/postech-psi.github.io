// The continuous page check covers essential engineering, data links and all legacy anchors.
const {chromium}=require('playwright');
const {checkPslvClean}=require('./check-pslv-clean.cjs');
const {checkReconstruction}=require('./check-reconstruction.cjs');
async function checkEngineering(browser){await checkPslvClean(browser);await checkReconstruction(browser);}
module.exports={checkEngineering};
if(require.main===module)(async()=>{const browser=await chromium.launch();try{await checkEngineering(browser);}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
