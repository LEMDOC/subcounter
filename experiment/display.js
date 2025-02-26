const urlParams = new URLSearchParams(window.location.search);
const channelId = urlParams.get("channel");
const enableSound = urlParams.get("sound") === "true";
const enableFireworks = urlParams.get("fireworks") === "true";
const enableFade = urlParams.get("fade") === "true";

const subCountElement = document.getElementById("subCount");

let lastSubCount = "0";

async function fetchSubCount() {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=AIzaSyBmEHzx3CpbcFGADpgug2h6_HqTJyWKGok`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();
    if (!data.items || data.items.length === 0) throw new Error("Invalid channel ID");

    const newSubCount = data.items[0].statistics.subscriberCount.toString();
    const oldSubCount = lastSubCount.padStart(newSubCount.length, "0");

    subCountElement.innerHTML = "";
    for (let i = 0; i < newSubCount.length; i++) {
      const digitSpan = document.createElement("span");
      digitSpan.innerText = newSubCount[i];

      if (enableFade && oldSubCount[i] !== newSubCount[i]) {
        digitSpan.style.transition = "opacity 1s ease-in-out";
        digitSpan.style.opacity = "0";
        setTimeout(() => digitSpan.style.opacity = "1", 50);
      }

      subCountElement.appendChild(digitSpan);
    }

    if (parseInt(newSubCount) > parseInt(lastSubCount)) {
      if (enableSound) playSound();
      if (enableFireworks) startFirework();
    }

    lastSubCount = newSubCount;
  } catch (error) {
    console.error("Error fetching subscriber count:", error);
    subCountElement.innerText = "Error loading";
  }
}

setInterval(fetchSubCount, 5000);
fetchSubCount();