/* ===== REACTION TEST ===== */
const ReactionGame = {
  state: 'idle', // idle | waiting | ready | result
  startTime: 0,
  timeout: null,

  start() {
    this.state = 'idle';
    app.innerHTML = `
      <div class="game-view">
        <div class="game-header">
          <button class="back-btn" onclick="showHome()">← Zurück</button>
          <h1>Reaktions-Test</h1>
          <p>Warte auf Grün. Dann so schnell wie möglich klicken.</p>
        </div>
        <div id="reaction-area" onclick="ReactionGame.handleClick()">
          Klicke, um zu starten
        </div>
        <div style="margin-top:1.5rem;text-align:center;color:var(--muted);font-size:0.9rem;">
          Tipp: Nicht zu früh klicken – sonst gibt's eine Strafe.
        </div>
      </div>
    `;
  },

  handleClick() {
    const area = document.getElementById('reaction-area');
    if (this.state === 'idle' || this.state === 'result') {
      this.state = 'waiting';
      area.className = 'waiting';
      area.textContent = 'Warte auf Grün…';
      const delay = 1500 + Math.random() * 3000;
      this.timeout = setTimeout(() => {
        this.state = 'ready';
        this.startTime = performance.now();
        area.className = 'ready';
        area.textContent = 'JETZT!';
      }, delay);
    } else if (this.state === 'waiting') {
      clearTimeout(this.timeout);
      this.state = 'result';
      area.className = 'result';
      area.innerHTML = `Zu früh!<br><small style="font-weight:400;opacity:0.8">Klicke zum Neustart</small>`;
    } else if (this.state === 'ready') {
      const ms = Math.round(performance.now() - this.startTime);
      this.state = 'result';
      area.className = 'result';
      let msg = '';
      if (ms < 180) msg = 'Unglaublich schnell! 🔥';
      else if (ms < 250) msg = 'Sehr gut!';
      else if (ms < 350) msg = 'Solide.';
      else msg = 'Da geht noch was.';
      area.innerHTML = `${ms} ms<br><small style="font-weight:400;opacity:0.8">${msg}<br>Klicke zum Neustart</small>`;
    }
  }
};

/* ===== MEMORY GAME ===== */
const MemoryGame = {
  cards: [],
  flipped: [],
  matched: 0,
  moves: 0,
  startTime: 0,
  lock: false,

  emojis: ['🐶','🐱','🦊','🐻','🐼','🦁','🐸','🐵'],

  start() {
    this.matched = 0;
    this.moves = 0;
    this.flipped = [];
    this.lock = false;
    this.startTime = Date.now();

    const pairs = [...this.emojis, ...this.emojis];
    this.cards = pairs.sort(() => Math.random() - 0.5);

    app.innerHTML = `
      <div class="game-view">
        <div class="game-header">
          <button class="back-btn" onclick="showHome()">← Zurück</button>
          <h1>Memory Meister</h1>
          <p>Finde alle 8 Paare.</p>
        </div>
        <div class="score-display">Züge: <span id="mem-moves">0</span> · Zeit: <span id="mem-time">0</span>s</div>
        <div class="memory-grid" id="memory-grid"></div>
        <div style="text-align:center">
          <button class="btn btn-outline" onclick="MemoryGame.start()">Neu starten</button>
        </div>
      </div>
    `;

    const grid = document.getElementById('memory-grid');
    this.cards.forEach((emoji, i) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.index = i;
      card.onclick = () => this.flip(i);
      grid.appendChild(card);
    });

    this.timer = setInterval(() => {
      const el = document.getElementById('mem-time');
      if (el) el.textContent = Math.floor((Date.now() - this.startTime) / 1000);
    }, 200);
  },

  flip(index) {
    if (this.lock) return;
    const card = document.querySelector(`.memory-card[data-index="${index}"]`);
    if (!card || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    card.textContent = this.cards[index];
    this.flipped.push(index);

    if (this.flipped.length === 2) {
      this.moves++;
      document.getElementById('mem-moves').textContent = this.moves;
      this.lock = true;

      const [a, b] = this.flipped;
      if (this.cards[a] === this.cards[b]) {
        setTimeout(() => {
          document.querySelector(`.memory-card[data-index="${a}"]`).classList.add('matched');
          document.querySelector(`.memory-card[data-index="${b}"]`).classList.add('matched');
          this.matched += 2;
          this.flipped = [];
          this.lock = false;
          if (this.matched === 16) this.win();
        }, 300);
      } else {
        setTimeout(() => {
          document.querySelector(`.memory-card[data-index="${a}"]`).classList.remove('flipped');
          document.querySelector(`.memory-card[data-index="${a}"]`).textContent = '';
          document.querySelector(`.memory-card[data-index="${b}"]`).classList.remove('flipped');
          document.querySelector(`.memory-card[data-index="${b}"]`).textContent = '';
          this.flipped = [];
          this.lock = false;
        }, 700);
      }
    }
  },

  win() {
    clearInterval(this.timer);
    const time = Math.floor((Date.now() - this.startTime) / 1000);
    setTimeout(() => {
      alert(`Geschafft!\n\nZüge: ${this.moves}\nZeit: ${time} Sekunden`);
    }, 400);
  }
};

