import {readFileSync} from 'node:fs';
export const resultCatalog=JSON.parse(readFileSync(new URL('./assets/results/upstream/tests/index.json',import.meta.url),'utf8'));
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function testResultsView(lang,assetPrefix){
 const t=(en,ko)=>lang==='ko'?ko:en;
 const base=assetPrefix+'results/';
 const loc=v=>v?.[lang]||v?.en||v;
 return `<section data-test-results data-results-base="${base}" aria-label="${t('Combustion tests','연소 시험')}">
 <div data-results-fallback><h3>${t('Key results','주요 결과')}</h3><div style="overflow:auto"><table><thead><tr><th>${t('Date','날짜')}</th><th>${t('Peak thrust','최대 추력')}</th><th>${t('Total impulse','총 임펄스')}</th><th>${t('Burn duration','연소 시간')}</th><th>${t('Peak pressure','최대 압력')}</th></tr></thead><tbody>${resultCatalog.tests.map(test=>`<tr><th scope="row">${test.date}</th>${['maxThrustN','totalImpulseNs','burnTimeMs','maxPressureBar'].map(key=>`<td>${escape(test.metrics[key].display)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>
 <div data-results-status role="status" aria-live="polite"></div><button type="button" data-results-retry hidden>${t('Retry charts','그래프 다시 불러오기')}</button>
 <label style="display:block" for="results-trial">${t('Test','시험')}</label><select id="results-trial" data-results-select>${resultCatalog.tests.map(test=>`<option value="${test.id}">${test.date} · ${escape(loc(test.title))}</option>`).join('')}</select>
 <div data-results-detail></div></section>`;
}
