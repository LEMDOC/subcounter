const apiKey = 'AIzaSyBmEHzx3CpbcFGADpgug2h6_HqTJyWKGok';
const channelId = 'UCZOCU1vjeFrKPtiXn2mcaww';
const subCountElement = document.getElementById("subCount");
const subSound = document.getElementById("subSound");
const enableSoundButton = document.getElementById("enableSound");

let lastSubCount = "0"; // Store as string to compare digits
let userInteracted = false;

// Sound activation on button click
enableSoundButton.addEventListener("click", () => {
  subSound.play().then(() => {
    userInteracted = true;
    enableSoundButton.style.display = "none";
  }).catch(error => console.error("Audio play blocked:", error));
});

// Function to play sound
function playSound() {
  if (userInteracted) {
    subSound.volume = 1.0;
    subSound.muted = false;
    subSound.play().catch(error => console.error("Audio playback failed:", error));
  }
}

// 🚀 Firework animation (unchanged)
function startFirework() {
  const canvas = document.getElementById("fireworkCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 6 + 2,
      speedX: Math.random() * 6 - 3,
      speedY: Math.random() * 6 - 3,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
      alpha: 1,
      life: 200
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      let particle = particles[i];

      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.life -= 1;
      particle.alpha -= 0.004;

      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${particle.alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      if (particle.alpha <= 0 || particle.life <= 0) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 500);
    }
  }

  animate();
}

// 🚀 Fetch YouTube Subscriber Count
async function fetchSubCount() {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`);
    const data = await response.json();
    const newSubCount = data.items[0].statistics.subscriberCount.toString(); // Convert to string
    const oldSubCount = lastSubCount.padStart(newSubCount.length, "0"); // Ensure length matches

    // Create new subCount display with fading effect
    subCountElement.innerHTML = ""; // Clear previous content

    for (let i = 0; i < newSubCount.length; i++) {
      const digitSpan = document.createElement("span");
      digitSpan.innerText = newSubCount[i];

      if (oldSubCount[i] !== newSubCount[i]) {
        digitSpan.style.transition = "opacity 1s ease-in-out";
        digitSpan.style.opacity = "0";
        setTimeout(() => digitSpan.style.opacity = "1", 50);
      }

      subCountElement.appendChild(digitSpan);
    }

    if (parseInt(newSubCount) > parseInt(lastSubCount)) {
      playSound();
      startFirework();
    }

    lastSubCount = newSubCount;
  } catch (error) {
    console.error("Fehler beim Abrufen der Abonnentenzahl:", error);
  }
}

// Refresh every 5 seconds
setInterval(fetchSubCount, 5000);
fetchSubCount();