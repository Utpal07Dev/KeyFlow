// app.js
// Purpose: initialise everything, wire all buttons,
//          manage game state, glue all other files together

// ============================================================
// 1. GRAB DOM ELEMENTS
// ============================================================

const appEl        = document.getElementById('app');
const hiddenInputEl = document.getElementById('hidden-input');
const restartBtn   = document.getElementById('restart-btn');
const tryAgainBtn  = document.getElementById('try-again-btn');
const modeBtns     = document.querySelectorAll('.mode-btn');
const hintEl       = document.getElementById('hint');
const nameOverlay  = document.getElementById('name-overlay');
const nameInputEl  = document.getElementById('name-input');
const nameSubmitEl = document.getElementById('name-submit');

// ============================================================
// 2. GAME STATE
// 'idle'    = page loaded, user hasn't typed yet
// 'running' = timer is going
// 'finished'= timer hit 0, results showing
// ============================================================

let gameState = 'idle';

// ============================================================
// 3. NAME OVERLAY
// Show on first visit, hide once name is submitted
// ============================================================

const savedName = localStorage.getItem('kf-name');

if (savedName) {
  // returning user — skip the overlay
  nameOverlay.classList.add('hidden');
} else {
  // first visit — show overlay, focus the name input
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

// ============================================================
// 4. INITIALISE GAME
// Picks words, renders them, resets all state
// Called once on page load and on every restart
// ============================================================

// function initGame() {
//   gameState = 'idle';

//   // pick 80 random words and render them
//   const words = pickWords(80);
//   resetTyping();         // clears charSpans, caretPos, totalKeys, correctKeys
//   renderWords(words);    // builds spans in the DOM
//   resetStats();          // resets timer display, progress bar, WPM, acc

//   hintEl.classList.remove('hidden');
//   hiddenInputEl.focus();
// }
function initGame() {
  gameState = 'idle';

  const words = pickWords(80);
  resetTyping();         
  renderWords(words);    
  resetStats();          

  hintEl.classList.remove('hidden');
  
  // FIX: Only focus the hidden input if the name overlay is actually hidden
  if (nameOverlay.classList.contains('hidden')) {
    hiddenInputEl.focus();
  }
}
// ============================================================
// 5. ON FIRST KEYPRESS
// typing.js calls this function the moment the user
// types their first character — this is where the timer starts
// ============================================================

function onFirstKeyPress() {
  if (gameState !== 'idle') return; // only trigger once
  gameState = 'running';
  hintEl.classList.add('hidden');
  startTimer();  // defined in stats.js
}

// ============================================================
// 6. RESET GAME
// Wired to restart button, try again button, and Tab key
// typing.js calls this when Tab is pressed
// ============================================================

function resetGame() {
  if (gameState === 'running') {
    stopTimer(); // stop any running timer immediately
  }
  initGame();
}

// ============================================================
// 7. BUTTON LISTENERS
// ============================================================

restartBtn.addEventListener('click', resetGame);
tryAgainBtn.addEventListener('click', resetGame);

// clicking anywhere on the app keeps focus on hidden input
// appEl.addEventListener('click', () => {
//   if (gameState !== 'finished') {
//     hiddenInputEl.focus();
//   }
// });

appEl.addEventListener('click', () => {
  // FIX: Don't steal focus if the user is interacting with the name overlay
  if (!nameOverlay.classList.contains('hidden')) return;

  if (gameState !== 'finished') {
    hiddenInputEl.focus();
  }
});

// ============================================================
// 8. MODE BUTTONS (15s / 30s / 60s)
// ============================================================

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // update active class
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // update timeLimit in stats.js (shared global)
    timeLimit = parseInt(btn.dataset.time);
    timeLeft  = timeLimit;

    resetGame();
  });
});

// ============================================================
// 9. KEYBOARD SHORTCUT — Tab to restart
// (also handled inside typing.js for when input is focused,
//  this handles it when input is not focused)
// ============================================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    resetGame();
  }
});

// ============================================================
// 10. START
// Run initGame once everything is ready
// ============================================================

initGame();