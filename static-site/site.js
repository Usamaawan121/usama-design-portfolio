/* Usama portfolio — navigation, accessibility, filters and understated animation.
   Source is intentionally framework-independent for static preview / Next.js parity. */
(function () {
  'use strict';
  const projects = window.PORTFOLIO_PROJECTS || [];
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const views = { home: $('#view-home'), work: $('#view-work'), about: $('#view-about'), contact: $('#view-contact'), detail: $('#view-detail') };
  const navigation = $('#mobile-nav');
  const menuToggle = $('#menu-toggle');
  const header = $('#header');
  let observer;
  const htmlEscape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function closeMenu() {
    navigation?.classList.remove('is-open');
    menuToggle?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  }
  menuToggle?.addEventListener('click', () => {
    const isOpen = !navigation.classList.contains('is-open');
    navigation.classList.toggle('is-open', isOpen);
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  function renderCaseStudy(project) {
    const idx = projects.findIndex((p) => p.slug === project.slug);
    const next = projects[(idx + 1) % projects.length];
    const prev = projects[(idx - 1 + projects.length) % projects.length];
    const title = htmlEscape(project.title);
    return `<section class="detail-hero">
      <div class="detail-nav"><a href="/work" data-route>← All work</a><span>CASE STUDY / ${htmlEscape(project.number)} OF 20</span><a href="/work/${next.slug}" data-route>Next project ↗</a></div>
      <p class="detail-eyebrow"><span class="mini-diamond"></span> ${htmlEscape(project.category)}</p>
      <h1 class="detail-title">${title}<span style="color:var(--mint)">.</span></h1>
      <h2 class="detail-subtitle">${htmlEscape(project.kicker)}</h2><div class="case-quick-links"><span>${htmlEscape(project.category).toUpperCase()}</span><span>DESIGN / DETAIL / DIRECTION</span><a href="#case-gallery" data-jump>JUMP TO VISUALS ↓</a></div>
    </section>
    <div class="detail-cover zoom-frame"><span class="zoom-badge">CLICK TO ENLARGE ↗</span><img src="${project.cover}" alt="${title} project photograph" data-zoomable width="1200" height="850"></div>
    <section class="detail-info"><div class="detail-index"><span class="mini-diamond"></span> / THE THINKING BEHIND THE WORK</div>
      <div class="detail-body"><h2>Built around <em style="color:var(--mint);font-style:normal">a clear idea.</em></h2><p>${htmlEscape(project.description)}</p>
      <dl class="detail-meta"><div><dt>DISCIPLINE</dt><dd>${htmlEscape(project.category)}</dd></div><div><dt>FOCUS</dt><dd>${htmlEscape(project.scope)}</dd></div><div><dt>TOOLS</dt><dd>${htmlEscape(project.tools)}</dd></div></dl></div>
    </section>
    <div class="case-gallery-heading" id="case-gallery"><span>02 / VISUAL EXPLORATION</span><h2>Closer to <em>the details.</em></h2><span>CLICK AN IMAGE TO ZOOM</span></div><section class="detail-gallery"><img src="${project.study}" alt="${title} gallery image" data-zoomable loading="lazy" width="1200" height="850"><img src="${project.cover}" alt="${title} project gallery image" data-zoomable loading="lazy" width="1200" height="850"></section>
    <div class="detail-bottom"><p>UP NEXT / ${htmlEscape(next.category).toUpperCase()}</p><a href="/work/${next.slug}" data-route>${htmlEscape(next.title)} <span>↗</span></a><p><a href="/work/${prev.slug}" data-route style="font:12px var(--sans);letter-spacing:.1em;color:var(--muted)">← PREVIOUS PROJECT</a></p></div>`;
  }

  function routeKey(pathname) {
    if (pathname.startsWith('/work/')) return 'detail';
    if (pathname === '/work' || pathname === '/work/') return 'work';
    if (pathname === '/about' || pathname === '/about/') return 'about';
    if (pathname === '/contact' || pathname === '/contact/') return 'contact';
    return 'home';
  }
  function updateTitle(key, project) {
    const title = project ? `${project.title} — Design Study | Muhammad Usama` : ({ home: 'Muhammad Usama — Graphic Designer & UI/UX Designer', work: 'Selected Work — Muhammad Usama', about: 'About — Muhammad Usama', contact: 'Contact — Muhammad Usama' }[key]);
    document.title = title;
  }
  function resetReveal() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px 30px 0px' });
    $$('.page-view:not([hidden]) .reveal').forEach((node) => {
      node.classList.remove('in-view');
      if (reducedMotion) node.classList.add('in-view'); else observer.observe(node);
    });
    document.documentElement.classList.add('js-ready');
  }
  function showRoute(scroll = true) {
    let key = routeKey(location.pathname);
    let project;
    if (key === 'detail') {
      project = projects.find((p) => '/work/' + p.slug === location.pathname.replace(/\/$/, ''));
      if (project) $('#detail-content').innerHTML = renderCaseStudy(project);
      else key = 'work';
    }
    Object.entries(views).forEach(([name, view]) => { if (view) view.hidden = name !== key; });
    $$('.desktop-nav a').forEach((a) => a.classList.toggle('active', a.dataset.nav === (key === 'detail' ? 'work' : key)));
    updateTitle(key, project);
    closeMenu();
    if (scroll) window.scrollTo({ top: 0, behavior: 'instant' });
    resetReveal();
    // Next.js renders a universal shell; expose page title and content to assistive technologies after navigation.
    const main = $('#main-content');
    if (main) main.setAttribute('data-current-view', key);
  }
  document.addEventListener('click', (event) => {
    const anchor = event.target.closest?.('a[data-route]');
    if (anchor) {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const url = new URL(anchor.href, location.href);
      if (url.pathname !== location.pathname) history.pushState({}, '', url.pathname);
      showRoute();
      return;
    }
    const jump=event.target.closest?.('[data-jump]');
    if(jump){ event.preventDefault(); document.querySelector(jump.getAttribute('href'))?.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'});return;}
    if (event.target.closest?.('#back-to-top')) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
    }
  });
  window.addEventListener('popstate', () => showRoute(false));
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });

  const filters = $('#filter-chips');
  filters?.addEventListener('click', (event) => {
    const chip = event.target.closest?.('[data-filter]'); if (!chip) return;
    const current = chip.dataset.filter;
    $$('.filter-chip', filters).forEach((b) => { const active = b === chip; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
    let shown = 0;
    $$('#all-projects .project-card').forEach((card) => {
      const visible = current === 'All' || card.dataset.category === current;
      card.classList.toggle('is-hidden', !visible);
      if (visible) shown++;
    });
    $('#filter-count').textContent = `SHOWING ${shown} PROJECT${shown === 1 ? '' : 'S'}`;
    resetReveal();
  });
  // Fine-pointer interaction. Mobile/tablet uses native scrolling and tap controls instead.
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (finePointer && !reducedMotion) {
    const dot = $('.cursor-dot');
    document.addEventListener('pointermove', (event) => {
      if (!dot) return;
      dot.style.left = event.clientX + 'px';
      dot.style.top = event.clientY + 'px';
    }, { passive: true });
    document.addEventListener('pointerover', (event) => dot?.classList.toggle('is-hover', !!event.target.closest?.('a,button')));
    document.addEventListener('pointerout', (event) => { if (!event.relatedTarget) dot?.classList.remove('is-hover'); });
  }
  showRoute(false);
  window.dispatchEvent(new CustomEvent('portfolio:route'));

  // Motion engine uses RAF and the Web Animations API: no remote runtime dependencies.
  let ticking = false;
  const progress = document.querySelector('.scroll-indicator span');
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  function scrollTick(){
    ticking=false;
    const max = Math.max(1, document.documentElement.scrollHeight-innerHeight);
    if(progress) progress.style.transform=`scaleX(${clamp(scrollY/max,0,1)})`;
    if(reducedMotion) return;
    document.querySelectorAll('.page-view:not([hidden]) .parallax-photo').forEach(el=>{
      const box=el.getBoundingClientRect();
      if(box.bottom<0||box.top>innerHeight) return;
      const ratio=(box.top+box.height/2-innerHeight/2)/(innerHeight+box.height);
      el.style.setProperty('--parallaxY',`${(-ratio*46).toFixed(1)}px`);
    });
    const title=$('.page-view:not([hidden]) .hero-title');
    if(title) title.style.setProperty('--titleY',`${Math.min(125,scrollY*.17)}px`);
    const spotlight=$('.page-view:not([hidden]) .spotlight-stage-image');
    if(spotlight){const r=spotlight.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){spotlight.style.setProperty('--spotlightDrift',`${clamp((r.top-innerHeight*.5)*-.024,-18,18).toFixed(1)}px`);}}
    const sculpture=$('.page-view:not([hidden]) .statement-sculpture');
    if(sculpture){const r=sculpture.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){sculpture.style.setProperty('--sculptureTurn',`${clamp((innerHeight/2-r.top)*.018,-8,12).toFixed(2)}deg`);}}
    const scene=$('.page-view:not([hidden]) .hero-scene');
    if(scene) scene.style.setProperty('--sceneZoom',`${(1 + Math.min(.25,scrollY/2600)).toFixed(3)}`);
  }
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(scrollTick)}},{passive:true});
  addEventListener('resize',scrollTick,{passive:true});

  function prepareMedia(root=document){
    root.querySelectorAll('.project-media img,.detail-cover img,.detail-gallery img,.scene-card img').forEach(img=>{
      img.classList.add('parallax-photo');
      img.decoding='async';
      if(img.dataset.ready) return;
      img.dataset.ready='yes';
      img.addEventListener('load',()=>img.closest('.project-media,.detail-cover,.detail-gallery,.scene-card')?.classList.add('image-loaded'));
      img.addEventListener('error',()=>{
        img.classList.add('image-error');
        const wrap=img.parentElement;
        if(wrap) {wrap.classList.add('image-missing');wrap.dataset.photoFallback='Image not available — add your own source photo';}
      });
    });
  }
  // Auto-observe new case-study content after client-side navigation.
  addEventListener('portfolio:route',()=>{prepareMedia();scrollTick();});
  // Routing handled above. Detect active page mutations for route changes too.
  const detailContainer=$('#detail-content');
  if(detailContainer){new MutationObserver(()=>{prepareMedia(detailContainer);requestAnimationFrame(scrollTick)}).observe(detailContainer,{childList:true});}
  prepareMedia();scrollTick();

  // Actual perspective 3D card stack: rotates in X and Y space with depth. Touch scroll remains native.
  if(!reducedMotion){
    const stage=$('.hero-scene');
    const items=[$('.scene-one'),$('.scene-two'),$('.scene-three')];
    const z=[85,180,255],r=[-11,9,-6];
    let targetX=0,targetY=0,x=0,y=0,active=false,frame=0;
    const updateStage=()=>{
      x+=(targetX-x)*.075;y+=(targetY-y)*.075;
      items.forEach((el,i)=>{if(el) el.style.transform=`translate3d(${x*(i+1)*14}px,${y*(i+1)*11}px,${z[i]}px) rotateY(${x*(i+1)*3.6}deg) rotateX(${-y*(i+1)*3.8}deg) rotateZ(${r[i]}deg)`});
      if(Math.abs(x-targetX)+Math.abs(y-targetY)>.002 || active)frame=requestAnimationFrame(updateStage);else frame=0;
    };
    const start=()=>{if(!frame)frame=requestAnimationFrame(updateStage)};
    if(finePointer) stage?.addEventListener('pointermove',e=>{
      const b=stage.getBoundingClientRect();
      targetX=clamp((e.clientX-b.left)/b.width*2-1,-1,1);
      targetY=clamp((e.clientY-b.top)/b.height*2-1,-1,1);
      active=true;start();
    },{passive:true});
    if(finePointer) stage?.addEventListener('pointerleave',()=>{active=false;targetX=targetY=0;start()});
    // Under coarse pointer, automatic floating and native scroll remain enabled by CSS.
    start();
  }

  // Camera-like project cards. Real perspective transforms, not a screenshot animation.
  if(finePointer&&!reducedMotion){
    document.addEventListener('pointermove',e=>{
      const card=e.target.closest?.('.project-card');
      if(!card)return;
      const media=card.querySelector('.project-media');if(!media)return;
      const b=media.getBoundingClientRect(), mx=clamp((e.clientX-b.left)/b.width,-.3,1.3),my=clamp((e.clientY-b.top)/b.height,-.3,1.3);
      media.style.setProperty('--tiltX',`${((.5-my)*7).toFixed(2)}deg`);
      media.style.setProperty('--tiltY',`${((mx-.5)*7).toFixed(2)}deg`);
      media.style.setProperty('--glowX',`${mx*100}%`);media.style.setProperty('--glowY',`${my*100}%`);
    },{passive:true});
    document.addEventListener('pointerout',e=>{
      const c=e.target.closest?.('.project-card'); if(c&&!c.contains(e.relatedTarget)){
        const m=c.querySelector('.project-media');m?.style.setProperty('--tiltX','0deg');m?.style.setProperty('--tiltY','0deg');
      }
    });
  }

  // Zoom/lightbox: buttons, mouse wheel, drag, touch pinch, Esc.
  const zoom=$('#zoom-overlay'),surface=$('#zoom-surface'),zoomImg=$('#zoom-image');
  const resetBtn=$('#zoom-reset'),zoomRange=$('#zoom-range');
  let imageSequence=[],imageIndex=0,originFocus=null;
  let zoomScale=1,panX=0,panY=0,pointers=new Map(),dragOrigin=null,lastPinch=0;
  const syncZoom=()=>{
    if(zoomImg)zoomImg.style.transform=`translate3d(${panX}px,${panY}px,0) scale(${zoomScale})`;
    if(resetBtn)resetBtn.textContent=`${Math.round(zoomScale*100)}%`;
    if(zoomRange)zoomRange.value=String(Math.round(zoomScale*100));
  };
  function openZoom(img){
    if(!zoom||!zoomImg)return;
    originFocus=document.activeElement;
    imageSequence=$$('.page-view:not([hidden]) .detail-cover img,.page-view:not([hidden]) .detail-gallery img');
    imageIndex=Math.max(0,imageSequence.indexOf(img));
    zoomImg.src=img.currentSrc||img.src;zoomImg.alt=img.alt||'Enlarged project photograph';
    $('#zoom-title').textContent=img.closest('.page-view')?.querySelector('.detail-title')?.textContent||'PROJECT IMAGE';
    zoom.hidden=false;zoom.setAttribute('aria-hidden','false');document.body.classList.add('zoom-open');
    zoomScale=1;panX=panY=0;syncZoom();$('#zoom-close')?.focus();
  }
  function closeZoom(){if(!zoom||zoom.hidden)return;zoom.hidden=true;zoom.setAttribute('aria-hidden','true');document.body.classList.remove('zoom-open');zoomImg?.removeAttribute('src');pointers.clear();if(originFocus?.focus)originFocus.focus();}
  const setScale=(s)=>{zoomScale=clamp(s,.65,4);if(zoomScale<=1){panX=0;panY=0;}syncZoom();};
  const navigateZoom=(delta)=>{
    if(!imageSequence.length)return;
    imageIndex=(imageIndex+delta+imageSequence.length)%imageSequence.length;
    const img=imageSequence[imageIndex];zoomImg.src=img.currentSrc||img.src;zoomImg.alt=img.alt||'Project image';
    zoomScale=1;panX=panY=0;syncZoom();
  };
  zoomRange?.addEventListener('input',()=>setScale(Number(zoomRange.value)/100));
  document.addEventListener('click',e=>{
    const img=e.target.closest?.('.detail-cover img,.detail-gallery img');
    if(img&&!zoom?.contains(img)){openZoom(img);return;}
    if(e.target.closest?.('[data-zoom-close],#zoom-close'))closeZoom();
    else if(e.target.closest?.('#zoom-in'))setScale(zoomScale+.25);
    else if(e.target.closest?.('#zoom-out'))setScale(zoomScale-.25);
    else if(e.target.closest?.('#zoom-reset')){panX=panY=0;setScale(1);}
    else if(e.target.closest?.('#zoom-prev'))navigateZoom(-1);
    else if(e.target.closest?.('#zoom-next'))navigateZoom(1);
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeZoom(); if(zoom&&!zoom.hidden){if(e.key==='+')setScale(zoomScale+.25);if(e.key==='-')setScale(zoomScale-.25);
    if(e.key==='ArrowLeft'&&!e.target.matches('input'))navigateZoom(-1);if(e.key==='ArrowRight'&&!e.target.matches('input'))navigateZoom(1)}});
  surface?.addEventListener('wheel',e=>{e.preventDefault();setScale(zoomScale*(e.deltaY<0?1.12:.89))},{passive:false});
  surface?.addEventListener('pointerdown',e=>{surface.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});dragOrigin={x:e.clientX,y:e.clientY,px:panX,py:panY};});
  surface?.addEventListener('pointermove',e=>{
    if(!pointers.has(e.pointerId))return;
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pointers.size===2){const a=[...pointers.values()];const d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(lastPinch)setScale(zoomScale*(d/lastPinch));lastPinch=d;}
    else if(dragOrigin&&zoomScale>1){panX=dragOrigin.px+e.clientX-dragOrigin.x;panY=dragOrigin.py+e.clientY-dragOrigin.y;syncZoom();}
  });
  function endPointer(e){pointers.delete(e.pointerId);lastPinch=0;dragOrigin=null;}
  surface?.addEventListener('pointerup',endPointer);surface?.addEventListener('pointercancel',endPointer);

  // Kinetic depth on editorial spotlight; never blocks clicks or touch scrolling.
  if(finePointer && !reducedMotion){
    const spotlight=$('.spotlight-stage');
    spotlight?.addEventListener('pointermove',e=>{
      const box=spotlight.getBoundingClientRect();
      const x=((e.clientX-box.left)/box.width-.5)*2, y=((e.clientY-box.top)/box.height-.5)*2;
      spotlight.style.setProperty('--spotlightX',`${(x*7).toFixed(2)}deg`);
      spotlight.style.setProperty('--spotlightY',`${(-y*7).toFixed(2)}deg`);
    },{passive:true});
    spotlight?.addEventListener('pointerleave',()=>{spotlight.style.setProperty('--spotlightX','0deg');spotlight.style.setProperty('--spotlightY','0deg');});
  }
  // Pointer-free sections remain usable with keyboard and touch; animated on supported devices.
  // Line-by-line headline animation and reveal transitions.
  if(!reducedMotion){
    $('.hero-title')?.animate([{opacity:0,filter:'blur(16px)',transform:'translateY(55px)'},{opacity:1,filter:'blur(0px)',transform:'translateY(0px)'}],{duration:1100,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});
  }
  // True route transitions fade content, without hijacking links or breaking history.
  // Also add entry fade each time visible view changes.
  const viewObserver=new MutationObserver(m=>m.forEach(a=>{
    if(a.attributeName==='hidden'&&!a.target.hidden&&!reducedMotion){
      a.target.animate([{opacity:.35,filter:'blur(7px)'},{opacity:1,filter:'blur(0px)'}],{duration:530,easing:'ease-out'});
    }
  }));
  Object.values(views).forEach(v=>v&&viewObserver.observe(v,{attributes:true,attributeFilter:['hidden']}));
})();
