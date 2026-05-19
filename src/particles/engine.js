/* ═══════════════════════════════════════════════
   PARTICLE ENGINE — Nexus3D Portfolio
   Multi-layer particle system with:
   - Depth-based scaling (foreground sharp, bg blurred)
   - Mouse-reactive flow (repel + attract)
   - Scroll velocity response (stretch on fast scroll)
   - Per-section color transitions
   - Performance-aware count limits

   Reads from AppState: mouseX/Y, scrollVelocity, section, tier
   ═══════════════════════════════════════════════ */

const ParticleEngine = {
  canvas: null,
  ctx: null,
  W: 0,
  H: 0,
  particles: [],
  rafId: null,
  currentColor: { r: 0, g: 255, b: 135 },
  targetColor: { r: 0, g: 255, b: 135 },

  init() {
    this.canvas = DOM.id('bg-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this._resize();
    this._createParticles();
    this._bindEvents();
    this._startLoop();

    // React to section changes → shift particle color
    AppState.on('section', () => {
      const cfg = ParticleConfig.getSection();
      this.targetColor = { ...cfg.color };
    });

    // React to tier downgrade → reduce particles
    AppState.on('tier', () => {
      this._adjustParticleCount();
    });
  },

  _resize() {
    this.W = this.canvas.width = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
  },

  _bindEvents() {
    window.addEventListener('resize', () => {
      this._resize();
      this._adjustParticleCount();
    }, { passive: true });
  },

  _createParticles() {
    const count = ParticleConfig.getCount();
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push(this._makeParticle());
    }
  },

  _makeParticle() {
    // Depth layer: 0 = far background, 1 = foreground
    const depth = Math.random();

    return {
      x: Math.random() * this.W,
      y: Math.random() * this.H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      // Depth-based sizing: far = small + transparent, near = large + bright
      radius: MathUtils.lerp(0.3, 1.8, depth),
      baseAlpha: MathUtils.lerp(0.03, 0.4, depth),
      alpha: 0,
      depth: depth,
      // Blur simulation: far particles are slightly larger but dimmer
      blur: depth < 0.3 ? true : false
    };
  },

  _adjustParticleCount() {
    const target = ParticleConfig.getCount();
    const current = this.particles.length;

    if (target < current) {
      // Remove excess particles
      this.particles.length = target;
    } else if (target > current) {
      // Add new particles
      for (let i = current; i < target; i++) {
        this.particles.push(this._makeParticle());
      }
    }
  },

  _startLoop() {
    const loop = () => {
      this._update();
      this._draw();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  },

  _update() {
    const cfg = ParticleConfig.getSection();
    const mx = AppState.mouseX;
    const my = AppState.mouseY;
    const scrollVel = AppState.scrollVelocity || 0;

    // Smoothly transition particle color
    this.currentColor.r = MathUtils.lerp(this.currentColor.r, this.targetColor.r, 0.02);
    this.currentColor.g = MathUtils.lerp(this.currentColor.g, this.targetColor.g, 0.02);
    this.currentColor.b = MathUtils.lerp(this.currentColor.b, this.targetColor.b, 0.02);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Mouse interaction — depth-weighted (foreground particles react more)
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mouseRadius = cfg.mouseRadius * (0.5 + p.depth * 0.5);

      if (dist < mouseRadius && dist > 0) {
        const force = ((mouseRadius - dist) / mouseRadius) * cfg.mouseForce * p.depth;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
        p.alpha = Math.min(0.8, p.baseAlpha + force * 0.8);
      } else {
        p.alpha += (p.baseAlpha - p.alpha) * 0.04;
      }

      // Scroll velocity influence — particles drift faster when scrolling
      const scrollInfluence = MathUtils.clamp(scrollVel * 0.003, 0, 0.5);
      p.vy += scrollInfluence * p.depth * 0.1;

      // Apply velocity with damping
      p.vx *= 0.97;
      p.vy *= 0.97;

      // Base drift
      p.x += p.vx + (Math.random() - 0.5) * cfg.speed * 0.1;
      p.y += p.vy + (Math.random() - 0.5) * cfg.speed * 0.1;

      // Wrap around edges
      if (p.x < -10) p.x = this.W + 10;
      if (p.x > this.W + 10) p.x = -10;
      if (p.y < -10) p.y = this.H + 10;
      if (p.y > this.H + 10) p.y = -10;
    }
  },

  _draw() {
    const ctx = this.ctx;
    const cfg = ParticleConfig.getSection();
    const connDist = ParticleConfig.getConnectionDist();
    const r = Math.round(this.currentColor.r);
    const g = Math.round(this.currentColor.g);
    const b = Math.round(this.currentColor.b);
    const scrollVel = AppState.scrollVelocity || 0;

    ctx.clearRect(0, 0, this.W, this.H);

    // Draw connections first (behind particles)
    for (let i = 0; i < this.particles.length; i++) {
      const a = this.particles[i];
      for (let j = i + 1; j < this.particles.length; j++) {
        const pb = this.particles[j];
        const dx = a.x - pb.x;
        const dy = a.y - pb.y;
        const d = dx * dx + dy * dy; // skip sqrt for perf
        const maxD = connDist * connDist;

        if (d < maxD) {
          const opacity = (1 - d / maxD) * cfg.connectionOpacity;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    // Scroll velocity stretch factor
    const stretchFactor = MathUtils.clamp(1 + scrollVel * 0.01, 1, 2.5);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      ctx.beginPath();

      if (stretchFactor > 1.05) {
        // Stretch into ellipse when scrolling fast
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(1, stretchFactor);
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.restore();
      } else {
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      }

      // Blur simulation for far-depth particles
      if (p.blur) {
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha * 0.5})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = `rgba(${r},${g},${b},${p.alpha * 0.3})`;
      } else {
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
        ctx.shadowBlur = 0;
      }

      ctx.fill();
    }

    // Reset shadow
    ctx.shadowBlur = 0;
  },

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
};

window.ParticleEngine = ParticleEngine;
