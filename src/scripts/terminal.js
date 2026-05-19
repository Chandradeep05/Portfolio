/* ═══════════════════════════════════════════════
   ASTRA-OS NEURAL INTERFACE — Nexus3D Portfolio
   Signature interactive terminal component that
   simulates a live OTPAR agent loop execution.

   Features:
   - Typewriter command input
   - Simulated OTPAR step progression
   - Streaming response with token delay
   - Glowing active step indicator
   - Ambient pulse synced to agent state
   ═══════════════════════════════════════════════ */

const AstraTerminal = {
  container: null,
  outputEl: null,
  inputEl: null,
  statusEl: null,
  stepIndicators: null,
  isRunning: false,
  abortFlag: false,

  // Predefined demo queries and responses
  demos: [
    {
      query: 'summarize my notes on distributed systems',
      steps: [
        { phase: 'observe', text: 'Scanning vector memory for "distributed systems"...' },
        { phase: 'observe', text: 'Found 3 documents (confidence: 0.87, 0.72, 0.68)' },
        { phase: 'think', text: 'Classifying as KNOWLEDGE_RETRIEVAL task' },
        { phase: 'think', text: 'Context tokens: 2,847 / 4,096 budget' },
        { phase: 'plan', text: 'Strategy: semantic_synthesis → compress → format' },
        { phase: 'act', text: 'Generating summary from retrieved context...' },
        { phase: 'act', text: '// Distributed systems notes cover: CAP theorem, consensus algorithms (Paxos, Raft), eventual consistency models, and partition tolerance strategies.' },
        { phase: 'reflect', text: 'Output grounded: ✓ | Hallucination check: clean | Confidence: 0.91' },
        { phase: 'reflect', text: 'Task complete — 847ms total latency' }
      ]
    },
    {
      query: 'calculate the integral of x^2 * e^x',
      steps: [
        { phase: 'observe', text: 'Input classified as mathematical expression' },
        { phase: 'think', text: 'Routing to MATH executor (integration by parts detected)' },
        { phase: 'plan', text: 'Strategy: python_executor → symbolic_solve → verify' },
        { phase: 'act', text: 'Executing: sympy.integrate(x**2 * exp(x), x)' },
        { phase: 'act', text: '// Result: (x² - 2x + 2)eˣ + C' },
        { phase: 'reflect', text: 'Verification: d/dx[(x²-2x+2)eˣ] = x²eˣ ✓' },
        { phase: 'reflect', text: 'Math confidence: 0.99 | Execution: 124ms' }
      ]
    },
    {
      query: 'what did I ask about last Tuesday?',
      steps: [
        { phase: 'observe', text: 'Temporal query detected — searching conversation memory' },
        { phase: 'observe', text: 'Filtering by date range: 2025-05-06 to 2025-05-07' },
        { phase: 'think', text: 'Found 4 conversation entries from Tuesday' },
        { phase: 'plan', text: 'Strategy: temporal_filter → rank_by_significance → summarize' },
        { phase: 'act', text: 'Retrieving and ranking conversation threads...' },
        { phase: 'act', text: '// You discussed: (1) FastAPI middleware optimization, (2) RAG confidence thresholds, (3) OTPAR retry limits' },
        { phase: 'reflect', text: 'Memory retrieval grounded: ✓ | 3 threads surfaced | 562ms' }
      ]
    }
  ],

  init() {
    this.container = DOM.id('astra-terminal');
    if (!this.container) return;

    this.outputEl = DOM.qs('.terminal-output', this.container);
    this.inputEl = DOM.qs('.terminal-input', this.container);
    this.statusEl = DOM.qs('.terminal-status', this.container);
    this.stepIndicators = DOM.qsa('.step-indicator', this.container);

    this._bindEvents();

    // Auto-run first demo when section enters viewport
    this._autoTrigger();
  },

  _bindEvents() {
    if (!this.inputEl) return;

    // Click on input area triggers demo
    DOM.on(this.inputEl, 'click', () => {
      if (!this.isRunning) this._runDemo();
    });

    // Keyboard trigger
    DOM.on(this.inputEl, 'keydown', (e) => {
      if (e.key === 'Enter' && !this.isRunning) {
        e.preventDefault();
        this._runDemo();
      }
    });
  },

  _autoTrigger() {
    if (typeof IntersectionObserver === 'undefined') return;

    let hasRun = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasRun && !this.isRunning) {
          hasRun = true;
          setTimeout(() => this._runDemo(), 800);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(this.container);
  },

  async _runDemo() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.abortFlag = false;

    // Pick random demo
    const demo = this.demos[Math.floor(Math.random() * this.demos.length)];

    // Clear output
    this.outputEl.innerHTML = '';
    this._resetSteps();
    this._setStatus('initializing');

    // Typewriter the query
    await this._typeCommand(demo.query);
    await this._sleep(400);

    // Run steps
    for (const step of demo.steps) {
      if (this.abortFlag) break;

      this._activateStep(step.phase);
      this._setStatus(step.phase);

      if (step.text.startsWith('//')) {
        // Result line — highlighted
        await this._addLine(step.text, 'result');
      } else {
        await this._addLine(step.text, step.phase);
      }

      await this._sleep(MathUtils.rand(300, 700));
    }

    this._setStatus('complete');
    this._resetSteps();
    this.isRunning = false;

    // Enable re-run after delay
    await this._sleep(2000);
    if (this.inputEl) {
      this.inputEl.textContent = '> click to run another query...';
    }
  },

  async _typeCommand(text) {
    if (!this.inputEl) return;
    this.inputEl.textContent = '> ';

    for (let i = 0; i < text.length; i++) {
      this.inputEl.textContent += text[i];
      await this._sleep(MathUtils.rand(25, 60));
    }
  },

  async _addLine(text, type) {
    const line = document.createElement('div');
    line.className = `terminal-line terminal-line--${type}`;

    // Phase prefix
    const prefix = document.createElement('span');
    prefix.className = 'terminal-prefix';
    prefix.textContent = type === 'result' ? '   →' : `  [${type.toUpperCase()}]`;
    line.appendChild(prefix);

    const content = document.createElement('span');
    content.className = 'terminal-content';
    line.appendChild(content);

    this.outputEl.appendChild(line);
    this.outputEl.scrollTop = this.outputEl.scrollHeight;

    // Typewriter effect for content
    const displayText = type === 'result' ? text.substring(3) : ' ' + text;
    for (let i = 0; i < displayText.length; i++) {
      content.textContent += displayText[i];
      if (i % 3 === 0) await this._sleep(8);
    }
  },

  _activateStep(phase) {
    if (!this.stepIndicators) return;

    this.stepIndicators.forEach(ind => {
      ind.classList.remove('active');
      if (ind.dataset.step === phase) {
        ind.classList.add('active');
      }
    });
  },

  _resetSteps() {
    if (!this.stepIndicators) return;
    this.stepIndicators.forEach(ind => ind.classList.remove('active'));
  },

  _setStatus(status) {
    if (!this.statusEl) return;
    const labels = {
      initializing: 'INITIALIZING AGENT...',
      observe: 'OBSERVING ◦ GATHERING CONTEXT',
      think: 'THINKING ◦ CLASSIFYING TASK',
      plan: 'PLANNING ◦ STRATEGY SELECTION',
      act: 'EXECUTING ◦ GENERATING OUTPUT',
      reflect: 'REFLECTING ◦ VALIDATING',
      complete: 'TASK COMPLETE ✓'
    };
    this.statusEl.textContent = labels[status] || status;
  },

  _sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
};

window.AstraTerminal = AstraTerminal;
