/* ═══════════════════════════════════════════════
   SECTION TRANSITIONS — Nexus3D Portfolio
   Creates continuity between sections so the site
   feels like one long animated timeline, not
   disconnected blocks.

   Features:
   - Ghost text parallax on scroll
   - Section header staggered reveals
   - Background gradient shift between sections
   - Arch diagram progressive reveal
   - Timeline progressive activation

   Requires: GSAP + ScrollTrigger
   ═══════════════════════════════════════════════ */

const SectionTransitions = {
  init() {
    if (AppState.reducedMotion) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    this._ghostTextParallax();
    this._sectionHeaderStagger();
    this._archDiagramReveal();
    this._timelineProgressive();
    this._certCardStagger();
    this._contactReveal();
    this._heroParallax();
  },

  /* ─── Ghost Text Parallax ───
     Large background words move at different speeds
     creating depth illusion on scroll */
  _ghostTextParallax() {
    const limits = Performance.getLimits();
    if (!limits.enableGhostText) return;

    const words = DOM.qsa('.ghost-word');
    const speeds = [-0.15, 0.1, -0.08, 0.12, -0.06];

    words.forEach((word, i) => {
      const speed = speeds[i] || -0.1;

      gsap.to(word, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      });
    });
  },

  /* ─── Section Header Stagger ───
     Section num, title, and line animate in sequence */
  _sectionHeaderStagger() {
    const headers = DOM.qsa('.section-header');

    headers.forEach(header => {
      const num = DOM.qs('.section-num', header);
      const title = DOM.qs('.section-title', header);
      const line = DOM.qs('.section-line', header);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      if (num) {
        tl.fromTo(num,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: MOTION.fast, ease: MOTION.ease.bounce },
          0
        );
      }

      if (line) {
        tl.fromTo(line,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: MOTION.slow, ease: MOTION.ease.smooth },
          0.2
        );
      }
    });
  },

  /* ─── Arch Diagram Progressive Reveal ───
     Astra-OS architecture nodes reveal top-to-bottom
     with connections animating between them */
  _archDiagramReveal() {
    const diagrams = DOM.qsa('.astra-diagram');
    if (diagrams.length === 0) return;

    diagrams.forEach(diagram => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: diagram,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });

      // Reveal nodes and arrows alternately, top to bottom
      const children = [...diagram.children];
      children.forEach((child, i) => {
        if (child.classList.contains('arch-node')) {
          tl.fromTo(child,
            { opacity: 0, y: 15, scale: 0.95 },
            {
              opacity: 1, y: 0, scale: 1,
              duration: MOTION.fast,
              ease: MOTION.ease.out
            },
            i * 0.1
          );
        } else if (child.classList.contains('arch-arrow')) {
          tl.fromTo(child,
            { opacity: 0 },
            {
              opacity: 1,
              duration: MOTION.fast,
              ease: MOTION.ease.out
            },
            i * 0.1
          );
        }
      });
    });
  },

  /* ─── Timeline Progressive Activation ───
     Timeline items light up as you scroll past them */
  _timelineProgressive() {
    const items = DOM.qsa('.timeline-item');

    items.forEach(item => {
      const dot = item; // ::before pseudo element controlled via class

      gsap.fromTo(item,
        { opacity: 0.4, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: MOTION.medium,
          ease: MOTION.ease.out,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  },

  /* ─── Cert Cards Stagger ───
     Cards cascade in with slight rotation */
  _certCardStagger() {
    const cards = DOM.qsa('.cert-card');
    if (cards.length === 0) return;

    gsap.fromTo(cards,
      { opacity: 0, y: 30, rotateZ: -1 },
      {
        opacity: 1,
        y: 0,
        rotateZ: 0,
        duration: MOTION.medium,
        ease: MOTION.ease.out,
        stagger: MOTION.stagger.wide,
        scrollTrigger: {
          trigger: cards[0],
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  },

  /* ─── Contact Section Reveal ───
     Big text scales up, links slide in from left */
  _contactReveal() {
    const big = DOM.qs('.contact-big');
    const links = DOM.qsa('.contact-link');
    const form = DOM.qs('.contact-form');

    if (big) {
      gsap.fromTo(big,
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: MOTION.slow,
          ease: MOTION.ease.smooth,
          scrollTrigger: {
            trigger: big,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    if (links.length > 0) {
      gsap.fromTo(links,
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0,
          duration: MOTION.medium,
          ease: MOTION.ease.out,
          stagger: MOTION.stagger.normal,
          scrollTrigger: {
            trigger: links[0],
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    if (form) {
      gsap.fromTo(form,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: MOTION.medium,
          ease: MOTION.ease.out,
          scrollTrigger: {
            trigger: form,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  },

  /* ─── Hero Parallax ───
     Hero elements move at different rates on scroll */
  _heroParallax() {
    const limits = Performance.getLimits();
    if (!limits.enableParallax) return;

    const strength = limits.parallaxStrength;

    const title = DOM.qs('.hero-title');
    const meta = DOM.qs('.hero-meta');
    const eyebrow = DOM.qs('.hero-eyebrow');

    if (title) {
      gsap.to(title, {
        y: -strength * 1.5,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    if (meta) {
      gsap.to(meta, {
        y: -strength * 0.8,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    if (eyebrow) {
      gsap.to(eyebrow, {
        y: -strength * 2,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: '60% top',
          scrub: 1
        }
      });
    }
  }
};

window.SectionTransitions = SectionTransitions;
