/* ═══════════════════════════════════════════════
   FORM HANDLER — Nexus3D Portfolio
   Contact form validation + mailto submission.
   ═══════════════════════════════════════════════ */

const Form = {
  init() {
    const form = DOM.id('contact-form');
    if (!form) return;

    DOM.on(form, 'submit', (e) => this._handleSubmit(e));

    // Focus animation for inputs
    this._bindFocusEffects();
  },

  _handleSubmit(e) {
    e.preventDefault();

    const name = DOM.id('cf-name').value.trim();
    const email = DOM.id('cf-email').value.trim();
    const msg = DOM.id('cf-msg').value.trim();

    // Validation
    if (!name || !email || !msg) {
      this._showError('Please fill in all fields.');
      return;
    }

    if (!this._isValidEmail(email)) {
      this._showError('Please enter a valid email address.');
      return;
    }

    // Build mailto link
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`${msg}\n\nFrom: ${name}\nEmail: ${email}`);
    const mailto = `mailto:c4chandradeep2005@gmail.com?subject=${subject}&body=${body}`;

    // Animate submit button success
    const btn = DOM.qs('.form-submit');
    if (btn && typeof gsap !== 'undefined') {
      gsap.to(btn, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: MOTION.ease.out,
        onComplete: () => {
          window.location.href = mailto;
        }
      });
    } else {
      window.location.href = mailto;
    }
  },

  _isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  _showError(message) {
    // Shake the form submit button
    const btn = DOM.qs('.form-submit');
    if (btn && typeof gsap !== 'undefined') {
      gsap.to(btn, {
        x: [-8, 8, -6, 6, -3, 3, 0],
        duration: 0.4,
        ease: MOTION.ease.out
      });
    }
    // Simple alert fallback — can be replaced with custom toast
    alert(message);
  },

  _bindFocusEffects() {
    const inputs = DOM.qsa('.form-input, .form-textarea');

    inputs.forEach(input => {
      DOM.on(input, 'focus', () => {
        const label = input.previousElementSibling;
        if (label && label.classList.contains('form-label')) {
          gsap.to(label, {
            color: 'var(--accent)',
            duration: MOTION.fast,
            ease: MOTION.ease.out
          });
        }
      });

      DOM.on(input, 'blur', () => {
        const label = input.previousElementSibling;
        if (label && label.classList.contains('form-label')) {
          gsap.to(label, {
            color: 'var(--muted)',
            duration: MOTION.fast,
            ease: MOTION.ease.out
          });
        }
      });
    });
  }
};

window.Form = Form;
