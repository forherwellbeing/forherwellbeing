// ===== FOR HER WELLBEING — SHARED SITE SCRIPT =====
const WHATSAPP_NUM = '918008383699';

function initSite(activePage) {
  // NAV — inject at top of body
  document.body.insertAdjacentHTML('afterbegin', `
    <nav class="site-nav" id="site-nav">
      <div class="nav-logo"><a href="index.html"><img src="uploads/logo-1776614290085.png" alt="For Her Wellbeing"></a></div>
      <ul class="nav-links" id="nav-links">
        <li><a href="index.html" ${activePage==='home'?'class="active"':''}>Home</a></li>
        <li><a href="programs.html" ${activePage==='programs'?'class="active"':''}>Programs</a></li>
        <li><a href="symptom-quiz.html" ${activePage==='quiz'?'class="active"':''} style="color:var(--gold);font-weight:500;">Find My Program</a></li>
        <li><a href="abroad.html" ${activePage==='abroad'?'class="active"':''}>Women Abroad</a></li>
        <li><a href="courses.html" ${activePage==='courses'?'class="active"':''}>Courses</a></li>
        <li><a href="about.html" ${activePage==='about'?'class="active"':''}>About Dr. Raga</a></li>
        <li><a href="ask.html" ${activePage==='ask'?'class="active"':''}>Ask Dr. Raga</a></li>
        <li><a href="contact.html" class="nav-cta ${activePage==='contact'?'active':''}">Book — ₹1000</a></li>
      </ul>
      <button class="nav-hamburger" aria-label="Open menu" onclick="toggleMobileNav()">
        <span></span><span></span><span></span>
      </button>
    </nav>`);

  // FLOATING BUTTONS — populate placeholder
  const floatEl = document.getElementById('fhw-float');
  if (floatEl) {
    floatEl.innerHTML = `
      <div class="floating-actions">
        <a href="https://wa.me/${WHATSAPP_NUM}?text=Hi%20Dr.%20Raga%20Deepthi%2C%20I%20would%20like%20to%20know%20more."
           class="float-btn float-wa" target="_blank" aria-label="Chat on WhatsApp">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <span>WhatsApp</span>
        </a>
        <a href="contact.html" class="float-btn float-book" aria-label="Book a consultation">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>Book — ₹1000</span>
        </a>
      </div>`;
  }

  // FOOTER — populate placeholder
  const footerEl = document.getElementById('fhw-footer');
  if (footerEl) {
    footerEl.innerHTML = `
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-grid">
            <div class="footer-brand">
              <img src="uploads/logo-1776614290085.png" alt="For Her Wellbeing">
              <p class="footer-brand-desc">Science-backed holistic wellness for women — combining PhD-level metabolic science with personalised yoga, diet counselling, and compassionate community care.</p>
              <div class="footer-socials">
                <a href="https://www.instagram.com/for_her_wellbeing/" target="_blank" class="footer-social-btn">IG</a>
                <a href="https://www.linkedin.com/in/deepthiediga/" target="_blank" class="footer-social-btn">in</a>
                <a href="https://wa.me/${WHATSAPP_NUM}" target="_blank" class="footer-social-btn">WA</a>
              </div>
            </div>
            <div>
              <div class="footer-col-title">Programs</div>
              <ul class="footer-col-links">
                <li><a href="programs.html#pcos">PCOS Workshop</a></li>
                <li><a href="programs.html#obesity">Obesity Workshop</a></li>
                <li><a href="programs.html#metabolic">Metabolic Reset</a></li>
                <li><a href="programs.html#counselling">Diet Counselling</a></li>
              </ul>
            </div>
            <div>
              <div class="footer-col-title">Explore</div>
              <ul class="footer-col-links">
                <li><a href="abroad.html">Women Abroad</a></li>
                <li><a href="courses.html">Online Courses</a></li>
                <li><a href="corporate.html">Corporate & Institutional</a></li>
                <li><a href="corporate.html#institutional">IVF / Schools / Coaching</a></li>
                <li><a href="womens-health.html">Health Library</a></li>
                <li><a href="platform.html">Our Vision</a></li>
              </ul>
            </div>
            <div>
              <div class="footer-col-title">Contact</div>
              <ul class="footer-col-links">
                <li><a href="contact.html">Book — ₹1000</a></li>
                <li><a href="mailto:edigaragadeepthi@gmail.com">Email Us</a></li>
                <li><a href="https://wa.me/${WHATSAPP_NUM}" target="_blank">WhatsApp</a></li>
                <li><a href="about.html#partner">Partner With Us</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <div class="footer-copy">© 2026 For Her Wellbeing. All rights reserved.</div>
            <div class="footer-disclaimer">Educational content only — not a substitute for professional medical advice. Always consult your healthcare provider.</div>
          </div>
        </div>
      </footer>`;
  }

  // ANIMATIONS — enable after JS loads so content is always visible if JS fails
  document.documentElement.classList.add('animations-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // NAV SCROLL
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('site-nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // MANIFEST + THEME
  if (!document.querySelector('link[rel="manifest"]')) {
    const m = document.createElement('link');
    m.rel = 'manifest'; m.href = 'manifest.json';
    document.head.appendChild(m);
  }
  if (!document.querySelector('meta[name="theme-color"]')) {
    const tc = document.createElement('meta');
    tc.name = 'theme-color'; tc.content = '#4a1042';
    document.head.appendChild(tc);
  }

  // COOKIE CONSENT
  initCookieConsent();
}

function toggleMobileNav() {
  document.getElementById('nav-links').classList.toggle('mobile-open');
}
document.addEventListener('click', function(e) {
  const nav = document.getElementById('nav-links');
  const burger = document.querySelector('.nav-hamburger');
  if (nav && nav.classList.contains('mobile-open') && !nav.contains(e.target) && e.target !== burger && !burger.contains(e.target)) {
    nav.classList.remove('mobile-open');
  }
});

// Mobile nav + cookie styles
const s = document.createElement('style');
s.textContent = `
  #nav-links.mobile-open {
    display: flex !important; flex-direction: column; position: fixed;
    top: 68px; left: 0; right: 0; background: var(--white);
    padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);
    box-shadow: 0 8px 32px rgba(74,16,66,0.1); gap: 1rem; z-index: 99;
  }
  #fhw-cookie {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 998;
    background: #1e0f1f; border-top: 1px solid rgba(201,146,42,0.2);
    transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
    padding: 1rem 3rem;
  }
  #fhw-cookie.fhw-cookie-visible { transform: translateY(0); }
  .fhw-cookie-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
  .fhw-cookie-text { font-size: 0.8rem; font-weight: 300; color: rgba(255,253,249,0.6); line-height: 1.6; flex: 1; min-width: 220px; font-family: var(--sans); }
  .fhw-cookie-text strong { color: rgba(255,253,249,0.9); font-weight: 500; }
  .fhw-cookie-btns { display: flex; gap: 0.6rem; flex-shrink: 0; }
  .fhw-cookie-accept { background: var(--gold); color: var(--plum); border: none; border-radius: 50px; padding: 0.5rem 1.35rem; font-family: var(--sans); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; }
  .fhw-cookie-accept:hover { opacity: 0.85; }
  .fhw-cookie-decline { background: transparent; color: rgba(255,253,249,0.45); border: 1px solid rgba(255,253,249,0.12); border-radius: 50px; padding: 0.5rem 1.1rem; font-family: var(--sans); font-size: 0.72rem; cursor: pointer; transition: all 0.2s; }
  .fhw-cookie-decline:hover { color: rgba(255,253,249,0.8); border-color: rgba(255,253,249,0.3); }
  @media(max-width:640px) { #fhw-cookie { padding: 1rem 1.25rem; } }
`;
document.head.appendChild(s);

// ── COOKIE CONSENT ──────────────────────────────
function initCookieConsent() {
  if (localStorage.getItem('fhw_cookie')) return;
  const banner = document.createElement('div');
  banner.id = 'fhw-cookie';
  banner.innerHTML = `<div class="fhw-cookie-inner">
    <p class="fhw-cookie-text"><strong>We use cookies</strong> to remember your preferences and improve your experience. We never sell your data.</p>
    <div class="fhw-cookie-btns">
      <button class="fhw-cookie-accept" onclick="fhwCookieAccept()">Accept</button>
      <button class="fhw-cookie-decline" onclick="fhwCookieDecline()">Essential only</button>
    </div>
  </div>`;
  document.body.appendChild(banner);
  setTimeout(() => banner.classList.add('fhw-cookie-visible'), 250);
}
window.fhwCookieAccept = function() {
  localStorage.setItem('fhw_cookie', 'accepted');
  const b = document.getElementById('fhw-cookie');
  if (b) { b.classList.remove('fhw-cookie-visible'); setTimeout(() => b.remove(), 350); }
};
window.fhwCookieDecline = function() {
  localStorage.setItem('fhw_cookie', 'essential');
  const b = document.getElementById('fhw-cookie');
  if (b) { b.classList.remove('fhw-cookie-visible'); setTimeout(() => b.remove(), 350); }
};
