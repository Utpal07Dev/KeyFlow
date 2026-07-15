

const wordsInner  = document.getElementById('words-inner');
const wordsArea   = document.getElementById('words-area');
const caretEl     = document.getElementById('caret');
const hiddenInput = document.getElementById('hidden-input');



let charSpans  = [];   // 2D array — charSpans[wordIndex][charIndex] = <span>
let caretPos   = 0;    // which character the caret is currently on (flat index)
let totalKeys  = 0;    // every keypress counted (for accuracy)
let correctKeys = 0;   // only correct keypresses (for WPM + accuracy)
let isTyping   = false; // used to stop caret blink while actively typing
let caretTimer = null;  // timeout to restart blink after user stops





function renderWords(wordArray) {
  
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

    //FIX: Append the space inside the word wrapper so it shares the same baseline
    if (wordIndex < wordArray.length - 1) {
      const spaceEl = document.createElement('span');
      spaceEl.classList.add('char');
      spaceEl.textContent = ' '; 
      wordEl.appendChild(spaceEl);
      wordChars.push(spaceEl); 
    }

    charSpans.push(wordChars);
    wordsInner.appendChild(wordEl);
  });

  // place caret at the very first character
  moveCaret();
}



function allChars() {
  return charSpans.flat();
}


function moveCaret() {
  const all      = allChars();
  const areaRect = wordsArea.getBoundingClientRect();

  let targetLeft, targetTop;

  if (caretPos < all.length) {
    
    const charRect = all[caretPos].getBoundingClientRect();
    targetLeft = charRect.left - areaRect.left;
    targetTop  = charRect.top  - areaRect.top + wordsArea.scrollTop;
  } else {
    
    const lastRect = all[all.length - 1].getBoundingClientRect();
    targetLeft = lastRect.right - areaRect.left;
    targetTop  = lastRect.top   - areaRect.top + wordsArea.scrollTop;
  }

  caretEl.style.left = targetLeft + 'px';
  caretEl.style.top  = targetTop  + 'px';

  scrollWordsIfNeeded(targetTop);
}




function scrollWordsIfNeeded(caretTopPx) {
  const lineHeight = 40; 

  if (caretTopPx > lineHeight + 5) {
    const currentTop = parseInt(wordsInner.style.top || '0');
 
    wordsInner.style.top = (currentTop - lineHeight) + 'px';
    
    
    const currentCaretTop = parseInt(caretEl.style.top || '0');
    caretEl.style.top = (currentCaretTop - lineHeight) + 'px';

  
  }
}


function handleKey(typedChar) {
  const all = allChars();

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

  caretEl.classList.add('typing');
  clearTimeout(caretTimer);
  caretTimer = setTimeout(() => {
    caretEl.classList.remove('typing');
  }, 500);
}



function handleBackspace() {
  if (caretPos <= 0) return;

  caretPos--;
  const all = allChars();
  all[caretPos].classList.remove('correct', 'wrong');

  
  moveCaret();
}

hiddenInput.addEventListener('input', () => {
  const val = hiddenInput.value;
  if (val.length === 0) return;

  const typed = val[val.length - 1]; 

  if (typeof onFirstKeyPress === 'function') {
    onFirstKeyPress();
  }

  handleKey(typed);
  hiddenInput.value = ''; // clear input after every character
});


hiddenInput.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace') {
    handleBackspace();
  }

  if (e.key === 'Tab') {
    e.preventDefault();
    if (typeof resetGame === 'function') {
      resetGame();
    }
  }
});


wordsArea.addEventListener('click', () => {
  hiddenInput.focus();
});



function resetTyping() {
  charSpans   = [];
  caretPos    = 0;
  totalKeys   = 0;
  correctKeys = 0;
  wordsInner.style.top = '0px';
  caretEl.classList.remove('typing');
  clearTimeout(caretTimer);
}