/* ===== CLICK CHAOS ===== */
const ChaosGame = {
  score: 0,
  timeLeft: 10,
  interval: null,
  dangerMode: false,

  start() {
    this.score = 0;
    this.timeLeft = 10;
    this.dangerMode = false;
    clearInterval(this.interval);

    app.innerHTML = `
      <div class="game-view">
        <div class="game-header">
          <button class="back-btn" onclick="showHome()">← Zurück</button>
          <h1>Klick-Chaos</h1>
          <p>Klicke so oft wie möglich in 10 Sekunden. Manchmal wird der Button rot – dann NICHT klicken!</p>
        </div>
        <div class="score-display">Punkte: <span id="chaos-score">0</span> · Zeit: <span id="chaos-time">10</span>s</div>
        <button id="chaos-btn" onclick="ChaosGame.click()">START</button>
        <div style="text-align:center;margin-top:1rem;color:var(--muted);font-size:0.9rem;" id="chaos-msg">
          Klicke den Button, um zu beginnen
        </div>
      </div>
    `;
  },

  click() {
    const btn = document.getElementById('chaos-btn');
    if (btn.textContent === 'START') {
      this.begin();
      return;
    }
    if (this.dangerMode) {
      this.score = Math.max(0, this.score - 5);
      document.getElementById('chaos-score').textContent = this.score;
      document.getElementById('chaos-msg').textContent = 'Autsch! −5 Punkte';
      return;
    }
    this.score++;
    document.getElementById('chaos-score').textContent = this.score;
  },

  begin() {
    const btn = document.getElementById('chaos-btn');
    btn.textContent = 'KLICK!';
    document.getElementById('chaos-msg').textContent = 'Los geht\'s!';

    this.interval = setInterval(() => {
      this.timeLeft--;
      document.getElementById('chaos-time').textContent = this.timeLeft;

      // Random danger
      if (Math.random() < 0.18 && this.timeLeft > 1) {
        this.dangerMode = true;
        btn.classList.add('danger');
        btn.textContent = 'NICHT!';
        setTimeout(() => {
          this.dangerMode = false;
          btn.classList.remove('danger');
          btn.textContent = 'KLICK!';
        }, 600 + Math.random() * 400);
      }

      if (this.timeLeft <= 0) {
        clearInterval(this.interval);
        btn.textContent = 'Ende';
        btn.disabled = true;
        document.getElementById('chaos-msg').innerHTML = `
          Fertig! Du hast <strong>${this.score}</strong> Punkte.<br>
          <button class="btn" style="margin-top:1rem" onclick="ChaosGame.start()">Nochmal</button>
        `;
      }
    }, 1000);
  }
};

