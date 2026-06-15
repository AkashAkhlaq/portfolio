/* ═══════════════════════════════════════════════════════════════
   AKASH AKHLAQ — PORTFOLIO v2 · script.js
   Modules:
     1.  Loader
     2.  Custom Cursor
     3.  Aurora Canvas (hero background)
     4.  Navbar — scroll + sliding pill indicator
     5.  Mobile Drawer
     6.  Hero Reveal (staggered entrance)
     7.  Typewriter
     8.  Counter Animation
     9.  Scroll Reveal (IntersectionObserver)
     10. Skill Bar Animation
     11. Magnetic Effect (buttons + project cards)
     12. Parallax (subtle scroll depth)
     13. Contact Form (FormSubmit AJAX)
     14. Back-to-top
     15. Footer Year
   ═══════════════════════════════════════════════════════════════ */
 
'use strict';
 
/* ─── TINY HELPERS ───────────────────────────────────────────── */
const $  = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
 
/* ════════════════════════════════════════════════════════════════
   1. LOADER
   Bar sweeps across top in CSS; we just dismiss the overlay
   after a short delay so fonts have time to load.
   ════════════════════════════════════════════════════════════════ */
const loader = $('#loader');
 
function dismissLoader() {
  loader.classList.add('done');
  // Trigger hero entrance once loader is gone
  triggerHeroReveal();
}
 
// 1.5 s gives Fontshare (Clash Display) time to arrive
window.addEventListener('load', () => setTimeout(dismissLoader, 1500));
// Safety: dismiss anyway after 3 s
setTimeout(dismissLoader, 3000);
 
/* ════════════════════════════════════════════════════════════════
   2. CUSTOM CURSOR
   Dot snaps instantly; ring follows with lerp lag for smoothness.
   Expands when hovering interactive elements.
   ════════════════════════════════════════════════════════════════ */
const cursorDot  = $('#cursor');
const cursorRing = $('#cursorRing');
 
