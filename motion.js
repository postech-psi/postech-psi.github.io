(() => {
  if(document.querySelector('#electric-tvc .cad-figure'))import(new URL('tvc-viewer.mjs',document.currentScript.src)).catch(()=>{});
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Map();
  function animate(element, frames, options = {}) {
    running.get(element)?.cancel();
    if (reduced.matches) return null;
    const animation = element.animate(frames, {duration:480, easing:'cubic-bezier(.22,1,.36,1)', ...options});
    running.set(element, animation);
    animation.finished.catch(() => {}).finally(() => {if(running.get(element)===animation)running.delete(element);});
    return animation;
  }
  window.psiMotion = animate;
  const header=document.querySelector('.site-header');
  const updateHeader=()=>{if(header)header.dataset.scrolled=String(scrollY>48);};
  let scrollFrame=0;
  addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;updateHeader();});},{passive:true});
  addEventListener('pageshow',updateHeader);
  updateHeader();
  // Real photographs only: no synthesized faces or expressions.
  const peopleFiles=new Set(['team.webp','founder.webp','award.webp','field-team.webp','launch-day-team.webp','rocket-team-indoor.webp','nura-team-2025.webp','nura-conference-2025.webp','test-team-2025.webp']);
  const portraits=[];
  document.querySelectorAll('main figure img').forEach(img=>{
    const file=img.getAttribute('src').split('/').pop().replace('-thumb.webp','.webp');
    if(!peopleFiles.has(file)||img.closest('[data-photo-reel],dialog'))return;
    const media=img.closest('a')||img;
    const frame=document.createElement('div');frame.className='living-photo';frame.dataset.livingPhoto='';
    if(media.hasAttribute('data-photo-motion')){media.removeAttribute('data-photo-motion');frame.dataset.photoMotion='';}
    media.before(frame);frame.append(media);
    const button=document.createElement('button');button.type='button';button.className='photo-motion-toggle';
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path data-photo-pause d="M8 5v14M16 5v14"/><path data-photo-play d="m8 5 11 7-11 7Z"/></svg>';
    frame.append(button);
    const state={frame,img,button,visible:false,paused:false};portraits.push(state);
    button.addEventListener('click',()=>{state.paused=!state.paused;syncPortrait(state);});
  });
  function syncPortrait(state){
    const allowed=!reduced.matches&&!navigator.connection?.saveData;
    const playing=allowed&&state.visible&&!state.paused&&!document.hidden&&!document.body.classList.contains('menu-open')&&!document.body.classList.contains('dialog-open');
    state.frame.dataset.playing=String(playing);
    state.button.hidden=!allowed;
    state.button.setAttribute('aria-pressed',String(state.paused));
    state.button.setAttribute('aria-label',document.documentElement.lang==='ko'?(state.paused?'사진 움직임 재생':'사진 움직임 정지'):(state.paused?'Play photograph motion':'Pause photograph motion'));
    state.button.querySelector('[data-photo-pause]').style.display=playing?'':'none';
    state.button.querySelector('[data-photo-play]').style.display=playing?'none':'';
  }
  const syncPortraits=()=>portraits.forEach(syncPortrait);
  const portraitObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{const state=portraits.find(item=>item.frame===entry.target);state.visible=entry.isIntersecting&&entry.intersectionRatio>=.2;syncPortrait(state);});
  },{threshold:[0,.2]});
  portraits.forEach(state=>portraitObserver.observe(state.frame));
  reduced.addEventListener('change',syncPortraits);document.addEventListener('visibilitychange',syncPortraits);
  if(portraits.length)new MutationObserver(syncPortraits).observe(document.body,{attributes:true,attributeFilter:['class']});
  syncPortraits();
  // One entrance per image or heading; content remains present without scripting.
  const pictures=document.querySelectorAll('[data-photo-motion]');
  const reveal=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      reveal.unobserve(entry.target);
      animate(entry.target,[{clipPath:'inset(12% 6% 12% 6%)',transform:'translateY(55px) scale(.96)',opacity:.3},{clipPath:'inset(0)',transform:'none',opacity:1}],{duration:1100});
    }
  },{threshold:.12});
  pictures.forEach(element=>{if(!element.closest('.living-photo')||element.classList.contains('living-photo'))reveal.observe(element);});
  // Start before the viewport edge, without moving already-readable text.
  const titles=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){titles.unobserve(entry.target);animate(entry.target,[{opacity:.15},{opacity:1}],{duration:650});}}},{rootMargin:'0px 0px 120px 0px',threshold:0});
  document.querySelectorAll('main h2').forEach(title=>{if(title.getBoundingClientRect().top>=innerHeight)titles.observe(title);});
  const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
  pictures.forEach(element=>{
    if(element.closest('.living-photo')&&!element.classList.contains('living-photo'))return;
    element.classList.add('motion-surface');
    element.addEventListener('pointermove',event=>{
      if(reduced.matches||!finePointer.matches)return;
      const box=element.getBoundingClientRect();
      element.style.setProperty('--tilt-x',`${(event.clientY-box.top)/box.height*-5+2.5}deg`);
      element.style.setProperty('--tilt-y',`${(event.clientX-box.left)/box.width*5-2.5}deg`);
    });
    const reset=()=>{element.style.removeProperty('--tilt-x');element.style.removeProperty('--tilt-y');};
    element.addEventListener('pointerleave',reset);reduced.addEventListener('change',reset);
  });
  reduced.addEventListener('change', () => {if(reduced.matches){for(const animation of running.values())animation.finish();running.clear();}});
  const systems = [...document.querySelectorAll('[data-system]')];
  const desired = new Map(systems.map(el=>[el,el.open]));
  function settle(el, open) {
    el.open=open; el.style.height=''; el.style.overflow='';
    el.querySelector('.system-content').inert=!open;
    dispatchEvent(new Event('resize'));
  }
  function disclose(el, open, immediate=false) {
    desired.set(el,open);
    const start=el.getBoundingClientRect().height;
    running.get(el)?.cancel();
    el.open=true;el.style.height='';
    const end=open?el.getBoundingClientRect().height:el.querySelector('summary').getBoundingClientRect().height;
    el.querySelector('.system-content').inert=!open;
    if(immediate||reduced.matches){settle(el,open);return;}
    el.style.overflow='clip';
    const animation=animate(el,[{height:start+'px'},{height:end+'px'}]);
    animation.onfinish=()=>{if(desired.get(el)===open)settle(el,open);};
  }
  systems.forEach(el=>el.querySelector('summary').addEventListener('click',event=>{
    event.preventDefault();const open=!desired.get(el);
    if(open)systems.filter(other=>other!==el&&desired.get(other)).forEach(other=>disclose(other,false));
    disclose(el,open);
  }));
  const revealHash=()=>{
    let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{return;}
    const owner=target?.closest('[data-system]');
    if(!owner)return;
    systems.filter(el=>el!==owner).forEach(el=>disclose(el,false,true));
    disclose(owner,true,true);
    requestAnimationFrame(()=>target.scrollIntoView({behavior:'instant',block:'start'}));
  };
  revealHash();addEventListener('hashchange',revealHash);addEventListener('pageshow',revealHash);
})();
