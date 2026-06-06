/**
 * LiviQue Space — Interactive Scripts
 * Scroll animations, navigation, portfolio filtering, and form handling
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========== NAVBAR SCROLL EFFECT ==========
  const navbar = document.getElementById('navbar');
  const heroSection = document.getElementById('hero');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Run on load

  // ========== MOBILE NAV TOGGLE ==========
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ========== ACTIVE NAV LINK HIGHLIGHT ==========
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = navLinks.querySelector(`a[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ========== HERO LOAD ANIMATION ==========
  setTimeout(() => {
    heroSection.classList.add('loaded');
  }, 100);

  // ========== SCROLL REVEAL ANIMATIONS ==========
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========== COUNTER ANIMATION ==========
  const statNumbers = document.querySelectorAll('.about-stat-number');

  const animateCounter = (el) => {
    const text = el.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[0]);
    const suffix = text.replace(match[0], '');
    const duration = 2000;
    const step = Math.max(1, Math.floor(target / 60));
    let current = 0;
    const startTime = performance.now();

    const update = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(target * eased);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // ========== PORTFOLIO FILTERING ==========
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach((item, index) => {
        const category = item.dataset.category;

        if (filter === 'all' || category === filter) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          item.style.display = '';

          setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, index * 80);
        } else {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';

          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ========== CONTACT FORM HANDLING ==========
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value;
    const phone = document.getElementById('contact-phone').value;
    const space = document.getElementById('contact-space').value;
    const message = document.getElementById('contact-message').value;

    // Create WhatsApp message
    const whatsappMessage = encodeURIComponent(
      `Hi LiviQue Space! 👋\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Space Type:* ${space}\n` +
      `*Message:* ${message}`
    );

    const whatsappUrl = `https://wa.me/917386218844?text=${whatsappMessage}`;

    // Show success feedback
    const submitBtn = document.getElementById('contact-submit-btn');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      Message Sent!
    `;
    submitBtn.style.background = '#25D366';
    submitBtn.style.borderColor = '#25D366';

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      submitBtn.innerHTML = originalHTML;
      submitBtn.style.background = '';
      submitBtn.style.borderColor = '';
      contactForm.reset();
    }, 1000);
  });

  // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ========== PARALLAX EFFECT ON HERO ==========
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const heroBg = document.querySelector('.hero-bg img');
        if (heroBg && scrolled < window.innerHeight) {
          heroBg.style.transform = `scale(${1 + scrolled * 0.0002}) translateY(${scrolled * 0.3}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ========== SKILL TAGS HOVER EFFECT ==========
  const skillTags = document.querySelectorAll('.skill-tag');
  skillTags.forEach((tag, i) => {
    tag.style.animationDelay = `${i * 0.1}s`;
  });

  // ========== DEVELOPER LOCK SCREEN LOGIC ==========
  const lockScreen = document.getElementById('dev-lock-screen');
  const lockForm = document.getElementById('lockForm');
  const lockIdInput = document.getElementById('lock-id');
  const lockPassInput = document.getElementById('lock-pass');
  const lockRememberCheckbox = document.getElementById('lock-remember-me');
  const lockErrorMsg = document.getElementById('lock-error');
  const lockContainer = document.querySelector('.lock-container');

  // Hardcoded developer credentials
  const AUTH_ID = 'livique';
  const AUTH_PASS = 'design2026';

  if (lockForm) {
    lockForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredId = lockIdInput.value.trim();
      const enteredPass = lockPassInput.value;

      if (enteredId === AUTH_ID && enteredPass === AUTH_PASS) {
        // Correct credentials
        if (lockRememberCheckbox && lockRememberCheckbox.checked) {
          localStorage.setItem('livique_authorized', 'true');
        } else {
          sessionStorage.setItem('livique_authorized', 'true');
        }

        // Change layout/state classes
        document.documentElement.classList.remove('locked');
        document.documentElement.classList.add('authorized');

        // Premium fade-out transition
        lockScreen.classList.add('fade-out');
        setTimeout(() => {
          lockScreen.style.display = 'none';
        }, 600); // matches the transition-slow (0.6s)
      } else {
        // Incorrect credentials
        lockErrorMsg.textContent = 'Invalid Access ID or Password. Please try again.';
        lockContainer.classList.add('shake');
        lockPassInput.value = '';
        lockPassInput.focus();

        // Clear shake class after animation completes
        setTimeout(() => {
          lockContainer.classList.remove('shake');
        }, 400);
      }
    });
  }

  // Double check authorization on script load
  const isAuthorized = localStorage.getItem('livique_authorized') === 'true' ||
                       sessionStorage.getItem('livique_authorized') === 'true';

  if (isAuthorized) {
    document.documentElement.classList.remove('locked');
    document.documentElement.classList.add('authorized');
    if (lockScreen) {
      lockScreen.style.display = 'none';
    }
  } else {
    document.documentElement.classList.add('locked');
    document.documentElement.classList.remove('authorized');
  }

  // ========== PRELOADER / PAGE READY ==========
  document.body.classList.add('loaded');

});
