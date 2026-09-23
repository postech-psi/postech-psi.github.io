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
  // Editorial photographs have pointer-driven hover only. No autoplay or
  // playback buttons: a still image must never look like a video.
  const pictures=document.querySelectorAll('main [data-photo-motion]');
  // Start before the viewport edge, without moving already-readable text.
  const titles=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){titles.unobserve(entry.target);animate(entry.target,[{opacity:.15},{opacity:1}],{duration:650});}}},{rootMargin:'0px 0px 120px 0px',threshold:0});
  document.querySelectorAll('main h2').forEach(title=>{if(title.getBoundingClientRect().top>=innerHeight)titles.observe(title);});
  const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
  pictures.forEach(element=>{
    element.classList.add('motion-surface');
    const reset=()=>{delete element.dataset.photoHover;element.style.removeProperty('--tilt-x');element.style.removeProperty('--tilt-y');};
    element.addEventListener('pointermove',event=>{
      if(event.pointerType==='touch'||reduced.matches||!finePointer.matches){reset();return;}
      const box=element.getBoundingClientRect();
      element.dataset.photoHover='true';
      element.style.setProperty('--tilt-x',`${(event.clientY-box.top)/box.height*-5+2.5}deg`);
      element.style.setProperty('--tilt-y',`${(event.clientX-box.left)/box.width*5-2.5}deg`);
    });
    element.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')reset();});
    element.addEventListener('pointerleave',reset);element.addEventListener('pointercancel',reset);reduced.addEventListener('change',reset);finePointer.addEventListener('change',reset);
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
