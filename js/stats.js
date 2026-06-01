// stats.js
// Purpose: countdown timer, live WPM + accuracy,
//          progress bar, personal best, end game

// ============================================================
// 1. GRAB DOM ELEMENTS
// ============================================================

const timerDisplay  = document.getElementById('timer-display');
const wpmDisplay    = document.getElementById('wpm-display');
const accDisplay    = document.getElementById('acc-display');
const progressBar   = document.getElementById('progress-bar');
const typingSection = document.getElementById('typing-section');
const resultsEl     = document.getElementById('results');
const finalWpm      = document.getElementById('final-wpm');
const finalAcc      = document.getElementById('final-acc');
const finalCorrect  = document.getElementById('final-correct');

// ============================================================
// 2. STATE VARIABLES
// ============================================================

let timerInterval = null;  // holds the setInterval reference
let timeLeft      = 15;    // counts down to 0
let timeLimit     = 15;    // the chosen mode (15 / 30 / 60)
let startTime     = null;  // Date.now() when typing started

// ============================================================
// 3. START TIMER
// Called by app.js the moment the user presses their first key
// ============================================================

function startTimer() {
  startTime = Date.now();

  timerInterval = setInterval(() => {
    timeLeft--;

    // update the timer display
    timerDisplay.textContent = timeLeft;

    // turn timer red when 5 seconds or less remain
    if (timeLeft <= 5) {
      timerDisplay.classList.add('low');
    }

    // update progress bar width
    const elapsed  = timeLimit - timeLeft;
    const percent  = (elapsed / timeLimit) * 100;
    progressBar.style.width = percent + '%';

    // update live WPM and accuracy every tick
    updateLiveStats();

    // time is up — end the game
    if (timeLeft <= 0) {
      endGame();
    }

  }, 1000); // runs every 1000ms = 1 second
}

// ============================================================
// 4. STOP TIMER
// Called on reset so the old interval doesn't keep running
// ============================================================

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// ============================================================
// 5. UPDATE LIVE STATS
// Runs every second while the timer is going
// Updates the WPM and accuracy displays
// ============================================================

function updateLiveStats() {
  if (!startTime) return;

  const minutesElapsed = (Date.now() - startTime) / 1000 / 60;

  // WPM formula: (correct characters / 5) / minutes elapsed
  // divide by 5 because average word length is ~5 characters
  const wpm = minutesElapsed > 0
    ? Math.round(correctKeys / 5 / minutesElapsed)
    : 0;

  // accuracy formula: (correct keypresses / total keypresses) * 100
  const acc = totalKeys > 0
    ? Math.round((correctKeys / totalKeys) * 100)
    : 100;

  wpmDisplay.textContent = wpm;
  accDisplay.textContent = acc + '%';
}

// ============================================================
// 6. END GAME
// Stops the timer, calculates final stats,
// checks personal best, shows results screen
// ============================================================

function endGame() {
  stopTimer();

  // final calculations
  const minutesElapsed = (Date.now() - startTime) / 1000 / 60;

  const wpm = minutesElapsed > 0
    ? Math.round(correctKeys / 5 / minutesElapsed)
    : 0;

  const acc = totalKeys > 0
    ? Math.round((correctKeys / totalKeys) * 100)
    : 100;

  const correct = allChars().filter(c => c.classList.contains('correct')).length;

  // fill in results screen
  finalWpm.textContent     = wpm;
  finalAcc.textContent     = acc + '%';
  finalCorrect.textContent = correct;

  // personal best check
  checkPersonalBest(wpm);

  // swap typing section out, results screen in
  typingSection.style.display = 'none';
  resultsEl.style.display     = 'flex';
}

// ============================================================
// 7. PERSONAL BEST
// Reads and writes to localStorage
// Adds a .best class to the WPM result if it's a new record
// ============================================================

function checkPersonalBest(wpm) {
  const key         = 'kf-best-' + timeLimit; // separate PB per mode
  const storedBest  = parseInt(localStorage.getItem(key)) || 0;

  if (wpm > storedBest) {
    localStorage.setItem(key, wpm);
    finalWpm.classList.add('best'); // CSS shows "pb" badge next to number
  } else {
    finalWpm.classList.remove('best');
  }
}

// ============================================================
// 8. RESET STATS
// Called by app.js on every restart
// ============================================================

function resetStats() {
  stopTimer();

  timeLeft  = timeLimit;
  startTime = null;

  timerDisplay.textContent = timeLimit;
  timerDisplay.classList.remove('low');

  wpmDisplay.textContent = '0';
  accDisplay.textContent = '100%';
  progressBar.style.width = '0%';

  typingSection.style.display = 'flex';
  resultsEl.style.display     = 'none';
}