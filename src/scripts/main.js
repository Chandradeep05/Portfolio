/* ═══════════════════════════════════════════════
   MAIN — Nexus3D Portfolio
   Application entry point. Initializes all modules
   in correct dependency order with error boundaries.

   Load order (guaranteed by script tags in HTML):
   1. utils/math.js, utils/dom.js
   2. scripts/state.js, scripts/performance.js
   3. animations/motion.js
   4. [CDNs: Lenis, GSAP, ScrollTrigger]
   5. All other modules
   6. THIS FILE — wires everything together
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /** Safe init wrapper — logs errors instead of crashing */
  function safeInit(name, fn) {
    try {
      if (typeof fn === 'function') {
        fn();
      } else if (fn && typeof fn.init === 'function') {
        fn.init();
      }
    } catch (err) {
      console.error(`[Nexus3D] Failed to init ${name}:`, err);
    }
  }

  /* ─── PHASE 1: Core Systems (no DOM dependency) ─── */
  safeInit('Performance', Performance);

  /* ─── PHASE 2: DOM-dependent init ─── */
  function initApp() {
    const start = performance.now();
    console.log('[Nexus3D] Initializing...');
    console.log(`[Nexus3D] Tier: ${AppState.tier} | Mobile: ${AppState.isMobile} | ReducedMotion: ${AppState.reducedMotion}`);

    // Core systems — order matters
    safeInit('Preloader', Preloader);
    safeInit('SmoothScroll', SmoothScroll);
    safeInit('Nav', Nav);
    safeInit('Cursor', Cursor);
    safeInit('ParticleEngine', ParticleEngine);

    // Interactive components
    safeInit('Projects', Projects);
    safeInit('Form', Form);
    safeInit('AstraTerminal', AstraTerminal);

    // Animation systems — skip on reduced motion
    if (!AppState.reducedMotion) {
      safeInit('TypographyAnimations', TypographyAnimations);
      safeInit('MicroInteractions', MicroInteractions);
      safeInit('SectionTransitions', SectionTransitions);
    } else {
      console.log('[Nexus3D] Reduced motion — animations skipped');
    }

    const elapsed = (performance.now() - start).toFixed(1);
    console.log(`[Nexus3D] All systems initialized ✓ (${elapsed}ms)`);
  }

  /* ─── Wait for DOM ready ─── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  /* ─── Global error handler — prevents silent failures ─── */
  window.addEventListener('error', (e) => {
    console.warn(`[Nexus3D] Uncaught error: ${e.message} at ${e.filename}:${e.lineno}`);
  });

})();
