# Nexus3D — Portfolio

**Cinematic portfolio for Chandradeep Saxena** — Full-Stack Engineer & AI Systems Builder.

Built with pure HTML/CSS/JS + GSAP + Lenis. No build tools, no frameworks. Maximum control.

---

## Quick Start

```bash
# Serve locally (any HTTP server works)
cd nexus3d-portfolio
python -m http.server 8080

# Open in browser
# http://localhost:8080
```

> **Note:** Must be served via HTTP (not `file://`) for CDN script imports to work.

---

## Architecture

```
nexus3d-portfolio/
├── index.html                 # Entry point — semantic HTML, ARIA, all imports
└── src/
    ├── styles/                # CSS (load order matters)
    │   ├── tokens.css         # Design tokens, color palette, z-index scale
    │   ├── reset.css          # Base reset, skip-link, focus styles
    │   ├── layers.css         # Atmospheric gradients, ghost text, grid, noise, cursor
    │   ├── nav.css            # Fixed glass nav bar
    │   ├── hero.css           # Full-viewport hero + preloader
    │   ├── sections.css       # About, Projects, Astra-OS, Timeline, Certs
    │   ├── contact.css        # Contact section + footer
    │   ├── components.css     # Buttons, tags
    │   ├── animations.css     # Scroll reveal, glitch, utility animation classes
    │   ├── responsive.css     # Tablet, mobile, small mobile, reduced-motion, print
    │   ├── polish.css         # Micro-detail refinements
    │   └── terminal.css       # Astra-OS Neural Interface terminal
    │
    ├── scripts/               # JavaScript modules
    │   ├── state.js           # Centralized AppState with pub/sub
    │   ├── performance.js     # 3-tier auto-degradation (high/mid/low), FPS monitor
    │   ├── preloader.js       # Accelerating progress bar
    │   ├── cursor.js          # State-based cursor (idle/hover/cta/project) + magnetic
    │   ├── scroll.js          # Lenis smooth scroll + ScrollTrigger sync
    │   ├── nav.js             # Active section tracking + scroll-to-section
    │   ├── projects.js        # Accordion with GSAP animation
    │   ├── form.js            # Contact form validation + mailto
    │   ├── terminal.js        # Astra-OS OTPAR agent loop simulator
    │   └── main.js            # Entry point — wires all modules with error boundaries
    │
    ├── animations/            # Animation modules
    │   ├── motion.js          # Shared MOTION constants (durations, easings, staggers)
    │   ├── typography.js      # GSAP text reveals (char, word, clip-path)
    │   ├── magnetic.js        # Magnetic buttons, 3D tilt cards, OTPAR pill pulse
    │   └── sections.js        # ScrollTrigger-driven section transitions + parallax
    │
    ├── particles/             # Particle system
    │   ├── config.js          # Per-tier limits, per-section behavior
    │   └── engine.js          # Multi-layer depth engine with mouse/scroll reactivity
    │
    └── utils/                 # Shared utilities
        ├── math.js            # lerp, clamp, dist, map, rand, normalize
        └── dom.js             # qs, qsa, id, on, off, rect, CSS var helpers
```

---

## Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#050505` | Base background |
| `--surface` | `#0f0f0f` | Elevated surfaces |
| `--text` | `#e8e6e1` | Primary text |
| `--accent` | `#00ff87` | Interactive accent |
| `--accent2` | `#0066ff` | Secondary accent |
| `--accent3` | `#ff3c5c` | Tertiary accent |

### Typography
- **Display:** Syne (800 weight) — titles
- **Mono:** Fragment Mono / Space Mono — labels, code, tags

### Z-Index Scale
```
0     background canvas
1     ghost text, grid
2     main content
3     noise, scanlines, particles
50    nav, overlays
9998  cursor ring
9999  cursor dot
10000 preloader
```

---

## Performance Tiers

| Tier | Trigger | Particles | Blur | Cursor | Parallax | Smooth Scroll |
|------|---------|-----------|------|--------|----------|---------------|
| **High** | Desktop, good GPU | 180 | ✓ | ✓ | 30px | ✓ |
| **Mid** | Tablet / weak desktop | 100 | ✗ | ✓ | 15px | ✓ |
| **Low** | Mobile / reduced-motion | 50 | ✗ | ✗ | ✗ | ✗ |

Auto-downgrades if FPS drops below 40 for 10 seconds.

---

## Key Features

- **5-layer visual depth** — atmospheric gradients, ghost typography, grid, content, FX overlay
- **State-based cursor** — 4 modes (idle, hover, CTA magnetic, project)
- **Depth-aware particles** — foreground/background layers, per-section color shifts, scroll velocity stretch
- **Cinematic typography** — char-by-char hero reveal, word-by-word about, clip-path section titles
- **Astra-OS Neural Interface** — live simulated OTPAR agent loop with streaming output
- **Performance-first** — 3-tier degradation, FPS monitoring, prefers-reduced-motion support
- **Accessible** — skip-link, ARIA labels, focus-visible, keyboard navigation, forced-colors support

---

## Dependencies (CDN)

| Library | Version | Purpose |
|---------|---------|---------|
| [GSAP](https://gsap.com) | 3.x | Animation engine + ScrollTrigger |
| [Lenis](https://lenis.dev) | 1.x | Smooth scroll |
| [Google Fonts](https://fonts.google.com) | — | Syne, Space Mono, Fragment Mono |

No npm. No build step. No bundler. Just serve and go.

---

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

---

## License

© 2025 Chandradeep Saxena. All rights reserved.
