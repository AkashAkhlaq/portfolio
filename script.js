/* ============================================================
   AKASH AKHLAQ — PORTFOLIO JAVASCRIPT
   Handles: Custom cursor · Navbar · Mobile menu · Typewriter
            Scroll reveal · Skill bars · Counter animations
            Magnetic buttons · Contact form · Back-to-top
   ============================================================ */

'use strict';

/* ——— DOM HELPERS ——— */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ——————————————————————————————————————————
   1. CUSTOM CURSOR
—————————————————————————————————————————— */
const cursor = $('#cursor');
const cursorFollower = $('#cursorFollower');

if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Lag follower for smoothness
  function animateCursor() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Expand on hoverable elements
  $$('a, button, [tabindex], .project-card, .skill-category').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorFollower.style.width  = '56px';
      cursorFollower.style.height = '56px';
    });
    el.addEventListener('mouseleave', () => {
      cursorFollower.style.width  = '36px';
      cursorFollower.style.height = '36px';
    });
  });
}

/* ——————————————————————————————————————————
   2. NAVBAR — scroll + active link
—————————————————————————————————————————— */
const navbar = $('#navbar');
const navLinks = $$('.nav-link');

// Scrolled state
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  // Back-to-top
  $('#backToTop').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// Active nav link via Intersection Observer
const sections = $$('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(sec => navObserver.observe(sec));

/* ——————————————————————————————————————————
   3. MOBILE MENU
—————————————————————————————————————————— */
const hamburger   = $('#hamburger');
const mobileMenu  = $('#mobileMenu');
const mobileLinks = $$('.mobile-link');

function openMenu() {
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

// Close on link click
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// Close on outside click
document.addEventListener('click', (e) => {
  if (mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeMenu();
  }
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
});

/* ——————————————————————————————————————————
   4. TYPEWRITER EFFECT
—————————————————————————————————————————— */
const typewriterEl = $('#typewriter');

// Roles that reflect Akash's actual work
const roles = [
  'GHL Automation',
  'High-Convert Funnels',
  'Front-End Interfaces',
  'SEO-Optimised Sites',
  'CRM Workflows',
  'Web Experiences',
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
let typeTimer;

function type() {
  const current = roles[roleIndex];
  const displayed = isDeleting
    ? current.substring(0, charIndex--)
    : current.substring(0, charIndex++);

  typewriterEl.textContent = displayed;

  let delay = isDeleting ? 45 : 85;

  if (!isDeleting && charIndex === current.length + 1) {
    // Pause at end
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  typeTimer = setTimeout(type, delay);
}

// Start after short delay
setTimeout(type, 1000);

/* ——————————————————————————————————————————
   5. SCROLL REVEAL — IntersectionObserver
—————————————————————————————————————————— */
function createRevealObserver(selector, threshold = 0.15) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold });

  $$(selector).forEach(el => observer.observe(el));
  return observer;
}

// Run reveals
createRevealObserver('.fade-in-section', 0.1);
createRevealObserver('.reveal-up', 0.05);
createRevealObserver('.reveal-right', 0.1);

// Trigger hero reveals immediately on load
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    $$('.hero .reveal-up, .hero .reveal-right').forEach(el =>
      el.classList.add('visible')
    );
  }, 100);
});

/* ——————————————————————————————————————————
   6. SKILL BAR ANIMATION
—————————————————————————————————————————— */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.skill-fill');
      if (fill) {
        // Animate from 0 to --pct CSS variable
        const pct = fill.style.getPropertyValue('--pct');
        fill.style.width = pct;
      }
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

$$('.skill-bar-wrap').forEach(el => skillObserver.observe(el));

/* ——————————————————————————————————————————
   7. COUNTER ANIMATION (hero stats)
—————————————————————————————————————————— */
function animateCounter(el, target, duration = 1800) {
  const start    = performance.now();
  const startVal = 0;

  function update(time) {
    const elapsed  = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(startVal + (target - startVal) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num[data-target]');
      nums.forEach(num => {
        const target = parseInt(num.dataset.target, 10);
        animateCounter(num, target);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = $('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

/* ——————————————————————————————————————————
   8. MAGNETIC BUTTONS
—————————————————————————————————————————— */
function initMagnetic() {
  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect    = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const dx = (e.clientX - centerX) * 0.25;
      const dy = (e.clientY - centerY) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

initMagnetic();

/* ——————————————————————————————————————————
   9. CONTACT FORM — FormSubmit AJAX (emails go to akashakhlaq38@gmail.com)
—————————————————————————————————————————— */
const contactForm = $('#contactForm');
const formStatus  = $('#formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    // Validate required fields
    const name    = contactForm.querySelector('#name').value.trim();
    const email   = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = '⚠️ Please fill in all required fields.';
      formStatus.style.color = '#ff6b6b';
      return;
    }

    // Loading state
    btn.innerHTML = '<span>Sending…</span> <i class="ri-loader-4-line" aria-hidden="true"></i>';
    btn.disabled  = true;
    formStatus.textContent = '';

    try {
      // FormSubmit AJAX endpoint — sends email to akashakhlaq38@gmail.com
      const formData = new FormData(contactForm);
      formData.append('_captcha', 'false');

      const response = await fetch('https://formsubmit.co/ajax/akashakhlaq38@gmail.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });

      const result = await response.json();

      if (result.success === 'true' || result.success === true) {
        formStatus.textContent = '✅ Message sent! I\'ll reply within 24 hrs.';
        formStatus.style.color = '#00d4ff';
        contactForm.reset();
      } else {
        throw new Error('FormSubmit returned failure');
      }
    } catch (err) {
      formStatus.textContent = '❌ Oops! Something went wrong. Email me directly at akashakhlaq38@gmail.com';
      formStatus.style.color = '#ff6b6b';
    }

    btn.innerHTML = originalHTML;
    btn.disabled  = false;

    setTimeout(() => { formStatus.textContent = ''; }, 7000);
  });
}

/* ——————————————————————————————————————————
   10. BACK-TO-TOP
—————————————————————————————————————————— */
$('#backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ——————————————————————————————————————————
   11. FOOTER YEAR
—————————————————————————————————————————— */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ——————————————————————————————————————————
   12. SMOOTH SCROLL for anchor links
—————————————————————————————————————————— */
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = $(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offsetTop = target.offsetTop - (parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 72);
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  });
});

/* ——————————————————————————————————————————
   13. STAGGERED SECTION CHILD REVEALS
—————————————————————————————————————————— */
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = entry.target.querySelectorAll(
        '.project-card, .skill-category, .info-card, .contact-item'
      );
      children.forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.08}s`;
        child.style.opacity = '1';
        child.style.transform = 'none';
      });
      staggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

$$('.fade-in-section').forEach(sec => {
  // Set initial hidden state on staggerable children
  const children = sec.querySelectorAll(
    '.project-card, .skill-category, .info-card, .contact-item'
  );
  children.forEach(child => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(24px)';
    child.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  });
  staggerObserver.observe(sec);
});
