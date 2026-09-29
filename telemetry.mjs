export const point = sample => ({x:60 + sample.elapsedSeconds / 29.38 * 900, y:310 - sample.altitudeMeters / 200 * 260});
export function traceSegments(samples,gaps) {
  const segments=[[]];
  samples.forEach((sample,index)=>{
    const previous=samples[index-1];
    if(previous && gaps.some(gap=>previous.elapsedSeconds <= gap.beforeElapsedSeconds && sample.elapsedSeconds >= gap.afterElapsedSeconds)) segments.push([]);
    const {x,y}=point(sample);segments.at(-1).push(`${segments.at(-1).length?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`);
  });
  return segments.map(segment=>segment.join(' '));
}
function validData(data) {
  return Array.isArray(data.samples) && data.samples.length>1 && data.samples.every((s,i)=>
    Number.isFinite(s.elapsedSeconds) && Number.isFinite(s.altitudeMeters) && Number.isFinite(s.verticalVelocityMetersPerSecond)
    && ['PRELAUNCH','LAUNCH','DEPLOY'].includes(s.state) && (!i || s.elapsedSeconds>data.samples[i-1].elapsedSeconds));
}
export async function initTelemetry(root) {
  const ko=document.documentElement.lang==='ko';const t=(en,kr)=>ko?kr:en;
  const controls=root.querySelector('[data-replay-controls]');
  const toggle=root.querySelector('[data-replay-toggle]');
  const reset=root.querySelector('[data-replay-reset]');
  const seek=root.querySelector('[data-replay-seek]');
  const status=root.querySelector('[data-replay-status]');
  const cursor=root.querySelector('[data-replay-cursor]');
  let samples,index=0,frame=0,playing=false,origin=0;
  const draw=()=>{
    const sample=samples[index];seek.value=String(index);
    root.querySelector('[data-replay-time]').textContent=sample.elapsedSeconds.toFixed(2);
    root.querySelector('[data-replay-altitude]').textContent=sample.altitudeMeters.toFixed(3);
    root.querySelector('[data-replay-velocity]').textContent=sample.verticalVelocityMetersPerSecond.toFixed(3);
    root.querySelector('[data-replay-state]').textContent=sample.state;
    seek.setAttribute('aria-valuetext',t(`${sample.elapsedSeconds.toFixed(2)} seconds, altitude ${sample.altitudeMeters.toFixed(3)} metres, vertical velocity ${sample.verticalVelocityMetersPerSecond.toFixed(3)} metres per second, ${sample.state}`,`${sample.elapsedSeconds.toFixed(2)}초, 고도 ${sample.altitudeMeters.toFixed(3)}미터, 수직 속도 ${sample.verticalVelocityMetersPerSecond.toFixed(3)}미터 매초, ${sample.state}`));
    const {x,y}=point(sample);
    cursor.querySelector('line').setAttribute('x1',x);cursor.querySelector('line').setAttribute('x2',x);
    cursor.querySelector('circle').setAttribute('cx',x);cursor.querySelector('circle').setAttribute('cy',y);
  };
  const pause=(message=t('Paused','일시 정지'))=>{
    playing=false;cancelAnimationFrame(frame);root.dataset.replaying='false';
    toggle.textContent=index===samples.length-1?t('Replay excerpt','기록 다시 보기'):t('Play excerpt','기록 재생');
    status.textContent=message;
  };
  const tick=now=>{
    if(!playing)return;
    const elapsed=(now-origin)/1000;
    while(index<samples.length-1 && samples[index+1].elapsedSeconds<=elapsed)index++;
    draw();
    if(index===samples.length-1){pause(t('End of the recorded excerpt: DEPLOY. Landing is not recorded.','기록 끝: DEPLOY. 착륙은 기록되어 있지 않습니다.'));return;}
    frame=requestAnimationFrame(tick);
  };
  try {
    const response=await fetch(root.dataset.source);if(!response.ok)throw new Error('Unavailable');
    const data=await response.json();if(!validData(data))throw new Error('Invalid excerpt');
    samples=data.samples;seek.max=String(samples.length-1);
    draw();controls.hidden=false;controls.querySelectorAll('button,input').forEach(el=>{el.disabled=false;});
    cursor.removeAttribute('hidden');root.dataset.replaying='false';
    status.textContent=t('Ready. Playback follows the received sample times.','준비 완료. 수신된 샘플의 시간에 따라 재생합니다.');
    toggle.addEventListener('click',()=>{
      if(playing){pause();return;}
      if(index===samples.length-1)index=0;
      playing=true;root.dataset.replaying='true';toggle.textContent=t('Pause excerpt','기록 일시 정지');
      status.textContent=t('Playing the recorded public log excerpt','공개 로그 발췌 기록 재생 중');
      origin=performance.now()-samples[index].elapsedSeconds*1000;frame=requestAnimationFrame(tick);
    });
    seek.addEventListener('input',()=>{index=Math.min(samples.length-1,Math.max(0,Number(seek.value)));pause();draw();});
    reset.addEventListener('click',()=>{index=0;pause(t('Reset to the first received sample','첫 수신 샘플로 돌아왔습니다'));draw();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden && playing)pause(t('Paused while the page was hidden','페이지가 보이지 않아 일시 정지했습니다'));});
    window.addEventListener('psi:projectchange',()=>{if(root.closest('[hidden]')&&playing)pause();});
  } catch {
    status.textContent=t('Interactive playback is unavailable. The recorded plot and summary remain below.','대화형 재생을 불러올 수 없습니다. 아래 기록 그래프와 요약을 확인하세요.');
  }
}
if(typeof document!=='undefined')document.querySelectorAll('[data-telemetry]').forEach(initTelemetry);
