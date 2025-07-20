// resetButton.js
import { renderFromSeed } from './rendering.js';

const seedInput = document.getElementById("seedRange");
const seedDisplay = document.getElementById("seedValue");
const resetBtn = document.getElementById("resetBtn");

function updateSeedValueDisplay() {
  seedDisplay.textContent = seedInput.value;
}

// Initial render
renderFromSeed(parseInt(seedInput.value));
updateSeedValueDisplay();

// Re-render when slider changes
seedInput.addEventListener("input", () => {
  updateSeedValueDisplay();
  renderFromSeed(parseInt(seedInput.value));
});

// Reset button triggers re-render using current seed
resetBtn.addEventListener("click", () => {
  renderFromSeed(parseInt(seedInput.value));
});
