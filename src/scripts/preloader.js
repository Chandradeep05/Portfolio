/* ═══════════════════════════════════════════════
   PRELOADER — Nexus3D Portfolio
   Smooth progress counter with cinematic fade-out.
   Signals AppState.preloaderDone when complete.
   ═══════════════════════════════════════════════ */

const Preloader = {
  bar: null,
  count: null,
  wrapper: null,
  progress: 0,
  intervalId: null,

  init() {
    this.bar = DOM.id('pre-bar');
    this.count = DOM.id('pre-count');
    this.wrapper = DOM.id('preloader');

    if (!this.bar || !this.count || !this.wrapper) {
      // No preloader elements — skip
      AppState.set('preloaderDone', true);
      return;
    }

    // If reduced motion, skip preloader immediately
    if (AppState.reducedMotion) {
      this._complete();
      return;
    }

    this._startCounting();
  },

  _startCounting() {
    this.intervalId = setInterval(() => {
      // Accelerating random increments for natural feel
      const remaining = 100 - this.progress;
      const increment = Math.random() * Math.min(6, remaining * 0.15) + 1;
      this.progress = Math.min(this.progress + increment, 100);

      // Update UI
      this.bar.style.width = this.progress + '%';
      this.count.textContent = String(Math.floor(this.progress)).padStart(3, '0');

      if (this.progress >= 100) {
        clearInterval(this.intervalId);
        // Hold at 100 briefly, then fade out
        setTimeout(() => this._complete(), 500);
      }
    }, 45);
  },

  _complete() {
    if (this.wrapper) {
      this.wrapper.classList.add('done');
    }
    // Signal app that preloader is finished
    setTimeout(() => {
      AppState.set('preloaderDone', true);
    }, 700); // match CSS transition duration
  }
};

window.Preloader = Preloader;
