/* ═══════════════════════════════════════════════
   NAV — Nexus3D Portfolio
   Active section tracking + smooth scroll nav links.
   ═══════════════════════════════════════════════ */

const Nav = {
  links: [],
  sections: [],

  init() {
    this.links = DOM.qsa('.nav-links a');
    this.sections = DOM.qsa('section[id]');

    this._bindClickNav();
    this._trackNavScroll();

    if (this.links.length === 0 || this.sections.length === 0) return;
    this._trackActiveSection();
  },

  /** Smooth scroll on nav link click */
  _bindClickNav() {
    this.links.forEach(link => {
      DOM.on(link, 'click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          SmoothScroll.scrollTo(targetId);
        }
      });
    });

    // Logo click → scroll to top
    const logo = DOM.qs('.nav-logo');
    if (logo) {
      DOM.on(logo, 'click', (e) => {
        e.preventDefault();
        SmoothScroll.scrollTo('#hero');
      });
    }
  },

  /** Track which section is currently in view */
  _trackActiveSection() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          AppState.set('section', id);
          this._highlightLink(id);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '-80px 0px -50% 0px'
    });

    this.sections.forEach(section => observer.observe(section));
  },

  /** Update active class on nav links */
  _highlightLink(activeId) {
    this.links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  /** Toggle 'scrolled' class on nav for stronger glass effect */
  _trackNavScroll() {
    const nav = DOM.qs('nav');
    if (!nav) return;

    AppState.on('scrollY', (y) => {
      if (y > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
};

window.Nav = Nav;
