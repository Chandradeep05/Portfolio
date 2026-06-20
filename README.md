# ⚡ Nexus3D — Premium Creative Portfolio

<p align="center">
  <img src="https://img.shields.io/badge/Aesthetics-Cinematic-00ff87?style=for-the-badge" alt="Cinematic Aesthetics">
  <img src="https://img.shields.io/badge/Performance-3_Tier_Degradation-0066ff?style=for-the-badge" alt="Performance Tiers">
  <img src="https://img.shields.io/badge/Framework-Vanilla_JS_%2B_GSAP-ff3c5c?style=for-the-badge" alt="Vanilla + GSAP">
</p>

> **🌐 Live:** [portfolio-eta-ochre-24.vercel.app](https://portfolio-eta-ochre-24.vercel.app)

<p align="center">
  <img src="src/assets/portfolio_hero_section.jpeg" alt="Portfolio Preview Showcase" width="100%">
</p>

---

## 🌌 Overview

**Nexus3D** is a premium, highly cinematic interactive portfolio built with **zero frameworks, zero bundlers, and zero build steps** for maximum control and raw performance. Designed for **Chandradeep Saxena** — Full-Stack & AI Systems Developer — it stands as a testament to pure client-side engineering and visual storytelling, utilizing **WebGL**, **custom physics particles**, **GSAP scroll triggers**, and **atmospheric effects** (noise, scanlines, and glow layers).

---

## ⚡ Projects Showcased

### 1. Astra-OS — Local-First Personal AI OS
A fully offline, agentic OS running entirely in the client with zero cloud dependency. Built on top of the **OTPAR Loop** (Observe → Think → Plan → Act → Reflect) for self-correcting task execution.
*   **Vector Memory**: Powered by ChromaDB for persistent session context.
*   **On-Device Inference**: Utilizes Ollama and WebLLM for completely private processing.
*   **OTPAR Terminal Simulator**: An interactive neural interface terminal that simulates real-time agent execution loop and self-reflection.

### 2. ARTH — AI Financial Intelligence Platform
An institutional-grade quant and research platform delivering low-latency financial insights.
*   **Technical Indicators Engine**: Calculates RSI, MACD, Bollinger Bands, and VWAP metrics.
*   **SSE Streams**: Delivers real-time AI stock reports via Server-Sent Events with zero buffering.
*   **Resiliency Layer**: Implements circuit-breaker patterns and aggressive Redis TTL caching under high request volume.
*   **Quant Dashboard Showcase**: High-fidelity UI screenshots showcasing indicators, sentiment analysis, candlestick charts, and risk indexes.

### 3. InnovaHub — Innovation & Event Management System
A premium full-stack institutional platform serving student idea pitch tracking, event registration, and administrative moderation.
*   **3D Interactive Interface**: Built with a reactive Three.js particle UI and glassmorphic design system.
*   **Robust Backend Core**: Engineered Express 5 RESTful API with JWT/bcrypt security, Nodemailer email broadcasting, and database-backed dynamic site configurations.
*   **Supabase Data Store**: Leverages PostgreSQL with relational schema design and file bucket storage for document and image uploads.

---

## 📐 Architecture & Visual Layers

The frontend operates as a 5-layer visual depth stack, with animations and interactions governed by ScrollTrigger and AppState.

```mermaid
graph TD
    L4[Layer 4: Physics-Based Custom Cursor] -->|Reactive state mouse tracking| L3[Layer 3: FX Overlays - Scanlines, Noise, Grid]
    L3 -->|Parallax scrolling FX| L2[Layer 2: Main Content UI - GSAP, Lenis, Interactive Cards]
    L2 -->|Scroll triggered active states| L1[Layer 1: Ambient Gradients & Ghost Typography Backdrop]
    L1 -->|WebGL canvas draw loops| L0[Layer 0: WebGL Particle Canvas Background]
```

---

## 🧬 Design System & Styling Tokens

Nexus3D runs on a customized CSS utility framework utilizing high-end design tokens for spacing, coloring, and animations.

| CSS Variable | Color | Hex Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--bg` | Dark Obsidian | `#050505` | Base canvas background |
| `--surface` | Elevated Metal | `#0f0f0f` | Cards, terminal boxes, and nodes |
| `--text` | Warm Silver | `#e8e6e1` | High-contrast typography |
| `--accent` | Cyber Green | `#00ff87` | Interactive states, primary triggers, and success states |
| `--accent2` | Electric Blue | `#0066ff` | Secondary highlights and compute phases |
| `--accent3` | Crimson Rose | `#ff3c5c` | Warning states, circuit breakers, and reflect triggers |

### Typography
-   **Display (Titles)**: `Syne` (800 weight) — aggressive, cinematic fonts.
-   **Mono (Labels & Code)**: `Fragment Mono` / `Space Mono` — sharp, technological fonts.

---

## 🚀 Performance Degradation Engine

To guarantee 60 FPS on any device (from a high-end gaming desktop to a budget mobile phone), Nexus3D runs a **3-tier automated performance engine**:

```
[High Performance] ──(FPS < 40 for 10s)──> [Mid Performance] ──(FPS < 40)──> [Low Performance]
  • 180 Particles                              • 100 Particles                   • 50 Particles
  • Full Canvas Blurs                          • Canvas Blurs Disabled           • Custom Cursor Disabled
  • Physics Interactions                       • Reduced Parallax                • Parallax & Smooth Scroll Disabled
```

---

## 🛠️ Folder Structure

```
nexus3d-portfolio/
├── index.html                 # Main entry point (semantic HTML5 & ARIA labels)
└── src/
    ├── styles/                # CSS Modular Architecture
    │   ├── tokens.css         # Design tokens & color variables
    │   ├── reset.css          # Base reset & accessibility skip-link
    │   └── responsive.css     # Responsive layouts & reduced-motion settings
    ├── scripts/               # Pure Vanilla JS Modules
    │   ├── state.js           # Central AppState manager (pub/sub pattern)
    │   ├── performance.js     # Live FPS counter & auto-degradation logic
    │   └── main.js            # Main controller bootstrapper
    └── animations/            # GSAP Motion Engines
        ├── typography.js      # Letter-by-letter & word-by-word reveals
        └── sections.js        # ScrollTrigger section transitions & parallax
```

---

## 💻 Quick Start

To run the portfolio locally, you need to serve it using any local web server (needed for Web Workers and ES modules):

### Python (Recommended)
```bash
python -m http.server 8080
```

### Node.js (Alternative)
```bash
npx serve .
```

Then open **[http://localhost:8080](http://localhost:8080)** in your browser.

---

<p align="center">
  Designed & Engineered by <b>Chandradeep Saxena</b> © 2026. All Rights Reserved.
</p>