/* ===== PASSWORD GAME (simplified Neal.fun style) ===== */
const PasswordGame = {
  rules: [
    { id: 1, text: 'Mindestens 5 Zeichen', test: p => p.length >= 5 },
    { id: 2, text: 'Enthält eine Zahl', test: p => /\d/.test(p) },
    { id: 3, text: 'Enthält einen Großbuchstaben', test: p => /[A-Z]/.test(p) },
    { id: 4, text: 'Enthält einen Kleinbuchstaben', test: p => /[a-z]/.test(p) },
    { id: 5, text: 'Enthält ein Sonderzeichen (!@#$%^&*)', test: p => /[!@#$%^&*]/.test(p) },
    { id: 6, text: 'Die Summe aller Zahlen ist 25', test: p => {
      const nums = p.match(/\d/g) || [];
      return nums.reduce((a, b) => a + parseInt(b), 0) === 25;
    }},
    { id: 7, text: 'Enthält das Wort „fun“ (klein)', test: p => p.includes('fun') },
    { id: 8, text: 'Darf das Wort „passwort“ nicht enthalten', test: p => !p.toLowerCase().includes('passwort') },
    { id: 9, text: 'Länge muss eine Primzahl sein', test: p => {
      const n = p.length;
      if (n < 2) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
      return true;
    }},
    { id: 10, text: 'Endet mit einem Emoji 🎉', test: p => p.endsWith('🎉') }
  ],

  start() {
    app.innerHTML = `
      <div class="game-view">
        <div class="game-header">
          <button class="back-btn" onclick="showHome()">← Zurück</button>
          <h1>Das Unmögliche Passwort</h1>
          <p>Erfülle alle Regeln. Eine nach der anderen.</p>
        </div>
        <div class="password-box">
          <input type="text" id="pw-input" placeholder="Dein Passwort…" autocomplete="off" spellcheck="false">
          <ul class="rules-list" id="rules-list"></ul>
        </div>
        <div id="pw-success" style="display:none;text-align:center;margin-top:1.5rem;">
          <div style="font-size:2rem;margin-bottom:0.5rem;">🎉</div>
          <h2 style="font-family:'Space Grotesk'">Geschafft!</h2>
          <p style="color:var(--muted);margin:0.5rem 0 1rem">Du hast das unmögliche Passwort geknackt.</p>
          <button class="btn" onclick="PasswordGame.start()">Nochmal versuchen</button>
        </div>
      </div>
    `;

    const input = document.getElementById('pw-input');
    input.addEventListener('input', () => this.check());
    this.check();
    input.focus();
  },

  check() {
    const pw = document.getElementById('pw-input').value;
    const list = document.getElementById('rules-list');
    let allOk = true;
    let visibleCount = 0;

    list.innerHTML = '';

    for (const rule of this.rules) {
      // Progressive reveal: only show next rule if previous are ok
      if (visibleCount > 0 && !this.rules[visibleCount - 1].test(pw)) break;

      const ok = rule.test(pw);
      if (!ok) allOk = false;

      const li = document.createElement('li');
      li.className = ok ? 'ok' : 'fail';
      li.textContent = rule.text;
      list.appendChild(li);
      visibleCount++;

      if (!ok) break; // only show one failing rule at a time (neal.fun style)
    }

    const success = document.getElementById('pw-success');
    if (allOk && this.rules.every(r => r.test(pw))) {
      success.style.display = 'block';
    } else {
      success.style.display = 'none';
    }
  }
};

/* ===== WOULD YOU RATHER ===== */
const WyrGame = {
  questions: [
    {
      a: 'Für den Rest deines Lebens nur noch Pizza essen',
      b: 'Für den Rest deines Lebens nie wieder Pizza essen'
    },
    {
      a: 'Die Fähigkeit haben, mit Tieren zu sprechen',
      b: 'Die Fähigkeit haben, jede Sprache der Welt zu sprechen'
    },
    {
      a: 'Immer 10 Minuten zu früh kommen',
      b: 'Immer 20 Minuten zu spät kommen'
    },
    {
      a: 'Ein Jahr lang kein Internet haben',
      b: 'Ein Jahr lang kein warmes Wasser haben'
    },
    {
      a: 'Unsichtbar sein können, aber nur wenn niemand hinsieht',
      b: 'Fliegen können, aber nur 1 Meter hoch'
    },
    {
      a: 'Jeden Tag die gleichen Klamotten tragen müssen',
      b: 'Jeden Tag eine zufällige Frisur bekommen'
    },
    {
      a: 'Die Zukunft kennen, aber nichts ändern können',
      b: 'Die Vergangenheit ändern können, aber die Konsequenzen nicht kennen'
    },
    {
      a: 'Ein Leben ohne Musik',
      b: 'Ein Leben ohne Filme & Serien'
    },
    {
      a: 'Sofort 1 Million Euro bekommen, aber nie wieder arbeiten dürfen',
      b: 'Einen Job haben, den du liebst, aber nie reich werden'
    },
    {
      a: 'Immer die Wahrheit sagen müssen',
      b: 'Immer lügen müssen'
    }
  ],
  index: 0,
  answers: [],

  start() {
    this.index = 0;
    this.answers = [];
    this.showQuestion();
  },

  showQuestion() {
    if (this.index >= this.questions.length) {
      this.finish();
      return;
    }
    const q = this.questions[this.index];
    app.innerHTML = `
      <div class="game-view">
        <div class="game-header">
          <button class="back-btn" onclick="showHome()">← Zurück</button>
          <h1>Würdest du eher…</h1>
          <p>Frage ${this.index + 1} von ${this.questions.length}</p>
        </div>
        <div class="wyr-options">
          <div class="wyr-option" onclick="WyrGame.answer(0)">${q.a}</div>
          <div class="wyr-option" onclick="WyrGame.answer(1)">${q.b}</div>
        </div>
      </div>
    `;
  },

  answer(choice) {
    this.answers.push(choice);
    this.index++;
    this.showQuestion();
  },

  finish() {
    app.innerHTML = `
      <div class="game-view">
        <div class="game-header">
          <button class="back-btn" onclick="showHome()">← Zurück</button>
          <h1>Fertig!</h1>
          <p>Du hast alle ${this.questions.length} Entscheidungen getroffen.</p>
        </div>
        <div style="text-align:center;margin-top:2rem;">
          <p style="color:var(--muted);margin-bottom:1.5rem;">Es gibt kein richtig oder falsch.<br>Nur absurde Einblicke in dein Hirn.</p>
          <button class="btn" onclick="WyrGame.start()">Nochmal spielen</button>
        </div>
      </div>
    `;
  }
};
