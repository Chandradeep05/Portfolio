/* ─── PERFORMANCE DETECTION & MANAGEMENT ─── */
/* Detects device capabilities and sets performance tier.
   All visual systems read AppState.tier to auto-degrade.

   Tiers:
     high   — Desktop, good GPU: full particles, blur, all FX
     mid    — Tablet or weak desktop: reduced particles, less blur
     low    — Mobile or low-end: minimal particles, no blur, no cursor, CSS-only
*/

const Performance = {
  _fpsHistory: [],
  _fpsCheckInterval: null,
  _lastFrameTime: 0,

  /** Initialize — detect device, set tier, start FPS monitor */
  init() {
    this._detectDevice();
    this._detectReducedMotion();
    this._setInitialTier();
    this._startFPSMonitor();

    // Log tier for debugging
    console.log(`[Perf] Tier: ${AppState.tier} | Mobile: ${AppState.isMobile} | ReducedMotion: ${AppState.reducedMotion}`);
  },

  /** Detect device type from viewport + touch support */
  _detectDevice() {
    const w = window.innerWidth;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (w <= 768 || (hasTouch && w <= 1024)) {
      AppState.set('isMobile', true);
      AppState.set('isTablet', false);
      AppState.set('isDesktop', false);
    } else if (w <= 1200 && hasTouch) {
      AppState.set('isMobile', false);
      AppState.set('isTablet', true);
      AppState.set('isDesktop', false);
    } else {
      AppState.set('isMobile', false);
      AppState.set('isTablet', false);
      AppState.set('isDesktop', true);
    }

    AppState.set('pixelRatio', Math.min(window.devicePixelRatio || 1, 2));

    // Re-detect on resize
    window.addEventListener('resize', () => this._detectDevice(), { passive: true });
  },

  /** Check prefers-reduced-motion */
  _detectReducedMotion() {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    AppState.set('reducedMotion', mq.matches);
    mq.addEventListener('change', (e) => {
      AppState.set('reducedMotion', e.matches);
    });
  },

  /** Set initial performance tier based on device detection */
  _setInitialTier() {
    if (AppState.reducedMotion) {
      AppState.set('tier', 'low');
    } else if (AppState.isMobile) {
      AppState.set('tier', 'low');
    } else if (AppState.isTablet) {
      AppState.set('tier', 'mid');
    } else {
      AppState.set('tier', 'high');
    }
  },

  /** Monitor FPS and auto-downgrade if sustained low performance */
  _startFPSMonitor() {
    // Don't monitor on low tier — already at minimum
    if (AppState.tier === 'low') return;

    let frames = 0;
    let lastCheck = performance.now();

    const countFrame = () => {
      frames++;
      const now = performance.now();

      if (now - lastCheck >= 2000) { // Check every 2 seconds
        const fps = Math.round(frames / ((now - lastCheck) / 1000));
        AppState.set('fps', fps);
        this._fpsHistory.push(fps);

        // Keep last 5 readings
        if (this._fpsHistory.length > 5) this._fpsHistory.shift();

        // Auto-downgrade: if average FPS < 40 for 5 consecutive checks
        if (this._fpsHistory.length >= 5) {
          const avg = this._fpsHistory.reduce((a, b) => a + b, 0) / this._fpsHistory.length;
          if (avg < 40 && AppState.tier === 'high') {
            console.warn(`[Perf] FPS avg ${avg.toFixed(0)} — downgrading to mid tier`);
            AppState.set('tier', 'mid');
          } else if (avg < 30 && AppState.tier === 'mid') {
            console.warn(`[Perf] FPS avg ${avg.toFixed(0)} — downgrading to low tier`);
            AppState.set('tier', 'low');
          }
        }

        frames = 0;
        lastCheck = now;
      }

      requestAnimationFrame(countFrame);
    };

    requestAnimationFrame(countFrame);
  },

  /** Get performance limits for current tier */
  getLimits() {
    const limits = {
      high: {
        maxParticles: 180,
        connectionDistance: 100,
        enableBlur: true,
        enableCursor: true,
        enableParallax: true,
        parallaxStrength: 30,
        enableGhostText: true,
        enableGrid: true,
        enableSmoothScroll: true,
        enableMagnetic: true,
        transitionComplexity: 'full'
      },
      mid: {
        maxParticles: 100,
        connectionDistance: 70,
        enableBlur: false,
        enableCursor: true,
        enableParallax: true,
        parallaxStrength: 15,
        enableGhostText: true,
        enableGrid: true,
        enableSmoothScroll: true,
        enableMagnetic: true,
        transitionComplexity: 'simplified'
      },
      low: {
        maxParticles: 50,
        connectionDistance: 50,
        enableBlur: false,
        enableCursor: false,
        enableParallax: false,
        parallaxStrength: 0,
        enableGhostText: false,
        enableGrid: false,
        enableSmoothScroll: false,
        enableMagnetic: false,
        transitionComplexity: 'css-only'
      }
    };

    return limits[AppState.tier] || limits.low;
  }
};

// Make globally available
window.Performance = Performance;
