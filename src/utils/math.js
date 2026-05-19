/* ─── MATH UTILITIES ─── */
/* Shared math helpers used across all animation and particle systems */

const MathUtils = {
  /** Linear interpolation between a and b by factor t */
  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  /** Clamp value between min and max */
  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  },

  /** Distance between two 2D points */
  dist(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  },

  /** Map value from one range to another */
  map(val, inMin, inMax, outMin, outMax) {
    return outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
  },

  /** Random float between min and max */
  rand(min, max) {
    return Math.random() * (max - min) + min;
  },

  /** Random integer between min and max (inclusive) */
  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /** Normalize a value from a range to 0-1 */
  normalize(val, min, max) {
    return MathUtils.clamp((val - min) / (max - min), 0, 1);
  },

  /** Degrees to radians */
  degToRad(deg) {
    return deg * (Math.PI / 180);
  }
};

// Make globally available
window.MathUtils = MathUtils;
