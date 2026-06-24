(function () {
  'use strict';

  var WHATSAPP_NUMBER = '542613632150';
  var DEFAULT_MESSAGE = 'Hola, quiero información sobre planes de Prevención Salud';

  var modal = document.getElementById('whatsappModal');
  var floatBtn = document.getElementById('whatsappFloat');
  var header = document.getElementById('header');
  var isModalOpen = false;

  /* ===== Scroll Animations ===== */
  function initAnimations() {
    var els = document.querySelectorAll('[data-animate]');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ===== Header Scroll State ===== */
  function initHeaderScroll() {
    function update() {
      if (!header) return;
      header.classList.toggle('scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
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
  initAnimations();
  initHeaderScroll();

})();
