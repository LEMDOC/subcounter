const apiKey = 'AIzaSyBmEHzx3CpbcFGADpgug2h6_HqTJyWKGok';
const channelId = 'UCZOCU1vjeFrKPtiXn2mcaww';
const subCountElement = document.getElementById("subCount");
const subSound = document.getElementById("subSound");

let lastSubCount = 0;

async function fetchSubCount() {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`);
    const data = await response.json();
    const subCount = parseInt(data.items[0].statistics.subscriberCount);

    // Wenn sich die Zahl erhöht hat, spiele den Ton
    if (subCount > lastSubCount) {
      subSound.play();
    }

    lastSubCount = subCount;
    subCountElement.innerText = subCount.toLocaleString();
  } catch (error) {
    console.error("Fehler beim Abrufen der Abonnentenzahl:", error);
  }
}

// Aktualisiere die Zahl alle 5 Sekunden
setInterval(fetchSubCount, 5000);
fetchSubCount();