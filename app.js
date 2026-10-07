const app = document.getElementById('app');

const games = [
  {
    id: 'reaction',
    emoji: '⚡',
    title: 'Reaktions-Test',
    desc: 'Wie schnell bist du wirklich?'
  },
  {
    id: 'memory',
    emoji: '🧠',
    title: 'Memory Meister',
    desc: 'Finde alle Paare. Schaffst du es unter 40 Sekunden?'
  },
  {
    id: 'chaos',
    emoji: '💥',
    title: 'Klick-Chaos',
    desc: 'Klicke so oft du kannst – aber pass auf!'
  },
  {
    id: 'password',
    emoji: '🔐',
    title: 'Das Unmögliche Passwort',
    desc: 'Erstelle ein Passwort, das allen Regeln gehorcht.'
  },
  {
    id: 'wyr',
    emoji: '🤔',
    title: 'Würdest du eher…',
    desc: 'Absurde Entscheidungen. Keine richtigen Antworten.'
  }
];

function showHome() {
  app.innerHTML = `
    <div class="hero">
      <h1>Fun.Games</h1>
      <p>Kleine, seltsame und überraschend süchtig machende Mini-Spiele. Genau wie neal.fun – nur auf Deutsch.</p>
    </div>
    <div class="games-grid">
      ${games.map(g => `
        <div class="game-card" onclick="startGame('${g.id}')">
          <span class="emoji">${g.emoji}</span>
          <h2>${g.title}</h2>
          <p>${g.desc}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function showAbout() {
  app.innerHTML = `
    <div class="about-content">
      <h1>Über Fun.Games</h1>
      <p>Diese Seite ist eine Hommage an <strong>neal.fun</strong> – die legendäre Website mit den kreativsten Browser-Spielen.</p>
      <p>Alle Spiele laufen komplett offline in deinem Browser. Kein Login, keine Werbung, kein Tracking.</p>
      <p>Viel Spaß beim Spielen!</p>
      <br>
      <button class="btn" onclick="showHome()">Zurück zu den Spielen</button>
    </div>
  `;
}

function startGame(id) {
  if (id === 'reaction') ReactionGame.start();
  else if (id === 'memory') MemoryGame.start();
  else if (id === 'chaos') ChaosGame.start();
  else if (id === 'password') PasswordGame.start();
  else if (id === 'wyr') WyrGame.start();
}

// Start with home
showHome();
