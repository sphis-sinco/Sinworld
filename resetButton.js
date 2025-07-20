// resetButton.js
import { renderFromSeed } from "./rendering.js";

const seedInput = document.getElementById("seedRange");
const seedDisplay = document.getElementById("seedValue");
const resetBtn = document.getElementById("resetBtn");
const loadBtn = document.getElementById("loadBtn");

function updateSeedValueDisplay() {
        seedDisplay.textContent = seedInput.value;
}

// Initial render
renderFromSeed(parseInt(seedInput.value));
updateSeedValueDisplay();

seedInput.addEventListener("input", () => {
        updateSeedValueDisplay();
});

resetBtn.addEventListener("click", () => {
        seedInput.value = 50;
        updateSeedValueDisplay();
        renderFromSeed(parseInt(seedInput.value));
});

loadBtn.addEventListener("click", () => {
        renderFromSeed(parseInt(seedInput.value));
});
