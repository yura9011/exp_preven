/* ============================================================
   ICS Salud — main.js
   GSAP 3 + ScrollTrigger + SplitText + Lenis smooth scroll
   ============================================================ */

// 1. Lenis smooth scroll
const lenis = new Lenis({
  lerp: 0.075,
  smoothWheel: true
});

gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// 2. GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

// 3. Reduced motion check
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 4. Navbar scroll
const header = document.querySelector('.header');
lenis.on('scroll', ({ scroll }) => {
  header.classList.toggle('scrolled', scroll > 60);
});

if (!reduceMotion) {

  // 5. Hero entrance
  const heroTitle = new SplitText('.hero__title', { type: 'chars, words' });
  const tl = gsap.timeline({ delay: 0.1 });
  tl.from(heroTitle.chars, {
    y: 80, opacity: 0, rotateX: -30,
    stagger: 0.018, duration: 0.8, ease: 'power4.out'
  })
  .from('.hero__ticker', { y: 16, opacity: 0, duration: 0.5, ease: 'power3.out' }, 0)
  .from('.hero__subtitle', { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.4)
  .from('.hero__actions', { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.4)' }, 0.6)
  .from('.hero__panel', { x: -30, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0);

  // 6. Price cards
  gsap.from('.pricing__card', {
    scrollTrigger: { trigger: '.pricing__grid', start: 'top 85%' },
    y: 30, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out'
  });

  // 6b. Números credibility - contador animado
  gsap.utils.toArray('.credibility__number').forEach(el => {
    const text = el.textContent.trim();
    const isNumber = text.match(/\d+/);
    
    if (isNumber) {
      const finalValue = parseInt(isNumber[0]);
      const tempObj = { val: 0 };
      const prefix = text.includes('+') ? '+' : '';
      
      gsap.to(tempObj, {
        val: finalValue,
        scrollTrigger: { trigger: el, start: 'top 85%' },
        duration: 2,
        ease: 'power2.out',
        onUpdate: function() {
          el.textContent = prefix + Math.round(tempObj.val);
        }
      });
    }
  });

  // 6c. Parallax en imágenes de secciones
  gsap.utils.toArray('.discount__photo, .faq__photo, .referral__photo').forEach(img => {
    gsap.to(img, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: img.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  });

  // 7. Discount percentages
  gsap.from('.discount__pct', {
    scrollTrigger: { trigger: '.discount__timeline', start: 'top 75%' },
    scale: 0.3, opacity: 0, stagger: 0.2, duration: 1.2, ease: 'elastic.out(1, 0.5)'
  });

  // 8. Steps
  gsap.from('.steps__card', {
    scrollTrigger: { trigger: '.steps__grid', start: 'top 80%' },
    y: 40, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'power3.out'
  });

  // 9. FAQ items
  gsap.from('.faq__item', {
    scrollTrigger: { trigger: '.faq__grid', start: 'top 80%' },
    y: 24, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out'
  });

  // 10. Generic data-animate
  gsap.utils.toArray('[data-animate]').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      y: 20, opacity: 0, duration: 0.6, ease: 'power2.out'
    });
  });

}

// ---- Pricing Card Selection --------------------------------

const pricingCards = document.querySelectorAll('.pricing__card');

pricingCards.forEach(card => {
  // Hacer las cards accesibles por teclado
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-pressed', 'false');
  
  // Click y Enter/Space
  const selectCard = (e) => {
    // Si el click fue en el botón interno, no hacemos toggle de selección
    if (e.target.closest('.btn')) return;
    
    // Remover selección de todas las cards
    pricingCards.forEach(c => {
      c.classList.remove('pricing__card--selected');
      c.setAttribute('aria-pressed', 'false');
    });
    
    // Agregar selección a la clickeada
    card.classList.add('pricing__card--selected');
    card.setAttribute('aria-pressed', 'true');
  };
  
  card.addEventListener('click', selectCard);
  
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectCard(e);
    }
  });
});

// ---- FAQ Accordion -----------------------------------------

