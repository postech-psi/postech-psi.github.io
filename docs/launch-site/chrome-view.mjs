export function headerView(lang,asset,navigation){
 const ko=lang==='ko',t=(en,kr)=>ko?kr:en;
 return `<header class="site-header"><div class="header-inner"><div class="brand"><a class="psi-link" href="index.html" aria-label="${t('PSI home','PSI 홈')}"><span class="psi-wordmark"><img class="psi-logo" src="${asset}psi-logo.png" width="1280" height="317" alt="PSI" decoding="async"></span><span class="header-emblem footer-emblem" aria-hidden="true"><img src="${asset}psi-emblem.png" width="384" height="406" alt="" decoding="async"></span></a></div><button class="menu-toggle" data-menu-toggle aria-controls="site-navigation" aria-expanded="false"><span data-menu-label>${t('Menu','메뉴')}</span><span class="menu-icon" aria-hidden="true"></span></button><nav id="site-navigation" class="site-nav" aria-label="${t('Main navigation','주 메뉴')}">${navigation.links}</nav><div class="header-preferences"><button class="theme-toggle" data-theme-toggle data-theme-control hidden type="button" aria-pressed="false" aria-label="${t('Dark mode','다크 모드')}"><svg data-theme-icon="light" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4L19 5"/></svg><svg data-theme-icon="dark" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 14.1A9 9 0 0 1 9.9 3.2a9 9 0 1 0 10.9 10.9Z"/></svg></button><a class="language-link" data-language-link href="${navigation.languageHref}" lang="${ko?'en':'ko'}" hreflang="${ko?'en':'ko'}" aria-label="${t('이 페이지를 한국어로 보기','Read this page in English')}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5h14M5 17.5h14"/></svg></a></div><a class="header-affiliation postech-link" href="https://postech.ac.kr" aria-label="${t('Visit POSTECH website','POSTECH 홈페이지 방문')}"><img class="postech-wordmark" src="${asset}supporter-postech.png" width="733" height="62" alt="POSTECH" decoding="async"></a></div></header>`;
}

export function footerView(lang,asset,navigation,sources){
 const t=(en,ko)=>lang==='ko'?ko:en;
 return `<footer class="site-footer">
 <div class="wrap footer-top">
  <div class="footer-brand">
   <div class="footer-identity">
    <a class="footer-postech-link" href="https://postech.ac.kr" aria-label="POSTECH"><img class="footer-postech-logo" src="${asset}supporter-postech.png" width="733" height="62" alt="POSTECH" loading="lazy" decoding="async"></a>
    <a class="footer-logo" href="index.html" aria-label="${t('PSI home','PSI 홈')}"><span class="footer-emblem" aria-hidden="true"><img src="${asset}psi-emblem.png" width="384" height="406" alt="" loading="lazy" decoding="async"></span><span class="psi-wordmark"><img class="psi-logo" src="${asset}psi-logo.png" width="1280" height="317" alt="PSI" loading="lazy" decoding="async"></span></a>
   </div>
   <a class="footer-privacy-link" href="https://www.postech.ac.kr/kor/usage-guide/privacy_policy.do">${t('Privacy policy','개인정보처리방침')}</a>
  </div>
  <div class="footer-links">
   <nav class="footer-navigation" aria-label="${t('Footer navigation','하단 메뉴')}">${navigation}</nav>
   <div class="footer-channels"><a href="mailto:${sources.presidentEmail}">${t('Email PSI','PSI 이메일')}</a><a href="${sources.instagram}">Instagram</a><a href="${sources.github}">GitHub</a></div>
  </div>
 </div>
 <div class="wrap footer-bottom"><span>© ${new Date().getFullYear()} POSTECH PSI</span><a href="#main">${t('Back to top','맨 위로')}</a></div>
 </footer>`;
}
