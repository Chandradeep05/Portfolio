/* ═══════════════════════════════════════════════
   TYPOGRAPHY ANIMATIONS — Nexus3D Portfolio
   GSAP-powered text reveals:
   - Hero title: char-by-char stagger
   - Section titles: clip-path reveal
   - About statement: word-by-word fade
   - All scroll-triggered via ScrollTrigger

   Respects reducedMotion — skips all if active.
   ═══════════════════════════════════════════════ */

const TypographyAnimations = {
  init() {
    if (AppState.reducedMotion) return;
    if (typeof gsap === 'undefined') return;

    // Wait for preloader to finish before animating
    if (AppState.preloaderDone) {
      this._setup();
    } else {
      AppState.on('preloaderDone', (done) => {
        if (done) this._setup();
      });
    }
  },

  _setup() {
    this._heroTitle();
    this._sectionTitles();
    this._aboutStatement();
    this._projectTitles();
    this._astraTitle();
    this._heroMeta();
  },

  /* ─── Hero Title: Char-by-char stagger ─── */
  _heroTitle() {
    const lines = DOM.qsa('.hero-title .line');
    if (lines.length === 0) return;

    // Kill CSS animation — GSAP takes over
    const heroTitle = DOM.qs('.hero-title');
    if (heroTitle) {
      heroTitle.style.animation = 'none';
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'none';
    }

    lines.forEach((line, i) => {
      // Split text into words, then chars within words
      // Words are wrapped in nowrap containers to prevent mid-word line breaks
      const text = line.textContent;
      const words = text.split(' ');
      line.textContent = '';
      line.style.opacity = '1';
      line.style.transform = 'none';
      line.style.animation = 'none';

      const allCharSpans = [];

      words.forEach((word, wi) => {
        // Word wrapper — prevents line-break inside a word
        const wordWrap = document.createElement('span');
        wordWrap.style.display = 'inline-block';
        wordWrap.style.whiteSpace = 'nowrap';

        word.split('').forEach(char => {
          const span = document.createElement('span');
          span.textContent = char;
          span.style.display = 'inline-block';
          span.style.opacity = '0';
          span.style.transform = 'translateY(60px)';
          wordWrap.appendChild(span);
          allCharSpans.push(span);
        });

        line.appendChild(wordWrap);

        // Add space between words (as regular text, not inline-block)
        if (wi < words.length - 1) {
          line.appendChild(document.createTextNode('\u00A0'));
        }
      });

      gsap.to(allCharSpans, {
        opacity: 1,
        y: 0,
        duration: MOTION.medium,
        ease: MOTION.ease.smooth,
        stagger: MOTION.stagger.tight,
        delay: 1.4 + (i * 0.2)
      });
    });
  },

  /* ─── Section Titles: Clip-path reveal from left ─── */
  _sectionTitles() {
    const titles = DOM.qsa('[data-animation="section-title"]');

    titles.forEach(title => {
      gsap.fromTo(title,
        {
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          opacity: 0
        },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          opacity: 1,
          duration: MOTION.slow,
          ease: MOTION.ease.smooth,
          scrollTrigger: {
            trigger: title,
            start: MOTION.scrollTrigger.start,
            toggleActions: MOTION.scrollTrigger.toggleActions
          }
        }
      );
    });
  },

  /* ─── About Statement: Word-by-word fade up ─── */
  _aboutStatement() {
    const statement = DOM.qs('.about-statement');
    if (!statement) return;

    // Use TreeWalker to only wrap words in TEXT nodes (preserves HTML tags)
    const walker = document.createTreeWalker(statement, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      // Include all text nodes, even whitespace-only ones
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      const raw = textNode.textContent;
      // Split but keep delimiter (space) as separate tokens
      const tokens = raw.split(/(\s+)/);
      const frag = document.createDocumentFragment();

      tokens.forEach(token => {
        if (!token) return;
        if (/^\s+$/.test(token)) {
          // Preserve whitespace as-is (critical for spacing around <strong>)
          frag.appendChild(document.createTextNode(token));
        } else {
          const span = document.createElement('span');
          span.className = 'word-anim';
          span.style.display = 'inline-block';
          span.style.opacity = '0';
          span.style.transform = 'translateY(12px)';
          span.textContent = token;
          frag.appendChild(span);
        }
      });

      textNode.parentNode.replaceChild(frag, textNode);
    });

    statement.style.opacity = '1';
    statement.style.transform = 'none';
    statement.style.animation = 'none';

    const wordSpans = DOM.qsa('.word-anim', statement);

    gsap.to(wordSpans, {
      opacity: 1,
      y: 0,
      duration: MOTION.fast,
      ease: MOTION.ease.out,
      stagger: MOTION.stagger.tight,
      scrollTrigger: {
        trigger: statement,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  },

  /* ─── Project Titles: Slide in from left ─── */
  _projectTitles() {
    const titles = DOM.qsa('.project-title');

    titles.forEach((title, i) => {
      gsap.fromTo(title,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: MOTION.medium,
          ease: MOTION.ease.out,
          delay: i * 0.08,
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  },

  /* ─── Astra-OS Title: Scale + reveal ─── */
  _astraTitle() {
    const title = DOM.qs('.astra-title');
    if (!title) return;

    gsap.fromTo(title,
      {
        scale: 0.85,
        opacity: 0,
        y: 30
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: MOTION.slow,
        ease: MOTION.ease.smooth,
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  },

  /* ─── Hero Meta + CTAs: Override CSS animation with GSAP ─── */
  _heroMeta() {
    const meta = DOM.qs('.hero-meta');
    const cta = DOM.qs('.hero-cta');
    const eyebrow = DOM.qs('.hero-eyebrow');

    // Override CSS animations
    [meta, cta, eyebrow].forEach(el => {
      if (el) {
        el.style.animation = 'none';
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
      }
    });

    const tl = gsap.timeline({ delay: 1.2 });

    if (eyebrow) {
      tl.to(eyebrow, {
        opacity: 1,
        y: 0,
        duration: MOTION.medium,
        ease: MOTION.ease.out
      }, 0);
    }

    if (meta) {
      tl.to(meta, {
        opacity: 1,
        y: 0,
        duration: MOTION.medium,
        ease: MOTION.ease.out
      }, 0.5);
    }

    if (cta) {
      tl.to(cta, {
        opacity: 1,
        y: 0,
        duration: MOTION.medium,
        ease: MOTION.ease.out
      }, 0.7);
    }
  }
};

window.TypographyAnimations = TypographyAnimations;
