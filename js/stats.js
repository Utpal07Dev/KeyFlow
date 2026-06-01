const timerDisplay  = document.getElementById('timer-display');
const wpmDisplay    = document.getElementById('wpm-display');
const accDisplay    = document.getElementById('acc-display');
const progressBar   = document.getElementById('progress-bar');
const typingSection = document.getElementById('typing-section');
const resultsEl     = document.getElementById('results');
const finalWpm      = document.getElementById('final-wpm');
const finalAcc      = document.getElementById('final-acc');
const finalCorrect  = document.getElementById('final-correct');

let timerInterval = null;
let timeLeft      = 15;
let timeLimit     = 15;
let startTime     = null;

function startTimer() {
  startTime = Date.now();

  timerInterval = setInterval(() => {
    timeLeft--;

    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 5) {
      timerDisplay.classList.add('low');
    }

    const elapsed  = timeLimit - timeLeft;
    const percent  = (elapsed / timeLimit) * 100;
    progressBar.style.width = percent + '%';

    updateLiveStats();

    if (timeLeft <= 0) {
      endGame();
    }

  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function updateLiveStats() {
  if (!startTime) return;

  const minutesElapsed = (Date.now() - startTime) / 1000 / 60;

  const wpm = minutesElapsed > 0
    ? Math.round(correctKeys / 5 / minutesElapsed)
    : 0;

  const acc = totalKeys > 0
    ? Math.round((correctKeys / totalKeys) * 100)
    : 100;

  wpmDisplay.textContent = wpm;
  accDisplay.textContent = acc + '%';
}

function endGame() {
  stopTimer();

  const minutesElapsed = (Date.now() - startTime) / 1000 / 60;

  const wpm = minutesElapsed > 0
    ? Math.round(correctKeys / 5 / minutesElapsed)
    : 0;

  const acc = totalKeys > 0
    ? Math.round((correctKeys / totalKeys) * 100)
    : 100;

  const correct = allChars().filter(c => c.classList.contains('correct')).length;

  finalWpm.textContent     = wpm;
  finalAcc.textContent     = acc + '%';
  finalCorrect.textContent = correct;

  checkPersonalBest(wpm);

  typingSection.style.display = 'none';
  resultsEl.style.display     = 'flex';
}

function checkPersonalBest(wpm) {
  const key         = 'kf-best-' + timeLimit;
  const storedBest  = parseInt(localStorage.getItem(key)) || 0;

  if (wpm > storedBest) {
    localStorage.setItem(key, wpm);
    finalWpm.classList.add('best');
  } else {
    finalWpm.classList.remove('best');
  }
}

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