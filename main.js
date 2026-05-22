/**
 * KDAS Financial Services — Shared JavaScript
 * Vanilla JS · No external frameworks
 */

'use strict';

// ─── Lucide Icons ─────────────────────────────────────────
function initIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// ─── Navigation ───────────────────────────────────────────
function initNav() {
  const hamburger = document.getElementById('navHamburger');
  const mobileOverlay = document.getElementById('navMobileOverlay');
  if (!hamburger || !mobileOverlay) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileOverlay.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on overlay link click
  mobileOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileOverlay.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Highlight active nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile-overlay a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPath || href === ('./' + currentPath) || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ─── Scroll Reveal ────────────────────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Apply stagger delays to children with data-stagger-parent
  document.querySelectorAll('[data-stagger-parent]').forEach(parent => {
    parent.querySelectorAll('.reveal').forEach((child, i) => {
      child.style.transitionDelay = `${i * 100}ms`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ─── Counter Animation ────────────────────────────────────
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutCubic(progress) * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ─── FAQ Accordion ────────────────────────────────────────
function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      // open clicked (toggle)
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ─── Contact Form ─────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.form-field').forEach(field => {
      field.classList.remove('has-error');
    });

    // Validate required fields
    form.querySelectorAll('[required]').forEach(input => {
      const field = input.closest('.form-field');
      if (!input.value.trim()) {
        field && field.classList.add('has-error');
        valid = false;
      }
    });

    if (!valid) {
      if (statusEl) {
        statusEl.textContent = 'Please fill in all required fields.';
        statusEl.className = 'form-status error-msg';
      }
      return;
    }

    // Simulate successful submission
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    setTimeout(() => {
      if (statusEl) {
        statusEl.textContent = 'Thank you! We have received your enquiry and will be in touch shortly.';
        statusEl.className = 'form-status success';
      }
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Enquiry';
      }
    }, 1200);
  });
}

// ─── Section divider reveal ───────────────────────────────
function initDividers() {
  const dividers = document.querySelectorAll('.section-divider-line');
  if (!dividers.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  dividers.forEach(d => obs.observe(d));
}

// ─── Bootstrap ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initNav();
  initScrollReveal();
  initCounters();
  initFaq();
  initContactForm();
  initDividers();
});
