import {testResultsView} from './test-results-view.mjs';
import {telemetryView} from './telemetry-view.mjs';

// Short inline sections for the continuous PSLV project story.
export function engineeringSection(section,lang,asset){
 const t=(en,ko)=>lang==='ko'?ko:en;
 const repository=(name,label)=>`<a class="text-link" href="https://github.com/postech-psi/${name}">${label}</a>`;
 if(section==='avionics')return `<div class="avionics-summary" id="avionics">
  <h3>${t('Avionics','비행 전자장치')}</h3>
  <p>${t('The flight computer brings sensor measurements, motion estimates and recovery decisions together. Onboard logs and a radio link let the team follow the flight and review it afterwards.','비행 컴퓨터는 센서 측정과 운동 추정, 회수 장치 구동 판단을 맡습니다. 기체 내부 기록과 무선 통신으로 비행을 살펴보고, 비행이 끝난 뒤에도 데이터를 검토합니다.')}</p>
  <dl class="avionics-essentials">
   <div id="architecture"><dt>${t('Flight computer','비행 컴퓨터')}</dt><dd>${t('The dual-core Portenta H7 separates flight computation from storage and radio. The M7 reads sensors, estimates motion and evaluates flight state and recovery commands. The M4 writes microSD logs and sends telemetry through XBee.','듀얼 코어 Portenta H7에서 비행 연산과 저장·무선 전송을 나눕니다. M7은 센서를 읽고 운동을 추정하며 비행 상태와 회수 장치 구동을 판단합니다. M4는 microSD 기록과 XBee 원격 측정을 담당합니다.')}</dd></div>
   <div id="estimation"><dt>${t('Sensing and estimation','센서와 상태 추정')}</dt><dd>${t('An IMU measures attitude and acceleration; a BMP390 measures pressure. A vertical unscented Kalman filter (UKF) combines acceleration and barometric altitude to estimate motion. GNSS position is logged separately and does not feed this vertical filter.','IMU로 자세와 가속도를, BMP390으로 기압을 측정합니다. 수직 무향 칼만 필터(UKF)는 가속도와 기압 고도로 운동을 추정합니다. GNSS 위치는 별도로 기록하며 이 수직 필터의 입력으로 사용하지 않습니다.')}</dd></div>
   <div id="recording"><dt id="ground-station">${t('Ground station and logs','지상국과 비행 기록')}</dt><dd>${t('Received telemetry drives the attitude view, flight-state display and altitude plots. Saved logs can be replayed for review. The ground record contains only received samples, so radio gaps can leave it different from the log stored onboard.','수신한 데이터로 자세, 비행 상태와 고도 그래프를 표시하고 저장된 로그를 재생해 검토합니다. 지상 기록에는 실제 수신한 샘플만 남으므로, 무선 수신이 끊긴 구간은 기체 내부 기록과 다를 수 있습니다.')}</dd></div>
  </dl>
  ${repository('Avionics',t('Avionics on GitHub','GitHub에서 Avionics 보기'))}
 </div>`;
 if(section==='reconstruction')return `<div class="wrap pslv-reconstruction" id="flight-reconstruction">${telemetryView(lang,asset)}</div>`;
 if(section==='tms')return `<section class="wrap pslv-tests" id="tms">
  <header class="pslv-section-heading"><div><h2>${t('Combustion tests','연소 시험')}</h2><p>${t('Measured thrust, pressure and test conditions for each trial.','시험별 추력과 압력 측정값, 시험 조건을 살펴보세요.')}</p></div>${repository('TMS',t('TMS on GitHub','GitHub에서 TMS 보기'))}</header>
  <div class="results-anchor" id="test-results"><span id="instrument" class="anchor-alias" aria-hidden="true"></span><span id="processing" class="anchor-alias" aria-hidden="true"></span><span id="analysis" class="anchor-alias" aria-hidden="true"></span>${testResultsView(lang,asset)}</div>
 </section>`;
 throw new Error(`Unknown engineering section: ${section}`);
}
