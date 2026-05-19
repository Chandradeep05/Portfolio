/* ─── MOTION DESIGN SYSTEM ─── */
/* Shared timing, easing, and stagger constants.
   Every animation in the app should use these values
   to maintain cinematic consistency and premium pacing.

   Usage:
     gsap.to(el, { duration: MOTION.medium, ease: MOTION.ease.out });
*/

const MOTION = {
  // ─── Durations (seconds) ───
  instant: 0.15,
  fast: 0.3,
  medium: 0.6,
  slow: 1.0,
  xslow: 1.6,
  cinematic: 2.4,

  // ─── Easings (GSAP string format) ───
  ease: {
    out: 'power3.out',
    in: 'power3.in',
    inOut: 'power2.inOut',
    smooth: 'power4.out',
    elastic: 'elastic.out(1, 0.5)',
    bounce: 'back.out(1.7)',
    sharp: 'expo.out',
    gentle: 'sine.out'
  },

  // ─── Stagger delays (seconds) ───
  stagger: {
    tight: 0.03,    // character-level
    normal: 0.08,   // word-level
    wide: 0.15,     // element-level
    section: 0.25   // section-level
  },

  // ─── Reveal distances (pixels) ───
  reveal: {
    small: 20,
    medium: 40,
    large: 60
  },

  // ─── Scroll-triggered animation defaults ───
  scrollTrigger: {
    start: 'top 85%',
    end: 'bottom 20%',
    toggleActions: 'play none none none'
  },

  /** Get duration adjusted for reduced motion */
  getDuration(key) {
    if (AppState.reducedMotion) return 0.01;
    return this[key] || this.medium;
  },

  /** Get reveal distance adjusted for tier */
  getRevealDist() {
    if (AppState.reducedMotion) return 0;
    const limits = Performance.getLimits();
    if (!limits.enableParallax) return this.reveal.small;
    return this.reveal.medium;
  }
};

// Make globally available
window.MOTION = MOTION;
