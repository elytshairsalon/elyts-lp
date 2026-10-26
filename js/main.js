/**
 * elyts LP - Main JavaScript
 * Scroll animations & UI interactions
 */

(function () {
  'use strict';

  // Intersection Observer for fade-up animations
  const initScrollAnimations = () => {
    const elements = document.querySelectorAll('.fade-up');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.1,
      }
    );

    elements.forEach((el) => observer.observe(el));
  };

  // Header hide on scroll down, show on scroll up
  const initHeaderScroll = () => {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;

    const updateHeader = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 100 && currentScroll > lastScroll) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      lastScroll = currentScroll;
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateHeader);
          ticking = true;
        }
      },
      { passive: true }
    );
  };

  // Smooth scroll for anchor links
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      });
    });
  };

  // Outbound click events. This records the click only, not a completed reservation.
  const initClickTracking = () => {
    const resolveEvent = (link) => {
      if (link.dataset.track) return link.dataset.track;

      const href = link.getAttribute('href') || '';
      if (href.includes('slnH000329380') || href.includes('storeId=H000329380')) return 'booking_shibuya_click';
      if (href.includes('slnH000545800') || href.includes('storeId=H000545800')) return 'booking_omotesando_click';
      if (href.includes('lin.ee/QVtkR7u')) return 'line_consult_click';
      if (href.includes('instagram.com/elyts_hairsalon')) return 'instagram_click';
      return '';
    };

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;

      const eventName = resolveEvent(link);
      if (!eventName) return;

      const payload = {
        event: eventName,
        event_type: link.dataset.trackType || 'outbound_click',
        conversion: 'click_only',
        store: link.dataset.store || '',
        link_url: link.href,
      };

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);

      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, payload);
      }
    });
  };

  // Initialize on DOM ready
  const init = () => {
    initScrollAnimations();
    initHeaderScroll();
    initSmoothScroll();
    initClickTracking();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
