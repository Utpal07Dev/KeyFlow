// typing.js
// Purpose: render words on screen, handle every keypress,
//          move the caret, apply correct/wrong classes

// ============================================================
// 1. GRAB DOM ELEMENTS
// ============================================================

const wordsInner  = document.getElementById('words-inner');
const wordsArea   = document.getElementById('words-area');
const caretEl     = document.getElementById('caret');
const hiddenInput = document.getElementById('hidden-input');

// ============================================================
// 2. STATE VARIABLES
// ============================================================

let charSpans  = [];   // 2D array — charSpans[wordIndex][charIndex] = <span>
let caretPos   = 0;    // which character the caret is currently on (flat index)
let totalKeys  = 0;    // every keypress counted (for accuracy)
let correctKeys = 0;   // only correct keypresses (for WPM + accuracy)
let isTyping   = false; // used to stop caret blink while actively typing
let caretTimer = null;  // timeout to restart blink after user stops

// ============================================================
// 3. RENDER WORDS
// Called by app.js on load and on every reset
// Takes the array from pickWords() and builds spans in the DOM
// ============================================================

// function renderWords(wordArray) {
//   // clear whatever was there before
//   wordsInner.innerHTML = '';
//   charSpans = [];
//   caretPos  = 0;

//   wordArray.forEach((word, wordIndex) => {
//     const wordEl = document.createElement('span');
//     wordEl.classList.add('word');

//     const wordChars = [];

//     // create one span per character
//     word.split('').forEach(letter => {
//       const charEl = document.createElement('span');
//       charEl.classList.add('char');
//       charEl.textContent = letter;
//       wordEl.appendChild(charEl);
//       wordChars.push(charEl);
//     });

//     charSpans.push(wordChars);
//     wordsInner.appendChild(wordEl);

//     // add a space span between words (not after the last word)
//     if (wordIndex < wordArray.length - 1) {
//       const spaceEl = document.createElement('span');
//       spaceEl.classList.add('char');
//       spaceEl.textContent = ' ';
//       wordsInner.appendChild(spaceEl);

//       // spaces go in their own single-item array so flat index works
//       charSpans.push([spaceEl]);
//     }
//   });

//   // place caret at the very first character
//   moveCaret();
// }



function renderWords(wordArray) {
  // clear whatever was there before
  wordsInner.innerHTML = '';
  charSpans = [];
  caretPos  = 0;

  wordArray.forEach((word, wordIndex) => {
    const wordEl = document.createElement('span');
    wordEl.classList.add('word');

    const wordChars = [];

    // create one span per character
    word.split('').forEach(letter => {
      const charEl = document.createElement('span');
      charEl.classList.add('char');
      charEl.textContent = letter;
      wordEl.appendChild(charEl);
      wordChars.push(charEl);
    });

    // FIX: Append the space inside the word wrapper so it shares the same baseline
    if (wordIndex < wordArray.length - 1) {
      const spaceEl = document.createElement('span');
      spaceEl.classList.add('char');
      spaceEl.textContent = ' '; // Notice the space inside the quotes
      wordEl.appendChild(spaceEl);
      wordChars.push(spaceEl); 
    }

    charSpans.push(wordChars);
    wordsInner.appendChild(wordEl);
  });

  // place caret at the very first character
  moveCaret();
}

// ============================================================
// 4. FLAT INDEX HELPER
// charSpans is 2D — this flattens it so caretPos works simply
// ============================================================

function allChars() {
  return charSpans.flat();
}

// ============================================================
// 5. MOVE CARET
// Reads the pixel position of the current character span
// and moves the #caret div there absolutely
// ============================================================

function moveCaret() {
  const all      = allChars();
  const areaRect = wordsArea.getBoundingClientRect();

  let targetLeft, targetTop;

  if (caretPos < all.length) {
    // position caret at the LEFT edge of the current char
    const charRect = all[caretPos].getBoundingClientRect();
    targetLeft = charRect.left - areaRect.left;
    targetTop  = charRect.top  - areaRect.top + wordsArea.scrollTop;
  } else {
    // end of all words — sit at the RIGHT edge of the last char
    const lastRect = all[all.length - 1].getBoundingClientRect();
    targetLeft = lastRect.right - areaRect.left;
    targetTop  = lastRect.top   - areaRect.top + wordsArea.scrollTop;
  }

  caretEl.style.left = targetLeft + 'px';
  caretEl.style.top  = targetTop  + 'px';

  // scroll words up if caret has moved past the first line
  scrollWordsIfNeeded(targetTop);
}

