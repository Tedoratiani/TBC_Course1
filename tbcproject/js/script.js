/* ============================================================
   TECHNOVA — Vanilla JavaScript
   Author: TECHNOVA Dev Team
   ============================================================ */

'use strict';

// ─── DOM READY ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initNavbar();
  initHamburger();
  initScrollAnimations();
  initCounters();
  initProductButtons();
  initContactForm();
  initNewsletterBtn();
  initBackToTop();
  initSmoothScroll();
  initNavActiveLinks();
});

// ─── 1. CANVAS BACKGROUND ─────────────────────────────────────
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, animId;

  const colors = ['rgba(59,130,246,', 'rgba(139,92,246,', 'rgba(6,182,212,'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.3,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(59,130,246,0.03)';
    ctx.lineWidth = 1;
    const spacing = 80;
    for (let x = 0; x < W; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();

    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = 'rgba(59,130,246,' + (0.04 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(animate);
  }

  function init() {
    resize();
    createParticles(window.innerWidth < 768 ? 50 : 100);
    cancelAnimationFrame(animId);
    animate();
  }

  window.addEventListener('resize', debounce(init, 300));
  init();
}

// ─── 2. NAVBAR SCROLL EFFECT ──────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─── 3. HAMBURGER MENU ────────────────────────────────────────
function initHamburger() {
  const btn = document.getElementById('hamburger-btn');
  const nav = document.getElementById('nav-links');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'მენიუს დახურვა' : 'მენიუს გახსნა');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'მენიუს გახსნა');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar_contains(e.target, btn) && !navbar_contains(e.target, nav)) {
      btn.classList.remove('open');
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}
function navbar_contains(target, el) {
  return el && el.contains(target);
}

// ─── 4. SCROLL ANIMATIONS (IntersectionObserver) ─────────────
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

// ─── 5. ANIMATED COUNTERS ──────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));

  // Hero stat numbers
  const heroStats = document.querySelectorAll('.stat-number[data-count]');
  if (heroStats.length) {
    const heroObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count, 10);
            animateNumber(entry.target, 0, target, 1800);
            heroObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    heroStats.forEach(el => heroObs.observe(el));
  }
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  animateNumber(el, 0, target, 2000);
}

function animateNumber(el, from, to, duration) {
  const start = performance.now();
  const isLarge = to >= 1000;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(from + (to - from) * eased);

    if (isLarge) {
      el.textContent = current >= 1000
        ? (current / 1000).toFixed(current % 1000 === 0 ? 0 : 1) + 'K'
        : current.toString();
    } else {
      el.textContent = current.toString();
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      if (isLarge && to >= 1000) {
        el.textContent = (to / 1000) + 'K';
      } else {
        el.textContent = to.toString();
      }
    }
  }
  requestAnimationFrame(step);
}

// ─── 6. PRODUCT BUTTONS (Add to Cart Toast) ──────────────────
function initProductButtons() {
  const buttons = document.querySelectorAll('.product-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.product-card');
      const productName = btn.dataset.product || 'პროდუქტი';

      // Button feedback
      const originalContent = btn.innerHTML;
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        დამატებულია!
      `;
      btn.disabled = true;
      btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';

      showToast(`"${productName}" კალათაში დაემატა!`);

      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.disabled = false;
        btn.style.background = '';
      }, 2000);
    });
  });
}

// ─── 7. TOAST NOTIFICATION ────────────────────────────────────
let toastTimer = null;
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toast-msg');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.setAttribute('aria-hidden', 'false');
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.setAttribute('aria-hidden', 'true'), 400);
  }, duration);
}

// ─── 8. CONTACT FORM VALIDATION ───────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successEl = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');

    clearErrors();
    let valid = true;

    // Validate name
    if (!name.value.trim()) {
      showError('name-error', name, 'სახელის შეყვანა სავალდებულოა');
      valid = false;
    } else if (name.value.trim().length < 2) {
      showError('name-error', name, 'სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს');
      valid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      showError('email-error', email, 'ელფოსტის შეყვანა სავალდებულოა');
      valid = false;
    } else if (!emailRegex.test(email.value.trim())) {
      showError('email-error', email, 'გთხოვთ შეიყვანოთ სწორი ელფოსტა');
      valid = false;
    }

    // Validate message
    if (!message.value.trim()) {
      showError('message-error', message, 'შეტყობინების შეყვანა სავალდებულოა');
      valid = false;
    } else if (message.value.trim().length < 10) {
      showError('message-error', message, 'შეტყობინება უნდა შეიცავდეს მინიმუმ 10 სიმბოლოს');
      valid = false;
    }

    if (!valid) return;

    // Simulate submit
    const submitBtn = document.getElementById('form-submit-btn');
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" class="spin-icon">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      გაგზავნა...
    `;
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (successEl) {
        successEl.removeAttribute('aria-hidden');
      }
      showToast('შეტყობინება წარმატებით გაიგზავნა!', 4000);
    }, 1400);
  });

  // Real-time validation on blur
  const inputs = form.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errEl = document.getElementById(input.id.replace('contact-', '') + '-error');
      if (errEl) errEl.textContent = '';
    });
  });
}

function showError(errorId, inputEl, message) {
  const errEl = document.getElementById(errorId);
  if (errEl) errEl.textContent = message;
  if (inputEl) inputEl.classList.add('error');
  if (inputEl) inputEl.focus();
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
}

// ─── 9. NEWSLETTER ─────────────────────────────────────────────
function initNewsletterBtn() {
  const btn = document.getElementById('newsletter-btn');
  const input = document.getElementById('newsletter-email');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.value.trim() || !emailRegex.test(input.value.trim())) {
      input.style.borderColor = '#ef4444';
      input.focus();
      setTimeout(() => input.style.borderColor = '', 2000);
      return;
    }
    input.value = '';
    showToast('წარმატებით გამოიწერე სიახლეები!', 3500);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btn.click();
  });
}

// ─── 10. BACK TO TOP ──────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── 11. SMOOTH SCROLL ────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
}

// ─── 12. ACTIVE NAV LINKS ON SCROLL ──────────────────────────
function initNavActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const navH = 80;

  function updateActive() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - navH - 40;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}

// ─── UTILITY: DEBOUNCE ────────────────────────────────────────
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
