const subSound = document.getElementById("subSound");
const fireworkCanvas = document.getElementById("fireworkCanvas");

function playSound() {
  subSound.volume = 1.0;
  subSound.muted = false;
  subSound.play().catch(error => console.error("Audio playback failed:", error));
}

function startFirework() {
  const ctx = fireworkCanvas.getContext("2d");
  fireworkCanvas.width = window.innerWidth;
  fireworkCanvas.height = window.innerHeight;

  const particles = [];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * fireworkCanvas.width,
      y: Math.random() * fireworkCanvas.height,
      size: Math.random() * 6 + 2,
      speedX: Math.random() * 6 - 3,
      speedY: Math.random() * 6 - 3,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
      alpha: 1,
      life: 200
    });
  }

  function animate() {
    ctx.clearRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha -= 0.004;
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (particles.length > 0) requestAnimationFrame(animate);
  }

  animate();
}