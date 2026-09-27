(() => {
  if(document.querySelector('#electric-tvc .cad-figure'))import(new URL('tvc-viewer.mjs',document.currentScript.src)).catch(()=>{});
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Map();
  function animate(element, frames, options = {}) {
    running.get(element)?.cancel();
    if (reduced.matches) return null;
    const animation = element.animate(frames, {duration:260, easing:'cubic-bezier(.22,1,.36,1)', ...options});
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
})();
