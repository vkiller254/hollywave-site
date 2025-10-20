// script.js
// Mobile nav toggle, smooth scroll offset, lightbox, simple form validation, intersection reveal.
// Minimal vanilla JS, accessible, and commented.

// ---------------------------
// Helpers
// ---------------------------
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// ---------------------------
// NAV TOGGLE
// ---------------------------
const navToggle = $('#navToggle');
const primaryNav = $('#primaryNav');

navToggle?.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Close nav when a link is used (mobile)
$$('.primary-nav a, .footer-nav a').forEach(a => {
  a.addEventListener('click', () => {
    if (document.body.classList.contains('nav-open')) {
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// ---------------------------
// SMOOTH SCROLL WITH OFFSET
// ---------------------------
// Use for internal links to account for sticky header.
const headerHeight = () => document.querySelector('.site-header')?.offsetHeight || 64;

$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight() - 10;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---------------------------
// LIGHTBOX (simple)
// ---------------------------
const galleryItems = $$('.gallery-item');
const lightbox = $('#lightbox');
const lightboxImg = $('#lightboxImg');
const closeBtn = document.querySelector('.lightbox-close');
const prevBtn = $('#prevImg');
const nextBtn = $('#nextImg');

let galleryIndex = -1;
let gallerySources = galleryItems.map(b => b.dataset.src);

// Open lightbox
function openLightbox(index){
  if (!gallerySources[index]) return;
  galleryIndex = index;
  lightboxImg.src = gallerySources[index];
  lightboxImg.alt = `Gallery image ${index+1}`;
  lightbox.style.display = 'flex';
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // focus for keyboard users
  closeBtn.focus();
}

// Close lightbox
function closeLightbox(){
  lightbox.style.display = 'none';
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

// Bind gallery buttons
galleryItems.forEach((btn, i) => {
  btn.addEventListener('click', () => openLightbox(i));
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
  });
});

// Controls
closeBtn?.addEventListener('click', closeLightbox);
prevBtn?.addEventListener('click', () => { openLightbox((galleryIndex - 1 + gallerySources.length) % gallerySources.length); });
nextBtn?.addEventListener('click', () => { openLightbox((galleryIndex + 1) % gallerySources.length); });

// keyboard controls
document.addEventListener('keydown', (e) => {
  if (lightbox.style.display === 'flex') {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
  }
});

// clicking outside image closes
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// ---------------------------
// SIMPLE FORM VALIDATION
// ---------------------------

// Utility validator
function showError(fieldId, message) {
  const el = document.getElementById(fieldId);
  const err = document.getElementById(`${fieldId}-error`);
  if (err) err.textContent = message || '';
  if (el) {
    if (message) el.setAttribute('aria-invalid','true');
    else el.removeAttribute('aria-invalid');
  }
}


// ---------------------------
// INTERSECTION OBSERVER: reveal elements on scroll
// ---------------------------
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$$('.card, .hero-title, .story, .program-card').forEach(el => {
  el.classList.add('fade-in');
  io.observe(el);
});

// ---------------------------
// STATS COUNTER (simple)
 // ---------------------------
$$('.stat-num').forEach(el => {
  const target = +el.dataset.count || +el.textContent;
  let cur = 0;
  const step = Math.max(1, Math.floor(target / 40));
  const timer = setInterval(() => {
    cur += step;
    if (cur >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = cur;
    }
  }, 18);
});

// ---------------------------
// Footer year
// ---------------------------
$('#year') && ($('#year').textContent = new Date().getFullYear());

// ---------------------------
// PERFORMANCE NOTES:
// - Gallery thumbnails use loading="lazy" in HTML.
// - Replace placeholder images with optimized images (webp when possible).
// ---------------------------
