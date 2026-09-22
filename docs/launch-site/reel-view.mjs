import {events} from './gallery-data.mjs';
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export function reelView(lang,asset){
 const t=(en,ko)=>lang==='ko'?ko:en;
 const launch=events.find(event=>event.id==='launch-dec-2025');
 const workshop=events.find(event=>event.id==='test-may-2025');
 const choices=[[launch,2],[launch,3],[launch,4],[workshop,0]];
 return `<div class="photo-reel" data-photo-reel role="region" aria-roledescription="${t('carousel','캐러셀')}" aria-label="${t('PSI hardware and field photographs','PSI 하드웨어와 현장 사진')}">
 <div class="reel-slides">${choices.map(([event,index],i)=>{const p=event.photos[index];return `<figure data-reel-slide="${i}"${i?' hidden':''} role="group" aria-roledescription="${t('slide','슬라이드')}" aria-label="${i+1} / ${choices.length}"><a class="reel-image" data-photo-motion href="news.html#${event.id}"><img src="${asset}${p.src}" width="${p.width}" height="${p.height}" alt="${escape(p.alt[lang])}" loading="lazy" decoding="async"></a><figcaption><time datetime="${event.date}">${event.dateLabel[lang]}</time><a href="news.html#${event.id}">${p.caption[lang]}</a></figcaption></figure>`;}).join('')}</div>
 <div class="reel-controls" data-reel-controls hidden><button data-reel-prev aria-label="${t('Previous photograph','이전 사진')}" type="button">‹</button><div class="reel-dots">${choices.map((_,i)=>`<button data-reel-dot="${i}" type="button" aria-label="${t('Show photograph','사진 보기')} ${i+1}" aria-current="${i===0}"><span></span></button>`).join('')}</div><button data-reel-next aria-label="${t('Next photograph','다음 사진')}" type="button">›</button><button data-reel-toggle type="button" aria-label="${t('Pause photo reel','사진 자동 전환 정지')}"><span data-reel-pause aria-hidden="true">Ⅱ</span><span data-reel-play aria-hidden="true" hidden>▷</span></button></div><span class="sr-only" data-reel-status aria-live="off"></span></div>`;
}