// ============================================================
// 6. SCROLL WORDS UP
// words-area is fixed height (overflow: hidden)
// when caret reaches line 2, we shift words-inner upward
// so only the current + next lines are visible
// ============================================================

// function scrollWordsIfNeeded(caretTopPx) {
//   const lineHeight = 40; // matches font-size 22px * line-height 1.8

//   if (caretTopPx > lineHeight + 5) {
//     const currentTop = parseInt(wordsInner.style.top || '0');
//     wordsInner.style.top = (currentTop - lineHeight) + 'px';
//     // recalculate after shifting
//     moveCaret();
//   }
// }


function scrollWordsIfNeeded(caretTopPx) {
  const lineHeight = 40; 

  if (caretTopPx > lineHeight + 5) {
    const currentTop = parseInt(wordsInner.style.top || '0');
    // Shift inner words up
    wordsInner.style.top = (currentTop - lineHeight) + 'px';
    
    // Instantly shift the caret up so it stays visually attached to the correct line
    const currentCaretTop = parseInt(caretEl.style.top || '0');
    caretEl.style.top = (currentCaretTop - lineHeight) + 'px';

    // Note: Do NOT call moveCaret() here. It causes an infinite loop 
    // because getBoundingClientRect reads the CSS transition mid-animation!
  }
}

// ============================================================
// 7. HANDLE KEYPRESS
// Called from the 'input' event on hidden input
// Compares what was typed to the expected character
// ============================================================

function handleKey(typedChar) {
  const all = allChars();

  // don't go beyond the word list
  if (caretPos >= all.length) return;

  const expectedChar = all[caretPos].textContent;

  totalKeys++;

  if (typedChar === expectedChar) {
    all[caretPos].classList.add('correct');
    correctKeys++;
  } else {
    all[caretPos].classList.add('wrong');
  }

  caretPos++;
  moveCaret();

  // stop caret blink while typing, restart after 500ms of no typing
  caretEl.classList.add('typing');
  clearTimeout(caretTimer);
  caretTimer = setTimeout(() => {
    caretEl.classList.remove('typing');
  }, 500);
}

// ============================================================
// 8. HANDLE BACKSPACE
// Moves caret back one position and removes the class
// so the character goes back to pending (grey)
// ============================================================

function handleBackspace() {
  if (caretPos <= 0) return;

  caretPos--;
  const all = allChars();
  all[caretPos].classList.remove('correct', 'wrong');

  // if we went back a correct key, unccount it
  // (totalKeys stays the same — backspace is still a keypress)
  moveCaret();
}

// ============================================================
// 9. EVENT LISTENERS
// ============================================================

// 'input' fires after the character is already in the input box
hiddenInput.addEventListener('input', () => {
  const val = hiddenInput.value;
  if (val.length === 0) return;

  const typed = val[val.length - 1]; // get the last character typed

  // notify app.js that typing has started (first keypress)
  if (typeof onFirstKeyPress === 'function') {
    onFirstKeyPress();
  }

  handleKey(typed);
  hiddenInput.value = ''; // clear input after every character
});

// keydown handles backspace (input event doesn't fire for backspace)
hiddenInput.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace') {
    handleBackspace();
  }

  // Tab = restart shortcut (same as monkeytype)
  if (e.key === 'Tab') {
    e.preventDefault();
    if (typeof resetGame === 'function') {
      resetGame();
    }
  }
});

// clicking anywhere on the words area refocuses the hidden input
wordsArea.addEventListener('click', () => {
  hiddenInput.focus();
});

// ============================================================
// 10. RESET TYPING STATE
// Called by app.js on every restart
// ============================================================

function resetTyping() {
  charSpans   = [];
  caretPos    = 0;
  totalKeys   = 0;
  correctKeys = 0;
  wordsInner.style.top = '0px';
  caretEl.classList.remove('typing');
  clearTimeout(caretTimer);
}