// ===========================
// NimbusWiz Tech — script.js
// Redesigned for JoinDevOps style
// ===========================

(function () {
  'use strict';

  /* ---- PARTICLE SYSTEM (Hero) ---- */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const PARTICLE_COUNT = 80;

    function resizeCanvas() {
      W = canvas.width = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
    }

    function lerp(a, b, t) { return a + (b - a) * t; }

    function makeColor(t) {
      if (t < 0.5) {
        const s = t / 0.5;
        return `rgba(${~~lerp(59,124,s)},${~~lerp(130,58,s)},${~~lerp(246,237,s)},`;
      } else {
        const s = (t - 0.5) / 0.5;
        return `rgba(${~~lerp(124,6,s)},${~~lerp(58,182,s)},${~~lerp(237,212,s)},`;
      }
    }

    function createParticle() {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.2 + Math.random() * 0.4;
      const t = Math.random();
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 3,
        t,
        colorBase: makeColor(t),
        opacity: 0.3 + Math.random() * 0.4,
        life: 0,
        maxLife: 250 + Math.random() * 400
      };
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = createParticle();
        p.life = Math.random() * p.maxLife;
        particles.push(p);
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.life++;
        if (p.life > p.maxLife) { particles[i] = createParticle(); return; }
        p.x += p.vx + Math.sin(p.life * 0.015) * 0.2;
        p.y += p.vy + Math.cos(p.life * 0.015) * 0.15;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        const lifeRatio = p.life / p.maxLife;
        const fade = lifeRatio < 0.1 ? lifeRatio / 0.1 : lifeRatio > 0.9 ? (1 - lifeRatio) / 0.1 : 1;
        const alpha = p.opacity * fade;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.colorBase + alpha + ')';
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
  }

  /* ---- CONTACT SECTION CANVAS ---- */
  const contactCanvas = document.getElementById('contact-canvas');
  if (contactCanvas) {
    const ctxC = contactCanvas.getContext('2d');
    let cP = [];

    function initCC() {
      contactCanvas.width = contactCanvas.parentElement.offsetWidth;
      contactCanvas.height = contactCanvas.parentElement.offsetHeight;
      cP = [];
      for (let i = 0; i < 50; i++) {
        const t = Math.random();
        cP.push({
          x: Math.random() * contactCanvas.width,
          y: Math.random() * contactCanvas.height,
          size: 1 + Math.random() * 2.5,
          colorBase: t < 0.5
            ? `rgba(59,130,246,`
            : `rgba(124,58,237,`,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          opacity: 0.2 + Math.random() * 0.3
        });
      }
    }

    function animCC() {
      if (!contactCanvas.width) return;
      ctxC.clearRect(0, 0, contactCanvas.width, contactCanvas.height);
      cP.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > contactCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > contactCanvas.height) p.vy *= -1;
        ctxC.beginPath();
        ctxC.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctxC.fillStyle = p.colorBase + p.opacity + ')';
        ctxC.fill();
      });
      requestAnimationFrame(animCC);
    }

    setTimeout(() => { initCC(); animCC(); }, 100);
    window.addEventListener('resize', initCC);
  }

  /* ---- ANNOUNCEMENT BAR ---- */
  const annBar = document.getElementById('announcement-bar');
  const annClose = document.getElementById('announcement-close');
  if (annClose && annBar) {
    annClose.addEventListener('click', () => annBar.classList.add('hidden'));
  }

  /* ---- NAV SCROLL EFFECT ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ---- NAV ACTIVE STATE ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(s => observer.observe(s));
  }

  /* ---- HAMBURGER MENU ---- */
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', (!isOpen).toString());
      mobileMenu.setAttribute('aria-hidden', isOpen.toString());
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ---- STAT COUNTERS ---- */
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

  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(el, target);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i * 0.07) + 's';
      revealObs.observe(el);
    });
  }

  /* ---- COURSES TAB FILTER ---- */
  const tabs = document.querySelectorAll('.course-tab');
  const courseCards = document.querySelectorAll('.course-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-tab');

      courseCards.forEach(card => {
        const lang = card.getAttribute('data-lang') || 'english';
        if (filter === 'all' || lang === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          void card.offsetHeight;
          card.style.animation = 'fadeInUp 0.4s ease both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ---- TESTIMONIALS SLIDER ---- */
  const slider = document.getElementById('testimonials-slider');
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (slider && dotsContainer && prevBtn && nextBtn) {
    const cards = slider.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    let visibleCount = getVisibleCount();
    let totalPages = Math.ceil(totalCards / visibleCount);
    let currentPage = 0;

    function getVisibleCount() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToPage(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goToPage(page) {
      currentPage = page;
      const cardWidth = cards[0].offsetWidth + 24; // gap = 24px
      slider.style.transform = `translateX(-${currentPage * visibleCount * cardWidth}px)`;
      document.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentPage);
      });
    }

    function updateSlider() {
      visibleCount = getVisibleCount();
      totalPages = Math.ceil(totalCards / visibleCount);
      currentPage = 0;
      slider.style.transform = 'translateX(0)';
      buildDots();
    }

    prevBtn.addEventListener('click', () => {
      currentPage = (currentPage - 1 + totalPages) % totalPages;
      goToPage(currentPage);
    });
    nextBtn.addEventListener('click', () => {
      currentPage = (currentPage + 1) % totalPages;
      goToPage(currentPage);
    });

    // Auto-advance
    let autoSlide = setInterval(() => {
      currentPage = (currentPage + 1) % totalPages;
      goToPage(currentPage);
    }, 5000);

    slider.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
    slider.parentElement.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => {
        currentPage = (currentPage + 1) % totalPages;
        goToPage(currentPage);
      }, 5000);
    });

    buildDots();
    window.addEventListener('resize', updateSlider);
  }

  /* ---- CONTACT FORM ---- */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      if (!name || !email) return;

      const btn = document.getElementById('contact-submit-btn');
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Sending...';

      setTimeout(() => {
        contactForm.reset();
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Send Enquiry';
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1200);
    });
  }

})();
