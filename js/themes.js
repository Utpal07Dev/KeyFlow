// themes.js
// Purpose: theme switching via dots, persists choice to localStorage


// 1. GRAB ELEMENTS

const themeDots = document.querySelectorAll('.theme-dot');

// 2. APPLY A THEME
// Sets data-theme on <body> and updates the active dot

function applyTheme(themeName) {
  // swap the attribute on body — CSS variables update instantly
  document.body.setAttribute('data-theme', themeName);

  // update which dot looks active
  themeDots.forEach(dot => {
    if (dot.dataset.theme === themeName) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}


// 3. DOT CLICK LISTENERS


themeDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const chosen = dot.dataset.theme;
    applyTheme(chosen);
    localStorage.setItem('kf-theme', chosen);
  });
});


// 4. RESTORE SAVED THEME ON LOAD
// Runs immediately when the file loads —
// applies saved theme before the user sees anything


const savedTheme = localStorage.getItem('kf-theme') || 'terminal';
applyTheme(savedTheme);