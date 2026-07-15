const appEl        = document.getElementById('app');
const hiddenInputEl = document.getElementById('hidden-input');
const restartBtn   = document.getElementById('restart-btn');
const tryAgainBtn  = document.getElementById('try-again-btn');
const modeBtns     = document.querySelectorAll('.mode-btn');
const hintEl       = document.getElementById('hint');
const nameOverlay  = document.getElementById('name-overlay');
const nameInputEl  = document.getElementById('name-input');
const nameSubmitEl = document.getElementById('name-submit');

let gameState = 'idle';

const savedName = localStorage.getItem('kf-name');

if (savedName) {
  nameOverlay.classList.add('hidden');
} else {
  nameInputEl.focus();
}

nameSubmitEl.addEventListener('click', () => {
  const name = nameInputEl.value.trim();
  if (name.length === 0) return;
  localStorage.setItem('kf-name', name);
  nameOverlay.classList.add('hidden');
  hiddenInputEl.focus();
});

nameInputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') nameSubmitEl.click();
});

function initGame() {
  gameState = 'idle';

  const words = pickWords(80);
  resetTyping();
  renderWords(words);
  resetStats();

  hintEl.classList.remove('hidden');

  if (nameOverlay.classList.contains('hidden')) {
    hiddenInputEl.focus();
  }
}

function onFirstKeyPress() {
  if (gameState !== 'idle') return;
  gameState = 'running';
  hintEl.classList.add('hidden');
  startTimer();
}

function resetGame() {
  if (gameState === 'running') {
    stopTimer();
  }
  initGame();
}

restartBtn.addEventListener('click', resetGame);
tryAgainBtn.addEventListener('click', resetGame);

appEl.addEventListener('click', () => {
  if (!nameOverlay.classList.contains('hidden')) return;

  if (gameState !== 'finished') {
    hiddenInputEl.focus();
  }
});

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    timeLimit = parseInt(btn.dataset.time);
    timeLeft  = timeLimit;

    resetGame();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    resetGame();
  }
});

initGame();