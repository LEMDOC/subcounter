const apiKey = 'AIzaSyBmEHzx3CpbcFGADpgug2h6_HqTJyWKGok';
const channelId = 'UCZOCU1vjeFrKPtiXn2mcaww';
const subCountElement = document.getElementById("subCount");
const subSound = document.getElementById("subSound");
const enableSoundButton = document.getElementById("enableSound");

let lastSubCount = 0;
let userInteracted = false; // Tracks if the user has interacted

// Sound aktivieren durch Button-Klick
enableSoundButton.addEventListener("click", () => {
  subSound.play().then(() => {
    userInteracted = true;
    enableSoundButton.style.display = "none"; // Button verstecken
  }).catch(error => console.error("Audio play blocked:", error));
});

// Funktion für den Sound-Effekt
function playSound() {
  if (userInteracted) {
    subSound.volume = 1.0;
    subSound.muted = false;
    subSound.play().catch(error => console.error("Audio playback failed:", error));
  }
}

// 🚀 Feuerwerk starten
function startFirework() {
  const canvas = document.getElementById("fireworkCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];

  // Create more particles for a bigger explosion
  for (let i = 0; i < 150; i++) { // More particles for full-screen effect
    particles.push({
      x: Math.random() * canvas.width, // Spawn anywhere on screen
      y: Math.random() * canvas.height, // Spawn anywhere on screen
      size: Math.random() * 6 + 2, // Bigger particles for visibility
      speedX: Math.random() * 6 - 3, // More movement
      speedY: Math.random() * 6 - 3,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
      alpha: 1, // Full opacity
      life: 200 // Longer life for lasting effect
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      let particle = particles[i];

      // Move particles in all directions
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.life -= 1;
      particle.alpha -= 0.004; // Slow fade-out

      // Draw particles
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${particle.alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Remove faded particles
      if (particle.alpha <= 0 || particle.life <= 0) {
        particles.splice(i, 1);
      }
    }

    // Keep animation going while particles exist
    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      // Clear canvas after explosion completes
      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 500);
    }
  }

  animate();
}

// 🚀 YouTube API aufrufen und Abonnentenzahl abrufen
async function fetchSubCount() {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`);
    const data = await response.json();
    const subCount = parseInt(data.items[0].statistics.subscriberCount);

    if (subCount > lastSubCount) {
      playSound(); // Sound abspielen
      startFirework(); // Feuerwerk starten
    }

    lastSubCount = subCount;
    subCountElement.innerText = subCount.toLocaleString();
  } catch (error) {
    console.error("Fehler beim Abrufen der Abonnentenzahl:", error);
  }
}

// Abonnentenzahl alle 5 Sekunden aktualisieren
setInterval(fetchSubCount, 5000);
fetchSubCount();