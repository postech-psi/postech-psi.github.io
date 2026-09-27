import {leadership} from './content.mjs';

export function leadershipView(lang){
 const t=(en,ko)=>lang==='ko'?ko:en;
 const groups=[
  [t('Faculty advisor','지도교수'),[4]],
  [t('President & vice president','회장단'),[0,1]],
  [t('Operations & engineering','운영·기술'),[2,3]]
 ];
 return `<section class="wrap section leadership" aria-labelledby="leadership-heading"><h2 id="leadership-heading">${t('Leadership and advisor','운영진과 지도교수')}</h2><div class="leadership-groups">${groups.map(([title,indices])=>`<section class="leadership-group"><h3>${title}</h3>${indices.map(index=>{const person=leadership[index];return `<div class="leader" lang="en"><p class="leader-name">${person.name}</p><p class="leader-role">${person.role}</p></div>`;}).join('')}</section>`).join('')}</div><details class="former-leaders"><summary>${t('Former presidents','역대 회장')}</summary><dl lang="en"><div><dt>2025</dt><dd>Un-Seong Baik</dd></div><div><dt>2024</dt><dd>Minsoo Kim</dd></div></dl></details></section>`;
}

export function channelsView(lang,sources){
 const t=(en,ko)=>lang==='ko'?ko:en;
 const channels=[
  [sources.instagram,'Instagram',t('Recruitment & activities','모집·활동 소식'),'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm9 9a4 4 0 1 1-8 0 4 4 0 0 1 8 0M17 7h.01'],
  [sources.github,'GitHub',t('Code & research repositories','코드·연구 저장소'),'m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18'],
  [sources.legacy,t('PSI archive','PSI 아카이브'),t('Background & earlier activity','연구회 소개·이전 활동'),'M3 4h8l1 2h9v14H3V4Zm4 7h10M7 15h6']
 ];
 return `<section class="wrap section contact-section" aria-labelledby="channels-heading"><h2 id="channels-heading">${t('Official channels','공식 채널')}</h2><div class="channel-grid">${channels.map(([href,title,description,path])=>`<a class="channel-action" href="${href}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg><div><h3>${title}</h3><p>${description}</p></div></a>`).join('')}</div></section>`;
}
