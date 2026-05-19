/* ─── CENTRALIZED STATE MANAGEMENT ─── */
/* Single source of truth for the entire application.
   All systems read from and write to AppState.
   Uses a simple pub/sub pattern for reactivity. */

const AppState = {
  // ─── Current values ───
  cursor: 'idle',           // idle | hover | project | cta | canvas
  cursorText: '',           // contextual label for project cursor state
  section: 'hero',          // currently visible section ID
  scrollY: 0,               // current scroll position
  scrollVelocity: 0,        // scroll speed (from Lenis)
  scrolling: false,         // is user actively scrolling
  mouseX: -9999,            // cursor X position
  mouseY: -9999,            // cursor Y position
  particleMode: 'default',  // default | dense | minimal | off
  transitionActive: false,  // is a section transition animating
  preloaderDone: false,     // has preloader finished

  // ─── Device capabilities (set by performance.js) ───
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  reducedMotion: false,     // prefers-reduced-motion
  tier: 'high',             // high | mid | low — set by perf detection
  fps: 60,
  pixelRatio: 1,

  // ─── Subscribers ───
  _listeners: {},

  /** Subscribe to state changes */
  on(key, callback) {
    if (!this._listeners[key]) this._listeners[key] = [];
    this._listeners[key].push(callback);
  },

  /** Unsubscribe from state changes */
  off(key, callback) {
    if (!this._listeners[key]) return;
    this._listeners[key] = this._listeners[key].filter(cb => cb !== callback);
  },

  /** Update state and notify subscribers */
  set(key, value) {
    if (this[key] === value) return; // no change, skip
    const prev = this[key];
    this[key] = value;
    if (this._listeners[key]) {
      this._listeners[key].forEach(cb => cb(value, prev));
    }
  },

  /** Get current state value */
  get(key) {
    return this[key];
  },

  /** Batch update multiple state keys */
  update(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      this.set(key, value);
    });
  }
};

// Make globally available
window.AppState = AppState;
