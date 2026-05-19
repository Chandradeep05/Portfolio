/* ═══════════════════════════════════════════════
   MAGNETIC & MICRO-INTERACTIONS — Nexus3D Portfolio
   - Magnetic pull on buttons/links
   - Cert card 3D tilt
   - Tag border trace glow
   - Form input focus animations
   - Contact link slide
   - Feature item accent shift

   All respect Performance.getLimits().enableMagnetic
   ═══════════════════════════════════════════════ */

const MicroInteractions = {
  init() {
    const limits = Performance.getLimits();
    if (!limits.enableMagnetic || AppState.reducedMotion) return;

    this._magneticButtons();
    this._certCardTilt();
    this._featureItemHover();
    this._loopPillPulse();
  },

  /* ─── Magnetic Buttons ───
     Buttons subtly follow cursor when hovered.
     Creates premium "snap" feel. */
  _magneticButtons() {
    const btns = DOM.qsa('.btn, .form-submit');

    btns.forEach(btn => {
      const strength = 0.3; // how strongly button follows cursor
      const resetSpeed = 0.4; // seconds to snap back

      DOM.on(btn, 'mousemove', (e) => {
        const rect = DOM.rect(btn);
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = (e.clientX - centerX) * strength;
        const dy = (e.clientY - centerY) * strength;

        gsap.to(btn, {
          x: dx,
          y: dy,
          duration: MOTION.fast,
          ease: MOTION.ease.out
        });
      });

      DOM.on(btn, 'mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: resetSpeed,
          ease: MOTION.ease.elastic
        });
      });
    });
  },

  /* ─── Cert Card 3D Tilt ───
     Subtle perspective tilt following cursor position.
     Creates depth illusion on flat cards. */
  _certCardTilt() {
    const cards = DOM.qsa('.cert-card');

    cards.forEach(card => {
      // Set perspective on parent
      card.style.transformStyle = 'preserve-3d';

      DOM.on(card, 'mousemove', (e) => {
        const rect = DOM.rect(card);
        const x = (e.clientX - rect.left) / rect.width;  // 0-1
        const y = (e.clientY - rect.top) / rect.height;   // 0-1

        const rotateX = (y - 0.5) * -8;  // ±4 degrees
        const rotateY = (x - 0.5) * 8;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: MOTION.fast,
          ease: MOTION.ease.out,
          transformPerspective: 800
        });
      });

      DOM.on(card, 'mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: MOTION.medium,
          ease: MOTION.ease.elastic
        });
      });
    });
  },

  /* ─── Feature Item Hover ───
     Astra-OS feature items: icon scales + accent border appears */
  _featureItemHover() {
    const items = DOM.qsa('.feature-item');

    items.forEach(item => {
      const icon = DOM.qs('.feature-icon', item);

      DOM.on(item, 'mouseenter', () => {
        if (icon) {
          gsap.to(icon, {
            scale: 1.2,
            duration: MOTION.fast,
            ease: MOTION.ease.bounce
          });
        }
      });

      DOM.on(item, 'mouseleave', () => {
        if (icon) {
          gsap.to(icon, {
            scale: 1,
            duration: MOTION.fast,
            ease: MOTION.ease.out
          });
        }
      });
    });
  },

  /* ─── Loop Pill Pulse ───
     OTPAR pills get a subtle sequential pulse animation */
  _loopPillPulse() {
    const pills = DOM.qsa('.loop-pill');
    if (pills.length === 0) return;

    // Create a repeating pulse that travels across pills
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 3,
      scrollTrigger: {
        trigger: '.loop-pills',
        start: 'top 80%',
        toggleActions: 'play pause resume pause'
      }
    });

    pills.forEach((pill, i) => {
      tl.to(pill, {
        borderColor: 'rgba(0, 255, 135, 0.8)',
        boxShadow: '0 0 20px rgba(0, 255, 135, 0.2)',
        duration: 0.3,
        ease: MOTION.ease.out
      }, i * 0.15)
      .to(pill, {
        borderColor: 'rgba(0, 255, 135, 0.3)',
        boxShadow: '0 0 0px transparent',
        duration: 0.5,
        ease: MOTION.ease.out
      }, i * 0.15 + 0.3);
    });
  }
};

window.MicroInteractions = MicroInteractions;
