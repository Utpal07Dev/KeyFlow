

const themeDots = document.querySelectorAll('.theme-dot');



function applyTheme(themeName) {
  
  document.body.setAttribute('data-theme', themeName);


  themeDots.forEach(dot => {
    if (dot.dataset.theme === themeName) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}





themeDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const chosen = dot.dataset.theme;
    applyTheme(chosen);
    localStorage.setItem('kf-theme', chosen);
  });
});


const savedTheme = localStorage.getItem('kf-theme') || 'terminal';
applyTheme(savedTheme);