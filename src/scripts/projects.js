/* ═══════════════════════════════════════════════
   PROJECTS — Nexus3D Portfolio
   Accordion open/close with GSAP smooth animation.
   Keyboard accessible. Updates AppState cursor.
   ═══════════════════════════════════════════════ */

const Projects = {
  init() {
    const rows = DOM.qsa('.project-row');
    rows.forEach(row => {
      DOM.on(row, 'click', () => this._toggle(row));
      DOM.on(row, 'keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this._toggle(row);
        }
      });
    });
  },

  _toggle(row) {
    const detail = row.nextElementSibling;
    if (!detail || !detail.classList.contains('project-detail')) return;

    const isOpen = detail.classList.contains('open');

    // Close all open panels first
    DOM.qsa('.project-detail.open').forEach(d => {
      if (d !== detail) this._close(d);
    });
    DOM.qsa('.project-row[aria-expanded="true"]').forEach(r => {
      if (r !== row) r.setAttribute('aria-expanded', 'false');
    });

    if (isOpen) {
      this._close(detail);
      row.setAttribute('aria-expanded', 'false');
    } else {
      this._open(detail);
      row.setAttribute('aria-expanded', 'true');
    }
  },

  _open(detail) {
    detail.classList.add('open');

    if (typeof gsap !== 'undefined' && !AppState.reducedMotion) {
      // Animate highlights stagger
      const highlights = DOM.qsa('.detail-highlight', detail);
      gsap.fromTo(highlights,
        { opacity: 0, x: -10 },
        {
          opacity: 1, x: 0,
          duration: MOTION.fast,
          ease: MOTION.ease.out,
          stagger: MOTION.stagger.normal,
          delay: 0.2
        }
      );

      // Animate description
      const desc = DOM.qs('.detail-description', detail);
      if (desc) {
        gsap.fromTo(desc,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: MOTION.medium, ease: MOTION.ease.out, delay: 0.1 }
        );
      }
    }
  },

  _close(detail) {
    detail.classList.remove('open');
  }
};

window.Projects = Projects;
