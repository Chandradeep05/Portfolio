/* ═══════════════════════════════════════════════
   SMOOTH SCROLL — Nexus3D Portfolio
   Lenis smooth scroll + GSAP ScrollTrigger sync.
   Feeds scroll velocity into AppState for particle
   and shader systems to consume.

   Auto-disables on mobile/low tier → native scroll.
   ═══════════════════════════════════════════════ */

const SmoothScroll = {
  lenis: null,
  enabled: false,

  init() {
    // Register GSAP plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const limits = Performance.getLimits();

    if (limits.enableSmoothScroll && typeof Lenis !== 'undefined' && !AppState.reducedMotion) {
      this._initLenis();
    } else {
      // Fallback: just sync ScrollTrigger with native scroll
      this._initNativeScroll();
    }

    this._initScrollReveal();
  },

  _initLenis() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    this.enabled = true;

    // Connect Lenis to GSAP ScrollTrigger
    this.lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      AppState.set('scrollY', e.targetScroll);
      AppState.set('scrollVelocity', Math.abs(e.velocity));
      AppState.set('scrolling', Math.abs(e.velocity) > 0.5);
    });

    // GSAP ticker drives Lenis
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    console.log('[Scroll] Lenis smooth scroll initialized');
  },

  _initNativeScroll() {
    // Track scroll position and velocity with native scroll
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const now = performance.now();
          const dt = now - lastTime;
          const dy = Math.abs(window.scrollY - lastScrollY);
          const velocity = dt > 0 ? (dy / dt) * 16 : 0; // normalize to ~frame

          AppState.set('scrollY', window.scrollY);
          AppState.set('scrollVelocity', velocity);
          AppState.set('scrolling', velocity > 0.5);

          lastScrollY = window.scrollY;
          lastTime = now;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    console.log('[Scroll] Native scroll fallback initialized');
  },

  _initScrollReveal() {
    // IntersectionObserver for .reveal elements
    const revealEls = DOM.qsa('.reveal');

    if (revealEls.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve — allows re-triggering if needed
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  },

  /** Scroll to a target element smoothly */
  scrollTo(target) {
    if (this.lenis) {
      this.lenis.scrollTo(target, { duration: 1.5 });
    } else {
      const el = typeof target === 'string' ? DOM.qs(target) : target;
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  },

  /** Stop/start scroll (useful during transitions) */
  stop() {
    if (this.lenis) this.lenis.stop();
  },

  start() {
    if (this.lenis) this.lenis.start();
  },

  destroy() {
    if (this.lenis) this.lenis.destroy();
  }
};

window.SmoothScroll = SmoothScroll;
