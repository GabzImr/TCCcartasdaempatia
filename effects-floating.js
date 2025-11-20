function startFloatingEffects() {
  const container = document.createElement('div');
  container.id = 'floating-effects';
  Object.assign(container.style, {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 60,
    overflow: 'hidden'
  });
  document.body.appendChild(container);

  let effectInterval;

 
  function createFloating() {
    const el = document.createElement('div');
    el.className = 'floating';

    const type = Math.floor(Math.random() * 4);
    switch (type) {
      case 0: el.classList.add('light'); break;
      case 1: el.classList.add('paper'); break;
      case 2: el.classList.add('spark'); break;
      case 3: el.classList.add('symbol'); el.textContent = ['✦','▢','≋','✧'][Math.floor(Math.random()*4)]; break;
    }

    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '100vh';
    el.style.setProperty('--tx', (Math.random() * 100 - 50) + 'px');
    el.style.setProperty('--dur', (4 + Math.random() * 4) + 's');

    container.appendChild(el);
    setTimeout(() => el.remove(), 8000);
  }

  function checkMenuVisibility() {
    const layout = document.querySelector('.layout');
    const menuVisible = layout && layout.style.display !== 'none';

    if (menuVisible && !effectInterval) {
      effectInterval = setInterval(createFloating, 600);
    } else if (!menuVisible && effectInterval) {
      clearInterval(effectInterval);
      effectInterval = null;
      container.innerHTML = ''; 
    }
  }

  
  setInterval(checkMenuVisibility, 500);
}

window.addEventListener('DOMContentLoaded', startFloatingEffects);
