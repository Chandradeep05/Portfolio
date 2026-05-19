/* ═══════════════════════════════════════════════
   CURSOR ENGINE — Nexus3D Portfolio
   State-based cursor with magnetic pull, velocity
   stretch, and contextual modes.

   States (driven by AppState.cursor):
     idle    → small dot, gentle ring
     hover   → expanded ring, magnetic pull
     cta     → glow burst, larger dot
     project → large ring with contextual label

   Auto-disables on mobile / reduced motion.
   ═══════════════════════════════════════════════ */

const Cursor = {
  dot: null,
  ring: null,
  mouseX: -9999,
  mouseY: -9999,
  ringX: -9999,
  ringY: -9999,
  velocityX: 0,
  velocityY: 0,
  prevMouseX: -9999,
  prevMouseY: -9999,
  rafId: null,
  magnetTarget: null,
  enabled: true,

  init() {
    // Skip on mobile or reduced motion
    const limits = Performance.getLimits();
    if (!limits.enableCursor) {
      this.enabled = false;
      return;
    }

    this.dot = DOM.id('cursor-dot');
    this.ring = DOM.id('cursor-ring');

    if (!this.dot || !this.ring) {
      this.enabled = false;
      return;
    }

    this._bindEvents();
    this._startLoop();
  },

  _bindEvents() {
    // Track mouse position
    DOM.on(document, 'mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      AppState.set('mouseX', e.clientX);
      AppState.set('mouseY', e.clientY);
    });

    // Track mouse leaving window
    DOM.on(document, 'mouseleave', () => {
      this.dot.style.opacity = '0';
      this.ring.style.opacity = '0';
    });

    DOM.on(document, 'mouseenter', () => {
      this.dot.style.opacity = '1';
      this.ring.style.opacity = '1';
    });

    // Register hover targets
    this._registerTargets();

    // Re-register on tier change (cursor might get disabled)
    AppState.on('tier', (tier) => {
      const limits = Performance.getLimits();
      if (!limits.enableCursor) {
        this.enabled = false;
        this.dot.style.display = 'none';
        this.ring.style.display = 'none';
        document.body.style.cursor = 'auto';
      }
    });
  },

  _registerTargets() {
    // Standard hover targets
    const hoverEls = DOM.qsa('a, button, .tag, .cert-card, .loop-pill');
    hoverEls.forEach(el => {
      DOM.on(el, 'mouseenter', () => this._setState('hover'));
      DOM.on(el, 'mouseleave', () => this._setState('idle'));
    });

    // CTA targets (data-cursor="cta")
    const ctaEls = DOM.qsa('[data-cursor="cta"]');
    ctaEls.forEach(el => {
      DOM.on(el, 'mouseenter', () => {
        this._setState('cta');
        this.magnetTarget = el;
      });
      DOM.on(el, 'mouseleave', () => {
        this._setState('idle');
        this.magnetTarget = null;
      });
    });

    // Project targets (data-cursor="project")
    const projectEls = DOM.qsa('[data-cursor="project"]');
    projectEls.forEach(el => {
      DOM.on(el, 'mouseenter', () => {
        this._setState('project');
      });
      DOM.on(el, 'mouseleave', () => {
        this._setState('idle');
      });
    });
  },

  _setState(state) {
    AppState.set('cursor', state);

    // Remove all cursor classes
    document.body.classList.remove('cursor-hover', 'cursor-cta', 'cursor-project');

    // Add current state class
    if (state !== 'idle') {
      document.body.classList.add('cursor-' + state);
    }
  },

  _startLoop() {
    const loop = () => {
      if (!this.enabled) return;

      // Calculate velocity
      this.velocityX = this.mouseX - this.prevMouseX;
      this.velocityY = this.mouseY - this.prevMouseY;
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      // Dot follows mouse exactly
      this.dot.style.left = this.mouseX + 'px';
      this.dot.style.top = this.mouseY + 'px';

      // Ring follows with lerp (smooth lag)
      let targetX = this.mouseX;
      let targetY = this.mouseY;

      // Magnetic pull toward target element
      if (this.magnetTarget) {
        const rect = DOM.rect(this.magnetTarget);
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        targetX = MathUtils.lerp(this.mouseX, centerX, 0.25);
        targetY = MathUtils.lerp(this.mouseY, centerY, 0.25);
      }

      this.ringX = MathUtils.lerp(this.ringX, targetX, 0.12);
      this.ringY = MathUtils.lerp(this.ringY, targetY, 0.12);

      this.ring.style.left = this.ringX + 'px';
      this.ring.style.top = this.ringY + 'px';

      // Velocity-based stretch on dot
      const speed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
      const stretch = MathUtils.clamp(1 + speed * 0.02, 1, 1.8);
      const angle = Math.atan2(this.velocityY, this.velocityX) * (180 / Math.PI);

      if (speed > 2) {
        this.dot.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scaleX(${stretch}) scaleY(${1 / stretch})`;
      } else {
        this.dot.style.transform = 'translate(-50%, -50%)';
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  },

  /** Call after dynamic content is added to re-register targets */
  refresh() {
    this._registerTargets();
  },

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
};

window.Cursor = Cursor;
