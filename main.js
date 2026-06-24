(function () {
  'use strict';

  var WHATSAPP_NUMBER = '542613632150';
  var DEFAULT_MESSAGE = 'Hola, quiero información sobre planes de Prevención Salud';

  var modal = document.getElementById('whatsappModal');
  var floatBtn = document.getElementById('whatsappFloat');
  var header = document.getElementById('header');
  var isModalOpen = false;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== Header Scroll State ===== */
  function initHeaderScroll() {
    function update() {
      if (!header) return;
      header.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ===== Lenis Smooth Scroll ===== */
  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return 1 - Math.pow(1 - t, 3); }
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }

    lenis.on('scroll', function (e) {
      if (header) header.classList.toggle('scrolled', e.scroll > 60);
    });
  }

  /* ===== GSAP Animations ===== */
  function initGSAP() {
    if (prefersReducedMotion) return;
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger === 'undefined') return;

    /* --- Hero: Title SplitText --- */
    var heroTitle = document.querySelector('.hero__title');
    if (heroTitle && typeof SplitText !== 'undefined') {
      var split = new SplitText(heroTitle, { type: 'chars' });
      gsap.from(split.chars, {
        y: 80,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.035
      });
    }

    /* --- Hero: Subtitle --- */
    gsap.from('.hero__subtitle', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.4,
      ease: 'power2.out'
    });

    /* --- Hero: Button --- */
    gsap.from('.hero__actions .btn', {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      delay: 0.7,
      ease: 'back.out(1.4)'
    });

    /* --- Credibility Counter --- */
    var credNumbers = document.querySelectorAll('.credibility__number');
    credNumbers.forEach(function (el) {
      var text = el.textContent.trim();
      var prefix = '', suffix = '', targetNum = 0;
      var isString = text === 'Hoy';

      if (!isString) {
        var match = text.match(/^([+\-$]?)([\d]+)(%?)$/);
        if (match) {
          prefix = match[1] || '';
          targetNum = parseInt(match[2], 10);
          suffix = match[3] || '';
        }
      }

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          if (isString) {
            gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
          } else {
            var obj = { val: 0 };
            gsap.to(obj, {
              val: targetNum,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate: function () {
                el.textContent = prefix + Math.round(obj.val) + suffix;
              },
              onComplete: function () {
                el.textContent = text;
              }
            });
          }
        }
      });
    });

    /* --- Pricing Cards Stagger --- */
    var pricingCards = document.querySelectorAll('.pricing__card');
    if (pricingCards.length) {
      ScrollTrigger.create({
        trigger: pricingCards[0].parentElement,
        start: 'top 80%',
        once: true,
        onEnter: function () {
          gsap.from(pricingCards, {
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out'
          });
        }
      });
    }

    /* --- Discount Percentages Bounce --- */
    var discountPcts = document.querySelectorAll('.discount__pct');
    if (discountPcts.length) {
      ScrollTrigger.create({
        trigger: discountPcts[0].parentElement,
        start: 'top 80%',
        once: true,
        onEnter: function () {
          gsap.from(discountPcts, {
            scale: 0.5,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'elastic.out(1, 0.4)'
          });
        }
      });
    }

    /* --- Steps Cascade --- */
    var stepsCards = document.querySelectorAll('.steps__card');
    if (stepsCards.length) {
      ScrollTrigger.create({
        trigger: stepsCards[0].parentElement,
        start: 'top 80%',
        once: true,
        onEnter: function () {
          gsap.from(stepsCards, {
            x: -30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power2.out'
          });
        }
      });
    }
  }

  /* ===== Modal ===== */
  window.openWhatsAppModal = function (e) {
    if (e) e.preventDefault();
    if (!modal) return;
    modal.classList.add('open');
    isModalOpen = true;
    document.body.style.overflow = 'hidden';
    if (floatBtn) floatBtn.style.display = 'none';
  };

  window.closeWhatsAppModal = function () {
    if (!modal) return;
    modal.classList.remove('open');
    isModalOpen = false;
    document.body.style.overflow = '';
    if (floatBtn) floatBtn.style.display = '';
  };

  window.closeWhatsAppModalOutside = function (e) {
    if (e.target === modal) window.closeWhatsAppModal();
  };

  window.sendWhatsApp = function (message) {
    var text = encodeURIComponent(message || DEFAULT_MESSAGE);
    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text;
    window.closeWhatsAppModal();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isModalOpen) window.closeWhatsAppModal();
  });

  /* ===== Init ===== */
  initHeaderScroll();
  initLenis();
  initGSAP();

})();
