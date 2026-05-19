/* ═══════════════════════════════════════════════
   PARTICLE CONFIG — Nexus3D Portfolio
   Per-tier limits and per-section behavior config.
   ═══════════════════════════════════════════════ */

const ParticleConfig = {
  /** Get particle count for current tier */
  getCount() {
    const limits = Performance.getLimits();
    const area = window.innerWidth * window.innerHeight;
    const density = Math.floor(area / 8000);
    return Math.min(limits.maxParticles, density);
  },

  /** Get connection distance for current tier */
  getConnectionDist() {
    return Performance.getLimits().connectionDistance;
  },

  /** Per-section particle behavior */
  sections: {
    hero: {
      color: { r: 0, g: 255, b: 135 },
      speed: 0.3,
      connectionOpacity: 0.06,
      mouseRadius: 140,
      mouseForce: 0.5
    },
    about: {
      color: { r: 0, g: 255, b: 135 },
      speed: 0.2,
      connectionOpacity: 0.04,
      mouseRadius: 120,
      mouseForce: 0.3
    },
    projects: {
      color: { r: 0, g: 180, b: 255 },
      speed: 0.25,
      connectionOpacity: 0.05,
      mouseRadius: 130,
      mouseForce: 0.4
    },
    astra: {
      color: { r: 100, g: 255, b: 180 },
      speed: 0.35,
      connectionOpacity: 0.07,
      mouseRadius: 160,
      mouseForce: 0.6
    },
    timeline: {
      color: { r: 0, g: 255, b: 135 },
      speed: 0.15,
      connectionOpacity: 0.03,
      mouseRadius: 100,
      mouseForce: 0.2
    },
    certs: {
      color: { r: 0, g: 255, b: 135 },
      speed: 0.2,
      connectionOpacity: 0.04,
      mouseRadius: 110,
      mouseForce: 0.3
    },
    contact: {
      color: { r: 0, g: 200, b: 255 },
      speed: 0.2,
      connectionOpacity: 0.05,
      mouseRadius: 120,
      mouseForce: 0.3
    }
  },

  /** Get config for current section */
  getSection() {
    const section = AppState.section || 'hero';
    return this.sections[section] || this.sections.hero;
  }
};

window.ParticleConfig = ParticleConfig;
