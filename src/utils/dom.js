/* ─── DOM UTILITIES ─── */
/* Shorthand DOM helpers to reduce boilerplate across all modules */

const DOM = {
  /** querySelector shorthand */
  qs(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /** querySelectorAll shorthand — returns real array */
  qsa(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },

  /** Get element by ID */
  id(elementId) {
    return document.getElementById(elementId);
  },

  /** Add event listener shorthand */
  on(el, event, fn, opts) {
    el.addEventListener(event, fn, opts);
  },

  /** Remove event listener shorthand */
  off(el, event, fn, opts) {
    el.removeEventListener(event, fn, opts);
  },

  /** Get bounding rect of element */
  rect(el) {
    return el.getBoundingClientRect();
  },

  /** Check if element is in viewport */
  isInView(el, threshold = 0) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight - threshold && r.bottom > threshold;
  },

  /** Set CSS custom property on element (defaults to :root) */
  setCSSVar(name, value, el = document.documentElement) {
    el.style.setProperty(name, value);
  },

  /** Get computed CSS custom property */
  getCSSVar(name, el = document.documentElement) {
    return getComputedStyle(el).getPropertyValue(name).trim();
  }
};

// Make globally available
window.DOM = DOM;
