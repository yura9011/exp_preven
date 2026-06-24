(function () {
  'use strict';

  var WHATSAPP_NUMBER = '542613632150';
  var DEFAULT_MESSAGE = 'Hola, quiero información sobre planes de Prevención Salud';

  var modal = document.getElementById('whatsappModal');
  var floatBtn = document.getElementById('whatsappFloat');
  var header = document.getElementById('header');
  var isModalOpen = false;

  /* ===== prefers-reduced-motion ===== */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (typeof gsap !== 'undefined') gsap.globalTimeline.timeScale(0);
  }

  /* ===== Lenis Smooth Scroll ===== */
  var lenis = null;
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({ lerp: 0.08, smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  /* ===== Navbar Scroll ===== */
  function initNavScroll() {
    if (lenis) {
      lenis.on('scroll', function (e) {
        if (header) header.classList.toggle('scrolled', e.scroll > 60);
      });
    } else {
      function update() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 60);
      }
      window.addEventListener('scroll', update, { passive: true });
      update();
    }
  }

  /* ===== GSAP Animations ===== */
  function initGSAP() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    var mm = gsap.matchMedia();
    var isDesktop = '(min-width: 768px)';
    var isMobile = '(max-width: 767px)';

    /* --- Hero: Title SplitText (desktop & mobile) --- */
    var heroTitle = document.querySelector('.hero__title');
    if (heroTitle && typeof SplitText !== 'undefined') {
      mm.add(isDesktop, function () {
        var split = new SplitText(heroTitle, { type: 'chars' });
        gsap.from(split.chars, {
          y: 100, opacity: 0, rotateX: -40,
          duration: 0.9, ease: 'power4.out',
          stagger: 0.02
        });
      });
      mm.add(isMobile, function () {
        var split = new SplitText(heroTitle, { type: 'chars' });
        gsap.from(split.chars, {
          y: 60, opacity: 0,
          duration: 0.7, ease: 'power3.out',
          stagger: 0.015
        });
      });
    }

    /* --- Hero: Subtitle --- */
    gsap.from('.hero__subtitle', {
      y: 20, opacity: 0,
      duration: 0.6, delay: 0.5, ease: 'power2.out'
    });

    /* --- Hero: Button --- */
    gsap.from('.hero__actions .btn--xl', {
      scale: 0.85, opacity: 0,
      duration: 0.5, delay: 0.75, ease: 'back.out(1.7)'
    });

    /* --- Hero: Note --- */
    gsap.from('.hero__note', {
      opacity: 0, duration: 0.4, delay: 1
    });

    /* --- Credibility Counter --- */
    var credNumbers = document.querySelectorAll('.credibility__number');
    if (credNumbers.length) {
      ScrollTrigger.create({
        trigger: '.credibility__grid',
        start: 'top 85%',
        once: true,
        onEnter: function () {
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

            if (isString) {
              gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
            } else {
              var obj = { val: 0 };
              gsap.to(obj, {
                val: targetNum, duration: 2, ease: 'power2.out', snap: 1,
                onUpdate: function () {
                  el.textContent = prefix + Math.round(obj.val) + suffix;
                },
                onComplete: function () {
                  el.textContent = text;
                }
              });
            }
          });
        }
      });
    }

    /* --- Pricing Cards --- */
    var pricingCards = document.querySelectorAll('.pricing__card');
    if (pricingCards.length) {
      ScrollTrigger.create({
        trigger: pricingCards[0].parentElement,
        start: 'top 80%',
        once: true,
        onEnter: function () {
          gsap.from(pricingCards, {
            y: 50, opacity: 0,
            duration: 0.7, stagger: 0.15, ease: 'power3.out'
          });
        }
      });
    }

    /* --- Discount Percentages --- */
    var discountPcts = document.querySelectorAll('.discount__pct');
    if (discountPcts.length) {
      ScrollTrigger.create({
        trigger: '.discount__timeline',
        start: 'top 80%',
        once: true,
        onEnter: function () {
          gsap.from(discountPcts, {
            scale: 0, opacity: 0,
            duration: 1.2, stagger: 0.2, ease: 'elastic.out(1, 0.5)'
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
            x: -30, opacity: 0,
            duration: 0.6, stagger: 0.2, ease: 'power2.out'
          });
        }
      });
    }

    /* --- Generic [data-animate] --- */
    var genericEls = document.querySelectorAll('[data-animate]');
    var excludeSelectors = [
      '.credibility__grid', '.pricing__grid', '.discount__timeline',
      '.steps__grid', '.faq__grid', '.pricing__card', '.steps__card',
      '.discount__pct', '.credibility__number'
    ];
    var filtered = [];
    genericEls.forEach(function (el) {
      var skip = false;
      excludeSelectors.forEach(function (sel) {
        if (el.matches && el.matches(sel)) skip = true;
      });
      if (!skip) filtered.push(el);
    });

    if (filtered.length) {
      ScrollTrigger.batch(filtered, {
        start: 'top 85%',
        once: true,
        onEnter: function (batch) {
          gsap.from(batch, {
            y: 30, opacity: 0,
            duration: 0.7, stagger: 0.1, ease: 'power2.out'
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
  initLenis();
  initNavScroll();
  initGSAP();

})();
