document.addEventListener('DOMContentLoaded', function() {

  /* ===== SET CURRENT YEAR ===== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav if open
        const mobileNav = document.querySelector('.mobile-nav');
        const navToggle = document.querySelector('.nav-toggle');
        if (mobileNav && mobileNav.classList.contains('open')) {
          mobileNav.classList.remove('open');
          if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  /* ===== NAVBAR SCROLL EFFECT ===== */
  const navbarPill = document.querySelector('.navbar-pill');
  if (navbarPill) {
    const isDarkNav = document.body.classList.contains('homepage');
    window.addEventListener('scroll', function() {
      if (isDarkNav) {
        if (window.scrollY > 80) {
          navbarPill.style.background = 'rgba(10,10,11,0.92)';
          navbarPill.style.boxShadow = '0 24px 60px rgba(0,0,0,0.34)';
        } else {
          navbarPill.style.background = 'rgba(10,10,11,0.82)';
          navbarPill.style.boxShadow = '0 24px 60px rgba(0,0,0,0.30)';
        }
      } else {
        if (window.scrollY > 80) {
          navbarPill.style.background = 'rgba(255,255,255,0.96)';
          navbarPill.style.boxShadow = '0 4px 32px rgba(19,63,112,0.12)';
        } else {
          navbarPill.style.background = 'rgba(255,255,255,0.88)';
          navbarPill.style.boxShadow = '0 4px 24px rgba(19,63,112,0.08)';
        }
      }
    });
  }

  /* ===== MOBILE NAV CLOSE ON RESIZE ===== */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (navToggle && mobileNav) {
    window.addEventListener('resize', function() {
      if (window.innerWidth > 1024 && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ===== SCROLL REVEAL ===== */
  const revealItems = document.querySelectorAll('.reveal-on-scroll');
  if (revealItems.length > 0) {
    const revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  }

  /* ===== ANIMATED COUNTERS (Trust Section) ===== */
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateNumber(el, target, suffix, duration) {
      if (reduceMotion) { el.textContent = target.toLocaleString() + suffix; return; }
      const start = performance.now();
      const step = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(target * eased);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    const trustStats = document.querySelector('.trust-stats');
    if (trustStats) {
      const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            statNumbers.forEach(el => {
              if (!el.dataset.animated) {
                el.dataset.animated = 'true';
                const target = parseInt(el.dataset.target, 10);
                const suffix = el.dataset.suffix || '';
                animateNumber(el, target, suffix, 1400);
              }
            });
            counterObserver.unobserve(trustStats);
          }
        });
      }, { threshold: 0.4 });
      counterObserver.observe(trustStats);
    }
  }

  /* ===== SERVICE DETAIL ACCORDIONS ===== */
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const item = this.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      this.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ===== FAQ ACCORDION ===== */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      this.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ===== HOW IT WORKS - TIMELINE PROGRESS ===== */
  const timelineProgress = document.getElementById('timelineProgress');
  const stepItems = document.querySelectorAll('.step-item');
  if (timelineProgress && stepItems.length > 0) {
    const stepsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
      // Calculate progress
      const visibleSteps = document.querySelectorAll('.step-item.in-view').length;
      const percent = (visibleSteps / stepItems.length) * 100;
      timelineProgress.style.width = percent + '%';
    }, { threshold: 0.5 });
    stepItems.forEach(step => stepsObserver.observe(step));
  }

  /* ===== TESTIMONIALS CAROUSEL ===== */
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');
  const carouselDotsContainer = document.getElementById('carouselDots');

  if (carouselTrack && carouselPrev && carouselNext && carouselDotsContainer) {
    const cards = carouselTrack.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let cardsPerView = 3;
    let autoplayInterval;

    function getCardsPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getTotalSlides() {
      return Math.max(1, cards.length - cardsPerView + 1);
    }

    function createDots() {
      carouselDotsContainer.innerHTML = '';
      const totalSlides = getTotalSlides();
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => goToSlide(i));
        carouselDotsContainer.appendChild(dot);
      }
    }

    function goToSlide(index) {
      const totalSlides = getTotalSlides();
      currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
      const cardWidth = cards[0].offsetWidth + 24; // gap
      carouselTrack.style.transform = 'translateX(-' + (currentIndex * cardWidth) + 'px)';
      // Update dots
      carouselDotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      const totalSlides = getTotalSlides();
      goToSlide(currentIndex >= totalSlides - 1 ? 0 : currentIndex + 1);
    }

    function prevSlide() {
      const totalSlides = getTotalSlides();
      goToSlide(currentIndex <= 0 ? totalSlides - 1 : currentIndex - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      if (autoplayInterval) clearInterval(autoplayInterval);
    }

    carouselNext.addEventListener('click', () => { nextSlide(); startAutoplay(); });
    carouselPrev.addEventListener('click', () => { prevSlide(); startAutoplay(); });

    // Pause on hover
    carouselTrack.addEventListener('mouseenter', stopAutoplay);
    carouselTrack.addEventListener('mouseleave', startAutoplay);

    function initCarousel() {
      cardsPerView = getCardsPerView();
      currentIndex = Math.min(currentIndex, getTotalSlides() - 1);
      createDots();
      goToSlide(currentIndex);
    }

    initCarousel();
    startAutoplay();
    window.addEventListener('resize', initCarousel);
  }

  /* ===== INNER PAGE: MOBILE NAV (menu-toggle / site-nav) ===== */
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');
  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', function() {
      const isOpen = siteNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ===== INNER PAGE: APPLY FORM (kept from original) ===== */
  const serviceSelect = document.getElementById('service');
  const adaptiveBlocks = document.querySelectorAll('.adaptive-field');
  const categoryRow = document.getElementById('serviceCategories');
  const selectedServiceLabel = document.getElementById('selectedServiceLabel');

  const categoryServices = {
    pan: [
      { value: 'pan-individual', label: 'PAN Card - Individual' },
      { value: 'pan-company', label: 'PAN Card - Company' },
      { value: 'pan-firm', label: 'PAN Card - Firm' },
      { value: 'pan-llp', label: 'PAN Card - LLP' },
      { value: 'pan-trust', label: 'PAN Card - Trust' },
    ],
    itr: [
      { value: 'it-individual', label: 'Income Tax Filing - Individual' },
      { value: 'it-business', label: 'Income Tax Filing - Business' },
      { value: 'it-company', label: 'Income Tax Filing - Company' },
      { value: 'it-firm', label: 'Income Tax Filing - Firm' },
      { value: 'it-llp', label: 'Income Tax Filing - LLP' },
      { value: 'tds-return', label: 'TDS Return Filing' },
      { value: 'tcs-return', label: 'TCS Return Filing' },
    ],
    gst: [
      { value: 'gst-reg', label: 'GST Registration' },
      { value: 'gst-filing', label: 'GST Filing (General)' },
      { value: 'gst-gstr1', label: 'GSTR-1' },
      { value: 'gst-gstr3b', label: 'GSTR-3B' },
      { value: 'gst-gstr9', label: 'GSTR-9 / 9C' },
      { value: 'gst-amendment', label: 'GST Amendment' },
      { value: 'gst-reconciliation', label: 'GST Reconciliation' },
      { value: 'gst-cmp08', label: 'Composition CMP-08' },
      { value: 'gst-gstr7', label: 'GST TDS (GSTR-7)' },
    ],
    msme: [
      { value: 'msme-udyam', label: 'Udyam (MSME) Registration' },
      { value: 'business', label: 'Startup / Business Registration' },
    ],
    tds: [
      { value: 'tds-return', label: 'TDS Return Filing' },
      { value: 'tcs-return', label: 'TCS Return Filing' },
    ],
    epf: [
      { value: 'epf-registration', label: 'EPF Registration' },
      { value: 'epf-monthly', label: 'EPF Monthly Filing' },
      { value: 'esi-registration', label: 'ESI Registration' },
      { value: 'esi-monthly', label: 'ESI Monthly Filing' },
    ],
    company: [
      { value: 'pvt-ltd-registration', label: 'Private Limited Company Registration' },
      { value: 'llp-registration', label: 'LLP Registration' },
      { value: 'roc-annual-filing', label: 'ROC Annual Filing' },
      { value: 'mca-compliance-filing', label: 'MCA Compliance Filing' },
      { value: 'director-kyc', label: 'Director KYC (DIR-3 KYC)' },
      { value: 'company-amendments', label: 'Company Amendments' },
    ],
    accounting: [
      { value: 'accounting-services', label: 'Accounting Services' },
      { value: 'bookkeeping-services', label: 'Bookkeeping Services' },
      { value: 'bank-reconciliation', label: 'Bank Reconciliation' },
      { value: 'compliance-management', label: 'Compliance Management' },
      { value: 'financial-statements', label: 'Financial Statement Preparation' },
    ],
  };

  function serviceTypeFromValue(val) {
    if (!val) return null;
    if (val.startsWith('pan-')) return 'pan';
    if (val.startsWith('it-') || val === 'tds-return' || val === 'tcs-return') return 'itr';
    if (val.startsWith('gst')) return 'gst';
    if (val.includes('msme') || val.includes('udyam')) return 'msme';
    if (val === 'business' || val.includes('pvt') || val.includes('llp') ||
        val.includes('roc') || val.includes('mca') || val.includes('director') ||
        val.includes('company')) return 'company';
    if (val.includes('accounting') || val.includes('bookkeeping') ||
        val.includes('reconciliation') || val.includes('compliance') ||
        val.includes('financial')) return 'accounting';
    return null;
  }

  function updateAdaptiveFields() {
    const type = serviceTypeFromValue(serviceSelect?.value || '');
    adaptiveBlocks.forEach(block => {
      block.classList.toggle('active', block.dataset.serviceType === type);
    });
  }

  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
      const current = serviceSelect.options[serviceSelect.selectedIndex];
      if (selectedServiceLabel && current && current.value) {
        selectedServiceLabel.textContent = 'You selected: ' + current.text;
      }
      updateAdaptiveFields();
    });
  }

  function populateServiceOptions(categoryKey) {
    const list = categoryServices[categoryKey] || [];
    serviceSelect.innerHTML = list.length
      ? '<option value="">Select a service...</option>' +
        list.map(item => '<option value="' + item.value + '">' + item.label + '</option>').join('')
      : '<option value="">No services available</option>';
    serviceSelect.disabled = list.length === 0;
    if (selectedServiceLabel) selectedServiceLabel.textContent = '';
    serviceSelect.value = '';
    updateAdaptiveFields();
  }

  if (categoryRow && serviceSelect) {
    categoryRow.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        categoryRow.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        populateServiceOptions(btn.dataset.category);
      });
    });

    const params = new URLSearchParams(window.location.search);
    const preselectService = params.get('service');
    if (preselectService) {
      const category = serviceTypeFromValue(preselectService);
      const targetBtn = category ? categoryRow.querySelector('button[data-category="' + category + '"]') : null;
      if (category && targetBtn) {
        categoryRow.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        targetBtn.classList.add('active');
        populateServiceOptions(category);
        serviceSelect.value = preselectService;
        serviceSelect.disabled = false;
        if (selectedServiceLabel && serviceSelect.value) {
          const current = serviceSelect.options[serviceSelect.selectedIndex];
          if (current) selectedServiceLabel.textContent = 'You selected: ' + current.text;
        }
        updateAdaptiveFields();
      }
    }
  }

  /* ===== HERO PARTICLE NETWORK CANVAS ===== */
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let particles = [];
    let mouseX = -1000, mouseY = -1000;
    const PARTICLE_COUNT = 60;
    const MAX_DIST = 140;

    function resizeCanvas() {
      heroCanvas.width = heroCanvas.parentElement.offsetWidth;
      heroCanvas.height = heroCanvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse for interactive effect
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', function(e) {
        const rect = heroCanvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
      heroSection.addEventListener('mouseleave', function() {
        mouseX = -1000; mouseY = -1000;
      });
      // Enable pointer events on canvas parent so mouse tracking works
      heroCanvas.style.pointerEvents = 'none';
    }

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * heroCanvas.width;
        this.y = Math.random() * heroCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        // Brand colors with transparency
        const colors = [
          'rgba(128, 184, 69, 0.5)',
          'rgba(55, 152, 167, 0.4)',
          'rgba(255, 255, 255, 0.25)',
          'rgba(27, 90, 158, 0.4)',
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > heroCanvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > heroCanvas.height) this.vy *= -1;

        // Subtle mouse repulsion
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.vx += dx / dist * 0.15;
          this.vy += dy / dist * 0.15;
        }
        // Dampen
        this.vx *= 0.99;
        this.vy *= 0.99;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(128, 184, 69, ' + alpha + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ===== HERO TYPING EFFECT ===== */
  const typedTextEl = document.getElementById('heroTypedText');
  if (typedTextEl) {
    const words = [
      'Business Compliance',
      'Tax Filing',
      'GST Registration',
      'Company Setup',
      'MSME Registration',
      'PAN Services'
    ];
    let wordIdx = 0;
    let charIdx = words[0].length; // Start fully typed
    let isDeleting = false;
    let typeTimeout;

    function typeStep() {
      const currentWord = words[wordIdx];
      if (!isDeleting) {
        charIdx++;
        typedTextEl.textContent = currentWord.substring(0, charIdx);
        if (charIdx >= currentWord.length) {
          // Pause before deleting
          typeTimeout = setTimeout(function() { isDeleting = true; typeStep(); }, 2200);
          return;
        }
        typeTimeout = setTimeout(typeStep, 80 + Math.random() * 40);
      } else {
        charIdx--;
        typedTextEl.textContent = currentWord.substring(0, charIdx);
        if (charIdx <= 0) {
          isDeleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          typeTimeout = setTimeout(typeStep, 400);
          return;
        }
        typeTimeout = setTimeout(typeStep, 40 + Math.random() * 20);
      }
    }

    // Start typing effect after initial animation delay
    setTimeout(function() {
      isDeleting = true;
      typeStep();
    }, 3000);
  }

  /* ===== HERO STATS BAR COUNTER ===== */
  const heroStatValues = document.querySelectorAll('.hero-stat-value');
  if (heroStatValues.length > 0) {
    const reduceMotionHero = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateHeroCounter(el, target, suffix, duration) {
      if (reduceMotionHero) { el.textContent = target.toLocaleString() + suffix; return; }
      const start = performance.now();
      const step = function(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(target * eased);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    const heroStatsBar = document.querySelector('.hero-stats-bar');
    if (heroStatsBar) {
      const heroCounterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            heroStatValues.forEach(function(el) {
              if (!el.dataset.animated) {
                el.dataset.animated = 'true';
                const target = parseInt(el.dataset.target, 10);
                const suffix = el.dataset.suffix || '';
                animateHeroCounter(el, target, suffix, 1600);
              }
            });
            heroCounterObserver.unobserve(heroStatsBar);
          }
        });
      }, { threshold: 0.3 });
      heroCounterObserver.observe(heroStatsBar);
    }
  }
});