const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach((item, index) => {
  const question = item.querySelector('.faq__q');
  const answer = item.querySelector('.faq__a');
  
  // Accesibilidad: roles y atributos ARIA
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');
  item.setAttribute('aria-expanded', 'false');
  
  const answerId = `faq-answer-${index}`;
  answer.id = answerId;
  item.setAttribute('aria-controls', answerId);
  
  // Ocultar respuestas inicialmente
  if (!item.classList.contains('faq__item--active')) {
    answer.style.maxHeight = '0';
    answer.style.opacity = '0';
    answer.style.marginTop = '0';
  }
  
  const toggleFaq = () => {
    const isActive = item.classList.contains('faq__item--active');
    
    // Cerrar todos
    faqItems.forEach(faq => {
      faq.classList.remove('faq__item--active');
      faq.setAttribute('aria-expanded', 'false');
      const ans = faq.querySelector('.faq__a');
      ans.style.maxHeight = '0';
      ans.style.opacity = '0';
      ans.style.marginTop = '0';
    });
    
    // Si no estaba activo, abrirlo
    if (!isActive) {
      item.classList.add('faq__item--active');
      item.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      answer.style.opacity = '1';
      answer.style.marginTop = '6px';
    }
  };
  
  item.addEventListener('click', toggleFaq);
  
  // Navegación por teclado
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFaq();
    }
  });
});

// ---- Progress Bar ------------------------------------------

const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
progressBar.setAttribute('role', 'progressbar');
progressBar.setAttribute('aria-label', 'Progreso de lectura de la página');
progressBar.setAttribute('aria-valuemin', '0');
progressBar.setAttribute('aria-valuemax', '100');
progressBar.setAttribute('aria-valuenow', '0');
document.body.appendChild(progressBar);

lenis.on('scroll', ({ scroll, limit }) => {
  const progress = Math.round((scroll / limit) * 100);
  progressBar.style.width = progress + '%';
  progressBar.setAttribute('aria-valuenow', progress);
});

// ---- Live Region para anuncios de accesibilidad -----------

const liveRegion = document.createElement('div');
liveRegion.setAttribute('aria-live', 'polite');
liveRegion.setAttribute('aria-atomic', 'true');
liveRegion.className = 'sr-only';
document.body.appendChild(liveRegion);

// Anunciar cuando se selecciona una tarjeta de precio
pricingCards.forEach(card => {
  const originalClick = card.onclick;
  card.addEventListener('click', function(e) {
    if (!e.target.closest('.btn')) {
      const planName = this.querySelector('.pricing__tag').textContent;
      liveRegion.textContent = `Plan ${planName} seleccionado`;
    }
  });
});

// Anunciar cuando se expande/colapsa FAQ
faqItems.forEach(item => {
  const question = item.querySelector('.faq__q').textContent;
  item.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    setTimeout(() => {
      liveRegion.textContent = isExpanded ? 
        `Pregunta expandida: ${question}` : 
        `Pregunta colapsada`;
    }, 100);
  });
});

// ---- WhatsApp Modal ----------------------------------------

const modal   = document.getElementById('whatsappModal');
const WA_NUM  = '542613632150';

function openWhatsAppModal(e) {
  if (e) e.preventDefault();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeWhatsAppModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function closeWhatsAppModalOutside(e) {
  if (e.target === modal || e.target.classList.contains('modal__overlay')) {
    closeWhatsAppModal();
  }
}

function sendWhatsApp(msg) {
  window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`, '_blank');
  closeWhatsAppModal();
}

// Expose to inline onclick handlers
window.openWhatsAppModal      = openWhatsAppModal;
window.closeWhatsAppModal     = closeWhatsAppModal;
window.closeWhatsAppModalOutside = closeWhatsAppModalOutside;
window.sendWhatsApp           = sendWhatsApp;

// data-open-modal
document.querySelectorAll('[data-open-modal]').forEach(btn => {
  btn.addEventListener('click', openWhatsAppModal);
});

// data-whatsapp-option
document.querySelectorAll('[data-whatsapp-option]').forEach(btn => {
  btn.addEventListener('click', () => {
    sendWhatsApp(btn.dataset.whatsappOption);
  });
});

// ESC key closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeWhatsAppModal();
});
