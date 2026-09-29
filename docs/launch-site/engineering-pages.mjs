import {testResultsView} from './test-results-view.mjs';

// Short inline sections for the continuous PSLV project story.
export function engineeringSection(section,lang,asset){
 const t=(en,ko)=>lang==='ko'?ko:en;
 const repository=(name,label)=>`<a class="text-link" href="https://github.com/postech-psi/${name}">${label}</a>`;
 if(section==='avionics')return `<div class="avionics-summary" id="avionics">
  <h3>${t('Avionics','비행 전자장치')}</h3>
  <p>${t('Sensing, flight-state estimation and communication with the ground.','센서 측정과 비행 상태 추정, 지상과의 통신을 담당합니다.')}</p>
  <dl class="avionics-essentials">
   <div id="architecture"><dt>${t('Flight computer','비행 컴퓨터')}</dt><dd>${t('Portenta H7 separates flight computation from data storage and radio transmission.','Portenta H7에서 비행 연산과 데이터 저장·무선 전송을 나누어 처리합니다.')}</dd></div>
   <div id="estimation"><dt>${t('Sensing','센서와 추정')}</dt><dd>${t('Inertial and pressure measurements estimate vertical motion. GNSS records position separately.','관성·기압 측정으로 수직 운동을 추정하고, GNSS 위치는 별도로 기록합니다.')}</dd></div>
   <div id="recording"><dt id="ground-station">${t('Telemetry','원격 측정')}</dt><dd>${t('Onboard logs and radio telemetry let the ground station display and review flight data.','기체 내부 기록과 무선 원격 측정으로 지상국에서 비행 데이터를 확인하고 검토합니다.')}</dd></div>
  </dl>
  ${repository('Avionics',t('Avionics on GitHub','GitHub에서 Avionics 보기'))}
 </div>`;
 if(section==='tms')return `<section class="wrap pslv-tests" id="tms">
  <header class="pslv-section-heading"><div><h2>${t('Combustion tests','연소 시험')}</h2><p>${t('Measured thrust, pressure and test conditions for each trial.','시험별 추력과 압력 측정값, 시험 조건을 살펴보세요.')}</p></div>${repository('TMS',t('TMS on GitHub','GitHub에서 TMS 보기'))}</header>
  <div class="results-anchor" id="test-results"><span id="instrument" class="anchor-alias" aria-hidden="true"></span><span id="processing" class="anchor-alias" aria-hidden="true"></span><span id="analysis" class="anchor-alias" aria-hidden="true"></span>${testResultsView(lang,asset)}</div>
 </section>`;
 throw new Error(`Unknown engineering section: ${section}`);
}