if (cursorDot && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
  let mx = 0, my = 0, rx = 0, ry = 0;
 
  on(document, 'mousemove', e => {
    mx = e.clientX; my = e.clientY;
    // Dot is instant
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });
 
  // Ring lerps toward mouse position every frame
  (function lerpRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();
 
  // Expand ring on hoverable elements
  on(document, 'mouseover', e => {
    if (e.target.closest('a, button, [tabindex], .pcard, .scard')) {
      document.body.classList.add('cursor-hover');
    }
  });
  on(document, 'mouseout', e => {
    if (e.target.closest('a, button, [tabindex], .pcard, .scard')) {
      document.body.classList.remove('cursor-hover');
    }
  });
}
 
/* ════════════════════════════════════════════════════════════════
   3. AURORA CANVAS
   ─────────────────────────────────────────────────────────────
   Technique: draw N bezier "ribbons" that slowly oscillate.
   Each ribbon is defined by two control points that drift via
   sine waves on different frequencies. Mouse position subtly
   warps the control points — giving an interactive feel without
   WebGL complexity.
 
   Why this instead of particle networks:
   - Particle networks are on every dark portfolio (overused).
   - Ribbons feel more editorial and atmospheric.
   - Pure canvas 2D — no libraries, no WebGL fallbacks needed.
   ════════════════════════════════════════════════════════════════ */
(function initAurora() {
  const canvas = $('#auroraCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
 
  let W, H, mouseX = 0, mouseY = 0, t = 0;
 
  // Ribbon definitions — each has an offset, frequency, and colour pair
  const ribbons = [
    { y: 0.30, amp: 0.18, freq: 0.0007, phase: 0,    c1: '#6C63FF', c2: '#00D4FF', width: 180, opacity: 0.22 },
    { y: 0.55, amp: 0.14, freq: 0.0009, phase: 1.2,  c1: '#9C6FFF', c2: '#6C63FF', width: 140, opacity: 0.18 },
    { y: 0.72, amp: 0.10, freq: 0.0006, phase: 2.5,  c1: '#00D4FF', c2: '#00E5A0', width: 120, opacity: 0.15 },
    { y: 0.20, amp: 0.08, freq: 0.0011, phase: 0.8,  c1: '#6C63FF', c2: '#9C6FFF', width: 100, opacity: 0.12 },
    { y: 0.85, amp: 0.12, freq: 0.0008, phase: 3.1,  c1: '#00E5A0', c2: '#00D4FF', width: 90,  opacity: 0.10 },
  ];
 
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  on(window, 'resize', resize, { passive: true });
 
  on(document, 'mousemove', e => {
    mouseX = e.clientX / W;
    mouseY = e.clientY / H;
  }, { passive: true });
 
  function drawRibbon(r, time) {
    const baseY = r.y * H;
    // Control point 1 — drifts via sine
    const cp1x = W * 0.25 + mouseX * W * 0.06;
    const cp1y = baseY + Math.sin(time * r.freq + r.phase) * r.amp * H
               + mouseY * H * 0.04;
    // Control point 2 — different phase
    const cp2x = W * 0.72 + mouseX * W * 0.04;
    const cp2y = baseY + Math.cos(time * r.freq * 1.3 + r.phase + 1) * r.amp * H * 0.8
               - mouseY * H * 0.03;
    // End point
    const endY  = baseY + Math.sin(time * r.freq * 0.7 + r.phase + 2) * r.amp * H * 0.5;
 
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.2, r.c1 + '00');
    grad.addColorStop(0.45, r.c1);
    grad.addColorStop(0.65, r.c2);
    grad.addColorStop(0.85, r.c2 + '00');
    grad.addColorStop(1, 'transparent');
 
    ctx.save();
    ctx.globalAlpha = r.opacity;
    ctx.strokeStyle = grad;
    ctx.lineWidth   = r.width;
    ctx.lineCap     = 'round';
    ctx.filter      = 'blur(32px)';
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, W, endY);
    ctx.stroke();
    ctx.restore();
  }
 
  function frame(timestamp) {
    ctx.clearRect(0, 0, W, H);
    t = timestamp;
    ribbons.forEach(r => drawRibbon(r, t));
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
 
/* ════════════════════════════════════════════════════════════════
   4. NAVBAR — scroll state + sliding pill indicator
   ════════════════════════════════════════════════════════════════ */
const navbar  = $('#navbar');
const navPill = $('#navPill');
const navLinks = $$('.nav-link');
 
// Scroll — add .scrolled class so CSS applies frosted glass
on(window, 'scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  // Back-to-top visibility
  $('#btt').classList.toggle('show', window.scrollY > 500);
}, { passive: true });
 
// Sliding pill: move pill to sit behind whichever link is hovered / active
function movePill(el) {
  if (!el || !navPill) return;
  const wrap = $('.nav-links-wrap');
  const wRect = wrap.getBoundingClientRect();
  const eRect = el.getBoundingClientRect();
  navPill.style.opacity = '1';
  navPill.style.left    = (eRect.left - wRect.left) + 'px';
  navPill.style.width   = eRect.width + 'px';
}
 
navLinks.forEach(link => {
  on(link, 'mouseenter', () => movePill(link));
  on(link, 'focus',      () => movePill(link));
});
on($('.nav-links-wrap'), 'mouseleave', () => {
  // Return pill to active link, or hide it
  const active = $('.nav-link.active');
  active ? movePill(active) : (navPill.style.opacity = '0');
});
 
// Active section tracking via IntersectionObserver
const sectionEls = $$('section[id]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => {
      const isActive = l.getAttribute('href') === '#' + e.target.id;
      l.classList.toggle('active', isActive);
      if (isActive) movePill(l);
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sectionEls.forEach(s => sectionObserver.observe(s));
 
/* ════════════════════════════════════════════════════════════════
   5. MOBILE DRAWER
   Slides in from right. Closes on link click / outside tap / Escape.
   ════════════════════════════════════════════════════════════════ */
const hamburger   = $('#hamburger');
const mobileDrawer = $('#mobileDrawer');
 
function openDrawer() {
  hamburger.classList.add('open');
  mobileDrawer.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  hamburger.classList.remove('open');
  mobileDrawer.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
 
on(hamburger, 'click', () =>
  hamburger.classList.contains('open') ? closeDrawer() : openDrawer()
);
$$('.drawer-link').forEach(l => on(l, 'click', closeDrawer));
on(document, 'click', e => {
  if (mobileDrawer.classList.contains('open')
      && !mobileDrawer.contains(e.target)
      && !hamburger.contains(e.target)) closeDrawer();
});
on(document, 'keydown', e => e.key === 'Escape' && closeDrawer());
 
/* ════════════════════════════════════════════════════════════════
   6. HERO REVEAL — staggered entrance after loader dismisses
   Each .js-reveal element reads data-delay (ms) for its offset.
   The h1 word-wipe is handled by adding .in to the parent .h1-line
   which transitions the inner .h1-word transforms (see CSS).
   ════════════════════════════════════════════════════════════════ */
function triggerHeroReveal() {
  $$('.js-reveal').forEach(el => {
    const delay = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => el.classList.add('in'), delay);
  });
}
 
/* ════════════════════════════════════════════════════════════════
   7. TYPEWRITER
   Cycles through roles that reflect Akash's real work.
   Asymmetric timing: fast type, medium pause, fast delete.
   ════════════════════════════════════════════════════════════════ */
const roleEl = $('#roleTyped');
const roles  = [
  'GHL Automation',
  'High-Convert Funnels',
  'Front-End Interfaces',
  'SEO-Optimised Sites',
  'CRM Workflows',
  'Web Experiences',
];
 
let ri = 0, ci = 0, deleting = false;
 
function typeRole() {
  if (!roleEl) return;
  const word = roles[ri];
  roleEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
 
  let delay = deleting ? 42 : 88;
  if (!deleting && ci === word.length + 1) { delay = 1800; deleting = true; }
  else if (deleting && ci < 0)             { deleting = false; ri = (ri + 1) % roles.length; ci = 0; delay = 350; }
 
  setTimeout(typeRole, delay);
}
setTimeout(typeRole, 2000); // Start after loader is well gone
 
/* ════════════════════════════════════════════════════════════════
   8. COUNTER ANIMATION (hero stats)
   Eased count-up triggered when stats strip enters viewport.
   ════════════════════════════════════════════════════════════════ */
function countUp(el, target, duration = 1600) {
  const start = performance.now();
  const tick  = now => {
    const p = Math.min((now - start) / duration, 1);
    // Ease out cubic
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
 
const statsWrap = $('.hero-stats');
if (statsWrap) {
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    $$('[data-target]', statsWrap).forEach(el =>
      countUp(el, parseInt(el.dataset.target, 10))
    );
  }, { threshold: 0.6 }).observe(statsWrap);
}
 
/* ════════════════════════════════════════════════════════════════
   9. SCROLL REVEAL
   All .js-scroll elements fade + slide up when they enter the
   viewport. Children inside .js-scroll get staggered delays.
   ════════════════════════════════════════════════════════════════ */
const scrollRevealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('in');
 
    // Stagger direct children (cards, items, etc.)
    const children = $$('.pcard, .scard, .acard, .citem', el);
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.07}s`;
      // Force a repaint then make visible
      requestAnimationFrame(() => {
        child.style.opacity   = '1';
        child.style.transform = 'none';
      });
    });
 
    scrollRevealObs.unobserve(el);
  });
}, { threshold: 0.08 });
 
// Pre-hide staggerable children
$$('.js-scroll').forEach(el => {
  $$('.pcard, .scard, .acard, .citem', el).forEach(child => {
    child.style.opacity   = '0';
    child.style.transform = 'translateY(22px)';
    child.style.transition = 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)';
  });
  scrollRevealObs.observe(el);
});
 
/* ════════════════════════════════════════════════════════════════
   10. SKILL BAR ANIMATION
   Bars animate from 0 → --p when their card scrolls into view.
   ════════════════════════════════════════════════════════════════ */
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const fill = e.target.querySelector('.sbar-fill');
    if (fill) fill.style.width = getComputedStyle(fill).getPropertyValue('--p');
  });
}, { threshold: 0.4 }).observe($('.skills-grid') || document.body);
 
// Also trigger individually per card
$$('.scard').forEach(card => {
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    const fill = card.querySelector('.sbar-fill');
    if (fill) {
      // Small delay so the card entrance animation finishes first
      setTimeout(() => { fill.style.width = getComputedStyle(fill).getPropertyValue('--p'); }, 300);
    }
  }, { threshold: 0.3 }).observe(card);
});
 
/* ════════════════════════════════════════════════════════════════
   11. MAGNETIC EFFECT
   ─────────────────────────────────────────────────────────────
   On mousemove inside the element, translate it toward the cursor
   by a fraction of the distance from centre. On mouseleave,
   spring back to origin with a CSS transition.
 
   Applied to: .magnetic (buttons) and .magnetic-card (project cards).
   Cards use a weaker pull factor so they don't move too far.
   ════════════════════════════════════════════════════════════════ */
function initMagnetic(selector, pull = 0.28) {
  $$(selector).forEach(el => {
    on(el, 'mousemove', e => {
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * pull;
      const dy = (e.clientY - cy) * pull;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = 'transform 0.1s linear';
    });
    on(el, 'mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    });
  });
}
 
initMagnetic('.magnetic',      0.28);  // Buttons — stronger pull
initMagnetic('.magnetic-card', 0.10);  // Project cards — subtle pull
 
/* ════════════════════════════════════════════════════════════════
   12. PARALLAX
   ─────────────────────────────────────────────────────────────
   Elements with class .parallax and data-speed get a subtle
   vertical offset based on scroll position. Positive speed = slower
   than page (receding); negative = faster (advancing).
   Uses requestAnimationFrame + IntersectionObserver to only run
   when the element is visible.
   ════════════════════════════════════════════════════════════════ */
const parallaxEls = $$('.parallax');
let scrollY = window.scrollY;
let rafPending = false;
 
function applyParallax() {
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.speed || 0.15);
    const rect  = el.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return; // skip off-screen
    const offset = scrollY * speed;
    el.style.transform = `translateY(${offset}px)`;
  });
  rafPending = false;
}
 
on(window, 'scroll', () => {
  scrollY = window.scrollY;
  if (!rafPending) { rafPending = true; requestAnimationFrame(applyParallax); }
}, { passive: true });
 
/* ════════════════════════════════════════════════════════════════
   13. CONTACT FORM — FormSubmit AJAX
   Sends to akashakhlaq38@gmail.com without page redirect.
   Shows loading state on button, then success/error message.
   ════════════════════════════════════════════════════════════════ */
const cForm    = $('#contactForm');
const cfStatus = $('#cfStatus');
const cfSubmit = $('#cfSubmit');
 
on(cForm, 'submit', async e => {
  e.preventDefault();
 
  // Basic validation
  const name  = $('#cf-name',  cForm).value.trim();
  const email = $('#cf-email', cForm).value.trim();
  const msg   = $('#cf-msg',   cForm).value.trim();
 
  if (!name || !email || !msg) {
    cfStatus.textContent = '⚠️ Please fill in all required fields.';
    cfStatus.style.color = '#ff6b6b';
    return;
  }
 
  // Loading state
  const origHTML = cfSubmit.innerHTML;
  cfSubmit.innerHTML = '<span class="btn-text">Sending…</span> <i class="ri-loader-4-line btn-arrow"></i>';
  cfSubmit.disabled  = true;
  cfStatus.textContent = '';
 
  // Spin the loader icon
  const loaderIcon = cfSubmit.querySelector('.ri-loader-4-line');
  if (loaderIcon) loaderIcon.style.animation = 'spin360 0.8s linear infinite';
 
  try {
    const data = new FormData(cForm);
    const res  = await fetch('https://formsubmit.co/ajax/akashakhlaq38@gmail.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data,
    });
    const json = await res.json();
 
    if (json.success === 'true' || json.success === true) {
      cfStatus.textContent = '✅ Message sent! I\'ll reply within 24 hours.';
      cfStatus.style.color = '#00D4FF';
      cForm.reset();
    } else throw new Error();
  } catch {
    cfStatus.textContent = '❌ Something went wrong. Email me directly: akashakhlaq38@gmail.com';
    cfStatus.style.color = '#ff6b6b';
  }
 
  cfSubmit.innerHTML = origHTML;
  cfSubmit.disabled  = false;
  setTimeout(() => { cfStatus.textContent = ''; }, 7000);
});
 
// Loader spin keyframe — injected once
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin360 { to { transform: rotate(360deg); } }';
document.head.appendChild(spinStyle);
 
/* ════════════════════════════════════════════════════════════════
   14. BACK-TO-TOP
   ════════════════════════════════════════════════════════════════ */
on($('#btt'), 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
 
/* ════════════════════════════════════════════════════════════════
   15. FOOTER YEAR + SMOOTH ANCHOR SCROLL
   ════════════════════════════════════════════════════════════════ */
const yrEl = $('#yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();
 
$$('a[href^="#"]').forEach(a => {
  on(a, 'click', e => {
    const target = $(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement)
                          .getPropertyValue('--nav-h')) || 70;
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});
 
