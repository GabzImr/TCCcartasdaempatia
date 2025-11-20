
function startVisualEffects() {
  const layout = document.querySelector('.layout');
  if (!layout) return;

  function flashGlitch() {
    if (layout.style.display === 'none') return;

    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.inset = '0';
    flash.style.zIndex = '50';
    flash.style.pointerEvents = 'none';
    flash.style.background = `radial-gradient(
      circle at ${rand(0,100)}% ${rand(0,100)}%,
      rgba(${rand(100,255)},${rand(0,255)},${rand(150,255)},0.5) 0%,
      rgba(${rand(0,255)},${rand(0,255)},${rand(255,255)},0.3) 60%,
      rgba(0,0,0,0.2) 100%
    )`;
    flash.style.backdropFilter = 'blur(2px) saturate(2)';
    flash.style.transition = 'opacity 0.25s ease'; 
    flash.style.opacity = '1';
    document.body.appendChild(flash);

    const original = layout.style.backgroundImage;
    layout.style.transition = 'filter 0.3s ease';
    layout.style.filter = "brightness(1.7) contrast(1.5) saturate(2)";
    layout.style.backgroundImage = "url('cenario2.png')";

    setTimeout(() => {
      flash.style.opacity = '0';
      layout.style.backgroundImage = original;
      layout.style.filter = "brightness(1.15) contrast(1.1) saturate(1.3)";
      setTimeout(() => flash.remove(), 300);
    }, 250);
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  setInterval(flashGlitch, 3000 + Math.random() * 2000);
}

window.addEventListener('DOMContentLoaded', startVisualEffects);
