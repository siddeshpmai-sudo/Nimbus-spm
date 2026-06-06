// ===========================
// NimbusWiz Tech - script.js
// ===========================

(function () {
  'use strict';

  /* ---- PARTICLE SYSTEM ---- */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const PARTICLE_COUNT = 120;

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // Color palette matching the Google Antigravity reference
  function makeColor(t) {
    // t goes 0 -> 1
    // Blue (4F63FF) -> Purple (A855F7) -> Orange (FF6B35) -> Red (E84141)
    if (t < 0.33) {
      const r = lerp(79, 168, t / 0.33);
      const g = lerp(99, 85, t / 0.33);
      const b = lerp(255, 247, t / 0.33);
      return `rgba(${~~r},${~~g},${~~b},`;
    } else if (t < 0.66) {
      const s = (t - 0.33) / 0.33;
      const r = lerp(168, 255, s);
      const g = lerp(85, 107, s);
      const b = lerp(247, 53, s);
      return `rgba(${~~r},${~~g},${~~b},`;
    } else {
      const s = (t - 0.66) / 0.34;
      const r = lerp(255, 232, s);
      const g = lerp(107, 65, s);
      const b = lerp(53, 65, s);
      return `rgba(${~~r},${~~g},${~~b},`;
    }
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function createParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 0.5;
    const t = Math.random(); // position in color gradient
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 4,
      t,
      colorBase: makeColor(t),
      opacity: 0.4 + Math.random() * 0.5,
      life: 0,
      maxLife: 200 + Math.random() * 400
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife; // stagger initial life
      particles.push(p);
    }
  }

  let animFrame;
  function animateParticles() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.life++;
      if (p.life > p.maxLife) {
        particles[i] = createParticle();
        return;
      }

      // Slight sine wandering
      p.x += p.vx + Math.sin(p.life * 0.02) * 0.3;
      p.y += p.vy + Math.cos(p.life * 0.02) * 0.2;

      // Wrap around edges
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;

      // Fade in / out
      const lifeRatio = p.life / p.maxLife;
      const fadeFactor = lifeRatio < 0.1 ? lifeRatio / 0.1
        : lifeRatio > 0.9 ? (1 - lifeRatio) / 0.1 : 1;

      const alpha = p.opacity * fadeFactor;

      ctx.beginPath();
      ctx.rect(p.x, p.y, p.size * 1.8, p.size * 0.7);
      ctx.fillStyle = p.colorBase + alpha + ')';
      ctx.fill();
    });

    animFrame = requestAnimationFrame(animateParticles);
  }

  // Contact section dark canvas
  const contactCanvas = document.getElementById('contact-canvas');
  const ctxC = contactCanvas ? contactCanvas.getContext('2d') : null;
  let contactParticles = [];

  function initContactCanvas() {
    if (!contactCanvas || !ctxC) return;
    const cRect = contactCanvas.parentElement.getBoundingClientRect();
    contactCanvas.width = contactCanvas.parentElement.offsetWidth;
    contactCanvas.height = contactCanvas.parentElement.offsetHeight;

    contactParticles = [];
    for (let i = 0; i < 60; i++) {
      const t = Math.random();
      contactParticles.push({
        x: Math.random() * contactCanvas.width,
        y: Math.random() * contactCanvas.height,
        size: 1 + Math.random() * 3,
        t,
        colorBase: makeColor(t),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        opacity: 0.3 + Math.random() * 0.5
      });
    }
  }

  function animateContactCanvas() {
    if (!ctxC || !contactCanvas) return;
    ctxC.clearRect(0, 0, contactCanvas.width, contactCanvas.height);
    contactParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > contactCanvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > contactCanvas.height) p.vy *= -1;

      ctxC.beginPath();
      ctxC.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctxC.fillStyle = p.colorBase + p.opacity + ')';
      ctxC.fill();
    });
    requestAnimationFrame(animateContactCanvas);
  }

  /* ---- NAV SCROLL EFFECT ---- */
  const navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ---- HAMBURGER MENU ---- */
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', (!isOpen).toString());
    mobileMenu.setAttribute('aria-hidden', isOpen.toString());
  }

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  /* ---- COUNTER ANIMATION ---- */
  function animateCounter(el, target, duration = 2000) {
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  function initCounters() {
    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(el, target);
            observer.disconnect();
          }
        });
      }, { threshold: 0.5 });
      observer.observe(el);
    });
  }

  /* ---- SCROLL REVEAL ---- */
  function initReveal() {
    // Add reveal class to key elements
    const revealSelectors = [
      '.about-card', '.course-card', '.why-card',
      '.testimonial-card', '.section-title', '.section-subtitle'
    ];
    revealSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = (i * 0.08) + 's';
      });
    });

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  /* ---- CONTACT FORM ---- */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  function initContactForm() {
    if (!contactForm) return;
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();

      if (!name || !email) {
        // Simple validation shake
        contactForm.style.animation = 'none';
        void contactForm.offsetHeight;
        return;
      }

      // Real form submit to backend
      const btn = document.getElementById('contact-submit-btn');
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Sending...';

      try {
        const formData = new FormData(contactForm);
        const body = Object.fromEntries(formData.entries());

        const res = await fetch('/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (res.ok && data.ok) {
          contactForm.reset();
          formSuccess.textContent = '✅ ' + data.message;
          formSuccess.style.color = '#86efac';
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 6000);
        } else {
          formSuccess.textContent = '⚠️ ' + (data.error || 'Something went wrong. Please try again.');
          formSuccess.style.color = '#fca5a5';
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 6000);
        }
      } catch (err) {
        formSuccess.textContent = '⚠️ Network error. Please check your connection and try again.';
        formSuccess.style.color = '#fca5a5';
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      } finally {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Send Enquiry';
      }
    });
  }

  /* ---- SMOOTH NAV ACTIVE STATE ---- */
  function initActiveSections() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.style.color = '';
            link.style.background = '';
            if (link.getAttribute('href') === '#' + id) {
              link.style.color = 'var(--color-text)';
              link.style.background = 'rgba(0,0,0,0.05)';
            }
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ---- INIT ---- */
  function init() {
    resizeCanvas();
    initParticles();
    animateParticles();

    setTimeout(() => {
      initContactCanvas();
      animateContactCanvas();
    }, 200);

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
      initContactCanvas();
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    hamburger.addEventListener('click', toggleMenu);

    initCounters();
    initReveal();
    initContactForm();
    initActiveSections();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
