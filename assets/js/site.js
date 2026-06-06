(() => {
  "use strict";

  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        // ignore
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    },
  };

  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const $ = (sel, root = document) => root.querySelector(sel);

  const fmtINR = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return "₹0";
    return "₹" + Math.round(num).toLocaleString("en-IN");
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const getBase = () => document.body?.dataset?.base || "./";

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isDesktopPointer = () =>
    window.matchMedia &&
    window.matchMedia("(pointer: fine)").matches &&
    window.matchMedia("(hover: hover)").matches;

  function renderNavbar(base) {
    return `
      <header class="navbar" data-navbar>
        <div class="navbar__bg" aria-hidden="true"></div>
        <div class="container navbar__inner">
          <a class="brand" href="${base}index.html" aria-label="IndTaxPay home">
            <span class="brand__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <circle cx="12" cy="12" r="9" stroke="currentColor" opacity="0.35"/>
                <circle cx="12" cy="12" r="2.2" stroke="currentColor"/>
                ${Array.from({ length: 12 })
        .map((_, i) => {
          const a = (i * Math.PI) / 6;
          const x1 = 12 + Math.cos(a) * 3.4;
          const y1 = 12 + Math.sin(a) * 3.4;
          const x2 = 12 + Math.cos(a) * 8.9;
          const y2 = 12 + Math.sin(a) * 8.9;
          return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="currentColor" opacity="0.45"/>`;
        })
        .join("")}
              </svg>
            </span>
            <span class="brand__text" aria-label="IndTaxPay">
              <span class="ind">Ind</span><span class="tax">Tax</span><span class="pay">Pay</span>
            </span>
          </a>

          <nav class="navLinks" aria-label="Primary">
            <a class="navLink" href="${base}index.html" data-nav="home">Home</a>
            <button class="navLink" type="button" data-mega-btn="services" data-nav="services" aria-expanded="false" aria-controls="mega-services">
              Services ▾
            </button>
            <a class="navLink" href="${base}blog/index.html" data-nav="blog">Blog</a>
            <a class="navLink" href="${base}about/index.html" data-nav="about">About</a>
            <a class="navLink" href="${base}track.html" data-nav="track">Track</a>
          </nav>

          <div class="navActions">
            <button class="iconBtn" type="button" id="themeToggle" aria-label="Toggle dark mode" title="Toggle theme">
              <span aria-hidden="true">◐</span>
            </button>
            <a class="btn btn-sm btn-primary" href="${base}apply.html">Book Now <span aria-hidden="true">→</span></a>
            <button class="iconBtn hamburger" type="button" data-mobile-open aria-label="Open menu">
              <span aria-hidden="true">☰</span>
            </button>
          </div>
        </div>

        <div class="svcPanel" id="mega-services" data-mega="services" aria-label="Services navigation panel">
          <div class="svcPanel__inner">

            <div class="svcPanel__left">
              <p class="svcPanel__journey-lbl">Your Business Journey</p>
              <nav class="svcCats" aria-label="Service categories">
                <button class="svcCat is-active" type="button" data-svc-cat="startup">
                  <span class="svcCat__num">01</span>
                  <span class="svcCat__body">
                    <span class="svcCat__name">Start Business</span>
                    <span class="svcCat__hint">Company formation &amp; incorporation</span>
                  </span>
                  <span class="svcCat__arr" aria-hidden="true">›</span>
                </button>
                <button class="svcCat" type="button" data-svc-cat="registrations">
                  <span class="svcCat__num">02</span>
                  <span class="svcCat__body">
                    <span class="svcCat__name">Legal Registrations</span>
                    <span class="svcCat__hint">Licenses, MSME &amp; government approvals</span>
                  </span>
                  <span class="svcCat__arr" aria-hidden="true">›</span>
                </button>
                <button class="svcCat" type="button" data-svc-cat="trademark">
                  <span class="svcCat__num">03</span>
                  <span class="svcCat__body">
                    <span class="svcCat__name">Brand Protection</span>
                    <span class="svcCat__hint">Trademark &amp; IP registration</span>
                  </span>
                  <span class="svcCat__arr" aria-hidden="true">›</span>
                </button>
                <button class="svcCat" type="button" data-svc-cat="gst">
                  <span class="svcCat__num">04</span>
                  <span class="svcCat__body">
                    <span class="svcCat__name">Tax &amp; GST</span>
                    <span class="svcCat__hint">GST registration &amp; return filing</span>
                  </span>
                  <span class="svcCat__arr" aria-hidden="true">›</span>
                </button>
                <button class="svcCat" type="button" data-svc-cat="incomeTax">
                  <span class="svcCat__num">05</span>
                  <span class="svcCat__body">
                    <span class="svcCat__name">Income Tax</span>
                    <span class="svcCat__hint">ITR filing &amp; tax planning</span>
                  </span>
                  <span class="svcCat__arr" aria-hidden="true">›</span>
                </button>
                <button class="svcCat" type="button" data-svc-cat="compliance">
                  <span class="svcCat__num">06</span>
                  <span class="svcCat__body">
                    <span class="svcCat__name">Corporate Compliance</span>
                    <span class="svcCat__hint">MCA filings &amp; company secretary</span>
                  </span>
                  <span class="svcCat__arr" aria-hidden="true">›</span>
                </button>
                <button class="svcCat" type="button" data-svc-cat="businessSupport">
                  <span class="svcCat__num">07</span>
                  <span class="svcCat__body">
                    <span class="svcCat__name">Business Operations</span>
                    <span class="svcCat__hint">Accounting, payroll &amp; bookkeeping</span>
                  </span>
                  <span class="svcCat__arr" aria-hidden="true">›</span>
                </button>
                <button class="svcCat" type="button" data-svc-cat="globalBusiness">
                  <span class="svcCat__num">08</span>
                  <span class="svcCat__body">
                    <span class="svcCat__name">Global Expansion</span>
                    <span class="svcCat__hint">International business setup</span>
                  </span>
                  <span class="svcCat__arr" aria-hidden="true">›</span>
                </button>
                <button class="svcCat" type="button" data-svc-cat="audit">
                  <span class="svcCat__num">09</span>
                  <span class="svcCat__body">
                    <span class="svcCat__name">Audit &amp; Assurance</span>
                    <span class="svcCat__hint">Statutory, tax &amp; internal audit</span>
                  </span>
                  <span class="svcCat__arr" aria-hidden="true">›</span>
                </button>
              </nav>
            </div>

            <div class="svcPanel__divider" aria-hidden="true"></div>

            <div class="svcPanel__right">

              <!-- START BUSINESS -->
              <div class="svcServices is-active" data-svc-services="startup">
                <div class="svcServices__hd">
                  <span class="svcServices__title">Start Business</span>
                  <span class="svcServices__count">10 services</span>
                </div>
                <div class="svcItems">
                  <a class="svcItem" href="${base}services/startup.html" style="--i:0"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Proprietorship</span><span class="svcItem__desc">Best for individual business owners and freelancers.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/startup.html" style="--i:1"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Partnership Firm</span><span class="svcItem__desc">Ideal for businesses operated by two or more partners.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/startup.html" style="--i:2"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">One Person Company (OPC)</span><span class="svcItem__desc">Limited liability business structure for a single owner.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/startup.html" style="--i:3"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Limited Liability Partnership (LLP)</span><span class="svcItem__desc">Flexible business structure with legal protection for partners.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/startup.html" style="--i:4"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Private Limited Company</span><span class="svcItem__desc">Most popular startup structure for growth and fundraising.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/startup.html" style="--i:5"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Public Limited Company</span><span class="svcItem__desc">Suitable for large businesses seeking expansion.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/startup.html" style="--i:6"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Section 8 Company</span><span class="svcItem__desc">Non-profit company structure for social and charitable activities.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/startup.html" style="--i:7"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Producer Company</span><span class="svcItem__desc">Designed for agricultural producers and farmer groups.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/startup.html" style="--i:8"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Trust Registration</span><span class="svcItem__desc">Legal structure for charitable and religious organizations.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/startup.html" style="--i:9"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Indian Subsidiary Company</span><span class="svcItem__desc">For foreign businesses establishing operations in India.</span></span><span class="svcItem__arr">→</span></a>
                </div>
              </div>

              <!-- LEGAL REGISTRATIONS -->
              <div class="svcServices" data-svc-services="registrations">
                <div class="svcServices__hd">
                  <span class="svcServices__title">Legal Registrations</span>
                  <span class="svcServices__count">27 services</span>
                </div>
                <div class="svcItems">
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:0"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Startup India Registration</span><span class="svcItem__desc">Government-recognized startup benefits and incentives.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:1"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Trade License</span><span class="svcItem__desc">Legal permission to conduct business operations.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:2"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">FSSAI Registration</span><span class="svcItem__desc">Basic registration for food businesses.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:3"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">FSSAI License</span><span class="svcItem__desc">Mandatory licensing for larger food enterprises.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:4"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Halal License &amp; Certification</span><span class="svcItem__desc">Certification for halal-compliant products and services.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:5"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">ICEGATE Registration</span><span class="svcItem__desc">Required for customs and international trade activities.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:6"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Import Export Code (IEC)</span><span class="svcItem__desc">Mandatory for import and export businesses.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:7"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Legal Entity Identifier (LEI)</span><span class="svcItem__desc">Unique global identification for financial transactions.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:8"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">ISO Registration</span><span class="svcItem__desc">International quality certification standards.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:9"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">PF Registration</span><span class="svcItem__desc">Employee Provident Fund registration.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:10"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">ESI Registration</span><span class="svcItem__desc">Employee State Insurance registration.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:11"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Professional Tax Registration</span><span class="svcItem__desc">State-level employer tax compliance.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:12"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">RCMC Registration</span><span class="svcItem__desc">Export promotion council membership certificate.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:13"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">TN RERA Registration</span><span class="svcItem__desc">Mandatory registration for real estate agents.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:14"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">12A Registration</span><span class="svcItem__desc">Income tax exemption for NGOs.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:15"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">80G Registration</span><span class="svcItem__desc">Tax benefits for donors.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:16"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">12A &amp; 80G Registration</span><span class="svcItem__desc">Combined NGO tax exemption and donor benefit registration.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:17"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Barcode Registration</span><span class="svcItem__desc">Product barcode allocation and registration.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:18"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">BIS Registration</span><span class="svcItem__desc">Bureau of Indian Standards certification.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:19"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Certificate of Incumbency</span><span class="svcItem__desc">Verification of company status and directors.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:20"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">NGO Darpan Registration</span><span class="svcItem__desc">Government NGO recognition portal registration.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:21"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Digital Signature Certificate (DSC)</span><span class="svcItem__desc">Required for online filings and compliance.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:22"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Shop Act Registration</span><span class="svcItem__desc">Mandatory registration for shops and establishments.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:23"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Udyam Registration</span><span class="svcItem__desc">MSME registration with government benefits.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:24"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Fire License</span><span class="svcItem__desc">Fire safety compliance approval.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:25"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Food Testing</span><span class="svcItem__desc">Laboratory food safety testing and certification.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:26"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Water Testing</span><span class="svcItem__desc">Certified water quality testing services.</span></span><span class="svcItem__arr">→</span></a>
                </div>
              </div>

              <!-- BRAND PROTECTION -->
              <div class="svcServices" data-svc-services="trademark">
                <div class="svcServices__hd">
                  <span class="svcServices__title">Brand Protection</span>
                  <span class="svcServices__count">16 services</span>
                </div>
                <div class="svcItems">
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:0"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Trademark Registration</span><span class="svcItem__desc">Protect your brand name and identity.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:1"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Trademark Objection</span><span class="svcItem__desc">Professional response to trademark objections.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:2"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Trademark Certificate</span><span class="svcItem__desc">Obtain trademark registration certificate.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:3"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Trademark Opposition</span><span class="svcItem__desc">Support for opposition proceedings.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:4"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Trademark Hearing</span><span class="svcItem__desc">Representation during trademark hearings.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:5"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Trademark Rectification</span><span class="svcItem__desc">Correction of trademark records.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:6"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Trademark Renewal</span><span class="svcItem__desc">Maintain trademark validity beyond 10 years.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:7"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Trademark Transfer</span><span class="svcItem__desc">Transfer ownership of registered trademarks.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:8"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Expedited Trademark Registration</span><span class="svcItem__desc">Fast-track trademark application processing.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:9"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Logo Designing</span><span class="svcItem__desc">Professional logo and brand identity creation.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:10"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Design Registration</span><span class="svcItem__desc">Protect product appearance and designs.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:11"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Design Objection</span><span class="svcItem__desc">Response to design registration objections.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:12"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Copyright Registration</span><span class="svcItem__desc">Protect creative works and content.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:13"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Copyright Objection</span><span class="svcItem__desc">Handle copyright-related objections.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:14"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Patent Registration</span><span class="svcItem__desc">Protect inventions and innovations.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/trademark.html" style="--i:15"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Trademark Protection</span><span class="svcItem__desc">Ongoing brand protection and monitoring services.</span></span><span class="svcItem__arr">→</span></a>
                </div>
              </div>

              <!-- TAX & GST -->
              <div class="svcServices" data-svc-services="gst">
                <div class="svcServices__hd">
                  <span class="svcServices__title">Tax &amp; GST</span>
                  <span class="svcServices__count">10 services</span>
                </div>
                <div class="svcItems">
                  <a class="svcItem" href="${base}services/gst.html" style="--i:0"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">GST Registration</span><span class="svcItem__desc">Obtain GST registration and GSTIN.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/gst.html" style="--i:1"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">GST Return Filing</span><span class="svcItem__desc">Monthly and annual GST return filing.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/gst.html" style="--i:2"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">GST LUT Form</span><span class="svcItem__desc">Letter of Undertaking filing for exporters.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/gst.html" style="--i:3"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">GST Notice</span><span class="svcItem__desc">Professional GST notice handling and reply.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/gst.html" style="--i:4"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">GST Annual Return (GSTR-9)</span><span class="svcItem__desc">Annual GST compliance filing.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/gst.html" style="--i:5"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">GST Registration for Foreigners</span><span class="svcItem__desc">GST registration for foreign entities.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/gst.html" style="--i:6"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">GST Amendment</span><span class="svcItem__desc">Update GST registration details.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/gst.html" style="--i:7"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">GST Revocation</span><span class="svcItem__desc">Restore cancelled GST registrations.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/gst.html" style="--i:8"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">GSTR-10 Final Return</span><span class="svcItem__desc">Final GST return on cancellation of registration.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/gst.html" style="--i:9"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">Virtual Office + GSTIN</span><span class="svcItem__desc">Business address with GST registration support.</span></span><span class="svcItem__arr">→</span></a>
                </div>
              </div>

              <!-- INCOME TAX -->
              <div class="svcServices" data-svc-services="incomeTax">
                <div class="svcServices__hd">
                  <span class="svcServices__title">Income Tax</span>
                  <span class="svcServices__count">10 services</span>
                </div>
                <div class="svcItems">
                  <a class="svcItem" href="${base}services/income-tax.html" style="--i:0"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Income Tax E-Filing</span><span class="svcItem__desc">Individual income tax return filing.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/income-tax.html" style="--i:1"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Business Tax Filing</span><span class="svcItem__desc">Tax filing for business entities.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/income-tax.html" style="--i:2"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Partnership Firm / LLP ITR</span><span class="svcItem__desc">Income tax filing for firms and LLPs.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/income-tax.html" style="--i:3"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Company ITR Filing</span><span class="svcItem__desc">Corporate income tax return filing.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/income-tax.html" style="--i:4"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Trust / NGO Tax Filing</span><span class="svcItem__desc">Tax compliance for NGOs and trusts.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/income-tax.html" style="--i:5"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">15CA – 15CB Filing</span><span class="svcItem__desc">Foreign remittance compliance certification.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/income-tax.html" style="--i:6"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">TAN Registration</span><span class="svcItem__desc">Tax deduction account number registration.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/income-tax.html" style="--i:7"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">TDS Return Filing</span><span class="svcItem__desc">Quarterly TDS filing services.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/income-tax.html" style="--i:8"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Income Tax Notice</span><span class="svcItem__desc">Notice response and representation.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/income-tax.html" style="--i:9"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Revised ITR Return (ITR-U)</span><span class="svcItem__desc">Correction and updating of filed returns.</span></span><span class="svcItem__arr">→</span></a>
                </div>
              </div>

              <!-- CORPORATE COMPLIANCE -->
              <div class="svcServices" data-svc-services="compliance">
                <div class="svcServices__hd">
                  <span class="svcServices__title">Corporate Compliance</span>
                  <span class="svcServices__count">22 services</span>
                </div>
                <div class="svcItems">
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:0"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Company Annual Compliance</span><span class="svcItem__desc">Complete annual compliance for private limited companies.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:1"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">LLP Compliance</span><span class="svcItem__desc">Mandatory LLP annual filings and returns.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:2"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">OPC Compliance</span><span class="svcItem__desc">Compliance support for One Person Companies.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:3"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Company Name Change</span><span class="svcItem__desc">Official company name change process.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:4"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Registered Office Change</span><span class="svcItem__desc">Change company registered address.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:5"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">DIN eKYC Filing</span><span class="svcItem__desc">Director identity verification filing.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:6"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">DIN Reactivation</span><span class="svcItem__desc">Restore deactivated Director Identification Number.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:7"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Director Change</span><span class="svcItem__desc">Appointment and resignation of directors.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:8"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Remove Director</span><span class="svcItem__desc">Director removal ROC filing.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:9"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">ADT-1 Filing</span><span class="svcItem__desc">Auditor appointment filing with ROC.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:10"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">DPT-3 Filing</span><span class="svcItem__desc">Loan and deposit disclosure filing.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:11"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">LLP Form 11 Filing</span><span class="svcItem__desc">Annual LLP return filing.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:12"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Dormant Status Filing</span><span class="svcItem__desc">Apply for dormant company status.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:13"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">MOA Amendment</span><span class="svcItem__desc">Modify company objectives and clauses.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:14"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">AOA Amendment</span><span class="svcItem__desc">Amend internal governance rules.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:15"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Authorized Capital Increase</span><span class="svcItem__desc">Increase company authorised share capital.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:16"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Share Transfer</span><span class="svcItem__desc">Transfer company ownership shares.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:17"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Demat of Shares</span><span class="svcItem__desc">Share dematerialization services.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:18"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Winding Up – LLP</span><span class="svcItem__desc">LLP closure and strike-off process.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:19"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Winding Up – Company</span><span class="svcItem__desc">Company strike-off and closure.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:20"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Commencement (INC-20A)</span><span class="svcItem__desc">Business commencement declaration filing.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/mca-compliance.html" style="--i:21"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">CFSS Scheme</span><span class="svcItem__desc">Compliance support under applicable MCA schemes.</span></span><span class="svcItem__arr">→</span></a>
                </div>
              </div>

              <!-- BUSINESS OPERATIONS -->
              <div class="svcServices" data-svc-services="businessSupport">
                <div class="svcServices__hd">
                  <span class="svcServices__title">Business Operations</span>
                  <span class="svcServices__count">11 services</span>
                </div>
                <div class="svcItems">
                  <a class="svcItem" href="${base}services/business-support.html" style="--i:0"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Business Plan</span><span class="svcItem__desc">Professional business plan preparation.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/business-support.html" style="--i:1"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">HR &amp; Payroll</span><span class="svcItem__desc">Payroll management and HR support.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/business-support.html" style="--i:2"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Bookkeeping</span><span class="svcItem__desc">Daily financial record maintenance.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/business-support.html" style="--i:3"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">CA Support</span><span class="svcItem__desc">Dedicated chartered accountant assistance.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/business-support.html" style="--i:4"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">PF Return Filing</span><span class="svcItem__desc">Employee provident fund return filing.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/business-support.html" style="--i:5"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">ESI Return Filing</span><span class="svcItem__desc">Employee insurance return filing.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/business-support.html" style="--i:6"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Professional Tax Return Filing</span><span class="svcItem__desc">State tax return compliance.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/business-support.html" style="--i:7"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Partnership Compliance</span><span class="svcItem__desc">Ongoing compliance for partnerships.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/business-support.html" style="--i:8"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Proprietorship Compliance</span><span class="svcItem__desc">Compliance support for proprietorship businesses.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:9"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">FSSAI Renewal</span><span class="svcItem__desc">Renew food licenses and registrations.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/registrations.html" style="--i:10"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">FSSAI Return Filing</span><span class="svcItem__desc">Mandatory FSSAI annual return compliance.</span></span><span class="svcItem__arr">→</span></a>
                </div>
              </div>

              <!-- GLOBAL EXPANSION -->
              <div class="svcServices" data-svc-services="globalBusiness">
                <div class="svcServices__hd">
                  <span class="svcServices__title">Global Expansion</span>
                  <span class="svcServices__count">8 services</span>
                </div>
                <div class="svcItems">
                  <a class="svcItem" href="${base}services/global-business.html" style="--i:0"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">UAE Company Registration</span><span class="svcItem__desc">Start and operate a company in the UAE.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/global-business.html" style="--i:1"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">USA Company Registration</span><span class="svcItem__desc">Business incorporation in the United States.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/global-business.html" style="--i:2"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">Singapore Company Registration</span><span class="svcItem__desc">Company formation in Singapore.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/global-business.html" style="--i:3"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">UK Company Registration</span><span class="svcItem__desc">Business incorporation in the United Kingdom.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/global-business.html" style="--i:4"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">USA Trademark Registration</span><span class="svcItem__desc">Trademark protection in the United States.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/global-business.html" style="--i:5"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">FDI Filing</span><span class="svcItem__desc">Foreign Direct Investment compliance and reporting.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/global-business.html" style="--i:6"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">ODI Filing</span><span class="svcItem__desc">Overseas Direct Investment filings and RBI compliance.</span></span><span class="svcItem__arr">→</span></a>
                  <a class="svcItem" href="${base}services/global-business.html" style="--i:7"><span class="svcItem__dot" style="background:#138808"></span><span class="svcItem__body"><span class="svcItem__name">FLA Return Filing</span><span class="svcItem__desc">Foreign liabilities and assets annual reporting.</span></span><span class="svcItem__arr">→</span></a>
                </div>
              </div>

              <!-- AUDIT & ASSURANCE -->
              <div class="svcServices" data-svc-services="audit">
                <div class="svcServices__hd">
                  <span class="svcServices__title">Audit &amp; Assurance</span>
                  <span class="svcServices__count">1 service</span>
                </div>
                <div class="svcItems">
                  <a class="svcItem" href="${base}services/audit-assurance.html" style="--i:0"><span class="svcItem__dot"></span><span class="svcItem__body"><span class="svcItem__name">Audit &amp; Assurance</span><span class="svcItem__desc">Financial audits and assurance services.</span></span><span class="svcItem__arr">→</span></a>
                </div>
              </div>

        <div class="mega" id="mega-calculators" data-mega="calculators" aria-label="Calculators menu">
          <div class="mega__card">
            <div class="mega__grid">
              <div class="mega__col">
                <div class="mega__title">Quick Tools</div>
                ${renderMegaItem(base, "Income Tax Calculator", "Estimate your tax in seconds.", "calculators/income-tax.html", "saffron")}
                ${renderMegaItem(base, "GST Liability", "Add/remove GST and split CGST/SGST.", "calculators/gst.html", "green")}
                ${renderMegaItem(base, "TDS Calculator", "TDS rate + net payment.", "calculators/tds.html", "navy")}
              </div>
              <div class="mega__col">
                <div class="mega__title">Resources</div>
                ${renderMegaItem(base, "How it works", "4 steps, zero confusion.", "how-it-works/index.html", "navy")}
                ${renderMegaItem(base, "Pricing", "Transparent plans.", "pricing/index.html", "saffron")}
                ${renderMegaItem(base, "Dashboard (demo)", "Track filings & documents.", "dashboard/index.html", "green")}
              </div>
              <div class="mega__col">
                <div class="featuredCard">
                  <div class="stack">
                    <div class="badge badge--green">No sign-up</div>
                    <div class="mega__title">Know your tax before filing</div>
                    <p class="muted">Use the tabbed calculator on the homepage to compare scenarios.</p>
                  </div>
                  <div class="row wrap">
                    <a class="btn btn-sm btn-primary" href="${base}index.html#calculator">Try Calculator →</a>
                    <button class="btn btn-sm btn-outline" type="button" data-open-chat>Talk to CA</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="mobileMenu" data-mobile-menu aria-hidden="true">
        <div class="mobileMenu__panel">
          <div class="row" style="justify-content: space-between;">
            <div class="brand" aria-label="IndTaxPay">
              <span class="brand__text"><span class="ind">Ind</span><span class="tax">Tax</span><span class="pay">Pay</span></span>
            </div>
            <button class="iconBtn" type="button" data-mobile-close aria-label="Close menu">✕</button>
          </div>
          <div class="mobileMenu__links" aria-label="Mobile navigation">
            <a class="navLink" href="${base}index.html" data-nav="home">Home</a>
            <a class="navLink" href="${base}services/index.html">Services</a>
            <a class="navLink" href="${base}how-it-works/index.html">How It Works</a>
            <a class="navLink" href="${base}blog/index.html">Blog</a>
            <a class="navLink" href="${base}about/index.html">About</a>
            <a class="navLink" href="${base}track.html" data-nav="track">Track Application</a>
          </div>
          <div class="mobileMenu__cta">
            <a class="btn btn-primary" href="${base}apply.html">Book Now →</a>
          </div>
        </div>
      </div>
    `;
  }

  function renderMegaItem(base, name, desc, href, tone) {
    const toneBg =
      tone === "saffron"
        ? "rgba(253, 235, 208, 0.85)"
        : tone === "green"
          ? "rgba(230, 245, 226, 0.85)"
          : "rgba(214, 230, 248, 0.75)";

    const toneFg =
      tone === "saffron" ? "var(--color-saffron)" : tone === "green" ? "var(--color-green)" : "var(--color-navy)";

    return `
      <a class="megaItem" href="${base}${href}">
        <span class="megaItem__icon" style="background:${toneBg}; color:${toneFg};" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <path d="M7 7h10v10H7z" stroke="currentColor" opacity="0.55"/>
            <path d="M9 12h6" stroke="currentColor"/>
          </svg>
        </span>
        <span class="megaItem__body">
          <span class="megaItem__name">${name}</span>
          <span class="megaItem__desc">${desc}</span>
        </span>
      </a>
    `;
  }

  function renderFooter(base) {
    const year = new Date().getFullYear();
    return `
      <footer class="footer" aria-label="Footer">
        <div class="container">
          <div class="footerGrid">
            <div class="stack" style="gap: 12px;">
              <div class="footerTitle">IndTaxPay</div>
              <p class="muted">India's Most Trusted Digital Tax & Compliance Platform</p>
              <div class="row wrap">
                <a class="pill" href="${base}contact/index.html">LinkedIn</a>
                <a class="pill" href="${base}contact/index.html">Twitter/X</a>
                <a class="pill" href="${base}contact/index.html">YouTube</a>
                <a class="pill" href="${base}contact/index.html">Instagram</a>
              </div>
              <div class="stack" style="gap: 10px;">
                <div class="kicker" style="color: rgba(255,255,255,0.86);">Get monthly compliance reminders</div>
                <form class="row" data-newsletter>
                  <input class="input" name="email" type="email" placeholder="you@domain.com" aria-label="Email" required style="flex:1;"/>
                  <button class="btn btn-primary" type="submit">Subscribe</button>
                </form>
                <div class="muted" style="font-size:0.92rem;">No spam. Cancel anytime.</div>
              </div>
            </div>

            <div>
              <div class="footerTitle">Services</div>
              <div class="footerList">
                <a href="${base}services/income-tax.html">Income Tax (ITR)</a>
                <a href="${base}services/gst.html">GST</a>
                <a href="${base}services/business-support.html">TDS &amp; Payroll</a>
                <a href="${base}services/startup.html">Company Registration</a>
                <a href="${base}services/audit-assurance.html">Statutory Audit</a>
              </div>
            </div>

            <div>
              <div class="footerTitle">Resources</div>
              <div class="footerList">
                <a href="${base}calculators/index.html">Calculators</a>
                <a href="${base}how-it-works/index.html">How It Works</a>
                <a href="${base}blog/index.html">Blog</a>
                <a href="${base}pricing/index.html">Pricing</a>
              </div>
            </div>

            <div>
              <div class="footerTitle">Company</div>
              <div class="footerList">
                <a href="${base}about/index.html">About</a>
                <a href="${base}contact/index.html">Contact</a>
                <a href="${base}contact/index.html#legal">Privacy Policy</a>
                <a href="${base}contact/index.html#legal">Terms</a>
                <a href="${base}contact/index.html#legal">Disclaimer</a>
              </div>
            </div>
          </div>

          <div class="footerBottom">
            <div class="muted">© ${year} IndTaxPay. All rights reserved.</div>
            <div class="muted">Made with 🧡 in India | A CA-powered compliance platform</div>
          </div>
        </div>
      </footer>

      <button class="chatBubble" type="button" data-chat-bubble aria-label="Open chat">
        <span class="srOnly">Open chat</span>
      </button>
      <div class="chatPanel" data-chat-panel aria-label="Chat panel" role="dialog" aria-modal="false">
        <div class="chatTop">
          <div class="row" style="justify-content: space-between;">
            <div>
              <div style="font-family: var(--font-display); font-weight: 800;">TaxBot</div>
              <div class="muted" style="font-size:0.92rem;">CA help • quick answers</div>
            </div>
            <button class="iconBtn" type="button" data-chat-close aria-label="Close chat">✕</button>
          </div>
        </div>
        <div class="chatMsgs" data-chat-msgs>
          <div class="msg bot">Hi! I'm TaxBot 🙏 How can I help you today?</div>
        </div>
        <div class="quickChips" data-chat-chips>
          <button class="chipBtn" type="button" data-quick="itr">How do I file ITR?</button>
          <button class="chipBtn" type="button" data-quick="gst">What's my GST due date?</button>
          <button class="chipBtn" type="button" data-quick="company">I need to register a company</button>
          <a class="chipBtn" href="https://wa.me/91XXXXXXXXXX?text=Hi%20IndTaxPay%2C%20I%20need%20help%20with%20tax%20filing" target="_blank" rel="noreferrer">WhatsApp us</a>
        </div>
      </div>

      <div class="backdrop" data-backdrop></div>
      <div class="modal" data-modal>
        <div class="modalCard" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div class="modalTop">
            <div class="modalTitle" id="modalTitle">Get Personalized Alerts</div>
            <button class="iconBtn" type="button" data-modal-close aria-label="Close">✕</button>
          </div>
          <p class="muted" data-modal-desc style="margin-top:10px;">Enter your email to receive monthly compliance reminders and unlock detailed calculator reports.</p>
          <div class="stack" style="margin-top:14px;">
            <div class="field">
              <div class="label">Email</div>
              <input class="input" name="email" type="email" placeholder="you@domain.com" required data-modal-email />
              <div class="help">We’ll never share your email.</div>
            </div>
            <button class="btn btn-primary" type="button" data-modal-submit>Continue</button>
          </div>
        </div>
      </div>
    `;
  }

  function injectLayout() {
    const base = getBase();
    const navSlot = $("#navbarSlot");
    const footerSlot = $("#footerSlot");
    if (navSlot) navSlot.innerHTML = renderNavbar(base);
    if (footerSlot) footerSlot.innerHTML = renderFooter(base);

    // mark active nav if provided
    const active = document.body?.dataset?.activeNav;
    if (active) {
      const link = $(`.navLink[data-nav="${active}"]`);
      if (link) link.setAttribute("aria-current", "page");
    }

    // inject services panel CSS once
    if (!document.getElementById('svcPanelStyles')) {
      const style = document.createElement('style');
      style.id = 'svcPanelStyles';
      style.textContent = `
        /* ── Services Journey Panel ─────────────────────── */
        .svcPanel {
          position: absolute;
          top: 100%;
          left: 0; right: 0;
          z-index: 900;
          background: #030d20;
          border-top: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 40px 80px rgba(0,0,0,0.60);
          opacity: 0;
          transform: translateY(-12px);
          pointer-events: none;
          transition: opacity 0.32s cubic-bezier(0.16,1,0.3,1),
                      transform 0.32s cubic-bezier(0.16,1,0.3,1);
        }
        .svcPanel.is-open { opacity:1; transform:translateY(0); pointer-events:all; }
        .svcPanel__inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 300px 1px 1fr;
          height: 520px;
        }
        /* ── Left column ─── */
        .svcPanel__left { padding: 28px 28px 28px 0; overflow-y: auto; }
        .svcPanel__journey-lbl {
          font-size: 0.65rem; letter-spacing: 0.16em; text-transform: uppercase;
          font-weight: 700; color: rgba(255,153,51,0.65);
          margin-bottom: 16px;
          font-family: var(--font-display, Inter, sans-serif);
        }
        .svcPanel__divider { width:1px; background: rgba(255,255,255,0.06); margin: 20px 0; }
        .svcCats { display:flex; flex-direction:column; gap:2px; }
        .svcCat {
          display:flex; align-items:center; gap:12px; width:100%; text-align:left;
          padding:11px 12px; border-radius:10px; background:transparent; border:none;
          cursor:pointer; transition:all 0.24s ease;
          color:rgba(255,255,255,0.48); position:relative;
        }
        .svcCat.is-active, .svcCat:hover { background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.95); }
        .svcCat.is-active::before {
          content:''; position:absolute; left:0; top:18%; bottom:18%;
          width:3px; border-radius:2px; background:#FF9933;
          animation: svcCatLine 0.26s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes svcCatLine { from{transform:scaleY(0)} to{transform:scaleY(1)} }
        .svcCat__num {
          font-size:0.66rem; font-weight:800; font-family:var(--font-mono,monospace);
          color:rgba(255,153,51,0.40); min-width:18px; transition:color 0.2s;
        }
        .svcCat.is-active .svcCat__num { color:#FF9933; }
        .svcCat__body { flex:1; display:flex; flex-direction:column; gap:1px; }
        .svcCat__name { font-family:var(--font-display,Inter,sans-serif); font-weight:700; font-size:0.86rem; line-height:1.2; }
        .svcCat__hint { font-size:0.71rem; color:rgba(255,255,255,0.35); line-height:1.3; }
        .svcCat.is-active .svcCat__hint { color:rgba(255,255,255,0.52); }
        .svcCat__arr { font-size:1rem; opacity:0; transform:translateX(-4px); transition:all 0.2s ease; color:#FF9933; }
        .svcCat.is-active .svcCat__arr { opacity:1; transform:translateX(0); }
        /* ── Right column ─── */
        .svcPanel__right {
          padding: 0;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,153,51,0.25) transparent;
        }
        .svcPanel__right::-webkit-scrollbar { width:4px; }
        .svcPanel__right::-webkit-scrollbar-track { background:transparent; }
        .svcPanel__right::-webkit-scrollbar-thumb { background:rgba(255,153,51,0.25); border-radius:4px; }
        .svcServices { display:none; flex-direction:column; height:100%; }
        .svcServices.is-active { display:flex; }
        /* Header row */
        .svcServices__hd {
          display:flex; align-items:center; justify-content:space-between;
          padding: 20px 28px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position:sticky; top:0; background:#030d20; z-index:2;
          flex-shrink:0;
        }
        .svcServices__title {
          font-family:var(--font-display,Inter,sans-serif); font-weight:800;
          font-size:0.95rem; color:rgba(255,255,255,0.92); letter-spacing:-0.01em;
        }
        .svcServices__count {
          font-size:0.68rem; font-weight:700; font-family:var(--font-mono,monospace);
          color:rgba(255,153,51,0.70); letter-spacing:0.08em; text-transform:uppercase;
          padding:3px 10px; border-radius:999px;
          background:rgba(255,153,51,0.10); border:1px solid rgba(255,153,51,0.18);
        }
        /* Services grid */
        .svcItems {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          padding: 8px 12px 20px;
          flex:1;
        }
        /* Individual service item */
        .svcItem {
          display:flex; align-items:flex-start; gap:10px;
          padding: 11px 14px;
          border-radius: 10px;
          text-decoration: none;
          color: inherit;
          transition: background 0.2s ease;
          opacity: 0;
          animation: svcItemIn 0.30s cubic-bezier(0.16,1,0.3,1) both;
          animation-delay: calc(var(--i, 0) * 0.028s);
          position: relative;
        }
        @keyframes svcItemIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .svcItem:hover { background:rgba(255,255,255,0.05); }
        .svcItem:hover .svcItem__arr { opacity:1; transform:translateX(0); }
        .svcItem:hover .svcItem__name { color:#FF9933; }
        .svcItem__dot {
          width:6px; height:6px; border-radius:50%;
          background:#FF9933; margin-top:7px;
          flex-shrink:0; opacity:0.55;
          transition: opacity 0.2s;
        }
        .svcItem:hover .svcItem__dot { opacity:1; }
        .svcItem__body { flex:1; display:flex; flex-direction:column; gap:2px; min-width:0; }
        .svcItem__name {
          font-family:var(--font-display,Inter,sans-serif); font-weight:700;
          font-size:0.84rem; color:rgba(255,255,255,0.88); line-height:1.25;
          transition: color 0.2s;
          white-space: nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .svcItem__desc {
          font-size:0.74rem; color:rgba(255,255,255,0.38); line-height:1.4;
          display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
        }
        .svcItem__arr {
          font-size:0.9rem; color:rgba(255,153,51,0.70);
          opacity:0; transform:translateX(-4px);
          transition:all 0.18s ease; margin-top:4px; flex-shrink:0;
        }
        /* Mobile */
        @media (max-width: 900px) {
          .svcPanel__inner { grid-template-columns:1fr; height:auto; }
          .svcPanel__divider { display:none; }
          .svcPanel__left { padding:20px 20px 0; overflow-y:visible; height:auto; }
          .svcPanel__right { height:360px; }
          .svcItems { grid-template-columns:1fr; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    storage.set("itp_theme", theme);
    const btn = $("#themeToggle");
    if (btn) {
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      btn.title = btn.getAttribute("aria-label") || "Toggle theme";
      btn.textContent = theme === "dark" ? "☀" : "◐";
    }
  }

  function initTheme() {
    const saved = storage.get("itp_theme");
    const initial = saved === "dark" || saved === "light" ? saved : "light";
    setTheme(initial);
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.id === "themeToggle") {
        const cur = document.documentElement.getAttribute("data-theme") || "light";
        setTheme(cur === "dark" ? "light" : "dark");
      }
    });
  }

  function initLoader() {
    const el = $("#loader");
    if (!el) return;
    window.setTimeout(() => el.classList.add("is-hidden"), 350);
    window.setTimeout(() => el.remove(), 900);
  }

  function initScrollProgress() {
    const bar = $(".scrollProgress__bar");
    if (!bar) return;
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = clamp((window.scrollY / max) * 100, 0, 100);
      bar.style.width = pct.toFixed(2) + "%";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function initNavbar() {
    const navbar = $("[data-navbar]");
    if (!navbar) return;

    const onScroll = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const closeAllMega = () => {
      $$("[data-mega]").forEach((m) => m.classList.remove("is-open"));
      $$("[data-mega-btn]").forEach((b) => b.setAttribute("aria-expanded", "false"));
    };

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;

      const megaBtn = t.closest("[data-mega-btn]");
      if (megaBtn) {
        const id = megaBtn.getAttribute("data-mega-btn");
        const mega = id ? $(`[data-mega="${id}"]`) : null;
        const isOpen = mega?.classList.contains("is-open");
        closeAllMega();
        if (mega && !isOpen) {
          mega.classList.add("is-open");
          megaBtn.setAttribute("aria-expanded", "true");
        }
        return;
      }

      if (t.closest("[data-mega]")) return;
      closeAllMega();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllMega();
    });

    // Services journey panel — category hover interaction
    initSvcPanel();
  }

  function initSvcPanel() {
    const serviceRoutes = {
      startup: "services/startup.html",
      registrations: "services/registrations.html",
      trademark: "services/trademark.html",
      gst: "services/gst.html",
      incomeTax: "services/income-tax.html",
      compliance: "services/mca-compliance.html",
      businessSupport: "services/business-support.html",
      globalBusiness: "services/global-business.html",
      audit: "services/audit-assurance.html"
    };

    document.addEventListener('mouseover', (e) => {
      const cat = e.target instanceof Element ? e.target.closest('[data-svc-cat]') : null;
      if (!cat) return;
      const id = cat.getAttribute('data-svc-cat');
      document.querySelectorAll('[data-svc-cat]').forEach(c => {
        c.classList.toggle('is-active', c === cat);
      });
      document.querySelectorAll('[data-svc-services]').forEach(s => {
        s.classList.toggle('is-active', s.getAttribute('data-svc-services') === id);
      });
    });

    document.addEventListener('click', (e) => {
      const cat = e.target instanceof Element ? e.target.closest('[data-svc-cat]') : null;
      if (!cat) return;
      const id = cat.getAttribute('data-svc-cat');
      const route = serviceRoutes[id];
      if (route) {
        window.location.href = getBase() + route;
      }
    });
  }

  function initMobileMenu() {
    const menu = $("[data-mobile-menu]");
    if (!menu) return;
    const open = () => {
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
    };
    const close = () => {
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
    };

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest("[data-mobile-open]")) open();
      if (t.closest("[data-mobile-close]")) close();
      if (t === menu) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function initDeadlineBanner() {
    const key = "itp_deadline_dismissed_at";
    const dismissedAt = Number(storage.get(key) || 0);
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (dismissedAt && Date.now() - dismissedAt < sevenDays) return;

    const base = getBase();
    const afterNavbar = $("#deadlineSlot") || null;
    const host = afterNavbar || document.body;

    const wrapper = document.createElement("div");
    wrapper.className = "deadlineBanner";
    wrapper.innerHTML = `
      <div class="container deadlineBanner__inner">
        <div class="deadlineBanner__left">
          <strong aria-label="Deadline banner">⏰ ITR Filing Deadline (indicative)</strong>
          <span class="deadlineBanner__timer" data-deadline-timer>--:--:--:--</span>
          <span class="muted" style="color: rgba(255,255,255,0.86); font-size:0.92rem;">Deadlines vary by profile.</span>
        </div>
        <div class="row" style="gap:10px;">
          <a class="btn btn-sm btn-outline" style="border-color: rgba(255,255,255,0.55); color: #fff;" href="${base}services/income-tax.html">File Now →</a>
          <button class="deadlineBanner__close" type="button" aria-label="Dismiss">✕</button>
        </div>
      </div>
    `;

    if (afterNavbar) {
      afterNavbar.replaceWith(wrapper);
    } else {
      // insert right after navbar slot if possible
      const navSlot = $("#navbarSlot");
      if (navSlot && navSlot.nextSibling) {
        navSlot.parentNode.insertBefore(wrapper, navSlot.nextSibling);
      } else {
        host.insertBefore(wrapper, host.firstChild);
      }
    }

    const closeBtn = $(".deadlineBanner__close", wrapper);
    closeBtn?.addEventListener("click", () => {
      storage.set(key, String(Date.now()));
      wrapper.remove();
    });

    const timerEl = $("[data-deadline-timer]", wrapper);
    if (!timerEl) return;

    const computeTarget = () => {
      const now = new Date();
      const y = now.getFullYear();
      // July 31 23:59:59 local time (indicative)
      let target = new Date(y, 6, 31, 23, 59, 59, 0);
      if (target.getTime() <= now.getTime()) target = new Date(y + 1, 6, 31, 23, 59, 59, 0);
      return target.getTime();
    };

    const targetMs = computeTarget();

    const tick = () => {
      const left = Math.max(0, targetMs - Date.now());
      const s = Math.floor(left / 1000);
      const days = Math.floor(s / 86400);
      const hrs = Math.floor((s % 86400) / 3600);
      const mins = Math.floor((s % 3600) / 60);
      const secs = s % 60;
      timerEl.textContent = `${String(days).padStart(2, "0")}:${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    tick();
    window.setInterval(tick, 1000);
  }

  function initCountUps() {
    const els = $$('[data-count-up]');
    if (!els.length) return;

    const animate = (el) => {
      if (el.dataset.countUpDone === "1") return;
      el.dataset.countUpDone = "1";

      const to = Number(el.getAttribute("data-count-up") || "0");
      const decimals = Number(el.getAttribute("data-decimals") || "0");
      const prefix = el.getAttribute("data-prefix") || "";
      const suffix = el.getAttribute("data-suffix") || "";

      const dur = prefersReducedMotion() ? 1 : 900;
      const start = performance.now();
      const from = 0;

      const step = (now) => {
        const t = clamp((now - start) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = from + (to - from) * eased;
        const out = decimals ? val.toFixed(decimals) : Math.round(val).toString();
        el.textContent = `${prefix}${out}${suffix}`;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animate(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    els.forEach((el) => io.observe(el));
  }

  function initTabs() {
    $$('[data-tabs]').forEach((root) => {
      const tabs = $$('[role="tab"]', root);
      const panels = $$('[role="tabpanel"]', root);
      if (!tabs.length || !panels.length) return;

      const setActive = (id) => {
        tabs.forEach((t) => {
          const on = t.getAttribute('data-tab') === id;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
        });
        panels.forEach((p) => {
          const on = p.getAttribute('data-panel') === id;
          p.classList.toggle('is-active', on);
          p.hidden = !on;
        });
      };

      const initial = root.getAttribute('data-default') || tabs[0].getAttribute('data-tab');
      if (initial) setActive(initial);

      root.addEventListener('click', (e) => {
        const t = e.target;
        if (!(t instanceof Element)) return;
        const btn = t.closest('[role="tab"]');
        if (!btn) return;
        const id = btn.getAttribute('data-tab');
        if (id) setActive(id);
      });

      root.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        if (!(active instanceof HTMLElement)) return;
        if (active.getAttribute('role') !== 'tab') return;

        const idx = tabs.indexOf(active);
        if (idx < 0) return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          tabs[(idx + 1) % tabs.length].focus();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          tabs[(idx - 1 + tabs.length) % tabs.length].focus();
        }
        if (e.key === 'Home') {
          e.preventDefault();
          tabs[0].focus();
        }
        if (e.key === 'End') {
          e.preventDefault();
          tabs[tabs.length - 1].focus();
        }
        if (e.key === 'Enter' || e.key === ' ') {
          const id = active.getAttribute('data-tab');
          if (id) setActive(id);
        }
      });
    });
  }

  function initAccordions() {
    $$('[data-accordion]').forEach((root) => {
      root.addEventListener('click', (e) => {
        const t = e.target;
        if (!(t instanceof Element)) return;
        const btn = t.closest('.accBtn');
        if (!btn) return;
        const item = btn.closest('.accItem');
        if (!item) return;
        const single = root.getAttribute('data-accordion') === 'single';
        const willOpen = !item.classList.contains('is-open');
        if (single) $$('.accItem', root).forEach((x) => x.classList.remove('is-open'));
        item.classList.toggle('is-open', willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
  }

  function openModal({ title, desc } = {}) {
    const modal = $('[data-modal]');
    const backdrop = $('[data-backdrop]');
    if (!modal || !backdrop) return;
    const titleEl = $('#modalTitle', modal);
    const descEl = $('[data-modal-desc]', modal);
    if (titleEl && title) titleEl.textContent = title;
    if (descEl && desc) descEl.textContent = desc;
    backdrop.classList.add('is-open');
    modal.classList.add('is-open');
    const email = $('[data-modal-email]', modal);
    window.setTimeout(() => email?.focus(), 50);
  }

  function closeModal() {
    const modal = $('[data-modal]');
    const backdrop = $('[data-backdrop]');
    if (!modal || !backdrop) return;
    modal.classList.remove('is-open');
    backdrop.classList.remove('is-open');
  }

  function initModalSystem() {
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('[data-modal-close]')) closeModal();
      if (t.closest('[data-backdrop]')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('[data-open-lead]')) {
        openModal({
          title: 'Get Personalized Deadline Alerts',
          desc: 'Enter your email to receive monthly compliance reminders and unlock detailed calculator reports.',
        });
      }
    });

    const modal = $('[data-modal]');
    if (!modal) return;
    const submit = $('[data-modal-submit]', modal);
    submit?.addEventListener('click', () => {
      const emailInput = $('[data-modal-email]', modal);
      const email = (emailInput?.value || '').trim();
      if (!email || !email.includes('@') || !email.includes('.')) {
        emailInput?.focus();
        return;
      }
      storage.set('itp_lead_email', email);
      closeModal();

      // unlock gated blocks
      $$('.is-gated').forEach((el) => el.classList.remove('is-gated'));
      $$('.gatedHint').forEach((el) => el.remove());
    });

    // auto-unlock if already captured
    const saved = storage.get('itp_lead_email');
    if (saved) {
      $$('.is-gated').forEach((el) => el.classList.remove('is-gated'));
      $$('.gatedHint').forEach((el) => el.remove());
    }
  }

  function initChat() {
    const bubble = $('[data-chat-bubble]');
    const panel = $('[data-chat-panel]');
    if (!bubble || !panel) return;
    const closeBtn = $('[data-chat-close]', panel);
    const msgs = $('[data-chat-msgs]', panel);
    const addMsg = (text, who) => {
      if (!msgs) return;
      const div = document.createElement('div');
      div.className = `msg ${who}`;
      div.textContent = text;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    };

    const open = () => panel.classList.add('is-open');
    const close = () => panel.classList.remove('is-open');
    bubble.addEventListener('click', () => (panel.classList.contains('is-open') ? close() : open()));
    closeBtn?.addEventListener('click', close);

    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('[data-open-chat]')) open();
    });

    panel.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const quick = t.getAttribute('data-quick');
      if (!quick) return;
      addMsg(t.textContent || 'Question', 'user');
      if (quick === 'itr') addMsg('Start with the tax calculator, then upload documents. A CA reviews before e-filing.', 'bot');
      if (quick === 'gst') addMsg('Due dates depend on filing type. Use the calendar widget for reminders.', 'bot');
      if (quick === 'company') addMsg('Tell us your entity type (Pvt Ltd/LLP/OPC). We’ll share a document checklist.', 'bot');
    });
  }

  function initIncomeTaxCalculator() {
    const root = $('[data-income-tax]');
    if (!root) return;

    const incomeRange = $('[data-it-income-range]', root);
    const incomeNumber = $('[data-it-income-number]', root);
    const regimeOld = $('[data-it-regime="old"]', root);
    const regimeNew = $('[data-it-regime="new"]', root);
    const deductionsWrap = $('[data-it-deductions-wrap]', root);
    const deductions = $('[data-it-deductions]', root);
    const ageRadios = $$('input[name="age_group"]', root);

    const donut = $('[data-it-donut]', root);
    const donutCenter = $('[data-it-donut-center]', root);
    const rows = {
      gross: $('[data-it-gross]', root),
      std: $('[data-it-std]', root),
      deductions: $('[data-it-deduct]', root),
      taxable: $('[data-it-taxable]', root),
      tax: $('[data-it-tax]', root),
      cess: $('[data-it-cess]', root),
      total: $('[data-it-total]', root),
    };

    const standardDeduction = 50000;

    const readState = () => {
      const income = clamp(Number(incomeNumber?.value || 0), 0, 5000000);
      const isOld = regimeOld?.getAttribute('aria-pressed') === 'true';
      const age = ageRadios.find((r) => r.checked)?.value || 'below60';
      const ded = clamp(Number(deductions?.value || 0), 0, 2000000);
      return { income, isOld, age, ded };
    };

    const slabTax = (income, slabs) => {
      let tax = 0;
      for (const s of slabs) {
        const from = s.from;
        const to = s.to;
        const rate = s.rate;
        if (income <= from) continue;
        const taxable = Math.min(income, to) - from;
        tax += taxable * rate;
      }
      return tax;
    };

    const compute = () => {
      const { income, isOld, age, ded } = readState();
      const std = standardDeduction;
      const deductible = isOld ? ded : 0;

      if (deductionsWrap) deductionsWrap.style.display = isOld ? 'block' : 'none';

      const taxableIncome = Math.max(0, income - std - deductible);

      const oldBasicExemption = age === 'below60' ? 250000 : age === 'senior' ? 300000 : 500000;

      const oldSlabs = [
        { from: oldBasicExemption, to: 500000, rate: 0.05 },
        { from: 500000, to: 1000000, rate: 0.2 },
        { from: 1000000, to: Number.POSITIVE_INFINITY, rate: 0.3 },
      ];

      const newSlabs = [
        { from: 300000, to: 600000, rate: 0.05 },
        { from: 600000, to: 900000, rate: 0.1 },
        { from: 900000, to: 1200000, rate: 0.15 },
        { from: 1200000, to: 1500000, rate: 0.2 },
        { from: 1500000, to: Number.POSITIVE_INFINITY, rate: 0.3 },
      ];

      const baseTax = slabTax(taxableIncome, isOld ? oldSlabs : newSlabs);
      const cess = baseTax * 0.04;
      const total = baseTax + cess;
      const net = Math.max(0, income - total);

      if (donut) {
        const fraction = income > 0 ? clamp(total / income, 0, 1) : 0;
        donut.style.setProperty('--donut-tax', (fraction * 360).toFixed(2) + 'deg');
      }
      if (donutCenter) donutCenter.innerHTML = `<div class="mono" style="font-weight:800; font-size:1.35rem;">${fmtINR(total)}</div><div class="muted" style="font-size:0.92rem;">Estimated tax</div>`;

      if (rows.gross) rows.gross.textContent = fmtINR(income);
      if (rows.std) rows.std.textContent = fmtINR(std);
      if (rows.deductions) rows.deductions.textContent = isOld ? fmtINR(deductible) : '—';
      if (rows.taxable) rows.taxable.textContent = fmtINR(taxableIncome);
      if (rows.tax) rows.tax.textContent = fmtINR(baseTax);
      if (rows.cess) rows.cess.textContent = fmtINR(cess);
      if (rows.total) rows.total.textContent = fmtINR(total);

      const netEl = $('[data-it-net]', root);
      if (netEl) netEl.textContent = fmtINR(net);
    };

    const syncIncome = (value) => {
      const v = clamp(Number(value || 0), 0, 5000000);
      if (incomeNumber) incomeNumber.value = String(v);
      if (incomeRange) incomeRange.value = String(v);
      compute();
    };

    incomeRange?.addEventListener('input', () => syncIncome(incomeRange.value));
    incomeNumber?.addEventListener('input', () => syncIncome(incomeNumber.value));
    deductions?.addEventListener('input', compute);
    ageRadios.forEach((r) => r.addEventListener('change', compute));

    const setRegime = (which) => {
      if (!regimeOld || !regimeNew) return;
      regimeOld.setAttribute('aria-pressed', which === 'old' ? 'true' : 'false');
      regimeNew.setAttribute('aria-pressed', which === 'new' ? 'true' : 'false');
      compute();
    };
    regimeOld?.addEventListener('click', () => setRegime('old'));
    regimeNew?.addEventListener('click', () => setRegime('new'));

    const unlockHint = $('[data-it-gate]', root);
    if (unlockHint && !storage.get('itp_lead_email')) {
      unlockHint.innerHTML = `<div class="gatedHint" style="margin-top:12px;"><button class="btn btn-primary" type="button" data-open-lead>Get Detailed Report</button> <span class="muted" style="margin-left:10px;">Email required to unlock full breakdown.</span></div>`;
      root.classList.add('is-gated');
    }

    compute();
  }

  function initGSTCalculator() {
    const root = $('[data-gst]');
    if (!root) return;
    const amount = $('[data-gst-amount]', root);
    const rate = $('[data-gst-rate]', root);
    const addBtn = $('[data-gst-dir="add"]', root);
    const remBtn = $('[data-gst-dir="remove"]', root);

    const out = {
      cgst: $('[data-gst-cgst]', root),
      sgst: $('[data-gst-sgst]', root),
      gst: $('[data-gst-total]', root),
      final: $('[data-gst-final]', root),
    };

    const state = { dir: 'add' };

    const setDir = (dir) => {
      state.dir = dir;
      addBtn?.setAttribute('aria-pressed', dir === 'add' ? 'true' : 'false');
      remBtn?.setAttribute('aria-pressed', dir === 'remove' ? 'true' : 'false');
      compute();
    };

    const compute = () => {
      const base = Math.max(0, Number(amount?.value || 0));
      const r = Number((rate?.value || '18').replace('%', '')) / 100;
      if (!Number.isFinite(r) || r <= 0) return;

      let gst = 0;
      let final = 0;
      if (state.dir === 'add') {
        gst = base * r;
        final = base + gst;
      } else {
        // base includes GST; remove it
        final = base;
        gst = final - final / (1 + r);
      }
      const cgst = gst / 2;
      const sgst = gst / 2;
      if (out.cgst) out.cgst.textContent = fmtINR(cgst);
      if (out.sgst) out.sgst.textContent = fmtINR(sgst);
      if (out.gst) out.gst.textContent = fmtINR(gst);
      if (out.final) out.final.textContent = fmtINR(state.dir === 'add' ? final : final - gst);
      const dirLabel = $('[data-gst-dirlabel]', root);
      if (dirLabel) dirLabel.textContent = state.dir === 'add' ? 'Final Amount' : 'Base Amount';
    };

    let debounce = 0;
    const schedule = () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(compute, 140);
    };

    amount?.addEventListener('input', schedule);
    rate?.addEventListener('change', compute);
    addBtn?.addEventListener('click', () => setDir('add'));
    remBtn?.addEventListener('click', () => setDir('remove'));

    setDir('add');
  }

  function initTDSCalculator() {
    const root = $('[data-tds]');
    if (!root) return;
    const paymentType = $('[data-tds-type]', root);
    const amount = $('[data-tds-amount]', root);
    const panYes = $('[data-tds-pan="yes"]', root);
    const panNo = $('[data-tds-pan="no"]', root);
    const warn = $('[data-tds-warn]', root);
    const out = {
      rate: $('[data-tds-rate]', root),
      tds: $('[data-tds-tds]', root),
      net: $('[data-tds-net]', root),
    };

    const state = { pan: 'yes' };

    const rates = {
      salary: 0.1,
      professional: 0.1,
      rent: 0.1,
      commission: 0.05,
      contractor: 0.01,
    };

    const setPan = (pan) => {
      state.pan = pan;
      panYes?.setAttribute('aria-pressed', pan === 'yes' ? 'true' : 'false');
      panNo?.setAttribute('aria-pressed', pan === 'no' ? 'true' : 'false');
      compute();
    };

    const compute = () => {
      const amt = Math.max(0, Number(amount?.value || 0));
      const type = paymentType?.value || 'professional';
      let rate = rates[type] ?? 0.1;
      if (state.pan === 'no') rate = 0.2;

      const tds = amt * rate;
      const net = amt - tds;
      if (out.rate) out.rate.textContent = (rate * 100).toFixed(1).replace('.0', '') + '%';
      if (out.tds) out.tds.textContent = fmtINR(tds);
      if (out.net) out.net.textContent = fmtINR(net);
      if (warn) warn.style.display = state.pan === 'no' ? 'block' : 'none';
    };

    paymentType?.addEventListener('change', compute);
    amount?.addEventListener('input', compute);
    panYes?.addEventListener('click', () => setPan('yes'));
    panNo?.addEventListener('click', () => setPan('no'));

    setPan('yes');
  }

  function initPricingConfigurator() {
    const root = $('[data-pricing]');
    if (!root) return;

    const items = $$('[data-price-item]', root);
    const summary = $('[data-price-summary]', root);
    const totalEl = $('[data-price-total]', root);
    const discountEl = $('[data-price-discount]', root);

    const compute = () => {
      const selected = items
        .filter((i) => (i instanceof HTMLInputElement ? i.checked : false))
        .map((i) => {
          const id = i.getAttribute('data-id') || 'item';
          const label = i.getAttribute('data-label') || id;
          const price = Number(i.getAttribute('data-price') || 0);
          return { id, label, price };
        });

      const subtotal = selected.reduce((a, b) => a + b.price, 0);
      const discount = selected.length >= 3 ? subtotal * 0.15 : 0;
      const total = subtotal - discount;

      if (summary) {
        summary.innerHTML = selected.length
          ? selected
            .map(
              (s) =>
                `<div class="line"><span>${s.label}</span><span class="mono">${fmtINR(s.price)}</span></div>`
            )
            .join('')
          : `<div class="muted">Select services to build your pack.</div>`;
      }
      if (discountEl) discountEl.style.display = selected.length >= 3 ? 'block' : 'none';
      if (totalEl) totalEl.textContent = fmtINR(total);
    };

    items.forEach((i) => i.addEventListener('change', compute));
    compute();
  }

  function initTestimonialsCarousel() {
    const car = $('[data-carousel]');
    if (!car) return;
    if (prefersReducedMotion()) return;

    let timer = 0;
    const step = () => {
      const card = $('.tCard', car);
      const dx = (card?.getBoundingClientRect().width || 320) + 12;
      car.scrollBy({ left: dx, behavior: 'smooth' });
      if (car.scrollLeft + car.clientWidth >= car.scrollWidth - 8) {
        car.scrollTo({ left: 0, behavior: 'smooth' });
      }
    };

    const start = () => {
      timer = window.setInterval(step, 2600);
    };
    const stop = () => {
      window.clearInterval(timer);
    };

    car.addEventListener('mouseenter', stop);
    car.addEventListener('mouseleave', start);
    start();
  }

  function initComplianceCalendar() {
    const root = $('[data-calendar]');
    if (!root) return;

    const scope = root.closest('section') || document;

    const monthLabel = $('[data-cal-month]', root);
    const grid = $('[data-cal-grid]', root);
    const pop = $('[data-popover]');
    const chips = $$('[data-cal-chip]', scope);

    const eventsRaw = [
      { m: 6, d: 31, type: 'ITR', color: 'itr', label: 'Last date for ITR filing (non-audit)' },
      { m: 7, d: 11, type: 'GST', color: 'gst', label: 'GSTR-1 due for monthly filers' },
      { m: 8, d: 30, type: 'ITR', color: 'itr', label: 'ITR due for businesses requiring audit' },
      { m: 9, d: 15, type: 'TDS', color: 'tds', label: 'TDS return filing deadline' },
    ];

    const y = new Date().getFullYear();
    const events = eventsRaw.map((e) => ({ ...e, date: new Date(y, e.m, e.d) }));
    const now = new Date();
    const upcoming = events
      .map((e) => ({ ...e, t: e.date.getTime() }))
      .filter((e) => e.t >= new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime())
      .sort((a, b) => a.t - b.t)[0];

    let view = upcoming ? new Date(upcoming.date) : new Date();
    let filter = 'ALL';

    const eventKey = (m, d) => `${m}-${d}`;
    const eventMap = new Map();
    for (const e of events) {
      const key = eventKey(e.date.getMonth(), e.date.getDate());
      const list = eventMap.get(key) || [];
      list.push(e);
      eventMap.set(key, list);
    }

    const setFilter = (f) => {
      filter = f;
      chips.forEach((c) => c.setAttribute('aria-pressed', c.getAttribute('data-cal-chip') === f ? 'true' : 'false'));
      render();
    };

    const render = () => {
      if (!grid) return;
      const month = view.getMonth();
      const year = view.getFullYear();
      const first = new Date(year, month, 1);
      const startDay = first.getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      if (monthLabel) {
        monthLabel.textContent = first.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
      }

      const cells = [];
      for (let i = 0; i < startDay; i++) {
        cells.push(`<div class="calCell" aria-hidden="true"></div>`);
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const list = eventMap.get(eventKey(month, d)) || [];
        const filtered =
          filter === 'ALL'
            ? list
            : list.filter((e) => (filter === 'ITR' ? e.type === 'ITR' : filter === 'GST' ? e.type === 'GST' : e.type === 'TDS'));
        const dots = filtered
          .map((e) => `<span class="dot dot--${e.color}" aria-hidden="true"></span>`)
          .join('');
        const clickable = filtered.length ? 'is-clickable' : '';
        const data = filtered.length ? `data-cal-day="${d}"` : '';
        cells.push(
          `<div class="calCell ${clickable}" ${data}>
            <div class="calDate">${d}</div>
            <div class="dots">${dots}</div>
          </div>`
        );
      }
      grid.innerHTML = cells.join('');
    };

    scope.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const chip = t.closest('[data-cal-chip]');
      if (chip) {
        const f = chip.getAttribute('data-cal-chip') || 'ALL';
        setFilter(f);
        return;
      }
      const dayEl = t.closest('[data-cal-day]');
      if (!dayEl) return;
      const day = Number(dayEl.getAttribute('data-cal-day') || 0);
      const list = eventMap.get(eventKey(view.getMonth(), day)) || [];
      const filtered = filter === 'ALL' ? list : list.filter((x) => x.type === filter);
      if (!filtered.length) return;

      const rect = dayEl.getBoundingClientRect();
      if (pop) {
        pop.classList.add('is-open');
        pop.style.left = Math.min(window.innerWidth - 380, Math.max(12, rect.left)).toFixed(0) + 'px';
        pop.style.top = (rect.bottom + 10).toFixed(0) + 'px';
        pop.innerHTML = `
          <div class="stack" style="gap:10px;">
            <div style="font-family: var(--font-display); font-weight:800;">Due dates</div>
            ${filtered
            .map(
              (ev) =>
                `<div class="row" style="justify-content: space-between;">
                    <div>
                      <div style="font-weight:800;">${ev.type}</div>
                      <div class="muted" style="font-size:0.92rem;">${ev.label}</div>
                    </div>
                    <span class="badge badge--${ev.color === 'itr' ? 'saffron' : ev.color === 'gst' ? 'green' : 'navy'}">${ev.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                  </div>`
            )
            .join('')}
            <div class="row wrap">
              <button class="btn btn-primary" type="button" data-open-lead>Set Reminder</button>
              <button class="btn btn-ghost" type="button" data-pop-close>Close</button>
            </div>
          </div>`;
      }
    });

    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('[data-pop-close]')) {
        const popover = $('[data-popover]');
        popover?.classList.remove('is-open');
      }
      if (!t.closest('[data-popover]') && !t.closest('[data-cal-day]')) {
        const popover = $('[data-popover]');
        popover?.classList.remove('is-open');
      }
    });

    render();
    setFilter('ALL');
  }

  function initBeforeAfterSlider() {
    $$('[data-before-after]').forEach((root) => {
      const range = $('[data-ba-range]', root);
      const clip = $('[data-ba-clip]', root);
      const handle = $('[data-ba-handle]', root);
      if (!range || !clip || !handle) return;

      const set = (pct) => {
        const p = clamp(pct, 0, 100);
        clip.style.width = p.toFixed(1) + '%';
        handle.style.left = p.toFixed(1) + '%';
      };
      range.addEventListener('input', () => set(Number(range.value || 50)));
      set(Number(range.value || 50));
    });
  }

  function initDocumentVault() {
    const root = $('[data-docvault]');
    if (!root) return;
    const zone = $('[data-dropzone]', root);
    const input = $('[data-file-input]', root);
    const list = $('[data-file-list]', root);
    if (!zone || !input || !list) return;

    const allowed = new Set([
      'application/pdf',
      'image/png',
      'image/jpeg',
    ]);

    const humanSize = (bytes) => {
      const b = Number(bytes);
      if (!Number.isFinite(b) || b <= 0) return '0 B';
      const units = ['B', 'KB', 'MB', 'GB'];
      const i = Math.min(units.length - 1, Math.floor(Math.log(b) / Math.log(1024)));
      const v = b / Math.pow(1024, i);
      return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
    };

    const addFile = (file) => {
      if (!allowed.has(file.type)) {
        openModal({
          title: 'Unsupported file type',
          desc: 'Please upload PDF, PNG, or JPG files (demo validation).',
        });
        return;
      }

      const card = document.createElement('div');
      card.className = 'card cardPad';
      card.innerHTML = `
        <div class="row" style="justify-content: space-between; align-items:flex-start;">
          <div>
            <div style="font-family: var(--font-display); font-weight:800;">${file.name}</div>
            <div class="muted" style="margin-top:6px; font-size:0.92rem;">${humanSize(file.size)} • ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
          <span class="badge badge--saffron" data-status>Pending</span>
        </div>
        <div style="margin-top:12px;">
          <div style="height:8px; border-radius:999px; background: rgba(226,230,234,1); overflow:hidden;">
            <div data-progress style="height:100%; width:0%; background: var(--color-saffron);"></div>
          </div>
        </div>
        <div class="row wrap" style="margin-top:12px;">
          <a class="btn btn-sm btn-outline" data-download href="#" download>Download</a>
          <button class="btn btn-sm btn-ghost" type="button" data-remove>Remove</button>
        </div>
      `;

      const download = $('[data-download]', card);
      const remove = $('[data-remove]', card);
      const status = $('[data-status]', card);
      const prog = $('[data-progress]', card);

      const url = URL.createObjectURL(file);
      if (download) download.href = url;
      remove?.addEventListener('click', () => {
        URL.revokeObjectURL(url);
        card.remove();
      });

      list.prepend(card);

      // Simulate upload
      let p = 0;
      const timer = window.setInterval(() => {
        p += 8 + Math.random() * 14;
        p = Math.min(100, p);
        if (prog) prog.style.width = p.toFixed(0) + '%';
        if (p >= 100) {
          window.clearInterval(timer);
          if (status) {
            status.className = 'badge badge--green';
            status.textContent = 'Verified';
          }
          if (prog) prog.style.background = 'var(--color-green)';
        }
      }, prefersReducedMotion() ? 20 : 120);
    };

    const handleFiles = (files) => {
      Array.from(files || []).forEach(addFile);
    };

    zone.addEventListener('click', () => input.click());
    zone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        input.click();
      }
    });
    input.addEventListener('change', () => {
      handleFiles(input.files);
      input.value = '';
    });

    const setDrag = (on) => {
      zone.style.borderColor = on ? 'rgba(247, 138, 14, 0.55)' : 'var(--border)';
      zone.style.background = on ? 'rgba(247, 138, 14, 0.08)' : '';
    };

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      setDrag(true);
    });
    zone.addEventListener('dragleave', () => setDrag(false));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      setDrag(false);
      handleFiles(e.dataTransfer?.files);
    });
  }

  function initCustomCursor() {
    if (!isDesktopPointer()) return;
    if (prefersReducedMotion()) return;

    const dot = $('.cursorDot');
    const ring = $('.cursorRing');
    if (!dot || !ring) return;

    const show = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };
    const hide = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    document.addEventListener('mousemove', (e) => {
      show();
      const x = e.clientX;
      const y = e.clientY;
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      ring.style.left = x + 'px';
      ring.style.top = y + 'px';
    });
    document.addEventListener('mouseleave', hide);

    const hoverSel = 'a, button, input, select, textarea, [data-cursor-hover]';
    document.addEventListener('mouseover', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest(hoverSel)) ring.classList.add('is-hover');
    });
    document.addEventListener('mouseout', () => ring.classList.remove('is-hover'));
  }

  function initNewsletter() {
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (!form.matches('[data-newsletter]')) return;
      e.preventDefault();
      openModal({
        title: 'You’re subscribed!',
        desc: 'Thanks — you’ll receive monthly compliance reminders. (Demo UX: no email is actually sent.)',
      });
      form.reset();
    });
  }

  function initContactForm() {
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (!form.matches('[data-contact]')) return;
      e.preventDefault();

      const fd = new FormData(form);
      const name = fd.get('name');
      openModal({
        title: 'Thanks — we got your message',
        desc: `We’ll reach out shortly${name ? `, ${String(name)}` : ''}. (Demo UX: no message is actually sent.)`,
      });
      form.reset();
    });
  }

  function initPageReady() {
    // allow CSS entrance animation after layout + loader
    window.setTimeout(() => document.documentElement.classList.add('page-ready'), 30);
  }

  function createLoaderEl() {
    const el = document.createElement('div');
    el.id = 'loader';
    el.className = 'loader';
    el.setAttribute('aria-hidden', 'true');
    const spokes = Array.from({length: 24}, (_, i) =>
      `<line x1="50" y1="42" x2="50" y2="12" transform="rotate(${i * 15} 50 50)"/>`
    ).join('');
    el.innerHTML = `
      <div class="loaderInner">
        <div class="loaderRing"></div>
        <svg class="chakra-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#0D4A8A" stroke-width="3"/>
          <circle cx="50" cy="50" r="8" fill="none" stroke="#0D4A8A" stroke-width="2.5"/>
          <circle cx="50" cy="50" r="3" fill="#0D4A8A"/>
          <g stroke="#0D4A8A" stroke-width="1.5" stroke-linecap="round">${spokes}</g>
        </svg>
      </div>
      <div class="loaderBrand"><span class="ind">Ind</span><span class="tax">Tax</span><span class="pay">Pay</span></div>
    `;
    return el;
  }

  function initPageTransitionLoader() {
    // Show loader on page load (all pages)
    const existing = $('#loader');
    if (existing) {
      window.setTimeout(() => existing.classList.add('is-hidden'), 400);
      window.setTimeout(() => existing.remove(), 1000);
    } else {
      const el = createLoaderEl();
      document.body.insertBefore(el, document.body.firstChild);
      window.setTimeout(() => el.classList.add('is-hidden'), 400);
      window.setTimeout(() => el.remove(), 1000);
    }

    // Show loader when navigating to any internal page
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const anchor = t.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      // skip: external, hash-only, mailto, tel, JS links
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto') ||
        href.startsWith('tel') ||
        href.startsWith('javascript') ||
        anchor.target === '_blank'
      ) return;

      e.preventDefault();
      const dest = href;

      // inject loader
      const loader = createLoaderEl();
      document.body.insertBefore(loader, document.body.firstChild);

      // navigate after a short delay so animation is visible
      window.setTimeout(() => { window.location.href = dest; }, 450);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectLayout();

    initTheme();
    initPageTransitionLoader();
    initScrollProgress();
    initNavbar();
    initMobileMenu();
    initModalSystem();
    initChat();
    initCountUps();
    initTabs();
    initAccordions();
    initIncomeTaxCalculator();
    initGSTCalculator();
    initTDSCalculator();
    initPricingConfigurator();
    initTestimonialsCarousel();
    initComplianceCalendar();
    initBeforeAfterSlider();
    initDocumentVault();
    initCustomCursor();
    initNewsletter();
    initContactForm();
    initPageReady();
  });
})();
