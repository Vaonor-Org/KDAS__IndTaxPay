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
    startup: [
      { value: 'startup-proprietorship', label: 'Proprietorship' },
      { value: 'startup-partnership', label: 'Partnership Firm' },
      { value: 'startup-opc', label: 'One Person Company (OPC)' },
      { value: 'startup-llp', label: 'Limited Liability Partnership (LLP)' },
      { value: 'startup-pvt-ltd', label: 'Private Limited Company' },
      { value: 'startup-pub-ltd', label: 'Public Limited Company' },
      { value: 'startup-sec-8', label: 'Section 8 Company' },
      { value: 'startup-producer-co', label: 'Producer Company' },
      { value: 'startup-trust-reg', label: 'Trust Registration' },
      { value: 'startup-indian-sub', label: 'Indian Subsidiary Company' }
    ],
    registrations: [
      { value: 'registrations-pan-individual', label: 'PAN Card - Individual' },
      { value: 'registrations-pan-company', label: 'PAN Card - Company' },
      { value: 'registrations-pan-firm', label: 'PAN Card - Partnership Firm' },
      { value: 'registrations-pan-llp', label: 'PAN Card - LLP' },
      { value: 'registrations-pan-trust', label: 'PAN Card - Trust / AOP' },
      { value: 'registrations-startup-india', label: 'Startup India Registration' },
      { value: 'registrations-trade-license', label: 'Trade License' },
      { value: 'registrations-fssai-reg', label: 'FSSAI Registration' },
      { value: 'registrations-fssai-lic', label: 'FSSAI License' },
      { value: 'registrations-halal-cert', label: 'Halal License & Certification' },
      { value: 'registrations-icegate-reg', label: 'ICEGATE Registration' },
      { value: 'registrations-iec', label: 'Import Export Code (IEC)' },
      { value: 'registrations-lei', label: 'Legal Entity Identifier (LEI)' },
      { value: 'registrations-iso-reg', label: 'ISO Registration' },
      { value: 'registrations-pf-reg', label: 'PF Registration' },
      { value: 'registrations-esi-reg', label: 'ESI Registration' },
      { value: 'registrations-prof-tax-reg', label: 'Professional Tax Registration' },
      { value: 'registrations-rcmc-reg', label: 'RCMC Registration' },
      { value: 'registrations-tn-rera', label: 'TN RERA Registration' },
      { value: 'registrations-12a-reg', label: '12A Registration' },
      { value: 'registrations-80g-reg', label: '80G Registration' },
      { value: 'registrations-12a-80g-reg', label: '12A & 80G Registration' },
      { value: 'registrations-barcode-reg', label: 'Barcode Registration' },
      { value: 'registrations-bis-reg', label: 'BIS Registration' },
      { value: 'registrations-cert-incumbency', label: 'Certificate of Incumbency' },
      { value: 'registrations-ngo-darpan', label: 'NGO Darpan Registration' },
      { value: 'registrations-dsc', label: 'Digital Signature Certificate (DSC)' },
      { value: 'registrations-shop-act', label: 'Shop Act Registration' },
      { value: 'registrations-udyam-reg', label: 'Udyam Registration' },
      { value: 'registrations-fire-license', label: 'Fire License' },
      { value: 'registrations-food-testing', label: 'Food Testing' },
      { value: 'registrations-water-testing', label: 'Water Testing' }
    ],
    trademark: [
      { value: 'trademark-tm-reg', label: 'Trademark Registration' },
      { value: 'trademark-tm-objection', label: 'Trademark Objection' },
      { value: 'trademark-tm-certificate', label: 'Trademark Certificate' },
      { value: 'trademark-tm-opposition', label: 'Trademark Opposition' },
      { value: 'trademark-tm-hearing', label: 'Trademark Hearing' },
      { value: 'trademark-tm-rectification', label: 'Trademark Rectification' },
      { value: 'trademark-tm-renewal', label: 'Trademark Renewal' },
      { value: 'trademark-tm-transfer', label: 'Trademark Transfer' },
      { value: 'trademark-expedited-tm', label: 'Expedited Trademark Registration' },
      { value: 'trademark-logo-design', label: 'Logo Designing' },
      { value: 'trademark-design-reg', label: 'Design Registration' },
      { value: 'trademark-design-objection', label: 'Design Objection' },
      { value: 'trademark-copyright-reg', label: 'Copyright Registration' },
      { value: 'trademark-copyright-objection', label: 'Copyright Objection' },
      { value: 'trademark-patent-reg', label: 'Patent Registration' },
      { value: 'trademark-tm-protection', label: 'Trademark Protection' }
    ],
    gst: [
      { value: 'gst-gst-registration', label: 'GST Registration' },
      { value: 'gst-gst-return-filing', label: 'GST Return Filing' },
      { value: 'gst-gst-lut', label: 'GST LUT Form' },
      { value: 'gst-gst-notice', label: 'GST Notice Response' },
      { value: 'gst-gst-annual', label: 'GST Annual Return (GSTR-9)' },
      { value: 'gst-gst-foreign', label: 'GST Registration for Foreigners' },
      { value: 'gst-gst-amend', label: 'GST Amendment' },
      { value: 'gst-gst-revocation', label: 'GST Revocation' },
      { value: 'gst-gst-final', label: 'GSTR-10 Final Return' },
      { value: 'gst-gst-virtual', label: 'Virtual Office + GSTIN' }
    ],
    incomeTax: [
      { value: 'incomeTax-it-efiling', label: 'Income Tax E-Filing' },
      { value: 'incomeTax-it-biz-filing', label: 'Business Tax Filing' },
      { value: 'incomeTax-it-firm-llp-itr', label: 'Partnership Firm / LLP ITR' },
      { value: 'incomeTax-it-company-itr', label: 'Company ITR Filing' },
      { value: 'incomeTax-it-trust-ngo', label: 'Trust / NGO Tax Filing' },
      { value: 'incomeTax-it-15ca-cb', label: '15CA – 15CB Filing' },
      { value: 'incomeTax-it-tan-reg', label: 'TAN Registration' },
      { value: 'incomeTax-it-tds-filing', label: 'TDS Return Filing' },
      { value: 'incomeTax-it-notice', label: 'Income Tax Notice Response' },
      { value: 'incomeTax-it-u-return', label: 'Revised ITR Return (ITR-U)' }
    ],
    compliance: [
      { value: 'compliance-comp-annual', label: 'Company Annual Compliance' },
      { value: 'compliance-comp-llp', label: 'LLP Compliance' },
      { value: 'compliance-comp-opc', label: 'OPC Compliance' },
      { value: 'compliance-comp-name-change', label: 'Company Name Change' },
      { value: 'compliance-comp-office-change', label: 'Registered Office Change' },
      { value: 'compliance-comp-din-ekyc', label: 'DIN eKYC Filing' },
      { value: 'compliance-comp-din-reactivate', label: 'DIN Reactivation' },
      { value: 'compliance-comp-director-change', label: 'Director Change' },
      { value: 'compliance-comp-remove-director', label: 'Remove Director' },
      { value: 'compliance-comp-adt1', label: 'ADT-1 Filing' },
      { value: 'compliance-comp-dpt3', label: 'DPT-3 Filing' },
      { value: 'compliance-comp-llp-f11', label: 'LLP Form 11 Filing' },
      { value: 'compliance-comp-dormant', label: 'Dormant Status Filing' },
      { value: 'compliance-comp-moa', label: 'MOA Amendment' },
      { value: 'compliance-comp-aoa', label: 'AOA Amendment' },
      { value: 'compliance-comp-cap-increase', label: 'Authorized Capital Increase' },
      { value: 'compliance-comp-share-transfer', label: 'Share Transfer' },
      { value: 'compliance-comp-demat', label: 'Demat of Shares' },
      { value: 'compliance-comp-wind-llp', label: 'Winding Up – LLP' },
      { value: 'compliance-comp-wind-co', label: 'Winding Up – Company' },
      { value: 'compliance-comp-commencement', label: 'Commencement (INC-20A)' },
      { value: 'compliance-comp-cfss', label: 'CFSS Scheme' }
    ],
    businessSupport: [
      { value: 'businessSupport-biz-plan', label: 'Business Plan' },
      { value: 'businessSupport-biz-payroll', label: 'HR & Payroll' },
      { value: 'businessSupport-biz-bookkeeping', label: 'Bookkeeping' },
      { value: 'businessSupport-biz-ca', label: 'CA Support' },
      { value: 'businessSupport-biz-pf', label: 'PF Return Filing' },
      { value: 'businessSupport-biz-esi', label: 'ESI Return Filing' },
      { value: 'businessSupport-biz-pt', label: 'Professional Tax Return Filing' },
      { value: 'businessSupport-biz-partnership', label: 'Partnership Compliance' },
      { value: 'businessSupport-biz-proprietorship', label: 'Proprietorship Compliance' },
      { value: 'businessSupport-biz-fssai-renewal', label: 'FSSAI Renewal' },
      { value: 'businessSupport-biz-fssai-return', label: 'FSSAI Return Filing' }
    ],
    globalBusiness: [
      { value: 'globalBusiness-global-uae', label: 'UAE Company Registration' },
      { value: 'globalBusiness-global-usa', label: 'USA Company Registration' },
      { value: 'globalBusiness-global-singapore', label: 'Singapore Company Registration' },
      { value: 'globalBusiness-global-uk', label: 'UK Company Registration' },
      { value: 'globalBusiness-global-usa-tm', label: 'USA Trademark Registration' },
      { value: 'globalBusiness-global-fdi', label: 'FDI Filing' },
      { value: 'globalBusiness-global-odi', label: 'ODI Filing' },
      { value: 'globalBusiness-global-fla', label: 'FLA Return Filing' }
    ],
    audit: [
      { value: 'audit-audit-assurance', label: 'Audit & Assurance Services' }
    ]
  };

  function serviceTypeFromValue(val) {
    if (!val) return null;
    const parts = val.split('-');
    const category = parts[0];
    
    // Map to adaptive form sections in apply.html: pan, itr, gst, msme, company, accounting
    if (category === 'startup') return 'company';
    if (category === 'registrations') {
      if (val.includes('pan')) return 'pan';
      if (val.includes('udyam') || val.includes('startup-india')) return 'msme';
      return 'company';
    }
    if (category === 'trademark') return 'company';
    if (category === 'gst') return 'gst';
    if (category === 'incomeTax') return 'itr';
    if (category === 'compliance') return 'company';
    if (category === 'businessSupport') return 'accounting';
    if (category === 'globalBusiness') return 'company';
    if (category === 'audit') return 'accounting';

    // Support legacy values in case they are used or requested
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
