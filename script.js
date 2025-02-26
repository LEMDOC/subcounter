const apiKey = 'AIzaSyBmEHzx3CpbcFGADpgug2h6_HqTJyWKGok';
const channelId = 'UCZOCU1vjeFrKPtiXn2mcaww';
const subCountElement = document.getElementById("subCount");
const subSound = document.getElementById("subSound");
const enableSoundButton = document.getElementById("enableSound");

let lastSubCount = 0;
let userInteracted = false; // Tracks if the user has interacted

// Enable sound on user click
enableSoundButton.addEventListener("click", () => {
  subSound.play().then(() => {
    userInteracted = true;
    enableSoundButton.style.display = "none"; // Hide button after activation
  }).catch(error => console.error("Audio play blocked:", error));
});

// Function to play sound only if allowed
function playSound() {
  if (userInteracted) { // Ensure user interaction first
    subSound.volume = 1.0;
    subSound.muted = false;
    subSound.play().catch(error => console.error("Audio playback failed:", error));
  }
}

// Fetch subscriber count from YouTube API
async function fetchSubCount() {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`);
    const data = await response.json();
    const subCount = parseInt(data.items[0].statistics.subscriberCount);

    if (subCount > lastSubCount) {
      playSound(); // Play sound if subscriber count increases
    }

    lastSubCount = subCount;
    subCountElement.innerText = subCount.toLocaleString();
  } catch (error) {
    console.error("Fehler beim Abrufen der Abonnentenzahl:", error);
  }
}

// Update sub count every 5 seconds
setInterval(fetchSubCount, 5000);
fetchSubCount();